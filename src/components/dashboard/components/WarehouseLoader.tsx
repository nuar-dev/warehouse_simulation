// src/components/dashboard/components/WarehouseLoader.tsx

import * as React from 'react';
import {
  Box,
  Button,
  Typography,
  Modal,
  Paper,
  Stack,
  styled,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import WarehouseGrid from './WarehouseGrid';
import { useLayoutContext } from '../../../contexts/LayoutContext';

const CenteredModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export default function WarehouseLoader() {
  const location = useLocation();
  const {
    layout,
    layoutName,
    openSelector,
    loadDefaultLayout,
    loadLayoutFromFile,
    resetLayout,
    closeSelector,
    openSelectorDialog,
  } = useLayoutContext();

  // Trigger modal only when entering /warehouse
  React.useEffect(() => {
    if (location.pathname === '/warehouse' && !layout) {
      openSelectorDialog();
    }
  }, [location.pathname, layout, openSelectorDialog]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadLayoutFromFile(file);
  };

  return (
    <>
      {layout && (
        <Box sx={{ position: 'sticky', top: 0, zIndex: 1000, bgcolor: 'background.paper', p: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" size="small" onClick={openSelectorDialog}>
            Change Layout
          </Button>
          <Button variant="outlined" size="small" color="error" onClick={resetLayout}>
            Reset Layout
          </Button>
        </Box>
      )}

      <CenteredModal open={openSelector} onClose={closeSelector}>
        <Paper sx={{ p: 4, width: 400 }}>
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
        </Paper>
      </CenteredModal>

      {layout && <WarehouseGrid />}
    </>
  );
}
