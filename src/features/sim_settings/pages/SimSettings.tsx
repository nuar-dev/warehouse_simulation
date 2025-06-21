// src/features/sim_settings/pages/SimSettings.tsx

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Slider,
  IconButton,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { useLayoutContext } from '@/contexts/LayoutContext';
import { DataSource, useDataSource } from '@/contexts/DataSourceContext';
import MasterDataSidebar from '../components/MasterDataSidebar';

interface PanelConfig {
  layoutId: string;
  dataSource: DataSource;
  spawnRate: number;
}

export default function SimSettings() {
  const theme = useTheme();
  const { layoutOrder, namesMap } = useLayoutContext();
  const layouts = layoutOrder.map((id) => ({ id, name: namesMap[id] }));
  const panelCount = layouts.length > 1 ? 2 : 1;

  const { source: globalSource, setSource: setGlobalSource } = useDataSource();

  // sidebar visibility
  const [showSidebar, setShowSidebar] = React.useState(true);

  // panel configs
  const [panels, setPanels] = React.useState<PanelConfig[]>(
    () =>
      layouts.slice(0, panelCount).map((l) => ({
        layoutId: l.id,
        dataSource: globalSource,
        spawnRate: 1,
      }))
  );
  React.useEffect(() => {
    setPanels((prev) =>
      layouts.slice(0, panelCount).map((l, i) => ({
        layoutId: l.id,
        dataSource: prev[i]?.dataSource ?? globalSource,
        spawnRate: prev[i]?.spawnRate ?? 1,
      }))
    );
  }, [layouts, panelCount, globalSource]);

  if (layouts.length === 0) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" color="text.secondary">
          No layouts defined. Create one in the Layout tab.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        gridTemplateColumns: showSidebar ? '1fr 280px' : '1fr',
        height: '100%',
      }}
    >
      {/* Top bar with sidebar toggle */}
      <Box
        sx={{
          gridColumn: '1 / -1',
          display: 'flex',
          alignItems: 'center',
          p: 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <IconButton onClick={() => setShowSidebar((v) => !v)}>
          {showSidebar ? <ChevronRightIcon /> : <MenuIcon />}
        </IconButton>
        <Typography variant="h6" sx={{ ml: 1 }}>
          Simulation Settings
        </Typography>
      </Box>

      {/* Main panels */}
      <Box sx={{ overflow: 'auto', p: 2 }}>
        <Grid container spacing={2}>
          {panels.map((cfg, i) => {
            const layout = layouts.find((l) => l.id === cfg.layoutId)!;
            return (
              <Grid
                key={i}
                size={{ xs: 12, md: panelCount === 2 ? 6 : 12 }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    {layout.name}
                  </Typography>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Data Source</InputLabel>
                    <Select<DataSource>
                      value={cfg.dataSource}
                      label="Data Source"
                      onChange={(e: SelectChangeEvent<DataSource>) => {
                        const ds = e.target.value as DataSource;
                        setPanels((p) => {
                          const nxt = [...p];
                          nxt[i].dataSource = ds;
                          return nxt;
                        });
                        setGlobalSource(ds);
                      }}
                    >
                      <MenuItem value="live">Live OData Stream</MenuItem>
                      <MenuItem value="simulation">Simulation (DES)</MenuItem>
                    </Select>
                  </FormControl>

                  {cfg.dataSource === 'simulation' ? (
                    <Box mt="auto">
                      <Typography gutterBottom>
                        Task Spawn Rate (tasks/sec)
                      </Typography>
                      <Slider
                        value={cfg.spawnRate}
                        onChange={(_, v) =>
                          setPanels((p) => {
                            const nxt = [...p];
                            nxt[i].spawnRate = v as number;
                            return nxt;
                          })
                        }
                        step={1}
                        marks
                        min={1}
                        max={10}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      mt="auto"
                      sx={{ fontStyle: 'italic' }}
                    >
                      Pulling live tasks for “{layout.name}”.
                    </Typography>
                  )}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Right sidebar */}
      {showSidebar && (
        <Box
          sx={{
            borderLeft: `1px solid ${theme.palette.divider}`,
            height: '100%',
            overflow: 'auto',
          }}
        >
          <MasterDataSidebar />
        </Box>
      )}
    </Box>
  );
}
