use cpal::traits::{DeviceTrait, HostTrait};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AudioDevice {
    pub id: String,
    pub name: String,
    #[serde(rename = "isDefault")]
    pub is_default: bool,
    #[serde(rename = "sampleRate")]
    pub sample_rate: u32,
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_audio_output_devices() -> Result<Vec<AudioDevice>, String> {
    let host = cpal::default_host();
    let default_device_name = host.default_output_device().and_then(|d| d.name().ok());

    let mut devices = Vec::new();
    if let Ok(output_devices) = host.output_devices() {
        for device in output_devices {
            if let Ok(name) = device.name() {
                let is_default = default_device_name.as_ref().map(|d| d == &name).unwrap_or(false);
                let sample_rate = device
                    .default_output_config()
                    .map(|c| c.sample_rate().0)
                    .unwrap_or(48000);

                if !devices.iter().any(|d: &AudioDevice| d.name == name) {
                    devices.push(AudioDevice {
                        id: name.clone(),
                        name,
                        is_default,
                        sample_rate,
                    });
                }
            }
        }
    }

    // Place the default device at the top of the list
    devices.sort_by(|a, b| b.is_default.cmp(&a.is_default));

    Ok(devices)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, get_audio_output_devices])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_list_audio_devices() {
        let devices = get_audio_output_devices().expect("Failed to get audio devices");
        assert!(!devices.is_empty(), "Should detect at least one audio output device on machine");
    }
}
