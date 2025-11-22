import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/lib/auth';
import { storageService } from '@/lib/storage';
import { AIDecision } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  CreditCard, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  LogOut,
  Settings,
  User,
  TrendingUp,
  Shield,
  Wallet,
  Send,
  History,
  FileText
} from 'lucide-react';
import { DecisionCard } from '@/components/customer/DecisionCard';
import { CibilScoreGauge } from '@/components/customer/CibilScoreGauge';
import { MoneyTransferDialog } from '@/components/customer/MoneyTransferDialog';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [decisions, setDecisions] = useState<AIDecision[]>([]);
  const [balance, setBalance] = useState(0);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    storageService.initializeDemoData(user.id);
    loadDecisions();
    loadBalance();
  }, [user, navigate]);

  const loadDecisions = () => {
    if (user) {
      const userDecisions = storageService.getDecisionsByUser(user.id);
      setDecisions(userDecisions);
    }
  };

  const loadBalance = () => {
    if (user) {
      const accountBalance = storageService.getBalance(user.id);
      setBalance(accountBalance.balance);
    }
  };

  const handleTransferComplete = () => {
    loadBalance();
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const loanDecisions = decisions.filter(d => d.type === 'loan');
  const fraudDecisions = decisions.filter(d => d.type === 'fraud');
  const approvedLoans = loanDecisions.filter(d => d.result === 'approved').length;
  const flaggedTransactions = fraudDecisions.filter(d => d.result !== 'normal').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">TrustBank.AI</h1>
                <p className="text-sm text-muted-foreground">Customer Portal</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
              <Button variant="ghost" size="icon" onClick={() => navigate('/customer/profile')}>
                <User className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate('/customer/consent')}>
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Account Balance & CIBIL Score */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card shadow-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-4xl font-bold mt-2">${balance.toLocaleString()}</p>
              </div>
              <Wallet className="w-12 h-12 text-primary" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              <Button 
                variant="outline" 
                className="h-auto py-4 flex-col gap-2"
                onClick={() => setTransferDialogOpen(true)}
              >
                <Send className="w-5 h-5" />
                <span className="text-xs">Send Money</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex-col gap-2"
                onClick={() => navigate('/customer/transactions')}
              >
                <History className="w-5 h-5" />
                <span className="text-xs">Transactions</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex-col gap-2"
                onClick={() => navigate('/customer/loan-tracker')}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs">Track Loans</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex-col gap-2"
                onClick={() => navigate('/customer/incident-report')}
              >
                <FileText className="w-5 h-5" />
                <span className="text-xs">Report Issue</span>
              </Button>
            </div>
          </Card>

          <CibilScoreGauge score={user ? storageService.getProfile(user.id)?.creditScore || 720 : 720} />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Decisions</p>
                <p className="text-3xl font-bold mt-1">{decisions.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="glass-card shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Loan Applications</p>
                <p className="text-3xl font-bold mt-1">{loanDecisions.length}</p>
              </div>
              <CreditCard className="w-8 h-8 text-accent" />
            </div>
          </Card>

          <Card className="glass-card shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved Loans</p>
                <p className="text-3xl font-bold mt-1">{approvedLoans}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
          </Card>

          <Card className="glass-card shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fraud Alerts</p>
                <p className="text-3xl font-bold mt-1">{flaggedTransactions}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-warning" />
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button 
            className="h-24 gradient-primary text-lg font-semibold"
            onClick={() => navigate('/customer/loan-apply')}
          >
            Apply for New Loan
          </Button>
          <Button 
            variant="outline"
            className="h-24 text-lg font-semibold"
            onClick={() => navigate('/customer/consent')}
          >
            Manage Data Consent
          </Button>
          <Button 
            variant="outline"
            className="h-24 text-lg font-semibold"
            onClick={() => navigate('/customer/profile')}
          >
            View My AI Profile
          </Button>
        </div>

        {/* Recent Decisions */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Recent AI Decisions</h2>
          
          {decisions.length === 0 ? (
            <Card className="glass-card shadow-card p-12 text-center">
              <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Decisions Yet</h3>
              <p className="text-muted-foreground mb-6">
                Apply for a loan or wait for transaction analysis to see AI decisions here.
              </p>
              <Button onClick={() => navigate('/customer/loan-apply')}>
                Apply for Your First Loan
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {decisions.slice(0, 10).map(decision => (
                <DecisionCard 
                  key={decision.id} 
                  decision={decision}
                  onRefresh={loadDecisions}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <MoneyTransferDialog
        open={transferDialogOpen}
        onOpenChange={setTransferDialogOpen}
        currentBalance={balance}
        onTransferComplete={handleTransferComplete}
      />
    </div>
  );
}
