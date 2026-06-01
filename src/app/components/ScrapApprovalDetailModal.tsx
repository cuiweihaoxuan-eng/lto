import React from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface ScrapApprovalDetailModalProps {
  open: boolean;
  onClose: () => void;
}

export function ScrapApprovalDetailModal({ open, onClose }: ScrapApprovalDetailModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        {/* 标题栏 */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h3 className="text-lg font-medium text-gray-900">报废审批流程</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 审批流程内容 */}
        <div className="flex-1 overflow-auto p-6 space-y-4">
          {/* 审批节点1 - 已通过 */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-sm font-medium text-gray-700">发起申请</h5>
              <Badge className="bg-green-100 text-green-700">已通过</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="text-gray-500">审批人：</span>
                  <span className="font-medium">张明</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">审批时间：</span>
                  <span className="font-medium">2026-05-16 10:00</span>
                </div>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">审批意见：</span>
                <span className="text-gray-700">设备老旧无法正常使用，申请报废处理。</span>
              </div>
            </div>
          </div>

          {/* 审批节点2 - 已通过 */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-sm font-medium text-gray-700">需求部门审批</h5>
              <Badge className="bg-green-100 text-green-700">已通过</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="text-gray-500">审批人：</span>
                  <span className="font-medium">李华（需求部门）</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">审批时间：</span>
                  <span className="font-medium">2026-05-16 14:30</span>
                </div>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">审批意见：</span>
                <span className="text-gray-700">经核实，该设备确实老旧，同意报废。</span>
              </div>
            </div>
          </div>

          {/* 审批节点3 - 审核中 */}
          <div className="bg-white rounded-lg border border-orange-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-sm font-medium text-gray-700">财务审批</h5>
              <Badge className="bg-orange-100 text-orange-700">审核中</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="text-gray-500">审批人：</span>
                  <span className="font-medium text-gray-400">待分配</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">审批时间：</span>
                  <span className="font-medium text-gray-400">-</span>
                </div>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">审批意见：</span>
                <span className="text-gray-400">-</span>
              </div>
            </div>
          </div>

          {/* 审批节点4 - 待审批 */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-sm font-medium text-gray-700">领导审批</h5>
              <Badge className="bg-gray-100 text-gray-700">待审批</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="text-gray-500">审批人：</span>
                  <span className="font-medium text-gray-400">-</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">审批时间：</span>
                  <span className="font-medium text-gray-400">-</span>
                </div>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">审批意见：</span>
                <span className="text-gray-400">-</span>
              </div>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            关闭
          </Button>
        </div>
      </div>
    </div>
  );
}