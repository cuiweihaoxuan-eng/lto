import React, { useState } from "react";
import { X, Link2 } from "lucide-react";
import { Button } from "./ui/button";
import { TabNav } from "./ui/tab-nav";

interface FixedAsset {
  id: string;
  // 资产基本信息
  assetName: string;
  assetCardNo: string;        // 资产编码（12位）
  sapAssetClass: string;       // 资产分类 + 资产目录
  specModel: string;           // 型号
  assetNature: string;         // 资产状态
  capitalizationDate: string;  // 资本化日期
  useYears: string;            // 使用年限
  isOverdue: string;           // 是否逾龄
  purchaseAmount: string;      // 原值
  depreciationAmount: string;  // 净值
  assetCustodianCode: string;  // 资产保管员工号
  assetCustodianName: string;  // 资产保管员名称
  isClientAsset: string;       // 是否客户端资产
  assetLocation: string;       // 地点

  // 工程信息
  investmentProjectCode: string;   // 投资主项编码
  investmentProjectName: string;   // 投资主项名称
  investmentMajorSpecialty: string; // 投资一级专业
  investmentMinorSpecialty: string; // 投资二级专业
  useDepartment: string;           // 使用部门
  companyCode: string;             // 公司代码
  profitCenterCode: string;        // 利润中心
  profitCenterName: string;        // 利润中心名称
  profitCenterGroupCode: string;   // 利润中心组编码
  profitCenterGroup: string;       // 利润中心组
  cityName: string;
  accountingPeriod: string;        // 账期
  assetCount: string;              // 数量
  assetCategory: string;           // 资产分类
  assetCatalog: string;            // 资产目录

  // ICT项目/协议信息
  protocolProjectCode: string;     // 协议级项目编码
  protocolProjectName: string;     // 协议级项目名称
  contractCode: string;            // 合同编码
  contractName: string;            // 合同名称
  contractSignDate: string;        // 合同签约日期
  contractStartDate: string;       // 合同履约开始日期
  contractEndDate: string;         // 合同履约结束日期
  contractYears: string;           // 合同期限（年）
  customerCode: string;            // 客户P码
  customerName: string;            // 客户名称
  customerManager: string;
  projectManager: string;
  assetUsageAddress: string;
  expectedRenewal: string;
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
              { id: "basic", label: "资产基本信息" },
              { id: "project", label: "工程信息" },
              { id: "ict", label: "ICT项目信息" }
            ]}
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as "basic" | "project" | "ict")}
          />
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-auto p-6">
          {/* ========== 资产基本信息 Tab ========== */}
          {activeTab === "basic" && (
            <div className="grid grid-cols-3 gap-x-6 gap-y-3">
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">资产名称：</span>
                <span className="text-sm font-medium text-gray-900">{asset.assetName || "-"}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">资产编码：</span>
                <span className="text-sm font-medium text-gray-900">{asset.assetCardNo || "-"}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">资产分类：</span>
                <span className="text-sm font-medium text-gray-900">{asset.assetCategory || "-"}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">资产目录：</span>
                <span className="text-sm font-medium text-gray-900">{asset.assetCatalog || "-"}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">型号：</span>
                <span className="text-sm font-medium text-gray-900">{asset.specModel || "-"}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">资产状态：</span>
                <span className={`text-sm font-medium ${asset.assetNature === "报废" ? "text-red-600" : "text-blue-600"}`}>{asset.assetNature || "-"}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">资本化日期：</span>
                <span className="text-sm font-medium text-gray-900">{asset.capitalizationDate || "-"}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">使用年限：</span>
                <span className="text-sm font-medium text-gray-900">{asset.useYears ? `${asset.useYears}年` : "-"}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">是否逾龄：</span>
                <span className={`text-sm font-medium ${asset.isOverdue === "是" ? "text-red-600" : "text-green-600"}`}>{asset.isOverdue || "-"}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">原值：</span>
                <span className="text-sm font-medium text-gray-900">{asset.purchaseAmount || "-"}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">净值：</span>
                <span className="text-sm font-medium text-gray-900">{asset.depreciationAmount || "-"}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">数量：</span>
                <span className="text-sm font-medium text-gray-900">{asset.assetCount || "-"}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">资产保管员：</span>
                <span className="text-sm font-medium text-gray-900">{asset.assetCustodianName || "-"}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">资产保管员工号：</span>
                <span className="text-sm font-medium text-gray-900">{asset.assetCustodianCode || "-"}</span>
              </div>
              <div className="flex items-center col-span-3">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">地点：</span>
                <span className="text-sm font-medium text-gray-900">{asset.assetLocation || "-"}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">是否客户端资产：</span>
                <span className="text-sm font-medium text-gray-900">{asset.isClientAsset || "-"}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-28 flex-shrink-0">账期：</span>
                <span className="text-sm font-medium text-gray-900">{asset.accountingPeriod || "-"}</span>
              </div>
            </div>
          )}

          {/* ========== 工程信息 Tab ========== */}
          {activeTab === "project" && (
            <div className="grid grid-cols-3 gap-x-6 gap-y-3">
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-32 flex-shrink-0">投资主项编码：</span>
                <span className="text-sm font-medium text-gray-900">{asset.investmentProjectCode || "-"}</span>
              </div>
              <div className="flex items-center col-span-2">
                <span className="text-sm text-gray-500 w-32 flex-shrink-0">投资主项名称：</span>
                <span className="text-sm font-medium text-gray-900">{asset.investmentProjectName || "-"}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-32 flex-shrink-0">投资一级专业：</span>
                <span className="text-sm font-medium text-gray-900">{asset.investmentMajorSpecialty || "-"}</span>
              </div>
              <div className="flex items-center col-span-2">
                <span className="text-sm text-gray-500 w-32 flex-shrink-0">投资二级专业：</span>
                <span className="text-sm font-medium text-gray-900">{asset.investmentMinorSpecialty || "-"}</span>
              </div>
              <div className="flex items-center col-span-3">
                <span className="text-sm text-gray-500 w-32 flex-shrink-0">使用部门：</span>
                <span className="text-sm font-medium text-gray-900">{asset.useDepartment || "-"}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-32 flex-shrink-0">公司代码：</span>
                <span className="text-sm font-medium text-gray-900">{asset.companyCode || "-"}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-32 flex-shrink-0">利润中心组编码：</span>
                <span className="text-sm font-medium text-gray-900">{asset.profitCenterGroupCode || "-"}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-32 flex-shrink-0">利润中心组：</span>
                <span className="text-sm font-medium text-gray-900">{asset.profitCenterGroup || "-"}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-32 flex-shrink-0">利润中心：</span>
                <span className="text-sm font-medium text-gray-900">{asset.profitCenterCode || "-"}</span>
              </div>
              <div className="flex items-center col-span-2">
                <span className="text-sm text-gray-500 w-32 flex-shrink-0">利润中心名称：</span>
                <span className="text-sm font-medium text-gray-900">{asset.profitCenterName || "-"}</span>
              </div>
              <div className="flex items-center col-span-3">
                <span className="text-sm text-gray-500 w-32 flex-shrink-0">地市：</span>
                <span className="text-sm font-medium text-gray-900">{asset.cityName || "-"}</span>
              </div>
            </div>
          )}

          {/* ========== ICT项目信息 Tab ========== */}
          {activeTab === "ict" && (
            <div className="space-y-6">
              {/* 项目1 - 协议级项目信息 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-800 mb-4 flex items-center">
                  <span className="w-1 h-4 bg-blue-500 rounded mr-2"></span>
                  协议级项目信息
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 w-32 flex-shrink-0">协议级项目编码：</span>
                    <span className="text-sm font-medium text-gray-900">{asset.protocolProjectCode || "-"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 w-32 flex-shrink-0">协议级项目名称：</span>
                    <span className="text-sm font-medium text-gray-900">{asset.protocolProjectName || "-"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 w-32 flex-shrink-0">客户P码：</span>
                    <span className="text-sm font-medium text-gray-900">{asset.customerCode || "-"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 w-32 flex-shrink-0">客户名称：</span>
                    <span className="text-sm font-medium text-gray-900">{asset.customerName || "-"}</span>
                  </div>
                </div>
              </div>

              {/* 项目2 - 合同信息 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-800 mb-4 flex items-center">
                  <span className="w-1 h-4 bg-blue-500 rounded mr-2"></span>
                  合同信息
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 w-32 flex-shrink-0">合同编码：</span>
                    <span className="text-sm font-medium text-gray-900">{asset.contractCode || "-"}</span>
                  </div>
                  <div className="flex items-center col-span-2">
                    <span className="text-sm text-gray-500 w-32 flex-shrink-0">合同名称：</span>
                    <span className="text-sm font-medium text-gray-900">{asset.contractName || "-"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 w-32 flex-shrink-0">合同签约日期：</span>
                    <span className="text-sm font-medium text-gray-900">{asset.contractSignDate || "-"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 w-32 flex-shrink-0">合同履约开始日期：</span>
                    <span className="text-sm font-medium text-gray-900">{asset.contractStartDate || "-"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 w-32 flex-shrink-0">合同履约结束日期：</span>
                    <span className="text-sm font-medium text-gray-900">{asset.contractEndDate || "-"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 w-32 flex-shrink-0">合同期限（年）：</span>
                    <span className="text-sm font-medium text-gray-900">{asset.contractYears || "-"}</span>
                  </div>
                </div>
              </div>

              {/* 项目3 - 人员信息 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-800 mb-4 flex items-center">
                  <span className="w-1 h-4 bg-blue-500 rounded mr-2"></span>
                  人员信息
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <div className="flex items-center col-span-2">
                    <span className="text-sm text-gray-500 w-32 flex-shrink-0">客户经理：</span>
                    <span className="text-sm font-medium text-gray-900">{asset.customerManager || "-"}</span>
                  </div>
                  <div className="flex items-center col-span-2">
                    <span className="text-sm text-gray-500 w-32 flex-shrink-0">项目经理：</span>
                    <span className="text-sm font-medium text-gray-900">{asset.projectManager || "-"}</span>
                  </div>
                  <div className="flex items-center col-span-2">
                    <span className="text-sm text-gray-500 w-32 flex-shrink-0">资产使用所在地址：</span>
                    <span className="text-sm font-medium text-gray-900">{asset.assetUsageAddress || "-"}</span>
                  </div>
                  <div className="flex items-center col-span-2">
                    <span className="text-sm text-gray-500 w-32 flex-shrink-0">预计是否续签：</span>
                    <span className="text-sm font-medium text-gray-900">{asset.expectedRenewal || "-"}</span>
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