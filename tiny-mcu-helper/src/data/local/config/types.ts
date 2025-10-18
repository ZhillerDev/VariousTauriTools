// 定义 system 配置的接口，集中管理类型
export interface SystemConfig {
  version: string;
  initialized: boolean;
  darkTheme: boolean;
  hideHeaderBar: boolean;
  expandSideBar: boolean;
}

// 定义默认配置（初始化时使用，与后端保持一致）
export const DEFAULT_SYSTEM_CONFIG: SystemConfig = {
  version: "1.0.0",
  initialized: true,
  darkTheme: true,
  hideHeaderBar: true,
  expandSideBar: false
};