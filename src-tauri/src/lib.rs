pub mod app;
pub mod commands;

use app::lifecycle::AppLifecycleState;
use commands::app_commands::*;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! Welcome to DLine.", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let lifecycle_state = AppLifecycleState::new();

    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .manage(lifecycle_state)
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            #[cfg(all(desktop, not(test)))]
            {
                app::tray::create_tray(app.handle())?;
                let menu = tauri::menu::Menu::default(app.handle())?;
                app.set_menu(menu)?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            get_app_instance_record,
            mark_app_window_ready,
            mark_app_ready,
            mark_app_failed,
            minimize_app_window,
            toggle_maximize_app_window,
            close_app_window,
            open_session_in_new_window,
            open_ghost_panel,
            open_right_sidebar_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
