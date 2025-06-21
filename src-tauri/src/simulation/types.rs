// src-tauri/src/simulation/types.rs

use chrono::{DateTime, Utc};
use serde::Serialize;

/// What kind of work to do, including where from/to
#[derive(Debug, Clone, Serialize)]
pub enum TaskType {
    Pick {
        order_id: String,
        qty: u32,
        origin_bin: String,
        dest_bin: String,
    },
    // You can add Inbound, PutAway, etc. later
}

/// The lifecycle of a task
#[derive(Debug, Clone, Serialize)]
pub enum TaskState {
    Created,
    Assigned { worker_id: String },
    InProgress,
    Completed,
}

/// A single task, with its origin/dest bins & timing
#[derive(Debug, Clone, Serialize)]
pub struct Task {
    pub id: String,
    pub task_type: TaskType,
    pub state: TaskState,
    pub created_at: DateTime<Utc>,
    pub last_updated: DateTime<Utc>,
}
