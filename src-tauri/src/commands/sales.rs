// src-tauri/src/commands/sales.rs

use crate::models::sales::CustomerMaster;
use tauri::command;

#[command]
/// Load the list of customers from SAP
pub async fn load_customers() -> Result<Vec<CustomerMaster>, String> {
    crate::services::load_customers()
        .await
        .map_err(|e| e.to_string())
}
