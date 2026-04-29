import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { X, Save } from "lucide-react";

interface NodeEditorProps {
  node: any;
  onSave: (config: any) => void;
  onCancel: () => void;
}

export function NodeEditor({ node, onSave, onCancel }: NodeEditorProps) {
  const [config, setConfig] = useState({
    stage: node.data?.stage || "",
    type: node.data?.type || "",
    required: node.data?.required || false,
    reminder: node.data?.reminder || false,
    roles: node.data?.roles || "",
    connectionType: node.data?.connectionType || "serial" // serial: 串行, parallel: 并行
  });

  const handleSave = () => {
    onSave(config);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[600px] max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">节点配置</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(80vh-140px)]">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              节点名称
            </label>
            <Input value={node.data?.label || ""} disabled className="bg-gray-50" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                阶段 *
              </label>
              <select
                value={config.stage}
                onChange={(e) => setConfig({ ...config, stage: e.target.value })}
                className="w-full h-9 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">请选择</option>
                <option value="售前">售前</option>
                <option value="售中">售中</option>
                <option value="售后">售后</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                类型 *
              </label>
              <select
                value={config.type}
                onChange={(e) => setConfig({ ...config, type: e.target.value })}
                className="w-full h-9 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">请选择</option>
                <option value="业务流">业务流</option>
                <option value="财务流">财务流</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              连接方式
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="serial"
                  checked={config.connectionType === "serial"}
                  onChange={(e) => setConfig({ ...config, connectionType: e.target.value })}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">串行</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="parallel"
                  checked={config.connectionType === "parallel"}
                  onChange={(e) => setConfig({ ...config, connectionType: e.target.value })}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">并行</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.required}
                onChange={(e) => setConfig({ ...config, required: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">是否必须完成</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.reminder}
                onChange={(e) => setConfig({ ...config, reminder: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">是否提醒</span>
            </label>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              适用岗位角色
            </label>
            <Input
              value={config.roles}
              onChange={(e) => setConfig({ ...config, roles: e.target.value })}
              placeholder="请输入适用岗位角色，多个用逗号分隔"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            取消
          </Button>
          <Button onClick={handleSave} className="bg-[#1890ff] hover:bg-[#40a9ff]">
            <Save className="w-4 h-4 mr-1" />
            确认
          </Button>
        </div>
      </div>
    </div>
  );
}
