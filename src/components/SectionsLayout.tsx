'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, X, Sparkle, MusicNotes, BookmarkSimple, FilmStrip, Coffee, FloppyDisk, Trash } from '@phosphor-icons/react';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

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
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default'
                : 'bg-white text-black hover:bg-white/90 shadow-xl cursor-pointer'
            }`}
          >
            {isSaved ? (
              <>
                <CheckCircle size={18} weight="fill" />
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

// 1. Routine Section — Notebook Aesthetic
function RoutineSection({ tasks, toggleTask, deleteTask }: RoutineSectionProps) {
  return (
    <section id="rotina" className="w-full bg-[#f8f7f4] py-32 border-b border-black/[0.04] relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
        
        {/* Left Col — Narrative */}
        <div className="z-10 sticky top-32">
          <motion.h2 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-titanium-100 mb-4"
          >
            Rotina
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="text-lg text-titanium-400 max-w-md leading-relaxed font-medium"
          >
            A consistência é o único atalho para a maestria. Mantenha o ritmo inabalável.
          </motion.p>
          <Link href="/rotina">
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              className="mt-10 px-8 py-4 border border-black/10 text-black font-bold tracking-[0.2em] uppercase text-[10px] flex items-center gap-3 rounded-full hover:bg-black hover:text-white transition-all shadow-sm"
            >
              Agenda Completa
              <ArrowRight size={14} />
            </motion.button>
          </Link>
        </div>

        {/* Right Col — The Notebook */}
        <div className="relative w-full max-w-xl mx-auto">
          {/* Notebook Paper */}
          <motion.div 
            initial={{ opacity: 0, rotate: -1 }}
            whileInView={{ opacity: 1, rotate: -2 }}
            transition={{ duration: 1 }}
            className="relative bg-white shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-sm min-h-[600px] p-12 md:p-16 border border-black/[0.03]"
            style={{
              backgroundImage: 'linear-gradient(transparent 39px, #f1f1f1 39px)',
              backgroundSize: '100% 40px',
              lineHeight: '40px'
            }}
          >
            {/* Spiral Rings Visual */}
            <div className="absolute -left-6 top-8 bottom-8 flex flex-col justify-between py-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-12 h-3 bg-gradient-to-r from-titanium-400/20 to-titanium-400/50 rounded-full shadow-inner border border-black/10" />
                  <div className="w-2 h-2 bg-titanium-600 rounded-full -ml-1 border border-black/20" />
                </div>
              ))}
            </div>

            {/* Notebook Content */}
            <div className="relative z-10">
              <div className="mb-14 pt-4">
                <h3 className="font-kalam text-5xl text-black/80 font-bold -rotate-1 tracking-tight">
                  To Do List
                </h3>
              </div>

              <div className="flex flex-col">
                <AnimatePresence mode="popLayout">
                  {tasks.map((task, i) => (
                    <motion.div
                      layout
                      layoutId={`task-${task.id}`}
                      key={task.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`flex items-center justify-between group h-10 cursor-pointer ${task.done ? 'opacity-40' : 'opacity-100'}`}
                      onClick={() => toggleTask(task.id)}
                    >
                      <div className="flex items-center gap-6 w-full">
                        <span className="font-kalam text-2xl text-black/30 font-bold min-w-[2rem]">{i + 1}.</span>
                        <div className="relative flex items-center w-full">
                          <span className={`font-kalam text-2xl text-black/80 tracking-tight transition-all pb-1 ${task.done ? 'line-through decoration-2 decoration-red-500/50' : ''}`}>
                            {task.text}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                        className="opacity-0 group-hover:opacity-40 w-8 h-8 rounded-full flex items-center justify-center text-red-500 hover:bg-red-500/5 transition-all"
                      >
                        <Trash size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {tasks.length === 0 && (
                <div className="py-20 text-center">
                  <p className="font-kalam text-xl text-black/20 italic">Nada planejado para agora...</p>
                </div>
              )}
            </div>

            {/* Bottom corner "page shadow" */}
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tr from-black/[0.02] to-transparent pointer-events-none" />
          </motion.div>
          
          {/* Subtle "Paper under the page" layer for depth */}
          <div className="absolute inset-0 bg-white shadow-sm rounded-sm translate-x-1 translate-y-1 -z-10 border border-black/5" />
          <div className="absolute inset-0 bg-white shadow-sm rounded-sm translate-x-2 translate-y-2 -z-20 border border-black/5" />
        </div>
      </div>
    </section>
  );
}

// 2. Study Section — Black Mamba Aesthetic
function StudySection() {
  return (
    <section
      id="estudos"
      className="w-full py-48 border-b border-white/[0.04] relative overflow-hidden flex items-center justify-center"
      style={{
        backgroundColor: '#080808',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='24' viewBox='0 0 40 24'%3E%3Cpath d='M20 0 L40 12 L20 24 L0 12 Z' fill='none' stroke='%23ffffff' stroke-width='0.5' stroke-opacity='0.1'/%3E%3C/svg%3E")`,
        backgroundSize: '40px 24px',
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-white/[0.02] rounded-full blur-[140px]" />
      </div>
      <div className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter text-white mb-8 leading-none"
        >
          Estudos
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-xl md:text-2xl text-white/40 max-w-3xl leading-relaxed mb-12"
        >
          O aprendizado exige controle absoluto e disciplina imperdoável.
        </motion.p>
        <Link href="/estudos">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-full hover:bg-white/90 transition-all shadow-2xl shadow-white/5"
          >
            Abrir Cadernos
          </motion.button>
        </Link>
      </div>
    </section>
  );
}

// 3. Finance Section — Swiss Bank Architecture
function FinanceSection() {
  return (
    <section 
      id="financas" 
      className="w-full bg-[#fcfcfc] py-48 border-b border-black/[0.04] relative overflow-hidden flex items-center"
    >
      {/* Architectural Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Vertical thin line separating the layout */}
        <div className="absolute left-[35%] top-0 bottom-0 w-px bg-black/[0.03]" />
        
        {/* Curator Label */}
        <div className="absolute top-12 left-12 flex items-center gap-4">
          <span className="text-[10px] font-black tracking-[0.4em] text-titanium-400/30 uppercase italic">03 FIN</span>
          <div className="w-12 h-px bg-black/[0.05]" />
          <span className="text-[10px] font-bold tracking-[0.2em] text-titanium-400/20 uppercase">Wealth & Assets</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-24 w-full grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 items-center">
        
        {/* Left Col — Narrative (3 cols) */}
        <div className="md:col-span-4 z-10">
          <motion.h2 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-titanium-100 mb-8"
          >
            Finanças
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-titanium-400 max-w-xs leading-relaxed mb-10 font-medium"
          >
            Soberania financeira através de alocação meticulosa e controle absoluto de fluxo.
          </motion.p>
          <Link href="/financas">
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              className="group px-8 py-4 bg-black text-white font-bold tracking-[0.2em] uppercase text-[10px] flex items-center gap-3 rounded-full shadow-2xl transition-all"
            >
              Consultar Custódia
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </div>

        {/* Right Col — The "Vault" Visual (8 cols) */}
        <div className="md:col-span-8 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-[2rem] p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] border border-black/5 relative overflow-hidden"
          >
            {/* Background pattern in the card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-azure-500/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-titanium-400/50 mb-3">Patrimônio Líquido Total</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-titanium-100/40">R$</span>
                  <span className="text-6xl md:text-7xl font-black tracking-tighter text-titanium-100">14.290,55</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end text-right">
                <div className="flex items-center gap-2 text-emerald-500 font-bold mb-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm">+12.4%</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-titanium-400/40 italic">Crescimento Mensal</p>
              </div>
            </div>

            {/* Premium Sparkline */}
            <div className="relative h-48 w-full mt-10">
              <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Area under the line */}
                <motion.path
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  d="M0 40 L10 32 L25 35 L40 20 L55 25 L70 10 L85 15 L100 5 L100 40 Z"
                  fill="url(#sparkline-grad)"
                />
                
                {/* The growth line */}
                <motion.path
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  d="M0 40 L10 32 L25 35 L40 20 L55 25 L70 10 L85 15 L100 5"
                />
                
                {/* Points */}
                <motion.circle 
                  cx="100" cy="5" r="1.5" fill="#2563eb" 
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2 }}
                />
              </svg>
              
              {/* Vertical Metric Separators */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 pt-4 border-t border-black/[0.03]">
                {['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN'].map(m => (
                  <span key={m} className="text-[8px] font-black text-black/10 tracking-widest">{m}</span>
                ))}
              </div>
            </div>

            {/* Bottom Metrics Bar */}
            <div className="mt-12 pt-8 border-t border-black/[0.03] grid grid-cols-3 gap-8">
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-titanium-400/40 mb-2">Liquidez</p>
                <p className="text-sm font-bold text-titanium-100 italic">Alta</p>
              </div>
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-titanium-400/40 mb-2">AUM</p>
                <p className="text-sm font-bold text-titanium-100">82.1k</p>
              </div>
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-titanium-400/40 mb-2">Status</p>
                <p className="text-[8px] font-bold text-black bg-emerald-500/10 px-2 py-1 rounded inline-block">ATIVO</p>
              </div>
            </div>
          </motion.div>
        </div>
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
  };

  const artworks = [
    { src: '/consumo/art1.png', title: 'A Grande Onda', artist: 'Hokusai', year: '1831' },
    { src: '/consumo/art2.png', title: 'Reverie', artist: 'Desconhecido', year: '2023' },
    { src: '/consumo/art3.png', title: 'Bloom', artist: 'Anônimo', year: '2022' },
    { src: '/consumo/art4.png', title: 'Les Amants', artist: 'Magritte', year: '1928' },
  ];

  return (
    <section
      id="consumo"
      className="w-full relative overflow-hidden pb-0"
      style={{
        // Museum wall: warm limestone with subtle texture
        background: `
          linear-gradient(
            to bottom,
            #e8e0d4 0%,
            #ddd5c8 40%,
            #c8bfb0 70%,
            #b5aa9a 100%
          )
        `,
      }}
    >
      {/* Architectural wall details */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle stone texture overlay */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='200' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />
        {/* Dado rail / wainscoting — horizontal molding line */}
        <div className="absolute left-0 right-0" style={{ top: '62%' }}>
          <div className="w-full h-[3px] bg-[#9e917f]/60" />
          <div className="w-full h-[1px] bg-white/30 mt-[2px]" />
          <div className="w-full h-[1px] bg-[#9e917f]/30 mt-[3px]" />
        </div>
        {/* Lower wall panel — slightly darker below dado rail */}
        <div className="absolute left-0 right-0 bottom-0" style={{ top: '62%', background: 'linear-gradient(to bottom, #b5aa9a, #a09080)' }} />
        {/* Ceiling cornice shadow */}
        <div className="absolute top-0 left-0 right-0 h-16" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.18), transparent)' }} />
        {/* Floor shadow from bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.25), transparent)' }} />
        {/* Parquet floor hint at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-20"
          style={{
            background: 'repeating-linear-gradient(90deg, rgba(139,108,71,0.15) 0px, rgba(139,108,71,0.15) 48px, rgba(160,128,88,0.12) 48px, rgba(160,128,88,0.12) 96px)',
          }}
        />
      </div>

      {/* Gallery layout */}
      <div className="relative z-10 pt-20 pb-40">
        <div className="max-w-[1500px] mx-auto px-6 md:px-20 flex flex-col md:flex-row items-center justify-between gap-20 min-h-[520px]">

          {/* Left — Museum wall with hanging artworks */}
          <div className="order-2 md:order-1 relative flex items-center justify-start flex-1 md:ml-[-5%]" style={{ minHeight: '480px' }}>
            {/* Hanging wire line */}
            <div className="absolute top-8 left-0 right-0 h-px bg-[#8a7a68]/40"
              style={{ boxShadow: '0 1px 0 rgba(255,255,255,0.15)' }}
            />

            {/* Artworks row — hung on the wall */}
            <div className="flex items-end justify-start gap-20 pt-12 pb-4 w-full">
              {artworks.map((art, i) => {
                const frameSize = 'w-48 h-64';

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 80, damping: 18, delay: i * 0.12 }}
                    className="relative flex-shrink-0"
                    style={{ transformOrigin: 'top center' }}
                  >
                    {/* Hanging wire from rail to frame */}
                    <div className="absolute left-1/2 -top-12 w-px bg-[#8a7a68]/50" style={{ height: '48px', transform: 'translateX(-50%)' }} />
                    <div className="absolute left-1/2 -top-12 w-1 h-1 rounded-full bg-[#c8b89a] border border-[#8a7a68]/60" style={{ transform: 'translate(-50%, -2px)' }} />

                    {/* Picture frame */}
                    <div
                      className={`${frameSize} relative`}
                      style={{
                        // Gold ornate frame effect via box-shadow
                        boxShadow: `
                          0 0 0 3px #b8a07a,
                          0 0 0 6px #8a6e40,
                          0 0 0 9px #c8b07a,
                          0 0 0 12px #7a5e30,
                          8px 20px 40px rgba(0,0,0,0.55),
                          0 6px 12px rgba(0,0,0,0.3)
                        `,
                        borderRadius: '2px',
                      }}
                    >
                      {/* Spotlight / gallery light glow above painting */}
                      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-32 h-24 pointer-events-none"
                        style={{
                          background: 'radial-gradient(ellipse at 50% 0%, rgba(255,240,180,0.35) 0%, transparent 80%)',
                          filter: 'blur(8px)',
                        }}
                      />

                      {/* Mat / passepartout */}
                      <div className="absolute inset-0 bg-[#f5f0e8] p-3">
                        <img
                          src={art.src}
                          alt={art.title}
                          className="w-full h-full object-cover"
                          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                            (e.target as HTMLImageElement).src = `https://placehold.co/300x400/2a2015/c8b07a?text=${encodeURIComponent(art.title)}`;
                          }}
                        />
                      </div>

                      {/* Painting surface gloss */}
                      <div className="absolute inset-3 pointer-events-none"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)',
                        }}
                      />
                    </div>

                    {/* Museum placard below painting */}
                    <div className="mt-5 flex flex-col items-center gap-0.5">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/90">{art.title}</span>
                      <span className="text-[8px] italic text-white/60">{art.artist}, {art.year}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right — Text & Buttons (unchanged) */}
          <div className="order-1 md:order-2 z-10 flex flex-col md:items-end md:text-right justify-center py-20">
            <motion.h2 initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-titanium-100 mb-6">Consumo</motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-lg text-titanium-400 max-w-md leading-relaxed">O que você consome molda sua mente.</motion.p>
            <div className="mt-8 flex gap-4 md:justify-end items-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleOpenModal}
                className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-900 transition-colors cursor-pointer text-white bg-black shadow-lg"
              >
                <Coffee size={24} />
              </motion.div>
              <Link href="/consumo"><motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-0 h-12 bg-black text-white font-bold tracking-widest uppercase text-sm flex items-center justify-center hover:bg-gray-900 transition-colors rounded-full shadow-lg">Galeria</motion.button></Link>
            </div>
          </div>
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

  // Load Tasks
  useEffect(() => {
    const saved = localStorage.getItem('routine_tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    } else {
      setTasks([
        { id: '1', text: 'Review Next.js Docs', done: false },
        { id: '2', text: 'Workout Session', done: false },
        { id: '3', text: 'Read "Atomic Habits"', done: false },
      ]);
    }
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
      const updated = prev.map(t => t.id === id ? { ...t, done: !t.done } : t);
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
      <StudySection />
      <FinanceSection />
      <ConsumeSection addTask={addTask} />
    </>
  );
}
