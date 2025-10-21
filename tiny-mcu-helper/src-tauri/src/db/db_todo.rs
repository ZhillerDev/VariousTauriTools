use tauri::{App, AppHandle};
use tauri_plugin_sql::{Migration, MigrationKind};

// 迁移创建方法
pub fn create_todo_migrations() -> Vec<Migration> {
    vec![Migration {
        version: 1,
        description: "create todos table", // 迁移描述改为创建待办表
        sql: "CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,  
            content TEXT NOT NULL,                
            completed BOOLEAN DEFAULT 0,           
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP 
        )",
        kind: MigrationKind::Up,
    }]
}
