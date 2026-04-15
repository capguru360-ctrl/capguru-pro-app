import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Copy, CheckCircle2 } from 'lucide-react';

interface PaymentProps {
  plan: 'basic' | 'pro';
  onComplete: () => void;
}

export function Payment({ plan, onComplete }: PaymentProps) {
  const [copied, setCopied] = React.useState(false);
  const amount = plan === 'pro' ? '2,999' : '999';
  const upiId = 'capguru@upi';

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-xl">
            CG
          </div>
        </div>
        <h2 className="text-4xl font-black tracking-tight text-foreground leading-tight">Complete Payment</h2>
        <p className="text-lg text-muted-foreground font-medium">Scan the QR code below to activate your <span className="text-secondary font-bold uppercase">{plan}</span> plan.</p>
      </div>

      <Card className="border-none shadow-premium bg-card overflow-hidden">
        <CardHeader className="border-b border-border bg-slate-50/50 text-center py-10">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Amount to Pay</p>
          <p className="text-5xl font-black text-primary">₹{amount}</p>
        </CardHeader>
        <CardContent className="p-10 space-y-10 flex flex-col items-center">
          <div className="relative p-8 bg-white rounded-[32px] border-2 border-slate-100 shadow-inner hover-scale">
            <QrCode className="h-56 w-56 text-slate-900" />
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <span className="text-xs font-bold rotate-45">CAPGURU PRO</span>
            </div>
          </div>

          <div className="w-full space-y-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-border flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">UPI ID</span>
                <span className="text-lg font-black text-foreground">{upiId}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCopy} className="h-10 px-4 rounded-xl text-secondary font-bold hover:bg-secondary/10">
                {copied ? <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" /> : <><Copy className="h-4 w-4 mr-2" /> Copy</>}
                {copied ? 'Copied' : 'Copy ID'}
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                <div className="h-6 w-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
                <span>Instant activation after payment</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                <div className="h-6 w-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
                <span>Secure UPI transaction</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={onComplete} 
            className="w-full h-14 rounded-2xl btn-gradient-blue text-white font-black shadow-xl shadow-secondary/20 hover-scale border-none text-lg"
          >
            I've Made the Payment
          </Button>
        </CardContent>
      </Card>
      
      <p className="text-center text-sm text-muted-foreground font-medium">
        Facing issues? Contact support at <span className="font-bold text-foreground">support@capguru.pro</span>
      </p>
    </div>
  );
}

