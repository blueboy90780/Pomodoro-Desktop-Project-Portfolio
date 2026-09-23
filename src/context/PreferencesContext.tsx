import { createContext, useContext, createSignal, type ParentProps } from "solid-js";
import { createStore } from "solid-js/store";
import { loadPreferences, savePreferences } from "../services/storage";
import type { ChimeProfile } from "../services/soundEngine";

export interface PreferencesState {
  intervals: {
    focus: number;
    shortBreak: number;
    longBreak: number;
    cycles: number;
  };
  audio: {
    muteOnBreak: boolean;
    chimeEnabled: boolean;
    chimeProfile: ChimeProfile;
    outputEndpoint: string;
  };
  os: {
    hotkey: string;
    startMinimized: boolean;
    closeToTray: boolean;
    menubarTimer: boolean;
    osNotifications: boolean;
  };
}

const DEFAULT_PREFERENCES: PreferencesState = {
  intervals: {
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
    cycles: 4,
  },
  audio: {
    muteOnBreak: true,
    chimeEnabled: true,
    chimeProfile: "zen-bell",
    outputEndpoint: "System Default (External Audio Interface / USB DAC)",
  },
  os: {
    hotkey: "⌘ Shift Space",
    startMinimized: false,
    closeToTray: true,
    menubarTimer: true,
    osNotifications: true,
  },
};

interface PreferencesContextValue {
  preferences: PreferencesState;
  adjustDuration: (target: "focus" | "short" | "long" | "cycle", delta: number) => void;
  setAudioToggle: (key: keyof PreferencesState["audio"], value: boolean) => void;
  setChimeProfile: (profile: ChimeProfile) => void;
  setOutputEndpoint: (endpoint: string) => void;
  setOsToggle: (key: keyof PreferencesState["os"], value: boolean) => void;
  setHotkey: (hotkey: string) => void;
  resetToFactoryDefaults: () => void;
  savePreferencesToDisk: () => void;
  isSavedToastVisible: () => boolean;
  toastMessage: () => string;
}

const PreferencesContext = createContext<PreferencesContextValue>();

export const PreferencesProvider = (props: ParentProps) => {
  const [preferences, setPreferences] = createStore<PreferencesState>(
    loadPreferences(DEFAULT_PREFERENCES)
  );
  const [isSavedToastVisible, setIsSavedToastVisible] = createSignal(false);
  const [toastMessage, setToastMessage] = createSignal("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setIsSavedToastVisible(true);
    setTimeout(() => {
      setIsSavedToastVisible(false);
    }, 2500);
  };

  const adjustDuration = (target: "focus" | "short" | "long" | "cycle", delta: number) => {
    switch (target) {
      case "focus":
        setPreferences("intervals", "focus", (v) => Math.max(5, Math.min(120, v + delta)));
        break;
      case "short":
        setPreferences("intervals", "shortBreak", (v) => Math.max(1, Math.min(30, v + delta)));
        break;
      case "long":
        setPreferences("intervals", "longBreak", (v) => Math.max(5, Math.min(60, v + delta)));
        break;
      case "cycle":
        setPreferences("intervals", "cycles", (v) => Math.max(1, Math.min(12, v + delta)));
        break;
    }
  };

  const setAudioToggle = (key: keyof PreferencesState["audio"], value: boolean) => {
    setPreferences("audio", key, value as never);
  };

  const setChimeProfile = (profile: ChimeProfile) => {
    setPreferences("audio", "chimeProfile", profile);
  };

  const setOutputEndpoint = (endpoint: string) => {
    setPreferences("audio", "outputEndpoint", endpoint);
  };

  const setOsToggle = (key: keyof PreferencesState["os"], value: boolean) => {
    setPreferences("os", key, value as never);
  };

  const setHotkey = (hotkey: string) => {
    setPreferences("os", "hotkey", hotkey);
  };

  const resetToFactoryDefaults = () => {
    setPreferences("intervals", { ...DEFAULT_PREFERENCES.intervals });
    setPreferences("audio", { ...DEFAULT_PREFERENCES.audio });
    setPreferences("os", { ...DEFAULT_PREFERENCES.os });
    savePreferences(DEFAULT_PREFERENCES);
    showToast("RESTORED DEFAULT SYSTEM STATE");
  };

  const savePreferencesToDisk = () => {
    savePreferences(preferences);
    showToast("PREFERENCES WRITTEN TO DISK");
  };

  const value: PreferencesContextValue = {
    preferences,
    adjustDuration,
    setAudioToggle,
    setChimeProfile,
    setOutputEndpoint,
    setOsToggle,
    setHotkey,
    resetToFactoryDefaults,
    savePreferencesToDisk,
    isSavedToastVisible,
    toastMessage,
  };

  return <PreferencesContext.Provider value={value}>{props.children}</PreferencesContext.Provider>;
};

export const usePreferences = () => {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used within a PreferencesProvider");
  return ctx;
};
