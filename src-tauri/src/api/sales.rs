// src-tauri/src/api/warehouse.rs

use crate::services::warehouse::load_warehouse;
use actix_web::{get, web, HttpResponse, Responder};
use log::error;

/// GET /api/warehouse
#[get("/warehouse")]
async fn get_warehouse() -> impl Responder {
    match load_warehouse().await {
        Ok(warehouse) => HttpResponse::Ok().json(warehouse),
        Err(err) => {
            error!("Failed to load warehouse: {:?}", err);
            HttpResponse::InternalServerError().body("Could not load warehouse")
        }
    }
}

/// Register the warehouse routes under the given scope (e.g. "/api")
pub fn configure_warehouse_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/api").service(get_warehouse));
}
