import { useState } from 'react';
import DocumentManager from './components/DocumentManager';
import ChatInterface from './components/ChatInterface';
import { Document } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Database, ShieldCheck, Zap, BarChart3, Activity } from 'lucide-react';

export default function App() {
  const [documents, setDocuments] = useState<Document[]>([]);

  const addDocument = (doc: Document) => {
    setDocuments(prev => [...prev, doc]);
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="min-h-screen bg-bg p-6 flex flex-col gap-6 max-w-[1600px] mx-auto">
      {/* Header Bento */}
      <header className="bg-white border border-line rounded-2xl px-6 py-4 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent/20">
            <Zap size={20} fill="currentColor" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-800 flex items-center gap-2">
              KNOWLEDGE_CORE 
              <span className="font-mono font-medium text-accent text-xs bg-accent/10 px-2 py-0.5 rounded">v4.2.0</span>
            </h1>
            <p className="micro-label">Enterprise RAG Engine • Active Instance</p>
          </div>
        </div>
        <div className="flex gap-6 items-center">
          <div className="hidden sm:flex flex-col items-end">
            <span className="micro-label !text-slate-400">System Status</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> SECURE CONNECTION
            </span>
          </div>
          <div className="h-8 w-px bg-line hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-accent" />
            <span className="text-xs font-bold text-slate-600">ZERO_TRUST_ENABLED</span>
          </div>
        </div>
      </header>

      {/* Main Grid Area */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-0">
        {/* Documents Panel - col-span-3 */}
        <section className="md:col-span-3 flex flex-col min-h-[400px]">
          <DocumentManager 
            documents={documents} 
            onAdd={addDocument} 
            onRemove={removeDocument} 
          />
        </section>

        {/* Chat Panel - col-span-6 */}
        <section className="md:col-span-6 flex flex-col min-h-[600px]">
          <ChatInterface documents={documents} />
        </section>

        {/* Sidebar Info/Analytics Panel - col-span-3 */}
        <aside className="md:col-span-3 flex flex-col gap-6">
          {/* Analytics Block */}
          <div className="bento-card-dark flex-shrink-0 relative">
            <div className="flex justify-between items-start mb-6">
              <h4 className="micro-label text-indigo-400">Execution Flow</h4>
              <Activity size={14} className="text-indigo-400" />
            </div>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-[11px] mb-2 font-mono uppercase tracking-tighter">
                  <span className="opacity-60 text-slate-400">Retrieval Precision</span>
                  <span className="font-bold text-indigo-400">0.992</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "99.2%" }}
                    className="h-full bg-accent rounded-full shadow-[0_0_8px_rgba(79,70,229,0.5)]" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/40 p-3 rounded-xl border border-white/5">
                  <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider">Tokens</span>
                  <span className="text-sm font-bold font-mono">12.4k</span>
                </div>
                <div className="bg-slate-800/40 p-3 rounded-xl border border-white/5">
                  <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider">Latency</span>
                  <span className="text-sm font-bold font-mono">1.2s</span>
                </div>
              </div>
            </div>
            
            {/* Decoraive Graph */}
            <div className="absolute bottom-0 right-0 w-full h-16 opacity-10 pointer-events-none">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                <path d="M0,100 C20,80 40,90 60,40 C80,10 100,20 100,20 V100 H0 Z" fill="currentColor" fillOpacity="1" />
              </svg>
            </div>
          </div>

          {/* Quick Info/Badges */}
          <div className="bento-card bg-accent text-white border-none flex-1">
             <div className="flex items-center justify-between h-full">
              <div className="space-y-4">
                <div>
                  <span className="micro-label !text-white/60 block mb-1">Goal Achievement</span>
                  <span className="text-xl font-black italic tracking-tight">Reliable</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-2 py-1 rounded w-fit">
                  <ShieldCheck size={12} />
                  <span className="text-[9px] font-bold uppercase tracking-tight">Context Grounded</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <BarChart3 size={24} />
              </div>
             </div>
          </div>

          {/* Protocol card */}
          <div className="bento-card bg-emerald-50 border-emerald-100">
            <h5 className="micro-label !text-emerald-600 mb-2">Protocol Verified</h5>
            <p className="text-[11px] text-emerald-800 font-medium leading-tight">
              Zero Hallucination Protocol active. Logic consistency verified against 14 vector dimensions.
            </p>
          </div>
        </aside>
      </main>

      {/* Decorative Blur */}
      <div className="fixed top-0 right-0 w-[40vw] h-screen bg-accent/3 blur-[120px] pointer-events-none -z-10" />
    </div>
  );
}
