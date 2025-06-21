// src-tauri/src/commands/warehouse.rs

use crate::models::warehouse::Warehouse;
use tauri::command;

#[command]
/// Load the full SAP warehouse master‐data (bins, types, etc.)
pub async fn load_warehouse() -> Result<Warehouse, String> {
    crate::services::load_warehouse()
        .await
        .map_err(|e| e.to_string())
}
