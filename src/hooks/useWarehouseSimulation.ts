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
  type: string            // storage_type_id or "road"
  label?: string          // bin ID
  color?: string          // hex color
  fillPercent?: number    // [0–1] how full
  isMoving?: boolean      // for pulsing animation
}

/**
 * Fetches the 3D warehouse layout, polls tasks, computes a Manhattan path,
 * and augments each cell with fillPercent & isMoving.
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

  // 1) Load layout once
  useEffect(() => {
    invoke<Warehouse>('get_default_layout')
      .then(setSpec)
      .catch(console.error)
  }, [])

  // 2) Poll tasks
  useEffect(() => {
    async function loop() {
      if (!running || !isVisible.current) return
      try {
        const t = await invoke<Task[]>('get_sim_tasks')
        setTasks(t)
      } catch (e) {
        console.error(e)
      }
      timer.current = window.setTimeout(loop, pollMs)
    }
    const onVis = () => {
      isVisible.current = !document.hidden
      if (isVisible.current) loop()
      else clearTimeout(timer.current)
    }
    document.addEventListener('visibilitychange', onVis)
    loop()
    return () => {
      clearTimeout(timer.current)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [pollMs, running])

  // 3) Build grid3D with fillPercent & isMoving
  const grid3D = useMemo<Cell[][][]>(() => {
    if (!spec) return []
    // flatten tasks bins in motion
    const movingBins = new Set<string>()
    tasks.forEach((t) => {
      if (t.task_type.Pick) {
        movingBins.add(t.task_type.Pick.origin_bin)
        movingBins.add(t.task_type.Pick.dest_bin)
      }
    })

    // map coords → bin
    const binMap = new Map<string, StorageBin>()
    spec.storage_types.forEach((st) =>
      st.bins.forEach((b) => {
        binMap.set(`${b.x},${b.y},${b.z}`, b)
      })
    )

    const layers: Cell[][][] = []
    for (let z = 0; z < spec.height; z++) {
      const rows: Cell[][] = []
      for (let y = 0; y < spec.width; y++) {
        const cols: Cell[] = []
        for (let x = 0; x < spec.length; x++) {
          const key = `${x},${y},${z}`
          const bin = binMap.get(key)
          if (bin) {
            const st = spec.storage_types.find((s) => s.id === bin.storage_type_id)
            // TODO: replace this stub with real occupancy / max_volume
            const fillPercent = 0
            cols.push({
              type: bin.storage_type_id,
              label: bin.id,
              color: st?.color,
              fillPercent,
              isMoving: movingBins.has(bin.id),
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
  }, [spec, tasks])

  // 4) Compute Manhattan path
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
