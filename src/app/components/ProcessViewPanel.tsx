import React, { useState } from "react";
import { Eye, Briefcase, DollarSign, CheckCircle2, Clock, AlertCircle } from "lucide-react";

type ViewType = 'presales' | 'sales' | 'finance';

interface ProcessStep {
  id: string;
  name: string;
  status: 'completed' | 'in_progress' | 'pending';
  date?: string;
  amount?: number;
  description?: string;
}

interface ProcessViewPanelProps {
  defaultView?: ViewType;
}

export function ProcessViewPanel({ defaultView = 'presales' }: ProcessViewPanelProps) {
  const [activeView, setActiveView] = useState<ViewType>(defaultView);

  // 售前视图数据
  const presalesSteps: ProcessStep[] = [
    {
      id: '1',
      name: '商机发现',
      status: 'completed',
      date: '2024-01-05',
      description: '瓦洪县政府网络安全改造需求'
    },
    {
      id: '2',
      name: '需求调研',
      status: 'completed',
      date: '2024-01-10',
      description: '完成客户需求调研和现场勘查'
    },
    {
      id: '3',
      name: '方案设计',
      status: 'completed',
      date: '2024-01-20',
      description: '提交技术方案和报价方案'
    },
    {
      id: '4',
      name: '商务谈判',
      status: 'completed',
      date: '2024-02-01',
      description: '完成商务条款和价格谈判'
    },
    {
      id: '5',
      name: '合同签订',
      status: 'completed',
      date: '2024-02-15',
      description: '正式签订项目合同'
    }
  ];

  // 售中视图数据
  const salesSteps: ProcessStep[] = [
    {
      id: '1',
      name: '项目启动',
      status: 'completed',
      date: '2024-02-20',
      description: '项目启动会，明确项目目标'
    },
    {
      id: '2',
      name: '需求确认',
      status: 'completed',
      date: '2024-02-25',
      description: '与客户确认详细需求'
    },
    {
      id: '3',
      name: '方案实施',
      status: 'completed',
      date: '2024-03-10',
      description: '开始实施技术方案'
    },
    {
      id: '4',
      name: '系统测试',
      status: 'in_progress',
      date: '2024-03-25',
      description: '正在进行系统功能测试'
    },
    {
      id: '5',
      name: '项目验收',
      status: 'pending',
      description: '等待客户验收'
    }
  ];

  // 资金视图数据
  const financeSteps: ProcessStep[] = [
    {
      id: '1',
      name: '合同签订',
      status: 'completed',
      date: '2024-02-15',
      amount: 2456800,
      description: '合同总金额确认'
    },
    {
      id: '2',
      name: '预付款',
      status: 'completed',
      date: '2024-02-20',
      amount: 736000,
      description: '已收预付款30%'
    },
    {
      id: '3',
      name: '进度款',
      status: 'completed',
      date: '2024-03-15',
      amount: 982720,
      description: '已收进度款40%'
    },
    {
      id: '4',
      name: '验收款',
      status: 'in_progress',
      amount: 614250,
      description: '待收验收款25%'
    },
    {
      id: '5',
      name: '质保金',
      status: 'pending',
      amount: 122850,
      description: '质保期后支付5%'
    }
  ];

  const getStepIcon = (status: ProcessStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: ProcessStep['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'in_progress':
        return 'text-blue-600';
      case 'pending':
        return 'text-gray-400';
    }
  };

  const getStatusBgColor = (status: ProcessStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50';
      case 'in_progress':
        return 'bg-blue-50';
      case 'pending':
        return 'bg-gray-50';
    }
  };

  const getCurrentSteps = () => {
    switch (activeView) {
      case 'presales':
        return presalesSteps;
      case 'sales':
        return salesSteps;
      case 'finance':
        return financeSteps;
    }
  };

  const viewTabs = [
    { id: 'presales' as ViewType, label: '售前视图', icon: <Eye className="w-4 h-4" /> },
    { id: 'sales' as ViewType, label: '售中视图', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'finance' as ViewType, label: '资金视图', icon: <DollarSign className="w-4 h-4" /> }
  ];

  return (
    <div className="w-80 bg-white border-r flex-shrink-0 flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-[#f5f7fa]">
        <h3 className="font-medium text-gray-900">全流程信息</h3>
      </div>

      {/* View Tabs */}
      <div className="flex border-b bg-white">
        {viewTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm transition-colors border-b-2 ${
              activeView === tab.id
                ? 'border-[#2e7cff] text-[#2e7cff] bg-[#f0f7ff]'
                : 'border-transparent text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {getCurrentSteps().map((step, index) => (
            <div
              key={step.id}
              className={`relative pl-6 pb-3 ${
                index < getCurrentSteps().length - 1 ? 'border-l-2 ml-2' : ''
              } ${
                step.status === 'completed'
                  ? 'border-green-200'
                  : step.status === 'in_progress'
                  ? 'border-blue-200'
                  : 'border-gray-200'
              }`}
            >
              {/* Step Icon */}
              <div className={`absolute left-0 top-0 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center ${getStatusBgColor(step.status)}`}>
                {getStepIcon(step.status)}
              </div>

              {/* Step Content */}
              <div className={`rounded-lg p-3 ${getStatusBgColor(step.status)}`}>
                <div className="flex items-start justify-between mb-1">
                  <h4 className={`font-medium text-sm ${getStatusColor(step.status)}`}>
                    {step.name}
                  </h4>
                  {step.status === 'completed' && (
                    <span className="text-xs text-green-600">已完成</span>
                  )}
                  {step.status === 'in_progress' && (
                    <span className="text-xs text-blue-600">进行中</span>
                  )}
                  {step.status === 'pending' && (
                    <span className="text-xs text-gray-500">待处理</span>
                  )}
                </div>

                {step.date && (
                  <div className="text-xs text-gray-500 mb-1">{step.date}</div>
                )}

                {step.amount && (
                  <div className={`text-sm font-medium mb-1 ${getStatusColor(step.status)}`}>
                    ¥{step.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                  </div>
                )}

                {step.description && (
                  <div className="text-xs text-gray-600">{step.description}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="border-t bg-[#f5f7fa] px-4 py-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">已完成</span>
            <span className="font-medium text-green-600">
              {getCurrentSteps().filter(s => s.status === 'completed').length} / {getCurrentSteps().length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">进行中</span>
            <span className="font-medium text-blue-600">
              {getCurrentSteps().filter(s => s.status === 'in_progress').length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">待处理</span>
            <span className="font-medium text-gray-500">
              {getCurrentSteps().filter(s => s.status === 'pending').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
