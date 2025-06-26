// src-tauri/src/services/resource.rs

use crate::models::{Resource, ResourceCategory, Worker, WorkerRole};
use anyhow::Result;
use log::info;

/// Fetch or load resources (e.g. forklifts, carts)
pub async fn load_resources() -> Result<Vec<Resource>> {
    // TODO: replace with OData or ORM fetch
    Ok(vec![
        Resource {
            id: "FL-01".into(),
            name: "Forklift A1".into(),
            category: ResourceCategory::Forklift,
            icon_key: "forklift".into(),
            capacity: Some(1500),
        },
        Resource {
            id: "CART-03".into(),
            name: "Cart #3".into(),
            category: ResourceCategory::Cart,
            icon_key: "cart".into(),
            capacity: Some(50),
        },
        // default sample resource for reference
        Resource {
            id: "CONV-1".into(),
            name: "Conveyor Line 1".into(),
            category: ResourceCategory::Conveyor,
            icon_key: "conveyor".into(),
            capacity: None,
        },
    ])
}

/// Persist updated resources back to OData / DB
pub async fn save_resources(resources: &[Resource]) -> Result<()> {
    // TODO: persist via OData or ORM
    info!("save_resources: {} entries", resources.len());
    Ok(())
}

/// Fetch or load workers (roles defined for engineering-tools manufacturing)
pub async fn load_workers() -> Result<Vec<Worker>> {
    // TODO: replace with OData or ORM fetch
    Ok(vec![
        // default sample worker for reference
        Worker {
            id: "W-000".into(),
            name: "Max Mustermann".into(),
            role: WorkerRole::Supervisor,
            icon_key: "supervisor".into(),
        },
        Worker {
            id: "P123".into(),
            name: "Alice Müller".into(),
            role: WorkerRole::Picker,
            icon_key: "picker".into(),
        },
        Worker {
            id: "F456".into(),
            name: "Bernd Schmidt".into(),
            role: WorkerRole::ForkliftDriver,
            icon_key: "forklift_driver".into(),
        },
    ])
}

/// Persist updated workers back to OData / DB
pub async fn save_workers(workers: &[Worker]) -> Result<()> {
    // TODO: persist via OData or ORM
    info!("save_workers: {} entries", workers.len());
    Ok(())
}
