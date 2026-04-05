'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-start pt-20 px-4 md:px-0 overflow-hidden">
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-full z-0 pointer-events-none"
        style={{ 
          maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', 
          WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' 
        }}
      >
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-10%] left-[-5%] w-[60vw] h-[60vw] bg-azure-500/10 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], x: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-azure-400/10 rounded-full blur-[100px]"
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 relative z-10 flex flex-col items-center justify-center text-center pt-20">
        <div className="max-w-4xl w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-8 items-center"
          >
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-bold tracking-tighter leading-[0.8] text-transparent bg-clip-text bg-gradient-to-br from-titanium-100 via-titanium-100 to-azure-500 pb-4">
              Charles <br />
              Brain OS.
            </h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-2xl md:text-3xl text-titanium-300 max-w-2xl font-light leading-relaxed mt-4"
            >
              Uma extensão de titânio para a mente.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mt-8"
            >
              <Link href="/inbox">
                <button className="px-10 py-5 bg-azure-500 text-white rounded-full font-bold tracking-widest uppercase hover:bg-azure-600 transition-all shadow-xl shadow-azure-500/20 hover:scale-105 active:scale-95">
                  Iniciar Sistema
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
