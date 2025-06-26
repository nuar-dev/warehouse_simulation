// src-tauri/src/api/resource.rs

use crate::models::{Resource, Worker};
use crate::services::resource::{load_resources, load_workers, save_resources, save_workers};
use actix_web::{get, post, web, HttpResponse, Responder};
use log::{error, info};

/// GET  /api/resources
#[get("/resources")]
async fn get_resources() -> impl Responder {
    match load_resources().await {
        Ok(list) => HttpResponse::Ok().json(list),
        Err(err) => {
            error!("load_resources failed: {:?}", err);
            HttpResponse::InternalServerError().body("Could not load resources")
        }
    }
}

/// POST /api/resources
#[post("/resources")]
async fn post_resources(body: web::Json<Vec<Resource>>) -> impl Responder {
    let resources = body.into_inner();
    match save_resources(&resources).await {
        Ok(_) => {
            info!("Resources saved: {} entries", resources.len());
            HttpResponse::Ok().finish()
        }
        Err(err) => {
            error!("save_resources failed: {:?}", err);
            HttpResponse::InternalServerError().body("Could not save resources")
        }
    }
}

/// GET  /api/workers
#[get("/workers")]
async fn get_workers() -> impl Responder {
    match load_workers().await {
        Ok(list) => HttpResponse::Ok().json(list),
        Err(err) => {
            error!("load_workers failed: {:?}", err);
            HttpResponse::InternalServerError().body("Could not load workers")
        }
    }
}

/// POST /api/workers
#[post("/workers")]
async fn post_workers(body: web::Json<Vec<Worker>>) -> impl Responder {
    let workers = body.into_inner();
    match save_workers(&workers).await {
        Ok(_) => {
            info!("Workers saved: {} entries", workers.len());
            HttpResponse::Ok().finish()
        }
        Err(err) => {
            error!("save_workers failed: {:?}", err);
            HttpResponse::InternalServerError().body("Could not save workers")
        }
    }
}

pub fn configure_resource_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            .service(get_resources)
            .service(post_resources)
            .service(get_workers)
            .service(post_workers),
    );
}
