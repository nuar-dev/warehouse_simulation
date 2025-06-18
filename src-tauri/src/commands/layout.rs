use crate::models::warehouse::{StorageBin, StorageType, Warehouse};
use tauri::command;

#[command]
pub fn get_default_layout() -> Warehouse {
    let mut types = vec![];

    let create_bins = |x_range: std::ops::Range<u32>,
                       y_range: std::ops::Range<u32>,
                       prefix: &str,
                       type_id: &str,
                       section: &str| {
        x_range
            .clone()
            .flat_map(move |x| {
                y_range.clone().map(move |y| StorageBin {
                    id: format!("{}-{}-{}", prefix, x, y),
                    x,
                    y,
                    section: Some(section.into()),
                    storage_type_id: type_id.into(),
                })
            })
            .collect::<Vec<_>>()
    };

    types.push(StorageType {
        id: "inbound_ramp".into(),
        name: "Inbound Ramp".into(),
        color: "#aed581".into(),
        bins: create_bins(0..4, 0..2, "INR", "inbound_ramp", "Inbound"),
        strategies: vec!["gr_zone".into()],
        section_type: Some("GR_ZONE".into()),
        max_capacity: Some(50),
        handling_unit_type: Some("pallet".into()),
        temperature_zone: None,
        hazard_class: None,
        abc_class: None,
        automation_level: Some("manual".into()),
        sort_sequence: Some(1),
    });

    types.push(StorageType {
        id: "staging_in".into(),
        name: "Inbound Staging".into(),
        color: "#fff176".into(),
        bins: create_bins(4..10, 0..2, "STGIN", "staging_in", "Inbound"),
        strategies: vec!["staging_area".into()],
        section_type: Some("GR_STAGE".into()),
        max_capacity: Some(80),
        handling_unit_type: Some("pallet".into()),
        temperature_zone: None,
        hazard_class: None,
        abc_class: None,
        automation_level: Some("manual".into()),
        sort_sequence: Some(2),
    });

    types.push(StorageType {
        id: "returns".into(),
        name: "Returns".into(),
        color: "#ff8a65".into(),
        bins: create_bins(10..14, 0..2, "RET", "returns", "Returns"),
        strategies: vec!["manual_inspection".into()],
        section_type: Some("RETURNS".into()),
        max_capacity: Some(30),
        handling_unit_type: Some("box".into()),
        temperature_zone: None,
        hazard_class: None,
        abc_class: None,
        automation_level: Some("manual".into()),
        sort_sequence: Some(3),
    });

    types.push(StorageType {
        id: "high_rack".into(),
        name: "High Rack".into(),
        color: "#90caf9".into(),
        bins: create_bins(0..16, 4..12, "HR", "high_rack", "Storage"),
        strategies: vec!["chaotic".into(), "abc:C".into()],
        section_type: Some("BULK".into()),
        max_capacity: Some(500),
        handling_unit_type: Some("pallet".into()),
        temperature_zone: Some("ambient".into()),
        hazard_class: None,
        abc_class: Some("C".into()),
        automation_level: Some("semi".into()),
        sort_sequence: Some(4),
    });

    types.push(StorageType {
        id: "pick_zone".into(),
        name: "Pick Zone".into(),
        color: "#a5d6a7".into(),
        bins: create_bins(18..34, 4..12, "PZ", "pick_zone", "Frontline"),
        strategies: vec!["high_turnover".into(), "abc:A".into()],
        section_type: Some("FAST".into()),
        max_capacity: Some(300),
        handling_unit_type: Some("box".into()),
        temperature_zone: None,
        hazard_class: None,
        abc_class: Some("A".into()),
        automation_level: Some("manual".into()),
        sort_sequence: Some(5),
    });

    types.push(StorageType {
        id: "comm".into(),
        name: "Commissioning".into(),
        color: "#ef9a9a".into(),
        bins: create_bins(12..24, 13..15, "COM", "comm", "Commission"),
        strategies: vec!["manual_pick".into()],
        section_type: Some("COMMISSION".into()),
        max_capacity: Some(150),
        handling_unit_type: Some("box".into()),
        temperature_zone: None,
        hazard_class: None,
        abc_class: None,
        automation_level: Some("manual".into()),
        sort_sequence: Some(6),
    });

    types.push(StorageType {
        id: "staging_out".into(),
        name: "Staging Out".into(),
        color: "#ffb74d".into(),
        bins: create_bins(26..34, 16..18, "STGOUT", "staging_out", "Outbound"),
        strategies: vec!["gi_buffer".into()],
        section_type: Some("GI_STAGE".into()),
        max_capacity: Some(60),
        handling_unit_type: Some("pallet".into()),
        temperature_zone: None,
        hazard_class: None,
        abc_class: None,
        automation_level: Some("manual".into()),
        sort_sequence: Some(7),
    });

    types.push(StorageType {
        id: "vas".into(),
        name: "VAS Area".into(),
        color: "#ce93d8".into(),
        bins: create_bins(4..8, 14..16, "VAS", "vas", "VAS"),
        strategies: vec!["labeling".into()],
        section_type: Some("SERVICE".into()),
        max_capacity: Some(40),
        handling_unit_type: Some("mixed".into()),
        temperature_zone: None,
        hazard_class: None,
        abc_class: None,
        automation_level: Some("manual".into()),
        sort_sequence: Some(8),
    });

    types.push(StorageType {
        id: "damaged".into(),
        name: "Damaged Goods".into(),
        color: "#ef5350".into(),
        bins: create_bins(8..12, 14..16, "DMG", "damaged", "Quality"),
        strategies: vec!["quarantine".into()],
        section_type: Some("QUALITY".into()),
        max_capacity: Some(20),
        handling_unit_type: Some("box".into()),
        temperature_zone: None,
        hazard_class: Some("restricted".into()),
        abc_class: None,
        automation_level: Some("manual".into()),
        sort_sequence: Some(9),
    });

    types.push(StorageType {
        id: "packing".into(),
        name: "Packing".into(),
        color: "#fdd835".into(),
        bins: create_bins(20..26, 16..18, "PKG", "packing", "Packing"),
        strategies: vec!["packing_station".into()],
        section_type: Some("PACKING".into()),
        max_capacity: Some(30),
        handling_unit_type: Some("box".into()),
        temperature_zone: None,
        hazard_class: None,
        abc_class: None,
        automation_level: Some("manual".into()),
        sort_sequence: Some(10),
    });

    types.push(StorageType {
        id: "outbound_ramp".into(),
        name: "Outbound Ramp".into(),
        color: "#64b5f6".into(),
        bins: create_bins(30..36, 18..20, "OUT", "outbound_ramp", "Shipping"),
        strategies: vec!["gi_zone".into()],
        section_type: Some("GI_ZONE".into()),
        max_capacity: Some(50),
        handling_unit_type: Some("pallet".into()),
        temperature_zone: None,
        hazard_class: None,
        abc_class: None,
        automation_level: Some("manual".into()),
        sort_sequence: Some(11),
    });

    Warehouse {
        id: "default_layout".into(),
        name: "Default Layout".into(),
        length: 36,
        width: 20,
        height: 1,
        storage_types: types,
    }
}
