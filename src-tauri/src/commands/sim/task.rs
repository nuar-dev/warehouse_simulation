// src-tauri/src/commands/sim/task.rs

use crate::services::MockODataClient;
use crate::simulation::types::Task;
use tauri::{command, State};

#[command]
/// Return the current simulation task list
pub async fn get_sim_tasks(client: State<'_, MockODataClient>) -> Result<Vec<Task>, String> {
    // Fully-qualified call into the inherent method
    let tasks = MockODataClient::get_tasks(&*client).await;
    Ok(tasks)
}
