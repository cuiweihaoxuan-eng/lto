import React from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface FixedAsset {
  id: string;
  assetName: string;
  assetCardNo: string;
  sapAssetClass: string;
  capitalizationDate: string;
  overdueDate: string;
  purchaseAmount: string;
  depreciationAmount: string;
  responsiblePerson: string;
  projectCode: string;
  ictProjectCode: string;
}

interface AssetRecoveryPlanListModalProps {
  open: boolean;
  onClose: () => void;
  assets: FixedAsset[];
}

export function AssetRecoveryPlanListModal({ open, onClose, assets }: AssetRecoveryPlanListModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[80vh] flex flex-col">
        {/* 标题栏 */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h3 className="text-lg font-medium text-gray-900">资产回收计划资产清单</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 表格 */}
        <div className="flex-1 overflow-auto p-6">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-10">序号</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">资产名称</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">资产卡片号</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">SAP资产分类</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-600">资本化日期</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-600">逾龄日期</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">设备采购金额</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">折旧金额</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">责任人</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">工程编码</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">ICT项目编码</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {assets.map((asset, idx) => (
                <tr key={asset.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">{idx + 1}</td>
                  <td className="px-3 py-2 max-w-32 truncate" title={asset.assetName}>{asset.assetName}</td>
                  <td className="px-3 py-2">{asset.assetCardNo}</td>
                  <td className="px-3 py-2 max-w-32 truncate" title={asset.sapAssetClass}>{asset.sapAssetClass}</td>
                  <td className="px-3 py-2 text-center">{asset.capitalizationDate}</td>
                  <td className="px-3 py-2 text-center">{asset.overdueDate}</td>
                  <td className="px-3 py-2 text-right">{asset.purchaseAmount}</td>
                  <td className="px-3 py-2 text-right">{asset.depreciationAmount}</td>
                  <td className="px-3 py-2">{asset.responsiblePerson}</td>
                  <td className="px-3 py-2">{asset.projectCode}</td>
                  <td className="px-3 py-2">{asset.ictProjectCode}</td>
                </tr>
              ))}
              {assets.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-3 py-4 text-center text-gray-500">
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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