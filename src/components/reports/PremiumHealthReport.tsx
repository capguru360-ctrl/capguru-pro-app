import React from 'react';
import { UserData } from '@/types';

interface PremiumHealthReportProps {
  data: UserData;
  id: string;
}

export function PremiumHealthReport({ data, id }: PremiumHealthReportProps) {
  const totalDebt = (Object.values(data.debtToolAmounts || {}) as number[]).reduce((a, b) => a + b, 0);
  const totalEquity = (Object.values(data.equityToolAmounts || {}) as number[]).reduce((a, b) => a + b, 0);
  const totalInvestments = totalDebt + totalEquity;

  const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;

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
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black tracking-tighter mb-2">Cap Guru</h1>
        <p className="text-xl text-[#94A3B8] font-bold uppercase tracking-widest">Advanced Financial Health Report</p>
        <div className="h-px bg-[#94A3B8]/20 w-full my-8"></div>
        <p className="text-lg text-[#94A3B8]">Prepared for <span className="text-white font-bold">{data.name}</span></p>
      </div>

      {/* Score Summary */}
      <div className="flex flex-col items-center mb-16">
        <div className="relative w-48 h-48 mb-8">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle className="text-[#1E293B] stroke-current" strokeWidth="8" fill="transparent" r="42" cx="50" cy="50" />
            <circle 
              className="text-secondary stroke-current" 
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
            <span className="text-6xl font-black text-white">{Math.round(data.healthScore)}</span>
            <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest">Score</span>
          </div>
        </div>
        <div className="bg-emerald-500/10 text-emerald-400 px-8 py-2 rounded-full text-sm font-black uppercase tracking-widest border border-emerald-500/20">
          {data.healthStage} Stage
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-3 gap-6 mb-12">
        {scoreData.map((item) => (
          <div key={item.name} className="bg-[#1E293B]/50 p-6 rounded-3xl border border-[#94A3B8]/10 text-center">
            <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-4 h-8 flex items-center justify-center">{item.name}</div>
            <div className="text-3xl font-black text-white mb-4">{item.value}<span className="text-xs text-[#94A3B8] font-medium ml-1">/{item.max}</span></div>
            <div className="h-2 w-full bg-[#0B1E3C] rounded-full overflow-hidden">
              <div 
                className={`h-full bg-${item.color} rounded-full`} 
                style={{ width: `${(item.value / item.max) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Penalties Section */}
      {breakdown.penalties > 0 && (
        <div className="mb-12 bg-red-500/10 border border-red-500/20 p-6 rounded-2xl">
          <h3 className="text-red-400 text-xs font-bold uppercase tracking-widest mb-2">Penalties Applied</h3>
          <p className="text-sm text-red-300/80">
            A total penalty of <span className="font-bold text-red-400">-{breakdown.penalties} points</span> was applied due to significant gaps in your financial profile or extreme asset imbalances.
          </p>
        </div>
      )}

      {/* Portfolio Summary */}
      <div className="mb-12">
        <h2 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-6 flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-secondary"></div> Portfolio Summary
        </h2>
        <div className="bg-[#1E293B]/40 p-8 rounded-2xl border border-[#94A3B8]/10 flex justify-between items-center">
          <div>
            <p className="text-[8px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Total Portfolio Value</p>
            <p className="text-3xl font-black text-white">{formatCurrency(totalInvestments)}</p>
          </div>
          <div className="flex gap-12">
            <div>
              <p className="text-[8px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Debt Tools</p>
              <p className="text-lg font-bold text-white">{formatCurrency(totalDebt)}</p>
            </div>
            <div>
              <p className="text-[8px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Equity Tools</p>
              <p className="text-lg font-bold text-white">{formatCurrency(totalEquity)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weaknesses Highlight */}
      <div className="space-y-6">
        <h2 className="text-sm font-bold text-[#94A3B8] uppercase tracking-widest border-l-4 border-accent pl-4">Identified Weaknesses</h2>
        <div className="grid grid-cols-1 gap-4">
          {breakdown.discipline < 15 && (
            <div className="bg-red-500/5 p-6 rounded-2xl border border-red-500/10">
              <p className="text-sm leading-relaxed text-[#94A3B8]">
                <span className="text-red-400 font-bold uppercase text-[10px] block mb-1">Investment Discipline</span>
                Your current investment-to-income ratio is significantly below the ideal benchmark of 30%.
              </p>
            </div>
          )}
          {breakdown.protection < 20 && (
            <div className="bg-red-500/5 p-6 rounded-2xl border border-red-500/10">
              <p className="text-sm leading-relaxed text-[#94A3B8]">
                <span className="text-red-400 font-bold uppercase text-[10px] block mb-1">Protection Gap</span>
                Critical insurance coverage is missing from your profile, leaving your financial plan vulnerable.
              </p>
            </div>
          )}
          {breakdown.allocation < 15 && (
            <div className="bg-red-500/5 p-6 rounded-2xl border border-red-500/10">
              <p className="text-sm leading-relaxed text-[#94A3B8]">
                <span className="text-red-400 font-bold uppercase text-[10px] block mb-1">Asset Imbalance</span>
                Your current asset allocation deviates significantly from the recommended strategy based on your profile.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-12 border-t border-[#94A3B8]/10 text-center">
        <p className="text-sm font-bold text-white mb-2 tracking-widest uppercase">Cap Guru – Smart Financial Planning</p>
        <p className="text-[10px] text-[#94A3B8] uppercase tracking-widest opacity-50">
          Educational purpose only. Not investment advice. Generated on {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
}
