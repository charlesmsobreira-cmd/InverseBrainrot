'use client';

import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="relative w-full min-h-[70vh] flex items-center justify-start pt-20 px-4 md:px-0">
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-full z-0 pointer-events-none"
        style={{ 
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)', 
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' 
        }}
      >
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-titanium-900 rounded-full blur-[120px] opacity-50 mix-blend-screen"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, -3, 1, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-[10%] right-[-10%] w-[50vw] h-[50vw] bg-white/5 rounded-full blur-[100px] mix-blend-screen"
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 pt-10 lg:pt-0">
        <div className="max-w-3xl flex-1 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6"
          >

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-titanium-500">
              Charles <br />
              Brain OS.
            </h1>
            <p className="text-xl md:text-2xl text-titanium-300 max-w-2xl font-light leading-relaxed mt-4">
              Uma extensão de titânio para a mente.
            </p>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="flex-1 w-full flex justify-center lg:justify-end relative z-0"
        >
          <div className="relative p-4 rounded-[2rem] glass-panel border-white/10 shadow-[0_0_50px_-12px_rgba(255,255,255,0.1)] group overflow-hidden">
            {/* Liquid effect highlight */}
            <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg] transition-all duration-1000 group-hover:left-[100%]" />
            
            <img 
              src="/hero.png" 
              alt="Arquitetura Mental"
              className="w-full max-w-sm lg:max-w-md object-contain opacity-90 mix-blend-screen relative z-10"
              style={{ 
                maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)', 
                WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' 
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
