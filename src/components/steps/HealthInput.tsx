import React from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Label } from '../ui/Label';
import { UserData } from '../../types';
import { ShieldCheck, ArrowRight, Info, IndianRupee } from 'lucide-react';

const Checkbox = (props: any) => <input type="checkbox" {...props} />;
const RadioGroup = ({ children }: any) => <div>{children}</div>;
const RadioGroupItem = (props: any) => <input type="radio" {...props} />;
const Input = (props: any) => <input {...props} />;

interface HealthInputProps {
  onNext: (data: Partial<UserData>) => void;
  initialData: UserData;
}

const DEBT_TOOLS = [
  { id: 'FD', label: 'Fixed Deposit (FD)' },
  { id: 'PPF', label: 'Public Provident Fund (PPF)' },
  { id: 'RD', label: 'Recurring Deposit (RD)' },
] as const;

const EQUITY_TOOLS = [
  { id: 'Shares', label: 'Direct Shares' },
  { id: 'MF', label: 'Mutual Funds' },
  { id: 'ULIP', label: 'ULIP' },
] as const;

export function HealthInput({ onNext, initialData }: HealthInputProps) {
  const [debtTools, setDebtTools] = React.useState<string[]>(initialData.debtTools);
  const [equityTools, setEquityTools] = React.useState<string[]>(initialData.equityTools);
  const [debtToolAmounts, setDebtToolAmounts] = React.useState(initialData.debtToolAmounts);
  const [equityToolAmounts, setEquityToolAmounts] = React.useState(initialData.equityToolAmounts);
  const [hasTermPlan, setHasTermPlan] = React.useState(initialData.hasTermPlan);
  const [hasHealthPlan, setHasHealthPlan] = React.useState(initialData.hasHealthPlan);
  const [monthlyExpenses, setMonthlyExpenses] = React.useState(initialData.monthlyExpenses);
  const [emergencyFund, setEmergencyFund] = React.useState(initialData.emergencyFund);

  const toggleTool = (id: string, type: 'debt' | 'equity') => {
    if (type === 'debt') {
      setDebtTools(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
    } else {
      setEquityTools(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
    }
  };

  const handleAmountChange = (id: string, value: string, type: 'debt' | 'equity') => {
    const amount = parseFloat(value) || 0;
    if (type === 'debt') {
      setDebtToolAmounts(prev => ({ ...prev, [id]: amount }));
      if (amount > 0 && !debtTools.includes(id)) {
        setDebtTools(prev => [...prev, id]);
      }
    } else {
      setEquityToolAmounts(prev => ({ ...prev, [id]: amount }));
      if (amount > 0 && !equityTools.includes(id)) {
        setEquityTools(prev => [...prev, id]);
      }
    }
  };

  const handleSubmit = () => {
    onNext({ 
      debtTools, 
      equityTools, 
      debtToolAmounts, 
      equityToolAmounts, 
      hasTermPlan, 
      hasHealthPlan,
      monthlyExpenses,
      emergencyFund
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black tracking-tight text-foreground">Financial Health Check</h2>
        <p className="text-lg text-muted-foreground font-medium">Enter your current investment amounts to calculate your health score.</p>
      </div>

      {/* Portfolio Summary Bar */}
      <Card className="border-none shadow-premium bg-primary text-white overflow-hidden">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-70 mb-1">Total Portfolio Value</p>
              <p className="text-4xl font-black">₹{( (Object.values(debtToolAmounts || {}) as number[]).reduce((a, b) => a + b, 0) + (Object.values(equityToolAmounts || {}) as number[]).reduce((a, b) => a + b, 0) ).toLocaleString()}</p>
            </div>
            <div className="flex gap-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Debt Tools</p>
                <p className="text-xl font-bold">₹{(Object.values(debtToolAmounts || {}) as number[]).reduce((a, b) => a + b, 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Equity Tools</p>
                <p className="text-xl font-bold">₹{(Object.values(equityToolAmounts || {}) as number[]).reduce((a, b) => a + b, 0).toLocaleString()}</p>
              </div>
            </div>
            <div className="text-right hidden md:block">
              <ShieldCheck className="h-12 w-12 text-white/20 ml-auto" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Debt Tools */}
        <Card className="border-none shadow-premium bg-card overflow-hidden">
          <CardHeader className="border-b border-border bg-slate-50/50 p-6">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Debt & Savings Tools</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {DEBT_TOOLS.map(tool => (
              <div key={tool.id} className="space-y-3 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 cursor-pointer" onClick={() => toggleTool(tool.id, 'debt')}>
                    <Checkbox 
                      checked={debtTools.includes(tool.id)} 
                      onCheckedChange={() => toggleTool(tool.id, 'debt')} 
                      className="rounded-md border-slate-300 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                    />
                    <span className="text-sm font-bold text-foreground">{tool.label}</span>
                  </div>
                </div>
                <div className="relative animate-in fade-in slide-in-from-top-1 duration-200">
                  <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    className={cn(
                      "pl-10 h-10 rounded-xl border-border bg-white transition-opacity",
                      !debtTools.includes(tool.id) && "opacity-50"
                    )}
                    value={debtToolAmounts[tool.id as keyof typeof debtToolAmounts] || ''}
                    onChange={(e) => {
                      if (!debtTools.includes(tool.id)) toggleTool(tool.id, 'debt');
                      handleAmountChange(tool.id, e.target.value, 'debt');
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Equity Tools */}
        <Card className="border-none shadow-premium bg-card overflow-hidden">
          <CardHeader className="border-b border-border bg-slate-50/50 p-6">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Equity & Growth Tools</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {EQUITY_TOOLS.map(tool => (
              <div key={tool.id} className="space-y-3 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 cursor-pointer" onClick={() => toggleTool(tool.id, 'equity')}>
                    <Checkbox 
                      checked={equityTools.includes(tool.id)} 
                      onCheckedChange={() => toggleTool(tool.id, 'equity')} 
                      className="rounded-md border-slate-300 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                    />
                    <span className="text-sm font-bold text-foreground">{tool.label}</span>
                  </div>
                </div>
                <div className="relative animate-in fade-in slide-in-from-top-1 duration-200">
                  <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    className={cn(
                      "pl-10 h-10 rounded-xl border-border bg-white transition-opacity",
                      !equityTools.includes(tool.id) && "opacity-50"
                    )}
                    value={equityToolAmounts[tool.id as keyof typeof equityToolAmounts] || ''}
                    onChange={(e) => {
                      if (!equityTools.includes(tool.id)) toggleTool(tool.id, 'equity');
                      handleAmountChange(tool.id, e.target.value, 'equity');
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Insurance */}
        <Card className="md:col-span-2 border-none shadow-premium bg-card overflow-hidden">
          <CardHeader className="border-b border-border bg-slate-50/50 p-6">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Protection & Insurance</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-bold">Do you have a Term Insurance Plan?</Label>
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <RadioGroup value={hasTermPlan ? 'yes' : 'no'} onValueChange={(v) => setHasTermPlan(v === 'yes')} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="term-yes" className="border-slate-300 text-secondary" />
                    <Label htmlFor="term-yes" className="text-sm font-medium">Yes, I'm covered</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="term-no" className="border-slate-300 text-secondary" />
                    <Label htmlFor="term-no" className="text-sm font-medium">No, not yet</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-bold">Do you have a Health Insurance Plan?</Label>
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <RadioGroup value={hasHealthPlan ? 'yes' : 'no'} onValueChange={(v) => setHasHealthPlan(v === 'yes')} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="health-yes" className="border-slate-300 text-secondary" />
                    <Label htmlFor="health-yes" className="text-sm font-medium">Yes, I'm covered</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="health-no" className="border-slate-300 text-secondary" />
                    <Label htmlFor="health-no" className="text-sm font-medium">No, not yet</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency & Expenses */}
        <Card className="md:col-span-2 border-none shadow-premium bg-card overflow-hidden">
          <CardHeader className="border-b border-border bg-slate-50/50 p-6">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Emergency & Expenses</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-bold">What are your average Monthly Expenses?</Label>
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="Enter monthly expenses"
                    className="pl-10 h-12 rounded-xl border-border bg-white"
                    value={monthlyExpenses || ''}
                    onChange={(e) => setMonthlyExpenses(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground font-medium">Include rent, food, bills, and lifestyle costs.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-bold">How much do you have in your Emergency Fund?</Label>
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="Enter emergency fund amount"
                    className="pl-10 h-12 rounded-xl border-border bg-white"
                    value={emergencyFund || ''}
                    onChange={(e) => setEmergencyFund(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground font-medium">Ideally, this should be 6 months of your expenses.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-4">
        <Button onClick={handleSubmit} className="h-14 px-12 rounded-2xl btn-gradient-blue text-white font-black shadow-xl shadow-secondary/20 hover-scale border-none">
          Calculate Health Score <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

