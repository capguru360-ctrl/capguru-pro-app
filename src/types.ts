export type Step = 
  | 'landing' 
  | 'allocation-input' 
  | 'allocation-result' 
  | 'health-input' 
  | 'health-result' 
  | 'lead-capture-1' 
  | 'lead-capture-2' 
  | 'premium' 
  | 'payment';

export interface UserData {
  name: string;
  age: number;
  annualIncome: number;
  
  // Allocation
  investableAmount: number;
  equityPercent: number;
  debtPercent: number;
  balancePercent: number;
  
  // Health Input
  debtTools: string[]; // FD, PPF, RD
  equityTools: string[]; // Shares, MF, ULIP
  debtToolAmounts: {
    FD: number;
    PPF: number;
    RD: number;
  };
  equityToolAmounts: {
    Shares: number;
    MF: number;
    ULIP: number;
  };
  hasTermPlan: boolean;
  hasHealthPlan: boolean;
  monthlyExpenses: number;
  emergencyFund: number;
  
  // Health Result
  healthScore: number;
  healthStage: 'Building' | 'Growing' | 'Strong';
  healthBreakdown?: {
    discipline: number;
    protection: number;
    allocation: number;
    penalties: number;
  };
  
  // Lead Capture
  phone: string;
  maritalStatus: 'Single' | 'Married';
  spouseName?: string;
  spouseDob?: string;
  children: { name: string; age: number }[];
}

export const INITIAL_USER_DATA: UserData = {
  name: '',
  age: 30,
  annualIncome: 0,
  investableAmount: 0,
  equityPercent: 0,
  debtPercent: 0,
  balancePercent: 0,
  debtTools: [],
  equityTools: [],
  debtToolAmounts: {
    FD: 0,
    PPF: 0,
    RD: 0,
  },
  equityToolAmounts: {
    Shares: 0,
    MF: 0,
    ULIP: 0,
  },
  hasTermPlan: false,
  hasHealthPlan: false,
  monthlyExpenses: 0,
  emergencyFund: 0,
  healthScore: 0,
  healthStage: 'Building',
  phone: '',
  maritalStatus: 'Single',
  children: [],
};
