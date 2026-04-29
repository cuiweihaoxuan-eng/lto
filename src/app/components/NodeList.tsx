import React, { useState } from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { NodeConfigEditor } from "./NodeConfigEditor";

interface ProcessNode {
  id: string;
  name: string;
  code: string;
  description: string;
  pageCount: number;
  regions: string[];
  businessTypes: string[];
  stages: string[];
  types: string[];
  enabled: boolean;
}

const mockNodes: ProcessNode[] = [
  {
    id: "1",
    name: "商机录入",
    code: "OPP_INPUT",
    description: "商机基本信息录入和客户信息管理",
    pageCount: 2,
    regions: ["全省"],
    businessTypes: ["ICT", "小微ICT"],
    stages: ["售前"],
    types: ["业务流"],
    enabled: true
  },
  {
    id: "2",
    name: "合同解构",
    code: "CONTRACT_DEMOLITION",
    description: "合同金额按科目进行解构分配",
    pageCount: 1,
    regions: ["全省"],
    businessTypes: ["ICT"],
    stages: ["售中"],
    types: ["业务流"],
    enabled: true
  },
  {
    id: "3",
    name: "开票申请",
    code: "INVOICE_APP",
    description: "发票开具申请及审批",
    pageCount: 1,
    regions: ["全省"],
    businessTypes: ["不限制"],
    stages: ["售后"],
    types: ["财务流"],
    enabled: true
  }
];

export function NodeList() {
  const [nodes, setNodes] = useState<ProcessNode[]>(mockNodes);
  const [searchParams, setSearchParams] = useState({
    name: "",
    region: "",
    businessType: "",
    stage: "",
    type: "",
    status: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingNode, setEditingNode] = useState<ProcessNode | null>(null);

  const handleAdd = () => {
    setEditingNode(null);
    setIsEditing(true);
  };

  const handleEdit = (node: ProcessNode) => {
    setEditingNode(node);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("确定要删除该节点吗？")) {
      setNodes(nodes.filter(n => n.id !== id));
    }
  };

  const handleSave = (nodeData: any) => {
    if (editingNode) {
      setNodes(nodes.map(n => 
        n.id === editingNode.id ? { ...n, ...nodeData } : n
      ));
    } else {
      setNodes([...nodes, {
        id: Date.now().toString(),
        ...nodeData,
        enabled: true
      }]);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingNode(null);
  };

  const toggleEnabled = (id: string) => {
    setNodes(nodes.map(n =>
      n.id === id ? { ...n, enabled: !n.enabled } : n
    ));
  };

  if (isEditing) {
    return (
      <NodeConfigEditor
        node={editingNode}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="h-full flex flex-col pt-4">
      {/* Search and Action Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <Input
            placeholder="节点名称"
            value={searchParams.name}
            onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
            className="h-9"
          />
          <Input
            placeholder="适用区域"
            value={searchParams.region}
            onChange={(e) => setSearchParams({ ...searchParams, region: e.target.value })}
            className="h-9"
          />
          <Input
            placeholder="业务类型"
            value={searchParams.businessType}
            onChange={(e) => setSearchParams({ ...searchParams, businessType: e.target.value })}
            className="h-9"
          />
          <Input
            placeholder="阶段"
            value={searchParams.stage}
            onChange={(e) => setSearchParams({ ...searchParams, stage: e.target.value })}
            className="h-9"
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9">
              <Search className="w-4 h-4 mr-1" />
              查询
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              重置
            </Button>
          </div>
          <Button 
            onClick={handleAdd}
            size="sm" 
            className="h-9 bg-[#1890ff] hover:bg-[#40a9ff]"
          >
            <Plus className="w-4 h-4 mr-1" />
            新增节点
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="sticky left-0 z-20 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap shadow-[2px_0_4px_rgba(0,0,0,0.05)]">节点名称</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">节点编码</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap min-w-[200px]">节点描述</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 whitespace-nowrap">页面数量</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">适用区域</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">业务类型</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">阶段</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">类型</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 whitespace-nowrap">状态</th>
                    <th className="sticky right-0 z-20 bg-gray-50 px-4 py-3 text-center text-sm font-medium text-gray-700 whitespace-nowrap shadow-[-2px_0_4px_rgba(0,0,0,0.05)]">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {nodes.map((node, index) => (
                    <tr 
                      key={node.id}
                      className={`hover:bg-gray-50 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="sticky left-0 z-10 bg-inherit px-4 py-3 text-sm text-gray-900 whitespace-nowrap font-medium shadow-[2px_0_4px_rgba(0,0,0,0.05)]">{node.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{node.code}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 min-w-[200px]">
                        {node.description}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <span className="text-xs text-indigo-600">
                          {node.pageCount}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {node.regions.map((region, i) => (
                            <span key={i} className="text-xs text-blue-600">
                              {region}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {node.businessTypes.map((type, i) => (
                            <span key={i} className="text-xs text-purple-600">
                              {type}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {node.stages.map((stage, i) => (
                            <span key={i} className="text-xs text-teal-600">
                              {stage}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {node.types.map((type, i) => (
                            <span key={i} className="text-xs text-pink-600">
                              {type}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => toggleEnabled(node.id)}
                          className={`px-3 py-1 text-xs rounded-full ${
                            node.enabled
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {node.enabled ? "已启用" : "已禁用"}
                        </button>
                      </td>
                      <td className="sticky right-0 z-10 bg-inherit px-4 py-3 whitespace-nowrap shadow-[-2px_0_4px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(node)}
                            className="text-[#1890ff] hover:text-[#40a9ff] p-1"
                            title="编辑"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(node.id)}
                            className="text-red-500 hover:text-red-600 p-1"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}