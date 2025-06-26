// src/features/warehouse/pages/Warehouse.tsx
import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Tooltip,
  IconButton,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Button,
  Slider,
} from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import SettingsIcon from '@mui/icons-material/Settings'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { useLayoutContext } from '@/contexts/LayoutContext'
import LayoutTabs from '../components/LayoutTabs'
import { useWarehouseLayout } from '@/hooks/useWarehouseLayout'
import { WarehouseSimulator } from '../components/WarehouseSimulator'
import { useSimulationSettings } from '@/contexts/SimulationSettingsContext'

export default function Warehouse() {
  const theme = useTheme()
  const {
    layoutName,
    openSelector,
    selectorClosed,
    openSelectorDialog,
    resetLayout,
    setFooterContent,
    activeId,
  } = useLayoutContext()

  // 1) load layout + grid
  const { spec, grid2D } = useWarehouseLayout()

  // 2) sim settings
  const { isRunning, setIsRunning } = useSimulationSettings(activeId!)

  // local UI
  const [layer, setLayer] = useState(0)
  const [settingsOpen, setSettingsOpen] = useState(false)

  // keep layer valid
  useEffect(() => {
    if (grid2D.length === 0) setLayer(0)
    else if (layer >= grid2D.length) setLayer(grid2D.length - 1)
  }, [grid2D, layer])

  // footer tabs
  useEffect(() => {
    setFooterContent(<LayoutTabs />)
    return () => setFooterContent(null)
  }, [setFooterContent])

  // no spec → prompt or auto-open selector
  if (!spec) {
    if (openSelector && !selectorClosed) return null
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60vh',
          textAlign: 'center',
          px: 2,
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Please add a warehouse layout.
        </Typography>
        {selectorClosed && (
          <Tooltip title="New Layout">
            <IconButton
              onClick={openSelectorDialog}
              sx={{
                width: 80,
                height: 80,
                bgcolor: theme.palette.action.hover,
                '&:hover': { bgcolor: theme.palette.action.selected },
              }}
            >
              <AddCircleOutlineIcon sx={{ fontSize: 48 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    )
  }

  // main view
  return (
    <>
      <Box sx={{ maxWidth: 1600, mx: 'auto', p: 4 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4">{layoutName}</Typography>
          <Box>
            <Tooltip title="Change Layout">
              <IconButton size="small" onClick={openSelectorDialog}>
                <SwapHorizIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Simulation Settings">
              <IconButton size="small" onClick={() => setSettingsOpen(true)}>
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reset Layout">
              <IconButton size="small" color="error" onClick={resetLayout}>
                <RestartAltIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Slider—only 1 layer, so hidden */}
        {grid2D.length > 1 && (
          <Box sx={{ mb: 2, px: 2 }}>
            <Typography gutterBottom>
              Layer {layer + 1} of {grid2D.length}
            </Typography>
            <Slider
              value={layer}
              min={0}
              max={grid2D.length - 1}
              onChange={(_, v) => setLayer(v as number)}
            />
          </Box>
        )}

        {/* Simulator */}
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <WarehouseSimulator grid={grid2D} path={[]} />
        </Box>
      </Box>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <DialogTitle>Simulation Settings</DialogTitle>
        <DialogContent dividers>
          <FormControlLabel
            control={<Switch checked={isRunning} onChange={(e) => setIsRunning(e.target.checked)} />}
            label="Running"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
