'use client';

import { motion } from 'framer-motion';
import { BookOpen, Coffee, CurrencyDollar, CalendarCheck, DotsNine } from '@phosphor-icons/react';
import { useState } from 'react';

const navItems = [
  { id: 'overview', icon: DotsNine, label: 'Overview' },
  { id: 'estudos', icon: BookOpen, label: 'Estudos' },
  { id: 'consumo', icon: Coffee, label: 'Consumo' },
  { id: 'financas', icon: CurrencyDollar, label: 'Finanças' },
  { id: 'rotina', icon: CalendarCheck, label: 'Rotina' },
];

export function Navigation() {
  const [active, setActive] = useState('overview');

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <motion.nav 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="glass-panel rounded-full px-4 py-3 flex items-center gap-2 relative shadow-2xl"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-300 ${
                isActive ? 'text-white' : 'text-titanium-400 hover:text-white hover:bg-white/5'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 bg-white/10 rounded-full border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
              )}
              <Icon size={24} weight={isActive ? 'fill' : 'regular'} className="relative z-10" />
            </motion.button>
          );
        })}
      </motion.nav>
    </div>
  );
}
