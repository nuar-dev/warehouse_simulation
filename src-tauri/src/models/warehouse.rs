// src-tauri/src/models/warehouse.rs

use crate::models::{
    item::Item, // your SKU/type data
    resource::Resource,
};
use serde::{Deserialize, Serialize};

/// A top‐level warehouse, possibly composed of multiple physical sections.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Warehouse {
    /// Unique warehouse identifier
    pub id: String,
    /// Human‐readable name
    pub name: String,

    /// One or more physical sections (e.g. halls, floors, buildings)
    pub sections: Vec<Section>,

    /// All storage zones/types and their bins.  
    /// A warehouse might have zero or many of these.
    pub storage_types: Vec<StorageType>,

    /// Equipment & staff available to run the warehouse.
    /// We also track each resource’s current position for simulation/animation.
    pub resources: Vec<Resource>,
}

/// A contiguous rectangular region within the warehouse (e.g. hall, floor, building).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Section {
    pub id: String,
    pub name: String,

    /// Section’s lower‐corner origin (meters, relative to site origin).
    pub origin: Point3,

    /// Section’s overall size (meters).
    pub size: Dimensions,
}

/// A point in 3D space (meters).
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Point3 {
    pub x: f32,
    pub y: f32,
    pub z: f32,
}

/// Physical dimensions (meters).
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Dimensions {
    pub length: f32,
    pub width: f32,
    pub height: f32,
}

impl Dimensions {
    /// Compute volume in cubic meters.
    pub fn volume(&self) -> f32 {
        self.length * self.width * self.height
    }
}

/// A grouping of bins with shared characteristics, inside one section.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StorageType {
    pub id: String,
    pub name: String,
    pub color: String,

    /// Which Section this zone lives in.
    pub section_id: String,

    /// Bins defined in that section’s coordinate space.
    pub bins: Vec<StorageBin>,

    /// Replenishment/picking strategies that apply here.
    pub strategies: Vec<ReplenishmentStrategy>,

    /// e.g. "pallet", "tote"—what handling units can live here
    pub handling_unit_type: Option<String>,

    pub temperature_zone: Option<String>,
    pub hazard_class: Option<String>,
    pub abc_class: Option<String>,
    pub automation_level: Option<String>,
    pub sort_sequence: Option<u8>,
    pub zone_category: ZoneCategory,
}

/// An individual storage slot in a section.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StorageBin {
    pub id: String,

    /// Bin’s lower‐corner origin in its section (meters).
    pub origin: Point3,

    /// Bin’s footprint/height (meters).
    pub size: Dimensions,

    pub storage_type_id: String,

    /// What this bin contains:
    /// - A single tote/container (and that container carries its own items), or
    /// - Loose items directly in the bin.
    pub contents: BinContent,
}

impl StorageBin {
    /// Maximum volume this bin can hold, in cubic meters.
    pub fn max_volume(&self) -> f32 {
        self.size.volume()
    }
}

/// The possible contents of a storage bin.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum BinContent {
    /// This bin holds exactly one container; that container’s `contents` list SKUs inside.
    Container { id: String },

    /// This bin holds loose items directly; each `(sku, qty)` pair.
    LooseItems(Vec<(String, u32)>),
}

/// A movable tote or container that can live in bins.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Container {
    pub id: String,
    pub container_type: String,
    pub contents: Vec<(String /* sku */, u32 /* qty */)>,
}

/// Categories of warehouse zones.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum ZoneCategory {
    // Building envelope
    Wall,
    Road,

    // Ramps & Buffers
    InboundRamp,
    OutboundRamp,
    InboundBuffer,
    OutboundBuffer,

    // Returns & Inspection
    GoodReceipt,
    Returns,
    QualityInspection,

    // Storage
    HighRunner,   // High‐speed pick racks
    MediumRunner, // mid‐speed storage
    LowRunner,    // bulk storage
    DangerousGoods,
    PickZone, // for chaotic/flow‐through picking
    InboundHighRack,
    // Commissioning & Packing
    Commissioning, // pre‐packing / staging
    Packing,       // final pack stations

    // Value‐added services
    VAS,

    // Kanban & Reserve (production feed)
    Reserve,
    Kanban,

    // Assembly benches
    Assembly,
    PostAssembly,

    // Material flow
    Conveyor,
    // Special Stock
    SpecialStock,
    //Placeholder for Warehouses Zones
    Other,
}

/// Strategies for replenishment/picking (SAP EWM + extensions).
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
