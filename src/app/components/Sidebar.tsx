import React, { useState, useRef, useEffect } from "react";
import {
  Home,
  FileText,
  ShoppingCart,
  Settings,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Menu,
  Target,
  ChevronLeft
} from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

const yecaiChildren: MenuItem[] = [
  { id: "full-flow-table", label: "产数项目全流程宽表" },
  { id: "low-margin-report", label: "项目低负毛利报表" },
  { id: "revenue-plan-actual-diff", label: "收入计划与实际确收差异报表" },
  { id: "revenue-cost-diff", label: "收入确认与成本列账进度差异报表" },
  { id: "first-payment-diff", label: "收款与付款进度差异报表" },
  { id: "ict-share-abnormal", label: "ICT项目分成异常报表" },
  { id: "ict-budget-detail", label: "ICT项目预算明细" },
  { id: "ict-gross-profit-report", label: "ICT毛利额区域统计报表" },
  { id: "construct-not-fixed-no-expense", label: "已列收工程未转固无支出" },
];

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "系统首页",
    icon: <Home className="w-4 h-4" />
  },
  {
    id: "leads",
    label: "线索管理",
    icon: <FileText className="w-4 h-4" />,
    children: [
      { id: "lead-acquisition", label: "线索获取" },
      { id: "lead-pool", label: "商情线索池管理" },
      { id: "lead-merge", label: "线索合并" },
      { id: "lead-distribution", label: "线索分配" }
    ]
  },
  {
    id: "opportunity",
    label: "商机管理",
    icon: <ShoppingCart className="w-4 h-4" />
  },
  {
    id: "business-info",
    label: "商情管理",
    icon: <ShoppingCart className="w-4 h-4" />
  },
  {
    id: "process-config",
    label: "流程节点配置",
    icon: <TrendingUp className="w-4 h-4" />
  },
  {
    id: "risk",
    label: "风险管理",
    icon: <AlertTriangle className="w-4 h-4" />
  },
  {
    id: "finance-report",
    label: "业财融合报表管理",
    icon: <BarChart3 className="w-4 h-4" />
  },
  {
    id: "six-positioning",
    label: "六到位",
    icon: <Target className="w-4 h-4" />
  },
  {
    id: "report",
    label: "报表",
    icon: <BarChart3 className="w-4 h-4" />,
    children: [
      { id: "expert-report", label: "专家调用报表" },
      {
        id: "yecai-report-group",
        label: "业财融合报表",
        children: yecaiChildren
      }
    ]
  },
  {
    id: "settings",
    label: "系统设置",
    icon: <Settings className="w-4 h-4" />
  }
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activeItem?: string;
  onItemChange?: (itemId: string) => void;
}

export function Sidebar({ isCollapsed, onToggle, activeItem: externalActiveItem, onItemChange }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(["report"]);
  const [activeItem, setActiveItem] = useState("dashboard");
  const [cascadeParent, setCascadeParent] = useState<string | null>(null);
  const [cascadePos, setCascadePos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const sidebarRef = useRef<HTMLDivElement>(null);
  const cascadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentActiveItem = externalActiveItem || activeItem;

  const toggleExpand = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleItemClick = (id: string) => {
    setActiveItem(id);
    if (onItemChange) {
      onItemChange(id);
    }
  };

  const clearCascade = () => {
    setCascadeParent(null);
  };

  const handleCascadeEnter = (id: string, e: React.MouseEvent) => {
    if (cascadeTimerRef.current) clearTimeout(cascadeTimerRef.current);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setCascadePos({ top: rect.top, left: rect.right });
    setCascadeParent(id);
  };

  const handleCascadeLeave = () => {
    cascadeTimerRef.current = setTimeout(() => {
      setCascadeParent(null);
    }, 150);
  };

  const handleCascadePanelEnter = () => {
    if (cascadeTimerRef.current) clearTimeout(cascadeTimerRef.current);
  };

  const handleCascadePanelLeave = () => {
    cascadeTimerRef.current = setTimeout(() => {
      setCascadeParent(null);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (cascadeTimerRef.current) clearTimeout(cascadeTimerRef.current);
    };
  }, []);

  const cascadeChildren = cascadeParent
    ? menuItems
        .find(m => m.id === "report")
        ?.children?.find(c => c.id === cascadeParent)
        ?.children || []
    : [];

  return (
    <>
      <div
        ref={sidebarRef}
        className={`bg-[#E6F4FF] border-r border-[#bae7ff] h-full transition-all duration-300 flex flex-col relative z-50 ${
          isCollapsed ? 'w-16' : 'w-56'
        }`}
      >
        {/* Logo Area */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-[#bae7ff] bg-gradient-to-r from-[#E6F4FF] to-[#bae7ff]">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#1890ff] rounded flex items-center justify-center text-white text-sm font-bold">
                产
              </div>
              <span className="font-medium text-sm text-gray-700">产数质量运营平台</span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-1.5 hover:bg-[#bae7ff] rounded transition-colors"
          >
            <Menu className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (item.children) {
                    toggleExpand(item.id);
                  } else {
                    handleItemClick(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 transition-colors ${
                  currentActiveItem === item.id
                    ? 'bg-[#1890ff] text-white'
                    : 'text-gray-700 hover:bg-[#bae7ff]'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={currentActiveItem === item.id ? 'text-white' : 'text-[#1890ff]'}>
                    {item.icon}
                  </div>
                  {!isCollapsed && (
                    <span className="text-sm">{item.label}</span>
                  )}
                </div>
                {!isCollapsed && item.children && (
                  <div className={currentActiveItem === item.id ? 'text-white' : 'text-gray-500'}>
                    {expandedItems.includes(item.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                )}
              </button>

              {/* Sub Menu (level 2) */}
              {!isCollapsed && item.children && expandedItems.includes(item.id) && (
                <div className="bg-[#f0f9ff]">
                  {item.children.map((child) => {
                    const hasGrandChildren = !!child.children && child.children.length > 0;
                    return (
                      <button
                        key={child.id}
                        onClick={() => {
                          if (hasGrandChildren) {
                            handleItemClick(child.id);
                          } else {
                            handleItemClick(child.id);
                          }
                        }}
                        onMouseEnter={(e) => {
                          if (hasGrandChildren) {
                            handleCascadeEnter(child.id, e);
                          }
                        }}
                        onMouseLeave={handleCascadeLeave}
                        className={`w-full flex items-center justify-between px-4 py-2 pl-12 text-sm transition-colors ${
                          currentActiveItem === child.id
                            ? 'bg-[#1890ff] text-white'
                            : 'text-gray-600 hover:bg-[#bae7ff]'
                        }`}
                      >
                        <span className="flex-1 text-left truncate">{child.label}</span>
                        {hasGrandChildren && (
                          <ChevronRight className="w-3 h-3 flex-shrink-0 ml-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Cascade Third-Level Dropdown Panel */}
      {!isCollapsed && cascadeParent && cascadeChildren.length > 0 && (
        <div
          className="fixed z-[100] bg-white rounded-lg shadow-xl border border-gray-200"
          style={{
            top: cascadePos.top,
            left: cascadePos.left + 4,
            width: 300,
            maxHeight: 'calc(100vh - 120px)',
            overflowY: 'auto',
          }}
          onMouseEnter={handleCascadePanelEnter}
          onMouseLeave={handleCascadePanelLeave}
        >
          {/* Panel Items */}
          <div className="py-1">
            {cascadeChildren.map((child) => (
              <button
                key={child.id}
                onClick={() => {
                  handleItemClick(child.id);
                  setCascadeParent(null);
                }}
                className={`block w-full text-left px-4 py-2 text-sm transition-colors whitespace-nowrap ${
                  currentActiveItem === child.id
                    ? 'bg-[#1890ff] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {child.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
