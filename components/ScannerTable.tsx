import React from 'react';
import { SentenceAnalysis, DiagnosticType } from '../types';

interface ScannerTableProps {
  data: SentenceAnalysis[];
}

const getDiagnosticColor = (diag: DiagnosticType) => {
  switch (diag) {
    case DiagnosticType.OPTIMAL: return 'text-emerald-400 font-bold';
    case DiagnosticType.DECROCHAGE: return 'text-rose-500 font-bold';
    case DiagnosticType.STEREOTYPE: return 'text-amber-400';
    case DiagnosticType.BRUIT: return 'text-fuchsia-400';
    default: return 'text-slate-400';
  }
};

const getRowStyle = (diag: DiagnosticType) => {
   switch (diag) {
    case DiagnosticType.DECROCHAGE: return 'bg-rose-500/10';
    case DiagnosticType.OPTIMAL: return 'bg-emerald-500/10';
    default: return 'hover:bg-slate-800/50';
  }
};

export const ScannerTable: React.FC<ScannerTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-700 bg-slate-900/50 backdrop-blur-sm">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-950 text-xs uppercase text-slate-400 border-b border-slate-800">
          <tr>
            <th className="px-6 py-3 font-mono tracking-wider">Sentence Segment</th>
            <th className="px-6 py-3 font-mono tracking-wider text-right">Coherence</th>
            <th className="px-6 py-3 font-mono tracking-wider text-right">Entropy</th>
            <th className="px-6 py-3 font-mono tracking-wider text-right">LMC Score</th>
            <th className="px-6 py-3 font-mono tracking-wider">Diagnostic</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {data.map((item) => (
            <tr key={item.id} className={`transition-colors ${getRowStyle(item.diagnostic)}`}>
              <td className="px-6 py-4 font-medium text-slate-100 max-w-md truncate" title={item.text}>
                {item.text}
              </td>
              <td className="px-6 py-4 font-mono text-right text-cyan-400">
                {item.coherence.toFixed(2)}
              </td>
              <td className="px-6 py-4 font-mono text-right text-indigo-400">
                {item.entropy.toFixed(2)}
              </td>
              <td className="px-6 py-4 font-mono text-right text-slate-100">
                {item.lmcScore.toFixed(2)}
              </td>
              <td className={`px-6 py-4 font-mono text-xs uppercase tracking-wider ${getDiagnosticColor(item.diagnostic)}`}>
                {item.diagnostic}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="p-8 text-center text-slate-500 italic">
          No data analyzed yet. Initiate scan.
        </div>
      )}
    </div>
  );
};