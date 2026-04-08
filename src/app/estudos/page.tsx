'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from '@phosphor-icons/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
export default function StudyPage() {
  const router = useRouter();

  return (
    <main
      className="h-screen w-screen overflow-hidden flex relative bg-[#050505] selection:bg-white selection:text-black"
    >
      {/* Back button */}
      <Link href="/" className="absolute top-10 left-10" style={{ zIndex: 100 }}>
        <motion.button
          whileHover={{ x: -10 }}
          className="flex items-center gap-3 px-8 py-4 border border-white/10 rounded-full text-zinc-500 hover:text-white font-black uppercase tracking-[0.3em] text-[10px] transition-all bg-black shadow-2xl backdrop-blur-xl"
        >
          <ArrowLeft size={16} weight="bold" /> Sistema
        </motion.button>
      </Link>

      {/* ── SPLIT SECTIONS ── */}
      <motion.div 
        initial="hidden"
        animate="visible"
        className="flex-1 flex flex-row h-full w-full"
      >
        
        {/* ── SECTION: ESTUDOS DIVERSOS ───────────────────────── */}
        <motion.div
          onClick={() => router.push('/estudos/diversos')}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ flex: 1.3 }}
          className="relative flex-1 group cursor-pointer border-r border-white/5 overflow-hidden transition-all duration-700"
        >
          {/* Subtle bg glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="h-full w-full flex flex-col justify-center px-12 md:px-24 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-4 mb-2"
            >
              <div className="w-8 h-[1px] bg-zinc-800 group-hover:w-16 group-hover:bg-white transition-all duration-700" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600 group-hover:text-white transition-colors">
                Deep Focus
              </span>
            </motion.div>

            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] text-zinc-400 group-hover:text-white transition-all duration-700">
              Diversos
            </h2>

            <p className="mt-12 text-sm text-zinc-600 font-medium leading-relaxed max-w-sm group-hover:text-zinc-300 transition-colors">
              Exploração, cursos e leitura intensiva. <br />O espaço onde o conhecimento se expande.
            </p>

            <div className="mt-16 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
               <span className="text-[11px] font-black uppercase tracking-widest text-white">Explorar Ambiente</span>
               <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                 <ArrowLeft size={16} className="rotate-180" />
               </div>
            </div>
          </div>

        </motion.div>

        {/* ── SECTION: FLASHCARDS ─────────────────────────────── */}
        <motion.div
          onClick={() => router.push('/estudos/flashcards')}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          whileHover={{ flex: 1.3 }}
          className="relative flex-1 group cursor-pointer overflow-hidden transition-all duration-700"
        >
          {/* Subtle bg glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

          <div className="h-full w-full flex flex-col justify-center px-12 md:px-24 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 mb-2"
            >
              <div className="w-8 h-[1px] bg-zinc-800 group-hover:w-16 group-hover:bg-white transition-all duration-700" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600 group-hover:text-white transition-colors">
                Active Recall
              </span>
            </motion.div>

            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] text-zinc-400 group-hover:text-white transition-all duration-700">
              Flashcards
            </h2>

            <p className="mt-12 text-sm text-zinc-600 font-medium leading-relaxed max-w-sm group-hover:text-zinc-300 transition-colors">
              Repetição espaçada e memorização. <br />Inspirado na metodologia Anki.
            </p>

            <div className="mt-16 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
               <span className="text-[11px] font-black uppercase tracking-widest text-white">Iniciar Revisão</span>
               <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                 <ArrowLeft size={16} className="rotate-180" />
               </div>
            </div>
          </div>

        </motion.div>

      </motion.div>
    </main>
  );
}

