use markdown2pdf::{config::ConfigSource, parse_into_file};
use crate::utils::util_get_app_path;

#[tauri::command]
pub fn convert_markdown_to_pdf(markdown_content: &str, pdf_file_name: &str) -> Result<(), String> {
    // 获取当前目录
    let current_dir = util_get_app_path();

    // 构建generate文件夹路径
    let generate_dir = current_dir.join("generate");

    // 确保generate文件夹存在（不存在则创建，包括可能的父目录）
    std::fs::create_dir_all(&generate_dir)
        .map_err(|e| format!("创建generate文件夹失败: {}", e))?;

    let pdf_path = generate_dir.join(format!("{}.pdf", pdf_file_name));

    println!("PDF文件路径: {:?}", pdf_path);
    println!("Markdown内容长度: {} 字符", markdown_content.len());

    let config = ConfigSource::Default;

    // 转换路径为字符串
    let pdf_path_str = pdf_path.to_str().ok_or("无法将PDF文件路径转换为字符串")?;

    println!("开始生成PDF...");

    // 直接使用 markdown_content 字符串，不创建临时文件
    // markdown2pdf 应该支持从字符串直接生成
    parse_into_file(markdown_content.to_string(), pdf_path_str, config)
        .map_err(|e| format!("PDF 生成失败: {}", e))?;

    // 验证PDF文件是否创建
    if pdf_path.exists() {
        let metadata =
            std::fs::metadata(&pdf_path).map_err(|e| format!("无法获取PDF文件信息: {}", e))?;
        println!("PDF文件生成成功！大小: {} 字节", metadata.len());
    } else {
        return Err("PDF文件未创建".to_string());
    }

    Ok(())
}
