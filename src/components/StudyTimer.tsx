'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hourglass, WarningCircle, Clock, CalendarBlank, CaretDown, Trash } from '@phosphor-icons/react';
import { supabase } from '@/lib/supabase';
import { useStudyMode } from '@/context/StudyModeContext';

const MAX_SESSION_MINUTES = 180; // 3 Hours

export default function StudyTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [logs, setLogs] = useState<StudyLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const { isImmersive, setIsImmersive } = useStudyMode();

  const loadInitialData = useCallback(async () => {
    // ── Weekly Reset Logic ──
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Go to last Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfWeekISO = startOfWeek.toISOString();

    const { data: stats } = await supabase
      .from('study_stats')
      .select('*')
      .eq('category', 'Italiano')
      .single();

    let currentTotal = stats?.total_minutes || 0;

    if (stats) {
      // Check if last update was before this week's Sunday
      const lastUpdate = new Date(stats.updated_at);
      if (lastUpdate < startOfWeek) {
        // Reset weekly counter
        currentTotal = 0;
        await supabase
          .from('study_stats')
          .update({ total_minutes: 0, updated_at: now.toISOString() })
          .eq('category', 'Italiano');
      }

      setTotalMinutes(currentTotal);
      
      if (stats.is_running && stats.last_run_start) {
        const started = new Date(stats.last_run_start).getTime();
        const diffSeconds = Math.floor((now.getTime() - started) / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);

        if (diffMinutes >= MAX_SESSION_MINUTES) {
          stopTimer(currentTotal + MAX_SESSION_MINUTES, true);
        } else {
          setIsRunning(true);
          setStartTime(started);
          setSessionSeconds(diffSeconds);
          setIsImmersive(true);
        }
      }
    }

    // Only load logs from the current week
    const { data: logEntries } = await supabase
      .from('study_logs')
      .select('*')
      .eq('category', 'Italiano')
      .gte('created_at', startOfWeekISO)
      .order('created_at', { ascending: false })
      .limit(7);

    if (logEntries) setLogs(logEntries);
  }, [setIsImmersive]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && startTime) {
      interval = setInterval(() => {
        const diffSecs = Math.floor((Date.now() - startTime) / 1000);
        setSessionSeconds(diffSecs);
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

    const { error: statsError } = await supabase
      .from('study_stats')
      .update({ is_running: false, last_run_start: null, total_minutes: newTotal, updated_at: now })
      .eq('category', 'Italiano');

    const minutesToSave = Math.max(1, Math.ceil(sessionSeconds / 60));
    if (!statsError && sessionSeconds >= 10) {
      await supabase.from('study_logs').insert([{
        category: 'Italiano',
        duration_minutes: minutesToSave
      }]);
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

  const deleteLog = async (id: string) => {
    const logToDelete = logs.find(l => l.id === id);
    if (!logToDelete) return;

    const { error } = await supabase
      .from('study_logs')
      .delete()
      .eq('id', id);

    if (!error) {
      const updatedTotal = Math.max(0, totalMinutes - logToDelete.duration_minutes);
      
      // Update local state
      setLogs(prev => prev.filter(log => log.id !== id));
      setTotalMinutes(updatedTotal);

      // Update Database stats
      await supabase
        .from('study_stats')
        .update({ total_minutes: updatedTotal, updated_at: new Date().toISOString() })
        .eq('category', 'Italiano');
    }
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
    <>
      {/* ── TIMER WIDGET ── */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4 pointer-events-none">

        {/* Logs Window */}
        <AnimatePresence>
          {showLogs && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="w-[340px] rounded-[3rem] p-8 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] mb-2 pointer-events-auto overflow-hidden border transition-colors duration-500"
              style={{
                backgroundColor: isImmersive ? 'white' : 'rgba(13,13,13,0.8)',
                borderColor: isImmersive ? 'black/5' : 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(32px)',
              }}
            >
              <div className="flex items-center gap-3 mb-8">
                <CalendarBlank
                  size={20}
                  className={isImmersive ? 'text-black' : 'text-white'}
                />
                <span
                  className={`text-[10px] font-black uppercase tracking-[0.3em] ${isImmersive ? 'text-black' : 'text-white'}`}
                >
                  Sessões Recentes
                </span>
              </div>

              <div className="space-y-6 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                {logs.length === 0 ? (
                  <div
                    className="py-12 flex flex-col items-center gap-4 border-2 border-dashed rounded-[2rem]"
                    style={{ borderColor: isImmersive ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' }}
                  >
                    <Clock size={32} className="opacity-10" color={isImmersive ? 'black' : 'white'} />
                    <p
                      className={`text-[9px] font-black uppercase tracking-widest opacity-30 ${isImmersive ? 'text-black' : 'text-white'}`}
                    >
                      Nenhum registro
                    </p>
                  </div>
                ) : (
                  logs.map(log => (
                    <div key={log.id} className="flex items-center justify-between group p-1 transition-all">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`text-[11px] font-black uppercase tracking-tight ${isImmersive ? 'text-black/80' : 'text-white/90'}`}
                        >
                          {formatDateLabel(log.created_at)}
                        </span>
                        <span
                          className={`text-[9px] font-mono opacity-30 ${isImmersive ? 'text-black' : 'text-white'} italic`}
                        >
                          {new Date(log.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div
                          className="px-4 py-2 rounded-xl transition-transform group-hover:scale-105"
                          style={{
                            backgroundColor: isImmersive ? 'black' : 'rgba(255,255,255,0.03)',
                            border: isImmersive ? 'none' : '1px solid rgba(255,255,255,0.1)',
                          }}
                        >
                          <span className={`text-[12px] font-mono font-black ${isImmersive ? 'text-white' : 'text-white'}`}>
                            {formatTotalTime(log.duration_minutes)}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => deleteLog(log.id)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 ${isImmersive ? 'text-black/10 hover:text-red-500 hover:bg-red-50' : 'text-white/10 hover:text-red-500 hover:bg-red-500/10'}`}
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3 pointer-events-auto">
          <AnimatePresence>
            {showNotification && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-black text-white px-5 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 shadow-2xl"
              >
                <WarningCircle size={18} weight="bold" /> {showNotification}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Logs Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLogs(!showLogs)}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all border shadow-lg"
            style={{
              backgroundColor: isImmersive ? (showLogs ? 'black' : 'white') : (showLogs ? 'white' : 'rgba(255,255,255,0.05)'),
              borderColor: isImmersive ? 'black/10' : 'rgba(255,255,255,0.1)',
              color: isImmersive ? (showLogs ? 'white' : 'black') : (showLogs ? 'black' : 'white'),
              backdropFilter: 'blur(32px)',
            }}
          >
            <CaretDown size={22} weight="bold" style={{ transform: showLogs ? 'none' : 'rotate(180deg)', transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }} />
          </motion.button>

          {/* Timer Display Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-2 rounded-full flex items-center gap-4 border shadow-2xl transition-colors duration-700"
            style={{
              backgroundColor: isImmersive ? 'white' : 'rgba(13,13,13,0.8)',
              backdropFilter: 'blur(48px)',
              borderColor: isImmersive ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)',
            }}
          >
            <div className="flex items-center pl-5 pr-1 gap-6">
              <div className="flex flex-col">
                <span
                  className={`text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-1 opacity-40 ${isImmersive ? 'text-black' : 'text-white'}`}
                >
                  {isRunning ? 'Foco Profundo' : 'Total Semanal'}
                </span>
                <span
                  className={`text-lg font-black font-mono leading-none tracking-tighter ${isImmersive ? 'text-black' : 'text-white'}`}
                >
                  {isRunning ? formatDisplayTime(sessionSeconds) : formatTotalTime(totalMinutes)}
                </span>
              </div>

              {/* Start/Stop Button */}
              <motion.button
                onClick={() => isRunning ? stopTimer() : startTimer()}
                disabled={isSyncing}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-700 relative overflow-hidden shadow-xl"
                style={{
                  backgroundColor: isRunning ? 'black' : (isImmersive ? '#F5F5F7' : 'white'),
                  color: isRunning ? 'white' : 'black',
                }}
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

                {/* Pulsing indicator when active */}
                {isRunning && (
                  <motion.div
                    animate={{ opacity: [0.3, 0.1, 0.3], scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 rounded-full bg-white/10 pointer-events-none"
                  />
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}


