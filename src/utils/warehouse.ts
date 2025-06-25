// src/utils/warehouse.ts

/**
 * Returns the hover‐tooltip for a given bin type + label.
 */
export const getTooltipLabel = (type: string, label?: string): string => {
  const name = label ?? ''
  const icons: Record<string, string> = {
    inbound_ramp:  `📦 Inbound Ramp`,
    staging_in:    `🛬 Staging In`,
    returns:       `↩️ Returns`,
    high_rack:     `🏗️ High Rack`,
    pick_zone:     `🛒 Pick Zone`,
    comm:          `🧩 Commissioning`,
    staging_out:   `🚚 Staging Out`,
    vas:           `🛠️ VAS`,
    damaged:       `⚠️ Damaged`,
    packing:       `📦 Packing`,
    outbound_ramp: `📤 Outbound Ramp`,
    // ← add any other storage_type.id you use here…

    // **Road & wall**:
    road:          `🛣️ Road`,
    wall:          `🧱 Wall`,
  }

  return `${icons[type] ?? '❓'} ${name}`
}

/**
 * Returns the background fill color for a given bin type.
 */
export const getCellColor = (type: string, isDark: boolean = false): string => {
  const map: Record<string, string> = {
    inbound_ramp:  isDark ? '#6d8e4e' : '#aed581',
    staging_in:    isDark ? '#caa300' : '#fff176',
    returns:       isDark ? '#cc6d4d' : '#ffab91',
    high_rack:     isDark ? '#5472a4' : '#bbdefb',
    pick_zone:     isDark ? '#4a7b5d' : '#c8e6c9',
    comm:          isDark ? '#a65757' : '#ffcdd2',
    staging_out:   isDark ? '#b97b00' : '#ffcc80',
    vas:           isDark ? '#8e659c' : '#e1bee7',
    damaged:       isDark ? '#b94c4c' : '#ef9a9a',
    packing:       isDark ? '#bfa700' : '#fff176',
    outbound_ramp: isDark ? '#547ba4' : '#64b5f6',

    // **Road & wall**:
    road:          isDark ? '#424242' : '#eeeeee',
    wall:          isDark ? '#546e7a' : '#b0bec5',
  }

  // fallback if something unexpected comes through
  return map[type] ?? (isDark ? '#666666' : '#e0e0e0')
}
