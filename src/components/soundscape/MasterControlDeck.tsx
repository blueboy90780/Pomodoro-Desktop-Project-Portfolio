import { useAudio } from "../../context/AudioContext";

export const MasterControlDeck = () => {
  const audio = useAudio();

  return (
    <section
      aria-label="Master Output Deck"
      class="rounded-xl bg-surface-card p-space-md flex flex-col md:flex-row items-center justify-between gap-space-lg shadow-sm select-none"
    >
      {/* Pomodoro Synchronization Sync Switch */}
      <div class="flex items-center justify-between w-full md:w-auto gap-space-md">
        <div class="flex flex-col">
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-focus-emerald text-[18px]">sync</span>
            <span class="font-body-md text-body-md text-text-primary font-medium">Sync with Pomodoro</span>
          </div>
          <span class="font-caption text-caption text-text-secondary">
            Auto-pause ambient stems during rest phases
          </span>
        </div>
        <button
          type="button"
          role="switch"
          id="pomo-sync-toggle"
          aria-checked={audio.pomoSyncEnabled() ? "true" : "false"}
          aria-label="Toggle Pomodoro Auto Sync"
          onClick={audio.togglePomoSync}
          class={`relative w-11 h-6 rounded-full p-0.5 transition-colors focus:outline-none shrink-0 ${
            audio.pomoSyncEnabled() ? "bg-focus-emerald" : "bg-surface-container-high"
          }`}
        >
          <span
            class={`block w-5 h-5 rounded-full transition-transform shadow-sm ${
              audio.pomoSyncEnabled()
                ? "bg-canvas-base translate-x-5"
                : "bg-text-tertiary translate-x-0"
            }`}
          ></span>
        </button>
      </div>

      {/* Center Master Slider Control */}
      <div class="flex items-center gap-space-md w-full md:flex-1 md:max-w-md">
        <button
          type="button"
          id="master-mute-btn"
          aria-label="Instant Master Mute"
          onClick={audio.toggleMasterMute}
          class="w-9 h-9 rounded-lg bg-surface-container-low hover:bg-surface-container-high flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors shrink-0"
        >
          <span class="material-symbols-outlined text-[20px]" id="master-mute-icon">
            {audio.isMuted() || audio.masterGain() === 0 ? "volume_off" : "volume_up"}
          </span>
        </button>
        <div class="flex-1 flex flex-col gap-1">
          <div class="flex justify-between items-center">
            <span class="font-mono-label text-mono-label text-text-secondary uppercase">Master Deck Gain</span>
            <span class="font-mono-metric text-mono-metric text-focus-emerald" id="master-volume-readout">
              {audio.masterGain()}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={audio.masterGain()}
            onInput={(e) => audio.setMasterGain(parseInt(e.currentTarget.value, 10))}
            aria-label="Master Volume Deck"
            class="w-full h-1.5 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-focus-emerald"
            id="master-volume-slider"
          />
        </div>
      </div>

      {/* Quick Reset & Calibration Action */}
      <div class="flex items-center gap-space-sm w-full md:w-auto justify-end">
        <button
          type="button"
          id="reset-stems-btn"
          title="Mute and reset all active sliders"
          onClick={audio.resetAllStems}
          class="flex items-center gap-1 px-space-md py-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          <span class="material-symbols-outlined text-[16px]">restart_alt</span>
          <span class="font-body-sm text-body-sm">Reset Mix</span>
        </button>
      </div>
    </section>
  );
};
