use tauri::menu::IsMenuItem;
use tauri::{
    menu::{Menu, MenuItem},
    tray::{TrayIconBuilder, TrayIconEvent},
    App, Wry,
};

pub fn init_system_tray(app: &App) -> Result<(), Box<dyn std::error::Error>> {
    system_tray_setup(app).map_err(|e| {
        Box::new(std::io::Error::new(
            std::io::ErrorKind::Other,
            format!("系统托盘初始化失败: {}", e),
        )) as Box<dyn std::error::Error>
    })?;
    Ok(())
}

/// 创建并配置系统托盘图标
fn system_tray_setup(app: &tauri::App) -> tauri::Result<()> {
    // 创建托盘菜单项
    let menu_items = create_tray_menu_items(app)?;

    // 将 Vec<MenuItem<Wry>> 转换为 &[&dyn IsMenuItem<Wry>]
    let menu_items_refs: Vec<&dyn IsMenuItem<Wry>> =
        menu_items.iter().map(|item| item as _).collect();

    // 构建托盘菜单
    let menu = Menu::with_items(app, &menu_items_refs)?;

    // 构建并设置托盘图标
    TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .show_menu_on_left_click(true)
        .on_menu_event(handle_menu_event)
        .on_tray_icon_event(handle_tray_event)
        .build(app)?;

    Ok(())
}

/// 创建托盘菜单项
fn create_tray_menu_items(app: &tauri::App) -> tauri::Result<Vec<MenuItem<Wry>>> {
    let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
    let about = MenuItem::with_id(app, "about", "About", true, None::<&str>)?;

    Ok(vec![quit, about])
}

/// 处理托盘菜单事件
fn handle_menu_event(app: &tauri::AppHandle, event: tauri::menu::MenuEvent) {
    match event.id.as_ref() {
        "quit" => {
            println!("Exiting application...");
            app.exit(0);
        }
        "about" => {
            println!("Showing about dialog...");
            // 这里可以添加显示关于对话框的逻辑
        }
        _ => {
            println!("Unhandled menu event: {:?}", event.id);
        }
    }
}

/// 处理托盘图标事件
// 如果确实不需要使用 tray 参数，可将其移除
fn handle_tray_event(_tray: &tauri::tray::TrayIcon, event: TrayIconEvent) {
    match event {
        TrayIconEvent::Click { .. } => {
            println!("Tray icon clicked");
            // 这里可以添加点击托盘图标后的逻辑
        }
        _ => {
            println!("Unhandled tray event: {:?}", event);
        }
    }
}
