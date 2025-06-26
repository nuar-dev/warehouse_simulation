// src-tauri/src/models/item.rs

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

/// Physical dimensions (for slots, volume calcs, etc.)
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Dimensions {
    /// Length in meters
    pub length: f32,
    /// Width in meters
    pub width: f32,
    /// Height in meters
    pub height: f32,
}

/// Batch or lot metadata for serialized items
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct BatchInfo {
    /// The batch or lot number
    pub batch_number: String,
    /// Manufacturing or expiration timestamp
    pub manufacture_date: DateTime<Utc>,
}

/// An individual SKU within the warehouse (e.g. a tool or component)
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Item {
    /// Unique stock-keeping unit identifier
    pub sku: String,
    /// Human-readable name
    pub name: String,
    /// Flagged as high-velocity by ABC analysis
    pub is_high_runner: bool,
    /// Requires special handling (e.g. hazardous)
    pub is_dangerous: bool,
    /// Physical size for volume & slotting
    pub dimensions: Dimensions,
    /// Weight in kilograms
    pub weight: f32,
    /// Optional batch/lot information
    pub batch_info: Option<BatchInfo>,
    /// Optional expiration date
    pub expiry_date: Option<DateTime<Utc>>,
}
