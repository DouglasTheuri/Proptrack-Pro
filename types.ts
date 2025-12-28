
export type UnitType = 'Single Room' | 'Double Room' | 'Bedsitter' | '1 Bedroom' | '2 Bedrooms' | '3 Bedrooms' | 'Gated';
export type OccupancyStatus = 'Occupied' | 'Vacant' | 'Maintenance';
export type PaymentStatus = 'Paid' | 'Pending' | 'Partial' | 'Overdue';

export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
  paymentInfo: string;
}

export interface Building {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  managementFeePercent: number; // default 10%
}

export interface Unit {
  id: string;
  buildingId: string;
  unitNumber: string;
  unitType: UnitType;
  monthlyRent: number;
  status: OccupancyStatus;
}

export interface Tenant {
  id: string;
  unitId: string;
  name: string;
  phone: string;
  email: string;
  moveInDate: string;
  rentAmount: number;
  deposit: number;
}

export interface RentPayment {
  id: string;
  tenantId: string;
  amount: number;
  date: string;
  status: PaymentStatus;
  month: string; // e.g., "2023-10"
}

export interface Expense {
  id: string;
  buildingId: string;
  type: 'Electricity' | 'Water' | 'Repairs' | 'Other';
  amount: number;
  date: string;
  description: string;
  month: string;
}

export interface MonthlyReport {
  id: string;
  buildingId: string;
  month: string;
  totalRentCollected: number;
  managementFee: number;
  totalExpenses: number;
  netPayout: number;
  generatedDate: string;
}
