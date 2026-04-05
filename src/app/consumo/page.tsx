'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Star, Heart, CheckCircle, WarningCircle } from '@phosphor-icons/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// --- Sub-componente: Notificação Customizada (Toast) ---
const Toast = ({ message, type, onClose }: any) => (
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

// --- Sub-componente: Modal de Registro (Backloggd Style) ---
const LogModal = ({ isOpen, onClose, category, onNotify }: any) => {
  const [name, setName] = useState('');
  const [extra, setExtra] = useState('');
  const [review, setReview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [rating, setRating] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Preview dinâmico do caminho
  const getPreviewUrl = () => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) return imageUrl;
    return `/logs/${imageUrl}`;
  };

  const handleSave = () => {
    if (!name || !imageUrl) {
      onNotify('Nome e Arquivo são obrigatórios!', 'error');
      return;
    }

    let finalImageUrl = getPreviewUrl();

    const date = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    let description = '';
    const stars = rating > 0 ? ' ⭐'.repeat(rating) : '';
    const heart = isLiked ? ' ❤️' : '';
    const reviewPart = review.trim() ? ` "${review}"` : '';
    
    if (category === 'Músicas') description = `Em ${date}, ouviu ${name} de ${extra}.${stars}${heart}${reviewPart}`;
    if (category === 'Livros') description = `Em ${date}, leu ${name} de ${extra}.${stars}${heart}${reviewPart}`;
    if (category === 'Filmes') description = `Em ${date}, assistiu ${name}.${stars}${heart}${reviewPart}`;

    const newHighlight = {
      id: Date.now().toString(),
      title: name,
      description,
      imageUrl: finalImageUrl,
      category: category.slice(0, -1)
    };

    const saved = JSON.parse(localStorage.getItem('brain-os-highlights') || '[]');
    const updated = [newHighlight, ...saved];
    localStorage.setItem('brain-os-highlights', JSON.stringify(updated));
    
    window.dispatchEvent(new Event('highlightsUpdated'));
    onClose();
    onNotify('Log registrado com sucesso!');
    
    // Clear fields
    setName('');
    setExtra('');
    setReview('');
    setImageUrl('');
    setRating(0);
    setIsLiked(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-xl bg-[#121212] border border-white/10 rounded-2xl shadow-2xl p-8 text-white overflow-hidden"
      >
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-1">Novo Registro</h3>
            <p className="text-white/50 text-sm font-bold tracking-widest uppercase">{category}</p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <X size={24} weight="bold" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Título / Obra</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Haste"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-azure-500 transition-all text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                {category === 'Músicas' ? 'Artista' : category === 'Livros' ? 'Autor' : 'Diretor'}
              </label>
              <input 
                type="text" 
                value={extra}
                onChange={(e) => setExtra(e.target.value)}
                placeholder="Ex: Sun Tzu"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-azure-500 transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-8 py-2 border-y border-white/5">
             <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">Avaliação</label>
               <div className="flex gap-1 text-azure-500">
                 {[1, 2, 3, 4, 5].map((s) => (
                   <button 
                     key={s} 
                     onClick={() => setRating(s)}
                     className={`transition-all ${rating >= s ? 'opacity-100 scale-110' : 'opacity-20 hover:opacity-50'}`}
                   >
                     <Star size={20} weight={rating >= s ? "fill" : "bold"} />
                   </button>
                 ))}
               </div>
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">Gostou?</label>
               <button 
                 onClick={() => setIsLiked(!isLiked)}
                 className={`transition-all ${isLiked ? 'text-red-500 scale-110' : 'text-white/20 hover:text-white/40'}`}
               >
                 <Heart size={24} weight={isLiked ? "fill" : "bold"} />
               </button>
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Sua Resenha</label>
            <textarea 
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="O que você achou dessa obra?"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-azure-500 h-32 resize-none transition-all text-sm"
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Nome do Arquivo (na pasta /public/logs/)</label>
              <input 
                type="text" 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Ex: sayyouwill.png"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-azure-500 transition-all text-sm font-mono"
              />
            </div>
            
            {imageUrl && (
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-black/40 flex-none border border-white/10">
                  <img 
                    src={getPreviewUrl()} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e: any) => e.target.src = 'https://placehold.co/100x100/121212/white?text=Erro'}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase text-white/40 mb-1">Caminho Detetado:</p>
                  <p className="text-[10px] font-mono text-azure-400 truncate">{getPreviewUrl()}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              onClick={onClose}
              className="flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-xs bg-white/5 hover:bg-white/10 transition-all"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              className="flex-[2] py-4 rounded-xl font-bold uppercase tracking-widest text-xs bg-azure-500 hover:bg-azure-600 transition-all shadow-lg shadow-azure-500/20"
            >
              Criar Registro
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Sub-componente: Seção de Categoria ---
const CategorySection = ({ 
  title, 
  subtitle, 
  bgColor, 
  textColor, 
  image, 
  reverse = false,
  onOpenModal
}: any) => {
  return (
    <section className={`min-h-screen w-full flex flex-col justify-center relative overflow-hidden ${bgColor} ${textColor} px-6 md:px-24 py-20`}>
      <div className={`max-w-[1400px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center ${reverse ? 'md:flex-row-reverse' : ''}`}>
        <div className="flex flex-col items-center text-center w-full">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             className="flex flex-col items-center w-full"
           >
             <h2 className="text-6xl md:text-9xl font-black tracking-tighter leading-none">
               {title}
             </h2>
             <div className="w-full max-w-xs mt-6 border-t border-current pt-4 opacity-80 mb-8">
               <p className="text-2xl md:text-3xl font-light tracking-widest uppercase">
                 {subtitle}
               </p>
             </div>

             <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => onOpenModal(title)}
               className={`px-12 py-4 rounded-full font-bold uppercase tracking-widest text-xs border ${textColor === 'text-white' ? 'border-white/30 hover:bg-white hover:text-black' : 'border-black/30 hover:bg-black hover:text-white'} transition-all`}
             >
               REGISTRAR
             </motion.button>
           </motion.div>
        </div>

        <div className={`relative flex justify-center items-center w-full ${reverse ? 'md:order-1' : ''}`}>
           <motion.div
             initial={{ opacity: 0, scale: 0.8, rotate: reverse ? -5 : 5 }}
             whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
             transition={{ type: 'spring', damping: 15 }}
             className="relative z-10 w-full max-w-lg aspect-square overflow-hidden"
           >
             <img src={image} alt={title} className="w-full h-full object-cover" />
           </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- Página Principal: MuralPage ---
export default function MuralPage() {
  const [notification, setNotification] = useState<any>(null);
  const [modalCategory, setModalCategory] = useState<string | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <main className="bg-white min-h-screen">
      {/* Header Overlay */}
      <div className="fixed top-8 left-8 z-50">
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 text-white shadow-2xl hover:bg-black hover:text-white transition-all"
          >
            <ArrowLeft size={28} weight="bold" />
          </motion.button>
        </Link>
      </div>

      <CategorySection 
        title="Músicas"
        subtitle="Listening Party"
        bgColor="bg-[#E21B22]"
        textColor="text-white"
        image="/mural/music.png"
        onOpenModal={(cat: string) => setModalCategory(cat)}
      />

      <CategorySection 
        title="Livros"
        subtitle="Current Session"
        bgColor="bg-white"
        textColor="text-black"
        image="/mural/books.png"
        reverse={true}
        onOpenModal={(cat: string) => setModalCategory(cat)}
      />

      <CategorySection 
        title="Filmes"
        subtitle="Wishlist"
        bgColor="bg-black"
        textColor="text-white"
        image="/mural/movies.png"
        onOpenModal={(cat: string) => setModalCategory(cat)}
      />

      {/* Footer Navigation */}
      <footer className="py-20 bg-black text-white text-center">
         <Link href="/">
            <button className="px-12 py-4 border border-white/30 rounded-full hover:bg-white hover:text-black transition-all font-bold tracking-widest uppercase">
              Voltar ao Sistema
            </button>
         </Link>
      </footer>

      {/* Modals & Portal elements */}
      <LogModal 
        isOpen={!!modalCategory} 
        onClose={() => setModalCategory(null)} 
        category={modalCategory}
        onNotify={showNotification}
      />

      <AnimatePresence>
        {notification && (
          <Toast 
            message={notification.message} 
            type={notification.type} 
            onClose={() => setNotification(null)} 
          />
        )}
      </AnimatePresence>
    </main>
  );
}
