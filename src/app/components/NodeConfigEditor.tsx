import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { X, Save, GripVertical, Trash2 } from "lucide-react";

interface Page {
  id: string;
  name: string;
  url: string;
  description: string;
  selected: boolean;
}

const mockPages: Page[] = [
  { id: "p1", name: "商机基本信息", url: "/opp/basic", description: "商机录入基本信息页面", selected: false },
  { id: "p2", name: "客户信息管理", url: "/opp/customer", description: "客户信息录入和管理", selected: false },
  { id: "p3", name: "合同解构列表", url: "/contract/demolition", description: "合同解构明细列表", selected: false },
  { id: "p4", name: "开票申请", url: "/invoice/application", description: "发票开具申请", selected: false },
  { id: "p5", name: "实施进度监控", url: "/implementation/monitoring", description: "项目实施进度监控", selected: false },
];

interface NodeConfigEditorProps {
  node: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function NodeConfigEditor({ node, onSave, onCancel }: NodeConfigEditorProps) {
  const [formData, setFormData] = useState({
    name: node?.name || "",
    code: node?.code || "",
    description: node?.description || "",
    regions: node?.regions || [],
    businessTypes: node?.businessTypes || [],
    stages: node?.stages || [],
    types: node?.types || [],
    strictValidation: node?.strictValidation || false,
    reminder: node?.reminder || false,
    roles: node?.roles || ""
  });

  const [pages, setPages] = useState<Page[]>(mockPages);
  const [selectedPages, setSelectedPages] = useState<Page[]>([]);

  const handleTogglePage = (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return;

    if (page.selected) {
      // 取消选择
      setPages(pages.map(p => p.id === pageId ? { ...p, selected: false } : p));
      setSelectedPages(selectedPages.filter(p => p.id !== pageId));
    } else {
      // 选择
      setPages(pages.map(p => p.id === pageId ? { ...p, selected: true } : p));
      setSelectedPages([...selectedPages, page]);
    }
  };

  const handleRemoveSelected = (pageId: string) => {
    setPages(pages.map(p => p.id === pageId ? { ...p, selected: false } : p));
    setSelectedPages(selectedPages.filter(p => p.id !== pageId));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newSelected = [...selectedPages];
    [newSelected[index - 1], newSelected[index]] = [newSelected[index], newSelected[index - 1]];
    setSelectedPages(newSelected);
  };

  const handleMoveDown = (index: number) => {
    if (index === selectedPages.length - 1) return;
    const newSelected = [...selectedPages];
    [newSelected[index], newSelected[index + 1]] = [newSelected[index + 1], newSelected[index]];
    setSelectedPages(newSelected);
  };

  const handleSave = () => {
    onSave({
      ...formData,
      pageCount: selectedPages.length,
      pages: selectedPages
    });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">
          {node ? "编辑节点" : "新增节点"}
        </h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Basic Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">基本信息</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">节点名称 *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入节点名称"
                className="h-9"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">节点编码 *</label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="请输入节点编码"
                className="h-9"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-600 mb-1 block">节点描述</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="请输入节点描述"
                className="h-9"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">适用区域</label>
              <select className="w-full h-9 px-3 border border-gray-300 rounded text-sm">
                <option>不限制</option>
                <option>全省</option>
                <option>杭州</option>
                <option>宁波</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">业务类型</label>
              <select className="w-full h-9 px-3 border border-gray-300 rounded text-sm">
                <option>不限制</option>
                <option>ICT</option>
                <option>小微ICT</option>
                <option>基础业务</option>
                <option>资源型业务</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">阶段</label>
              <select className="w-full h-9 px-3 border border-gray-300 rounded text-sm">
                <option>不限制</option>
                <option>售前</option>
                <option>售中</option>
                <option>售后</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">类型（多选）</label>
              <select className="w-full h-9 px-3 border border-gray-300 rounded text-sm">
                <option>不限制</option>
                <option>业务流</option>
                <option>财务流</option>
              </select>
            </div>
            <div className="col-span-2 flex gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.strictValidation}
                  onChange={(e) => setFormData({ ...formData, strictValidation: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">是否强校验</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.reminder}
                  onChange={(e) => setFormData({ ...formData, reminder: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">是否提醒</span>
              </label>
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-600 mb-1 block">角色岗位</label>
              <Input
                value={formData.roles}
                onChange={(e) => setFormData({ ...formData, roles: e.target.value })}
                placeholder="请输入角色岗位，多个用逗号分隔"
                className="h-9"
              />
            </div>
          </div>
        </div>

        {/* Selected Pages */}
        {selectedPages.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              已选页面 ({selectedPages.length})
            </h3>
            <div className="space-y-2">
              {selectedPages.map((page, index) => (
                <div
                  key={page.id}
                  className="bg-white rounded p-2 flex items-center gap-2"
                >
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === selectedPages.length - 1}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      ▼
                    </button>
                  </div>
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{page.name}</div>
                    <div className="text-xs text-gray-500">{page.url}</div>
                  </div>
                  <button
                    onClick={() => handleRemoveSelected(page.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Page Selection */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">选择二级节点（页面）</h3>
          <div className="bg-white rounded border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-12">
                    选择
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    页面名称
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    页面URL
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    页面描述
                  </th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr
                    key={page.id}
                    className={`border-b border-gray-100 ${
                      page.selected ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={page.selected}
                        onChange={() => handleTogglePage(page.id)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">{page.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{page.url}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{page.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
  );
}
