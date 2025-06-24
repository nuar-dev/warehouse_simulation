// src/features/sim_settings/pages/SimSettings.tsx

import React from 'react'
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Slider,
  Switch,
  FormControlLabel,
  useTheme,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { SidebarNode } from '../components/MasterDataSidebar'
import MasterDataSidebar from '../components/MasterDataSidebar'
import { useLayoutContext } from '@/contexts/LayoutContext'
import { DataSource, useDataSource } from '@/contexts/DataSourceContext'
import { useSimulationSettings } from '@/contexts/SimulationSettingsContext'

function WarehousePanel({ layoutId }: { layoutId: string }) {
  const { namesMap } = useLayoutContext()
  return (
    <Box sx={{ width: '100%', height: '100%', bgcolor: '#f5f5f5', borderRadius: 1, position: 'relative' }}>
      <Typography sx={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', fontWeight: 'bold'
      }}>
        {namesMap[layoutId]}
      </Typography>
    </Box>
  )
}

export default function SimSettings() {
  const theme = useTheme()
  const { layoutOrder, namesMap } = useLayoutContext()
  const { source, setSource } = useDataSource()

  const sidebarTree: SidebarNode[] = [{ id: 'general', label: 'General Settings' }]
  const [selectedSection, setSelectedSection] = React.useState<string>('general')

  const [visibleLayouts, setVisibleLayouts] = React.useState<string[]>(() => layoutOrder.slice(0, 1))
  React.useEffect(() => {
    setVisibleLayouts((prev) => {
      const next = prev.filter((id) => layoutOrder.includes(id))
      return next.length ? next : layoutOrder.slice(0, 1)
    })
  }, [layoutOrder])

  const contentOffset = `calc(var(--template-frame-height,0px) + 4px)`
  const containerHeight = `calc(100vh - ${contentOffset})`

  return (
    <Box sx={{ display: 'flex', height: containerHeight, pt: contentOffset }}>
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header omitted for brevity */}

        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
          {selectedSection === 'general' ? (
            <>
              <FormControl sx={{ mb: 2, minWidth: 200 }} size="small">
                <InputLabel>Data Source</InputLabel>
                <Select<DataSource>
                  value={source}
                  label="Data Source"
                  onChange={(e: SelectChangeEvent<DataSource>) =>
                    setSource(e.target.value as DataSource)
                  }
                >
                  <MenuItem value="live">Live OData Stream</MenuItem>
                  <MenuItem value="simulation">Simulation (DES)</MenuItem>
                </Select>
              </FormControl>

              {source === 'simulation' && visibleLayouts.map((lid) => {
                const {
                  isRunning,
                  simInterval,
                  spawnRate,
                  setIsRunning,
                  setSimInterval,
                  setSpawnRate,
                } = useSimulationSettings(lid)

                return (
                  <Box key={lid} sx={{ mb: 4, p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {namesMap[lid]}
                    </Typography>

                    <FormControlLabel
                      control={<Switch checked={isRunning} onChange={(_, v) => setIsRunning(v)} />}
                      label="Simulation Running"
                    />

                    <Typography gutterBottom sx={{ mt: 2 }}>
                      Simulation Speed (ms/step)
                    </Typography>
                    <Slider
                      value={simInterval}
                      min={100}
                      max={2000}
                      step={100}
                      valueLabelDisplay="auto"
                      onChange={(_, v) => setSimInterval(v as number)}
                    />

                    <Typography gutterBottom sx={{ mt: 2 }}>
                      Spawn Rate (tasks/sec)
                    </Typography>
                    <Slider
                      value={spawnRate}
                      min={1}
                      max={20}
                      step={1}
                      valueLabelDisplay="auto"
                      onChange={(_, v) => setSpawnRate(v as number)}
                    />
                  </Box>
                )
              })}
            </>
          ) : (
            <Typography>
              Settings for “{sidebarTree.find((n) => n.id === selectedSection)?.label}”
            </Typography>
          )}

          <Grid container spacing={2} sx={{ mt: 2 }}>
            {visibleLayouts.map((lid) => (
              <Grid key={lid} size={{ xs: 12, md: visibleLayouts.length === 2 ? 6 : 12 }} sx={{ height: 300 }}>
                <WarehousePanel layoutId={lid} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      <MasterDataSidebar
        items={sidebarTree}
        selectedId={selectedSection}
        onSelect={setSelectedSection}
      />
    </Box>
  )
}
