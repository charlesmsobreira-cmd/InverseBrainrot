'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Cards, Compass } from '@phosphor-icons/react';
import Link from 'next/link';
import { useState } from 'react';

export default function StudyPage() {
  const [hovered, setHovered] = useState<'none' | 'diversos' | 'flashcards'>('none');

  return (
    <main className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] p-6 md:p-12 overflow-hidden flex flex-col">
      <Link href="/">
        <motion.button 
          whileHover={{ x: -5 }}
          className="flex items-center gap-2 text-azure-500 font-bold uppercase tracking-widest text-sm mb-8 relative z-20"
        >
          <ArrowLeft size={20} /> Voltar para o Sistema
        </motion.button>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex flex-col relative z-10 w-full max-w-[1600px] mx-auto h-full"
      >
        <div className="flex items-center gap-4 text-azure-500 mb-8 pl-4">
          <BookOpen size={40} weight="duotone" />
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-titanium-100">
            Foco & Estudos
          </h1>
        </div>
        
        {/* 50/50 Split Container */}
        <div className="flex-1 flex flex-col md:flex-row gap-6 w-full min-h-[70vh]">
          
          {/* Estudos Diversos */}
          <motion.div 
            onHoverStart={() => setHovered('diversos')}
            onHoverEnd={() => setHovered('none')}
            animate={{ 
              flex: hovered === 'diversos' ? 1.6 : (hovered === 'flashcards' ? 0.7 : 1),
            }}
            transition={{ type: 'spring', bounce: 0.1, duration: 0.6 }}
            className={`cursor-pointer rounded-[3rem] p-8 md:p-16 flex flex-col justify-end relative overflow-hidden transition-colors duration-500 ${
              hovered === 'diversos' ? 'bg-azure-500 text-white shadow-2xl shadow-azure-500/30 border-transparent' : 'bg-azure-500/10 text-azure-600 border border-azure-500/20 hover:border-azure-500/40'
            }`}
          >
            <div className="absolute top-10 left-10">
              <Compass size={56} weight="duotone" className={`transition-colors duration-500 ${hovered === 'diversos' ? 'text-white' : 'text-azure-500'}`} />
            </div>

            <div className="relative z-10 transform origin-left transition-transform duration-500">
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.9]">Estudos <br/> Diversos</h2>
              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${hovered === 'diversos' ? 'max-h-32 opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'}`}>
                <p className="text-xl max-w-sm font-medium leading-relaxed">
                  Livros, artigos, cursos e aprendizado exploratório contínuo.
                </p>
              </div>
            </div>

            {/* Decal Background */}
            <div className="absolute -bottom-16 -right-16 opacity-10 pointer-events-none transform transition-transform duration-1000">
              <Compass size={400} weight="fill" className={hovered === 'diversos' ? 'scale-110 rotate-12 text-white' : ''} />
            </div>
          </motion.div>

          {/* Flashcards */}
          <motion.div 
            onHoverStart={() => setHovered('flashcards')}
            onHoverEnd={() => setHovered('none')}
            animate={{ 
              flex: hovered === 'flashcards' ? 1.6 : (hovered === 'diversos' ? 0.7 : 1),
            }}
            transition={{ type: 'spring', bounce: 0.1, duration: 0.6 }}
            className={`cursor-pointer rounded-[3rem] p-8 md:p-16 flex flex-col justify-end relative overflow-hidden transition-colors duration-500 ${
              hovered === 'flashcards' ? 'bg-titanium-100 text-white shadow-2xl shadow-black/20 border-transparent' : 'bg-black/[0.04] text-titanium-100 border border-black/10 hover:border-black/20'
            }`}
          >
            <div className="absolute top-10 left-10">
              <Cards size={56} weight="duotone" className={`transition-colors duration-500 ${hovered === 'flashcards' ? 'text-white' : 'text-titanium-400'}`} />
            </div>

            <div className="relative z-10 transform origin-left transition-transform duration-500">
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.9]">Flash<br/>cards</h2>
              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${hovered === 'flashcards' ? 'max-h-32 opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'}`}>
                <p className="text-xl max-w-sm font-medium leading-relaxed">
                  Repetição espaçada, revisão ativa e memorização cirúrgica.
                </p>
              </div>
            </div>
             
             {/* Decal Background */}
             <div className="absolute -bottom-16 -right-16 opacity-10 pointer-events-none transform transition-transform duration-1000">
              <Cards size={400} weight="fill" className={hovered === 'flashcards' ? 'scale-110 -rotate-12 text-white' : ''} />
             </div>
          </motion.div>
          
        </div>
      </motion.div>
    </main>
  );
}
