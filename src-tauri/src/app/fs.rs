use std::io::Write;
use std::path::Path;
use tempfile::NamedTempFile;

#[tauri::command]
pub fn atomic_write_file(path: String, contents: String) -> Result<(), String> {
    let target_path = Path::new(&path);

    // Create a temporary file in the same directory as the target
    let dir = target_path.parent().unwrap_or_else(|| Path::new("."));

    let mut temp_file =
        NamedTempFile::new_in(dir).map_err(|e| format!("Failed to create temp file: {}", e))?;

    temp_file
        .write_all(contents.as_bytes())
        .map_err(|e| format!("Failed to write to temp file: {}", e))?;

    temp_file
        .persist(target_path)
        .map_err(|e| format!("Failed to persist temp file: {}", e))?;

    Ok(())
}
