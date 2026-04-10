'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Star, StarHalf, Heart, CheckCircle, WarningCircle, ListBullets, Trash, PlusCircle } from '@phosphor-icons/react';
import Link from 'next/link';
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// --- Interfaces de Tipagem ---
interface LogItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  subtitle?: string;
  date?: string;
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
  isDeleteMode: boolean;
  onDelete: (id: string) => void;
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
  isDeleteMode: boolean;
  onDelete: (id: string) => void;
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
const FavoriteList = ({ logs, category, textColor, isDeleteMode, onDelete }: FavoriteListProps) => {
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "circOut" } }
  };

  return (
    <motion.ul 
      variants={container as any}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="flex flex-col items-center w-full max-w-sm mb-8"
    >
      {filtered.map((log) => (
        <motion.li
          key={log.id}
          variants={item as any}
          className={`w-full py-2.5 border-b text-center text-sm md:text-base font-bold tracking-tight last:border-0 relative group ${
            textColor === 'text-white' ? 'border-white/10 text-white' : 'border-black/5 text-black'
          }`}
        >
          <span className="relative z-10">{log.title}</span>
          
          <AnimatePresence>
            {isDeleteMode && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onClick={() => onDelete(log.id)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-red-500 hover:scale-110 transition-transform"
              >
                <Trash size={18} weight="bold" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.li>
      ))}
    </motion.ul>
  );
};

// --- Sub-componente: Modal de Registro ---
const LogModal = ({ isOpen, onClose, category, onNotify, onRefresh }: LogModalProps) => {
  const [name, setName] = useState('');
  const [extra, setExtra] = useState('');
  const [review, setReview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  const getPreviewUrl = () => {
    if (!imageUrl) return '';
    // Se for URL externa ou absoluta, retorna direto
    if (imageUrl.startsWith('http') || imageUrl.startsWith('blob:')) return imageUrl;
    
    // Se for um link do Supabase Storage
    if (imageUrl.includes('supabase.co')) {
      return `${imageUrl}?t=${previewKey}`;
    }

    // Fallback para o sistema legado de arquivos locais
    const filename = imageUrl.endsWith('.png') ? imageUrl : `${imageUrl}.png`;
    return `/logs/${filename}?t=${previewKey}`;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Gerar nome único
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      // 2. Upload para o Supabase (Bucket 'mural')
      const { data, error } = await supabase.storage
        .from('mural')
        .upload(filePath, file);

      if (error) throw error;

      // 3. Pegar URL Pública
      const { data: { publicUrl } } = supabase.storage
        .from('mural')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
      setPreviewKey(prev => prev + 1);
      onNotify('Imagem carregada com sucesso!');
    } catch (error: any) {
      console.error('Upload error:', error);
      onNotify('Erro ao carregar imagem!', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name || !category) {
      onNotify('Nome da obra é obrigatório!', 'error');
      return;
    }

    if (category !== 'Filmes' && !imageUrl) {
      onNotify('Imagem é obrigatória!', 'error');
      return;
    }

    const date = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    const reviewPart = review.trim() ? ` "${review}"` : '';
    const internalCategory = category.slice(0, -1);

    const descriptionText = category === 'Músicas' 
      ? `Em ${date}, ouviu ${name} de ${extra}.${reviewPart}`
      : category === 'Livros'
      ? `Em ${date}, leu ${name} de ${extra}.${reviewPart}`
      : `Na wishlist.`;

    const newLog = {
      title: name,
      description: descriptionText,
      subtitle: extra,
      date: date,
      image_url: imageUrl, // Salva o link direto (seja local ou Supabase)
      category: internalCategory,
      rating: Math.round(rating),
      is_liked: isLiked
    };

    const { error } = await supabase.from('highlights').insert([newLog]);
    if (error) {
      console.error('Database insertion error:', error);
      onNotify('Erro ao salvar no banco de dados!', 'error');
      return;
    }

    if (category !== 'Filmes') {
      window.dispatchEvent(new Event('highlightsUpdated'));
    }
    
    onRefresh();
    onClose();
    onNotify('Log registrado com sucesso!');
    // Reset state
    setName(''); setExtra(''); setReview(''); setImageUrl(''); setRating(0); setIsLiked(false);
  };

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-xl bg-[#121212] border border-white/10 rounded-2xl shadow-2xl p-8 text-white overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        <div className="flex justify-between items-start mb-8">
          <div className="flex flex-col">
            <h3 className="text-3xl font-black uppercase tracking-tighter">Novo Registro</h3>
            <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">{category}</span>
          </div>
          <button onClick={onClose} className="text-white/20 hover:text-white transition-colors"><X size={24} weight="bold" /></button>
        </div>

        <div className="space-y-6">
          <div className={`grid ${category === 'Filmes' ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Título / Obra</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-azure-500 transition-all text-sm" />
            </div>
            
            {category !== 'Filmes' && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">{category === 'Músicas' ? 'Artista' : category === 'Livros' ? 'Autor' : 'Diretor'}</label>
                <input type="text" value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-azure-500 transition-all text-sm" />
              </div>
            )}
          </div>

          {category !== 'Filmes' && (
            <>
              <div className="flex items-center gap-8 py-2 border-y border-white/5">
                 <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">Avaliação</label>
                   <div className="flex gap-0.5 text-azure-500 items-center">
                     {[1,2,3,4,5].map(s => {
                       const display = hoverRating || rating;
                       const half = s - 0.5;
                       const isFull = display >= s;
                       const isHalf = !isFull && display >= half;
                       return (
                         <div key={s} className="relative w-5 h-5 cursor-pointer">
                           <div className="absolute left-0 top-0 w-1/2 h-full z-10" onMouseEnter={() => setHoverRating(half)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(rating === half ? 0 : half)} />
                           <div className="absolute right-0 top-0 w-1/2 h-full z-10" onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(rating === s ? 0 : s)} />
                           {isFull  ? <Star size={20} weight="fill" className="text-azure-500" /> : isHalf  ? <StarHalf size={20} weight="fill" className="text-azure-500" /> : <Star size={20} weight="bold"  className="opacity-20" />}
                         </div>
                       );
                     })}
                   </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">Gostou?</label>
                    <button onClick={() => setIsLiked(!isLiked)} className={`transition-all ${isLiked ? 'text-red-500 scale-110' : 'text-white/20 hover:text-white/40'}`}><Heart size={24} weight={isLiked ? "fill" : "bold"} /></button>
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Sua Resenha</label>
                 <textarea value={review} onChange={(e) => setReview(e.target.value)} placeholder="" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-azure-500 h-24 resize-none transition-all text-sm" />
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Capa do Registro</label>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Opção 1: Upload (Novo) */}
                    <div className="relative group">
                       <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                       <div className={`w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all ${isUploading ? 'bg-white/5 border-white/10' : 'border-white/10 group-hover:bg-white/5 group-hover:border-white/30'}`}>
                          {isUploading ? (
                             <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-6 h-6 border-2 border-azure-500 border-t-transparent rounded-full" />
                          ) : (
                             <>
                                <PlusCircle size={32} className="text-white/20 group-hover:text-azure-500 transition-colors" />
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Upload Imagem</span>
                             </>
                          )}
                       </div>
                    </div>

                    {/* Opção 2: Manual (Legado) */}
                    <div className="flex flex-col justify-center gap-2">
                       <input 
                         type="text" 
                         value={imageUrl.startsWith('http') ? '' : imageUrl} 
                         onChange={(e) => setImageUrl(e.target.value)} 
                         placeholder="Caminho local (ex: madona)" 
                         className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-azure-500 transition-all text-[10px] font-mono" 
                       />
                       <span className="text-[8px] font-mono italic opacity-30 px-2 leading-tight">Use o upload ou digite o nome do arquivo da pasta logs.</span>
                    </div>
                 </div>

                 {imageUrl && (
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-black/40 flex-shrink-0">
                         <img 
                           key={previewKey}
                           src={getPreviewUrl()} 
                           alt="Preview" 
                           className="w-full h-full object-cover" 
                           onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { 
                             (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/121212/white?text=Erro';
                           }} 
                         />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-[8px] font-bold uppercase tracking-widest text-azure-500 mb-1">Preview Ativo</span>
                        <p className="text-[10px] font-mono text-white/40 truncate italic">{getPreviewUrl()}</p>
                      </div>
                    </div>
                 )}
              </div>
            </>
          )}

          <div className="flex gap-4 pt-4 sticky bottom-0 bg-[#121212] py-2">
            <button onClick={onClose} className="flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-xs bg-white/5 hover:bg-white/10 transition-all focus:outline-none">Cancelar</button>
            <button onClick={handleSave} disabled={isUploading} className={`flex-[2] py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg focus:outline-none ${isUploading ? 'bg-white/5 text-white/20' : 'bg-azure-500 hover:bg-azure-600 shadow-azure-500/20'}`}>Criar Registro</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Sub-componente: Seção de Categoria ---
const CategorySection = ({ title, subtitle, bgColor, textColor, image, logs, reverse = false, onOpenModal, isDeleteMode, onDelete }: CategorySectionProps) => (
  <section className={`min-h-screen w-full flex flex-col justify-center relative overflow-hidden ${bgColor} ${textColor} px-6 md:px-24 py-20`}>
    <div className={`max-w-[1400px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center ${reverse ? 'md:flex-row-reverse' : ''}`}>
      <div className="flex flex-col items-center text-center w-full">
         <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex flex-col items-center w-full">
           <h2 className="text-6xl md:text-9xl font-black tracking-tighter leading-none mb-4 uppercase">{title}</h2>
           <div className="w-full max-w-xs border-t border-current pt-4 opacity-80 mb-6 flex flex-col items-center">
             <p className="text-2xl md:text-3xl font-light tracking-[0.3em] uppercase">{subtitle}</p>
           </div>
           
           <div className="w-full flex flex-col items-center min-h-[260px] justify-center">
             <FavoriteList logs={logs} category={title} textColor={textColor} isDeleteMode={isDeleteMode} onDelete={onDelete} />
           </div>

           <motion.button
             whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
             onClick={() => onOpenModal(title)}
             className={`px-12 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] border ${textColor === 'text-white' ? 'border-white/30 hover:bg-white hover:text-black' : 'border-black/30 hover:bg-black hover:text-white'} transition-all`}
           >
             REGISTRAR
           </motion.button>
         </motion.div>
      </div>
      <div className={`relative flex justify-center items-center w-full ${reverse ? 'md:order-1' : ''}`}>
         <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-sm md:max-w-md flex justify-center">
           <img src={image} alt={title} className="w-auto h-auto max-h-[70vh] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
         </motion.div>
      </div>
    </div>
  </section>
);

export default function MuralPage() {
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [modalCategory, setModalCategory] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const loadLogs = useCallback(async () => {
    const { data, error } = await supabase
      .from('highlights')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setLogs(data.map(item => ({
        ...item,
        imageUrl: item.image_url,
        isLiked: item.is_liked
      })));
    }
  }, []);

  const handleDeleteLog = async (id: string) => {
    const { error } = await supabase.from('highlights').delete().eq('id', id);
    if (error) {
      showNotification('Erro ao remover registro', 'error');
      return;
    }
    showNotification('Registro removido');
    loadLogs();
    // Keep it updated for the home dashboard too
    window.dispatchEvent(new Event('highlightsUpdated'));
  };

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

      <CategorySection title="Músicas" subtitle="Listening Party" bgColor="bg-[#E21B22]" textColor="text-white" image="/mural/music.png" logs={logs} onOpenModal={(cat:string) => setModalCategory(cat)} isDeleteMode={isDeleteMode} onDelete={handleDeleteLog} />
      <CategorySection title="Livros" subtitle="Current Session" bgColor="bg-white" textColor="text-black" image="/mural/books.png" reverse={true} logs={logs} onOpenModal={(cat:string) => setModalCategory(cat)} isDeleteMode={isDeleteMode} onDelete={handleDeleteLog} />
      <CategorySection title="Filmes" subtitle="Wishlist" bgColor="bg-black" textColor="text-white" image="/mural/movies.png" logs={logs} onOpenModal={(cat:string) => setModalCategory(cat)} isDeleteMode={isDeleteMode} onDelete={handleDeleteLog} />

      <footer className="py-20 bg-black text-white text-center">
        <button 
          onClick={() => setIsDeleteMode(!isDeleteMode)}
          className={`px-12 py-4 border rounded-full transition-all font-bold tracking-widest uppercase text-[10px] ${isDeleteMode ? 'bg-red-500 border-red-500 text-white' : 'border-white/30 hover:bg-white hover:text-black'}`}
        >
          {isDeleteMode ? 'Concluir Edição' : 'Gerenciar Registros'}
        </button>
      </footer>

      <LogModal isOpen={!!modalCategory} onClose={() => setModalCategory(null)} category={modalCategory} onNotify={showNotification} onRefresh={loadLogs} />

      <AnimatePresence>{notification && <Toast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}</AnimatePresence>
    </main>
  );
}
