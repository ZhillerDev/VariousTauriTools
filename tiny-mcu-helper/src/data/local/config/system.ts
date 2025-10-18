import {DEFAULT_SYSTEM_CONFIG, SystemConfig} from './types';
import {invoke} from "@tauri-apps/api/core";

/**
 * 从后端 local 获取完整的 system 配置
 */
export async function getSystemConfig(): Promise<SystemConfig> {
  const storedConfig = await invoke<SystemConfig | null>("store_get", {key: "system"});
  // 若 local 中不存在，返回默认配置
  return storedConfig || DEFAULT_SYSTEM_CONFIG;
}

/**
 * 将完整的 system 配置存入后端 local
 * @param config 要存储的配置对象
 */
export async function setSystemConfig(config: SystemConfig): Promise<void> {
  await invoke("store_set", {key: "system", value: config});
}

/**
 * 更新 system 配置中的某个字段（如 darkTheme）
 * @param partialConfig 要更新的字段（部分配置）
 */
export async function updateSystemConfig(partialConfig: Partial<SystemConfig>): Promise<SystemConfig> {
  // 1. 先获取当前配置
  const currentConfig = await getSystemConfig();
  // 2. 合并更新字段（partialConfig 覆盖 currentConfig 中的对应字段）
  const updatedConfig = {...currentConfig, ...partialConfig};
  // 3. 存回 local
  await setSystemConfig(updatedConfig);
  // 4. 返回更新后的完整配置
  return updatedConfig;
}