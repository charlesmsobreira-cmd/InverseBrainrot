'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Tray, FloppyDisk, Trash, CloudArrowUp } from '@phosphor-icons/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function InboxPage() {
  const [note, setNote] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedNote = localStorage.getItem('brain-os-inbox');
    if (savedNote) {
      setNote(savedNote);
    }
  }, []);

  // Auto-save logic with debounce-like effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (note !== localStorage.getItem('brain-os-inbox')) {
        setIsSaving(true);
        localStorage.setItem('brain-os-inbox', note);
        
        // Mock a brief saving indicator delay
        setTimeout(() => {
          setIsSaving(false);
          setLastSaved(new Date().toLocaleTimeString());
        }, 600);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [note]);

  const clearNote = () => {
    if (confirm('Tem certeza que deseja apagar tudo? Esta ação não pode ser desfeita.')) {
      setNote('');
      localStorage.removeItem('brain-os-inbox');
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] p-6 md:p-12 lg:p-24 overflow-hidden flex flex-col">
      <div className="max-w-[1400px] mx-auto w-full flex-1 flex flex-col">
        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <Link href="/">
              <motion.button 
                whileHover={{ x: -5 }}
                className="group flex items-center justify-center w-12 h-12 bg-white rounded-full border border-black/5 hover:bg-black/5 transition-all shadow-sm"
              >
                <ArrowLeft size={24} className="text-titanium-100" />
              </motion.button>
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-azure-500 rounded-2xl flex items-center justify-center shadow-lg shadow-azure-500/20">
                <Tray size={28} className="text-white" weight="fill" />
              </div>
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-titanium-100 leading-none">
                  Inbox
                </h1>
                <p className="text-sm font-mono text-titanium-400 uppercase tracking-widest mt-1">
                  Captura Rápida
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md px-6 py-3 rounded-full border border-black/5 shadow-sm">
            <AnimatePresence mode="wait">
              {isSaving ? (
                <motion.div 
                  key="saving"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-azure-500 text-sm font-bold uppercase tracking-widest"
                >
                  <CloudArrowUp size={18} className="animate-pulse" />
                  Salvando...
                </motion.div>
              ) : (
                <motion.div 
                  key="saved"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-titanium-400 text-xs font-mono"
                >
                  <FloppyDisk size={18} />
                  {lastSaved ? `Última sincronização: ${lastSaved}` : 'Pronto para escrever'}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Notepad Area */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col relative group"
        >
          <div className="absolute inset-0 bg-azure-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
          
          <div className="flex-1 glass-panel rounded-[3rem] p-8 md:p-12 relative overflow-hidden flex flex-col shadow-2xl">
             <textarea
               value={note}
               onChange={(e) => setNote(e.target.value)}
               placeholder="Comece a digitar sua ideia..."
               className="flex-1 w-full bg-transparent border-none outline-none text-xl md:text-2xl leading-relaxed text-titanium-100 placeholder:text-titanium-500/50 resize-none font-light selection:bg-azure-500/10 selection:text-azure-600"
               autoFocus
             />

             {/* Bottom Actions */}
             <div className="flex justify-end gap-4 pt-6 border-t border-black/5">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearNote}
                  className="flex items-center gap-2 px-6 py-3 rounded-full text-titanium-400 hover:text-red-500 hover:bg-red-500/5 transition-all text-xs font-bold uppercase tracking-widest"
                >
                  <Trash size={18} />
                  Limpar Inbox
                </motion.button>
             </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
