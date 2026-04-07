'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Coffee, CurrencyDollar, CheckCircle, ArrowRight, X, Sparkle, MusicNotes, BookmarkSimple, FilmStrip } from '@phosphor-icons/react';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// --- Interfaces ---
interface Recommendation {
  category: string;
  title: string;
  author: string;
  briefing: string;
}

interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: Recommendation | null;
}

interface Task {
  id: number;
  text: string;
  done: boolean;
}

// --- Sub-componente: Modal de Recomendação (Inspiração) ---
const RecommendationModal = ({ isOpen, onClose, recommendation }: RecommendationModalProps) => {
  if (!isOpen || !recommendation) return null;

  const IconType = {
    'Música': <MusicNotes size={32} weight="fill" className="text-azure-500" />,
    'Livro': <BookmarkSimple size={32} weight="fill" className="text-emerald-500" />,
    'Filme': <FilmStrip size={32} weight="fill" className="text-pink-500" />
  }[recommendation.category as 'Música' | 'Livro' | 'Filme'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 1.1, opacity: 0, y: -20 }}
        className="relative w-full max-w-lg bg-[#121212] border border-white/10 rounded-3xl shadow-2xl p-10 text-white overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-azure-500/10 blur-[100px] pointer-events-none" />
        
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
            {IconType}
          </div>
          <button onClick={onClose} className="p-2 text-white/20 hover:text-white transition-colors">
            <X size={24} weight="bold" />
          </button>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 opacity-40">
            <Sparkle size={14} weight="fill" className="text-azure-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Sugestão do Dia</span>
          </div>
          
          <h3 className="text-4xl font-black uppercase tracking-tighter leading-none mb-4 italic">
            {recommendation.title}
          </h3>
          
          <div className="flex items-center gap-2 mb-8">
             <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-azure-400 border border-azure-500/20">
               {recommendation.category}
             </span>
             <span className="text-[10px] font-mono text-white/30 italic">por {recommendation.author}</span>
          </div>

          <div className="space-y-4">
            <p className="text-sm md:text-base text-white/70 leading-relaxed font-mono italic">
               &quot;{recommendation.briefing}&quot;
            </p>
          </div>

          <div className="mt-12 flex justify-center">
             <button 
               onClick={onClose}
               className="px-12 py-4 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-azure-500 hover:text-white transition-all shadow-xl"
             >
               Fechar Inspiração
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Dados de Recomendação ---
const recommendations: Recommendation[] = [
  { category: 'Música', title: 'Flashing Lights', author: 'Kanye West', briefing: 'Um clássico do hip-hop orquestral que capta a energia vibrante de uma cidade à noite. Produção impecável e atmosfera luxuosa.' },
  { category: 'Música', title: 'Let It Happen', author: 'Tame Impala', briefing: 'Uma jornada psicodélica de 7 minutos que flutua entre batidas eletrônicas e guitarras envolventes. Perfeito para foco profundo.' },
  { category: 'Música', title: 'Pink + White', author: 'Frank Ocean', briefing: 'Uma faixa serena e melódica produzida por Pharrell, evocando sentimentos de nostalgia e beleza pura sob o sol.' },
  { category: 'Livro', title: 'Rápido e Devagar', author: 'Daniel Kahneman', briefing: 'Uma exploração profunda sobre como nosso cérebro toma decisões, dividindo nosso pensamento em dois sistemas: um intuitivo e outro racional.' },
  { category: 'Livro', title: 'Essencialismo', author: 'Greg McKeown', briefing: 'Um guia sobre como focar no que realmente importa em um mundo cheio de distrações fúteis. Menos é mais.' },
  { category: 'Livro', title: 'A Coragem de Ser Imperfeito', author: 'Brené Brown', briefing: 'Um livro essencial sobre vulnerabilidade, imperfeição e a importância de se conectar genuinamente com os outros.' },
  { category: 'Filme', title: 'Interestelar', author: 'Christopher Nolan', briefing: 'Uma épica odisseia espacial que usa a ciência real para contar uma história emocionante sobre o amor que transcende o tempo e o espaço.' },
  { category: 'Filme', title: 'Drive', author: 'Nicolas Winding Refn', briefing: 'Um exercício de estilo e atmosfera, com uma trilha sonora de sintetizadores pulsante e uma estética neon inesquecível.' },
  { category: 'Filme', title: 'A Origem', author: 'Christopher Nolan', briefing: 'Um thriller cerebral que explora camadas profundas do subconsciente e os limites entre o sonho e a realidade.' }
];

// 1. Routine Section
const initialTasks: Task[] = [
  { id: 1, text: 'Review Next.js Docs', done: false },
  { id: 2, text: 'Workout Session', done: true },
  { id: 3, text: 'Read "Atomic Habits"', done: false },
];

function RoutineSection() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const toggleTask = (id: number) => {
    setTasks(prev => {
      const newTasks = prev.map(t => t.id === id ? { ...t, done: !t.done } : t);
      return newTasks.sort((a, b) => Number(a.done) - Number(b.done));
    });
  };
  return (
    <section id="rotina" className="w-full bg-transparent pt-8 pb-32 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="z-10">
          <motion.h2 initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-titanium-100 mb-6">Minha Rotina</motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-lg text-titanium-400 max-w-md leading-relaxed">Inteligência e ritmo combinados.</motion.p>
          <Link href="/rotina"><motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-8 px-8 py-4 bg-azure-500 text-white font-bold tracking-widest uppercase text-sm flex items-center justify-center hover:bg-azure-600 transition-colors rounded-full">Ver Calendário Completo</motion.button></Link>
        </div>
        <div className="relative">
          <div className="p-8 glass-panel rounded-3xl relative z-10">
            <h3 className="text-xl font-semibold text-titanium-100 uppercase tracking-tighter mb-6">To do List</h3>
            <div className="flex flex-col gap-3">
              <AnimatePresence>{tasks.map(task => (
                <motion.div layout layoutId={`task-${task.id}`} key={task.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className={`flex items-center justify-between p-5 rounded-2xl border transition-colors cursor-pointer ${task.done ? 'bg-titanium-700 border-black/5 text-titanium-400' : 'bg-white border-black/10 hover:border-azure-500/30 text-titanium-100 shadow-sm'}`} onClick={() => toggleTask(task.id)}>
                  <span className="text-base font-medium">{task.text}</span>
                  <CheckCircle size={24} weight={task.done ? 'fill' : 'regular'} className={task.done ? 'text-azure-500/40' : 'text-azure-500'} />
                </motion.div>
              ))}</AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 2. Study Section
function StudySection() {
  const [hours, setHours] = useState(0);

  const loadStats = useCallback(async () => {
    const { data } = await supabase.from('study_stats').select('total_minutes').eq('category', 'Italiano').single();
    if (data) {
      setHours(Math.floor(data.total_minutes / 60));
    }
  }, []);

  useEffect(() => {
    loadStats();
    // Refresh every minute to stay accurate if timer is running elsewhere
    const interval = setInterval(loadStats, 60000);
    return () => clearInterval(interval);
  }, [loadStats]);

  return (
    <section id="estudos" className="w-full bg-titanium-700 py-32 border-b border-black/[0.05] relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="order-2 md:order-1 relative flex justify-center">
          <div className="absolute inset-0 bg-azure-500/5 blur-[100px] opacity-40 rounded-full pointer-events-none" />
          
          <Link href="/estudos/flashcards" className="w-full max-w-sm">
            {/* Liquid Glass Card */}
            <motion.div 
              whileHover={{ y: -10, scale: 1.02 }} 
              className="w-full aspect-square flex flex-col items-center justify-center group text-center rounded-[2.5rem] relative overflow-hidden bg-white/40 backdrop-blur-2xl backdrop-saturate-150 border border-white/70 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(0,0,0,0.02)] before:absolute before:inset-0 before:bg-gradient-to-tr before:from-white/40 before:via-white/5 before:to-transparent before:opacity-80 before:pointer-events-none"
            >
              <div className="relative z-10 flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" className="w-32 h-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 filter drop-shadow-md rounded-2xl overflow-hidden shadow-sm border border-black/5">
                  <rect width="1" height="2" fill="#009246"/>
                  <rect x="1" width="1" height="2" fill="#FFFFFF"/>
                  <rect x="2" width="1" height="2" fill="#CE2B37"/>
                </svg>
                <h3 className="text-4xl font-bold text-titanium-100 mb-3 group-hover:text-azure-600 transition-colors tracking-tight">Italiano</h3>
                <p className="text-titanium-400 font-mono text-lg">{hours} Horas estudadas</p>
              </div>
            </motion.div>
          </Link>
        </div>
        <div className="order-1 md:order-2 z-10 flex flex-col md:items-end md:text-right">
          <motion.h2 initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-titanium-100 mb-6">Foco & Estudos</motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-lg text-titanium-400 max-w-md leading-relaxed">O aprendizado exige controle absoluto e disciplina imperdoável.</motion.p>
          <Link href="/estudos"><motion.button whileHover={{ x: -5 }} className="mt-8 flex items-center gap-2 text-sm text-azure-500 hover:text-azure-600 transition-colors uppercase tracking-widest font-bold"><ArrowRight size={20} className="rotate-180" /> Abrir Cadernos</motion.button></Link>
        </div>
      </div>
    </section>
  );
}

// 3. Finance Section
function FinanceSection() {
  return (
    <section id="financas" className="w-full bg-white py-32 border-b border-black/[0.05] relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="z-10">
          <motion.h2 initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-titanium-100 mb-6">Finanças</motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-lg text-titanium-400 max-w-md leading-relaxed">A alocação pragmática de recursos é o que define o amanhã.</motion.p>
          <Link href="/financas"><motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-8 px-8 py-4 bg-titanium-100 text-white font-bold tracking-widest uppercase text-sm flex items-center justify-center hover:bg-black transition-colors rounded-full">Análise Completa</motion.button></Link>
        </div>
        <div className="relative">
          <div className="p-10 glass-panel rounded-3xl group">
             <div className="flex justify-between items-start mb-8">
               <div>
                 <h3 className="text-xl font-semibold text-titanium-400 uppercase tracking-wider text-sm mb-1">Patrimônio Líquido</h3>
                 <div className="text-5xl font-mono text-titanium-100 font-bold">$14,290.55</div>
               </div>
               <CurrencyDollar size={40} className="text-azure-500" />
             </div>
             <div className="h-32 w-full flex items-end gap-3 mt-4 px-2">
               {[40, 25, 60, 45, 80, 50, 90, 75, 100].map((h, i) => <motion.div key={i} initial={{ height: 0 }} whileInView={{ height: `${h}%` }} transition={{ type: 'spring', damping: 15, delay: i * 0.05 }} className="flex-1 bg-azure-500/10 rounded-t-sm hover:bg-azure-500 transition-colors" />)}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 4. Consume Section
function ConsumeSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentRec, setCurrentRec] = useState<Recommendation | null>(null);

  const handleOpenModal = () => {
    // Daily seed logic: Same recommendation for the whole day (Local Time)
    const now = new Date();
    const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    let seed = 0;
    for (let i = 0; i < today.length; i++) seed += today.charCodeAt(i);
    
    const index = seed % recommendations.length;
    setCurrentRec(recommendations[index]);
    setModalOpen(true);
  };

  const images = [
    '/consumo/art1.png',
    '/consumo/art2.png',
    '/consumo/art3.png',
    '/consumo/art4.png'
  ];

  return (
    <section id="consumo" className="w-full bg-white py-32 border-b border-black/[0.05] relative overflow-hidden pb-48">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="order-2 md:order-1 relative flex justify-center">
          <div className="grid grid-cols-2 gap-4">
            {images.map((img, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 50 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                transition={{ type: 'spring', delay: i * 0.1 }} 
                whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2, zIndex: 20 }}
                className={`w-32 h-48 md:w-48 md:h-64 rounded-xl border border-black/5 bg-white shadow-xl overflow-hidden relative ${i % 2 === 0 ? 'translate-y-8' : ''}`}
              >
                <img 
                  src={img} 
                  alt="Art masterpiece" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" 
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    const num = i + 1;
                    (e.target as HTMLImageElement).src = `https://placehold.co/300x400/121212/white?text=Arte+${num}`;
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
        <div className="order-1 md:order-2 z-10 flex flex-col md:items-end md:text-right">
          <motion.h2 initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-titanium-100 mb-6">Consumo</motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-lg text-titanium-400 max-w-md leading-relaxed">O que você consome molda sua mente.</motion.p>
          <div className="mt-8 flex gap-4">
             <motion.div 
               whileHover={{ scale: 1.1 }} 
               whileTap={{ scale: 0.9 }} 
               onClick={handleOpenModal} 
               className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 transition-colors cursor-pointer text-azure-500 bg-white"
             >
               <Coffee size={24} />
             </motion.div>
             <Link href="/consumo"><motion.button whileHover={{ scale: 1.05, transition: { duration: 0.2 } }} whileTap={{ scale: 0.95 }} className="px-8 py-0 h-12 bg-black text-white font-bold tracking-widest uppercase text-sm flex items-center justify-center hover:bg-gray-900 transition-colors rounded-full shadow-lg">Galeria</motion.button></Link>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && <RecommendationModal isOpen={true} onClose={() => setModalOpen(false)} recommendation={currentRec} />}
      </AnimatePresence>
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
