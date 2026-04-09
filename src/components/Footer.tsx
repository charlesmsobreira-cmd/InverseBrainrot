'use client';

import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="w-full bg-black py-32 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Premium Minimalist Divider */}
      <div className="w-12 h-px bg-white/5 mb-16" />
      
      {/* Footer is now clean and empty of the signature, maintaining only the technical label below */}

      <div className="mt-24 opacity-[0.03]">
        <span className="font-mono text-[7px] uppercase tracking-[1.5em] text-white">System Architecture • 2026</span>
      </div>
    </footer>
  );
}
