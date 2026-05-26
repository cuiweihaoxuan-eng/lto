// AI 助手配置管理
// 统一管理 AI 助手的配置，支持持久化到 localStorage

import { AIAssistantConfig } from "../components/AIAssistantConfig";

export interface AIConfig {
  id: string;
  name: string;
  platform: string;
  url: string;
  apiKey: string;
  user: string;
  testUrl: string;
  isEnabled: boolean;
  isVisible: boolean;
  sessionCount: number;
  lastSessionTime: string | null;
}

// 默认配置
const defaultConfigs: AIConfig[] = [
  {
    id: "default-ontology",
    name: "本体查询助手",
    platform: "星辰平台",
    url: "http://localhost/v1",
    apiKey: "app-3V47CAfeck1BBKaTFKF8zp66",
    user: "lto-user",
    testUrl: "http://localhost/v1/app-info",
    isEnabled: true,
    isVisible: true,
    sessionCount: 0,
    lastSessionTime: null,
  },
  {
    id: "default-lto",
    name: "LTO客服助手",
    platform: "星辰平台",
    url: "http://localhost/v1",
    apiKey: "app-Qm3Nun7BNZfKqcKn0PRQVkY7",
    user: "lto-user",
    testUrl: "http://localhost/v1/app-info",
    isEnabled: true,
    isVisible: true,
    sessionCount: 0,
    lastSessionTime: null,
  },
];

// 从 localStorage 读取配置
export function loadAIConfigs(): AIConfig[] {
  try {
    const saved = localStorage.getItem("ai_assistant_configs");
    if (saved) {
      const parsed = JSON.parse(saved);
      // 合并默认配置和保存的配置
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to load AI configs:", e);
  }
  return defaultConfigs;
}

// 保存配置到 localStorage
export function saveAIConfigs(configs: AIConfig[]): void {
  localStorage.setItem("ai_assistant_configs", JSON.stringify(configs));
}

// 获取启用的配置列表
export function getEnabledConfigs(): AIConfig[] {
  return loadAIConfigs().filter(c => c.isEnabled);
}

// 根据 ID 获取配置
export function getConfigById(id: string): AIConfig | undefined {
  return loadAIConfigs().find(c => c.id === id);
}

// 根据名称获取配置（用于默认 Agent 切换）
export function getConfigByName(name: string): AIConfig | undefined {
  return loadAIConfigs().find(c => c.name === name);
}

// 更新会话次数
export function updateSessionCount(configId: string): void {
  const configs = loadAIConfigs();
  const config = configs.find(c => c.id === configId);
  if (config) {
    config.sessionCount++;
    config.lastSessionTime = new Date().toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    saveAIConfigs(configs);
  }
}
