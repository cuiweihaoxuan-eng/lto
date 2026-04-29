import React from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface FlowRecord {
  id: number;
  time: string;
  operator: string;
  fromRole: string;
  toRole: string;
  action: string;
  remark?: string;
}

interface FlowProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Record<string, unknown>;
}

export function FlowProcessModal({ isOpen, onClose, data }: FlowProcessModalProps) {
  if (!isOpen || !data) return null;

  const flowProcesses: FlowRecord[] = [
    {
      id: 1,
      time: (data.groupDispatchTime as string) || "2025-02-03 14:30:35",
      operator: "系统",
      fromRole: "集团自动派单",
      toRole: "省级自动派单",
      action: "自动派单",
      remark: "",
    },
    {
      id: 2,
      time: (data.groupBusinessTime as string) || "2025-02-03 07:26:01",
      operator: Array.isArray(data.currentOperators)
        ? (data.currentOperators as string[]).join('、')
        : (data.currentOperator as string) || "系统",
      fromRole: "省级自动派单",
      toRole: data.currentOperationRole as string || "地市管理员",
      action: data.currentOperationStep as string || "派单",
      remark: data.currentOperationStep as string ? `当前处理人：${Array.isArray(data.currentOperators) ? (data.currentOperators as string[]).join('、') : data.currentOperator}` : "",
    },
    ...((data as Record<string, unknown>).flowHistory as FlowRecord[] | undefined) || [],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-[800px] max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">流转流程</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 选项卡 */}
        <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-200 bg-gray-50">
          <button className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">商情详情</button>
          <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">流转流程</button>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {flowProcesses.map((process, index) => (
              <div key={process.id} className="relative">
                {index < flowProcesses.length - 1 && (
                  <div className="absolute left-2 top-8 bottom-0 w-0.5 bg-gray-200" />
                )}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow" />
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="text-sm text-gray-900 mb-2 font-medium">{process.time}</div>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">操作人：</span>
                          <span className="text-gray-900">{process.operator}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">执行操作：</span>
                          <span className="text-gray-900">{process.action}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">操作前状态：</span>
                          <span className="text-gray-900">{process.fromRole}</span>
                        </div>
                        <div className="col-span-3">
                          <span className="text-gray-500">操作后状态：</span>
                          <span className="text-gray-900">{process.toRole}</span>
                        </div>
                      </div>
                      {process.remark && (
                        <div className="mt-3 text-sm">
                          <span className="text-gray-500">备注：</span>
                          <p className="text-gray-900 mt-1 leading-relaxed">{process.remark}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex items-center justify-center gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Button variant="default" size="sm" onClick={onClose}>确定</Button>
          {data.businessInfoStatus === "未处理" && (
            <>
              <Button variant="default" size="sm">关联商机</Button>
              <Button variant="default" size="sm">创建商机</Button>
              <Button variant="outline" size="sm">回退集团</Button>
              <Button variant="outline" size="sm">取回</Button>
            </>
          )}
          <Button variant="outline" size="sm" onClick={onClose}>关闭</Button>
        </div>
      </div>
    </div>
  );
}
