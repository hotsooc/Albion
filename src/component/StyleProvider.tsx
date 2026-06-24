'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type StyleMode = 'brutal' | 'glass';

interface StyleContextType {
  style: StyleMode;
  setStyle: (style: StyleMode) => void;
  toggleStyle: () => void;
}

const StyleContext = createContext<StyleContextType | undefined>(undefined);

export function StyleProvider({ children }: { children: React.ReactNode }) {
  const [style, setStyleState] = useState<StyleMode>('brutal');

  useEffect(() => {
    // Read from localStorage on mount
    const savedStyle = localStorage.getItem('ui-style') as StyleMode;
    if (savedStyle && (savedStyle === 'brutal' || savedStyle === 'glass')) {
      setStyleState(savedStyle);
      document.documentElement.setAttribute('data-style', savedStyle);
    } else {
      document.documentElement.setAttribute('data-style', 'brutal');
    }
  }, []);

  const setStyle = (newStyle: StyleMode) => {
    setStyleState(newStyle);
    localStorage.setItem('ui-style', newStyle);
    document.documentElement.setAttribute('data-style', newStyle);
  };

  const toggleStyle = () => {
    setStyle(style === 'brutal' ? 'glass' : 'brutal');
  };

  return (
    <StyleContext.Provider value={{ style, setStyle, toggleStyle }}>
      {children}
    </StyleContext.Provider>
  );
}

export function useStyle() {
  const context = useContext(StyleContext);
  if (context === undefined) {
    throw new Error('useStyle must be used within a StyleProvider');
  }
  return context;
}
