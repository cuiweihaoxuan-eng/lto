import React, { useState } from "react";
import { X, ChevronDown, ChevronRight, Link2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { TabNav } from "./ui/tab-nav";

interface FixedAsset {
  id: string;
  cityCode: string;
  cityName: string;
  assetName: string;
  assetCardNo: string;
  assetNature: string;
  equipmentAmount: string;
  freezeStatus: string;
  projectCode: string;
  department: string;
  ictProjectCode: string;
  ictProjectName: string;
  contractName: string;
  contractCode: string;
  contractStartDate: string;
  contractEndDate: string;
  customerName: string;
  customerCode: string;
  customerManager: string;
  customerManagerPhone: string;
  projectManager: string;
  projectManagerPhone: string;
  contactPhone: string;
  employeeId: string;
  investmentProjectCode: string;
  sapOrderNo: string;
  purchaseOrderNo: string;
  supplierName: string;
  supplierCode: string;
  useDepartment: string;
  departmentNo: string;
  companyCode: string;
  companyName: string;
  profitCenterGroup: string;
  profitCenterGroupName: string;
  profitCenterId: string;
  profitCenter: string;
  costCenterNo: string;
  costCenter: string;
  sapAssetClass: string;
  specModel: string;
  capitalizationDate: string;
  overdueDate: string;
  purchaseAmount: string;
  depreciationAmount: string;
  "实物Class": string;
  "实物Table": string;
  assetCustodian: string;
  responsiblePerson: string;
  responsiblePersonPhone: string;
  responsiblePersonEmpId: string;
  assetUsageAddress: string;
  createTime: string;
  updateTime: string;
}

interface AssetDetailModalProps {
  open: boolean;
  onClose: () => void;
  asset: FixedAsset | null;
  onLinkProject: () => void;
}

export function AssetDetailModal({ open, onClose, asset, onLinkProject }: AssetDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"basic" | "project" | "ict">("basic");

  if (!open || !asset) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
        {/* 标题栏 */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h3 className="text-lg font-medium text-gray-900">资产详情</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab页签 */}
        <div className="px-6 py-3 border-b border-gray-200 flex-shrink-0">
          <TabNav
            style="underline"
            tabs={[
              { id: "basic", label: "基本信息" },
              { id: "project", label: "工程信息" },
              { id: "ict", label: "ICT项目信息" }
            ]}
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as "basic" | "project" | "ict")}
          />
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-auto p-6">
          {/* ========== 基本信息 Tab ========== */}
          {activeTab === "basic" && (
            <div className="grid grid-cols-3 gap-x-6 gap-y-3">
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-24 flex-shrink-0">资产名称：</span>
                <span className="text-sm font-medium text-gray-900">{asset.assetName}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-24 flex-shrink-0">资产卡片号：</span>
                <span className="text-sm font-medium text-gray-900">{asset.assetCardNo}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-24 flex-shrink-0">SAP资产分类：</span>
                <span className="text-sm font-medium text-gray-900">{asset.sapAssetClass}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-24 flex-shrink-0">规格程式：</span>
                <span className="text-sm font-medium text-gray-900">{asset.specModel}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-24 flex-shrink-0">资产性质：</span>
                <span className="text-sm font-medium text-gray-900">{asset.assetNature}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-24 flex-shrink-0">资本化日期：</span>
                <span className="text-sm font-medium text-gray-900">{asset.capitalizationDate}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-24 flex-shrink-0">逾龄日期：</span>
                <span className="text-sm font-medium text-gray-900">{asset.overdueDate}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-24 flex-shrink-0">设备采购金额：</span>
                <span className="text-sm font-medium text-gray-900">{asset.purchaseAmount}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-24 flex-shrink-0">折旧金额：</span>
                <span className="text-sm font-medium text-gray-900">{asset.depreciationAmount}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-24 flex-shrink-0">冻结状态：</span>
                <span className={`text-sm font-medium ${asset.freezeStatus === "是" ? "text-red-600" : "text-green-600"}`}>{asset.freezeStatus}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-24 flex-shrink-0">对应实物Class：</span>
                <span className="text-sm font-medium text-gray-900">{asset["实物Class"]}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-24 flex-shrink-0">对应实物Table：</span>
                <span className="text-sm font-medium text-gray-900">{asset["实物Table"]}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-24 flex-shrink-0">资产保管员：</span>
                <span className="text-sm font-medium text-gray-900">{asset.assetCustodian}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-24 flex-shrink-0">责任人：</span>
                <span className="text-sm font-medium text-gray-900">{asset.responsiblePerson}</span>
              </div>
            </div>
          )}

          {/* ========== 工程信息 Tab ========== */}
          {activeTab === "project" && (
            <div className="grid grid-cols-3 gap-x-6 gap-y-3">
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">投资工程编码：</span>
                <span className="text-sm font-medium text-gray-900">{asset.investmentProjectCode}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">SAP订单号：</span>
                <span className="text-sm font-medium text-gray-900">{asset.sapOrderNo}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">采购订单编号：</span>
                <span className="text-sm font-medium text-gray-900">{asset.purchaseOrderNo}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">供应商名称：</span>
                <span className="text-sm font-medium text-gray-900">{asset.supplierName}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">供应商编码：</span>
                <span className="text-sm font-medium text-gray-900">{asset.supplierCode}</span>
              </div>
              <div className="flex items-center col-span-3">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">使用部门：</span>
                <span className="text-sm font-medium text-gray-900">{asset.useDepartment}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">部门编号：</span>
                <span className="text-sm font-medium text-gray-900">{asset.departmentNo}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">公司司代码：</span>
                <span className="text-sm font-medium text-gray-900">{asset.companyCode}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">公司名称：</span>
                <span className="text-sm font-medium text-gray-900">{asset.companyName}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">地市编码：</span>
                <span className="text-sm font-medium text-gray-900">{asset.cityCode}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">地市名称：</span>
                <span className="text-sm font-medium text-gray-900">{asset.cityName}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">利润中心组：</span>
                <span className="text-sm font-medium text-gray-900">{asset.profitCenterGroup}</span>
              </div>
              <div className="flex items-center col-span-3">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">利润中心组名称：</span>
                <span className="text-sm font-medium text-gray-900">{asset.profitCenterGroupName}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">利润中心ID：</span>
                <span className="text-sm font-medium text-gray-900">{asset.profitCenterId}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">利润中心：</span>
                <span className="text-sm font-medium text-gray-900">{asset.profitCenter}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">成本中心编号：</span>
                <span className="text-sm font-medium text-gray-900">{asset.costCenterNo}</span>
              </div>
              <div className="flex items-center col-span-3">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">成本中心：</span>
                <span className="text-sm font-medium text-gray-900">{asset.costCenter}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">创建时间：</span>
                <span className="text-sm font-medium text-gray-900">{asset.createTime}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">更新时间：</span>
                <span className="text-sm font-medium text-gray-900">{asset.updateTime}</span>
              </div>
            </div>
          )}

          {/* ========== ICT项目信息 Tab ========== */}
          {activeTab === "ict" && (
            <div className="space-y-6">
              {/* 项目1 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-800 mb-4 flex items-center">
                  <span className="w-1 h-4 bg-blue-500 rounded mr-2"></span>
                  项目信息
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 w-28 flex-shrink-0">ICT项目名称：</span>
                    <span className="text-sm font-medium text-gray-900">{asset.ictProjectName || "-" }</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 w-28 flex-shrink-0">ICT项目编码：</span>
                    <span className="text-sm font-medium text-gray-900">{asset.ictProjectCode || "-"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 w-28 flex-shrink-0">合同名称：</span>
                    <span className="text-sm font-medium text-gray-900">{asset.contractName || "-"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 w-28 flex-shrink-0">合同编码：</span>
                    <span className="text-sm font-medium text-gray-900">{asset.contractCode || "-"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 w-28 flex-shrink-0">合同开始时间：</span>
                    <span className="text-sm font-medium text-gray-900">{asset.contractStartDate || "-"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 w-28 flex-shrink-0">合同到期时间：</span>
                    <span className="text-sm font-medium text-gray-900">{asset.contractEndDate || "-"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 w-28 flex-shrink-0">客户名称：</span>
                    <span className="text-sm font-medium text-gray-900">{asset.customerName || "-"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 w-28 flex-shrink-0">客户编码：</span>
                    <span className="text-sm font-medium text-gray-900">{asset.customerCode || "-"}</span>
                  </div>
                  <div className="flex items-center col-span-2">
                    <span className="text-sm text-gray-500 w-28 flex-shrink-0">客户经理：</span>
                    <span className="text-sm font-medium text-gray-900">{asset.customerManager || "-"}</span>
                  </div>
                  <div className="flex items-center col-span-2">
                    <span className="text-sm text-gray-500 w-28 flex-shrink-0">项目经理：</span>
                    <span className="text-sm font-medium text-gray-900">{asset.projectManager || "-"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 w-28 flex-shrink-0">资产使用所在地址：</span>
                    <span className="text-sm font-medium text-gray-900">{asset.assetUsageAddress || "-"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 w-28 flex-shrink-0">预计是否续签：</span>
                    <span className="text-sm font-medium text-gray-900">-</span>
                  </div>
                </div>
              </div>

              {/* 关联新项目按钮 */}
              <div className="flex justify-center">
                <Button className="gap-1" onClick={onLinkProject}>
                  <Link2 className="w-4 h-4" />
                  关联新项目
                </Button>
              </div>
            </div>
          )}
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