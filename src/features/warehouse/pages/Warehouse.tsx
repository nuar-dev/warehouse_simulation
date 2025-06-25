// src/features/warehouse/pages/Warehouse.tsx

import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SettingsIcon from '@mui/icons-material/Settings';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useLayoutContext } from '@/contexts/LayoutContext';
import LayoutTabs from '../components/LayoutTabs';
import { useWarehouseSimulation } from '@/hooks/useWarehouseSimulation';
import { WarehouseSimulator } from '../components/WarehouseSimulator';
import { useSimulationSettings } from '@/contexts/SimulationSettingsContext';

export default function Warehouse() {
  const {
    layout: _legacyGrid,     // still in context but no longer used for rendering
    layoutName,
    openSelectorDialog,
    resetLayout,
    selectorClosed,
    openSelector,
    setFooterContent,
    activeId: layoutId,
  } = useLayoutContext();

  const theme = useTheme();

  // Per‐layout simulation settings
  const {
    simInterval = 1000,
    isRunning,
    setIsRunning,
  } = useSimulationSettings(layoutId!);

  // New 3D hook: gives you the full spec, a 3D grid, tasks, and path
  const { spec, grid3D, tasks, path } = useWarehouseSimulation(simInterval, isRunning);

  // Track which Z‐layer we’re viewing
  const [layer, setLayer] = useState(0);

  // Keep layer in bounds whenever grid3D changes
  useEffect(() => {
    if (grid3D.length === 0) {
      setLayer(0);
    } else if (layer > grid3D.length - 1) {
      setLayer(grid3D.length - 1);
    }
  }, [grid3D, layer]);

  // Settings dialog state
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Register footer tabs
  useEffect(() => {
    setFooterContent(<LayoutTabs />);
    return () => void setFooterContent(null);
  }, [setFooterContent]);

  // No layout → show selector prompt (unchanged)
  if (!spec) {
    if (openSelector && !selectorClosed) return null;
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
    );
  }

  // Once we have spec, show layer slider + simulator
  return (
    <>
      <Box sx={{ maxWidth: 1600, mx: 'auto', p: 4 }}>
        {/* Title and actions */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4">{layoutName}</Typography>
        </Box>
        {/* Layer selector */}
        {grid3D.length > 1 && (
          <Box sx={{ mb: 2, px: 2 }}>
            <Typography gutterBottom>
              Layer (Z) {layer + 1} of {grid3D.length}
            </Typography>
            <Slider
              value={layer}
              min={0}
              max={grid3D.length - 1}
              onChange={(_, v) => setLayer(v as number)}
            />
          </Box>
        )}
        {/* Grid + buttons */}
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Box
            sx={{
              position: 'absolute',
              top: -40,
              right: 0,
              display: 'flex',
              gap: 1,
              zIndex: 10,
            }}
          >
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
          <WarehouseSimulator
            grid={grid3D[layer]}
            path={path}

          />
        </Box>
      </Box>
      {/* Simulation Settings */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <DialogTitle>Simulation Settings</DialogTitle>
        <DialogContent dividers>
          <FormControlLabel
            control={
              <Switch
                checked={isRunning}
                onChange={(e) => setIsRunning(e.target.checked)}
              />
            }
            label="Running"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
