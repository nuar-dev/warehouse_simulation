// src/contexts/SimulationSettingsContext.tsx

import { createContext, useContext, useState, ReactNode } from 'react';

export interface PerLayoutSettings {
  isRunning: boolean;
  simInterval: number;
  spawnRate: number; // tasks per second
}

export interface SimulationSettingsContextType {
  settingsMap: Record<string, PerLayoutSettings>;
  setRunning: (layoutId: string, run: boolean) => void;
  setInterval: (layoutId: string, ms: number) => void;
  setSpawnRate: (layoutId: string, rate: number) => void;
}

const SimulationSettingsContext = createContext<SimulationSettingsContextType | undefined>(undefined);

// Helper to merge existing settings with defaults
function getSettingsForId(
  settingsMap: Record<string, PerLayoutSettings>,
  layoutId: string
): PerLayoutSettings {
  const existing = settingsMap[layoutId] || {};
  return {
    isRunning: existing.isRunning ?? true,
    simInterval: existing.simInterval ?? 500,
    spawnRate: existing.spawnRate ?? 1,
  };
}

export function SimulationSettingsProvider({ children }: { children: ReactNode }) {
  const [settingsMap, setSettingsMap] = useState<Record<string, PerLayoutSettings>>({});

  const setRunning = (layoutId: string, run: boolean) => {
    setSettingsMap((m) => {
      const base = getSettingsForId(m, layoutId);
      return {
        ...m,
        [layoutId]: { ...base, isRunning: run },
      };
    });
  };

  const setInterval = (layoutId: string, ms: number) => {
    setSettingsMap((m) => {
      const base = getSettingsForId(m, layoutId);
      return {
        ...m,
        [layoutId]: { ...base, simInterval: ms },
      };
    });
  };

  const setSpawnRate = (layoutId: string, rate: number) => {
    setSettingsMap((m) => {
      const base = getSettingsForId(m, layoutId);
      return {
        ...m,
        [layoutId]: { ...base, spawnRate: rate },
      };
    });
  };

  return (
    <SimulationSettingsContext.Provider
      value={{ settingsMap, setRunning, setInterval, setSpawnRate }}
    >
      {children}
    </SimulationSettingsContext.Provider>
  );
}

export function useSimulationSettings(layoutId: string) {
  const ctx = useContext(SimulationSettingsContext);
  if (!ctx) {
    throw new Error('useSimulationSettings must be used within SimulationSettingsProvider');
  }
  const { settingsMap, setRunning, setInterval, setSpawnRate } = ctx;
  const settings = getSettingsForId(settingsMap, layoutId);

  return {
    isRunning: settings.isRunning,
    simInterval: settings.simInterval,
    spawnRate: settings.spawnRate,
    setIsRunning: (run: boolean) => setRunning(layoutId, run),
    setSimInterval: (ms: number) => setInterval(layoutId, ms),
    setSpawnRate: (rate: number) => setSpawnRate(layoutId, rate),
  };
}
