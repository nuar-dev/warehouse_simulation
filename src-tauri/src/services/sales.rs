// src/services/sales.rs
use crate::models::sales::{ConditionRecord, CustomerMaster};
use anyhow::Result;

/// Stub: load customer master-data
pub async fn load_customers() -> Result<Vec<CustomerMaster>> {
    Ok(vec![])
}

/// Stub: load condition records
pub async fn load_conditions() -> Result<Vec<ConditionRecord>> {
    Ok(vec![])
}
