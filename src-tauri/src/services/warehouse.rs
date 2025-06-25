// src-tauri/src/services/warehouse.rs

use crate::layout::default_layout::{DefaultLayout, LayoutSource};
use crate::models::warehouse::{Item, Warehouse};
use anyhow::Result;
use log::info;

/// Stub: load all warehouse master-data (layout, bins, types, items)
pub async fn load_warehouse() -> Result<Warehouse> {
    // 1) Generate the full layout (all zones & bins)
    let mut warehouse = DefaultLayout::new().load();

    // 2) Stub: populate your item catalog (for ABC/Kanban logic)
    //    TODO: replace with OData/ORM fetch + real ABC analysis
    warehouse.items = vec![
        Item {
            sku: "A-100".into(),
            name: "Widget Alpha".into(),
            is_high_runner: true,
            is_dangerous: false,
        },
        Item {
            sku: "B-200".into(),
            name: "Gadget Beta".into(),
            is_high_runner: false,
            is_dangerous: true,
        },
        Item {
            sku: "C-300".into(),
            name: "Component Gamma".into(),
            is_high_runner: false,
            is_dangerous: false,
        },
    ];

    info!(
        "Loaded warehouse '{}' with {} storage_types and {} items",
        warehouse.id,
        warehouse.storage_types.len(),
        warehouse.items.len()
    );
    Ok(warehouse)
}

/// Persist the entire Warehouse back to OData / DB / ORM
pub async fn save_warehouse(w: &Warehouse) -> Result<()> {
    // TODO: wire this up to OData endpoints or your ORM's save logic
    info!(
        "save_warehouse called: {} storage_types, {} items",
        w.storage_types.len(),
        w.items.len()
    );
    Ok(())
}
