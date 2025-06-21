// src/utils/odata_client.rs

use crate::utils::error::AppError;
use reqwest::Client;
use serde::de::DeserializeOwned;

pub struct ODataClient {
    base_url: String,
    client: Client,
}

impl ODataClient {
    pub fn new(base_url: impl Into<String>) -> Self {
        Self {
            base_url: base_url.into(),
            client: Client::new(),
        }
    }

    /// Fetch and deserialize an OData entity set
    pub async fn fetch<T: DeserializeOwned>(&self, path: &str) -> Result<T, AppError> {
        let url = format!("{}/{}", self.base_url, path);
        let resp = self.client.get(&url).send().await?;
        let data = resp.json::<T>().await?;
        Ok(data)
    }

    // …any other helpers (auth headers, pagination, etc.)
}
