pub mod launcher;
pub mod plugins;
pub mod utils;

// use launcher::splash_setup;
use launcher::init_logger;
use launcher::init_system_tray;
use launcher::splash_set_complete;
use plugins::get_all_system_info;
use plugins::get_system_info;
use plugins::init_store;
use plugins::run_calc;
use plugins::run_get_running_path;
use plugins::run_notepad;
use plugins::store_delete;
use plugins::store_get;
use plugins::store_set;
use std::sync::Mutex;
use tauri::{App, Manager};
use tauri_plugin_system_info::SysInfoState;

use crate::launcher::SetupState;
use crate::utils::handle_lifecycle;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // 注册一个由 Tauri 管理的 `State`
        // 我们需要对它拥有写访问权限，因此我们将其包裹在 `Mutex` 中
        .manage(Mutex::new(SetupState {
            frontend_task: false,
            backend_task: false,
        }))
        // store 先注册后使用
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![splash_set_complete])
        .setup(setup_app)
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_system_info::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_shell::init())
        .manage(SysInfoState::default())
        .invoke_handler(tauri::generate_handler![
            get_system_info,
            get_all_system_info,
            run_calc,
            run_notepad,
            run_get_running_path,
            store_set,
            store_get,
            store_delete
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// 应用初始化
fn setup_app(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    // 初始化日志
    init_logger(app).expect("TODO: panic message");

    // 初始化系统托盘
    init_system_tray(app).expect("TODO: panic message");

    // 初始化顶部菜单栏（默认不打开）
    //init_menu(app).expect("TODO: panic message");

    // 初始化简单的键值对数据存储
    init_store(app).expect("TODO: panic message");

    // 窗口生命周期管理
    handle_lifecycle(app.handle());

    Ok(()) // 表示应用初始化成功
}

