'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, NotePencil, Plus, Link as LinkIcon, Trash, FileText, X, Stack } from '@phosphor-icons/react';
import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useStudyMode } from '@/context/StudyModeContext';

type LinkType = {
  id: string;
  url: string;
  title: string;
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
// 0: Notepad 100% | Manager 0%
// 1: Notepad 50%  | Manager 50%
// 2: Notepad 70%  | Manager 30% (Default reversed weight)
// 3: Notepad 0%   | Manager 100%

export default function DiversosPage() {
  const [pages, setPages] = useState<PageType[]>([]);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isImmersive } = useStudyMode();

  // Link addition form state
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkTitle, setNewLinkTitle] = useState('');

  const activePage = pages.find(p => p.id === activePageId);

  // --- Load pages from Supabase on mount ---
  useEffect(() => {
    const loadPages = async () => {
      setIsLoading(true);
      const { data } = await supabase.from('notepad_pages').select('*').order('created_at', { ascending: true });
      if (data && data.length > 0) {
        setPages(data.map(p => ({ ...p, links: p.links || [] })));
      }
      setIsLoading(false);
    };
    loadPages();
  }, []);

  // --- Debounced auto-save for notes and title ---
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const persistPage = useCallback((updatedPage: PageType) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      await supabase.from('notepad_pages').update({
        title: updatedPage.title,
        notes: updatedPage.notes,
        links: updatedPage.links,
        updated_at: new Date().toISOString()
      }).eq('id', updatedPage.id);
    }, 800);
  }, []);

  const updateActivePageNotes = (notes: string) => {
    if (!activePageId) return;
    setPages(prev => {
      const updated = prev.map(p => p.id === activePageId ? { ...p, notes } : p);
      const page = updated.find(p => p.id === activePageId);
      if (page) persistPage(page);
      return updated;
    });
  };

  const updateActivePageTitle = (title: string) => {
    if (!activePageId) return;
    setPages(prev => {
      const updated = prev.map(p => p.id === activePageId ? { ...p, title } : p);
      const page = updated.find(p => p.id === activePageId);
      if (page) persistPage(page);
      return updated;
    });
  };

  const createPage = async () => {
    const newPage: PageType = {
      id: Date.now().toString(),
      title: '',
      notes: '',
      links: []
    };
    const { error } = await supabase.from('notepad_pages').insert([newPage]);
    if (!error) {
      setPages(prev => [...prev, newPage]);
      setActivePageId(newPage.id);
      setIsAddingLink(false);
    }
  };

  const deletePage = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await supabase.from('notepad_pages').delete().eq('id', id);
    const newPages = pages.filter(p => p.id !== id);
    setPages(newPages);
    if (activePageId === id) setActivePageId(null);
  };

  const addLink = async () => {
    if (!newLinkUrl || !newLinkTitle || !activePageId) return;
    let finalUrl = newLinkUrl;
    if (!finalUrl.startsWith('http')) finalUrl = 'https://' + finalUrl;

    const newLink: LinkType = { id: Date.now().toString(), url: finalUrl, title: newLinkTitle };
    const updatedLinks = [...(activePage?.links || []), newLink];

    await supabase.from('notepad_pages').update({ links: updatedLinks, updated_at: new Date().toISOString() }).eq('id', activePageId);
    setPages(prev => prev.map(p => p.id === activePageId ? { ...p, links: updatedLinks } : p));
    setIsAddingLink(false);
    setNewLinkUrl('');
    setNewLinkTitle('');
  };

  const deleteLink = async (linkId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activePageId || !activePage) return;
    const updatedLinks = activePage.links.filter(l => l.id !== linkId);
    await supabase.from('notepad_pages').update({ links: updatedLinks, updated_at: new Date().toISOString() }).eq('id', activePageId);
    setPages(prev => prev.map(p => p.id === activePageId ? { ...p, links: updatedLinks } : p));
  };

  return (
    <main className={`h-screen overflow-hidden flex flex-col transition-colors duration-1000 ${
      isImmersive ? 'bg-transparent text-[#F5F5F7]' : 'bg-transparent text-[#1D1D1F]'
    }`}>
      {/* Header Clássico */}
      <div className={`p-6 md:px-12 flex-shrink-0 flex items-center justify-between border-b transition-colors duration-1000 relative z-20 ${
        isImmersive ? 'bg-[#131314] border-white/5 shadow-none' : 'bg-white border-black/5 shadow-sm'
      }`}>
        <Link href="/estudos">
          <motion.button 
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-azure-500 font-bold uppercase tracking-widest text-sm"
          >
            <ArrowLeft size={20} /> Voltar
          </motion.button>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex flex-col text-right items-end opacity-40">
            <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-titanium-100 leading-none mb-0.5">Notepad Dinâmico</span>
            <span className="font-mono text-[9px] uppercase text-titanium-400 leading-none">V2.0 Workspace</span>
          </div>
        </div>
      </div>

      {/* Main View */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-[1920px] mx-auto w-full">
        
        {/* Painel Esquerdo (Notepad / Empty State) */}
        <div className={`flex-1 lg:w-2/3 transition-all duration-1000 border-r flex flex-col h-full overflow-hidden ${
          isImmersive ? 'bg-transparent border-white/5' : 'bg-[#F5F5F7] border-black/5'
        }`}>
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center opacity-30">
              <div className="flex flex-col items-center gap-3">
                <NotePencil size={40} className="animate-pulse text-azure-500" />
                <p className="font-mono text-xs uppercase tracking-widest">Carregando...</p>
              </div>
            </div>
          ) : activePage ? (

            <>
              <div className="p-6 md:px-8 md:pt-8 md:pb-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <NotePencil size={28} className="text-azure-500 flex-shrink-0" />
                  <input 
                    type="text" 
                    value={activePage.title}
                    onChange={e => updateActivePageTitle(e.target.value)}
                    className={`text-4xl font-black tracking-tighter bg-transparent outline-none w-full placeholder:text-titanium-200 transition-colors duration-1000 ${
                      isImmersive ? 'text-white' : 'text-titanium-100'
                    }`}
                    placeholder="Página Sem Título"
                  />
                </div>
                <p className={`text-xs mt-2 font-mono uppercase tracking-widest ml-10 transition-colors duration-1000 ${
                  isImmersive ? 'text-titanium-400' : 'text-titanium-400'
                }`}>Ambiente de escrita isolado</p>
              </div>

              <div className="flex-1 overflow-hidden px-6 md:px-8 pb-8 flex flex-col">
                <textarea 
                  className={`w-full h-full border rounded-[2rem] p-8 focus:outline-none focus:border-azure-500 focus:ring-4 focus:ring-azure-500/10 resize-none font-mono text-base shadow-sm transition-all duration-1000 leading-relaxed ${
                    isImmersive 
                      ? 'bg-[#1A1A1B] border-white/10 text-titanium-200 placeholder:text-titanium-500/30' 
                      : 'bg-white border-black/10 text-titanium-200 placeholder:text-titanium-400/50'
                  }`}
                  placeholder="Comece a digitar seus pensamentos, vocabulário novo ou rascunhos aqui..."
                  value={activePage.notes}
                  onChange={(e) => updateActivePageNotes(e.target.value)}
                  spellCheck={false}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md"
              >
                <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-black/5 flex items-center justify-center mx-auto mb-6">
                  <NotePencil size={40} className="text-azure-500 opacity-20" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-titanium-100 mb-3">Seu Espaço Criativo</h2>
                <p className="text-titanium-400 text-sm leading-relaxed mb-8">
                  Selecione uma página existente no gerenciador lateral ou crie uma nova para começar suas anotações e organizar seus links de estudo.
                </p>
                <button 
                  onClick={createPage}
                  className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-titanium-100 transition-all shadow-lg shadow-black/10"
                >
                  <Plus size={18} weight="bold" /> Criar Nova Página
                </button>
              </motion.div>
            </div>
          )}
        </div>

        {/* Painel Direito (Gerenciador Centralizado) - Fixed width on LG */}
        <div className={`lg:w-1/3 transition-all duration-1000 h-[50vh] lg:h-auto flex flex-col relative flex-shrink-0 lg:flex-shrink ${
          isImmersive ? 'bg-[#131314] text-[#F5F5F7]' : 'bg-white text-[#1D1D1F]'
        }`}>
           <div className={`h-14 border-b flex items-center justify-between px-6 flex-shrink-0 z-10 transition-colors duration-1000 ${
             isImmersive ? 'border-white/5 bg-white/5' : 'border-black/5 bg-titanium-50/10'
           }`}>
             <div className="flex items-center gap-2">
               <Stack size={20} className="text-titanium-400" />
               <span className="font-bold text-xs uppercase tracking-widest text-titanium-400">Páginas e Links</span>
             </div>
             <button 
               onClick={createPage}
               className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-azure-500 bg-azure-50 hover:bg-azure-100 px-3 py-1.5 rounded-lg transition-colors"
             >
               <Plus size={14} /> Criar
             </button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar pb-24">
             {pages.map(page => {
               const isActive = activePageId === page.id;
               
               return (
                 <div 
                   key={page.id} 
                   className={`rounded-2xl border transition-all overflow-hidden ${
                      isActive 
                        ? (isImmersive ? 'bg-white/5 border-azure-500/40 shadow-xl' : 'bg-[#F5F5F7] border-azure-500/30 shadow-sm') 
                        : (isImmersive ? 'bg-transparent border-white/5 hover:bg-white/[0.02]' : 'bg-white border-black/5 hover:border-black/20')
                    }`}
                 >
                   {/* Page Header */}
                   <div 
                     onClick={() => setActivePageId(page.id)}
                     className="flex items-center justify-between p-4 cursor-pointer"
                   >
                     <div className="flex items-center gap-3 overflow-hidden">
                       <FileText size={20} className={isActive ? 'text-azure-500' : 'text-titanium-300'} />
                       <span className={`font-semibold truncate ${isActive ? 'text-titanium-100 text-base' : 'text-titanium-300 text-sm'} ${!page.title && 'italic opacity-50'}`}>
                         {page.title || 'Sem Título'}
                       </span>
                     </div>
                     <button 
                       onClick={(e) => deletePage(page.id, e)} 
                       className={`p-1.5 rounded-md transition-all text-red-300 hover:text-red-500 hover:bg-red-50 ${isActive ? 'opacity-50' : 'opacity-0 hover:opacity-100'}`}
                     >
                       <Trash size={16} />
                     </button>
                   </div>

                   {/* Active Page Content (Links) */}
                   {isActive && (
                     <div className="px-4 pb-4">
                       <hr className="border-black/5 mb-4" />
                       
                       <div className="flex items-center justify-between mb-3">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-titanium-400">Links Inseridos</span>
                         {!isAddingLink && (
                           <button onClick={() => setIsAddingLink(true)} className="text-[10px] uppercase font-bold text-azure-500 hover:text-azure-600 transition-colors">
                             + Novo
                           </button>
                         )}
                       </div>

                       {isAddingLink && (
                         <div className={`p-4 rounded-xl border shadow-sm space-y-3 mb-4 transition-all duration-1000 ${
                            isImmersive ? 'bg-white/5 border-azure-500/30' : 'bg-white border-azure-500/30'
                          }`}>
                           <input 
                             type="text" placeholder="Nome do link" 
                             className="w-full text-xs p-2.5 bg-black/5 rounded-lg outline-none focus:ring-1 focus:ring-azure-500" 
                             value={newLinkTitle} onChange={e => setNewLinkTitle(e.target.value)} 
                             autoFocus
                           />
                           <input 
                             type="url" placeholder="URL (ex: https://...)" 
                             className="w-full text-xs p-2.5 bg-black/5 rounded-lg outline-none focus:ring-1 focus:ring-azure-500" 
                             value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} 
                             onKeyDown={(e) => e.key === 'Enter' && addLink()}
                           />
                           <div className="flex gap-2 mt-1">
                             <button onClick={() => setIsAddingLink(false)} className="flex-1 text-[10px] py-2 text-titanium-400 hover:text-black font-medium">Cancelar</button>
                             <button onClick={addLink} className="flex-1 bg-azure-500 hover:bg-azure-600 text-white text-[10px] py-2 rounded-lg font-bold uppercase tracking-wider transition-colors">Adicionar</button>
                           </div>
                         </div>
                       )}

                       <div className="space-y-1.5">
                         {page.links.length === 0 && !isAddingLink ? (
                           <div className="text-center py-4 bg-white rounded-xl border border-black/5 border-dashed">
                             <p className="text-[10px] uppercase tracking-widest text-titanium-300 font-medium">Nenhum link salvo</p>
                           </div>
                         ) : (
                           page.links.map(link => (
                             <div
                               key={link.id}
                               onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
                               className="group flex items-center justify-between p-2.5 bg-white rounded-xl border border-black/5 hover:border-azure-500/30 cursor-pointer transition-all shadow-sm"
                             >
                               <div className="flex items-center gap-2 overflow-hidden">
                                 <div className="w-6 h-6 rounded-full bg-azure-50 flex items-center justify-center flex-shrink-0">
                                   <LinkIcon size={12} className="text-azure-500" />
                                 </div>
                                 <span className="font-medium text-xs text-titanium-100 truncate">{link.title}</span>
                               </div>
                               <button 
                                 onClick={(e) => deleteLink(link.id, e)}
                                 className="opacity-0 group-hover:opacity-100 text-red-400 hover:bg-red-50 p-1.5 rounded-md transition-all flex-shrink-0"
                               >
                                  <X size={12} weight="bold" />
                               </button>
                             </div>
                           ))
                         )}
                       </div>

                     </div>
                   )}
                 </div>
               );
             })}
           </div>
        </div>

      </div>
    </main>
  );
}
