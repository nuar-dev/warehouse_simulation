use crate::models::warehouse::ZoneCategory;
use std::collections::HashMap;

/// For each zone, the list of (next_zone, weight).
/// Weights are un-normalized right now; you can normalize at runtime.
pub fn default_zone_transitions() -> HashMap<ZoneCategory, Vec<(ZoneCategory, f64)>> {
    use ZoneCategory::*;
    let mut map = HashMap::new();

    map.insert(InboundRamp, vec![(InboundBuffer, 1.0)]);
    map.insert(
        InboundBuffer,
        vec![
            (GoodReceipt, 0.4),
            (QualityInspection, 0.3),
            (LowRunner, 0.2),
            (HighRunner, 0.1),
        ],
    );
    map.insert(GoodReceipt, vec![(QualityInspection, 1.0)]);
    map.insert(Returns, vec![(QualityInspection, 0.7), (SpecialStock, 0.3)]);
    map.insert(QualityInspection, vec![(Reserve, 0.5), (PickZone, 0.5)]);

    // 2. Storage flow
    map.insert(LowRunner, vec![(MediumRunner, 0.5), (PickZone, 0.5)]);
    map.insert(MediumRunner, vec![(HighRunner, 0.5), (PickZone, 0.5)]);
    map.insert(HighRunner, vec![(PickZone, 1.0)]);
    map.insert(
        DangerousGoods,
        vec![
            (QualityInspection, 1.0), // only QA can move it
        ],
    );

    // 3. Pick & packing
    map.insert(PickZone, vec![(Commissioning, 1.0)]);
    map.insert(Commissioning, vec![(Packing, 1.0)]);
    map.insert(Packing, vec![(OutboundBuffer, 1.0)]);

    // 4. Outbound
    map.insert(OutboundBuffer, vec![(OutboundRamp, 1.0)]);
    map.insert(
        OutboundRamp,
        vec![
            // End of line — could loop to “Other” or terminate
            (Other, 1.0),
        ],
    );

    // 5. Production‐related zones
    map.insert(Reserve, vec![(Kanban, 1.0)]);
    map.insert(Kanban, vec![(Assembly, 0.7), (PostAssembly, 0.3)]);
    map.insert(Assembly, vec![(PostAssembly, 1.0)]);
    map.insert(PostAssembly, vec![(Packing, 1.0)]);

    // 6. Value added & specials
    map.insert(VAS, vec![(Reserve, 1.0)]);
    map.insert(SpecialStock, vec![(Reserve, 1.0)]);

    // 7. Material flow
    map.insert(
        Conveyor,
        vec![
            // Conveyor isn’t a “source” in our sim: it sits between zones
        ],
    );

    // 8. Fallback
    map.insert(
        Other,
        vec![
            // everything is allowed to Other for cleanup
            (InboundRamp, 0.25),
            (OutboundRamp, 0.25),
            (Other, 0.5),
        ],
    );

    // TODO: adjust all weights to reflect real‐world frequencies
    // TODO: consider direct inbound → storage (skip GoodsReceipt)
    // TODO: forbid certain transitions (e.g. non‐QA workers into DangerousGoods)
    map
}
