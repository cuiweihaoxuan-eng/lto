import React from "react";
import { Bell, Settings, User, HelpCircle } from "lucide-react";

export function Header() {
  return (
    <div className="h-14 bg-white border-b flex items-center justify-between px-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>首页</span>
        <span>/</span>
        <span>商机管理</span>
        <span>/</span>
        <span className="text-gray-900">详情</span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <HelpCircle className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
        
        {/* User Info */}
        <div className="flex items-center gap-2 pl-4 border-l">
          <div className="w-8 h-8 bg-[#1890ff] rounded-full flex items-center justify-center text-white text-sm">
            A
          </div>
          <div className="text-sm">
            <div className="text-gray-900">Admin</div>
            <div className="text-xs text-gray-500">管理员</div>
          </div>
        </div>
      </div>
    </div>
  );
}
