
import React, { useState, useEffect } from 'react';
import { Icons } from './constants';
import Dashboard from './components/Dashboard';
import BuildingsManager from './components/BuildingsManager';
import TenantsManager from './components/TenantsManager';
import FinancialsManager from './components/FinancialsManager';
import ReportsManager from './components/ReportsManager';
import Login from './components/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import { dataService } from './services/dataService';

type View = 'dashboard' | 'buildings' | 'tenants' | 'financials' | 'reports';

const AppContent: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [syncStatus, setSyncStatus] = useState(false);

  // Poll for sync status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncStatus(dataService.getSyncStatus());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  if (loading) return null;
  if (!user) return <Login />;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard },
    { id: 'buildings', label: 'Buildings', icon: Icons.Buildings },
    { id: 'tenants', label: 'Tenants', icon: Icons.Tenants },
    { id: 'financials', label: 'Financials', icon: Icons.Finance },
    { id: 'reports', label: 'Owner Reports', icon: Icons.Reports },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'buildings': return <BuildingsManager />;
      case 'tenants': return <TenantsManager />;
      case 'financials': return <FinancialsManager />;
      case 'reports': return <ReportsManager />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className={`bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800 h-20">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/20">
            <span className="font-bold">P</span>
          </div>
          {isSidebarOpen && <h1 className="text-xl font-bold text-white tracking-tight">PropTrack</h1>}
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as View)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all group ${
                activeView === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 translate-x-1' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon />
              {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Icons.Settings />
            {isSidebarOpen && <span className="font-medium text-sm">Settings</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-auto">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 capitalize leading-tight">
                {activeView.replace('-', ' ')}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${syncStatus ? 'bg-amber-400 animate-ping' : 'bg-green-500'}`}></div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {syncStatus ? 'Syncing to your Sheets...' : `Stored in ${user.email}'s account`}
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => dataService.openSpreadsheet()}
              className="px-4 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100 hover:bg-emerald-100 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              View Spreadsheet
            </button>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative hidden md:block">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                  <Icons.Search />
                </div>
                <input 
                  type="text" 
                  placeholder="Global search..." 
                  className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-xs focus:ring-2 focus:ring-indigo-500 w-64 outline-none transition-all"
                />
             </div>
             
             <div className="relative">
                <button 
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none hover:border-indigo-200 transition-all shadow-sm"
                >
                  <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                </button>

                {showProfileDropdown && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setShowProfileDropdown(false)}></div>
                    <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl z-30 p-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-4 bg-slate-50 rounded-xl mb-2 flex items-center gap-3">
                        <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                          <p className="text-[10px] text-slate-500 truncate font-medium">{user.email}</p>
                        </div>
                      </div>
                      <div className="px-2 py-1">
                        <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-3 transition-colors">
                          <Icons.Settings />
                          Account Settings
                        </button>
                        <hr className="my-1 border-slate-100" />
                        <button 
                          onClick={logout}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-bold flex items-center gap-3 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
             </div>
          </div>
        </header>

        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
