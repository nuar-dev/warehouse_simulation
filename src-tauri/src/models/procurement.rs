// src/models/procurement.rs
use crate::models::common::DocumentType;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VendorMaster {
    pub vendor_id: String,
    pub name: String,
    pub currency: String,
    pub payment_terms: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PurchasingInfoRecord {
    pub info_record_id: String,
    pub vendor_id: String,
    pub material_id: String,
    pub net_price: f64,
    pub lead_time_days: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SourceListEntry {
    pub material_id: String,
    pub vendor_id: String,
    pub valid_from: String,
    pub valid_to: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuotaArrangement {
    pub material_id: String,
    pub vendor_id: String,
    pub quota_percentage: f32,
}

// DocumentType (NB, FO, etc.) can be reused from common::DocumentType
