// src/contexts/LayoutContext.ts

import { createContext, useContext } from 'react';
import { ReactNode } from 'react';

// 🟢 Matches your backend storage types
export type CellType = 'high_rack' | 'pick_zone' | 'road' | 'comm';

export interface Cell {
  type: CellType;
  label?: string;
}

export interface LayoutContextType {
  /** The currently active grid (rows × columns) or null if none */
  layout: Cell[][] | null;
  /** Display name of the active layout */
  layoutName: string;

  /** Map of all loaded layouts, keyed by unique ID */
  layoutsMap: Record<string, Cell[][]>;
  /** User‐friendly names for each layout ID */
  namesMap: Record<string, string>;
  /** Currently active layout’s ID */
  activeId: string | null;

  /** Open/close state for the layout‐selector modal */
  openSelector: boolean;
  /** Has the user manually closed the layout‐selector dialog? */
  selectorClosed: boolean;

  /** Replace the active layout (adds it to the map and activates) */
  setLayout: (layout: Cell[][], name: string) => void;
  /** Rename the active layout */
  setLayoutName: (name: string) => void;
  /** Directly open/close the selector modal */
  setOpenSelector: (open: boolean) => void;
  /** Shortcut to `setOpenSelector(true)` */
  openSelectorDialog: () => void;
  /** Shortcut to `setOpenSelector(false)` */
  closeSelector: () => void;
  /** Mark that the user has closed the selector dialog */
  onSelectorClose: () => void;

  /** Load the Rust‐provided default layout */
  loadDefaultLayout: () => void;
  /** Load a layout from a JSON file */
  loadLayoutFromFile: (file: File) => void;
  /** Reset/clear all layouts */
  resetLayout: () => void;

  /** Switch the active tab to another layout ID */
  setActiveLayout: (id: string) => void;
  /** Remove a layout (by ID) from the map */
  removeLayout: (id: string) => void;

  /** Content to render inside the app‐wide footer (e.g. tabs, status) */
  footerContent: ReactNode | null;
  /** Register or clear the footer’s content */
  setFooterContent: (content: ReactNode | null) => void;
}

export const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayoutContext = () => {
  const ctx = useContext(LayoutContext);
  if (!ctx) {
    throw new Error('useLayoutContext must be used within a LayoutProvider');
  }
  return ctx;
};
