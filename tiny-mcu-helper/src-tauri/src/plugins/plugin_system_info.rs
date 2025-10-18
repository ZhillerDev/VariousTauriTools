// 允许使用非 snake_case 命名（例如驼峰命名），避免编译器警告
// 因为某些字段名（如来自 JSON 的字段）可能不符合 Rust 的命名规范
#![allow(non_snake_case)]

// 引入标准库中的 Debug trait，用于调试打印（如 println!("{:?}", ...)）
use std::fmt::Debug;

// 引入 serde 的 Serialize 和 Deserialize，用于结构体与 JSON 之间的序列化/反序列化
use serde::{Deserialize, Serialize};

// 引入 serde_json 的 json! 宏（用于构建 JSON 对象）和 Value 类型（表示任意 JSON 值）
use serde_json::{json, Value};

// 引入 Tauri 的 State 类型，用于在命令函数中访问全局状态（这里是系统信息插件的状态）
use tauri::State;

// 引入 tauri-plugin-system-info 插件的 commands 模块和 SysInfoState 状态类型
use tauri_plugin_system_info::{commands, SysInfoState};

#[derive(Debug, Deserialize, Serialize)]
struct SystemInfos {
  // 系统基本信息
  hostname: String,       // 主机名（如 "MyPC"）
  system_name: String,    // 操作系统名称（如 "Windows", "Linux", "macOS"）
  os_version: String,     // 操作系统版本（如 "10.0.19045"）
  kernel_version: String, // 内核版本（Linux/macOS 有意义）

  // 内存信息（单位：字节）
  total_memory: u64,            // 总物理内存
  used_memory: u64,             // 已使用内存
  memory_usage_percentage: f64, // 内存使用百分比（0.0 ~ 100.0）

  // CPU 信息
  cpu_count: usize,  // CPU 核心数
  cpu_brand: String, // CPU 型号（如 "Intel(R) Core(TM) i7-9750H"）
  cpu_usage: f64,    // CPU 使用率百分比（0.0 ~ 100.0）

  // 磁盘信息：使用自定义的 SimplifiedDisk 结构体列表
  disks: Vec<SystemDiskInfos>,
}

#[derive(Debug, Deserialize, Serialize)]
struct SystemDiskInfos {
  name: String,                // 磁盘设备名（如 "/dev/sda1" 或 "C:"）
  mount_point: String,         // 挂载点（如 "/" 或 "C:\\"）
  total_space: u64,            // 总空间（字节）
  available_space: u64,        // 可用空间（字节）
  usage_percentage: f64,       // 使用百分比（0.0 ~ 100.0）
  file_system: Option<String>, // 文件系统类型（如 "NTFS", "ext4"），可能不存在
}

#[tauri::command]
pub async fn get_all_system_info(state: State<'_, SysInfoState>) -> Result<Value, String> {
  let infos = commands::all_sys_info(state).map_err(|e| format!("获取系统信息失败: {}", e))?;

  let sys_info_value =
      serde_json::to_value(&infos).map_err(|e| format!("序列化系统信息失败: {}", e))?; // 序列化失败则报错

  println!("获取到的系统信息: {:?}", sys_info_value);
  Ok(sys_info_value)
}

#[tauri::command]
pub async fn get_system_info(state: State<'_, SysInfoState>) -> Result<Value, String> {
  // 同样先获取完整的系统信息
  let info = commands::all_sys_info(state)
      .map_err(|e| format!("获取系统信息失败: {}", e))?;

  // 将其序列化为 JSON Value，便于后续用 JSON 方式提取字段
  let info_json = serde_json::to_value(&info)
      .map_err(|e| format!("序列化系统信息失败: {}", e))?;

  // 调用辅助函数，从 JSON 中提取并构建简化版数据
  let simplified_json = convert_system_infos_to_json(&info_json);

  println!("获取简化系统信息成功");
  Ok(simplified_json)
}

fn convert_system_infos_to_json(info: &Value) -> Value {
  let empty_array = json!([]);

  // === 提取基本系统信息 ===
  // 使用 .get("key") 安全访问字段，再用 .as_str() 转为字符串，失败则用 "Unknown"
  let hostname = info
      .get("hostname")
      .and_then(|v| v.as_str())
      .unwrap_or("Unknown");
  let system_name = info
      .get("name")
      .and_then(|v| v.as_str())
      .unwrap_or("Unknown"); // 注意：插件返回的是 "name" 而非 "system_name"
  let os_version = info
      .get("os_version")
      .and_then(|v| v.as_str())
      .unwrap_or("Unknown");
  let kernel_version = info
      .get("kernel_version")
      .and_then(|v| v.as_str())
      .unwrap_or("Unknown");

  // === 提取内存信息 ===
  let total_memory = info
      .get("total_memory")
      .and_then(|v| v.as_u64())
      .unwrap_or(0);
  let used_memory = info
      .get("used_memory")
      .and_then(|v| v.as_u64())
      .unwrap_or(0);
  // 计算内存使用百分比，防止除零错误
  let memory_usage_percentage = if total_memory > 0 {
    (used_memory as f64 / total_memory as f64) * 100.0
  } else {
    0.0
  };

  // === 提取 CPU 信息 ===
  let cpus = info.get("cpus").unwrap_or(&empty_array); // 获取 CPU 列表（JSON 数组）
  // 获取 CPU 核心数（注意：插件返回的是 u64，需转为 usize）
  let cpu_count = info.get("cpu_count").and_then(|v| v.as_u64()).unwrap_or(0) as usize;

  // 从第一个 CPU 获取品牌信息（假设所有核心品牌相同）
  let cpu_brand = if cpus.is_array() && !cpus.as_array().unwrap().is_empty() {
    cpus[0]
        .get("brand")
        .and_then(|v| v.as_str())
        .unwrap_or("Unknown")
  } else {
    "Unknown"
  };

  // 计算平均 CPU 使用率
  let cpu_usage = if cpus.is_array() && !cpus.as_array().unwrap().is_empty() {
    let cpus_array = cpus.as_array().unwrap();
    // 对每个 CPU 的 "cpu_usage" 字段求和（过滤掉无效值）
    let total_usage: f64 = cpus_array
        .iter()
        .filter_map(|cpu| cpu.get("cpu_usage").and_then(|v| v.as_f64()))
        .sum();
    if cpus_array.len() > 0 {
      let avg_usage = total_usage / cpus_array.len() as f64;
      // 判断使用率是小数（0-1）还是百分比（0-100）
      if avg_usage > 1.0 {
        avg_usage // 已是百分比
      } else {
        avg_usage * 100.0 // 转为百分比
      }
    } else {
      0.0
    }
  } else {
    0.0
  };

  // === 处理磁盘信息 ===
  let disks = info.get("disks").unwrap_or(&empty_array);
  let simplified_disks = if disks.is_array() {
    // 遍历每个磁盘，构建简化版磁盘信息
    disks
        .as_array()
        .unwrap()
        .iter()
        .map(|disk| {
          let name = disk
              .get("name")
              .and_then(|v| v.as_str())
              .unwrap_or("Unknown");
          let mount_point = disk
              .get("mount_point")
              .and_then(|v| v.as_str())
              .unwrap_or("Unknown");
          let total_space = disk
              .get("total_space")
              .and_then(|v| v.as_u64())
              .unwrap_or(0);
          let available_space = disk
              .get("available_space")
              .and_then(|v| v.as_u64())
              .unwrap_or(0);
          let file_system = disk
              .get("file_system")
              .and_then(|v| v.as_str())
              .map(String::from); // 可能为 None

          // 计算磁盘使用百分比
          let usage_percentage = if total_space > 0 {
            ((total_space - available_space) as f64 / total_space as f64) * 100.0
          } else {
            0.0
          };

          // 构建 JSON 对象表示这个磁盘
          json!({
                    "name": name,
                    "mount_point": mount_point,
                    "total_space": total_space,
                    "available_space": available_space,
                    "usage_percentage": usage_percentage,
                    "file_system": file_system
                })
        })
        .collect::<Vec<_>>() // 收集为 Vec<Value>
  } else {
    vec![] // 如果不是数组，返回空列表
  };

  json!({
        "hostname": hostname,
        "system_name": system_name,
        "os_version": os_version,
        "kernel_version": kernel_version,
        "total_memory": total_memory,
        "used_memory": used_memory,
        "memory_usage_percentage": memory_usage_percentage,
        "cpu_count": cpu_count,
        "cpu_brand": cpu_brand,
        "cpu_usage": cpu_usage,
        "disks": simplified_disks,
    })
}
