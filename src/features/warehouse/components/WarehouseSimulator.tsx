// src/features/warehouse/components/WarehouseSimulator.tsx

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Paper, Tooltip, useTheme, alpha } from '@mui/material'
import { getCellColor, getTooltipLabel } from '@/utils/warehouse'
import { useLayoutContext } from '@/contexts/LayoutContext'
import { useSimulationSettings } from '@/contexts/SimulationSettingsContext'
import { useWarehouseSimulation, Task } from '@/hooks/useWarehouseSimulation'

export interface Cell {
  type: string            // storage_type_id or "road"
  label?: string          // bin ID
  color?: string          // hex color for this storage_type
}

interface WarehouseSimulatorProps {
  grid: Cell[][]
  path: [number, number][]
}

interface Highlight {
  key: string            // "r,c"
  color: 'red' | 'green'
}

// Memoized cell so only pick/drop changes re-render it
const MemoCell = React.memo(
  ({
    cell,
    isPick,
    isDrop,
  }: {
    cell: Cell
    isPick: boolean
    isDrop: boolean
  }) => {
    const theme = useTheme()
    const dark = theme.palette.mode === 'dark'

    // Determine background color
    let bg: string
    if (isPick) {
      bg = alpha(theme.palette.error.main, 0.7)
    } else if (isDrop) {
      bg = alpha(theme.palette.success.main, 0.7)
    } else if (cell.color) {
      bg = cell.color
    } else {
      bg = getCellColor(cell.type, dark)
    }

    return (
      <Tooltip title={getTooltipLabel(cell.type, cell.label)} arrow>
        <Paper
          elevation={1}
          sx={{
            position: 'relative',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.65rem',
            fontWeight: 500,
            backgroundColor: bg,
            border: `1px solid ${theme.palette.divider}`,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {cell.label}
        </Paper>
      </Tooltip>
    )
  },
  (prev, next) => prev.isPick === next.isPick && prev.isDrop === next.isDrop
)

export function WarehouseSimulator({ grid, path }: WarehouseSimulatorProps) {
  const theme = useTheme()

  // contexts & settings
  const { activeId } = useLayoutContext()
  const { isRunning, simInterval } = useSimulationSettings(activeId!)
  const { tasks } = useWarehouseSimulation(simInterval, isRunning)

  // build a mapping binId → [row, col]
  const binIndex = useMemo(() => {
    const m = new Map<string, [number, number]>()
    grid.forEach((row, r) =>
      row.forEach((cell, c) => {
        if (cell.label) {
          m.set(cell.label, [r, c])
        }
      })
    )
    return m
  }, [grid])
  // at the top of WarehouseSimulator, after you have `grid`:
useEffect(() => {
  // collect every distinct type we see
  const types = new Set<string>()
  grid.forEach(row => row.forEach(cell => types.add(cell.type)))
  console.log('🚨 WarehouseSimulator sees cell.types =', Array.from(types))
}, [grid])
  // highlight state
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const prevTasksRef = useRef<Task[]>([])

  // diff tasks: new/assigned ⇒ pick; completed ⇒ drop
  useEffect(() => {
    const prev = prevTasksRef.current
    const now = tasks

    // picks: new or moving off Created
    now.forEach((t) => {
      const old = prev.find((o) => o.id === t.id)
      if (!old || (old.state === 'Created' && t.state !== 'Created')) {
        const origin = t.task_type.Pick.origin_bin
        const coord = binIndex.get(origin)
        if (coord) {
          setHighlights((h) => [
            ...h,
            { key: `${coord[0]},${coord[1]}`, color: 'red' },
          ])
        }
      }
    })

    // drops: Completed transitions
    now.forEach((t) => {
      const old = prev.find((o) => o.id === t.id)
      if (old && old.state !== 'Completed' && t.state === 'Completed') {
        const dest = t.task_type.Pick.dest_bin
        const coord = binIndex.get(dest)
        if (coord) {
          setHighlights((h) => [
            ...h,
            { key: `${coord[0]},${coord[1]}`, color: 'green' },
          ])
        }
      }
    })

    prevTasksRef.current = now
  }, [tasks, binIndex])

  // auto-expire highlights after 500ms
  useEffect(() => {
    if (highlights.length === 0) return
    const id = window.setTimeout(() => {
      setHighlights((h) => h.slice(highlights.length))
    }, 500)
    return () => clearTimeout(id)
  }, [highlights])

  if (!activeId) return null

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${grid[0].length}, 36px)`,
        gap: 0.5,
        border: `1px solid ${theme.palette.divider}`,
        p: 1,
      }}
    >
      {grid.map((row, r) =>
        row.map((cell, c) => {
          const key = `${r},${c}`
          const isPick = highlights.some((h) => h.key === key && h.color === 'red')
          const isDrop = highlights.some((h) => h.key === key && h.color === 'green')
          return <MemoCell key={key} cell={cell} isPick={isPick} isDrop={isDrop} />
        })
      )}
    </Box>
  )
}
