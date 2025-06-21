// src-tauri/src/main.rs

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use tauri_plugin_window_state::Builder as WindowStateBuilder;

// --- Domain modules ---
mod layout;
mod models;
mod services;
mod simulation;
mod utils;

// --- Command modules ---
mod commands;

// --- Live commands ---
use commands::finance::load_company_codes;
use commands::layout::{get_all_layouts, get_default_layout};
use commands::procurement::load_vendors;
use commands::sales::load_customers;
use commands::warehouse::load_warehouse;

// --- Simulation command ---
use commands::sim::task::get_sim_tasks;

// --- Mock OData client ---
use services::MockODataClient;

fn main() {
    tauri::Builder::default()
        // Persist and restore window state
        .plugin(WindowStateBuilder::default().build())
        // Enable opening external links in the system browser
        .plugin(tauri_plugin_opener::init())
        // Register the mock client in application state so commands can access it
        .manage(MockODataClient::default())
        // Wire up all Tauri commands
        .invoke_handler(tauri::generate_handler![
            // Live mode
            load_warehouse,
            get_default_layout,
            get_all_layouts,
            load_vendors,
            load_customers,
            load_company_codes,
            // Simulation mode
            get_sim_tasks,
        ])
        // Application setup, e.g. disabling fullscreen by default
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            #[cfg(any(target_os = "windows", target_os = "macos", target_os = "linux"))]
            {
                window.set_fullscreen(false)?;
            }
            Ok(())
        })
        // Launch the Tauri event loop
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
