'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday,
  startOfToday,
  parseISO
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { CaretLeft, CaretRight, Calendar as CalendarIcon } from '@phosphor-icons/react';

interface DatePickerProps {
  value: string; // ISO format (YYYY-MM-DD or full ISO)
  onChange: (date: string) => void;
  className?: string;
}

export default function DatePicker({ value, onChange, className }: DatePickerProps) {
  // Helper to parse YYYY-MM-DD as local date to avoid timezone shifts
  const parseLocalDate = (dateStr: string) => {
    if (!dateStr) return new Date();
    // Support both YYYY-MM-DD and full ISO strings
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length !== 3) return new Date();
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  };

  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value ? parseLocalDate(value) : new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current value
  const selectedDate = value ? parseLocalDate(value) : null;

  // Calendar logic
  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Start on Sunday
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setViewDate(addMonths(viewDate, 1));
  const prevMonth = () => setViewDate(subMonths(viewDate, 1));

  const handleSelect = (day: Date) => {
    onChange(format(day, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-white/30 transition-all font-bold hover:bg-white/[0.08]"
      >
        <div className="flex items-center gap-3">
          <CalendarIcon size={18} className="text-white/40" />
          <span>{selectedDate ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR }) : 'Selecionar data'}</span>
        </div>
      </button>

      {/* Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute left-0 right-0 mt-3 z-[100] bg-[#1A1A1B] border border-white/10 rounded-[2rem] p-6 shadow-[0_32px_64px_rgba(0,0,0,0.5)] backdrop-blur-3xl overflow-hidden min-w-[320px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-white/90">
                {format(viewDate, 'MMMM yyyy', { locale: ptBR })}
              </h4>
              <div className="flex gap-1">
                <button 
                  type="button" onClick={prevMonth}
                  className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all"
                >
                  <CaretLeft size={16} weight="bold" />
                </button>
                <button 
                  type="button" onClick={nextMonth}
                  className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all"
                >
                  <CaretRight size={16} weight="bold" />
                </button>
              </div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, idx) => (
                <div key={idx} className="text-[10px] font-black text-white/20 text-center py-2 uppercase tracking-widest">
                  {day}
                </div>
              ))}
              {days.map((day, idx) => {
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, monthStart);
                const today = isToday(day);

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(day)}
                    className={`
                      relative h-10 w-full flex items-center justify-center rounded-xl text-xs font-bold transition-all
                      ${isSelected ? 'bg-white text-black' : 'hover:bg-white/10 text-white'}
                      ${!isCurrentMonth ? 'opacity-20' : 'opacity-100'}
                      ${today && !isSelected ? 'text-white underline underline-offset-4 decoration-white/30' : ''}
                    `}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>

            {/* Today Link */}
            <div className="mt-6 pt-4 border-t border-white/5 flex justify-center">
              <button 
                type="button"
                onClick={() => handleSelect(startOfToday())}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all"
              >
                Hoje
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
