// SystemInfoPage.tsx
import {useEffect, useState} from 'react';
import {invoke} from '@tauri-apps/api/core';

// Ant Design
import {Alert, Button, Card, Divider, Progress, Spin, Typography} from 'antd';
import {ApiOutlined, DatabaseOutlined, LaptopOutlined, PartitionOutlined, PoweroffOutlined} from '@ant-design/icons';

const {Title, Text, Paragraph} = Typography;

// 定义 TypeScript 接口（推荐）
interface BatteryInfo {
  has_battery: boolean;
  vendor?: string;
  model?: string;
  state: string;
  cycle_count: number;
  health: number;
  percentage: number;
}

interface DiskInfo {
  name: string;
  mount_point: string;
  file_system?: string;
  total_space: number;
  available_space: number;
  usage_percentage: number;
}

interface SystemInfo {
  cpu_brand?: string;
  cpu_count?: number;
  cpu_usage: number;
  total_memory: number;
  used_memory: number;
  memory_usage_percentage: number;
  hostname?: string;
  system_name?: string;
  os_version?: string;
  kernel_version?: string;
  battery: BatteryInfo;
  disks: DiskInfo[];
}

const SystemInfoView = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 格式化字节数
  const formatBytes = (bytes: number, decimals = 2): string => {
    if (!bytes || bytes <= 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // 挂载时自动加载
  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const info = await invoke<SystemInfo>('get_system_info');
        console.log('简化系统信息:', info);
        setSystemInfo(info);
      } catch (err: any) {
        console.error('获取系统信息失败:', err);
        setError(err.message || '未知错误');
      } finally {
        setLoading(false);
      }
    };

    fetchSystemInfo().then(_ => {
    });
  }, []);

  // === 渲染逻辑 ===

  // 1. 加载中
  if (loading) {
    return (
        <div className="flex justify-center items-center min-h-[400px]">
          <Spin size="large" tip="正在加载系统信息..."/>
        </div>
    );
  }

  // 2. 错误状态
  if (error) {
    return (
        <div className="p-4 md:p-6">
          <div className="flex items-center mb-6">
            <Title level={2} className="!mb-0">系统详情</Title>
          </div>
          <Alert
              message="加载失败"
              description={error}
              type="error"
              showIcon
              action={
                <Button
                    size="small"
                    type="primary"
                    onClick={() => window.location.reload()}
                >
                  重试
                </Button>
              }
          />
        </div>
    );
  }

  // 3. 成功：systemInfo 一定存在（因为 error 和 loading 已排除）
  const info = systemInfo!; // 非空断言，安全

  return (
      <div className="p-4 md:p-6">
        {/* 顶部导航 */}
        <div className="flex items-center mb-6">
          <Title level={2} className="!mb-0">系统详情</Title>
        </div>

        {/* 内容区 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CPU */}
          <Card
              title={
                <div className="flex items-center">
                  <ApiOutlined className="text-blue-500 mr-2"/>
                  <span>CPU 信息</span>
                </div>
              }
              className="shadow-sm"
          >

            <Paragraph className="mb-2">
              <Text strong>处理器:</Text> {info.cpu_brand || "未知"}
            </Paragraph>
            <Paragraph className="mb-2">
              <Text strong>核心数量:</Text> {info.cpu_count ?? "未知"}
            </Paragraph>
            <Paragraph className="mb-1">
              <Text strong>CPU使用率:</Text>
            </Paragraph>
            <Progress
                percent={Math.min(info.cpu_usage ?? 0, 100)}
                size="small"
                showInfo={false}
                className="mb-1"
            />
            <Text className="float-right">{Math.min(info.cpu_usage ?? 0, 100).toFixed(1)}%</Text>
            <div className="clear-both"></div>
          </Card>

          {/* 内存 */}
          <Card
              title={
                <div className="flex items-center">
                  <DatabaseOutlined className="text-green-500 mr-2"/>
                  <span>内存信息</span>
                </div>
              }
              className="shadow-sm"
          >

            <Paragraph className="mb-2">
              <Text strong>总内存:</Text> {formatBytes(info.total_memory || 0)}
            </Paragraph>
            <Paragraph className="mb-2">
              <Text strong>已使用:</Text> {formatBytes(info.used_memory || 0)}
            </Paragraph>
            <Paragraph className="mb-2">
              <Text strong>可用:</Text> {formatBytes(Math.max(0, (info.total_memory || 0) - (info.used_memory || 0)))}
            </Paragraph>
            <Paragraph className="mb-1">
              <Text strong>内存使用率:</Text>
            </Paragraph>
            <Progress
                percent={info.memory_usage_percentage ?? 0}
                size="small"
                showInfo={false}
                className="mb-1"
            />
            <Text className="float-right">{(info.memory_usage_percentage ?? 0).toFixed(1)}%</Text>
            <div className="clear-both"></div>
          </Card>


          {/* 系统 */}
          <Card
              title={
                <div className="flex items-center">
                  <LaptopOutlined className="text-purple-500 mr-2"/>
                  <span>系统信息</span>
                </div>
              }
              className="shadow-sm"
          >

            <Paragraph className="mb-2">
              <Text strong>主机名:</Text> {info.hostname || "未知"}
            </Paragraph>
            <Paragraph className="mb-2">
              <Text strong>操作系统:</Text> {info.system_name || "未知"} {info.os_version || ""}
            </Paragraph>
            <Paragraph className="mb-2">
              <Text strong>内核版本:</Text> {info.kernel_version || "未知"}
            </Paragraph>
          </Card>

          {/* 电池 */}
          <Card
              title={
                <div className="flex items-center">
                  <PoweroffOutlined className="text-yellow-500 mr-2"/>
                  <span>电池信息</span>
                </div>
              }
              className="shadow-sm"
          >

            {info.battery?.has_battery ? (
                <>
                  <Paragraph className="mb-2">
                    <Text strong>制造商:</Text> {info.battery.vendor || "未知"}
                  </Paragraph>
                  <Paragraph className="mb-2">
                    <Text strong>型号:</Text> {info.battery.model || "未知"}
                  </Paragraph>
                  <Paragraph className="mb-2">
                    <Text strong>状态:</Text>{' '}
                    {info.battery.state === "Full"
                        ? "已充满"
                        : info.battery.state === "Charging"
                            ? "充电中"
                            : info.battery.state === "Discharging"
                                ? "放电中"
                                : info.battery.state || "未知"}
                  </Paragraph>
                  <Paragraph className="mb-2">
                    <Text strong>循环次数:</Text> {info.battery.cycle_count ?? "N/A"}
                  </Paragraph>

                  <Paragraph className="mb-1">
                    <Text strong>电池健康度:</Text>
                  </Paragraph>
                  <Progress
                      percent={Math.min(info.battery.health ?? 0, 100)}
                      size="small"
                      showInfo={false}
                      status={
                        (info.battery.health ?? 0) > 80
                            ? "success"
                            : (info.battery.health ?? 0) > 50
                                ? "normal"
                                : "exception"
                      }
                      className="mb-1"
                  />
                  <Text className="float-right">{(info.battery.health ?? 0).toFixed(1)}%</Text>
                  <div className="clear-both"></div>

                  <Paragraph className="mt-3 mb-1">
                    <Text strong>电池电量:</Text>
                  </Paragraph>
                  <Progress
                      percent={Math.min(info.battery.percentage ?? 0, 100)}
                      size="small"
                      showInfo={false}
                      status={
                        (info.battery.percentage ?? 0) > 60
                            ? "success"
                            : (info.battery.percentage ?? 0) > 20
                                ? "normal"
                                : "exception"
                      }
                      className="mb-1"
                  />
                  <Text className="float-right">{(info.battery.percentage ?? 0).toFixed(1)}%</Text>
                  <div className="clear-both"></div>
                </>
            ) : (
                <Text type="secondary">未检测到电池或无电池信息</Text>
            )}
          </Card>
        </div>

        <Divider className="my-3"/>

        {/* 磁盘 */}
        <Card
            title={
              <div className="flex items-center">
                <PartitionOutlined className="text-indigo-500 mr-2"/>
                <span>磁盘信息</span>
              </div>
            }
            className="shadow-sm mt-6"
        >
          <Divider className="my-3"/>
          {info.disks && info.disks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {info.disks.map((disk, index) => (
                    <Card key={index} size="small" className="shadow-sm">
                      <Paragraph className="font-medium mb-2">
                        {disk.name || "未知设备"} ({disk.mount_point || "无挂载点"})
                      </Paragraph>
                      <Paragraph className="text-sm mb-1">
                        <Text type="secondary">文件系统:</Text> {disk.file_system || "未知"}
                      </Paragraph>
                      <Paragraph className="text-sm mb-1">
                        <Text type="secondary">总空间:</Text> {formatBytes(disk.total_space || 0)}
                      </Paragraph>
                      <Paragraph className="text-sm mb-1">
                        <Text type="secondary">可用空间:</Text> {formatBytes(disk.available_space || 0)}
                      </Paragraph>
                      <Paragraph className="text-sm mb-1">
                        <Text type="secondary">使用率:</Text>
                      </Paragraph>
                      <Progress
                          percent={disk.usage_percentage ?? 0}
                          size="small"
                          showInfo={false}
                          status={
                            (disk.usage_percentage ?? 0) > 90
                                ? "exception"
                                : (disk.usage_percentage ?? 0) > 70
                                    ? "normal"
                                    : "success"
                          }
                          className="mb-1"
                      />
                      <Text className="float-right text-sm">{(disk.usage_percentage ?? 0).toFixed(1)}%</Text>
                      <div className="clear-both"></div>
                    </Card>
                ))}
              </div>
          ) : (
              <Text type="secondary">未检测到磁盘信息</Text>
          )}
        </Card>
      </div>
  );
};

export default SystemInfoView;