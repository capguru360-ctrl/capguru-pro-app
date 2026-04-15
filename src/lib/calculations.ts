import { UserData } from '../types';

export function calculateAllocation(age: number, income: number) {
  const investable = income * 0.3;
  let equity = 100 - age;
  equity = Math.max(10, Math.min(80, equity));
  
  const remaining = 100 - equity;
  const balance = remaining * 0.66;
  const debt = remaining - balance;
  
  return {
    investableAmount: investable,
    equityPercent: equity,
    balancePercent: balance,
    debtPercent: debt,
  };
}

export function calculateHealthScore(data: UserData) {
  let disciplineScore = 0;
  let protectionScore = 0;
  let allocationScore = 0;
  let penalties = 0;

  const totalDebt = (Object.values(data.debtToolAmounts || {}) as number[]).reduce((a, b) => a + b, 0);
  const totalEquity = (Object.values(data.equityToolAmounts || {}) as number[]).reduce((a, b) => a + b, 0);
  const totalInvestments = totalDebt + totalEquity;

  // 1. Investment Discipline (30%)
  const investmentRatio = data.annualIncome > 0 ? totalInvestments / data.annualIncome : 0;
  if (investmentRatio >= 0.3) {
    disciplineScore = 30;
  } else if (investmentRatio >= 0.2) {
    disciplineScore = 20 + (investmentRatio - 0.2) * 100; // 20-30 range
  } else if (investmentRatio >= 0.1) {
    disciplineScore = 10 + (investmentRatio - 0.1) * 100; // 10-20 range
  } else if (investmentRatio >= 0.05) {
    disciplineScore = 5;
  } else {
    disciplineScore = 0;
    if (investmentRatio === 0) penalties += 10;
    else penalties += 7;
  }

  // 2. Protection (40%)
  if (data.hasTermPlan && data.hasHealthPlan) {
    protectionScore = 40;
  } else if (data.hasTermPlan || data.hasHealthPlan) {
    protectionScore = 25;
  } else {
    protectionScore = 5;
    penalties += 10;
  }

  // 3. Asset Allocation Match (30%)
  const currentEquityPct = totalInvestments > 0 ? (totalEquity / totalInvestments) * 100 : 0;
  const currentDebtPct = totalInvestments > 0 ? (totalDebt / totalInvestments) * 100 : 0;
  
  const diffEquity = Math.abs(currentEquityPct - data.equityPercent);
  const diffDebt = Math.abs(currentDebtPct - data.debtPercent);
  const avgDiff = (diffEquity + diffDebt) / 2;

  if (avgDiff <= 5) {
    allocationScore = 30;
  } else if (avgDiff <= 15) {
    allocationScore = 20;
  } else if (avgDiff <= 30) {
    allocationScore = 10;
  } else {
    allocationScore = 5;
    if (avgDiff > 50) penalties += 10;
    else if (avgDiff > 30) penalties += 5;
  }

  const finalScore = Math.max(0, Math.min(100, disciplineScore + protectionScore + allocationScore - penalties));

  let stage: UserData['healthStage'] = 'Building';
  if (finalScore > 75) stage = 'Strong';
  else if (finalScore >= 50) stage = 'Growing';

  return { 
    score: finalScore, 
    stage,
    breakdown: {
      discipline: Math.round(disciplineScore),
      protection: Math.round(protectionScore),
      allocation: Math.round(allocationScore),
      penalties: Math.round(penalties)
    }
  };
}
