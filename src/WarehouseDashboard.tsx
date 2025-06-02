/*
    Boilerplate for a simple warehouse dashboard in React.
*/

import React, { useState } from "react";

export default function WarehouseDashboard() {
  // For now, fixed capacity 10, track occupied count in state
  const capacity = 10;
  const [occupied, setOccupied] = useState(0);

  const addItem = () => {
    if (occupied < capacity) setOccupied(occupied + 1);
  };

  const removeItem = () => {
    if (occupied > 0) setOccupied(occupied - 1);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Warehouse Dashboard</h1>
      <p>Capacity: {capacity}</p>
      <p>Occupied Slots: {occupied}</p>
      <button onClick={addItem} disabled={occupied >= capacity}>
        Add Item
      </button>
      <button onClick={removeItem} disabled={occupied <= 0} style={{ marginLeft: 10 }}>
        Remove Item
      </button>
    </div>
  );
}
