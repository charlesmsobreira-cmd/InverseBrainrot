'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Coffee, CurrencyDollar, CalendarCheck, DotsNine } from '@phosphor-icons/react';
import { useState, useEffect, useRef } from 'react';

const navItems = [
  { id: 'overview',  icon: DotsNine,        label: 'Overview',  sectionId: null        },
  { id: 'rotina',    icon: CalendarCheck,    label: 'Rotina',    sectionId: 'rotina'    },
  { id: 'estudos',   icon: BookOpen,         label: 'Estudos',   sectionId: 'estudos'   },
  { id: 'financas',  icon: CurrencyDollar,   label: 'Finanças',  sectionId: 'financas'  },
  { id: 'consumo',   icon: Coffee,           label: 'Consumo',   sectionId: 'consumo'   },
];

export function Navigation() {
  const [active,  setActive]  = useState('overview');
  const [hovered, setHovered] = useState<string | null>(null);
  const isScrollingRef = useRef(false);

  // Auto-detect active section via IntersectionObserver (symmetric up/down)
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    navItems.forEach(item => {
      if (!item.sectionId) return;
      const el = document.getElementById(item.sectionId);
      if (!el) return;

      // rootMargin creates a horizontal "trigger line" at 40% from the top.
      // When a section crosses this line (in either direction), it becomes active.
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (isScrollingRef.current) return;
            if (entry.isIntersecting) {
              setActive(item.id);
            }
          });
        },
        {
          rootMargin: '-40% 0px -55% 0px',
          threshold: 0,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    const onScroll = () => {
      if (isScrollingRef.current) return;
      if (window.scrollY < 100) setActive('overview');
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observers.forEach(o => o.disconnect());
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleClick = (id: string, sectionId: string | null) => {
    // Lock observer for 1.2s so the active state doesn't get overridden during scroll
    isScrollingRef.current = true;
    setActive(id);
    setTimeout(() => { isScrollingRef.current = false; }, 1200);

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
