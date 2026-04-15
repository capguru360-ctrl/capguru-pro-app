/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Step, UserData, INITIAL_USER_DATA } from './types';
import { calculateAllocation, calculateHealthScore } from './lib/calculations';
import { StepWrapper } from './components/StepWrapper';
import { Landing } from './components/steps/Landing';
import { AllocationInput } from './components/steps/AllocationInput';
import { AllocationResult } from './components/steps/AllocationResult';
import { HealthInput } from './components/steps/HealthInput';
import { HealthResult } from './components/steps/HealthResult';
import { LeadCapture } from './components/steps/LeadCapture';
import { Premium } from './components/steps/Premium';
import { Payment } from './components/steps/Payment';
import { Button } from './components/ui/button';
import { Wallet, LayoutDashboard, PieChart, ShieldCheck, Users, Star, LogOut, Menu } from 'lucide-react';
import { cn } from './lib/utils';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>('landing');
  const [userData, setUserData] = useState<UserData>(() => {
    const saved = localStorage.getItem('capguru_user_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_USER_DATA,
          ...parsed,
          debtToolAmounts: { ...INITIAL_USER_DATA.debtToolAmounts, ...(parsed.debtToolAmounts || {}) },
          equityToolAmounts: { ...INITIAL_USER_DATA.equityToolAmounts, ...(parsed.equityToolAmounts || {}) },
          children: parsed.children || INITIAL_USER_DATA.children,
        };
      } catch (e) {
        return INITIAL_USER_DATA;
      }
    }
    return INITIAL_USER_DATA;
  });
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro' | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem('capguru_user_data', JSON.stringify(userData));
  }, [userData]);

  const updateData = (newData: Partial<UserData>) => {
    setUserData(prev => {
      const updated = { ...prev, ...newData };
      
      if (newData.age || newData.annualIncome) {
        const allocation = calculateAllocation(updated.age, updated.annualIncome);
        Object.assign(updated, allocation);
      }
      
      if (
        newData.debtTools || 
        newData.equityTools || 
        newData.hasTermPlan !== undefined || 
        newData.hasHealthPlan !== undefined ||
        newData.monthlyExpenses !== undefined ||
        newData.emergencyFund !== undefined
      ) {
        const health = calculateHealthScore(updated);
        updated.healthScore = health.score;
        updated.healthStage = health.stage;
        updated.healthBreakdown = health.breakdown;
      }
      
      return updated;
    });
  };

  const handleWhatsAppRedirect = (data: UserData) => {
    const familyDetails = data.maritalStatus === 'Married' 
      ? `Married (Spouse: ${data.spouseName}, Children: ${data.children.length})`
      : 'Single';
    
    const message = `*CapGuru Pro Financial Plan Request*
Name: ${data.name}
Phone: ${data.phone}
Age: ${data.age}
Income: ₹${data.annualIncome.toLocaleString()}
Family: ${familyDetails}
Health Score: ${data.healthScore}/100
Stage: ${data.healthStage}`;

    const url = `https://wa.me/919999999999?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const steps: { id: Step; label: string; icon: React.ReactNode }[] = [
    { id: 'landing', label: 'Landing Page', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'allocation-input', label: 'Asset Allocation', icon: <PieChart className="h-4 w-4" /> },
    { id: 'health-input', label: 'Financial Health', icon: <ShieldCheck className="h-4 w-4" /> },
    { id: 'lead-capture-1', label: 'Lead Generation', icon: <Users className="h-4 w-4" /> },
    { id: 'premium', label: 'Premium Reports', icon: <Star className="h-4 w-4" /> },
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 'landing':
        return <Landing onStart={() => setCurrentStep('allocation-input')} />;
      case 'allocation-input':
        return (
          <AllocationInput 
            initialData={userData} 
            onNext={(data) => {
              updateData(data);
              setCurrentStep('allocation-result');
            }} 
          />
        );
      case 'allocation-result':
        return (
          <AllocationResult 
            data={userData} 
            onNext={() => setCurrentStep('health-input')} 
          />
        );
      case 'health-input':
        return (
          <HealthInput 
            initialData={userData} 
            onNext={(data) => {
              updateData(data);
              setCurrentStep('health-result');
            }} 
          />
        );
      case 'health-result':
        return (
          <HealthResult 
            data={userData} 
            onNext={() => setCurrentStep('lead-capture-1')} 
          />
        );
      case 'lead-capture-1':
        return (
          <LeadCapture 
            data={userData} 
            step={1}
            onNext={(data) => {
              updateData(data);
              setCurrentStep('lead-capture-2');
            }} 
          />
        );
      case 'lead-capture-2':
        return (
          <LeadCapture 
            data={userData} 
            step={2}
            onNext={(data) => {
              updateData(data);
              handleWhatsAppRedirect({ ...userData, ...data });
              setCurrentStep('premium');
            }} 
          />
        );
      case 'premium':
        return (
          <Premium 
            data={userData} 
            onSelect={(plan) => {
              setSelectedPlan(plan);
              setCurrentStep('payment');
            }} 
          />
        );
      case 'payment':
        return (
          <Payment 
            plan={selectedPlan || 'basic'} 
            onComplete={() => {
              alert('Payment successful! Your premium plan is now active.');
              setCurrentStep('landing');
              setUserData(INITIAL_USER_DATA);
            }} 
          />
        );
      default:
        return <Landing onStart={() => setCurrentStep('allocation-input')} />;
    }
  };

  const getActiveStepId = () => {
    if (currentStep === 'allocation-result') return 'allocation-input';
    if (currentStep === 'health-result') return 'health-input';
    if (currentStep === 'lead-capture-2') return 'lead-capture-1';
    if (currentStep === 'payment') return 'premium';
    return currentStep;
  };

  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out md:relative md:translate-x-0 shadow-2xl",
        !isSidebarOpen && "-translate-x-full md:w-24"
      )}>
        <div className="flex flex-col h-full py-8">
          <div className={cn("px-8 mb-12 flex items-center gap-3", !isSidebarOpen && "justify-center px-0")}>
            <div className="shrink-0">
              <img 
                src="https://api.dicebear.com/7.x/initials/svg?seed=CG&backgroundColor=1e3a8a&fontFamily=Inter&fontWeight=700" 
                alt="CapGuru Logo" 
                className={cn("h-12 w-auto object-contain drop-shadow-md rounded-xl", !isSidebarOpen && "h-10")} 
                referrerPolicy="no-referrer"
              />
            </div>
            {isSidebarOpen && (
              <span className="text-2xl font-black tracking-tighter text-white ml-1">
                CapGuru<span className="text-secondary">Pro</span>
              </span>
            )}
          </div>

          <nav className="flex-1 space-y-2 px-4">
            {steps.map((step) => {
              const isActive = getActiveStepId() === step.id;
              return (
                <div
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={cn(
                    "flex items-center gap-4 px-4 py-4 text-sm font-bold cursor-pointer transition-all rounded-2xl group",
                    isActive ? "bg-secondary text-white shadow-lg shadow-secondary/20" : "hover:bg-white/5 hover:text-white",
                    !isSidebarOpen && "justify-center px-0"
                  )}
                >
                  <div className={cn("shrink-0 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-slate-500 group-hover:text-secondary")}>
                    {step.icon}
                  </div>
                  {isSidebarOpen && <span>{step.label}</span>}
                </div>
              );
            })}
          </nav>

          <div className="px-6 mt-auto">
            <div className={cn(
              "p-6 rounded-[24px] bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 space-y-4 shadow-xl",
              !isSidebarOpen && "hidden"
            )}>
              <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Star className="h-5 w-5 text-accent fill-accent" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black text-accent uppercase tracking-widest">Upgrade to Pro</p>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">Unlock full financial strategy and expert consultation.</p>
              </div>
              <Button 
                size="sm" 
                className="w-full bg-accent hover:bg-accent/90 text-white text-xs font-bold h-10 rounded-xl border-none glow-orange" 
                onClick={() => setCurrentStep('premium')}
              >
                Upgrade Now
              </Button>
            </div>
            <div className={cn("mt-8 flex items-center gap-4 px-4 py-4 text-slate-500 hover:text-white cursor-pointer transition-colors font-bold text-sm group", !isSidebarOpen && "justify-center px-0")}>
              <LogOut className="h-5 w-5 group-hover:text-red-400" />
              {isSidebarOpen && <span>Sign Out</span>}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-white/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:flex">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold tracking-tight">
              {steps.find(s => s.id === getActiveStepId())?.label || 'Overview'}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold">{userData.name || 'Guest User'}</span>
              <span className="text-xs text-muted-foreground">Premium Member</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/20">
              {userData.name ? userData.name.substring(0, 2).toUpperCase() : 'GU'}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <StepWrapper key={currentStep}>
              {renderStep()}
            </StepWrapper>
          </AnimatePresence>
          
          <footer className="py-12 px-6 border-t border-border mt-auto">
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <p className="text-muted-foreground text-sm font-medium">
                © 2026 CapGuru Pro. All rights reserved.
              </p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Disclaimer: This tool is for informational purposes only and does not constitute financial advice. Always consult with a qualified financial advisor before making investment decisions.
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}


