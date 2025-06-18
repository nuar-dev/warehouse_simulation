// src/features/warehouse/components/LayoutTabs.tsx

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Tabs,
  Tab,
  Box,
  Tooltip,
  useTheme,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import { useLayoutContext } from '@/contexts/LayoutContext';

function SortableTab({ id }: { id: string }) {
  const theme = useTheme();
  const dark = theme.palette.mode === 'dark';
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 'auto',
  };

  const { namesMap, activeId, setActiveLayout, removeLayout } = useLayoutContext();
  const isActive = id === activeId;

  return (
    <Tab
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      value={id}
      onClick={() => setActiveLayout(id)}
      label={
        <Box
          sx={{
            position: 'relative',
            px: 1.5,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          {namesMap[id]}
          {/* replace IconButton with non-button span to avoid nesting */}
          <Box
            component="span"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Delete layout “${namesMap[id]}”?`)) {
                removeLayout(id);
              }
            }}
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              cursor: 'pointer',
              '&:hover': { opacity: 1 },
            }}
          >
            <CloseIcon fontSize="small" />
          </Box>
        </Box>
      }
      sx={{
        textTransform: 'none',
        minHeight: 0,
        height: 36,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        marginRight: -1,
        backgroundColor: isActive
          ? dark
            ? theme.palette.grey[800]
            : theme.palette.common.white
          : dark
          ? theme.palette.grey[700]
          : theme.palette.grey[200],
        color: isActive
          ? theme.palette.text.primary
          : theme.palette.text.secondary,
        fontWeight: isActive ? 'bold' : 'normal',
        boxShadow: isActive ? `inset 0 -2px 0 ${theme.palette.primary.main}` : 'none',
        '&:hover': {
          backgroundColor: dark ? theme.palette.grey[600] : theme.palette.grey[300],
        },
      }}
    />
  );
}

export default function LayoutTabs() {
  const theme = useTheme();
  const dark = theme.palette.mode === 'dark';
  const {
    layoutOrder,
    reorderLayout,
    openSelectorDialog,
    activeId,
  } = useLayoutContext();

  // track drag state to suppress invalid value warning
  const [isDragging, setIsDragging] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = (_: DragStartEvent) => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = layoutOrder.indexOf(active.id as string);
      const newIndex = layoutOrder.indexOf(over.id as string);
      reorderLayout(oldIndex, newIndex);
    }
  };

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={layoutOrder} strategy={horizontalListSortingStrategy}>
          <Tabs
            // only supply a valid value or false
            value={!isDragging && layoutOrder.includes(activeId as string) ? activeId : false}
            variant="scrollable"
            scrollButtons="auto"
            TabIndicatorProps={{ style: { display: 'none' } }}
            sx={{ height: '100%' }}
          >
            {layoutOrder.map((id) => (
              <SortableTab key={id} id={id} />
            ))}

            <Tab
              value="ADD_TAB"
              onClick={openSelectorDialog}
              icon={
                <Tooltip title="Add Layout">
                  <AddCircleOutlineIcon />
                </Tooltip>
              }
              sx={{
                minHeight: 0,
                height: 36,
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
                marginLeft: 1,
                backgroundColor: dark
                  ? theme.palette.grey[700]
                  : theme.palette.grey[200],
              }}
            />
          </Tabs>
        </SortableContext>
      </DndContext>
    </Box>
  );
}
