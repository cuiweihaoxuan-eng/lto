import React, { useState } from "react";
import { Check, Circle, ChevronLeft, ChevronRight } from "lucide-react";

interface Step {
  id: string;
  label: string;
  status: "completed" | "current" | "pending";
  children?: Step[];
}

const presaleSteps: Step[] = [
  { id: "presale-1", label: "客户意向", status: "completed" },
  { id: "presale-2", label: "需求分析", status: "completed" },
  { id: "presale-3", label: "方案设计", status: "completed" },
  { id: "presale-4", label: "商务谈判", status: "completed" },
  { id: "presale-5", label: "合同签订", status: "completed" }
];

const salesSteps: Step[] = [
  { id: "sale-1", label: "项目交底", status: "completed" },
  { id: "sale-2", label: "项目配置", status: "completed" },
  { id: "sale-3", label: "项目实施", status: "completed" },
  { id: "sale-4", label: "项目验收", status: "current" },
  { id: "sale-5", label: "项目收尾", status: "pending" },
  { id: "sale-6", label: "项目交维", status: "pending" }
];

const financeSteps: Step[] = [
  { id: "finance-1", label: "合同签订", status: "completed" },
  { id: "finance-2", label: "首款收取", status: "completed" },
  { id: "finance-3", label: "进度款收取", status: "current" },
  { id: "finance-4", label: "尾款收取", status: "pending" },
  { id: "finance-5", label: "发票开具", status: "pending" },
  { id: "finance-6", label: "财务核销", status: "pending" }
];

const viewConfig = {
  presale: { label: "售前视图", steps: presaleSteps },
  sales: { label: "售中视图", steps: salesSteps },
  finance: { label: "资金视图", steps: financeSteps }
};

interface ProcessStepsProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function ProcessSteps({ isCollapsed, onToggle }: ProcessStepsProps) {
  const [currentView, setCurrentView] = useState<"presale" | "sales" | "finance">("sales");
  const [expandedSteps, setExpandedSteps] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedSteps(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleItemClick = (id: string, hasChildren: boolean) => {
    if (hasChildren) {
      toggleExpand(id);
    }
  };

  const getStatusIcon = (status: Step["status"]) => {
    if (status === "completed") {
      return (
        <div className="w-6 h-6 rounded-full bg-[#52c41a] flex items-center justify-center flex-shrink-0">
          <Check className="w-4 h-4 text-white" />
        </div>
      );
    } else if (status === "current") {
      return (
        <div className="w-6 h-6 rounded-full bg-[#2e7cff] flex items-center justify-center flex-shrink-0">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      );
    } else {
      return (
        <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-white flex-shrink-0"></div>
      );
    }
  };

  const getStatusColor = (status: Step["status"]) => {
    if (status === "completed") return "text-[#52c41a]";
    if (status === "current") return "text-[#2e7cff]";
    return "text-gray-400";
  };

  const currentSteps = viewConfig[currentView].steps;

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white border-r border-gray-200 h-full flex flex-col items-center py-4">
        <button
          onClick={onToggle}
          className="p-2 text-gray-600 hover:text-[#2e7cff] hover:bg-gray-50 rounded transition-colors"
          title="展开流程"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        
        <div className="mt-4 flex flex-col gap-3">
          {currentSteps.map((step) => (
            <div key={step.id} className="flex items-center justify-center">
              {getStatusIcon(step.status)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-56 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* View Tabs */}
      <div className="border-b border-gray-200">
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">全流程</h3>
            <button
              onClick={onToggle}
              className="p-1 text-gray-600 hover:text-[#2e7cff] hover:bg-gray-50 rounded transition-colors"
              title="收起流程"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {(Object.keys(viewConfig) as Array<keyof typeof viewConfig>).map((view) => (
              <button
                key={view}
                className={`px-3 py-2 text-sm rounded transition-colors text-left ${
                  currentView === view
                    ? "bg-[#e6f2ff] text-[#2e7cff] font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setCurrentView(view)}
              >
                {viewConfig[view].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Process Steps */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-4 space-y-1">
          {currentSteps.map((step, index) => (
            <div key={step.id}>
              {/* Main Step */}
              <div 
                className={`flex items-center gap-3 py-2 px-3 rounded cursor-pointer transition-colors ${
                  step.status === "current" 
                    ? "bg-[#e6f2ff]" 
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleItemClick(step.id, !!step.children)}
              >
                {getStatusIcon(step.status)}
                <span className={`text-sm ${getStatusColor(step.status)} whitespace-nowrap`}>
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {index < currentSteps.length - 1 && (
                <div className="ml-6 h-4 border-l-2 border-gray-200"></div>
              )}

              {/* Children Steps */}
              {step.children && expandedSteps.includes(step.id) && (
                <div className="ml-6 pl-4 border-l-2 border-gray-200">
                  {step.children.map((child, childIndex) => (
                    <div key={child.id}>
                      <div className="flex items-center gap-3 py-2 px-3 rounded hover:bg-gray-50 cursor-pointer">
                        <Circle className={`w-3 h-3 flex-shrink-0 ${child.status === "current" ? "fill-[#2e7cff] text-[#2e7cff]" : "text-gray-300"}`} />
                        <span className={`text-sm ${getStatusColor(child.status)} whitespace-nowrap`}>
                          {child.label}
                        </span>
                      </div>
                      {childIndex < step.children.length - 1 && (
                        <div className="ml-4 h-3 border-l border-gray-200"></div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Status Legend */}
      <div className="px-4 py-3 border-t border-gray-200">
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#52c41a] flex-shrink-0"></div>
            <span className="text-gray-600 whitespace-nowrap">已完成</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#2e7cff] flex-shrink-0"></div>
            <span className="text-gray-600 whitespace-nowrap">进行中</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
            <span className="text-gray-600 whitespace-nowrap">待开始</span>
          </div>
        </div>
      </div>
    </div>
  );
}