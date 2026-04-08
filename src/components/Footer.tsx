'use client';

import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="w-full bg-black py-32 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Premium Minimalist Divider */}
      <div className="w-12 h-px bg-white/5 mb-16" />
      
      <div className="relative overflow-visible">
        {/* The Signature Container */}
        <div className="relative">
          {/* Masking Layer that moves to reveal */}
          <motion.div
            initial={{ width: "100%" }}
            whileInView={{ width: "0%" }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 3.5, ease: [0.45, 0, 0.55, 1], delay: 0.2 }}
            className="absolute top-0 bottom-0 right-0 bg-black z-10"
          />

          {/* The Actual Text - Sophisticated Gray with Low Opacity */}
          <h3
            className="font-[family-name:var(--font-signature)] text-7xl md:text-9xl text-zinc-600/30 tracking-wider select-none px-4 text-center relative"
          >
            Charles
          </h3>
        </div>
      </div>

      <div className="mt-24 opacity-[0.03]">
        <span className="font-mono text-[7px] uppercase tracking-[1.5em] text-white">System Architecture • 2026</span>
      </div>
    </footer>
  );
}
