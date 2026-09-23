import { createSignal, onCleanup } from "solid-js";
import { usePreferences } from "../../context/PreferencesContext";

export const OsSection = () => {
  const { preferences, setOsToggle, setHotkey } = usePreferences();
  const [isRecording, setIsRecording] = createSignal(false);

  const toggleRecord = () => {
    if (isRecording()) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      const keys: string[] = [];
      if (e.metaKey || e.ctrlKey) keys.push("⌘");
      if (e.altKey) keys.push("⌥");
      if (e.shiftKey) keys.push("Shift");
      if (e.key && !["Control", "Shift", "Alt", "Meta"].includes(e.key)) {
        keys.push(e.key.length === 1 ? e.key.toUpperCase() : e.key);
      }

      if (keys.length > 0 && !["Control", "Shift", "Alt", "Meta"].includes(e.key)) {
        setHotkey(keys.join(" "));
        setIsRecording(false);
        window.removeEventListener("keydown", handleKeyDown);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    onCleanup(() => {
      window.removeEventListener("keydown", handleKeyDown);
    });
  };

  const hotkeyTokens = () => preferences.os.hotkey.split(" ");

  return (
    <section class="bg-surface-card rounded-xl p-space-lg sm:p-space-xl shadow-sm relative overflow-hidden select-none">
      <div class="absolute -right-16 -top-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Section Header */}
      <div class="flex items-center justify-between gap-space-md mb-space-lg">
        <div class="flex items-center gap-space-sm">
          <div class="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
            <span class="material-symbols-outlined text-[18px]">terminal</span>
          </div>
          <div>
            <h2 class="font-headline-md text-headline-md text-text-primary">OS Shell & Window Protocol</h2>
            <p class="font-body-sm text-body-sm text-text-secondary">
              Tauri runtime window managers, daemon triggers, and system chrome hooks
            </p>
          </div>
        </div>
        <span class="font-mono-label text-mono-label text-text-tertiary uppercase bg-surface-container-low px-2 py-0.5 rounded">
          TAURI V2 NATIVE
        </span>
      </div>

      <div class="space-y-space-md">
        {/* Global Hotkey Interceptor */}
        <div class="p-space-md rounded-xl bg-surface-container hover:bg-surface-elevated transition-colors">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md mb-3">
            <div>
              <span class="font-headline-md text-body-md text-text-primary">
                Global Hotkey Accelerator
              </span>
              <p class="font-body-sm text-body-sm text-text-secondary">
                Universal shortcut active system-wide across all applications
              </p>
            </div>
            <span class="font-mono-label text-caption px-2 py-0.5 rounded bg-surface-container-high text-primary">
              IO-HOOK
            </span>
          </div>
          <div class="flex flex-col sm:flex-row items-center gap-space-sm">
            <div class="flex-1 w-full bg-surface-card px-space-md py-2 rounded-lg flex items-center justify-between shadow-sm">
              <span class="font-mono-label text-caption text-text-tertiary uppercase">Active Trigger</span>
              <div class="flex items-center gap-1.5" id="hotkey-display">
                {isRecording() ? (
                  <span class="font-mono-metric text-mono-metric text-pause-amber animate-pulse">
                    Awaiting key combination...
                  </span>
                ) : (
                  hotkeyTokens().map((token) => (
                    <kbd class="px-2 py-1 rounded bg-surface-container-high text-text-primary font-mono-metric text-mono-metric shadow-sm">
                      {token}
                    </kbd>
                  ))
                )}
              </div>
            </div>
            <button
              type="button"
              id="btn-record-hotkey"
              onClick={toggleRecord}
              class={`w-full sm:w-auto px-space-lg py-2 rounded-lg font-body-sm text-body-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer ${
                isRecording()
                  ? "bg-error-container text-on-error-container"
                  : "bg-surface-container-high hover:bg-surface-bright text-text-primary"
              }`}
            >
              <span class="material-symbols-outlined text-primary text-[18px]">fiber_manual_record</span>
              <span id="record-hotkey-text">
                {isRecording() ? "Press Keys..." : "Record Shortcut"}
              </span>
            </button>
          </div>
        </div>

        {/* Toggles Bento Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          {/* Toggle 1: Start Minimized */}
          <div class="p-space-md rounded-xl bg-surface-container flex items-center justify-between gap-space-md hover:bg-surface-elevated transition-colors">
            <div class="space-y-0.5">
              <span class="font-headline-md text-body-md text-text-primary block">
                Start minimized to tray
              </span>
              <p class="font-caption text-caption text-text-secondary">
                Launch invisibly in background at system startup.
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={preferences.os.startMinimized}
                onChange={(e) => setOsToggle("startMinimized", e.currentTarget.checked)}
                class="sr-only peer"
                id="toggle-start-minimized"
              />
              <div class="w-12 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-text-secondary after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:bg-focus-emerald peer-checked:after:bg-canvas-base shadow-inner"></div>
            </label>
          </div>

          {/* Toggle 2: Close to Tray */}
          <div class="p-space-md rounded-xl bg-surface-container flex items-center justify-between gap-space-md hover:bg-surface-elevated transition-colors">
            <div class="space-y-0.5">
              <span class="font-headline-md text-body-md text-text-primary block">
                Close window to system tray
              </span>
              <p class="font-caption text-caption text-text-secondary">
                Keep timer & ambient sounds running when closed.
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={preferences.os.closeToTray}
                onChange={(e) => setOsToggle("closeToTray", e.currentTarget.checked)}
                class="sr-only peer"
                id="toggle-close-tray"
              />
              <div class="w-12 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-text-secondary after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:bg-focus-emerald peer-checked:after:bg-canvas-base shadow-inner"></div>
            </label>
          </div>

          {/* Toggle 3: Menu Bar Timer */}
          <div class="p-space-md rounded-xl bg-surface-container flex items-center justify-between gap-space-md hover:bg-surface-elevated transition-colors">
            <div class="space-y-0.5">
              <div class="flex items-center gap-1.5">
                <span class="font-headline-md text-body-md text-text-primary block">
                  Menu Bar Countdown
                </span>
                <span class="font-mono-metric text-caption text-primary px-1.5 py-0.2 rounded bg-surface-container-high">
                  24:59
                </span>
              </div>
              <p class="font-caption text-caption text-text-secondary">
                Real-time status string in macOS Menu Bar / Taskbar Tooltip.
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={preferences.os.menubarTimer}
                onChange={(e) => setOsToggle("menubarTimer", e.currentTarget.checked)}
                class="sr-only peer"
                id="toggle-menubar-timer"
              />
              <div class="w-12 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-text-secondary after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:bg-focus-emerald peer-checked:after:bg-canvas-base shadow-inner"></div>
            </label>
          </div>

          {/* Toggle 4: Native Notifications */}
          <div class="p-space-md rounded-xl bg-surface-container flex items-center justify-between gap-space-md hover:bg-surface-elevated transition-colors">
            <div class="space-y-0.5">
              <span class="font-headline-md text-body-md text-text-primary block">
                System OS Notifications
              </span>
              <p class="font-caption text-caption text-text-secondary">
                Banner alert dispatched upon phase completion.
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={preferences.os.osNotifications}
                onChange={(e) => setOsToggle("osNotifications", e.currentTarget.checked)}
                class="sr-only peer"
                id="toggle-os-notifications"
              />
              <div class="w-12 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-text-secondary after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:bg-focus-emerald peer-checked:after:bg-canvas-base shadow-inner"></div>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
};
