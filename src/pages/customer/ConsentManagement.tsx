import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/lib/auth';
import { storageService } from '@/lib/storage';
import { ConsentSettings } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function ConsentManagement() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [consent, setConsent] = useState<ConsentSettings | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const userConsent = storageService.getConsent(user.id);
    setConsent(userConsent);
  }, [user, navigate]);

  const handleToggle = (key: keyof Omit<ConsentSettings, 'userId'>) => {
    if (consent) {
      setConsent({ ...consent, [key]: !consent[key] });
      setHasChanges(true);
    }
  };

  const handleSave = () => {
    if (consent) {
      storageService.saveConsent(consent);
      setHasChanges(false);
      toast.success('Consent preferences updated!');
    }
  };

  if (!consent) return null;

  const consentItems = [
    {
      key: 'income' as const,
      title: 'Income & Financial Data',
      description: 'Allow AI to access your salary, income sources, and financial status.',
      impact: 'Critical for loan approval decisions. Disabling may reduce approval chances.',
    },
    {
      key: 'location' as const,
      title: 'Location Data',
      description: 'Track where transactions occur to detect unusual patterns.',
      impact: 'Helps identify fraudulent transactions from unusual locations.',
    },
    {
      key: 'transactionHistory' as const,
      title: 'Transaction History',
      description: 'Analyze your spending patterns and transaction behavior.',
      impact: 'Essential for fraud detection and spending pattern analysis.',
    },
    {
      key: 'deviceInfo' as const,
      title: 'Device Information',
      description: 'Monitor which devices access your account.',
      impact: 'Detects unauthorized access from new or suspicious devices.',
    },
    {
      key: 'behavioralData' as const,
      title: 'Behavioral Data',
      description: 'Learn your typical banking behavior and preferences.',
      impact: 'Improves personalization and helps detect account takeover attempts.',
    },
  ];

  const disabledCount = Object.values(consent).filter(v => v === false).length - 1; // -1 for userId

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

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Data Consent & Control</h1>
          </div>
          <p className="text-muted-foreground">
            Control what data our AI can use for decision-making. Changes take effect immediately.
          </p>
        </div>

        {disabledCount > 0 && (
          <Card className="p-4 mb-6 bg-warning/10 border-warning/20">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Limited Data Access</p>
                <p className="text-sm text-muted-foreground mt-1">
                  You've restricted {disabledCount} data {disabledCount === 1 ? 'category' : 'categories'}. 
                  This may reduce AI confidence and affect decision accuracy.
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-4">
          {consentItems.map((item) => (
            <Card key={item.key} className="glass-card shadow-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        consent[item.key] ? 'bg-success' : 'bg-muted-foreground'
                      }`}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {item.description}
                  </p>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs font-medium mb-1">Impact on AI Decisions:</p>
                    <p className="text-xs text-muted-foreground">{item.impact}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id={item.key}
                    checked={consent[item.key]}
                    onCheckedChange={() => handleToggle(item.key)}
                  />
                  <Label htmlFor={item.key} className="sr-only">
                    {item.title}
                  </Label>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {hasChanges && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleSave}
              className="gradient-primary px-8"
              size="lg"
            >
              Save Changes
            </Button>
          </div>
        )}

        <Card className="mt-8 p-6 bg-primary/5 border-primary/20">
          <h3 className="font-semibold mb-2">Your Privacy Matters</h3>
          <p className="text-sm text-muted-foreground">
            We use your data only for the purposes you approve. All decisions are logged
            with your consent settings at the time, ensuring full transparency and auditability.
            You can change these settings anytime.
          </p>
        </Card>
      </main>
    </div>
  );
}
