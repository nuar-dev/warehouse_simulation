// src-tauri/src/services/items.rs

use crate::models::warehouse::Item;
use anyhow::Result;
use log::info;

/// Load all items (catalog)
pub async fn load_items() -> Result<Vec<Item>> {
    // TODO: replace with OData or ORM fetch
    Ok(vec![
        Item {
            sku: "A-100".into(),
            name: "Widget Alpha".into(),
            is_high_runner: false,
            is_dangerous: false,
        },
        Item {
            sku: "B-200".into(),
            name: "Gadget Beta".into(),
            is_high_runner: false,
            is_dangerous: false,
        },
        // …more items…
    ])
}

/// Save updated items back to OData / DB / ORM
pub async fn save_items(items: &[Item]) -> Result<()> {
    // TODO: persist via OData or ORM
    info!("save_items: {} items", items.len());
    Ok(())
}
