'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Browser, NotePencil, PlayCircle, Plus, Link as LinkIcon, Trash, FileText, X } from '@phosphor-icons/react';
import Link from 'next/link';
import { useState } from 'react';

type LinkType = {
  id: string;
  url: string;
  title: string;
  mode: 'register' | 'embed';
};

type PageType = {
  id: string;
  title: string;
  notes: string;
  links: LinkType[];
};

const defaultPage: PageType = {
  id: 'default-1',
  title: 'Minhas Anotações Iniciais',
  notes: '',
  links: []
};

// Split Modes:
// 0: Notepad 100% | Iframe 0%
// 1: Notepad 50%  | Iframe 50%
// 2: Notepad 30%  | Iframe 70% (Default)
// 3: Notepad 0%   | Iframe 100%

export default function DiversosPage() {
  const [pages, setPages] = useState<PageType[]>([defaultPage]);
  const [activePageId, setActivePageId] = useState<string>(defaultPage.id);
  const [activeUrl, setActiveUrl] = useState<string | null>(null);

  // Link addition form state
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkMode, setNewLinkMode] = useState<'register' | 'embed'>('embed');

  // Split Workspace state
  const [splitMode, setSplitMode] = useState<number>(2);

  const activePage = pages.find(p => p.id === activePageId) || pages[0];

  const updateActivePageNotes = (notes: string) => {
    setPages(prev => prev.map(p => p.id === activePageId ? { ...p, notes } : p));
  };

  const updateActivePageTitle = (title: string) => {
    setPages(prev => prev.map(p => p.id === activePageId ? { ...p, title } : p));
  };

  const createPage = () => {
    const newPage: PageType = {
      id: Date.now().toString(),
      title: '',
      notes: '',
      links: []
    };
    setPages(prev => [...prev, newPage]);
    setActivePageId(newPage.id);
  };

  const deletePage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (pages.length === 1) return;
    const newPages = pages.filter(p => p.id !== id);
    setPages(newPages);
    if (activePageId === id) setActivePageId(newPages[0].id);
  };

  const addLink = () => {
    if (!newLinkUrl || !newLinkTitle) return;
    
    // Auto add http snippet for user convenience
    let finalUrl = newLinkUrl;
    if (!finalUrl.startsWith('http')) {
      finalUrl = 'https://' + finalUrl;
    }

    const newLink: LinkType = { 
      id: Date.now().toString(), 
      url: finalUrl, 
      title: newLinkTitle, 
      mode: newLinkMode 
    };
    
    setPages(prev => prev.map(p => p.id === activePageId ? { ...p, links: [...p.links, newLink] } : p));
    
    if (newLinkMode === 'embed') {
      setActiveUrl(finalUrl);
      // Ensure iframe is visible if it was hidden
      if (splitMode === 0) setSplitMode(2);
    }
    
    setIsAddingLink(false);
    setNewLinkUrl('');
    setNewLinkTitle('');
  };

  const deleteLink = (linkId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPages(prev => prev.map(p => p.id === activePageId ? { ...p, links: p.links.filter(l => l.id !== linkId) } : p));
  };

  const handleLinkClick = (link: LinkType) => {
    if (link.mode === 'embed') {
      setActiveUrl(link.url);
      if (splitMode === 0) setSplitMode(2); // Show iframe if hidden
    } else {
      window.open(link.url, '_blank', 'noopener,noreferrer');
    }
  };

  const cycleSplitMode = () => {
    setSplitMode(prev => (prev + 1) % 4);
  };

  // Compute Layout Widths based on tailwind classes for smooth transition if needed
  let leftWidthClass = 'lg:w-1/3';
  let rightWidthClass = 'lg:w-2/3';

  if (splitMode === 0) {
    leftWidthClass = 'lg:w-full';
    rightWidthClass = 'lg:w-0 hidden lg:flex';
  } else if (splitMode === 1) {
    leftWidthClass = 'lg:w-1/2';
    rightWidthClass = 'lg:w-1/2';
  } else if (splitMode === 2) {
    leftWidthClass = 'lg:w-1/3';
    rightWidthClass = 'lg:w-2/3';
  } else if (splitMode === 3) {
    leftWidthClass = 'lg:w-0 hidden lg:flex';
    rightWidthClass = 'lg:w-full';
  }

  const splitLabels = ['100% Notepad', '50/50', '30/70', '100% Link'];

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
        <div className="ml-auto flex items-center gap-4">
          <button 
            onClick={cycleSplitMode}
            className="flex items-center gap-2 group hover:bg-black/5 px-3 py-1.5 rounded-xl transition-all"
          >
            <Browser size={24} className="text-azure-500" />
            <div className="flex flex-col text-left">
              <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-titanium-100 hidden md:block leading-none mb-0.5">Split Workspace</span>
              <span className="font-mono text-[9px] uppercase text-titanium-400 hidden md:block leading-none">{splitLabels[splitMode]}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Split View */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-[1920px] mx-auto w-full">
        
        {/* Painel Esquerdo (Notepad & Links & Pages) */}
        <div className={`${leftWidthClass} transition-all duration-300 border-r border-black/5 bg-[#F5F5F7] flex flex-col h-full overflow-hidden`}>
          
          <div className="p-6 md:px-8 md:pt-8 md:pb-4 flex-shrink-0">
            <div className="flex items-center gap-3 mb-2">
              <NotePencil size={24} className="text-azure-500 flex-shrink-0" />
              <input 
                type="text" 
                value={activePage.title}
                onChange={e => updateActivePageTitle(e.target.value)}
                className="text-2xl font-black uppercase tracking-tighter text-titanium-100 bg-transparent outline-none w-full placeholder:text-titanium-200"
                placeholder="Página Sem Título"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-8 flex flex-col gap-6 no-scrollbar">
            
            {/* Editor Cosmético */}
            <div className="flex-1 min-h-[250px] relative">
              <textarea 
                className="w-full h-full bg-white border border-black/5 rounded-3xl p-6 focus:outline-none focus:ring-2 focus:ring-azure-500/50 resize-none font-mono text-sm shadow-sm transition-all text-titanium-200 placeholder:text-titanium-400/50"
                placeholder="Comece a digitar seus pensamentos, vocabulário novo ou rascunhos aqui..."
                value={activePage.notes}
                onChange={(e) => updateActivePageNotes(e.target.value)}
              />
            </div>

            {/* Gerenciador de Links Atuais */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-titanium-400">Links da Página</h3>
                {!isAddingLink && (
                  <button onClick={() => setIsAddingLink(true)} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-azure-500 hover:text-azure-600">
                    <Plus size={12} /> Adicionar
                  </button>
                )}
              </div>

              {isAddingLink && (
                <div className="bg-white p-4 rounded-2xl border border-azure-500/30 shadow-sm space-y-3 mb-4">
                  <input 
                    type="text" placeholder="Nome (ex: Artigo Wikipedia)" 
                    className="w-full text-sm p-3 bg-[#F5F5F7] rounded-xl outline-none focus:ring-1 focus:ring-azure-500" 
                    value={newLinkTitle} onChange={e => setNewLinkTitle(e.target.value)} 
                    autoFocus
                  />
                  <input 
                    type="url" placeholder="URL (www...)" 
                    className="w-full text-sm p-3 bg-[#F5F5F7] rounded-xl outline-none focus:ring-1 focus:ring-azure-500" 
                    value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && addLink()}
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setNewLinkMode('embed')} 
                      className={`flex-1 text-[10px] py-2 rounded-lg font-bold uppercase tracking-wider transition-colors ${newLinkMode === 'embed' ? 'bg-azure-500 text-white' : 'bg-black/5 text-titanium-400 hover:bg-black/10'}`}
                    >
                      Embarcar Visualização
                    </button>
                    <button 
                      onClick={() => setNewLinkMode('register')} 
                      className={`flex-1 text-[10px] py-2 rounded-lg font-bold uppercase tracking-wider transition-colors ${newLinkMode === 'register' ? 'bg-azure-500 text-white' : 'bg-black/5 text-titanium-400 hover:bg-black/10'}`}
                    >
                      Apenas Salvar
                    </button>
                  </div>
                  <div className="flex gap-2 mt-2 pt-2 border-t border-black/5">
                    <button onClick={() => setIsAddingLink(false)} className="flex-1 text-xs py-2 text-titanium-400 hover:text-black font-medium">Cancelar</button>
                    <button onClick={addLink} className="flex-1 bg-black hover:bg-titanium-100 text-white text-xs py-2 rounded-lg font-medium transition-colors">Confirmar</button>
                  </div>
                </div>
              )}

              {activePage.links.length === 0 && !isAddingLink ? (
                 <p className="text-xs text-titanium-400 italic">Nenhum link salvo nesta página.</p>
              ) : (
                <div className="space-y-2">
                  {activePage.links.map(link => (
                    <div
                      key={link.id}
                      onClick={() => handleLinkClick(link)}
                      className={`group w-full text-left flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                        activeUrl === link.url && link.mode === 'embed'
                          ? 'bg-azure-50 text-azure-600 border-azure-500/30 shadow-sm' 
                          : 'bg-white text-titanium-100 border-black/5 hover:border-azure-500/30'
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        {link.mode === 'embed' ? <Browser size={18} weight={activeUrl === link.url ? 'fill' : 'regular'} className="flex-shrink-0" /> : <LinkIcon size={18} className="flex-shrink-0" />}
                        <span className="font-medium text-sm truncate">{link.title}</span>
                      </div>
                      <button 
                        onClick={(e) => deleteLink(link.id, e)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:bg-red-50 p-1.5 rounded-md transition-all ml-2"
                      >
                         <Trash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <hr className="border-black/5" />

            {/* Navegador de Páginas */}
            <div className="pb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-titanium-400 flex items-center gap-2">
                  <FileText size={16} /> Suas Páginas
                </h3>
                <button 
                  onClick={createPage} 
                  className="text-azure-500 bg-azure-50 p-1.5 rounded-md hover:bg-azure-100 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase"
                >
                  <Plus size={12} /> Nova
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2">
                {pages.map(page => (
                  <div 
                    key={page.id} 
                    onClick={() => setActivePageId(page.id)} 
                    className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${activePageId === page.id ? 'bg-black text-white border-black shadow-md' : 'bg-white border-black/5 hover:border-black/20 text-titanium-100'}`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className={`text-sm font-medium truncate ${!page.title && 'italic opacity-50'}`}>
                        {page.title || 'Sem Título'}
                      </span>
                    </div>
                    {pages.length > 1 && (
                      <button 
                        onClick={(e) => deletePage(page.id, e)} 
                        className={`opacity-0 group-hover:opacity-100 p-1 rounded-md transition-all ${activePageId === page.id ? 'text-white hover:bg-white/20' : 'text-red-400 hover:bg-red-50'}`}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Painel Direito (Iframe Visualizer) */}
        <div className={`${rightWidthClass} transition-all duration-300 h-[50vh] lg:h-auto bg-titanium-100 flex flex-col relative flex-shrink-0 lg:flex-shrink`}>
           <div className="h-10 bg-titanium-200 flex items-center px-4 gap-2 flex-shrink-0 shadow-sm z-10">
             <div className="flex gap-1.5">
               <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
               <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
               <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
             </div>
             {activeUrl ? (
               <div className="mx-auto px-4 py-1 bg-black/20 rounded-full text-[10px] text-white/50 font-mono font-medium tracking-wider max-w-[200px] md:max-w-sm lg:max-w-md truncate border border-white/5">
                 {activeUrl}
               </div>
             ) : (
               <div className="mx-auto px-4 py-1 bg-black/20 rounded-full text-[10px] text-white/30 font-mono font-medium tracking-wider border border-white/5">
                 Nenhum link ativo
               </div>
             )}
             
             {/* Filler just to balance the flex flex-between if needed */}
             <div className="w-[42px]"></div> 
           </div>
           
           <div className="flex-1 bg-white relative flex items-center justify-center">
             {activeUrl ? (
               <iframe 
                 src={activeUrl}
                 className="absolute inset-0 w-full h-full border-0"
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                 allowFullScreen
                 title="Preview Window"
               />
             ) : (
               <div className="text-center opacity-30 flex flex-col items-center">
                 <Browser size={48} className="mb-4" />
                 <p className="font-mono text-sm uppercase tracking-widest font-bold">Preview Area</p>
                 <p className="text-xs mt-2 max-w-[200px]">Adicione um link no modo "Embarcar" para visualizar aqui.</p>
               </div>
             )}
           </div>
        </div>

      </div>
    </main>
  );
}
