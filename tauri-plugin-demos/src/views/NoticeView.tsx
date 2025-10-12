import {Button, Space} from 'tdesign-react';
import {ask, confirm, message, open, save} from '@tauri-apps/plugin-dialog';

export default function NoticeView() {
  // 对话框操作集合
  const dialogActions = [
    {
      label: 'error提示',
      action: () => message('发生错误', {title: 'Tauri', kind: 'error'})
    },
    {
      label: 'info提示',
      action: () => message('这是一个提示', {title: 'Tauri', kind: 'info'})
    },
    {
      label: 'warn提示',
      action: () => message('警告！', {title: 'Tauri', kind: 'warning'})
    },
    {
      label: '使用确认对话框',
      action: async () => {
        const confirmed = await confirm('是否继续安装？', {title: 'Tauri', kind: 'warning'});
        if (confirmed) console.log('用户选择继续');
      }
    },
    {
      label: '使用询问对话框（ask）',
      action: async () => {
        const answer = await ask('是否接受条款？', {title: 'Tauri', kind: 'warning'});
        console.log('用户选择:', answer ? '接受' : '拒绝');
      }
    },
    {
      label: '多文件选择',
      action: async () => {
        const files = await open({
          multiple: true,
          filters: [{name: 'Images', extensions: ['png', 'jpg']}]
        });
        if (files) console.log('选中文件列表:', files);
      }
    },
    {
      label: '保存对话框',
      action: async () => {
        const path = await save({
          defaultPath: 'backup.zip',
          filters: [{name: 'Archive', extensions: ['zip', 'rar']}]
        });
        if (path) console.log('保存路径:', path);
      }
    }
  ];

  return (
      <div className="p-4">
        {/* 使用TDesign的Space组件替代Ant Design的Flex，设置垂直排列和间距 */}
        <Space direction="vertical" size="lg" style={{width: '100%'}}>
          {dialogActions.map((item, index) => (
              <Button
                  key={index}
                  theme={index === 0 ? 'danger' : 'primary'} // TDesign使用theme属性区分按钮类型
                  block
                  onClick={item.action}
                  style={{
                    height: 48,
                    fontSize: 16,
                    fontWeight: index === 3 ? 600 : 500
                  }}
              >
                {item.label}
              </Button>
          ))}
        </Space>
      </div>
  );
}
