// src/hooks/useWarehouseSimulation.ts
import { useState, useEffect } from "react";
import { invoke } from '@tauri-apps/api/core'

export interface StorageBin {
  id: string;
  x: number;
  y: number;
  section: string | null;
  storage_type_id: string;
}

export interface StorageType {
  id: string;
  bins: StorageBin[];
  color: string;
  name: string;
}

export interface Warehouse {
  id: string;
  name: string;
  length: number;
  width: number;
  storage_types: StorageType[];
}

export interface Task {
  id: string;
  task_type: {
    Pick: {
      order_id: string;
      qty: number;
      origin_bin: string;
      dest_bin: string;
    };
  };
  state: string;
}

export function useWarehouseSimulation(pollMs = 1000) {
  const [layout, setLayout] = useState<Warehouse | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Fetch layout once
  useEffect(() => {
    invoke<Warehouse>("get_default_layout").then(setLayout);
  }, []);

  // Poll simulation tasks
  useEffect(() => {
    let handle: number;
    async function fetchTasks() {
      try {
        const newTasks = await invoke<Task[]>("get_sim_tasks");
        setTasks(newTasks);
      } catch (e) {
        console.error("fetch tasks failed", e);
      }
      handle = window.setTimeout(fetchTasks, pollMs);
    }
    fetchTasks();
    return () => clearTimeout(handle);
  }, [pollMs]);

  return { layout, tasks };
}
