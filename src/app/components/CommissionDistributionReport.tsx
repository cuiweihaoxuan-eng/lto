import React, { useState } from "react";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Button } from "./ui/button";
import { RotateCcw } from "lucide-react";

// 模拟数据
const mockData = [
  { cycleMonth: "202603", orgnName: "鄞州分公司", monthItemSkCount: 15, monthItemSkCycle: 1500000, monthGrantItemCount: 12, monthGrantItemCycle: 120000, yearGrantItemCount: 45, yearGrantItemCycle: 450000, leftItemSkCount: 3, leftItemSkCycle: 30000 },
  { cycleMonth: "202603", orgnName: "江北分公司", monthItemSkCount: 12, monthItemSkCycle: 1200000, monthGrantItemCount: 10, monthGrantItemCycle: 100000, yearGrantItemCount: 38, yearGrantItemCycle: 380000, leftItemSkCount: 2, leftItemSkCycle: 20000 },
  { cycleMonth: "202603", orgnName: "镇海分公司", monthItemSkCount: 8, monthItemSkCycle: 800000, monthGrantItemCount: 7, monthGrantItemCycle: 70000, yearGrantItemCount: 25, yearGrantItemCycle: 250000, leftItemSkCount: 1, leftItemSkCycle: 10000 },
];

export function CommissionDistributionReport() {
  const [formData, setFormData] = useState({
    cityId: "",
    qxId: "",
    zjId: "",
    cycleMonth: "2026-05",
  });

  const [refreshKey, setRefreshKey] = useState(0);

  const handleSearch = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleReset = () => {
    setFormData({
      cityId: "",
      qxId: "",
      zjId: "",
      cycleMonth: "",
    });
    setRefreshKey(prev => prev + 1);
  };

  const formatAmount = (val: number) => {
    return val?.toLocaleString() || "-";
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 pt-6 pb-4 flex-shrink-0">
        <h2 className="text-lg font-medium text-gray-900">项目提成奖发放统计报表</h2>
        <p className="text-sm text-gray-500 mt-1">按区域统计项目提成奖发放情况</p>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="mt-4 space-y-4">
          {/* 查询条件 */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-5 gap-x-6 gap-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">地市</label>
                <Select value={formData.cityId} onValueChange={(v) => setFormData({ ...formData, cityId: v })}>
                  <SelectTrigger><SelectValue placeholder="请选择地市" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ningbo">宁波</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">区县</label>
                <Select value={formData.qxId} onValueChange={(v) => setFormData({ ...formData, qxId: v })} disabled={!formData.cityId}>
                  <SelectTrigger><SelectValue placeholder="请先选择区县" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yinzhou">鄞州</SelectItem>
                    <SelectItem value="jiangbei">江北</SelectItem>
                    <SelectItem value="zhenhai">镇海</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">支局</label>
                <Select value={formData.zjId} onValueChange={(v) => setFormData({ ...formData, zjId: v })} disabled={!formData.qxId}>
                  <SelectTrigger><SelectValue placeholder="请先选择支局" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zj1">支局1</SelectItem>
                    <SelectItem value="zj2">支局2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">账期</label>
                <Input
                  type="month"
                  value={formData.cycleMonth}
                  onChange={(e) => setFormData({ ...formData, cycleMonth: e.target.value })}
                />
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={handleSearch}>查询</Button>
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-1" />重置
                </Button>
              </div>
            </div>
          </div>

          {/* 表格 */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <colgroup>
                <col style={{ width: '90px' }} />
                <col style={{ width: '100px' }} />
                <col style={{ width: '120px' }} />
                <col style={{ width: '110px' }} />
                <col style={{ width: '140px' }} />
                <col style={{ width: '140px' }} />
                <col style={{ width: '150px' }} />
                <col style={{ width: '150px' }} />
                <col style={{ width: '130px' }} />
                <col style={{ width: '130px' }} />
              </colgroup>
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">账期</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">区域（下钻）</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">当月收款项目数</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">当月收款金额</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">当月发放提成奖励个数</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">当月发放提成奖励金额</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">本年度累计已发放提成奖励个数</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">本年度累计已发放提成奖励金额</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">未发放提成奖励个数</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">未发放提成奖励金额</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {mockData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.cycleMonth}</td>
                    <td className="px-2 py-2 text-center whitespace-nowrap">
                      <button className="text-blue-600 hover:underline text-xs">{item.orgnName}</button>
                    </td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.monthItemSkCount}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{formatAmount(item.monthItemSkCycle)}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.monthGrantItemCount}</td>
                    <td className="px-2 py-2 text-xs text-blue-600 text-center whitespace-nowrap font-medium">{formatAmount(item.monthGrantItemCycle)}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.yearGrantItemCount}</td>
                    <td className="px-2 py-2 text-xs text-blue-600 text-center whitespace-nowrap font-medium">{formatAmount(item.yearGrantItemCycle)}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.leftItemSkCount}</td>
                    <td className="px-2 py-2 text-xs text-orange-500 text-center whitespace-nowrap font-medium">{formatAmount(item.leftItemSkCycle)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}