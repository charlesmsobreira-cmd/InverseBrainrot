'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { CaretLeft, CaretRight, Play, Pause, Trophy } from '@phosphor-icons/react';
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

export function HighlightsCarousel() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
    // Listen for custom events when a new highlight is added
    window.addEventListener('highlightsUpdated', loadHighlights);
    return () => window.removeEventListener('highlightsUpdated', loadHighlights);
  }, []);

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
    <section className="w-full py-20 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-10 flex items-end justify-between">
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
        className="flex gap-6 overflow-x-auto scrollbar-hide px-6 md:px-12 pb-10 scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {highlights.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ delay: index * 0.1 }}
            className="flex-none w-[85vw] md:w-[600px] lg:w-[800px] aspect-[16/9] md:aspect-[21/9] bg-titanium-700 rounded-[2.5rem] overflow-hidden relative snap-start shadow-xl border border-black/5 group"
          >
            <img 
              src={item.imageUrl} 
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute top-8 left-8 flex flex-col gap-2">
               <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-white border border-white/20">
                 {item.category}
               </span>
            </div>

            <div className="absolute bottom-10 left-10 right-10">
               <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tighter mb-4 drop-shadow-lg">
                 {item.title}
               </h3>
               <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed max-w-2xl drop-shadow-md">
                 {item.description}
               </p>
            </div>
          </motion.div>
        ))}
        {/* Empty space at end for better scroll experience */}
        <div className="flex-none w-2 md:w-20" />
      </div>

      {/* Mobile Dots */}
      <div className="flex md:hidden justify-center gap-2 mt-4">
        {highlights.map((_, i) => (
           <div key={i} className="w-1.5 h-1.5 rounded-full bg-titanium-500 opacity-40" />
        ))}
      </div>
    </section>
  );
}
