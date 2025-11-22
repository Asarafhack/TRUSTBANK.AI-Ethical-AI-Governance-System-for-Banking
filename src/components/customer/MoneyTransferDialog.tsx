import { useState } from 'react';
import { authService } from '@/lib/auth';
import { storageService } from '@/lib/storage';
import { Transaction, AccountBalance } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpRight, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MoneyTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBalance: number;
  onTransferComplete: () => void;
}

export function MoneyTransferDialog({ open, onOpenChange, currentBalance, onTransferComplete }: MoneyTransferDialogProps) {
  const user = authService.getCurrentUser();
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [purpose, setPurpose] = useState('personal');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleTransfer = () => {
    if (!user) return;

    const transferAmount = parseFloat(amount);
    
    if (isNaN(transferAmount) || transferAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (transferAmount > currentBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this transfer",
        variant: "destructive",
      });
      return;
    }

    // Create transaction
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      userId: user.id,
      amount: transferAmount,
      merchant: recipient || 'Transfer',
      category: purpose === 'loan' ? 'Loan Payment' : 'Transfer',
      timestamp: new Date().toISOString(),
      location: 'Online Transfer',
      deviceChanged: false,
      flagged: false,
      riskLevel: 'normal',
      type: 'debit',
    };

    storageService.saveTransaction(transaction);

    // Update balance
    const newBalance = currentBalance - transferAmount;
    const balanceUpdate: AccountBalance = {
      userId: user.id,
      balance: newBalance,
      lastUpdated: new Date().toISOString(),
    };
    storageService.saveBalance(balanceUpdate);

    // If it's a loan payment, save it
    if (purpose === 'loan') {
      const previousLoans = storageService.getPreviousLoansByUser(user.id);
      const activeLoan = previousLoans.find(l => l.status === 'active');
      
      if (activeLoan) {
        const payment = {
          id: crypto.randomUUID(),
          userId: user.id,
          loanId: activeLoan.id,
          amount: transferAmount,
          timestamp: new Date().toISOString(),
          status: 'completed' as const,
          remainingBalance: Math.max(0, activeLoan.remainingBalance - transferAmount),
        };
        storageService.saveLoanPayment(payment);

        // Update loan
        activeLoan.remainingBalance = payment.remainingBalance;
        if (payment.remainingBalance === 0) {
          activeLoan.status = 'completed';
          activeLoan.endDate = new Date().toISOString();
        }
        storageService.savePreviousLoan(activeLoan);
      }
    }

    setShowConfirmation(true);

    setTimeout(() => {
      setShowConfirmation(false);
      onOpenChange(false);
      setAmount('');
      setRecipient('');
      setPurpose('personal');
      onTransferComplete();
    }, 2000);
  };

  if (showConfirmation) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Transfer Successful!</h3>
            <p className="text-muted-foreground mb-4">
              ${parseFloat(amount).toFixed(2)} has been transferred
            </p>
            <p className="text-sm text-muted-foreground">
              New Balance: <span className="font-bold text-foreground">${(currentBalance - parseFloat(amount)).toFixed(2)}</span>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Money</DialogTitle>
          <DialogDescription>
            Transfer money to another account or make a payment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
            <p className="text-xs text-muted-foreground">
              Available Balance: ${currentBalance.toFixed(2)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Select value={purpose} onValueChange={setPurpose}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal Transfer</SelectItem>
                <SelectItem value="loan">Loan Payment</SelectItem>
                <SelectItem value="bills">Bill Payment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient / Description</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter recipient name or description"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleTransfer} className="gradient-primary">
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
