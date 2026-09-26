import { useAudio } from "../../context/AudioContext";
import { minimizeWindow } from "../../services/ipc";

export const MasterDeck = () => {
  const audio = useAudio();

  const handleMinimize = () => {
    minimizeWindow().catch(() => {
      console.log("[Desktop] Window minimized to system tray");
    });
  };

  return (
    <footer class="fixed bottom-0 left-0 right-0 z-50 bg-surface-card/95 backdrop-blur-md select-none border-t border-border-subtle/50">
      <div class="h-16 max-w-7xl mx-auto px-margin grid grid-cols-3 items-center gap-space-lg">
        {/* Left: Active Stems Real-time Status */}
        <div class="flex items-center gap-space-sm min-w-0">
          <div
            class={`w-2 h-2 rounded-full shrink-0 ${
              audio.isTimerRunning() && audio.activeStemsCount() > 0 ? "bg-focus-emerald animate-pulse" : "bg-surface-container-high"
            }`}
          ></div>
          <div class="flex flex-col min-w-0">
            <span class="font-mono-label text-mono-label text-text-primary uppercase tracking-wider truncate">
              {audio.isTimerRunning() && audio.activeStemsCount() > 0
                ? `${audio.activeStemsCount()} Active ${audio.activeStemsCount() === 1 ? "Stem" : "Stems"}`
                : `${audio.activeStemsCount()} ${audio.activeStemsCount() === 1 ? "Stem" : "Stems"} Ready`}
            </span>
            <span class="font-caption text-caption text-text-secondary truncate max-w-[220px] sm:max-w-xs">
              {audio.isTimerRunning() ? audio.activeStemSummary() : `Timer Paused • ${audio.activeStemSummary()}`}
            </span>
          </div>
        </div>

        {/* Center: Global Master Volume Deck Slider */}
        <div class="flex items-center justify-center min-w-0">
          <div class="flex items-center gap-space-sm w-full max-w-xs">
            <button
              type="button"
              aria-label="Volume Status Icon"
              onClick={audio.toggleMasterMute}
              class="text-text-secondary hover:text-text-primary flex items-center justify-center shrink-0"
            >
              <span class="material-symbols-outlined text-[18px]">
                {audio.isMuted() || audio.masterGain() === 0 ? "volume_off" : "volume_down"}
              </span>
            </button>
            
            <div class="relative flex-1 flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={audio.masterGain()}
                onInput={(e) => audio.setMasterGain(parseInt(e.currentTarget.value, 10))}
                aria-label="Master Volume Gain Deck"
                class="w-full h-1 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary"
              />
            </div>
            
            <span class="font-mono-metric text-mono-metric text-text-secondary min-w-[28px] text-right shrink-0">
              {audio.masterGain()}%
            </span>
          </div>
        </div>

        {/* Right: Instant Controls (Mute & Tray Minimize) */}
        <div class="flex items-center justify-end gap-space-sm">
          <button
            type="button"
            aria-label={audio.isMuted() ? "Unmute Master Audio" : "Global Mute"}
            onClick={audio.toggleMasterMute}
            class="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container-high flex items-center justify-center text-text-secondary hover:text-on-surface transition-colors"
          >
            <span class="material-symbols-outlined text-[18px]">
              {audio.isMuted() || audio.masterGain() === 0 ? "volume_off" : "volume_up"}
            </span>
          </button>

          <button
            type="button"
            aria-label="Minimize to Tray"
            onClick={handleMinimize}
            title="Minimize to System Tray"
            class="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container-high flex items-center justify-center text-text-secondary hover:text-on-surface transition-colors"
          >
            <span class="material-symbols-outlined text-[18px]">expand_more</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
