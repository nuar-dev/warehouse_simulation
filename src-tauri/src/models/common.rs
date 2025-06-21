// src/models/common.rs
use serde::{Deserialize, Serialize};

/// A generic DocumentType (e.g. PO, Sales Order, Delivery)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DocumentType {
    pub code: String,
    pub description: String,
}

/// A generic MovementType (e.g. 101 GR, 201 GI)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MovementType {
    pub code: String,
    pub description: String,
}
