'use client';

import React, { useState, useEffect } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { CaretLeft, CaretRight, Plus, X } from '@phosphor-icons/react';

interface CalendarEvent {
  id: string;
  date: string; // ISO format
  title: string;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');

  // Load events
  useEffect(() => {
    const saved = localStorage.getItem('calendar_events');
    if (saved) setEvents(JSON.parse(saved));
  }, []);

  // Save events
  useEffect(() => {
    localStorage.setItem('calendar_events', JSON.stringify(events));
  }, [events]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const addEvent = () => {
    if (!newEventTitle.trim()) return;
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      date: selectedDate.toISOString(),
      title: newEventTitle,
    };
    setEvents([...events, newEvent]);
    setNewEventTitle('');
    setShowEventModal(false);
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const selectedDateEvents = events.filter(e => isSameDay(new Date(e.date), selectedDate));

  return (
    <div className="w-full bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </h2>
        </div>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-3 hover:bg-black/5 rounded-full transition-all">
            <CaretLeft size={20} weight="bold" />
          </button>
          <button onClick={nextMonth} className="p-3 hover:bg-black/5 rounded-full transition-all">
            <CaretRight size={20} weight="bold" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Calendar Grid */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-7 border-t border-l border-black/10">
            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(day => (
              <div key={day} className="p-4 border-r border-b border-black/10 text-[10px] font-black uppercase tracking-widest text-black/40 text-center">
                {day}
              </div>
            ))}
            {calendarDays.map((day, idx) => {
              const dayEvents = events.filter(e => isSameDay(new Date(e.date), day));
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, monthStart);

              return (
                <div 
                  key={idx}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    min-h-[120px] p-2 border-r border-b border-black/10 cursor-pointer transition-all
                    ${isSelected ? 'bg-black/5' : 'hover:bg-black/[0.02]'}
                    ${!isCurrentMonth ? 'opacity-20' : 'opacity-100'}
                  `}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`
                      text-sm font-black flex items-center justify-center w-7 h-7 rounded-full
                      ${isToday(day) ? 'bg-black text-white' : ''}
                    `}>
                      {format(day, 'd')}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 overflow-hidden">
                    {dayEvents.slice(0, 3).map(e => (
                      <div key={e.id} className="text-[9px] font-bold bg-black/5 px-1.5 py-0.5 rounded truncate border border-black/5">
                        {e.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-[8px] font-black text-black/30 pl-1 capitalize">
                        + {dayEvents.length - 3} mais
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar - Agenda for Selected Day */}
        <div className="lg:col-span-4 border-l border-black/5 pl-0 lg:pl-12">
          <div className="sticky top-12">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black uppercase tracking-tighter">
                {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
              </h3>
              <button 
                onClick={() => setShowEventModal(true)}
                className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
              >
                <Plus size={20} weight="bold" />
              </button>
            </div>

            <div className="space-y-4">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map(event => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={event.id} 
                    className="group p-5 bg-white border border-black/5 rounded-2xl flex items-center justify-between hover:border-black/20 transition-all shadow-sm"
                  >
                    <span className="font-bold text-sm tracking-tight">{event.title}</span>
                    <button 
                      onClick={() => deleteEvent(event.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-black/20 hover:text-black transition-all"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="py-20 text-center border-2 border-dashed border-black/5 rounded-[2rem]">
                  <p className="text-xs font-black uppercase tracking-widest text-black/10">Nada planejado</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Event Modal */}
      <AnimatePresence>
        {showEventModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowEventModal(false)}
              className="absolute inset-0 bg-white/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white border border-black/10 rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.1)] p-10"
            >
              <h4 className="text-2xl font-black uppercase tracking-tighter mb-8">Novo Evento</h4>
              <input 
                autoFocus
                type="text"
                placeholder="Ex: Reunião de Planejamento"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addEvent()}
                className="w-full text-xl font-bold bg-transparent border-b-2 border-black/10 pb-4 outline-none focus:border-black transition-all mb-10 placeholder:text-black/10"
              />
              <div className="flex gap-4">
                <button 
                  onClick={addEvent}
                  className="flex-1 py-4 bg-black text-white rounded-full font-black uppercase tracking-widest text-[10px]"
                >
                  Salvar
                </button>
                <button 
                  onClick={() => setShowEventModal(false)}
                  className="px-8 py-4 border border-black/10 rounded-full font-black uppercase tracking-widest text-[10px]"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
