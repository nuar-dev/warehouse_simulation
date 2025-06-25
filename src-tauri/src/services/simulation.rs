// src-tauri/src/services/simulation.rs

use crate::models::warehouse::Warehouse;
use crate::services::warehouse::load_warehouse;
use anyhow::Result;

/// Parameters for a sim run
#[derive(serde::Deserialize)]
pub struct SimulationParams {
    pub duration_hours: u32,
    // add more knobs: arrival_rate, etc.
}

/// Result record (stub)
#[derive(serde::Serialize)]
pub struct KpiRecord {
    pub zone_id: String,
    pub metric: String,
    pub value: f64,
}

/// Run the simulation and return KPI records
pub async fn run_simulation(params: SimulationParams) -> Result<Vec<KpiRecord>> {
    // TODO: call into your simulation engine
    let wh: Warehouse = load_warehouse().await?;
    let mut out = Vec::new();
    for st in &wh.storage_types {
        out.push(KpiRecord {
            zone_id: st.id.clone(),
            metric: "avg_queue".into(),
            value: params.duration_hours as f64 * 0.1,
        });
    }
    Ok(out)
}
