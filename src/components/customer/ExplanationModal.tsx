import { AIDecision } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Volume2, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ExplanationModalProps {
  decision: AIDecision;
  open: boolean;
  onClose: () => void;
}

export function ExplanationModal({ decision, open, onClose }: ExplanationModalProps) {
  const speakExplanation = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(decision.explanation);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Decision Explanation</DialogTitle>
          <DialogDescription>
            Understanding how AI made this decision
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Decision Summary */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Decision Type</span>
              <Badge>{decision.type}</Badge>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Result</span>
              <Badge variant={decision.result === 'approved' || decision.result === 'normal' ? 'default' : 'destructive'}>
                {decision.result}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Confidence</span>
              <span className="font-semibold">{decision.confidence.toFixed(1)}%</span>
            </div>
          </div>

          {/* Natural Language Explanation */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              Plain English Explanation
              <Button variant="ghost" size="sm" onClick={speakExplanation}>
                <Volume2 className="w-4 h-4" />
              </Button>
            </h3>
            <div className="p-4 bg-card border rounded-lg whitespace-pre-line text-sm">
              {decision.explanation}
            </div>
          </div>

          {/* Factor Breakdown */}
          <div>
            <h3 className="font-semibold mb-3">Decision Factors</h3>
            <div className="space-y-3">
              {decision.factors.map((factor, idx) => (
                <div key={idx} className="p-4 bg-card border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {factor.impact === 'positive' && <TrendingUp className="w-4 h-4 text-success" />}
                      {factor.impact === 'negative' && <TrendingDown className="w-4 h-4 text-destructive" />}
                      {factor.impact === 'neutral' && <Minus className="w-4 h-4 text-muted-foreground" />}
                      <span className="font-medium">{factor.name}</span>
                    </div>
                    <Badge 
                      variant={
                        factor.impact === 'positive' ? 'default' : 
                        factor.impact === 'negative' ? 'destructive' : 
                        'outline'
                      }
                    >
                      {factor.impact}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Value: <span className="font-medium text-foreground">{factor.value}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          factor.impact === 'positive' ? 'bg-success' :
                          factor.impact === 'negative' ? 'bg-destructive' :
                          'bg-muted-foreground'
                        }`}
                        style={{ width: `${factor.weight * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {(factor.weight * 100).toFixed(0)}% weight
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Consent Info */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Data Used in This Decision</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${decision.consentSnapshot.income ? 'bg-success' : 'bg-muted-foreground'}`} />
                <span>Income Data</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${decision.consentSnapshot.location ? 'bg-success' : 'bg-muted-foreground'}`} />
                <span>Location Data</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${decision.consentSnapshot.transactionHistory ? 'bg-success' : 'bg-muted-foreground'}`} />
                <span>Transaction History</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${decision.consentSnapshot.deviceInfo ? 'bg-success' : 'bg-muted-foreground'}`} />
                <span>Device Info</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${decision.consentSnapshot.behavioralData ? 'bg-success' : 'bg-muted-foreground'}`} />
                <span>Behavioral Data</span>
              </div>
            </div>
          </div>

          {decision.overridden && (
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <h4 className="font-semibold text-sm mb-1">Admin Override</h4>
              <p className="text-sm text-muted-foreground">
                This decision was manually overridden by an administrator.
              </p>
              {decision.overrideReason && (
                <p className="text-sm mt-2">
                  Reason: {decision.overrideReason}
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
