pub mod items;
pub mod resource;
pub mod simulation;
pub mod strategies;
pub mod warehouse;

pub use items::configure_items_routes;
pub use resource::configure_resource_routes;
pub use simulation::configure_simulation_routes;
pub use strategies::configure_strategies_routes;
pub use warehouse::configure_warehouse_routes;
