import React, { useState } from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "./ui/button";

interface RiskDetailDialogProps {
  open: boolean;
  onClose: () => void;
  rowData: any;
  onFlowTrack?: () => void;
}

export function RiskDetailDialog({ open, onClose, rowData, onFlowTrack }: RiskDetailDialogProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl flex flex-col transition-all duration-300"
        style={{
          width: isFullscreen ? "98vw" : "800px",
          height: isFullscreen ? "90vh" : "auto",
          maxWidth: "98vw",
          maxHeight: "98vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <span className="text-base font-medium text-gray-900">风险详情</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-1 hover:bg-gray-100 rounded">
              {isFullscreen ? <Minimize2 className="w-4 h-4 text-gray-500" /> : <Maximize2 className="w-4 h-4 text-gray-500" />}
            </button>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* 按钮 */}
        <div className="px-6 py-3 border-b border-gray-200 flex justify-end flex-shrink-0">
          <Button variant="outline" size="sm" onClick={onFlowTrack}>
            流转详情
          </Button>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-auto px-6 py-4">
          {/* 疑似风险详情 */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">疑似风险详情</h3>
            <table className="w-full border border-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">风险类型</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">风险分值</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">风险模型</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">分值</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">发现时间</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">风险主体类型</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200">
                  <td className="px-3 py-2 text-gray-600">信用评级</td>
                  <td className="px-3 py-2 text-gray-600">300</td>
                  <td className="px-3 py-2 text-gray-600">企业无自有能力风险</td>
                  <td className="px-3 py-2 text-gray-600">100</td>
                  <td className="px-3 py-2 text-gray-600">2025-09-25 16:13:11</td>
                  <td className="px-3 py-2 text-gray-600">供应商</td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-3 py-2 text-gray-600">循环贸易</td>
                  <td className="px-3 py-2 text-gray-600">200</td>
                  <td className="px-3 py-2 text-gray-600">既是客户又是供应商风险</td>
                  <td className="px-3 py-2 text-gray-600">200</td>
                  <td className="px-3 py-2 text-gray-600">2025-11-10 16:40:10</td>
                  <td className="px-3 py-2 text-gray-600">客户</td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-3 py-2 text-gray-600">疑似空壳</td>
                  <td className="px-3 py-2 text-gray-600">200</td>
                  <td className="px-3 py-2 text-gray-600">空壳企业风险_异地经营</td>
                  <td className="px-3 py-2 text-gray-600">200</td>
                  <td className="px-3 py-2 text-gray-600">2025-11-14 00:16:08</td>
                  <td className="px-3 py-2 text-gray-600">供应商</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-center gap-3 flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
        </div>
      </div>
    </div>
  );
}
