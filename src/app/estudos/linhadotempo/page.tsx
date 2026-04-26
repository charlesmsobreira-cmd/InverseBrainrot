'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, X } from '@phosphor-icons/react';
import Link from 'next/link';

import { useRouter } from 'next/navigation';

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
}

export default function LinhaDoTempo() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '' });
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const storedEvents = localStorage.getItem('@apple-brain:timeline');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('@apple-brain:timeline', JSON.stringify(events));
    }
  }, [events, isClient]);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;

    const newEv: TimelineEvent = {
      id: crypto.randomUUID(),
      title: newEvent.title,
      date: newEvent.date,
    };

    // Sort by date (assuming YYYY ou YYYY-MM-DD form)
    const updatedEvents = [...events, newEv].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    setEvents(updatedEvents);
    setNewEvent({ title: '', date: '' });
    setIsModalOpen(false);
  };

  if (!isClient) return null;

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black overflow-x-hidden relative pb-32">
      
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full p-10 flex justify-between items-center z-50 mix-blend-difference pointer-events-none">
        <Link href="/estudos" className="pointer-events-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-8 py-4 border border-white/10 rounded-full text-zinc-500 hover:text-white font-black uppercase tracking-[0.3em] text-[10px] transition-all bg-black shadow-2xl backdrop-blur-xl"
          >
            <ArrowLeft size={16} weight="bold" /> Voltar
          </motion.button>
        </Link>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="pointer-events-auto flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-black uppercase tracking-[0.3em] text-[10px] transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]"
        >
          <Plus size={16} weight="bold" /> Adicionar Evento
        </motion.button>
      </header>

      {/* TITLE SECTION */}
      <div className="pt-48 pb-24 px-10 md:px-32 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-2 mb-6"
        >
          <div className="w-12 h-[1px] bg-zinc-600" />
          <span className="text-xs font-black uppercase tracking-[0.5em] text-zinc-500">
            Chronos
          </span>
          <div className="w-12 h-[1px] bg-zinc-600" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] text-white"
        >
          Linha do Tempo
        </motion.h1>
      </div>

      {/* TIMELINE */}
      <div className="max-w-5xl mx-auto relative px-10 md:px-0">
        
        {/* Central Line */}
        <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent -translate-x-1/2" />

        <div className="flex flex-col gap-12 md:gap-24 relative z-10 py-12">
          {events.length === 0 ? (
            <div className="text-center text-zinc-600 font-medium tracking-wide mt-20">
              Nenhum evento registrado. Adicione o primeiro marco histórico.
            </div>
          ) : (
            events.map((ev, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div 
                  key={ev.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  onClick={() => router.push(`/estudos/linhadotempo/${ev.id}`)}
                  className={`flex flex-col md:flex-row items-start md:items-center w-full ${isEven ? 'md:justify-start' : 'md:justify-end'} relative group pl-12 md:pl-0 cursor-pointer`}
                >
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-[-2px] md:left-1/2 top-0 md:top-1/2 w-4 h-4 bg-black border-[3px] border-zinc-700 rounded-full md:-translate-x-1/2 md:-translate-y-1/2 group-hover:border-white transition-colors duration-500 z-20" />
                  <div className="absolute left-[-2px] md:left-1/2 top-0 md:top-1/2 w-4 h-4 bg-white rounded-full md:-translate-x-1/2 md:-translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:scale-[2] transition-all duration-700 blur-sm z-10" />

                  {/* Content Box */}
                  <div className={`w-full md:w-[45%] flex flex-col ${isEven ? 'md:items-end md:text-right' : 'md:items-start md:text-left'} relative group-hover:scale-[1.02] transition-transform duration-500`}>
                    
                    <span className="text-sm font-black text-zinc-500 tracking-[0.2em] mb-2 font-mono group-hover:text-zinc-300 transition-colors">
                      {ev.date}
                    </span>
                    <h3 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-4">
                      {ev.title}
                    </h3>
                  </div>

                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* ADD EVENT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold text-white mb-8">Novo Marco Histórico</h2>

              <form onSubmit={handleAddEvent} className="flex flex-col gap-6">
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Título do Evento</label>
                  <input 
                    type="text" 
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    placeholder="Ex: Revolução Francesa"
                    className="bg-transparent border-b border-zinc-800 pb-2 text-white placeholder-zinc-700 outline-none focus:border-white transition-colors font-medium text-lg"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Data ou Período</label>
                  <input 
                    type="text" 
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    placeholder="Ex: 1789 ou 14 de Julho de 1789"
                    className="bg-transparent border-b border-zinc-800 pb-2 text-white placeholder-zinc-700 outline-none focus:border-white transition-colors font-medium text-lg font-mono"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="mt-4 w-full py-4 bg-white text-black rounded-lg font-black uppercase tracking-widest text-xs hover:bg-zinc-200 transition-colors"
                >
                  Salvar Evento
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
}
