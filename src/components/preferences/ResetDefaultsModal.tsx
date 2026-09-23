import { createSignal, createEffect, Show } from "solid-js";
import { usePreferences } from "../../context/PreferencesContext";

export interface ResetDefaultsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResetDefaultsModal = (props: ResetDefaultsModalProps) => {
  const { resetToFactoryDefaults } = usePreferences();
  let dialogRef: HTMLDialogElement | undefined;
  const [isPurging, setIsPurging] = createSignal(false);

  createEffect(() => {
    if (props.isOpen) {
      if (dialogRef && !dialogRef.open) {
        dialogRef.showModal();
      }
    } else {
      if (dialogRef && dialogRef.open) {
        dialogRef.close();
      }
      setIsPurging(false);
    }
  });

  const handleConfirmPurge = () => {
    setIsPurging(true);
    setTimeout(() => {
      resetToFactoryDefaults();
      setIsPurging(false);
      props.onClose();
    }, 500);
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
      aria-labelledby="reset-modal-title"
      class="bg-transparent p-0 m-auto backdrop:bg-canvas-base/80 backdrop:backdrop-blur-md outline-none border-none max-w-lg w-full"
    >
      <div class="relative w-full max-w-lg rounded-xl bg-surface-elevated shadow-2xl p-space-xl overflow-hidden border border-border-subtle">
        {/* Ambient Top Edge Calibration Indicator */}
        <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-pause-amber/70 to-transparent"></div>

        {/* Header Region */}
        <div class="flex items-start gap-space-md mb-space-lg">
          <div class="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center flex-shrink-0 text-pause-amber shadow-inner">
            <span class="material-symbols-outlined text-[22px]">restart_alt</span>
          </div>
          <div class="space-y-1 min-w-0">
            <div class="flex items-center gap-space-xs">
              <span class="font-mono-label text-mono-label text-pause-amber uppercase tracking-wider">
                Calibration Warning
              </span>
              <span class="w-1 h-1 rounded-full bg-pause-amber/60"></span>
              <span class="font-mono-metric text-mono-metric text-text-tertiary">ID // EV-09</span>
            </div>
            <h2 class="font-headline-lg text-headline-lg text-text-primary tracking-tight" id="reset-modal-title">
              Reset All Environment Preferences?
            </h2>
          </div>
        </div>

        {/* Body Description */}
        <p class="font-body-md text-body-md text-text-secondary leading-relaxed mb-space-lg">
          This will revert all cadence timer durations (25/5/15m), custom audio ducking thresholds, audio output endpoints, and global system tray hotkeys to factory defaults. This action cannot be undone.
        </p>

        {/* Detailed Breakdown Section: Parameters Staged for Purge */}
        <div class="rounded-xl bg-surface-card p-space-md mb-space-lg space-y-space-sm">
          <div class="flex items-center justify-between pb-space-xs">
            <span class="font-mono-label text-mono-label text-text-tertiary uppercase tracking-wider">
              Parameters Staged for Purge
            </span>
            <span class="font-mono-metric text-mono-metric text-text-tertiary">4 Modules</span>
          </div>
          <ul class="space-y-2 font-body-sm text-body-sm">
            <li class="flex items-start gap-space-sm p-space-xs rounded-lg bg-surface-container-low/70">
              <span class="material-symbols-outlined text-text-tertiary text-[16px] mt-0.5">timer</span>
              <div class="flex-1">
                <span class="text-text-primary font-medium">Cadence intervals</span>
                <span class="text-text-tertiary block font-mono-metric text-mono-metric">
                  Revert to Pomodoro standard 25m Focus / 5m Break / 15m Recess
                </span>
              </div>
              <span class="font-mono-metric text-mono-metric text-pause-amber bg-pause-amber/10 px-1.5 py-0.5 rounded">
                MODIFIED
              </span>
            </li>
            <li class="flex items-start gap-space-sm p-space-xs rounded-lg bg-surface-container-low/70">
              <span class="material-symbols-outlined text-text-tertiary text-[16px] mt-0.5">speaker</span>
              <div class="flex-1">
                <span class="text-text-primary font-medium">Audio endpoint routing</span>
                <span class="text-text-tertiary block font-mono-metric text-mono-metric">
                  System Default (CoreAudio 48kHz / 24-bit output)
                </span>
              </div>
              <span class="font-mono-metric text-mono-metric text-pause-amber bg-pause-amber/10 px-1.5 py-0.5 rounded">
                MODIFIED
              </span>
            </li>
            <li class="flex items-start gap-space-sm p-space-xs rounded-lg bg-surface-container-low/70">
              <span class="material-symbols-outlined text-text-tertiary text-[16px] mt-0.5">notifications_active</span>
              <div class="flex-1">
                <span class="text-text-primary font-medium">Chime & transition profile</span>
                <span class="text-text-tertiary block font-mono-metric text-mono-metric">
                  Reset to Zen Temple Bell acoustic signature
                </span>
              </div>
              <span class="font-mono-metric text-mono-metric text-text-tertiary bg-surface-container-high px-1.5 py-0.5 rounded">
                STABLE
              </span>
            </li>
            <li class="flex items-start gap-space-sm p-space-xs rounded-lg bg-surface-container-low/70">
              <span class="material-symbols-outlined text-text-tertiary text-[16px] mt-0.5">keyboard</span>
              <div class="flex-1">
                <span class="text-text-primary font-medium">Global tray hotkeys</span>
                <span class="text-text-tertiary block font-mono-metric text-mono-metric">
                  Toggle Focus binds to Cmd + Shift + Space
                </span>
              </div>
              <span class="font-mono-metric text-mono-metric text-pause-amber bg-pause-amber/10 px-1.5 py-0.5 rounded">
                MODIFIED
              </span>
            </li>
          </ul>
        </div>

        {/* Safe State Verification Pill */}
        <div class="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg bg-surface-container-low mb-space-xl">
          <span class="material-symbols-outlined text-focus-emerald text-[18px]">verified_user</span>
          <span class="font-body-sm text-body-sm text-text-secondary">
            <strong class="text-text-primary font-medium">Safe guard:</strong> Preset audio stems and customized atmosphere soundboards will not be deleted.
          </span>
        </div>

        {/* Modal Action Buttons */}
        <div class="flex items-center justify-end gap-space-md">
          <button
            type="button"
            id="cancel-reset-btn"
            onClick={props.onClose}
            class="px-space-lg py-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container-high text-text-secondary hover:text-text-primary font-body-md text-body-md transition-colors flex items-center gap-space-xs cursor-pointer"
          >
            Cancel / Keep Current
          </button>
          <button
            type="button"
            id="confirm-reset-btn"
            disabled={isPurging()}
            onClick={handleConfirmPurge}
            class="px-space-lg py-space-sm rounded-lg bg-pause-amber hover:bg-tertiary text-on-tertiary font-headline-md text-headline-md tracking-normal transition-all shadow-md flex items-center gap-space-xs active:scale-95 cursor-pointer"
          >
            <Show
              when={!isPurging()}
              fallback={
                <>
                  <span class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  <span>Purging State...</span>
                </>
              }
            >
              <span class="material-symbols-outlined text-[18px]">restore</span>
              <span>Reset to Factory Defaults</span>
            </Show>
          </button>
        </div>
      </div>
    </dialog>
  );
};
