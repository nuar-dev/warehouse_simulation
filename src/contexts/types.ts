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
  id: string;
  dimensions: [number, number, number]; // [length, width, height]
  storage_types: StorageType[];
}
