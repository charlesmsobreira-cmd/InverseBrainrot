'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from '@phosphor-icons/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStudyMode } from '@/context/StudyModeContext';

const SNAKE_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='24' viewBox='0 0 40 24'%3E%3Cpath d='M20 0 L40 12 L20 24 L0 12 Z' fill='none' stroke='%23ffffff' stroke-width='0.5' stroke-opacity='0.08'/%3E%3C/svg%3E")`;

const LAKERS_PURPLE = '#552583';
const LAKERS_GOLD   = '#FDB927';

export default function StudyPage() {
  const router = useRouter();
  const { isImmersive } = useStudyMode();

  return (
    <main
      className="h-screen w-screen overflow-hidden flex flex-col relative"
      style={{ 
        backgroundColor: '#080808',
        backgroundImage: SNAKE_PATTERN,
        backgroundSize: '40px 24px',
      }}
    >
      {/* ── LAKERS OVERLAY ── */}
      <AnimatePresence>
        {isImmersive && (
          <motion.div
            key="lakers-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8 }}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 5 }}
          >
            <motion.div
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-[-30%] left-[-10%] w-[120vw] h-[100vh] rounded-full blur-[200px]"
              style={{ backgroundColor: `${LAKERS_PURPLE}35` }}
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              className="absolute bottom-[-30%] right-[-10%] w-[80vw] h-[80vh] rounded-full blur-[200px]"
              style={{ backgroundColor: `${LAKERS_GOLD}15` }}
            />
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back button */}
      <Link href="/" className="absolute top-8 left-8" style={{ zIndex: 200 }}>
        <motion.button
          whileHover={{ x: -5 }}
          className="flex items-center gap-2 text-white/40 hover:text-white font-bold uppercase tracking-widest text-xs transition-colors"
        >
          <ArrowLeft size={16} /> Voltar para o Sistema
        </motion.button>
      </Link>

      {/* Centered Cards Container */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15,
              delayChildren: 0.1,
            }
          }
        }}
        className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 p-6 md:p-12 relative z-10"
      >
        
        {/* ── CARD ESTUDOS DIVERSOS — #8 ───────────────────────── */}
        <motion.div
          onClick={() => router.push('/estudos/diversos')}
          variants={{
            hidden: { opacity: 0, y: 30, scale: 0.98 },
            visible: { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
            }
          }}
          whileHover={{ scale: 1.02, y: -8 }}
          whileTap={{ scale: 0.98 }}
          className="relative w-full max-w-lg aspect-[4/5] md:aspect-[3/4] cursor-pointer flex flex-col justify-end p-12 overflow-hidden group border border-white/[0.08] rounded-[3rem] bg-white/[0.02] backdrop-blur-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]"
        >
          {/* Subtle Glow inside card */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* Jersey #8 — subtle top left */}
          <div className="absolute top-10 left-10 md:top-12 md:left-12 select-none pointer-events-none">
            <span className="font-black text-white leading-none opacity-[0.07]" style={{ fontSize: '3.5rem' }}>
              #8
            </span>
          </div>

          <div className="relative z-10">
            <span className="mb-4 block text-[10px] font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-white/40 transition-colors">
              Mamba Mentality
            </span>

            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] text-white">
              Estudos<br />Diversos
            </h2>

            <p className="mt-6 text-sm text-white/30 font-mono leading-relaxed max-w-[240px]">
              Livros, artigos, cursos e aprendizado exploratório contínuo.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <div className="w-6 h-[1px] bg-white/20 group-hover:w-12 group-hover:bg-white/50 transition-all duration-500" />
              <span className="text-[10px] uppercase tracking-widest text-white/20 group-hover:text-white/50 font-bold transition-colors">Acessar</span>
            </div>
          </div>
        </motion.div>

        {/* ── CARD FLASHCARDS — #24 ─────────────────────────────── */}
        <motion.div
          onClick={() => router.push('/estudos/flashcards')}
          variants={{
            hidden: { opacity: 0, y: 30, scale: 0.98 },
            visible: { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
            }
          }}
          whileHover={{ scale: 1.02, y: -8 }}
          whileTap={{ scale: 0.98 }}
          className="relative w-full max-w-lg aspect-[4/5] md:aspect-[3/4] cursor-pointer flex flex-col justify-end p-12 overflow-hidden group border border-white/[0.08] rounded-[3rem] bg-white/[0.02] backdrop-blur-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]"
        >
          {/* Subtle Glow inside card */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          {/* Jersey #24 — subtle top left */}
          <div className="absolute top-10 left-10 md:top-12 md:left-12 select-none pointer-events-none">
            <span className="font-black text-white leading-none opacity-[0.07]" style={{ fontSize: '3.5rem' }}>
              #24
            </span>
          </div>

          <div className="relative z-10">
            <span className="mb-4 block text-[10px] font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-white/40 transition-colors">
              Repetição Espaçada
            </span>

            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] text-white">
              Flash<br />Cards
            </h2>

            <p className="mt-6 text-sm text-white/30 font-mono leading-relaxed max-w-[240px]">
              Repetição espaçada, revisão ativa e memorização cirúrgica.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <div className="w-6 h-[1px] bg-white/20 group-hover:w-12 group-hover:bg-white/50 transition-all duration-500" />
              <span className="text-[10px] uppercase tracking-widest text-white/20 group-hover:text-white/50 font-bold transition-colors">Acessar</span>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </main>
  );
}
