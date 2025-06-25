// src-tauri/src/models/warehouse.rs

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct Warehouse {
    pub id: String,
    pub name: String,
    pub length: u32,
    pub width: u32,
    pub height: u32, // number of vertical layers
    pub storage_types: Vec<StorageType>,
    pub items: Vec<Item>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct StorageType {
    pub id: String,
    pub name: String,
    pub color: String,
    pub bins: Vec<StorageBin>,
    /// Strongly-typed strategies instead of raw strings
    pub strategies: Vec<ReplenishmentStrategy>,
    pub handling_unit_type: Option<String>, // e.g. "pallet", "tote"
    pub temperature_zone: Option<String>,   // e.g. "ambient", "cold"
    pub hazard_class: Option<String>,       // e.g. "flammable"
    pub abc_class: Option<String>,          // A/B/C classification
    pub automation_level: Option<String>,   // "manual", "semi", "full"
    pub sort_sequence: Option<u8>,          // ordering hint for staging
    pub zone_category: ZoneCategory,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct StorageBin {
    pub id: String,
    pub x: u32,                  // horizontal coordinate
    pub y: u32,                  // floor coordinate
    pub z: u32,                  // vertical layer
    pub width: f32,              // in meters
    pub depth: f32,              // in meters
    pub height: f32,             // in meters
    pub storage_type_id: String, // which StorageType owns this bin
}

#[derive(Serialize, Deserialize, Clone, PartialEq, Eq)]
pub enum ZoneCategory {
    Inbound,
    HighRunner,
    MediumRunner,
    LowRunner,
    DangerousGoods,
    Outbound,
    Kanban,
    Reserve,
    Return,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Item {
    pub sku: String,
    pub name: String,
    pub is_high_runner: bool,
    pub is_dangerous: bool,
    // later: dimensions, weight, batch info, expiry_date, etc.
}

/// All SAP EWM strategies (from Appendix B + extensions)
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq)]
pub enum ReplenishmentStrategy {
    AbcAnalysis,
    Slotting,
    AccessFrequency,
    Fifo,
    Lifo,
    VolumeBased,
    BlockStorage,
    Quarantine,
    QualityInspection,
    BatchMandatory,
    HazardClassControl,
    RestrictedAccessArea,
    VasProcess,
    WorkstationOriented,
    Replenishment,
    ReserveStorage,
    ProductionSupply,
    Picking,
    MultiOrderPicking,
    PickAndPack,
    AutoReplenishment,
    DemandDrivenTransfer,
    ReturnStrategy,
    RepostingLogic,
}
