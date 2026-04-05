'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Star, Heart, CheckCircle, WarningCircle, ListBullets } from '@phosphor-icons/react';
import Link from 'next/link';
import React, { useState, useEffect, useCallback } from 'react';

// --- Interfaces de Tipagem ---
interface LogItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  rating?: number;
  isLiked?: boolean;
}

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

interface FavoriteListProps {
  logs: LogItem[];
  category: string;
  textColor: string;
}

interface LogModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string | null;
  onNotify: (msg: string, type?: 'success' | 'error') => void;
  onRefresh: () => void;
}

interface CategorySectionProps {
  title: string;
  subtitle: string;
  bgColor: string;
  textColor: string;
  image: string;
  logs: LogItem[];
  reverse?: boolean;
  onOpenModal: (cat: string) => void;
}

// --- Sub-componente: Notificação Customizada (Toast) ---
const Toast = ({ message, type, onClose }: ToastProps) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
    className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-4 bg-[#121212] border border-white/10 rounded-2xl shadow-2xl min-w-[300px]"
  >
    {type === 'success' ? (
      <CheckCircle size={24} weight="fill" className="text-emerald-500" />
    ) : (
      <WarningCircle size={24} weight="fill" className="text-red-500" />
    )}
    <p className="text-sm font-bold text-white tracking-wide">{message}</p>
    <button onClick={onClose} className="ml-auto text-white/20 hover:text-white transition-colors">
      <X size={16} weight="bold" />
    </button>
  </motion.div>
);

// --- Sub-componente: Lista de Favoritos/Wishlist ---
const FavoriteList = ({ logs, category, textColor }: FavoriteListProps) => {
  // Map standard title to highlight category
  const mapCategory: Record<string, string> = {
    'Músicas': 'Música',
    'Livros': 'Livro',
    'Filmes': 'Filme'
  };
  const categoryKey = mapCategory[category as keyof typeof mapCategory] || '';

  const filtered = logs
    .filter((log) => log.category === categoryKey)
    .slice(0, 5);

  if (filtered.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-10 w-full max-w-xs"
    >
      <div className="flex items-center gap-2 mb-4 justify-center opacity-40">
        <ListBullets size={16} weight="bold" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{category === 'Filmes' ? 'Wishlist' : 'Favoritos'}</span>
      </div>
      <ul className="space-y-3">
        {filtered.map((item, index) => (
          <motion.li 
            key={item.id}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`text-sm md:text-base font-bold tracking-tight border-b pb-2 ${textColor === 'text-white' ? 'border-white/10 text-white' : 'border-black/5 text-black'}`}
          >
            {item.title}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

// --- Sub-componente: Modal de Registro ---
const LogModal = ({ isOpen, onClose, category, onNotify, onRefresh }: LogModalProps) => {
  const [name, setName] = useState('');
  const [extra, setExtra] = useState('');
  const [review, setReview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [rating, setRating] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const getPreviewUrl = () => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) return imageUrl;
    return `/logs/${imageUrl}`;
  };

  const handleSave = () => {
    if (!name || !imageUrl || !category) {
      onNotify('Nome e Arquivo são obrigatórios!', 'error');
      return;
    }

    const date = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    const reviewPart = review.trim() ? ` "${review}"` : '';
    
    // Determine internal category name
    const internalCategory = category.slice(0, -1);

    const descriptionText = category === 'Músicas' 
      ? `Em ${date}, ouviu ${name} de ${extra}.${reviewPart}`
      : category === 'Livros'
      ? `Em ${date}, leu ${name} de ${extra}.${reviewPart}`
      : `Em ${date}, assistiu ${name}.${reviewPart}`;

    const newLog: LogItem = {
      id: Date.now().toString(),
      title: name,
      description: descriptionText,
      imageUrl: getPreviewUrl(),
      category: internalCategory,
      rating,
      isLiked
    };

    const saved = JSON.parse(localStorage.getItem('brain-os-highlights') || '[]');
    const updated = [newLog, ...saved];
    localStorage.setItem('brain-os-highlights', JSON.stringify(updated));
    
    // Only update home carousel for music and books
    if (category !== 'Filmes') {
      window.dispatchEvent(new Event('highlightsUpdated'));
    }
    
    onRefresh(); // Refresh the list in Mural
    onClose();
    onNotify('Log registrado com sucesso!');
    
    // Reset
    setName(''); setExtra(''); setReview(''); setImageUrl(''); setRating(0); setIsLiked(false);
  };

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-xl bg-[#121212] border border-white/10 rounded-2xl shadow-2xl p-8 text-white overflow-hidden"
      >
        <div className="flex justify-between items-start mb-8">
          <div className="flex flex-col">
            <h3 className="text-3xl font-black uppercase tracking-tighter">Novo Registro</h3>
            <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">{category}</span>
          </div>
          <button onClick={onClose} className="text-white/20 hover:text-white transition-colors"><X size={24} weight="bold" /></button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Título / Obra</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-azure-500 transition-all text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">{category === 'Músicas' ? 'Artista' : category === 'Livros' ? 'Autor' : 'Diretor'}</label>
              <input type="text" value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-azure-500 transition-all text-sm" />
            </div>
          </div>

          <div className="flex items-center gap-8 py-2 border-y border-white/5">
             <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">Avaliação</label>
               <div className="flex gap-1 text-azure-500">
                 {[1,2,3,4,5].map(s => <button key={s} onClick={() => setRating(s)} className={`transition-all ${rating >= s ? 'opacity-100 scale-110' : 'opacity-20 hover:opacity-50'}`}><Star size={20} weight={rating >= s ? "fill" : "bold"} /></button>)}
               </div>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">Gostou?</label>
                <button onClick={() => setIsLiked(!isLiked)} className={`transition-all ${isLiked ? 'text-red-500 scale-110' : 'text-white/20 hover:text-white/40'}`}><Heart size={24} weight={isLiked ? "fill" : "bold"} /></button>
             </div>
          </div>

          <div className="space-y-2">
             <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Sua Resenha</label>
             <textarea value={review} onChange={(e) => setReview(e.target.value)} placeholder="" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-azure-500 h-32 resize-none transition-all text-sm" />
          </div>

          <div className="space-y-4">
             <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Nome do Arquivo (PNG em /public/logs/)</label>
               <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Ex: madona.png" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-azure-500 transition-all text-[10px] font-mono" />
             </div>
             {imageUrl && (
               <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                 <img src={getPreviewUrl()} alt="Preview" className="w-16 h-16 rounded-lg object-cover bg-black/40" onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/121212/white?text=Erro'; }} />
                 <p className="text-[10px] font-mono text-azure-400 truncate">{getPreviewUrl()}</p>
               </div>
             )}
          </div>

          <div className="flex gap-4 pt-4">
            <button onClick={onClose} className="flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-xs bg-white/5 hover:bg-white/10 transition-all">Cancelar</button>
            <button onClick={handleSave} className="flex-[2] py-4 rounded-xl font-bold uppercase tracking-widest text-xs bg-azure-500 hover:bg-azure-600 transition-all shadow-lg shadow-azure-500/20">Criar Registro</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Sub-componente: Seção de Categoria ---
const CategorySection = ({ title, subtitle, bgColor, textColor, image, logs, reverse = false, onOpenModal }: CategorySectionProps) => (
  <section className={`min-h-screen w-full flex flex-col justify-center relative overflow-hidden ${bgColor} ${textColor} px-6 md:px-24 py-20`}>
    <div className={`max-w-[1400px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center ${reverse ? 'md:flex-row-reverse' : ''}`}>
      <div className="flex flex-col items-center text-center w-full">
         <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex flex-col items-center w-full">
           <h2 className="text-6xl md:text-9xl font-black tracking-tighter leading-none mb-4">{title}</h2>
           <div className="w-full max-w-xs border-t border-current pt-4 opacity-80 mb-12 flex flex-col items-center">
             <p className="text-2xl md:text-3xl font-light tracking-[0.3em] uppercase">{subtitle}</p>
           </div>
           
           <FavoriteList logs={logs} category={title} textColor={textColor} />

           <motion.button
             whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
             onClick={() => onOpenModal(title)}
             className={`px-12 py-4 rounded-full font-bold uppercase tracking-widest text-xs border ${textColor === 'text-white' ? 'border-white/30 hover:bg-white hover:text-black' : 'border-black/30 hover:bg-black hover:text-white'} transition-all mt-4`}
           >
             REGISTRAR
           </motion.button>
         </motion.div>
      </div>
      <div className={`relative flex justify-center items-center w-full ${reverse ? 'md:order-1' : ''}`}>
         <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-lg aspect-square overflow-hidden shadow-2xl rounded-sm">
           <img src={image} alt={title} className="w-full h-full object-cover" />
         </motion.div>
      </div>
    </div>
  </section>
);

export default function MuralPage() {
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [modalCategory, setModalCategory] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogItem[]>([]);

  const loadLogs = useCallback(() => {
    const saved = localStorage.getItem('brain-os-highlights');
    if (saved) setLogs(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadLogs();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadLogs]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <main className="bg-white min-h-screen">
      <div className="fixed top-8 left-8 z-50">
        <Link href="/">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 text-white shadow-2xl hover:bg-black hover:text-white transition-all"><ArrowLeft size={28} weight="bold" /></motion.button>
        </Link>
      </div>

      <CategorySection title="Músicas" subtitle="Listening Party" bgColor="bg-[#E21B22]" textColor="text-white" image="/mural/music.png" logs={logs} onOpenModal={(cat:string) => setModalCategory(cat)} />
      <CategorySection title="Livros" subtitle="Current Session" bgColor="bg-white" textColor="text-black" image="/mural/books.png" reverse={true} logs={logs} onOpenModal={(cat:string) => setModalCategory(cat)} />
      <CategorySection title="Filmes" subtitle="Wishlist" bgColor="bg-black" textColor="text-white" image="/mural/movies.png" logs={logs} onOpenModal={(cat:string) => setModalCategory(cat)} />

      <footer className="py-20 bg-black text-white text-center"><Link href="/"><button className="px-12 py-4 border border-white/30 rounded-full hover:bg-white hover:text-black transition-all font-bold tracking-widest uppercase">Voltar ao Sistema</button></Link></footer>

      <LogModal isOpen={!!modalCategory} onClose={() => setModalCategory(null)} category={modalCategory} onNotify={showNotification} onRefresh={loadLogs} />

      <AnimatePresence>{notification && <Toast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}</AnimatePresence>
    </main>
  );
}
