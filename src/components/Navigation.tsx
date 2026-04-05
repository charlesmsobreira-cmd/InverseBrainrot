'use client';

import { motion } from 'framer-motion';
import { BookOpen, Coffee, CurrencyDollar, CalendarCheck, DotsNine } from '@phosphor-icons/react';
import { useState } from 'react';
import Link from 'next/link';

const navItems = [
  { id: 'overview', icon: DotsNine, label: 'Overview', href: '#' },
  { id: 'estudos', icon: BookOpen, label: 'Estudos', href: '#estudos' },
  { id: 'consumo', icon: Coffee, label: 'Consumo', href: '#consumo' },
  { id: 'financas', icon: CurrencyDollar, label: 'Finanças', href: '#financas' },
  { id: 'rotina', icon: CalendarCheck, label: 'Rotina', href: '#rotina' },
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
            <Link key={item.id} href={item.href}>
              <motion.button
                onClick={() => setActive(item.id)}
                className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-300 ${
                  isActive ? 'text-azure-500' : 'text-titanium-400 hover:text-azure-500 hover:bg-black/5'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-azure-500/10 rounded-full border border-azure-500/20 shadow-[0_4px_12px_rgba(0,113,227,0.08)]"
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  />
                )}
                <Icon size={24} weight={isActive ? 'fill' : 'regular'} className="relative z-10" />
              </motion.button>
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
}
