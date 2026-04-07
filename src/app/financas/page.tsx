'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, CurrencyDollar, TrendUp, ChartLineUp, Wallet, ArrowUpRight, 
  Quotes, Sparkle, Diamond, Crown, X, PencilSimple, Check, 
  MagnifyingGlass, Warning, ChartBar, Info, Receipt, PlusCircle, MinusCircle, 
  Layout, PresentationChart
} from '@phosphor-icons/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// --- Quotes Database (Used for Header) ---
const financeQuotes = [
  { text: "O risco vem de não saber o que você está fazendo.", author: "Warren Buffett" },
  { text: "O mercado é um mecanismo que transfere dinheiro dos impacientes para os pacientes.", author: "Warren Buffett" },
  { text: "Invista em si mesmo. É o melhor investimento que você pode fazer.", author: "José Kobori" },
  { text: "Preço é o que você paga. Valor é o que você recebe.", author: "Warren Buffett" }
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
  const [spent, setSpent] = useState(3250.00);
  const [limit, setLimit] = useState(5000.00);
  
  // -- UI State --
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // -- Load Data --
  useEffect(() => {
    document.body.style.backgroundColor = '#0B0B0C';
    
    const now = new Date();
    const seed = now.getFullYear() + now.getMonth() + now.getDate();
    setQuote(financeQuotes[seed % financeQuotes.length]);

    const savedData = localStorage.getItem('finance_data_v2');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setPatrimonio(parsed.patrimonio);
      setSpent(parsed.spent || 3250.00);
      setLimit(parsed.limit || 5000.00);
    }

    return () => { document.body.style.backgroundColor = ''; };
  }, []);

  const saveFinanceData = () => {
    localStorage.setItem('finance_data_v2', JSON.stringify({ patrimonio, spent, limit }));
    setIsEditing(false);
  };

  // -- Calculations --
  const spentPercentage = Math.min((spent / (limit || 1)) * 100, 100);
  const remaining = Math.max(limit - spent, 0);

  return (
    <main className="min-h-screen bg-[#0B0B0C] text-white/90 p-6 md:p-12 lg:p-20 relative selection:bg-[#D4AF37] selection:text-black">
      
      {/* Royal Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-1/2 left-0 w-[400px] h-[400px] bg-white/2 blur-[100px] rounded-full -translate-x-1/4 pointer-events-none" />

      {/* Navigation & Controls */}
      <div className="flex justify-between items-center mb-20 relative z-20">
        <Link href="/">
          <motion.button whileHover={{ x: -5 }} className="flex items-center gap-2 text-[#D4AF37] font-bold uppercase tracking-widest text-[10px] hover:opacity-80 transition-opacity">
            <ArrowLeft size={18} weight="bold" /> Voltar para o Sistema
          </motion.button>
        </Link>
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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-[1400px] mx-auto relative z-10">
        
        {/* Row 1: Total Assets & Expense Control */}
        {/* Main Growth Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="md:col-span-8 bg-white/3 border border-white/10 rounded-[3rem] p-10 shadow-2xl relative backdrop-blur-md h-[400px] flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
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
              <MagnifyingGlass size={16} weight="bold" /> Gráfico Anual
            </button>
          </div>

          <div className="h-44 w-full flex items-end relative overflow-visible">
            <svg viewBox="0 0 800 150" className="w-full h-full overflow-visible">
              <motion.path
                d="M0,140 C100,120 150,145 250,100 C350,55 400,80 500,50 C600,20 650,35 800,10"
                fill="none" stroke="#D4AF37" strokeWidth="5" strokeLinecap="round"
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 2 }}
              />
              <motion.circle cx="800" cy="10" r="10" fill="#D4AF37" />
            </svg>
          </div>
        </motion.div>

        {/* Expense Control Card */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="md:col-span-4 bg-[#1A1A1B] border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between h-[400px]"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Receipt size={16} weight="fill" className="text-[#D4AF37]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 block">Limite de Gastos Mensal</span>
              </div>
              {isEditing ? (
                <input 
                  type="number" value={limit} onChange={e => setLimit(parseFloat(e.target.value))}
                  className="bg-white/5 border-b border-[#D4AF37] text-3xl font-black text-white font-mono outline-none w-full" 
                />
              ) : (
                <div className="text-3xl font-black font-mono tracking-tighter text-white">
                  {limit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
              )}
            </div>
            {isEditing && (
              <div className="flex gap-2">
                <button onClick={() => setSpent(prev => Math.max(prev - 100, 0))} className="text-white/20 hover:text-white"><MinusCircle size={20} /></button>
                <button onClick={() => setSpent(prev => prev + 100)} className="text-[#D4AF37] hover:scale-110 transition-transform"><PlusCircle size={20} /></button>
              </div>
            )}
          </div>

          <div className="space-y-8 mt-auto">
            <div className="flex justify-between items-end mb-4">
              <span className="text-[12px] font-black uppercase tracking-widest text-[#D4AF37]">Consumo Atual</span>
              <span className="text-4xl font-black font-mono text-[#D4AF37] leading-none">65%</span>
            </div>
            
            {/* Expanded Horizontal Pill Bar Chart */}
            <div className="flex items-center gap-6">
              <span className="text-[12px] font-black text-[#D4AF37] min-w-[50px] tracking-widest uppercase">
                {new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(new Date()).replace('.', '')}
              </span>
              <div className="flex-1 h-14 bg-white/5 rounded-full border border-white/10 overflow-hidden relative p-1.5 shadow-inner">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${spentPercentage}%` }} 
                  transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
                  className="h-full bg-gradient-to-r from-[#D4AF37]/80 to-[#D4AF37] rounded-full flex items-center justify-end px-5 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                >
                  <span className="text-sm font-black text-black tracking-tight drop-shadow-sm">{(spent/1000).toFixed(1)}K</span>
                </motion.div>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-white/20 pt-4 border-t border-white/5">
              <span>Teto: {limit.toLocaleString('pt-BR')}</span>
              <span>Gasto: {spent.toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </motion.div>

        {/* Row 2: Strategy Widgets */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
          <StrategyCard title="Análise Estática" icon={<ChartBar size={36} />} onClick={() => setActiveModal('statica')} desc="Processamento de stress de mercado." />
          <StrategyCard title="Retorno Real" icon={<ArrowUpRight size={36} />} onClick={() => setActiveModal('retorno')} desc="Cálculo matemático vs IPCA." />
          <StrategyCard title="Alocação Alpha" icon={<TrendUp size={36} />} onClick={() => setActiveModal('alpha')} accent desc="Sinais de ativos subvalorizados." />
        </div>

        {/* Row 3: Main Strategic Area (Engenharia) - Section Divider Style */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="md:col-span-12 w-full py-24 border-t border-white/10 mt-10 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-12 opacity-5 transform group-hover:scale-110 transition-transform duration-1000 grayscale">
            <PresentationChart size={240} weight="thin" />
          </div>
          
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 px-4">
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-6">
                 <Layout size={32} className="text-[#D4AF37]" strokeWidth={1} />
                 <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white">Engenharia de Carteira</h2>
              </div>
              <p className="text-xl text-white/30 leading-relaxed max-w-2xl mb-12 font-light">A alocação algorítmica de ativos premium para otimização de risco-retorno sistêmico em horizontes de longo prazo.</p>
              <div className="flex items-center gap-6 justify-center md:justify-start">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Módulo Ativo em Beta</span>
                 </div>
                 <div className="h-4 w-[1px] bg-white/10" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]/40">Próxima Atualização: Q3 2026</span>
              </div>
            </div>
            
            <div className="w-72 h-72 grayscale opacity-10 relative hidden lg:block">
               <div className="absolute inset-0 border-[2px] border-dashed border-white/20 rounded-full animate-spin-slow" />
               <div className="absolute inset-0 flex items-center justify-center">
                 <Crown size={64} className="text-[#D4AF37]/10" />
               </div>
            </div>
          </div>
        </motion.div>

        {/* Row 4: Summary Action */}
        <div className="md:col-span-12 py-20 flex flex-col items-center gap-8">
           <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
           <motion.button
             whileHover={{ scale: 1.05 }}
             className="px-20 py-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col items-center gap-4 group opacity-40 cursor-not-allowed"
           >
             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]">Relatório Global</span>
             <h3 className="text-3xl font-black uppercase tracking-tighter text-white transition-colors group-hover:text-[#D4AF37]">RESUMO</h3>
             <span className="text-[8px] font-bold uppercase tracking-widest text-white/20">Em breve</span>
           </motion.button>
        </div>

      </div>

      {/* --- Decision Modals & Expansion --- */}
      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsExpanded(false)} className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.05, opacity: 0 }} className="relative bg-[#1A1A1B] border border-white/10 rounded-[3rem] w-full max-w-5xl p-16 overflow-hidden shadow-2xl">
               <div className="flex justify-between items-start mb-16">
                 <div>
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-2 block">Performance Anual (2026)</span>
                 </div>
                 <button onClick={() => setIsExpanded(false)} className="p-4 text-white/20 hover:text-white bg-white/5 rounded-full"><X size={24} weight="bold" /></button>
               </div>

               {/* Yearly Column Chart */}
               <div className="h-80 w-full flex items-end justify-between gap-3 px-4">
                  {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((mes, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-4">
                       <motion.div 
                         initial={{ height: 0 }}
                         animate={{ height: `${20 + (i * 5) % 80}%` }}
                         transition={{ delay: i * 0.05, type: 'spring', damping: 15 }}
                         className={`w-full rounded-t-xl transition-all ${i === 2 ? 'bg-[#D4AF37]' : 'bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40'}`}
                       />
                       <span className="text-[10px] font-black uppercase text-white/20">{mes}</span>
                    </div>
                  ))}
               </div>

               <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />
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
                           <div><span className="text-xl font-bold text-[#D4AF37]">{sig.asset}</span><span className="text-[10px] block opacity-40 uppercase tracking-widest">{sig.type}</span></div>
                           <div className="text-right"><div className="text-emerald-400 font-black">{sig.potential}</div><div className="text-[10px] opacity-40 uppercase font-black">Risco {sig.risk}</div></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl"><Warning size={48} className="text-[#D4AF37] mx-auto mb-4 opacity-50" /><p className="text-sm font-bold uppercase tracking-[0.3em] text-white/40">Geração de Dados...</p></div>
                  )}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </main>
  );
}

function StrategyCard({ title, icon, desc, onClick, accent }: any) {
  return (
    <motion.div 
      onClick={onClick}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }} // Fast, responsive transition
      className={`p-10 rounded-[2.5rem] border cursor-pointer group relative overflow-hidden ${
        accent ? 'border-[#D4AF37] bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F]' : 'bg-[#1A1A1B] border-white/5 hover:bg-[#232324]'
      }`}
    >
      <div className={`${accent ? 'text-black' : 'text-[#D4AF37]/40 group-hover:text-[#D4AF37]'} mb-8 transition-colors duration-200`}>
        {icon}
      </div>
      <h4 className={`font-black uppercase tracking-tighter text-2xl mb-3 ${accent ? 'text-black' : 'text-white/90'}`}>{title}</h4>
      <p className={`text-[12px] leading-relaxed font-medium ${accent ? 'text-black/70' : 'text-white/30'}`}>{desc}</p>
    </motion.div>
  );
}
