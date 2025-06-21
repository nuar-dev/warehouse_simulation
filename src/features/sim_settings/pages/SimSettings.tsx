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
  useTheme,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { SidebarNode } from '../components/MasterDataSidebar'
import MasterDataSidebar from '../components/MasterDataSidebar'
import { useLayoutContext } from '@/contexts/LayoutContext'
import { DataSource, useDataSource } from '@/contexts/DataSourceContext'

function WarehousePanel({ layoutId }: { layoutId: string }) {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        bgcolor: '#f5f5f5',
        borderRadius: 1,
        position: 'relative',
      }}
    >
      <Typography
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        Layout {layoutId}
      </Typography>
    </Box>
  )
}

export default function SimSettings() {
  const theme = useTheme()
  const { layoutOrder, namesMap } = useLayoutContext()
  const { source, setSource } = useDataSource()

  // which sidebar sections to show
  const sidebarTree: SidebarNode[] = [
    { id: 'general', label: 'General Settings' },
    {
      id: 'bins',
      label: 'Bin Master Data',
      children: [
        { id: 'bins.list', label: 'All Bins' },
        { id: 'bins.sizes', label: 'Bin Sizes' },
        { id: 'bins.hazard', label: 'Hazard Classes' },
      ],
    },
    {
      id: 'resources',
      label: 'Resources & Workers',
      children: [
        { id: 'resources.workers', label: 'Personnel' },
        { id: 'resources.equipment', label: 'Equipment' },
      ],
    },
    {
      id: 'zones',
      label: 'Zone Definitions',
      children: [
        { id: 'zones.pick', label: 'Pick Zones' },
        { id: 'zones.storage', label: 'Storage Zones' },
      ],
    },
  ]

  // sidebar selection
  const [selectedSection, setSelectedSection] = React.useState<string>('general')

  // determine one or two panels
  const [visibleLayouts, setVisibleLayouts] = React.useState<string[]>(
    () => layoutOrder.slice(0, 1)
  )
  React.useEffect(() => {
    // sync if layouts change
    setVisibleLayouts((prev) => {
      const next = prev.filter((id) => layoutOrder.includes(id))
      return next.length ? next : layoutOrder.slice(0, 1)
    })
  }, [layoutOrder])

  // per-layout spawn rates (for simulation)
  const [spawnRates, setSpawnRates] = React.useState<Record<string, number>>(
    () => Object.fromEntries(layoutOrder.map((id) => [id, 1]))
  )

  // height offset so we sit below App header
  const contentOffset = `calc(var(--template-frame-height,0px) + 4px)`
  const containerHeight = `calc(100vh - ${contentOffset})`

  return (
    <Box sx={{ display: 'flex', height: containerHeight, pt: contentOffset }}>
      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Middle Header: layout pickers */}
        <Box
          sx={{
            flexShrink: 0,
            borderBottom: `1px solid ${theme.palette.divider}`,
            px: 2,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
            overflowX: 'auto',
            backgroundColor: theme.palette.background.paper,
          }}
        >
          {visibleLayouts.map((lid, idx) => (
            <FormControl key={lid} size="small">
              <InputLabel>Layout {idx + 1}</InputLabel>
              <Select<string>
                value={lid}
                label={`Layout ${idx + 1}`}
                onChange={(e: SelectChangeEvent<string>) =>
                  setVisibleLayouts((prev) => {
                    const next = [...prev]
                    next[idx] = e.target.value
                    return next
                  })
                }
              >
                {layoutOrder.map((orderId) => (
                  <MenuItem key={orderId} value={orderId}>
                    {namesMap[orderId]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
          {visibleLayouts.length < 2 && layoutOrder.length > 1 && (
            <Typography
              variant="button"
              sx={{ cursor: 'pointer', color: 'primary.main' }}
              onClick={() => {
                const nextId = layoutOrder.find((id) => !visibleLayouts.includes(id))!
                setVisibleLayouts((v) => [...v, nextId])
              }}
            >
              + Add Layout
            </Typography>
          )}
        </Box>

        {/* Scrollable body */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
          {/* Section Content */}
          {selectedSection === 'general' ? (
            <>
              <FormControl sx={{ mb: 2, minWidth: 200 }} size="small">
                <InputLabel>Data Source</InputLabel>
                <Select<DataSource>
                  value={source}
                  label="Data Source"
                  onChange={(e) => setSource(e.target.value as DataSource)}
                >
                  <MenuItem value="live">Live OData Stream</MenuItem>
                  <MenuItem value="simulation">Simulation (DES)</MenuItem>
                </Select>
              </FormControl>

              {source === 'simulation' &&
                visibleLayouts.map((lid) => (
                  <Box key={lid} sx={{ mb: 3, width: 300 }}>
                    <Typography gutterBottom>
                      {namesMap[lid]} spawn rate (tasks/sec)
                    </Typography>
                    <Slider
                      value={spawnRates[lid]}
                      min={1}
                      max={10}
                      step={1}
                      valueLabelDisplay="auto"
                      onChange={(_, v) =>
                        setSpawnRates((prev) => ({
                          ...prev,
                          [lid]: v as number,
                        }))
                      }
                    />
                  </Box>
                ))}
            </>
          ) : (
            <Typography variant="body1">
              Settings for “{sidebarTree
                .find((n) => n.id === selectedSection)?.label}” will go here.
            </Typography>
          )}

          {/* Layout Panels */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {visibleLayouts.map((lid) => (
              <Grid
                key={lid}
                size={{
                  xs: 12,
                  md: visibleLayouts.length === 2 ? 6 : 12,
                }}
                sx={{ height: 300 }}
              >
                <WarehousePanel layoutId={lid} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Sidebar */}
      <MasterDataSidebar
        items={sidebarTree}
        selectedId={selectedSection}
        onSelect={setSelectedSection}
      />
    </Box>
  )
}
