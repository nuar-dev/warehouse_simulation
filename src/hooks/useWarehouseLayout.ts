// src/hooks/useWarehouseLayout.ts

import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

// Make sure Warehouse includes id + name
export interface StorageBin { /* … existing props … */ }
export interface StorageType { /* … existing props … */ }

export interface Warehouse {
  id: string;
  name: string;
  length: number;
  width: number;
  storage_types: StorageType[];
}

// Overload signatures:
export function useWarehouseLayout(): {
  layouts: Warehouse[];
  loading: boolean;
  error: Error | null;
};
export function useWarehouseLayout(id: string): {
  layout: Warehouse | null;
  loading: boolean;
  error: Error | null;
};

export function useWarehouseLayout(id?: string) {
  const [layouts, setLayouts] = useState<Warehouse[]>([]);
  const [layout, setLayout] = useState<Warehouse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (id) {
      // Fetch single layout by ID
      invoke<Warehouse>('get_layout', { id })
        .then((l) => setLayout(l))
        .catch((e) => setError(e as Error))
        .finally(() => setLoading(false));
    } else {
      // Fetch all layouts
      invoke<Warehouse[]>('get_all_layouts')
        .then((all) => setLayouts(all))
        .catch((e) => setError(e as Error))
        .finally(() => setLoading(false));
    }
  }, [id]);

  // Return shape depends on whether an id arg was passed
  if (id) {
    return { layout, loading, error };
  }
  return { layouts, loading, error };
}
