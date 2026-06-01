import React from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface AssetSelectModalProps {
  open: boolean;
  onClose: () => void;
  onSelectSelected: () => void;
  onSelectSameIct: () => void;
  selectedCount: number;
  ictProjectName: string;
}

export function AssetSelectModal({ open, onClose, onSelectSelected, onSelectSameIct, selectedCount, ictProjectName }: AssetSelectModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* 标题栏 */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">选择资产</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-700 mb-3">
              已选择 <span className="font-medium">{selectedCount}</span> 项资产
            </p>
            <div className="space-y-3">
              {/* 选项1：使用勾选资产 */}
              <div
                className="p-3 bg-white rounded border border-blue-200 cursor-pointer hover:border-blue-400 hover:bg-blue-50"
                onClick={onSelectSelected}
              >
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded border-2 border-blue-500 bg-blue-500 flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">使用勾选资产</div>
                    <div className="text-xs text-gray-500 mt-1">将已选择的 {selectedCount} 项资产添加到清单中</div>
                  </div>
                </div>
              </div>

              {/* 选项2：同ICT项目所有资产 */}
              <div
                className="p-3 bg-white rounded border border-blue-200 cursor-pointer hover:border-blue-400 hover:bg-blue-50"
                onClick={onSelectSameIct}
              >
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded border-2 border-blue-500 bg-blue-500 flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">同ICT项目所有资产</div>
                    <div className="text-xs text-gray-500 mt-1">自动带出同ICT项目「{ictProjectName || '当前项目'}」下的所有资产</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
        </div>
      </div>
    </div>
  );
}