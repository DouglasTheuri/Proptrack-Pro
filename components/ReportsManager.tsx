
import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { MonthlyReport, Building } from '../types';
import { Icons } from '../constants';

const ReportsManager: React.FC = () => {
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    setReports(dataService.getReports());
    setBuildings(dataService.getBuildings());
  }, []);

  const handleGenerate = () => {
    if (!selectedBuildingId || !selectedMonth) return;
    const report = dataService.generateMonthlyReport(selectedBuildingId, selectedMonth);
    if (report) {
      setReports(dataService.getReports());
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Generate Owner Report</h3>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Building</label>
            <select 
              value={selectedBuildingId} 
              onChange={(e) => setSelectedBuildingId(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50"
            >
              <option value="">Select Building...</option>
              {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="w-48">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Month</label>
            <input 
              type="month" 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50"
            />
          </div>
          <button 
            onClick={handleGenerate}
            disabled={!selectedBuildingId}
            className="bg-indigo-600 text-white px-8 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.sort((a, b) => b.month.localeCompare(a.month)).map(report => {
          const building = buildings.find(b => b.id === report.buildingId);
          return (
            <div key={report.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:border-indigo-300 transition-colors">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-800">{building?.name}</h4>
                  <p className="text-xs text-slate-500">{report.month}</p>
                </div>
                <div className="bg-indigo-100 text-indigo-700 p-2 rounded-lg">
                  <Icons.Reports />
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Gross Rent:</span>
                  <span className="font-semibold text-slate-800">${report.totalRentCollected.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Management Fee (10%):</span>
                  <span className="font-semibold text-red-600">-${report.managementFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm pb-3 border-b border-slate-100">
                  <span className="text-slate-500">Total Expenses:</span>
                  <span className="font-semibold text-red-600">-${report.totalExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">Owner Payout:</span>
                  <span className="text-xl font-bold text-green-600">${report.netPayout.toLocaleString()}</span>
                </div>
                <div className="pt-4">
                  <button className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {reports.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
            No reports generated yet. Use the tool above to create your first monthly report.
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsManager;
