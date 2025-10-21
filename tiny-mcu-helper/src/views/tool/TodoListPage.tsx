import React, {useEffect, useRef, useState} from 'react';
import {Todo, useTodoDbStore} from "@stores/todoDbStore.ts";
import {Button, Checkbox, Dialog, Input, Popconfirm} from 'tdesign-react';
import {message} from "@tauri-apps/plugin-dialog";
import {DeleteIcon, PlusIcon} from "tdesign-icons-react";

function TodoListPage() {
  const {
    initDb,
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearAllTodos
  } = useTodoDbStore();

  const [newTodo, setNewTodo] = useState('');
  const [editDialog, setEditDialog] = useState({visible: false, id: 0, content: ''});
  const inputRef = useRef<HTMLInputElement>(null);

  // 初始化数据库
  useEffect(() => {
    initDb().then(r => r);
  }, [initDb]);

  // 显示错误信息
  useEffect(() => {
    if (error) {
      message(error);
    }
  }, [error]);

  // 添加新待办
  const handleAddTodo = async () => {
    if (!newTodo.trim()) {
      message('请输入待办内容');
      return;
    }

    await addTodo(newTodo.trim());
    setNewTodo('');
    inputRef.current?.focus();
  };

  // 处理编辑
  const handleEdit = (todo: Todo) => {
    setEditDialog({
      visible: true,
      id: todo.id,
      content: todo.content
    });
  };

  // 保存编辑
  const handleSaveEdit = async () => {
    if (!editDialog.content.trim()) {
      message('待办内容不能为空');
      return;
    }

    await updateTodo(editDialog.id, editDialog.content.trim());
    setEditDialog(prev => ({...prev, visible: false}));
  };

  // 清除所有待办
  const handleClearAll = async () => {
    if (todos.length === 0) {
      message('没有待办事项可清除');
      return;
    }
    if (confirm('确定要清除所有待办事项吗？')) {
      await clearAllTodos()
    }
  };

  return (
      <div className="h-full flex flex-col p-4 max-w-4xl mx-auto">
        {/* 顶部输入区域 - 左侧输入框，右侧按钮 */}
        <div className="flex gap-3 mb-4">
          <Input
              value={newTodo}
              onChange={(e) => setNewTodo(e)}
              placeholder="请输入新的待办事项..."
              className="flex-1"
          />
          <Button
              onClick={handleAddTodo}

          >
            <PlusIcon className="w-5 h-5"/>
          </Button>
          <Popconfirm
              content="删除全部待办项？"
              onConfirm={() => clearAllTodos()}
          >
            <Button

            >
              <DeleteIcon/>
            </Button>
          </Popconfirm>
        </div>

        {/* 待办列表 - 使用无序列表展示 */}
        <div className="flex-1">
          {todos.length === 0 ? (
              <div className="text-center py-6 text-gray-500">暂无待办事项</div>
          ) : (
              <div className="space-y-3">
                {todos.map((todo) => (
                    <div
                        key={todo.id}
                        className="flex items-center gap-3 rounded-lg  transition-colors"
                    >
                      {/* 状态复选框 */}
                      <Checkbox
                          checked={todo.completed}
                          onChange={(e) => toggleTodo(todo.id, e)}
                          className="w-5 h-5"
                      />

                      {/* 内容 */}
                      <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                  {todo.content}
                </span>

                      {/* 创建时间 */}
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                  {new Date(todo.createdAt).toLocaleString()}
                </span>

                      {/* 操作按钮 */}
                      <div className="flex gap-2">
                        <Button
                            onClick={() => handleEdit(todo)}
                            variant="text"
                        >
                          编辑
                        </Button>
                        <Popconfirm
                            content="确定要删除吗？"
                            onConfirm={() => deleteTodo(todo.id)}
                        >
                          <Button
                              variant="text"
                          >
                            删除
                          </Button>
                        </Popconfirm>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>

        {/* 编辑对话框 */}
        <Dialog
            header="编辑待办"
            visible={editDialog.visible}
            onClose={() => setEditDialog(prev => ({...prev, visible: false}))}
            confirmOnEnter
            onCancel={
              () => setEditDialog(prev => ({...prev, visible: false}))
            }
            onConfirm={handleSaveEdit}
        >
          <div className="py-4">
            <Input
                className="w-full"
                value={editDialog.content}
                onChange={(e) => setEditDialog(prev => ({...prev, content: e}))}
                placeholder="请输入待办内容..."

            />
          </div>
        </Dialog>
      </div>
  );
}

export default TodoListPage;