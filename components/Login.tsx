
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const CLIENT_ID_PLACEHOLDER = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

const Login: React.FC = () => {
  const { login, loginAsGuest } = useAuth();
  const initialized = useRef(false);
  const [isClientMissing, setIsClientMissing] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');

  useEffect(() => {
    const initGoogle = () => {
      // @ts-ignore
      if (typeof google !== 'undefined' && google.accounts && !initialized.current) {
        const clientId = CLIENT_ID_PLACEHOLDER as string; 
        const isPlaceholder = clientId.includes("YOUR_GOOGLE") || clientId === "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
        
        if (isPlaceholder) {
          setIsClientMissing(true);
          return;
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
            { 
              theme: "filled_blue", 
              size: "large", 
              width: 320,
              text: authMode === 'signup' ? 'signup_with' : 'signin_with',
              shape: "pill"
            }
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
  }, [login, authMode]);

  const features = [
    { title: "Sheets Automation", desc: "Every transaction syncs instantly to your personal Google Spreadsheet.", icon: "📊" },
    { title: "AI Portfolio Advisor", desc: "Get real-time insights on rent trends and maintenance needs.", icon: "✨" },
    { title: "Owner Portal", desc: "Generate transparent payout reports with one click.", icon: "🏢" }
  ];

  return (
    <div className="min-h-screen flex bg-slate-950 text-white font-inter selection:bg-indigo-500/30">
      {/* Left side: Content & Branding */}
      <div className="hidden lg:flex flex-1 flex-col p-16 relative overflow-hidden bg-slate-900">
        <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
           <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-indigo-600/30 blur-[160px] rounded-full"></div>
           <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] bg-emerald-600/20 blur-[160px] rounded-full"></div>
        </div>
        
        <div className="relative z-10 flex items-center gap-3 mb-16">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl shadow-indigo-500/20">P</div>
          <span className="text-2xl font-black tracking-tighter">PROPTRACK PRO</span>
        </div>

        <div className="relative z-10 mt-auto max-w-xl">
          <h2 className="text-6xl font-black leading-tight tracking-tighter mb-8">
            Manage your assets <br/>
            <span className="text-indigo-400">like a pro.</span>
          </h2>
          <div className="space-y-8">
            {features.map((f, i) => (
              <div key={i} className="flex gap-6 group">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl group-hover:bg-indigo-600/20 transition-colors">
                  {f.icon}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-white mb-1">{f.title}</h4>
                  <p className="text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-auto pt-16 flex gap-8 items-center text-slate-500">
          <div className="flex -space-x-3">
            {[1,2,3,4].map(i => (
              <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-10 h-10 rounded-full border-2 border-slate-900" />
            ))}
          </div>
          <p className="text-xs font-medium uppercase tracking-widest">Trusted by 500+ Property Managers</p>
        </div>
      </div>

      {/* Right side: Auth Card */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-950">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-black tracking-tight mb-2">
              {authMode === 'signup' ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-slate-400 font-medium">
              {authMode === 'signup' 
                ? 'Start managing your portfolio in seconds.' 
                : 'Enter your credentials to access your dashboard.'}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-8 backdrop-blur-xl">
            {isClientMissing ? (
              <div className="space-y-4">
                <button 
                  onClick={loginAsGuest}
                  className="w-full py-4 px-6 bg-indigo-600 text-white rounded-2xl text-lg font-bold hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-3"
                >
                  {authMode === 'signup' ? 'Start Free Trial' : 'Sign in as Guest'}
                </button>
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-left">
                  <p className="text-xs text-amber-200/80 leading-relaxed">
                    <span className="font-bold text-amber-400 block mb-1 uppercase tracking-widest">Configuration Required</span>
                    Google Sign-up is disabled because the OAuth Client ID is missing. Using **Demo Mode** will allow you to explore all features instantly.
                  </p>
                </div>
              </div>
            ) : (
              <div id="googleBtn" className="flex justify-center py-4">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-slate-500"><span className="bg-slate-900 px-4">Secure Authentication</span></div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-sm text-slate-400">
                {authMode === 'signup' ? 'Already have an account?' : 'New to PropTrack?'}
                <button 
                  onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                  className="ml-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
                >
                  {authMode === 'signup' ? 'Sign In' : 'Sign Up Free'}
                </button>
              </p>
              
              <div className="pt-4">
                <a 
                  href="https://ai.google.dev/gemini-api/docs/billing" 
                  target="_blank" 
                  className="text-[10px] text-slate-500 hover:text-slate-300 font-medium underline underline-offset-4 uppercase tracking-wider"
                >
                  Privacy Policy & Data Terms
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
