// src-tauri/src/commands/finance.rs

use crate::models::finance::CompanyCode;
use tauri::command;

#[command]
/// Load the list of company codes from SAP
pub async fn load_company_codes() -> Result<Vec<CompanyCode>, String> {
    crate::services::load_company_codes()
        .await
        .map_err(|e| e.to_string())
}
