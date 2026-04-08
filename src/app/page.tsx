'use client';

import { useEffect } from 'react';
import { Hero } from "@/components/Hero";
import { HighlightsCarousel } from "@/components/HighlightsCarousel";
import { SectionsLayout } from "@/components/SectionsLayout";
import { Navigation } from "@/components/Navigation";

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0); // Força sempre voltar ao topo
    // Diz para o navegador não restaurar automaticamente a rolagem
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <main className="flex flex-col items-center justify-start min-h-screen relative w-full bg-white selection:bg-black selection:text-white">
      <Hero />
      <HighlightsCarousel />
      <SectionsLayout />
      <Navigation />
    </main>
  );
}
