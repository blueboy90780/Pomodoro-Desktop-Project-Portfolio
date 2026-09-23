import { usePreferences } from "../../context/PreferencesContext";

export const CadenceSection = () => {
  const { preferences, adjustDuration } = usePreferences();

  return (
    <section class="bg-surface-card rounded-xl p-space-lg sm:p-space-xl shadow-sm relative overflow-hidden select-none">
      <div class="absolute -right-16 -top-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Section Header */}
      <div class="flex items-center justify-between gap-space-md mb-space-lg">
        <div class="flex items-center gap-space-sm">
          <div class="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
            <span class="material-symbols-outlined text-[18px]">timer</span>
          </div>
          <div>
            <h2 class="font-headline-md text-headline-md text-text-primary">Cadence Intervals</h2>
            <p class="font-body-sm text-body-sm text-text-secondary">
              Calibrate intellectual flow sprints and cognitive rest phases
            </p>
          </div>
        </div>
        <span class="font-mono-label text-mono-label text-text-tertiary uppercase bg-surface-container-low px-2 py-0.5 rounded">
          POMODORO CORE
        </span>
      </div>

      {/* 4 Bento Duration Cards */}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {/* Focus Sprint */}
        <div class="bg-surface-container p-space-md rounded-xl flex flex-col justify-between group hover:bg-surface-elevated transition-colors">
          <div class="flex items-center justify-between mb-space-sm">
            <span class="font-mono-label text-mono-label text-primary uppercase">Focus Sprint</span>
            <span class="material-symbols-outlined text-primary text-[16px]">bolt</span>
          </div>
          <div class="flex items-baseline gap-1 my-2">
            <span class="font-timer-display-compact text-timer-display-compact text-text-primary">
              {preferences.intervals.focus}
            </span>
            <span class="font-mono-metric text-mono-metric text-text-tertiary">MIN</span>
          </div>
          <div class="flex items-center gap-1.5 pt-2">
            <button
              type="button"
              aria-label="Decrease Focus Duration"
              onClick={() => adjustDuration("focus", -5)}
              class="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-surface-bright flex items-center justify-center text-text-secondary hover:text-text-primary transition-all active:scale-95 cursor-pointer"
            >
              <span class="material-symbols-outlined text-[16px]">remove</span>
            </button>
            <div class="flex-1 text-center font-caption text-caption text-text-tertiary font-mono-metric">
              STEP 5m
            </div>
            <button
              type="button"
              aria-label="Increase Focus Duration"
              onClick={() => adjustDuration("focus", 5)}
              class="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-surface-bright flex items-center justify-center text-text-secondary hover:text-text-primary transition-all active:scale-95 cursor-pointer"
            >
              <span class="material-symbols-outlined text-[16px]">add</span>
            </button>
          </div>
        </div>

        {/* Short Break */}
        <div class="bg-surface-container p-space-md rounded-xl flex flex-col justify-between group hover:bg-surface-elevated transition-colors">
          <div class="flex items-center justify-between mb-space-sm">
            <span class="font-mono-label text-mono-label text-secondary uppercase">Short Break</span>
            <span class="material-symbols-outlined text-secondary text-[16px]">bedtime</span>
          </div>
          <div class="flex items-baseline gap-1 my-2">
            <span class="font-timer-display-compact text-timer-display-compact text-text-primary">
              {preferences.intervals.shortBreak}
            </span>
            <span class="font-mono-metric text-mono-metric text-text-tertiary">MIN</span>
          </div>
          <div class="flex items-center gap-1.5 pt-2">
            <button
              type="button"
              aria-label="Decrease Short Break"
              onClick={() => adjustDuration("short", -1)}
              class="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-surface-bright flex items-center justify-center text-text-secondary hover:text-text-primary transition-all active:scale-95 cursor-pointer"
            >
              <span class="material-symbols-outlined text-[16px]">remove</span>
            </button>
            <div class="flex-1 text-center font-caption text-caption text-text-tertiary font-mono-metric">
              STEP 1m
            </div>
            <button
              type="button"
              aria-label="Increase Short Break"
              onClick={() => adjustDuration("short", 1)}
              class="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-surface-bright flex items-center justify-center text-text-secondary hover:text-text-primary transition-all active:scale-95 cursor-pointer"
            >
              <span class="material-symbols-outlined text-[16px]">add</span>
            </button>
          </div>
        </div>

        {/* Long Recess */}
        <div class="bg-surface-container p-space-md rounded-xl flex flex-col justify-between group hover:bg-surface-elevated transition-colors">
          <div class="flex items-center justify-between mb-space-sm">
            <span class="font-mono-label text-mono-label text-tertiary uppercase">Long Recess</span>
            <span class="material-symbols-outlined text-tertiary text-[16px]">self_improvement</span>
          </div>
          <div class="flex items-baseline gap-1 my-2">
            <span class="font-timer-display-compact text-timer-display-compact text-text-primary">
              {preferences.intervals.longBreak}
            </span>
            <span class="font-mono-metric text-mono-metric text-text-tertiary">MIN</span>
          </div>
          <div class="flex items-center gap-1.5 pt-2">
            <button
              type="button"
              aria-label="Decrease Long Break"
              onClick={() => adjustDuration("long", -5)}
              class="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-surface-bright flex items-center justify-center text-text-secondary hover:text-text-primary transition-all active:scale-95 cursor-pointer"
            >
              <span class="material-symbols-outlined text-[16px]">remove</span>
            </button>
            <div class="flex-1 text-center font-caption text-caption text-text-tertiary font-mono-metric">
              STEP 5m
            </div>
            <button
              type="button"
              aria-label="Increase Long Break"
              onClick={() => adjustDuration("long", 5)}
              class="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-surface-bright flex items-center justify-center text-text-secondary hover:text-text-primary transition-all active:scale-95 cursor-pointer"
            >
              <span class="material-symbols-outlined text-[16px]">add</span>
            </button>
          </div>
        </div>

        {/* Cadence Rounds */}
        <div class="bg-surface-container p-space-md rounded-xl flex flex-col justify-between group hover:bg-surface-elevated transition-colors">
          <div class="flex items-center justify-between mb-space-sm">
            <span class="font-mono-label text-mono-label text-text-secondary uppercase">Cadence Cadre</span>
            <span class="material-symbols-outlined text-text-secondary text-[16px]">all_inclusive</span>
          </div>
          <div class="flex items-baseline gap-1 my-2">
            <span class="font-timer-display-compact text-timer-display-compact text-text-primary">
              {preferences.intervals.cycles}
            </span>
            <span class="font-mono-metric text-mono-metric text-text-tertiary">ROUNDS</span>
          </div>
          <div class="flex items-center gap-1.5 pt-2">
            <button
              type="button"
              aria-label="Decrease Cycle Interval"
              onClick={() => adjustDuration("cycle", -1)}
              class="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-surface-bright flex items-center justify-center text-text-secondary hover:text-text-primary transition-all active:scale-95 cursor-pointer"
            >
              <span class="material-symbols-outlined text-[16px]">remove</span>
            </button>
            <div class="flex-1 text-center font-caption text-caption text-text-tertiary font-mono-metric">
              STEP 1x
            </div>
            <button
              type="button"
              aria-label="Increase Cycle Interval"
              onClick={() => adjustDuration("cycle", 1)}
              class="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-surface-bright flex items-center justify-center text-text-secondary hover:text-text-primary transition-all active:scale-95 cursor-pointer"
            >
              <span class="material-symbols-outlined text-[16px]">add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Inline Interval Visual Timeline Bar */}
      <div class="mt-space-lg pt-space-md flex flex-col gap-2">
        <div class="flex justify-between items-center text-mono-label font-mono-label text-text-tertiary">
          <span>
            FULL SEQUENCE TIMELINE (
            {preferences.intervals.focus * preferences.intervals.cycles +
              preferences.intervals.shortBreak * (preferences.intervals.cycles - 1) +
              preferences.intervals.longBreak}{" "}
            MIN TOTAL)
          </span>
          <span class="text-primary">
            CYCLE PATTERN: {preferences.intervals.cycles}S × 1L
          </span>
        </div>
        <div class="h-2 w-full rounded-full bg-surface-container overflow-hidden flex gap-1 p-0.5">
          <div class="h-full bg-focus-emerald rounded-full flex-1" title={`Sprint 1 (${preferences.intervals.focus}m)`}></div>
          <div class="h-full bg-break-cyan rounded-full w-4" title={`Break 1 (${preferences.intervals.shortBreak}m)`}></div>
          <div class="h-full bg-focus-emerald rounded-full flex-1" title={`Sprint 2 (${preferences.intervals.focus}m)`}></div>
          <div class="h-full bg-break-cyan rounded-full w-4" title={`Break 2 (${preferences.intervals.shortBreak}m)`}></div>
          <div class="h-full bg-focus-emerald rounded-full flex-1" title={`Sprint 3 (${preferences.intervals.focus}m)`}></div>
          <div class="h-full bg-break-cyan rounded-full w-4" title={`Break 3 (${preferences.intervals.shortBreak}m)`}></div>
          <div class="h-full bg-focus-emerald rounded-full flex-1" title={`Sprint 4 (${preferences.intervals.focus}m)`}></div>
          <div class="h-full bg-tertiary rounded-full w-12" title={`Long Rest (${preferences.intervals.longBreak}m)`}></div>
        </div>
      </div>
    </section>
  );
};
