'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Coffee, CurrencyDollar, CalendarCheck, CheckCircle, ArrowRight } from '@phosphor-icons/react';
import { useState } from 'react';

// 1. Routine Section
const initialTasks = [
  { id: 1, text: 'Review Next.js Docs', done: false },
  { id: 2, text: 'Workout Session', done: true },
  { id: 3, text: 'Read "Atomic Habits"', done: false },
];

function RoutineSection() {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (id: number) => {
    setTasks(prev => {
      const newTasks = prev.map(t => t.id === id ? { ...t, done: !t.done } : t);
      return newTasks.sort((a, b) => Number(a.done) - Number(b.done));
    });
  };

  return (
    <section className="w-full bg-titanium-950 py-32 border-b border-white/5 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left: Text */}
        <div className="z-10">
          <motion.h2 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white mb-6"
          >
            Minha Rotina
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-lg text-titanium-400 max-w-md leading-relaxed"
          >
            Inteligência e ritmo combinados.
          </motion.p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 px-8 py-4 bg-white text-titanium-950 font-bold tracking-widest uppercase text-sm flex items-center justify-center hover:bg-titanium-200 transition-colors"
          >
            Ver Calendário Completo
          </motion.button>
        </div>

        {/* Right: Widget */}
        <div className="relative">
          <div className="absolute inset-0 bg-titanium-800 blur-[100px] opacity-30 rounded-full mix-blend-screen pointer-events-none" />
          <div className="p-8 glass-panel rounded-3xl relative z-10">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3 text-titanium-200">
                <CalendarCheck size={28} />
                <h3 className="text-xl font-semibold">Tarefas do Dia</h3>
              </div>
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono text-titanium-200">3 Tasks</span>
            </div>
            <div className="flex flex-col gap-3">
              <AnimatePresence>
                {tasks.map(task => (
                  <motion.div
                    layout
                    layoutId={`task-${task.id}`}
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`flex items-center justify-between p-5 rounded-2xl border transition-colors cursor-pointer ${
                      task.done 
                        ? 'bg-titanium-800/30 border-white/5 text-titanium-500' 
                        : 'bg-titanium-800 border-white/10 hover:border-white/30 text-titanium-100'
                    }`}
                    onClick={() => toggleTask(task.id)}
                  >
                    <span className="text-base font-medium">{task.text}</span>
                    <CheckCircle size={24} weight={task.done ? 'fill' : 'regular'} className={task.done ? 'text-green-500/50' : 'text-titanium-400'} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 2. Study Section
function StudySection() {
  return (
    <section className="w-full bg-titanium-900 py-32 border-b border-white/5 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left: Component */}
        <div className="order-2 md:order-1 relative flex justify-center">
          <div className="absolute inset-0 bg-blue-500/10 blur-[100px] opacity-40 rounded-full mix-blend-screen pointer-events-none" />
          <motion.div 
            whileHover={{ y: -10, rotate: -2 }}
            className="w-full max-w-sm aspect-square titanium-card flex flex-col items-center justify-center group"
          >
            <BookOpen size={80} className="text-titanium-300 group-hover:text-blue-400 transition-colors duration-500 mb-6" weight="duotone" />
            <h3 className="text-2xl font-bold text-white mb-2">Engenharia</h3>
            <p className="text-titanium-400 font-mono text-sm">2 Horas restantes</p>
          </motion.div>
        </div>

        {/* Right: Text */}
        <div className="order-1 md:order-2 z-10 flex flex-col md:items-end md:text-right">
          <motion.h2 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white mb-6"
          >
            Foco & Estudos
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-lg text-titanium-400 max-w-md leading-relaxed"
          >
            O aprendizado exige controle absoluto e disciplina imperdoável.
          </motion.p>
          <motion.button 
            whileHover={{ x: -5 }}
            className="mt-8 flex items-center gap-2 text-sm text-titanium-300 hover:text-white transition-colors uppercase tracking-widest font-bold"
          >
            <ArrowRight size={20} className="rotate-180 md:rotate-0 md:hidden" />
            <span className="hidden md:inline"><ArrowRight size={20} className="rotate-180" /></span>
             Abrir Cadernos 
          </motion.button>
        </div>
      </div>
    </section>
  );
}

// 3. Finance Section
function FinanceSection() {
  return (
    <section className="w-full bg-titanium-800 py-32 border-b border-white/5 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left: Text */}
        <div className="z-10">
          <motion.h2 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white mb-6"
          >
            Finanças
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-lg text-titanium-300 max-w-md leading-relaxed"
          >
            A alocação pragmática de recursos é o que define o amanhã.
          </motion.p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 px-8 py-4 bg-titanium-950 text-white font-bold tracking-widest uppercase text-sm flex items-center justify-center hover:bg-black transition-colors"
          >
            Análise Completa
          </motion.button>
        </div>

        {/* Right: Component */}
        <div className="relative">
          <div className="p-10 glass-panel rounded-3xl group">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xl font-semibold text-titanium-300 uppercase tracking-wider text-sm mb-1">Patrimônio Líquido</h3>
                <motion.div 
                   initial={{ opacity: 0 }} 
                   whileInView={{ opacity: 1 }} 
                   viewport={{ once: true }}
                   className="text-5xl font-mono text-white"
                >
                  $14,290.<span className="text-titanium-500">55</span>
                </motion.div>
              </div>
              <CurrencyDollar size={40} className="text-emerald-400" />
            </div>
            
            {/* Abstract chart simulation */}
            <div className="h-32 w-full flex items-end gap-3 mt-4 px-2">
              {[40, 25, 60, 45, 80, 50, 90, 75, 100].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', damping: 15, delay: i * 0.05 }}
                  className="flex-1 bg-white/10 rounded-t-sm hover:bg-emerald-400 transition-colors"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 4. Consume Section
function ConsumeSection() {
  return (
    <section className="w-full bg-titanium-950 py-32 border-b border-white/5 relative overflow-hidden pb-48">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left: Component */}
        <div className="order-2 md:order-1 relative flex justify-center">
          <div className="grid grid-cols-2 gap-4 translate-x-6">
            {[1, 2, 3, 4].map((i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', delay: i * 0.1 }}
                whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2, zIndex: 20 }}
                className={`w-32 h-48 md:w-48 md:h-64 rounded-xl border border-white/10 bg-titanium-800 shadow-2xl overflow-hidden relative ${i % 2 === 0 ? 'translate-y-8' : ''}`}
              >
                <img src={`https://picsum.photos/seed/consume${i}/300/400`} alt="Media cover" className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: Text */}
        <div className="order-1 md:order-2 z-10 flex flex-col md:items-end md:text-right">
          <motion.h2 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white mb-6"
          >
            Consumo
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-lg text-titanium-400 max-w-md leading-relaxed"
          >
            O que você consome molda sua mente.
          </motion.p>
          
          <div className="mt-8 flex gap-4">
             <div className="w-12 h-12 rounded-full border border-titanium-700 flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer text-titanium-300">
               <Coffee size={24} />
             </div>
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="px-8 py-0 h-12 bg-white/10 text-white font-bold tracking-widest uppercase text-sm flex items-center justify-center hover:bg-white/20 transition-colors rounded-full"
             >
               Galeria
             </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectionsLayout() {
  return (
    <>
      <RoutineSection />
      <StudySection />
      <FinanceSection />
      <ConsumeSection />
    </>
  );
}
