'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CaretLeft, CaretRight, Trophy, X, Warning, Star, Heart } from '@phosphor-icons/react';
import { useState, useRef, useEffect, useCallback } from 'react';

interface Highlight {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  rating?: number;
  isLiked?: boolean;
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

// --- Sub-componente: Modal de Confirmação Customizado ---
const ConfirmModal = ({ isOpen, onClose, onConfirm, title }: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose} 
        className="absolute inset-0 bg-black/60 backdrop-blur-md" 
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.9, opacity: 0, y: 10 }}
        className="relative w-full max-w-sm bg-[#121212] border border-white/10 rounded-2xl shadow-2xl p-8 text-center"
      >
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
          <Warning size={32} className="text-red-500" weight="fill" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tighter">Confirmar Exclusão</h3>
        <p className="text-sm text-white/40 mb-8 leading-relaxed">
          Tem certeza que deseja remover <span className="text-white font-bold">&quot;{title}&quot;</span>? Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={onClose} 
            className="flex-1 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] bg-white/5 hover:bg-white/10 transition-all text-white/60"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm} 
            className="flex-1 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] bg-red-500 hover:bg-red-600 transition-all text-white shadow-lg shadow-red-500/20"
          >
            Excluir
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export function HighlightsCarousel() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: string; title: string }>({ 
    isOpen: false, 
    id: '', 
    title: '' 
  });

  const loadHighlights = useCallback(() => {
    const saved = localStorage.getItem('brain-os-highlights');
    if (saved) {
      const allItems: Highlight[] = JSON.parse(saved);
      // Filter out 'Filme' (Movies) for the main carousel
      const filtered = allItems.filter(h => h.category !== 'Filme');
      setHighlights(filtered);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadHighlights();
    }, 0);
    
    window.addEventListener('highlightsUpdated', loadHighlights);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('highlightsUpdated', loadHighlights);
    };
  }, [loadHighlights]);

  const removeHighlight = (id: string) => {
    const saved = localStorage.getItem('brain-os-highlights');
    if (saved) {
      const current = JSON.parse(saved);
      const updated = current.filter((h: Highlight) => h.id !== id);
      localStorage.setItem('brain-os-highlights', JSON.stringify(updated));
      loadHighlights();
      setConfirmModal({ isOpen: false, id: '', title: '' });
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full py-24 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-12 flex items-end justify-between">
        <div>
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: false }}
             transition={{ delay: 0.1 }}
             className="text-4xl md:text-5xl font-bold tracking-tight text-titanium-100"
           >
             Comece pelos destaques.
           </motion.h2>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => scroll('left')}
            className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all group"
          >
            <CaretLeft size={24} className="group-active:scale-90 transition-transform" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all group"
          >
            <CaretRight size={24} className="group-active:scale-90 transition-transform" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto px-6 md:px-[calc((100vw-1400px)/2+48px)] no-scrollbar pb-12 snap-x snap-mandatory scroll-smooth"
      >
        {highlights.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ delay: index * 0.1, duration: 0.8 }}
            className="flex-shrink-0 w-[280px] md:w-[350px] snap-center group relative pt-4"
          >
            {/* Delete Button */}
            <button 
              onClick={() => setConfirmModal({ isOpen: true, id: item.id, title: item.title })}
              className="absolute top-2 right-2 z-30 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
            >
              <X size={16} weight="bold" />
            </button>

            {/* Polaroid Container */}
            <div className="bg-white p-4 pb-12 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-sm rotate-1 group-hover:rotate-0 transition-transform duration-500 border border-black/[0.02]">
               <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-gray-100">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
               
               <div className="px-1 text-center relative min-h-[80px] flex flex-col justify-center">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-azure-500 mb-1 block">
                    {item.category}
                  </span>
                  <h3 className="text-xl font-bold tracking-tight text-titanium-100 mb-1 leading-tight line-clamp-1 italic">
                    {item.title}
                  </h3>
                  
                  {/* Rating Stars Row */}
                  <div className="flex justify-center gap-0.5 text-azure-500/80 mt-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={14} weight={(item.rating || 0) >= s ? "fill" : "bold"} className={ (item.rating || 0) >= s ? "opacity-100" : "opacity-20"} />
                    ))}
                  </div>

                  {/* Like Badge - Independent position */}
                  {item.isLiked && (
                    <div className="absolute bottom-[-15px] right-2">
                       <Heart size={20} weight="fill" className="text-red-500 drop-shadow-sm" />
                    </div>
                  )}
               </div>
            </div>
          </motion.div>
        ))}

        {highlights.length === 0 && (
          <div className="w-full py-20 flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-black/10 rounded-3xl mx-6">
            <Trophy size={60} weight="thin" />
            <p className="mt-4 font-bold tracking-widest uppercase text-sm">Nenhum destaque ainda</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {confirmModal.isOpen && (
          <ConfirmModal 
            isOpen={true} 
            onClose={() => setConfirmModal({ isOpen: false, id: '', title: '' })}
            onConfirm={() => removeHighlight(confirmModal.id)}
            title={confirmModal.title}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
