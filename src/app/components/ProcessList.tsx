import React, { useState } from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ProcessEditor } from "./ProcessEditor";

interface Process {
  id: string;
  name: string;
  regions: string[];
  businessTypes: string[];
  products: string[];
  nodeCount: number;
  pageCount: number;
  createTime: string;
  enabled: boolean;
}

const mockProcesses: Process[] = [
  {
    id: "1",
    name: "标准销售流程",
    regions: ["全省"],
    businessTypes: ["ICT", "小微ICT"],
    products: ["云计算", "大数据"],
    nodeCount: 8,
    pageCount: 15,
    createTime: "2024-01-15",
    enabled: true
  },
  {
    id: "2",
    name: "快速响应流程",
    regions: ["杭州", "宁波"],
    businessTypes: ["基础业务"],
    products: ["宽带", "专线"],
    nodeCount: 5,
    pageCount: 10,
    createTime: "2024-02-20",
    enabled: true
  }
];

export function ProcessList() {
  const [processes, setProcesses] = useState<Process[]>(mockProcesses);
  const [searchParams, setSearchParams] = useState({
    name: "",
    region: "",
    businessType: "",
    product: "",
    stage: "",
    type: "",
    status: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingProcess, setEditingProcess] = useState<Process | null>(null);

  const handleAdd = () => {
    setEditingProcess(null);
    setIsEditing(true);
  };

  const handleEdit = (process: Process) => {
    setEditingProcess(process);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("确定要删除该流程吗？")) {
      setProcesses(processes.filter(p => p.id !== id));
    }
  };

  const handleSave = (processData: any) => {
    if (editingProcess) {
      setProcesses(processes.map(p => 
        p.id === editingProcess.id ? { ...p, ...processData } : p
      ));
    } else {
      setProcesses([...processes, {
        id: Date.now().toString(),
        ...processData,
        nodeCount: 0,
        pageCount: 0,
        createTime: new Date().toISOString().split('T')[0],
        enabled: true
      }]);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingProcess(null);
  };

  const toggleEnabled = (id: string) => {
    setProcesses(processes.map(p =>
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
  };

  if (isEditing) {
    return (
      <ProcessEditor
        process={editingProcess}
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
            placeholder="流程名称"
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
            placeholder="适用产品"
            value={searchParams.product}
            onChange={(e) => setSearchParams({ ...searchParams, product: e.target.value })}
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
            新增流程
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
                    <th className="sticky left-0 z-20 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap shadow-[2px_0_4px_rgba(0,0,0,0.05)]">流程名称</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">适用区域</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">业务类型</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">适用产品</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 whitespace-nowrap">流程节点数</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 whitespace-nowrap">页面数量</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 whitespace-nowrap">创建时间</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 whitespace-nowrap">状态</th>
                    <th className="sticky right-0 z-20 bg-gray-50 px-4 py-3 text-center text-sm font-medium text-gray-700 whitespace-nowrap shadow-[-2px_0_4px_rgba(0,0,0,0.05)]">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {processes.map((process, index) => (
                    <tr 
                      key={process.id}
                      className={`hover:bg-gray-50 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="sticky left-0 z-10 bg-inherit px-4 py-3 text-sm text-gray-900 whitespace-nowrap font-medium shadow-[2px_0_4px_rgba(0,0,0,0.05)]">{process.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {process.regions.map((region, i) => (
                            <span key={i} className="text-xs text-blue-600">
                              {region}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {process.businessTypes.map((type, i) => (
                            <span key={i} className="text-xs text-purple-600">
                              {type}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {process.products.map((product, i) => (
                            <span key={i} className="text-xs text-orange-600">
                              {product}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <span className="text-xs text-cyan-600">
                          {process.nodeCount}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <span className="text-xs text-indigo-600">
                          {process.pageCount}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-gray-600 whitespace-nowrap">
                        {process.createTime}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => toggleEnabled(process.id)}
                          className={`px-3 py-1 text-xs rounded-full ${
                            process.enabled
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {process.enabled ? "已启用" : "已禁用"}
                        </button>
                      </td>
                      <td className="sticky right-0 z-10 bg-inherit px-4 py-3 whitespace-nowrap shadow-[-2px_0_4px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(process)}
                            className="text-[#1890ff] hover:text-[#40a9ff] p-1"
                            title="编辑"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(process.id)}
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