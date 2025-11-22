export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  createdAt: string;
}

export interface CustomerProfile {
  userId: string;
  income: number;
  creditScore: number;
  age: number;
  existingLoans: number;
  employmentType: 'salaried' | 'self-employed' | 'unemployed';
  riskScore: number;
  segment: string;
}

export interface ConsentSettings {
  userId: string;
  income: boolean;
  location: boolean;
  transactionHistory: boolean;
  deviceInfo: boolean;
  behavioralData: boolean;
}

export interface AIDecision {
  id: string;
  userId: string;
  type: 'loan' | 'fraud';
  result: 'approved' | 'rejected' | 'suspicious' | 'normal' | 'high-risk';
  confidence: number;
  factors: DecisionFactor[];
  explanation: string;
  timestamp: string;
  consentSnapshot: ConsentSettings;
  overridden: boolean;
  overrideReason?: string;
  overriddenBy?: string;
  overrideTimestamp?: string;
}

export interface DecisionFactor {
  name: string;
  value: string | number;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
}

export interface LoanApplication {
  userId: string;
  amount: number;
  purpose: string;
  income: number;
  existingLoans: number;
  creditScore: number;
  employmentType: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  merchant: string;
  category: string;
  timestamp: string;
  location: string;
  deviceChanged: boolean;
  flagged: boolean;
  riskLevel?: 'normal' | 'suspicious' | 'high-risk';
  type: 'debit' | 'credit';
}

export interface AccountBalance {
  userId: string;
  balance: number;
  lastUpdated: string;
}

export interface Incident {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'fraud' | 'dispute' | 'technical' | 'other';
  status: 'pending' | 'investigating' | 'resolved';
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
}

export interface LoanPayment {
  id: string;
  userId: string;
  loanId: string;
  amount: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  remainingBalance: number;
}

export interface PreviousLoan {
  id: string;
  userId: string;
  amount: number;
  purpose: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'defaulted';
  monthlyPayment: number;
  remainingBalance: number;
}
