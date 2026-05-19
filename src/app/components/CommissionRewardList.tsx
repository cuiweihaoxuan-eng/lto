import React, { useState } from "react";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Button } from "./ui/button";
import { RotateCcw } from "lucide-react";

// 模拟数据
const mockData = [
  { releaseDate: "2026-03-15", qxName: "鄞州", cityName: "鄞州支局", saleOppName: "XX单位信息化建设", jtOppCode: "SJ-2026-001", itemName: "XX单位信息化项目", itemCode: "XM-2026-001", contractAmount: 500, contractIctAmount: 300, itemRewardUserCycle: 100000, teamUserName: "张三", teamUserOrgnName: "政企部", teamUserPhone: "138****1234", subTeamName: "销售团队", jtTeamRoleName: "客户经理", subTeamContribution: 80, rewardAmount: 8000 },
  { releaseDate: "2026-03-16", qxName: "江北", cityName: "江北支局", saleOppName: "YY学校智慧校园", jtOppCode: "SJ-2026-002", itemName: "YY学校智慧校园项目", itemCode: "XM-2026-002", contractAmount: 300, contractIctAmount: 200, itemRewardUserCycle: 80000, teamUserName: "李四", teamUserOrgnName: "政企部", teamUserPhone: "139****5678", subTeamName: "销售团队", jtTeamRoleName: "项目经理", subTeamContribution: 75, rewardAmount: 6000 },
  { releaseDate: "2026-03-17", qxName: "镇海", cityName: "镇海支局", saleOppName: "ZZ医院信息化系统", jtOppCode: "SJ-2026-003", itemName: "ZZ医院信息化系统", itemCode: "XM-2026-003", contractAmount: 400, contractIctAmount: 250, itemRewardUserCycle: 120000, teamUserName: "王五", teamUserOrgnName: "政企部", teamUserPhone: "137****9012", subTeamName: "销售团队", jtTeamRoleName: "技术经理", subTeamContribution: 90, rewardAmount: 10800 },
];

export function CommissionRewardList() {
  const [formData, setFormData] = useState({
    cityId: "",
    qxId: "",
    zjId: "",
    saleOppName: "",
    jtOppCode: "",
    itemName: "",
    itemCode: "",
    teamUserId: "",
    grantDateStart: "",
    grantDateEnd: "",
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
      saleOppName: "",
      jtOppCode: "",
      itemName: "",
      itemCode: "",
      teamUserId: "",
      grantDateStart: "",
      grantDateEnd: "",
    });
    setRefreshKey(prev => prev + 1);
  };

  const formatAmount = (val: number) => {
    return val?.toLocaleString() || "-";
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 pt-6 pb-4 flex-shrink-0">
        <h2 className="text-lg font-medium text-gray-900">项目提成奖清单</h2>
        <p className="text-sm text-gray-500 mt-1">查询项目提成奖发放明细</p>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="mt-4 space-y-4">
          {/* 查询条件 */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-4 gap-x-6 gap-y-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">商机名称</label>
                <Input
                  value={formData.saleOppName}
                  onChange={(e) => setFormData({ ...formData, saleOppName: e.target.value })}
                  placeholder="请输入"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">商机编码</label>
                <Input
                  value={formData.jtOppCode}
                  onChange={(e) => setFormData({ ...formData, jtOppCode: e.target.value })}
                  placeholder="请输入"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">项目名称</label>
                <Input
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  placeholder="请输入"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">项目编码</label>
                <Input
                  value={formData.itemCode}
                  onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
                  placeholder="请输入"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">发放人</label>
                <Input
                  value={formData.teamUserId}
                  onChange={(e) => setFormData({ ...formData, teamUserId: e.target.value })}
                  placeholder="请输入"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">发放日期</label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={formData.grantDateStart}
                    onChange={(e) => setFormData({ ...formData, grantDateStart: e.target.value })}
                  />
                  <span className="self-center text-gray-400">至</span>
                  <Input
                    type="date"
                    value={formData.grantDateEnd}
                    onChange={(e) => setFormData({ ...formData, grantDateEnd: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Button className="btn btn-primary" onClick={handleSearch}>查询</Button>
                <Button className="btn btn-outline ml-2" onClick={handleReset}>
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
                <col style={{ width: '80px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '160px' }} />
                <col style={{ width: '120px' }} />
                <col style={{ width: '160px' }} />
                <col style={{ width: '120px' }} />
                <col style={{ width: '100px' }} />
                <col style={{ width: '100px' }} />
                <col style={{ width: '120px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '100px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '70px' }} />
                <col style={{ width: '120px' }} />
              </colgroup>
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">发放日期</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">区县</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">支局</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">商机名称</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">商机编码</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">项目名称</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">项目编码</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">合同总金额</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">合同ICT金额</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">本次收款金额</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">发放人</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">组织</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">电话</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">所在团队</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">角色</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">贡献度</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">本次奖励金额</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {mockData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.releaseDate}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.qxName}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.cityName}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap max-w-[160px] truncate">{item.saleOppName}</td>
                    <td className="px-2 py-2 text-xs text-blue-600 text-center whitespace-nowrap">{item.jtOppCode}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap max-w-[160px] truncate">{item.itemName}</td>
                    <td className="px-2 py-2 text-xs text-blue-600 text-center whitespace-nowrap">{item.itemCode}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.contractAmount}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.contractIctAmount}</td>
                    <td className="px-2 py-2 text-xs text-blue-600 text-center whitespace-nowrap font-medium">{formatAmount(item.itemRewardUserCycle)}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.teamUserName}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.teamUserOrgnName}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.teamUserPhone}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.subTeamName}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.jtTeamRoleName}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.subTeamContribution}%</td>
                    <td className="px-2 py-2 text-xs text-blue-600 text-center whitespace-nowrap font-medium">{formatAmount(item.rewardAmount)}</td>
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