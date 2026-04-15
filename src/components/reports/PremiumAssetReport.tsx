import React from 'react';
import { UserData } from '@/types';

interface PremiumAssetReportProps {
  data: UserData;
  id: string;
}

export function PremiumAssetReport({ data, id }: PremiumAssetReportProps) {
  const riskProfile = data.equityPercent > 60 ? 'High' : data.equityPercent >= 40 ? 'Medium' : 'Low';
  const recommendedInvestment = Math.round(data.investableAmount);
  
  // Derived Snapshot Values
  const investmentPortfolio = Math.round(data.investableAmount * 0.715);
  const savingAllocation = Math.round(data.investableAmount * 0.285);
  const protectionCover = data.annualIncome * 20;
  const healthCover = 1000000;
  const retirementTarget = data.annualIncome * 20;

  const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  return (
    <div 
      id={id} 
      className="text-white p-16 w-[800px] min-h-[1131px] flex flex-col font-sans"
      style={{ 
        position: 'absolute', 
        left: '0', 
        top: '0', 
        zIndex: -100, 
        pointerEvents: 'none', 
        opacity: 1,
        backgroundColor: '#0B1E3C' 
      }}
    >
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-black tracking-tighter mb-1">Cap Guru</h1>
        <p className="text-sm text-[#94A3B8] font-bold uppercase tracking-[0.3em]">Ideal Asset Allocation Report</p>
        <div className="h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 w-full my-6 opacity-30"></div>
        <p className="text-base text-[#94A3B8]">Prepared for <span className="text-white font-bold">{data.name}</span></p>
      </div>

      {/* Profile & Investment Summary */}
      <div className="grid grid-cols-2 gap-12 mb-12">
        <div className="space-y-6">
          <h2 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-blue-500"></div> Profile Summary
          </h2>
          <div className="space-y-3 bg-[#1E293B]/30 p-6 rounded-2xl border border-[#94A3B8]/10">
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#94A3B8] uppercase font-bold tracking-tighter">Age</span>
              <span className="text-sm font-bold">{data.age} Years</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#94A3B8] uppercase font-bold tracking-tighter">Annual Income</span>
              <span className="text-sm font-bold">{formatCurrency(data.annualIncome)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#94A3B8] uppercase font-bold tracking-tighter">Risk Profile</span>
              <span className="text-sm font-bold text-blue-400">{riskProfile}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-purple-500"></div> Recommended Yearly Investment
          </h2>
          <div className="bg-gradient-to-br from-[#1E293B] to-[#0B1E3C] p-8 rounded-2xl border border-[#94A3B8]/20 shadow-2xl flex flex-col justify-center h-[124px]">
            <div className="text-4xl font-black text-white">{formatCurrency(recommendedInvestment)}</div>
          </div>
        </div>
      </div>

      {/* Financial Snapshot */}
      <div className="mb-12">
        <h2 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-6 flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-orange-500"></div> Financial Snapshot
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Investable', value: formatCurrency(data.investableAmount) },
            { label: 'Investment Portfolio', value: formatCurrency(investmentPortfolio) },
            { label: 'Saving Allocation', value: formatCurrency(savingAllocation) },
            { label: 'Protection Cover', value: formatCurrency(protectionCover) },
            { label: 'Health Cover', value: formatCurrency(healthCover) },
            { label: 'Retirement Target', value: formatCurrency(retirementTarget) },
          ].map((item) => (
            <div key={item.label} className="bg-[#1E293B]/20 p-4 rounded-xl border border-[#94A3B8]/5">
              <div className="text-[8px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">{item.label}</div>
              <div className="text-sm font-black text-white">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Target Portfolio */}
      <div className="flex-1">
        <h2 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-8 text-center">Target Portfolio Structure</h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: 'Equity', sub: 'High Growth', color: 'blue-500', pct: data.equityPercent },
            { label: 'Balance', sub: 'Stability', color: 'purple-500', pct: data.balancePercent },
            { label: 'Debt', sub: 'Safety', color: 'orange-500', pct: data.debtPercent },
          ].map((item) => (
            <div key={item.label} className={`bg-[#1E293B]/40 p-6 rounded-2xl border border-${item.color}/20 text-center relative overflow-hidden`}>
              <div className={`absolute top-0 left-0 w-full h-1 bg-${item.color}`}></div>
              <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-4">{item.label}</div>
              <div className={`text-4xl font-black text-${item.color} mb-1`}>{Math.round(item.pct)}%</div>
              <div className="text-[10px] font-bold text-white opacity-80">{formatCurrency(Math.round(recommendedInvestment * item.pct / 100))} / year</div>
              <div className="text-[8px] font-bold text-[#94A3B8] uppercase tracking-tighter mt-4 opacity-50">{item.sub}</div>
            </div>
          ))}
        </div>

        {/* Visual Allocation Bar */}
        <div className="mt-16 space-y-4">
           <div className="h-3 w-full bg-[#1E293B] rounded-full overflow-hidden flex shadow-inner">
              <div style={{ width: `${data.equityPercent}%` }} className="h-full bg-gradient-to-r from-blue-600 to-blue-400"></div>
              <div style={{ width: `${data.balancePercent}%` }} className="h-full bg-gradient-to-r from-purple-600 to-purple-400"></div>
              <div style={{ width: `${data.debtPercent}%` }} className="h-full bg-gradient-to-r from-orange-600 to-orange-400"></div>
           </div>
           <div className="flex justify-center gap-12 text-[9px] font-bold uppercase tracking-[0.2em]">
              <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div> Equity</div>
              <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div> Balance</div>
              <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-orange-500"></div> Debt</div>
           </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-8 border-t border-[#94A3B8]/10 flex justify-between items-end">
        <div>
          <p className="text-xs font-bold text-white tracking-widest uppercase mb-1">Cap Guru – Smart Financial Planning</p>
          <p className="text-[8px] text-[#94A3B8] uppercase tracking-widest opacity-40 max-w-md">
            For educational purposes only. Not investment advice.
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">
            {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}
