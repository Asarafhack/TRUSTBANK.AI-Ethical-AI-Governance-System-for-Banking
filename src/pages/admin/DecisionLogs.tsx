import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/lib/auth';
import { storageService } from '@/lib/storage';
import { AIDecision } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle, Edit } from 'lucide-react';
import { toast } from 'sonner';

export default function DecisionLogs() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [decisions, setDecisions] = useState<AIDecision[]>([]);
  const [selectedDecision, setSelectedDecision] = useState<AIDecision | null>(null);
  const [overrideDialogOpen, setOverrideDialogOpen] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');
  const [newResult, setNewResult] = useState('');

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

  const handleOverride = () => {
    if (!selectedDecision || !overrideReason.trim() || !newResult) {
      toast.error('Please provide a reason and select a new result');
      return;
    }

    storageService.updateDecision(selectedDecision.id, {
      overridden: true,
      overrideReason,
      overriddenBy: user?.name,
      overrideTimestamp: new Date().toISOString(),
      result: newResult as any,
    });

    toast.success('Decision overridden successfully');
    setOverrideDialogOpen(false);
    setOverrideReason('');
    setNewResult('');
    setSelectedDecision(null);
    loadDecisions();
  };

  const openOverrideDialog = (decision: AIDecision) => {
    setSelectedDecision(decision);
    setNewResult(decision.result);
    setOverrideDialogOpen(true);
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

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Decision Logs</h1>
          <p className="text-muted-foreground">
            Complete audit trail of all AI decisions with override capabilities
          </p>
        </div>

        <Card className="glass-card shadow-card p-6">
          <div className="space-y-4">
            {decisions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No decisions logged yet.</p>
              </div>
            ) : (
              decisions.map((decision) => (
                <div
                  key={decision.id}
                  className="p-6 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {decision.type === 'loan' ? (
                          decision.result === 'approved' ? (
                            <CheckCircle2 className="w-5 h-5 text-success" />
                          ) : (
                            <XCircle className="w-5 h-5 text-destructive" />
                          )
                        ) : decision.result === 'normal' ? (
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-warning" />
                        )}
                        <h3 className="font-semibold text-lg">
                          {decision.type === 'loan' ? 'Loan Decision' : 'Fraud Analysis'}
                        </h3>
                        <Badge>{decision.result}</Badge>
                        {decision.overridden && (
                          <Badge variant="secondary">Overridden</Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-muted-foreground">Decision ID:</span>
                          <span className="ml-2 font-mono">{decision.id.slice(0, 8)}...</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">User ID:</span>
                          <span className="ml-2 font-mono">{decision.userId.slice(0, 8)}...</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Timestamp:</span>
                          <span className="ml-2">{new Date(decision.timestamp).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Confidence:</span>
                          <span className="ml-2 font-semibold">{decision.confidence.toFixed(1)}%</span>
                        </div>
                      </div>

                      <div className="p-3 bg-muted/50 rounded-lg mb-3">
                        <p className="text-sm font-medium mb-1">Explanation:</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {decision.explanation}
                        </p>
                      </div>

                      {decision.overridden && (
                        <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                          <p className="text-sm font-medium mb-1">Override Details:</p>
                          <p className="text-sm text-muted-foreground">
                            By: {decision.overriddenBy} at{' '}
                            {decision.overrideTimestamp && new Date(decision.overrideTimestamp).toLocaleString()}
                          </p>
                          {decision.overrideReason && (
                            <p className="text-sm mt-1">Reason: {decision.overrideReason}</p>
                          )}
                        </div>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openOverrideDialog(decision)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Override
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </main>

      {/* Override Dialog */}
      <Dialog open={overrideDialogOpen} onOpenChange={setOverrideDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Override AI Decision</DialogTitle>
            <DialogDescription>
              Manually override this AI decision. This action will be logged in the audit trail.
            </DialogDescription>
          </DialogHeader>

          {selectedDecision && (
            <div className="space-y-4">
              <div>
                <Label>Original Result</Label>
                <Badge className="mt-2">{selectedDecision.result}</Badge>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newResult">New Result</Label>
                <select
                  id="newResult"
                  className="w-full p-2 border rounded-md"
                  value={newResult}
                  onChange={(e) => setNewResult(e.target.value)}
                >
                  {selectedDecision.type === 'loan' ? (
                    <>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </>
                  ) : (
                    <>
                      <option value="normal">Normal</option>
                      <option value="suspicious">Suspicious</option>
                      <option value="high-risk">High Risk</option>
                    </>
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Override Reason</Label>
                <Textarea
                  id="reason"
                  placeholder="Explain why you're overriding this decision..."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  rows={4}
                />
              </div>

              <Button onClick={handleOverride} className="w-full">
                Confirm Override
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
