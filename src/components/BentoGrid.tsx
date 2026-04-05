'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Coffee, CurrencyDollar, CalendarCheck, CheckCircle, ArrowRight } from '@phosphor-icons/react';
import { useState, useEffect } from 'react';

// 1. The Intelligent List (Rotina)
const initialTasks = [
  { id: 1, text: 'Review Next.js Docs', done: false },
  { id: 2, text: 'Workout Session', done: true },
  { id: 3, text: 'Read "Atomic Habits"', done: false },
];

function RoutineWidget() {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (id: number) => {
    setTasks(prev => {
      const newTasks = prev.map(t => t.id === id ? { ...t, done: !t.done } : t);
      return newTasks.sort((a, b) => Number(a.done) - Number(b.done));
    });
  };

  return (
    <div className="titanium-card col-span-1 md:col-span-2 row-span-2 flex flex-col justify-between relative group overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10 mix-blend-screen group-hover:scale-110 transition-transform duration-700">
        <CalendarCheck size={120} weight="duotone" />
      </div>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">Rotina</h2>
          <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono">3 Tasks</span>
        </div>
        <div className="flex flex-col gap-3 relative z-10">
          <AnimatePresence>
            {tasks.map(task => (
              <motion.div
                layout
                layoutId={`task-${task.id}`}
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-colors cursor-pointer ${
                  task.done 
                    ? 'bg-titanium-800/30 border-white/5 text-titanium-500' 
                    : 'bg-titanium-800 border-white/10 hover:border-white/30 text-titanium-100'
                }`}
                onClick={() => toggleTask(task.id)}
              >
                <span className="text-sm font-medium">{task.text}</span>
                <CheckCircle size={20} weight={task.done ? 'fill' : 'regular'} className={task.done ? 'text-green-500/50' : 'text-titanium-400'} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// 2. The Contextual UI (Estudos)
function StudyWidget() {
  return (
    <div className="titanium-card col-span-1 flex flex-col justify-between group overflow-hidden relative">
       <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
       <div>
        <BookOpen size={32} className="text-blue-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Estudos</h2>
        <p className="text-titanium-400 text-sm">Foco profundo. 2 Sessões ativas.</p>
       </div>
       <motion.button 
         whileHover={{ x: 5 }}
         className="mt-8 flex items-center gap-2 text-sm text-titanium-300 hover:text-white transition-colors"
       >
         Abrir Cadernos <ArrowRight size={16} />
       </motion.button>
    </div>
  );
}

// 3. The Wide Data Stream (Finanças)
function FinanceWidget() {
  return (
    <div className="titanium-card col-span-1 md:col-span-2 overflow-hidden relative group">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-titanium-300">Net Worth</h2>
          <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             className="text-4xl font-mono mt-2"
          >
            $14,290.<span className="text-titanium-500">55</span>
          </motion.div>
        </div>
        <CurrencyDollar size={32} className="text-emerald-400" />
      </div>
      
      {/* Abstract chart simulation */}
      <div className="h-24 w-full flex items-end gap-2 mt-4 px-2">
        {[40, 25, 60, 45, 80, 50, 90, 75, 100].map((h, i) => (
          <motion.div 
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            transition={{ type: 'spring', damping: 15, delay: i * 0.05 }}
            className="flex-1 bg-white/10 rounded-t-sm hover:bg-emerald-400/50 transition-colors"
          />
        ))}
      </div>
    </div>
  );
}

// 4. Consumo (Media/Books)
function ConsumeWidget() {
  return (
    <div className="titanium-card col-span-1 flex flex-col justify-between group">
      <div>
        <Coffee size={32} className="text-orange-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Consumo</h2>
        <p className="text-titanium-400 text-sm leading-relaxed tracking-wide">
          Filmes, livros e artigos na lista de espera.
        </p>
      </div>
      <div className="mt-6 flex -space-x-4">
        {[1,2,3].map(i => (
          <div key={i} className="w-10 h-10 rounded-full border-2 border-titanium-900 bg-titanium-800 shadow-xl overflow-hidden">
            <img src={`https://picsum.photos/seed/consume${i}/100/100`} alt="Media cover" className="w-full h-full object-cover opacity-80" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function BentoGrid() {
  return (
    <section className="w-full pb-32 mb-10 px-4 md:px-0">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
      >
        <RoutineWidget />
        <StudyWidget />
        <ConsumeWidget />
        <FinanceWidget />
        
        {/* Command Input / Quick Add */}
        <div className="titanium-card col-span-1 md:col-span-3 hover:bg-titanium-800 transition-colors cursor-text group flex items-center justify-between !py-6">
           <div className="text-titanium-500 font-mono text-sm group-hover:text-titanium-300 transition-colors">
              Fale com seu cérebro...
           </div>
           <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded font-mono text-xs text-titanium-400">⌘ + K</kbd>
        </div>
      </motion.div>
    </section>
  );
}
