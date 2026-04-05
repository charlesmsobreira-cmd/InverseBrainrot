'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, MusicNotes, Book, FilmReel, Record } from '@phosphor-icons/react';
import Link from 'next/link';

const CategorySection = ({ 
  title, 
  subtitle, 
  bgColor, 
  textColor, 
  image, 
  type, // Use this to customize the log format
  reverse = false 
}: any) => {
  const handleRegisterLog = () => {
    const name = prompt(`Nome do(a) ${title.slice(0, -1)} (ex: Nome da Obra):`);
    if (!name) return;
    
    const extra = prompt(type === 'Músicas' ? 'Artista:' : type === 'Livros' ? 'Autor:' : 'Diretor/Estúdio:');
    const review = prompt('Sua breve resenha/comentário:');
    const imageUrl = prompt('URL da Imagem de Capa (Manual - Cole o link):');
    
    if (!imageUrl) {
      alert('A imagem é obrigatória para o Carrossel Polaroid!');
      return;
    }

    const date = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    let description = '';
    
    if (type === 'Músicas') description = `Em ${date}, ouviu ${name} de ${extra}. "${review}"`;
    if (type === 'Livros') description = `Em ${date}, leu ${name} de ${extra}. "${review}"`;
    if (type === 'Filmes') description = `Em ${date}, assistiu ${name}. "${review}"`;

    const newHighlight = {
      id: Date.now().toString(),
      title: name,
      description,
      imageUrl,
      category: title.slice(0, -1)
    };

    const saved = JSON.parse(localStorage.getItem('brain-os-highlights') || '[]');
    const updated = [newHighlight, ...saved];
    localStorage.setItem('brain-os-highlights', JSON.stringify(updated));
    
    window.dispatchEvent(new Event('highlightsUpdated'));
    alert('Log registrado com sucesso! Verifique a Home Page.');
  };

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
               onClick={handleRegisterLog}
               className={`px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs border ${textColor === 'text-white' ? 'border-white/30 hover:bg-white hover:text-black' : 'border-black/30 hover:bg-black hover:text-white'} transition-all`}
             >
               Registrar Log
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

export default function MuralPage() {
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
        type="Músicas"
        subtitle="Listening Party"
        bgColor="bg-[#E21B22]"
        textColor="text-white"
        image="/mural/music.png"
      />

      <CategorySection 
        title="Livros"
        type="Livros"
        subtitle="Current Session"
        bgColor="bg-white"
        textColor="text-black"
        image="/mural/books.png"
        reverse={true}
      />

      <CategorySection 
        title="Filmes"
        type="Filmes"
        subtitle="Wishlist"
        bgColor="bg-black"
        textColor="text-white"
        image="/mural/movies.png"
      />

      {/* Footer Navigation */}
      <footer className="py-20 bg-black text-white text-center">
         <Link href="/">
            <button className="px-12 py-4 border border-white/30 rounded-full hover:bg-white hover:text-black transition-all font-bold tracking-widest uppercase">
              Voltar ao Sistema
            </button>
         </Link>
      </footer>
    </main>
  );
}
