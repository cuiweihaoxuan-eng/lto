import React, { useState } from "react";
import { Search, RefreshCw, Download, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface SubStats {
  count: number;
  canApplyAmount: string;
  appliedAmount: string;
  approvedAmount: string;
  actualPaidAmount: string;
}

interface DistrictStats {
  id: string;
  accountingPeriod: string;
  businessUnit: string;
  district: string;
  project: SubStats;
  smallProduct: SubStats;
  triple: SubStats;
  children?: DistrictStats[];
}

const mockStats: DistrictStats[] = [
  {
    id: "1", accountingPeriod: "2026-04", businessUnit: "杭州分公司", district: "西湖区",
    project: { count: 3, canApplyAmount: "120,000.00", appliedAmount: "60,000.00", approvedAmount: "45,000.00", actualPaidAmount: "20,000.00" },
    smallProduct: { count: 5, canApplyAmount: "50,000.00", appliedAmount: "25,000.00", approvedAmount: "20,000.00", actualPaidAmount: "10,000.00" },
    triple: { count: 8, canApplyAmount: "200,000.00", appliedAmount: "100,000.00", approvedAmount: "80,000.00", actualPaidAmount: "40,000.00" },
    children: [
      { id: "1-1", accountingPeriod: "2026-04", businessUnit: "杭州分公司", district: "西湖区", project: { count: 2, canApplyAmount: "80,000.00", appliedAmount: "40,000.00", approvedAmount: "30,000.00", actualPaidAmount: "15,000.00" }, smallProduct: { count: 3, canApplyAmount: "30,000.00", appliedAmount: "15,000.00", approvedAmount: "12,000.00", actualPaidAmount: "6,000.00" }, triple: { count: 5, canApplyAmount: "120,000.00", appliedAmount: "60,000.00", approvedAmount: "50,000.00", actualPaidAmount: "25,000.00" } },
      { id: "1-2", accountingPeriod: "2026-04", businessUnit: "杭州分公司", district: "西湖区", project: { count: 1, canApplyAmount: "40,000.00", appliedAmount: "20,000.00", approvedAmount: "15,000.00", actualPaidAmount: "5,000.00" }, smallProduct: { count: 2, canApplyAmount: "20,000.00", appliedAmount: "10,000.00", approvedAmount: "8,000.00", actualPaidAmount: "4,000.00" }, triple: { count: 3, canApplyAmount: "80,000.00", appliedAmount: "40,000.00", approvedAmount: "30,000.00", actualPaidAmount: "15,000.00" } },
    ]
  },
  {
    id: "2", accountingPeriod: "2026-04", businessUnit: "杭州分公司", district: "滨江区",
    project: { count: 2, canApplyAmount: "80,000.00", appliedAmount: "30,000.00", approvedAmount: "20,000.00", actualPaidAmount: "10,000.00" },
    smallProduct: { count: 3, canApplyAmount: "30,000.00", appliedAmount: "15,000.00", approvedAmount: "12,000.00", actualPaidAmount: "6,000.00" },
    triple: { count: 4, canApplyAmount: "100,000.00", appliedAmount: "50,000.00", approvedAmount: "40,000.00", actualPaidAmount: "20,000.00" },
    children: [
      { id: "2-1", accountingPeriod: "2026-04", businessUnit: "杭州分公司", district: "滨江区", project: { count: 1, canApplyAmount: "50,000.00", appliedAmount: "20,000.00", approvedAmount: "15,000.00", actualPaidAmount: "8,000.00" }, smallProduct: { count: 2, canApplyAmount: "20,000.00", appliedAmount: "10,000.00", approvedAmount: "8,000.00", actualPaidAmount: "4,000.00" }, triple: { count: 2, canApplyAmount: "60,000.00", appliedAmount: "30,000.00", approvedAmount: "25,000.00", actualPaidAmount: "12,000.00" } },
      { id: "2-2", accountingPeriod: "2026-04", businessUnit: "杭州分公司", district: "滨江区", project: { count: 1, canApplyAmount: "30,000.00", appliedAmount: "10,000.00", approvedAmount: "5,000.00", actualPaidAmount: "2,000.00" }, smallProduct: { count: 1, canApplyAmount: "10,000.00", appliedAmount: "5,000.00", approvedAmount: "4,000.00", actualPaidAmount: "2,000.00" }, triple: { count: 2, canApplyAmount: "40,000.00", appliedAmount: "20,000.00", approvedAmount: "15,000.00", actualPaidAmount: "8,000.00" } },
    ]
  },
  {
    id: "3", accountingPeriod: "2026-04", businessUnit: "宁波分公司", district: "鄞州区",
    project: { count: 1, canApplyAmount: "30,000.00", appliedAmount: "15,000.00", approvedAmount: "10,000.00", actualPaidAmount: "5,000.00" },
    smallProduct: { count: 4, canApplyAmount: "40,000.00", appliedAmount: "20,000.00", approvedAmount: "15,000.00", actualPaidAmount: "8,000.00" },
    triple: { count: 2, canApplyAmount: "50,000.00", appliedAmount: "25,000.00", approvedAmount: "20,000.00", actualPaidAmount: "10,000.00" },
    children: [
      { id: "3-1", accountingPeriod: "2026-04", businessUnit: "宁波分公司", district: "鄞州区", project: { count: 1, canApplyAmount: "30,000.00", appliedAmount: "15,000.00", approvedAmount: "10,000.00", actualPaidAmount: "5,000.00" }, smallProduct: { count: 4, canApplyAmount: "40,000.00", appliedAmount: "20,000.00", approvedAmount: "15,000.00", actualPaidAmount: "8,000.00" }, triple: { count: 2, canApplyAmount: "50,000.00", appliedAmount: "25,000.00", approvedAmount: "20,000.00", actualPaidAmount: "10,000.00" } },
    ]
  },
];

export function SelfDeliverySettlementStats() {
  const [searchPeriod, setSearchPeriod] = useState("2026-04");
  const [searchBusinessUnit, setSearchBusinessUnit] = useState("");
  const [searchDistrict, setSearchDistrict] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const filteredData = mockStats.filter(item => {
    if (searchBusinessUnit && !item.businessUnit.includes(searchBusinessUnit)) return false;
    if (searchDistrict && !item.district.includes(searchDistrict)) return false;
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderSubStats = (stats: SubStats) => (
    <td className="px-2 py-3">
      <div className="text-xs">
        <div className="font-medium">{stats.count} 个</div>
        <div className="text-gray-500">可申请: {stats.canApplyAmount}</div>
        <div className="text-blue-600">已申请: {stats.appliedAmount}</div>
        <div className="text-green-600">审核通过: {stats.approvedAmount}</div>
        <div className="text-emerald-600">实际发放: {stats.actualPaidAmount}</div>
      </div>
    </td>
  );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 pt-6 pb-0 flex-shrink-0">
        <h2 className="text-lg font-medium text-gray-900">自交付结算统计</h2>
        <p className="text-sm text-gray-500 mt-1">按经营单元、区县、支局维度统计自交付结算情况</p>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">区县</label>
              <Input placeholder="请输入" value={searchDistrict} onChange={e => setSearchDistrict(e.target.value)} />
            </div>
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
        <div className="text-sm text-gray-500">账期：<span className="font-medium text-gray-900">{searchPeriod}</span></div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1" onClick={() => console.log("导出")}>
            <Download className="w-4 h-4" />导出
          </Button>
        </div>
      </div>

      {/* 列表 */}
      <div className="flex-1 overflow-hidden px-6 pb-6">
        <div className="h-full bg-white rounded-lg border border-gray-200 overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-10">展开</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-24">账期</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-24">经营单元</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-24">区县</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 min-w-48">项目型</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 min-w-48">小微标品</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 min-w-48">三联单</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map(row => (
                <React.Fragment key={row.id}>
                  <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleExpand(row.id)}>
                    <td className="px-3 py-3">
                      <button className="p-1 hover:bg-gray-200 rounded">
                        {expandedRows.has(row.id) ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                      </button>
                    </td>
                    <td className="px-3 py-3">{row.accountingPeriod}</td>
                    <td className="px-3 py-3">{row.businessUnit}</td>
                    <td className="px-3 py-3 font-medium">{row.district}</td>
                    {renderSubStats(row.project)}
                    {renderSubStats(row.smallProduct)}
                    {renderSubStats(row.triple)}
                  </tr>
                  {expandedRows.has(row.id) && row.children?.map(child => (
                    <tr key={child.id} className="bg-blue-50/50">
                      <td className="px-3 py-3"></td>
                      <td className="px-3 py-3 text-xs text-gray-500">↳</td>
                      <td className="px-3 py-3 text-xs">{child.businessUnit}</td>
                      <td className="px-3 py-3 text-xs">支局级-{child.id.split('-')[1]}</td>
                      {renderSubStats(child.project)}
                      {renderSubStats(child.smallProduct)}
                      {renderSubStats(child.triple)}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
              {filteredData.length === 0 && (
                <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-500">暂无数据</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
