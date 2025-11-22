import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

interface CibilScoreGaugeProps {
  score: number;
}

export function CibilScoreGauge({ score }: CibilScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-success';
    if (score >= 650) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 750) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 650) return 'Fair';
    return 'Needs Improvement';
  };

  const percentage = (displayScore / 900) * 100;
  const rotation = (percentage / 100) * 180 - 90;

  return (
    <Card className="glass-card shadow-card p-6">
      <h3 className="text-lg font-semibold mb-6 text-center">CIBIL Score</h3>
      
      <div className="relative w-full aspect-square max-w-[280px] mx-auto">
        {/* Gauge background */}
        <svg className="w-full h-full" viewBox="0 0 200 120">
          {/* Background arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
            strokeLinecap="round"
          />
          
          {/* Colored segments */}
          <path
            d="M 20 100 A 80 80 0 0 1 60 36"
            fill="none"
            stroke="hsl(var(--destructive))"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 60 36 A 80 80 0 0 1 100 20"
            fill="none"
            stroke="hsl(var(--warning))"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 100 20 A 80 80 0 0 1 140 36"
            fill="none"
            stroke="hsl(var(--success))"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 140 36 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="hsl(var(--success))"
            strokeWidth="12"
            strokeLinecap="round"
            opacity="0.7"
          />
          
          {/* Needle */}
          <g transform={`rotate(${rotation} 100 100)`}>
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="35"
              stroke="hsl(var(--foreground))"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="100" cy="100" r="6" fill="hsl(var(--foreground))" />
          </g>
        </svg>
        
        {/* Score display */}
        <div className="absolute top-[60%] left-1/2 -translate-x-1/2 text-center">
          <div className={`text-4xl font-bold ${getScoreColor(displayScore)}`}>
            {displayScore}
          </div>
          <div className="text-sm text-muted-foreground">out of 900</div>
          <div className="text-sm font-semibold mt-2">
            {getScoreLabel(displayScore)}
          </div>
        </div>
      </div>

      {/* Score range indicators */}
      <div className="mt-6 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">300-649</span>
          <span className="text-destructive">Poor</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">650-699</span>
          <span className="text-warning">Fair</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">700-749</span>
          <span className="text-success">Good</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">750-900</span>
          <span className="text-success">Excellent</span>
        </div>
      </div>
    </Card>
  );
}
