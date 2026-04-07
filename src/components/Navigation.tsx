'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Coffee, CurrencyDollar, CalendarCheck, DotsNine } from '@phosphor-icons/react';
import { useState } from 'react';

const navItems = [
  { id: 'overview',  icon: DotsNine,        label: 'Overview',  sectionId: null        },
  { id: 'estudos',   icon: BookOpen,         label: 'Estudos',   sectionId: 'estudos'   },
  { id: 'consumo',   icon: Coffee,           label: 'Consumo',   sectionId: 'consumo'   },
  { id: 'financas',  icon: CurrencyDollar,   label: 'Finanças',  sectionId: 'financas'  },
  { id: 'rotina',    icon: CalendarCheck,    label: 'Rotina',    sectionId: 'rotina'    },
];

export function Navigation() {
  const [active,  setActive]  = useState('overview');
  const [hovered, setHovered] = useState<string | null>(null);

  const handleClick = (id: string, sectionId: string | null) => {
    setActive(id);
    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <motion.nav
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="glass-panel rounded-full px-4 py-3 flex items-center gap-1 relative shadow-2xl"
      >
        {navItems.map((item) => {
          const Icon     = item.icon;
          const isActive = active  === item.id;
          const isHover  = hovered === item.id;

          return (
            <div key={item.id} className="relative flex flex-col items-center">

              {/* Tooltip label */}
              <AnimatePresence>
                {isHover && (
                  <motion.span
                    key="tooltip"
                    initial={{ opacity: 0, y: 4, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-black/80 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-widest rounded-lg whitespace-nowrap pointer-events-none"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Button */}
              <motion.button
                onClick={() => handleClick(item.id, item.sectionId)}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-200 ${
                  isActive
                    ? 'text-azure-500'
                    : 'text-titanium-400 hover:text-azure-500'
                }`}
                whileHover={{ scale: 1.22, y: -5 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
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
            </div>
          );
        })}
      </motion.nav>
    </div>
  );
}
