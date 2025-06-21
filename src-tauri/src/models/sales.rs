// src/models/sales.rs
use crate::models::common::DocumentType;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CustomerMaster {
    pub customer_id: String,
    pub name: String,
    pub sales_org: String,
    pub dist_channel: String,
    pub division: String,
    pub payment_terms: String,
    pub incoterms: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConditionRecord {
    pub condition_type: String,
    pub material_id: String,
    pub customer_id: String,
    pub price: f64,
}

// Sales document types, item categories, etc. reuse common::DocumentType
