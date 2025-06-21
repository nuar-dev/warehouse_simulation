use crate::simulation::types::{Task, TaskState, TaskType};
use chrono::{DateTime, Duration, Utc};
use std::collections::BinaryHeap;
use uuid::Uuid;

/// An event to change a task’s state at a given time
struct Event {
    when: DateTime<Utc>,
    task_id: String,
    new_state: TaskState,
}

impl PartialEq for Event {
    fn eq(&self, other: &Self) -> bool {
        self.when == other.when
    }
}

impl Eq for Event {}

impl PartialOrd for Event {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        // We want the earliest event first, so reverse the comparison here.
        other.when.partial_cmp(&self.when)
    }
}

impl Ord for Event {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        // Reverse so BinaryHeap gives us the minimum `when`
        other.when.cmp(&self.when)
    }
}

/// A simple discrete‐event simulation engine holding tasks & their scheduled state changes.
pub struct Simulation {
    pub now: DateTime<Utc>,
    pub tasks: Vec<Task>,
    events: BinaryHeap<Event>,
}

impl Simulation {
    /// Create a new simulation starting at the given timestamp.
    pub fn new(start: DateTime<Utc>) -> Self {
        Self {
            now: start,
            tasks: Vec::new(),
            events: BinaryHeap::new(),
        }
    }

    /// Spawn a pick task from `origin_bin` → `dest_bin`, scheduling assignment & completion.
    pub fn spawn_pick(&mut self, order_id: &str, qty: u32, origin_bin: String, dest_bin: String) {
        let id = Uuid::new_v4().to_string();
        let created = self.now;

        // Create the initial Task record
        let task = Task {
            id: id.clone(),
            task_type: TaskType::Pick {
                order_id: order_id.into(),
                qty,
                origin_bin,
                dest_bin,
            },
            state: TaskState::Created,
            created_at: created,
            last_updated: created,
        };

        self.tasks.push(task.clone());

        // Schedule it to be assigned after 1 second
        let assign_time = created + Duration::seconds(1);
        self.events.push(Event {
            when: assign_time,
            task_id: id.clone(),
            new_state: TaskState::Assigned {
                worker_id: "P123".into(),
            },
        });

        // Schedule it to complete 5 seconds after assignment
        self.events.push(Event {
            when: assign_time + Duration::seconds(5),
            task_id: id,
            new_state: TaskState::Completed,
        });
    }

    /// Advance the simulation to `until`, processing all events up to that time.
    pub fn run_to(&mut self, until: DateTime<Utc>) {
        // Process events in chronological order
        while let Some(evt) = self.events.peek() {
            if evt.when > until {
                break;
            }
            // Pop the next event
            let Event {
                when,
                task_id,
                new_state,
            } = self.events.pop().unwrap();
            // Advance the clock
            self.now = when;
            // Apply state change to the matching task
            if let Some(task) = self.tasks.iter_mut().find(|t| t.id == task_id) {
                task.state = new_state.clone();
                task.last_updated = when;
            }
        }
        // Finally, advance the clock to exactly `until`
        self.now = until;
    }
}
