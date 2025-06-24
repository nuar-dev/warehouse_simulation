// src/features/warehouse/components/WarehouseSimulator.tsx

import React, { useEffect, useState } from 'react'
import { Box, Paper, Tooltip, useTheme, alpha } from '@mui/material'
import { getCellColor, getTooltipLabel } from '@/utils/warehouse'
import { useLayoutContext } from '@/contexts/LayoutContext'
import { useSimulationSettings } from '@/contexts/SimulationSettingsContext'

export interface Cell {
  type: string
  label?: string
}

interface WarehouseSimulatorProps {
  grid: Cell[][]
  path: [number, number][]
}

export function WarehouseSimulator({ grid, path }: WarehouseSimulatorProps) {
  const theme = useTheme()
  const dark = theme.palette.mode === 'dark'

  // get current layout’s ID from context
  const { activeId } = useLayoutContext()
  // if there's no active layout, render nothing
  if (!activeId) {
    return null
  }

  // pull per‐layout settings
  const { isRunning, simInterval } = useSimulationSettings(activeId)

  // animation state
  const [step, setStep] = useState(0)
  const maxStep = path.length - 1

  // auto‐advance loop
  useEffect(() => {
    if (!isRunning || maxStep < 0) return
    const timer = window.setTimeout(() => {
      setStep((s) => (s >= maxStep ? 0 : s + 1))
    }, simInterval)
    return () => clearTimeout(timer)
  }, [step, maxStep, isRunning, simInterval])

  // current highlight
  const [curR, curC] = path[step] || [-1, -1]

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${grid[0].length}, 36px)`,
        gap: 0.5,
        border: `1px solid ${theme.palette.divider}`,
        p: 1,
        backgroundColor: dark ? '#1e1e1e' : '#f7f7f7',
      }}
    >
      {grid.map((row, r) =>
        row.map((cell, c) => {
          const isActive = r === curR && c === curC
          return (
            <Tooltip key={`${r}-${c}`} title={getTooltipLabel(cell.type, cell.label)} arrow>
              <Paper
                elevation={1}
                sx={{
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.65rem',
                  fontWeight: 500,
                  backgroundColor: isActive
                    ? alpha(theme.palette.primary.main, 0.5)
                    : getCellColor(cell.type, dark),
                  border: `1px solid ${theme.palette.divider}`,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {cell.label ?? ''}
              </Paper>
            </Tooltip>
          )
        })
      )}
    </Box>
  )
}
