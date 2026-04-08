'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, CalendarCheck } from '@phosphor-icons/react';
import Link from 'next/link';
import Calendar from "@/components/Calendar";

export default function RoutinePage() {
  return (
    <main className="min-h-screen bg-white text-black p-6 md:p-12 lg:p-24 overflow-hidden selection:bg-black selection:text-white">
      <div className="max-w-[1400px] mx-auto w-full">
        <Link href="/">
          <motion.button 
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-black/40 hover:text-black font-black uppercase tracking-widest text-[10px] mb-12 transition-colors"
          >
            <ArrowLeft size={16} weight="bold" /> Voltar para o Sistema
          </motion.button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <div className="flex items-start gap-6 mb-2">
            <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center text-white shadow-2xl">
              <CalendarCheck size={32} weight="fill" />
            </div>
            <div>
              <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none italic">
                Rotina
              </h1>
              <p className="text-xs font-black uppercase tracking-[0.5em] text-black/20 mt-4">
                Sincronização & Disciplina
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Calendar />
        </motion.div>
      </div>
    </main>
  );
}
