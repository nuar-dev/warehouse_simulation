// src/features/sim_settings/components/MasterDataSidebar.tsx
import React from 'react'
import {
  Box,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  IconButton,
  Typography,
  Divider,
  useTheme,
} from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'

export type SidebarNode = {
  id: string
  label: string
  children?: SidebarNode[]
}

interface SidebarProps {
  items: SidebarNode[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export default function MasterDataSidebar({
  items,
  selectedId,
  onSelect,
}: SidebarProps) {
  const theme = useTheme()
  const [open, setOpen] = React.useState(true)
  const [openMap, setOpenMap] = React.useState<Record<string, boolean>>({})

  // same vertical offset your <main> uses:
  const contentOffset = 'calc(var(--template-frame-height+200,0px) + 4px)'

  const handleToggleSidebar = () => setOpen((v) => !v)
  const handleToggleNode = (id: string) =>
    setOpenMap((m) => ({ ...m, [id]: !m[id] }))

  const ToggleButton = (
    <IconButton
      onClick={handleToggleSidebar}
      size="medium"
      sx={{
        position: 'fixed',
        right: open ? `280px` : 0,
        top: `calc(${contentOffset} + (100vh - ${contentOffset})/2 - 200px)`,
        zIndex: theme.zIndex.drawer + 1,
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
      }}
    >
      {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
    </IconButton>
  )

  if (!open) {
    return <>{ToggleButton}</>
  }

  const renderNode = (node: SidebarNode, depth = 0) => {
    const hasChildren = Array.isArray(node.children) && node.children.length > 0
    const isExpanded = !!openMap[node.id]

    return (
      <React.Fragment key={node.id}>
        <ListItemButton
          onClick={() =>
            hasChildren ? handleToggleNode(node.id) : onSelect(node.id)
          }
          selected={node.id === selectedId}
          sx={{ pl: 2 + depth * 2 }}
        >
          <ListItemText primary={node.label} />
          {hasChildren &&
            (isExpanded ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List disablePadding>
              {node.children!.map((child) => renderNode(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    )
  }

  return (
    <>
      {ToggleButton}
      <Paper
        square
        elevation={1}
        sx={{
          width: 280,
          position: 'fixed',
          right: 0,
          top: contentOffset,
          height: `calc(100vh - ${contentOffset})`,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderLeft: 1,
          borderColor: 'divider',
          zIndex: theme.zIndex.drawer,
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Simulation Settings</Typography>
        </Box>
        <Divider />
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <List disablePadding>
            {items.map((node) => renderNode(node))}
          </List>
        </Box>
      </Paper>
    </>
  )
}
