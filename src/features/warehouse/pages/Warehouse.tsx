// src/features/warehouse/pages/Warehouse.tsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tooltip,
  IconButton,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Button,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SettingsIcon from '@mui/icons-material/Settings';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useLayoutContext } from '@/contexts/LayoutContext';
import { getCellColor, getTooltipLabel } from '@/utils/warehouse';
import LayoutTabs from '../components/LayoutTabs';
import { useWarehouseSimulation } from '@/hooks/useWarehouseSimulation';

export default function Warehouse() {
  const {
    layout: grid,          // your Cell[][]
    layoutName,
    openSelectorDialog,
    resetLayout,
    selectorClosed,
    openSelector,
    setFooterContent,
  } = useLayoutContext();

  const theme = useTheme();
  const dark = theme.palette.mode === 'dark';

  // simulation hook: gives path of [row, col] steps
  const { path } = useWarehouseSimulation(500);
  const maxStep = path.length - 1;

  // simulation state
  const [step, setStep] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  // settings dialog state
  const [settingsOpen, setSettingsOpen] = useState(false);

  // infinite looping animation
  useEffect(() => {
    if (!isRunning || maxStep < 0) return;
    const timer = window.setTimeout(() => {
      setStep((s) => (s >= maxStep ? 0 : s + 1));
    }, 500);
    return () => clearTimeout(timer);
  }, [step, maxStep, isRunning]);

  // register footer tabs
  useEffect(() => {
    setFooterContent(<LayoutTabs />);
    return () => setFooterContent(null);
  }, [setFooterContent]);

  // loading / no-layout UI
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

  // current highlight coords
  const [curR, curC] = path[step] || [-1, -1];

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

          {/* Animated Grid */}
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
                const isActive = r === curR && c === curC;
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
                );
              })
            )}
          </Box>

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
