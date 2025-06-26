// src/features/warehouse/components/WarehouseSimulator.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Paper, Tooltip, useTheme } from '@mui/material'
import { getCellStyle, getTooltipLabel } from '@/utils/warehouse'
import { useLayoutContext } from '@/contexts/LayoutContext'
import { useSimulationSettings } from '@/contexts/SimulationSettingsContext'
import { useWarehouseSimulation, Task } from '@/hooks/useWarehouseSimulation'

export interface Cell {
  type: string
  label?: string
  fillPercent?: number
  pulse?: boolean
}

interface WarehouseSimulatorProps {
  grid: Cell[][]
  path: [number, number][]
}

interface Highlight {
  key: string
  color: 'red' | 'green'
}

const MemoCell = React.memo(
  ({ cell, isPick, isDrop }: { cell: Cell; isPick: boolean; isDrop: boolean }) => {
    const theme = useTheme()
    const pulse = isPick || isDrop || cell.pulse
    const fillPercent = !isPick && !isDrop ? cell.fillPercent : undefined
    const { backgroundColor, className } = getCellStyle(cell.type, fillPercent, pulse)
    return (
      <Tooltip title={getTooltipLabel(cell.type, cell.label)} arrow>
        <Paper
          className={className}
          elevation={1}
          sx={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.65rem',
            fontWeight: 500,
            backgroundColor,
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
  (a, b) =>
    a.isPick === b.isPick &&
    a.isDrop === b.isDrop &&
    a.cell.fillPercent === b.cell.fillPercent &&
    a.cell.pulse === b.cell.pulse
)

export function WarehouseSimulator({ grid, path }: WarehouseSimulatorProps) {
  const { activeId } = useLayoutContext()
  const { isRunning, simInterval } = useSimulationSettings(activeId!)
  const { tasks } = useWarehouseSimulation(simInterval, isRunning)

  // guard
  if (!Array.isArray(grid) || !Array.isArray(grid[0])) return null

  // map labels → coords
  const binIndex = useMemo(() => {
    const m = new Map<string, [number, number]>()
    grid.forEach((row, r) =>
      row.forEach((cell, c) => {
        if (cell.label) m.set(cell.label, [r, c])
      })
    )
    return m
  }, [grid])

  const [highlights, setHighlights] = useState<Highlight[]>([])
  const prevTasksRef = useRef<Task[]>([])

  useEffect(() => {
    const prev = prevTasksRef.current
    tasks.forEach((t) => {
      const old = prev.find((o) => o.id === t.id)
      // new pick
      if (!old || (old.state === 'Created' && t.state !== 'Created')) {
        const origin = t.task_type.Pick.origin_bin
        binIndex.get(origin)?.[0] != null &&
          setHighlights((h) => [...h, { key: `${binIndex.get(origin)![0]},${binIndex.get(origin)![1]}`, color: 'red' }])
      }
      // drop completion
      if (old && old.state !== 'Completed' && t.state === 'Completed') {
        const dest = t.task_type.Pick.dest_bin
        binIndex.get(dest)?.[0] != null &&
          setHighlights((h) => [...h, { key: `${binIndex.get(dest)![0]},${binIndex.get(dest)![1]}`, color: 'green' }])
      }
    })
    prevTasksRef.current = tasks
  }, [tasks, binIndex])

  // expire highlights
  useEffect(() => {
    if (!highlights.length) return
    const id = window.setTimeout(() => setHighlights((h) => h.slice(highlights.length)), 500)
    return () => clearTimeout(id)
  }, [highlights])

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${grid[0].length}, 36px)`,
        gap: 0.5,
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
