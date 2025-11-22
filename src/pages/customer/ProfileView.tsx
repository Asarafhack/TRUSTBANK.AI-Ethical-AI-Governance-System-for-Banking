import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/lib/auth';
import { storageService } from '@/lib/storage';
import { CustomerProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, User, TrendingDown, TrendingUp, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileView() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [correction, setCorrection] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const userProfile = storageService.getProfile(user.id);
    setProfile(userProfile);
  }, [user, navigate]);

  const handleSubmitCorrection = () => {
    if (!correction.trim()) {
      toast.error('Please enter a correction');
      return;
    }

    toast.success('Correction request submitted!');
    setCorrection('');
  };

  const speakProfile = () => {
    if (!profile) return;
    
    const text = `Your AI profile summary: You are classified as a ${profile.segment}. 
    Your current risk score is ${profile.riskScore} out of 100. 
    You have an annual income of ${profile.income} dollars, 
    a credit score of ${profile.creditScore}, 
    and ${profile.existingLoans} existing ${profile.existingLoans === 1 ? 'loan' : 'loans'}. 
    Your employment type is ${profile.employmentType}.`;

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Profile Data</h2>
          <p className="text-muted-foreground mb-4">
            Apply for a loan to create your AI profile.
          </p>
          <Button onClick={() => navigate('/customer/loan-apply')}>
            Apply for Loan
          </Button>
        </Card>
      </div>
    );
  }

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">My AI Profile</h1>
              <p className="text-muted-foreground">
                How our AI understands you as a customer
              </p>
            </div>
            <Button variant="outline" onClick={speakProfile}>
              <Volume2 className="w-4 h-4 mr-2" />
              Listen to Profile
            </Button>
          </div>
        </div>

        {/* Risk Score Card */}
        <Card className="glass-card shadow-elegant p-8 mb-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-primary mb-4">
              <div className="text-5xl font-bold text-white">
                {profile.riskScore}
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Risk Score</h2>
            <Badge variant={profile.riskScore < 40 ? 'default' : 'secondary'} className="text-lg px-4 py-1">
              {profile.riskScore < 40 ? 'Low Risk' : profile.riskScore < 70 ? 'Medium Risk' : 'High Risk'}
            </Badge>
          </div>
        </Card>

        {/* Customer Segment */}
        <Card className="glass-card shadow-card p-6 mb-6">
          <h3 className="font-semibold text-lg mb-2">Customer Segment</h3>
          <p className="text-muted-foreground">{profile.segment}</p>
        </Card>

        {/* Profile Details */}
        <Card className="glass-card shadow-card p-6 mb-6">
          <h3 className="font-semibold text-lg mb-4">Financial Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Annual Income</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">${profile.income.toLocaleString()}</p>
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Credit Score</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">{profile.creditScore}</p>
                {profile.creditScore >= 700 ? (
                  <TrendingUp className="w-5 h-5 text-success" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-warning" />
                )}
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Age</p>
              <p className="text-2xl font-bold">{profile.age} years</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Existing Loans</p>
              <p className="text-2xl font-bold">{profile.existingLoans}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Employment Type</p>
              <Badge variant="outline" className="text-base">
                {profile.employmentType}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Request Correction */}
        <Card className="glass-card shadow-card p-6">
          <h3 className="font-semibold text-lg mb-2">Request Profile Correction</h3>
          <p className="text-sm text-muted-foreground mb-4">
            If any information is incorrect or outdated, let us know and we'll review it.
          </p>
          <Textarea
            placeholder="e.g., I have a new job with higher income, or this transaction wasn't mine..."
            value={correction}
            onChange={(e) => setCorrection(e.target.value)}
            className="mb-4"
            rows={4}
          />
          <Button onClick={handleSubmitCorrection} className="w-full">
            Submit Correction Request
          </Button>
        </Card>

        <Card className="mt-6 p-6 bg-primary/5 border-primary/20">
          <h4 className="font-semibold mb-2">How We Build Your Profile</h4>
          <p className="text-sm text-muted-foreground">
            Your AI profile is built from the data you've consented to share, including loan
            applications, transaction patterns, and financial information. We continuously
            update this profile to provide more accurate and personalized services. All profile
            changes are logged for your review.
          </p>
        </Card>
      </main>
    </div>
  );
}
