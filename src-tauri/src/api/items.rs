use crate::models::item::Item; // import Item from models/item.rs
use crate::services::items::{load_items, save_items};
use actix_web::{get, post, web, HttpResponse, Responder};
use log::{error, info};

/// GET /api/items
#[get("/items")]
async fn get_items() -> impl Responder {
    match load_items().await {
        Ok(list) => HttpResponse::Ok().json(list),
        Err(err) => {
            error!("load_items failed: {:?}", err);
            HttpResponse::InternalServerError().body("Could not load items")
        }
    }
}

/// POST /api/items
/// Replace the entire item catalog (e.g. after manual edits)
#[post("/items")]
async fn post_items(body: web::Json<Vec<Item>>) -> impl Responder {
    let items = body.into_inner();
    match save_items(&items).await {
        Ok(_) => {
            info!("Items saved: {} entries", items.len());
            HttpResponse::Ok().finish()
        }
        Err(err) => {
            error!("save_items failed: {:?}", err);
            HttpResponse::InternalServerError().body("Could not save items")
        }
    }
}

pub fn configure_items_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/api").service(get_items).service(post_items));
}
