pub mod launcher;
pub mod plugins;

use tauri_plugin_log::log;
// use launcher::splash_setup;
use launcher::system_tray_setup;

use plugins::get_all_system_info;
use plugins::get_system_info;
use tauri_plugin_system_info::SysInfoState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // 在调试模式下，添加日志插件
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info) // 设置日志级别为Info
                        .build(),
                )?;
            }
            system_tray_setup(app).expect("TODO: panic message");

            Ok(()) // 表示应用初始化成功
        })
        .plugin(tauri_plugin_opener::init())
        .manage(SysInfoState::default())
        .invoke_handler(tauri::generate_handler![
            get_system_info,
            get_all_system_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
