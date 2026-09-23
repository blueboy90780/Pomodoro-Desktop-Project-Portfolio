import { useTimer } from "../../context/TimerContext";

export const TimerGauge = () => {
  const timer = useTimer();

  const totalCircumference = 2 * Math.PI * 156; // 980.175
  const strokeOffset = () => {
    const fraction = timer.progressFraction();
    return totalCircumference * (1 - fraction);
  };

  const isRunning = () => timer.isRunning();

  return (
    <div class="relative w-full flex flex-col items-center">
      {/* Subtle Ambient Glow Orbs contained in relative bounds */}
      <div class="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-focus-emerald/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Sub-header Bar: Session Metadata & Modes */}
      <header class="w-full flex flex-col md:flex-row items-center justify-between gap-space-md py-space-sm px-space-md rounded-xl bg-surface-card shadow-sm mb-space-xl">
        {/* Left: Cycle Indicator & Preset */}
        <div class="flex items-center gap-space-md w-full md:w-auto justify-between md:justify-start">
          <div class="flex items-center gap-space-xs">
            <span class="font-mono-label text-mono-label text-text-secondary uppercase tracking-widest mr-1">
              CYCLE
            </span>
            <div class="flex items-center gap-1.5" title={`Cycle ${timer.currentCycle()} of ${timer.totalCycles()} Active`}>
              <span class={`w-4 h-1.5 rounded-full ${timer.currentCycle() >= 1 ? "bg-focus-emerald" : "bg-surface-container-high"}`}></span>
              <span class={`w-6 h-1.5 rounded-full ${timer.currentCycle() === 2 ? "bg-focus-emerald animate-pulse" : timer.currentCycle() > 2 ? "bg-focus-emerald" : "bg-surface-container-high"}`}></span>
              <span class={`w-4 h-1.5 rounded-full ${timer.currentCycle() >= 3 ? "bg-focus-emerald" : "bg-surface-container-high"}`}></span>
              <span class={`w-4 h-1.5 rounded-full ${timer.currentCycle() >= 4 ? "bg-focus-emerald" : "bg-surface-container-high"}`}></span>
            </div>
            <span class="font-mono-metric text-mono-metric text-text-primary ml-1.5">
              {timer.currentCycle()}/{timer.totalCycles()}
            </span>
          </div>

          <div class="h-3 w-px bg-surface-container-high hidden sm:block"></div>

          <div class="flex items-center gap-1.5 px-space-sm py-0.5 rounded-lg bg-surface-container-low">
            <span class="material-symbols-outlined text-[14px] text-primary">tune</span>
            <span class="font-caption text-caption text-text-secondary">Preset:</span>
            <span class="font-mono-label text-mono-label text-text-primary font-medium">Deep Focus (25/5)</span>
          </div>
        </div>

        {/* Right: Phase Switcher Tabs */}
        <div class="flex items-center p-1 rounded-xl bg-surface-container-lowest gap-1 w-full md:w-auto justify-center">
          <button
            type="button"
            onClick={() => timer.setPhase("focus")}
            class={`flex items-center gap-1.5 px-space-md py-1 rounded-lg font-body-sm text-body-sm transition-all ${
              timer.currentPhase() === "focus"
                ? "bg-surface-container-high text-text-primary shadow-sm"
                : "hover:bg-surface-container-low text-text-secondary hover:text-text-primary"
            }`}
          >
            <span class="w-1.5 h-1.5 rounded-full bg-focus-emerald"></span>
            <span>Focus 25m</span>
          </button>

          <button
            type="button"
            onClick={() => timer.setPhase("short_break")}
            class={`flex items-center gap-1.5 px-space-md py-1 rounded-lg font-body-sm text-body-sm transition-all ${
              timer.currentPhase() === "short_break"
                ? "bg-surface-container-high text-break-cyan shadow-sm"
                : "hover:bg-surface-container-low text-text-secondary hover:text-text-primary"
            }`}
          >
            <span class="w-1.5 h-1.5 rounded-full bg-break-cyan/40"></span>
            <span>Short Break 5m</span>
          </button>

          <button
            type="button"
            onClick={() => timer.setPhase("long_break")}
            class={`flex items-center gap-1.5 px-space-md py-1 rounded-lg font-body-sm text-body-sm transition-all ${
              timer.currentPhase() === "long_break"
                ? "bg-surface-container-high text-secondary shadow-sm"
                : "hover:bg-surface-container-low text-text-secondary hover:text-text-primary"
            }`}
          >
            <span class="w-1.5 h-1.5 rounded-full bg-break-cyan/20"></span>
            <span>Long Break 15m</span>
          </button>
        </div>
      </header>

      {/* Main Hero Stage: Circular Timer */}
      <div class="relative flex flex-col items-center justify-center my-space-lg w-full max-w-md">
        {/* Radial Gauge Container */}
        <div class="relative w-[320px] h-[320px] sm:w-[360px] sm:h-[360px] flex items-center justify-center">
          {/* Background decorative ambient ring */}
          <div class="absolute inset-4 rounded-full bg-surface-card/60 backdrop-blur-xl shadow-2xl"></div>

          {/* SVG Progress Ring */}
          <svg
            class="absolute inset-0 w-full h-full -rotate-90 transform drop-shadow-[0_0_20px_rgba(16,185,129,0.22)]"
            viewBox="0 0 360 360"
          >
            {/* Rail Base */}
            <circle
              class="text-surface-container-high/40"
              cx="180"
              cy="180"
              fill="transparent"
              r="156"
              stroke="currentColor"
              stroke-width="5"
            ></circle>
            {/* Active Remaining Gauge */}
            <circle
              class="text-focus-emerald transition-all duration-1000 ease-out"
              cx="180"
              cy="180"
              fill="transparent"
              id="timer-progress-ring"
              r="156"
              stroke="currentColor"
              stroke-dasharray="980.17"
              stroke-dashoffset={strokeOffset()}
              stroke-linecap="round"
              stroke-width="7"
            ></circle>
          </svg>

          {/* Center Numerical Display & Badges */}
          <div class="relative z-10 flex flex-col items-center text-center px-4">
            {/* Phase Indicator Pill */}
            <div class="inline-flex items-center gap-1.5 px-space-md py-1 rounded-full bg-surface-container-high/80 text-focus-emerald shadow-sm mb-space-sm">
              <span class={`w-1.5 h-1.5 rounded-full bg-focus-emerald ${isRunning() ? "animate-ping" : ""}`}></span>
              <span class="font-mono-label text-mono-label tracking-widest font-semibold uppercase">
                FOCUS INTERVAL
              </span>
            </div>

            {/* Tabular Monospaced Countdown Display */}
            <div class="flex items-baseline justify-center">
              <span
                class="font-timer-display text-timer-display text-text-primary tracking-tight font-light tabular-nums drop-shadow-sm"
                id="timer-minutes"
              >
                {timer.formattedMinutes()}
              </span>
              <span class={`font-timer-display text-timer-display text-text-tertiary font-light mx-1 ${isRunning() ? "animate-pulse" : ""}`}>
                :
              </span>
              <span
                class="font-timer-display text-timer-display text-text-primary tracking-tight font-light tabular-nums drop-shadow-sm"
                id="timer-seconds"
              >
                {timer.formattedSeconds()}
              </span>
            </div>

            {/* Sound Sync Metadata Pill */}
            <div class="mt-space-sm flex items-center gap-1.5 px-space-sm py-0.5 rounded-lg bg-surface-container-lowest/80 text-text-secondary font-caption text-caption">
              <span class="material-symbols-outlined text-focus-emerald text-[14px]">headphones</span>
              <span>Auto-ambient active</span>
              <span class="font-mono-metric text-mono-metric text-text-tertiary">| -12dB</span>
            </div>
          </div>
        </div>

        {/* Action Controls Deck */}
        <div class="flex items-center justify-center gap-space-lg mt-space-xl">
          {/* Reset Button */}
          <button
            type="button"
            id="btn-reset"
            title="Reset Pomodoro [R]"
            onClick={timer.resetTimer}
            class="w-11 h-11 rounded-full bg-surface-container-low hover:bg-surface-container-high text-text-secondary hover:text-text-primary flex items-center justify-center transition-all active:scale-95 shadow-sm"
          >
            <span class="material-symbols-outlined text-[20px]">restart_alt</span>
          </button>

          {/* Primary Play/Pause Hero Button */}
          <button
            type="button"
            id="btn-toggle"
            title="Toggle Timer [Space]"
            onClick={timer.toggleTimer}
            class={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 shadow-[0_0_28px_rgba(16,185,129,0.35)] ${
              isRunning()
                ? "bg-primary hover:bg-primary-fixed-dim text-on-primary"
                : "bg-surface-container-high hover:bg-surface-bright text-text-primary"
            }`}
          >
            <span
              class="material-symbols-outlined text-[32px]"
              id="toggle-icon"
              style={{ "font-variation-settings": "'FILL' 1" }}
            >
              {isRunning() ? "pause" : "play_arrow"}
            </span>
          </button>

          {/* Skip to Next Phase Button */}
          <button
            type="button"
            id="btn-skip"
            title="Skip to Next Phase [N]"
            onClick={timer.skipPhase}
            class="w-11 h-11 rounded-full bg-surface-container-low hover:bg-surface-container-high text-text-secondary hover:text-text-primary flex items-center justify-center transition-all active:scale-95 shadow-sm"
          >
            <span class="material-symbols-outlined text-[20px]">skip_next</span>
          </button>
        </div>

        {/* Keyboard Shortcut Cue */}
        <div class="mt-space-md flex items-center gap-1.5 text-text-tertiary font-mono-label text-mono-label">
          <span class="px-1.5 py-0.5 rounded bg-surface-container-lowest text-text-secondary font-mono-metric text-mono-metric">⌘</span>
          <span class="px-1.5 py-0.5 rounded bg-surface-container-lowest text-text-secondary font-mono-metric text-mono-metric">Shift</span>
          <span class="px-1.5 py-0.5 rounded bg-surface-container-lowest text-text-secondary font-mono-metric text-mono-metric">Space</span>
          <span class="text-text-tertiary ml-1">to toggle</span>
        </div>
      </div>
    </div>
  );
};
