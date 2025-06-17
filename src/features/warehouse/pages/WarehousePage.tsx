// src/components/dashboard/components/WarehousePage.tsx

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
import LayoutProvider from '@/contexts/LayoutProvider';
import { useLayoutContext } from '@/contexts/LayoutContext';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { useSnackbar } from 'notistack';

const CenteredModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

function WarehousePageInner() {
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

  const { addNotification } = useNotificationContext();
  const { enqueueSnackbar } = useSnackbar();
  const [confirmReset, setConfirmReset] = React.useState(false);

  React.useEffect(() => {
    if (!layout) {
      addNotification('No warehouse layout loaded', '/warehouse');
    }
  }, [layout]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          loadLayoutFromFile(file);
        } else {
          throw new Error();
        }
      } catch {
        enqueueSnackbar('Failed to load layout file. Please check the format.', { variant: 'error' });
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmReset = () => {
    setConfirmReset(false);
    resetLayout();
  };

  // 🔧 Icon + label per type
  const getTooltipLabel = (cell: { type: string; label?: string }) => {
    const name = cell.label ?? '';
    switch (cell.type) {
      case 'inbound_ramp': return `📦 Inbound Ramp ${name}`;
      case 'staging_in': return `🛬 Inbound Staging ${name}`;
      case 'returns': return `↩️ Returns ${name}`;
      case 'high_rack': return `🏗️ High Rack ${name}`;
      case 'pick_zone': return `🛒 Pick Zone ${name}`;
      case 'staging_out': return `🚚 Outbound Staging ${name}`;
      case 'vas': return `🛠️ VAS ${name}`;
      case 'damaged': return `⚠️ Damaged Goods ${name}`;
      case 'packing': return `📦 Packing ${name}`;
      case 'outbound_ramp': return `📤 Outbound Ramp ${name}`;
      case 'comm': return '🧩 Commissioning';
      case 'road': return '🛣️ Road';
      case 'wall': return '🧱 Wall';
      default: return `❓ ${cell.type} ${name}`;
    }
  };

  // 🔧 Color mapping per zone
  const getCellColor = (type: string) => {
    const dark = theme.palette.mode === 'dark';
    const map: Record<string, string> = {
      inbound_ramp: dark ? '#6d8e4e' : '#aed581',
      staging_in: dark ? '#caa300' : '#fff176',
      returns: dark ? '#cc6d4d' : '#ffab91',
      high_rack: dark ? '#5472a4' : '#bbdefb',
      pick_zone: dark ? '#4a7b5d' : '#c8e6c9',
      staging_out: dark ? '#b97b00' : '#ffcc80',
      vas: dark ? '#8e659c' : '#e1bee7',
      damaged: dark ? '#b94c4c' : '#ef9a9a',
      packing: dark ? '#bfa700' : '#fff176',
      outbound_ramp: dark ? '#547ba4' : '#64b5f6',
      comm: dark ? '#a65757' : '#ffcdd2',
      road: dark ? '#424242' : '#eeeeee',
      wall: dark ? '#546e7a' : '#b0bec5',
    };
    return map[type] ?? (dark ? '#666666' : '#e0e0e0');
  };

  return (
    <Box sx={{ maxWidth: '1600px', margin: 'auto', p: 4 }}>
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

      <Dialog open={confirmReset} onClose={() => setConfirmReset(false)}>
        <DialogTitle>Are you sure you want to reset the layout?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmReset(false)}>Cancel</Button>
          <Button onClick={handleConfirmReset} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {layout ? (
        <>
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
                  title={getTooltipLabel(cell)}
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
                      backgroundColor: getCellColor(cell.type),
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
        </>
      ) : (
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

export default function WarehousePage() {
  return (
    <LayoutProvider>
      <WarehousePageInner />
    </LayoutProvider>
  );
}
