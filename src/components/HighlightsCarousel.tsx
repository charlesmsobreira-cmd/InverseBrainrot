'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CaretLeft, CaretRight, Trophy, X, Warning, Star, Heart } from '@phosphor-icons/react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface Highlight {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  subtitle?: string; // New: Artist/Author
  date?: string;     // New: Formatted date
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

const defaultHighlights: Highlight[] = [
  {
    id: 'default-1',
    title: 'One More Light',
    subtitle: 'Linkin Park',
    date: '20/07',
    description: 'Em 20/07, ouviu One More Light de Linkin Park. "Who cares if one more light goes out? Well, I do."',
    imageUrl: '/logs/onemorelight.png',
    category: 'Música',
    rating: 5,
    isLiked: true
  },
  {
    id: 'default-2',
    title: 'Skeletons',
    subtitle: 'Travis Scott',
    date: '21/07',
    description: 'Em 21/07, ouviu Skeletons de Travis Scott. Mike Dean production is magic.',
    imageUrl: '/logs/skeletons.png',
    category: 'Música',
    rating: 5,
    isLiked: true
  }
];

export function HighlightsCarousel() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: string; title: string }>({ 
    isOpen: false, 
    id: '', 
    title: '' 
  });

  const loadHighlights = useCallback(async () => {
    const { data, error } = await supabase
      .from('highlights')
      .select('*')
      .neq('category', 'Filme')
      .order('created_at', { ascending: false });
    if (!error && data) {
      const mapped = data.map(item => ({
        ...item,
        imageUrl: item.image_url,
        isLiked: item.is_liked
      }));
      setHighlights(mapped.length > 0 ? mapped : defaultHighlights);
    } else {
      setHighlights(defaultHighlights);
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

  const removeHighlight = async (id: string) => {
    const { error } = await supabase.from('highlights').delete().eq('id', id);
    if (!error) {
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
    <section className="w-full pt-24 pb-16 bg-transparent relative z-20">
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
        className="flex gap-8 overflow-x-auto px-6 md:px-[calc((100vw-1400px)/2+48px)] no-scrollbar pb-32 pt-8 snap-x snap-mandatory scroll-smooth"
      >
        {highlights.map((item, index) => {
          const rotations = [-2.5, 1.8, -1.2, 3.0, -0.7, 2.3, -3.2, 1.0, -1.8, 2.7];
          const offsets   = [6, -4, 8, -2, 10, 0, -6, 4, -10, 2];
          const rot = rotations[index % rotations.length];
          const oy  = offsets[index % offsets.length];
          return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ delay: index * 0.1, duration: 0.8 }}
            className="flex-shrink-0 w-[320px] md:w-[450px] snap-center group relative pt-4"
            style={{ marginTop: `${oy}px` }}
          >
            {/* Delete Button */}
            <button 
              onClick={() => setConfirmModal({ isOpen: true, id: item.id, title: item.title })}
              className="absolute top-2 right-2 z-30 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
            >
              <X size={16} weight="bold" />
            </button>

            {/* Polaroid Container */}
            <div 
              className="bg-white p-6 md:p-8 md:pb-24 pb-20 shadow-[0_30px_80px_rgba(0,0,0,0.12)] rounded-sm transition-transform duration-500 border border-black/[0.03]"
              style={{ transform: `rotate(${rot}deg)` }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'rotate(0deg)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = `rotate(${rot}deg)`}
            >
               <div className="relative aspect-[4/5] overflow-hidden mb-8 bg-gray-100 shadow-inner">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-all duration-700"
                  />
                  
                  {/* Category Badge - INSIDE IMAGE */}
                  <div className="absolute top-4 left-4 bg-white/30 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-sm">
                    <span className="text-[11px] md:text-xs font-black tracking-widest text-black uppercase opacity-70">
                      {item.category}
                    </span>
                  </div>
               </div>
               
               <div className="px-2 text-left relative min-h-[100px]">
                  <h3 className="text-4xl md:text-5xl font-serif italic tracking-tighter text-black/90 mb-2 leading-none uppercase">
                    {item.title}
                  </h3>
                  
                  {item.subtitle && (
                    <p className="text-xl md:text-2xl font-bold tracking-tight text-black/60 mb-3 opacity-90">
                      {item.subtitle}
                    </p>
                  )}
                  
                  <p className="text-[13px] md:text-sm font-mono italic text-black/40 leading-relaxed mb-4 max-w-[90%]">
                    {item.subtitle 
                      ? `${item.category === 'Livro' ? 'Lido' : item.category === 'Filme' ? 'Assistido' : 'Ouvida'} em ${item.date || 'Recente'}`
                      : item.description // Fallback for old items
                    }
                  </p>
                  
                  {/* Rating Stars Row */}
                  <div className="flex gap-1 text-black/20">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={14} weight="fill" className={ (item.rating || 0) >= s ? "text-azure-500" : "opacity-20"} />
                    ))}
                  </div>

                  {/* Like Badge */}
                  {item.isLiked && (
                    <div className="absolute bottom-1 right-2">
                       <Heart size={20} weight="fill" className="text-red-500 drop-shadow-sm opacity-80" />
                    </div>
                  )}
               </div>
            </div>
          </motion.div>
          );
        })}

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
