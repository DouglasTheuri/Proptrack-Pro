
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from './constants';
import Dashboard from './components/Dashboard';
import BuildingsManager from './components/BuildingsManager';
import TenantsManager from './components/TenantsManager';
import FinancialsManager from './components/FinancialsManager';
import ReportsManager from './components/ReportsManager';
import Login from './components/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import { dataService } from './services/dataService';
import { askAssistant } from './services/aiService';

type View = 'dashboard' | 'buildings' | 'tenants' | 'financials' | 'reports';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chat]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = message;
    setMessage('');
    setChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const context = `Data: ${dataService.getBuildings().length} buildings, ${dataService.getUnits().length} units. Use current data to assist.`;
    const response = await askAssistant(userMsg, context);
    
    setChat(prev => [...prev, { role: 'ai', text: response || "I'm having trouble connecting right now." }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {isOpen ? (
        <div className="w-80 h-[450px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-5 bg-indigo-600 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              </div>
              <h4 className="font-bold text-sm">PropTrack AI</h4>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-4">
            <div className="bg-slate-50 p-3 rounded-2xl text-xs text-slate-600 leading-relaxed font-medium">
              Hi! I'm your property management assistant. Ask me about rent trends, maintenance, or portfolio stats.
            </div>
            {chat.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                  m.role === 'user' ? 'bg-indigo-600 text-white font-medium' : 'bg-slate-100 text-slate-800'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-[10px] text-slate-400 font-bold px-2 animate-pulse">Assistant is thinking...</div>}
          </div>

          <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask anything..." 
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <button type="submit" className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-indigo-600 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 shadow-indigo-500/40 relative group"
        >
          <div className="absolute inset-0 bg-indigo-400 rounded-2xl animate-ping opacity-20 group-hover:hidden"></div>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
        </button>
      )}
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [syncStatus, setSyncStatus] = useState(false);

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
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 selection:bg-indigo-100">
      <aside className={`bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col z-30 relative shadow-2xl`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800 h-20">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/20">
            <span className="font-black text-lg">P</span>
          </div>
          {isSidebarOpen && <h1 className="text-xl font-black text-white tracking-tighter">PROPTRACK</h1>}
        </div>

        <nav className="flex-1 mt-8 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as View)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all group relative overflow-hidden ${
                activeView === item.id 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30' 
                  : 'hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <item.icon />
              {isSidebarOpen && <span className="font-bold text-sm tracking-tight">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800/50">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center gap-3 p-3.5 rounded-2xl hover:bg-slate-800/50 transition-colors"
          >
            <Icons.Settings />
            {isSidebarOpen && <span className="font-bold text-sm">Settings</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-auto scroll-smooth">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-8">
            <div>
              <h2 className="text-2xl font-black text-slate-800 capitalize tracking-tight">
                {activeView.replace('-', ' ')}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${syncStatus ? 'bg-amber-400 animate-ping' : 'bg-emerald-500'}`}></div>
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">
                  {syncStatus ? 'Syncing to Cloud...' : `Synced: ${user.email}`}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <button 
              onClick={() => dataService.openSpreadsheet()}
              className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all flex items-center gap-2.5 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
              Google Sheet
            </button>
             
             <div className="relative">
                <button 
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-slate-100 focus:ring-4 focus:ring-indigo-500/10 outline-none hover:border-indigo-200 transition-all shadow-sm"
                >
                  <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                </button>

                {showProfileDropdown && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setShowProfileDropdown(false)}></div>
                    <div className="absolute right-0 mt-4 w-72 bg-white border border-slate-200 rounded-3xl shadow-2xl z-30 p-3 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                      <div className="p-4 bg-slate-50 rounded-2xl mb-2 flex items-center gap-4">
                        <img src={user.picture} alt={user.name} className="w-12 h-12 rounded-xl" />
                        <div className="min-w-0">
                          <p className="text-sm font-black text-slate-900 truncate">{user.name}</p>
                          <p className="text-[10px] text-slate-500 truncate font-bold uppercase tracking-wider">{user.email}</p>
                        </div>
                      </div>
                      <div className="px-2 py-2">
                        <button className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors">
                          <Icons.Settings />
                          Profile Preferences
                        </button>
                        <hr className="my-2 border-slate-100" />
                        <button 
                          onClick={logout}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl font-black flex items-center gap-3 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
             </div>
          </div>
        </header>

        <div className="p-10 max-w-7xl">
          {renderContent()}
        </div>

        <AIAssistant />
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
