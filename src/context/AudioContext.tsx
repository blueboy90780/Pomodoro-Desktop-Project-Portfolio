import {
  createContext,
  useContext,
  createSignal,
  createMemo,
  createEffect,
  onMount,
  onCleanup,
  type ParentProps,
} from "solid-js";
import { createStore } from "solid-js/store";
import { loadPresets } from "../services/storage";

export interface StemTrack {
  id: string;
  name: string;
  category: string;
  icon: string;
  active: boolean;
  volume: number;
}

interface AudioContextValue {
  stems: StemTrack[];
  masterGain: () => number;
  isMuted: () => boolean;
  pomoSyncEnabled: () => boolean;
  isTimerRestActive: () => boolean;
  isTimerRunning: () => boolean;
  activePresetId: () => string;
  activeStemsCount: () => number;
  activeStemSummary: () => string;
  toggleStem: (id: string) => void;
  setStemVolume: (id: string, volume: number) => void;
  setMasterGain: (gain: number) => void;
  toggleMasterMute: () => void;
  togglePomoSync: () => void;
  setTimerRestActive: (active: boolean) => void;
  setTimerRunning: (running: boolean) => void;
  selectPreset: (presetId: string) => void;
  resetAllStems: () => void;
}

const AudioContext = createContext<AudioContextValue>();

const INITIAL_STEMS: StemTrack[] = [
  { id: "rain", name: "Rain on Glass", category: "Precipitation • Binaural 48kHz", icon: "water_drop", active: true, volume: 75 },
  { id: "wind", name: "Forest Wind", category: "Atmospheric • Alpine Flora", icon: "air", active: true, volume: 40 },
  { id: "campfire", name: "Campfire", category: "Thermal • Pine Crackle", icon: "local_fire_department", active: false, volume: 0 },
  { id: "stream", name: "Gentle Stream", category: "Aquatic • Mountain Brook", icon: "waves", active: false, volume: 0 },
];

const AUDIO_SOURCES: Record<string, string[]> = {
  rain: ["/audio/Rain on Glass.wav", "/audio/Rain on Window.wav", "/audio/rain.wav"],
  wind: ["/audio/Forest Wind.wav", "/audio/wind.wav"],
  campfire: ["/audio/Campfire.wav", "/audio/campfire.wav"],
  stream: ["/audio/Gentle Stream.wav", "/audio/stream.wav"],
};

export const AudioProvider = (props: ParentProps) => {
  const [stems, setStems] = createStore<StemTrack[]>(INITIAL_STEMS);
  const [masterGain, setMasterGainSignal] = createSignal(85);
  const [isMuted, setIsMuted] = createSignal(false);
  const [preMuteGain, setPreMuteGain] = createSignal(85);
  const [pomoSyncEnabled, setPomoSyncEnabled] = createSignal(true);
  const [timerRestActive, setTimerRestActive] = createSignal(false);
  const [timerRunning, setTimerRunningSignal] = createSignal(false);
  const [activePresetId, setActivePresetId] = createSignal("deep-focus");

  const audioMap = new Map<string, HTMLAudioElement>();

  const activeStemsCount = createMemo(() => {
    return stems.filter((s) => s.active && s.volume > 0).length;
  });

  const activeStemSummary = createMemo(() => {
    const active = stems.filter((s) => s.active && s.volume > 0).map((s) => s.name);
    if (active.length === 0) return "No Stems Active • Ambient Muted";
    return active.join(", ");
  });

  const getOrCreateAudio = (id: string): HTMLAudioElement | undefined => {
    if (typeof window === "undefined") return undefined;
    let audio = audioMap.get(id);
    if (!audio) {
      const sources = AUDIO_SOURCES[id] || [`/audio/${id}.wav`];
      let sourceIndex = 0;
      audio = new Audio();
      audio.loop = true;
      audio.preload = "auto";
      audio.src = encodeURI(sources[sourceIndex]);

      audio.addEventListener("error", () => {
        sourceIndex++;
        if (sourceIndex < sources.length && audio) {
          audio.src = encodeURI(sources[sourceIndex]);
          audio.load();
        } else {
          console.warn(`[AudioContext] Unable to load audio track for stem "${id}"`);
        }
      });

      audioMap.set(id, audio);
    }
    return audio;
  };

  const syncAudioPlayback = () => {
    if (typeof window === "undefined") return;
    const master = masterGain();
    const muted = isMuted();
    const isDucked = pomoSyncEnabled() && timerRestActive();
    const running = timerRunning();

    stems.forEach((stem) => {
      const audio = getOrCreateAudio(stem.id);
      if (!audio) return;

      const shouldPlay = running && stem.active && stem.volume > 0 && !muted && master > 0 && !isDucked;
      const targetVolume = (stem.volume / 100) * (master / 100);

      audio.volume = Math.max(0, Math.min(1, targetVolume));

      if (shouldPlay) {
        if (audio.paused) {
          const promise = audio.play();
          if (promise !== undefined) {
            promise.catch((err) => {
              console.debug(`[Audio] Autoplay pending user interaction for stem "${stem.id}":`, err);
            });
          }
        }
      } else {
        if (!audio.paused) {
          audio.pause();
        }
      }
    });
  };

  onMount(() => {
    // Pre-initialize audio elements
    stems.forEach((stem) => {
      getOrCreateAudio(stem.id);
    });

    // Handle browser/webview autoplay unlock on first user gesture
    const unlockAutoplay = () => {
      window.removeEventListener("pointerdown", unlockAutoplay);
      window.removeEventListener("keydown", unlockAutoplay);
      syncAudioPlayback();
    };

    window.addEventListener("pointerdown", unlockAutoplay, { passive: true });
    window.addEventListener("keydown", unlockAutoplay, { passive: true });

    // Initial playback sync (will stay paused since timerRunning is false)
    syncAudioPlayback();

    onCleanup(() => {
      window.removeEventListener("pointerdown", unlockAutoplay);
      window.removeEventListener("keydown", unlockAutoplay);
      audioMap.forEach((el) => {
        el.pause();
        el.src = "";
      });
      audioMap.clear();
    });
  });

  // React to reactive state changes
  createEffect(() => {
    masterGain();
    isMuted();
    pomoSyncEnabled();
    timerRestActive();
    timerRunning();
    for (let i = 0; i < stems.length; i++) {
      void stems[i].active;
      void stems[i].volume;
    }

    syncAudioPlayback();
  });

  const setTimerRunning = (running: boolean) => {
    setTimerRunningSignal(running);
    syncAudioPlayback();
  };

  const toggleStem = (id: string) => {
    const index = stems.findIndex((s) => s.id === id);
    if (index === -1) return;

    const current = stems[index];
    const willBeActive = !current.active;
    
    setStems(index, "active", willBeActive);
    if (willBeActive && current.volume === 0) {
      setStems(index, "volume", 50);
    }
    syncAudioPlayback();
  };

  const setStemVolume = (id: string, volume: number) => {
    const index = stems.findIndex((s) => s.id === id);
    if (index === -1) return;

    setStems(index, "volume", volume);
    if (volume > 0 && !stems[index].active) {
      setStems(index, "active", true);
    } else if (volume === 0 && stems[index].active) {
      setStems(index, "active", false);
    }
    syncAudioPlayback();
  };

  const setMasterGain = (gain: number) => {
    setMasterGainSignal(gain);
    if (gain === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
    syncAudioPlayback();
  };

  const toggleMasterMute = () => {
    if (isMuted()) {
      const restore = preMuteGain() > 0 ? preMuteGain() : 85;
      setMasterGainSignal(restore);
      setIsMuted(false);
    } else {
      setPreMuteGain(masterGain());
      setMasterGainSignal(0);
      setIsMuted(true);
    }
    syncAudioPlayback();
  };

  const togglePomoSync = () => {
    setPomoSyncEnabled((prev) => !prev);
    syncAudioPlayback();
  };

  const selectPreset = (presetId: string) => {
    setActivePresetId(presetId);
    if (presetId === "custom") return;

    const presets = loadPresets();
    const target = presets.find((p) => p.id === presetId);
    if (!target) return;

    // Apply preset stems
    target.stems.forEach((pStem) => {
      const idx = stems.findIndex((s) => s.id === pStem.id);
      if (idx !== -1) {
        setStems(idx, "volume", pStem.volume);
        setStems(idx, "active", pStem.active);
      }
    });
    syncAudioPlayback();
  };

  const resetAllStems = () => {
    stems.forEach((_, idx) => {
      setStems(idx, "volume", 0);
      setStems(idx, "active", false);
    });
    syncAudioPlayback();
  };

  const value: AudioContextValue = {
    stems,
    masterGain,
    isMuted,
    pomoSyncEnabled,
    isTimerRestActive: timerRestActive,
    isTimerRunning: timerRunning,
    activePresetId,
    activeStemsCount,
    activeStemSummary,
    toggleStem,
    setStemVolume,
    setMasterGain,
    toggleMasterMute,
    togglePomoSync,
    setTimerRestActive,
    setTimerRunning,
    selectPreset,
    resetAllStems,
  };

  return <AudioContext.Provider value={value}>{props.children}</AudioContext.Provider>;
};

export const useAudio = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used within an AudioProvider");
  return ctx;
};
