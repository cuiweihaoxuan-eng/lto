import React from "react";
import { FileText, BarChart3, DollarSign } from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

// 验收节点下的子功能
const menuItems: MenuItem[] = [
  {
    id: "matching",
    label: "前后向匹配",
    icon: <FileText className="w-4 h-4" />
  },
  {
    id: "progress",
    label: "形象进度管理",
    icon: <BarChart3 className="w-4 h-4" />
  },
  {
    id: "payment",
    label: "合同收付款确认",
    icon: <DollarSign className="w-4 h-4" />
  }
];

interface FunctionMenuProps {
  activeItem: string;
  onItemChange: (itemId: string) => void;
}

export function FunctionMenu({ activeItem, onItemChange }: FunctionMenuProps) {
  return (
    <div className="w-48 bg-[#f5f7fa] border-r border-gray-200 flex-shrink-0">
      <div className="py-2">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700">验收管理</h3>
        </div>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
              activeItem === item.id
                ? 'bg-[#1890ff] text-white'
                : 'text-gray-700 hover:bg-[#e6f7ff]'
            }`}
          >
            <div className={activeItem === item.id ? 'text-white' : 'text-[#1890ff]'}>
              {item.icon}
            </div>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
