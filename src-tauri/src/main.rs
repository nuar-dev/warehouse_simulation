// src-tauri/src/main.rs

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// First, declare all of your library modules live under src-tauri/src/
mod layout;
mod models;
mod services;
mod utils;

// Then your command modules
mod commands;

use tauri::Manager;
use tauri_plugin_window_state::Builder as WindowStateBuilder;

// Import each command you want to expose
use commands::finance::load_company_codes;
use commands::layout::get_default_layout;
use commands::procurement::load_vendors;
use commands::sales::load_customers;
use commands::warehouse::load_warehouse;

fn main() {
    tauri::Builder::default()
        // Persist and restore window state
        .plugin(WindowStateBuilder::default().build())
        // Support opening external links
        .plugin(tauri_plugin_opener::init())
        // Register all of your Tauri commands
        .invoke_handler(tauri::generate_handler![
            load_warehouse,
            get_default_layout,
            load_vendors,
            load_customers,
            load_company_codes,
        ])
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            #[cfg(any(target_os = "windows", target_os = "macos", target_os = "linux"))]
            {
                window.set_fullscreen(false)?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
