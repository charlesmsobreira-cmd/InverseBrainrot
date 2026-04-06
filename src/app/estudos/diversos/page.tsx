'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Browser, NotePencil, PlayCircle } from '@phosphor-icons/react';
import Link from 'next/link';
import { useState } from 'react';

// Exemplos de URLs de estudo
const studyResources = [
  { id: 1, title: 'Italiano Básico: Saudações', url: 'https://www.youtube.com/embed/2_YvBsc_Cis', type: 'video' },
  { id: 2, title: 'Italiano - Wikipedia', url: 'https://pt.wikipedia.org/wiki/L%C3%ADngua_italiana', type: 'article' },
  { id: 3, title: 'Técnica Pomodoro', url: 'https://pt.wikipedia.org/wiki/T%C3%A9cnica_pomodoro', type: 'article' },
];

export default function DiversosPage() {
  const [activeUrl, setActiveUrl] = useState<string>(studyResources[0].url);
  const [notes, setNotes] = useState('');

  return (
    <main className="h-screen bg-[#F5F5F7] text-[#1D1D1F] overflow-hidden flex flex-col">
      {/* Header Clássico */}
      <div className="p-6 md:px-12 flex-shrink-0 flex items-center bg-white border-b border-black/5 shadow-sm relative z-20">
        <Link href="/estudos">
          <motion.button 
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-azure-500 font-bold uppercase tracking-widest text-sm"
          >
            <ArrowLeft size={20} /> Voltar
          </motion.button>
        </Link>
        <div className="ml-auto flex items-center gap-2 opacity-50">
          <Browser size={24} />
          <span className="font-mono text-xs uppercase tracking-widest font-bold hidden md:inline">Split Workspace</span>
        </div>
      </div>

      {/* Split View */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-[1920px] mx-auto w-full">
        
        {/* Painel Esquerdo (Notepad & Links) */}
        <div className="w-full lg:w-1/3 border-r border-black/5 bg-[#F5F5F7] flex flex-col h-full overflow-hidden">
          
          <div className="p-6 md:p-8 flex-shrink-0 border-b border-black/5">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-titanium-100 flex items-center gap-2 mb-2">
              <NotePencil size={28} className="text-azure-500" />
              Notepad Dinâmico
            </h2>
            <p className="text-sm text-titanium-400">Anotações fluidas e materiais em uma única tela.</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-8 no-scrollbar">
            
            {/* Editor Cosmético */}
            <div className="flex-1 min-h-[300px]">
              <textarea 
                className="w-full h-full bg-white border border-black/5 rounded-3xl p-6 focus:outline-none focus:ring-2 focus:ring-azure-500/50 resize-none font-mono text-sm shadow-sm transition-all text-titanium-200 placeholder:text-titanium-400/50"
                placeholder="Comece a digitar seus pensamentos, vocabulário novo ou rascunhos aqui..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Links Rápidos */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-titanium-400 mb-4">Mídia Imediata (Clique)</h3>
              <div className="space-y-3">
                {studyResources.map(res => (
                  <button
                    key={res.id}
                    onClick={() => setActiveUrl(res.url)}
                    className={`w-full text-left flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                      activeUrl === res.url 
                        ? 'bg-azure-500 text-white border-azure-500 shadow-lg shadow-azure-500/20' 
                        : 'bg-white text-titanium-100 border-black/5 hover:border-azure-500/30'
                    }`}
                  >
                    {res.type === 'video' ? <PlayCircle size={20} weight={activeUrl === res.url ? 'fill' : 'regular'} /> : <Browser size={20} weight={activeUrl === res.url ? 'fill' : 'regular'} />}
                    <span className="font-medium text-sm truncate">{res.title}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Painel Direito (Iframe) */}
        <div className="w-full lg:w-2/3 h-[50vh] lg:h-auto bg-titanium-100 flex flex-col relative flex-shrink-0 lg:flex-shrink">
           <div className="h-10 bg-titanium-200 flex items-center px-4 gap-2 flex-shrink-0">
             <div className="flex gap-1.5">
               <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
               <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
               <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
             </div>
             <div className="mx-auto px-4 py-1 bg-black/20 rounded-full text-[10px] text-white/50 font-mono font-medium tracking-wider max-w-[200px] md:max-w-sm truncate border border-white/5">
                {activeUrl}
             </div>
           </div>
           
           <div className="flex-1 bg-white relative">
             <iframe 
               src={activeUrl}
               className="absolute inset-0 w-full h-full border-0"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
               allowFullScreen
               title="Preview Window"
             />
           </div>
        </div>

      </div>
    </main>
  );
}
