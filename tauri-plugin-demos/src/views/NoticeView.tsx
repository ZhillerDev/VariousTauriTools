import {ask, confirm, message, open, save} from '@tauri-apps/plugin-dialog';
import {ActionCard, CardItem} from "../components/CardComps.tsx";

export default function NoticeView() {
  // 对话框操作集合 - 转换为卡片项
  const dialogCards: CardItem[] = [
    {
      label: 'error提示',
      description: '显示错误类型的提示消息',
      color: '#ff4d4f',
      action: () => message('发生错误', {title: 'Tauri', kind: 'error'}),
    },
    {
      label: 'info提示',
      description: '显示信息类型的提示消息',
      color: '#1890ff',
      action: () => message('这是一个提示', {title: 'Tauri', kind: 'info'}),
    },
    {
      label: 'warn提示',
      description: '显示警告类型的提示消息',
      color: '#faad14',
      action: () => message('警告！', {title: 'Tauri', kind: 'warning'}),
    },
    {
      label: '使用确认对话框',
      description: '打开确认操作的对话框',
      color: '#faad14',
      action: async () => {
        const confirmed = await confirm('是否继续安装？', {title: 'Tauri', kind: 'warning'});
        if (confirmed) console.log('用户选择继续');
      },
    },
    {
      label: '使用询问对话框',
      description: '打开需要用户选择的询问框',
      color: '#722ed1',
      action: async () => {
        const answer = await ask('是否接受条款？', {title: 'Tauri', kind: 'warning'});
        console.log('用户选择:', answer ? '接受' : '拒绝');
      },
    },
    {
      label: '多文件选择',
      description: '选择多个图片文件',
      color: '#36cbcb',
      action: async () => {
        const files = await open({
          multiple: true,
          filters: [{name: 'Images', extensions: ['png', 'jpg']}]
        });
        if (files) console.log('选中文件列表:', files);
      },
    },
    {
      label: '保存对话框',
      description: '选择文件保存路径',
      color: '#52c41a',
      action: async () => {
        const path = await save({
          defaultPath: 'backup.zip',
          filters: [{name: 'Archive', extensions: ['zip', 'rar']}]
        });
        if (path) console.log('保存路径:', path);
      },
    }
  ];

  const notificationCards: CardItem[] = [
    {
      label: '通知',
      description: '创建一个通知',
      color: '#52c41a',
      action: () => {
        // 创建一个通知
        const notification = new Notification('Tauri', {
          body: '这是一个通知'
        });
      }
    },
    {
      label: '反馈通知',
      description: '点击通知后会有反馈',
      color: '#52c41a',
      action: () => {
        // 创建一个通知
        const notification = new Notification('Tauri', {
          body: '这是一个通知'
        });
        // 监听通知点击事件
        notification.addEventListener('click', () => {
          message('通知被点击', {title: 'Tauri'})
        });
      }
    },
    {
      label: '通知图标',
      description: '自定义通知图标',
      color: '#52c41a',
      action: () => {
        // 创建一个通知
        const notification = new Notification('Tauri', {
          body: '这是一个通知',
          icon: 'https://tauri.app/img/tauri.png'
        });
        // 监听通知点击事件
        notification.addEventListener('click', () => {
          message('通知被点击', {title: 'Tauri'})
        })
      }
    }
  ]

  return (
      <div className="p-6 w-full mx-auto">
        {/* 外层大卡片容器 */}
        <div style={{
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
        }}>
          <h1 style={{
            margin: '0 0 20px 0',
            fontSize: '18px',
            fontWeight: 600
          }}>
            对话框测试
          </h1>
          {/* 卡片网格布局 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {dialogCards.map((item, index) => (
                <ActionCard key={index} item={item}/>
            ))}
          </div>

          <h1 style={{
            margin: '40px 0 20px 0',
            fontSize: '18px',
            fontWeight: 600
          }}>
            通知测试
          </h1>
          {/* 卡片网格布局 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {notificationCards.map((item, index) => (
                <ActionCard key={index} item={item}/>
            ))}
          </div>
        </div>
      </div>
  );
}
