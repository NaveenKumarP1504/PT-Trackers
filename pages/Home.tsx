
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, ChevronRight, CheckCircle2, ShieldCheck, Zap, TrendingUp, LogIn } from 'lucide-react';
import { useApp } from '../App';
import { AppMode } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { setMode, user } = useApp();

  const handleStart = (mode: AppMode) => {
    setMode(mode);
    if (user.isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Hero Section */}
      <div className="text-center mb-16 px-4">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-sm font-bold mb-8 animate-bounce">
          <Sparkles className="w-4 h-4" /> Trusted by 10k+ users in India
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Track Every <span className="text-indigo-600">Paisa</span>, <br />Empower Your Future.
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          One platform to manage your personal finances and business expenses seamlessly. 
          Built for modern Indian users with local bank support.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
           {!user.isLoggedIn ? (
             <button 
               onClick={() => navigate('/auth')}
               className="px-8 py-4 bg-indigo-600 text-white font-extrabold rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:-translate-y-1 flex items-center gap-2"
             >
               Go to Sign Up <ChevronRight className="w-5 h-5" />
             </button>
           ) : (
             <button 
               onClick={() => navigate('/dashboard')}
               className="px-8 py-4 bg-indigo-600 text-white font-extrabold rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:-translate-y-1 flex items-center gap-2"
             >
               Go to Dashboard <ChevronRight className="w-5 h-5" />
             </button>
           )}
        </div>
      </div>

      {/* Choice Cards */}
      <div className="grid md:grid-cols-2 gap-8 px-4 mb-20">
        <div className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border border-slate-100 overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <User className="w-32 h-32 text-indigo-600" />
          </div>
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Personal Tracking</h2>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2 text-slate-600">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Multi-bank account overview</span>
            </li>
            <li className="flex items-center gap-2 text-slate-600">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Smart monthly budgets</span>
            </li>
            <li className="flex items-center gap-2 text-slate-600">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Detailed spending analytics</span>
            </li>
          </ul>
          <button 
            onClick={() => handleStart(AppMode.PERSONAL)}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 group-hover:bg-indigo-600 transition-colors"
          >
            {user.isLoggedIn ? 'Access Personal' : 'Get Started'} <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border border-slate-100 overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Briefcase className="w-32 h-32 text-indigo-600" />
          </div>
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
            <Briefcase className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Business Tracking</h2>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2 text-slate-600">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Real-time profit tracking</span>
            </li>
            <li className="flex items-center gap-2 text-slate-600">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Revenue vs Expense analysis</span>
            </li>
            <li className="flex items-center gap-2 text-slate-600">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Custom business KPIs</span>
            </li>
          </ul>
          <button 
            onClick={() => handleStart(AppMode.BUSINESS)}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 group-hover:bg-indigo-600 transition-colors"
          >
            {user.isLoggedIn ? 'Access Business' : 'Manage Business'} <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Social Proof/Features */}
      <div className="bg-indigo-600 rounded-[3rem] p-12 text-white grid md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg mb-2">Secure & Private</h3>
          <p className="text-indigo-100 text-sm">Your financial data is encrypted and stored locally. We never see your transactions.</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg mb-2">Real-time Insights</h3>
          <p className="text-indigo-100 text-sm">Instant calculations of your net worth and business profit margins.</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg mb-2">Growth Oriented</h3>
          <p className="text-indigo-100 text-sm">Smart forecasting helps you save more and scale your business efficiently.</p>
        </div>
      </div>

      <footer className="mt-20 py-8 border-t text-center text-slate-500 text-sm">
        <p>© 2024 Payment Trackers. Designed for India. Mock Data Powered.</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="#" className="hover:text-indigo-600">Privacy</a>
          <a href="#" className="hover:text-indigo-600">Terms</a>
          <a href="#" className="hover:text-indigo-600">Help Center</a>
        </div>
      </footer>
    </div>
  );
};

const Sparkles = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L14.5 9H22L16 14L18.5 21L12 17L5.5 21L8 14L2 9H9.5L12 2Z"/></svg>
);

export default Home;
