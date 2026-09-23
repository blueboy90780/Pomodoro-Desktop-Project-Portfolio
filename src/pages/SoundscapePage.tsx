import { createSignal, For } from "solid-js";
import { useAudio } from "../context/AudioContext";
import { SoundscapeHeader } from "../components/soundscape/SoundscapeHeader";
import { SoundCard } from "../components/soundscape/SoundCard";
import { MasterControlDeck } from "../components/soundscape/MasterControlDeck";
import { SavePresetModal } from "../components/soundscape/SavePresetModal";

export const SoundscapePage = () => {
  const audio = useAudio();
  const [isSaveModalOpen, setIsSaveModalOpen] = createSignal(false);

  return (
    <div class="flex flex-col w-full">
      <div class="w-full max-w-7xl mx-auto px-margin py-space-lg flex flex-col gap-space-lg">
        {/* Header Control Strip */}
        <SoundscapeHeader onOpenSaveModal={() => setIsSaveModalOpen(true)} />

        {/* Sound Card Grid (2-Column Multi-Track Layout) */}
        <section aria-label="Acoustic Stems Mixer" class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          <For each={audio.stems}>
            {(stem) => <SoundCard stem={stem} />}
          </For>
        </section>

        {/* Master Output Deck */}
        <MasterControlDeck />
      </div>

      {/* Save Preset Dialog Modal */}
      <SavePresetModal
        isOpen={isSaveModalOpen()}
        onClose={() => setIsSaveModalOpen(false)}
      />
    </div>
  );
};
