// src/features/warehouse/pages/Warehouse.tsx

import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tooltip,
  IconButton,
  useTheme,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SettingsIcon from '@mui/icons-material/Settings';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useLayoutContext } from '@/contexts/LayoutContext';
import { getCellColor, getTooltipLabel } from '@/utils/warehouse';
import LayoutTabs from '../components/LayoutTabs';

export default function Warehouse() {
  const {
    layout,
    layoutName,
    openSelectorDialog,
    resetLayout,
    selectorClosed,
    openSelector,
    setFooterContent,

    // 🔴 drag‐to‐delete context values:
    draggingId,
    stopDragging,
    removeLayout,
  } = useLayoutContext();

  const theme = useTheme();
  const dark = theme.palette.mode === 'dark';

  // register warehouse tabs in footer
  useEffect(() => {
    setFooterContent(<LayoutTabs />);
    return () => setFooterContent(null);
  }, [setFooterContent]);

  // If no layout loaded...
  if (!layout) {
    // ...but the selector is still open, render nothing
    if (openSelector && !selectorClosed) {
      return null;
    }

    // otherwise, center the prompt + big “New Layout” button
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60vh',          // fill majority of view
          textAlign: 'center',
          px: 2,
        }}
      >
        <Typography
          variant="h6"
          color="text.secondary"
          gutterBottom
        >
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
                '&:hover': {
                  bgcolor: theme.palette.action.selected,
                },
              }}
            >
              <AddCircleOutlineIcon sx={{ fontSize: 48 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    );
  }

  // 🔴 Handlers for dragging over and dropping onto the warehouse area
  const handleDragOver = (e: React.DragEvent) => {
    if (!draggingId) return;  // only allow when dragging a tab
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!draggingId) return;
    e.preventDefault();
    // stop the drag state immediately
    stopDragging();
    // confirm with user before deleting
    const id = draggingId;
    if (window.confirm(`Delete layout “${id}”?`)) {
      removeLayout(id);
    }
  };

  return (
    <Box sx={{ maxWidth: '1600px', mx: 'auto', p: 4 }}>
      {/* title */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">{layoutName}</Typography>
      </Box>

      {/* relative wrapper for grid + controls */}
      {/* 🔴 make this area a drop target */}
      <Box
        sx={{ position: 'relative', display: 'inline-block' }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* 🔴 red tint overlay when dragging */}
        {draggingId && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              bgcolor: 'rgba(255,0,0,0.1)',
              zIndex: 5,
            }}
          />
        )}

        {/* controls just outside grid */}
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
          <Tooltip title="Settings">
            <IconButton size="small" onClick={() => {/* open settings */ }}>
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset Layout">
            <IconButton size="small" color="error" onClick={resetLayout}>
              <RestartAltIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* the actual grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${layout[0].length}, 36px)`,
            gap: 0.5,
            border: `1px solid ${theme.palette.divider}`,
            p: 1,
            backgroundColor: dark ? '#1e1e1e' : '#f7f7f7',
          }}
        >
          {layout.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <Tooltip
                key={`${rowIndex}-${colIndex}`}
                title={getTooltipLabel(cell.type, cell.label)}
                arrow
              >
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
                    backgroundColor: getCellColor(cell.type, dark),
                    border: `1px solid ${theme.palette.divider}`,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {cell.label ?? ''}
                </Paper>
              </Tooltip>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
}
