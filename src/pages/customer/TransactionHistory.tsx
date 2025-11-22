import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/lib/auth';
import { storageService } from '@/lib/storage';
import { Transaction } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function TransactionHistory() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadTransactions();
  }, [user, navigate]);

  const loadTransactions = () => {
    if (user) {
      const userTransactions = storageService.getTransactionsByUser(user.id);
      setTransactions(userTransactions);
    }
  };

  const getRiskBadge = (riskLevel?: string, flagged?: boolean) => {
    if (flagged || riskLevel === 'suspicious' || riskLevel === 'high-risk') {
      return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Flagged</Badge>;
    }
    return <Badge variant="outline" className="border-success text-success"><CheckCircle className="w-3 h-3 mr-1" />Safe</Badge>;
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
              <h1 className="text-2xl font-bold">Transaction History</h1>
              <p className="text-sm text-muted-foreground">View all your transactions</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <Card key={transaction.id} className="glass-card shadow-card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-3 rounded-full ${transaction.type === 'credit' ? 'bg-success/10' : 'bg-destructive/10'}`}>
                    {transaction.type === 'credit' ? (
                      <ArrowDownLeft className="w-5 h-5 text-success" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{transaction.merchant}</h3>
                        <p className="text-sm text-muted-foreground">{transaction.category}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-bold ${transaction.type === 'credit' ? 'text-success' : 'text-foreground'}`}>
                          {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                      <span>{format(new Date(transaction.timestamp), 'MMM dd, yyyy • hh:mm a')}</span>
                      <span>•</span>
                      <span>{transaction.location}</span>
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                      {getRiskBadge(transaction.riskLevel, transaction.flagged)}
                      {transaction.deviceChanged && (
                        <Badge variant="outline" className="border-warning text-warning">
                          <AlertTriangle className="w-3 h-3 mr-1" />New Device
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {transactions.length === 0 && (
            <Card className="glass-card shadow-card p-12 text-center">
              <p className="text-muted-foreground">No transactions found</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
