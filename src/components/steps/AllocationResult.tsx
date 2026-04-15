import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'; 
import { UserData } from '@/types';
import { Download, Share2, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { generatePDF } from '@/lib/pdf-generator';
import { PremiumAssetReport } from '../reports/PremiumAssetReport';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface AllocationResultProps {
  data: UserData;
  onNext: () => void;
}

const COLORS = ['#3B82F6', '#8B5CF6', '#F97316'];

export function AllocationResult({ data, onNext }: AllocationResultProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const chartLabels = ['Equity', 'Balance', 'Debt'];
  const chartValues = [
    Math.round(data.equityPercent),
    Math.round(data.balancePercent),
    Math.round(data.debtPercent),
  ];
  const chartAmounts = [
    Math.round(data.investableAmount * data.equityPercent / 100),
    Math.round(data.investableAmount * data.balancePercent / 100),
    Math.round(data.investableAmount * data.debtPercent / 100),
  ];

  const pieData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartValues,
        backgroundColor: COLORS,
        borderColor: '#FFFFFF',
        borderWidth: 4,
        hoverOffset: 12,
      },
    ],
  };

  const barData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Amount (₹)',
        data: chartAmounts,
        backgroundColor: COLORS,
        borderRadius: 12,
        barThickness: 45,
      },
    ],
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    // Targeting the premium hidden report layout
    const success = await generatePDF('premium-asset-report', 'CapGuru_Asset_Report');
    setIsGenerating(false);
    if (success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleShare = () => {
    const text = `Hey! I just checked my financial allocation on CapGuru Pro. My investable amount is ₹${data.investableAmount.toLocaleString()}. Check yours now!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500" id="report">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-foreground leading-tight">Your Financial Roadmap</h2>
          <p className="text-lg text-muted-foreground font-medium mt-1">Based on your age and income profile.</p>
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
            Start Health Check <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {showSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 font-bold text-center animate-in fade-in zoom-in duration-300">
          Report downloaded successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <Card className="md:col-span-12 border-none shadow-premium overflow-hidden bg-card">
          <CardHeader className="border-b border-border bg-slate-50/50 p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center text-white font-black text-xl shadow-sm">
                  CG
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Asset Allocation Strategy</CardTitle>
                  <p className="text-base font-bold text-foreground mt-0.5">Report for {data.name} • Age {data.age}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Investable Amount</p>
                <p className="text-2xl font-black text-primary">₹{data.investableAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="h-[320px] flex items-center justify-center relative">
                <Pie 
                  data={pieData} 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false }
                    },
                    cutout: '75%'
                  }} 
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total</span>
                  <span className="text-4xl font-black text-foreground">100%</span>
                </div>
              </div>
              
              <div className="space-y-8">
                {chartLabels.map((label, idx) => (
                  <div key={label} className="group">
                    <div className="flex justify-between items-end mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                        <span className="text-lg font-bold text-foreground">{label}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-foreground">{chartValues[idx]}%</div>
                        <div className="text-sm font-bold text-muted-foreground">₹{chartAmounts[idx].toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${chartValues[idx]}%`, backgroundColor: COLORS[idx] }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-12 border-none shadow-premium bg-card">
          <CardHeader className="p-6 border-b border-border">
            <CardTitle className="text-lg font-bold text-foreground">Allocation Breakdown (₹)</CardTitle>
          </CardHeader>
          <CardContent className="p-10">
            <div className="h-[350px] w-full">
              <Bar 
                data={barData} 
                options={{ 
                  maintainAspectRatio: false, 
                  plugins: { 
                    legend: { display: false } 
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: '#F1F5F9' },
                      ticks: { font: { weight: 'bold' } }
                    },
                    x: {
                      grid: { display: false },
                      ticks: { font: { weight: 'bold' } }
                    }
                  }
                }} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Income Allocation Summary Card */}
        <Card className="md:col-span-12 border-none shadow-premium bg-card overflow-hidden">
          <CardHeader className="p-6 border-b border-border bg-slate-50/30">
            <CardTitle className="text-lg font-bold text-foreground">Income Allocation Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {chartLabels.map((label, idx) => (
                <div 
                  key={label} 
                  className="p-6 rounded-2xl border border-border bg-slate-50/50 flex flex-col items-center text-center hover:shadow-md transition-shadow duration-300"
                >
                  <div 
                    className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-black text-lg mb-4 shadow-sm"
                    style={{ backgroundColor: COLORS[idx] }}
                  >
                    {label[0]}
                  </div>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</h3>
                  <div className="text-3xl font-black text-foreground mb-2">{chartValues[idx]}%</div>
                  <div className="text-lg font-bold text-primary">₹{chartAmounts[idx].toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-2 font-medium">
                    {idx === 0 ? 'High Growth' : idx === 1 ? 'Stability' : 'Safety'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-4 justify-center pt-6">
        <Button 
          variant="outline" 
          onClick={handleShare} 
          className="rounded-xl h-12 px-8 border-secondary text-secondary font-bold hover:bg-secondary/5"
        >
          <Share2 className="mr-2 h-4 w-4" /> Share WhatsApp
        </Button>
      </div>

      {/* Hidden Premium Report for PDF Generation */}
      <PremiumAssetReport data={data} id="premium-asset-report" />
    </div>
  );
}


