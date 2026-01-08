
import React, { useState } from 'react';
import { 
  CreditCard, 
  Database, 
  Globe, 
  Trash2, 
  Plus, 
  ShieldCheck,
  RotateCcw,
  X,
  Edit2,
  Save,
  Moon,
  Sun
} from 'lucide-react';
import { useApp } from '../App';
import { AppMode } from '../types';

const Settings: React.FC = () => {
  const { 
    accounts, budgets, categories, mode, deleteAccount, 
    resetData, addAccount, updateBudget, preferences, updatePreferences 
  } = useApp();
  
  const [activeTab, setActiveTab] = useState('accounts');
  const [showAddAccModal, setShowAddAccModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<string | null>(null);
  const [budgetLimit, setBudgetLimit] = useState('');

  const [newAcc, setNewAcc] = useState({
    bankName: '',
    accountType: 'Savings' as any,
    balance: '',
    lastFour: ''
  });

  const tabs = [
    { id: 'accounts', label: 'Accounts', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'budgets', label: 'Budgets', icon: <Database className="w-4 h-4" /> },
    { id: 'preferences', label: 'Preferences', icon: <Globe className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const currentModeAccounts = accounts.filter(a => a.mode === mode);
  const currentModeBudgets = budgets.filter(b => b.mode === mode);

  const handleAddAcc = (e: React.FormEvent) => {
    e.preventDefault();
    addAccount({
      ...newAcc,
      balance: parseFloat(newAcc.balance),
      accountNumber: `XXXXXX${newAcc.lastFour}`,
      mode
    });
    setShowAddAccModal(false);
    setNewAcc({ bankName: '', accountType: 'Savings', balance: '', lastFour: '' });
  };

  const handleSaveBudget = (id: string) => {
    updateBudget(id, parseFloat(budgetLimit));
    setEditingBudget(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
        <p className="text-slate-500">Configure your financial engine and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-64 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
          <div className="pt-8 px-4">
             <button 
                onClick={() => {
                  if(confirm('Wipe all local data and restore defaults?')) resetData();
                }}
                className="flex items-center gap-2 text-xs font-bold text-rose-500 hover:text-rose-600 uppercase tracking-widest"
             >
               <RotateCcw className="w-3 h-3" /> Factory Reset
             </button>
          </div>
        </div>

        <div className={`flex-1 rounded-[2.5rem] border shadow-sm p-8 min-h-[500px] ${preferences.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
          {activeTab === 'accounts' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Linked Banking</h3>
                <button 
                  onClick={() => setShowAddAccModal(true)}
                  className="flex items-center gap-1 text-sm text-indigo-600 font-bold bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100"
                >
                  <Plus className="w-4 h-4" /> Add Account
                </button>
              </div>
              <div className="space-y-4">
                {currentModeAccounts.map(acc => (
                  <div key={acc.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center font-bold text-indigo-600">
                        {acc.bankName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold">{acc.bankName}</p>
                        <p className="text-xs text-slate-500">**** **** {acc.lastFour} • {acc.accountType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-sm">₹{acc.balance.toLocaleString()}</p>
                      <button 
                        onClick={() => deleteAccount(acc.id)}
                        className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'budgets' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Limit Configuration</h3>
              <div className="space-y-8">
                {currentModeBudgets.map(budget => {
                  const cat = categories.find(c => c.id === budget.categoryId);
                  const isEditing = editingBudget === budget.id;
                  return (
                    <div key={budget.id} className="space-y-3 p-5 bg-slate-50 rounded-2xl">
                      <div className="flex justify-between items-center">
                        <span className="font-bold flex items-center gap-2">
                          {cat?.icon} {cat?.name}
                        </span>
                        <div className="flex items-center gap-3">
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <input 
                                type="number" 
                                value={budgetLimit}
                                onChange={e => setBudgetLimit(e.target.value)}
                                className="w-24 px-2 py-1 bg-white border border-slate-200 rounded text-sm font-bold"
                              />
                              <button onClick={() => handleSaveBudget(budget.id)} className="text-emerald-600 p-1"><Save className="w-4 h-4" /></button>
                              <button onClick={() => setEditingBudget(null)} className="text-rose-600 p-1"><X className="w-4 h-4" /></button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-600">₹{budget.limit.toLocaleString()}</span>
                              <button 
                                onClick={() => {
                                  setEditingBudget(budget.id);
                                  setBudgetLimit(budget.limit.toString());
                                }} 
                                className="text-indigo-600 p-1 hover:bg-white rounded"
                              ><Edit2 className="w-4 h-4" /></button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="h-2 bg-white rounded-full overflow-hidden border">
                        <div 
                          className={`h-full transition-all duration-500 ${budget.spent > budget.limit ? 'bg-rose-500' : 'bg-indigo-500'}`}
                          style={{ width: `${Math.min((budget.spent / budget.limit) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold">App Customization</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                  <div>
                    <p className="font-bold text-sm">Primary Currency</p>
                    <p className="text-xs text-slate-500">All balances will convert to this view.</p>
                  </div>
                  <select 
                    value={preferences.currency}
                    onChange={e => updatePreferences({ currency: e.target.value })}
                    className="bg-slate-50 border border-slate-200 text-sm font-bold px-3 py-2 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option>INR (₹)</option>
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                  <div>
                    <p className="font-bold text-sm">Push Notifications</p>
                    <p className="text-xs text-slate-500">Alerts for high-value transactions.</p>
                  </div>
                  <button 
                    onClick={() => updatePreferences({ notifications: !preferences.notifications })}
                    className={`w-12 h-6 rounded-full relative transition-colors ${preferences.notifications ? 'bg-indigo-600' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${preferences.notifications ? 'right-1' : 'left-1'}`}></div>
                  </button>
                </div>
                <div className="flex items-center justify-between p-5">
                  <div>
                    <p className="font-bold text-sm">Visual Theme</p>
                    <p className="text-xs text-slate-500">Switch between light and night mode.</p>
                  </div>
                  <button 
                    onClick={() => updatePreferences({ darkMode: !preferences.darkMode })}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
                  >
                    {preferences.darkMode ? <><Moon className="w-4 h-4" /> Dark</> : <><Sun className="w-4 h-4" /> Light</>}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Account Modal */}
      {showAddAccModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
           <form onSubmit={handleAddAcc} className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-2xl font-bold">Link New Bank</h3>
                 <button type="button" onClick={() => setShowAddAccModal(false)}><X className="w-6 h-6" /></button>
              </div>
              <div className="space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Bank Name</label>
                    <input required value={newAcc.bankName} onChange={e => setNewAcc({...newAcc, bankName: e.target.value})} placeholder="e.g. Kotak Mahindra" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Type</label>
                      <select value={newAcc.accountType} onChange={e => setNewAcc({...newAcc, accountType: e.target.value as any})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <option>Savings</option>
                        <option>Checking</option>
                        <option>Credit Card</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Last 4 Digits</label>
                      <input required maxLength={4} value={newAcc.lastFour} onChange={e => setNewAcc({...newAcc, lastFour: e.target.value})} placeholder="0000" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" />
                    </div>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Opening Balance (₹)</label>
                    <input required type="number" value={newAcc.balance} onChange={e => setNewAcc({...newAcc, balance: e.target.value})} placeholder="50000" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-lg" />
                 </div>
              </div>
              <button type="submit" className="w-full mt-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100">Securely Link Account</button>
           </form>
        </div>
      )}
    </div>
  );
};

export default Settings;
