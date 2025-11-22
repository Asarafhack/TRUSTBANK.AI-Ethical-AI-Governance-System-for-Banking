import { AIDecision, DecisionFactor, LoanApplication, Transaction, ConsentSettings, CustomerProfile } from '@/types';

export const aiEngine = {
  evaluateLoan: (
    application: LoanApplication,
    profile: CustomerProfile,
    consent: ConsentSettings
  ): AIDecision => {
    const factors: DecisionFactor[] = [];
    let score = 50; // Base score

    // Factor 1: Credit Score (if consented)
    if (consent.income) {
      const creditImpact = (application.creditScore - 600) / 10;
      score += creditImpact;
      factors.push({
        name: 'Credit Score',
        value: application.creditScore,
        impact: application.creditScore >= 700 ? 'positive' : application.creditScore >= 650 ? 'neutral' : 'negative',
        weight: 0.3,
      });
    } else {
      factors.push({
        name: 'Credit Score',
        value: 'Data not provided',
        impact: 'neutral',
        weight: 0,
      });
    }

    // Factor 2: Income (if consented)
    if (consent.income) {
      const debtToIncome = (application.existingLoans * 12) / application.income;
      const incomeImpact = debtToIncome < 0.3 ? 15 : debtToIncome < 0.5 ? 5 : -10;
      score += incomeImpact;
      factors.push({
        name: 'Debt-to-Income Ratio',
        value: `${(debtToIncome * 100).toFixed(1)}%`,
        impact: debtToIncome < 0.3 ? 'positive' : debtToIncome < 0.5 ? 'neutral' : 'negative',
        weight: 0.25,
      });
    } else {
      score -= 10; // Penalty for not providing income data
      factors.push({
        name: 'Income Data',
        value: 'Not provided',
        impact: 'negative',
        weight: 0.1,
      });
    }

    // Factor 3: Employment Type
    if (application.employmentType === 'salaried') {
      score += 10;
      factors.push({
        name: 'Employment Type',
        value: 'Salaried',
        impact: 'positive',
        weight: 0.15,
      });
    } else if (application.employmentType === 'self-employed') {
      score += 5;
      factors.push({
        name: 'Employment Type',
        value: 'Self-employed',
        impact: 'neutral',
        weight: 0.15,
      });
    } else {
      score -= 15;
      factors.push({
        name: 'Employment Type',
        value: 'Unemployed',
        impact: 'negative',
        weight: 0.15,
      });
    }

    // Factor 4: Existing Loans
    if (application.existingLoans === 0) {
      score += 10;
      factors.push({
        name: 'Existing Loans',
        value: 0,
        impact: 'positive',
        weight: 0.15,
      });
    } else if (application.existingLoans <= 2) {
      factors.push({
        name: 'Existing Loans',
        value: application.existingLoans,
        impact: 'neutral',
        weight: 0.15,
      });
    } else {
      score -= 10;
      factors.push({
        name: 'Existing Loans',
        value: application.existingLoans,
        impact: 'negative',
        weight: 0.15,
      });
    }

    // Factor 5: Behavioral data (if consented)
    if (consent.behavioralData) {
      score += 5;
      factors.push({
        name: 'Behavioral Pattern',
        value: 'Consistent payment history',
        impact: 'positive',
        weight: 0.15,
      });
    }

    const confidence = Math.min(Math.max(score, 0), 100);
    const result = confidence >= 60 ? 'approved' : 'rejected';

    const explanation = aiEngine.generateLoanExplanation(result, factors, consent);

    return {
      id: crypto.randomUUID(),
      userId: application.userId,
      type: 'loan',
      result,
      confidence,
      factors,
      explanation,
      timestamp: new Date().toISOString(),
      consentSnapshot: { ...consent },
      overridden: false,
    };
  },

  evaluateFraud: (transaction: Transaction, consent: ConsentSettings): AIDecision => {
    const factors: DecisionFactor[] = [];
    let riskScore = 0;

    // Factor 1: Transaction Amount
    if (transaction.amount > 2000) {
      riskScore += 30;
      factors.push({
        name: 'Transaction Amount',
        value: `$${transaction.amount.toFixed(2)}`,
        impact: 'negative',
        weight: 0.3,
      });
    } else {
      factors.push({
        name: 'Transaction Amount',
        value: `$${transaction.amount.toFixed(2)}`,
        impact: 'positive',
        weight: 0.1,
      });
    }

    // Factor 2: Location (if consented)
    if (consent.location) {
      if (transaction.location.includes('Nigeria') || transaction.location.includes('Foreign')) {
        riskScore += 25;
        factors.push({
          name: 'Transaction Location',
          value: transaction.location,
          impact: 'negative',
          weight: 0.25,
        });
      } else {
        factors.push({
          name: 'Transaction Location',
          value: transaction.location,
          impact: 'positive',
          weight: 0.1,
        });
      }
    }

    // Factor 3: Device Change (if consented)
    if (consent.deviceInfo && transaction.deviceChanged) {
      riskScore += 20;
      factors.push({
        name: 'Device Information',
        value: 'New device detected',
        impact: 'negative',
        weight: 0.2,
      });
    }

    // Factor 4: Merchant Category
    if (consent.transactionHistory) {
      if (transaction.category === 'Transfer' || transaction.category === 'Wire') {
        riskScore += 15;
        factors.push({
          name: 'Merchant Category',
          value: transaction.category,
          impact: 'negative',
          weight: 0.15,
        });
      } else {
        factors.push({
          name: 'Merchant Category',
          value: transaction.category,
          impact: 'positive',
          weight: 0.1,
        });
      }
    }

    const confidence = Math.min(riskScore, 100);
    let result: 'normal' | 'suspicious' | 'high-risk';
    
    if (confidence < 30) {
      result = 'normal';
    } else if (confidence < 60) {
      result = 'suspicious';
    } else {
      result = 'high-risk';
    }

    const explanation = aiEngine.generateFraudExplanation(result, factors);

    return {
      id: crypto.randomUUID(),
      userId: transaction.userId,
      type: 'fraud',
      result,
      confidence,
      factors,
      explanation,
      timestamp: new Date().toISOString(),
      consentSnapshot: { ...consent },
      overridden: false,
    };
  },

  generateLoanExplanation: (result: string, factors: DecisionFactor[], consent: ConsentSettings): string => {
    const approved = result === 'approved';
    let explanation = approved 
      ? 'Your loan application has been approved based on our AI assessment. ' 
      : 'Your loan application was not approved at this time. ';

    explanation += 'Here are the key factors that influenced this decision:\n\n';

    factors.forEach(factor => {
      if (factor.impact === 'positive') {
        explanation += `✓ ${factor.name}: ${factor.value} - This worked in your favor.\n`;
      } else if (factor.impact === 'negative') {
        explanation += `✗ ${factor.name}: ${factor.value} - This was a concern.\n`;
      } else {
        explanation += `○ ${factor.name}: ${factor.value} - Neutral impact.\n`;
      }
    });

    const disabledData = [];
    if (!consent.income) disabledData.push('income');
    if (!consent.behavioralData) disabledData.push('behavioral data');
    
    if (disabledData.length > 0) {
      explanation += `\n⚠️ Note: You've restricted access to ${disabledData.join(', ')}. Providing this data may improve your approval chances.`;
    }

    return explanation;
  },

  generateFraudExplanation: (result: string, factors: DecisionFactor[]): string => {
    let explanation = '';

    if (result === 'normal') {
      explanation = 'This transaction appears normal and within your typical spending patterns. ';
    } else if (result === 'suspicious') {
      explanation = 'This transaction has been flagged as potentially suspicious. ';
    } else {
      explanation = 'This transaction has been flagged as high risk and requires immediate attention. ';
    }

    explanation += 'Our AI detected the following patterns:\n\n';

    factors.forEach(factor => {
      if (factor.impact === 'negative') {
        explanation += `⚠️ ${factor.name}: ${factor.value} - Unusual pattern detected.\n`;
      } else {
        explanation += `✓ ${factor.name}: ${factor.value} - Normal pattern.\n`;
      }
    });

    if (result !== 'normal') {
      explanation += '\n💡 If you recognize this transaction, you can mark it as legitimate in your dashboard.';
    }

    return explanation;
  },
};
