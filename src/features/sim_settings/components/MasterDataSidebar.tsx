// src/features/sim_settings/components/MasterDataSidebar.tsx

import React, { useState, useMemo, MouseEvent } from 'react';
import {
  Paper,
  Box,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Example data—swap out for real master-data hooks later
const DATA: Record<string, string[]> = {
  'Storage Types': ['Pallet Rack', 'Carton Flow', 'Bulk Floor'],
  'Bins': ['BIN-001', 'BIN-002', 'BIN-A01'],
  'Hazard Classes': ['Class A', 'Class B', 'Class C'],
  'Resources': ['Forklift F1', 'Cart T2', 'Picker P123'],
};

export default function MasterDataSidebar() {
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [ctxItem, setCtxItem] = useState<string>('');

  // filter categories + items
  const filtered = useMemo(() => {
    if (!search) return DATA;
    const q = search.toLowerCase();
    const out: Record<string, string[]> = {};
    for (const [cat, items] of Object.entries(DATA)) {
      const matches = items.filter((i) => i.toLowerCase().includes(q));
      if (cat.toLowerCase().includes(q) || matches.length) {
        out[cat] = matches.length ? matches : items;
      }
    }
    return out;
  }, [search]);

  function onContext(e: MouseEvent<HTMLElement>, item: string) {
    e.preventDefault();
    setCtxItem(item);
    setAnchorEl(e.currentTarget);
  }
  function closeContext() {
    setAnchorEl(null);
    setCtxItem('');
  }

  return (
    <Paper
      square
      elevation={1}
      sx={{
        width: 280,
        height: '100%',
        p: 1,
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
    >
      <TextField
        placeholder="Search master data…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        fullWidth
        sx={{ mb: 1 }}
      />

      {Object.entries(filtered).map(([cat, items]) => (
        <Accordion key={cat} defaultExpanded={!!search}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">{cat}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <List dense>
              {items.map((it) => (
                <ListItemButton
                  key={it}
                  onContextMenu={(e) => onContext(e, it)}
                >
                  <ListItemText primary={it} />
                </ListItemButton>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeContext}
      >
        <MenuItem onClick={closeContext}>Edit “{ctxItem}”</MenuItem>
        <MenuItem onClick={closeContext}>Delete “{ctxItem}”</MenuItem>
        <MenuItem onClick={closeContext}>Add New…</MenuItem>
      </Menu>
    </Paper>
  );
}
