// src/features/warehouse/components/LayoutTabs.tsx

import React from 'react';
import { Tabs, Tab, IconButton, Tooltip, Box, useTheme } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import { useLayoutContext } from '@/contexts/LayoutContext';

export default function LayoutTabs() {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const {
    layoutsMap,
    namesMap,
    activeId,
    setActiveLayout,
    removeLayout,
    openSelectorDialog,
  } = useLayoutContext();

  const layoutIds = Object.keys(layoutsMap);

  return (
    <Tabs
      value={activeId || ''}
      onChange={(_, newVal) => {
        if (newVal === 'ADD_TAB') openSelectorDialog();
        else setActiveLayout(newVal);
      }}
      variant="scrollable"
      scrollButtons="auto"
      TabIndicatorProps={{ style: { top: 0, height: 3 } }}
      sx={{ height: '100%' }}
    >
      {layoutIds.map((id) => (
        <Tab
          key={id}
          value={id}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              {namesMap[id] || id}
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  removeLayout(id);
                }}
                // give class for hover selector
                className="closeBtn"
                sx={{
                  opacity: 0,
                  transition: 'opacity 200ms',
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          }
          sx={{
            textTransform: 'none',
            minHeight: '100%',
            px: 1.5,
            // show close button on hover
            '&:hover .closeBtn': {
              opacity: 1,
            },
            // active‐tab background
            '&.Mui-selected': {
              bgcolor: isLight
                ? theme.palette.grey[300]
                : theme.palette.grey[800],
            },
          }}
        />
      ))}

      <Tab
        key="ADD_TAB"
        value="ADD_TAB"
        icon={
          <Tooltip title="Add Layout">
            <AddCircleOutlineIcon />
          </Tooltip>
        }
        aria-label="add layout"
        sx={{
          minHeight: '100%',
          '&.Mui-selected': {
            bgcolor: isLight
              ? theme.palette.grey[300]
              : theme.palette.grey[800],
          },
        }}
      />
    </Tabs>
  );
}
