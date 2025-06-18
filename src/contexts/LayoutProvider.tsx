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

/**  
 * Append “ (1)”, “ (2)”, … until base is unique among existingNames  
 */
function generateUniqueName(base: string, existingNames: string[]): string {
  if (!existingNames.includes(base)) return base;
  let idx = 1, name: string;
  do {
    name = `${base} (${idx++})`;
  } while (existingNames.includes(name));
  return name;
}

export default function LayoutProvider({ children }: Props) {
  // ─── Core multi-layout state ──────────────────────────────────────────
  const [layoutsMap, setLayoutsMap]   = useState<Record<string, Cell[][]>>({});
  const [namesMap,   setNamesMap]     = useState<Record<string, string>>({});
  const [layoutOrder,setLayoutOrder]  = useState<string[]>([]);
  const [activeId,   setActiveId]     = useState<string | null>(null);

  // ─── Legacy single-layout API ────────────────────────────────────────
  const [layout,       setLayoutState]     = useState<Cell[][] | null>(null);
  const [layoutName,   setLayoutNameState] = useState<string>('Warehouse (demo)');

  // ─── Selector dialog state ───────────────────────────────────────────
  const [openSelector,   setOpenSelector]   = useState(false);
  const [selectorClosed, setSelectorClosed] = useState(false);

  // ─── Footer content ──────────────────────────────────────────────────
  const [footerContent, setFooterContent] = useState<ReactNode | null>(null);

  // ─── Reorder support ─────────────────────────────────────────────────
  const reorderLayout = (from: number, to: number) => {
    setLayoutOrder((order) => {
      const next = [...order];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  // ─── Notification helpers ────────────────────────────────────────────
  const { addNotification, removeNotificationByMessage } = useNotificationContext();
  const { enqueueSnackbar } = useSnackbar();
  const notifiedRef = useRef(false);

  // ─── Restore or initialize layouts ──────────────────────────────────
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
        setLayoutOrder(Object.keys(lm));

        const id = sa && lm[sa] ? sa : Object.keys(lm)[0] || null;
        if (id) {
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

  // ─── Persist layouts to localStorage ────────────────────────────────
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(layoutsMap));
    localStorage.setItem(LOCAL_FILENAME_KEY, JSON.stringify(namesMap));
    if (activeId) localStorage.setItem(LOCAL_ACTIVE_ID_KEY, activeId);
  }, [layoutsMap, namesMap, activeId]);

  // ─── Notify if no layout is loaded ──────────────────────────────────
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

  // ─── Register helper (unique name + append to order) ─────────────────
  /** 
   * Register layout under `id` with a generated unique display name.
   * Returns that unique name.
   */
  const registerLayout = (id: string, grid: Cell[][], rawName: string): string => {
    const existing = Object.values(namesMap);
    const uniqueName = generateUniqueName(rawName, existing);
    setLayoutsMap((lm) => ({ ...lm, [id]: grid }));
    setNamesMap  ((nm) => ({ ...nm, [id]: uniqueName }));
    setLayoutOrder((ord) => [...ord, id]);
    return uniqueName;
  };

  // ─── Core actions ────────────────────────────────────────────────────

  /** Load default layout from Rust, register & activate it */
  const loadDefaultLayout = async () => {
    try {
      const wh = await loadDefaultLayoutFromTauri();
      const { length, width } = wh;
      const binMap = new Map<string, Cell>();
      wh.storage_types.forEach((st) =>
        st.bins.forEach((bin) => {
          if (bin.x < length && bin.y < width) {
            binMap.set(
              `${bin.x},${bin.y}`,
              { type: st.id as CellType, label: bin.id }
            );
          }
        })
      );
      const grid: Cell[][] = Array.from({ length: width }, (_, y) =>
        Array.from({ length }, (_, x) =>
          binMap.get(`${x},${y}`) || ({ type: 'road' as CellType })
        )
      );
      const id = uuidv4();
      const chosenName = registerLayout(id, grid, wh.id);
      setActiveId(id);
      setLayoutState(grid);
      setLayoutNameState(chosenName);
      setOpenSelector(false);
      enqueueSnackbar(`Loaded "${chosenName}".`, { variant: 'success' });
    } catch {
      enqueueSnackbar('Failed to load default layout.', { variant: 'error' });
    }
  };

  /** Load a user JSON file, register & activate */
  const loadLayoutFromFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target!.result as string);
        if (!Array.isArray(parsed)) throw new Error();
        const rawName = file.name.replace(/\.[^/.]+$/, '');
        const id = `${rawName}-${Date.now()}`;
        const chosenName = registerLayout(id, parsed as Cell[][], rawName);
        setActiveId(id);
        setLayoutState(parsed as Cell[][]);
        setLayoutNameState(chosenName);
        setOpenSelector(false);
        enqueueSnackbar(`Loaded "${chosenName}".`, { variant: 'success' });
      } catch {
        enqueueSnackbar('Invalid layout file.', { variant: 'error' });
      }
    };
    reader.readAsText(file);
  };

  /** Activate an existing layout by ID */
  const setActiveLayout = (id: string) => {
    const grid = layoutsMap[id];
    if (grid) {
      setActiveId(id);
      setLayoutState(grid);
      setLayoutNameState(namesMap[id]);
    }
  };

  /** Remove a layout, update order, and switch/reset if needed */
  const removeLayout = (id: string) => {
    const name = namesMap[id] || id;
    setLayoutsMap((lm) => { const c = { ...lm }; delete c[id]; return c; });
    setNamesMap  ((nm) => { const c = { ...nm }; delete c[id]; return c; });
    setLayoutOrder((ord) => ord.filter((x) => x !== id));
    enqueueSnackbar(`Closed "${name}".`, { variant: 'success' });

    if (activeId === id) {
      const rem = layoutOrder.filter((x) => x !== id);
      rem.length ? setActiveLayout(rem[0]) : resetLayout();
    }
  };

  /** Clear all layouts + storage, then re-open selector */
  const resetLayout = () => {
    enqueueSnackbar('All layouts reset.', { variant: 'warning' });
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LOCAL_FILENAME_KEY);
    localStorage.removeItem(LOCAL_ACTIVE_ID_KEY);
    setLayoutsMap({});
    setNamesMap({});
    setLayoutOrder([]);
    setActiveId(null);
    setLayoutState(null);
    setLayoutNameState('');
    setSelectorClosed(false);
    setOpenSelector(true);
  };

  // ─── Selector dialog shortcuts ────────────────────────────────────────
  const openSelectorDialog = () => { setSelectorClosed(false); setOpenSelector(true); };
  const closeSelector      = () => { setOpenSelector(false); setSelectorClosed(true); };

  return (
    <LayoutContext.Provider
      value={{
        layout,
        layoutName,
        layoutsMap,
        namesMap,
        layoutOrder,
        activeId,
        openSelector,
        selectorClosed,

        setLayout: (grid, rawName) => {
          const id = `${rawName}-${Date.now()}`;
          const chosenName = registerLayout(id, grid, rawName);
          setActiveLayout(id);
          setLayoutNameState(chosenName);
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

        footerContent,
        setFooterContent,

        reorderLayout,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}
