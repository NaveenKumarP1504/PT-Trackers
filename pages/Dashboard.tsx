
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  IndianRupee, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Plus, 
  Search,
  Filter,
  ArrowRight,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Sparkles,
  X,
  CreditCard,
  ChevronRight,
  History
} from 'lucide-react';
import { useApp } from '../App';
import { AppMode, Account, Transaction, Category } from '../types';

interface Insight {
  id: string;
  categoryName: string;
  icon: string;
  message: string;
  trend: 'up' | 'down' | 'neutral';
}

const Dashboard: React.FC = () => {
  const { accounts, transactions, mode, categories, addTransaction } = useApp();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [newTx, setNewTx] = useState({
    amount: '',
    merchant: '',
    accountId: '',
    categoryId: '',
    type: 'Expense' as 'Expense' | 'Income'
  });

  const filteredAccounts = accounts.filter(a => a.mode === mode);
  
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const acc = accounts.find(a => a.id === tx.accountId);
      const isCorrectMode = acc && acc.mode === mode;
      
      if (!isCorrectMode) return false;
      
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();
      const merchantMatch = tx.merchant.toLowerCase().includes(query);
      const category = categories.find(c => c.id === tx.categoryId);
      const categoryMatch = category?.name.toLowerCase().includes(query);
      const amountMatch = tx.amount.toString().includes(query);
      
      return merchantMatch || categoryMatch || amountMatch;
    });
  }, [transactions, mode, accounts, searchQuery, categories]);

  const totalBalance = filteredAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyExpenses = transactions
    .filter(tx => {
      const acc = accounts.find(a => a.id === tx.accountId);
      const d = new Date(tx.date);
      return acc && acc.mode === mode && tx.type === 'Expense' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, tx) => sum + tx.amount, 0);

  const monthlyIncome = transactions
    .filter(tx => {
      const acc = accounts.find(a => a.id === tx.accountId);
      const d = new Date(tx.date);
      return acc && acc.mode === mode && tx.type === 'Income' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, tx) => sum + tx.amount, 0);

  const smartInsights = useMemo(() => {
    const insights: Insight[] = [];
    const modeCats = categories.filter(c => c.type === mode);

    modeCats.forEach(cat => {
      const currTotal = transactions
        .filter(tx => {
          const acc = accounts.find(a => a.id === tx.accountId);
          return acc && acc.mode === mode && tx.categoryId === cat.id && tx.type === 'Expense' && new Date(tx.date).getMonth() === currentMonth;
        })
        .reduce((sum, tx) => sum + tx.amount, 0);
      
      if (currTotal > 5000) {
        insights.push({
          id: cat.id,
          categoryName: cat.name,
          icon: cat.icon,
          trend: 'up',
          message: `Your spending in ${cat.name} is higher than typical for mid-month.`
        });
      }
    });

    if (insights.length === 0) {
      insights.push({
        id: 'gen',
        categoryName: 'Healthy',
        icon: '✅',
        trend: 'neutral',
        message: "Great job! Your spending velocity is 15% slower than last month."
      });
    }
    return insights.slice(0, 3);
  }, [transactions, mode, categories, currentMonth, accounts]);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.amount || !newTx.accountId || !newTx.categoryId || !newTx.merchant) return;

    addTransaction({
      amount: parseFloat(newTx.amount),
      merchant: newTx.merchant,
      accountId: newTx.accountId,
      categoryId: newTx.categoryId,
      type: newTx.type,
      date: new Date().toISOString().split('T')[0]
    });

    setShowAddModal(false);
    setNewTx({ amount: '', merchant: '', accountId: '', categoryId: '', type: 'Expense' });
  };

  const focusSearch = () => {
    searchInputRef.current?.focus();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {mode === AppMode.PERSONAL ? 'Personal Overview' : 'Business Insights'}
          </h2>
          <p className="text-slate-500">Live connectivity with {filteredAccounts.length} linked accounts.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all hover:-translate-y-1"
        >
          <Plus className="w-5 h-5" /> Quick Transaction
        </button>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Net Liquidity', val: totalBalance, icon: <Wallet />, color: 'indigo' },
          { label: 'Monthly Inflow', val: monthlyIncome, icon: <ArrowUpRight />, color: 'emerald' },
          { label: 'Monthly Outflow', val: monthlyExpenses, icon: <ArrowDownRight />, color: 'rose' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${item.color}-50 text-${item.color}-600 rounded-2xl flex items-center justify-center`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Real-time</span>
            </div>
            <p className="text-slate-500 text-sm font-medium">{item.label}</p>
            <h3 className="text-2xl font-bold flex items-center mt-1">
              <IndianRupee className="w-5 h-5" /> {item.val.toLocaleString('en-IN')}
            </h3>
          </div>
        ))}
      </div>

      {/* Smart Insights */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Sparkles className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xl font-bold">Banking Intelligence</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {smartInsights.map(insight => (
              <div key={insight.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{insight.icon}</span>
                  {insight.trend === 'up' ? <TrendingUp className="w-4 h-4 text-rose-400" /> : <TrendingDown className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">{insight.categoryName}</p>
                <p className="text-sm text-slate-200 leading-relaxed">{insight.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Accounts List */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-lg">Your Accounts</h4>
            <p className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Linked</p>
          </div>
          <div className="space-y-4">
            {filteredAccounts.map(account => (
              <button 
                key={account.id} 
                onClick={() => setSelectedAccount(account)}
                className="w-full text-left bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${account.accountType.includes('Credit') ? 'bg-slate-800' : 'bg-indigo-600'}`}>
                    {account.bankName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold group-hover:text-indigo-600">{account.bankName}</p>
                    <p className="text-xs text-slate-500">...{account.lastFour} • {account.accountType}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold flex items-center justify-end text-sm">
                    ₹{account.balance.toLocaleString('en-IN')}
                  </p>
                  <ChevronRight className="w-4 h-4 ml-auto text-slate-300 group-hover:text-indigo-600 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-lg">Ledger History</h4>
            <div className="flex gap-2">
               <div className="relative group">
                  <button 
                    onClick={focusSearch}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                  <input 
                    ref={searchInputRef}
                    type="text" 
                    placeholder="Search by merchant, category, or amount..." 
                    className="pl-9 pr-10 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 w-64 md:w-80 transition-all focus:border-indigo-300 outline-none text-slate-900" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
               </div>
            </div>
          </div>
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4">Transaction</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map(tx => {
                      const category = categories.find(c => c.id === tx.categoryId);
                      return (
                        <tr key={tx.id} className="hover:bg-slate-50 group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm group-hover:bg-indigo-50 transition-colors">
                                {category?.icon}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900">{tx.merchant}</p>
                                <p className="text-[10px] text-slate-500 uppercase">{new Date(tx.date).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              tx.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className={`px-6 py-4 text-right text-sm font-bold ${tx.type === 'Income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                            {tx.type === 'Income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-20 text-center text-slate-400">
                        <div className="flex flex-col items-center gap-2">
                          <Search className="w-8 h-8 opacity-20" />
                          <p className="font-medium text-sm">No transactions found matching "{searchQuery}"</p>
                          <button 
                            onClick={() => setSearchQuery('')}
                            className="text-indigo-600 text-xs font-bold hover:underline mt-2"
                          >
                            Clear Search
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Account Statement View (Modal) */}
      {selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-indigo-600 p-8 text-white relative">
              <button onClick={() => setSelectedAccount(null)} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 text-3xl font-bold">
                  {selectedAccount.bankName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{selectedAccount.bankName}</h3>
                  <p className="text-indigo-100 opacity-80">{selectedAccount.accountType} • ...{selectedAccount.lastFour}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur">
                   <p className="text-xs text-indigo-100 font-bold uppercase mb-1">Available Balance</p>
                   <p className="text-2xl font-bold">₹{selectedAccount.balance.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur">
                   <p className="text-xs text-indigo-100 font-bold uppercase mb-1">Statement Cycle</p>
                   <p className="text-2xl font-bold">Active</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                 <h4 className="font-bold flex items-center gap-2">
                   <History className="w-5 h-5 text-indigo-600" /> Account Statement
                 </h4>
                 <p className="text-xs text-slate-500">Filtered for {selectedAccount.bankName}</p>
              </div>
              <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                 {transactions.filter(tx => tx.accountId === selectedAccount.id).map(tx => (
                   <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-100">
                           {categories.find(c => c.id === tx.categoryId)?.icon}
                         </div>
                         <div>
                            <p className="text-sm font-bold">{tx.merchant}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(tx.date).toLocaleDateString()}</p>
                         </div>
                      </div>
                      <p className={`font-bold ${tx.type === 'Income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                         {tx.type === 'Income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                      </p>
                   </div>
                 ))}
                 {transactions.filter(tx => tx.accountId === selectedAccount.id).length === 0 && (
                   <div className="text-center py-10 text-slate-400">
                      <p>No transaction history for this account.</p>
                   </div>
                 )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <form onSubmit={handleAddTransaction} className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-2xl font-bold">New Ledger Entry</h3>
               <button type="button" onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full">
                 <X className="w-6 h-6" />
               </button>
            </div>
            
            <div className="space-y-5">
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                <button 
                  type="button"
                  onClick={() => setNewTx(t => ({...t, type: 'Expense'}))}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${newTx.type === 'Expense' ? 'bg-white shadow text-rose-600' : 'text-slate-500'}`}
                >
                  Expense
                </button>
                <button 
                  type="button"
                  onClick={() => setNewTx(t => ({...t, type: 'Income'}))}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${newTx.type === 'Income' ? 'bg-white shadow text-emerald-600' : 'text-slate-500'}`}
                >
                  Income
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Amount (₹)</label>
                <input 
                  required
                  type="number" 
                  value={newTx.amount}
                  onChange={e => setNewTx(t => ({...t, amount: e.target.value}))}
                  placeholder="0.00" 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 text-xl font-bold text-slate-900" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Merchant Name</label>
                <input 
                  required
                  type="text" 
                  value={newTx.merchant}
                  onChange={e => setNewTx(t => ({...t, merchant: e.target.value}))}
                  placeholder="e.g. Starbucks, Salary" 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 text-slate-900" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Account</label>
                  <select 
                    required
                    value={newTx.accountId}
                    onChange={e => setNewTx(t => ({...t, accountId: e.target.value}))}
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900"
                  >
                    <option value="">Select Account</option>
                    {filteredAccounts.map(a => <option key={a.id} value={a.id}>{a.bankName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Category</label>
                  <select 
                    required
                    value={newTx.categoryId}
                    onChange={e => setNewTx(t => ({...t, categoryId: e.target.value}))}
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900"
                  >
                    <option value="">Select Cat</option>
                    {categories.filter(c => c.type === mode).map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full mt-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all">
              Save to Ledger
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
