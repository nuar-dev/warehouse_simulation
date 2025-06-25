// src-tauri/src/api/strategies.rs

use crate::services::strategies::apply_all_strategies;
use crate::services::warehouse::load_warehouse;
use actix_web::{post, web, HttpResponse, Responder};
use log::{error, info};

/// POST /api/strategies/apply
/// Loads the warehouse, applies all configured strategies, and returns the updated Warehouse.
#[post("/strategies/apply")]
async fn post_apply_strategies() -> impl Responder {
    match load_warehouse().await {
        Ok(mut warehouse) => {
            if let Err(err) = apply_all_strategies(&mut warehouse).await {
                error!("apply_all_strategies failed: {:?}", err);
                return HttpResponse::InternalServerError()
                    .body("Failed to apply warehouse strategies");
            }
            info!("Successfully applied all strategies");
            HttpResponse::Ok().json(warehouse)
        }
        Err(err) => {
            error!("load_warehouse failed: {:?}", err);
            HttpResponse::InternalServerError().body("Could not load warehouse")
        }
    }
}

/// Register the strategies routes under the given scope (e.g. "/api")
pub fn configure_strategies_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/api").service(post_apply_strategies));
}
