// src/services/mod.rs
mod finance;
mod procurement;
mod sales;
mod warehouse;

pub use finance::*;
pub use procurement::*;
pub use sales::*;
pub use warehouse::*;
