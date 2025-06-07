// src/components/dashboard/components/WarehouseGrid.tsx

import * as React from 'react';
import {
  Box,
  Typography,
  Paper,
  Tooltip,
  Button,
  Modal,
  Stack,
  useTheme,
  styled,
  Dialog,
  DialogActions,
  DialogTitle,
} from '@mui/material';
import LayoutProvider from '../../../contexts/LayoutProvider';
import { useLayoutContext } from '../../../contexts/LayoutContext';

const CenteredModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

function WarehouseGridInner() {
  const theme = useTheme();
  const {
    layout,
    layoutName,
    openSelector,
    loadDefaultLayout,
    loadLayoutFromFile,
    resetLayout,
    openSelectorDialog,
    closeSelector,
  } = useLayoutContext();

  const [confirmReset, setConfirmReset] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadLayoutFromFile(file);
  };

  return (
    <Box sx={{ maxWidth: '1600px', margin: 'auto', p: 4 }}>
      {/* Layout selector popup */}
      <CenteredModal open={openSelector} onClose={closeSelector}>
        <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, width: 400 }}>
          <Typography variant="h6" gutterBottom>
            Load Warehouse Layout
          </Typography>
          <Stack spacing={2}>
            <Button variant="contained" onClick={loadDefaultLayout}>
              Use Default Layout
            </Button>
            <Button variant="contained" component="label">
              Upload Layout File
              <input type="file" accept=".json" hidden onChange={handleFileChange} />
            </Button>
            <Button variant="outlined" disabled>
              Define Custom Layout (coming soon)
            </Button>
          </Stack>
        </Box>
      </CenteredModal>

      {/* Reset confirmation */}
      <Dialog open={confirmReset} onClose={() => setConfirmReset(false)}>
        <DialogTitle>Are you sure you want to reset the layout?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmReset(false)}>Cancel</Button>
          <Button onClick={resetLayout} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Content */}
      {layout ? (
        <>
          {/* Header + Buttons */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4">{layoutName}</Typography>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" size="small" onClick={openSelectorDialog}>
                Change Layout
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={() => setConfirmReset(true)}
              >
                Reset
              </Button>
            </Stack>
          </Box>

          {/* Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${layout[0].length}, 36px)`,
              gap: 0.5,
              border: `1px solid ${theme.palette.divider}`,
              p: 1,
              backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f7f7f7',
            }}
          >
            {layout.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <Tooltip
                  key={`${rowIndex}-${colIndex}`}
                  title={
                    cell.type === 'shelf'
                      ? `Shelf ${cell.label}`
                      : cell.type === 'comm'
                      ? 'Commission Area'
                      : cell.type === 'road'
                      ? 'Aisle / Road'
                      : 'Wall'
                  }
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
                      fontSize: '0.7rem',
                      backgroundColor:
                        cell.type === 'shelf'
                          ? theme.palette.mode === 'dark' ? '#5472a4' : '#bbdefb'
                          : cell.type === 'road'
                          ? theme.palette.mode === 'dark' ? '#424242' : '#eeeeee'
                          : cell.type === 'comm'
                          ? theme.palette.mode === 'dark' ? '#a65757' : '#ffcdd2'
                          : theme.palette.mode === 'dark' ? '#546e7a' : '#b0bec5',
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    {cell.label ?? ''}
                  </Paper>
                </Tooltip>
              ))
            )}
          </Box>
        </>
      ) : (
        // Empty layout fallback
        <Box textAlign="center" mt={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Please load a warehouse layout.
          </Typography>
          <Button variant="contained" onClick={openSelectorDialog}>
            Choose Layout
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default function WarehouseGrid() {
  return (
    <LayoutProvider>
      <WarehouseGridInner />
    </LayoutProvider>
  );
}
