// src-tauri/src/services/mod.rs

mod finance;
mod procurement;
mod resource;
mod sales;
mod warehouse; // add this line

pub use finance::load_company_codes;
pub use procurement::load_vendors;
pub use resource::{load_resources, load_workers};
pub use sales::load_customers;
pub use warehouse::load_warehouse; // and these
