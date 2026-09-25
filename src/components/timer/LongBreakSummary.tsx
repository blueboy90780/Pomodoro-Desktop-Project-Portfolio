import { createSignal, For } from "solid-js";
import { useTimer } from "../../context/TimerContext";
import { usePreferences } from "../../context/PreferencesContext";

export const LongBreakSummary = () => {
  const timer = useTimer();
  const { preferences } = usePreferences();
  const [fadeEnabled, setFadeEnabled] = createSignal(true);
  const [ambientVolume, setAmbientVolume] = createSignal(45);

  const totalCircumference = 2 * Math.PI * 102; // 640.88
  const strokeOffset = () => {
    const fraction = timer.progressFraction();
    return totalCircumference * (1 - fraction);
  };

  const isRunning = () => timer.isRunning();

  const totalSprintMinutes = () => preferences.intervals.focus * timer.totalCycles();

  return (
    <div class="w-full max-w-5xl mx-auto px-margin py-space-lg flex flex-col gap-space-xl select-none">
      {/* Top Banner: Set 01 Achieved */}
      <div class="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md bg-surface-card p-space-md rounded-xl shadow-md">
        <div class="flex flex-wrap items-center gap-space-md">
          <div class="flex items-center gap-1.5 px-space-md py-1 rounded-full bg-surface-container-high text-primary font-mono-label text-mono-label shadow-sm">
            <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>SET COMPLETED</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-surface-container-lowest">
              <For each={Array.from({ length: timer.totalCycles() }, (_, i) => i + 1)}>
                {(cycleIndex) => (
                  <span
                    class="w-2.5 h-2.5 rounded-full bg-primary shadow-sm"
                    title={`Sprint ${cycleIndex} Completed`}
                  ></span>
                )}
              </For>
            </div>
            <span class="font-mono-metric text-mono-metric text-text-primary">
              {timer.totalCycles()} / {timer.totalCycles()} CYCLES
            </span>
          </div>
        </div>

        <div class="flex items-center gap-space-sm self-end md:self-auto">
          <div class="flex items-center gap-1.5 px-space-md py-1 rounded-full bg-secondary-container/20 text-secondary font-mono-label text-mono-label">
            <span class="material-symbols-outlined text-[14px]">bedtime</span>
            <span>LONG RECESS • {preferences.intervals.longBreak} MIN</span>
          </div>
          <button
            type="button"
            id="btn-sound-mode"
            class="p-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <span class="material-symbols-outlined text-[18px]">tune</span>
          </button>
        </div>
      </div>

      {/* Main Recess Hero Grid */}
      <div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
        {/* Left Column: Long Break Countdown & Concluded Card */}
        <div class="lg:col-span-7 flex flex-col items-center justify-center p-space-xl bg-surface-card rounded-xl relative overflow-hidden shadow-xl">
          <div class="absolute -top-24 -left-24 w-72 h-72 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-24 -right-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

          <div class="inline-flex items-center gap-2 px-space-md py-1 rounded-full bg-secondary-container/20 text-secondary mb-space-lg shadow-sm">
            <span class="material-symbols-outlined text-[16px]" style={{ "font-variation-settings": "'FILL' 1" }}>
              hotel_class
            </span>
            <span class="font-mono-label text-mono-label uppercase tracking-widest">Long Recess Active</span>
          </div>

          <div class="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-space-sm">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 240 240">
              <circle
                class="text-surface-container-high"
                cx="120"
                cy="120"
                fill="none"
                r="102"
                stroke="currentColor"
                stroke-width="6"
              ></circle>
              <circle
                class="text-secondary transition-all duration-1000 ease-out"
                cx="120"
                cy="120"
                fill="none"
                id="timer-progress-ring"
                r="102"
                stroke="currentColor"
                stroke-dasharray="640.88"
                stroke-dashoffset={strokeOffset()}
                stroke-linecap="round"
                stroke-width="7"
              ></circle>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center select-none">
              <span class="font-timer-display text-timer-display text-text-primary tracking-tight font-light" id="timer-readout">
                {timer.formattedMinutes()}:{timer.formattedSeconds()}
              </span>
              <div class="flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full bg-surface-container text-text-secondary font-mono-label text-mono-label">
                <span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                <span>{totalSprintMinutes()}M BLOCKS DONE</span>
              </div>
            </div>
          </div>

          <div class="text-center max-w-sm mt-space-md mb-space-lg">
            <p class="font-headline-md text-headline-md text-text-primary">Superb Focus Arc Concluded</p>
            <p class="font-body-sm text-body-sm text-text-secondary mt-1">
              {timer.totalCycles()} continuous intervals wrapped up smoothly. Take this {preferences.intervals.longBreak}-minute rest period to recharge completely.
            </p>
          </div>

          <div class="flex items-center justify-center gap-space-md w-full max-w-xs">
            <button
              type="button"
              id="btn-reset-cycle"
              title="Reset Cycle Counter"
              onClick={timer.resetCycleCounter}
              class="w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container-high text-text-secondary hover:text-text-primary flex items-center justify-center transition-all shadow-sm cursor-pointer"
            >
              <span class="material-symbols-outlined text-[20px]">restart_alt</span>
            </button>
            <button
              type="button"
              id="btn-play-pause"
              onClick={timer.toggleTimer}
              class="flex-1 h-12 rounded-full bg-secondary hover:bg-secondary-fixed text-on-secondary flex items-center justify-center gap-2 font-headline-md text-headline-md shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <span class="material-symbols-outlined text-[24px]" style={{ "font-variation-settings": "'FILL' 1" }}>
                {isRunning() ? "pause" : "play_arrow"}
              </span>
              <span>{isRunning() ? "Pause Break" : "Start Break"}</span>
            </button>
            <button
              type="button"
              id="btn-skip-cycle"
              title="Start New Sprint Arc"
              onClick={timer.skipPhase}
              class="w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container-high text-text-secondary hover:text-text-primary flex items-center justify-center transition-all shadow-sm cursor-pointer"
            >
              <span class="material-symbols-outlined text-[20px]">skip_next</span>
            </button>
          </div>
        </div>

        {/* Right Column: Daily Progress & Completed Trajectory */}
        <div class="lg:col-span-5 flex flex-col gap-space-md">
          {/* Daily Progress Target Card */}
          <div class="p-space-lg rounded-xl bg-surface-card shadow-md flex flex-col gap-space-sm relative overflow-hidden">
            <div class="flex items-center justify-between">
              <span class="font-mono-label text-mono-label uppercase text-text-tertiary">Daily Progress Target</span>
              <span class="inline-flex items-center gap-1 font-mono-metric text-mono-metric text-primary">
                <span class="material-symbols-outlined text-[14px]">trending_up</span>
                +50m vs yday
              </span>
            </div>
            <div class="flex items-baseline gap-2">
              <span class="font-timer-display-compact text-timer-display-compact text-text-primary">
                {Math.floor(totalSprintMinutes() / 60)}h {totalSprintMinutes() % 60}m
              </span>
              <span class="font-body-sm text-body-sm text-text-secondary">/ Target</span>
            </div>
            <div class="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden mt-1">
              <div class="h-full bg-primary rounded-full transition-all duration-700" style={{ width: "100%" }}></div>
            </div>
            <div class="flex justify-between items-center text-text-secondary font-caption text-caption pt-1">
              <span>Goal Accomplished</span>
              <span class="text-primary font-medium">100% Completed</span>
            </div>
          </div>

          {/* Completed Trajectory Log Card */}
          <div class="p-space-lg rounded-xl bg-surface-card shadow-md flex flex-col gap-space-sm">
            <div class="flex items-center justify-between pb-1">
              <span class="font-mono-label text-mono-label uppercase text-text-tertiary">Completed Trajectory</span>
              <span class="font-caption text-caption text-text-secondary">
                Cadence {preferences.intervals.focus}/{preferences.intervals.shortBreak}
              </span>
            </div>
            <div class="flex flex-col gap-2">
              <For each={timer.trajectory()}>
                {(item) => (
                  <div
                    class={`flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest ${
                      item.cycleNumber === timer.totalCycles() ? "ring-1 ring-primary/30" : ""
                    }`}
                  >
                    <div class="flex items-center gap-2.5">
                      <span
                        class={`w-5 h-5 rounded-full flex items-center justify-center ${
                          item.cycleNumber === timer.totalCycles()
                            ? "bg-primary text-on-primary"
                            : "bg-primary/20 text-primary"
                        }`}
                      >
                        <span class="material-symbols-outlined text-[14px]">
                          {item.cycleNumber === timer.totalCycles() ? "done_all" : "check"}
                        </span>
                      </span>
                      <span
                        class={`font-body-sm text-body-sm text-text-primary ${
                          item.cycleNumber === timer.totalCycles() ? "font-medium" : ""
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>
                    <span
                      class={`font-mono-metric text-mono-metric ${
                        item.cycleNumber === timer.totalCycles() ? "text-primary" : "text-text-secondary"
                      }`}
                    >
                      {item.timeRange}
                    </span>
                  </div>
                )}
              </For>
            </div>
          </div>

          {/* Active Project Tag Card */}
          <div class="p-space-lg rounded-xl bg-surface-card shadow-md flex items-center justify-between gap-space-md">
            <div class="flex flex-col min-w-0">
              <span class="font-mono-label text-mono-label uppercase text-text-tertiary">Active Project</span>
              <p class="font-headline-md text-headline-md text-text-primary truncate mt-0.5">
                {timer.activeTask().title}
              </p>
              <span class="font-caption text-caption text-text-secondary">
                {timer.totalCycles()} sprints logged • Auto-synced to workspace
              </span>
            </div>
            <button
              type="button"
              class="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-text-secondary hover:text-text-primary font-body-sm text-body-sm transition-colors whitespace-nowrap cursor-pointer"
            >
              Edit Tag
            </button>
          </div>
        </div>
      </div>

      {/* 3 Bottom Recommendation Cards */}
      <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-space-md">
        <div class="p-space-md rounded-xl bg-surface-card flex items-center gap-space-md shadow-sm">
          <div class="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
            <span class="material-symbols-outlined text-[22px]">spa</span>
          </div>
          <div class="flex flex-col min-w-0">
            <span class="font-mono-label text-mono-label uppercase text-text-secondary">Next Activity Recommendation</span>
            <span class="font-body-md text-body-md text-text-primary truncate font-medium">Hydrate, walk, rest eyes</span>
          </div>
        </div>

        <div class="p-space-md rounded-xl bg-surface-card flex items-center gap-space-md shadow-sm">
          <div class="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
            <span class="material-symbols-outlined text-[22px]">local_fire_department</span>
          </div>
          <div class="flex flex-col min-w-0">
            <span class="font-mono-label text-mono-label uppercase text-text-secondary">Streak State</span>
            <span class="font-body-md text-body-md text-text-primary truncate font-medium">7 Days Consistent</span>
          </div>
        </div>

        <div class="p-space-md rounded-xl bg-surface-card flex items-center gap-space-md shadow-sm">
          <div class="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-tertiary">
            <span class="material-symbols-outlined text-[22px]">auto_awesome</span>
          </div>
          <div class="flex flex-col min-w-0">
            <span class="font-mono-label text-mono-label uppercase text-text-secondary">Soundscape Mode</span>
            <span class="font-body-md text-body-md text-text-primary truncate font-medium">Calm Rain & Forest Wind Active</span>
          </div>
        </div>
      </div>

      {/* Atmosphere Blend Strip */}
      <div class="w-full p-space-md rounded-xl bg-surface-card shadow-sm flex flex-col sm:flex-row items-center justify-between gap-space-md">
        <div class="flex items-center gap-space-md w-full sm:w-auto">
          <div class="w-9 h-9 rounded-lg bg-surface-container-lowest flex items-center justify-center text-secondary">
            <span class="material-symbols-outlined text-[20px]">graphic_eq</span>
          </div>
          <div class="flex flex-col">
            <span class="font-mono-label text-mono-label uppercase text-text-secondary">Atmosphere Blend</span>
            <span class="font-body-sm text-body-sm text-text-primary">Deep Rest • Forest Drizzle & Warm Sub</span>
          </div>
        </div>

        <div class="flex items-center gap-space-md w-full sm:w-auto justify-end">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px] text-text-tertiary">volume_mute</span>
            <input
              type="range"
              min="0"
              max="100"
              value={ambientVolume()}
              onInput={(e) => setAmbientVolume(parseInt(e.currentTarget.value, 10))}
              class="w-28 sm:w-36 h-1 bg-surface-container-high rounded-full appearance-none accent-secondary cursor-pointer"
            />
            <span class="material-symbols-outlined text-[16px] text-text-tertiary">volume_up</span>
          </div>
          <button
            type="button"
            onClick={() => setFadeEnabled((prev) => !prev)}
            class={`px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-body-sm font-body-sm transition-colors cursor-pointer ${
              fadeEnabled() ? "text-secondary" : "text-text-secondary"
            }`}
          >
            {fadeEnabled() ? "Fade Out On Resume" : "Manual Fade Mode"}
          </button>
        </div>
      </div>
    </div>
  );
};
