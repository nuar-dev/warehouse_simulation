// src/services/finance.rs
use crate::models::finance::{ChartOfAccounts, CompanyCode, CostCenter, ProfitCenter};
use anyhow::Result;

/// Stub: load company codes
pub async fn load_company_codes() -> Result<Vec<CompanyCode>> {
    Ok(vec![])
}

/// Stub: load chart of accounts
pub async fn load_charts_of_accounts() -> Result<Vec<ChartOfAccounts>> {
    Ok(vec![])
}

/// Stub: load cost centers
pub async fn load_cost_centers() -> Result<Vec<CostCenter>> {
    Ok(vec![])
}

/// Stub: load profit centers
pub async fn load_profit_centers() -> Result<Vec<ProfitCenter>> {
    Ok(vec![])
}
