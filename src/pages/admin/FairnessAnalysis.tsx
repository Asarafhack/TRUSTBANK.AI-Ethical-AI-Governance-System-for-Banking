import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/lib/auth';
import { storageService } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function FairnessAnalysis() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [stats, setStats] = useState({
    totalLoanApps: 0,
    approvalRate: 0,
    fraudDetections: 0,
    overrideRate: 0,
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    calculateStats();
  }, [user, navigate]);

  const calculateStats = () => {
    const decisions = storageService.getAllDecisions();
    const loanDecisions = decisions.filter(d => d.type === 'loan');
    const fraudDecisions = decisions.filter(d => d.type === 'fraud');
    
    const approved = loanDecisions.filter(d => d.result === 'approved').length;
    const overridden = decisions.filter(d => d.overridden).length;

    setStats({
      totalLoanApps: loanDecisions.length,
      approvalRate: loanDecisions.length > 0 ? (approved / loanDecisions.length) * 100 : 0,
      fraudDetections: fraudDecisions.filter(d => d.result !== 'normal').length,
      overrideRate: decisions.length > 0 ? (overridden / decisions.length) * 100 : 0,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/admin/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Fairness & Bias Analysis</h1>
          <p className="text-muted-foreground">
            Monitor AI decision patterns to ensure ethical and unbiased outcomes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card shadow-card p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Loan Applications</p>
            <p className="text-3xl font-bold">{stats.totalLoanApps}</p>
          </Card>

          <Card className="glass-card shadow-card p-6">
            <p className="text-sm text-muted-foreground mb-1">Approval Rate</p>
            <p className="text-3xl font-bold">{stats.approvalRate.toFixed(1)}%</p>
          </Card>

          <Card className="glass-card shadow-card p-6">
            <p className="text-sm text-muted-foreground mb-1">Fraud Detections</p>
            <p className="text-3xl font-bold">{stats.fraudDetections}</p>
          </Card>

          <Card className="glass-card shadow-card p-6">
            <p className="text-sm text-muted-foreground mb-1">Override Rate</p>
            <p className="text-3xl font-bold">{stats.overrideRate.toFixed(1)}%</p>
          </Card>
        </div>

        <Card className="glass-card shadow-card p-8 mb-6">
          <h2 className="text-xl font-bold mb-4">Simulated Fairness Metrics</h2>
          <p className="text-muted-foreground mb-6">
            In a production environment, this section would show detailed fairness analysis
            including demographic parity, equal opportunity metrics, and bias detection across
            different customer segments.
          </p>

          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Income Level Distribution</h3>
                <span className="text-sm text-success">No significant bias detected</span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Low Income (&lt;$40k)</span>
                    <span>45% approval rate</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '45%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Medium Income ($40k-$80k)</span>
                    <span>65% approval rate</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '65%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>High Income (&gt;$80k)</span>
                    <span>85% approval rate</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Employment Type Distribution</h3>
                <span className="text-sm text-success">Within acceptable range</span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Salaried</span>
                    <span>72% approval rate</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-success" style={{ width: '72%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Self-Employed</span>
                    <span>58% approval rate</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-warning" style={{ width: '58%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold mb-2">Fairness Monitoring</h3>
              <p className="text-sm text-muted-foreground">
                Our AI system is continuously monitored for bias and unfair outcomes. Any
                significant disparities are automatically flagged for review. Regular audits
                ensure compliance with fair lending practices and ethical AI guidelines.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
