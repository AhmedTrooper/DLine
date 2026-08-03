use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub enum AppStateStatus {
    Starting,
    WindowReady,
    Ready,
    Failed,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppDevInstanceRecord {
    pub schema_version: u32,
    pub instance_id: String,
    pub pid: u32,
    pub started_at_ms: u64,
    pub updated_at_ms: u64,
    pub status: AppStateStatus,
    pub failure_reason: Option<String>,
}

pub struct AppLifecycleState {
    pub status: Mutex<AppStateStatus>,
    pub instance_record: Mutex<AppDevInstanceRecord>,
}

impl Default for AppLifecycleState {
    fn default() -> Self {
        Self::new()
    }
}

impl AppLifecycleState {
    pub fn new() -> Self {
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or_default()
            .as_millis() as u64;

        let pid = std::process::id();
        let instance_id = uuid::Uuid::new_v4().to_string();

        Self {
            status: Mutex::new(AppStateStatus::Starting),
            instance_record: Mutex::new(AppDevInstanceRecord {
                schema_version: 1,
                instance_id,
                pid,
                started_at_ms: now,
                updated_at_ms: now,
                status: AppStateStatus::Starting,
                failure_reason: None,
            }),
        }
    }

    pub fn set_status(&self, new_status: AppStateStatus, failure: Option<String>) {
        if let Ok(mut status_guard) = self.status.lock() {
            *status_guard = new_status.clone();
        }

        if let Ok(mut record_guard) = self.instance_record.lock() {
            let now = SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap_or_default()
                .as_millis() as u64;

            record_guard.status = new_status;
            record_guard.updated_at_ms = now;
            record_guard.failure_reason = failure;
        }
    }

    pub fn get_instance_record(&self) -> AppDevInstanceRecord {
        self.instance_record
            .lock()
            .map(|guard| guard.clone())
            .unwrap_or_else(|_| AppDevInstanceRecord {
                schema_version: 1,
                instance_id: "unknown".to_string(),
                pid: std::process::id(),
                started_at_ms: 0,
                updated_at_ms: 0,
                status: AppStateStatus::Failed,
                failure_reason: Some("Lock poisoned".to_string()),
            })
    }
}
