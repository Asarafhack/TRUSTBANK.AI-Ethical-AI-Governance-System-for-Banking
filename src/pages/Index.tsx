import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { authService } from '@/lib/auth';
import { 
  Shield, 
  Eye, 
  Lock, 
  FileCheck, 
  AlertCircle,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    }
  }, [user, navigate]);

  const features = [
    {
      icon: Eye,
      title: 'Full Transparency',
      description: 'Understand every AI decision with detailed explanations and factor breakdowns.',
    },
    {
      icon: Lock,
      title: 'Data Control',
      description: 'You decide what data the AI can use. Toggle permissions anytime.',
    },
    {
      icon: FileCheck,
      title: 'Complete Audit Trail',
      description: 'Every decision is logged with full context for compliance and review.',
    },
    {
      icon: AlertCircle,
      title: 'Bias Detection',
      description: 'Continuous monitoring ensures fair and ethical AI outcomes.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-primary">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-sm mb-8 animate-fade-in">
              <Shield className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              TrustBank.AI
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in">
              Ethical AI Governance for Banking
            </p>
            
            <p className="text-lg text-white/80 mb-12 max-w-2xl mx-auto animate-fade-in">
              Experience transparent, fair, and customer-controlled AI decision-making.
              Every loan decision, every fraud alert—fully explained and under your control.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Button
                size="lg"
                onClick={() => navigate('/login')}
                className="bg-white text-primary hover:bg-white/90 text-lg px-8"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/login')}
                className="border-white/20 text-white hover:bg-white/10 text-lg px-8"
              >
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why TrustBank.AI?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Banking AI that puts transparency, fairness, and customer control first
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <Card key={idx} className="glass-card shadow-card p-6 hover:shadow-elegant transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Simple, transparent, and always in your control
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="glass-card shadow-card p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Apply & Get Instant Decisions</h3>
                  <p className="text-muted-foreground">
                    Apply for loans or monitor transactions. Our AI evaluates instantly and provides
                    immediate feedback with complete transparency.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="glass-card shadow-card p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Understand Every Decision</h3>
                  <p className="text-muted-foreground">
                    Click "Why?" on any decision to see detailed explanations, factor breakdowns,
                    and even listen to voice explanations for accessibility.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="glass-card shadow-card p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Control Your Data</h3>
                  <p className="text-muted-foreground">
                    Toggle data permissions anytime. See exactly how changing permissions affects
                    AI decisions in real-time.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Credentials */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto glass-card shadow-elegant p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Try It Now</h2>
              <p className="text-lg text-muted-foreground">
                Use these demo credentials to explore the platform
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 border-primary/20">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Customer Portal</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">Email:</p>
                  <p className="font-mono bg-muted/50 p-2 rounded">customer@demo.com</p>
                  <p className="text-muted-foreground mt-3">Password:</p>
                  <p className="font-mono bg-muted/50 p-2 rounded">demo123</p>
                </div>
              </Card>

              <Card className="p-6 border-accent/20">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-accent" />
                  <h3 className="font-semibold text-lg">Admin Portal</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">Email:</p>
                  <p className="font-mono bg-muted/50 p-2 rounded">admin@trustbank.ai</p>
                  <p className="text-muted-foreground mt-3">Password:</p>
                  <p className="font-mono bg-muted/50 p-2 rounded">admin123</p>
                </div>
              </Card>
            </div>

            <div className="mt-8 text-center">
              <Button
                size="lg"
                onClick={() => navigate('/login')}
                className="gradient-primary px-12"
              >
                Launch Demo
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-card/50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold">TrustBank.AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Ethical AI Governance for the Future of Banking
          </p>
        </div>
      </footer>
    </div>
  );
}
