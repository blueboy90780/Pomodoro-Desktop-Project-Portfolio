import { Suspense, ErrorBoundary, type ParentProps } from "solid-js";
import { Header } from "./Header";
import { MasterDeck } from "./MasterDeck";

export const AppShell = (props: ParentProps) => {
  return (
    <div class="min-h-screen bg-canvas-base text-on-surface antialiased select-none flex flex-col font-sans">
      <Header />
      <main class="w-full pt-14 pb-16 bg-canvas-base min-h-screen flex-1 flex flex-col">
        <ErrorBoundary
          fallback={(err, reset) => (
            <div class="flex flex-col items-center justify-center p-space-xl m-auto text-center max-w-md">
              <span class="material-symbols-outlined text-[48px] text-error mb-space-sm">error</span>
              <h2 class="font-headline-lg text-headline-lg text-text-primary mb-space-xs">
                Desktop Workspace Error
              </h2>
              <p class="font-body-sm text-body-sm text-text-secondary mb-space-md">
                {err.message || "An unexpected error occurred inside the workspace panel."}
              </p>
              <button
                type="button"
                onClick={reset}
                class="px-space-md py-2 rounded-lg bg-primary text-on-primary font-body-sm font-medium"
              >
                Reload Panel
              </button>
            </div>
          )}
        >
          <Suspense
            fallback={
              <div class="flex items-center justify-center flex-1 py-32 text-text-tertiary gap-2">
                <span class="material-symbols-outlined animate-spin text-[24px]">progress_activity</span>
                <span class="font-mono-label text-mono-label uppercase tracking-widest">
                  Loading Workspace...
                </span>
              </div>
            }
          >
            {props.children}
          </Suspense>
        </ErrorBoundary>
      </main>
      <MasterDeck />
    </div>
  );
};
