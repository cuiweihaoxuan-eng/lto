import React, { useState, useEffect } from "react";
import { Search, RefreshCw, Download, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface SubStats {
  count: number;            // 数量
  canApplyCount: number;    // 可申请数量
  canApplyAmount: string;   // 可申请金额
  appliedCount: number;     // 已申请数量
  appliedAmount: string;    // 已申请金额
  approvedCount: number;    // 审核通过数量
  approvedAmount: string;   // 审核通过金额
  actualPaidCount: number;  // 实际发放数量
  actualPaidAmount: string; // 实际发放金额
}

interface DistrictStats {
  id: string;
  accountingPeriod: string;
  businessUnit: string;
  district: string;
  project: SubStats;
  smallProduct: SubStats;
  triple: SubStats;
}

interface BranchStats {
  id: string;
  accountingPeriod: string;
  businessUnit: string;
  district: string;
  branch: string;
  project: SubStats;
  smallProduct: SubStats;
  triple: SubStats;
}

const mockStats: DistrictStats[] = [
  {
    id: "1", accountingPeriod: "2026-04", businessUnit: "杭州分公司", district: "西湖区",
    project: { count: 3, canApplyCount: 3, canApplyAmount: "120,000.00", appliedCount: 2, appliedAmount: "60,000.00", approvedCount: 2, approvedAmount: "45,000.00", actualPaidCount: 1, actualPaidAmount: "20,000.00" },
    smallProduct: { count: 5, canApplyCount: 5, canApplyAmount: "50,000.00", appliedCount: 3, appliedAmount: "25,000.00", approvedCount: 2, approvedAmount: "20,000.00", actualPaidCount: 1, actualPaidAmount: "10,000.00" },
    triple: { count: 8, canApplyCount: 8, canApplyAmount: "200,000.00", appliedCount: 5, appliedAmount: "100,000.00", approvedCount: 4, approvedAmount: "80,000.00", actualPaidCount: 2, actualPaidAmount: "40,000.00" }
  },
  {
    id: "2", accountingPeriod: "2026-04", businessUnit: "杭州分公司", district: "滨江区",
    project: { count: 2, canApplyCount: 2, canApplyAmount: "80,000.00", appliedCount: 1, appliedAmount: "30,000.00", approvedCount: 1, approvedAmount: "20,000.00", actualPaidCount: 1, actualPaidAmount: "10,000.00" },
    smallProduct: { count: 3, canApplyCount: 3, canApplyAmount: "30,000.00", appliedCount: 2, appliedAmount: "15,000.00", approvedCount: 1, approvedAmount: "12,000.00", actualPaidCount: 1, actualPaidAmount: "6,000.00" },
    triple: { count: 4, canApplyCount: 4, canApplyAmount: "100,000.00", appliedCount: 2, appliedAmount: "50,000.00", approvedCount: 2, approvedAmount: "40,000.00", actualPaidCount: 1, actualPaidAmount: "20,000.00" }
  },
  {
    id: "3", accountingPeriod: "2026-04", businessUnit: "宁波分公司", district: "鄞州区",
    project: { count: 1, canApplyCount: 1, canApplyAmount: "30,000.00", appliedCount: 1, appliedAmount: "15,000.00", approvedCount: 1, approvedAmount: "10,000.00", actualPaidCount: 1, actualPaidAmount: "5,000.00" },
    smallProduct: { count: 4, canApplyCount: 4, canApplyAmount: "40,000.00", appliedCount: 2, appliedAmount: "20,000.00", approvedCount: 2, approvedAmount: "15,000.00", actualPaidCount: 1, actualPaidAmount: "8,000.00" },
    triple: { count: 2, canApplyCount: 2, canApplyAmount: "50,000.00", appliedCount: 1, appliedAmount: "25,000.00", approvedCount: 1, approvedAmount: "20,000.00", actualPaidCount: 1, actualPaidAmount: "10,000.00" }
  },
];

// 支局级mock数据（按区县分组）
const mockBranchData: BranchStats[] = [
  // 西湖区
  { id: "b1-1", accountingPeriod: "2026-04", businessUnit: "杭州分公司", district: "西湖区", branch: "西湖支局", project: { count: 2, canApplyCount: 2, canApplyAmount: "80,000.00", appliedCount: 1, appliedAmount: "40,000.00", approvedCount: 1, approvedAmount: "30,000.00", actualPaidCount: 1, actualPaidAmount: "15,000.00" }, smallProduct: { count: 3, canApplyCount: 3, canApplyAmount: "30,000.00", appliedCount: 2, appliedAmount: "15,000.00", approvedCount: 1, approvedAmount: "12,000.00", actualPaidCount: 1, actualPaidAmount: "6,000.00" }, triple: { count: 5, canApplyCount: 5, canApplyAmount: "120,000.00", appliedCount: 3, appliedAmount: "60,000.00", approvedCount: 2, approvedAmount: "50,000.00", actualPaidCount: 1, actualPaidAmount: "25,000.00" } },
  { id: "b1-2", accountingPeriod: "2026-04", businessUnit: "杭州分公司", district: "西湖区", branch: "留下支局", project: { count: 1, canApplyCount: 1, canApplyAmount: "40,000.00", appliedCount: 1, appliedAmount: "20,000.00", approvedCount: 1, approvedAmount: "15,000.00", actualPaidCount: 0, actualPaidAmount: "0.00" }, smallProduct: { count: 2, canApplyCount: 2, canApplyAmount: "20,000.00", appliedCount: 1, appliedAmount: "10,000.00", approvedCount: 1, approvedAmount: "8,000.00", actualPaidCount: 0, actualPaidAmount: "0.00" }, triple: { count: 3, canApplyCount: 3, canApplyAmount: "80,000.00", appliedCount: 2, appliedAmount: "40,000.00", approvedCount: 2, approvedAmount: "30,000.00", actualPaidCount: 1, actualPaidAmount: "15,000.00" } },
  // 滨江区
  { id: "b2-1", accountingPeriod: "2026-04", businessUnit: "杭州分公司", district: "滨江区", branch: "滨江支局", project: { count: 1, canApplyCount: 1, canApplyAmount: "50,000.00", appliedCount: 1, appliedAmount: "20,000.00", approvedCount: 1, approvedAmount: "15,000.00", actualPaidCount: 1, actualPaidAmount: "8,000.00" }, smallProduct: { count: 2, canApplyCount: 2, canApplyAmount: "20,000.00", appliedCount: 1, appliedAmount: "10,000.00", approvedCount: 1, approvedAmount: "8,000.00", actualPaidCount: 1, actualPaidAmount: "4,000.00" }, triple: { count: 2, canApplyCount: 2, canApplyAmount: "60,000.00", appliedCount: 1, appliedAmount: "30,000.00", approvedCount: 1, approvedAmount: "25,000.00", actualPaidCount: 1, actualPaidAmount: "12,000.00" } },
  { id: "b2-2", accountingPeriod: "2026-04", businessUnit: "杭州分公司", district: "滨江区", branch: "长河支局", project: { count: 1, canApplyCount: 1, canApplyAmount: "30,000.00", appliedCount: 0, appliedAmount: "0.00", approvedCount: 0, approvedAmount: "0.00", actualPaidCount: 0, actualPaidAmount: "0.00" }, smallProduct: { count: 1, canApplyCount: 1, canApplyAmount: "10,000.00", appliedCount: 1, appliedAmount: "5,000.00", approvedCount: 0, approvedAmount: "0.00", actualPaidCount: 0, actualPaidAmount: "0.00" }, triple: { count: 2, canApplyCount: 2, canApplyAmount: "40,000.00", appliedCount: 1, appliedAmount: "20,000.00", approvedCount: 1, approvedAmount: "15,000.00", actualPaidCount: 0, actualPaidAmount: "0.00" } },
  // 鄞州区
  { id: "b3-1", accountingPeriod: "2026-04", businessUnit: "宁波分公司", district: "鄞州区", branch: "鄞州支局", project: { count: 1, canApplyCount: 1, canApplyAmount: "30,000.00", appliedCount: 1, appliedAmount: "15,000.00", approvedCount: 1, approvedAmount: "10,000.00", actualPaidCount: 1, actualPaidAmount: "5,000.00" }, smallProduct: { count: 4, canApplyCount: 4, canApplyAmount: "40,000.00", appliedCount: 2, appliedAmount: "20,000.00", approvedCount: 2, approvedAmount: "15,000.00", actualPaidCount: 1, actualPaidAmount: "8,000.00" }, triple: { count: 2, canApplyCount: 2, canApplyAmount: "50,000.00", appliedCount: 1, appliedAmount: "25,000.00", approvedCount: 1, approvedAmount: "20,000.00", actualPaidCount: 1, actualPaidAmount: "10,000.00" } },
];

export function SelfDeliverySettlementStats() {
  const [searchPeriod, setSearchPeriod] = useState("2026-04");
  const [searchBusinessUnit, setSearchBusinessUnit] = useState("");
  const [searchDistrict, setSearchDistrict] = useState("");

  // 视图状态：district(区县视图) | branch(支局视图)
  const [viewMode, setViewMode] = useState<"district" | "branch">("district");
  const [urlDistrict, setUrlDistrict] = useState("");
  const [urlBusinessUnit, setUrlBusinessUnit] = useState("");
  const [urlPeriod, setUrlPeriod] = useState("");

  // 读取URL参数
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const district = params.get("district");
    if (district) {
      setViewMode("branch");
      setUrlDistrict(district);
      setUrlBusinessUnit(params.get("businessUnit") || "");
      setUrlPeriod(params.get("period") || "2026-04");
      setSearchPeriod(params.get("period") || "2026-04");
      setSearchBusinessUnit(params.get("businessUnit") || "");
    }
  }, []);

  // 点击区县行 → URL跳转
  const handleDistrictClick = (row: DistrictStats) => {
    const params = new URLSearchParams({
      district: row.district,
      period: searchPeriod,
      businessUnit: row.businessUnit
    });
    window.location.search = params.toString();
  };

  // 返回区县视图
  const handleBackToDistrict = () => {
    window.location.search = "";
  };

  // 当前视图数据
  const filteredDistrictData = mockStats.filter(item => {
    if (searchBusinessUnit && !item.businessUnit.includes(searchBusinessUnit)) return false;
    if (searchDistrict && !item.district.includes(searchDistrict)) return false;
    return true;
  });

  const filteredBranchData = mockBranchData.filter(item => {
    if (item.district !== urlDistrict) return false;
    if (urlBusinessUnit && !item.businessUnit.includes(urlBusinessUnit)) return false;
    return true;
  });

  // 渲染二级表头单元格（独立列）
  const renderNumberCell = (value: number, color: string = "text-blue-600") => (
    <td className={`px-2 py-3 text-center text-sm font-medium ${color}`}>{value}</td>
  );
  const renderAmountCell = (value: string, color: string = "text-gray-700") => (
    <td className={`px-2 py-3 text-right text-xs ${color}`}>¥{value}</td>
  );
  const renderCountAndAmountCells = (count: number, amount: string, color: string = "text-gray-700") => (
    <>
      {renderNumberCell(count, color)}
      {renderAmountCell(amount, color)}
    </>
  );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 pt-6 pb-0 flex-shrink-0">
        <div className="flex items-center gap-3">
          {viewMode === "branch" && (
            <Button variant="outline" size="sm" className="gap-1" onClick={handleBackToDistrict}>
              <ArrowLeft className="w-4 h-4" />返回上一级
            </Button>
          )}
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              {viewMode === "branch" ? `自交付结算统计 - ${urlDistrict}（支局明细）` : "自交付结算统计"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {viewMode === "branch" ? `当前区县：${urlDistrict}，点击区县返回查看其他区县` : "按经营单元、区县、支局维度统计自交付结算情况"}
            </p>
          </div>
        </div>
      </div>

      {/* 查询条件 */}
      <div className="px-6 mt-4 flex-shrink-0">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-3 gap-x-6 gap-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">账期</label>
              <Input type="month" value={searchPeriod} onChange={e => setSearchPeriod(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">经营单元</label>
              <Input placeholder="请输入" value={searchBusinessUnit} onChange={e => setSearchBusinessUnit(e.target.value)} />
            </div>
            {viewMode === "district" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">区县</label>
                <Input placeholder="请输入" value={searchDistrict} onChange={e => setSearchDistrict(e.target.value)} />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
            <Button variant="outline" className="gap-1" onClick={() => {
              setSearchPeriod("2026-04"); setSearchBusinessUnit(""); setSearchDistrict("");
            }}>
              <RefreshCw className="w-4 h-4" />重置
            </Button>
            <Button className="gap-1"><Search className="w-4 h-4" />查询</Button>
          </div>
        </div>
      </div>

      {/* 操作栏 */}
      <div className="px-6 py-3 flex-shrink-0 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          账期：<span className="font-medium text-gray-900">{viewMode === "branch" ? urlPeriod : searchPeriod}</span>
          {viewMode === "branch" && <span className="ml-3">区县：<span className="font-medium text-blue-600">{urlDistrict}</span></span>}
        </div>
        <Button variant="outline" className="gap-1" onClick={() => console.log("导出")}>
          <Download className="w-4 h-4" />导出
        </Button>
      </div>

      {/* 列表 */}
      <div className="flex-1 overflow-hidden px-6 pb-6">
        <div className="h-full bg-white rounded-lg border border-gray-200 overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              {/* 一级表头 */}
              <tr>
                <th rowSpan={2} className="px-3 py-3 text-center text-xs font-medium text-gray-600 w-12 border-r border-gray-200">序号</th>
                <th rowSpan={2} className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-24 border-r border-gray-200">账期</th>
                <th rowSpan={2} className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-24 border-r border-gray-200">经营单元</th>
                <th rowSpan={2} className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-24 border-r border-gray-200">
                  {viewMode === "district" ? "区县" : "支局"}
                </th>
                <th colSpan={9} className="px-3 py-2 text-center text-xs font-medium text-blue-700 bg-blue-50 border-r border-gray-200">项目型</th>
                <th colSpan={9} className="px-3 py-2 text-center text-xs font-medium text-green-700 bg-green-50 border-r border-gray-200">小微标品</th>
                <th colSpan={9} className="px-3 py-2 text-center text-xs font-medium text-purple-700 bg-purple-50">三联单</th>
              </tr>
              {/* 二级表头 */}
              <tr>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 bg-blue-50/50 border-r border-gray-200 min-w-20">项目型数量</th>
                <th colSpan={2} className="px-2 py-2 text-center text-xs font-medium text-gray-600 bg-blue-50/50 border-r border-gray-200 min-w-32">可申请（数量/金额）</th>
                <th colSpan={2} className="px-2 py-2 text-center text-xs font-medium text-gray-600 bg-blue-50/50 border-r border-gray-200 min-w-32">已申请（数量/金额）</th>
                <th colSpan={2} className="px-2 py-2 text-center text-xs font-medium text-gray-600 bg-blue-50/50 border-r border-gray-200 min-w-32">审核通过（数量/金额）</th>
                <th colSpan={2} className="px-2 py-2 text-center text-xs font-medium text-gray-600 bg-blue-50/50 border-r border-gray-200 min-w-32">实际发放（数量/金额）</th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 bg-green-50/50 border-r border-gray-200 min-w-20">小微标品订单数量</th>
                <th colSpan={2} className="px-2 py-2 text-center text-xs font-medium text-gray-600 bg-green-50/50 border-r border-gray-200 min-w-32">可申请（数量/金额）</th>
                <th colSpan={2} className="px-2 py-2 text-center text-xs font-medium text-gray-600 bg-green-50/50 border-r border-gray-200 min-w-32">已申请（数量/金额）</th>
                <th colSpan={2} className="px-2 py-2 text-center text-xs font-medium text-gray-600 bg-green-50/50 border-r border-gray-200 min-w-32">审核通过（数量/金额）</th>
                <th colSpan={2} className="px-2 py-2 text-center text-xs font-medium text-gray-600 bg-green-50/50 border-r border-gray-200 min-w-32">实际发放（数量/金额）</th>
                <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 bg-purple-50/50 min-w-20">三联单数量</th>
                <th colSpan={2} className="px-2 py-2 text-center text-xs font-medium text-gray-600 bg-purple-50/50 min-w-32">可申请（数量/金额）</th>
                <th colSpan={2} className="px-2 py-2 text-center text-xs font-medium text-gray-600 bg-purple-50/50 min-w-32">已申请（数量/金额）</th>
                <th colSpan={2} className="px-2 py-2 text-center text-xs font-medium text-gray-600 bg-purple-50/50 min-w-32">审核通过（数量/金额）</th>
                <th colSpan={2} className="px-2 py-2 text-center text-xs font-medium text-gray-600 bg-purple-50/50 min-w-32">实际发放（数量/金额）</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {viewMode === "district" ? (
                <>
                  {filteredDistrictData.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-blue-50/30 cursor-pointer" onClick={() => handleDistrictClick(row)}>
                      <td className="px-3 py-3 text-center">{idx + 1}</td>
                      <td className="px-3 py-3">{row.accountingPeriod}</td>
                      <td className="px-3 py-3">{row.businessUnit}</td>
                      <td className="px-3 py-3 font-medium text-blue-600 underline">{row.district}</td>
                      {/* 项目型5列：数量 / 可申请数量 / 可申请金额 / 已申请数量 / 已申请金额 / 审核通过数量 / 审核通过金额 / 实际发放数量 / 实际发放金额 */}
                      {renderNumberCell(row.project.count, "text-blue-600 font-medium")}
                      {renderCountAndAmountCells(row.project.canApplyCount, row.project.canApplyAmount, "text-gray-700")}
                      {renderCountAndAmountCells(row.project.appliedCount, row.project.appliedAmount, "text-blue-600")}
                      {renderCountAndAmountCells(row.project.approvedCount, row.project.approvedAmount, "text-green-600")}
                      {renderCountAndAmountCells(row.project.actualPaidCount, row.project.actualPaidAmount, "text-emerald-600")}
                      {/* 小微标品5列 */}
                      {renderNumberCell(row.smallProduct.count, "text-green-600 font-medium")}
                      {renderCountAndAmountCells(row.smallProduct.canApplyCount, row.smallProduct.canApplyAmount, "text-gray-700")}
                      {renderCountAndAmountCells(row.smallProduct.appliedCount, row.smallProduct.appliedAmount, "text-blue-600")}
                      {renderCountAndAmountCells(row.smallProduct.approvedCount, row.smallProduct.approvedAmount, "text-green-600")}
                      {renderCountAndAmountCells(row.smallProduct.actualPaidCount, row.smallProduct.actualPaidAmount, "text-emerald-600")}
                      {/* 三联单5列 */}
                      {renderNumberCell(row.triple.count, "text-purple-600 font-medium")}
                      {renderCountAndAmountCells(row.triple.canApplyCount, row.triple.canApplyAmount, "text-gray-700")}
                      {renderCountAndAmountCells(row.triple.appliedCount, row.triple.appliedAmount, "text-blue-600")}
                      {renderCountAndAmountCells(row.triple.approvedCount, row.triple.approvedAmount, "text-green-600")}
                      {renderCountAndAmountCells(row.triple.actualPaidCount, row.triple.actualPaidAmount, "text-emerald-600")}
                    </tr>
                  ))}
                  {filteredDistrictData.length === 0 && (
                    <tr><td colSpan={31} className="px-3 py-8 text-center text-gray-500">暂无数据</td></tr>
                  )}
                </>
              ) : (
                <>
                  {filteredBranchData.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 text-center">{idx + 1}</td>
                      <td className="px-3 py-3">{row.accountingPeriod}</td>
                      <td className="px-3 py-3">{row.businessUnit}</td>
                      <td className="px-3 py-3 font-medium">{row.branch}</td>
                      {renderNumberCell(row.project.count, "text-blue-600 font-medium")}
                      {renderCountAndAmountCells(row.project.canApplyCount, row.project.canApplyAmount, "text-gray-700")}
                      {renderCountAndAmountCells(row.project.appliedCount, row.project.appliedAmount, "text-blue-600")}
                      {renderCountAndAmountCells(row.project.approvedCount, row.project.approvedAmount, "text-green-600")}
                      {renderCountAndAmountCells(row.project.actualPaidCount, row.project.actualPaidAmount, "text-emerald-600")}
                      {renderNumberCell(row.smallProduct.count, "text-green-600 font-medium")}
                      {renderCountAndAmountCells(row.smallProduct.canApplyCount, row.smallProduct.canApplyAmount, "text-gray-700")}
                      {renderCountAndAmountCells(row.smallProduct.appliedCount, row.smallProduct.appliedAmount, "text-blue-600")}
                      {renderCountAndAmountCells(row.smallProduct.approvedCount, row.smallProduct.approvedAmount, "text-green-600")}
                      {renderCountAndAmountCells(row.smallProduct.actualPaidCount, row.smallProduct.actualPaidAmount, "text-emerald-600")}
                      {renderNumberCell(row.triple.count, "text-purple-600 font-medium")}
                      {renderCountAndAmountCells(row.triple.canApplyCount, row.triple.canApplyAmount, "text-gray-700")}
                      {renderCountAndAmountCells(row.triple.appliedCount, row.triple.appliedAmount, "text-blue-600")}
                      {renderCountAndAmountCells(row.triple.approvedCount, row.triple.approvedAmount, "text-green-600")}
                      {renderCountAndAmountCells(row.triple.actualPaidCount, row.triple.actualPaidAmount, "text-emerald-600")}
                    </tr>
                  ))}
                  {filteredBranchData.length === 0 && (
                    <tr><td colSpan={31} className="px-3 py-8 text-center text-gray-500">暂无数据，点击区县返回查看</td></tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
