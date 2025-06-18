export interface StorageBin {
  id: string;
  x: number;
  y: number;
  section?: string;
  storage_type_id: string;
}

export interface StorageType {
  id: string;
  name: string;
  color: string;
  bins: StorageBin[];
}

export interface Warehouse {
  id: string;       // unique identifier, e.g. UUID
  name: string;     // user-friendly name for tab display
  length: number;   // warehouse length (X-axis)
  width: number;    // warehouse width (Y-axis)
  height: number;   // warehouse height (Z-axis)
  storage_types: StorageType[];
}
