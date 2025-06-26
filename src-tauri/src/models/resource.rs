// src-tauri/src/models/resource.rs

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

/// A human actor (picker, GR operator, etc.)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Worker {
    pub id: String,   // e.g. personnel number
    pub name: String, // display name
    pub role: WorkerRole,
    pub icon_key: String, // e.g. "picker", "supervisor"
}

/// Enumerations for UI grouping of equipment
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ResourceCategory {
    Forklift,
    Cart,
    Conveyor,
    Tug,
    Other(String),
}

/// All relevant human roles in an engineering‐tools warehouse & production facility
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum WorkerRole {
    /// Picker (Kommissionierer/in)
    Picker,
    /// Forklift Driver (Staplerfahrer/in)
    ForkliftDriver,
    /// Warehouse Associate (Lagermitarbeiter/in)
    WarehouseAssociate,
    /// Goods‐Receipt Clerk (Wareneingangsmitarbeiter/in)
    GoodsReceiptClerk,
    /// Shipping Clerk (Warenausgangsmitarbeiter/in)
    ShippingClerk,
    /// Packer (Verpacker/in)
    Packer,
    /// Quality Inspector (Qualitätsprüfer/in)
    QualityInspector,
    /// Maintenance Technician (Instandhalter/in)
    MaintenanceTechnician,
    /// Production Operator (Produktionsmitarbeiter/in)
    ProductionOperator,
    /// Materials Planner (Materialdisponent/in)
    MaterialsPlanner,
    /// Kanban Coordinator (Kanban‐Beauftragte/r)
    KanbanCoordinator,
    /// Logistics Manager (Logistikleiter/in)
    LogisticsManager,
    /// Supply Chain Coordinator (Supply‐Chain‐Koordinator/in)
    SupplyChainCoordinator,
    //Supervisor (e.g. team lead)
    Supervisor,
    /// Any other custom role
    Other(String),
}
