// src/utils/error.rs

use anyhow::anyhow;
use tauri::Error as TauriError;
use thiserror::Error;

/// Your application‐level errors
#[derive(Debug, Error)]
pub enum AppError {
    #[error("HTTP error: {0}")]
    Http(#[from] reqwest::Error),

    #[error("JSON error: {0}")]
    Json(#[from] serde_json::Error),

    #[error("Other error: {0}")]
    Other(String),
}

/// Convert AppError → tauri::Error by first turning it into an anyhow::Error
impl From<AppError> for TauriError {
    fn from(e: AppError) -> TauriError {
        // Wrap in anyhow::Error and then use its From<anyhow::Error> impl
        anyhow!(e.to_string()).into()
    }
}
