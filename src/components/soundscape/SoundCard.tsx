import { Show } from "solid-js";
import { useAudio, type StemTrack } from "../../context/AudioContext";

export interface SoundCardProps {
  stem: StemTrack;
}

export const SoundCard = (props: SoundCardProps) => {
  const audio = useAudio();
  const isActive = () => props.stem.active && props.stem.volume > 0;

  return (
    <article
      class={`sound-card relative flex flex-col justify-between p-space-md rounded-xl transition-all duration-200 select-none ${
        isActive()
          ? "bg-surface-elevated shadow-sm"
          : "bg-surface-card opacity-70 hover:opacity-90"
      }`}
      style={isActive() ? { "box-shadow": "0 0 20px -6px rgba(16, 185, 129, 0.16)" } : undefined}
      data-track={props.stem.id}
    >
      {/* Top Row: Track Icon, Title, Waveform, and Toggle */}
      <div class="flex items-center justify-between gap-space-sm mb-space-sm">
        <div class="flex items-center gap-space-sm min-w-0">
          <div
            class={`track-icon-wrapper w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
              isActive() ? "bg-focus-emerald/15 text-focus-emerald" : "bg-surface-container-high text-text-tertiary"
            }`}
          >
            <span class="material-symbols-outlined text-[20px]">{props.stem.icon}</span>
          </div>

          <div class="flex flex-col min-w-0">
            <div class="flex items-center gap-space-xs">
              <h3
                class={`font-headline-md text-headline-md truncate transition-colors ${
                  isActive() ? "text-text-primary" : "text-text-secondary"
                }`}
              >
                {props.stem.name}
              </h3>

              {/* Animated Soundwave Micro-graphic */}
              <Show when={isActive() && audio.isTimerRunning()}>
                <div class="wave-indicator flex items-end gap-[2px] h-3 px-1">
                  <span class="w-[2px] h-3 bg-focus-emerald rounded-full animate-pulse"></span>
                  <span class="w-[2px] h-1.5 bg-focus-emerald rounded-full animate-pulse delay-75"></span>
                  <span class="w-[2px] h-2.5 bg-focus-emerald rounded-full animate-pulse delay-150"></span>
                </div>
              </Show>
            </div>
            <span class={`font-caption text-caption uppercase ${isActive() ? "text-text-secondary" : "text-text-tertiary"}`}>
              {props.stem.category}
            </span>
          </div>
        </div>

        {/* Tactile On/Off Toggle Switch */}
        <button
          type="button"
          role="switch"
          aria-checked={props.stem.active ? "true" : "false"}
          aria-label={`Toggle ${props.stem.name}`}
          onClick={() => audio.toggleStem(props.stem.id)}
          class={`toggle-btn relative w-10 h-5 rounded-full p-0.5 transition-colors focus:outline-none shrink-0 ${
            props.stem.active ? "bg-focus-emerald" : "bg-surface-container-high"
          }`}
        >
          <span
            class={`toggle-dot block w-4 h-4 rounded-full transition-transform shadow-sm ${
              props.stem.active
                ? "bg-canvas-base translate-x-5"
                : "bg-text-tertiary translate-x-0"
            }`}
          ></span>
        </button>
      </div>

      {/* Bottom Row: Range Slider & Numerical Readout */}
      <div class="flex items-center gap-space-md pt-space-xs">
        <div class="relative flex-1 flex items-center">
          <input
            type="range"
            min="0"
            max="100"
            value={props.stem.volume}
            onInput={(e) => audio.setStemVolume(props.stem.id, parseInt(e.currentTarget.value, 10))}
            aria-label={`${props.stem.name} Volume`}
            class={`volume-slider w-full h-1.5 bg-surface-container-high rounded-full appearance-none cursor-pointer ${
              isActive() ? "accent-focus-emerald" : "accent-text-tertiary"
            }`}
          />
        </div>
        <span
          class={`volume-val font-mono-metric text-mono-metric min-w-[34px] text-right ${
            isActive() ? "text-text-primary" : "text-text-tertiary"
          }`}
        >
          {props.stem.volume}%
        </span>
      </div>
    </article>
  );
};
