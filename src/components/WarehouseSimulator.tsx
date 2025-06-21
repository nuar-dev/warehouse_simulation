// src/components/WarehouseSimulator.tsx
import React from "react";
import { useWarehouseSimulation } from "../hooks/useWarehouseSimulation";

const CELL_SIZE = 20;
const PADDING = 2;

export function WarehouseSimulator() {
  const { layout, tasks } = useWarehouseSimulation();

  if (!layout) return <div>Loading layout…</div>;

  // build lookup from bin ID → (x,y)
  const binMap = new Map<string, { x: number; y: number }>();
  layout.storage_types.forEach((st) =>
    st.bins.forEach((b) => binMap.set(b.id, { x: b.x, y: b.y }))
  );

  const svgWidth = (layout.length + 1) * (CELL_SIZE + PADDING);
  const svgHeight = (layout.width + 1) * (CELL_SIZE + PADDING);

  return (
    <svg width={svgWidth} height={svgHeight} style={{ border: "1px solid #ccc" }}>
      {/* draw bins */}
      {layout.storage_types.map((st) =>
        st.bins.map((b) => (
          <rect
            key={b.id}
            x={b.x * (CELL_SIZE + PADDING)}
            y={b.y * (CELL_SIZE + PADDING)}
            width={CELL_SIZE}
            height={CELL_SIZE}
            fill={st.color}
            stroke="#555"
          />
        ))
      )}

      {/* draw task arrows */}
      {tasks.map((t) => {
        const pick = t.task_type.Pick;
        const o = binMap.get(pick.origin_bin);
        const d = binMap.get(pick.dest_bin);
        if (!o || !d) return null;
        const x1 = o.x * (CELL_SIZE + PADDING) + CELL_SIZE / 2;
        const y1 = o.y * (CELL_SIZE + PADDING) + CELL_SIZE / 2;
        const x2 = d.x * (CELL_SIZE + PADDING) + CELL_SIZE / 2;
        const y2 = d.y * (CELL_SIZE + PADDING) + CELL_SIZE / 2;
        return (
          <marker
            id={`arrow-${t.id}`}
            key={`marker-${t.id}`}
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L6,3 z" fill="red" />
          </marker>
        );
      })}

      {tasks.map((t) => {
        const pick = t.task_type.Pick;
        const o = binMap.get(pick.origin_bin);
        const d = binMap.get(pick.dest_bin);
        if (!o || !d) return null;
        const x1 = o.x * (CELL_SIZE + PADDING) + CELL_SIZE / 2;
        const y1 = o.y * (CELL_SIZE + PADDING) + CELL_SIZE / 2;
        const x2 = d.x * (CELL_SIZE + PADDING) + CELL_SIZE / 2;
        const y2 = d.y * (CELL_SIZE + PADDING) + CELL_SIZE / 2;
        return (
          <line
            key={`line-${t.id}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="red"
            strokeWidth={2}
            markerEnd={`url(#arrow-${t.id})`}
          />
        );
      })}
    </svg>
  );
}
