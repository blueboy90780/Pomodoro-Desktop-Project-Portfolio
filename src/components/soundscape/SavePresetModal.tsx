import { createSignal, createEffect, For, Show } from "solid-js";
import { useAudio } from "../../context/AudioContext";
import { savePreset, type SoundPreset } from "../../services/storage";

export interface SavePresetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SavePresetModal = (props: SavePresetModalProps) => {
  const audio = useAudio();
  let dialogRef: HTMLDialogElement | undefined;

  const [presetTitle, setPresetTitle] = createSignal("Rainy Midnight Library");
  const [selectedTag, setSelectedTag] = createSignal<SoundPreset["category"]>("Reading");
  const [isDefaultLaunch, setIsDefaultLaunch] = createSignal(true);
  const [isSaving, setIsSaving] = createSignal(false);
  const [isSaved, setIsSaved] = createSignal(false);

  const categories: Array<SoundPreset["category"]> = [
    "Coding",
    "Deep Rest",
    "Reading",
    "Binaural Focus",
  ];

  const activeStems = () => audio.stems.filter((s) => s.active && s.volume > 0);

  createEffect(() => {
    if (props.isOpen) {
      if (dialogRef && !dialogRef.open) {
        dialogRef.showModal();
      }
    } else {
      if (dialogRef && dialogRef.open) {
        dialogRef.close();
      }
      setIsSaved(false);
      setIsSaving(false);
    }
  });

  const handleSave = () => {
    setIsSaving(true);
    const newPreset: SoundPreset = {
      id: presetTitle().toLowerCase().replace(/\s+/g, "-"),
      name: presetTitle(),
      category: selectedTag(),
      isDefaultLaunch: isDefaultLaunch(),
      stems: audio.stems.map((s) => ({
        id: s.id,
        name: s.name,
        volume: s.volume,
        active: s.active,
      })),
    };

    savePreset(newPreset);

    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => {
        props.onClose();
      }, 500);
    }, 400);
  };

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === dialogRef) {
      props.onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onCancel={(e) => {
        e.preventDefault();
        props.onClose();
      }}
      aria-labelledby="save-modal-title"
      class="bg-transparent p-0 m-auto backdrop:bg-canvas-base/80 backdrop:backdrop-blur-md outline-none border-none max-w-lg w-full"
    >
      <div class="w-full bg-surface-elevated rounded-xl shadow-2xl overflow-hidden relative border border-border-subtle">
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-focus-emerald/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div class="px-space-xl pt-space-xl pb-space-md flex items-start justify-between relative z-10">
          <div class="flex flex-col gap-1 min-w-0 pr-space-md">
            <div class="flex items-center gap-space-sm mb-1">
              <span class="px-2 py-0.5 rounded-full bg-focus-emerald/15 text-focus-emerald font-mono-label text-mono-label uppercase tracking-wider">
                Preset Architect
              </span>
              <span class="font-mono-label text-mono-label text-text-tertiary">v2.4.0</span>
            </div>
            <h2 id="save-modal-title" class="font-headline-lg text-headline-lg text-text-primary tracking-tight">
              Save Soundscape Preset
            </h2>
            <p class="font-body-sm text-body-sm text-text-secondary">
              Store current track gains and stem matrix to local preset library (
              <span class="font-mono-label text-focus-emerald">presets.json</span>).
            </p>
          </div>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={props.onClose}
            class="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container-high flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors flex-shrink-0 cursor-pointer"
          >
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form class="px-space-xl py-space-md flex flex-col gap-space-lg relative z-10" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          {/* Preset Name */}
          <div class="flex flex-col gap-space-xs">
            <label class="flex items-center justify-between font-mono-label text-mono-label uppercase tracking-wider text-text-secondary" for="preset-title">
              <span>Preset Name</span>
              <span class="text-text-tertiary font-mono-metric text-mono-metric">
                {presetTitle().length} / 36
              </span>
            </label>
            <div class="relative flex items-center">
              <span class="material-symbols-outlined absolute left-space-md text-text-tertiary text-[18px] pointer-events-none">
                label
              </span>
              <input
                id="preset-title"
                type="text"
                maxLength={36}
                value={presetTitle()}
                onInput={(e) => setPresetTitle(e.currentTarget.value)}
                placeholder="e.g. Midnight Codebase, Rainy Study, Alpine Cabin"
                class="w-full bg-surface-container-lowest text-text-primary pl-10 pr-space-md py-space-sm rounded-lg font-body-md text-body-md focus:outline-none focus:bg-surface-container shadow-inner"
              />
              <span class="absolute right-space-md w-1.5 h-4 bg-focus-emerald animate-pulse"></span>
            </div>
          </div>

          {/* Preset Stems Summary */}
          <div class="flex flex-col gap-space-xs">
            <div class="flex items-center justify-between">
              <span class="font-mono-label text-mono-label uppercase tracking-wider text-text-secondary">
                Preset Stems Summary
              </span>
              <span class="font-mono-metric text-mono-metric text-focus-emerald">
                {activeStems().length} Active {activeStems().length === 1 ? "Stem" : "Stems"}
              </span>
            </div>
            <div class="bg-surface-container-lowest rounded-xl p-space-md flex flex-col gap-space-sm shadow-inner max-h-48 overflow-y-auto">
              <Show
                when={activeStems().length > 0}
                fallback={
                  <span class="font-caption text-caption text-text-tertiary py-2 text-center">
                    No active stems in current mix.
                  </span>
                }
              >
                <For each={activeStems()}>
                  {(stem) => (
                    <div class="flex flex-col gap-1.5">
                      <div class="flex items-center justify-between font-body-sm text-body-sm">
                        <span class="flex items-center gap-space-xs text-text-primary">
                          <span class="material-symbols-outlined text-focus-emerald text-[16px]">
                            {stem.icon}
                          </span>
                          {stem.name}
                        </span>
                        <span class="font-mono-metric text-mono-metric text-text-secondary">
                          {stem.volume}%
                        </span>
                      </div>
                      <div class="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <div
                          class="h-full bg-focus-emerald rounded-full transition-all duration-300"
                          style={{ width: `${stem.volume}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </For>
              </Show>
            </div>
          </div>

          {/* Category Tag Pills */}
          <div class="flex flex-col gap-space-xs">
            <span class="font-mono-label text-mono-label uppercase tracking-wider text-text-secondary">
              Category Tag
            </span>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-space-xs" id="category-pill-group">
              <For each={categories}>
                {(cat) => {
                  const isSelected = () => selectedTag() === cat;
                  return (
                    <button
                      type="button"
                      onClick={() => setSelectedTag(cat)}
                      class={`px-space-sm py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all text-left cursor-pointer ${
                        isSelected()
                          ? "bg-focus-emerald/15 text-focus-emerald shadow-sm font-medium"
                          : "bg-surface-container-lowest hover:bg-surface-container text-text-secondary"
                      }`}
                    >
                      <span class="material-symbols-outlined text-[15px]">
                        {cat === "Coding" ? "terminal" : cat === "Deep Rest" ? "bedtime" : cat === "Reading" ? "auto_stories" : "graphic_eq"}
                      </span>
                      <span class="font-body-sm text-body-sm">{cat}</span>
                    </button>
                  );
                }}
              </For>
            </div>
          </div>

          {/* Default Launch Mix Switch */}
          <div class="flex items-center justify-between bg-surface-container-low p-space-md rounded-xl">
            <div class="flex flex-col gap-0.5">
              <span class="font-body-md text-body-md text-text-primary font-medium">
                Set as default launch mix
              </span>
              <span class="font-caption text-caption text-text-tertiary">
                Automatically boots this soundscape when AuraFocus opens
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isDefaultLaunch() ? "true" : "false"}
              onClick={() => setIsDefaultLaunch((prev) => !prev)}
              class={`w-10 h-6 rounded-full relative transition-colors duration-200 flex-shrink-0 cursor-pointer ${
                isDefaultLaunch() ? "bg-focus-emerald" : "bg-surface-container-high"
              }`}
            >
              <span
                class={`w-5 h-5 bg-canvas-base rounded-full absolute top-0.5 shadow-md transition-transform duration-200 ${
                  isDefaultLaunch() ? "right-0.5" : "left-0.5"
                }`}
              ></span>
            </button>
          </div>

          {/* Action Buttons */}
          <div class="pt-space-xs pb-space-sm flex items-center justify-end gap-space-sm">
            <button
              type="button"
              onClick={props.onClose}
              class="px-space-lg py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-text-secondary hover:text-text-primary font-body-sm text-body-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving()}
              class="px-space-xl py-2.5 rounded-lg bg-focus-emerald hover:bg-primary-fixed-dim text-canvas-base font-body-sm text-body-sm font-medium flex items-center gap-space-xs shadow-lg shadow-focus-emerald/20 active:translate-y-px transition-all cursor-pointer"
            >
              <Show
                when={!isSaving()}
                fallback={
                  <>
                    <span class="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                    <span>Storing...</span>
                  </>
                }
              >
                <Show
                  when={!isSaved()}
                  fallback={
                    <>
                      <span class="material-symbols-outlined text-[18px]">check</span>
                      <span>Saved to Library</span>
                    </>
                  }
                >
                  <span class="material-symbols-outlined text-[18px]">save</span>
                  <span>Save Preset</span>
                </Show>
              </Show>
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
