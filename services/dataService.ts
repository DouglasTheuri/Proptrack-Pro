
import { Owner, Building, Unit, Tenant, RentPayment, Expense, MonthlyReport } from '../types';
import { mockOwners, mockBuildings, mockUnits, mockTenants } from './mockData';

class DataService {
  private owners: Owner[] = [];
  private buildings: Building[] = [];
  private units: Unit[] = [];
  private tenants: Tenant[] = [];
  private payments: RentPayment[] = [];
  private expenses: Expense[] = [];
  private reports: MonthlyReport[] = [];
  private isSyncing = false;
  private lastSyncTime: Date | null = null;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const data = localStorage.getItem('propTrackData');
    if (data) {
      const parsed = JSON.parse(data);
      this.owners = parsed.owners || [];
      this.buildings = parsed.buildings || [];
      this.units = parsed.units || [];
      this.tenants = parsed.tenants || [];
      this.payments = parsed.payments || [];
      this.expenses = parsed.expenses || [];
      this.reports = parsed.reports || [];
    } else {
      this.owners = mockOwners;
      this.buildings = mockBuildings;
      this.units = mockUnits;
      this.tenants = mockTenants;
      this.save();
    }
  }

  /**
   * Conceptual Sync with Google Apps Script.
   * In a real GAS environment, this would call google.script.run.
   * We simulate the 'User's Account' target by including user context.
   */
  private async syncToCloud() {
    this.isSyncing = true;
    const user = JSON.parse(localStorage.getItem('propTrackUser') || '{}');
    console.log(`PropTrack: Syncing database to Google Spreadsheet for account: ${user.email || 'Guest'}`);
    
    // Simulate google.script.run.saveToUserSpreadsheet(data)
    await new Promise(resolve => setTimeout(resolve, 800));
    
    this.isSyncing = false;
    this.lastSyncTime = new Date();
  }

  private save() {
    const data = {
      owners: this.owners,
      buildings: this.buildings,
      units: this.units,
      tenants: this.tenants,
      payments: this.payments,
      expenses: this.expenses,
      reports: this.reports
    };
    localStorage.setItem('propTrackData', JSON.stringify(data));
    this.syncToCloud();
  }

  // Owners
  getOwners() { return this.owners; }
  addOwner(owner: Omit<Owner, 'id'>) {
    const newOwner = { ...owner, id: 'o' + Date.now() };
    this.owners.push(newOwner);
    this.save();
    return newOwner;
  }
  deleteOwner(id: string) {
    const hasBuildings = this.buildings.some(b => b.ownerId === id);
    if (hasBuildings) throw new Error("Cannot delete owner with active buildings.");
    this.owners = this.owners.filter(o => o.id !== id);
    this.save();
  }

  // Buildings
  getBuildings() { return this.buildings; }
  addBuilding(building: Omit<Building, 'id'>) {
    const newBuilding = { ...building, id: 'b' + Date.now() };
    this.buildings.push(newBuilding);
    this.save();
    return newBuilding;
  }
  deleteBuilding(id: string) {
    const buildingUnits = this.units.filter(u => u.buildingId === id);
    const unitIds = buildingUnits.map(u => u.id);
    const hasTenants = this.tenants.some(t => unitIds.includes(t.unitId));
    if (hasTenants) throw new Error("Cannot delete building with active tenants.");
    this.buildings = this.buildings.filter(b => b.id !== id);
    this.units = this.units.filter(u => u.buildingId !== id);
    this.expenses = this.expenses.filter(e => e.buildingId !== id);
    this.reports = this.reports.filter(r => r.buildingId !== id);
    this.save();
  }

  // Units
  getUnits(buildingId?: string) {
    return buildingId ? this.units.filter(u => u.buildingId === buildingId) : this.units;
  }
  addUnit(unit: Omit<Unit, 'id'>) {
    const newUnit = { ...unit, id: 'u' + Date.now() };
    this.units.push(newUnit);
    this.save();
    return newUnit;
  }
  updateUnitStatus(unitId: string, status: Unit['status']) {
    const unit = this.units.find(u => u.id === unitId);
    if (unit) {
      unit.status = status;
      this.save();
    }
  }

  // Tenants
  getTenants() { return this.tenants; }
  addTenant(tenant: Omit<Tenant, 'id'>) {
    const newTenant = { ...tenant, id: 't' + Date.now() };
    this.tenants.push(newTenant);
    this.updateUnitStatus(tenant.unitId, 'Occupied');
    this.save();
    return newTenant;
  }
  deleteTenant(id: string) {
    const tenant = this.tenants.find(t => t.id === id);
    if (tenant) {
      this.updateUnitStatus(tenant.unitId, 'Vacant');
      this.tenants = this.tenants.filter(t => t.id !== id);
      this.save();
    }
  }

  // Financials
  getPayments() { return this.payments; }
  addPayment(payment: Omit<RentPayment, 'id'>) {
    const newPayment = { ...payment, id: 'p' + Date.now() };
    this.payments.push(newPayment);
    this.save();
    return newPayment;
  }

  getExpenses(buildingId?: string) {
    return buildingId ? this.expenses.filter(e => e.buildingId === buildingId) : this.expenses;
  }
  addExpense(expense: Omit<Expense, 'id'>) {
    const newExpense = { ...expense, id: 'e' + Date.now() };
    this.expenses.push(newExpense);
    this.save();
    return newExpense;
  }

  // Reports
  generateMonthlyReport(buildingId: string, month: string) {
    const building = this.buildings.find(b => b.id === buildingId);
    if (!building) return null;
    const units = this.units.filter(u => u.buildingId === buildingId);
    const unitIds = units.map(u => u.id);
    const tenantIds = this.tenants.filter(t => unitIds.includes(t.unitId)).map(t => t.id);
    const totalRent = this.payments
      .filter(p => tenantIds.includes(p.tenantId) && p.month === month)
      .reduce((sum, p) => sum + p.amount, 0);
    const totalExpenses = this.expenses
      .filter(e => e.buildingId === buildingId && e.month === month)
      .reduce((sum, e) => sum + e.amount, 0);
    const managementFee = totalRent * (building.managementFeePercent / 100);
    const netPayout = totalRent - managementFee - totalExpenses;
    const report: MonthlyReport = {
      id: 'r' + Date.now(),
      buildingId,
      month,
      totalRentCollected: totalRent,
      managementFee,
      totalExpenses,
      netPayout,
      generatedDate: new Date().toISOString()
    };
    this.reports = this.reports.filter(r => !(r.buildingId === buildingId && r.month === month));
    this.reports.push(report);
    this.save();
    return report;
  }

  getReports() { return this.reports; }
  getSyncStatus() { return this.isSyncing; }
  getLastSyncTime() { return this.lastSyncTime; }

  /**
   * Simulates opening the actual Google Sheet from the user's account.
   */
  openSpreadsheet() {
    const user = JSON.parse(localStorage.getItem('propTrackUser') || '{}');
    alert(`Redirecting to Google Spreadsheet for ${user.email}...\nIn a production GAS app, this opens the connected User Spreadsheet.`);
    window.open('https://docs.google.com/spreadsheets/', '_blank');
  }
}

export const dataService = new DataService();
