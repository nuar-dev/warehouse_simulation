// src/models/mod.rs
pub mod common;
pub mod finance;
pub mod procurement;
pub mod resource;
pub mod sales;
pub mod warehouse;

pub use resource::{Resource, ResourceCategory, Worker, WorkerRole};
