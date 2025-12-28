
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const CLIENT_ID_PLACEHOLDER = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

const Login: React.FC = () => {
  const { login, loginAsGuest } = useAuth();
  const initialized = useRef(false);
  const [isClientMissing, setIsClientMissing] = useState(false);

  useEffect(() => {
    const initGoogle = () => {
      // @ts-ignore
      if (typeof google !== 'undefined' && google.accounts && !initialized.current) {
        // Fix for "Property 'includes' does not exist on type 'never'"
        // Casting to string prevents TypeScript from narrowing unreachable branches to 'never'
        const clientId = CLIENT_ID_PLACEHOLDER as string; 
        
        // Reordering the checks ensures .includes is checked against the string before narrowing
        const isPlaceholder = clientId.includes("YOUR_GOOGLE") || clientId === "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
        
        if (isPlaceholder) {
          setIsClientMissing(true);
          return; // Don't even try if it's the placeholder
        }

        try {
          // @ts-ignore
          google.accounts.id.initialize({
            client_id: clientId,
            callback: (response: any) => login(response.credential),
          });

          // @ts-ignore
          google.accounts.id.renderButton(
            document.getElementById("googleBtn"),
            { theme: "outline", size: "large", width: 280 }
          );
          initialized.current = true;
        } catch (err) {
          console.error("Google Sign-In initialization failed:", err);
        }
      }
    };

    initGoogle();
    const interval = setInterval(() => {
      // @ts-ignore
      if (typeof google !== 'undefined' && google.accounts) {
        initGoogle();
        if (initialized.current) clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full"></div>

      <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden p-10 space-y-8 animate-in fade-in zoom-in duration-700 border border-white/20 z-10">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-indigo-600 rounded-[28px] flex items-center justify-center text-white text-4xl font-bold mb-6 shadow-2xl shadow-indigo-500/40 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            P
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">PropTrack Pro</h1>
          <p className="text-slate-500 font-medium text-lg">Modern Property Management</p>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 text-center">
            {isClientMissing ? (
              <div className="space-y-4">
                <button 
                  onClick={loginAsGuest}
                  className="w-full py-4 px-6 bg-indigo-600 text-white rounded-xl text-lg font-bold hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  Continue with Demo Data
                </button>
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-left">
                  <p className="text-xs text-amber-800 leading-relaxed font-medium">
                    <span className="font-bold block mb-1">Developer Mode Active</span>
                    The Google OAuth Client ID is not configured yet. Demo mode allows you to preview all features immediately.
                  </p>
                </div>
              </div>
            ) : (
              <div id="googleBtn" className="flex justify-center min-h-[50px] items-center">
                <div className="text-sm text-slate-400 italic flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  Waiting for Google...
                </div>
              </div>
            )}

            {!isClientMissing && (
              <div className="mt-6 flex flex-col gap-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-slate-400"><span className="bg-slate-50 px-3">or</span></div>
                </div>

                <button 
                  onClick={loginAsGuest}
                  className="w-full py-3 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                >
                  Explore as Guest
                </button>
              </div>
            )}
            
            <p className="text-[11px] text-slate-400 mt-6 leading-relaxed max-w-[240px] mx-auto">
              Securely syncing with <b>Google Sheets</b> for real-time portfolio management.
            </p>
          </div>
        </div>

        <div className="text-center space-y-4">
          <a 
            href="https://console.cloud.google.com/" 
            target="_blank" 
            className="inline-flex items-center gap-2 text-xs text-indigo-500 hover:text-indigo-700 font-bold transition-colors"
          >
            Setup OAuth Client ID
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/></svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;