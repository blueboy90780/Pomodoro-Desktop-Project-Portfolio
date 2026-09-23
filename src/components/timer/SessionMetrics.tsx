import { createSignal } from "solid-js";
import { useTimer } from "../../context/TimerContext";

export const SessionMetrics = () => {
  const timer = useTimer();
  const [isEditingTask, setIsEditingTask] = createSignal(false);
  const [editTitle, setEditTitle] = createSignal(timer.activeTask().title);

  const saveTask = () => {
    timer.updateActiveTask({ title: editTitle() });
    setIsEditingTask(false);
  };

  return (
    <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-space-md mt-space-lg mb-space-xl">
      {/* Card 1: Today's Deep Work Aggregate */}
      <div class="p-space-lg rounded-xl bg-surface-card flex flex-col justify-between shadow-sm">
        <div class="flex items-center justify-between text-text-secondary mb-space-sm">
          <span class="font-mono-label text-mono-label uppercase tracking-wider">Today's Focus</span>
          <span class="material-symbols-outlined text-[18px] text-primary">bolt</span>
        </div>
        <div class="flex items-baseline gap-space-sm">
          <span class="font-headline-lg text-headline-lg text-text-primary font-semibold">1h 40m</span>
          <span class="font-caption text-caption text-primary">+25m vs yesterday</span>
        </div>
        <div class="mt-space-md flex items-center gap-1.5">
          <div class="flex-1 h-1.5 rounded-full bg-surface-container-high overflow-hidden">
            <div class="h-full bg-primary rounded-full" style={{ width: "58%" }}></div>
          </div>
          <span class="font-mono-metric text-mono-metric text-text-secondary">4/7</span>
        </div>
      </div>

      {/* Card 2: Completed Sessions / Pomodoro Matrix */}
      <div class="p-space-lg rounded-xl bg-surface-card flex flex-col justify-between shadow-sm">
        <div class="flex items-center justify-between text-text-secondary mb-space-sm">
          <span class="font-mono-label text-mono-label uppercase tracking-wider">Session Trajectory</span>
          <span class="font-mono-metric text-mono-metric text-text-primary">4 of 8 planned</span>
        </div>
        {/* Timeline Micro Dots */}
        <div class="flex items-center justify-between py-2">
          {/* Session 1: Done */}
          <div class="flex flex-col items-center gap-1" title="09:00 Focus - Completed">
            <span class="w-6 h-6 rounded-full bg-focus-emerald/20 text-focus-emerald flex items-center justify-center font-mono-metric text-[10px]">
              ✓
            </span>
            <span class="font-caption text-caption text-text-tertiary">09:00</span>
          </div>
          <div class="w-3 h-0.5 bg-surface-container-high"></div>

          {/* Session 2: Done */}
          <div class="flex flex-col items-center gap-1" title="09:30 Focus - Completed">
            <span class="w-6 h-6 rounded-full bg-focus-emerald/20 text-focus-emerald flex items-center justify-center font-mono-metric text-[10px]">
              ✓
            </span>
            <span class="font-caption text-caption text-text-tertiary">09:30</span>
          </div>
          <div class="w-3 h-0.5 bg-surface-container-high"></div>

          {/* Session 3: Done */}
          <div class="flex flex-col items-center gap-1" title="10:15 Focus - Completed">
            <span class="w-6 h-6 rounded-full bg-focus-emerald/20 text-focus-emerald flex items-center justify-center font-mono-metric text-[10px]">
              ✓
            </span>
            <span class="font-caption text-caption text-text-tertiary">10:15</span>
          </div>
          <div class="w-3 h-0.5 bg-surface-container-high"></div>

          {/* Session 4: Current Active */}
          <div class="flex flex-col items-center gap-1" title="11:00 Focus - In Progress">
            <span class="w-6 h-6 rounded-full bg-focus-emerald text-on-primary flex items-center justify-center font-mono-metric text-[10px] animate-pulse">
              4
            </span>
            <span class="font-caption text-caption text-text-primary font-medium">Now</span>
          </div>
          <div class="w-3 h-0.5 bg-surface-container-high"></div>

          {/* Session 5: Pending */}
          <div class="flex flex-col items-center gap-1" title="Session 5 - Pending">
            <span class="w-6 h-6 rounded-full bg-surface-container-high text-text-tertiary flex items-center justify-center font-mono-metric text-[10px]">
              5
            </span>
            <span class="font-caption text-caption text-text-tertiary">11:45</span>
          </div>
        </div>
        <div class="flex items-center justify-between text-text-tertiary font-caption text-caption mt-space-xs">
          <span>Target: 3h 20m</span>
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
            class="text-text-tertiary hover:text-text-primary text-[14px]"
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
