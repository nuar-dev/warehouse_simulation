// src/hooks/useWarehouseSimulation.ts
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

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
  const [path, setPath] = useState<[number, number][]>([]);

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

  // Whenever layout or tasks change, compute a path for the first pending Pick task
  useEffect(() => {
    if (!layout || tasks.length === 0) {
      setPath([]);
      return;
    }

    // find first Pick task that isn't complete
    const pickTask = tasks.find((t) => t.task_type.Pick && t.state !== "Complete");
    if (!pickTask) {
      setPath([]);
      return;
    }

    const { origin_bin: originId, dest_bin: destId } = pickTask.task_type.Pick;

    // flatten all bins
    const allBins = layout.storage_types.flatMap((st) => st.bins);
    const origin = allBins.find((b) => b.id === originId);
    const dest = allBins.find((b) => b.id === destId);

    if (!origin || !dest) {
      console.warn("Origin or destination bin not found", originId, destId);
      setPath([]);
      return;
    }

    // simple Manhattan path: horizontal then vertical
    const newPath: [number, number][] = [];
    const dx = origin.x < dest.x ? 1 : origin.x > dest.x ? -1 : 0;
    const dy = origin.y < dest.y ? 1 : origin.y > dest.y ? -1 : 0;

    // start at origin
    let x = origin.x;
    let y = origin.y;
    newPath.push([y, x]); // note: [row, col] = [y, x]

    // move horizontally
    while (x !== dest.x) {
      x += dx;
      newPath.push([y, x]);
    }
    // move vertically
    while (y !== dest.y) {
      y += dy;
      newPath.push([y, x]);
    }

    setPath(newPath);
  }, [layout, tasks]);

  return { layout, tasks, path };
}
