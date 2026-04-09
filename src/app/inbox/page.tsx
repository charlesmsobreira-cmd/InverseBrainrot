'use client';

import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { ArrowLeft, Tray, Plus, Trash, Check, Selection } from '@phosphor-icons/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Capture {
  id: string;
  text: string;
}

interface Task {
  id: string;
  text: string;
  done: boolean;
  completedAt?: number; // Timestamp
}

export default function InboxPage() {
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [newCapture, setNewCapture] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedCaptures = localStorage.getItem('inbox_captures');
    const savedTasks = localStorage.getItem('routine_tasks');
    
    let parsedCaptures = savedCaptures ? JSON.parse(savedCaptures) : [];
    let parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];

    // Auto-delete logic: Filter out tasks completed more than 5 days ago
    const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    parsedTasks = parsedTasks.filter((task: Task) => {
      if (task.done && task.completedAt) {
        return now - task.completedAt < FIVE_DAYS_MS;
      }
      return true;
    });
    
    setCaptures(parsedCaptures);
    setTasks(parsedTasks);
    setIsLoaded(true);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('inbox_captures', JSON.stringify(captures));
      localStorage.setItem('routine_tasks', JSON.stringify(tasks));
    }
  }, [captures, tasks, isLoaded]);

  const addCapture = () => {
    if (!newCapture.trim()) return;
    const item: Capture = { id: Date.now().toString(), text: newCapture.trim() };
    setCaptures([item, ...captures]);
    setNewCapture('');
  };

  const removeCapture = (id: string) => {
    setCaptures(captures.filter(c => c.id !== id));
  };

  const promoteToTask = (capture: Capture) => {
    const newTask: Task = { id: Date.now().toString(), text: capture.text, done: false };
    setTasks([newTask, ...tasks]);
    removeCapture(capture.id);
  };

  return (
    <main className="min-h-screen bg-white text-black p-6 md:p-12 lg:p-24 selection:bg-black selection:text-white">
      <div className="max-w-2xl mx-auto w-full">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-8 mb-24">
          <Link href="/">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm"
            >
              <ArrowLeft size={24} weight="bold" />
            </motion.button>
          </Link>
          <div>
            <div className="flex items-center justify-center gap-3 mb-2">
              <Tray size={20} weight="fill" className="text-black/20" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20">Captura Direta</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none italic">
              Inbox
            </h1>
          </div>
        </div>

        {/* Central Capture Area */}
        <section className="flex flex-col gap-12">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-12 flex items-center gap-3 justify-center">
              <Selection size={24} weight="bold" className="text-black/10" />
              Drenagem Mental
            </h2>
            
            <div className="relative mb-16">
              <input 
                type="text" 
                value={newCapture}
                onChange={(e) => setNewCapture(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCapture()}
                placeholder="Capture uma nova ideia..."
                className="w-full bg-black/5 border-none outline-none p-8 rounded-[2.5rem] text-xl font-bold placeholder:text-black/20 focus:bg-black/10 transition-all shadow-inner"
              />
              <button 
                onClick={addCapture}
                className="absolute right-4 top-4 w-14 h-14 bg-black text-white rounded-[1.5rem] flex items-center justify-center hover:scale-105 transition-transform shadow-xl"
              >
                <Plus size={24} weight="bold" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <AnimatePresence mode="popLayout">
                {captures.map((item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: 20 }}
                    key={item.id}
                    className="group p-6 bg-white border border-black/5 rounded-[2rem] flex items-center justify-between hover:border-black/20 transition-all shadow-sm"
                  >
                    <span className="text-lg font-bold tracking-tight break-words min-w-0 flex-1 mr-6">{item.text}</span>
                    <div className="flex items-center gap-3 flex-shrink-0">
                       <button 
                         onClick={() => promoteToTask(item)}
                         className="flex items-center gap-2 px-5 py-3 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg whitespace-nowrap"
                       >
                         Mover para To-Do
                         <Check size={14} weight="bold" />
                       </button>
                       <button 
                         onClick={() => removeCapture(item.id)}
                         className="w-10 h-10 rounded-full flex items-center justify-center text-black/10 hover:text-red-500 hover:bg-red-500/5 transition-all flex-shrink-0"
                       >
                         <Trash size={18} />
                       </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {captures.length === 0 && (
                <div className="py-24 text-center border-2 border-dashed border-black/10 rounded-[4rem]">
                  <p className="text-xs font-black uppercase tracking-[0.4em] text-black/10 italic">Aguardando novas ideias...</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
