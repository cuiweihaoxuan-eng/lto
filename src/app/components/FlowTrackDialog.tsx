import React, { useState } from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface FlowTrackDialogProps {
  open: boolean;
  onClose: () => void;
  rowData: any;
}

export function FlowTrackDialog({ open, onClose, rowData }: FlowTrackDialogProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!open) return null;

  // 模拟流程数据
  const flowSteps = [
    { step: "省业务派单", handler: "郦文", arriveTime: "2025-12-01 09:30:00", submitTime: "2025-12-01 10:15:00", status: "已完成" },
    { step: "地市政企", handler: "余娅", arriveTime: "2025-12-01 10:20:00", submitTime: "2025-12-03 16:30:00", status: "已完成" },
    { step: "地市财务", handler: "张明", arriveTime: "2025-12-03 16:35:00", submitTime: "2025-12-04 11:00:00", status: "已完成" },
    { step: "其他地市专家财务", handler: "李华", arriveTime: "2025-12-04 11:05:00", submitTime: "2025-12-05 09:30:00", status: "已完成" },
    { step: "省业务", handler: "郦文", arriveTime: "2025-12-05 09:35:00", submitTime: "2025-12-05 14:00:00", status: "已完成" },
    { step: "省财务", handler: "王芳", arriveTime: "2025-12-05 14:05:00", submitTime: "-", status: "处理中" },
    { step: "违规处理", handler: "-", arriveTime: "-", submitTime: "-", status: "未开始" },
  ];

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
          <span className="text-base font-medium text-gray-900">流程跟踪列表</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-1 hover:bg-gray-100 rounded">
              {isFullscreen ? <Minimize2 className="w-4 h-4 text-gray-500" /> : <Maximize2 className="w-4 h-4 text-gray-500" />}
            </button>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-auto px-6 py-4">
          <table className="w-full border border-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-700">序号</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">处理环节</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">环节处理人</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">到达时间</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">提交时间</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">处理状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {flowSteps.map((item, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="px-3 py-2 text-gray-600">{index + 1}</td>
                  <td className="px-3 py-2 text-gray-600">{item.step}</td>
                  <td className="px-3 py-2 text-gray-600">{item.handler}</td>
                  <td className="px-3 py-2 text-gray-600">{item.arriveTime}</td>
                  <td className="px-3 py-2 text-gray-600">{item.submitTime}</td>
                  <td className="px-3 py-2">
                    <Badge variant={item.status === "已完成" ? "success" : "warning"}>
                      {item.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 底部按钮 */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-center gap-3 flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            关闭
          </Button>
        </div>
      </div>
    </div>
  );
}
