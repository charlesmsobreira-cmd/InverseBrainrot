'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hourglass, WarningCircle, Clock, CalendarBlank, CaretDown, Trash } from '@phosphor-icons/react';
import { supabase } from '@/lib/supabase';
import { useStudyMode } from '@/context/StudyModeContext';

const MAX_SESSION_MINUTES = 180; // 3 Hours

// Lakers Colors
const LAKERS_PURPLE = '#552583';
const LAKERS_GOLD   = '#FDB927';

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
  }, []);

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
      {/* ── IMERSIVE FULL-SCREEN LAKERS OVERLAY ── */}
      <AnimatePresence>
        {isRunning && (
          <motion.div
            key="lakers-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 15 }}
          >
            {/* Purple blob — full width, covers both panels */}
            <motion.div
              animate={{ scale: [1, 1.12, 1], x: [0, 20, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-[30%] -left-[10%] w-[120vw] h-[100vh] rounded-full blur-[100px] will-change-transform"
              style={{ backgroundColor: `${LAKERS_PURPLE}30`, transform: 'translateZ(0)' }}
            />
            {/* Gold blob — bottom right */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], x: [0, -20, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              className="absolute -bottom-[30%] -right-[10%] w-[80vw] h-[80vh] rounded-full blur-[100px] will-change-transform"
              style={{ backgroundColor: `${LAKERS_GOLD}12`, transform: 'translateZ(0)' }}
            />
            <div className="absolute inset-0 bg-black/20" />

            {/* "FOCO ATIVO" badge — fixed, high z-index, truly centered */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.5 }}
              className="fixed top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-none"
              style={{ zIndex: 200 }}
            >
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: LAKERS_GOLD }}
              />
              <span
                className="text-[10px] font-black uppercase tracking-[0.5em] whitespace-nowrap"
                style={{ color: LAKERS_GOLD }}
              >
                Foco Ativo — Mamba Mode
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TIMER WIDGET ── */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4 pointer-events-none">

        {/* Logs Window */}
        <AnimatePresence>
          {showLogs && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="w-[440px] rounded-[3.5rem] p-10 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] mb-2 pointer-events-auto overflow-hidden border"
              style={{
                backgroundColor: isRunning ? '#1a0a2e' : 'rgba(13,13,13,0.8)',
                borderColor: isRunning ? `${LAKERS_PURPLE}60` : 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(64px)',
              }}
            >
              <div className="flex items-center gap-3 mb-10">
                <CalendarBlank
                  size={24}
                  style={{ color: isRunning ? LAKERS_GOLD : 'white' }}
                />
                <span
                  className="text-sm font-black uppercase tracking-[0.3em]"
                  style={{ color: isRunning ? LAKERS_GOLD : 'white' }}
                >
                  Sessões da Semana
                </span>
              </div>

              <div className="space-y-6 max-h-[380px] overflow-y-auto no-scrollbar pr-2">
                {logs.length === 0 ? (
                  <div
                    className="py-16 flex flex-col items-center gap-4 border-2 border-dashed rounded-[2.5rem]"
                    style={{ borderColor: isRunning ? `${LAKERS_PURPLE}40` : 'rgba(255,255,255,0.05)' }}
                  >
                    <Clock size={40} className="opacity-10" style={{ color: 'white' }} />
                    <p
                      className="text-[10px] font-black uppercase tracking-widest opacity-30 text-white"
                    >
                      Nenhuma sessão nesta semana
                    </p>
                  </div>
                ) : (
                  logs.map(log => (
                    <div key={log.id} className="flex items-center justify-between group p-1 transition-all">
                      <div className="flex flex-col gap-1.5">
                        <span
                          className="text-xs font-black uppercase tracking-tight text-white/90"
                        >
                          {formatDateLabel(log.created_at)}
                        </span>
                        <span
                          className="text-[10px] font-mono opacity-30 text-white italic"
                        >
                          {new Date(log.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div
                          className="px-6 py-3 rounded-2xl shadow-xl transition-transform group-hover:scale-105"
                          style={{
                            backgroundColor: isRunning ? LAKERS_PURPLE : 'rgba(255,255,255,0.03)',
                            border: isRunning ? 'none' : '1px solid rgba(255,255,255,0.1)',
                            boxShadow: isRunning ? `0 8px 32px ${LAKERS_PURPLE}60` : 'none',
                          }}
                        >
                          <span className="text-[13px] font-mono font-black text-white">
                            {formatTotalTime(log.duration_minutes)}
                          </span>
                        </div>
                        
                        {/* Delete Button - Subtle */}
                        <button
                          onClick={() => deleteLog(log.id)}
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white/10 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash size={18} />
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
                className="bg-red-500/90 backdrop-blur-xl text-white px-5 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 shadow-2xl border border-red-400/50"
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
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all border"
            style={{
              backgroundColor: isRunning 
                ? (showLogs ? LAKERS_PURPLE : 'rgba(85,37,131,0.2)') 
                : (showLogs ? 'white' : 'rgba(255,255,255,0.05)'),
              borderColor: isRunning ? `${LAKERS_PURPLE}80` : 'rgba(255,255,255,0.1)',
              color: isRunning 
                ? (showLogs ? 'white' : LAKERS_GOLD) 
                : (showLogs ? 'black' : 'white'),
              backdropFilter: 'blur(32px)',
              boxShadow: isRunning && showLogs ? `0 0 32px ${LAKERS_PURPLE}60` : 'none',
            }}
          >
            <CaretDown size={22} weight="bold" style={{ transform: showLogs ? 'none' : 'rotate(180deg)', transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }} />
          </motion.button>

          {/* Timer Display Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-2 rounded-full flex items-center gap-4 border"
            style={{
              backgroundColor: isRunning ? 'rgba(20, 5, 40, 0.85)' : 'rgba(13,13,13,0.8)',
              backdropFilter: 'blur(48px)',
              borderColor: isRunning ? `${LAKERS_PURPLE}80` : 'rgba(255,255,255,0.1)',
              boxShadow: isRunning
                ? `0 0 0 1px ${LAKERS_PURPLE}60, 0 12px 48px ${LAKERS_PURPLE}60`
                : '0 12px 40px rgba(0,0,0,0.4)',
            }}
          >
            <div className="flex items-center pl-5 pr-1 gap-6">
              <div className="flex flex-col">
                <span
                  className="text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1.5 opacity-40 text-white"
                  style={{ color: isRunning ? LAKERS_GOLD : 'white' }}
                >
                  {isRunning ? 'Mamba Mode' : 'Total Semanal'}
                </span>
                <span
                  className="text-lg font-black font-mono leading-none tracking-tighter text-white"
                  style={{ color: isRunning ? LAKERS_GOLD : 'white' }}
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
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-700 relative overflow-hidden group/btn"
                style={{
                  backgroundColor: isRunning ? LAKERS_PURPLE : 'white',
                  color: isRunning ? LAKERS_GOLD : 'black',
                  boxShadow: isRunning
                    ? `0 0 30px ${LAKERS_PURPLE}80, 0 0 60px ${LAKERS_PURPLE}40`
                    : '0 8px 32px rgba(255,255,255,0.2)',
                }}
              >
                {isSyncing ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <motion.div
                    animate={{ rotate: isRunning ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                  >
                    <Hourglass size={30} weight={isRunning ? 'fill' : 'bold'} />
                  </motion.div>
                )}

                {/* Pulsing glow when active */}
                {isRunning && (
                  <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.4, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{ backgroundColor: `${LAKERS_GOLD}40` }}
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

