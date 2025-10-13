pub mod launcher;
pub mod plugins;

// use launcher::splash_setup;
use launcher::init_logger;
use launcher::init_menu;
use launcher::init_system_tray;
use launcher::splash_set_complete;
use std::sync::Mutex;

use plugins::get_all_system_info;
use plugins::get_system_info;
use plugins::open_calc;
use plugins::open_notepad;
use tauri_plugin_system_info::SysInfoState;

use crate::launcher::SetupState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // 注册一个由 Tauri 管理的 `State`
        // 我们需要对它拥有写访问权限，因此我们将其包裹在 `Mutex` 中
        .manage(Mutex::new(SetupState {
            frontend_task: false,
            backend_task: false,
        }))
        // 添加我们用于检查的命令
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
            open_calc,
            open_notepad
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// 应用初始化
fn setup_app(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    // 初始化日志
    init_logger(app).expect("TODO: panic message");

    // 初始化系统托盘
    init_system_tray(app).expect("TODO: panic message");

    // 初始化顶部菜单栏
    init_menu(app).expect("TODO: panic message");

    Ok(()) // 表示应用初始化成功
}
