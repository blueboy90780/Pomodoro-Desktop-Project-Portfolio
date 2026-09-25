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
  draftPreferences: PreferencesState;
  hasUnsavedChanges: () => boolean;
  adjustDuration: (target: "focus" | "short" | "long" | "cycle", delta: number) => void;
  setAudioToggle: (key: keyof PreferencesState["audio"], value: boolean) => void;
  setChimeProfile: (profile: ChimeProfile) => void;
  setOutputEndpoint: (endpoint: string) => void;
  setOsToggle: (key: keyof PreferencesState["os"], value: boolean) => void;
  setHotkey: (hotkey: string) => void;
  resetToFactoryDefaults: () => void;
  savePreferencesToDisk: () => void;
  discardDraftChanges: () => void;
  isSavedToastVisible: () => boolean;
  toastMessage: () => string;
}

const PreferencesContext = createContext<PreferencesContextValue>();

export const PreferencesProvider = (props: ParentProps) => {
  const getInitialPreferences = (): PreferencesState => {
    const loaded = loadPreferences(DEFAULT_PREFERENCES);
    if (!loaded.intervals.cycles || loaded.intervals.cycles < 2) {
      loaded.intervals.cycles = 2;
    }
    return loaded;
  };

  const initial = getInitialPreferences();
  const [preferences, setPreferences] = createStore<PreferencesState>(JSON.parse(JSON.stringify(initial)));
  const [draftPreferences, setDraftPreferences] = createStore<PreferencesState>(JSON.parse(JSON.stringify(initial)));

  const [isSavedToastVisible, setIsSavedToastVisible] = createSignal(false);
  const [toastMessage, setToastMessage] = createSignal("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setIsSavedToastVisible(true);
    setTimeout(() => {
      setIsSavedToastVisible(false);
    }, 2500);
  };

  const hasUnsavedChanges = () => {
    return (
      draftPreferences.intervals.focus !== preferences.intervals.focus ||
      draftPreferences.intervals.shortBreak !== preferences.intervals.shortBreak ||
      draftPreferences.intervals.longBreak !== preferences.intervals.longBreak ||
      draftPreferences.intervals.cycles !== preferences.intervals.cycles ||
      draftPreferences.audio.muteOnBreak !== preferences.audio.muteOnBreak ||
      draftPreferences.audio.chimeEnabled !== preferences.audio.chimeEnabled ||
      draftPreferences.audio.chimeProfile !== preferences.audio.chimeProfile ||
      draftPreferences.audio.outputEndpoint !== preferences.audio.outputEndpoint ||
      draftPreferences.os.hotkey !== preferences.os.hotkey ||
      draftPreferences.os.startMinimized !== preferences.os.startMinimized ||
      draftPreferences.os.closeToTray !== preferences.os.closeToTray ||
      draftPreferences.os.menubarTimer !== preferences.os.menubarTimer ||
      draftPreferences.os.osNotifications !== preferences.os.osNotifications
    );
  };

  const adjustDuration = (target: "focus" | "short" | "long" | "cycle", delta: number) => {
    switch (target) {
      case "focus":
        setDraftPreferences("intervals", "focus", (v) => Math.max(5, Math.min(120, v + delta)));
        break;
      case "short":
        setDraftPreferences("intervals", "shortBreak", (v) => Math.max(1, Math.min(30, v + delta)));
        break;
      case "long":
        setDraftPreferences("intervals", "longBreak", (v) => Math.max(5, Math.min(60, v + delta)));
        break;
      case "cycle":
        setDraftPreferences("intervals", "cycles", (v) => Math.max(2, Math.min(12, v + delta)));
        break;
    }
  };

  const setAudioToggle = (key: keyof PreferencesState["audio"], value: boolean) => {
    setDraftPreferences("audio", key, value as never);
  };

  const setChimeProfile = (profile: ChimeProfile) => {
    setDraftPreferences("audio", "chimeProfile", profile);
  };

  const setOutputEndpoint = (endpoint: string) => {
    setDraftPreferences("audio", "outputEndpoint", endpoint);
  };

  const setOsToggle = (key: keyof PreferencesState["os"], value: boolean) => {
    setDraftPreferences("os", key, value as never);
  };

  const setHotkey = (hotkey: string) => {
    setDraftPreferences("os", "hotkey", hotkey);
  };

  const resetToFactoryDefaults = () => {
    setDraftPreferences("intervals", { ...DEFAULT_PREFERENCES.intervals });
    setDraftPreferences("audio", { ...DEFAULT_PREFERENCES.audio });
    setDraftPreferences("os", { ...DEFAULT_PREFERENCES.os });

    setPreferences("intervals", { ...DEFAULT_PREFERENCES.intervals });
    setPreferences("audio", { ...DEFAULT_PREFERENCES.audio });
    setPreferences("os", { ...DEFAULT_PREFERENCES.os });

    savePreferences(DEFAULT_PREFERENCES);
    showToast("RESTORED DEFAULT SYSTEM STATE");
  };

  const discardDraftChanges = () => {
    setDraftPreferences("intervals", { ...preferences.intervals });
    setDraftPreferences("audio", { ...preferences.audio });
    setDraftPreferences("os", { ...preferences.os });
    showToast("REVERTED UNSAVED CHANGES");
  };

  const savePreferencesToDisk = () => {
    setPreferences("intervals", { ...draftPreferences.intervals });
    setPreferences("audio", { ...draftPreferences.audio });
    setPreferences("os", { ...draftPreferences.os });
    savePreferences({
      intervals: { ...draftPreferences.intervals },
      audio: { ...draftPreferences.audio },
      os: { ...draftPreferences.os },
    });
    showToast("PREFERENCES APPLIED & SAVED");
  };

  const value: PreferencesContextValue = {
    preferences,
    draftPreferences,
    hasUnsavedChanges,
    adjustDuration,
    setAudioToggle,
    setChimeProfile,
    setOutputEndpoint,
    setOsToggle,
    setHotkey,
    resetToFactoryDefaults,
    discardDraftChanges,
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
