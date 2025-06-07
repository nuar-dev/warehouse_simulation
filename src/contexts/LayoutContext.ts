// src/contexts/LayoutContext.ts

import { createContext, useContext } from 'react';

export type CellType = 'shelf' | 'road' | 'comm' | 'wall';

export interface Cell {
  type: CellType;
  label?: string;
}

export interface LayoutContextType {
  layout: Cell[][] | null;
  layoutName: string;
  openSelector: boolean;
  setLayout: (layout: Cell[][], name: string) => void;
  setLayoutName: (name: string) => void;
  setOpenSelector: (open: boolean) => void;
  loadDefaultLayout: () => void;
  loadLayoutFromFile: (file: File) => void;
  resetLayout: () => void;
}

export const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayoutContext = () => {
  const ctx = useContext(LayoutContext);
  if (!ctx) {
    throw new Error('useLayoutContext must be used within a LayoutProvider');
  }
  return ctx;
};
