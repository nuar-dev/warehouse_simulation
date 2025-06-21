// src/utils/mod.rs

//! Shared helper code used by `services` (and sometimes `api`).
//! Keeps OData client, error definitions, and caching logic in one place.

pub mod error;
pub mod odata;
pub mod odata_client; // generic SAP OData + HTTP client // error types & Into<tauri::Error> adapters

// if you add cache.rs:
pub mod cache; // simple in-memory TTL cache

// If you want some items accessible as `utils::Foo` instead of `utils::error::Foo`, re-export:
// pub use error::AppError;
// pub use odata_client::ODataClient;
