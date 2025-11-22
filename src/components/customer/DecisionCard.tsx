import { useState } from 'react';
import { AIDecision } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Volume2,
  Info
} from 'lucide-react';
import { ExplanationModal } from './ExplanationModal';

interface DecisionCardProps {
  decision: AIDecision;
  onRefresh?: () => void;
}

export function DecisionCard({ decision, onRefresh }: DecisionCardProps) {
  const [showModal, setShowModal] = useState(false);

  const getIcon = () => {
    if (decision.type === 'loan') {
      return decision.result === 'approved' ? (
        <CheckCircle2 className="w-6 h-6 text-success" />
      ) : (
        <XCircle className="w-6 h-6 text-destructive" />
      );
    } else {
      if (decision.result === 'normal') return <CheckCircle2 className="w-6 h-6 text-success" />;
      if (decision.result === 'suspicious') return <AlertTriangle className="w-6 h-6 text-warning" />;
      return <AlertTriangle className="w-6 h-6 text-destructive" />;
    }
  };

  const getBadgeVariant = () => {
    if (decision.type === 'loan') {
      return decision.result === 'approved' ? 'default' : 'destructive';
    } else {
      if (decision.result === 'normal') return 'default';
      if (decision.result === 'suspicious') return 'secondary';
      return 'destructive';
    }
  };

  const getTitle = () => {
    if (decision.type === 'loan') {
      return decision.result === 'approved' ? 'Loan Approved' : 'Loan Application Declined';
    } else {
      if (decision.result === 'normal') return 'Transaction Cleared';
      if (decision.result === 'suspicious') return 'Suspicious Activity Detected';
      return 'High Risk Transaction';
    }
  };

  const speakExplanation = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(decision.explanation);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      <Card className="glass-card shadow-card p-6 hover:shadow-elegant transition-all">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="mt-1">{getIcon()}</div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg">{getTitle()}</h3>
                <Badge variant={getBadgeVariant()}>
                  {decision.result}
                </Badge>
                {decision.overridden && (
                  <Badge variant="outline">Overridden</Badge>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">
                {new Date(decision.timestamp).toLocaleString()}
              </p>
              
              <p className="text-sm mb-3 line-clamp-2">
                {decision.explanation.split('\n')[0]}
              </p>

              <div className="flex flex-wrap gap-2">
                {decision.factors.slice(0, 3).map((factor, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {factor.name}: {factor.value}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowModal(true)}
            >
              <Info className="w-4 h-4 mr-2" />
              Why?
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={speakExplanation}
            >
              <Volume2 className="w-4 h-4 mr-2" />
              Listen
            </Button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Confidence Score</span>
            <span className="font-semibold">{decision.confidence.toFixed(1)}%</span>
          </div>
          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full gradient-primary transition-all"
              style={{ width: `${decision.confidence}%` }}
            />
          </div>
        </div>
      </Card>

      <ExplanationModal
        decision={decision}
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
