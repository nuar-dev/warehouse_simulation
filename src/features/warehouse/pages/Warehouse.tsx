// features/warehouse/pages/Warehouse.tsx

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Tooltip,
  useTheme,
} from '@mui/material';
import { useLayoutContext } from '@/contexts/LayoutContext';
import { getCellColor, getTooltipLabel } from '@/utils/warehouse';

export default function Warehouse() {
  const { layout, layoutName } = useLayoutContext();
  const theme = useTheme();
  const dark = theme.palette.mode === 'dark';

  if (!layout) {
    return (
      <Box textAlign="center" mt={8}>
        <Typography variant="h6" color="text.secondary">
          Please load a warehouse layout.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1600px', margin: 'auto', p: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">{layoutName}</Typography>
      </Box>

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
            <Tooltip key={`${rowIndex}-${colIndex}`} title={getTooltipLabel(cell.type,cell.label)} arrow>
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
  );
}
