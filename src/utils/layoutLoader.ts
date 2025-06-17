import { invoke } from '@tauri-apps/api/core';
import { Warehouse } from "@/contexts/types";

export async function loadDefaultLayoutFromTauri(): Promise<Warehouse> {
  return await invoke<Warehouse>("get_default_layout");
}
