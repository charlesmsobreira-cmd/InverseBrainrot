'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, CurrencyDollar, TrendUp, ChartLineUp, Wallet, ArrowUpRight, 
  Quotes, Sparkle, Diamond, Crown, X, PencilSimple, Check, 
  MagnifyingGlass, Warning, ChartBar, Info, Receipt, PlusCircle, MinusCircle, 
  Layout, PresentationChart, ArrowRight
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
  const [limit, setLimit] = useState(5000.00);
  
  const [expenses, setExpenses] = useState<{id: string, label: string, value: number}[]>([
    { id: '1', label: 'Assinatura Adobe', value: 120.00 },
    { id: '2', label: 'Almoço Executivo', value: 65.00 },
    { id: '3', label: 'Host & Vercel', value: 45.00 },
  ]);
  const [expenseName, setExpenseName] = useState('');
  const [expenseValue, setExpenseValue] = useState('');

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

    const savedData = localStorage.getItem('finance_data_v3');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setPatrimonio(parsed.patrimonio || 14290.55);
      setLimit(parsed.limit || 5000.00);
      if (parsed.expenses) setExpenses(parsed.expenses);
    }

    return () => { document.body.style.backgroundColor = ''; };
  }, []);

  useEffect(() => {
    localStorage.setItem('finance_data_v3', JSON.stringify({ patrimonio, limit, expenses }));
  }, [patrimonio, limit, expenses]);

  const addExpense = () => {
    if (!expenseName || !expenseValue) return;
    const newExpense = {
      id: Math.random().toString(36).substr(2, 9),
      label: expenseName,
      value: parseFloat(expenseValue)
    };
    setExpenses([...expenses, newExpense]);
    setExpenseName('');
    setExpenseValue('');
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  // -- Calculations --
  const spent = expenses.reduce((acc, curr) => acc + curr.value, 0);
  const spentPercentage = Math.min((spent / (limit || 1)) * 100, 100);
  const remaining = Math.max(limit - spent, 0);

  return (
    <main className="min-h-screen bg-[#0B0B0C] text-white/90 p-6 md:p-12 lg:p-20 relative selection:bg-white selection:text-black">
      
      {/* Visual Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-1/2 left-0 w-[400px] h-[400px] bg-white/2 blur-[100px] rounded-full -translate-x-1/4 pointer-events-none" />

      {/* Navigation & Controls */}
      <div className="flex justify-between items-center mb-20 relative z-20">
        <Link href="/">
          <motion.button whileHover={{ x: -5 }} className="flex items-center gap-2 text-white/40 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-all">
            <ArrowLeft size={18} weight="bold" /> Voltar para o Sistema
          </motion.button>
        </Link>
      </div>

      {/* --- Atmospheric Quote Header --- */}
      <header className="flex flex-col items-center text-center mb-32 relative z-10 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} className="relative">
          <Quotes size={80} weight="fill" className="text-white/5 absolute -top-12 -left-12 rotate-[-10deg]" />
          <p className="text-2xl md:text-3xl font-light italic leading-relaxed text-white/80 mb-8 block relative z-10">
            &quot;{quote.text}&quot;
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-white/20" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 opacity-80">{quote.author}</span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-white/20" />
          </div>
        </motion.div>
      </header>

      <FullWidthDivider />

      {/* --- Royal Dashboard Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-[1400px] mx-auto relative z-10">
        
        {/* Row 1: Expense Catalog & Limit Tracking */}
        {/* Expense Catalog Card (Replaced Investment) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="md:col-span-8 bg-white/3 border border-white/10 rounded-[3rem] p-10 shadow-2xl relative backdrop-blur-md h-[480px] flex flex-col"
        >
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <Receipt size={24} className="text-white/40" />
              <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Controle de Gastos</h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block mb-1">Total Mensal</span>
              <span className="text-2xl font-mono font-bold text-white">
                {spent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
          </div>

          {/* Quick Add Form */}
          <div className="flex gap-4 mb-8">
            <input 
              placeholder="Nome" value={expenseName} onChange={e => setExpenseName(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-white/30 transition-all font-bold"
            />
            <input 
              type="number" placeholder="R$ 0,00" value={expenseValue} onChange={e => setExpenseValue(e.target.value)}
              className="w-32 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-white/30 transition-all font-mono font-bold"
            />
            <button 
              onClick={addExpense}
              className="p-4 bg-white text-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              <PlusCircle size={24} weight="fill" />
            </button>
          </div>

          {/* Scrolling Expense List */}
          <div className="flex-1 overflow-y-auto pr-4 space-y-3 custom-scrollbar">
            {expenses.map(exp => (
              <motion.div 
                layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                key={exp.id} 
                className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl group hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-white transition-colors" />
                  <span className="text-sm font-bold text-white/80">{exp.label}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-mono text-sm font-black text-white">
                    {exp.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                  <button onClick={() => removeExpense(exp.id)} className="opacity-0 group-hover:opacity-40 hover:opacity-100 text-white transition-all">
                    <X size={16} weight="bold" />
                  </button>
                </div>
              </motion.div>
            ))}
            {expenses.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-white/20">
                <Receipt size={48} weight="thin" className="mb-4" />
                <p className="text-xs uppercase font-black tracking-[0.3em]">Nenhum gasto catalogado</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Expense Control Card */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="md:col-span-4 bg-[#1A1A1B] border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between h-[480px]"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 block">Limite Mensal</span>
              </div>
              {isEditing ? (
                <input 
                  type="number" value={limit} onChange={e => setLimit(parseFloat(e.target.value))}
                  className="bg-white/5 border-b border-white text-3xl font-black text-white font-mono outline-none w-full" 
                />
              ) : (
                <div className="text-3xl font-black font-mono tracking-tighter text-white" onClick={() => setIsEditing(true)}>
                  {limit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
              )}
            </div>
            {isEditing && (
              <button 
                onClick={() => setIsEditing(false)}
                className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all"
              >
                <Check size={20} weight="bold" />
              </button>
            )}
          </div>

          <div className="space-y-8 mt-auto">
            <div className="flex justify-between items-end mb-4">
              <span className="text-[12px] font-black uppercase tracking-widest text-white/40">Consumo Atual</span>
              <span className="text-4xl font-black text-white leading-none">{spentPercentage.toFixed(0)}%</span>
            </div>
            
            {/* Full-width Horizontal Pill Bar Chart (B&W Style) */}
            <div className="w-full h-14 bg-white/5 rounded-full border border-white/10 overflow-hidden relative p-1.5 shadow-inner group">
              {/* Centered Label with Mix-Blend-Mode for high-end look */}
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <span className="text-sm font-black text-white mix-blend-difference tracking-tight">
                  {(spent/1000).toFixed(1)}K
                </span>
              </div>

              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${spentPercentage}%` }} 
                transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
                className="h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              />
            </div>

            <div className="flex justify-center items-center pt-6 border-t border-white/5">
              <span className="text-[12px] font-black uppercase tracking-[0.6em] text-white/80">
                {new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date())}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Row 2: Strategy Widgets & Summary (Padronizado) */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8 py-10 items-stretch">
          <StrategyCard 
            title="Análise Estática" 
            icon={<ChartBar size={36} />} 
            onClick={() => setActiveModal('statica')} 
            desc="Processamento de stress de mercado e volatilidade." 
          />
          
          <StrategyCard 
            title="Resumo Global" 
            icon={<PresentationChart size={36} />} 
            onClick={() => setActiveModal('resumo')} 
            accent 
            desc="Visão consolidada de performance e alocação de ativos." 
          />

          <StrategyCard 
            title="Alocação Alpha" 
            icon={<TrendUp size={36} />} 
            onClick={() => setActiveModal('alpha')} 
            desc="Sinais quantitativos de ativos subvalorizados." 
          />
        </div>

        {/* Row 3: Main Strategic Area (Engenharia) - Section Divider Style */}
        <FullWidthDivider />
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="md:col-span-12 w-full py-24 mt-10 relative overflow-hidden group"
        >
          
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-24 px-4 relative z-10">
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col mb-6">
                 <h2 className="text-5xl md:text-[8rem] font-black uppercase tracking-tighter text-white leading-none">Minha<br/>Carteira</h2>
              </div>
              <p className="text-xl text-white/30 leading-relaxed max-w-2xl mb-12 font-light">A alocação algorítmica de ativos premium para otimização de risco-retorno sistêmico em horizontes de longo prazo.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { label: "Equities", val: "45%", color: "#FFFFFF" },
                  { label: "Fixed Income", val: "30%", color: "#A5C4D4" },
                  { label: "Alternatives", val: "15%", color: "#84A59D" },
                  { label: "Liquidity", val: "10%", color: "#6B705C" }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{item.label}</span>
                      <span className="text-xs font-bold text-white">{item.val}</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: item.val }}
                        style={{ backgroundColor: item.color }}
                        className="h-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="w-[480px] h-[480px] relative flex items-center justify-center p-8 scale-110 lg:scale-125">
               {/* Large Analytical SVG Pie Chart (Clockwise Emerge Animation) */}
               <svg 
                 viewBox="0 0 100 100" 
                 className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]"
               >
                 <defs>
                   <mask id="revealMask">
                     <motion.circle 
                       initial={{ pathLength: 0 }}
                       whileInView={{ pathLength: 1 }}
                       transition={{ duration: 1.5, ease: "easeInOut" }}
                       cx="50" cy="50" r="40" fill="transparent" stroke="white" strokeWidth="16" 
                     />
                   </mask>
                 </defs>

                 {/* Static Background Ring */}
                 <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="15" />

                 {/* Revealed Segment Group */}
                 <g mask="url(#revealMask)">
                   {/* Slice 1: 45% */}
                   <circle 
                     cx="50" cy="50" r="40" fill="transparent" stroke="#FFFFFF" strokeWidth="15" strokeDasharray="113.1 251.3" 
                   />
                   {/* Slice 2: 30% */}
                   <circle 
                     cx="50" cy="50" r="40" fill="transparent" stroke="#A5C4D4" strokeWidth="15" strokeDasharray="75.4 251.3" strokeDashoffset="-113.1" 
                   />
                   {/* Slice 3: 15% */}
                   <circle 
                     cx="50" cy="50" r="40" fill="transparent" stroke="#84A59D" strokeWidth="15" strokeDasharray="37.7 251.3" strokeDashoffset="-188.5" 
                   />
                   {/* Slice 4: 10% */}
                   <circle 
                     cx="50" cy="50" r="40" fill="transparent" stroke="#6B705C" strokeWidth="15" strokeDasharray="25.1 251.3" strokeDashoffset="-226.2" 
                   />
                 </g>
               </svg>
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="flex flex-col items-center">
                   <span className="text-xs font-black uppercase tracking-[0.4em] text-white/20 mb-2">Portfolio</span>
                   <div className="text-center">
                     <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 block">Alpha</span>
                     <span className="text-6xl font-black text-white leading-none">4.0</span>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </motion.div>

        {/* Row 4: Final Investment Evolution (Purely Visual) */}
        <FullWidthDivider />
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="md:col-span-12 w-full py-20 flex flex-col"
        >
          <div className="flex flex-col items-center mb-12">
            <div className="flex items-center gap-2 opacity-40 mb-3">
              <Diamond size={16} weight="fill" />
              <span className="text-[11px] font-black uppercase tracking-[0.4em]">Evolução Patrimonial</span>
            </div>
            {isEditing ? (
              <input 
                type="number" step="0.01" value={patrimonio} onChange={e => setPatrimonio(parseFloat(e.target.value))}
                className="bg-white/5 border-b border-white text-6xl font-black text-white font-mono outline-none text-center max-w-xl" 
              />
            ) : (
              <h3 className="text-6xl font-black text-white font-mono tracking-tighter" onClick={() => setIsEditing(true)}>
                {patrimonio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h3>
            )}
          </div>

          <div className="h-64 w-full flex items-end relative overflow-visible opacity-50 brightness-150">
            <svg viewBox="0 0 1400 200" className="w-full h-full overflow-visible">
              <motion.path
                d="M0,180 C200,160 300,190 500,140 C700,90 800,110 1000,70 C1200,30 1300,50 1400,10"
                fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 3, ease: "easeInOut" }}
              />
              <motion.circle 
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 2.5 }}
                cx="1400" cy="10" r="6" fill="white" 
              />
            </svg>
          </div>
        </motion.div>

        {/* Row 5: Decorative Divider */}
        <FullWidthDivider />
        <div className="md:col-span-12 py-10 flex flex-col items-center gap-8">
           <div className="h-px w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
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
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2 block">Performance Anual (2026)</span>
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
                         className={`w-full rounded-t-xl transition-all ${i === 2 ? 'bg-white' : 'bg-white/10 hover:bg-white/20'}`}
                       />
                       <span className="text-[10px] font-black uppercase text-white/20">{mes}</span>
                    </div>
                  ))}
               </div>

               <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/5 blur-[120px] rounded-full pointer-events-none" />
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
                        <div key={sig.asset} className="flex justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-white/30 transition-all">
                           <div><span className="text-xl font-bold text-white">{sig.asset}</span><span className="text-[10px] block opacity-40 uppercase tracking-widest">{sig.type}</span></div>
                           <div className="text-right"><div className="text-emerald-400 font-black">{sig.potential}</div><div className="text-[10px] opacity-40 uppercase font-black">Risco {sig.risk}</div></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl"><Warning size={48} className="text-white mx-auto mb-4 opacity-50" /><p className="text-sm font-bold uppercase tracking-[0.3em] text-white/40">Geração de Dados...</p></div>
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
        /* Custom scrollbar for long lists */
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        /* Hide number input spinners */
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </main>
  );
}

function FullWidthDivider() {
  return (
    <div className="md:col-span-12 w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[1px] bg-white/10 my-16" />
  );
}

function StrategyCard({ title, icon, desc, onClick, accent }: any) {
  return (
    <motion.div 
      onClick={onClick}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }} // Fast, responsive transition
      className={`p-10 rounded-[2.5rem] border cursor-pointer group relative overflow-hidden flex flex-col justify-between min-h-[320px] ${
        accent ? 'border-white bg-white text-black' : 'bg-[#1A1A1B] border-white/5 hover:bg-[#232324]'
      }`}
    >
      <div>
        <div className={`${accent ? 'text-black' : 'text-white/40 group-hover:text-white'} mb-8 transition-colors duration-200`}>
          {icon}
        </div>
        <h4 className={`font-black uppercase tracking-tighter text-3xl mb-3 ${accent ? 'text-black' : 'text-white/90'}`}>{title}</h4>
        <p className={`text-[12px] leading-relaxed font-medium ${accent ? 'text-black/60' : 'text-white/30'}`}>{desc}</p>
      </div>
      
      {!accent && (
        <div className="mt-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Visualizar Detalhes</span>
           <ArrowRight size={14} className="text-white/40" />
        </div>
      )}
    </motion.div>
  );
}
