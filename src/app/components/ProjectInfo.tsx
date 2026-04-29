import React from "react";
import { ChevronRight, Calendar, User, DollarSign, FileText, ChevronUp, ChevronDown } from "lucide-react";

interface ProjectInfoProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function ProjectInfo({ isCollapsed, onToggle }: ProjectInfoProps) {
  if (isCollapsed) {
    return (
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg text-gray-900">国际关系学院杭州校区5G定制网项目</h1>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded whitespace-nowrap">进行中</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded whitespace-nowrap">新增</span>
        </div>
        <button
          onClick={onToggle}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-[#2e7cff] hover:bg-gray-50 rounded transition-colors"
        >
          <span>展开详情</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      {/* Header with Collapse Button */}
      <div className="flex items-center justify-between mb-3">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>商机</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">国际关系学院杭州校区5G定制网项目</span>
        </div>
        
        <button
          onClick={onToggle}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-[#2e7cff] hover:bg-gray-50 rounded transition-colors"
        >
          <span>收起详情</span>
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>

      {/* Project Title and Status */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-xl text-gray-900">国际关系学院杭州校区5G定制网项目</h1>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded whitespace-nowrap">进行中</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded whitespace-nowrap">新增</span>
        </div>
      </div>

      {/* Project Details - Multi-column Layout */}
      <div className="grid grid-cols-3 gap-x-8 gap-y-3 text-sm mb-4">
        {/* Column 1 */}
        <div className="flex items-start gap-2">
          <span className="text-gray-500 whitespace-nowrap min-w-[120px]">商机编号:</span>
          <div className="flex items-center gap-2 flex-1">
            <span className="text-gray-900">100050516352100000</span>
            <button className="text-[#2e7cff] hover:underline whitespace-nowrap">查看原文&gt;</button>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-gray-500 whitespace-nowrap min-w-[140px]">进项情报组织编号:</span>
          <span className="text-gray-900 break-all">ZJ202412029987830</span>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-gray-500 whitespace-nowrap min-w-[100px]">项目经理:</span>
          <span className="text-gray-900">张三</span>
        </div>

        {/* Column 2 */}
        <div className="flex items-start gap-2">
          <span className="text-gray-500 whitespace-nowrap min-w-[120px]">项目编号:</span>
          <span className="text-gray-900 break-all">202412024A2891604A091047087</span>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-gray-500 whitespace-nowrap min-w-[140px]">项目总金额:</span>
          <span className="text-gray-900">¥2,500,000.00</span>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-gray-500 whitespace-nowrap min-w-[100px]">创建时间:</span>
          <span className="text-gray-900 whitespace-nowrap">2024-12-02 14:30</span>
        </div>

        {/* Column 3 */}
        <div className="flex items-start gap-2">
          <span className="text-gray-500 whitespace-nowrap min-w-[120px]">客户名称:</span>
          <span className="text-gray-900">国际关系学院</span>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-gray-500 whitespace-nowrap min-w-[140px]">项目类型:</span>
          <span className="text-gray-900">5G定制网</span>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-gray-500 whitespace-nowrap min-w-[100px]">所属区域:</span>
          <span className="text-gray-900">浙江省杭州市</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button className="px-4 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors whitespace-nowrap">
          转商机
        </button>
        <button className="px-4 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors whitespace-nowrap">
          查看工单
        </button>
        <button className="px-4 py-1.5 bg-[#2e7cff] text-white rounded text-sm hover:bg-[#1e6eef] transition-colors whitespace-nowrap">
          合同审批流程
        </button>
      </div>
    </div>
  );
}