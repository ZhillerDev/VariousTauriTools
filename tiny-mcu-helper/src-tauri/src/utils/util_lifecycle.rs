use std::process;
use tauri::{AppHandle, Manager, WindowEvent, Wry};

pub fn handle_lifecycle(app: &AppHandle<Wry>) {
    // 获取主窗口
    let main_window = app.get_window("main").unwrap();

    // 监听窗口关闭事件
    main_window.on_window_event(move |event| {
        if let WindowEvent::CloseRequested { api, .. } = event {
            // 取消默认行为（默认会最小化到托盘）
            api.prevent_close();
            // 完全退出应用（而不是最小化到托盘）
            process::exit(0);
        }
    });
}
