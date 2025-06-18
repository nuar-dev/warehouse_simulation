// features/warehouse/components/WarehouseLoader.tsx

import React from 'react';
import {
  Box,
  Button,
  Stack,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useLayoutContext } from '@/contexts/LayoutContext';
import LayoutSettingsDialog from './components/LayoutSettingsDialog';
import LayoutSelectorDialog from './components/LayoutSelectorDialog';
import Warehouse from './pages/Warehouse';

export default function WarehouseLoader() {
  const location = useLocation();
  const {
    layout,
    openSelector,
    openSelectorDialog,
    resetLayout,
  } = useLayoutContext();

  const [settingsOpen, setSettingsOpen] = React.useState(false);

  React.useEffect(() => {
    if (location.pathname === '/warehouse' && !layout && !openSelector) {
      openSelectorDialog();
    }
  }, [location.pathname, layout, openSelector]);

  return (
    <>
      {layout && (
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            bgcolor: 'background.paper',
            p: 1,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" size="small" onClick={openSelectorDialog}>
              Change Layout
            </Button>
            <Button variant="outlined" size="small" onClick={() => setSettingsOpen(true)}>
              Settings
            </Button>
            <Button variant="outlined" size="small" color="error" onClick={resetLayout}>
              Reset Layout
            </Button>
          </Stack>
        </Box>
      )}

      <LayoutSelectorDialog />
      <LayoutSettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      <Warehouse />
    </>
  );
}
