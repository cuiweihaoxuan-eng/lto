import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Power, TestTube, Eye, EyeOff, X, Check } from "lucide-react";

// AI 助手配置接口
export interface AIAssistantConfig {
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

// 默认配置列表
const defaultConfigs: AIAssistantConfig[] = [
  {
    id: "1",
    name: "本体查询助手",
    platform: "星辰平台",
    url: "http://134.108.81.50:8012/xcAgent/v1",
    apiKey: "app-QRHBYTLeysLnUw1VSwzdwAOj",
    user: "lto-user",
    testUrl: "http://134.108.81.50:8012/xcAgent/v1/app-info",
    isEnabled: true,
    isVisible: true,
    sessionCount: 0,
    lastSessionTime: null,
  },
  {
    id: "2",
    name: "LTO客服助手",
    platform: "星辰平台",
    url: "http://134.108.81.50:8012/xcAgent/v1",
    apiKey: "app-QRHBYTLeysLnUw1VSwzdwAOj",
    user: "lto-user",
    testUrl: "http://134.108.81.50:8012/xcAgent/v1/app-info",
    isEnabled: true,
    isVisible: true,
    sessionCount: 0,
    lastSessionTime: null,
  },
];

// 从 localStorage 读取配置
function loadConfigs(): AIAssistantConfig[] {
  try {
    const saved = localStorage.getItem("ai_assistant_configs");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to load AI configs:", e);
  }
  return defaultConfigs;
}

// 保存配置到 localStorage
function saveConfigs(configs: AIAssistantConfig[]) {
  localStorage.setItem("ai_assistant_configs", JSON.stringify(configs));
}

export function AIAssistantConfig() {
  const [configs, setConfigs] = useState<AIAssistantConfig[]>(loadConfigs);
  const [editingConfig, setEditingConfig] = useState<AIAssistantConfig | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTesting, setIsTesting] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; success: boolean; message: string } | null>(null);

  // 保存到 localStorage
  useEffect(() => {
    saveConfigs(configs);
  }, [configs]);

  // 新增配置
  const handleAdd = () => {
    setEditingConfig({
      id: "",
      name: "",
      platform: "Dify",
      url: "http://localhost/v1",
      apiKey: "",
      user: "",
      testUrl: "",
      isEnabled: true,
      isVisible: true,
      sessionCount: 0,
      lastSessionTime: null,
    });
    setIsModalOpen(true);
  };

  // 编辑配置
  const handleEdit = (config: AIAssistantConfig) => {
    setEditingConfig({ ...config });
    setIsModalOpen(true);
  };

  // 保存配置
  const handleSave = () => {
    if (!editingConfig) return;

    // 自动生成测试URL和用户标识
    const autoTestUrl = `${editingConfig.url}/app-info`;
    const autoUser = localStorage.getItem('current_user') || 'lto-user';

    const configToSave = {
      ...editingConfig,
      testUrl: autoTestUrl,
      user: autoUser,
    };

    if (editingConfig.id) {
      // 更新
      setConfigs(prev => prev.map(c => c.id === editingConfig.id ? configToSave : c));
    } else {
      // 新增
      const newConfig = {
        ...configToSave,
        id: Date.now().toString(),
        sessionCount: 0,
        lastSessionTime: null,
      };
      setConfigs(prev => [...prev, newConfig]);
    }
    setIsModalOpen(false);
    setEditingConfig(null);
  };

  // 删除配置
  const handleDelete = (id: string) => {
    if (confirm("确定要删除这个配置吗？")) {
      setConfigs(prev => prev.filter(c => c.id !== id));
    }
  };

  // 切换启用状态
  const handleToggleEnabled = (id: string) => {
    setConfigs(prev => prev.map(c =>
      c.id === id ? { ...c, isEnabled: !c.isEnabled } : c
    ));
  };

  // 切换显示状态
  const handleToggleVisible = (id: string) => {
    setConfigs(prev => prev.map(c =>
      c.id === id ? { ...c, isVisible: !c.isVisible } : c
    ));
  };

  // 测试连接
  const handleTest = async (config: AIAssistantConfig) => {
    setIsTesting(config.id);
    setTestResult(null);

    try {
      const response = await fetch(config.testUrl || `${config.url}/app-info`, {
        headers: {
          "Authorization": `Bearer ${config.apiKey}`,
        },
      });

      if (response.ok) {
        setTestResult({ id: config.id, success: true, message: "连接成功！" });
      } else {
        setTestResult({ id: config.id, success: false, message: `连接失败: ${response.status}` });
      }
    } catch (error) {
      setTestResult({ id: config.id, success: false, message: `连接失败: ${error}` });
    } finally {
      setIsTesting(null);
    }
  };

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">AI助手配置</h1>
          <p className="text-sm text-gray-500 mt-1">管理 AI 助手的数据来源和配置信息</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          新增配置
        </button>
      </div>

      {/* 配置表格 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">名称</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">平台</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">API地址</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">API Key</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">会话次数</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">最后会话</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {configs.map((config) => (
              <tr key={config.id} className={!config.isEnabled ? "bg-gray-50 opacity-60" : ""}>
                {/* 状态开关 */}
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleEnabled(config.id)}
                    className={`p-1.5 rounded-full transition-colors ${
                      config.isEnabled ? "bg-green-100 text-green-600 hover:bg-green-200" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    }`}
                    title={config.isEnabled ? "已启用" : "已禁用"}
                  >
                    <Power className="w-4 h-4" />
                  </button>
                </td>
                {/* 名称 */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">{config.name}</span>
                    {config.isVisible ? (
                      <Eye className="w-3.5 h-3.5 text-green-500" title="在AI助手中显示" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-gray-400" title="不在AI助手中显示" />
                    )}
                  </div>
                </td>
                {/* 平台 */}
                <td className="px-4 py-3 text-sm text-gray-600">{config.platform}</td>
                {/* API地址 */}
                <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-[150px]" title={config.url}>
                  {config.url}
                </td>
                {/* API Key */}
                <td className="px-4 py-3 text-sm text-gray-600">
                  <span className="font-mono text-xs">
                    {config.apiKey.length > 8 ? config.apiKey.slice(0, 8) + "..." : config.apiKey}
                  </span>
                </td>
                {/* 会话次数 */}
                <td className="px-4 py-3 text-sm text-gray-600">{config.sessionCount}</td>
                {/* 最后会话 */}
                <td className="px-4 py-3 text-sm text-gray-500">
                  {config.lastSessionTime || "-"}
                </td>
                {/* 操作 */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => handleTest(config)}
                      disabled={isTesting === config.id || !config.isEnabled}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
                      title="测试连接"
                    >
                      <TestTube className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleVisible(config.id)}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title={config.isVisible ? "取消在AI助手中显示" : "在AI助手中显示"}
                    >
                      {config.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleEdit(config)}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="编辑"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(config.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {configs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            暂无配置，点击"新增配置"添加
          </div>
        )}
      </div>

      {/* 测试结果提示 */}
      {testResult && (
        <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 ${
          testResult.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {testResult.success ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          <span>{testResult.message}</span>
          <button onClick={() => setTestResult(null)} className="ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 编辑弹窗 */}
      {isModalOpen && editingConfig && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
            {/* 弹窗标题 */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingConfig.id ? "编辑配置" : "新增配置"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 弹窗内容 */}
            <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* 名称 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingConfig.name}
                  onChange={(e) => setEditingConfig({ ...editingConfig, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="例如：本体查询助手"
                />
              </div>

              {/* 平台 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  平台
                </label>
                <select
                  value={editingConfig.platform}
                  onChange={(e) => setEditingConfig({ ...editingConfig, platform: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="星辰平台">星辰平台</option>
                  <option value="dify">dify</option>
                  <option value="星智平台">星智平台</option>
                </select>
              </div>

              {/* API地址 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API地址 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingConfig.url}
                  onChange={(e) => setEditingConfig({ ...editingConfig, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="http://localhost/v1"
                />
              </div>

              {/* API Key */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingConfig.apiKey}
                  onChange={(e) => setEditingConfig({ ...editingConfig, apiKey: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder="app-xxx"
                />
              </div>

              {/* 测试URL - 自动生成 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  测试URL
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm font-mono truncate">
                  {editingConfig.url}/app-info
                </div>
              </div>

              {/* 启用和显示 */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingConfig.isEnabled}
                    onChange={(e) => setEditingConfig({ ...editingConfig, isEnabled: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">启用</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingConfig.isVisible}
                    onChange={(e) => setEditingConfig({ ...editingConfig, isVisible: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">在AI助手中显示</span>
                </label>
              </div>
            </div>

            {/* 弹窗底部 */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={!editingConfig.name || !editingConfig.url || !editingConfig.apiKey}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIAssistantConfig;
