// src/hooks/useWarehouseLayout.ts
import { useState, useEffect, useMemo } from 'react'
import { invoke } from '@tauri-apps/api/core'

/** Matches Point3 in Rust */
export interface Point3 {
  x: number
  y: number
  z: number
}

/** Matches Dimensions in Rust */
export interface Dimensions {
  length: number
  width: number
  height: number
}

/** Matches crate::models::warehouse::Section */
export interface Section {
  id: string
  name: string
  origin: Point3
  size: Dimensions
}

/** Matches crate::models::warehouse::StorageBin */
export interface StorageBin {
  id: string
  origin: Point3
  size: Dimensions
  storage_type_id: string
}

/** Matches crate::models::warehouse::StorageType */
export interface StorageType {
  id: string
  name: string
  color: string
  section_id: string
  bins: StorageBin[]
  // (we ignore strategies, handling_unit_type, etc. here for rendering)
}

/** Matches your Resource model (must have at least `id` + `position: Point3`) */
export interface Resource {
  id: string
  position: Point3
  // …other fields if needed
}

/** The full Warehouse as returned by your Tauri backend */
export interface Warehouse {
  id: string
  name: string
  sections: Section[]
  storage_types: StorageType[]
  resources: Resource[]
}

/** A single cell in the 2D grid */
export interface Cell {
  type: string
  label?: string
  color?: string
}

export function useWarehouseLayout(): {
  spec: Warehouse | null
  grid2D: Cell[][]
  layout3D: {
    sections: Array<{ id: string; origin: Point3; size: Dimensions }>
    bins: Array<{ id: string; origin: Point3; size: Dimensions; color: string }>
    resources: Array<{ id: string; position: Point3 }>
  } | null
} {
  const [spec, setSpec] = useState<Warehouse | null>(null)

  // Load the spec from Rust
  useEffect(() => {
    invoke<Warehouse>('get_default_layout')
      .then(setSpec)
      .catch(err => console.error('useWarehouseLayout error', err))
  }, [])

  // Build a simple top‐down grid for 2D rendering
  const grid2D = useMemo<Cell[][]>(() => {
    if (!spec) return []

    // compute extents in meters (we’ll interpret each meter as one cell)
    const maxX = spec.sections.reduce((m, s) => Math.max(m, s.origin.x + s.size.length), 0)
    const maxY = spec.sections.reduce((m, s) => Math.max(m, s.origin.y + s.size.width), 0)

    const grid: Cell[][] = Array.from({ length: maxY }, () =>
      Array.from({ length: maxX }, () => ({ type: 'road' }))
    )

    // place each bin by its (origin.x, origin.y)
    spec.storage_types.forEach(st =>
      st.bins.forEach(bin => {
        const x = Math.floor(bin.origin.x)
        const y = Math.floor(bin.origin.y)
        if (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) {
          grid[y][x] = {
            type: bin.id,
            label: bin.id,
            color: st.color,
          }
        }
      })
    )

    return grid
  }, [spec])

  // Package up everything you need for 3D
  const layout3D = useMemo(() => {
    if (!spec) return null

    const sections = spec.sections.map(s => ({
      id: s.id,
      origin: s.origin,
      size: s.size,
    }))

    const bins = spec.storage_types.flatMap(st =>
      st.bins.map(bin => ({
        id: bin.id,
        origin: bin.origin,
        size: bin.size,
        color: st.color,
      }))
    )

    const resources = spec.resources.map(r => ({
      id: r.id,
      position: r.position,
    }))

    return { sections, bins, resources }
  }, [spec])

  return { spec, grid2D, layout3D }
}
