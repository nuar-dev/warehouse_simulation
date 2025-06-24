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
  Paper,
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
    layout: grid,
    layoutName,
    openSelectorDialog,
    resetLayout,
    selectorClosed,
    openSelector,
    setFooterContent,
    activeId: layoutId,
  } = useLayoutContext();

  const theme = useTheme();
  const dark = theme.palette.mode === 'dark';

  // Fetch simulation path
  const { path } = useWarehouseSimulation();

  // Per-layout simulation settings
  const { isRunning, setIsRunning } = useSimulationSettings(layoutId!);

  // Dialog state for simulation settings
  const [settingsOpen, setSettingsOpen] = useState(false);

  // register warehouse tabs in footer
  useEffect(() => {
    setFooterContent(<LayoutTabs />);
    return () => setFooterContent(null);
  }, [setFooterContent]);

  // If no layout loaded...
  if (!grid) {
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

  return (
    <>
      <Box sx={{ maxWidth: '1600px', mx: 'auto', p: 4 }}>
        {/* Page Title */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4">{layoutName}</Typography>
        </Box>

        {/* Grid + Action Buttons */}
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          {/* Top-right action buttons */}
          <Box
            sx={{
              position: 'absolute',
              top: '-40px',
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

          {/* Simulator */}
          <WarehouseSimulator grid={grid} path={path} />

          {/* Simulation header */}
          <Box mt={2}>
            <Typography variant="h6">Simulation</Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Simulation Settings Dialog ── */}
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
