import { createSignal, Show } from "solid-js";
import { usePreferences } from "../context/PreferencesContext";
import { CadenceSection } from "../components/preferences/CadenceSection";
import { AudioSection } from "../components/preferences/AudioSection";
import { OsSection } from "../components/preferences/OsSection";
import { ResetDefaultsModal } from "../components/preferences/ResetDefaultsModal";

export const PreferencesPage = () => {
  const {
    isSavedToastVisible,
    toastMessage,
    savePreferencesToDisk,
    hasUnsavedChanges,
    discardDraftChanges,
  } = usePreferences();
  const [isResetModalOpen, setIsResetModalOpen] = createSignal(false);
  const [isWriting, setIsWriting] = createSignal(false);

  const handleSave = () => {
    setIsWriting(true);
    setTimeout(() => {
      savePreferencesToDisk();
      setIsWriting(false);
    }, 400);
  };

  return (
    <div class="flex flex-col w-full">
      <div class="max-w-4xl mx-auto w-full px-space-md sm:px-space-xl py-space-lg pb-24 select-none">
        {/* Top System Meta Banner */}
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-space-md mb-space-xl">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="font-mono-label text-mono-label text-primary uppercase tracking-widest">
                Configuration Matrix
              </span>
              <span class="font-mono-metric text-mono-metric text-text-tertiary">/</span>
              <span class="font-mono-label text-mono-label text-text-tertiary uppercase">
                TAURI_V2.4_CORE
              </span>
            </div>
            <div class="font-headline-lg text-headline-lg text-text-primary tracking-tight">
              App Preferences & Environment
            </div>
          </div>

          {/* Quick Status Metric Chips */}
          <div class="flex items-center gap-space-sm bg-surface-card p-1 rounded-xl shadow-sm">
            <div class="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-container">
              <span class="w-1.5 h-1.5 rounded-full bg-focus-emerald"></span>
              <span class="font-mono-label text-mono-label text-text-secondary">DAEMON ACTIVE</span>
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-container-low text-text-tertiary">
              <span class="material-symbols-outlined text-[14px]">memory</span>
              <span class="font-mono-label text-mono-label">14.2 MB RSS</span>
            </div>
          </div>
        </div>

        {/* Main Settings Bento Architecture */}
        <div class="space-y-space-xl">
          <CadenceSection />
          <AudioSection />
          <OsSection />

          {/* Actions & Commit Footprint */}
          <div class="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-sm">
            <div class="flex items-center gap-space-sm w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(true)}
                class="px-space-lg py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-text-secondary hover:text-text-primary font-body-sm text-body-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span class="material-symbols-outlined text-[16px]">restart_alt</span>
                <span>Reset to Factory Defaults</span>
              </button>

              <Show when={hasUnsavedChanges()}>
                <button
                  type="button"
                  onClick={discardDraftChanges}
                  class="px-space-md py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-text-tertiary hover:text-text-primary font-body-sm text-body-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="Discard unsaved changes"
                >
                  <span class="material-symbols-outlined text-[16px]">undo</span>
                  <span>Discard</span>
                </button>
              </Show>
            </div>

            <div class="flex items-center gap-space-md w-full sm:w-auto">
              {/* Unsaved Changes Staged Pill */}
              <Show when={hasUnsavedChanges()}>
                <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pause-amber/15 text-pause-amber font-mono-label text-caption">
                  <span class="w-1.5 h-1.5 rounded-full bg-pause-amber animate-pulse"></span>
                  <span>UNSAVED CHANGES</span>
                </div>
              </Show>

              {/* Status Feedback Toast Message */}
              <Show when={isSavedToastVisible()}>
                <div
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container font-mono-label text-caption text-primary transition-all shadow-sm"
                  id="save-status"
                >
                  <span class="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>{toastMessage()}</span>
                </div>
              </Show>

              <button
                type="button"
                id="btn-save"
                disabled={isWriting()}
                onClick={handleSave}
                class={`w-full sm:w-auto px-space-xl py-2.5 rounded-lg font-headline-md text-body-md font-medium flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] cursor-pointer ${
                  hasUnsavedChanges()
                    ? "bg-primary hover:bg-primary-fixed-dim text-on-primary shadow-focus-glow"
                    : "bg-surface-container-high text-text-secondary hover:text-text-primary"
                }`}
              >
                <Show
                  when={!isWriting()}
                  fallback={
                    <>
                      <span class="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                      <span>Writing...</span>
                    </>
                  }
                >
                  <span class="material-symbols-outlined text-[18px]">save</span>
                  <span>Save Preferences</span>
                </Show>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Defaults Confirmation Modal */}
      <ResetDefaultsModal
        isOpen={isResetModalOpen()}
        onClose={() => setIsResetModalOpen(false)}
      />
    </div>
  );
};
