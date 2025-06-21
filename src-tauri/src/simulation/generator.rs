// src-tauri/src/simulation/generator.rs

use crate::layout::get_default_layout;
use crate::simulation::engine::Simulation;
use rand::seq::SliceRandom; // ← bring choose() into scope
use rand::Rng;

/// For demo: every call, spawn between 0–2 new pick tasks
pub fn generate_work(sim: &mut Simulation) {
    let layout = get_default_layout();

    // collect pick‐zone bins
    let pick_bins: Vec<_> = layout
        .storage_types
        .iter()
        .find(|t| t.id == "pick_zone")
        .map(|t| t.bins.iter().map(|b| b.id.clone()).collect())
        .unwrap_or_default();

    // collect staging‐out bins
    let dest_bins: Vec<_> = layout
        .storage_types
        .iter()
        .find(|t| t.id == "staging_out")
        .map(|t| t.bins.iter().map(|b| b.id.clone()).collect())
        .unwrap_or_default();

    let mut rng = rand::thread_rng();
    let n = rng.gen_range(0..3); // 0–2 tasks
    for i in 0..n {
        // choose random origin & dest
        if let (Some(orig), Some(dest)) = (pick_bins.choose(&mut rng), dest_bins.choose(&mut rng)) {
            sim.spawn_pick("ORDER-001", 5 + i, orig.clone(), dest.clone());
        }
    }
}
