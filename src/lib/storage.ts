import { CustomerProfile, ConsentSettings, AIDecision, Transaction, AccountBalance, Incident, LoanPayment, PreviousLoan } from '@/types';

const PROFILES_KEY = 'trustbank_profiles';
const CONSENT_KEY = 'trustbank_consent';
const DECISIONS_KEY = 'trustbank_decisions';
const TRANSACTIONS_KEY = 'trustbank_transactions';
const BALANCE_KEY = 'trustbank_balance';
const INCIDENTS_KEY = 'trustbank_incidents';
const LOAN_PAYMENTS_KEY = 'trustbank_loan_payments';
const PREVIOUS_LOANS_KEY = 'trustbank_previous_loans';

export const storageService = {
  // Profile Management
  getProfile: (userId: string): CustomerProfile | null => {
    const profiles = storageService.getAllProfiles();
    return profiles.find(p => p.userId === userId) || null;
  },

  saveProfile: (profile: CustomerProfile): void => {
    const profiles = storageService.getAllProfiles();
    const index = profiles.findIndex(p => p.userId === profile.userId);
    
    if (index >= 0) {
      profiles[index] = profile;
    } else {
      profiles.push(profile);
    }
    
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  },

  getAllProfiles: (): CustomerProfile[] => {
    const str = localStorage.getItem(PROFILES_KEY);
    return str ? JSON.parse(str) : [];
  },

  // Consent Management
  getConsent: (userId: string): ConsentSettings => {
    const consents = storageService.getAllConsents();
    const userConsent = consents.find(c => c.userId === userId);
    
    if (userConsent) {
      return userConsent;
    }

    // Default: all enabled
    const defaultConsent: ConsentSettings = {
      userId,
      income: true,
      location: true,
      transactionHistory: true,
      deviceInfo: true,
      behavioralData: true,
    };
    
    storageService.saveConsent(defaultConsent);
    return defaultConsent;
  },

  saveConsent: (consent: ConsentSettings): void => {
    const consents = storageService.getAllConsents();
    const index = consents.findIndex(c => c.userId === consent.userId);
    
    if (index >= 0) {
      consents[index] = consent;
    } else {
      consents.push(consent);
    }
    
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consents));
  },

  getAllConsents: (): ConsentSettings[] => {
    const str = localStorage.getItem(CONSENT_KEY);
    return str ? JSON.parse(str) : [];
  },

  // Decision Management
  saveDecision: (decision: AIDecision): void => {
    const decisions = storageService.getAllDecisions();
    decisions.unshift(decision); // Add to beginning for recent first
    localStorage.setItem(DECISIONS_KEY, JSON.stringify(decisions));
  },

  getDecisionsByUser: (userId: string): AIDecision[] => {
    return storageService.getAllDecisions().filter(d => d.userId === userId);
  },

  getAllDecisions: (): AIDecision[] => {
    const str = localStorage.getItem(DECISIONS_KEY);
    return str ? JSON.parse(str) : [];
  },

  updateDecision: (decisionId: string, updates: Partial<AIDecision>): void => {
    const decisions = storageService.getAllDecisions();
    const index = decisions.findIndex(d => d.id === decisionId);
    
    if (index >= 0) {
      decisions[index] = { ...decisions[index], ...updates };
      localStorage.setItem(DECISIONS_KEY, JSON.stringify(decisions));
    }
  },

  // Transaction Management
  saveTransaction: (transaction: Transaction): void => {
    const transactions = storageService.getAllTransactions();
    transactions.unshift(transaction);
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  },

  getTransactionsByUser: (userId: string): Transaction[] => {
    return storageService.getAllTransactions().filter(t => t.userId === userId);
  },

  getAllTransactions: (): Transaction[] => {
    const str = localStorage.getItem(TRANSACTIONS_KEY);
    return str ? JSON.parse(str) : [];
  },

  // Account Balance Management
  getBalance: (userId: string): AccountBalance => {
    const balances = storageService.getAllBalances();
    const userBalance = balances.find(b => b.userId === userId);
    
    if (userBalance) {
      return userBalance;
    }

    const defaultBalance: AccountBalance = {
      userId,
      balance: 50000,
      lastUpdated: new Date().toISOString(),
    };
    
    storageService.saveBalance(defaultBalance);
    return defaultBalance;
  },

  saveBalance: (balance: AccountBalance): void => {
    const balances = storageService.getAllBalances();
    const index = balances.findIndex(b => b.userId === balance.userId);
    
    if (index >= 0) {
      balances[index] = balance;
    } else {
      balances.push(balance);
    }
    
    localStorage.setItem(BALANCE_KEY, JSON.stringify(balances));
  },

  getAllBalances: (): AccountBalance[] => {
    const str = localStorage.getItem(BALANCE_KEY);
    return str ? JSON.parse(str) : [];
  },

  // Incident Management
  saveIncident: (incident: Incident): void => {
    const incidents = storageService.getAllIncidents();
    incidents.unshift(incident);
    localStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents));
  },

  getIncidentsByUser: (userId: string): Incident[] => {
    return storageService.getAllIncidents().filter(i => i.userId === userId);
  },

  getAllIncidents: (): Incident[] => {
    const str = localStorage.getItem(INCIDENTS_KEY);
    return str ? JSON.parse(str) : [];
  },

  // Loan Payment Management
  saveLoanPayment: (payment: LoanPayment): void => {
    const payments = storageService.getAllLoanPayments();
    payments.unshift(payment);
    localStorage.setItem(LOAN_PAYMENTS_KEY, JSON.stringify(payments));
  },

  getLoanPaymentsByUser: (userId: string): LoanPayment[] => {
    return storageService.getAllLoanPayments().filter(p => p.userId === userId);
  },

  getAllLoanPayments: (): LoanPayment[] => {
    const str = localStorage.getItem(LOAN_PAYMENTS_KEY);
    return str ? JSON.parse(str) : [];
  },

  // Previous Loans Management
  savePreviousLoan: (loan: PreviousLoan): void => {
    const loans = storageService.getAllPreviousLoans();
    loans.unshift(loan);
    localStorage.setItem(PREVIOUS_LOANS_KEY, JSON.stringify(loans));
  },

  getPreviousLoansByUser: (userId: string): PreviousLoan[] => {
    return storageService.getAllPreviousLoans().filter(l => l.userId === userId);
  },

  getAllPreviousLoans: (): PreviousLoan[] => {
    const str = localStorage.getItem(PREVIOUS_LOANS_KEY);
    return str ? JSON.parse(str) : [];
  },

  // Initialize with demo data
  initializeDemoData: (userId: string): void => {
    const profile = storageService.getProfile(userId);
    
    if (!profile) {
      const demoProfile: CustomerProfile = {
        userId,
        income: 75000,
        creditScore: 720,
        age: 32,
        existingLoans: 1,
        employmentType: 'salaried',
        riskScore: 25,
        segment: 'Low risk, salaried professional',
      };
      storageService.saveProfile(demoProfile);
    }

    // Create some demo transactions
    const transactions = storageService.getTransactionsByUser(userId);
    if (transactions.length === 0) {
      const demoTransactions: Transaction[] = [
        {
          id: crypto.randomUUID(),
          userId,
          amount: 150.50,
          merchant: 'Amazon',
          category: 'Shopping',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          location: 'New York, US',
          deviceChanged: false,
          flagged: false,
          riskLevel: 'normal',
          type: 'debit',
        },
        {
          id: crypto.randomUUID(),
          userId,
          amount: 2500.00,
          merchant: 'International Wire',
          category: 'Transfer',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          location: 'Lagos, Nigeria',
          deviceChanged: true,
          flagged: true,
          riskLevel: 'suspicious',
          type: 'debit',
        },
        {
          id: crypto.randomUUID(),
          userId,
          amount: 5000.00,
          merchant: 'Salary Deposit',
          category: 'Income',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'New York, US',
          deviceChanged: false,
          flagged: false,
          riskLevel: 'normal',
          type: 'credit',
        },
        {
          id: crypto.randomUUID(),
          userId,
          amount: 75.00,
          merchant: 'Starbucks',
          category: 'Food & Dining',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          location: 'New York, US',
          deviceChanged: false,
          flagged: false,
          riskLevel: 'normal',
          type: 'debit',
        },
      ];

      demoTransactions.forEach(t => storageService.saveTransaction(t));
    }

    // Initialize balance
    storageService.getBalance(userId);

    // Initialize previous loans
    const previousLoans = storageService.getPreviousLoansByUser(userId);
    if (previousLoans.length === 0) {
      const demoLoans: PreviousLoan[] = [
        {
          id: crypto.randomUUID(),
          userId,
          amount: 10000,
          purpose: 'Car Loan',
          startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          monthlyPayment: 450,
          remainingBalance: 3500,
        },
      ];

      demoLoans.forEach(l => storageService.savePreviousLoan(l));
    }
  },
};
