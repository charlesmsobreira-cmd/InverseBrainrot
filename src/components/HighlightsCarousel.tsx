'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { CaretLeft, CaretRight, Play, Pause, Trophy, Trash, X, Warning } from '@phosphor-icons/react';
import { useState, useEffect, useRef } from 'react';

interface Highlight {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

const defaultHighlights: Highlight[] = [
  {
    id: '1',
    title: 'Atomic Habits',
    description: 'Finalizado em 15 dias. Nota 10/10.',
    imageUrl: 'https://picsum.photos/seed/book1/800/600',
    category: 'Livro'
  },
  {
    id: '2',
    title: 'Next.js 15 Masterclass',
    description: 'Certificado de conclusão em desenvolvimento Fullstack.',
    imageUrl: 'https://picsum.photos/seed/course1/800/600',
    category: 'Estudo'
  },
  {
    id: '3',
    title: 'Interstellar Rewatch',
    description: 'Experiência imersiva. Uma obra-prima atemporal.',
    imageUrl: 'https://picsum.photos/seed/movie1/800/600',
    category: 'Filme'
  }
];

// --- Sub-componente: Modal de Confirmação Customizado ---
const ConfirmModal = ({ isOpen, onClose, onConfirm, itemName }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-sm bg-[#121212] border border-white/10 rounded-3xl shadow-2xl p-8 text-center"
      >
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Warning size={32} weight="bold" />
        </div>
        <h3 className="text-xl font-black uppercase tracking-tighter mb-2 text-white">Excluir Registro?</h3>
        <p className="text-white/50 text-sm mb-8">
          Tem certeza que deseja remover <span className="text-white font-bold italic">"{itemName}"</span> permanentemente?
        </p>
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] bg-white/5 hover:bg-white/10 text-white transition-all"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] bg-red-500 hover:bg-red-600 text-white transition-all shadow-lg shadow-red-500/20"
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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<Highlight | null>(null);

  const loadHighlights = () => {
    const saved = localStorage.getItem('brain-os-highlights');
    if (saved) {
      setHighlights(JSON.parse(saved));
    } else {
      setHighlights(defaultHighlights);
      localStorage.setItem('brain-os-highlights', JSON.stringify(defaultHighlights));
    }
  };

  useEffect(() => {
    loadHighlights();
    window.addEventListener('highlightsUpdated', loadHighlights);
    return () => window.removeEventListener('highlightsUpdated', loadHighlights);
  }, []);

  const handleDelete = () => {
    if (itemToDelete) {
      const updated = highlights.filter(h => h.id !== itemToDelete.id);
      setHighlights(updated);
      localStorage.setItem('brain-os-highlights', JSON.stringify(updated));
      setItemToDelete(null);
    }
  };

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [highlights]);

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
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: false }}
             className="flex items-center gap-2 text-azure-500 font-bold tracking-widest uppercase text-xs mb-3"
           >
             <Trophy size={16} weight="fill" />
             Conquistas recentes
           </motion.div>
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

        <div className="hidden md:flex items-center gap-3">
          <button 
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`w-12 h-12 rounded-full border border-black/5 flex items-center justify-center transition-all ${
              canScrollLeft ? 'bg-white hover:bg-black/5 text-titanium-100 shadow-sm' : 'opacity-30 cursor-not-allowed'
            }`}
          >
            <CaretLeft size={24} />
          </button>
          <button 
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`w-12 h-12 rounded-full border border-black/5 flex items-center justify-center transition-all ${
              canScrollRight ? 'bg-white hover:bg-black/5 text-titanium-100 shadow-sm' : 'opacity-30 cursor-not-allowed'
            }`}
          >
            <CaretRight size={24} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-10 overflow-x-auto scrollbar-hide px-6 md:px-12 pb-16 scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {highlights.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 50, rotate: index % 2 === 0 ? 1 : -1 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02, rotate: 0, zIndex: 20 }}
            viewport={{ once: false }}
            transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
            className="flex-none w-[85vw] md:w-[480px] lg:w-[550px] bg-white p-5 pb-24 rounded-sm shadow-[0_20px_50px_-15px_rgba(0,0,0,0.2)] border border-black/5 snap-start relative group flex flex-col"
          >
            {/* Delete Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setItemToDelete(item);
              }}
              className="absolute top-8 right-8 z-30 w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xl hover:bg-red-600 scale-90 hover:scale-100"
            >
              <Trash size={24} weight="bold" />
            </button>

            <div className="w-full aspect-[4/5] overflow-hidden rounded-xs relative mb-10 bg-black/5">
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/[0.03]" />
              
              <div className="absolute top-5 left-5">
                 <span className="px-4 py-2 bg-white/60 backdrop-blur-xl rounded-full text-[10px] font-bold uppercase tracking-widest text-black border border-white/50 shadow-sm">
                   {item.category}
                 </span>
              </div>
            </div>
            
            <div className="px-3 min-h-[80px] flex flex-col justify-end">
               <h3 className="text-3xl md:text-4xl font-mono text-titanium-100 tracking-tighter mb-3 opacity-90 uppercase italic leading-none truncate">
                 {item.title}
               </h3>
               <p className="text-titanium-400 text-sm md:text-base font-mono font-light leading-relaxed italic opacity-70 line-clamp-2">
                 {item.description}
               </p>
            </div>
          </motion.div>
        ))}
        <div className="flex-none w-2 md:w-20" />
      </div>

      {/* Manual Confirm Modal */}
      <AnimatePresence>
        {itemToDelete && (
          <ConfirmModal 
            isOpen={true} 
            onClose={() => setItemToDelete(null)} 
            onConfirm={handleDelete}
            itemName={itemToDelete.title}
          />
        )}
      </AnimatePresence>

      <div className="flex md:hidden justify-center gap-2 mt-4">
        {highlights.map((_, i) => (
           <div key={i} className="w-1.5 h-1.5 rounded-full bg-titanium-500 opacity-40" />
        ))}
      </div>
    </section>
  );
}
