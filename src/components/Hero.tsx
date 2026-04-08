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
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-white">

        {/* Blobs Removidos - Design Minimalista B&W */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none mix-blend-overlay" />
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
            className="w-56 md:w-80 lg:w-[440px] object-contain mix-blend-multiply opacity-90 grayscale"
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
            className="w-[1px] h-10 bg-black/10"
          />
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-black/20">scroll</span>
        </motion.div>
      </section>

      {/* ─── Screen 2: Título + CTA ───────────────────────────────── */}
      <section className="relative w-full min-h-screen flex items-center justify-center px-6 py-32 overflow-hidden bg-white">
        <div className="max-w-4xl w-full flex flex-col items-center text-center gap-8 relative z-10">

          <motion.h1
            initial={{ opacity: 0, y: 70 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-9xl lg:text-[11rem] font-bold tracking-tighter leading-[0.85] text-black pb-4"
          >
            Charles <br />
            Brain OS.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-2xl md:text-3xl text-black/40 max-w-2xl font-light leading-relaxed"
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
              <button className="px-10 py-5 bg-black text-white rounded-full font-bold tracking-widest uppercase hover:bg-gray-900 transition-all shadow-xl shadow-black/10 hover:scale-105 active:scale-95">
                Iniciar Sistema
              </button>
            </Link>
          </motion.div>

        </div>
      </section>
    </>
  );
}
