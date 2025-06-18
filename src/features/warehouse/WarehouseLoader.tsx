// src/features/warehouse/components/WarehouseLoader.tsx

import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useLocation } from 'react-router-dom';
import { useLayoutContext } from '@/contexts/LayoutContext';
import LayoutSelectorDialog from './components/LayoutSelectorDialog';
import LayoutSettingsDialog from './components/LayoutSettingsDialog';
import Warehouse from './pages/Warehouse';

export default function WarehouseLoader() {
  const location = useLocation();
  const {
    layoutsMap,
    activeId,
    openSelector,
    openSelectorDialog,
    closeSelector,
    selectorClosed,
  } = useLayoutContext();

  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const layout = activeId ? layoutsMap[activeId] : null;

  // Auto‐open selector only if not already closed by user
  React.useEffect(() => {
    if (
      location.pathname === '/warehouse' &&
      !layout &&
      !openSelector &&
      !selectorClosed
    ) {
      openSelectorDialog();
    }
  }, [
    location.pathname,
    layout,
    openSelector,
    selectorClosed,
    openSelectorDialog,
  ]);

  return (
    <>
      {/* Dialogs */}
      <LayoutSelectorDialog open={openSelector} onClose={closeSelector} />
      <LayoutSettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      {/* The actual warehouse grid */}
        <Warehouse />
    </>
  );
}
