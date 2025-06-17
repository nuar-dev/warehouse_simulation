use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct Warehouse {
    pub id: String,
    pub dimensions: (u32, u32, u32),
    pub storage_types: Vec<StorageType>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct StorageType {
    pub id: String,
    pub name: String,
    pub color: String,
    pub bins: Vec<StorageBin>,
    pub strategies: Vec<String>,            // ✅ Already discussed
    pub section_type: Option<String>,       // 🧠 SAP: GR_ZONE, GI_ZONE, etc.
    pub max_capacity: Option<u32>,          // 📦 Max items zone can hold
    pub handling_unit_type: Option<String>, // 📦 Pallet, Tote, etc.
    pub temperature_zone: Option<String>,   // ❄️ Cold chain logic
    pub hazard_class: Option<String>,       // ⚠️ Dangerous goods
    pub abc_class: Option<String>,          // 🔤 A, B, C
    pub automation_level: Option<String>,   // 🤖 Manual / Semi / Full
    pub sort_sequence: Option<u8>,          // 🔢 GI/GR order control
}

#[derive(Serialize, Deserialize, Clone)]
pub struct StorageBin {
    pub id: String,
    pub x: u32,
    pub y: u32,
    pub section: Option<String>,
    pub storage_type_id: String,
}
