import { Show } from "solid-js";
import { useTimer } from "../context/TimerContext";
import { TimerGauge } from "../components/timer/TimerGauge";
import { SessionMetrics } from "../components/timer/SessionMetrics";
import { ShortBreakCard } from "../components/timer/ShortBreakCard";
import { LongBreakSummary } from "../components/timer/LongBreakSummary";

export const TimerPage = () => {
  const timer = useTimer();

  return (
    <div class="flex flex-col w-full">
      <Show when={timer.currentPhase() === "focus"}>
        <div class="flex flex-col w-full max-w-5xl mx-auto px-margin py-space-lg select-none">
          <TimerGauge />
          <SessionMetrics />
        </div>
      </Show>

      <Show when={timer.currentPhase() === "short_break"}>
        <ShortBreakCard />
      </Show>

      <Show when={timer.currentPhase() === "long_break"}>
        <LongBreakSummary />
      </Show>
    </div>
  );
};
