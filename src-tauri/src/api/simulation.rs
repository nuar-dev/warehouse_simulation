// src-tauri/src/api/simulation.rs

use crate::services::simulation::{run_simulation, SimulationParams};
use actix_web::{post, web, HttpResponse, Responder};
use log::{error, info};

/// POST /api/simulation/run
#[post("/simulation/run")]
async fn post_run_simulation(body: web::Json<SimulationParams>) -> impl Responder {
    let params = body.into_inner();
    match run_simulation(params).await {
        Ok(results) => {
            info!("Simulation run complete: {} records", results.len());
            HttpResponse::Ok().json(results)
        }
        Err(err) => {
            error!("run_simulation failed: {:?}", err);
            HttpResponse::InternalServerError().body("Simulation error")
        }
    }
}

pub fn configure_simulation_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/api").service(post_run_simulation));
}
