use crate::models::{Resource, Worker};
use tauri::command;

#[command]
/// Get all equipment (forklifts, carts, etc.)
pub async fn get_resources() -> Result<Vec<Resource>, String> {
    crate::services::load_resources()
        .await
        .map_err(|e| e.to_string())
}

#[command]
/// Get all warehouse workers
pub async fn get_workers() -> Result<Vec<Worker>, String> {
    crate::services::load_workers()
        .await
        .map_err(|e| e.to_string())
}
