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
        const clientId = CLIENT_ID_PLACEHOLDER; // Change this to your real ID
        
        if (clientId === CLIENT_ID_PLACEHOLDER) {
          setIsClientMissing(true);
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
    }, 200);

    return () => clearInterval(interval);
  }, [login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden p-8 space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg shadow-indigo-500/30">
            P
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">PropTrack Pro</h1>
          <p className="text-slate-500 mt-2 font-medium">Property Management, Simplified.</p>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 text-center">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Secure Access</h2>
            
            <div id="googleBtn" className="flex justify-center min-h-[44px]">
              <div className="text-xs text-slate-400 italic flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                Connecting to Google...
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-slate-50 px-2 text-slate-400 font-bold">OR</span></div>
              </div>

              <button 
                onClick={loginAsGuest}
                className="w-full py-2.5 px-4 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center justify-center gap-2"
              >
                Continue in Demo Mode
              </button>
            </div>

            {isClientMissing && (
              <div className="mt-6 p-3 bg-amber-50 border border-amber-100 rounded-lg text-left">
                <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
                  <span className="font-bold">Developer Tip:</span> The Google Sign-In will fail until you provide a valid <code className="bg-amber-100 px-1 rounded">client_id</code> in <code className="bg-amber-100 px-1 rounded">Login.tsx</code>. Use Demo Mode to explore the app now.
                </p>
              </div>
            )}
            
            <p className="text-[10px] text-slate-400 mt-6 leading-relaxed">
              By signing in, your data will be securely synced with <b>Google Sheets</b> for transparent management.
            </p>
          </div>
        </div>

        <div className="text-center pt-2">
          <a href="https://console.cloud.google.com/" target="_blank" className="text-[10px] text-indigo-400 hover:text-indigo-600 font-medium transition-colors">
            Setup Google Cloud Project →
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;