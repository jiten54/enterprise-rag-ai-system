import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { ChatMessage, Document, RagResponse } from '../types';
import { queryRag } from '../services/ragService';
import { Send, Terminal, Sparkles, ShieldCheck, ChevronRight, Database, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatInterfaceProps {
  documents: Document[];
}

const MessageItem: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[95%] w-full ${isUser ? 'flex justify-end' : ''}`}>
        {isUser ? (
          <div className="bg-white border border-line rounded-2xl px-6 py-4 shadow-sm inline-block">
             <div className="flex items-center gap-3 mb-2">
                <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded text-[10px] font-bold">QUERY_INPUT</span>
                <span className="micro-label !text-slate-300">User Intent: Analysis</span>
             </div>
             <p className="text-sm font-medium text-slate-700 leading-relaxed italic">"{message.content}"</p>
          </div>
        ) : (
          <div className="bento-card !border-2 !border-accent/10 !shadow-xl relative w-full lg:w-full">
            <div className="absolute top-0 right-0 p-6 flex flex-col items-end">
              <span className="micro-label">Confidence</span>
              <span className="text-3xl font-black text-accent italic leading-none">
                {message.ragResult?.confidence === 'High' ? '98%' : 
                 message.ragResult?.confidence === 'Medium' ? '82%' : '44%'}
              </span>
            </div>

            <div className="mb-8">
              <h2 className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <span className="w-6 h-[2px] bg-accent"></span> AI_RESPONSE_OUTPUT
              </h2>
              <div className="space-y-4 pr-20 md:pr-0">
                <h3 className="text-xl font-bold text-slate-900">Analysis Summary</h3>
                <div className="markdown-body text-slate-600 leading-relaxed text-sm">
                  {message.content}
                </div>
              </div>
            </div>

            {message.ragResult && (
              <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-line">
                <div className="space-y-5">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <ChevronRight size={14} className="text-accent" />
                    Key Findings
                  </h3>
                  <ul className="space-y-3">
                    {message.ragResult.keyPoints.map((point: string, i: number) => (
                      <li key={i} className="flex gap-3 text-sm text-slate-600 leading-snug">
                        <span className="w-5 h-5 bg-accent/5 text-accent rounded flex-shrink-0 flex items-center justify-center font-bold text-[10px] border border-accent/10">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-5">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Database size={14} className="text-accent" />
                    Source Synthesis
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-line">
                      <p className="micro-label !text-slate-400 mb-2">Grounding Trace</p>
                      <p className="text-[11px] text-slate-500 font-mono italic leading-relaxed">
                        {message.ragResult.sourceSummary}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 font-mono">
                      <Terminal size={10} />
                      TRACE ID: {message.id.slice(0, 12).toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function ChatInterface({ documents }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ragResult = await queryRag(input, documents);
      
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: ragResult.answer,
        ragResult,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Messages Viewport */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-2 space-y-8 scroll-smooth"
      >
        <AnimatePresence mode="popLayout">
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center space-y-6 text-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-white border border-line flex items-center justify-center shadow-xl shadow-accent/5">
                <Sparkles className="text-accent" size={36} />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-2xl text-slate-800">Awaiting Intelligence</h3>
                <p className="text-sm text-slate-400 max-w-xs mx-auto">Upload documents and query the system to begin context-grounded analysis.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {['Summarize financial reports', 'Risk assessment policy', 'Implementation steps', 'Regional projections'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setInput(t)}
                    className="p-3 text-xs bg-white border border-line rounded-xl hover:border-accent hover:shadow-md transition-all text-slate-600 font-medium text-left flex justify-between items-center group"
                  >
                    <span>{t}</span>
                    <Terminal size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map((msg) => (
            <MessageItem key={msg.id} message={msg} />
          ))}

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/5 w-fit px-4 py-2 rounded-full border border-accent/10"
            >
              <Loader2 className="animate-spin" size={12} />
              <span>Analyzing Context Vectors...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Bento */}
      <div className="bento-card !p-4 !rounded-3xl shadow-lg">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={documents.length === 0 ? "First, upload context documents..." : "Query the core intelligence unit..."}
              disabled={isLoading}
              className="w-full bg-slate-50 border border-line rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all disabled:opacity-50 pr-12 font-medium"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
              <Terminal size={14} />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim() || documents.length === 0}
            className="bg-slate-900 text-white w-14 rounded-2xl flex items-center justify-center hover:bg-accent disabled:opacity-20 disabled:hover:bg-slate-900 transition-all shadow-lg hover:shadow-accent/40"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          </button>
        </form>
      </div>
    </div>
  );
}
