// src-tauri/src/utils/odata.rs

use anyhow::Result;
use serde::de::DeserializeOwned;

/// Abstract OData client interface.
#[async_trait::async_trait]
pub trait ODataClient {
    async fn fetch<T: DeserializeOwned + Send>(&self, path: &str) -> Result<T>;
}
