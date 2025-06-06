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
import WarehouseGrid, { Cell } from './WarehouseGrid';

const LOCAL_STORAGE_KEY = 'warehouseLayout';
const LOCAL_FILENAME_KEY = 'warehouseFilename';

const CenteredModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const defaultLayout: Cell[][] = Array.from({ length: 20 }, () =>
  Array.from({ length: 36 }, () => ({ type: 'road' }))
);

export default function WarehouseLoader() {
  const location = useLocation();
  const [layout, setLayout] = React.useState<Cell[][] | null>(null);
  const [layoutName, setLayoutName] = React.useState<string>('Warehouse (demo)');
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    const storedName = localStorage.getItem(LOCAL_FILENAME_KEY);
    if (location.pathname === '/warehouse') {
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setLayout(parsed);
            setLayoutName(storedName || 'Warehouse (demo)');
          }
        } catch {
          console.warn('Invalid saved layout.');
        }
      } else {
        setOpen(true);
      }
    }
  }, [location.pathname]);

  const handleLoadDefault = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultLayout));
    localStorage.setItem(LOCAL_FILENAME_KEY, 'Warehouse (demo)');
    setLayout(defaultLayout);
    setLayoutName('Warehouse (demo)');
    setOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const name = file.name.replace(/\.[^/.]+$/, '');
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
        localStorage.setItem(LOCAL_FILENAME_KEY, name);
        setLayout(parsed);
        setLayoutName(name);
        setOpen(false);
      } catch {
        alert('Invalid JSON layout file.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LOCAL_FILENAME_KEY);
    window.location.reload(); // or navigate('/warehouse') to trigger loader again
  };

  return (
    <>
      {/* Top bar with buttons if layout is loaded */}
      {layout && (
        <Box sx={{ position: 'sticky', top: 0, zIndex: 1000, bgcolor: 'background.paper', p: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" size="small" onClick={() => setOpen(true)}>
            Change Layout
          </Button>
          <Button variant="outlined" size="small" color="error" onClick={handleReset}>
            Reset Layout
          </Button>
        </Box>
      )}

      {/* Layout Selector Modal */}
      <CenteredModal open={open} onClose={() => setOpen(false)}>
        <Paper sx={{ p: 4, width: 400 }}>
          <Typography variant="h6" gutterBottom>
            Load Warehouse Layout
          </Typography>
          <Stack spacing={2}>
            <Button variant="contained" onClick={handleLoadDefault}>
              Use Default Layout
            </Button>
            <Button variant="contained" component="label">
              Upload Layout File
              <input type="file" accept=".json" hidden onChange={handleFileUpload} />
            </Button>
            <Button variant="outlined" disabled>
              Define Custom Layout (coming soon)
            </Button>
          </Stack>
        </Paper>
      </CenteredModal>

      {/* Render warehouse grid if layout is loaded */}
      {layout && <WarehouseGrid layout={layout} layoutName={layoutName} />}
    </>
  );
}
