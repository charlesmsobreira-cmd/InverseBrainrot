'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, CurrencyDollar, TrendUp, ChartLineUp, Wallet, ArrowUpRight, 
  Quotes, Sparkle, Diamond, Crown, X, PencilSimple, Check, 
  MagnifyingGlass, Warning, ChartBar, Info
} from '@phosphor-icons/react';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

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

// --- Mock Strategy Data ---
const alphaSignals = [
  { asset: 'ITSA4', type: 'Foco em Dividendos', potential: '+8.5%', risk: 'Baixo' },
  { asset: 'BTC', type: 'Cripto Ativo', potential: '+25%', risk: 'Alto' },
  { asset: 'AMZN', type: 'Growth Tech', potential: '+12%', risk: 'Médio' },
];

export default function FinancePage() {
  const [quote, setQuote] = useState(financeQuotes[0]);
  
  // -- Finance State --
  const [patrimonio, setPatrimonio] = useState(14290.55);
  const [liquidez, setLiquidez] = useState(2450.00);
  const [custoMensal, setCustoMensal] = useState(800.00);
  
  // -- UI State --
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // -- Load Data (Simulated/Supabase) --
  useEffect(() => {
    // Force body background to avoid white stripe
    document.body.style.backgroundColor = '#0B0B0C';
    
    // Daily rotate logic
    const now = new Date();
    const seed = now.getFullYear() + now.getMonth() + now.getDate();
    const index = seed % financeQuotes.length;
    setQuote(financeQuotes[index]);

    // Local storage fallback for persistence until SQL is run
    const savedData = localStorage.getItem('finance_data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setPatrimonio(parsed.patrimonio);
      setLiquidez(parsed.liquidez);
      setCustoMensal(parsed.custoMensal || 800.00);
    }

    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const saveFinanceData = () => {
    localStorage.setItem('finance_data', JSON.stringify({ patrimonio, liquidez, custoMensal }));
    setIsEditing(false);
  };

  // -- Calculations --
  const reserveMonths = (liquidez / (custoMensal || 1)).toFixed(1);
  const healthPercentage = Math.min((parseFloat(reserveMonths) / 12) * 100, 100);

  return (
    <main className="min-h-screen bg-[#0B0B0C] text-white/90 p-6 md:p-12 lg:p-20 relative selection:bg-[#D4AF37] selection:text-black">
      
      {/* Royal Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/2 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      {/* Navigation & Controls */}
      <div className="flex justify-between items-center mb-20 relative z-20">
        <Link href="/">
          <motion.button whileHover={{ x: -5 }} className="flex items-center gap-2 text-[#D4AF37] font-bold uppercase tracking-widest text-[10px] hover:opacity-80 transition-opacity">
            <ArrowLeft size={18} weight="bold" /> Voltar para o Sistema
          </motion.button>
        </Link>
        
        <button 
          onClick={isEditing ? saveFinanceData : () => setIsEditing(true)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all ${
            isEditing ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-white/5 text-[#D4AF37] border-[#D4AF37]/30 hover:bg-white/10'
          }`}
        >
          {isEditing ? <><Check size={14} weight="bold" /> Salvar Carteira</> : <><PencilSimple size={14} weight="bold" /> Editar Dados</>}
        </button>
      </div>

      {/* --- Atmospheric Quote Header --- */}
      <header className="flex flex-col items-center text-center mb-32 relative z-10 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} className="relative">
          <Quotes size={80} weight="fill" className="text-[#D4AF37]/5 absolute -top-12 -left-12 rotate-[-10deg]" />
          <p className="text-2xl md:text-3xl font-light italic leading-relaxed text-white/80 mb-8 block relative z-10">
            &quot;{quote.text}&quot;
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]/40" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37] opacity-80">{quote.author}</span>
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
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block">Total em Investimentos</span>
              </div>
              {isEditing ? (
                <input 
                  type="number" step="0.01" value={patrimonio} onChange={e => setPatrimonio(parseFloat(e.target.value))}
                  className="bg-white/5 border-b border-[#D4AF37] text-4xl font-black text-white font-mono outline-none w-full max-w-sm mt-2" 
                />
              ) : (
                <h3 className="text-4xl font-black text-white font-mono tracking-tighter">
                  {patrimonio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </h3>
              )}
            </div>
            <button 
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#D4AF37]/20 transition-colors"
            >
              <MagnifyingGlass size={16} weight="bold" /> Detalhes
            </button>
          </div>

          <div className="h-64 flex items-end relative overflow-visible">
            <svg viewBox="0 0 800 200" className="w-full h-full overflow-visible">
              <motion.path
                d="M0,180 C100,160 150,190 250,140 C350,90 400,120 500,80 C600,40 650,60 800,20"
                fill="none" stroke="#D4AF37" strokeWidth="5" strokeLinecap="round"
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 2.5 }}
              />
              <motion.circle cx="800" cy="20" r="10" fill="#D4AF37" />
            </svg>
          </div>
        </motion.div>

        {/* Status Section */}
        <motion.div className="md:col-span-4 flex flex-col gap-8">
          {/* Liquidity Card (Emergency Fund Logic) */}
          <div className="bg-[#1A1A1B] border border-white/10 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="flex items-center gap-2 mb-3">
               <Wallet size={16} className="text-[#D4AF37]" weight="bold" />
               <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 block">Liquidez Imediata</span>
            </div>
            {isEditing ? (
              <input 
                type="number" value={liquidez} onChange={e => setLiquidez(parseFloat(e.target.value))}
                className="bg-white/5 border-b border-[#D4AF37] text-4xl font-black text-[#D4AF37] font-mono outline-none w-full mb-6" 
              />
            ) : (
              <div className="text-5xl font-black font-mono tracking-tighter text-[#D4AF37] mb-6">
                {liquidez.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            )}
            
            {/* Reserve Health Indicator */}
            <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
               <div className="flex justify-between items-end mb-3">
                 <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Saúde da Reserva</span>
                 <span className="text-xs font-bold text-[#D4AF37]">{reserveMonths} <span className="opacity-40 text-[10px]">Meses</span></span>
               </div>
               <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                 <motion.div initial={{ width: 0 }} animate={{ width: `${healthPercentage}%` }} className="h-full bg-gradient-to-r from-[#D4AF37]/50 to-[#D4AF37]" />
               </div>
               <p className="text-[8px] text-white/20 mt-3 uppercase tracking-tighter italic">Baseado em custo de R$ {custoMensal}/mês</p>
               {isEditing && (
                 <input 
                   type="number" placeholder="Custo Mensal" value={custoMensal} onChange={e => setCustoMensal(parseFloat(e.target.value))}
                   className="mt-2 bg-transparent text-[10px] text-white border-b border-white/20 w-full outline-none py-1"
                 />
               )}
            </div>
          </div>

          {/* Allocation Card (Static per request) */}
          <div className="bg-white/3 border border-white/10 p-8 rounded-[3rem] shadow-xl flex-1 flex flex-col justify-between backdrop-blur-sm opacity-60">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-8 block">Engenharia de Carteira (Beta)</span>
              <div className="flex items-center justify-center p-4 relative grayscale">
                 <div className="w-40 h-40 rounded-full border-[12px] border-white/5 border-t-[#D4AF37]/40 relative">
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-xl font-black text-white/50">🔒</span>
                   </div>
                 </div>
              </div>
            </div>
            <p className="text-[9px] text-center text-white/20 uppercase tracking-widest font-black">Planos Futuros</p>
          </div>
        </motion.div>

        {/* Strategy Insights (Dashboard Actions) */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <StrategyCard 
            title="Análise Estática" icon={<ChartBar size={36} />} 
            desc="Simulação de stress e volatilidade do mercado em tempo real." 
            onClick={() => setActiveModal('statica')}
          />
          <StrategyCard 
            title="Retorno Real" icon={<ArrowUpRight size={36} />} 
            desc="Benchmark avançado contra inflação e CDI acumulado." 
            onClick={() => setActiveModal('retorno')}
          />
          <StrategyCard 
            title="Alocação Alpha" icon={<TrendUp size={36} />} accent 
            desc="Identificação de ativos subvalorizados com sinais quantitativos." 
            onClick={() => setActiveModal('alpha')}
          />
        </div>
      </div>

      {/* --- Decision Modals & Expansion --- */}
      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsExpanded(false)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 1.1, opacity: 0, y: 20 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="relative bg-[#1A1A1B] border border-white/10 rounded-[3rem] w-full max-w-4xl p-12 overflow-hidden shadow-2xl">
               <div className="flex justify-between items-start mb-12">
                 <div>
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-2 block">Relatório de Performance</span>
                   <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Crescimento Patrimonial</h2>
                 </div>
                 <button onClick={() => setIsExpanded(false)} className="p-3 text-white/20 hover:text-white transition-colors bg-white/5 rounded-full"><X size={24} weight="bold" /></button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-8">Análise Mensal (2026)</h4>
                    <div className="space-y-4">
                      {[
                        { mes: 'Janeiro', valor: 'R$ 13.900,00', pct: '+2.4%' },
                        { mes: 'Fevereiro', valor: 'R$ 14.150,00', pct: '+1.8%' },
                        { mes: 'Março', valor: 'R$ 14.290,55', pct: '+1.0%' },
                      ].map((item) => (
                        <div key={item.mes} className="flex justify-between items-center p-5 bg-white/3 rounded-2xl border border-white/5">
                           <span className="text-sm font-medium text-white/60">{item.mes}</span>
                           <div className="text-right">
                             <div className="text-sm font-bold text-white">{item.valor}</div>
                             <div className="text-[10px] font-black text-emerald-400">{item.pct}</div>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/3 rounded-[2.5rem] p-8 border border-white/5 flex flex-col justify-center text-center">
                    <ChartLineUp size={48} className="text-[#D4AF37] mx-auto mb-6 opacity-30" />
                    <p className="text-lg font-medium text-white/80 leading-relaxed italic">&quot;O tempo é o melhor amigo dos negócios maravilhosos.&quot;</p>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mt-4">- Warren Buffett</span>
                  </div>
               </div>
            </motion.div>
          </div>
        )}

        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.05, opacity: 0 }} className="relative bg-[#1A1A1B] border border-white/10 rounded-[3rem] w-full max-w-2xl p-12 overflow-hidden shadow-2xl">
               <div className="flex justify-between items-start mb-12">
                 <h2 className="text-4xl font-black uppercase tracking-tighter text-white">
                   {activeModal === 'alpha' ? 'Radar de Alpha' : activeModal === 'statica' ? 'Stress Report' : 'Real Performance'}
                 </h2>
                 <button onClick={() => setActiveModal(null)} className="p-3 text-white/20 hover:text-white"><X size={24} weight="bold" /></button>
               </div>

               <div className="space-y-8">
                  {activeModal === 'alpha' ? (
                    <div className="space-y-4">
                      {alphaSignals.map(sig => (
                        <div key={sig.asset} className="flex justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-[#D4AF37]/30 transition-all">
                           <div>
                             <span className="text-xl font-bold text-[#D4AF37]">{sig.asset}</span>
                             <span className="text-[10px] block opacity-40 uppercase tracking-widest">{sig.type}</span>
                           </div>
                           <div className="text-right">
                             <div className="text-emerald-400 font-black">{sig.potential}</div>
                             <div className="text-[10px] opacity-40 uppercase font-black">Risco {sig.risk}</div>
                           </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl">
                       <Warning size={48} className="text-[#D4AF37] mx-auto mb-4 opacity-50" />
                       <p className="text-sm font-bold uppercase tracking-[0.3em] text-white/40">Relatórios em Geração...</p>
                    </div>
                  )}
               </div>
               
               <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#D4AF37]/5 blur-[60px] rounded-full pointer-events-none" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

function StrategyCard({ title, icon, desc, onClick, accent }: any) {
  return (
    <motion.div 
      onClick={onClick}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`p-10 rounded-[2.5rem] border cursor-pointer group transition-all relative overflow-hidden ${
        accent ? 'border-[#D4AF37] bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F]' : 'bg-white/3 border-white/5 hover:bg-white/5'
      }`}
    >
      <div className={`${accent ? 'text-black' : 'text-[#D4AF37]/40 group-hover:text-[#D4AF37]'} mb-8 transition-colors`}>
        {icon}
      </div>
      <h4 className={`font-black uppercase tracking-tighter text-2xl mb-3 ${accent ? 'text-black' : 'text-white/90'}`}>{title}</h4>
      <p className={`text-sm leading-relaxed font-medium ${accent ? 'text-black/70' : 'text-white/40'}`}>{desc}</p>
    </motion.div>
  );
}
