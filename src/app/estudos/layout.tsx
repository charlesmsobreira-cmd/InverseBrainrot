'use client';

import StudyTimer from '@/components/StudyTimer';
import { StudyModeProvider, useStudyMode } from '@/context/StudyModeContext';

function StudyLayoutContent({ children }: { children: React.ReactNode }) {
  const { isImmersive } = useStudyMode();

  return (
    <div className={`min-h-screen transition-colors duration-1000 ease-in-out ${
      isImmersive ? 'bg-[#0D0D0E] text-[#F5F5F7]' : 'bg-[#F5F5F7] text-[#1D1D1F]'
    }`}>
      <StudyTimer />
      {children}
    </div>
  );
}

export default function StudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudyModeProvider>
      <StudyLayoutContent>
        {children}
      </StudyLayoutContent>
    </StudyModeProvider>
  );
}
