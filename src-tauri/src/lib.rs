use cpal::traits::{DeviceTrait, HostTrait};
use serde::{Deserialize, Serialize};
use std::sync::atomic::{AtomicBool, Ordering};
use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager,
};

pub struct AppState {
    pub close_to_tray: AtomicBool,
}

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
fn set_close_to_tray(enabled: bool, state: tauri::State<AppState>) {
    state.close_to_tray.store(enabled, Ordering::Relaxed);
}

#[tauri::command]
fn get_close_to_tray(state: tauri::State<AppState>) -> bool {
    state.close_to_tray.load(Ordering::Relaxed)
}

#[tauri::command]
fn minimize_window(window: tauri::WebviewWindow) -> Result<(), String> {
    window.hide().map_err(|e| e.to_string())
}

#[tauri::command]
fn show_window(window: tauri::WebviewWindow) -> Result<(), String> {
    window.show().map_err(|e| e.to_string())?;
    window.unminimize().map_err(|e| e.to_string())?;
    window.set_focus().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn exit_app(app_handle: tauri::AppHandle) {
    app_handle.exit(0);
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
        .manage(AppState {
            close_to_tray: AtomicBool::new(true),
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                let state = window.state::<AppState>();
                if state.close_to_tray.load(Ordering::Relaxed) {
                    api.prevent_close();
                    let _ = window.hide();
                }
            }
        })
        .setup(|app| {
            let quit_i = MenuItem::with_id(app, "quit", "Quit AuraFocus", true, None::<&str>)?;
            let show_i = MenuItem::with_id(app, "show", "Open AuraFocus", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show_i, &quit_i])?;

            let mut tray_builder = TrayIconBuilder::with_id("main-tray")
                .tooltip("AuraFocus")
                .menu(&menu)
                .show_menu_on_left_click(false)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "quit" => {
                        app.exit(0);
                    }
                    "show" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.unminimize();
                            let _ = window.set_focus();
                        }
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.unminimize();
                            let _ = window.set_focus();
                        }
                    }
                });

            let icon = app.default_window_icon().cloned().or_else(|| {
                tauri::image::Image::from_bytes(include_bytes!("../icons/32x32.png")).ok()
            });

            if let Some(icon) = icon {
                tray_builder = tray_builder.icon(icon);
            }

            let _tray = tray_builder.build(app)?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            get_audio_output_devices,
            set_close_to_tray,
            get_close_to_tray,
            minimize_window,
            show_window,
            exit_app,
        ])
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
