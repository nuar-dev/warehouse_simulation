// src/utils/warehouse.ts

/**
 * Returns the hover‐tooltip for a given bin type + label.
 */
export const getTooltipLabel = (
  type: string,
  label?: string
): string => {
  const name = label ?? ''
  const icons: Record<string, string> = {
    inbound_ramp:   `📦 Inbound Ramp`,
    inbound_buffer: `📥 Inbound Buffer`,
    outbound_ramp:  `📤 Outbound Ramp`,
    outbound_buffer:`📤 Outbound Buffer`,

    goods_receipt:     `🔍 Goods Receipt`,
    returns:           `↩️ Returns`,

    high_runner_1:   `🏗️ High‐Speed Rack A`,
    high_runner_2:   `🏗️ High‐Speed Rack B`,
    reserve:         `🗄️ Reserve Zone`,
    special_stock:   `🎯 Special Stock`,

    kanban:          `🎛️ Kanban`,
    conveyor:        `🔄 Conveyor`,

    pick_zone:       `🛒 Pick Zone`,

    commissioning:   `🧩 Commissioning`,
    packing:         `📦 Packing`,

    vas:             `🛠️ VAS Area`,
    quality_inspection: `✅ Quality Inspection`,

    assembly:        `🔧 Assembly Bench`,
    post_assembly:   `🔨 Post Assembly`,

    road:            `🛣️ Road`,
    wall:            `🧱 Wall`,
  }

  return `${icons[type] ?? '❓'} ${name}`
}

/**
 * Interpolate between two hex colors.
 */
function lerpColor(a: string, b: string, t: number): string {
  const ia = parseInt(a.slice(1), 16)
  const ib = parseInt(b.slice(1), 16)
  const ra = (ia >> 16) & 0xff, ga = (ia >> 8) & 0xff, ba = ia & 0xff
  const rb = (ib >> 16) & 0xff, gb = (ib >> 8) & 0xff, bb = ib & 0xff
  const r = Math.round(ra + (rb - ra) * t)
  const g = Math.round(ga + (gb - ga) * t)
  const b2 = Math.round(ba + (bb - ba) * t)
  return `#${((r<<16)|(g<<8)|b2).toString(16).padStart(6,'0')}`
}

/**
 * Returns the background fill color (or pulsing style) for a given bin type.
 *
 * @param type         the storage_type.id
 * @param fillPercent  optional number 0–1, if provided overrides static map with green→red gradient
 * @param pulse        optional flag to mark this zone as “animating” (add your CSS class)
 */
export const getCellStyle = (
  type: string,
  fillPercent?: number,
  pulse: boolean = false
): { backgroundColor: string; className?: string } => {
  let backgroundColor: string

  if (fillPercent != null) {
    // green → red
    backgroundColor = lerpColor('#00ff00', '#ff0000', Math.min(1, Math.max(0, fillPercent)))
  } else {
    // static fallback map
    const map: Record<string, string> = {
      inbound_ramp:    '#aed581',
      inbound_buffer:  '#90A4AE',
      outbound_ramp:   '#64b5f6',
      outbound_buffer: '#B0BEC5',

      goods_receipt:   '#FFCA28',
      returns:         '#ff8a65',

      high_runner_1:   '#90caf9',
      high_runner_2:   '#81D4FA',
      reserve:         '#FFB300',
      special_stock:   '#A1887F',

      kanban:          '#4DB6AC',
      conveyor:        '#CFD8DC',

      pick_zone:       '#c8e6c9',

      commissioning:   '#EF9A9A',
      packing:         '#FDD835',

      vas:             '#CE93D8',
      quality_inspection: '#C8E6C9',

      assembly:        '#D4E157',
      post_assembly:   '#8D6E63',

      road:            '#EEEEEE',
      wall:            '#B0BEC5',
    }
    backgroundColor = map[type] ?? '#E0E0E0'
  }

  return {
    backgroundColor,
    className: pulse ? 'cell-pulse' : undefined,
  }
}
