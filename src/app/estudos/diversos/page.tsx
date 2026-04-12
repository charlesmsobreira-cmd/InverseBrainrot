'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, NotePencil, Plus, Link as LinkIcon, Trash, FileText, X, Stack } from '@phosphor-icons/react';
import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { supabase } from '@/lib/supabase';
import ImageExtension from '@tiptap/extension-image';
import { ImageSquare } from '@phosphor-icons/react';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import LinkExtension from '@tiptap/extension-link';
import Typography from '@tiptap/extension-typography';

type LinkType = {
  id: string;
  url: string;
  title: string;
};

type AttachmentType = {
  id: string;
  name: string;
  url: string;
  type: string; // 'image' | 'pdf' | 'other'
  size: number;
  path: string;
};

type PageType = {
  id: string;
  title: string;
  notes: string; // This will now store HTML
  links: LinkType[];
  attachments: AttachmentType[];
};

const defaultPage: PageType = {
  id: 'default-1',
  title: 'Minhas Anotações Iniciais',
  notes: '',
  links: [],
  attachments: []
};

// 3: Notepad 0%   | Manager 100%

export default function DiversosPage() {
  const [pages, setPages] = useState<PageType[]>([]);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Link addition form state
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkTitle, setNewLinkTitle] = useState('');

  const activePage = pages.find(p => p.id === activePageId);

  // --- Tiptap Editor ---
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Comece a digitar seus pensamentos...',
      }),
      BubbleMenuExtension,
      LinkExtension.configure({
        openOnClick: false,
      }),
      Typography,
      ImageExtension.configure({
        HTMLAttributes: {
          class: 'rounded-2xl shadow-2xl max-w-full h-auto my-8 mx-auto block border border-white/10',
        },
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      updateActivePageNotes(html);
    },
    editorProps: {
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            uploadAndInsertImage(file);
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        for (const item of items) {
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) {
              uploadAndInsertImage(file);
              return true;
            }
          }
        }
        return false;
      },
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[500px] text-zinc-100 text-lg leading-relaxed font-sans',
        spellCheck: 'false',
      },
    },
  });

  // Custom editor styles for placeholder
  const editorStyles = `
    .ProseMirror p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      float: left;
      color: #3f3f46;
      pointer-events: none;
      height: 0;
    }
    .ProseMirror img {
      transition: transform 0.3s ease;
    }
    .ProseMirror img:hover {
      transform: scale(1.02);
    }
  `;

  // Update editor content when active page changes
  useEffect(() => {
    if (editor && activePage && editor.getHTML() !== activePage.notes) {
      editor.commands.setContent(activePage.notes || '');
    }
  }, [activePageId, editor]); // Run once when activePageId changes

  // --- Load pages from Supabase on mount ---
  useEffect(() => {
    const loadPages = async () => {
      setIsLoading(true);
      const { data } = await supabase.from('notepad_pages').select('*').order('created_at', { ascending: true });
      if (data && data.length > 0) {
        setPages(data.map(p => ({ 
          ...p, 
          links: p.links || [],
          attachments: p.attachments || []
        })));
      }
      setIsLoading(false);
    };
    loadPages();
  }, []);

  // --- Debounced auto-save ---
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const persistPage = useCallback((updatedPage: PageType) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      await supabase.from('notepad_pages').update({
        title: updatedPage.title,
        notes: updatedPage.notes,
        links: updatedPage.links,
        attachments: updatedPage.attachments,
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
      links: [],
      attachments: []
    };
    const { error } = await supabase.from('notepad_pages').insert([newPage]);
    if (!error) {
      setPages(prev => [...prev, newPage]);
      setActivePageId(newPage.id);
      setIsAddingLink(false);
    }
  };

  // --- File Upload Logic ---
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activePageId) return;

    setIsUploading(true);
    // Remove caracteres especiais e espaços do nome do arquivo
    const safeName = file.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9.\-]/g, '_');
    const fileName = `${Date.now()}-${safeName}`;
    
    const { data, error } = await supabase.storage
      .from('attachments')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading:', error);
      alert(`Erro ao fazer upload: ${error.message || 'Verifique o formato ou tente novamente.'}`);
      setIsUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('attachments')
      .getPublicUrl(fileName);

    const newAttachment: AttachmentType = {
      id: Date.now().toString(),
      name: file.name,
      url: publicUrl,
      type: file.type.startsWith('image') ? 'image' : file.type === 'application/pdf' ? 'pdf' : 'other',
      size: file.size,
      path: fileName
    };

    const updatedAttachments = [...(activePage?.attachments || []), newAttachment];
    setPages(prev => prev.map(p => p.id === activePageId ? { ...p, attachments: updatedAttachments } : p));
    persistPage({ ...activePage!, attachments: updatedAttachments });
    setIsUploading(false);
  };

  const deleteAttachment = async (attachment: AttachmentType) => {
    if (!activePageId) return;
    
    // 1. Remove from storage
    await supabase.storage.from('attachments').remove([attachment.path]);

    // 2. Remove from database
    const updatedAttachments = activePage!.attachments.filter(a => a.id !== attachment.id);
    setPages(prev => prev.map(p => p.id === activePageId ? { ...p, attachments: updatedAttachments } : p));
    persistPage({ ...activePage!, attachments: updatedAttachments });
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
 
  const uploadAndInsertImage = async (file: File) => {
    if (!editor) return;

    setIsUploading(true);
    const safeName = file.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9.\-]/g, '_');
    const fileName = `${Date.now()}-inline-${safeName}`;
    const { data: uploadData, error } = await supabase.storage
      .from('attachments')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading image:', error);
      alert(`Erro ao fazer upload da imagem: ${error.message || 'Tente novamente.'}`);
      setIsUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('attachments')
      .getPublicUrl(fileName);

    editor.chain().focus().setImage({ src: publicUrl, alt: file.name }).run();
    setIsUploading(false);
  };

  const insertInlineImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadAndInsertImage(file);
  };

  return (
    <main className="h-screen overflow-hidden flex flex-col transition-colors duration-1000 bg-[#050505] text-zinc-400" spellCheck="false">
      <style dangerouslySetInnerHTML={{ __html: editorStyles }} />
      {/* Header Clássico */}
      <div className="p-6 md:px-12 flex-shrink-0 flex items-center justify-between border-b border-white/5 transition-colors duration-1000 relative z-20 bg-black/40 backdrop-blur-xl">
        <Link href="/estudos">
          <motion.button 
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-zinc-100 font-bold uppercase tracking-widest text-sm"
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
        <div className="flex-1 lg:w-2/3 transition-all duration-1000 border-r border-white/5 flex flex-col h-full overflow-hidden bg-[#050505]">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center opacity-30">
              <div className="flex flex-col items-center gap-3">
                <NotePencil size={40} className="animate-pulse text-zinc-100" />
                <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">Carregando...</p>
              </div>
            </div>
          ) : activePage ? (

            <>
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 overflow-y-auto no-scrollbar relative w-full px-4 lg:px-12">
              {editor && (
                <BubbleMenu 
                  editor={editor} 
                  shouldShow={({ editor }) => editor.isActive('image')}
                  className="bg-zinc-900 border border-white/10 shadow-2xl rounded-xl overflow-hidden flex items-center p-1 z-50"
                >
                  <button 
                    onClick={() => editor.chain().focus().deleteSelection().run()}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-widest transition-colors"
                  >
                    <Trash size={14} /> Remover Imagem
                  </button>
                </BubbleMenu>
              )}

              <div className="max-w-4xl mx-auto py-12">
                <div className="mb-12">
                  <input 
                    type="text" 
                    value={activePage.title}
                    onChange={e => updateActivePageTitle(e.target.value)}
                    className="text-6xl font-black tracking-tighter bg-transparent outline-none w-full placeholder:text-zinc-800 transition-colors duration-1000 text-white leading-none"
                    placeholder="Página Sem Título"
                  />
                </div>

                <div className="min-h-[60vh]">
                  <EditorContent editor={editor} />
                </div>
              </div>
            </div>
          </div>
          </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md"
              >
                <div className="w-20 h-20 bg-white/5 rounded-3xl shadow-sm border border-white/5 flex items-center justify-center mx-auto mb-6">
                  <NotePencil size={40} className="text-white opacity-20" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-zinc-100 mb-3">Seu Espaço Criativo</h2>
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
        <div className="lg:w-1/3 transition-all duration-1000 h-[50vh] lg:h-auto flex flex-col relative flex-shrink-0 lg:flex-shrink bg-[#0D0D0D] text-zinc-400">
           <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 flex-shrink-0 z-10 transition-colors duration-1000 bg-black/20">
             <div className="flex items-center gap-2">
               <Stack size={20} className="text-zinc-500" />
               <span className="font-bold text-xs uppercase tracking-widest text-zinc-500">Páginas e Links</span>
             </div>
             <button 
               onClick={createPage}
               className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-black bg-zinc-100 hover:bg-white px-3 py-1.5 rounded-lg transition-colors"
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
                        ? 'bg-white/[0.03] border-white/20 shadow-2xl' 
                        : 'bg-transparent border-white/5 hover:border-white/10'
                    }`}
                 >
                   {/* Page Header */}
                   <div 
                     onClick={() => setActivePageId(prev => prev === page.id ? null : page.id)}
                     className="flex items-center justify-between p-4 cursor-pointer"
                   >
                     <div className="flex items-center gap-3 overflow-hidden">
                       <FileText size={20} className={isActive ? 'text-zinc-100' : 'text-zinc-600'} />
                       <span className={`font-semibold truncate ${isActive ? 'text-zinc-100 text-base' : 'text-zinc-400 text-sm'} ${!page.title && 'italic opacity-50'}`}>
                         {page.title || 'Sem Título'}
                       </span>
                     </div>
                     <button 
                       onClick={(e) => deletePage(page.id, e)} 
                       className={`p-1.5 rounded-md transition-all text-red-400 hover:text-red-300 hover:bg-red-900/20 ${isActive ? 'opacity-50' : 'opacity-0 hover:opacity-100'}`}
                     >
                       <Trash size={16} />
                     </button>
                   </div>

                    {/* Active Page Content (Navigation Tabs) */}
                    {isActive && (
                      <div className="px-4 pb-4 space-y-6">
                        <hr className="border-white/5" />
                        
                        {/* ── ARQUIVOS E ANEXOS ── */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Arquivos e Anexos</span>
                            <label className="cursor-pointer text-[10px] uppercase font-bold text-azure-400 hover:text-azure-300 transition-colors flex items-center gap-1">
                               {isUploading ? 'Enviando...' : '+ Upload'}
                               <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                            </label>
                          </div>

                          <div className="space-y-2">
                            {page.attachments.length === 0 ? (
                               <div className="text-center py-4 bg-white/[0.02] rounded-xl border border-white/5 border-dashed">
                                 <p className="text-[10px] font-bold text-zinc-700">SEM ANEXOS</p>
                               </div>
                            ) : (
                               page.attachments.map(att => (
                                 <div key={att.id} className="group relative bg-black/40 border border-white/5 rounded-xl p-3 flex items-center gap-3 hover:border-white/20 transition-all">
                                    <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center overflow-hidden border border-white/5">
                                      {att.type === 'image' ? (
                                        <img src={att.url} alt="" className="w-full h-full object-cover" />
                                      ) : (
                                        <FileText size={20} className="text-zinc-600" />
                                      )}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                      <p className="text-[11px] font-bold text-zinc-200 truncate">{att.name}</p>
                                      <p className="text-[9px] text-zinc-600 uppercase font-mono">{(att.size / 1024).toFixed(0)} KB • {att.type}</p>
                                    </div>
                                    <div className="flex items-center gap-1 group/actions">
                                      <button onClick={() => window.open(att.url, '_blank')} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/5 rounded-lg transition-all">
                                         <LinkIcon size={12} className="text-zinc-400" />
                                      </button>
                                      <button onClick={() => deleteAttachment(att)} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 rounded-lg transition-all text-red-400">
                                         <Trash size={12} />
                                      </button>
                                    </div>
                                 </div>
                               ))
                            )}
                          </div>
                        </div>

                        {/* ── ARQUIVOS E ANEXOS ── */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Links Inseridos</span>
                            {!isAddingLink && (
                              <button onClick={() => setIsAddingLink(true)} className="text-[10px] uppercase font-bold text-azure-400 hover:text-azure-300 transition-colors">
                                + Novo
                              </button>
                            )}
                          </div>

                          {isAddingLink && (
                            <div className="p-4 rounded-xl border shadow-sm space-y-3 mb-4 transition-all duration-1000 bg-black/40 border-white/10">
                              <input 
                                type="text" placeholder="Nome do link" 
                                className="w-full text-xs p-2.5 bg-black/50 rounded-lg outline-none focus:ring-1 focus:ring-white/20 text-zinc-100" 
                                value={newLinkTitle} onChange={e => setNewLinkTitle(e.target.value)} 
                                autoFocus
                              />
                              <input 
                                type="url" placeholder="URL (ex: https://...)" 
                                className="w-full text-xs p-2.5 bg-black/50 rounded-lg outline-none focus:ring-1 focus:ring-white/20 text-zinc-100" 
                                value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} 
                                onKeyDown={(e) => e.key === 'Enter' && addLink()}
                              />
                              <div className="flex gap-2 mt-1">
                                <button onClick={() => setIsAddingLink(false)} className="flex-1 text-[10px] py-2 text-zinc-500 hover:text-zinc-300 font-medium">Cancelar</button>
                                <button onClick={addLink} className="flex-1 bg-white hover:bg-zinc-200 text-black text-[10px] py-2 rounded-lg font-bold uppercase tracking-wider transition-colors">Adicionar</button>
                              </div>
                            </div>
                          )}

                          <div className="space-y-1.5">
                            {page.links.map(link => (
                              <div
                                key={link.id}
                                onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
                                className="group flex items-center justify-between p-2.5 bg-black/20 rounded-xl border border-white/5 hover:border-white/20 cursor-pointer transition-all shadow-sm"
                              >
                                <div className="flex items-center gap-2 overflow-hidden">
                                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                                    <LinkIcon size={12} className="text-zinc-400" />
                                  </div>
                                  <span className="font-medium text-xs text-zinc-300 truncate">{link.title}</span>
                                </div>
                                <button 
                                  onClick={(e) => deleteLink(link.id, e)}
                                  className="opacity-0 group-hover:opacity-100 text-red-100/40 hover:text-red-400 p-1.5 rounded-md transition-all flex-shrink-0"
                                >
                                   <X size={12} weight="bold" />
                                </button>
                              </div>
                            ))}
                          </div>
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
