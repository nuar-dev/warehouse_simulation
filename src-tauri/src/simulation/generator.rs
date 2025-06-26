// src-tauri/src/simulation/generator.rs

use crate::layout::get_default_layout;
use crate::models::warehouse::ZoneCategory;
use crate::simulation::engine::Simulation;
use crate::simulation::transitions::default_zone_transitions;
use rand::prelude::*;
use rand::Rng;

/// For demo: every call, spawn between 0–2 new pick tasks and
/// route them through the zone‐transition graph.
pub fn generate_work(sim: &mut Simulation) {
    // 1) Grab the static layout & transition map
    let layout = get_default_layout();
    let transitions = default_zone_transitions();

    // 2) Build a vector of all bins per ZoneCategory
    let mut bins_by_zone: std::collections::HashMap<ZoneCategory, Vec<String>> =
        std::collections::HashMap::new();
    for st in &layout.storage_types {
        bins_by_zone
            .entry(st.zone_category.clone())
            .or_default()
            .extend(st.bins.iter().map(|b| b.id.clone()));
    }

    // 3) Spawn N new pick tasks
    let mut rng = thread_rng();
    let n = rng.gen_range(0..3);
    for i in 0..n {
        // start in InboundRamp
        let mut current_zone = ZoneCategory::InboundRamp;
        let mut origin_bin = {
            let vec = &bins_by_zone[&current_zone];
            vec.choose(&mut rng).unwrap().clone()
        };

        // Walk the Markov chain until we hit the final “OutboundRamp”
        let dest_bin = loop {
            let choices = &transitions[&current_zone];
            // pick one next zone by weight
            let total: f64 = choices.iter().map(|(_, w)| *w).sum();
            let mut pick = rng.gen_range(0.0..total);
            let mut next_zone = &choices[0].0;
            for (zone, w) in choices {
                if pick <= *w {
                    next_zone = zone;
                    break;
                }
                pick -= *w;
            }

            // select a random bin in that zone
            let bin_list = &bins_by_zone[next_zone];
            let chosen = bin_list.choose(&mut rng).unwrap().clone();

            // if we’ve reached OutboundRamp, that’s our dest
            if *next_zone == ZoneCategory::OutboundRamp {
                break chosen;
            }

            // else continue walking
            origin_bin = chosen.clone();
            current_zone = next_zone.clone();
        };

        // finally spawn the pick through Simulation
        sim.spawn_pick(
            &format!("ORDER-{}", sim.tasks.len() + 1),
            5 + i,
            origin_bin,
            dest_bin,
        );
    }
}
