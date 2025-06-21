// src/utils/cache.rs

use std::collections::HashMap;
use std::time::{Duration, Instant};

pub struct Cache<K, V> {
    store: HashMap<K, (V, Instant)>,
    ttl: Duration,
}

impl<K: std::hash::Hash + Eq, V> Cache<K, V> {
    pub fn new(ttl: Duration) -> Self {
        Self {
            store: HashMap::new(),
            ttl,
        }
    }

    pub fn get(&mut self, key: &K) -> Option<&V> {
        // 1) First, check if there *is* an entry and whether it's expired.
        let should_remove = if let Some((_, timestamp)) = self.store.get(key) {
            timestamp.elapsed() >= self.ttl
        } else {
            // not present → nothing to remove
            false
        };

        // 2) If it was expired, remove it under a mutable borrow, then return None.
        if should_remove {
            self.store.remove(key);
            return None;
        }

        // 3) Otherwise (either present & valid, or absent), do a fresh get:
        self.store.get(key).map(|(value, _)| value)
    }

    pub fn set(&mut self, key: K, value: V) {
        self.store.insert(key, (value, Instant::now()));
    }
}
