import { Hero } from "@/components/Hero";
import { SectionsLayout } from "@/components/SectionsLayout";
import { Navigation } from "@/components/Navigation";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen relative w-full selection:bg-titanium-700 selection:text-white">
      <Hero />
      <SectionsLayout />
      <Navigation />
    </main>
  );
}
