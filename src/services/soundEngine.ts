/**
 * WebAudio synthesis and cue player for AuraFocus.
 * Provides audio synthesis for phase completion chimes without external audio asset dependencies.
 */

export type ChimeProfile = "zen-bell" | "tibetan-bowl" | "marimba" | "digital-beep";

let sharedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!sharedAudioContext) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    sharedAudioContext = new AudioCtx();
  }
  if (sharedAudioContext.state === "suspended") {
    sharedAudioContext.resume();
  }
  return sharedAudioContext;
}

export function playChimeProfile(profile: ChimeProfile): Promise<void> {
  return new Promise((resolve) => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      let freq = 432;
      let decay = 1.2;

      switch (profile) {
        case "tibetan-bowl":
          freq = 216;
          decay = 2.0;
          osc.type = "sine";
          break;
        case "marimba":
          freq = 528;
          decay = 0.8;
          osc.type = "triangle";
          break;
        case "digital-beep":
          freq = 880;
          decay = 0.4;
          osc.type = "sine";
          break;
        case "zen-bell":
        default:
          freq = 432;
          decay = 1.5;
          osc.type = "sine";
          break;
      }

      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Bell-like decaying envelope
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + decay);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + decay);

      setTimeout(resolve, decay * 1000);
    } catch (err) {
      console.warn("WebAudio synthesis error:", err);
      resolve();
    }
  });
}
