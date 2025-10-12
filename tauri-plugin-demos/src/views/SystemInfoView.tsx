// src/pages/SystemInfoView.tsx
import {useEffect, useState} from 'react';
import {invoke} from '@tauri-apps/api/core';

// TDesign 组件 (已移除 Spin)
import {Button, Card, Divider, Progress, Space, Typography} from 'tdesign-react';
import {ApiIcon, DataBaseIcon, LaptopIcon, PoweroffIcon, TextboxIcon} from 'tdesign-icons-react';
import Title from "tdesign-react/es/typography/Title";


const {Text} = Typography;

// 定义 TypeScript 接口
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
        setSystemInfo(info);
      } catch (err: any) {
        console.error('获取系统信息失败:', err);
        setError(err.message || '未知错误');
      } finally {
        setLoading(false);
      }
    };

    fetchSystemInfo();
  }, []);

  // === 渲染逻辑 ===

  // 1. 加载中 (已移除 Spin)
  if (loading) {
    return (
        <div className="flex justify-center items-center min-h-[400px]">
          <Text>正在加载系统信息...</Text>
        </div>
    );
  }

  // 2. 错误状态
  if (error) {
    return (
        <div className="p-4 md:p-6">
          <div className="flex items-center mb-6">
            <Title className="!mb-0">系统详情</Title>
          </div>
          <Space>
            <Button theme="primary" size="small" onClick={() => window.location.reload()}>
              重试
            </Button>
          </Space>
        </div>
    );
  }

  // 3. 成功：systemInfo 一定存在
  const info = systemInfo!;

  return (
      <div className="p-4 md:p-6">
        {/* 顶部标题 */}
        <div className="flex items-center mb-6">
          <Title className="!mb-0">系统详情</Title>
        </div>

        {/* 内容区 - 使用 TDesign 的 Grid 布局 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CPU */}
          <Card
              title={
                <div className="flex items-center">
                  <ApiIcon size={20} className="mr-2 text-blue-500"/>
                  <span>CPU 信息</span>
                </div>
              }
              bordered={true}
          >
            <div className="space-y-2">
              <div>
                <Text strong>处理器:</Text> {info.cpu_brand || "未知"}
              </div>
              <div>
                <Text strong>核心数量:</Text> {info.cpu_count ?? "未知"}
              </div>
              <div className="mt-2">
                <Text strong>CPU使用率:</Text>
              </div>
              <Progress
                  label
                  percentage={Math.min(info.cpu_usage ?? 0, 100)}
                  theme="line"
              />
              <Text className="float-right">{Math.min(info.cpu_usage ?? 0, 100).toFixed(1)}%</Text>
            </div>
          </Card>

          {/* 内存 */}
          <Card
              title={
                <div className="flex items-center">
                  <DataBaseIcon size={20} className="mr-2 text-green-500"/>
                  <span>内存信息</span>
                </div>
              }
              bordered={true}
          >
            <div className="space-y-2">
              <div>
                <Text strong>总内存:</Text> {formatBytes(info.total_memory || 0)}
              </div>
              <div>
                <Text strong>已使用:</Text> {formatBytes(info.used_memory || 0)}
              </div>
              <div>
                <Text strong>可用:</Text> {formatBytes(Math.max(0, (info.total_memory || 0) - (info.used_memory || 0)))}
              </div>
              <div className="mt-2">
                <Text strong>内存使用率:</Text>
              </div>
              <Progress
                  label
                  percentage={info.memory_usage_percentage ?? 0}
              />
              <Text className="float-right">{(info.memory_usage_percentage ?? 0).toFixed(1)}%</Text>
            </div>
          </Card>

          {/* 系统 */}
          <Card
              title={
                <div className="flex items-center">
                  <LaptopIcon size={20} className="mr-2 text-purple-500"/>
                  <span>系统信息</span>
                </div>
              }
              bordered={true}
          >
            <div className="space-y-2">
              <div>
                <Text strong>主机名:</Text> {info.hostname || "未知"}
              </div>
              <div>
                <Text strong>操作系统:</Text> {info.system_name || "未知"} {info.os_version || ""}
              </div>
              <div>
                <Text strong>内核版本:</Text> {info.kernel_version || "未知"}
              </div>
            </div>
          </Card>

          {/* 电池 */}
          <Card
              title={
                <div className="flex items-center">
                  <PoweroffIcon size={20} className="mr-2 text-yellow-500"/>
                  <span>电池信息</span>
                </div>
              }
              bordered={true}
          >
            {info.battery?.has_battery ? (
                <div className="space-y-2">
                  <div>
                    <Text strong>制造商:</Text> {info.battery.vendor || "未知"}
                  </div>
                  <div>
                    <Text strong>型号:</Text> {info.battery.model || "未知"}
                  </div>
                  <div>
                    <Text strong>状态:</Text>
                    {info.battery.state === "Full" ? "已充满" :
                        info.battery.state === "Charging" ? "充电中" :
                            info.battery.state === "Discharging" ? "放电中" : "未知"}
                  </div>
                  <div>
                    <Text strong>循环次数:</Text> {info.battery.cycle_count ?? "N/A"}
                  </div>

                  <div className="mt-2">
                    <Text strong>电池健康度:</Text>
                  </div>
                  <Progress
                      label
                      percentage={Math.min(info.battery.health ?? 0, 100)}
                  />
                  <Text className="float-right">{(info.battery.health ?? 0).toFixed(1)}%</Text>

                  <div className="mt-2">
                    <Text strong>电池电量:</Text>
                  </div>
                  <Progress
                      label
                      percentage={Math.min(info.battery.percentage ?? 0, 100)}
                  />
                  <Text className="float-right">{(info.battery.percentage ?? 0).toFixed(1)}%</Text>
                </div>
            ) : (
                <Text>未检测到电池或无电池信息</Text>
            )}
          </Card>
        </div>

        <Divider className="my-6"/>

        {/* 磁盘 */}
        <Card
            title={
              <div className="flex items-center">
                <TextboxIcon size={20} className="mr-2 text-indigo-500"/>
                <span>磁盘信息</span>
              </div>
            }
            bordered={true}
            className="mt-6"
        >
          <Divider className="my-3"/>
          {info.disks && info.disks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {info.disks.map((disk, index) => (
                    <Card
                        key={index}
                        size="small"
                        bordered={true}
                        className="shadow-sm"
                    >
                      <div className="font-medium mb-2">
                        {disk.name || "未知设备"} ({disk.mount_point || "无挂载点"})
                      </div>
                      <div className="text-sm mb-1">
                        <Text>文件系统:</Text> {disk.file_system || "未知"}
                      </div>
                      <div className="text-sm mb-1">
                        <Text>总空间:</Text> {formatBytes(disk.total_space || 0)}
                      </div>
                      <div className="text-sm mb-1">
                        <Text>可用空间:</Text> {formatBytes(disk.available_space || 0)}
                      </div>
                      <div className="text-sm mb-1">
                        <Text strong>使用率:</Text>
                      </div>
                      <Progress
                          label
                          percentage={disk.usage_percentage ?? 0}
                      />
                      <Text className="float-right text-sm">{(disk.usage_percentage ?? 0).toFixed(1)}%</Text>
                    </Card>
                ))}
              </div>
          ) : (
              <Text>未检测到磁盘信息</Text>
          )}
        </Card>
      </div>
  );
};

export default SystemInfoView;