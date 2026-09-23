import { createContext, useContext, createSignal, createEffect, onMount, onCleanup, type ParentProps } from "solid-js";
import { playChimeProfile } from "../services/soundEngine";
import { notifyPhaseComplete } from "../services/ipc";
import { useAudio } from "./AudioContext";
import { usePreferences } from "./PreferencesContext";

export type TimerPhase = "focus" | "short_break" | "long_break";

export interface TrajectoryItem {
  id: string;
  cycleNumber: number;
  title: string;
  timeRange: string;
  completed: boolean;
}

export interface ActiveTask {
  title: string;
  description: string;
  priority: string;
  sprint: string;
}

interface TimerContextValue {
  currentPhase: () => TimerPhase;
  remainingSeconds: () => number;
  totalSeconds: () => number;
  isRunning: () => boolean;
  currentCycle: () => number;
  totalCycles: () => number;
  activeTask: () => ActiveTask;
  trajectory: () => TrajectoryItem[];
  progressFraction: () => number;
  formattedMinutes: () => string;
  formattedSeconds: () => string;
  toggleTimer: () => void;
  resetTimer: () => void;
  skipPhase: () => void;
  setPhase: (phase: TimerPhase) => void;
  resetCycleCounter: () => void;
  updateActiveTask: (task: Partial<ActiveTask>) => void;
}

const TimerContext = createContext<TimerContextValue>();

export const TimerProvider = (props: ParentProps) => {
  const audio = useAudio();
  const { preferences } = usePreferences();

  const [currentPhase, setCurrentPhase] = createSignal<TimerPhase>("focus");
  const [isRunning, setIsRunning] = createSignal(false);
  const [currentCycle, setCurrentCycle] = createSignal(2);
  const totalCycles = () => 4;

  createEffect(() => {
    const phase = currentPhase();
    const isRest = phase === "short_break" || phase === "long_break";
    audio.setTimerRestActive(isRest && preferences.audio.muteOnBreak);
  });

  createEffect(() => {
    audio.setTimerRunning(isRunning());
  });

  // Durations in minutes (can be driven from Preferences)
  const getDurationForPhase = (phase: TimerPhase): number => {
    switch (phase) {
      case "focus":
        return 25 * 60;
      case "short_break":
        return 5 * 60;
      case "long_break":
        return 15 * 60;
    }
  };

  const [totalSeconds, setTotalSeconds] = createSignal(18 * 60 + 42); // Initial demo state: 18m 42s left of 25m
  const [remainingSeconds, setRemainingSeconds] = createSignal(18 * 60 + 42);

  const [activeTask, setActiveTask] = createSignal<ActiveTask>({
    title: "AuraFocus Audio Pipeline Architecture",
    description: "Implementing low-latency WebAudio stems with zero GC pauses.",
    priority: "HIGH",
    sprint: "Sprint #4",
  });

  const [trajectory] = createSignal<TrajectoryItem[]>([
    { id: "c1", cycleNumber: 1, title: "Cycle 1: Core Setup & Profiling", timeRange: "09:00 - 09:25", completed: true },
    { id: "c2", cycleNumber: 2, title: "Cycle 2: Audio Engine Nodes", timeRange: "09:30 - 09:55", completed: true },
    { id: "c3", cycleNumber: 3, title: "Cycle 3: Web Audio Synth Graph", timeRange: "10:00 - 10:25", completed: true },
    { id: "c4", cycleNumber: 4, title: "Cycle 4: Buffer Mixing Pipeline", timeRange: "10:30 - 10:55", completed: true },
  ]);

  const formattedMinutes = () => {
    const mins = Math.floor(remainingSeconds() / 60);
    return String(mins).padStart(2, "0");
  };

  const formattedSeconds = () => {
    const secs = remainingSeconds() % 60;
    return String(secs).padStart(2, "0");
  };

  const progressFraction = () => {
    const total = getDurationForPhase(currentPhase());
    if (total <= 0) return 0;
    return Math.max(0, Math.min(1, remainingSeconds() / total));
  };

  const setPhase = (phase: TimerPhase) => {
    setCurrentPhase(phase);
    const duration = getDurationForPhase(phase);
    setTotalSeconds(duration);
    setRemainingSeconds(duration);
    setIsRunning(false);
    audio.setTimerRunning(false);
  };

  const toggleTimer = () => {
    setIsRunning((prev) => {
      const next = !prev;
      audio.setTimerRunning(next);
      return next;
    });
  };

  const resetTimer = () => {
    setIsRunning(false);
    audio.setTimerRunning(false);
    const duration = getDurationForPhase(currentPhase());
    setRemainingSeconds(duration);
  };

  const resetCycleCounter = () => {
    setCurrentCycle(1);
    setPhase("focus");
  };

  const skipPhase = () => {
    if (currentPhase() === "focus") {
      if (currentCycle() >= totalCycles()) {
        setPhase("long_break");
      } else {
        setPhase("short_break");
      }
    } else if (currentPhase() === "short_break") {
      setCurrentCycle((c) => Math.min(totalCycles(), c + 1));
      setPhase("focus");
    } else {
      setCurrentCycle(1);
      setPhase("focus");
    }
  };

  const updateActiveTask = (updated: Partial<ActiveTask>) => {
    setActiveTask((prev) => ({ ...prev, ...updated }));
  };

  // Timer tick interval
  onMount(() => {
    const interval = setInterval(() => {
      if (isRunning()) {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            // Phase completed!
            setIsRunning(false);
            audio.setTimerRunning(false);
            if (preferences.audio.chimeEnabled) {
              playChimeProfile(preferences.audio.chimeProfile);
            }
            notifyPhaseComplete(currentPhase(), "Interval completed!");
            
            // Advance phase automatically
            setTimeout(skipPhase, 500);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    // Global keyboard shortcut: Cmd+Shift+Space or Ctrl+Shift+Space or Space on body
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === "Space" &&
        (e.metaKey || e.ctrlKey || (e.target as HTMLElement)?.tagName === "BODY")
      ) {
        // Only prevent default if not inside an active text input
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA" && target.tagName !== "SELECT") {
          e.preventDefault();
          toggleTimer();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    onCleanup(() => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
    });
  });

  const value: TimerContextValue = {
    currentPhase,
    remainingSeconds,
    totalSeconds,
    isRunning,
    currentCycle,
    totalCycles,
    activeTask,
    trajectory,
    progressFraction,
    formattedMinutes,
    formattedSeconds,
    toggleTimer,
    resetTimer,
    skipPhase,
    setPhase,
    resetCycleCounter,
    updateActiveTask,
  };

  return <TimerContext.Provider value={value}>{props.children}</TimerContext.Provider>;
};

export const useTimer = () => {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error("useTimer must be used within a TimerProvider");
  return ctx;
};
