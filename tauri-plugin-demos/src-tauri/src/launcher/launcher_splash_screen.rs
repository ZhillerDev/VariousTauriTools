use std::sync::Mutex;
use std::time::Duration;
use tauri::{AppHandle, Manager, State};
use tokio::time::sleep;

// 创建一个结构，用于跟踪前端任务完成情况
// 设置相关任务
pub struct SetupState {
  pub frontend_task: bool,
  pub backend_task: bool,
}

// 一个用于设置初始化任务状态的自定义任务
#[tauri::command]
pub async fn splash_set_complete(
  app: AppHandle,
  state: State<'_, Mutex<SetupState>>,
  task: String,
) -> Result<(), ()> {
  // 以只读方式锁定 `State`
  let mut state_lock = state.lock().unwrap();
  match task.as_str() {
    "frontend" => state_lock.frontend_task = true,
    "backend" => state_lock.backend_task = true,
    _ => panic!("invalid task completed!"),
  }
  // 检查两个任务是否都已完成
  if state_lock.backend_task {
    // 设置都已完成，我们可以关闭启动画面并且显示 main 窗口了
    let splash_window = app.get_webview_window("splashscreen").unwrap();
    let main_window = app.get_webview_window("main").unwrap();
    splash_window.close().unwrap();
    main_window.show().unwrap();
  }
  Ok(())
}

// // 一个异步函数，用于执行一些耗时的设置任务
// pub async fn splash_setup(app: AppHandle) -> Result<(), ()> {
//   // 模拟执行一些耗时的设置任务，3秒后完成
//   println!("Performing really heavy backend setup task...");
//   sleep(Duration::from_secs(1)).await;
//   println!("Backend setup task completed!");
//   // 设置后端任务为已完成
//   // 可以像普通函数一样运行命令，但需要自己处理输入参数
//   crate::splash_set_complete(
//     app.clone(),
//     app.state::<Mutex<SetupState>>(),
//     "backend".to_string(),
//   )
//       .await?;
//   Ok(())
// }