'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash } from '@phosphor-icons/react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  content?: string;
}

export default function EventDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [event, setEvent] = useState<TimelineEvent | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Load from local storage
  useEffect(() => {
    setIsClient(true);
    const storedEvents = localStorage.getItem('@apple-brain:timeline');
    if (storedEvents) {
      const events: TimelineEvent[] = JSON.parse(storedEvents);
      const found = events.find(e => e.id === id);
      if (found) {
        setEvent(found);
      } else {
        router.push('/estudos/linhadotempo'); // Not found
      }
    }
  }, [id, router]);

  // Save changes
  const saveEvent = (updatedEvent: TimelineEvent) => {
    setEvent(updatedEvent);
    const storedEvents = localStorage.getItem('@apple-brain:timeline');
    if (storedEvents) {
      let events: TimelineEvent[] = JSON.parse(storedEvents);
      events = events.map(e => e.id === id ? updatedEvent : e);
      localStorage.setItem('@apple-brain:timeline', JSON.stringify(events));
    }
  };

  const handleDelete = () => {
    const storedEvents = localStorage.getItem('@apple-brain:timeline');
    if (storedEvents) {
      let events: TimelineEvent[] = JSON.parse(storedEvents);
      events = events.filter(e => e.id !== id);
      localStorage.setItem('@apple-brain:timeline', JSON.stringify(events));
      router.push('/estudos/linhadotempo');
    }
  };

  if (!isClient || !event) return null;

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black overflow-x-hidden relative pb-32">
      
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full p-10 flex justify-between items-center z-50 mix-blend-difference pointer-events-none">
        <Link href="/estudos/linhadotempo" className="pointer-events-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-8 py-4 border border-white/10 rounded-full text-zinc-500 hover:text-white font-black uppercase tracking-[0.3em] text-[10px] transition-all bg-black shadow-2xl backdrop-blur-xl"
          >
            <ArrowLeft size={16} weight="bold" /> Voltar à Timeline
          </motion.button>
        </Link>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDelete}
          className="pointer-events-auto flex items-center gap-3 px-8 py-4 bg-red-500/10 text-red-500 rounded-full font-black uppercase tracking-[0.3em] text-[10px] transition-all shadow-2xl hover:bg-red-500 hover:text-white backdrop-blur-xl border border-red-500/20"
        >
          <Trash size={16} weight="bold" /> Excluir Marco
        </motion.button>
      </header>

      {/* CONTENT AREA */}
      <div className="pt-48 px-10 md:px-32 max-w-5xl mx-auto flex flex-col items-start w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full flex flex-col gap-6"
        >
          
          <input 
            type="text"
            value={event.date}
            onChange={(e) => saveEvent({ ...event, date: e.target.value })}
            className="text-zinc-500 font-mono text-sm tracking-[0.3em] bg-transparent outline-none focus:text-white transition-colors"
            placeholder="Data / Período"
          />

          <input 
            type="text"
            value={event.title}
            onChange={(e) => saveEvent({ ...event, title: e.target.value })}
            className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] text-white bg-transparent outline-none placeholder-zinc-800"
            placeholder="Título do Evento"
          />

          <div className="w-full h-[1px] bg-white/10 mt-12 mb-12" />

          <textarea 
            value={event.content || ''}
            onChange={(e) => saveEvent({ ...event, content: e.target.value })}
            placeholder="Escreva os detalhes, anotações e reflexões sobre este marco histórico..."
            className="w-full bg-transparent outline-none text-zinc-300 font-medium leading-relaxed text-lg md:text-xl resize-none h-[50vh] placeholder-zinc-800"
          />

        </motion.div>
      </div>

    </main>
  );
}
