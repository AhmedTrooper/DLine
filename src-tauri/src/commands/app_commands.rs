use crate::app::lifecycle::{AppDevInstanceRecord, AppLifecycleState, AppStateStatus};
use crate::app::window;
use tauri::{State, Window};

#[tauri::command]
pub fn get_app_instance_record(
    state: State<'_, AppLifecycleState>,
) -> Result<AppDevInstanceRecord, String> {
    Ok(state.get_instance_record())
}

#[tauri::command]
pub fn mark_app_window_ready(state: State<'_, AppLifecycleState>) -> Result<(), String> {
    state.set_status(AppStateStatus::WindowReady, None);
    Ok(())
}

#[tauri::command]
pub fn mark_app_ready(state: State<'_, AppLifecycleState>) -> Result<(), String> {
    state.set_status(AppStateStatus::Ready, None);
    Ok(())
}

#[tauri::command]
pub fn mark_app_failed(state: State<'_, AppLifecycleState>, reason: String) -> Result<(), String> {
    state.set_status(AppStateStatus::Failed, Some(reason));
    Ok(())
}

#[tauri::command]
pub fn minimize_app_window(window: Window) -> Result<(), String> {
    window::minimize_window(window)
}

#[tauri::command]
pub fn toggle_maximize_app_window(window: Window) -> Result<bool, String> {
    window::toggle_maximize_window(window)
}

#[tauri::command]
pub fn close_app_window(window: Window) -> Result<(), String> {
    window::close_window(window)
}

#[tauri::command]
pub fn open_session_in_new_window(app: tauri::AppHandle, session_id: String) -> Result<(), String> {
    use tauri::{Manager, WebviewWindowBuilder};
    let label = format!("session_{}", session_id.replace("-", "_"));

    if let Some(win) = app.get_webview_window(&label) {
        let _ = win.show();
        let _ = win.set_focus();
        return Ok(());
    }

    let url = format!("index.html#/?secondaryWindow=1&bootSession={}", session_id);
    let builder = WebviewWindowBuilder::new(&app, label, tauri::WebviewUrl::App(url.into()))
        .title("DLine")
        .inner_size(1280.0, 800.0)
        .min_inner_size(800.0, 600.0)
        .transparent(true);

    #[cfg(target_os = "macos")]
    let builder = builder
        .title_bar_style(tauri::TitleBarStyle::Overlay)
        .hidden_title(true);

    #[cfg(not(target_os = "macos"))]
    let builder = builder.decorations(false);

    builder.build().map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn open_ghost_panel(app: tauri::AppHandle) -> Result<(), String> {
    use tauri::{Manager, WebviewWindowBuilder};
    let label = "ghost_panel";

    if let Some(win) = app.get_webview_window(label) {
        let _ = win.show();
        let _ = win.set_focus();
        return Ok(());
    }

    let builder = WebviewWindowBuilder::new(
        &app,
        label,
        tauri::WebviewUrl::App("index.html#/ghost".into()),
    )
    .title("DLine Ghost")
    .inner_size(400.0, 600.0)
    .always_on_top(true)
    .decorations(false)
    .transparent(true)
    .skip_taskbar(true);

    builder.build().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn open_right_sidebar_window(app: tauri::AppHandle) -> Result<(), String> {
    use tauri::{Manager, WebviewWindowBuilder};
    let label = "right_sidebar";

    if let Some(win) = app.get_webview_window(label) {
        let _ = win.show();
        let _ = win.set_focus();
        return Ok(());
    }

    let builder = WebviewWindowBuilder::new(
        &app,
        label,
        tauri::WebviewUrl::App("index.html#/sidebar".into()),
    )
    .title("DLine Tools")
    .inner_size(400.0, 800.0)
    .min_inner_size(300.0, 600.0)
    .transparent(true);

    #[cfg(target_os = "macos")]
    let builder = builder
        .title_bar_style(tauri::TitleBarStyle::Overlay)
        .hidden_title(true);

    #[cfg(not(target_os = "macos"))]
    let builder = builder.decorations(false);

    builder.build().map_err(|e| e.to_string())?;
    Ok(())
}
