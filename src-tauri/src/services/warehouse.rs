// src/services/warehouse.rs
use crate::models::warehouse::Warehouse;
use anyhow::Result;

/// Stub: load all warehouse master-data (layout, bins, types)
pub async fn load_warehouse() -> Result<Warehouse> {
    // TODO: call OData, deserialize into Warehouse
    Ok(Warehouse {
        id: "stub".into(),
        name: "Stub Warehouse".into(),
        length: 0,
        width: 0,
        height: 0,
        storage_types: vec![],
    })
}
