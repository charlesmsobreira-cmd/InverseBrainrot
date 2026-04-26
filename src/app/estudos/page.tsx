'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from '@phosphor-icons/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function StudyPage() {
  const router = useRouter();
  const [hovered, setHovered] = useState<'diversos' | 'flashcards' | 'linhadotempo' | null>(null);

  // Calcula a altura flexível
  const getHeight = (section: 'diversos' | 'flashcards' | 'linhadotempo') => {
    if (!hovered) return '33.333%';
    return hovered === section ? '50%' : '25%';
  };

  return (
    <main className="h-screen w-screen overflow-hidden flex flex-col relative bg-[#050505] selection:bg-white selection:text-black">
      {/* Back button */}
      <Link href="/" className="absolute top-10 left-10" style={{ zIndex: 100 }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-3 px-8 py-4 border border-white/10 rounded-full text-zinc-500 hover:text-white font-black uppercase tracking-[0.3em] text-[10px] transition-all bg-black shadow-2xl backdrop-blur-xl"
        >
          <ArrowLeft size={16} weight="bold" /> Voltar
        </motion.button>
      </Link>

      <div className="flex-1 flex flex-col h-full w-full mt-24 md:mt-0">
        
        {/* ── SECTION: ESTUDOS DIVERSOS ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          onMouseEnter={() => setHovered('diversos')}
          onMouseLeave={() => setHovered(null)}
          onClick={() => router.push('/estudos/diversos')}
          style={{ height: getHeight('diversos') }}
          className="relative flex flex-col justify-center px-12 md:px-24 cursor-pointer border-b border-white/5 overflow-hidden transition-[height] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
          
          <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-12">
            <div className="flex flex-col">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.8 }}
                className="flex items-center gap-2 mb-2"
              >
                <div className="w-8 h-[1px] bg-zinc-800 group-hover:w-16 group-hover:bg-white transition-all duration-700" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600 group-hover:text-white transition-colors duration-700">
                  Deep Focus
                </span>
              </motion.div>

              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.8] text-zinc-400 group-hover:text-white transition-all duration-700">
                Diversos
              </h2>
            </div>

            <div className="flex flex-col md:items-end text-left md:text-right mt-4 md:mt-0">
              <p className="text-sm text-zinc-600 font-medium leading-relaxed max-w-sm group-hover:text-zinc-300 transition-colors duration-700">
                Exploração, cursos e leitura intensiva. <br />O espaço onde o conhecimento se expande.
              </p>

              <div className="mt-6 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                 <span className="text-[11px] font-black uppercase tracking-widest text-white">Explorar Ambiente</span>
                 <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                   <ArrowLeft size={16} className="rotate-180" />
                 </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── SECTION: FLASHCARDS ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          onMouseEnter={() => setHovered('flashcards')}
          onMouseLeave={() => setHovered(null)}
          onClick={() => router.push('/estudos/flashcards')}
          style={{ height: getHeight('flashcards') }}
          className="relative flex flex-col justify-center px-12 md:px-24 cursor-pointer border-b border-white/5 overflow-hidden transition-[height] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

          <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-12">
            <div className="flex flex-col">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="flex items-center gap-2 mb-2"
              >
                <div className="w-8 h-[1px] bg-zinc-800 group-hover:w-16 group-hover:bg-white transition-all duration-700" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600 group-hover:text-white transition-colors duration-700">
                  Active Recall
                </span>
              </motion.div>

              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.8] text-zinc-400 group-hover:text-white transition-all duration-700">
                Flashcards
              </h2>
            </div>

            <div className="flex flex-col md:items-end text-left md:text-right mt-4 md:mt-0">
              <p className="text-sm text-zinc-600 font-medium leading-relaxed max-w-sm group-hover:text-zinc-300 transition-colors duration-700">
                Repetição espaçada e memorização. <br />Inspirado na metodologia Anki.
              </p>

              <div className="mt-6 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                 <span className="text-[11px] font-black uppercase tracking-widest text-white">Iniciar Revisão</span>
                 <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                   <ArrowLeft size={16} className="rotate-180" />
                 </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── SECTION: LINHA DO TEMPO ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          onMouseEnter={() => setHovered('linhadotempo')}
          onMouseLeave={() => setHovered(null)}
          onClick={() => router.push('/estudos/linhadotempo')}
          style={{ height: getHeight('linhadotempo') }}
          className="relative flex flex-col justify-center px-12 md:px-24 cursor-pointer overflow-hidden transition-[height] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

          <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-12">
            <div className="flex flex-col">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="flex items-center gap-2 mb-2"
              >
                <div className="w-8 h-[1px] bg-zinc-800 group-hover:w-16 group-hover:bg-white transition-all duration-700" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600 group-hover:text-white transition-colors duration-700">
                  Chronos
                </span>
              </motion.div>

              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.8] text-zinc-400 group-hover:text-white transition-all duration-700">
                Linha do Tempo
              </h2>
            </div>

            <div className="flex flex-col md:items-end text-left md:text-right mt-4 md:mt-0">
              <p className="text-sm text-zinc-600 font-medium leading-relaxed max-w-sm group-hover:text-zinc-300 transition-colors duration-700">
                Mapeamento temporal e histórico. <br />A jornada cronológica do conhecimento.
              </p>

              <div className="mt-6 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                 <span className="text-[11px] font-black uppercase tracking-widest text-white">Visualizar Cronologia</span>
                 <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                   <ArrowLeft size={16} className="rotate-180" />
                 </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
