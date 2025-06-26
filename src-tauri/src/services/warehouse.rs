// src-tauri/src/services/warehouse.rs

use crate::layout::default_layout::{DefaultLayout, LayoutSource};
use crate::models::warehouse::Warehouse;
use anyhow::Result;
use log::info;

/// Stub: load all warehouse master-data (sections, layout, bins, types, resources)
pub async fn load_warehouse() -> Result<Warehouse> {
    // 1) Generate the full layout (sections → storage_types → bins) + default resources
    let warehouse = DefaultLayout::new().load();

    info!(
        "Loaded warehouse '{}' with {} zones and {} resources",
        warehouse.id,
        warehouse.storage_types.len(),
        warehouse.resources.len()
    );
    Ok(warehouse)
}

/// Persist the entire Warehouse back to OData / DB / ORM
pub async fn save_warehouse(w: &Warehouse) -> Result<()> {
    // TODO: wire this up to OData endpoints or your ORM's save logic
    info!(
        "save_warehouse called: {} zones, {} resources",
        w.storage_types.len(),
        w.resources.len()
    );
    Ok(())
}
