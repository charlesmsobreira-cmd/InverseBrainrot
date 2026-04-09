'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, PlusCircle, Trash, Wallet, ChartPieSlice, CurrencyCircleDollar, TrendUp, Vault, Plus } from '@phosphor-icons/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Asset {
  id: string;
  label: string;
  value: number;
  category: 'Equities' | 'Fixed Income' | 'Alternatives' | 'Liquidity';
}

const CATEGORIES = [
  { id: 'Equities', label: 'Ações / Variável', icon: <TrendUp size={16} />, color: "#00D1FF" },
  { id: 'Fixed Income', label: 'Renda Fixa', icon: <Vault size={16} />, color: "#8B5CF6" },
  { id: 'Alternatives', label: 'Cripto / Diversos', icon: <CurrencyCircleDollar size={16} />, color: "#F59E0B" },
  { id: 'Liquidity', label: 'Liquidez / Reserva', icon: <Wallet size={16} />, color: "#10B981" },
];

export default function PortfolioPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetName, setAssetName] = useState('');
  const [assetValue, setAssetValue] = useState('');
  const [assetCategory, setAssetCategory] = useState<Asset['category']>('Equities');
  const [isAdding, setIsAdding] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('finance_portfolio');
    if (saved) {
      setAssets(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('finance_portfolio', JSON.stringify(assets));
    }
  }, [assets, isLoaded]);

  const addAsset = () => {
    if (!assetName || !assetValue) return;
    const newItem: Asset = {
      id: Math.random().toString(36).substr(2, 9),
      label: assetName,
      value: parseFloat(assetValue),
      category: assetCategory
    };
    setAssets([newItem, ...assets]);
    setAssetName('');
    setAssetValue('');
    setIsAdding(false); // Close after adding
  };

  const removeAsset = (id: string) => {
    setAssets(assets.filter(a => a.id !== id));
  };

  const totalValue = assets.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <main className="min-h-screen bg-[#0B0B0C] text-white/90 p-6 md:p-12 lg:p-24 selection:bg-white selection:text-black">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-8 mb-24">
          <Link href="/financas">
            <motion.button 
              whileHover={{ x: -5 }}
              className="flex items-center gap-2 text-white/40 hover:text-white font-black uppercase tracking-widest text-[10px] mb-4 transition-all"
            >
              <ArrowLeft size={18} weight="bold" /> Voltar para Finanças
            </motion.button>
          </Link>
          <div className="flex flex-col items-center gap-4">
             <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-black shadow-2xl">
               <ChartPieSlice size={32} weight="fill" />
             </div>
             <h1 className="text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none italic">
               Carteira
             </h1>
             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
               Alocação & Patrimônio
             </p>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] flex flex-col justify-center">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">Total Investido</span>
            <span className="text-5xl font-black font-mono text-white tracking-tighter">
              {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] flex flex-col justify-center">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">Ativos Sob Custódia</span>
             <span className="text-5xl font-black font-mono text-white tracking-tighter">
               {assets.length}
             </span>
          </div>
        </div>

        {/* Add Asset Form */}
        <section className="mb-24">
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="w-full flex items-center justify-between group"
          >
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-white transition-all flex items-center gap-3">
               <Plus size={14} weight="bold" className={`transition-transform duration-500 ${isAdding ? 'rotate-45' : ''}`} /> Adicionar Ativo
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/10 group-hover:text-white/40 transition-all">
              {isAdding ? 'cancelar' : 'expandir'}
            </span>
          </button>
          
          <AnimatePresence>
            {isAdding && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-6 bg-white/3 p-8 border border-white/5 rounded-[3rem] mt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" placeholder="Nome do Ativo (ex: AAPL, BTC, CDB)" 
                      value={assetName} onChange={e => setAssetName(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-bold outline-none focus:bg-white/10 transition-all"
                    />
                    <input 
                      type="number" placeholder="Valor R$ 0,00" 
                      value={assetValue} onChange={e => setAssetValue(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-mono font-bold outline-none focus:bg-white/10 transition-all"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setAssetCategory(cat.id as Asset['category'])}
                        style={{ 
                          borderColor: assetCategory === cat.id ? cat.color : 'rgba(255,255,255,0.05)',
                          backgroundColor: assetCategory === cat.id ? `${cat.color}20` : 'rgba(255,255,255,0.05)',
                          color: assetCategory === cat.id ? cat.color : 'rgba(255,255,255,0.4)'
                        }}
                        className="flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border outline-none"
                      >
                        {cat.icon} {cat.label}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={addAsset}
                    className="w-full py-6 bg-white text-black rounded-2xl font-black uppercase tracking-[0.4em] text-[11px] hover:bg-zinc-200 transition-all shadow-xl shadow-white/5"
                  >
                    Registrar Ativo
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Asset List */}
        <section className="space-y-6">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/20 mb-8">Posições Atuais</h2>
          <AnimatePresence mode="popLayout">
            {assets.map(asset => {
              const catInfo = CATEGORIES.find(c => c.id === asset.category);
              return (
                <motion.div
                  layout
                  key={asset.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center justify-between p-8 bg-white/3 border border-white/5 rounded-[2rem] hover:border-white/20 transition-all group"
                >
                  <div className="flex items-center gap-6">
                    <div 
                      style={{ backgroundColor: `${catInfo?.color}15`, color: catInfo?.color }}
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    >
                      {catInfo?.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-black uppercase tracking-tight text-white">{asset.label}</h4>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{asset.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className="text-2xl font-black font-mono text-white">
                      {asset.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                    <button 
                      onClick={() => removeAsset(asset.id)}
                      className="opacity-0 group-hover:opacity-100 w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {assets.length === 0 && (
            <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[4rem]">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10 italic">Nenhum ativo sob custódia</p>
            </div>
          )}
        </section>

      </div>

      <style jsx global>{`
        /* Hide number input spinners */
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
        /* Custom scrollbar for consistency */
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
      `}</style>
    </main>
  );
}
