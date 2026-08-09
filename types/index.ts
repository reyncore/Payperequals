export type Role = "USER" | "ADMIN";
export type TransactionType = "TOPUP" | "DEDUCTION";

export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  role: Role;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  note?: string | null;
  createdAt: string;
  user?: Pick<User, "id" | "name" | "email">;
}

export interface Calculation {
  id: string;
  userId: string;
  expression: string;
  result: string;
  cost: number;
  mode: string;
  isFree: boolean;
  createdAt: string;
  user?: Pick<User, "id" | "name" | "email">;
}

export interface DashboardStats {
  balance: number;
  totalSpent: number;
  totalCalculations: number;
  recentTransactions: Transaction[];
  recentCalculations: Calculation[];
}

export interface AdminStats {
  totalUsers: number;
  totalTransactions: number;
  totalRevenue: number;
  totalCalculations: number;
  users: (User & {
    _count: { transactions: number; calculations: number };
  })[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CalculateRequest {
  expression: string;
}

export interface CalculateResponse {
  result: string;
  expression: string;
  cost: number;
  balance: number;
  funMessage: string;
}

export interface TopUpRequest {
  amount: number;
}

export interface TopUpResponse {
  balance: number;
  amount: number;
}
