import React, { useState } from "react";
import { Search, RefreshCw, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface PersonStatItem {
  id: string;
  index: number;
  businessUnit: string;
  branch: string;
  personName: string;
  phone: string;
  empNo: string;
  dept: string;
  // 各状态的单数和金额
  reviewCount: number; reviewAmount: string;
  approvedCount: number; approvedAmount: string;
  pendingCount: number; pendingAmount: string;
  availableCount: number; availableAmount: string;
  paidCount: number; paidAmount: string;
}

const mockData: PersonStatItem[] = [
  { id: "1", index: 1, businessUnit: "杭州分公司", branch: "西湖支局", personName: "张三", phone: "138****1234", empNo: "EMP001", dept: "西湖支局-销售部", reviewCount: 1, reviewAmount: "2,500.00", approvedCount: 1, approvedAmount: "2,500.00", pendingCount: 0, pendingAmount: "0.00", availableCount: 0, availableAmount: "0.00", paidCount: 1, paidAmount: "2,500.00" },
  { id: "2", index: 2, businessUnit: "杭州分公司", branch: "西湖支局", personName: "李四", phone: "138****2345", empNo: "EMP002", dept: "西湖支局-销售部", reviewCount: 1, reviewAmount: "2,800.00", approvedCount: 1, approvedAmount: "2,500.00", pendingCount: 0, pendingAmount: "0.00", availableCount: 0, availableAmount: "0.00", paidCount: 1, paidAmount: "2,500.00" },
  { id: "3", index: 3, businessUnit: "杭州分公司", branch: "西湖支局", personName: "王五", phone: "138****3456", empNo: "EMP003", dept: "西湖支局-销售部", reviewCount: 1, reviewAmount: "2,700.00", approvedCount: 0, approvedAmount: "0.00", pendingCount: 0, pendingAmount: "0.00", availableCount: 0, availableAmount: "0.00", paidCount: 0, paidAmount: "0.00" },
  { id: "4", index: 4, businessUnit: "宁波分公司", branch: "鄞州支局", personName: "赵六", phone: "138****4567", empNo: "EMP004", dept: "鄞州支局-销售部", reviewCount: 0, reviewAmount: "0.00", approvedCount: 0, approvedAmount: "0.00", pendingCount: 0, pendingAmount: "0.00", availableCount: 0, availableAmount: "0.00", paidCount: 1, paidAmount: "3,000.00" },
  { id: "5", index: 5, businessUnit: "宁波分公司", branch: "鄞州支局", personName: "钱七", phone: "138****5678", empNo: "EMP005", dept: "鄞州支局-销售部", reviewCount: 0, reviewAmount: "0.00", approvedCount: 0, approvedAmount: "0.00", pendingCount: 0, pendingAmount: "0.00", availableCount: 0, availableAmount: "0.00", paidCount: 1, paidAmount: "3,000.00" },
  { id: "6", index: 6, businessUnit: "台州分公司", branch: "椒江支局", personName: "孙八", phone: "138****6789", empNo: "EMP006", dept: "椒江支局-销售部", reviewCount: 1, reviewAmount: "4,500.00", approvedCount: 0, approvedAmount: "0.00", pendingCount: 0, pendingAmount: "0.00", availableCount: 0, availableAmount: "0.00", paidCount: 0, paidAmount: "0.00" },
  { id: "7", index: 7, businessUnit: "温州分公司", branch: "鹿城支局", personName: "周十", phone: "138****7890", empNo: "EMP007", dept: "鹿城支局-销售部", reviewCount: 0, reviewAmount: "0.00", approvedCount: 1, approvedAmount: "4,000.00", pendingCount: 0, pendingAmount: "0.00", availableCount: 0, availableAmount: "0.00", paidCount: 0, paidAmount: "0.00" },
];

export function PersonSettlementStats() {
  const [searchBusinessUnit, setSearchBusinessUnit] = useState("");
  const [searchBranch, setSearchBranch] = useState("");
  const [searchPerson, setSearchPerson] = useState("");

  const filteredData = mockData.filter(item => {
    if (searchBusinessUnit && !item.businessUnit.includes(searchBusinessUnit)) return false;
    if (searchBranch && !item.branch.includes(searchBranch)) return false;
    if (searchPerson && !item.personName.includes(searchPerson)) return false;
    return true;
  });

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 pt-6 pb-0 flex-shrink-0">
        <h2 className="text-lg font-medium text-gray-900">人员自交付结算统计</h2>
        <p className="text-sm text-gray-500 mt-1">按人员维度统计各状态结算单数与金额</p>
      </div>

      <div className="px-6 mt-4 flex-shrink-0">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-3 gap-x-6 gap-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">经营单元</label>
              <Input placeholder="请输入" value={searchBusinessUnit} onChange={e => setSearchBusinessUnit(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">支局</label>
              <Input placeholder="请输入" value={searchBranch} onChange={e => setSearchBranch(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">结算人员</label>
              <Input placeholder="请输入姓名" value={searchPerson} onChange={e => setSearchPerson(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
            <Button variant="outline" className="gap-1" onClick={() => {
              setSearchBusinessUnit(""); setSearchBranch(""); setSearchPerson("");
            }}>
              <RefreshCw className="w-4 h-4" />重置
            </Button>
            <Button className="gap-1"><Search className="w-4 h-4" />查询</Button>
          </div>
        </div>
      </div>

      <div className="px-6 py-3 flex-shrink-0 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          共 <span className="font-medium text-gray-900">{filteredData.length}</span> 条记录
        </div>
        <Button variant="outline" className="gap-1" onClick={() => console.log("导出")}>
          <Download className="w-4 h-4" />导出
        </Button>
      </div>

      <div className="flex-1 overflow-hidden px-6 pb-6">
        <div className="h-full bg-white rounded-lg border border-gray-200 overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th rowSpan={2} className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-12 border-r border-gray-200">序号</th>
                <th rowSpan={2} className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-24 border-r border-gray-200">经营单元</th>
                <th rowSpan={2} className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20 border-r border-gray-200">支局</th>
                <th rowSpan={2} className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20 border-r border-gray-200">姓名</th>
                <th rowSpan={2} className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-24 border-r border-gray-200">电话</th>
                <th rowSpan={2} className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20 border-r border-gray-200">工号</th>
                <th rowSpan={2} className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-28 border-r border-gray-200">部门</th>
                <th colSpan={2} className="px-3 py-2 text-center text-xs font-medium text-gray-600 border-r border-gray-200 bg-blue-50">审核中</th>
                <th colSpan={2} className="px-3 py-2 text-center text-xs font-medium text-gray-600 border-r border-gray-200 bg-green-50">审核通过</th>
                <th colSpan={2} className="px-3 py-2 text-center text-xs font-medium text-gray-600 border-r border-gray-200 bg-gray-50">待发放</th>
                <th colSpan={2} className="px-3 py-2 text-center text-xs font-medium text-gray-600 border-r border-gray-200 bg-amber-50">可发放</th>
                <th colSpan={2} className="px-3 py-2 text-center text-xs font-medium text-gray-600 bg-emerald-50">已发放</th>
              </tr>
              <tr>
                <th className="px-2 py-1 text-center text-xs font-medium text-gray-500 border-r border-gray-200 bg-blue-50">单数</th>
                <th className="px-2 py-1 text-center text-xs font-medium text-gray-500 border-r border-gray-200 bg-blue-50">金额</th>
                <th className="px-2 py-1 text-center text-xs font-medium text-gray-500 border-r border-gray-200 bg-green-50">单数</th>
                <th className="px-2 py-1 text-center text-xs font-medium text-gray-500 border-r border-gray-200 bg-green-50">金额</th>
                <th className="px-2 py-1 text-center text-xs font-medium text-gray-500 border-r border-gray-200 bg-gray-50">单数</th>
                <th className="px-2 py-1 text-center text-xs font-medium text-gray-500 border-r border-gray-200 bg-gray-50">金额</th>
                <th className="px-2 py-1 text-center text-xs font-medium text-gray-500 border-r border-gray-200 bg-amber-50">单数</th>
                <th className="px-2 py-1 text-center text-xs font-medium text-gray-500 border-r border-gray-200 bg-amber-50">金额</th>
                <th className="px-2 py-1 text-center text-xs font-medium text-gray-500 bg-emerald-50">单数</th>
                <th className="px-2 py-1 text-center text-xs font-medium text-gray-500 bg-emerald-50">金额</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-3 py-3">{row.index}</td>
                  <td className="px-3 py-3">{row.businessUnit}</td>
                  <td className="px-3 py-3">{row.branch}</td>
                  <td className="px-3 py-3 font-medium">{row.personName}</td>
                  <td className="px-3 py-3 text-gray-500 text-xs">{row.phone}</td>
                  <td className="px-3 py-3">{row.empNo}</td>
                  <td className="px-3 py-3 text-xs text-gray-600">{row.dept}</td>
                  <td className="px-2 py-3 text-center text-blue-600">{row.reviewCount}</td>
                  <td className="px-2 py-3 text-right text-blue-600">{row.reviewAmount}</td>
                  <td className="px-2 py-3 text-center text-green-600">{row.approvedCount}</td>
                  <td className="px-2 py-3 text-right text-green-600">{row.approvedAmount}</td>
                  <td className="px-2 py-3 text-center text-gray-600">{row.pendingCount}</td>
                  <td className="px-2 py-3 text-right text-gray-600">{row.pendingAmount}</td>
                  <td className="px-2 py-3 text-center text-amber-600">{row.availableCount}</td>
                  <td className="px-2 py-3 text-right text-amber-600">{row.availableAmount}</td>
                  <td className="px-2 py-3 text-center text-emerald-600">{row.paidCount}</td>
                  <td className="px-2 py-3 text-right text-emerald-600">{row.paidAmount}</td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr><td colSpan={17} className="px-3 py-8 text-center text-gray-500">暂无数据</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
