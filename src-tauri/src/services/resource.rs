// src-tauri/src/services/resource.rs

use crate::models::{Resource, ResourceCategory, Worker, WorkerRole};
use anyhow::Result;

/// Stub: fetch or load from SAP EWM if available, otherwise from local config
pub async fn load_resources() -> Result<Vec<Resource>> {
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
    ])
}

pub async fn load_workers() -> Result<Vec<Worker>> {
    Ok(vec![
        Worker {
            id: "P123".into(),
            name: "Alice Müller".into(),
            role: WorkerRole::Picker,
            icon_key: "picker".into(),
        },
        Worker {
            id: "G456".into(),
            name: "Bob Schneider".into(),
            role: WorkerRole::GrOperator,
            icon_key: "gr_operator".into(),
        },
    ])
}
