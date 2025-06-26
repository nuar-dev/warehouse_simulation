// src-tauri/src/main.rs

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::thread;

use actix_web::{App, HttpServer};
use env_logger;
use log::{error, info};
use tauri::{Manager, WindowEvent};
use tauri_plugin_window_state::Builder as WindowStateBuilder;

// --- Domain modules ---
mod api;
mod layout;
mod models;
mod services;
mod simulation;
mod utils;

// --- Command modules ---
mod commands;

// --- Live commands ---
use commands::layout::{get_all_layouts, get_default_layout};
use commands::warehouse::load_warehouse;

// --- Simulation command ---
use commands::sim::task::get_sim_tasks;

// --- Mock OData client ---
use services::MockODataClient;

// --- Actix route configurators ---
use api::{
    configure_items_routes, configure_resource_routes, configure_simulation_routes,
    configure_strategies_routes, configure_warehouse_routes,
};

fn main() {
    // 0) Initialize logger for both Actix and Tauri
    env_logger::init();

    // 1) Build the Actix server, exit if port is taken
    let server = HttpServer::new(|| {
        App::new()
            .configure(configure_warehouse_routes)
            .configure(configure_items_routes)
            .configure(configure_simulation_routes)
            .configure(configure_strategies_routes)
            .configure(configure_resource_routes)
    })
    .bind("127.0.0.1:8080")
    .unwrap_or_else(|err| {
        error!("Failed to bind HTTP server to 127.0.0.1:8080: {}", err);
        std::process::exit(1);
    })
    .run();

    // Capture handle for graceful shutdown
    let server_handle = server.handle();

    // 2) Spawn Actix in a background thread
    thread::spawn(move || {
        actix_web::rt::System::new().block_on(server);
    });

    // 3) Launch the Tauri application
    tauri::Builder::default()
        // Persist and restore window state
        .plugin(WindowStateBuilder::default().build())
        // Enable opening external links
        .plugin(tauri_plugin_opener::init())
        // Provide the mock client to commands
        .manage(MockODataClient::default())
        // Register Tauri commands
        .invoke_handler(tauri::generate_handler![
            load_warehouse,
            get_default_layout,
            get_all_layouts,
            get_sim_tasks,
        ])
        // Initial window setup (disable fullscreen)
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            #[cfg(any(target_os = "windows", target_os = "macos", target_os = "linux"))]
            {
                window.set_fullscreen(false)?;
            }
            Ok(())
        })
        // Graceful shutdown: stop the HTTP server when the window closes
        .on_window_event(move |_window, event| {
            if let WindowEvent::CloseRequested { .. } = event {
                info!("Window close requested; stopping HTTP server…");
                server_handle.stop(true);
            }
        })
        // Run Tauri event loop
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
