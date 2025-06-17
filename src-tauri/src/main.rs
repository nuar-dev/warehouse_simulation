#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use tauri_plugin_window_state::Builder as WindowStateBuilder;

mod commands;
mod models;

use commands::layout::get_default_layout;

fn main() {
    tauri::Builder::default()
        .plugin(WindowStateBuilder::default().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_default_layout])
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
