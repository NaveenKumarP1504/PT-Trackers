
export enum AppMode {
  PERSONAL = 'PERSONAL',
  BUSINESS = 'BUSINESS'
}

export type Category = {
  id: string;
  name: string;
  icon: string;
  type: AppMode;
  color: string;
};

export type Account = {
  id: string;
  bankName: string;
  accountType: 'Savings' | 'Checking' | 'Credit Card' | 'Business Current';
  accountNumber: string;
  balance: number;
  lastFour: string;
  mode: AppMode;
};

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  merchant: string;
  categoryId: string;
  accountId: string;
  type: 'Expense' | 'Income';
  status: 'Completed' | 'Pending';
};

export type Budget = {
  id: string;
  categoryId: string;
  limit: number;
  spent: number;
  mode: AppMode;
};

export interface User {
  name: string;
  email: string;
  avatar?: string;
  isLoggedIn: boolean;
}

export interface AppPreferences {
  currency: string;
  notifications: boolean;
  darkMode: boolean;
}

export interface DataState {
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  mode: AppMode;
  user: User;
  preferences: AppPreferences;
}
