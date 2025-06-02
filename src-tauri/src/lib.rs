use tauri::{AppHandle, Manager, Window};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|app| {
            // Get main window
            let window = app.get_webview_window("main").unwrap();

            // Check platform at compile time
            #[cfg(any(target_os = "windows", target_os = "macos", target_os = "linux"))]
            {
                // On desktop platforms, set fullscreen
                window.set_fullscreen(true)?;
            }

            #[cfg(target_os = "android")]
            {
                // For now, maybe show a dialog or leave normal window
                // Example: window.set_title("Mobile - unsupported");
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
