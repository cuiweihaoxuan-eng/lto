import React from "react";
import { FileText } from "lucide-react";

export function ProjectInfoBar() {
  return (
    <div className="bg-white border-b px-6 py-3">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Project Icon & Name */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#ff6b35] rounded flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              2025年瓦洪县人民政府网络安全改造项目
            </div>
            <div className="text-xs text-gray-500">
              集团商机编码: SD202509027169067
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-10 w-px bg-gray-200" />

        {/* Project Details */}
        <div className="flex items-center gap-6 flex-wrap text-xs">
          <div>
            <span className="text-gray-500">项目编码：</span>
            <span className="text-gray-900">37010069680</span>
          </div>
          <div>
            <span className="text-gray-500">商机状态：</span>
            <span className="px-2 py-0.5 bg-[#E6F4FF] text-[#1890ff] rounded">模式会</span>
          </div>
          <div>
            <span className="text-gray-500">转Z项目：</span>
            <span className="text-gray-900">是</span>
          </div>
          <div>
            <span className="text-gray-500">归属地市：</span>
            <span className="text-gray-900">山东</span>
          </div>
          <div>
            <span className="text-gray-500">客户经理：</span>
            <span className="text-gray-900">张三</span>
          </div>
          <div>
            <span className="text-gray-500">解决方案经理：</span>
            <span className="text-gray-900">李四</span>
          </div>
          <div>
            <span className="text-gray-500">项目经理：</span>
            <span className="text-gray-900">王五</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-10 w-px bg-gray-200" />

        {/* Financial Info */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-gray-500">项目金额</div>
            <div className="text-sm font-medium text-[#1890ff]">¥30.0万元</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">要求完成时间</div>
            <div className="text-sm text-gray-900">2025-09-29</div>
          </div>
        </div>

        {/* Action Buttons - 已删除 */}
      </div>
    </div>
  );
}