
import React, { useMemo } from 'react';
import { dataService } from '../services/dataService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const stats = useMemo(() => {
    const buildings = dataService.getBuildings();
    const units = dataService.getUnits();
    const tenants = dataService.getTenants();
    const payments = dataService.getPayments();

    const totalExpectedRent = units.reduce((sum, u) => sum + u.monthlyRent, 0);
    const collectedThisMonth = payments
      .filter(p => p.month === new Date().toISOString().slice(0, 7))
      .reduce((sum, p) => sum + p.amount, 0);
    
    const occupancyRate = units.length > 0 ? (units.filter(u => u.status === 'Occupied').length / units.length) * 100 : 0;

    return {
      buildingsCount: buildings.length,
      unitsCount: units.length,
      tenantsCount: tenants.length,
      collectedThisMonth,
      totalExpectedRent,
      occupancyRate
    };
  }, []);

  const pieData = useMemo(() => {
    const units = dataService.getUnits();
    const occupied = units.filter(u => u.status === 'Occupied').length;
    const vacant = units.filter(u => u.status === 'Vacant').length;
    const maintenance = units.filter(u => u.status === 'Maintenance').length;

    return [
      { name: 'Occupied', value: occupied, color: '#4f46e5' },
      { name: 'Vacant', value: vacant, color: '#10b981' },
      { name: 'Maintenance', value: maintenance, color: '#f59e0b' },
    ];
  }, []);

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Buildings" value={stats.buildingsCount} subText="Across portfolio" icon="🏢" />
        <StatCard title="Occupancy Rate" value={`${stats.occupancyRate.toFixed(1)}%`} subText={`${stats.tenantsCount} tenants`} icon="📊" />
        <StatCard title="Monthly Collection" value={`$${stats.collectedThisMonth.toLocaleString()}`} subText={`Of $${stats.totalExpectedRent.toLocaleString()} target`} icon="💰" />
        <StatCard title="Active Units" value={stats.unitsCount} subText="Available units" icon="🏠" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Occupancy Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Occupancy Status</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                <span className="text-xs text-slate-500">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Overview */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Revenue Performance</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { month: 'Jul', collection: 4200 },
                { month: 'Aug', collection: 4800 },
                { month: 'Sep', collection: 5100 },
                { month: 'Oct', collection: 5600 },
                { month: 'Nov', collection: stats.collectedThisMonth },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="collection" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; subText: string; icon: string }> = ({ title, value, subText, icon }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="text-2xl">{icon}</div>
      <div className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">Live</div>
    </div>
    <h4 className="text-slate-500 text-sm font-medium">{title}</h4>
    <div className="text-3xl font-bold text-slate-900 mt-1">{value}</div>
    <p className="text-xs text-slate-400 mt-2">{subText}</p>
  </div>
);

export default Dashboard;
