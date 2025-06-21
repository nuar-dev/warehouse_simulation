// src/services/procurement.rs
use crate::models::procurement::{PurchasingInfoRecord, VendorMaster};
use anyhow::Result;

/// Stub: load vendor master-data
pub async fn load_vendors() -> Result<Vec<VendorMaster>> {
    Ok(vec![])
}

/// Stub: load purchasing info records
pub async fn load_purchasing_info() -> Result<Vec<PurchasingInfoRecord>> {
    Ok(vec![])
}
