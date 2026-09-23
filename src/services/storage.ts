/**
 * Local storage persistence adapter.
 * Provides disk sync abstraction for presets and user preferences.
 */

export interface SoundPreset {
  id: string;
  name: string;
  category: "Coding" | "Deep Rest" | "Reading" | "Binaural Focus" | "Custom";
  isDefaultLaunch: boolean;
  stems: Array<{ id: string; name: string; volume: number; active: boolean }>;
}

const PRESETS_STORAGE_KEY = "aurafocus_presets";
const PREFERENCES_STORAGE_KEY = "aurafocus_preferences";

const VALID_STEM_IDS = new Set(["rain", "wind", "campfire", "stream"]);

export const DEFAULT_PRESETS: SoundPreset[] = [
  {
    id: "deep-focus",
    name: "Deep Focus",
    category: "Coding",
    isDefaultLaunch: true,
    stems: [
      { id: "rain", name: "Rain on Window", volume: 75, active: true },
      { id: "wind", name: "Forest Wind", volume: 40, active: true },
      { id: "campfire", name: "Campfire", volume: 0, active: false },
      { id: "stream", name: "Gentle Stream", volume: 0, active: false },
    ],
  },
  {
    id: "rainy-cafe",
    name: "Rainy Cafe",
    category: "Reading",
    isDefaultLaunch: false,
    stems: [
      { id: "rain", name: "Rain on Window", volume: 80, active: true },
      { id: "stream", name: "Gentle Stream", volume: 40, active: true },
      { id: "wind", name: "Forest Wind", volume: 0, active: false },
      { id: "campfire", name: "Campfire", volume: 0, active: false },
    ],
  },
  {
    id: "late-night",
    name: "Late Night Study",
    category: "Coding",
    isDefaultLaunch: false,
    stems: [
      { id: "rain", name: "Rain on Window", volume: 50, active: true },
      { id: "stream", name: "Gentle Stream", volume: 20, active: true },
      { id: "wind", name: "Forest Wind", volume: 0, active: false },
      { id: "campfire", name: "Campfire", volume: 0, active: false },
    ],
  },
  {
    id: "nordic-forest",
    name: "Nordic Forest",
    category: "Deep Rest",
    isDefaultLaunch: false,
    stems: [
      { id: "wind", name: "Forest Wind", volume: 65, active: true },
      { id: "stream", name: "Gentle Stream", volume: 50, active: true },
      { id: "rain", name: "Rain on Window", volume: 20, active: true },
      { id: "campfire", name: "Campfire", volume: 30, active: true },
    ],
  },
];

export function loadPresets(): SoundPreset[] {
  try {
    const raw = localStorage.getItem(PRESETS_STORAGE_KEY);
    if (raw) {
      const parsed: SoundPreset[] = JSON.parse(raw);
      return parsed.map((preset) => ({
        ...preset,
        stems: preset.stems.filter((s) => VALID_STEM_IDS.has(s.id)),
      }));
    }
  } catch {
    // fallback
  }
  return DEFAULT_PRESETS;
}

export function savePreset(preset: SoundPreset): void {
  const existing = loadPresets();
  const index = existing.findIndex((p) => p.id === preset.id);
  let updated: SoundPreset[];
  if (index >= 0) {
    updated = [...existing];
    updated[index] = preset;
  } else {
    updated = [...existing, preset];
  }
  try {
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save preset:", err);
  }
}

export function loadPreferences<T>(defaults: T): T {
  try {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (raw) return { ...defaults, ...JSON.parse(raw) };
  } catch {
    // fallback
  }
  return defaults;
}

export function savePreferences<T>(prefs: T): void {
  try {
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(prefs));
  } catch (err) {
    console.error("Failed to save preferences:", err);
  }
}
