'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CurrencyDollar, TrendUp, ChartLineUp, Wallet, ArrowUpRight, Quotes, Sparkle, Diamond, Crown } from '@phosphor-icons/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// --- Quotes Database ---
const financeQuotes = [
  { text: "O risco vem de não saber o que você está fazendo.", author: "Warren Buffett" },
  { text: "O mercado é um mecanismo que transfere dinheiro dos impacientes para os pacientes.", author: "Warren Buffett" },
  { text: "Invista em si mesmo. É o melhor investimento que você pode fazer.", author: "José Kobori" },
  { text: "Preço é o que você paga. Valor é o que você recebe.", author: "Warren Buffett" },
  { text: "Não procure a agulha no palheiro. Apenas compre o palheiro.", author: "John Bogle" },
  { text: "O investimento em conhecimento paga os melhores juros.", author: "Benjamin Franklin" },
  { text: "A paciência é um elemento fundamental do sucesso financeiro.", author: "José Kobori" }
];

export default function FinancePage() {
  const [quote, setQuote] = useState(financeQuotes[0]);

  useEffect(() => {
    // Daily rotate logic
    const now = new Date();
    const seed = now.getFullYear() + now.getMonth() + now.getDate();
    const index = seed % financeQuotes.length;
    setQuote(financeQuotes[index]);
  }, []);

  return (
    <main className="min-h-screen bg-[#0B0B0C] text-white/90 p-6 md:p-12 lg:p-20 overflow-x-hidden relative selection:bg-[#D4AF37] selection:text-black">
      
      {/* Royal Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/2 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      {/* Navigation */}
      <Link href="/">
        <motion.button 
          whileHover={{ x: -5 }}
          className="flex items-center gap-2 text-[#D4AF37] font-bold uppercase tracking-widest text-[10px] mb-20 relative z-20 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft size={18} weight="bold" /> Voltar para o Sistema
        </motion.button>
      </Link>

      {/* --- Atmospheric Quote Header --- */}
      <header className="flex flex-col items-center text-center mb-32 relative z-10 max-w-4xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1 }}
           className="relative"
        >
          <Quotes size={80} weight="fill" className="text-[#D4AF37]/10 absolute -top-12 -left-12 rotate-[-10deg]" />
          
          <p className="text-2xl md:text-4xl font-light italic leading-relaxed text-white/80 mb-8 block relative z-10">
            &quot;{quote.text}&quot;
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]/40" />
            <span className="text-xs font-black uppercase tracking-[0.5em] text-[#D4AF37]">{quote.author}</span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]/40" />
          </div>
        </motion.div>
      </header>

      {/* --- Royal Dashboard Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-[1400px] mx-auto relative z-10 pb-32">
        
        {/* Main Growth Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="md:col-span-8 bg-white/3 border border-white/10 rounded-[3rem] p-10 shadow-2xl overflow-hidden relative backdrop-blur-md"
        >
          <div className="flex justify-between items-start mb-12">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Diamond size={12} weight="fill" className="text-[#D4AF37]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block">Crescimento Patrimonial</span>
              </div>
              <h3 className="text-4xl font-black text-white font-mono tracking-tighter">R$ 14.290,55</h3>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
              <TrendUp size={16} weight="bold" /> +12.4%
            </div>
          </div>

          {/* SVG Animated Component */}
          <div className="h-72 w-full mt-4 flex items-end">
            <svg viewBox="0 0 800 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path
                d="M0,180 C100,160 150,190 250,140 C350,90 400,120 500,80 C600,40 650,60 800,20"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 2.5, ease: [0.43, 0.13, 0.23, 0.96] }}
              />
              <motion.path
                d="M0,180 C100,160 150,190 250,140 C350,90 400,120 500,80 C600,40 650,60 800,20 L800,200 L0,200 Z"
                fill="url(#goldGradient)"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1.5 }}
              />
              {/* Pulsing Target Point */}
              <motion.circle cx="800" cy="20" r="10" fill="#D4AF37" initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 2.5 }} />
              <motion.circle cx="800" cy="20" r="20" fill="#D4AF37" opacity="0.1" initial={{ scale: 0 }} animate={{ scale: [1, 2, 1] }} transition={{ repeat: Infinity, duration: 3 }} />
            </svg>
          </div>
        </motion.div>

        {/* Status Section */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="md:col-span-4 flex flex-col gap-8"
        >
          {/* Liquidity Card */}
          <div className="bg-[#1A1A1B] border border-white/10 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="flex items-center gap-2 mb-3">
               <Wallet size={16} className="text-[#D4AF37]" weight="bold" />
               <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 block">Liquidez Real</span>
            </div>
            <div className="text-5xl font-black font-mono tracking-tighter text-[#D4AF37] mb-6">R$ 2.450,00</div>
            <div className="flex items-center gap-2 text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] bg-white/5 py-2 px-4 rounded-full w-max">
              <Sparkle weight="fill" size={14} className="text-[#D4AF37]" /> Alocação Pura
            </div>
          </div>

          {/* Asset Allocation Card */}
          <div className="bg-white/3 border border-white/10 p-8 rounded-[3rem] shadow-xl flex-1 flex flex-col justify-between backdrop-blur-sm">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-8 block">Engenharia de Carteira</span>
              <div className="flex items-center justify-center p-4 relative">
                 {/* Gold Donut Chart */}
                 <div className="w-40 h-40 rounded-full border-[12px] border-white/5 border-t-[#D4AF37] border-r-[#D4AF37]/60 transform rotate-[110deg] relative">
                   <div className="absolute inset-0 flex flex-col items-center justify-center rotate-[-110deg]">
                     <span className="text-3xl font-black text-white leading-none">85<span className="text-sm opacity-40">%</span></span>
                     <span className="text-[8px] font-bold uppercase tracking-widest text-[#D4AF37] mt-1">Eficiência</span>
                   </div>
                 </div>
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em]">
                <span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" /> Ativos Reais</span>
                <span className="text-white">65%</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
                <span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]/50" /> Fundos</span>
                <span className="text-white">20%</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
                <span className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-white/20" /> Reservas</span>
                <span className="text-white">15%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Strategy Insights (Regal Footer) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="bg-white/3 hover:bg-white/5 border border-white/5 p-10 rounded-[2.5rem] transition-all transform hover:-translate-y-2 cursor-pointer group">
            <ChartLineUp size={36} className="text-[#D4AF37]/40 group-hover:text-[#D4AF37] transition-colors mb-8" weight="bold" />
            <h4 className="font-black uppercase tracking-tighter text-2xl text-white/90 mb-3">Análise Estática</h4>
            <p className="text-sm text-white/40 leading-relaxed font-medium">Volatilidade absoluta controlada com teto de risco institucional.</p>
          </div>

          <div className="bg-white/3 hover:bg-white/5 border border-white/5 p-10 rounded-[2.5rem] transition-all transform hover:-translate-y-2 cursor-pointer group">
            <ArrowUpRight size={36} className="text-[#D4AF37]/40 group-hover:text-[#D4AF37] transition-colors mb-8" weight="bold" />
            <h4 className="font-black uppercase tracking-tighter text-2xl text-white/90 mb-3">Retorno Real</h4>
            <p className="text-sm text-white/40 leading-relaxed font-medium">Projeção matemática de rentabilidade acima da inflação anual.</p>
          </div>

          <div className="relative p-10 rounded-[2.5rem] overflow-hidden group cursor-pointer transition-all transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F]" />
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
            <div className="relative z-10">
              <TrendUp size={36} weight="bold" className="text-black mb-8" />
              <h4 className="font-black uppercase tracking-tighter text-2xl text-black mb-3">Alocação Alpha</h4>
              <p className="text-sm text-black/70 leading-relaxed font-bold">Oportunidade de expansão identificada em setores estratégicos.</p>
            </div>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
