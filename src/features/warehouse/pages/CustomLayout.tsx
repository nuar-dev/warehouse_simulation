// src/features/warehouse/components/CustomLayout.tsx

import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Paper,
  Tooltip,
  MenuItem,
  Select,
  IconButton,
} from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import { getCellStyle, getTooltipLabel } from '@/utils/warehouse'

export type CellType =
  | 'road'
  | 'wall'
  | 'inbound_ramp'
  | 'inbound_buffer'
  | 'outbound_ramp'
  | 'outbound_buffer'
  | 'goods_receipt'
  | 'returns'
  | 'high_runner_1'
  | 'high_runner_2'
  | 'reserve'
  | 'special_stock'
  | 'kanban'
  | 'conveyor'
  | 'pick_zone'
  | 'commissioning'
  | 'packing'
  | 'vas'
  | 'quality_inspection'
  | 'assembly'
  | 'post_assembly'

interface Cell {
  type: CellType
  label?: string
}

export default function CustomLayout() {
  const [width, setWidth] = useState(36)
  const [height, setHeight] = useState(20)
  const [layoutName, setLayoutName] = useState('Custom Layout')
  const [grid, setGrid] = useState<Cell[][]>([])
  const [selectedType, setSelectedType] = useState<CellType>('road')

  const [startDialogOpen, setStartDialogOpen] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    if (!startDialogOpen) initializeGrid(width, height)
  }, [startDialogOpen])

  const initializeGrid = (w: number, h: number) => {
    const blank: Cell[][] = Array.from({ length: h }, () =>
      Array.from({ length: w }, () => ({ type: 'road' }))
    )
    setGrid(blank)
  }

  const updateCell = (x: number, y: number, type: CellType) => {
    setGrid((prev) =>
      prev.map((row, ry) =>
        ry === y
          ? row.map((cell, cx) =>
              cx === x
                ? {
                    type,
                    label: `${type.slice(0, 3).toUpperCase()}-${x}-${y}`,
                  }
                : cell
            )
          : row
      )
    )
  }

  const resetCell = (x: number, y: number) => {
    setGrid((prev) =>
      prev.map((row, ry) =>
        ry === y
          ? row.map((cell, cx) => (cx === x ? { type: 'road' } : cell))
          : row
      )
    )
  }

  const saveAsJson = () => {
    const blob = new Blob([JSON.stringify(grid, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${layoutName.replace(/\s+/g, '_')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const allTypes = [
    'road',
    'wall',
    'inbound_ramp',
    'inbound_buffer',
    'outbound_ramp',
    'outbound_buffer',
    'goods_receipt',
    'returns',
    'high_runner_1',
    'high_runner_2',
    'reserve',
    'special_stock',
    'kanban',
    'conveyor',
    'pick_zone',
    'commissioning',
    'packing',
    'vas',
    'quality_inspection',
    'assembly',
    'post_assembly',
  ] as CellType[]

  return (
    <Box p={2}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">{layoutName}</Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Select
            size="small"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as CellType)}
          >
            {allTypes.map((t) => (
              <MenuItem key={t} value={t}>
                {getTooltipLabel(t).replace(/^.\s*/, '')}
              </MenuItem>
            ))}
          </Select>
          <Button variant="contained" onClick={saveAsJson}>
            Save as JSON
          </Button>
          <IconButton onClick={() => setSettingsOpen(true)}>
            <SettingsIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${width}, 32px)`,
          gap: 0.5,
        }}
      >
        {grid.map((row, y) =>
          row.map((cell, x) => {
            const { backgroundColor, className } = getCellStyle(cell.type)
            return (
              <Tooltip
                key={`${x}-${y}`}
                title={getTooltipLabel(cell.type, cell.label)}
                arrow
              >
                <Paper
                  className={className}
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.6rem',
                    cursor: 'pointer',
                  }}
                  onClick={(e) =>
                    e.shiftKey
                      ? resetCell(x, y)
                      : updateCell(x, y, selectedType)
                  }
                >
                  {cell.label?.slice(0, 3) ?? ''}
                </Paper>
              </Tooltip>
            )
          })
        )}
      </Box>

      {/* New-layout dialog */}
      <Dialog open={startDialogOpen} maxWidth="xs" fullWidth>
        <DialogTitle>New Custom Layout</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Layout Name"
            value={layoutName}
            onChange={(e) => setLayoutName(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            type="number"
            label="Width"
            value={width}
            onChange={(e) => setWidth(Math.max(1, +e.target.value))}
          />
          <TextField
            fullWidth
            margin="dense"
            type="number"
            label="Height"
            value={height}
            onChange={(e) => setHeight(Math.max(1, +e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setStartDialogOpen(false)}>
            Start Designing
          </Button>
        </DialogActions>
      </Dialog>

      {/* Settings dialog */}
      <Dialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Layout Settings</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Layout Name"
            value={layoutName}
            onChange={(e) => setLayoutName(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            type="number"
            label="Width"
            value={width}
            onChange={(e) => {
              const w = Math.max(1, +e.target.value)
              setWidth(w)
              initializeGrid(w, height)
            }}
          />
          <TextField
            fullWidth
            margin="dense"
            type="number"
            label="Height"
            value={height}
            onChange={(e) => {
              const h = Math.max(1, +e.target.value)
              setHeight(h)
              initializeGrid(width, h)
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setSettingsOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
