use tauri::{Emitter, Window, WindowEvent};

pub fn handle_window_event(window: &Window, event: &WindowEvent) {
    if let WindowEvent::CloseRequested { api: _, .. } = event {
        // Log clean window close event
        let _ = window.emit("window-close-requested", ());
    }
}

pub fn minimize_window(window: Window) -> Result<(), String> {
    window.minimize().map_err(|e| e.to_string())
}

pub fn toggle_maximize_window(window: Window) -> Result<bool, String> {
    if window.is_maximized().map_err(|e| e.to_string())? {
        window.unmaximize().map_err(|e| e.to_string())?;
        Ok(false)
    } else {
        window.maximize().map_err(|e| e.to_string())?;
        Ok(true)
    }
}

pub fn close_window(window: Window) -> Result<(), String> {
    window.close().map_err(|e| e.to_string())
}
