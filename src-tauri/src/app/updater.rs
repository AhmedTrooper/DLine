use std::time::Duration;
use tauri::{AppHandle, Emitter};
use tauri_plugin_updater::UpdaterExt;

pub fn start_update_polling(app: AppHandle) {
    tauri::async_runtime::spawn(async move {
        // Initial delay before first check
        tokio::time::sleep(Duration::from_secs(10)).await;

        loop {
            if let Ok(updater) = app.updater() {
                if let Ok(Some(update)) = updater.check().await {
                    // Inform frontend that an update is available
                    let _ = app.emit(
                        "update-status",
                        serde_json::json!({
                            "status": "ready",
                            "version": update.version,
                        }),
                    );
                }
            }
            // Poll every 30 minutes
            tokio::time::sleep(Duration::from_secs(30 * 60)).await;
        }
    });
}

#[tauri::command]
pub async fn check_for_update_now(app: AppHandle) -> Result<Option<String>, String> {
    let updater = app.updater().map_err(|e| e.to_string())?;
    if let Some(update) = updater.check().await.map_err(|e| e.to_string())? {
        Ok(Some(update.version))
    } else {
        Ok(None)
    }
}

#[tauri::command]
pub async fn apply_update_and_relaunch(app: AppHandle) -> Result<(), String> {
    let updater = app.updater().map_err(|e| e.to_string())?;
    if let Some(update) = updater.check().await.map_err(|e| e.to_string())? {
        let mut downloaded = 0;
        update
            .download_and_install(
                |chunk_length, content_length| {
                    downloaded += chunk_length;
                    let _ = app.emit(
                        "app-update-progress",
                        serde_json::json!({
                            "progress": if let Some(total) = content_length {
                                (downloaded as f64 / total as f64) * 100.0
                            } else {
                                0.0
                            }
                        }),
                    );
                },
                || {
                    let _ = app.emit(
                        "update-status",
                        serde_json::json!({
                            "status": "installing",
                        }),
                    );
                },
            )
            .await
            .map_err(|e| e.to_string())?;

        app.restart();
    }
    Ok(())
}
