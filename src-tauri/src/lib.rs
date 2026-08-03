pub mod app;
pub mod commands;

use commands::app_commands::*;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! Welcome to DLine.", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let lifecycle_state = app::lifecycle::AppLifecycleState::new();
    let boot_guard_state = app::boot_guard::BootGuardState::new();

    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            Some(vec![]),
        ))
        .plugin(tauri_plugin_cli::init())
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            use tauri::{Emitter, Manager};
            if let Some(main_win) = app.get_webview_window("main") {
                let _ = main_win.show();
                let _ = main_win.set_focus();
                // Optionally handle _args to open the directory
                let _ = app.emit("cli-args", _args);
            }
        }))
        .manage(lifecycle_state)
        .manage(boot_guard_state)
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .setup(|app| {
            #[cfg(all(desktop, not(test)))]
            {
                app::tray::create_tray(app.handle())?;
                let menu = tauri::menu::Menu::default(app.handle())?;
                app.set_menu(menu)?;
                app::updater::start_update_polling(app.handle().clone());
                app::ghost::start_ghost_worker(app.handle().clone());

                use tauri::Manager;
                if let Some(main_win) = app.get_webview_window("main") {
                    app::boot_guard::start_boot_guard(main_win, app.handle().clone());
                }
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
            open_right_sidebar_window,
            app::updater::check_for_update_now,
            app::updater::apply_update_and_relaunch,
            set_window_vibrancy,
            get_idle_time
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
