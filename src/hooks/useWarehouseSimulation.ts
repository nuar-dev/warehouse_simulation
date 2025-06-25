// src/hooks/useWarehouseSimulation.ts

import { useState, useEffect, useRef, useMemo } from 'react'
import { invoke } from '@tauri-apps/api/core'

// Mirror your Rust types
export interface StorageBin {
  id: string
  x: number
  y: number
  z: number
  width: number
  depth: number
  height: number
  section: string | null
  storage_type_id: string
}
export interface StorageType {
  id: string
  name: string
  color: string
  bins: StorageBin[]
  // … other fields if you need them …
}
export interface Warehouse {
  id: string
  name: string
  length: number
  width: number
  height: number
  storage_types: StorageType[]
}

export interface Task {
  id: string
  task_type: {
    Pick: {
      order_id: string
      qty: number
      origin_bin: string
      dest_bin: string
    }
  }
  state: string
}

export interface Cell {
  type: string        // now real storage_type_id or "road"
  label?: string      // bin ID
  color?: string      // hex color from the spec
}

/**
 * Fetches the 3D warehouse layout, polls tasks, and computes a Manhattan path.
 */
export function useWarehouseSimulation(
  pollMs = 1000,
  running = true
): {
  spec: Warehouse | null
  grid3D: Cell[][][]
  tasks: Task[]
  path: [number, number][]
} {
  const [spec, setSpec] = useState<Warehouse | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [path, setPath] = useState<[number, number][]>([])
  const isVisible = useRef(!document.hidden)
  const timer = useRef<number>()

  // ─── 1) Load the 3D layout once ─────────────────────────────────────────
  useEffect(() => {
    invoke<Warehouse>('get_default_layout')
      .then((w) => setSpec(w))
      .catch(console.error)
  }, [])

  // Debug: once spec arrives, log all storage_type IDs
  useEffect(() => {
    if (spec) {
      console.log('🚨 storage_types IDs:', spec.storage_types.map((st) => st.id))
    }
  }, [spec])

  // ─── 2) Poll for simulation tasks ──────────────────────────────────────
  useEffect(() => {
    async function fetchLoop() {
      if (!running || !isVisible.current) return
      try {
        const newTasks = await invoke<Task[]>('get_sim_tasks')
        setTasks(newTasks)
      } catch (e) {
        console.error('fetch tasks failed', e)
      }
      timer.current = window.setTimeout(fetchLoop, pollMs)
    }
    const onVis = () => {
      isVisible.current = !document.hidden
      if (isVisible.current) fetchLoop()
      else clearTimeout(timer.current)
    }
    document.addEventListener('visibilitychange', onVis)
    fetchLoop()
    return () => {
      clearTimeout(timer.current)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [pollMs, running])

  // ─── 3) Compute 3D grid from spec ──────────────────────────────────────
  const grid3D = useMemo<Cell[][][]>(() => {
    if (!spec) return []
    const { length, width, height, storage_types } = spec

    // Build a lookup of (x,y,z) → StorageBin
    const binMap = new Map<string, StorageBin>()
    storage_types.forEach((st) =>
      st.bins.forEach((b) => {
        // key by unique coord string
        binMap.set(`${b.x},${b.y},${b.z}`, b)
      })
    )

    const layers: Cell[][][] = []
    for (let z = 0; z < height; z++) {
      const rows: Cell[][] = []
      for (let y = 0; y < width; y++) {
        const cols: Cell[] = []
        for (let x = 0; x < length; x++) {
          const bin = binMap.get(`${x},${y},${z}`)
          if (bin) {
            // Use the real storage_type_id + color
            const st = spec.storage_types.find((s) => s.id === bin.storage_type_id)
            cols.push({
              type: bin.storage_type_id,
              label: bin.id,
              color: st?.color,
            })
          } else {
            cols.push({ type: 'road' })
          }
        }
        rows.push(cols)
      }
      layers.push(rows)
    }
    return layers
  }, [spec])

  // Debug: once grid3D builds, log the distinct cell.type on layer 0
  useEffect(() => {
    if (grid3D.length) {
      const types = Array.from(
        new Set(grid3D[0].flat().map((cell) => cell.type))
      )
      console.log('🚨 grid3D[0] types:', types)
    }
  }, [grid3D])

  // ─── 4) Compute Manhattan path on the first pending pick ───────────────
  useEffect(() => {
    if (!spec || tasks.length === 0) {
      setPath([])
      return
    }
    const pick = tasks.find((t) => t.task_type.Pick && t.state !== 'Completed')
    if (!pick) {
      setPath([])
      return
    }
    const { origin_bin, dest_bin } = pick.task_type.Pick

    // find coords in the binMap by searching all bins
    const allBins = spec.storage_types.flatMap((st) => st.bins)
    const origin = allBins.find((b) => b.id === origin_bin)!
    const dest   = allBins.find((b) => b.id === dest_bin)!

    const newPath: [number, number][] = []
    const dx = Math.sign(dest.x - origin.x)
    const dy = Math.sign(dest.y - origin.y)
    let x = origin.x, y = origin.y

    newPath.push([y, x])
    while (x !== dest.x) { x += dx; newPath.push([y, x]) }
    while (y !== dest.y) { y += dy; newPath.push([y, x]) }

    setPath(newPath)
  }, [spec, tasks])

  return { spec, grid3D, tasks, path }
}
