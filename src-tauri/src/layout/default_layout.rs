// src-tauri/src/layout/default_layout.rs

use crate::models::warehouse::{
    BinContent, Dimensions, Point3, ReplenishmentStrategy, Section, StorageBin, StorageType,
    Warehouse, ZoneCategory,
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

/// Generate a grid of 1×1×2 m bins for a zone, empty by default.
fn create_bins(
    zone_id: &str,
    x_rng: Range<u32>,
    y_rng: Range<u32>,
    bin_size: &Dimensions,
    section_origin: &Point3,
) -> Vec<StorageBin> {
    let mut bins = Vec::new();
    for xi in x_rng {
        for yi in y_rng.clone() {
            bins.push(StorageBin {
                id: format!("{}-{:02}-{:02}", zone_id, xi, yi),
                origin: Point3 {
                    x: section_origin.x + xi as f32 * bin_size.length,
                    y: section_origin.y + yi as f32 * bin_size.width,
                    z: section_origin.z,
                },
                size: bin_size.clone(),
                storage_type_id: zone_id.into(),
                contents: BinContent::LooseItems(vec![]),
            });
        }
    }
    bins
}

impl LayoutSource for DefaultLayout {
    fn load(&self) -> Warehouse {
        // 1) Define main section
        let main_section = Section {
            id: "main".into(),
            name: "Main Hall".into(),
            origin: Point3 {
                x: 0.0,
                y: 0.0,
                z: 0.0,
            },
            size: Dimensions {
                length: 50.0,
                width: 30.0,
                height: 6.0,
            },
        };

        // 2) Common bin size
        let bin_size = Dimensions {
            length: 1.0,
            width: 1.0,
            height: 2.0,
        };

        // 3) Build all storage types in logical workflow order
        let mut storage_types = Vec::new();

        // Inbound Ramp (x:0–4, y:25–29)
        storage_types.push(StorageType {
            id: "inbound_ramp".into(),
            name: "Inbound Ramp".into(),
            color: "#aed581".into(),
            section_id: main_section.id.clone(),
            bins: create_bins(
                "inbound_ramp",
                0..5,
                25..30,
                &bin_size,
                &main_section.origin,
            ),
            strategies: vec![ReplenishmentStrategy::Replenishment],
            handling_unit_type: Some("pallet".into()),
            temperature_zone: None,
            hazard_class: None,
            abc_class: None,
            automation_level: Some("manual".into()),
            sort_sequence: Some(1),
            zone_category: ZoneCategory::InboundRamp,
        });

        // Inbound Buffer (x:5–9, y:25–29)
        storage_types.push(StorageType {
            id: "inbound_buffer".into(),
            name: "Inbound Buffer".into(),
            color: "#90A4AE".into(),
            section_id: main_section.id.clone(),
            bins: create_bins(
                "inbound_buffer",
                5..10,
                25..30,
                &bin_size,
                &main_section.origin,
            ),
            strategies: vec![ReplenishmentStrategy::Replenishment],
            handling_unit_type: Some("pallet".into()),
            temperature_zone: None,
            hazard_class: None,
            abc_class: None,
            automation_level: Some("manual".into()),
            sort_sequence: Some(2),
            zone_category: ZoneCategory::InboundBuffer,
        });

        // Outbound Ramp (x:0–4, y:20–24)
        storage_types.push(StorageType {
            id: "outbound_ramp".into(),
            name: "Outbound Ramp".into(),
            color: "#64b5f6".into(),
            section_id: main_section.id.clone(),
            bins: create_bins(
                "outbound_ramp",
                0..5,
                20..25,
                &bin_size,
                &main_section.origin,
            ),
            strategies: vec![ReplenishmentStrategy::Replenishment],
            handling_unit_type: Some("pallet".into()),
            temperature_zone: None,
            hazard_class: None,
            abc_class: None,
            automation_level: Some("manual".into()),
            sort_sequence: Some(3),
            zone_category: ZoneCategory::OutboundRamp,
        });

        // Outbound Buffer (x:5–9, y:20–24)
        storage_types.push(StorageType {
            id: "outbound_buffer".into(),
            name: "Outbound Buffer".into(),
            color: "#B0BEC5".into(),
            section_id: main_section.id.clone(),
            bins: create_bins(
                "outbound_buffer",
                5..10,
                20..25,
                &bin_size,
                &main_section.origin,
            ),
            strategies: vec![ReplenishmentStrategy::Replenishment],
            handling_unit_type: Some("pallet".into()),
            temperature_zone: None,
            hazard_class: None,
            abc_class: None,
            automation_level: Some("manual".into()),
            sort_sequence: Some(4),
            zone_category: ZoneCategory::OutboundBuffer,
        });

        // Goods Receipt (x:10–14, y:25–29)
        storage_types.push(StorageType {
            id: "goods_receipt".into(),
            name: "Goods Receipt".into(),
            color: "#FFCA28".into(),
            section_id: main_section.id.clone(),
            bins: create_bins(
                "goods_receipt",
                10..15,
                25..30,
                &bin_size,
                &main_section.origin,
            ),
            strategies: vec![ReplenishmentStrategy::QualityInspection],
            handling_unit_type: Some("pallet".into()),
            temperature_zone: None,
            hazard_class: None,
            abc_class: None,
            automation_level: Some("manual".into()),
            sort_sequence: Some(5),
            zone_category: ZoneCategory::GoodReceipt,
        });

        // Returns (x:10–14, y:20–24)
        storage_types.push(StorageType {
            id: "returns".into(),
            name: "Returns".into(),
            color: "#ff8a65".into(),
            section_id: main_section.id.clone(),
            bins: create_bins("returns", 10..15, 20..25, &bin_size, &main_section.origin),
            strategies: vec![ReplenishmentStrategy::ReturnStrategy],
            handling_unit_type: Some("box".into()),
            temperature_zone: None,
            hazard_class: None,
            abc_class: None,
            automation_level: Some("manual".into()),
            sort_sequence: Some(6),
            zone_category: ZoneCategory::Returns,
        });

        // HighRunner Rack A (x:15–24, y:10–19)
        storage_types.push(StorageType {
            id: "high_runner_1".into(),
            name: "HighRunner Rack A".into(),
            color: "#90caf9".into(),
            section_id: main_section.id.clone(),
            bins: create_bins(
                "high_runner_1",
                15..25,
                10..20,
                &bin_size,
                &main_section.origin,
            ),
            strategies: vec![
                ReplenishmentStrategy::VolumeBased,
                ReplenishmentStrategy::BlockStorage,
            ],
            handling_unit_type: Some("pallet".into()),
            temperature_zone: Some("ambient".into()),
            hazard_class: None,
            abc_class: Some("C".into()),
            automation_level: Some("semi".into()),
            sort_sequence: Some(7),
            zone_category: ZoneCategory::HighRunner,
        });

        // HighRunner Rack B (x:25–34, y:10–19)
        storage_types.push(StorageType {
            id: "high_runner_2".into(),
            name: "HighRunner Rack B".into(),
            color: "#81D4FA".into(),
            section_id: main_section.id.clone(),
            bins: create_bins(
                "high_runner_2",
                25..35,
                10..20,
                &bin_size,
                &main_section.origin,
            ),
            strategies: vec![
                ReplenishmentStrategy::VolumeBased,
                ReplenishmentStrategy::BlockStorage,
            ],
            handling_unit_type: Some("pallet".into()),
            temperature_zone: Some("ambient".into()),
            hazard_class: None,
            abc_class: Some("C".into()),
            automation_level: Some("semi".into()),
            sort_sequence: Some(8),
            zone_category: ZoneCategory::HighRunner,
        });

        // Reserve (x:35–39, y:10–19)
        storage_types.push(StorageType {
            id: "reserve".into(),
            name: "Reserve Zone".into(),
            color: "#FFB300".into(),
            section_id: main_section.id.clone(),
            bins: create_bins("reserve", 35..40, 10..20, &bin_size, &main_section.origin),
            strategies: vec![ReplenishmentStrategy::ReserveStorage],
            handling_unit_type: Some("pallet".into()),
            temperature_zone: None,
            hazard_class: None,
            abc_class: None,
            automation_level: Some("manual".into()),
            sort_sequence: Some(9),
            zone_category: ZoneCategory::Reserve,
        });

        // Kanban (x:40–49, y:14–16)
        storage_types.push(StorageType {
            id: "kanban".into(),
            name: "Kanban".into(),
            color: "#4DB6AC".into(),
            section_id: main_section.id.clone(),
            bins: create_bins("kanban", 40..50, 14..17, &bin_size, &main_section.origin),
            strategies: vec![ReplenishmentStrategy::AutoReplenishment],
            handling_unit_type: Some("tote".into()),
            temperature_zone: None,
            hazard_class: None,
            abc_class: None,
            automation_level: Some("full".into()),
            sort_sequence: Some(10),
            zone_category: ZoneCategory::Kanban,
        });

        // Conveyor (x:15–35, y:9–10)
        storage_types.push(StorageType {
            id: "conveyor".into(),
            name: "Conveyor".into(),
            color: "#CFD8DC".into(),
            section_id: main_section.id.clone(),
            bins: create_bins("conveyor", 15..35, 9..10, &bin_size, &main_section.origin),
            strategies: vec![ReplenishmentStrategy::Replenishment],
            handling_unit_type: Some("tote".into()),
            temperature_zone: None,
            hazard_class: None,
            abc_class: None,
            automation_level: Some("full".into()),
            sort_sequence: Some(11),
            zone_category: ZoneCategory::Conveyor,
        });

        // Commissioning (x:10–19, y:5–9)
        storage_types.push(StorageType {
            id: "commissioning".into(),
            name: "Commissioning".into(),
            color: "#EF9A9A".into(),
            section_id: main_section.id.clone(),
            bins: create_bins(
                "commissioning",
                10..20,
                5..10,
                &bin_size,
                &main_section.origin,
            ),
            strategies: vec![ReplenishmentStrategy::Picking],
            handling_unit_type: Some("box".into()),
            temperature_zone: None,
            hazard_class: None,
            abc_class: None,
            automation_level: Some("manual".into()),
            sort_sequence: Some(12),
            zone_category: ZoneCategory::Commissioning,
        });

        // Packing (x:20–29, y:5–9)
        storage_types.push(StorageType {
            id: "packing".into(),
            name: "Packing".into(),
            color: "#FDD835".into(),
            section_id: main_section.id.clone(),
            bins: create_bins("packing", 20..30, 5..10, &bin_size, &main_section.origin),
            strategies: vec![ReplenishmentStrategy::PickAndPack],
            handling_unit_type: Some("box".into()),
            temperature_zone: None,
            hazard_class: None,
            abc_class: None,
            automation_level: Some("manual".into()),
            sort_sequence: Some(13),
            zone_category: ZoneCategory::Packing,
        });

        // VAS (x:30–34, y:5–9)
        storage_types.push(StorageType {
            id: "vas".into(),
            name: "VAS Area".into(),
            color: "#CE93D8".into(),
            section_id: main_section.id.clone(),
            bins: create_bins("vas", 30..35, 5..10, &bin_size, &main_section.origin),
            strategies: vec![ReplenishmentStrategy::VasProcess],
            handling_unit_type: Some("mixed".into()),
            temperature_zone: None,
            hazard_class: None,
            abc_class: None,
            automation_level: Some("manual".into()),
            sort_sequence: Some(14),
            zone_category: ZoneCategory::VAS,
        });

        // Special Stock (x:35–39, y:5–9)
        storage_types.push(StorageType {
            id: "special_stock".into(),
            name: "Special Stock".into(),
            color: "#A1887F".into(),
            section_id: main_section.id.clone(),
            bins: create_bins(
                "special_stock",
                35..40,
                5..10,
                &bin_size,
                &main_section.origin,
            ),
            strategies: vec![ReplenishmentStrategy::Replenishment],
            handling_unit_type: Some("other".into()),
            temperature_zone: None,
            hazard_class: None,
            abc_class: None,
            automation_level: Some("manual".into()),
            sort_sequence: Some(15),
            zone_category: ZoneCategory::SpecialStock,
        });

        // PostAssembly (x:10–19, y:0–4)
        storage_types.push(StorageType {
            id: "post_assembly".into(),
            name: "Post Assembly".into(),
            color: "#8D6E63".into(),
            section_id: main_section.id.clone(),
            bins: create_bins(
                "post_assembly",
                10..20,
                0..5,
                &bin_size,
                &main_section.origin,
            ),
            strategies: vec![ReplenishmentStrategy::ProductionSupply],
            handling_unit_type: Some("other".into()),
            temperature_zone: None,
            hazard_class: None,
            abc_class: None,
            automation_level: Some("manual".into()),
            sort_sequence: Some(16),
            zone_category: ZoneCategory::PostAssembly,
        });

        // Assembly (x:20–29, y:0–4)
        storage_types.push(StorageType {
            id: "assembly".into(),
            name: "Assembly".into(),
            color: "#D4E157".into(),
            section_id: main_section.id.clone(),
            bins: create_bins("assembly", 20..30, 0..5, &bin_size, &main_section.origin),
            strategies: vec![ReplenishmentStrategy::WorkstationOriented],
            handling_unit_type: None,
            temperature_zone: None,
            hazard_class: None,
            abc_class: None,
            automation_level: Some("manual".into()),
            sort_sequence: Some(17),
            zone_category: ZoneCategory::Assembly,
        });

        // 4) Build and return Warehouse
        Warehouse {
            id: "default_layout".into(),
            name: "Default Layout".into(),
            sections: vec![main_section],
            storage_types,
            resources: vec![],
        }
    }
}
