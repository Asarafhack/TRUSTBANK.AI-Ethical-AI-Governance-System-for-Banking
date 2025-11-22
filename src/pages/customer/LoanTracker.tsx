import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/lib/auth';
import { storageService } from '@/lib/storage';
import { PreviousLoan, LoanPayment } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CreditCard, Calendar, DollarSign, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';

export default function LoanTracker() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [loans, setLoans] = useState<PreviousLoan[]>([]);
  const [payments, setPayments] = useState<LoanPayment[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadData();
  }, [user, navigate]);

  const loadData = () => {
    if (user) {
      const userLoans = storageService.getPreviousLoansByUser(user.id);
      const userPayments = storageService.getLoanPaymentsByUser(user.id);
      setLoans(userLoans);
      setPayments(userPayments);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-primary">Active</Badge>;
      case 'completed':
        return <Badge variant="outline" className="border-success text-success">Completed</Badge>;
      case 'defaulted':
        return <Badge variant="destructive">Defaulted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getLoanProgress = (loan: PreviousLoan) => {
    const totalPaid = loan.amount - loan.remainingBalance;
    return (totalPaid / loan.amount) * 100;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/customer/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Loan Tracker</h1>
              <p className="text-sm text-muted-foreground">Track your loan payments in real-time</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Active Loans */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Loans</h2>
            <div className="space-y-4">
              {loans.map((loan) => (
                <Card key={loan.id} className="glass-card shadow-card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        {loan.purpose}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Started {format(new Date(loan.startDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    {getStatusBadge(loan.status)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Loan Amount</p>
                      <p className="text-lg font-bold">${loan.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Remaining</p>
                      <p className="text-lg font-bold text-warning">${loan.remainingBalance.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Monthly Payment</p>
                      <p className="text-lg font-bold">${loan.monthlyPayment.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Paid So Far</p>
                      <p className="text-lg font-bold text-success">
                        ${(loan.amount - loan.remainingBalance).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Repayment Progress</span>
                      <span className="font-semibold">{getLoanProgress(loan).toFixed(1)}%</span>
                    </div>
                    <Progress value={getLoanProgress(loan)} className="h-3" />
                  </div>

                  {loan.status === 'completed' && loan.endDate && (
                    <div className="mt-4 p-3 bg-success/10 rounded-lg">
                      <p className="text-sm text-success">
                        ✓ Loan completed on {format(new Date(loan.endDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  )}
                </Card>
              ))}

              {loans.length === 0 && (
                <Card className="glass-card shadow-card p-12 text-center">
                  <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Loans Found</h3>
                  <p className="text-muted-foreground mb-6">
                    You don't have any active or previous loans.
                  </p>
                  <Button onClick={() => navigate('/customer/loan-apply')}>
                    Apply for a Loan
                  </Button>
                </Card>
              )}
            </div>
          </div>

          {/* Recent Payments */}
          {payments.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>
              <div className="space-y-3">
                {payments.slice(0, 10).map((payment) => (
                  <Card key={payment.id} className="glass-card shadow-card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-success/10">
                          <TrendingDown className="w-4 h-4 text-success" />
                        </div>
                        <div>
                          <p className="font-semibold">Loan Payment</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(payment.timestamp), 'MMM dd, yyyy • hh:mm a')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">${payment.amount.toFixed(2)}</p>
                        <Badge variant="outline" className="border-success text-success mt-1">
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
