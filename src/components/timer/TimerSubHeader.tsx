import { For } from "solid-js";
import { useTimer } from "../../context/TimerContext";
import { usePreferences } from "../../context/PreferencesContext";

interface TimerSubHeaderProps {
  class?: string;
}

export const TimerSubHeader = (props: TimerSubHeaderProps) => {
  const timer = useTimer();
  const { preferences } = usePreferences();

  const isFocus = () => timer.currentPhase() === "focus";
  const isShortBreak = () => timer.currentPhase() === "short_break";
  const isLongBreak = () => timer.currentPhase() === "long_break";

  const accentBgColor = () => {
    if (isShortBreak()) return "bg-break-cyan";
    if (isLongBreak()) return "bg-secondary";
    return "bg-focus-emerald";
  };

  const accentTextColor = () => {
    if (isShortBreak()) return "text-break-cyan";
    if (isLongBreak()) return "text-secondary";
    return "text-primary";
  };

  const cycleBarClass = (cycleIndex: number) => {
    const isCurrent = timer.currentCycle() === cycleIndex;
    const isCompleted = timer.currentCycle() >= cycleIndex;
    const width = isCurrent ? "w-6" : "w-4";
    const bg = isCompleted ? accentBgColor() : "bg-surface-container-high";
    const pulse = isCurrent ? "animate-pulse" : "";
    return `${width} h-1.5 rounded-full ${bg} ${pulse}`.trim();
  };

  return (
    <header
      class={`w-full flex flex-col md:flex-row items-center justify-between gap-space-md py-space-sm px-space-md rounded-xl bg-surface-card shadow-sm ${
        props.class || ""
      }`}
    >
      {/* Left: Cycle Indicator & Preset */}
      <div class="flex items-center gap-space-md w-full md:w-auto justify-between md:justify-start">
        <div class="flex items-center gap-space-xs">
          <span class="font-mono-label text-mono-label text-text-secondary uppercase tracking-widest mr-1">
            CYCLE
          </span>
          <div
            class="flex items-center gap-1.5"
            title={`Cycle ${timer.currentCycle()} of ${timer.totalCycles()} Active`}
          >
            <For each={Array.from({ length: timer.totalCycles() }, (_, i) => i + 1)}>
              {(cycleIndex) => <span class={cycleBarClass(cycleIndex)}></span>}
            </For>
          </div>
          <span class="font-mono-metric text-mono-metric text-text-primary ml-1.5">
            {timer.currentCycle()}/{timer.totalCycles()}
          </span>
        </div>

        <div class="h-3 w-px bg-surface-container-high hidden sm:block"></div>

        <div class="flex items-center gap-1.5 px-space-sm py-0.5 rounded-lg bg-surface-container-low">
          <span class={`material-symbols-outlined text-[14px] ${accentTextColor()}`}>tune</span>
          <span class="font-caption text-caption text-text-secondary">Preset:</span>
          <span class="font-mono-label text-mono-label text-text-primary font-medium">
            Cadence ({preferences.intervals.focus}/{preferences.intervals.shortBreak})
          </span>
        </div>
      </div>

      {/* Right: Phase Switcher Tabs */}
      <div class="flex items-center p-1 rounded-xl bg-surface-container-lowest gap-1 w-full md:w-auto justify-center">
        <button
          type="button"
          onClick={() => timer.setPhase("focus")}
          class={`flex items-center gap-1.5 px-space-md py-1 rounded-lg font-body-sm text-body-sm transition-all ${
            isFocus()
              ? "bg-surface-container-high text-text-primary shadow-sm"
              : "hover:bg-surface-container-low text-text-secondary hover:text-text-primary cursor-pointer"
          }`}
        >
          <span class={`w-1.5 h-1.5 rounded-full ${isFocus() ? "bg-focus-emerald" : "bg-focus-emerald/40"}`}></span>
          <span>Focus {preferences.intervals.focus}m</span>
        </button>

        <button
          type="button"
          onClick={() => timer.setPhase("short_break")}
          class={`flex items-center gap-1.5 px-space-md py-1 rounded-lg font-body-sm text-body-sm transition-all ${
            isShortBreak()
              ? "bg-surface-container-high text-break-cyan shadow-sm"
              : "hover:bg-surface-container-low text-text-secondary hover:text-text-primary cursor-pointer"
          }`}
        >
          <span class={`w-1.5 h-1.5 rounded-full ${isShortBreak() ? "bg-break-cyan" : "bg-break-cyan/40"}`}></span>
          <span>Short Break {preferences.intervals.shortBreak}m</span>
        </button>

        <button
          type="button"
          onClick={() => timer.setPhase("long_break")}
          class={`flex items-center gap-1.5 px-space-md py-1 rounded-lg font-body-sm text-body-sm transition-all ${
            isLongBreak()
              ? "bg-surface-container-high text-secondary shadow-sm"
              : "hover:bg-surface-container-low text-text-secondary hover:text-text-primary cursor-pointer"
          }`}
        >
          <span class={`w-1.5 h-1.5 rounded-full ${isLongBreak() ? "bg-secondary" : "bg-secondary/40"}`}></span>
          <span>Long Break {preferences.intervals.longBreak}m</span>
        </button>
      </div>
    </header>
  );
};
