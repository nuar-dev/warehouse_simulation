// src-tauri/src/layout/mod.rs

pub mod default_layout;

use crate::models::warehouse::Warehouse;
use default_layout::{DefaultLayout, LayoutSource};

/// Returns the “default” warehouse layout.
pub fn get_default_layout() -> Warehouse {
    DefaultLayout::new().load()
}
