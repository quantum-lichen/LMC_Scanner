import React, { useState, useCallback } from 'react';
import { performCognitiveScan } from './services/geminiService';
import { ScannerState } from './types';
import { ScannerTable } from './components/ScannerTable';
import { ScannerCharts } from './components/ScannerCharts';
import { Activity, Brain, Zap, AlertTriangle, FileText, Sparkles } from 'lucide-react';

// Example prompt from the Python script for easy testing
const EXAMPLE_CONTEXT = "L'étude des étoiles, des planètes et de l'univers";
const EXAMPLE_TEXT = `Le système solaire est composé de huit planètes orbitant autour du Soleil.
La gravité maintient la cohésion des corps célestes dans la galaxie.
Les pommes de terre cuites chantent du jazz dans la rivière quantique du temps.
L'astrophysique étudie les propriétés physiques des objets célestes.
Le système est le système est le système est le système.
La nucléosynthèse stellaire produit des éléments lourds comme le carbone.
Xyz kjhdf kjhsdfkuy sdkjfh skdjfh kjsdfh gfdg.`;

const StatCard: React.FC<{ label: string; value: string; icon: React.ReactNode; color: string }> = ({ label, value, icon, color }) => (
  <div className="bg-slate-900/50 border border-slate-700 p-4 rounded-lg backdrop-blur-sm flex items-center space-x-4">
    <div className={`p-3 rounded-full bg-slate-800 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">{label}</p>
      <p className="text-slate-100 text-xl font-bold font-mono">{value}</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [state, setState] = useState<ScannerState>({
    contextTopic: '',
    textBlock: '',
    isScanning: false,
    result: null,
    error: null,
  });

  const handleScan = useCallback(async () => {
    if (!state.contextTopic || !state.textBlock) return;

    setState(prev => ({ ...prev, isScanning: true, error: null }));

    try {
      const result = await performCognitiveScan(state.contextTopic, state.textBlock);
      setState(prev => ({ ...prev, result, isScanning: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isScanning: false, 
        error: error instanceof Error ? error.message : "An unknown error occurred" 
      }));
    }
  }, [state.contextTopic, state.textBlock]);

  const loadExample = () => {
    setState(prev => ({
      ...prev,
      contextTopic: EXAMPLE_CONTEXT,
      textBlock: EXAMPLE_TEXT
    }));
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-emerald-500/30">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
              <Brain className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-slate-100">Cognitive Scanner</h1>
              <p className="text-[10px] text-emerald-500 font-mono uppercase tracking-widest">LMC Law Implementation v1.0</p>
            </div>
          </div>
          <a 
            href="https://ai.google.dev" 
            target="_blank" 
            rel="noreferrer"
            className="text-xs text-slate-500 hover:text-emerald-400 transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-3 h-3" />
            Powered by Gemini 2.5 Flash
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              
              <h2 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                Input Parameters
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">CONTEXT ANCHOR (TOPIC)</label>
                  <input
                    type="text"
                    value={state.contextTopic}
                    onChange={(e) => setState(prev => ({ ...prev, contextTopic: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-700"
                    placeholder="e.g. Astrophysics"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-mono text-slate-400">ANALYSIS STREAM (TEXT)</label>
                    <button onClick={loadExample} className="text-[10px] text-emerald-500 hover:text-emerald-300 underline font-mono cursor-pointer">
                      Load Example
                    </button>
                  </div>
                  <textarea
                    value={state.textBlock}
                    onChange={(e) => setState(prev => ({ ...prev, textBlock: e.target.value }))}
                    className="w-full h-48 bg-slate-950 border border-slate-700 rounded p-2 text-sm font-mono focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none placeholder:text-slate-700"
                    placeholder="Paste the text to scan here..."
                  />
                </div>

                <button
                  onClick={handleScan}
                  disabled={state.isScanning || !state.contextTopic || !state.textBlock}
                  className={`w-full py-3 rounded font-mono text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2
                    ${state.isScanning 
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/50'
                    }`}
                >
                  {state.isScanning ? (
                    <>
                      <Zap className="w-4 h-4 animate-spin" /> Processing Cortex...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" /> Initialize Scan
                    </>
                  )}
                </button>
                
                {state.error && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded text-rose-400 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    {state.error}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {state.result ? (
              <>
                 {/* Top Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCard 
                    label="Avg. LMC Score" 
                    value={state.result.averageLmc.toFixed(2)} 
                    icon={<Activity className="w-5 h-5 text-indigo-300" />}
                    color="text-indigo-400"
                  />
                  <StatCard 
                    label="Avg. Coherence" 
                    value={state.result.averageCoherence.toFixed(2)} 
                    icon={<Brain className="w-5 h-5 text-cyan-300" />}
                    color="text-cyan-400"
                  />
                  <StatCard 
                    label="Avg. Entropy" 
                    value={state.result.averageEntropy.toFixed(2)} 
                    icon={<Zap className="w-5 h-5 text-emerald-300" />}
                    color="text-emerald-400"
                  />
                </div>

                {/* Chart */}
                <ScannerCharts data={state.result.sentences} />

                {/* Table */}
                <ScannerTable data={state.result.sentences} />
              </>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center border border-slate-800 border-dashed rounded-xl bg-slate-900/30">
                <Brain className="w-16 h-16 text-slate-800 mb-4" />
                <p className="text-slate-500 font-mono text-sm">Awaiting neural input...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;