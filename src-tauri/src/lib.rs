// src-tauri/src/lib.rs

// --------------------------------------------------------------------------------
// PUBLIC API SURFACE
// --------------------------------------------------------------------------------

/// Tauri command handlers
pub mod commands;

/// (Optional) HTTP REST / other API endpoints
pub mod api;

/// Pure layout-building logic (default + custom)
pub mod layout;

// --------------------------------------------------------------------------------
// PRIVATE IMPLEMENTATION DETAILS
// --------------------------------------------------------------------------------

/// services
///
/// - Responsible for fetching & caching SAP OData master‐data.
/// - Each file maps to a domain (warehouse.rs, procurement.rs, sales.rs, finance.rs).
/// - Internally uses `utils::odata_client` + caching strategies.
/// - **Not** exposed outside this crate.
mod services;

/// simulation
///
/// - Discrete‐event simulation (DES) for mock/demo mode.
/// - `simulation/types.rs`     → Task, TaskType, TaskState
/// - `simulation/engine.rs`    → Simulation struct and event‐queue logic
/// - `simulation/generator.rs` → spawn_pick(), other task‐arrival functions
/// - Only referenced by the `mock_odata_client` in `services/` and by sim‐commands.
/// - **Not** part of the public API.
mod simulation;

/// models
///
/// - All `struct` and `enum` definitions for your business‐domain data:
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
///     • `utils/cache.rs`       → In‐memory caching, TTLs, etc.  
/// - Only referenced by `services` and `api`; never re-exported publicly.
mod utils;
