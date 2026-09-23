import { useLocation, A } from "@solidjs/router";
import { AuraLogo } from "../ui/AuraLogo";
import { useTimer } from "../../context/TimerContext";

export const Header = () => {
  const location = useLocation();
  const timer = useTimer();

  const isTimerActive = () => location.pathname === "/" || location.pathname.startsWith("/timer");
  const isSoundscapeActive = () => location.pathname.startsWith("/soundscape");
  const isPreferencesActive = () => location.pathname.startsWith("/preferences");

  const statusText = () => {
    if (!timer.isRunning()) return "IDLE / READY";
    if (timer.currentPhase() === "focus") return "FOCUS RUNNING";
    if (timer.currentPhase() === "short_break") return "SHORT REST";
    return "LONG RECESS";
  };

  const statusDotColor = () => {
    if (!timer.isRunning()) return "bg-focus-emerald";
    if (timer.currentPhase() === "focus") return "bg-focus-emerald";
    return "bg-break-cyan";
  };

  return (
    <header data-tauri-drag-region class="fixed top-0 left-0 right-0 z-50 bg-surface-card/90 backdrop-blur-md select-none">
      <div class="h-14 max-w-7xl mx-auto px-margin flex items-center justify-between gap-space-md" data-tauri-drag-region>
        {/* Left: Branding & Runtime Status Badge */}
        <div class="flex items-center gap-space-sm" data-tauri-drag-region>
          <A href="/timer" class="flex items-center gap-space-sm no-drag">
            <AuraLogo size={32} />
            <span class="font-headline-md text-headline-md text-text-primary tracking-tight">AuraFocus</span>
          </A>
          <div class="hidden sm:flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-surface-container-low text-text-secondary font-mono-label text-mono-label no-drag">
            <span class={`w-1.5 h-1.5 rounded-full ${statusDotColor()} animate-pulse`}></span>
            <span>{statusText()}</span>
          </div>
        </div>

        {/* Center: Desktop Navigation Tabs */}
        <nav
          aria-label="Primary Navigation"
          class="flex items-center p-1 rounded-xl bg-surface-container-lowest no-drag"
        >
          <A
            href="/timer"
            class={`px-space-md py-1 rounded-lg transition-colors font-body-sm text-body-sm ${
              isTimerActive()
                ? "bg-surface-container-high text-text-primary font-medium shadow-sm"
                : "text-text-secondary hover:text-on-surface"
            }`}
          >
            Timer
          </A>
          <A
            href="/soundscape"
            class={`px-space-md py-1 rounded-lg transition-colors font-body-sm text-body-sm ${
              isSoundscapeActive()
                ? "bg-surface-container-high text-text-primary font-medium shadow-sm"
                : "text-text-secondary hover:text-on-surface"
            }`}
          >
            Soundscape
          </A>
          <A
            href="/preferences"
            class={`px-space-md py-1 rounded-lg transition-colors font-body-sm text-body-sm ${
              isPreferencesActive()
                ? "bg-surface-container-high text-text-primary font-medium shadow-sm"
                : "text-text-secondary hover:text-on-surface"
            }`}
          >
            Preferences
          </A>
        </nav>

        {/* Right: User Profile Avatar */}
        <div class="flex items-center gap-space-sm no-drag">
          <div
            title="AuraFocus Desktop Profile"
            class="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer transition-transform active:scale-95"
          >
            <span class="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
};
