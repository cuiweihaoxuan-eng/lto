import React, { useState, useEffect } from "react";
import { X, Trash2, Upload, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { AssetPickerModal } from "./AssetPickerModal";

interface FixedAsset {
  id: string;
  cityName?: string;
  assetName: string;
  assetCardNo: string;
  assetNature: string;
  equipmentAmount?: string;
  sapAssetClass?: string;
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
  projectCode: string;
  ictProjectCode?: string;
  protocolProjectCode?: string;
  ictProjectName?: string;
  protocolProjectName?: string;
  contractCode?: string;
  contractName?: string;
  contractEndDate?: string;
  customerName?: string;
}

interface AssetRecoveryPlanModalProps {
  open: boolean;
  onClose: () => void;
  selectedAssets: FixedAsset[];
}

export function AssetRecoveryPlanModal({ open, onClose, selectedAssets }: AssetRecoveryPlanModalProps) {
  const [expectedDate, setExpectedDate] = useState("");
  const [scenePhoto, setScenePhoto] = useState("");
  const [storageLocation, setStorageLocation] = useState("");
  const [warehouseKeeper, setWarehouseKeeper] = useState("");
  const [assetList, setAssetList] = useState<FixedAsset[]>(selectedAssets);
  const [pickerOpen, setPickerOpen] = useState(false);

  // 当selectedAssets变化时同步更新assetList
  useEffect(() => {
    setAssetList(selectedAssets);
  }, [selectedAssets]);

  // 添加资产
  const handleAddAssets = (newAssets: FixedAsset[]) => {
    // 合并去重
    const existingIds = new Set(assetList.map(a => a.id));
    const filteredNew = newAssets.filter(a => !existingIds.has(a.id));
    setAssetList(prev => [...prev, ...filteredNew]);
    setPickerOpen(false);
  };

  // 计算总金额和折旧金额
  const totalAmount = assetList.reduce((sum, asset) => {
    return sum + parseFloat(asset.purchaseAmount.replace(/,/g, '') || '0');
  }, 0);

  const totalDepreciation = assetList.reduce((sum, asset) => {
    return sum + parseFloat(asset.depreciationAmount.replace(/,/g, '') || '0');
  }, 0);

  const removeAsset = (id: string) => {
    setAssetList(prev => prev.filter(a => a.id !== id));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
        {/* 标题栏 */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h3 className="text-lg font-medium text-gray-900">新增资产回收计划</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 提示信息 */}
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 flex-shrink-0">
          <p className="text-sm text-blue-700">
            清单范围：勾选资产可添加到资产回收计划中生成资产回收计划
          </p>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* 基本信息 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-800 mb-4 flex items-center">
              <span className="w-1 h-4 bg-blue-500 rounded mr-2"></span>
              基本信息
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">预计回收日期</label>
                <Input type="date" value={expectedDate} onChange={e => setExpectedDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">现场照片</label>
                <div className="flex gap-2">
                  <Input placeholder="点击上传" value={scenePhoto} onChange={e => setScenePhoto(e.target.value)} readOnly className="flex-1" />
                  <Button variant="outline" size="sm" onClick={() => alert('上传照片')}>
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">选择新存放地点</label>
                <Input placeholder="请输入" value={storageLocation} onChange={e => setStorageLocation(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">仓库保管员</label>
                <Input placeholder="请输入" value={warehouseKeeper} onChange={e => setWarehouseKeeper(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">总金额</label>
                <Input value={totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">当前折旧总金额</label>
                <Input value={totalDepreciation.toLocaleString('zh-CN', { minimumFractionDigits: 2 })} readOnly />
              </div>
            </div>
          </div>

          {/* 交接资产清单 */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700 flex items-center">
                <span className="w-1 h-4 bg-blue-500 rounded mr-2"></span>
                交接资产清单
                <span className="ml-2 text-xs text-gray-500">（共 {assetList.length} 项）</span>
              </div>
              <Button variant="outline" size="sm" className="gap-1" onClick={() => setPickerOpen(true)}>
                <Plus className="w-3 h-3" />
                添加资产
              </Button>
            </div>
            <div className="overflow-x-auto max-h-64">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
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
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-20">资产保管员</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-600 w-16">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {assetList.map((asset, idx) => (
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
                      <td className="px-3 py-2">{asset.assetCustodianName || asset.responsiblePerson}</td>
                      <td className="px-3 py-2 text-center">
                        <Button variant="link" size="sm" className="text-red-600 h-auto p-0" onClick={() => removeAsset(asset.id)}>
                          <Trash2 className="w-3 h-3 mr-1" />
                          删除
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {assetList.length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-3 py-4 text-center text-gray-500">
                        暂无资产
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => alert('提交资产回收计划')}>
            提交
          </Button>
        </div>
      </div>

      {/* 资产选择弹窗 */}
      <AssetPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onConfirm={handleAddAssets}
        existingAssetIds={assetList.map(a => a.id)}
      />
    </div>
  );
}