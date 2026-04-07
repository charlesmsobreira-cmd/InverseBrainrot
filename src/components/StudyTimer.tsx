'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hourglass, WarningCircle, List, Clock, CalendarBlank, CaretUp, CaretDown } from '@phosphor-icons/react';
import { supabase } from '@/lib/supabase';
import { useStudyMode } from '@/context/StudyModeContext';

const MAX_SESSION_MINUTES = 180; // 3 Hours

type StudyLog = {
  id: string;
  duration_minutes: number;
  created_at: string;
};

export default function StudyTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [logs, setLogs] = useState<StudyLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const { setIsImmersive } = useStudyMode();

  // Load initial state and logs from Supabase
  const loadInitialData = useCallback(async () => {
    // 1. Load total stats
    const { data: stats } = await supabase
      .from('study_stats')
      .select('*')
      .eq('category', 'Italiano')
      .single();

    if (stats) {
      setTotalMinutes(stats.total_minutes || 0);
      if (stats.is_running && stats.last_run_start) {
        const started = new Date(stats.last_run_start).getTime();
        const now = Date.now();
        const diffSeconds = Math.floor((now - started) / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);

        if (diffMinutes >= MAX_SESSION_MINUTES) {
          stopTimer(stats.total_minutes + MAX_SESSION_MINUTES, true);
        } else {
          setIsRunning(true);
          setStartTime(started);
          setSessionSeconds(diffSeconds);
          setIsImmersive(true);
        }
      }
    }

    // 2. Load logs
    const { data: logEntries } = await supabase
      .from('study_logs')
      .select('*')
      .eq('category', 'Italiano')
      .order('created_at', { ascending: false })
      .limit(7);

    if (logEntries) setLogs(logEntries);
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Timer interval (1s for real-time feel)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && startTime) {
      interval = setInterval(() => {
        const diffSecs = Math.floor((Date.now() - startTime) / 1000);
        setSessionSeconds(diffSecs);

        // Auto-stop safety
        if (diffSecs >= MAX_SESSION_MINUTES * 60) {
          stopTimer(totalMinutes + MAX_SESSION_MINUTES, true);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime, totalMinutes]);

  const startTimer = async () => {
    setIsSyncing(true);
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('study_stats')
      .update({ is_running: true, last_run_start: now, updated_at: now })
      .eq('category', 'Italiano');

    if (!error) {
      setStartTime(Date.now());
      setIsRunning(true);
      setSessionSeconds(0);
      setIsImmersive(true);
    }
    setIsSyncing(false);
  };

  const stopTimer = async (forcedTotal?: number, isAuto = false) => {
    setIsSyncing(true);
    const finalSessionMinutes = Math.floor(sessionSeconds / 60);
    const newTotal = forcedTotal ?? (totalMinutes + finalSessionMinutes);
    const now = new Date().toISOString();

    // Update main stats
    const { error: statsError } = await supabase
      .from('study_stats')
      .update({ is_running: false, last_run_start: null, total_minutes: newTotal, updated_at: now })
      .eq('category', 'Italiano');

    // Save log if session was at least 10 seconds
    const minutesToSave = Math.max(1, Math.ceil(sessionSeconds / 60));
    if (!statsError && sessionSeconds >= 10) {
      await supabase.from('study_logs').insert([{
        category: 'Italiano',
        duration_minutes: minutesToSave
      }]);
      // Reload logs
      const { data: newLogs } = await supabase
        .from('study_logs')
        .select('*')
        .eq('category', 'Italiano')
        .order('created_at', { ascending: false })
        .limit(7);
      if (newLogs) setLogs(newLogs);
    }

    if (!statsError) {
      setIsRunning(false);
      setStartTime(null);
      setTotalMinutes(newTotal);
      setSessionSeconds(0);
      setIsImmersive(false);
      if (isAuto) {
        setShowNotification("Sessão finalizada automaticamente (Limite 3h)");
        setTimeout(() => setShowNotification(null), 5000);
      }
    }
    setIsSyncing(false);
  };

  const formatDisplayTime = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${h}h ${m}m ${s.toString().padStart(2, '0')}s`;
  };

  const formatTotalTime = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const formatDateLabel = (isoDate: string) => {
    const date = new Date(isoDate);
    const dayNames = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    return dayNames[date.getDay()];
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4 pointer-events-none">
      {/* Logs Window */}
      <AnimatePresence>
        {showLogs && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[440px] bg-white/95 backdrop-blur-3xl rounded-[2.5rem] p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-black/5 mb-2 pointer-events-auto overflow-hidden"
          >
            <div className="flex items-center gap-3 mb-8">
              <CalendarBlank size={24} className="text-azure-500" />
              <span className="text-sm font-black uppercase tracking-[0.2em] text-titanium-100">Histórico de Sessões</span>
            </div>
            
            <div className="space-y-6 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
              {logs.length === 0 ? (
                <div className="py-12 flex flex-col items-center gap-4 border-2 border-dashed border-black/5 rounded-3xl">
                  <Clock size={32} className="text-titanium-300 opacity-20" />
                  <p className="text-xs text-titanium-300 font-bold uppercase tracking-widest">Nenhum log registrado ainda</p>
                </div>
              ) : (
                logs.map(log => (
                  <div key={log.id} className="flex items-center justify-between group p-1 hover:bg-black/[0.01] rounded-2xl transition-colors">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-black text-titanium-100 uppercase tracking-tight">{formatDateLabel(log.created_at)}</span>
                      <span className="text-[11px] text-titanium-400 font-mono italic">
                        {new Date(log.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="px-5 py-2.5 bg-azure-500 text-white rounded-2xl shadow-lg shadow-azure-500/20">
                      <span className="text-sm font-mono font-black">{formatTotalTime(log.duration_minutes)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 pointer-events-auto">
        <AnimatePresence>
          {showNotification && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-red-500 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-2xl border border-red-400"
            >
              <WarningCircle size={16} /> {showNotification}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Stats Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowLogs(!showLogs)}
          className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl transition-all ${showLogs ? 'bg-black text-white' : 'bg-white/80 text-titanium-400 border border-black/5 shadow-lg'}`}
        >
          {showLogs ? <CaretDown size={20} weight="bold" /> : <List size={22} weight="bold" />}
        </motion.button>

        {/* Timer Display Widget */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`glass-panel p-1.5 rounded-full flex items-center gap-3 backdrop-blur-3xl border border-white/20 shadow-2xl ${isRunning ? 'ring-2 ring-azure-500/30' : ''}`}
        >
          <div className="flex items-center pl-4 pr-1 gap-5">
            <div className="flex flex-col">
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-titanium-400 leading-none mb-1">
                {isRunning ? 'Sessão Ativa' : 'Total Estudado'}
              </span>
              <span className="text-base font-bold text-titanium-100 font-mono leading-none tracking-tighter">
                {isRunning ? formatDisplayTime(sessionSeconds) : formatTotalTime(totalMinutes)}
              </span>
            </div>

            <button
              onClick={() => isRunning ? stopTimer() : startTimer()}
              disabled={isSyncing}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-700 relative overflow-hidden ${
                isRunning ? 'bg-black text-azure-500 shadow-xl' : 'bg-azure-500 text-white shadow-lg shadow-azure-500/30 hover:scale-105 active:scale-95'
              }`}
            >
              {isSyncing ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <motion.div
                  animate={{ rotate: isRunning ? 180 : 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                >
                  <Hourglass size={28} weight={isRunning ? 'fill' : 'bold'} />
                </motion.div>
              )}
              
              {isRunning && (
                <motion.div 
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 bg-azure-500/20 blur-md pointer-events-none"
                />
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
