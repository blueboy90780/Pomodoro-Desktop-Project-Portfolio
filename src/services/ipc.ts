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
      const devices = await invokeCommand<AudioDevice[]>("get_audio_output_devices");
      if (devices && devices.length > 0) {
        return devices;
      }
    } catch (err) {
      console.warn("Failed to get audio devices from Tauri IPC:", err);
    }
  }

  // Browser MediaDevices API fallback (when previewing in browser outside Tauri)
  if (typeof navigator !== "undefined" && navigator.mediaDevices?.enumerateDevices) {
    try {
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      const audioOutputs = mediaDevices.filter((d) => d.kind === "audiooutput");
      if (audioOutputs.length > 0) {
        return audioOutputs.map((d, idx) => ({
          id: d.deviceId || `device-${idx}`,
          name: d.label || (d.deviceId === "default" ? "System Default Output" : `Audio Output ${idx + 1}`),
          isDefault: d.deviceId === "default" || idx === 0,
          sampleRate: 48000,
        }));
      }
    } catch (err) {
      console.warn("Failed to query browser media devices:", err);
    }
  }

  return [
    { id: "default", name: "System Default Audio Output", isDefault: true, sampleRate: 48000 },
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
