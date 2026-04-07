'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

export function Hero() {
  const { scrollY } = useScroll();
  const yParallax    = useTransform(scrollY, [0, 600], [0, 180]);
  const opacityAngel = useTransform(scrollY, [0, 450], [1, 0.2]);

  return (
    <>
      {/* ─── Screen 1: APENAS o anjo ─────────────────────────────── */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">

        {/* Blobs de fundo */}
        <div className="absolute inset-0 z-0 pointer-events-none">
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
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
        </div>

        {/* Anjo com parallax */}
        <motion.div style={{ y: yParallax, opacity: opacityAngel }} className="relative z-10">
          <motion.img
            initial={{ y: -120, opacity: 0, rotate: -2 }}
            animate={{ y: 0, opacity: 1, rotate: 2 }}
            transition={{
              y:       { duration: 2,  ease: 'easeOut' },
              opacity: { duration: 2 },
              rotate:  { duration: 5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }
            }}
            src="/icarus.png"
            alt="Charles Brain OS"
            className="w-56 md:w-80 lg:w-[440px] object-contain mix-blend-multiply opacity-95 drop-shadow-xl"
          />
        </motion.div>

        {/* Dica de scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[1px] h-10 bg-black/30"
          />
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-black/30">scroll</span>
        </motion.div>
      </section>

      {/* ─── Screen 2: Título + CTA ───────────────────────────────── */}
      <section className="relative w-full min-h-screen flex items-center justify-center px-6 py-32 overflow-hidden">
        <div className="max-w-4xl w-full flex flex-col items-center text-center gap-8 relative z-10">

          <motion.h1
            initial={{ opacity: 0, y: 70 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-9xl lg:text-[11rem] font-bold tracking-tighter leading-[0.85] text-transparent bg-clip-text bg-gradient-to-br from-titanium-100 via-titanium-100 to-azure-500 pb-4"
          >
            Charles <br />
            Brain OS.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-2xl md:text-3xl text-titanium-300 max-w-2xl font-light leading-relaxed"
          >
            Uma extensão mental.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-4"
          >
            <Link href="/inbox">
              <button className="px-10 py-5 bg-azure-500 text-white rounded-full font-bold tracking-widest uppercase hover:bg-azure-600 transition-all shadow-xl shadow-azure-500/20 hover:scale-105 active:scale-95">
                Iniciar Sistema
              </button>
            </Link>
          </motion.div>

        </div>
      </section>
    </>
  );
}
