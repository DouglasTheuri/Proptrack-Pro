
import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { Tenant, Unit, Building } from '../types';
import { Icons } from '../constants';

const TenantsManager: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [showAddTenant, setShowAddTenant] = useState(false);

  const refreshData = () => {
    setTenants(dataService.getTenants());
    setUnits(dataService.getUnits());
    setBuildings(dataService.getBuildings());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleAddTenant = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const rentAmount = Number(formData.get('rentAmount'));
    
    const newTenant = dataService.addTenant({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      unitId: formData.get('unitId') as string,
      moveInDate: formData.get('moveInDate') as string,
      rentAmount: rentAmount,
      deposit: Number(formData.get('deposit')) || rentAmount,
    });

    refreshData();
    setShowAddTenant(false);
  };

  const handleDeleteTenant = (id: string) => {
    if (window.confirm("Are you sure you want to remove this tenant? The unit will be marked as vacant.")) {
      dataService.deleteTenant(id);
      refreshData();
    }
  };

  const getUnitInfo = (unitId: string) => {
    const unit = units.find(u => u.id === unitId);
    const building = buildings.find(b => b.id === unit?.buildingId);
    return unit ? `${building?.name} - Unit ${unit.unitNumber}` : 'N/A';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-slate-800">Tenant Directory</h3>
        <button 
          onClick={() => setShowAddTenant(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <Icons.Plus /> Register New Tenant
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Tenant</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Unit Assignment</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Lease Details</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Contact</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tenants.map(t => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800">{t.name}</div>
                  <div className="text-xs text-slate-500">Member since {t.moveInDate}</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {getUnitInfo(t.unitId)}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <div>${t.rentAmount}/mo</div>
                  <div className="text-[10px] text-slate-400">Deposit: ${t.deposit}</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <div>{t.phone}</div>
                  <div className="text-xs opacity-70">{t.email}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors" title="Edit Tenant"><Icons.Edit /></button>
                    <button 
                      onClick={() => handleDeleteTenant(t.id)} 
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete Tenant"
                    >
                      <Icons.Trash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {tenants.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">No tenants registered yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddTenant && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Register Tenant</h3>
            <form onSubmit={handleAddTenant} className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
                <input required name="name" type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                <input required name="email" type="email" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Phone</label>
                <input required name="phone" type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-600 mb-1">Assign Unit</label>
                <select required name="unitId" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
                  {units.filter(u => u.status !== 'Occupied').map(u => (
                    <option key={u.id} value={u.id}>
                      {buildings.find(b => b.id === u.buildingId)?.name} - Unit {u.unitNumber} (${u.monthlyRent})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Rent Amount ($)</label>
                <input required name="rentAmount" type="number" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Move-in Date</label>
                <input required name="moveInDate" type="date" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="col-span-2 flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddTenant(false)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Register</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantsManager;
