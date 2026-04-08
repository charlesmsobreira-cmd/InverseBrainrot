'use client';

import StudyTimer from '@/components/StudyTimer';
import { StudyModeProvider } from '@/context/StudyModeContext';

function StudyLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen text-white"
      style={{ backgroundColor: '#080808' }}
    >
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
