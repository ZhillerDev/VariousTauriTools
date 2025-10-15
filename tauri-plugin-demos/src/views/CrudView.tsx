import {useEffect, useState} from "react";
import {invoke} from "@tauri-apps/api/core";
import {Alert, Button, Card, Input, Space, Typography} from "tdesign-react";

const {Title, Paragraph, Text} = Typography;

function CrudView() {
  // 状态管理
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [storedValue, setStoredValue] = useState('');
  const [status, setStatus] = useState<{
    text: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>({text: '', type: 'info'});
  const [loading, setLoading] = useState(false);

  // 保存键值对
  const handleSave = async () => {
    if (!key || !value) {
      setStatus({text: '请输入键名和值', type: 'warning'});
      return;
    }

    setLoading(true);
    try {
      await invoke('store_set', {
        key: key,
        value: serdeJsonValue(value)
      });
      setStatus({text: `成功保存: ${key} = ${value}`, type: 'success'});
    } catch (error) {
      setStatus({text: `保存失败: ${error}`, type: 'error'});
    } finally {
      setLoading(false);
    }
  };

  // 获取值
  const handleGet = async () => {
    if (!key) {
      setStatus({text: '请输入要获取的键名', type: 'warning'});
      return;
    }

    setLoading(true);
    try {
      const result = await invoke('store_get', {key: key});
      if (result !== null) {
        setStoredValue(JSON.stringify(result, null, 2));
        setStatus({text: `获取成功: ${key}`, type: 'success'});
      } else {
        setStoredValue('');
        setStatus({text: `未找到键: ${key}`, type: 'info'});
      }
    } catch (error) {
      setStatus({text: `获取失败: ${error}`, type: 'error'});
    } finally {
      setLoading(false);
    }
  };

  // 删除键值对
  const handleDelete = async () => {
    if (!key) {
      setStatus({text: '请输入要删除的键名', type: 'warning'});
      return;
    }

    setLoading(true);
    try {
      await invoke('store_delete', {key: key});
      setStatus({text: `成功删除: ${key}`, type: 'success'});
      setStoredValue('');
      setValue('');
    } catch (error) {
      setStatus({text: `删除失败: ${error}`, type: 'error'});
    } finally {
      setLoading(false);
    }
  };

  // 检查初始化状态
  useEffect(() => {
    const checkInitialization = async () => {
      setLoading(true);
      try {
        const initialized = await invoke('store_get', {key: 'initialized'});
        if (initialized) {
          setStatus({text: 'Store初始化成功，可以开始使用', type: 'success'});
        } else {
          setStatus({text: 'Store初始化失败', type: 'error'});
        }
      } catch (error) {
        setStatus({text: `检查初始化失败: ${error}`, type: 'error'});
      } finally {
        setLoading(false);
      }
    };

    checkInitialization();
  }, []);

  // 辅助函数：将值转换为serde_json可处理的格式
  const serdeJsonValue = (val: string) => {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  };

  return (
      <>
        {/* 主容器：全屏高度，左右分栏 */}
        <div className="h-screen flex p-4 md:p-6 gap-6  box-sizing: border-box">
          {/* 左侧操作区：输入框和按钮 */}
          <div className="w-1/3 flex flex-col space-y-5">

            {/* 键输入 */}
            <div className="relative">
              <Input
                  label="键名"
                  placeholder="请输入键名"
                  value={key}
                  onChange={(e) => setKey(e)}
                  className="w-full"
                  status={!key && status.text.includes('键名') ? 'error' : undefined}
                  disabled={loading}
              />
            </div>

            {/* 值输入 */}
            <div className="relative">
              <Input
                  label="值"
                  placeholder="请输入值（支持JSON格式）"
                  value={value}
                  onChange={(e) => setValue(e)}
                  className="w-full"
                  status={!value && status.text.includes('值') ? 'error' : undefined}
                  disabled={loading}
              />
            </div>

            {/* 操作按钮 */}
            <Space size="medium" className="w-full">
              <div className="flex flex-col gap-3">
                <Button
                    onClick={handleSave}
                    className="h-3"
                    theme="success"
                    loading={loading}
                >
                  保存
                </Button>
                <Button
                    onClick={handleGet}
                    className="h-3"
                    loading={loading}
                >
                  获取
                </Button>
                <Button
                    onClick={handleDelete}
                    className="h-3"
                    theme="danger"
                    loading={loading}
                >
                  删除
                </Button>
              </div>
            </Space>
          </div>

          {/* 右侧结果区：结果展示和通知 */}
          <div className="w-2/3 flex flex-col space-y-4">
            {/* 状态通知 */}
            {status.text && (
                <Alert
                    message={status.text}
                    theme={status.type}
                    className="w-full"
                />
            )}

            {/* 结果展示卡片 */}
            <Card title="当前存储的值" className="flex-1 flex flex-col">
              {storedValue ? (
                  <Text code>{storedValue}</Text>
              ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-400">
                    暂无数据，请执行操作后查看结果
                  </div>
              )}
            </Card>
          </div>
        </div>
      </>
  );
}

export default CrudView;
