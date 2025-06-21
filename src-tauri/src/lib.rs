// src/lib.rs

// --------------------------------------------------------------------------------
// PUBLIC API SURFACE
//
// Only the modules listed here are exposed outside of the crate (e.g.
// to your Tauri `main.rs` or any downstream consumers). Everything else
// is an internal detail.
// --------------------------------------------------------------------------------

/// commands
///
/// - Your Tauri command handlers (`#[command] async fn …`).
/// - These functions get invoked by the frontend via `invoke(...)`.
/// - Should only pull in things from `api` or `layout`, never from `services`/`models` directly.
pub mod commands;

/// api
///
/// - “Glue” layer between Tauri commands and your service implementations.
/// - Defines `#[command]` functions for loading master data (e.g. `load_warehouse`),
///   saving/loading layouts, etc.
/// - Calls into `services/*`, returns clean domain types to the frontend.
pub mod api;

/// layout
///
/// - Houses all layout-building logic:
///   • `get_default_layout()`
///   • merging/applying user overrides
///   • any layout-validation or normalization
/// - Depends on `models::warehouse` types, but not on `services`/`utils`.
pub mod layout;

// --------------------------------------------------------------------------------
// PRIVATE IMPLEMENTATION DETAILS
//
// These modules are _not_ `pub`. They’re internal plumbing—your
// OData client, service layer, domain models, helpers, etc.
// --------------------------------------------------------------------------------

/// services
///
/// - Responsible for fetching & caching SAP OData master-data.
/// - Each file maps to a domain (warehouse.rs, procurement.rs, sales.rs, finance.rs).
/// - Internally uses `utils::odata_client` + caching strategies.
/// - **Not** exposed outside this crate.
mod services;

/// models
///
/// - All `struct` and `enum` definitions for your business-domain data:
///     • `models/warehouse.rs`   → Warehouse, StorageType, StorageBin, domain enums
///     • `models/procurement.rs` → VendorMaster, PurchaseInfoRecord, etc.
///     • `models/sales.rs`       → CustomerMaster, SalesDocType, etc.
///     • `models/finance.rs`     → CompanyCode, CostCenter, etc.
///     • `models/common.rs`      → shared types (DocumentType, MovementType, DateTime)
/// - Used by both `services` (to deserialize OData) and `api` (to serialize JSON).
mod models;

/// utils
///
/// - Shared helpers & plumbing:
///     • `utils/odata_client.rs` → Generic OData + HTTP logic, auth, URL building
///     • `utils/error.rs`       → Common error types & conversions
///     • (optional) `utils/cache.rs` → in-memory caching, TTLs, etc.
/// - Only referenced by `services` and `api`; never re-exported publicly.
mod utils;
