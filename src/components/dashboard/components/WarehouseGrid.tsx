import * as React from 'react';
import {
  Box,
  Typography,
  Paper,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  useTheme,
} from '@mui/material';

type CellType = 'shelf' | 'road' | 'comm' | 'wall';

export interface Cell {
  type: CellType;
  label?: string;
}

interface WarehouseGridProps {
  layout?: Cell[][];
  layoutName?: string;
}

const STORAGE_KEY = 'warehouseLayout';
const FILENAME_KEY = 'warehouseFilename';

// Default layout
const generateDefaultLayout = (): Cell[][] =>
  Array.from({ length: 20 }, () =>
    Array.from({ length: 36 }, () => ({ type: 'road' }))
  );

export default function WarehouseGrid(props: WarehouseGridProps) {
  const theme = useTheme();

  const [layout, setLayout] = React.useState<Cell[][] | null>(props.layout ?? null);
  const [layoutName, setLayoutName] = React.useState<string>(props.layoutName ?? '');
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);

  // If no props given, load from storage or show dialog
  React.useEffect(() => {
    if (!props.layout) {
      const stored = localStorage.getItem(STORAGE_KEY);
      const name = localStorage.getItem(FILENAME_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setLayout(parsed);
            setLayoutName(name || 'Warehouse (demo)');
          }
        } catch {
          console.warn('Invalid saved layout.');
        }
      } else {
        setDialogOpen(true);
      }
    }
  }, [props.layout]);

  const handleLoadDefault = () => {
    const def = generateDefaultLayout();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(def));
    localStorage.setItem(FILENAME_KEY, 'Warehouse (demo)');
    setLayout(def);
    setLayoutName('Warehouse (demo)');
    setDialogOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          const name = file.name.replace(/\.[^/.]+$/, '');
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
          localStorage.setItem(FILENAME_KEY, name);
          setLayout(parsed);
          setLayoutName(name);
          setDialogOpen(false);
        } else {
          alert('Invalid layout format.');
        }
      } catch {
        alert('Failed to parse layout file.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearLayout = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(FILENAME_KEY);
    window.location.reload();
  };

  return (
    <Box sx={{ maxWidth: '1600px', margin: 'auto', p: 4 }}>
      {/* Popup when layout is missing */}
      <Dialog open={dialogOpen}>
        <DialogTitle>Select Warehouse Layout</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Button variant="contained" onClick={handleLoadDefault}>
              Load Default Layout
            </Button>
            <Button variant="contained" component="label">
              Load from File
              <input hidden type="file" accept=".json" onChange={handleFileUpload} />
            </Button>
            <Button variant="outlined" disabled>
              Define Custom Layout (coming soon)
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Header */}
      {layout && (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h4">{layoutName}</Typography>
            <Button size="small" onClick={handleClearLayout} variant="outlined">
              Clear & Reload
            </Button>
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
      )}

      {!layout && (
        <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
          No layout loaded. Please choose an option.
        </Typography>
      )}
    </Box>
  );
}
