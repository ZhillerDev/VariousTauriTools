use tauri::App;
use tauri_plugin_log::log::LevelFilter;

// 日志插件初始化
pub fn init_logger(app: &App) -> Result<(), Box<dyn std::error::Error>> {
    if cfg!(debug_assertions) {
        app.handle().plugin(
            tauri_plugin_log::Builder::default()
                .level(LevelFilter::Info)
                .build(),
        )?;
    }
    Ok(())
}
