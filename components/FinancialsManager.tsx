
import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { RentPayment, Expense, Building, Tenant } from '../types';
import { Icons, EXPENSE_TYPES } from '../constants';

const FinancialsManager: React.FC = () => {
  const [payments, setPayments] = useState<RentPayment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [activeTab, setActiveTab] = useState<'payments' | 'expenses'>('payments');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    setPayments(dataService.getPayments());
    setExpenses(dataService.getExpenses());
    setBuildings(dataService.getBuildings());
    setTenants(dataService.getTenants());
  }, []);

  const handleAddPayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const date = formData.get('date') as string;
    const newPayment = dataService.addPayment({
      tenantId: formData.get('tenantId') as string,
      amount: Number(formData.get('amount')),
      date: date,
      month: date.slice(0, 7),
      status: 'Paid'
    });
    setPayments([newPayment, ...payments]);
    setShowAddForm(false);
  };

  const handleAddExpense = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const date = formData.get('date') as string;
    const newExpense = dataService.addExpense({
      buildingId: formData.get('buildingId') as string,
      type: formData.get('type') as Expense['type'],
      amount: Number(formData.get('amount')),
      date: date,
      month: date.slice(0, 7),
      description: formData.get('description') as string
    });
    setExpenses([newExpense, ...expenses]);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex bg-slate-200 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'payments' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Rent Payments
          </button>
          <button 
            onClick={() => setActiveTab('expenses')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'expenses' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Expenses & Repairs
          </button>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <Icons.Plus /> {activeTab === 'payments' ? 'Record Payment' : 'Log Expense'}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {activeTab === 'payments' ? (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Tenant</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Amount</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Month</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map(p => (
                <tr key={p.id}>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {tenants.find(t => t.id === p.tenantId)?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900 font-bold">${p.amount}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{p.month}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{p.date}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">{p.status}</span>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">No payments recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Building</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Type</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Amount</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Description</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map(e => (
                <tr key={e.id}>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {buildings.find(b => b.id === e.buildingId)?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <span className="px-2 py-0.5 border border-slate-200 rounded text-xs">{e.type}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-red-600 font-bold">-${e.amount}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{e.description}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{e.date}</td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">No expenses recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-6">{activeTab === 'payments' ? 'Record Rent Payment' : 'Log Expense'}</h3>
            <form onSubmit={activeTab === 'payments' ? handleAddPayment : handleAddExpense} className="space-y-4">
              {activeTab === 'payments' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Tenant</label>
                    <select required name="tenantId" className="w-full px-4 py-2 border border-slate-200 rounded-lg">
                      {tenants.map(t => <option key={t.id} value={t.id}>{t.name} (Rent: ${t.rentAmount})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Amount ($)</label>
                    <input required name="amount" type="number" className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Building</label>
                    <select required name="buildingId" className="w-full px-4 py-2 border border-slate-200 rounded-lg">
                      {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Type</label>
                    <select required name="type" className="w-full px-4 py-2 border border-slate-200 rounded-lg">
                      {EXPENSE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Amount ($)</label>
                    <input required name="amount" type="number" className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                    <input required name="description" type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Date</label>
                <input required name="date" type="date" className="w-full px-4 py-2 border border-slate-200 rounded-lg" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialsManager;
