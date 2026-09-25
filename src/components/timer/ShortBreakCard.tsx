import { For } from "solid-js";
import { useTimer } from "../../context/TimerContext";
import { usePreferences } from "../../context/PreferencesContext";
import { playChimeProfile } from "../../services/soundEngine";
import { TimerSubHeader } from "./TimerSubHeader";

export const ShortBreakCard = () => {
  const timer = useTimer();
  const { preferences } = usePreferences();

  const totalCircumference = 2 * Math.PI * 102; // 640.88
  const strokeOffset = () => {
    const fraction = timer.progressFraction();
    return totalCircumference * (1 - fraction);
  };

  const previewChime = () => {
    playChimeProfile(preferences.audio.chimeProfile);
  };

  const nextCycleNum = () =>
    timer.currentCycle() + 1 <= timer.totalCycles()
      ? String(timer.currentCycle() + 1).padStart(2, "0")
      : "01";

  return (
    <div class="relative w-full max-w-5xl mx-auto px-margin py-space-lg flex flex-col gap-space-xl select-none">
      {/* Cyan Rest Ambient Halo */}
      <div class="absolute top-12 left-1/2 -translate-x-1/2 w-[480px] h-[320px] bg-break-cyan/10 rounded-full blur-[110px] pointer-events-none -z-10"></div>

      {/* Sub-header Bar: Session Metadata & Modes */}
      <TimerSubHeader />

      {/* Main Hero Stage: Rest Radial Gauge */}
      <div class="relative flex flex-col items-center justify-center pt-space-lg pb-space-xl">
        <div class="relative w-[300px] h-[300px] sm:w-[340px] sm:h-[340px] flex items-center justify-center">
          <svg class="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 240 240">
            <circle
              class="text-surface-container-high"
              cx="120"
              cy="120"
              fill="none"
              r="102"
              stroke="currentColor"
              stroke-width="3"
            ></circle>
            <circle
              class="text-break-cyan transition-all duration-1000 ease-out"
              cx="120"
              cy="120"
              fill="none"
              id="radial-progress"
              r="102"
              stroke="currentColor"
              stroke-dasharray="640.88"
              stroke-dashoffset={strokeOffset()}
              stroke-linecap="round"
              stroke-width="5"
              style={{ filter: "drop-shadow(0 0 10px rgba(6, 182, 212, 0.45))" }}
            ></circle>
          </svg>

          <div class="flex flex-col items-center text-center z-10 select-none">
            <div class="inline-flex items-center gap-1.5 px-space-md py-0.5 mb-2 rounded-full bg-break-cyan/15 text-break-cyan font-mono-label text-mono-label tracking-widest uppercase">
              <span class="material-symbols-outlined text-[14px]">local_cafe</span>
              <span>SHORT BREAK</span>
            </div>
            <div class="font-timer-display text-timer-display text-text-primary tracking-tighter tabular-nums drop-shadow-sm font-light">
              {timer.formattedMinutes()}:{timer.formattedSeconds()}
            </div>
            <div class="flex items-center gap-1.5 mt-2 px-space-sm py-1 rounded bg-surface-container-low text-text-secondary font-mono-metric text-mono-metric">
              <span class="material-symbols-outlined text-[14px] text-break-cyan">volume_down</span>
              <span>Audio attenuated (-24dB ducked)</span>
            </div>
          </div>
        </div>

        {/* Rest Actions */}
        <div class="flex flex-col items-center gap-space-md mt-space-lg">
          <div class="flex items-center gap-space-md">
            <button
              type="button"
              aria-label="Reset Timer"
              onClick={timer.resetTimer}
              class="w-10 h-10 rounded-full bg-surface-card hover:bg-surface-elevated text-text-secondary hover:text-text-primary flex items-center justify-center transition-all shadow-sm cursor-pointer"
            >
              <span class="material-symbols-outlined text-[20px]">replay</span>
            </button>
            <button
              type="button"
              aria-label={timer.isRunning() ? "Pause Break" : "Resume Break"}
              onClick={timer.toggleTimer}
              class="w-14 h-14 rounded-full bg-break-cyan text-on-secondary-fixed flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-break-cyan/25 cursor-pointer"
            >
              <span class="material-symbols-outlined text-[30px]" style={{ "font-variation-settings": "'FILL' 1" }}>
                {timer.isRunning() ? "pause" : "play_arrow"}
              </span>
            </button>
            <button
              type="button"
              aria-label="Skip to Next Focus Block"
              onClick={timer.skipPhase}
              class="w-10 h-10 rounded-full bg-surface-card hover:bg-surface-elevated text-text-secondary hover:text-text-primary flex items-center justify-center transition-all shadow-sm cursor-pointer"
            >
              <span class="material-symbols-outlined text-[20px]">skip_next</span>
            </button>
          </div>

          <div class="flex items-center gap-2 text-text-tertiary font-mono-label text-mono-label">
            <kbd class="px-1.5 py-0.5 rounded bg-surface-container-high text-text-secondary font-mono-label">⌘</kbd>
            <kbd class="px-1.5 py-0.5 rounded bg-surface-container-high text-text-secondary font-mono-label">⇧</kbd>
            <kbd class="px-1.5 py-0.5 rounded bg-surface-container-high text-text-secondary font-mono-label">SPACE</kbd>
            <span>to toggle pause/resume</span>
          </div>
        </div>
      </div>

      {/* 3 Metrics Cards */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        {/* Card 1: Today's Focus */}
        <div class="p-space-lg rounded-xl bg-surface-card flex flex-col justify-between shadow-sm">
          <div class="flex items-center justify-between mb-space-sm">
            <span class="font-mono-label text-mono-label text-text-secondary uppercase">Today's Focus</span>
            <span class="px-2 py-0.5 rounded bg-focus-emerald/15 text-focus-emerald font-mono-metric text-mono-metric">
              +25m vs ystd
            </span>
          </div>
          <div class="my-space-xs">
            <div class="font-headline-lg text-headline-lg text-text-primary tracking-tight font-semibold">
              {Math.floor((preferences.intervals.focus * timer.totalCycles()) / 60)}h {(preferences.intervals.focus * timer.totalCycles()) % 60}m
            </div>
            <div class="font-body-sm text-body-sm text-text-tertiary">
              Cadence target: {timer.totalCycles()} focus sprints
            </div>
          </div>
          <div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-space-md">
            <div
              class="bg-focus-emerald h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.round((timer.currentCycle() / timer.totalCycles()) * 100))}%` }}
            ></div>
          </div>
        </div>

        {/* Card 2: Session Trajectory */}
        <div class="p-space-lg rounded-xl bg-surface-card flex flex-col justify-between shadow-sm">
          <div class="flex items-center justify-between mb-space-sm">
            <span class="font-mono-label text-mono-label text-text-secondary uppercase">Session Trajectory</span>
            <span class="font-mono-metric text-mono-metric text-break-cyan">
              {timer.currentCycle()} of {timer.totalCycles()} blocks
            </span>
          </div>
          <div class="flex items-center justify-between gap-1 my-space-xs py-1 overflow-x-auto">
            <For each={Array.from({ length: timer.totalCycles() }, (_, i) => i + 1)}>
              {(cycleNum, index) => {
                const isPast = () => timer.currentCycle() > cycleNum;
                const isCurrent = () => timer.currentCycle() === cycleNum;
                return (
                  <>
                    <div class="flex flex-col items-center gap-1 shrink-0">
                      <span
                        class={`rounded-full transition-all ${
                          isCurrent()
                            ? "w-3 h-3 bg-break-cyan ring-4 ring-break-cyan/20"
                            : isPast()
                            ? "w-2.5 h-2.5 bg-focus-emerald"
                            : "w-2.5 h-2.5 bg-surface-bright"
                        }`}
                      ></span>
                      <span
                        class={`font-caption text-caption ${
                          isCurrent() ? "text-break-cyan font-medium" : "text-text-tertiary"
                        }`}
                      >
                        {isCurrent() ? "REST" : `C${cycleNum}`}
                      </span>
                    </div>
                    {index() < timer.totalCycles() - 1 && (
                      <div
                        class={`h-0.5 flex-1 min-w-[8px] mx-0.5 ${
                          isPast() ? "bg-focus-emerald" : isCurrent() ? "bg-break-cyan" : "bg-surface-container-high"
                        }`}
                      ></div>
                    )}
                  </>
                );
              }}
            </For>
          </div>
          <div class="font-mono-metric text-mono-metric text-text-secondary mt-space-xs truncate">
            Next: Block {nextCycleNum()} (Focus {preferences.intervals.focus}m)
          </div>
        </div>

        {/* Card 3: Rest Advice */}
        <div class="p-space-lg rounded-xl bg-surface-card flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div class="absolute top-0 right-0 p-space-sm opacity-10">
            <span class="material-symbols-outlined text-[64px] text-break-cyan">spa</span>
          </div>
          <div class="flex items-center justify-between mb-space-sm z-10">
            <span class="font-mono-label text-mono-label text-text-secondary uppercase">Rest Advice</span>
            <span class="flex items-center gap-1 text-break-cyan font-caption text-caption">
              <span class="material-symbols-outlined text-[13px]">notifications_active</span>
              <span>Chime Ready</span>
            </span>
          </div>
          <div class="my-space-xs z-10">
            <div class="font-headline-md text-headline-md text-text-primary tracking-tight font-medium">
              Step away from screen.
            </div>
            <div class="font-body-sm text-body-sm text-text-secondary mt-1">
              Look 20ft away into the distance, hydrate, or do a thoracic spinal stretch.
            </div>
          </div>
          <div class="flex items-center gap-2 mt-space-sm z-10">
            <button
              type="button"
              onClick={previewChime}
              class="px-space-sm py-1 rounded bg-surface-container-high hover:bg-surface-bright text-text-primary font-caption text-caption flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span class="material-symbols-outlined text-[12px]">volume_up</span>
              <span>Chime Sound Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Auto-Ducking Status Strip */}
      <div class="flex flex-col sm:flex-row items-center justify-between gap-space-md p-space-md rounded-xl bg-surface-card shadow-sm">
        <div class="flex items-center gap-space-md w-full sm:w-auto">
          <div class="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-break-cyan">
            <span class="material-symbols-outlined text-[18px]">graphic_eq</span>
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-2">
              <span class="font-mono-label text-mono-label text-text-primary uppercase tracking-wider">
                AuraSound Engine
              </span>
              <span class="px-1.5 py-0.2 rounded bg-break-cyan/15 text-break-cyan font-mono-label text-[10px]">
                AUTO-DUCK ACTIVE
              </span>
            </div>
            <span class="font-caption text-caption text-text-tertiary">
              Muted for break interval · Resumes automatically on next cycle
            </span>
          </div>
        </div>
        <div class="flex items-center gap-space-sm w-full sm:w-80">
          <span class="material-symbols-outlined text-text-tertiary text-[18px]">volume_mute</span>
          <div class="relative flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
            <div class="h-full bg-break-cyan w-[65%] opacity-80"></div>
          </div>
          <span class="font-mono-metric text-mono-metric text-break-cyan min-w-[32px]">65%</span>
        </div>
      </div>
    </div>
  );
};
