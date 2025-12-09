import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell
} from 'recharts';
import { SentenceAnalysis, DiagnosticType } from '../types';

interface ScannerChartsProps {
  data: SentenceAnalysis[];
}

export const ScannerCharts: React.FC<ScannerChartsProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  // Prepare data for chart (adding index for X-Axis)
  const chartData = data.map((d, i) => ({
    ...d,
    index: i + 1,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as SentenceAnalysis;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded shadow-xl text-xs font-mono">
          <p className="text-slate-100 mb-2 font-bold">Segment #{label}</p>
          <p className="text-emerald-400">LMC: {item.lmcScore.toFixed(2)}</p>
          <p className="text-cyan-400">Coh: {item.coherence.toFixed(2)}</p>
          <p className="text-indigo-400">Ent: {item.entropy.toFixed(2)}</p>
          <p className="mt-2 italic text-slate-500 max-w-[200px] break-words truncate">
            {item.text.substring(0, 50)}...
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px] bg-slate-900/50 rounded-lg border border-slate-700 p-4 backdrop-blur-sm">
      <h3 className="text-slate-400 font-mono text-xs uppercase mb-4 tracking-widest">
        Real-time Cognitive Resonance Monitor
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="index" 
            stroke="#475569" 
            tick={{ fontSize: 10, fontFamily: 'monospace' }} 
            label={{ value: 'SEQUENCE', position: 'insideBottom', offset: -5, fill: '#475569', fontSize: 10 }}
          />
          <YAxis 
            stroke="#475569" 
            tick={{ fontSize: 10, fontFamily: 'monospace' }}
            domain={[0, 'auto']}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
          
          <ReferenceLine y={1.8} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'OPTIMAL THRESHOLD', position: 'insideTopRight', fill: '#10b981', fontSize: 10 }} />
          
          <Bar dataKey="lmcScore" barSize={20} fill="#6366f1" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={
                  entry.diagnostic === DiagnosticType.DECROCHAGE ? '#f43f5e' : // rose-500
                  entry.diagnostic === DiagnosticType.OPTIMAL ? '#10b981' : // emerald-500
                  entry.diagnostic === DiagnosticType.BRUIT ? '#e879f9' : // fuchsia-400
                  entry.diagnostic === DiagnosticType.STEREOTYPE ? '#fbbf24' : // amber-400
                  '#64748b' // slate-500
                } 
              />
            ))}
          </Bar>
          
          <Line 
            type="monotone" 
            dataKey="coherence" 
            stroke="#22d3ee" 
            strokeWidth={2} 
            dot={false} 
            activeDot={{ r: 4 }} 
            name="Coherence"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};