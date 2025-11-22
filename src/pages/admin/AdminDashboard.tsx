import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/lib/auth';
import { storageService } from '@/lib/storage';
import { AIDecision } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Shield, 
  LogOut, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  FileText,
  BarChart3
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [decisions, setDecisions] = useState<AIDecision[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    loadDecisions();
  }, [user, navigate]);

  const loadDecisions = () => {
    const allDecisions = storageService.getAllDecisions();
    setDecisions(allDecisions);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const totalDecisions = decisions.length;
  const fraudAlerts = decisions.filter(d => d.type === 'fraud' && d.result !== 'normal').length;
  const overriddenDecisions = decisions.filter(d => d.overridden).length;
  const loanApprovals = decisions.filter(d => d.type === 'loan' && d.result === 'approved').length;

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
                <p className="text-sm text-muted-foreground">Admin Portal</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Admin: {user?.name}</span>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Decisions</p>
                <p className="text-3xl font-bold mt-1">{totalDecisions}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="glass-card shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fraud Alerts</p>
                <p className="text-3xl font-bold mt-1">{fraudAlerts}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-warning" />
            </div>
          </Card>

          <Card className="glass-card shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Loan Approvals</p>
                <p className="text-3xl font-bold mt-1">{loanApprovals}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
          </Card>

          <Card className="glass-card shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overrides</p>
                <p className="text-3xl font-bold mt-1">{overriddenDecisions}</p>
              </div>
              <FileText className="w-8 h-8 text-accent" />
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Button
            className="h-32 text-lg font-semibold gradient-primary"
            onClick={() => navigate('/admin/decisions')}
          >
            <FileText className="w-6 h-6 mr-3" />
            View Decision Logs
          </Button>
          
          <Button
            variant="outline"
            className="h-32 text-lg font-semibold"
            onClick={() => navigate('/admin/fairness')}
          >
            <BarChart3 className="w-6 h-6 mr-3" />
            Fairness Analysis
          </Button>

          <Button
            variant="outline"
            className="h-32 text-lg font-semibold"
            onClick={() => navigate('/admin/audit')}
          >
            <Shield className="w-6 h-6 mr-3" />
            Audit Trail
          </Button>
        </div>

        {/* Recent Activity */}
        <Card className="glass-card shadow-card p-6">
          <h2 className="text-xl font-bold mb-4">Recent AI Decisions</h2>
          
          {decisions.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No decisions to display yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {decisions.slice(0, 5).map((decision) => (
                <div
                  key={decision.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate('/admin/decisions')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {decision.type === 'loan' ? (
                        <CheckCircle2 className={`w-5 h-5 ${
                          decision.result === 'approved' ? 'text-success' : 'text-destructive'
                        }`} />
                      ) : (
                        <AlertTriangle className={`w-5 h-5 ${
                          decision.result === 'normal' ? 'text-success' : 'text-warning'
                        }`} />
                      )}
                      <div>
                        <p className="font-medium">
                          {decision.type === 'loan' ? 'Loan Application' : 'Fraud Detection'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(decision.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{decision.result}</p>
                      <p className="text-sm text-muted-foreground">
                        {decision.confidence.toFixed(1)}% confidence
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
