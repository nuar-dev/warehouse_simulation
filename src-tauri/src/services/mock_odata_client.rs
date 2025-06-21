// src-tauri/src/services/mock_odata_client.rs

use crate::simulation::types::Task;
use crate::simulation::{engine::Simulation, generator};
use chrono::Utc;
use once_cell::sync::Lazy;
use std::sync::Mutex;

/// A globally shared, thread-safe simulation instance
static SIM: Lazy<Mutex<Simulation>> = Lazy::new(|| Mutex::new(Simulation::new(Utc::now())));

/// Mock OData client that drives the in-memory DES and returns a TaskSet
#[derive(Default)]
pub struct MockODataClient;

impl MockODataClient {
    /// Advance the simulation, spawn new work, and return current tasks
    pub async fn get_tasks(&self) -> Vec<Task> {
        // Lock the simulator
        let mut sim = SIM.lock().unwrap();
        // Inject new work
        generator::generate_work(&mut *sim);
        // Advance clock to “now”
        sim.run_to(Utc::now());
        // Clone and return the current tasks
        sim.tasks.clone()
    }
}
