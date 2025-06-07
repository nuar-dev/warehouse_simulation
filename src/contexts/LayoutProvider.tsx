// src/contexts/LayoutProvider.tsx

import React, { useState, useEffect, useRef } from 'react';
import { LayoutContext, Cell } from './LayoutContext';
import { useNotificationContext } from './NotificationContext';
import { useSnackbar } from 'notistack';

const LOCAL_STORAGE_KEY = 'warehouseLayout';
const LOCAL_FILENAME_KEY = 'warehouseFilename';

const defaultLayout: Cell[][] = Array.from({ length: 20 }, () =>
  Array.from({ length: 36 }, () => ({ type: 'road' }))
);

interface Props {
  children: React.ReactNode;
}

export default function LayoutProvider({ children }: Props) {
  const [layout, setLayoutState] = useState<Cell[][] | null>(null);
  const [layoutName, setLayoutNameState] = useState<string>('Warehouse (demo)');
  const [openSelector, setOpenSelector] = useState<boolean>(false);

  const { addNotification, removeNotificationByMessage } = useNotificationContext();
  const { enqueueSnackbar } = useSnackbar();
  const notifiedRef = useRef(false);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    const storedName = localStorage.getItem(LOCAL_FILENAME_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setLayoutState(parsed);
          setLayoutNameState(storedName || 'Warehouse (demo)');
        }
      } catch {
        console.warn('Invalid layout in localStorage.');
      }
    } else {
      setOpenSelector(true);
    }
  }, []);

  useEffect(() => {
    const message = 'No warehouse layout loaded';
    const route = '/warehouse';

    if (!layout && !notifiedRef.current) {
      addNotification(message, route);
      notifiedRef.current = true;
    } else if (layout && notifiedRef.current) {
      removeNotificationByMessage(message);
      notifiedRef.current = false;
    }
  }, [layout]);

  const setLayout = (newLayout: Cell[][], name: string) => {
    setLayoutState(newLayout);
    setLayoutNameState(name);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newLayout));
    localStorage.setItem(LOCAL_FILENAME_KEY, name);
  };

  const setLayoutName = (name: string) => {
    setLayoutNameState(name);
    localStorage.setItem(LOCAL_FILENAME_KEY, name);
  };

  const loadDefaultLayout = () => {
    setLayout(defaultLayout, 'Warehouse (demo)');
    setOpenSelector(false);
    enqueueSnackbar('Default layout loaded.', { variant: 'success' });
  };

  const loadLayoutFromFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          const name = file.name.replace(/\.[^/.]+$/, '');
          setLayout(parsed, name);
          setOpenSelector(false);
          enqueueSnackbar(`Layout "${name}" loaded successfully.`, { variant: 'success' });
        } else {
          enqueueSnackbar('Invalid layout file format.', { variant: 'error' });
        }
      } catch {
        enqueueSnackbar('Failed to parse layout file.', { variant: 'error' });
      }
    };
    reader.readAsText(file);
  };

  const resetLayout = () => {
    enqueueSnackbar('Layout has been reset.', { variant: 'warning' });
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LOCAL_FILENAME_KEY);
    setLayoutState(null);
    setLayoutNameState('');
    setOpenSelector(true);
  };

  const openSelectorDialog = () => setOpenSelector(true);
  const closeSelector = () => setOpenSelector(false);

  return (
    <LayoutContext.Provider
      value={{
        layout,
        layoutName,
        setLayout,
        setLayoutName,
        openSelector,
        setOpenSelector,
        openSelectorDialog,
        closeSelector,
        loadDefaultLayout,
        loadLayoutFromFile,
        resetLayout,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}
