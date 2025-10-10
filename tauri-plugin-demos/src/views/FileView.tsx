import {useState} from 'react';
import {Button, Card, Col, Flex, Form, Input, message, Row, Space, Tooltip, Typography} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import {FileOutlined, SaveOutlined, UndoOutlined} from '@ant-design/icons';
import {appDataDir, BaseDirectory} from '@tauri-apps/api/path';
import {exists, readTextFile, writeFile} from '@tauri-apps/plugin-fs';

const {Title} = Typography;

export default function JsonFileManager() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('config.json');
  const [initialContent, setInitialContent] = useState('{\n  "app": "tauri",\n  "env": "dev"\n}');

  // 生成应用数据目录中的完整文件路径
  const getFilePath = async (name: string) => {
    const appDir = await appDataDir();
    return `${appDir}${name}`;
  };

  // 处理文件保存
  const handleSave = async (values: any) => {
    const content = values.content || '{}';

    // 验证 JSON 格式
    try {
      JSON.parse(content);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      message.error('JSON 格式不正确，请检查您的内容');
      return;
    }

    try {
      setLoading(true);
      const filePath = await getFilePath(fileName);

      // 确保目录存在
      const appDir = await appDataDir();
      await createDir(appDir, {dir: BaseDirectory.AppData, recursive: true});

      // 写入文件
      await writeFile({path: filePath, contents: content});
      setInitialContent(content);
      message.success('文件已成功保存！');
    } catch (error: any) {
      console.error('保存文件失败:', error);
      message.error(`保存失败：${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 处理文件读取
  const handleLoad = async () => {
    try {
      setLoading(true);
      const filePath = await getFilePath(fileName);

      // 检查文件是否存在
      const fileExists = await exists(filePath);
      if (!fileExists) {
        message.warning('文件不存在，将使用默认内容');
        form.setFieldsValue({content: initialContent});
        return;
      }

      // 读取文件
      const content = await readTextFile(filePath);
      form.setFieldsValue({content});
      setInitialContent(content);
      message.success('文件已成功加载！');
    } catch (error: any) {
      console.error('读取文件失败:', error);
      message.error(`加载失败：${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 重置为初始内容
  const handleReset = () => {
    form.resetFields();
  };

  return (
      <Flex vertical gap="middle" className="p-6 max-w-6xl mx-auto">
        <Card className="rounded-2xl p-6 shadow-lg ">
          <Title level={4} className="text-center mb-6 font-bold text-gray-800">
            JSON 文件管理器
          </Title>

          <Row gutter={16} className="mb-4">
            <Col span={16}>
              <Form.Item
                  name="fileName"
                  initialValue={fileName}
                  rules={[{required: true, message: '请输入文件名'}]}
              >
                <Input
                    prefix={<FileOutlined/>}
                    placeholder="文件名"
                    onChange={(e) => setFileName(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Button
                  type="primary"
                  icon={<SaveOutlined/>}
                  htmlType="submit"
                  loading={loading}
                  block
                  onClick={handleSave}
              >
                保存文件
              </Button>
            </Col>
          </Row>

          <Form layout="vertical" form={form}>
            <Form.Item
                name="content"
                label="JSON 内容"
                initialValue={initialContent}
                rules={[{required: true, message: '请输入或加载 JSON 内容'}]}
            >
              <Space direction="vertical" className="w-full">
                <TextArea
                    rows={12}
                    className="font-mono rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
                    placeholder="在此输入 JSON 内容..."
                />
                <Tooltip title="重置为初始内容">
                  <Button
                      type="text"
                      icon={<UndoOutlined/>}
                      onClick={handleReset}
                      className="text-gray-500 hover:text-primary transition-colors"
                  >
                    重置内容
                  </Button>
                </Tooltip>
              </Space>
            </Form.Item>

            <Form.Item className="mt-4">
              <Button
                  type="secondary"
                  icon={<FileOutlined/>}
                  onClick={handleLoad}
                  className="w-full hover:bg-gray-100 transition-colors"
              >
                从应用数据目录加载文件
              </Button>
            </Form.Item>
          </Form>

          <p className="mt-4 text-sm text-gray-500 text-center">
            文件将保存在: <code className=" px-2 py-1 rounded text-gray-700">%APPDATA%/应用名/{fileName}</code>
          </p>
        </Card>
      </Flex>

  );
}