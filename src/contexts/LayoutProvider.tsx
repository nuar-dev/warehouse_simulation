// src/contexts/LayoutProvider.tsx

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { LayoutContext, Cell, CellType } from './LayoutContext';
import { useNotificationContext } from './NotificationContext';
import { useSnackbar } from 'notistack';
import { loadDefaultLayoutFromTauri } from '@/utils/layoutLoader';
import { v4 as uuidv4 } from 'uuid';

const LOCAL_STORAGE_KEY   = 'warehouseLayouts';
const LOCAL_FILENAME_KEY  = 'warehouseLayoutNames';
const LOCAL_ACTIVE_ID_KEY = 'warehouseActiveLayoutId';

interface Props {
  children: React.ReactNode;
}

export default function LayoutProvider({ children }: Props) {
  // Multi‐layout state
  const [layoutsMap, setLayoutsMap] = useState<Record<string, Cell[][]>>({});
  const [namesMap, setNamesMap]     = useState<Record<string, string>>({});
  const [activeId, setActiveId]     = useState<string | null>(null);

  // Legacy single‐layout API state
  const [layout, setLayoutState]         = useState<Cell[][] | null>(null);
  const [layoutName, setLayoutNameState] = useState<string>('Warehouse (demo)');

  // Selector dialog visibility + manual-closure flag
  const [openSelector, setOpenSelector]    = useState<boolean>(false);
  const [selectorClosed, setSelectorClosed] = useState<boolean>(false);

  // App‐wide footer content
  const [footerContent, setFooterContent] = useState<ReactNode | null>(null);

  const { addNotification, removeNotificationByMessage } = useNotificationContext();
  const { enqueueSnackbar } = useSnackbar();
  const notifiedRef = useRef(false);

  // Restore or load default on mount
  useEffect(() => {
    try {
      const sl = localStorage.getItem(LOCAL_STORAGE_KEY);
      const sn = localStorage.getItem(LOCAL_FILENAME_KEY);
      const sa = localStorage.getItem(LOCAL_ACTIVE_ID_KEY);

      if (sl && sn) {
        const lm = JSON.parse(sl) as Record<string, Cell[][]>;
        const nm = JSON.parse(sn) as Record<string, string>;
        setLayoutsMap(lm);
        setNamesMap(nm);

        const id = sa && lm[sa] ? sa : Object.keys(lm)[0] || null;
        if (id) {
          // Activate restored layout
          setActiveId(id);
          setLayoutState(lm[id]);
          setLayoutNameState(nm[id]);
          return;
        }
      }
    } catch {
      console.warn('Failed to restore layouts from storage.');
    }
    loadDefaultLayout();
  }, []);

  // Persist changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(layoutsMap));
    localStorage.setItem(LOCAL_FILENAME_KEY, JSON.stringify(namesMap));
    if (activeId) {
      localStorage.setItem(LOCAL_ACTIVE_ID_KEY, activeId);
    }
  }, [layoutsMap, namesMap, activeId]);

  // Show notification banner when no layout loaded
  useEffect(() => {
    const msg = 'No warehouse layout loaded';
    if (!layout && !notifiedRef.current) {
      addNotification(msg, '/warehouse');
      notifiedRef.current = true;
    } else if (layout && notifiedRef.current) {
      removeNotificationByMessage(msg);
      notifiedRef.current = false;
    }
  }, [layout]);

  // Load default from Rust
  const loadDefaultLayout = async () => {
    try {
      const warehouse = await loadDefaultLayoutFromTauri();
      const { length, width } = warehouse;  // length = X-axis, width = Y-axis

      // Build bin lookup
      const binMap = new Map<string, { type: CellType; label: string }>();
      warehouse.storage_types.forEach((st) =>
        st.bins.forEach((bin) => {
          if (bin.x < length && bin.y < width) {
            binMap.set(`${bin.x},${bin.y}`, { type: st.id as CellType, label: bin.id });
          }
        })
      );

      // Grid: rows = width, cols = length
      const grid: Cell[][] = Array.from({ length: width }, (_, y) =>
        Array.from({ length: length }, (_, x) => {
          const entry = binMap.get(`${x},${y}`);
          return entry ? entry : ({ type: 'road' } as Cell);
        })
      );

      const id   = warehouse.id || uuidv4();
      const name = warehouse.name;

      // Register new layout
      setLayoutsMap((lm) => ({ ...lm, [id]: grid }));
      setNamesMap((nm) => ({ ...nm, [id]: name }));

      // Activate immediately
      setActiveId(id);
      setLayoutState(grid);
      setLayoutNameState(name);

      // Close selector modal if open
      setOpenSelector(false);
      enqueueSnackbar(`Default layout "${name}" loaded.`, { variant: 'success' });
    } catch (err) {
      console.error('Error loading default layout:', err);
      enqueueSnackbar('Failed to load default layout.', { variant: 'error' });
    }
  };

  // Load a layout from a JSON file
  const loadLayoutFromFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (!Array.isArray(parsed)) throw new Error();

        const name = file.name.replace(/\.[^/.]+$/, '');
        const id   = `${name}-${Date.now()}`;

        setLayoutsMap((lm) => ({ ...lm, [id]: parsed }));
        setNamesMap((nm) => ({ ...nm, [id]: name }));

        setActiveId(id);
        setLayoutState(parsed);
        setLayoutNameState(name);

        setOpenSelector(false);
        enqueueSnackbar(`Layout "${name}" loaded.`, { variant: 'success' });
      } catch {
        enqueueSnackbar('Invalid layout file.', { variant: 'error' });
      }
    };
    reader.readAsText(file);
  };

  // Switch the active tab to another layout ID
  const setActiveLayout = (id: string) => {
    const grid = layoutsMap[id];
    const name = namesMap[id];
    if (grid) {
      setActiveId(id);
      setLayoutState(grid);
      setLayoutNameState(name);
    }
  };

  // Remove a layout (by ID) from the map
  const removeLayout = (id: string) => {
    setLayoutsMap((lm) => {
      const copy = { ...lm };
      delete copy[id];
      return copy;
    });
    setNamesMap((nm) => {
      const copy = { ...nm };
      delete copy[id];
      return copy;
    });

    // If removing the active layout, switch or clear
    if (activeId === id) {
      const remaining = Object.keys(layoutsMap).filter((k) => k !== id);
      if (remaining.length) {
        setActiveLayout(remaining[0]);
      } else {
        resetLayout();
      }
    }
  };

  // Reset/clear all layouts
  const resetLayout = () => {
    enqueueSnackbar('All layouts have been reset.', { variant: 'warning' });
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LOCAL_FILENAME_KEY);
    localStorage.removeItem(LOCAL_ACTIVE_ID_KEY);
    setLayoutsMap({});
    setNamesMap({});
    setActiveId(null);
    setLayoutState(null);
    setLayoutNameState('');
    setSelectorClosed(false);
    setOpenSelector(true);
  };

  // Shortcut to open selector (resets closed flag)
  const openSelectorDialog = () => {
    setSelectorClosed(false);
    setOpenSelector(true);
  };
  // Shortcut to close selector and mark as manually closed
  const closeSelector = () => {
    setOpenSelector(false);
    setSelectorClosed(true);
  };

  return (
    <LayoutContext.Provider
      value={{
        layout,
        layoutName,
        layoutsMap,
        namesMap,
        activeId,
        openSelector,
        selectorClosed,

        setLayout: (g, n) => {
          const id = `${n}-${Date.now()}`;
          setLayoutsMap((lm) => ({ ...lm, [id]: g }));
          setNamesMap((nm) => ({ ...nm, [id]: n }));
          setActiveId(id);
          setLayoutState(g);
          setLayoutNameState(n);
        },
        setLayoutName: setLayoutNameState,
        setOpenSelector,
        openSelectorDialog,
        closeSelector,
        onSelectorClose: closeSelector,

        loadDefaultLayout,
        loadLayoutFromFile,
        resetLayout,

        setActiveLayout,
        removeLayout,

        // Footer registration
        footerContent,
        setFooterContent,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}
