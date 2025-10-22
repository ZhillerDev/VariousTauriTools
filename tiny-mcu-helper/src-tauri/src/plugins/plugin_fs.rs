// 创建文件的函数
use std::path::Path;
use std::fs::File;

use crate::utils::util_get_app_path;

#[tauri::command]
pub fn create_txt_file(file_title: &str, content: &str) -> Result<(), String> {
  // 获取程序运行目录
  let exe_dir = util_get_app_path();

  // 构建generate文件夹路径
  let generate_dir = exe_dir.join("generate");

  // 确保generate文件夹存在（不存在则创建，包括可能的父目录）
  std::fs::create_dir_all(&generate_dir)
      .map_err(|e| format!("创建generate文件夹失败: {}", e))?;

  // 构建完整文件路径（自动补充.txt扩展名）
  let file_name = if file_title.ends_with(".txt") {
    file_title.to_string()
  } else {
    format!("{}.txt", file_title)
  };
  let file_path = generate_dir.join(file_name);

  // 写入文件内容
  std::fs::write(&file_path, content)
      .map_err(|e| format!("写入文件失败: {}", e))?;

  Ok(())
}