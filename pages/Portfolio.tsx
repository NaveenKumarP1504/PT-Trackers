
import React, { useMemo } from 'react';
import { 
  PieChart as RePieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { Download, Calendar, Filter, Share2 } from 'lucide-react';
import { useApp } from '../App';
import { AppMode } from '../types';

const Portfolio: React.FC = () => {
  const { transactions, categories, mode, accounts } = useApp();

  const filteredTransactions = transactions.filter(tx => {
    const acc = accounts.find(a => a.id === tx.accountId);
    return acc && acc.mode === mode;
  });

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredTransactions.filter(tx => tx.type === 'Expense').forEach(tx => {
      counts[tx.categoryId] = (counts[tx.categoryId] || 0) + tx.amount;
    });

    return Object.entries(counts).map(([catId, value]) => ({
      name: categories.find(c => c.id === catId)?.name || 'Other',
      value,
      color: categories.find(c => c.id === catId)?.color || '#94a3b8'
    })).sort((a, b) => b.value - a.value);
  }, [filteredTransactions, categories]);

  const monthlyTrendData = useMemo(() => {
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, idx) => ({
      name: month,
      expenses: Math.floor(Math.random() * 40000) + 20000,
      income: Math.floor(Math.random() * 50000) + 30000,
    }));
  }, []);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Spending Portfolio</h2>
          <p className="text-slate-500">Visualizing your financial data for deeper insights.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50">
            <Calendar className="w-4 h-4" /> Last 6 Months
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Spending Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-bold text-lg">Expense Breakdown</h4>
            <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">By Category</div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-bold text-lg">Cash Flow Trend</h4>
            <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Income vs Expense</div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                   formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={3} />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h4 className="font-bold text-xl mb-6">Category Comparison</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="pb-4 px-2">Category</th>
                <th className="pb-4 px-2">Transactions</th>
                <th className="pb-4 px-2">Total Amount</th>
                <th className="pb-4 px-2">Percentage</th>
                <th className="pb-4 px-2 text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categoryData.map(item => {
                const total = categoryData.reduce((s, i) => s + i.value, 0);
                const percent = ((item.value / total) * 100).toFixed(1);
                return (
                  <tr key={item.name} className="group">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-bold text-slate-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-slate-500 text-sm">
                      {Math.floor(Math.random() * 15) + 1} txns
                    </td>
                    <td className="py-4 px-2 font-bold text-slate-900">
                      ₹{item.value.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden w-24">
                          <div className="h-full bg-indigo-600" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="text-xs font-bold text-slate-600">{percent}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-right">
                       <span className={`text-xs font-bold px-2 py-1 rounded-full ${Math.random() > 0.5 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                         {Math.random() > 0.5 ? '↓ 4%' : '↑ 12%'}
                       </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
