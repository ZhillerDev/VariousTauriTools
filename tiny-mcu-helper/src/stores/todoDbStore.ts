// 定义数据模型
import Database from "@tauri-apps/plugin-sql";
import { create } from "zustand";

// 定义Todo数据模型
export interface Todo {
  id: number;
  content: string;
  completed: boolean;
  createdAt: string;
}

interface TodoDbState {
  db: Database | null;
  todos: Todo[];
  loading: boolean;
  error: string | null;

  initDb: () => Promise<void>;
  fetchTodos: () => Promise<void>;
  addTodo: (content: string) => Promise<void>;
  toggleTodo: (id: number, completed: boolean) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  updateTodo: (id: number, content: string) => Promise<void>;
  clearAllTodos: () => Promise<void>; // 新增：清除所有待办
}

export const useTodoDbStore = create<TodoDbState>((set, get) => ({
  db: null,
  todos: [],
  loading: false,
  error: null,

  // 初始化数据库
  initDb: async () => {
    try {
      set({ loading: true, error: null });
      // 打开SQLite数据库
      const db = await Database.load('sqlite:todo.db');

      // 创建todos表
      await db.execute(`
          CREATE TABLE IF NOT EXISTS todos (
                                               id INTEGER PRIMARY KEY AUTOINCREMENT,
                                               content TEXT NOT NULL,
                                               completed BOOLEAN DEFAULT 0,
                                               createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
          )
      `);

      set({ db, loading: false });
      await get().fetchTodos();
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : '初始化数据库失败',
        loading: false
      });
    }
  },

  // 获取所有待办
  fetchTodos: async () => {
    try {
      set({ loading: true, error: null });
      const { db } = get();
      if (!db) throw new Error('数据库未初始化');

      const todos = await db.select<Todo[]>('SELECT * FROM todos ORDER BY createdAt DESC');
      set({ todos, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : '获取待办列表失败',
        loading: false
      });
    }
  },

  // 添加待办
  addTodo: async (content: string) => {
    try {
      set({ loading: true, error: null });
      const { db } = get();
      if (!db) throw new Error('数据库未初始化');

      await db.execute(
          'INSERT INTO todos (content) VALUES ($1)',
          [content]
      );

      await get().fetchTodos();
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : '添加待办失败',
        loading: false
      });
    }
  },

  // 切换待办状态
  toggleTodo: async (id: number, completed: boolean) => {
    try {
      set({ loading: true, error: null });
      const { db } = get();
      if (!db) throw new Error('数据库未初始化');

      await db.execute(
          'UPDATE todos SET completed = $1 WHERE id = $2',
          [completed ? 1 : 0, id]
      );

      await get().fetchTodos();
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : '更新待办状态失败',
        loading: false
      });
    }
  },

  // 删除待办
  deleteTodo: async (id: number) => {
    try {
      set({ loading: true, error: null });
      const { db } = get();
      if (!db) throw new Error('数据库未初始化');

      await db.execute('DELETE FROM todos WHERE id = $1', [id]);
      await get().fetchTodos();
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : '删除待办失败',
        loading: false
      });
    }
  },

  // 更新待办内容
  updateTodo: async (id: number, content: string) => {
    try {
      set({ loading: true, error: null });
      const { db } = get();
      if (!db) throw new Error('数据库未初始化');

      await db.execute(
          'UPDATE todos SET content = $1 WHERE id = $2',
          [content, id]
      );

      await get().fetchTodos();
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : '更新待办内容失败',
        loading: false
      });
    }
  },

  // 新增：清除所有待办事项
  clearAllTodos: async () => {
    try {
      set({ loading: true, error: null });
      const { db, todos } = get();

      // 数据库未初始化则抛出错误
      if (!db) throw new Error('数据库未初始化');
      // 没有待办项则直接结束
      if (todos.length === 0) {
        set({ loading: false });
        return;
      }

      // 执行清除所有记录的SQL
      await db.execute('DELETE FROM todos');
      // 重新拉取数据（此时应为空）
      await get().fetchTodos();
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : '清除所有待办失败',
        loading: false
      });
    }
  }
}));