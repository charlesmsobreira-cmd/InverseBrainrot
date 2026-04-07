'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Cards, CheckCircle } from '@phosphor-icons/react';
import Link from 'next/link';
import { useState } from 'react';
import { useStudyMode } from '@/context/StudyModeContext';

// Flashcards de Italiano Básico
const fallbackCards = [
  { id: 1, front: 'Ciao', back: 'Olá / Tchau' },
  { id: 2, front: 'Grazie', back: 'Obrigado(a)' },
  { id: 3, front: 'Prego', back: 'De nada' },
  { id: 4, front: 'Per favore', back: 'Por favor' },
  { id: 5, front: 'Buongiorno', back: 'Bom dia' },
  { id: 6, front: 'Buonasera', back: 'Boa noite (chegada)' },
  { id: 7, front: 'Buonanotte', back: 'Boa noite (despedida)' },
  { id: 8, front: 'Sì / No', back: 'Sim / Não' },
  { id: 9, front: 'Acqua', back: 'Água' },
  { id: 10, front: 'Pane', back: 'Pão' },
  { id: 11, front: 'Come ti chiami?', back: 'Como você se chama?' },
  { id: 12, front: 'Arrivederci', back: 'Até logo' },
];

export default function FlashcardsPage() {
  const [deck] = useState(fallbackCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionFinished, setSessionFinished] = useState(false);
  const { isImmersive } = useStudyMode();

  const flipCard = () => {
    if (!isFlipped) setIsFlipped(true);
  };

  const nextCard = (action: 'errei' | 'dificil' | 'bom' | 'facil') => {
    // A lógica de negócio do anki seria implementada aqui calculando espaçamento (SR)
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex < deck.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setSessionFinished(true);
      }
    }, 150); // delay suave para dar tempo da carta virar antes de trocar o texto
  };

  const restart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionFinished(false);
  };

  const currentCard = deck[currentIndex];

  return (
    <main className={`min-h-screen p-8 md:p-12 overflow-hidden flex flex-col relative transition-colors duration-1000 ${
      isImmersive ? 'bg-transparent text-[#F5F5F7]' : 'bg-transparent text-[#1D1D1F]'
    }`}>
      
      {/* Background Graphic */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
        <Cards size={800} weight="fill" />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center relative z-20 mb-12">
        <Link href="/estudos">
          <motion.button 
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-azure-500 font-bold uppercase tracking-widest text-sm"
          >
            <ArrowLeft size={20} /> Voltar
          </motion.button>
        </Link>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-sm border transition-colors duration-1000 ${
          isImmersive ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'
        }`}>
          <Cards size={16} className="text-azure-500" />
          <span className={`text-[10px] font-bold uppercase tracking-widest ${isImmersive ? 'text-titanium-300' : 'text-titanium-400'}`}>
            Italiano Básico ({currentIndex + 1}/{deck.length})
          </span>
        </div>
      </div>

      {/* Flashcard Area */}
      {sessionFinished ? (
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-lg mx-auto">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-12 rounded-[3rem] shadow-xl border text-center w-full transition-colors duration-1000 ${
              isImmersive ? 'bg-[#1A1A1B] border-white/10' : 'bg-white border-black/5'
            }`}
          >
            <CheckCircle size={64} className="mx-auto text-emerald-500 mb-6" weight="duotone" />
            <h2 className={`text-4xl font-black uppercase tracking-tighter mb-4 transition-colors duration-1000 ${isImmersive ? 'text-white' : 'text-titanium-100'}`}>Sessão Concluída!</h2>
            <p className={`mb-8 transition-colors duration-1000 ${isImmersive ? 'text-titanium-400' : 'text-titanium-400'}`}>Você revisou todas as cartas do deck básico de Italiano por agora.</p>
            <button 
              onClick={restart}
              className="px-8 py-4 bg-azure-500 text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-azure-600 transition-colors w-full shadow-lg shadow-azure-500/30"
            >
              Reiniciar Deck
            </button>
          </motion.div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-xl mx-auto perspective-[1000px]">
          
          <motion.div
            className="w-full aspect-[4/3] rounded-[3rem] cursor-pointer relative"
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            style={{ transformStyle: "preserve-3d" }}
            onClick={flipCard}
          >
            {/* Front of Card */}
            <div 
              className="absolute inset-0 bg-white shadow-2xl shadow-black-[0.03] border border-black/[0.04] rounded-[3rem] flex flex-col items-center justify-center p-12 text-center"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <span className="absolute top-8 left-8 text-[10px] font-bold uppercase tracking-widest text-titanium-300">Frente da Carta</span>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-titanium-100">
                {currentCard?.front}
              </h2>
              {!isFlipped && (
                <div className="absolute bottom-8 flex items-center gap-2 text-titanium-300 opacity-50">
                  <span className="text-xs font-mono uppercase tracking-widest">Clique para revelar</span>
                </div>
              )}
            </div>

            {/* Back of Card */}
            <div 
              className="absolute inset-0 bg-azure-50 shadow-2xl shadow-azure-500/10 border border-azure-500/20 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <span className="absolute top-8 right-8 text-[10px] font-bold uppercase tracking-widest text-azure-400">Verso Revelado</span>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-azure-600 mb-8 mt-4">
                {currentCard?.back}
              </h2>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="h-24 w-full mt-8">
            <AnimatePresence>
              {isFlipped && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  className="flex justify-center gap-2 md:gap-4 w-full"
                >
                  <button onClick={() => nextCard('errei')} className="flex-1 py-4 bg-red-100 text-red-600 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-red-200 transition-colors border border-red-200 hover:scale-105 active:scale-95">
                    1m <br/><span className="text-[10px] opacity-70">Errei</span>
                  </button>
                  <button onClick={() => nextCard('dificil')} className="flex-1 py-4 bg-orange-100 text-orange-600 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-orange-200 transition-colors border border-orange-200 hover:scale-105 active:scale-95">
                    10m <br/><span className="text-[10px] opacity-70">Difícil</span>
                  </button>
                  <button onClick={() => nextCard('bom')} className="flex-1 py-4 bg-emerald-100 text-emerald-600 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-emerald-200 transition-colors border border-emerald-200 hover:scale-105 active:scale-95">
                    1d <br/><span className="text-[10px] opacity-70">Bom</span>
                  </button>
                  <button onClick={() => nextCard('facil')} className="flex-1 py-4 bg-blue-100 text-blue-600 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-blue-200 transition-colors border border-blue-200 hover:scale-105 active:scale-95">
                    4d <br/><span className="text-[10px] opacity-70">Fácil</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
        </div>
      )}
    </main>
  );
}
