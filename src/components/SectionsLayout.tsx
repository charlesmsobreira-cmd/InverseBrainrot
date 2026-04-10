'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, X, Sparkle, MusicNotes, BookmarkSimple, FilmStrip, Coffee, FloppyDisk, Trash } from '@phosphor-icons/react';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Footer } from './Footer';
import { ITALIAN_EXPRESSIONS } from '@/app/estudos/flashcards/knowledge_base';

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
  onSave: (text: string) => void;
  recommendation: Recommendation | null;
  isSaved: boolean;
}

interface Task {
  id: string;
  text: string;
  done: boolean;
  completedAt?: number;
}

// --- Sub-componente: Modal de Recomendação (Inspiração) ---
const RecommendationModal = ({ isOpen, onClose, onSave, recommendation, isSaved }: RecommendationModalProps) => {
  if (!isOpen || !recommendation) return null;

  const categoryConfig: Record<string, { icon: React.ReactNode; color: string; prefix: string }> = {
    'Música': {
      icon: <MusicNotes size={28} weight="fill" className="text-violet-400" />,
      color: 'violet',
      prefix: 'Escutar',
    },
    'Livro': {
      icon: <BookmarkSimple size={28} weight="fill" className="text-emerald-400" />,
      color: 'emerald',
      prefix: 'Começar a ler',
    },
    'Filme': {
      icon: <FilmStrip size={28} weight="fill" className="text-rose-400" />,
      color: 'rose',
      prefix: 'Assistir',
    },
  };

  const config = categoryConfig[recommendation.category as 'Música' | 'Livro' | 'Filme'];

  const handleSave = () => {
    if (isSaved) return;
    const taskText = `${config.prefix} ${recommendation.title}`;
    onSave(taskText);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-2xl"
      />

      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 24, stiffness: 200 }}
        className="relative w-full max-w-sm bg-[#0f0f0f] border border-white/8 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.8)] text-white overflow-hidden"
        style={{ minHeight: '600px' }}
      >
        {/* Ambient glow */}
        <div className="absolute top-0 left-0 w-full h-64 opacity-30 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${config.color === 'violet' ? '#7c3aed' : config.color === 'emerald' ? '#10b981' : '#f43f5e'}40, transparent 70%)` }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all"
        >
          <X size={16} weight="bold" />
        </button>

        <div className="flex flex-col h-full p-10 relative z-10">
          {/* Gap for removed icon */}
          <div className="mb-4" />

          {/* Label */}
          <div className="flex items-center gap-2 mb-3 opacity-40">
            <Sparkle size={12} weight="fill" className="text-white" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">Sugestão do Dia</span>
          </div>

          {/* Title */}
          <h3 className="text-3xl font-black uppercase tracking-tighter leading-tight mb-4 italic">
            {recommendation.title}
          </h3>

          {/* Category + Author */}
          <div className="flex items-center gap-2 mb-8">
            <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-bold uppercase tracking-widest text-white/60 border border-white/8">
              {recommendation.category}
            </span>
            <span className="text-[10px] font-mono text-white/25 italic">por {recommendation.author}</span>
          </div>

          {/* Divider */}
          <div className="w-8 h-px bg-white/10 mb-8" />

          {/* Briefing */}
          <p className="text-sm text-white/50 leading-relaxed font-mono italic flex-1">
            &quot;{recommendation.briefing}&quot;
          </p>

          {/* Save Button */}
          <motion.button
            onClick={handleSave}
            whileHover={isSaved ? {} : { scale: 1.03 }}
            whileTap={isSaved ? {} : { scale: 0.97 }}
            className={`mt-10 w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all duration-500 ${
              isSaved
                ? 'bg-white/5 text-white/20 border border-white/10 cursor-default'
                : 'bg-white text-black hover:bg-white/90 shadow-xl cursor-pointer'
            }`}
          >
            {isSaved ? (
              <>
                <CheckCircle size={18} weight="fill" className="text-emerald-400" />
                Sugestão Salva
              </>
            ) : (
              <>
                <FloppyDisk size={18} weight="bold" />
                Salvar Sugestão
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Sub-componente: Modal de Expressão Italiana (Cultura) ---
interface ItalianQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: typeof ITALIAN_EXPRESSIONS[0] | null;
}

const ItalianQuoteModal = ({ isOpen, onClose, quote }: ItalianQuoteModalProps) => {
  if (!isOpen || !quote) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-2xl"
      />

      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-sm bg-[#0f0f0f] border border-white/8 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.8)] text-white overflow-hidden"
        style={{ minHeight: '500px' }}
      >
        <div className="absolute top-0 left-0 w-full h-64 opacity-30 pointer-events-none bg-gradient-to-b from-emerald-500/20 via-white/5 to-transparent" />

        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all"
        >
          <X size={16} weight="bold" />
        </button>

        <div className="flex flex-col h-full p-10 relative z-10">
          <div className="mb-4" />
          <div className="flex items-center gap-2 mb-3 opacity-40">
            <span className="text-lg">🇮🇹</span>
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">Espressione del Giorno</span>
          </div>

          <h3 className="text-4xl font-black uppercase tracking-tighter leading-tight mb-4 italic text-white underline decoration-emerald-500/30 underline-offset-8">
            {quote.phrase}
          </h3>

          <div className="w-8 h-px bg-white/10 my-8" />

          <p className="text-xl text-zinc-400 font-medium leading-relaxed italic mb-6">
            &quot;{quote.translation}&quot;
          </p>

          <p className="text-sm text-zinc-600 font-mono italic leading-relaxed">
            {quote.context}
          </p>

          <button
            onClick={onClose}
            className="mt-auto w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] bg-white text-black hover:bg-zinc-200 transition-all shadow-xl"
          >
            Capito!
          </button>
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
interface RoutineSectionProps {
  tasks: Task[];
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

// 1. Routine Section — Card Aesthetic (Refined Colors)
function RoutineSection({ tasks, toggleTask, deleteTask }: RoutineSectionProps) {
  return (
    <section id="rotina" className="w-full bg-white py-32 border-b border-black/[0.04] relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
        
        {/* Left Col — Narrative */}
        <div className="z-10 sticky top-32">
          <motion.h2 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter text-black mb-4 leading-none"
          >
            Rotina
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="text-lg text-black/40 max-w-md leading-relaxed font-medium"
          >
            A consistência é o único atalho para a maestria. Mantenha o ritmo inabalável.
          </motion.p>
          <Link href="/rotina">
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              className="mt-10 px-8 py-4 border border-black/10 text-black font-bold tracking-[0.2em] uppercase text-[10px] flex items-center gap-3 rounded-full hover:bg-black hover:text-white transition-all"
            >
              Agenda Completa
              <ArrowRight size={14} />
            </motion.button>
          </Link>
        </div>

        {/* Right Col — The Card List */}
        <div className="relative w-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2rem] p-10 md:p-14 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-black/[0.03] relative min-h-[500px]"
          >
            <div className="flex flex-col gap-10">
              <div className="flex items-center justify-between border-b border-black/[0.03] pb-8">
                <h3 className="font-kalam text-5xl text-black/90 font-bold tracking-tight">
                  To Do List
                </h3>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-titanium-400/40">Daily Protocol</div>
              </div>

              <div className="flex flex-col gap-3">
                <AnimatePresence mode="popLayout">
                  {tasks.map((task) => (
                    <motion.div
                      layout
                      layoutId={`task-${task.id}`}
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                      className={`flex items-center justify-between p-6 rounded-[1.5rem] border transition-all cursor-pointer group/item ${task.done ? 'bg-neutral-100 border-transparent text-black/20' : 'bg-white border-black/5 hover:border-black/20 text-black shadow-sm'}`}
                      onClick={() => toggleTask(task.id)}
                    >
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${task.done ? 'bg-black border-black scale-90' : 'border-black/10'}`}>
                          {task.done && <CheckCircle size={12} weight="fill" className="text-white" />}
                        </div>
                        <span className={`text-base font-semibold tracking-tight break-words overflow-hidden min-w-0 ${task.done ? 'line-through' : ''}`}>
                          {task.text}
                        </span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                        className="opacity-0 group-hover/item:opacity-100 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-black/20 hover:text-black transition-all ml-4"
                      >
                        <Trash size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {tasks.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center gap-4 text-black/10">
                  <span className="text-xs font-black uppercase tracking-widest text-center">Protocolo Finalizado</span>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Subtle decoration for depth */}
          <div className="absolute -z-10 top-6 -right-6 w-full h-full bg-black/[0.01] rounded-[2rem] blur-2xl" />
        </div>
      </div>
    </section>
  );
}

// 2. Study Section — Zen Minimalist Aesthetic
interface StudySectionProps {
  onOpenQuote: () => void;
}

function StudySection({ onOpenQuote }: StudySectionProps) {
  return (
    <section
      id="estudos"
      className="w-full py-48 border-b border-black/[0.04] relative overflow-hidden flex items-center justify-center bg-black"
    >
      <div className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter text-white mb-8 leading-none selection:bg-white selection:text-black"
        >
          Estudos
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-xl md:text-2xl text-white/30 max-w-3xl leading-relaxed mb-12"
        >
          O aprendizado exige controle absoluto e disciplina imperdoável.
        </motion.p>
        <div className="flex gap-4 items-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onOpenQuote}
            className="w-14 h-14 rounded-full flex items-center justify-center bg-white text-black cursor-pointer shadow-xl text-2xl"
          >
            🇮🇹
          </motion.button>
          <Link href="/estudos">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-0 h-14 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center rounded-full hover:bg-white/90 transition-all"
            >
              Abrir Cadernos
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// 3. Finance Section — Swiss Bank Architecture
function FinanceSection() {
  return (
    <section 
      id="financas" 
      className="w-full bg-white py-48 border-b border-black/[0.04] relative overflow-hidden flex items-center justify-center text-center"
    >
      <div className="max-w-4xl mx-auto px-6 w-full flex flex-col items-center">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter text-black mb-8 leading-none"
        >
          Finanças
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-black/40 max-w-lg leading-relaxed mb-10 font-medium"
        >
          Soberania financeira através de alocação meticulosa e controle absoluto de fluxo.
        </motion.p>
        <Link href="/financas">
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            className="group px-10 py-5 bg-black text-white font-bold tracking-[0.2em] uppercase text-[10px] flex items-center gap-3 rounded-full transition-all"
          >
            Consultar Custódia
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </Link>
      </div>
    </section>
  );
}

// 4. Consume Section
interface ConsumeSectionProps {
  addTask: (text: string) => void;
}

function ConsumeSection({ addTask }: ConsumeSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentRec, setCurrentRec] = useState<Recommendation | null>(null);
  const [savedTitles, setSavedTitles] = useState<string[]>([]);

  // Load saved titles from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('saved_recommendation_titles');
    if (saved) {
      setSavedTitles(JSON.parse(saved));
    }
  }, []);

  // Save titles to localStorage
  useEffect(() => {
    if (savedTitles.length > 0) {
      localStorage.setItem('saved_recommendation_titles', JSON.stringify(savedTitles));
    }
  }, [savedTitles]);

  const handleOpenModal = () => {
    const now = new Date();
    const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    let seed = 0;
    for (let i = 0; i < today.length; i++) seed += today.charCodeAt(i);
    const index = seed % recommendations.length;
    setCurrentRec(recommendations[index]);
    setModalOpen(true);
  };

  const handleSave = (text: string) => {
    addTask(text);
    if (currentRec && !savedTitles.includes(currentRec.title)) {
      setSavedTitles(prev => [...prev, currentRec.title]);
    }
    // Fecha o modal após um pequeno delay para mostrar o estado de "Salvo"
    setTimeout(() => {
      setModalOpen(false);
    }, 1200);
  };

  return (
    <section
      id="consumo"
      className="w-full relative overflow-hidden py-64 min-h-[90vh] bg-black flex items-center justify-center text-center font-outfit"
    >
      <div className="max-w-4xl mx-auto px-6 z-10 flex flex-col items-center">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter text-white mb-6 leading-none"
        >
          Consumo
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          className="text-lg text-white/30 max-w-md leading-relaxed mb-10"
        >
          O que você consome molda sua mente.
        </motion.p>
        <div className="flex gap-4 items-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleOpenModal}
            className="w-14 h-14 rounded-full flex items-center justify-center bg-white text-black cursor-pointer shadow-xl"
          >
            <Coffee size={28} />
          </motion.div>
          <Link href="/consumo">
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              className="px-12 py-0 h-14 bg-white text-black font-bold tracking-widest uppercase text-sm flex items-center justify-center rounded-full shadow-xl"
            >
              Galeria
            </motion.button>
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <RecommendationModal
            isOpen={true}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
            recommendation={currentRec}
            isSaved={currentRec ? savedTitles.includes(currentRec.title) : false}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

// --- Root Layout: shared tasks state ---
export function SectionsLayout() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState<number | null>(null);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  // Load Tasks and Daily Quote Index
  useEffect(() => {
    // 1. Task Loading
    const saved = localStorage.getItem('routine_tasks');
    let initialTasks = [];
    if (saved) {
      initialTasks = JSON.parse(saved);
    } else {
      initialTasks = [
        { id: '1', text: 'Review Next.js Docs', done: false },
        { id: '2', text: 'Workout Session', done: false },
        { id: '3', text: 'Read "Atomic Habits"', done: false },
      ];
    }
    
    // 2. Daily Quote Logic (Same index for the same day)
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    let seed = 0;
    for (let i = 0; i < todayStr.length; i++) seed += todayStr.charCodeAt(i);
    setQuoteIdx(seed % ITALIAN_EXPRESSIONS.length);

    // Auto-delete logic: Filter tasks older than 5 days
    const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;
    const nowTime = Date.now();
    const filteredTasks = initialTasks.filter((t: Task) => {
      if (t.done && t.completedAt) {
        return nowTime - t.completedAt < FIVE_DAYS_MS;
      }
      return true;
    });

    setTasks(filteredTasks);
    setIsLoaded(true);
  }, []);

  // Persist Tasks
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('routine_tasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  const toggleTask = (id: string) => {
    setTasks(prev => {
      const updated = prev.map(t => {
        if (t.id === id) {
          const isDone = !t.done;
          return { ...t, done: isDone, completedAt: isDone ? Date.now() : undefined };
        }
        return t;
      });
      return [...updated].sort((a, b) => Number(a.done) - Number(b.done));
    });
  };

  const addTask = (text: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      done: false,
    };
    setTasks(prev => [newTask, ...prev].sort((a, b) => Number(a.done) - Number(b.done)));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <>
      <RoutineSection tasks={tasks} toggleTask={toggleTask} deleteTask={deleteTask} />
      <StudySection onOpenQuote={() => setIsQuoteOpen(true)} />
      <FinanceSection />
      <ConsumeSection addTask={addTask} />
      <Footer />

      <AnimatePresence>
        {isQuoteOpen && quoteIdx !== null && (
          <ItalianQuoteModal 
            isOpen={true} 
            onClose={() => setIsQuoteOpen(false)} 
            quote={ITALIAN_EXPRESSIONS[quoteIdx]} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
