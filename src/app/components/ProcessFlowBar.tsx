import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ProcessNode {
  id: string;
  name: string;
  status: 'completed' | 'active' | 'pending';
}

interface ProcessFlowBarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activeNode: string;
  onNodeChange: (nodeId: string) => void;
}

export function ProcessFlowBar({ isCollapsed, onToggle, activeNode, onNodeChange }: ProcessFlowBarProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const processNodes: ProcessNode[] = [
    { id: "lead", name: "线索录入", status: "completed" },
    { id: "opportunity", name: "商机信息", status: "completed" },
    { id: "team", name: "组建团队", status: "completed" },
    { id: "solution", name: "方案制定", status: "completed" },
    { id: "review", name: "中台把关", status: "completed" },
    { id: "meeting", name: "模式会", status: "completed" },
    { id: "approval", name: "审批", status: "completed" },
    { id: "contract", name: "合同签订", status: "completed" },
    { id: "contract-demolition", name: "合同解构", status: "completed" },
    { id: "implementation-monitoring", name: "实施进度监控", status: "completed" },
    { id: "kick-off", name: "启动", status: "completed" },
    { id: "implementation", name: "实施", status: "completed" },
    { id: "quality-control", name: "项目质量管控", status: "completed" },
    { id: "delivery", name: "交付", status: "completed" },
    { id: "acceptance", name: "验收", status: "active" },
    { id: "invoice-application", name: "项目开票申请", status: "pending" },
    { id: "settlement", name: "结算", status: "pending" },
    { id: "archive", name: "项目归档", status: "pending" },
    { id: "backward-contract", name: "后向合同", status: "pending" },
  ];

  const getStatusColor = (status: ProcessNode['status'], isActive: boolean) => {
    if (isActive) {
      return 'bg-[#faad14] ring-4 ring-[#fff7e6]'; // 当前选中的节点用橙色高亮
    }
    switch (status) {
      case 'completed':
        return 'bg-[#52c41a]';
      case 'active':
        return 'bg-[#1890ff]';
      case 'pending':
        return 'bg-[#d9d9d9]';
    }
  };

  const getStatusText = (status: ProcessNode['status']) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'active':
        return '进行中';
      case 'pending':
        return '待进行';
    }
  };

  if (isCollapsed) {
    return (
      <div className="bg-white border-b">
        <button
          onClick={onToggle}
          className="w-full py-2 flex items-center justify-center gap-1 text-xs text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <ChevronDown className="w-3 h-3" />
          展开节点流程
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border-b">
      <div className="px-6 py-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-1.5 rounded text-sm transition-colors ${
              activeFilter === "all"
                ? "bg-[#1890ff] text-white"
                : "bg-[#f5f5f5] text-gray-600 hover:bg-[#E6F4FF]"
            }`}
          >
            全部节点
          </button>
          <button
            onClick={() => setActiveFilter("presale")}
            className={`px-4 py-1.5 rounded text-sm transition-colors ${
              activeFilter === "presale"
                ? "bg-[#1890ff] text-white"
                : "bg-[#f5f5f5] text-gray-600 hover:bg-[#E6F4FF]"
            }`}
          >
            售前
          </button>
          <button
            onClick={() => setActiveFilter("sale")}
            className={`px-4 py-1.5 rounded text-sm transition-colors ${
              activeFilter === "sale"
                ? "bg-[#1890ff] text-white"
                : "bg-[#f5f5f5] text-gray-600 hover:bg-[#E6F4FF]"
            }`}
          >
            售中
          </button>
          <button
            onClick={() => setActiveFilter("aftersale")}
            className={`px-4 py-1.5 rounded text-sm transition-colors ${
              activeFilter === "aftersale"
                ? "bg-[#1890ff] text-white"
                : "bg-[#f5f5f5] text-gray-600 hover:bg-[#E6F4FF]"
            }`}
          >
            售后
          </button>
          <button
            onClick={() => setActiveFilter("finance")}
            className={`px-4 py-1.5 rounded text-sm transition-colors ${
              activeFilter === "finance"
                ? "bg-[#1890ff] text-white"
                : "bg-[#f5f5f5] text-gray-600 hover:bg-[#E6F4FF]"
            }`}
          >
            财务流
          </button>
        </div>

        {/* Process Flow */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-3 left-0 right-0 h-0.5 bg-[#e8e8e8]" style={{ zIndex: 0 }} />

          {/* Process Nodes */}
          <div className="flex items-start justify-between relative" style={{ zIndex: 1 }}>
            {processNodes.map((node, index) => {
              const isActive = activeNode === node.id;
              return (
                <div key={node.id} className="flex flex-col items-center" style={{ flex: '0 0 auto' }}>
                  {/* Node Circle */}
                  <div className="relative">
                    <div
                      className={`w-6 h-6 rounded-full ${getStatusColor(node.status, isActive)} cursor-pointer hover:scale-110 transition-all`}
                      title={`${node.name} - ${getStatusText(node.status)}`}
                      onClick={() => onNodeChange(node.id)}
                    />
                    {node.status === 'active' && !isActive && (
                      <div className={`absolute inset-0 w-6 h-6 rounded-full ${getStatusColor(node.status, false)} animate-ping opacity-75`} />
                    )}
                  </div>

                  {/* Node Label */}
                  <div 
                    className={`mt-2 text-xs text-center whitespace-nowrap ${isActive ? 'text-[#faad14] font-medium' : 'text-gray-600'}`}
                    style={{ maxWidth: '60px' }}
                  >
                    {node.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#52c41a]" />
            <span>已完成</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#1890ff]" />
            <span>进行中</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#d9d9d9]" />
            <span>待进行</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#faad14]" />
            <span>当前查看</span>
          </div>
        </div>
      </div>

      {/* Collapse Button */}
      <button
        onClick={onToggle}
        className="w-full py-2 flex items-center justify-center gap-1 text-xs text-gray-500 hover:bg-gray-50 transition-colors border-t"
      >
        <ChevronUp className="w-3 h-3" />
        收起节点
      </button>
    </div>
  );
}