
import React, { useMemo, useEffect, useState } from 'react';
import { dataService } from '../services/dataService';
import { getPropertyInsights } from '../services/aiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Insight {
  title: string;
  description: string;
  type: 'warning' | 'info' | 'success';
}

const Dashboard: React.FC = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setIsLoadingInsights(true);
      const res = await getPropertyInsights({
        buildings: dataService.getBuildings(),
        units: dataService.getUnits(),
        tenants: dataService.getTenants(),
        expenses: dataService.getExpenses()
      });
      setInsights(res);
      setIsLoadingInsights(false);
    };
    fetchInsights();
  }, []);

  const stats = useMemo(() => {
    const units = dataService.getUnits();
    const payments = dataService.getPayments();
    const totalExpectedRent = units.reduce((sum, u) => sum + u.monthlyRent, 0);
    const collectedThisMonth = payments
      .filter(p => p.month === new Date().toISOString().slice(0, 7))
      .reduce((sum, p) => sum + p.amount, 0);
    const occupancyRate = units.length > 0 ? (units.filter(u => u.status === 'Occupied').length / units.length) * 100 : 0;

    return {
      buildingsCount: dataService.getBuildings().length,
      unitsCount: units.length,
      tenantsCount: dataService.getTenants().length,
      collectedThisMonth,
      totalExpectedRent,
      occupancyRate
    };
  }, []);

  const pieData = useMemo(() => {
    const units = dataService.getUnits();
    return [
      { name: 'Occupied', value: units.filter(u => u.status === 'Occupied').length, color: '#4f46e5' },
      { name: 'Vacant', value: units.filter(u => u.status === 'Vacant').length, color: '#10b981' },
      { name: 'Maintenance', value: units.filter(u => u.status === 'Maintenance').length, color: '#f59e0b' },
    ];
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* AI Insights Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">AI Portfolio Insights</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLoadingInsights ? (
            [1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
            ))
          ) : (
            insights.map((insight, idx) => (
              <div key={idx} className={`p-4 rounded-2xl border flex gap-4 transition-all hover:shadow-md ${
                insight.type === 'warning' ? 'bg-amber-50 border-amber-100' : 
                insight.type === 'success' ? 'bg-emerald-50 border-emerald-100' : 'bg-indigo-50 border-indigo-100'
              }`}>
                <div className="shrink-0 pt-0.5">
                   <div className={`w-2 h-2 rounded-full ${
                     insight.type === 'warning' ? 'bg-amber-500' : 
                     insight.type === 'success' ? 'bg-emerald-500' : 'bg-indigo-500'
                   } animate-pulse`}></div>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{insight.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{insight.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Buildings" value={stats.buildingsCount} subText="Total Assets" icon="🏢" color="indigo" />
        <StatCard title="Occupancy" value={`${stats.occupancyRate.toFixed(1)}%`} subText={`${stats.tenantsCount} active leases`} icon="📊" color="emerald" />
        <StatCard title="Monthly Revenue" value={`$${stats.collectedThisMonth.toLocaleString()}`} subText={`Target: $${stats.totalExpectedRent.toLocaleString()}`} icon="💰" color="blue" />
        <StatCard title="Total Units" value={stats.unitsCount} subText="Capacity" icon="🏠" color="slate" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            Unit Allocation
            <span className="text-xs font-medium text-slate-400">Current Status</span>
          </h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-6">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></div>
                  {d.name}
                </div>
                <span className="font-bold text-slate-900">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue Growth</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { month: 'Jul', collection: 4200 },
                { month: 'Aug', collection: 4800 },
                { month: 'Sep', collection: 5100 },
                { month: 'Oct', collection: 5600 },
                { month: 'Nov', collection: stats.collectedThisMonth },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="collection" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; subText: string; icon: string; color: string }> = ({ title, value, subText, icon, color }) => (
  <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm group hover:border-indigo-200 transition-all duration-300">
    <div className="flex justify-between items-start mb-6">
      <div className={`w-12 h-12 rounded-2xl bg-${color}-50 text-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>{icon}</div>
      <div className="px-2.5 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-lg uppercase tracking-widest border border-green-100">Live Sync</div>
    </div>
    <h4 className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</h4>
    <div className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{value}</div>
    <p className="text-xs text-slate-400 mt-2 font-medium">{subText}</p>
  </div>
);

export default Dashboard;
