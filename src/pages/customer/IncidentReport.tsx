import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/lib/auth';
import { storageService } from '@/lib/storage';
import { Incident } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function IncidentReport() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'fraud' | 'dispute' | 'technical' | 'other'>('fraud');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    setSubmitting(true);

    const incident: Incident = {
      id: crypto.randomUUID(),
      userId: user.id,
      title,
      description,
      category,
      status: 'pending',
      timestamp: new Date().toISOString(),
      priority,
    };

    storageService.saveIncident(incident);

    toast({
      title: "Incident Reported",
      description: "Your incident has been submitted. We'll investigate and get back to you soon.",
      variant: "default",
    });

    setTimeout(() => {
      navigate('/customer/dashboard');
    }, 1500);
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
              <h1 className="text-2xl font-bold">Report Incident</h1>
              <p className="text-sm text-muted-foreground">Report fraud, disputes, or technical issues</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="glass-card shadow-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Incident Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief description of the incident"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fraud">Fraud / Suspicious Activity</SelectItem>
                  <SelectItem value="dispute">Transaction Dispute</SelectItem>
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High - Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide as much detail as possible about the incident..."
                rows={6}
                required
              />
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold mb-1">What happens next?</p>
                  <p className="text-muted-foreground">
                    Our security team will review your report within 24 hours. You'll receive updates via email
                    and can track the status in your dashboard.
                  </p>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full gradient-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Incident Report'}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
