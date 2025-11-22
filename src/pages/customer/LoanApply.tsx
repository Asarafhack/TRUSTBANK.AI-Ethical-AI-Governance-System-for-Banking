import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/lib/auth';
import { storageService } from '@/lib/storage';
import { aiEngine } from '@/lib/ai-engine';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function LoanApply() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    amount: '',
    purpose: '',
    income: '',
    existingLoans: '',
    creditScore: '',
    employmentType: 'salaried',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const profile = storageService.getProfile(user.id);
      const consent = storageService.getConsent(user.id);

      const application = {
        userId: user.id,
        amount: parseFloat(formData.amount),
        purpose: formData.purpose,
        income: parseFloat(formData.income),
        existingLoans: parseInt(formData.existingLoans),
        creditScore: parseInt(formData.creditScore),
        employmentType: formData.employmentType,
      };

      // Update profile with new data
      if (profile) {
        profile.income = application.income;
        profile.existingLoans = application.existingLoans;
        profile.creditScore = application.creditScore;
        profile.employmentType = application.employmentType as any;
        storageService.saveProfile(profile);
      } else {
        storageService.saveProfile({
          userId: user.id,
          income: application.income,
          creditScore: application.creditScore,
          age: 30,
          existingLoans: application.existingLoans,
          employmentType: application.employmentType as any,
          riskScore: 30,
          segment: 'Standard applicant',
        });
      }

      // Evaluate loan
      const decision = aiEngine.evaluateLoan(application, profile || {} as any, consent);
      storageService.saveDecision(decision);

      toast.success('Loan application processed!');
      
      setTimeout(() => {
        navigate('/customer/dashboard');
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to process application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/customer/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="glass-card shadow-elegant p-8">
          <h1 className="text-3xl font-bold mb-2">Apply for a Loan</h1>
          <p className="text-muted-foreground mb-8">
            Our AI will evaluate your application instantly and provide transparent reasoning.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Loan Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                min="1000"
                max="500000"
                step="1000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                placeholder="50000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Loan Purpose</Label>
              <Input
                id="purpose"
                type="text"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                required
                placeholder="Home renovation, business expansion, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="income">Annual Income ($)</Label>
              <Input
                id="income"
                type="number"
                min="0"
                step="1000"
                value={formData.income}
                onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                required
                placeholder="75000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="creditScore">Credit Score</Label>
              <Input
                id="creditScore"
                type="number"
                min="300"
                max="850"
                value={formData.creditScore}
                onChange={(e) => setFormData({ ...formData, creditScore: e.target.value })}
                required
                placeholder="720"
              />
              <p className="text-xs text-muted-foreground">Score between 300-850</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="existingLoans">Number of Existing Loans</Label>
              <Input
                id="existingLoans"
                type="number"
                min="0"
                value={formData.existingLoans}
                onChange={(e) => setFormData({ ...formData, existingLoans: e.target.value })}
                required
                placeholder="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employmentType">Employment Type</Label>
              <Select
                value={formData.employmentType}
                onValueChange={(value) => setFormData({ ...formData, employmentType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salaried">Salaried</SelectItem>
                  <SelectItem value="self-employed">Self-Employed</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full gradient-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              By submitting, you agree to our AI processing your data according to your consent settings.
            </p>
          </form>
        </Card>
      </main>
    </div>
  );
}
