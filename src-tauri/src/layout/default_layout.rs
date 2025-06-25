// src-tauri/src/layout/default_layout.rs

use crate::models::warehouse::{
    Item, ReplenishmentStrategy, StorageBin, StorageType, Warehouse, ZoneCategory,
};
use std::ops::Range;

/// Anything that can produce a Warehouse layout.
pub trait LayoutSource {
    fn load(&self) -> Warehouse;
}

/// Built-in “default” layout provider.
pub struct DefaultLayout;
impl DefaultLayout {
    pub fn new() -> Self {
        DefaultLayout
    }
}

impl LayoutSource for DefaultLayout {
    fn load(&self) -> Warehouse {
        // Helper to generate bins for one zone
        let create_bins = |cfg: &ZoneConfig| {
            cfg.x_range
                .clone()
                .flat_map(move |x| {
                    cfg.y_range.clone().map(move |y| StorageBin {
                        id: format!("{}-{}-{}", cfg.prefix, x, y),
                        x,
                        y,
                        z: cfg.z,
                        width: cfg.width,
                        depth: cfg.depth,
                        height: cfg.height,
                        storage_type_id: cfg.id.clone(),
                    })
                })
                .collect::<Vec<_>>()
        };

        // Declarative list of every zone in the default layout
        let configs = vec![
            ZoneConfig {
                id: "inbound_ramp".into(),
                name: "Inbound Ramp".into(),
                color: "#aed581".into(),
                x_range: 0..4,
                y_range: 0..2,
                z: 0,
                prefix: "INR".into(),
                strategies: vec![ReplenishmentStrategy::Replenishment],
                handling_unit_type: Some("pallet".into()),
                temperature_zone: None,
                hazard_class: None,
                abc_class: None,
                automation_level: Some("manual".into()),
                sort_sequence: Some(1),
                zone_category: ZoneCategory::Inbound,
                width: 1.0,
                depth: 1.0,
                height: 1.0,
            },
            ZoneConfig {
                id: "staging_in".into(),
                name: "Inbound Staging".into(),
                color: "#fff176".into(),
                x_range: 4..10,
                y_range: 0..2,
                z: 0,
                prefix: "STGIN".into(),
                strategies: vec![ReplenishmentStrategy::Replenishment],
                handling_unit_type: Some("pallet".into()),
                temperature_zone: None,
                hazard_class: None,
                abc_class: None,
                automation_level: Some("manual".into()),
                sort_sequence: Some(2),
                zone_category: ZoneCategory::Inbound,
                width: 1.0,
                depth: 1.0,
                height: 1.0,
            },
            ZoneConfig {
                id: "returns".into(),
                name: "Returns".into(),
                color: "#ff8a65".into(),
                x_range: 10..14,
                y_range: 0..2,
                z: 0,
                prefix: "RET".into(),
                strategies: vec![ReplenishmentStrategy::ReturnStrategy],
                handling_unit_type: Some("box".into()),
                temperature_zone: None,
                hazard_class: None,
                abc_class: None,
                automation_level: Some("manual".into()),
                sort_sequence: Some(3),
                zone_category: ZoneCategory::Return,
                width: 1.0,
                depth: 1.0,
                height: 1.0,
            },
            ZoneConfig {
                id: "high_rack".into(),
                name: "High Rack".into(),
                color: "#90caf9".into(),
                x_range: 0..16,
                y_range: 4..12,
                z: 0,
                prefix: "HR".into(),
                strategies: vec![
                    ReplenishmentStrategy::VolumeBased,
                    ReplenishmentStrategy::BlockStorage,
                ],
                handling_unit_type: Some("pallet".into()),
                temperature_zone: Some("ambient".into()),
                hazard_class: None,
                abc_class: Some("C".into()),
                automation_level: Some("semi".into()),
                sort_sequence: Some(4),
                zone_category: ZoneCategory::LowRunner,
                width: 1.0,
                depth: 1.0,
                height: 1.0,
            },
            ZoneConfig {
                id: "pick_zone".into(),
                name: "Pick Zone".into(),
                color: "#a5d6a7".into(),
                x_range: 18..34,
                y_range: 4..12,
                z: 0,
                prefix: "PZ".into(),
                strategies: vec![
                    ReplenishmentStrategy::AbcAnalysis,
                    ReplenishmentStrategy::AccessFrequency,
                ],
                handling_unit_type: Some("box".into()),
                temperature_zone: None,
                hazard_class: None,
                abc_class: Some("A".into()),
                automation_level: Some("manual".into()),
                sort_sequence: Some(5),
                zone_category: ZoneCategory::HighRunner,
                width: 1.0,
                depth: 1.0,
                height: 1.0,
            },
            ZoneConfig {
                id: "comm".into(),
                name: "Commissioning".into(),
                color: "#ef9a9a".into(),
                x_range: 12..24,
                y_range: 13..15,
                z: 0,
                prefix: "COM".into(),
                strategies: vec![ReplenishmentStrategy::Picking],
                handling_unit_type: Some("box".into()),
                temperature_zone: None,
                hazard_class: None,
                abc_class: None,
                automation_level: Some("manual".into()),
                sort_sequence: Some(6),
                zone_category: ZoneCategory::HighRunner,
                width: 1.0,
                depth: 1.0,
                height: 1.0,
            },
            ZoneConfig {
                id: "staging_out".into(),
                name: "Staging Out".into(),
                color: "#ffb74d".into(),
                x_range: 26..34,
                y_range: 16..18,
                z: 0,
                prefix: "STGOUT".into(),
                strategies: vec![ReplenishmentStrategy::Replenishment],
                handling_unit_type: Some("pallet".into()),
                temperature_zone: None,
                hazard_class: None,
                abc_class: None,
                automation_level: Some("manual".into()),
                sort_sequence: Some(7),
                zone_category: ZoneCategory::Outbound,
                width: 1.0,
                depth: 1.0,
                height: 1.0,
            },
            ZoneConfig {
                id: "vas".into(),
                name: "VAS Area".into(),
                color: "#ce93d8".into(),
                x_range: 4..8,
                y_range: 14..16,
                z: 0,
                prefix: "VAS".into(),
                strategies: vec![ReplenishmentStrategy::VasProcess],
                handling_unit_type: Some("mixed".into()),
                temperature_zone: None,
                hazard_class: None,
                abc_class: None,
                automation_level: Some("manual".into()),
                sort_sequence: Some(8),
                zone_category: ZoneCategory::Outbound,
                width: 1.0,
                depth: 1.0,
                height: 1.0,
            },
            ZoneConfig {
                id: "damaged".into(),
                name: "Damaged Goods".into(),
                color: "#ef5350".into(),
                x_range: 8..12,
                y_range: 14..16,
                z: 0,
                prefix: "DMG".into(),
                strategies: vec![ReplenishmentStrategy::Quarantine],
                handling_unit_type: Some("box".into()),
                temperature_zone: None,
                hazard_class: Some("flammable".into()),
                abc_class: None,
                automation_level: Some("manual".into()),
                sort_sequence: Some(9),
                zone_category: ZoneCategory::DangerousGoods,
                width: 1.0,
                depth: 1.0,
                height: 1.0,
            },
            ZoneConfig {
                id: "packing".into(),
                name: "Packing".into(),
                color: "#fdd835".into(),
                x_range: 20..26,
                y_range: 16..18,
                z: 0,
                prefix: "PKG".into(),
                strategies: vec![ReplenishmentStrategy::PickAndPack],
                handling_unit_type: Some("box".into()),
                temperature_zone: None,
                hazard_class: None,
                abc_class: None,
                automation_level: Some("manual".into()),
                sort_sequence: Some(10),
                zone_category: ZoneCategory::HighRunner,
                width: 1.0,
                depth: 1.0,
                height: 1.0,
            },
            ZoneConfig {
                id: "outbound_ramp".into(),
                name: "Outbound Ramp".into(),
                color: "#64b5f6".into(),
                x_range: 30..36,
                y_range: 18..20,
                z: 0,
                prefix: "OUT".into(),
                strategies: vec![ReplenishmentStrategy::Replenishment],
                handling_unit_type: Some("pallet".into()),
                temperature_zone: None,
                hazard_class: None,
                abc_class: None,
                automation_level: Some("manual".into()),
                sort_sequence: Some(11),
                zone_category: ZoneCategory::Outbound,
                width: 1.0,
                depth: 1.0,
                height: 1.0,
            },
        ];

        // Map configs → StorageType
        let storage_types = configs
            .iter()
            .map(|cfg| StorageType {
                id: cfg.id.clone(),
                name: cfg.name.clone(),
                color: cfg.color.clone(),
                bins: create_bins(cfg),
                strategies: cfg.strategies.clone(),
                handling_unit_type: cfg.handling_unit_type.clone(),
                temperature_zone: cfg.temperature_zone.clone(),
                hazard_class: cfg.hazard_class.clone(),
                abc_class: cfg.abc_class.clone(),
                automation_level: cfg.automation_level.clone(),
                sort_sequence: cfg.sort_sequence,
                zone_category: cfg.zone_category.clone(),
            })
            .collect();

        // Return with an empty item catalog for now
        Warehouse {
            id: "default_layout".into(),
            name: "Default Layout".into(),
            length: 36,
            width: 20,
            height: 1,
            storage_types,
            items: Vec::new(),
        }
    }
}

/// Purely‐in‐memory definition of one zone’s shape + metadata.
struct ZoneConfig {
    id: String,
    name: String,
    color: String,
    x_range: Range<u32>,
    y_range: Range<u32>,
    z: u32,
    prefix: String,
    strategies: Vec<ReplenishmentStrategy>,
    handling_unit_type: Option<String>,
    temperature_zone: Option<String>,
    hazard_class: Option<String>,
    abc_class: Option<String>,
    automation_level: Option<String>,
    sort_sequence: Option<u8>,
    zone_category: ZoneCategory,
    width: f32,
    depth: f32,
    height: f32,
}
