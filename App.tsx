
import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PieChart, 
  Settings as SettingsIcon, 
  Home as HomeIcon, 
  Briefcase,
  User as UserIcon,
  IndianRupee,
  LogOut,
  Menu,
  X,
  RefreshCw,
  UserCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import { AppMode, DataState, Account, Transaction, Category, Budget, User, AppPreferences } from './types';
import { INITIAL_ACCOUNTS, INITIAL_BUDGETS, INITIAL_CATEGORIES, INITIAL_TRANSACTIONS } from './constants';

interface AppContextType extends DataState {
  setMode: (mode: AppMode) => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'status'>) => void;
  updateBudget: (budgetId: string, limit: number) => void;
  addAccount: (acc: Omit<Account, 'id'>) => void;
  deleteAccount: (id: string) => void;
  updatePreferences: (prefs: Partial<AppPreferences>) => void;
  login: (userData: Partial<User>) => void;
  logout: () => void;
  resetData: () => void;
  syncBankData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

// Fix: Moved ProtectedRoute definition to the top level and ensured it's defined before usage in AppLayout.
// This resolves the error where 'children' was reported as missing by providing a clear component type in scope.
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useApp();
  if (!user.isLoggedIn) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const [state, setState] = useState<DataState>(() => {
    const saved = localStorage.getItem('payment_trackers_v3');
    if (saved) return JSON.parse(saved);
    return {
      accounts: INITIAL_ACCOUNTS,
      transactions: INITIAL_TRANSACTIONS,
      categories: INITIAL_CATEGORIES,
      budgets: INITIAL_BUDGETS,
      mode: AppMode.PERSONAL,
      user: { name: 'Vivek Sharma', email: 'vivek@example.com', isLoggedIn: false },
      preferences: { currency: 'INR (₹)', notifications: true, darkMode: false }
    };
  });

  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    localStorage.setItem('payment_trackers_v3', JSON.stringify(state));
  }, [state]);

  const value = useMemo(() => ({
    ...state,
    setMode: (mode: AppMode) => setState(s => ({ ...s, mode })),
    
    login: (userData: Partial<User>) => setState(s => ({ 
      ...s, 
      user: { ...s.user, ...userData, isLoggedIn: true } 
    })),
    
    logout: () => setState(s => ({ 
      ...s, 
      user: { ...s.user, isLoggedIn: false } 
    })),

    addTransaction: (txData: Omit<Transaction, 'id' | 'status'>) => {
      const newTx: Transaction = { 
        ...txData, 
        id: `tx-${Date.now()}`,
        status: 'Completed' 
      };

      setState(s => {
        const updatedAccounts = s.accounts.map(acc => {
          if (acc.id === txData.accountId) {
            const amountChange = txData.type === 'Income' ? txData.amount : -txData.amount;
            return { ...acc, balance: acc.balance + amountChange };
          }
          return acc;
        });

        const updatedBudgets = s.budgets.map(b => {
          if (b.categoryId === txData.categoryId) {
            return { ...b, spent: b.spent + (txData.type === 'Expense' ? txData.amount : 0) };
          }
          return b;
        });

        return {
          ...s,
          transactions: [newTx, ...s.transactions],
          accounts: updatedAccounts,
          budgets: updatedBudgets
        };
      });
    },

    addAccount: (accData: Omit<Account, 'id'>) => {
      const newAcc: Account = {
        ...accData,
        id: `acc-${Date.now()}`
      };
      setState(s => ({ ...s, accounts: [...s.accounts, newAcc] }));
    },

    updateBudget: (budgetId: string, limit: number) => {
      setState(s => ({
        ...s,
        budgets: s.budgets.map(b => b.id === budgetId ? { ...b, limit } : b)
      }));
    },

    deleteAccount: (id: string) => {
      setState(s => ({
        ...s,
        accounts: s.accounts.filter(a => a.id !== id),
        transactions: s.transactions.filter(tx => tx.accountId !== id)
      }));
    },

    updatePreferences: (prefs: Partial<AppPreferences>) => {
      setState(s => ({ ...s, preferences: { ...s.preferences, ...prefs } }));
    },

    syncBankData: async () => {
      setIsSyncing(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      const randomIncome = Math.floor(Math.random() * 500) + 50;
      const targetAcc = state.accounts.find(a => a.mode === state.mode);
      if (targetAcc) {
        value.addTransaction({
          date: new Date().toISOString().split('T')[0],
          amount: randomIncome,
          merchant: 'Bank Interest Accrual',
          categoryId: state.mode === AppMode.PERSONAL ? 'p1' : 'b1',
          accountId: targetAcc.id,
          type: 'Income'
        });
      }
      setIsSyncing(false);
    },

    resetData: () => {
      setState({
        accounts: INITIAL_ACCOUNTS,
        transactions: INITIAL_TRANSACTIONS,
        categories: INITIAL_CATEGORIES,
        budgets: INITIAL_BUDGETS,
        mode: AppMode.PERSONAL,
        user: { name: 'Vivek Sharma', email: 'vivek@example.com', isLoggedIn: state.user.isLoggedIn },
        preferences: { currency: 'INR (₹)', notifications: true, darkMode: false }
      });
    }
  }), [state]);

  return (
    <AppContext.Provider value={value}>
      <HashRouter>
        <AppLayout isSyncing={isSyncing} />
      </HashRouter>
    </AppContext.Provider>
  );
};

const AppLayout: React.FC<{ isSyncing: boolean }> = ({ isSyncing }) => {
  const { user, preferences, setMode, mode, syncBankData } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => navigate(-1);
  const handleForward = () => navigate(1);

  return (
    <div className={`flex flex-col md:flex-row min-h-screen ${preferences.darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {user.isLoggedIn && <Sidebar />}
      <main className="flex-1 flex flex-col min-w-0">
        <header className={`sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b px-4 backdrop-blur md:px-6 ${preferences.darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-slate-200'}`}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 mr-4">
              <button 
                onClick={handleBack} 
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                title="Back"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={handleForward} 
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                title="Forward"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <Link to="/" className="text-xl font-bold text-indigo-600 flex items-center gap-2">
              <IndianRupee className="w-6 h-6" />
              <span className="hidden sm:inline">PT Trackers</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {user.isLoggedIn && (
              <>
                <button 
                  onClick={() => syncBankData()}
                  disabled={isSyncing}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Syncing...' : 'Sync'}
                </button>
                <div className={`flex items-center gap-2 p-1 rounded-full border ${preferences.darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-100 border-slate-200'}`}>
                  <button 
                    onClick={() => setMode(AppMode.PERSONAL)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-all ${mode === AppMode.PERSONAL ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <UserIcon className="w-4 h-4" /> Personal
                  </button>
                  <button 
                    onClick={() => setMode(AppMode.BUSINESS)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-all ${mode === AppMode.BUSINESS ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <Briefcase className="w-4 h-4" /> Business
                  </button>
                </div>
              </>
            )}
            {!user.isLoggedIn && location.pathname !== '/auth' && (
              <Link to="/auth" className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, preferences } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Home', icon: <HomeIcon className="w-5 h-5" />, path: '/' },
    { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
    { label: 'Portfolio', icon: <PieChart className="w-5 h-5" />, path: '/portfolio' },
    { label: 'Settings', icon: <SettingsIcon className="w-5 h-5" />, path: '/settings' },
  ];

  return (
    <>
      <button 
        className="fixed bottom-4 right-4 z-50 md:hidden bg-indigo-600 text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      <div className={`
        fixed inset-0 z-40 bg-slate-900/50 md:hidden transition-opacity duration-300
        ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `} onClick={() => setIsOpen(false)} />

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 border-r transition-transform duration-300 transform md:translate-x-0 md:static md:block
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${preferences.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-10">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <IndianRupee className="w-6 h-6" />
              </div>
              <span className="font-bold text-xl tracking-tight">PT Trackers</span>
            </div>
            
            <nav className="space-y-2">
              {navItems.map(item => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      active 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                        : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className={`mt-auto p-6 border-t ${preferences.darkMode ? 'border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <Link to="/profile" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <UserCircle className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold group-hover:text-indigo-600 transition-colors truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </Link>
            <button 
              onClick={() => {
                logout();
                navigate('/auth');
              }}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 transition-colors w-full px-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default App;
