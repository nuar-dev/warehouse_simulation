import React, { useState, useEffect } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, TextField, Paper, Tooltip, MenuItem, Select, IconButton
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { getCellColor } from '@/utils/warehouse';

export type CellType =
  | 'road'
  | 'high_rack'
  | 'pick_zone'
  | 'returns'
  | 'vas'
  | 'packing'
  | 'staging_in'
  | 'staging_out'
  | 'inbound_ramp'
  | 'outbound_ramp'
  | 'damaged'
  | 'comm'
  | 'wall';

interface Cell {
  type: CellType;
  label?: string;
}

export default function CustomLayout() {
  const [width, setWidth] = useState(36);
  const [height, setHeight] = useState(20);
  const [layoutName, setLayoutName] = useState("Custom Layout");
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [selectedType, setSelectedType] = useState<CellType>('road');

  const [startDialogOpen, setStartDialogOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (!startDialogOpen) initializeGrid(width, height);
  }, [startDialogOpen]);

  const initializeGrid = (w: number, h: number) => {
    const blank: Cell[][] = Array.from({ length: h }, (_, y) =>
      Array.from({ length: w }, (_, x) => ({ type: 'road' }))
    );
    setGrid(blank);
  };

  const updateCell = (x: number, y: number, type: CellType) => {
    setGrid(prev =>
      prev.map((row, rowIdx) =>
        rowIdx === y
          ? row.map((cell, colIdx) =>
            colIdx === x ? { type, label: `${type.slice(0, 3).toUpperCase()}-${x}-${y}` } : cell
          )
          : row
      )
    );
  };

  const resetCell = (x: number, y: number) => {
    setGrid(prev =>
      prev.map((row, rowIdx) =>
        rowIdx === y
          ? row.map((cell, colIdx) => (colIdx === x ? { type: 'road' } : cell))
          : row
      )
    );
  };

  const saveAsJson = () => {
    const blob = new Blob([JSON.stringify(grid, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${layoutName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">{layoutName}</Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Select value={selectedType} onChange={e => setSelectedType(e.target.value as CellType)} size="small">
            {[
              'road', 'wall', 'high_rack', 'pick_zone', 'returns', 'vas',
              'packing', 'staging_in', 'staging_out', 'inbound_ramp', 'outbound_ramp', 'damaged', 'comm'
            ].map(t => (
              <MenuItem key={t} value={t}>{t.replace(/_/g, ' ')}</MenuItem>
            ))}
          </Select>
          <Button variant="contained" onClick={saveAsJson}>Save as JSON</Button>
          <IconButton onClick={() => setSettingsOpen(true)}>
            <SettingsIcon />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${width}, 32px)`,
        gap: 0.5
      }}>
        {grid.map((row, y) =>
          row.map((cell, x) => (
            <Tooltip key={`${x}-${y}`} title={`${cell.type}${cell.label ? `: ${cell.label}` : ''}`} arrow>
              <Paper
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: getCellColor(cell.type),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.6rem',
                  cursor: 'pointer'
                }}
                onClick={e => {
                  if (e.shiftKey) resetCell(x, y);
                  else updateCell(x, y, selectedType);
                }}
              >
                {cell.label ? cell.label.slice(0, 3) : ''}
              </Paper>
            </Tooltip>
          ))
        )}
      </Box>

      {/* Start Dialog */}
      <Dialog open={startDialogOpen}>
        <DialogTitle>New Custom Layout</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Layout Name" value={layoutName} onChange={e => setLayoutName(e.target.value)} />
          <TextField fullWidth margin="dense" type="number" label="Width" value={width} onChange={e => setWidth(+e.target.value)} />
          <TextField fullWidth margin="dense" type="number" label="Height" value={height} onChange={e => setHeight(+e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStartDialogOpen(false)} variant="contained">Start Designing</Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <DialogTitle>Layout Settings</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Layout Name" value={layoutName} onChange={e => setLayoutName(e.target.value)} />
          <TextField fullWidth margin="dense" type="number" label="Width" value={width} onChange={e => {
            const newW = +e.target.value;
            setWidth(newW);
            initializeGrid(newW, height);
          }} />
          <TextField fullWidth margin="dense" type="number" label="Height" value={height} onChange={e => {
            const newH = +e.target.value;
            setHeight(newH);
            initializeGrid(width, newH);
          }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
