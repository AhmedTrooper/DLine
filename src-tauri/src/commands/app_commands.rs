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
