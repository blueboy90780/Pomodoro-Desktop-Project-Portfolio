import { createSignal, For } from "solid-js";
import { useTimer } from "../../context/TimerContext";
import { usePreferences } from "../../context/PreferencesContext";

export const SessionMetrics = () => {
  const timer = useTimer();
  const { preferences } = usePreferences();
  const [isEditingTask, setIsEditingTask] = createSignal(false);
  const [editTitle, setEditTitle] = createSignal(timer.activeTask().title);

  const saveTask = () => {
    timer.updateActiveTask({ title: editTitle() });
    setIsEditingTask(false);
  };

  const totalFocusMinutes = () => preferences.intervals.focus * timer.totalCycles();
  const targetHours = () => Math.floor(totalFocusMinutes() / 60);
  const targetRemainingMins = () => totalFocusMinutes() % 60;

  return (
    <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-space-md mt-space-lg mb-space-xl">
      {/* Card 1: Today's Deep Work Aggregate */}
      <div class="p-space-lg rounded-xl bg-surface-card flex flex-col justify-between shadow-sm">
        <div class="flex items-center justify-between text-text-secondary mb-space-sm">
          <span class="font-mono-label text-mono-label uppercase tracking-wider">Today's Focus</span>
          <span class="material-symbols-outlined text-[18px] text-primary">bolt</span>
        </div>
        <div class="flex items-baseline gap-space-sm">
          <span class="font-headline-lg text-headline-lg text-text-primary font-semibold">
            {targetHours()}h {targetRemainingMins()}m
          </span>
          <span class="font-caption text-caption text-primary">Target arc</span>
        </div>
        <div class="mt-space-md flex items-center gap-1.5">
          <div class="flex-1 h-1.5 rounded-full bg-surface-container-high overflow-hidden">
            <div
              class="h-full bg-primary rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, Math.round((timer.currentCycle() / timer.totalCycles()) * 100))}%`,
              }}
            ></div>
          </div>
          <span class="font-mono-metric text-mono-metric text-text-secondary">
            {timer.currentCycle()}/{timer.totalCycles()}
          </span>
        </div>
      </div>

      {/* Card 2: Completed Sessions / Pomodoro Matrix */}
      <div class="p-space-lg rounded-xl bg-surface-card flex flex-col justify-between shadow-sm">
        <div class="flex items-center justify-between text-text-secondary mb-space-sm">
          <span class="font-mono-label text-mono-label uppercase tracking-wider">Session Trajectory</span>
          <span class="font-mono-metric text-mono-metric text-text-primary">
            {timer.currentCycle()} of {timer.totalCycles()} planned
          </span>
        </div>
        {/* Timeline Micro Dots */}
        <div class="flex items-center justify-between py-2 overflow-x-auto gap-1">
          <For each={Array.from({ length: timer.totalCycles() }, (_, i) => i + 1)}>
            {(cycleNum, index) => {
              const isDone = () => timer.currentCycle() > cycleNum;
              const isCurrent = () => timer.currentCycle() === cycleNum;
              return (
                <>
                  <div
                    class="flex flex-col items-center gap-1 shrink-0"
                    title={`Cycle ${cycleNum} - ${isDone() ? "Completed" : isCurrent() ? "In Progress" : "Pending"}`}
                  >
                    <span
                      class={`w-6 h-6 rounded-full flex items-center justify-center font-mono-metric text-[10px] ${
                        isDone()
                          ? "bg-focus-emerald/20 text-focus-emerald"
                          : isCurrent()
                          ? "bg-focus-emerald text-on-primary animate-pulse"
                          : "bg-surface-container-high text-text-tertiary"
                      }`}
                    >
                      {isDone() ? "✓" : cycleNum}
                    </span>
                    <span
                      class={`font-caption text-caption ${
                        isCurrent() ? "text-text-primary font-medium" : "text-text-tertiary"
                      }`}
                    >
                      {isCurrent() ? "Now" : `C${cycleNum}`}
                    </span>
                  </div>
                  {index() < timer.totalCycles() - 1 && (
                    <div
                      class={`flex-1 h-0.5 min-w-[8px] mx-1 ${
                        isDone() ? "bg-focus-emerald/40" : "bg-surface-container-high"
                      }`}
                    />
                  )}
                </>
              );
            }}
          </For>
        </div>
        <div class="flex items-center justify-between text-text-tertiary font-caption text-caption mt-space-xs">
          <span>
            Target: {targetHours()}h {targetRemainingMins()}m
          </span>
          <span class="text-focus-emerald font-medium">On Track</span>
        </div>
      </div>

      {/* Card 3: Current Focus Intention Card */}
      <div class="p-space-lg rounded-xl bg-surface-card flex flex-col justify-between shadow-sm">
        <div class="flex items-center justify-between text-text-secondary mb-space-sm">
          <span class="font-mono-label text-mono-label uppercase tracking-wider">Active Task</span>
          <button
            type="button"
            onClick={() => setIsEditingTask((prev) => !prev)}
            class="text-text-tertiary hover:text-text-primary text-[14px] cursor-pointer"
          >
            <span class="material-symbols-outlined text-[16px]">edit</span>
          </button>
        </div>
        <div>
          {isEditingTask() ? (
            <input
              type="text"
              value={editTitle()}
              onInput={(e) => setEditTitle(e.currentTarget.value)}
              onKeyDown={(e) => e.key === "Enter" && saveTask()}
              onBlur={saveTask}
              class="w-full bg-surface-container-lowest text-text-primary px-2 py-1 rounded text-headline-md font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              autofocus
            />
          ) : (
            <div class="font-headline-md text-headline-md text-text-primary font-medium truncate">
              {timer.activeTask().title}
            </div>
          )}
          <p class="font-body-sm text-body-sm text-text-secondary line-clamp-1 mt-0.5">
            {timer.activeTask().description}
          </p>
        </div>
        <div class="mt-space-md flex items-center justify-between">
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-low text-text-secondary font-mono-label text-mono-label">
            <span class="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
            PRIORITY: {timer.activeTask().priority}
          </span>
          <span class="font-caption text-caption text-text-tertiary">{timer.activeTask().sprint}</span>
        </div>
      </div>
    </div>
  );
};
