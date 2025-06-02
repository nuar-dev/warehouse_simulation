use tauri::{AppHandle, Manager, Window};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// Import the window state plugin builder
use tauri_plugin_window_state::Builder as WindowStateBuilder;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // Register the window state plugin for persisting window state
        .plugin(WindowStateBuilder::default().build())
        // Register your opener plugin
        .plugin(tauri_plugin_opener::init())
        // Register commands
        .invoke_handler(tauri::generate_handler![greet])
        // Setup logic on app start
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            #[cfg(any(target_os = "windows", target_os = "macos", target_os = "linux"))]
            {
                // Start not fullscreen but can toggle later via frontend
                window.set_fullscreen(false)?;
            }

            #[cfg(target_os = "android")]
            {
                // Placeholder for mobile-specific behavior
                // e.g. window.set_title("Mobile - unsupported");
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
