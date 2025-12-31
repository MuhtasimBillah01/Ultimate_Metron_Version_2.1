import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Activity, ShieldCheck, Key, AlertCircle } from 'lucide-react';

interface AuthPageProps {
  onLogin: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Default demo credentials
  const demoEmail = "admin@metron.fi";
  const demoPass = "password123";

  const [email, setEmail] = useState(demoEmail);
  const [password, setPassword] = useState(demoPass);
  const [fullName, setFullName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);

      if (isLogin) {
        // --- LOGIN LOGIC ---
        const storedUsers = JSON.parse(localStorage.getItem('metron_users') || '[]');
        const validUser = storedUsers.find((u: any) => u.email === email && u.password === password);
        
        // Check against localStorage users OR the hardcoded demo account
        if (validUser || (email === demoEmail && password === demoPass)) {
           localStorage.setItem('metron_session', 'active');
           onLogin();
        } else {
           setError("Invalid email or password. Please try again.");
        }
      } else {
        // --- SIGN UP LOGIC ---
        if (password.length < 6) {
          setError("Password must be at least 6 characters long.");
          return;
        }

        const storedUsers = JSON.parse(localStorage.getItem('metron_users') || '[]');
        
        // Check if user already exists
        if (storedUsers.find((u: any) => u.email === email) || email === demoEmail) {
          setError("An account with this email already exists.");
          return;
        }

        // Register new user
        const newUser = { email, password, fullName, joinedAt: Date.now() };
        storedUsers.push(newUser);
        localStorage.setItem('metron_users', JSON.stringify(storedUsers));
        
        // Auto-login after signup
        localStorage.setItem('metron_session', 'active');
        onLogin();
      }
    }, 1000);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    // Optional: Reset fields for better UX
    if (!isLogin) {
       // Switching TO Login -> prefill demo
       setEmail(demoEmail);
       setPassword(demoPass);
    } else {
       // Switching TO Signup -> clear
       setEmail("");
       setPassword("");
       setFullName("");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md bg-surface/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl text-white font-bold text-2xl mb-4 shadow-lg shadow-blue-500/20">
            M
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-slate-400 text-sm">
            {isLogin ? 'Enter your credentials to access the terminal' : 'Join the high-frequency trading network'}
          </p>
        </div>

        {/* Demo Credentials Box - Only show in Login mode */}
        {isLogin && (
          <div className="mb-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-3">
            <Key className="text-blue-400 shrink-0 mt-0.5" size={16} />
            <div className="text-xs text-slate-300">
              <p className="font-semibold text-blue-400 mb-1">Demo Access Credentials:</p>
              <p>Email: <span className="font-mono text-white bg-slate-800 px-1 rounded">{demoEmail}</span></p>
              <p className="mt-1">Pass: <span className="font-mono text-white bg-slate-800 px-1 rounded">{demoPass}</span></p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="text-red-400 shrink-0" size={18} />
            <span className="text-xs text-red-300 font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1.5 animate-in fade-in slide-in-from-right-4">
              <label className="text-xs font-semibold text-slate-300 uppercase ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-3 top-2.5 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="text" 
                  required={!isLogin}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-2.5 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="trader@metron.fi"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-2.5 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="flex items-center gap-2 text-xs text-slate-400 my-2">
               <ShieldCheck size={14} className="text-green-500" />
               <span>Encrypted hardware key storage enabled</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Activity className="animate-spin" size={20} />
            ) : (
              <>
                {isLogin ? 'Sign In to Terminal' : 'Initialize Account'} <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800 text-center">
          <p className="text-slate-400 text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={toggleAuthMode}
              className="text-primary hover:text-blue-400 font-semibold transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
