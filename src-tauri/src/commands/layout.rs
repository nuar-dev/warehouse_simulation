// src-tauri/src/commands/layout.rs

use crate::models::warehouse::Warehouse;
use tauri::command;

/// Return the default warehouse layout
#[command]
pub fn get_default_layout() -> Warehouse {
    // this delegates to your layout module under src-tauri/src/layout
    crate::layout::get_default_layout()
}

/// Return _all_ warehouse layouts (default + any user-saved ones)
#[command]
pub fn get_all_layouts() -> Vec<Warehouse> {
    // TODO: append any saved custom layouts here
    vec![crate::layout::get_default_layout()]
}
