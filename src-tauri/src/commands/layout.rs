// src-tauri/src/commands/layout.rs

use crate::models::warehouse::Warehouse;
use tauri::command;

#[command]
/// Return the default warehouse layout
pub fn get_default_layout() -> Warehouse {
    crate::layout::get_default_layout()
}
