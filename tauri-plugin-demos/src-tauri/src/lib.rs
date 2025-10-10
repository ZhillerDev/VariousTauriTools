pub mod plugins;

use tauri_plugin_system_info::SysInfoState;
use plugins::get_system_info;
use plugins::get_all_system_info;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(SysInfoState::default())
        .invoke_handler(tauri::generate_handler![
            get_system_info,
            get_all_system_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
