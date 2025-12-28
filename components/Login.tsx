
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const { login } = useAuth();

  useEffect(() => {
    /* global google */
    // @ts-ignore
    google.accounts.id.initialize({
      client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com", // This would be replaced with a real ID
      callback: (response: any) => login(response.credential),
    });

    // @ts-ignore
    google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
      { theme: "outline", size: "large", width: 280 }
    );
  }, [login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden p-8 space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg shadow-indigo-500/30">
            P
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">PropTrack Pro</h1>
          <p className="text-slate-500 mt-2 font-medium">Property Management, Simplified.</p>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 text-center">
            <h2 className="text-sm font-bold text-slate-600 uppercase tracking-widest mb-4">Secure Access</h2>
            <div id="googleBtn" className="flex justify-center"></div>
            <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">
              By signing in, your data will be securely synced with <b>Google Sheets</b> for transparent management.
            </p>
          </div>
        </div>

        <div className="text-center pt-4">
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-xs text-indigo-600 hover:underline">
            System Documentation & Payout Policies
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
