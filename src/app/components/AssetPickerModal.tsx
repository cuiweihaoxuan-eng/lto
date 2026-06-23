import React, { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { mockAssets } from "./FixedAssets";

interface AssetPickerModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (assets: typeof mockAssets) => void;
  existingAssetIds: string[];
}

export function AssetPickerModal({ open, onClose, onConfirm, existingAssetIds }: AssetPickerModalProps) {
  const [searchCity, setSearchCity] = useState("");
  const [searchAssetName, setSearchAssetName] = useState("");
  const [searchAssetCardNo, setSearchAssetCardNo] = useState("");
  const [searchAssetNature, setSearchAssetNature] = useState<string>("全部");
  const [searchProjectCode, setSearchProjectCode] = useState("");
  const [searchProtocolProjectCode, setSearchProtocolProjectCode] = useState("");
  const [searchProtocolProjectName, setSearchProtocolProjectName] = useState("");
  const [searchContractName, setSearchContractName] = useState("");
  const [searchContractCode, setSearchContractCode] = useState("");
  const [searchCustodianName, setSearchCustodianName] = useState("");

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (open) {
      setSelectedIds(new Set());
      setCurrentPage(1);
    }
  }, [open]);

  // 筛选数据
  const filteredData = mockAssets.filter(asset => {
    if (searchCity && !asset.cityName.includes(searchCity)) return false;
    if (searchAssetName && !asset.assetName.includes(searchAssetName)) return false;
    if (searchAssetCardNo && !asset.assetCardNo.includes(searchAssetCardNo)) return false;
    if (searchAssetNature !== "全部" && asset.assetNature !== searchAssetNature) return false;
    if (searchProjectCode && !asset.projectCode.includes(searchProjectCode)) return false;
    if (searchProtocolProjectCode && !asset.protocolProjectCode.includes(searchProtocolProjectCode)) return false;
    if (searchProtocolProjectName && !asset.protocolProjectName.includes(searchProtocolProjectName)) return false;
    if (searchContractName && !asset.contractName.includes(searchContractName)) return false;
    if (searchContractCode && !asset.contractCode.includes(searchContractCode)) return false;
    if (searchCustodianName && !asset.assetCustodianName.includes(searchCustodianName)) return false;
    return true;
  });

  // 分页
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredData.length);
  const currentPageAssets = filteredData.slice(startIndex, endIndex);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === currentPageAssets.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(currentPageAssets.map(a => a.id)));
    }
  };

  const handleConfirm = () => {
    const selectedAssets = mockAssets.filter(a => selectedIds.has(a.id));
    onConfirm(selectedAssets);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl mx-4 max-h-[90vh] flex flex-col">
        {/* 标题栏 */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h3 className="text-lg font-medium text-gray-900">添加资产</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 查询条件 */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="grid grid-cols-4 gap-x-4 gap-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">地市</label>
              <Input size="sm" placeholder="请输入" value={searchCity} onChange={e => setSearchCity(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">资产名称</label>
              <Input size="sm" placeholder="请输入" value={searchAssetName} onChange={e => setSearchAssetName(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">卡片号</label>
              <Input size="sm" placeholder="请输入" value={searchAssetCardNo} onChange={e => setSearchAssetCardNo(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">资产性质</label>
              <Select value={searchAssetNature} onValueChange={setSearchAssetNature}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="全部">全部</SelectItem>
                  <SelectItem value="生产用">生产用</SelectItem>
                  <SelectItem value="利旧回收">利旧回收</SelectItem>
                  <SelectItem value="报废">报废</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">工程编码</label>
              <Input size="sm" placeholder="请输入" value={searchProjectCode} onChange={e => setSearchProjectCode(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">协议级项目编码</label>
              <Input size="sm" placeholder="请输入" value={searchProtocolProjectCode} onChange={e => setSearchProtocolProjectCode(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">合同编码</label>
              <Input size="sm" placeholder="请输入" value={searchContractCode} onChange={e => setSearchContractCode(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">资产保管员</label>
              <Input size="sm" placeholder="请输入" value={searchCustodianName} onChange={e => setSearchCustodianName(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-200">
            <Button variant="outline" size="sm" onClick={() => {
              setSearchCity(""); setSearchAssetName(""); setSearchAssetCardNo("");
              setSearchAssetNature("全部"); setSearchProjectCode(""); setSearchProtocolProjectCode("");
              setSearchContractCode(""); setSearchCustodianName("");
            }}>
              重置
            </Button>
            <Button size="sm" onClick={() => setCurrentPage(1)}>
              <Search className="w-3 h-3 mr-1" />
              查询
            </Button>
          </div>
        </div>

        {/* 表格 */}
        <div className="flex-1 overflow-auto px-6 py-3">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-10">
                  <input type="checkbox" checked={selectedIds.size === currentPageAssets.length && currentPageAssets.length > 0} onChange={toggleSelectAll} />
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">资产名称</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-32">卡片号</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-20">资产性质</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-20">地市</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-600 w-24">设备金额</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-32">协议级项目编码</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">协议级项目名称</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">合同名称</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-20">资产保管员</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-600 w-20">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentPageAssets.map(asset => {
                const isExisting = existingAssetIds.includes(asset.id);
                return (
                  <tr key={asset.id} className={`hover:bg-gray-50 ${isExisting ? 'bg-gray-50' : ''}`}>
                    <td className="px-3 py-2">
                      <input type="checkbox" checked={selectedIds.has(asset.id)} onChange={() => toggleSelect(asset.id)} disabled={isExisting} />
                    </td>
                    <td className="px-3 py-2 max-w-32 truncate" title={asset.assetName}>{asset.assetName}</td>
                    <td className="px-3 py-2">{asset.assetCardNo}</td>
                    <td className="px-3 py-2">
                      <Badge className={
                        asset.assetNature === "生产用" ? "bg-blue-100 text-blue-700" :
                        asset.assetNature === "利旧回收" ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }>{asset.assetNature}</Badge>
                    </td>
                    <td className="px-3 py-2">{asset.cityName}</td>
                    <td className="px-3 py-2 text-right">{asset.equipmentAmount}</td>
                    <td className="px-3 py-2">{asset.protocolProjectCode}</td>
                    <td className="px-3 py-2 max-w-32 truncate" title={asset.protocolProjectName}>{asset.protocolProjectName}</td>
                    <td className="px-3 py-2 max-w-32 truncate" title={asset.contractName}>{asset.contractName}</td>
                    <td className="px-3 py-2">{asset.assetCustodianName}</td>
                    <td className="px-3 py-2 text-center">
                      {isExisting ? <Badge className="bg-gray-100 text-gray-500">已添加</Badge> : <Badge className="bg-green-100 text-green-700">未添加</Badge>}
                    </td>
                  </tr>
                );
              })}
              {currentPageAssets.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-3 py-8 text-center text-gray-500">
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        <div className="px-6 py-3 border-t border-gray-200 flex justify-between items-center flex-shrink-0">
          <div className="text-sm text-gray-600">
            已选 <span className="text-blue-600 font-medium">{selectedIds.size}</span> 项，共 {filteredData.length} 条
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              第 {currentPage} / {totalPages || 1} 页
            </span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>首页</Button>
              <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>上一页</Button>
              <Button variant="outline" size="sm" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)}>下一页</Button>
              <Button variant="outline" size="sm" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(totalPages)}>末页</Button>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleConfirm} disabled={selectedIds.size === 0}>
            确定添加 ({selectedIds.size})
          </Button>
        </div>
      </div>
    </div>
  );
}