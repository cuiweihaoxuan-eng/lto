import React from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface FixedAsset {
  id: string;
  cityName: string;
  assetName: string;
  assetCardNo: string;
  assetNature: string;
  equipmentAmount: string;
  projectCode: string;
  sapAssetClass?: string;       // 兼容旧字段名（实际为assetCategory）
  assetCategory?: string;
  assetCatalog?: string;
  capitalizationDate?: string;
  overdueDate?: string;
  useYears?: string;
  isOverdue?: string;
  purchaseAmount: string;
  depreciationAmount: string;
  responsiblePerson?: string;
  assetCustodianName?: string;
  ictProjectCode?: string;
  protocolProjectCode?: string;
  ictProjectName?: string;
  protocolProjectName?: string;
  contractCode: string;
  contractName: string;
  contractEndDate: string;
  customerName: string;
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl mx-4 max-h-[80vh] flex flex-col">
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
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-20">地市</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">资产名称</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-32">卡片号</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-20">资产性质</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-600 w-24">设备金额</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-28">工程编码</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-32">协议级项目编码</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">协议级项目名称</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">合同名称</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-32">合同编码</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-600 w-24">合同到期时间</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-24">客户名称</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-20">资产保管员</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {assets.map((asset, idx) => (
                <tr key={asset.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">{idx + 1}</td>
                  <td className="px-3 py-2">{asset.cityName}</td>
                  <td className="px-3 py-2 max-w-32 truncate" title={asset.assetName}>{asset.assetName}</td>
                  <td className="px-3 py-2">{asset.assetCardNo}</td>
                  <td className="px-3 py-2">{asset.assetNature}</td>
                  <td className="px-3 py-2 text-right">{asset.equipmentAmount}</td>
                  <td className="px-3 py-2">{asset.projectCode}</td>
                  <td className="px-3 py-2">{asset.protocolProjectCode || asset.ictProjectCode}</td>
                  <td className="px-3 py-2 max-w-32 truncate" title={asset.protocolProjectName || asset.ictProjectName}>{asset.protocolProjectName || asset.ictProjectName}</td>
                  <td className="px-3 py-2 max-w-32 truncate" title={asset.contractName}>{asset.contractName}</td>
                  <td className="px-3 py-2">{asset.contractCode}</td>
                  <td className="px-3 py-2 text-center">{asset.contractEndDate}</td>
                  <td className="px-3 py-2 max-w-24 truncate" title={asset.customerName}>{asset.customerName}</td>
                  <td className="px-3 py-2">{asset.assetCustodianName || asset.responsiblePerson}</td>
                </tr>
              ))}
              {assets.length === 0 && (
                <tr>
                  <td colSpan={14} className="px-3 py-4 text-center text-gray-500">
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