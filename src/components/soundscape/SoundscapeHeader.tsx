import { useAudio } from "../../context/AudioContext";

export interface SoundscapeHeaderProps {
  onOpenSaveModal: () => void;
}

export const SoundscapeHeader = (props: SoundscapeHeaderProps) => {
  const audio = useAudio();

  return (
    <header class="flex flex-wrap items-center justify-between gap-space-md p-space-md rounded-xl bg-surface-card shadow-sm select-none">
      <div class="flex items-center flex-wrap gap-space-md">
        {/* Preset Dropdown Picker */}
        <div class="relative group">
          <label class="sr-only" for="preset-selector">
            Select Sound Preset
          </label>
          <div class="flex items-center gap-space-xs px-space-md py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer">
            <span class="material-symbols-outlined text-focus-emerald text-[18px]">graphic_eq</span>
            <span class="font-mono-label text-mono-label text-text-secondary uppercase">Preset:</span>
            <select
              id="preset-selector"
              value={audio.activePresetId()}
              onChange={(e) => audio.selectPreset(e.currentTarget.value)}
              class="bg-transparent text-text-primary font-headline-md text-headline-md tracking-tight focus:outline-none cursor-pointer pr-space-sm appearance-none"
            >
              <option class="bg-surface-elevated text-text-primary" value="deep-focus">
                Deep Focus
              </option>
              <option class="bg-surface-elevated text-text-primary" value="rainy-cafe">
                Rainy Cafe
              </option>
              <option class="bg-surface-elevated text-text-primary" value="late-night">
                Late Night Study
              </option>
              <option class="bg-surface-elevated text-text-primary" value="nordic-forest">
                Nordic Forest
              </option>
              <option class="bg-surface-elevated text-focus-emerald" value="custom">
                + Custom Mix
              </option>
            </select>
            <span class="material-symbols-outlined text-text-secondary text-[16px] pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        {/* Save Preset Trigger CTA */}
        <button
          type="button"
          onClick={props.onOpenSaveModal}
          title="Save current parameters to preset"
          class="flex items-center gap-space-xs px-space-md py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          <span class="material-symbols-outlined text-[16px]">bookmark_add</span>
          <span class="font-body-sm text-body-sm font-medium">Save Mix</span>
        </button>
      </div>

      {/* Realtime Stem Playback Status */}
      <div class="flex items-center gap-space-sm">
        <div class="flex items-center gap-2 px-space-md py-1.5 rounded-lg bg-surface-container-lowest">
          <span class="relative flex h-2 w-2">
            <span
              class={`absolute inline-flex h-full w-full rounded-full bg-focus-emerald ${
                audio.isTimerRunning() && audio.activeStemsCount() > 0 ? "animate-ping opacity-75" : "opacity-0"
              }`}
            ></span>
            <span
              class={`relative inline-flex rounded-full h-2 w-2 ${
                audio.isTimerRunning() && audio.activeStemsCount() > 0 ? "bg-focus-emerald" : "bg-surface-container-high"
              }`}
            ></span>
          </span>
          <span class="font-mono-label text-mono-label text-text-primary uppercase tracking-wider" id="active-counter-text">
            {audio.isTimerRunning() && audio.activeStemsCount() > 0
              ? `${audio.activeStemsCount()} ${audio.activeStemsCount() === 1 ? "Track" : "Tracks"} Playing`
              : `${audio.activeStemsCount()} ${audio.activeStemsCount() === 1 ? "Track" : "Tracks"} Ready`}
          </span>
        </div>
      </div>
    </header>
  );
};
