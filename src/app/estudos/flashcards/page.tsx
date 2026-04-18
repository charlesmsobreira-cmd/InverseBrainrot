'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Cards, CheckCircle, ChartLineUp, BookOpen, Crown } from '@phosphor-icons/react';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ITALIAN_WORDS } from './knowledge_base';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  level: string;
  next_review: string;
  interval: number;
  ease_factor: number;
  reviews_count: number;
}

export default function FlashcardsPage() {
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalWords, setTotalWords] = useState(0);

  // Progresso de Níveis
  const getGoal = (count: number) => {
    if (count < 1500) return 1500;
    if (count < 3000) return 3000;
    return 5000;
  };
  
  const currentGoal = getGoal(totalWords);
  const isAdvancedArea = totalWords >= 1500;

  const loadData = useCallback(async () => {
    setIsLoading(true);
    
    // 1. Contar palavras APRENDIDAS (já revisadas com sucesso pelo menos uma vez)
    const { count } = await supabase
      .from('flashcards')
      .select('*', { count: 'exact', head: true })
      .gt('interval', 0);
    setTotalWords(count || 0);

    // 2. Ingestão Inteligente (Sistema de Fila: manter 15 palavras em aprendizado ativo)
    // Contar quantas palavras ATIVAS (com intervalo curto < 7 dias) no baralho
    const { count: activeLearningCount } = await supabase
      .from('flashcards')
      .select('*', { count: 'exact', head: true })
      .lt('interval', 7);
    
    const TARGET_ACTIVE_CARDS = 15;
    const needNewCards = TARGET_ACTIVE_CARDS - (activeLearningCount || 0);

    if (needNewCards > 0) {
      // Buscar IDs que o usuário já tem para não duplicar
      const { data: existing } = await supabase.from('flashcards').select('front');
      const existingFronts = new Set(existing?.map(e => e.front) || []);

      // Filtrar palavras do nível atual que o usuário ainda não tem
      const pool = ITALIAN_WORDS.filter(w => 
        w.level === (isAdvancedArea ? 'avancado' : 'basico') && 
        !existingFronts.has(w.front)
      ).slice(0, needNewCards);

      if (pool.length > 0) {
        const newCards = pool.map(p => ({
          front: p.front,
          back: p.back,
          level: p.level,
          next_review: new Date().toISOString(),
          interval: 0,
          ease_factor: 2.5
        }));
        await supabase.from('flashcards').insert(newCards);
      }
    }

    // 3. Carregar cartas para revisão (next_review <= NOW)
    const { data: pendingCards } = await supabase
      .from('flashcards')
      .select('*')
      .lte('next_review', new Date().toISOString())
      .order('next_review', { ascending: true });

    setDeck(pendingCards || []);
    setIsLoading(false);
  }, [isAdvancedArea]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const flipCard = () => {
    if (!isFlipped) setIsFlipped(true);
  };

  const nextCard = async (action: 'errei' | 'dificil' | 'bom' | 'facil') => {
    const card = deck[currentIndex];
    let newInterval = card.interval;
    let newNextReview = new Date();

    // Algoritmo SRS (SM-2 Simplificado)
    if (action === 'errei') {
      newInterval = 0;
      newNextReview = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos
    } else if (action === 'dificil') {
      newInterval = Math.max(1, Math.floor(card.interval * 0.5));
      newNextReview = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos
    } else if (action === 'bom') {
      newInterval = card.interval === 0 ? 1 : card.interval * 2;
      newNextReview = new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000);
    } else if (action === 'facil') {
      newInterval = card.interval === 0 ? 4 : card.interval * 4;
      newNextReview = new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000);
    }

    // Atualizar no Supabase
    await supabase
      .from('flashcards')
      .update({
        interval: newInterval,
        next_review: newNextReview.toISOString(),
        reviews_count: card.reviews_count + 1
      })
      .eq('id', card.id);

    // Atualizar estado sem atraso brusco
    if (currentIndex < deck.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setSessionFinished(true);
    }
  };

  const restart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionFinished(false);
    loadData();
  };

  const currentCard = deck[currentIndex];

  return (
    <main className="min-h-screen p-8 md:p-12 overflow-hidden flex flex-col relative transition-colors duration-1000 bg-[#050505] text-zinc-100">
      
      {/* Background Graphic */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.01] pointer-events-none text-white">
        <Cards size={800} weight="fill" />
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-20 mb-12 gap-6 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/estudos">
            <motion.button 
              whileHover={{ x: -5 }}
              className="flex items-center gap-2 text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]"
            >
              <ArrowLeft size={16} /> Voltar
            </motion.button>
          </Link>
          <div className="h-4 w-px bg-white/10 hidden md:block" />
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                {isAdvancedArea ? <Crown size={16} className="text-yellow-500" /> : <BookOpen size={16} className="text-emerald-500" />}
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-white leading-none mb-1">
                  Nível {isAdvancedArea ? 'Básico Avançado' : 'Básico'}
                </span>
                <span className="text-[9px] font-mono text-zinc-500 tracking-tighter">
                  {totalWords} Aprendidas / {currentGoal} Objetivo
                </span>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors duration-1000 bg-white/5 border-white/10">
          <ChartLineUp size={14} className="text-zinc-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Sessão Atual: {deck.length > 0 ? `${currentIndex + 1} / ${deck.length}` : 'Vazia'}
          </span>
        </div>
      </div>

      {/* Flashcard Area */}
      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 gap-4">
           <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
              <Cards size={32} opacity={0.3} />
           </motion.div>
           <p className="text-[10px] font-black uppercase tracking-[0.4em]">Organizando seu deck inteligente...</p>
        </div>
      ) : sessionFinished || deck.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-lg mx-auto">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-12 rounded-[3rem] border border-white/5 text-center w-full transition-colors duration-1000 bg-[#0D0D0D] shadow-2xl"
          >
            {deck.length === 0 ? (
               <>
                 <CheckCircle size={64} className="mx-auto text-emerald-500/80 mb-6" weight="duotone" />
                 <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 text-white italic">Zero Pendências</h2>
                 <p className="mb-8 text-zinc-500 font-medium text-sm leading-relaxed px-6">
                   Você revisou tudo por hoje! Suas palavras diárias já foram memorizadas. Volte amanhã para novas palavras e revisões programadas.
                 </p>
               </>
            ) : (
               <>
                 <CheckCircle size={64} className="mx-auto text-emerald-500/80 mb-6" weight="duotone" />
                 <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 text-white italic">Sessão Concluída!</h2>
                 <p className="mb-8 text-zinc-500 font-medium text-sm leading-relaxed px-6">
                   As revisões deste ciclo foram arquivadas. Seu vocabulário está crescendo de forma sólida.
                 </p>
               </>
            )}
            <button 
              onClick={restart}
              className="px-10 py-4 bg-white text-black rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-200 transition-all shadow-xl shadow-black/10"
            >
              Verificar Pendências
            </button>
          </motion.div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-xl mx-auto perspective-[1000px]">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="w-full aspect-[4/3] rounded-[3rem] cursor-pointer relative"
              initial={{ opacity: 0, x: 20, scale: 0.95, rotateY: 0 }}
              animate={{ opacity: 1, x: 0, scale: 1, rotateY: isFlipped ? 180 : 0 }}
              exit={{ opacity: 0, x: -20, scale: 0.95, rotateY: 180 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              style={{ transformStyle: "preserve-3d" }}
              onClick={flipCard}
            >
            {/* Front of Card */}
            <div 
              className="absolute inset-0 bg-[#0D0D0D] shadow-2xl border border-white/5 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="absolute top-8 left-8 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-600">Frente</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white italic">
                {currentCard?.front}
              </h2>
              {!isFlipped && (
                <div className="absolute bottom-8 flex items-center gap-2 text-zinc-800">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Clique para revelar</span>
                </div>
              )}
            </div>

            {/* Back of Card */}
            <div 
              className="absolute inset-0 bg-[#0D0D0D] shadow-2xl border border-white/5 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <span className="absolute top-8 right-8 text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-600">Tradução</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-8 mt-4 italic">
                {currentCard?.back}
              </h2>
            </div>
          </motion.div>
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="h-24 w-full mt-10">
            <AnimatePresence>
              {isFlipped && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  className="flex justify-center gap-2 md:gap-3 w-full"
                >
                  <button onClick={() => nextCard('errei')} className="flex-1 py-4 bg-white/5 text-red-500/80 rounded-2xl font-bold uppercase tracking-widest text-[9px] hover:bg-red-500/10 transition-all border border-white/5 hover:border-red-500/20 hover:scale-105 active:scale-95">
                    Novamente <br/><span className="text-[8px] opacity-40">Errei</span>
                  </button>
                  <button onClick={() => nextCard('dificil')} className="flex-1 py-4 bg-white/5 text-orange-500/80 rounded-2xl font-bold uppercase tracking-widest text-[9px] hover:bg-orange-500/10 transition-all border border-white/5 hover:border-orange-500/20 hover:scale-105 active:scale-95">
                    Difícil <br/><span className="text-[8px] opacity-40">10m</span>
                  </button>
                  <button onClick={() => nextCard('bom')} className="flex-1 py-4 bg-white/5 text-emerald-500/80 rounded-2xl font-bold uppercase tracking-widest text-[9px] hover:bg-emerald-500/10 transition-all border border-white/5 hover:border-emerald-500/20 hover:scale-105 active:scale-95">
                    Bom <br/><span className="text-[8px] opacity-40">2d</span>
                  </button>
                  <button onClick={() => nextCard('facil')} className="flex-1 py-4 bg-white/5 text-zinc-300 rounded-2xl font-bold uppercase tracking-widest text-[9px] hover:bg-white/10 transition-all border border-white/5 hover:border-white/20 hover:scale-105 active:scale-95">
                    Fácil <br/><span className="text-[8px] opacity-40">4d</span>
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
