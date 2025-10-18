// src-tauri/src/main.rs
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;
use tauri::{AppHandle, Manager};
// 引入 Shell 插件扩展
use tauri_plugin_shell::ShellExt;

#[tauri::command]
pub async fn run_notepad(app_handle: AppHandle) -> Result<(), String> {
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
pub async fn run_calc(app_handle: AppHandle) -> Result<(), String> {
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

// 获取当前程序运行路径并返回
#[tauri::command]
pub fn run_get_running_path() -> Result<String, String> {
    // 获取当前可执行文件的路径
    let exe_path = env::current_exe().map_err(|e| format!("无法获取程序路径: {}", e))?;
 
    // 获取可执行文件所在的目录路径
    let exe_dir = exe_path.parent().ok_or("无法获取程序所在目录")?;

    // 将路径转换为字符串并返回
    let path_str = exe_dir.to_str().ok_or("路径无法转换为字符串")?;

    Ok(path_str.to_string())
}
