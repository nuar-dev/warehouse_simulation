// src-tauri/src/commands/procurement.rs

use crate::models::procurement::VendorMaster;
use tauri::command;

#[command]
/// Load the list of vendors from SAP
pub async fn load_vendors() -> Result<Vec<VendorMaster>, String> {
    crate::services::load_vendors()
        .await
        .map_err(|e| e.to_string())
}
