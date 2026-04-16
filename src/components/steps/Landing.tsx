import React from 'react';
import { Button } from '../ui/Button';
interface LandingProps {
  onStart: () => void;
}

export function Landing({ onStart }: LandingProps) {
  return (
    <div className="space-y-16 py-12 animate-in fade-in duration-700">
      <div className="text-center space-y-8">
        <div className="flex justify-center mb-10">
          <img 
            src="/logo.png" 
            alt="CapGuru Logo" 
            className="h-28 w-auto object-contain drop-shadow-sm" 
            referrerPolicy="no-referrer"
          />
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground leading-[1.1]">
          Stop Blind Investing, <br />
          <span className="text-secondary">Start Smart Planning</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
          CapGuru Pro helps you visualize your financial future with data-driven insights and professional-grade allocation strategies.
        </p>
        <Button 
          size="lg" 
          onClick={onStart} 
          className="h-16 px-10 text-lg rounded-2xl shadow-xl shadow-secondary/20 hover-scale btn-gradient-blue text-white font-bold border-none"
        >
          Start Free Financial Check <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="border-none shadow-premium bg-card hover-scale">
          <CardContent className="pt-8 pb-8 space-y-5">
            <div className="h-14 w-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
              <TrendingUp className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Asset Allocation</h3>
            <p className="text-muted-foreground text-base leading-relaxed">Optimize your portfolio based on your age and risk profile using our proprietary engine.</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-premium bg-card hover-scale">
          <CardContent className="pt-8 pb-8 space-y-5">
            <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <Shield className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Financial Health</h3>
            <p className="text-muted-foreground text-base leading-relaxed">Get a comprehensive score of your current financial standing and protection levels.</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-premium bg-card hover-scale">
          <CardContent className="pt-8 pb-8 space-y-5">
            <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
              <Zap className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Instant Reports</h3>
            <p className="text-muted-foreground text-base leading-relaxed">Download professional PDF reports and share your financial roadmap instantly.</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-primary text-white rounded-[32px] p-10 md:p-16 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
        <h2 className="text-4xl font-black relative z-10">About CapGuru</h2>
        <p className="text-slate-300 max-w-3xl mx-auto text-xl leading-relaxed font-medium relative z-10">
          We are a team of financial enthusiasts dedicated to making complex financial planning accessible to everyone. Our tools are designed to provide clarity without the jargon.
        </p>
      </div>
    </div>
  );
}

