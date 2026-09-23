import { createSignal } from "solid-js";
import { usePreferences } from "../../context/PreferencesContext";
import { playChimeProfile, type ChimeProfile } from "../../services/soundEngine";

export const AudioSection = () => {
  const { preferences, setAudioToggle, setChimeProfile, setOutputEndpoint } = usePreferences();
  const [isPreviewing, setIsPreviewing] = createSignal(false);

  const handlePreview = async () => {
    setIsPreviewing(true);
    await playChimeProfile(preferences.audio.chimeProfile);
    setIsPreviewing(false);
  };

  return (
    <section class="bg-surface-card rounded-xl p-space-lg sm:p-space-xl shadow-sm relative overflow-hidden select-none">
      <div class="absolute -right-16 -top-16 w-48 h-48 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Section Header */}
      <div class="flex items-center justify-between gap-space-md mb-space-lg">
        <div class="flex items-center gap-space-sm">
          <div class="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
            <span class="material-symbols-outlined text-[18px]">equalizer</span>
          </div>
          <div>
            <h2 class="font-headline-md text-headline-md text-text-primary">Audio & Acoustic Automations</h2>
            <p class="font-body-sm text-body-sm text-text-secondary">
              Hardware routing, cue synthesis, and dynamic ducking protocols
            </p>
          </div>
        </div>
        <span class="font-mono-label text-mono-label text-text-tertiary uppercase bg-surface-container-low px-2 py-0.5 rounded">
          DSP ENGINE
        </span>
      </div>

      <div class="space-y-space-md">
        {/* Automation Toggle: Mute on breaks */}
        <div class="p-space-md rounded-xl bg-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-space-md hover:bg-surface-elevated transition-colors">
          <div class="space-y-1 pr-space-md">
            <div class="flex items-center gap-2">
              <span class="font-headline-md text-body-md text-text-primary">
                Mute soundscape during breaks
              </span>
              <span class="font-mono-label text-caption px-2 py-0.5 rounded bg-surface-container-high text-secondary">
                AUTO-DUCK
              </span>
            </div>
            <p class="font-body-sm text-body-sm text-text-secondary max-w-xl">
              Automatically pause or attenuate active binaural sound layers when the rest phase initiates, preventing sensory fatigue.
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={preferences.audio.muteOnBreak}
              onChange={(e) => setAudioToggle("muteOnBreak", e.currentTarget.checked)}
              class="sr-only peer"
              id="toggle-mute-break"
            />
            <div class="w-12 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-text-secondary after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:bg-focus-emerald peer-checked:after:bg-canvas-base shadow-inner"></div>
          </label>
        </div>

        {/* Cue Chime Configuration */}
        <div class="p-space-md rounded-xl bg-surface-container flex flex-col gap-space-md hover:bg-surface-elevated transition-colors">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="font-headline-md text-body-md text-text-primary">
                  Phase Completion Chime
                </span>
                <span class="font-mono-label text-caption px-2 py-0.5 rounded bg-surface-container-high text-text-tertiary">
                  RESONANT SINK
                </span>
              </div>
              <p class="font-body-sm text-body-sm text-text-secondary">
                Acoustic transition signal synthesized when transitioning across operational focus thresholds.
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={preferences.audio.chimeEnabled}
                onChange={(e) => setAudioToggle("chimeEnabled", e.currentTarget.checked)}
                class="sr-only peer"
                id="toggle-chime"
              />
              <div class="w-12 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-text-secondary after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:bg-focus-emerald peer-checked:after:bg-canvas-base shadow-inner"></div>
            </label>
          </div>

          {/* Chime Preset Selector and Sound Test */}
          <div class="pt-space-sm grid grid-cols-1 sm:grid-cols-12 gap-space-md items-center" id="chime-options">
            <div class="sm:col-span-8 flex flex-col gap-1.5">
              <span class="font-mono-label text-mono-label text-text-tertiary uppercase">
                ACOUSTIC PROFILE
              </span>
              <div class="relative w-full">
                <select
                  id="chime-selector"
                  value={preferences.audio.chimeProfile}
                  onChange={(e) => setChimeProfile(e.currentTarget.value as ChimeProfile)}
                  class="w-full appearance-none bg-surface-card text-text-primary font-body-sm text-body-sm px-space-md py-2.5 rounded-lg focus:outline-none focus:bg-surface-container-high cursor-pointer shadow-sm"
                >
                  <option value="zen-bell">Zen Temple Bell (432Hz Resonant)</option>
                  <option value="tibetan-bowl">Tibetan Singing Bowl (Deep Low-Pass)</option>
                  <option value="marimba">Soft Atmospheric Marimba (Harmonic)</option>
                  <option value="digital-beep">Digital Discrete Pulse (Minimal Sine)</option>
                </select>
                <span class="material-symbols-outlined absolute right-3 top-2.5 text-text-tertiary pointer-events-none text-[18px]">
                  expand_more
                </span>
              </div>
            </div>
            <div class="sm:col-span-4 flex items-end">
              <button
                type="button"
                id="btn-test-chime"
                onClick={handlePreview}
                disabled={isPreviewing()}
                class="w-full h-[42px] px-space-md rounded-lg bg-surface-container-high hover:bg-surface-bright text-text-primary font-body-sm text-body-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <span class="material-symbols-outlined text-secondary text-[18px]" id="chime-icon">
                  {isPreviewing() ? "graphic_eq" : "volume_up"}
                </span>
                <span id="chime-label">{isPreviewing() ? "Playing..." : "Preview Sound"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hardware Output Device */}
        <div class="p-space-md rounded-xl bg-surface-container flex flex-col gap-space-sm hover:bg-surface-elevated transition-colors">
          <div class="flex items-center justify-between">
            <div>
              <span class="font-headline-md text-body-md text-text-primary">
                Audio Output Endpoint
              </span>
              <p class="font-body-sm text-body-sm text-text-secondary">
                CoreAudio / WASAPI Low-latency physical interface sink
              </p>
            </div>
            <span class="font-mono-label text-caption text-text-tertiary bg-surface-container-lowest px-2 py-0.5 rounded">
              48kHz / 24-bit
            </span>
          </div>
          <div class="relative w-full mt-1">
            <select
              value={preferences.audio.outputEndpoint}
              onChange={(e) => setOutputEndpoint(e.currentTarget.value)}
              class="w-full appearance-none bg-surface-card text-text-primary font-mono-metric text-mono-metric px-space-md py-2.5 rounded-lg focus:outline-none focus:bg-surface-container-high cursor-pointer shadow-sm"
            >
              <option>System Default (External Audio Interface / USB DAC)</option>
              <option>MacBook Pro Built-in Speakers (Spatial Array)</option>
              <option>AirPods Max (Low-Latency Bluetooth LE)</option>
            </select>
            <span class="material-symbols-outlined absolute right-3 top-2.5 text-text-tertiary pointer-events-none text-[18px]">
              expand_more
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
