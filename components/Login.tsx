
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const CLIENT_ID_PLACEHOLDER = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

const Login: React.FC = () => {
  const { login, loginAsGuest } = useAuth();
  const initialized = useRef(false);
  const [isClientMissing, setIsClientMissing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    const initGoogle = () => {
      // @ts-ignore
      if (typeof google !== 'undefined' && google.accounts) {
        const clientId = CLIENT_ID_PLACEHOLDER as string; 
        const isPlaceholder = clientId.includes("YOUR_GOOGLE") || clientId === "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
        
        if (isPlaceholder) {
          setIsClientMissing(true);
          return;
        }

        try {
          if (!initialized.current) {
            // @ts-ignore
            google.accounts.id.initialize({
              client_id: clientId,
              callback: (response: any) => login(response.credential),
            });
            initialized.current = true;
          }

          const btnContainer = document.getElementById("googleBtn");
          if (btnContainer) {
            btnContainer.innerHTML = '';
            // @ts-ignore
            google.accounts.id.renderButton(
              btnContainer,
              { 
                theme: "filled_blue", 
                size: "large", 
                width: 340,
                text: 'continue_with',
                shape: "pill"
              }
            );
          }
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
        if (isClientMissing) clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [login, isClientMissing]);

  const handleSimulatedAuth = () => {
    setIsSimulating(true);
    setTimeout(() => {
      loginAsGuest();
      setIsSimulating(false);
    }, 1200);
  };

  const accountBenefits = [
    { title: "Live Spreadsheet Sync", desc: "Data automatically reflects in your Google Sheets.", icon: "🔄" },
    { title: "AI Portfolio Analyst", desc: "Ask questions and get insights from Gemini 3.", icon: "🤖" },
    { title: "Secure Payouts", desc: "Automated owner distribution calculations.", icon: "💵" }
  ];

  return (
    <div className="min-h-screen flex bg-slate-950 text-white selection:bg-indigo-500/30 font-sans">
      {/* Visual Brand Section */}
      <div className="hidden lg:flex flex-1 flex-col p-16 relative overflow-hidden bg-slate-900 border-r border-white/5">
        <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
           <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-indigo-600/20 blur-[140px] rounded-full"></div>
           <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[140px] rounded-full"></div>
        </div>
        
        <div className="relative z-10 flex items-center gap-4 mb-20">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-3xl shadow-2xl shadow-indigo-500/20 transform -rotate-3">P</div>
          <span className="text-3xl font-black tracking-tighter">PROPTRACK <span className="text-indigo-400">PRO</span></span>
        </div>

        <div className="relative z-10 max-w-xl my-auto">
          <h2 className="text-7xl font-black leading-[0.95] tracking-tighter mb-10">
            Property Management <br/>
            <span className="text-indigo-400 block mt-2">Simplified.</span>
          </h2>
          
          <div className="space-y-10">
            {accountBenefits.map((benefit, i) => (
              <div key={i} className="flex gap-6 group">
                <div className="w-16 h-16 shrink-0 rounded-[22px] bg-white/5 border border-white/10 flex items-center justify-center text-3xl group-hover:bg-indigo-600/30 transition-all duration-300 transform group-hover:scale-110">
                  {benefit.icon}
                </div>
                <div>
                  <h4 className="font-bold text-xl text-white mb-2">{benefit.title}</h4>
                  <p className="text-slate-400 text-lg leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 pt-20 flex gap-4 items-center text-slate-500 text-sm font-medium italic">
          <div className="flex -space-x-3">
            {[23,45,67,89].map(id => (
              <img key={id} src={`https://i.pravatar.cc/150?u=${id}`} className="w-10 h-10 rounded-full border-2 border-slate-900 ring-2 ring-indigo-500/20" alt="User" />
            ))}
          </div>
          <p>Trusted by professional managers worldwide.</p>
        </div>
      </div>

      {/* Auth Interaction Section */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-950">
        <div className="w-full max-w-md space-y-10">
          <div className="text-center">
            <h1 className="text-5xl font-black tracking-tight mb-4">
              Get Started
            </h1>
            <p className="text-slate-400 font-medium text-lg">
              Link your Google Account to begin managing your portfolio.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 space-y-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
            {/* Google Auth Button */}
            {isClientMissing ? (
              <div className="space-y-6">
                <button 
                  onClick={handleSimulatedAuth}
                  disabled={isSimulating}
                  className="w-full py-5 px-6 bg-indigo-600 text-white rounded-[20px] text-xl font-bold hover:bg-indigo-700 hover:scale-[1.03] active:scale-[0.98] transition-all shadow-2xl shadow-indigo-500/30 flex items-center justify-center gap-4 disabled:opacity-70 disabled:cursor-wait"
                >
                  {isSimulating ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      Connecting...
                    </>
                  ) : (
                    'Link with Google Account'
                  )}
                </button>
                <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-[20px]">
                  <p className="text-sm text-amber-200/90 leading-relaxed text-center font-medium">
                    <span className="font-black text-amber-400 uppercase tracking-widest text-[10px] block mb-2 text-center">Development Preview</span>
                    OAuth Client ID not detected. Using **Simulated Account** flow for testing purposes.
                  </p>
                </div>
              </div>
            ) : (
              <div id="googleBtn" className="flex justify-center min-h-[60px] items-center">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
              <div className="relative flex justify-center text-[11px] uppercase font-black tracking-[0.3em] text-slate-500"><span className="bg-slate-900 px-6">Secure Gateway</span></div>
            </div>

            <div className="text-center space-y-6">
              <div className="pt-6 border-t border-white/5">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                  Secure OAuth 2.0 Encryption Active
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              className="text-[11px] text-slate-500 hover:text-indigo-400 font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              Terms of Service & Data Policy
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m4-3h6v6m-11 5L21 3"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
