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
  reverse = false 
}: any) => (
  <section className={`min-h-screen w-full flex flex-col justify-center relative overflow-hidden ${bgColor} ${textColor} px-6 md:px-24 py-20`}>
    <div className={`max-w-[1400px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${reverse ? 'md:flex-row-reverse' : ''}`}>
      <div className={reverse ? 'md:order-2' : ''}>
         <motion.div
           initial={{ opacity: 0, x: reverse ? 50 : -50 }}
           whileInView={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8 }}
           className="flex flex-col gap-4"
         >
           <h2 className="text-6xl md:text-9xl font-black tracking-tighter leading-none">
             {title}
           </h2>
           <p className="text-2xl md:text-3xl font-light opacity-80 max-w-xl">
             {subtitle}
           </p>
         </motion.div>
      </div>

      <div className={`relative flex justify-center items-center ${reverse ? 'md:order-1' : ''}`}>
         <motion.div
           initial={{ opacity: 0, scale: 0.8, rotate: reverse ? -5 : 5 }}
           whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
           transition={{ type: 'spring', damping: 15 }}
           className="relative z-10 w-full max-w-md aspect-square rounded-2xl shadow-2xl overflow-hidden"
         >
           <img src={image} alt={title} className="w-full h-full object-cover" />
         </motion.div>
      </div>
    </div>
  </section>
);

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
        subtitle="Listening Party"
        bgColor="bg-[#E21B22]"
        textColor="text-white"
        image="/mural/music.jpg"
      />

      <CategorySection 
        title="Livros"
        subtitle="Atuais"
        bgColor="bg-white"
        textColor="text-black"
        image="/mural/books.jpg"
        reverse={true}
      />

      <CategorySection 
        title="Filmes"
        subtitle="Wishlist"
        bgColor="bg-black"
        textColor="text-white"
        image="/mural/movies.jpg"
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
