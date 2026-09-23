/**
 * Typed Tauri v2 IPC adapter layer.
 * Decouples UI components from Tauri-specific runtime internals.
 * When running in standard browser preview, provides clean mock implementations.
 */

export interface SystemMetrics {
  rssMemoryMb: number;
  daemonActive: boolean;
  version: string;
}

export interface AudioDevice {
  id: string;
  name: string;
  isDefault: boolean;
  sampleRate: number;
}

// Check if running inside Tauri window
export function isTauriEnvironment(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

export async function invokeCommand<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  if (isTauriEnvironment()) {
    const { invoke } = await import("@tauri-apps/api/core");
    return invoke<T>(command, args);
  }

  // Graceful development fallback
  console.debug(`[Mock IPC] Invoked: ${command}`, args);
  return Promise.resolve({} as T);
}

export async function fetchSystemMetrics(): Promise<SystemMetrics> {
  if (isTauriEnvironment()) {
    try {
      return await invokeCommand<SystemMetrics>("get_system_metrics");
    } catch {
      // Fallback
    }
  }
  return {
    rssMemoryMb: 14.2,
    daemonActive: true,
    version: "2.4.0-obsidian",
  };
}

export async function fetchAudioDevices(): Promise<AudioDevice[]> {
  if (isTauriEnvironment()) {
    try {
      return await invokeCommand<AudioDevice[]>("get_audio_output_devices");
    } catch {
      // Fallback
    }
  }
  return [
    { id: "default", name: "System Default (External Audio Interface / USB DAC)", isDefault: true, sampleRate: 48000 },
    { id: "built_in", name: "MacBook Pro Built-in Speakers (Spatial Array)", isDefault: false, sampleRate: 48000 },
    { id: "airpods", name: "AirPods Max (Low-Latency Bluetooth LE)", isDefault: false, sampleRate: 44100 },
  ];
}

export async function notifyPhaseComplete(phase: string, message: string): Promise<void> {
  if (isTauriEnvironment()) {
    try {
      await invokeCommand("send_native_notification", { phase, message });
      return;
    } catch {
      // Fallback
    }
  }
  console.info(`[Notification] ${phase}: ${message}`);
}
