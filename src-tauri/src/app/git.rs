use git2::{Repository, Signature};

#[tauri::command]
pub fn git_init(path: String) -> Result<(), String> {
    Repository::init(path).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn git_status(path: String) -> Result<Vec<String>, String> {
    let repo = Repository::open(path).map_err(|e| e.to_string())?;
    let mut opts = git2::StatusOptions::new();
    opts.include_untracked(true);
    let statuses = repo.statuses(Some(&mut opts)).map_err(|e| e.to_string())?;

    let mut modified = Vec::new();
    for entry in statuses.iter() {
        if let Ok(path) = entry.path() {
            modified.push(path.to_string());
        }
    }
    Ok(modified)
}

#[tauri::command]
pub fn git_commit(path: String, message: String) -> Result<(), String> {
    let repo = Repository::open(path).map_err(|e| e.to_string())?;

    let mut index = repo.index().map_err(|e| e.to_string())?;
    index
        .add_all(["*"].iter(), git2::IndexAddOption::DEFAULT, None)
        .map_err(|e| e.to_string())?;
    index.write().map_err(|e| e.to_string())?;

    let oid = index.write_tree().map_err(|e| e.to_string())?;
    let signature = Signature::now("DLine User", "user@dline.local").map_err(|e| e.to_string())?;

    let tree = repo.find_tree(oid).map_err(|e| e.to_string())?;

    let parent_commit = match repo.head() {
        Ok(head) => Some(head.peel_to_commit().map_err(|e| e.to_string())?),
        Err(_) => None,
    };

    if let Some(parent) = parent_commit {
        repo.commit(
            Some("HEAD"),
            &signature,
            &signature,
            &message,
            &tree,
            &[&parent],
        )
        .map_err(|e| e.to_string())?;
    } else {
        repo.commit(Some("HEAD"), &signature, &signature, &message, &tree, &[])
            .map_err(|e| e.to_string())?;
    }

    Ok(())
}
