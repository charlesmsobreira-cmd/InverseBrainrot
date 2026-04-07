'use client';

import React, { createContext, useContext, useState } from 'react';

type StudyModeContextType = {
  isImmersive: boolean;
  setIsImmersive: (value: boolean) => void;
};

const StudyModeContext = createContext<StudyModeContextType | undefined>(undefined);

export function StudyModeProvider({ children }: { children: React.ReactNode }) {
  const [isImmersive, setIsImmersive] = useState(false);

  return (
    <StudyModeContext.Provider value={{ isImmersive, setIsImmersive }}>
      {children}
    </StudyModeContext.Provider>
  );
}

export function useStudyMode() {
  const context = useContext(StudyModeContext);
  if (context === undefined) {
    throw new Error('useStudyMode must be used within a StudyModeProvider');
  }
  return context;
}
