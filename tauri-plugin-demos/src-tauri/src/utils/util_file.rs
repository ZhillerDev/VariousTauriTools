use std::path::PathBuf;

// 假设此函数一定能成功返回路径（无错误）
pub fn util_get_app_path() -> PathBuf {
    // 实际实现中确保不会失败
    std::env::current_exe()
        .unwrap()
        .parent()
        .unwrap()
        .to_path_buf()
}