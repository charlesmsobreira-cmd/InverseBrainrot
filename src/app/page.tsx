'use client';

import { Hero } from "@/components/Hero";
import { HighlightsCarousel } from "@/components/HighlightsCarousel";
import { SectionsLayout } from "@/components/SectionsLayout";
import { Navigation } from "@/components/Navigation";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen relative w-full selection:bg-azure-500 selection:text-white">
      <Hero />
      <HighlightsCarousel />
      <SectionsLayout />
      <Navigation />
    </main>
  );
}
