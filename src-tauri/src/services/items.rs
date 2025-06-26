// src-tauri/src/services/items.rs

use crate::models::item::{BatchInfo, Dimensions, Item};
use anyhow::Result;
use chrono::{DateTime, TimeZone, Utc};
use log::info;

/// Load all items (catalog) with default examples covering high/low runners,
/// dangerous goods, batch-tracked and perishable SKUs.
pub async fn load_items() -> Result<Vec<Item>> {
    Ok(vec![
        Item {
            sku: "A-100".into(),
            name: "Widget Alpha".into(),
            is_high_runner: true,
            is_dangerous: false,
            dimensions: Dimensions {
                length: 0.50,
                width: 0.30,
                height: 0.20,
            },
            weight: 1.2,
            batch_info: None,
            expiry_date: None,
        },
        Item {
            sku: "B-200".into(),
            name: "Gadget Beta".into(),
            is_high_runner: false,
            is_dangerous: true,
            dimensions: Dimensions {
                length: 0.20,
                width: 0.20,
                height: 0.20,
            },
            weight: 0.5,
            batch_info: Some(BatchInfo {
                batch_number: "LOT-123".into(),
                manufacture_date: Utc.ymd(2025, 1, 1).and_hms(0, 0, 0),
            }),
            expiry_date: Some(Utc.ymd(2025, 6, 30).and_hms(0, 0, 0)),
        },
        Item {
            sku: "C-300".into(),
            name: "Drill Gamma".into(),
            is_high_runner: false,
            is_dangerous: false,
            dimensions: Dimensions {
                length: 0.40,
                width: 0.40,
                height: 0.50,
            },
            weight: 2.5,
            batch_info: None,
            expiry_date: None,
        },
        Item {
            sku: "D-400".into(),
            name: "Bolt Delta".into(),
            is_high_runner: false,
            is_dangerous: false,
            dimensions: Dimensions {
                length: 0.10,
                width: 0.05,
                height: 0.05,
            },
            weight: 0.05,
            batch_info: None,
            expiry_date: None,
        },
        Item {
            sku: "E-500".into(),
            name: "Panel Epsilon".into(),
            is_high_runner: true,
            is_dangerous: false,
            dimensions: Dimensions {
                length: 1.00,
                width: 0.50,
                height: 0.02,
            },
            weight: 3.0,
            batch_info: None,
            expiry_date: None,
        },
        Item {
            sku: "F-600".into(),
            name: "Acid Solution F".into(),
            is_high_runner: false,
            is_dangerous: true,
            dimensions: Dimensions {
                length: 0.10,
                width: 0.10,
                height: 0.20,
            },
            weight: 0.8,
            batch_info: Some(BatchInfo {
                batch_number: "CHEM-458".into(),
                manufacture_date: Utc.ymd(2025, 2, 15).and_hms(0, 0, 0),
            }),
            expiry_date: Some(Utc.ymd(2026, 2, 15).and_hms(0, 0, 0)),
        },
        Item {
            sku: "G-700".into(),
            name: "Motor G".into(),
            is_high_runner: true,
            is_dangerous: false,
            dimensions: Dimensions {
                length: 0.30,
                width: 0.30,
                height: 0.30,
            },
            weight: 5.0,
            batch_info: None,
            expiry_date: None,
        },
        Item {
            sku: "H-800".into(),
            name: "Circuitboard H".into(),
            is_high_runner: false,
            is_dangerous: false,
            dimensions: Dimensions {
                length: 0.20,
                width: 0.15,
                height: 0.01,
            },
            weight: 0.25,
            batch_info: Some(BatchInfo {
                batch_number: "PCB-982".into(),
                manufacture_date: Utc.ymd(2025, 3, 10).and_hms(0, 0, 0),
            }),
            expiry_date: None,
        },
        Item {
            sku: "I-900".into(),
            name: "Sensor I".into(),
            is_high_runner: true,
            is_dangerous: false,
            dimensions: Dimensions {
                length: 0.05,
                width: 0.05,
                height: 0.10,
            },
            weight: 0.1,
            batch_info: None,
            expiry_date: None,
        },
        Item {
            sku: "J-1000".into(),
            name: "Gripper J".into(),
            is_high_runner: false,
            is_dangerous: false,
            dimensions: Dimensions {
                length: 0.25,
                width: 0.10,
                height: 0.10,
            },
            weight: 0.6,
            batch_info: None,
            expiry_date: None,
        },
    ])
}

/// Save updated items back to OData / DB / ORM
pub async fn save_items(items: &[Item]) -> Result<()> {
    info!("save_items: {} items", items.len());
    // TODO: persist via OData or ORM
    Ok(())
}
