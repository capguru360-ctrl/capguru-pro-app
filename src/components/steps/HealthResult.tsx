import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { UserData } from '@/types';
import { Download, Share2, ArrowRight, CheckCircle2, Zap, Loader2 } from 'lucide-react';
import { generatePDF } from '@/lib/pdf-generator';
import { PremiumHealthReport } from '../reports/PremiumHealthReport';

ChartJS.register(ArcElement, Tooltip, Legend);

interface HealthResultProps {
  data: UserData;
  onNext: () => void;
}

export function HealthResult({ data, onNext }: HealthResultProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const totalDebt = (Object.values(data.debtToolAmounts || {}) as number[]).reduce((a, b) => a + b, 0);
  const totalEquity = (Object.values(data.equityToolAmounts || {}) as number[]).reduce((a, b) => a + b, 0);
  const totalInvestments = totalDebt + totalEquity;

  const breakdown = data.healthBreakdown || {
    discipline: 0,
    protection: 0,
    allocation: 0,
    penalties: 0
  };

  const scoreData = [
    { name: 'Investment Discipline', value: breakdown.discipline, max: 30, color: 'blue-500' },
    { name: 'Protection', value: breakdown.protection, max: 40, color: 'emerald-500' },
    { name: 'Asset Allocation', value: breakdown.allocation, max: 30, color: 'purple-500' },
  ];

  const pieData = {
    labels: scoreData.map(d => d.name),
    datasets: [
      {
        data: scoreData.map(d => d.value),
        backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6'],
        borderColor: '#FFFFFF',
        borderWidth: 4,
        hoverOffset: 12,
      },
    ],
  };

  const weaknesses = [
    breakdown.discipline < 15 ? "Your investment-to-income ratio is below the 30% benchmark." : null,
    breakdown.protection < 20 ? "Critical insurance gaps identified in your profile." : null,
    breakdown.allocation < 15 ? "Significant deviation from recommended asset allocation." : null,
    breakdown.penalties > 0 ? `A penalty of -${breakdown.penalties} points was applied for extreme imbalances.` : null,
  ].filter(Boolean);

  const handleDownload = async () => {
    setIsGenerating(true);
    // Targeting the premium hidden report layout
    const success = await generatePDF('premium-health-report', 'CapGuru_Health_Report');
    setIsGenerating(false);
    if (success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleShare = () => {
    const text = `My Financial Health Score is ${data.healthScore}/100! I'm in the ${data.healthStage} stage. Check yours on CapGuru Pro!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500" id="healthReport">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-foreground leading-tight">Financial Health Analysis</h2>
          <p className="text-lg text-muted-foreground font-medium mt-1">A comprehensive look at your financial stability.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Button 
            variant="outline" 
            onClick={handleDownload} 
            disabled={isGenerating}
            className="flex-1 md:flex-none h-12 rounded-xl border-secondary text-secondary font-bold hover:bg-secondary/5"
          >
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            {isGenerating ? 'Generating...' : 'Export PDF'}
          </Button>
          <Button 
            onClick={onNext} 
            className="flex-1 md:flex-none h-12 rounded-xl btn-gradient-blue text-white font-bold shadow-lg shadow-secondary/20 hover-scale border-none"
          >
            Get Personalized Strategy <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {showSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 font-bold text-center animate-in fade-in zoom-in duration-300">
          Report downloaded successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Portfolio Summary Card */}
        <Card className="md:col-span-12 border-none shadow-premium bg-primary text-white overflow-hidden">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-70 mb-1">Total Portfolio Value</p>
                <p className="text-4xl font-black">₹{totalInvestments.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Debt Allocation</p>
                <p className="text-xl font-bold">₹{totalDebt.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Equity Allocation</p>
                <p className="text-xl font-bold">₹{totalEquity.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Emergency Fund</p>
                <p className="text-xl font-bold">₹{data.emergencyFund.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Card */}
        <Card className="md:col-span-4 border-none shadow-premium bg-card flex flex-col items-center justify-center p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-10">Financial Health Score</CardTitle>
          <div className="relative w-48 h-48 mb-8">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle className="text-slate-100 stroke-current" strokeWidth="8" fill="transparent" r="42" cx="50" cy="50" />
              <circle 
                className="text-secondary stroke-current transition-all duration-1000 ease-out" 
                strokeWidth="8" 
                strokeDasharray="264" 
                strokeDashoffset={264 - (264 * data.healthScore) / 100} 
                strokeLinecap="round" 
                fill="transparent" 
                r="42" 
                cx="50" 
                cy="50" 
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-black text-foreground">{Math.round(data.healthScore)}</span>
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Score</span>
            </div>
          </div>
          <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 text-sm font-bold px-6 py-2 rounded-full border-none shadow-sm">
            {data.healthStage} Stage
          </Badge>
          <p className="text-sm text-muted-foreground mt-8 font-medium leading-relaxed">
            You have excellent investment discipline. Focus on protection gaps.
          </p>
        </Card>

        {/* Breakdown Card */}
        <Card className="md:col-span-8 border-none shadow-premium bg-card">
          <CardHeader className="border-b border-border bg-slate-50/50 p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center text-white font-black text-xl shadow-sm">
                  CG
                </div>
                <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Score Breakdown</CardTitle>
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Report for {data.name}</p>
            </div>
          </CardHeader>
          <CardContent className="p-10 space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {scoreData.map((item, idx) => (
                <div key={item.name} className="space-y-4">
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest h-8">{item.name}</div>
                  <div className="text-3xl font-black text-foreground">{item.value}<span className="text-xs text-muted-foreground ml-1">/{item.max}</span></div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${(item.value / item.max) * 100}%`, backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6'][idx] }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {breakdown.penalties > 0 && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <span className="text-red-600 font-black">-{breakdown.penalties}</span>
                </div>
                <p className="text-sm font-bold text-red-600">Penalty applied for extreme gaps or imbalances.</p>
              </div>
            )}

            <div className="pt-6">
              <h4 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent" /> Identified Weaknesses
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {weaknesses.map((weakness, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4 hover-scale">
                    <div className="h-6 w-6 rounded-full bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-red-500" />
                    </div>
                    <p className="text-sm font-medium text-foreground leading-relaxed">{weakness}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-6">
        <Button 
          variant="outline" 
          onClick={handleShare} 
          className="rounded-xl h-12 px-8 border-secondary text-secondary font-bold hover:bg-secondary/5"
        >
          <Share2 className="mr-2 h-4 w-4" /> Share WhatsApp
        </Button>
      </div>

      {/* Hidden Premium Report for PDF Generation */}
      <PremiumHealthReport data={data} id="premium-health-report" />
    </div>
  );
}


