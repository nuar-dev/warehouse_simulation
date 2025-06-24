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

export default function LayoutTabs() {
  const theme = useTheme();
  const dark = theme.palette.mode === 'dark';
  const {
    layoutOrder,
    namesMap,
    reorderLayout,
    openSelectorDialog,
    activeId,
    setActiveLayout,
    removeLayout,
  } = useLayoutContext();

  // DnD state
  const [isDragging, setIsDragging] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );
  const handleDragStart = (_: DragStartEvent) => setIsDragging(true);
  const handleDragEnd = (e: DragEndEvent) => {
    setIsDragging(false);
    const { active, over } = e;
    if (over && active.id !== over.id) {
      const oldIndex = layoutOrder.indexOf(active.id as string);
      const newIndex = layoutOrder.indexOf(over.id as string);
      reorderLayout(oldIndex, newIndex);
    }
  };

  // Map activeId → its index in layoutOrder (or -1)
  const activeIndex = layoutOrder.findIndex((id) => id === activeId);
  // If current activeId is missing, default to 0
  const normalized = activeIndex >= 0 ? activeIndex : 0;
  // The “+” tab will sit at index = layoutOrder.length
  const addTabIndex = layoutOrder.length;

  // Handler for Tab changes: receives numeric idx
  const handleChange = (_: React.SyntheticEvent, idx: number) => {
    if (idx === addTabIndex) {
      openSelectorDialog();
    } else {
      setActiveLayout(layoutOrder[idx]);
    }
  };

  // A draggable tab that renders a real <Tab> internally
  function SortableTab({ id, index }: { id: string; index: number }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging: dragging,
    } = useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: dragging ? 100 : undefined,
    };

    const isActive = id === activeId;

    return (
      <Tab
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        value={index}                      // numeric value!
        onClick={() => setActiveLayout(id)}
        label={
          <Box sx={{ position: 'relative', px: 1.5, py: 1, cursor: 'pointer' }}>
            {namesMap[id]}
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
                top: 4, right: 4,
                width: 20, height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                '&:hover': { opacity: 1 },
              }}
            >
              <CloseIcon fontSize="small" />
            </Box>
          </Box>
        }
        sx={{
          textTransform: 'none',
          height: 36,
          backgroundColor: isActive
            ? dark ? theme.palette.grey[800] : theme.palette.common.white
            : dark ? theme.palette.grey[700] : theme.palette.grey[200],
          color: isActive
            ? theme.palette.text.primary
            : theme.palette.text.secondary,
          fontWeight: isActive ? 'bold' : 'normal',
          boxShadow: isActive ? `inset 0 -2px 0 ${theme.palette.primary.main}` : 'none',
        }}
      />
    );
  }

  return (
    <Box sx={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: theme.palette.background.paper }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={layoutOrder} strategy={horizontalListSortingStrategy}>
          <Tabs
            value={normalized}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            TabIndicatorProps={{ style: { display: 'none' } }}
            sx={{ height: '100%' }}
          >
            {layoutOrder.map((id, idx) => (
              <SortableTab key={id} id={id} index={idx} />
            ))}

            <Tab
              value={addTabIndex}
              icon={<Tooltip title="Add Layout"><AddCircleOutlineIcon /></Tooltip>}
              sx={{
                height: 36,
                backgroundColor: dark ? theme.palette.grey[700] : theme.palette.grey[200],
                ml: 1,
              }}
            />
          </Tabs>
        </SortableContext>
      </DndContext>
    </Box>
  );
}
