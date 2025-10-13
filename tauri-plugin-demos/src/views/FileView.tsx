import {useState} from "react";
import {Button, Card, Input, Message, Space} from "tdesign-react";
import Title from "tdesign-react/es/typography/Title";
import Paragraph from "tdesign-react/es/typography/Paragraph";
import {openPath} from "@tauri-apps/plugin-opener";

function FileView() {
  // 状态管理
  const [appPath, setAppPath] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({
    show: false,
    content: '',
    type: 'info'
  });

  // 显示消息提示
  const showMessage = (content, type = 'info') => {
    setMessage({show: true, content, type});
    setTimeout(() => setMessage({...message, show: false}), 3000);
  };

  // 处理打开应用
  const handleOpenApp = async () => {
    if (!appPath.trim()) {
      showMessage('请输入应用路径', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      // 调用Tauri后端命令
      await openPath(appPath)
      showMessage('应用已成功打开', 'success');
    } catch (error) {
      showMessage(`错误: ${error}`, 'error');
      console.error('打开应用失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div
          className="w-screen h-screen bg-gradient-to-br flex items-center justify-center p-4">
        <Card
            className="w-full max-w-md shadow-lg border-0 rounded-xl overflow-hidden transform transition-all hover:shadow-xl">
          <div className="p-6">
            <Title className="text-center mb-6 ">
              应用打开器
            </Title>

            <Paragraph className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
              输入应用程序的完整路径，点击打开按钮启动应用
            </Paragraph>

            <Space direction="vertical" size="large" className="w-full">
              <Input
                  value={appPath}
                  onChange={(e) => setAppPath(e)}
                  placeholder="例如: C:\Program Files\App\app.exe 或 /Applications/App.app"
                  className="w-full"
              />

              <Button
                  onClick={handleOpenApp}
                  loading={isLoading}
                  size="large"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                打开应用
              </Button>
            </Space>
          </div>
        </Card>

        {/* 消息提示 */}
        {message.show && (
            <Message
                content={message.content}
                className="fixed top-4 right-4"
            />
        )}
      </div>
  );
}

export default FileView;
