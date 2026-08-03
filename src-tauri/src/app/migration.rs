use std::path::{Path, PathBuf};
use std::sync::Arc;
use tauri::{AppHandle, Emitter, Manager};
use tokio::fs;
use tokio::sync::Mutex;

const MARKER_FILENAME: &str = "mToc";
const MEDIA_DIR_NAME: &str = "dline-media";
const DIALOGUES_DIR_NAME: &str = "dialogues";
const BROWSER_RUNTIME_DIR: &str = "browser-runtime";
const BROWSER_PROFILES_SUBDIR: &str = "browser";
const CURRENT_BROWSER_PROFILE: &str = "DLine";

#[derive(Clone, serde::Serialize)]
pub struct MigrationState {
    phase: String,
}

pub struct MigrationConfirmState {
    pub pending: Arc<Mutex<bool>>,
    pub confirmed: Arc<tokio::sync::Notify>,
}

#[tauri::command]
pub async fn confirm_migration(
    state: tauri::State<'_, MigrationConfirmState>,
) -> Result<(), String> {
    let mut pending = state.pending.lock().await;
    if *pending {
        *pending = false;
        state.confirmed.notify_one();
    }
    Ok(())
}

#[tauri::command]
pub async fn get_migration_state() -> Result<MigrationState, String> {
    // Stub for frontend
    Ok(MigrationState {
        phase: "done".into(),
    })
}

pub async fn run_migration(app: &AppHandle) -> Result<(), String> {
    let user_data = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let marker_path = user_data.join(MARKER_FILENAME);

    if fs::metadata(&marker_path).await.is_ok() {
        return Ok(());
    }

    // Legacy dirs check (focus, xdt-maker) -> DLine
    let parent_dir = user_data.parent().ok_or("No parent dir")?;
    let legacy_names = ["focus", "xdt-maker", "cindy"];

    let mut found_legacy: Option<PathBuf> = None;
    for name in legacy_names {
        let candidate = parent_dir.join(name);
        if fs::metadata(&candidate).await.is_ok() {
            found_legacy = Some(candidate);
            break;
        }
    }

    let legacy_dir = match found_legacy {
        Some(dir) => dir,
        None => {
            // Write marker silently
            fs::write(&marker_path, "{}").await.unwrap_or(());
            return Ok(());
        }
    };

    // UI Confirm phase
    let state = app.state::<MigrationConfirmState>();
    *state.pending.lock().await = true;
    app.emit(
        "legacy-migration:state",
        MigrationState {
            phase: "confirm".into(),
        },
    )
    .unwrap_or(());

    state.confirmed.notified().await;
    app.emit(
        "legacy-migration:state",
        MigrationState {
            phase: "running".into(),
        },
    )
    .unwrap_or(());

    // Copy media
    let legacy_media = legacy_dir.join(MEDIA_DIR_NAME); // Assuming old was also dline-media for simplicity or mapped
    if fs::metadata(&legacy_media).await.is_ok() {
        let _ = copy_dir_recursive(&legacy_media, &user_data.join(MEDIA_DIR_NAME)).await;
    }

    // Copy dialogues
    let legacy_dialogues = legacy_dir.join(DIALOGUES_DIR_NAME);
    if fs::metadata(&legacy_dialogues).await.is_ok() {
        let _ = copy_dir_recursive(&legacy_dialogues, &user_data.join(DIALOGUES_DIR_NAME)).await;
    }

    // Copy browser profile
    let legacy_profile = legacy_dir
        .join(BROWSER_RUNTIME_DIR)
        .join(BROWSER_PROFILES_SUBDIR)
        .join("XDMaker");
    if fs::metadata(&legacy_profile).await.is_ok() {
        let dest = user_data
            .join(BROWSER_RUNTIME_DIR)
            .join(BROWSER_PROFILES_SUBDIR)
            .join(CURRENT_BROWSER_PROFILE);
        let _ = copy_dir_recursive(&legacy_profile, &dest).await;
    }

    fs::write(&marker_path, r#"{"schemaVersion":1,"migratedAt":""}"#)
        .await
        .unwrap_or(());
    app.emit(
        "legacy-migration:state",
        MigrationState {
            phase: "done".into(),
        },
    )
    .unwrap_or(());

    Ok(())
}

use async_recursion::async_recursion;
#[async_recursion]
async fn copy_dir_recursive(src: &Path, dest: &Path) -> std::io::Result<()> {
    fs::create_dir_all(dest).await?;
    let mut entries = fs::read_dir(src).await?;
    while let Some(entry) = entries.next_entry().await? {
        let ty = entry.file_type().await?;
        if ty.is_dir() {
            copy_dir_recursive(&entry.path(), &dest.join(entry.file_name())).await?;
        } else if ty.is_file() {
            fs::copy(entry.path(), dest.join(entry.file_name())).await?;
        }
    }
    Ok(())
}
