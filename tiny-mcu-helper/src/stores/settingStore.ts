// stores/settingStore.ts
import {create} from 'zustand';
import {DEFAULT_SYSTEM_CONFIG, SystemConfig} from '@data/local/config/types';
import {getSystemConfig, setSystemConfig, updateSystemConfig} from '@data/local/config/system';

// 定义 store 状态和方法类型
interface SettingState {
  // 配置数据
  config: SystemConfig;
  // 加载状态（用于初始化时的加载提示）
  isLoading: boolean;
  // 初始化：从后端加载配置
  initConfig: () => Promise<void>;
  // 全量更新配置
  setFullConfig: (newConfig: SystemConfig) => Promise<void>;
  // 部分更新配置（如单独更新 darkTheme 或 hideHeaderBar）
  updatePartialConfig: (partial: Partial<SystemConfig>) => Promise<void>;
}

// 创建 store
export const useSettingStore = create<SettingState>((set, get) => ({
  // 初始状态：使用默认配置，加载状态为 true
  config: DEFAULT_SYSTEM_CONFIG,
  isLoading: true,

  // 初始化配置：从后端获取并同步到 store
  initConfig: async () => {
    try {
      const storedConfig = await getSystemConfig();
      // 更新 store 中的配置，并标记加载完成
      set({
        config: storedConfig,
        isLoading: false
      });
      // 初始化时同步主题到 DOM（如果需要）
      document.documentElement.setAttribute(
          'theme-mode',
          storedConfig.darkTheme ? 'dark' : 'light'
      );
    } catch (error) {
      console.error('Failed to load system config:', error);
      // 加载失败仍使用默认配置，并标记加载完成
      set({isLoading: false});
    }
  },

  // 全量更新配置（覆盖整个配置对象）
  setFullConfig: async (newConfig: SystemConfig) => {
    try {
      // 保存到后端
      await setSystemConfig(newConfig);
      // 更新 store
      set({config: newConfig});
      // 同步主题到 DOM（如果主题有变化）
      document.documentElement.setAttribute(
          'theme-mode',
          newConfig.darkTheme ? 'dark' : 'light'
      );
    } catch (error) {
      console.error('Failed to set full config:', error);
    }
  },

  // 部分更新配置（只更新需要修改的字段）
  updatePartialConfig: async (partial: Partial<SystemConfig>) => {
    try {
      // 调用后端更新接口，获取更新后的完整配置
      const updatedConfig = await updateSystemConfig(partial);
      // 更新 store
      set({config: updatedConfig});
      // 如果更新了主题，同步到 DOM
      if ('darkTheme' in partial) {
        document.documentElement.setAttribute(
            'theme-mode',
            updatedConfig.darkTheme ? 'dark' : 'light'
        );
      }
    } catch (error) {
      console.error('Failed to update partial config:', error);
    }
  }
}));