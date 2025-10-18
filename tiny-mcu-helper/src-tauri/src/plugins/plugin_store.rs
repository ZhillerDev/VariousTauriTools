use serde_json::json;
use std::sync::Arc;
use tauri::{App, AppHandle, Wry};
use tauri_plugin_store::{Store, StoreExt};

/// 获取应用程序所在目录
// fn get_app_directory(app: &AppHandle<Wry>) -> Result<PathBuf, String> {
//     // 获取应用可执行文件路径
//     let exe_path = app.path()
//
//     Ok(exe_path)
// }
use crate::utils::util_file::util_get_app_path;


fn get_store(app: AppHandle<Wry>) -> Arc<Store<Wry>> {
    app.store(util_get_app_path().join("data").join("app.cfg"))
        .expect("TODO: panic message")
}

// 初始化Store
pub fn init_store(app: &App) -> Result<(), Box<dyn std::error::Error>> {
    let store = get_store(app.handle().clone());

    // 检查是否已初始化
    let is_initialized = store.get("system");
    let need_init = match is_initialized {
        None => true, // 不存在init字段，需要初始化
        Some(init_data) => {
            // 存在init字段时，检查initialized是否为true
            init_data
                .get("initialized")
                .and_then(|v| v.as_bool())
                .unwrap_or(false)
                == false
        }
    };

    if need_init {
        store.set(
            "system".to_string(),
            json!({
                "version": "1.0.0",
                "initialized": true,
                "darkTheme":true,
                "hideHeaderBar":true,
                "expandSideBar":false,
            }),
        ); // 补充错误处理
    }

    Ok(())
}
// 存储值到Store的函数
#[tauri::command]
pub fn store_set(app: AppHandle<Wry>, key: &str, value: serde_json::Value) -> Result<(), String> {
    Ok(get_store(app).set(key.to_string(), value))
}

// 从Store获取值的函数
#[tauri::command]
pub fn store_get(app: AppHandle<Wry>, key: &str) -> Result<Option<serde_json::Value>, String> {
    // 获取值
    Ok(get_store(app).get(key))
}

// 从Store删除值的函数
#[tauri::command]
pub fn store_delete(app: AppHandle<Wry>, key: &str) -> bool {
    get_store(app).delete(key)
}
