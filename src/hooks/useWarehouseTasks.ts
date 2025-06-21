// src/hooks/useWarehouseTasks.ts
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useDataSource } from "@/contexts/DataSourceContext";

export interface Task { /* … */ }

export function useWarehouseTasks(pollMs = 1000) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { source } = useDataSource();

  useEffect(() => {
    let handle: number;
    async function fetchTasks() {
      const cmd = source === "simulation" ? "get_sim_tasks" : "get_tasks";
      try {
        const newTasks = await invoke<Task[]>(cmd);
        setTasks(newTasks);
      } catch (e) {
        console.error(`fetch ${cmd} failed`, e);
      }
      handle = window.setTimeout(fetchTasks, pollMs);
    }
    fetchTasks();
    return () => clearTimeout(handle);
  }, [source, pollMs]);

  return tasks;
}
