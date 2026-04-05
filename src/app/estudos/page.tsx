'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen } from '@phosphor-icons/react';
import Link from 'next/link';

export default function StudyPage() {
  return (
    <main className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] p-8 md:p-24 overflow-hidden">
      <Link href="/">
        <motion.button 
          whileHover={{ x: -5 }}
          className="flex items-center gap-2 text-azure-500 font-bold uppercase tracking-widest text-sm mb-12"
        >
          <ArrowLeft size={20} /> Voltar para o Sistema
        </motion.button>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center gap-4 text-azure-500 mb-6">
          <BookOpen size={48} />
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-titanium-100">
            Foco & <br /> Estudos
          </h1>
        </div>
        
        <div className="mt-12 p-12 glass-panel rounded-[3rem] max-w-4xl">
          <p className="text-2xl text-titanium-300 font-light leading-relaxed">
            Mergulhando em blocos de conhecimento estruturado... <br />
            Carregando repositório de engenharia e aprendizado profundo.
          </p>
        </div>
      </motion.div>
    </main>
  );
}
