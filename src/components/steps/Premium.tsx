import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserData } from '@/types';
import { Lock, Check, Star, ArrowRight, CheckCircle2 } from 'lucide-react';

interface PremiumProps {
  data: UserData;
  onSelect: (plan: 'basic' | 'pro') => void;
}

export function Premium({ data, onSelect }: PremiumProps) {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black tracking-tight text-foreground leading-tight">Choose Your Financial Strategy</h2>
        <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
          Unlock professional-grade financial tools and expert consultation to secure your future.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Basic Plan */}
        <Card className="border-none shadow-premium bg-card hover-scale flex flex-col">
          <CardHeader className="p-8 pb-0">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Basic Plan</div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-foreground">₹999</span>
              <span className="text-sm font-bold text-muted-foreground">/one-time</span>
            </div>
          </CardHeader>
          <CardContent className="p-8 flex-1 space-y-8">
            <div className="space-y-4">
              {[
                'Standard Asset Allocation',
                'Basic Financial Health Score',
                'Downloadable PDF Report',
                'Email Support'
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-3 w-3 text-slate-500" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">{feature}</span>
                </div>
              ))}
            </div>
            <Button 
              onClick={() => onSelect('basic')} 
              variant="outline"
              className="w-full h-12 rounded-xl border-secondary text-secondary font-bold hover:bg-secondary/5"
            >
              Get Basic Plan
            </Button>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className="border-none shadow-2xl bg-primary text-white hover-scale flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-accent text-white text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-widest z-10">
            Recommended
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          
          <CardHeader className="p-8 pb-0 relative z-10">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Pro Plan</div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-white">₹2,999</span>
              <span className="text-sm font-bold text-slate-300">/one-time</span>
            </div>
          </CardHeader>
          <CardContent className="p-8 flex-1 space-y-8 relative z-10">
            <div className="space-y-4">
              {[
                'Custom Investment Strategy',
                'Advanced Health Analysis',
                '1-on-1 Expert Consultation',
                'Priority WhatsApp Support',
                'Quarterly Portfolio Review'
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-3 w-3 text-accent" />
                  </div>
                  <span className="text-sm font-medium text-slate-100">{feature}</span>
                </div>
              ))}
            </div>
            <Button 
              onClick={() => onSelect('pro')} 
              className="w-full h-12 rounded-xl bg-accent hover:bg-accent/90 text-white font-bold shadow-lg shadow-accent/20 border-none glow-orange"
            >
              Get Pro Plan <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

