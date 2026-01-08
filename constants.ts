
import { AppMode, Category, Account, Transaction, Budget } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  // Personal Categories
  { id: 'p1', name: 'Groceries', icon: '🛒', type: AppMode.PERSONAL, color: '#10b981' },
  { id: 'p2', name: 'Rent', icon: '🏠', type: AppMode.PERSONAL, color: '#3b82f6' },
  { id: 'p3', name: 'Dining Out', icon: '🍕', type: AppMode.PERSONAL, color: '#f59e0b' },
  { id: 'p4', name: 'Entertainment', icon: '🎬', type: AppMode.PERSONAL, color: '#8b5cf6' },
  { id: 'p5', name: 'Transport', icon: '🚗', type: AppMode.PERSONAL, color: '#ef4444' },
  // Business Categories
  { id: 'b1', name: 'Payroll', icon: '👥', type: AppMode.BUSINESS, color: '#3b82f6' },
  { id: 'b2', name: 'Marketing', icon: '📢', type: AppMode.BUSINESS, color: '#ec4899' },
  { id: 'b3', name: 'Software/SaaS', icon: '💻', type: AppMode.BUSINESS, color: '#6366f1' },
  { id: 'b4', name: 'Office Rent', icon: '🏢', type: AppMode.BUSINESS, color: '#14b8a6' },
  { id: 'b5', name: 'Inventory', icon: '📦', type: AppMode.BUSINESS, color: '#f97316' },
];

export const INITIAL_ACCOUNTS: Account[] = [
  { id: 'a1', bankName: 'SBI Bank', accountType: 'Savings', accountNumber: 'XXXXXX4421', lastFour: '4421', balance: 45200.50, mode: AppMode.PERSONAL },
  { id: 'a2', bankName: 'HDFC Bank', accountType: 'Checking', accountNumber: 'XXXXXX9822', lastFour: '9822', balance: 125400.00, mode: AppMode.PERSONAL },
  { id: 'a3', bankName: 'ICICI Credit', accountType: 'Credit Card', accountNumber: 'XXXXXX1002', lastFour: '1002', balance: -15000.00, mode: AppMode.PERSONAL },
  { id: 'a4', bankName: 'Axis Business', accountType: 'Business Current', accountNumber: 'XXXXXX5543', lastFour: '5543', balance: 850000.00, mode: AppMode.BUSINESS },
];

const generateTransactions = (): Transaction[] => {
  const txs: Transaction[] = [];
  const personalCategories = INITIAL_CATEGORIES.filter(c => c.type === AppMode.PERSONAL);
  const businessCategories = INITIAL_CATEGORIES.filter(c => c.type === AppMode.BUSINESS);

  // Helper for generating random transactions
  for (let i = 0; i < 200; i++) {
    const isPersonal = Math.random() > 0.5;
    const categories = isPersonal ? personalCategories : businessCategories;
    const accountIds = INITIAL_ACCOUNTS.filter(a => a.mode === (isPersonal ? AppMode.PERSONAL : AppMode.BUSINESS)).map(a => a.id);
    
    if (accountIds.length === 0) continue;

    const cat = categories[Math.floor(Math.random() * categories.length)];
    const accId = accountIds[Math.floor(Math.random() * accountIds.length)];
    const amount = Math.floor(Math.random() * 5000) + 100;
    
    txs.push({
      id: `tx-${i}`,
      date: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: amount,
      merchant: isPersonal 
        ? ['Big Bazaar', 'Amazon', 'Netflix', 'Uber', 'Zomato', 'Swiggy', 'Reliance Digital', 'PVR Cinemas', 'Airtel', 'Jio'][Math.floor(Math.random() * 10)] 
        : ['Google Cloud', 'AWS', 'LinkedIn Ads', 'Coworking Space', 'Staples', 'Upwork', 'GoDaddy', 'Mailchimp', 'Adobe', 'Zoom'][Math.floor(Math.random() * 10)],
      categoryId: cat.id,
      accountId: accId,
      type: 'Expense',
      status: 'Completed'
    });
  }
  
  // Add some income
  txs.push({
    id: 'tx-income-1',
    date: new Date().toISOString().split('T')[0],
    amount: 150000,
    merchant: 'Corporate Salary',
    categoryId: 'p1', 
    accountId: 'a1',
    type: 'Income',
    status: 'Completed'
  });

  return txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const INITIAL_TRANSACTIONS = generateTransactions();

export const INITIAL_BUDGETS: Budget[] = [
  { id: 'bg1', categoryId: 'p1', limit: 15000, spent: 8200, mode: AppMode.PERSONAL },
  { id: 'bg2', categoryId: 'p3', limit: 5000, spent: 6200, mode: AppMode.PERSONAL },
  { id: 'bg3', categoryId: 'b2', limit: 50000, spent: 34000, mode: AppMode.BUSINESS },
];
