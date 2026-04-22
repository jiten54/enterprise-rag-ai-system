import { useState } from 'react';
import { Document } from '../types';
import { Plus, Trash2, FileText, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DocumentManagerProps {
  documents: Document[];
  onAdd: (doc: Document) => void;
  onRemove: (id: string) => void;
}

export default function DocumentManager({ documents, onAdd, onRemove }: DocumentManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleAdd = () => {
    if (!newTitle || !newContent) return;
    onAdd({
      id: crypto.randomUUID(),
      title: newTitle,
      content: newContent
    });
    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
  };

  return (
    <div className="bento-card !p-0">
      <div className="p-6 border-b border-line space-y-1">
        <h2 className="micro-label">Knowledge Base</h2>
        <p className="font-bold text-slate-800">Context Documents</p>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4">
        <AnimatePresence mode="popLayout">
          {documents.map((doc) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={doc.id}
              className="group flex flex-col p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-line transition-all mb-2 cursor-default"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-bold text-accent font-mono">ID: {doc.id.slice(0, 5).toUpperCase()}</span>
                <button 
                  onClick={() => onRemove(doc.id)}
                  className="opacity-0 group-hover:opacity-60 hover:opacity-100 hover:text-red-500 transition-all p-1"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <FileText size={14} className="text-slate-400" />
                <p className="font-bold truncate text-[13px] text-slate-700">{doc.title}</p>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-2 leading-relaxed bg-slate-50/50 p-2 rounded-lg italic">
                {doc.content}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>

        {documents.length === 0 && !isAdding && (
          <div className="p-8 text-center opacity-30 flex flex-col items-center justify-center h-full gap-2">
            <FileText size={32} strokeWidth={1} />
            <p className="micro-label">No documents</p>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-line">
        {isAdding ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-line"
          >
            <input
              autoFocus
              placeholder="Document Title"
              className="w-full bg-white border border-line rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-accent transition-all"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <textarea
              placeholder="Content..."
              rows={4}
              className="w-full bg-white border border-line rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-accent transition-all resize-none"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="flex-1 bg-accent text-white py-2 text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Incorporate
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="px-3 bg-white border border-line hover:bg-slate-50 py-2 text-xs font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full group flex items-center justify-between p-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl hover:bg-slate-100 transition-all duration-300"
          >
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Add Context</span>
            <Plus size={16} className="text-slate-400 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        )}
      </div>
    </div>
  );
}
