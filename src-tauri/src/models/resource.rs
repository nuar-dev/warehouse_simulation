// src/models/resource.rs

use serde::{Deserialize, Serialize};

/// A physical or human resource in the warehouse
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Resource {
    pub id: String,   // unique key, e.g. "FL-01" or "CART-03"
    pub name: String, // e.g. "Forklift A1", "Yellow Cart #3"
    pub category: ResourceCategory,
    pub icon_key: String,      // used by the UI for icon lookup
    pub capacity: Option<u32>, // e.g. max load, or number of bins it can carry
}

/// A human actor (picker, GR operator)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Worker {
    pub id: String,   // e.g. personnel number
    pub name: String, // display name
    pub role: WorkerRole,
    pub icon_key: String, // e.g. "picker", "supervisor"
}

/// Enumerations for UI grouping
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ResourceCategory {
    Forklift,
    Cart,
    Conveyor,
    Tug,
    Other(String),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum WorkerRole {
    Picker,
    GrOperator,
    GiOperator,
    Supervisor,
    Other(String),
}
