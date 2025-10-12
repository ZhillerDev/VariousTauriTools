// src-tauri/src/main.rs
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// 引入 Shell 插件扩展
use tauri_plugin_shell::ShellExt;

#[tauri::command]
pub async fn open_notepad(app_handle: tauri::AppHandle) -> Result<(), String> {
    #[cfg(windows)]
    {
        let command = app_handle.shell().command("notepad.exe");
        // 可选：传入文件路径，例如打开特定文件
        // command = command.args(["C:\\temp\\test.txt"]);

        let _child = command
            .spawn()
            .map_err(|e| format!("无法启动 notepad: {}", e))?;

        // 可选：等待进程结束（通常不需要，因为记事本是 GUI 程序）
        // let output = child.wait_with_output().await.map_err(|e| e.to_string())?;
        // if !output.status.success() { ... }

        Ok(())
    }

    #[cfg(not(windows))]
    {
        Err("notepad 仅在 Windows 上可用".to_string())
    }
}

#[tauri::command]
pub async fn open_calc(app_handle: tauri::AppHandle) -> Result<(), String> {
    #[cfg(windows)]
    {
        let command = app_handle.shell().command("calc.exe");
        // 可选：传入文件路径，例如打开特定文件
        // command = command.args(["C:\\temp\\test.txt"]);

        let _child = command
            .spawn()
            .map_err(|e| format!("无法启动 notepad: {}", e))?;

        // 可选：等待进程结束（通常不需要，因为记事本是 GUI 程序）
        // let output = child.wait_with_output().await.map_err(|e| e.to_string())?;
        // if !output.status.success() { ... }

        Ok(())
    }

    #[cfg(not(windows))]
    {
        Err("notepad 仅在 Windows 上可用".to_string())
    }
}
