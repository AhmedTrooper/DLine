use std::sync::{Arc, Mutex};
use std::time::Duration;
use tauri::{AppHandle, Manager, WebviewWindow};

pub struct BootGuardState {
    alive: Arc<Mutex<bool>>,
}

impl BootGuardState {
    pub fn new() -> Self {
        Self {
            alive: Arc::new(Mutex::new(false)),
        }
    }

    pub fn mark_alive(&self) {
        if let Ok(mut alive) = self.alive.lock() {
            *alive = true;
        }
    }

    pub fn is_alive(&self) -> bool {
        if let Ok(alive) = self.alive.lock() {
            *alive
        } else {
            false
        }
    }
}

pub fn start_boot_guard(window: WebviewWindow, app: AppHandle) {
    let state = app.state::<BootGuardState>();
    let alive = state.alive.clone();

    tauri::async_runtime::spawn(async move {
        // Wait 30 seconds for the frontend to mark itself as alive
        tokio::time::sleep(Duration::from_secs(30)).await;

        let is_alive = {
            if let Ok(a) = alive.lock() {
                *a
            } else {
                false
            }
        };

        if !is_alive {
            println!(
                "[BootGuard] Renderer failed to signal alive within 30s. Triggering reload..."
            );
            // Force reload ignoring cache in dev mode
            #[cfg(debug_assertions)]
            {
                let _ = window.eval("window.location.reload(true)");
            }
        }
    });
}
