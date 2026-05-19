import React, { useState } from "react";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Button } from "./ui/button";
import { RotateCcw } from "lucide-react";

// 模拟数据
const mockData = [
  { qxName: "鄞州", zjName: "鄞州支局", saleOppName: "XX单位信息化建设", oppCreateDate: "2026-01-15", jtOppCode: "SJ-2026-001", transferFlagName: "已转化", contractAmount: 500, custManagerName: "张三", orgnName: "政企部", custManagerTele: "138****1234", validOppAmount: 50000, validOppGrantDate: "2026-03-15", oppReward: 80000, oppRewardCycle: "202603" },
  { qxName: "江北", zjName: "江北支局", saleOppName: "YY学校智慧校园", oppCreateDate: "2026-01-20", jtOppCode: "SJ-2026-002", transferFlagName: "已转化", contractAmount: 300, custManagerName: "李四", orgnName: "政企部", custManagerTele: "139****5678", validOppAmount: 40000, validOppGrantDate: "2026-03-16", oppReward: 60000, oppRewardCycle: "202603" },
  { qxName: "镇海", zjName: "镇海支局", saleOppName: "ZZ医院信息化系统", oppCreateDate: "2026-02-01", jtOppCode: "SJ-2026-003", transferFlagName: "已转化", contractAmount: 400, custManagerName: "王五", orgnName: "政企部", custManagerTele: "137****9012", validOppAmount: 45000, validOppGrantDate: "2026-03-17", oppReward: 70000, oppRewardCycle: "202603" },
];

export function OppAwardPageList() {
  const [formData, setFormData] = useState({
    cityId: "",
    qxId: "",
    zjId: "",
    saleOppName: "",
    jtOppCode: "",
    oppCreateDateStart: "",
    oppCreateDateEnd: "",
    contractAmountStart: "",
    contractAmountEnd: "",
    effectiveAwardDateStart: "",
    effectiveAwardDateEnd: "",
    bigOppAwardDateStart: "",
    bigOppAwardDateEnd: "",
  });

  const [showMore, setShowMore] = useState(false);
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
      oppCreateDateStart: "",
      oppCreateDateEnd: "",
      contractAmountStart: "",
      contractAmountEnd: "",
      effectiveAwardDateStart: "",
      effectiveAwardDateEnd: "",
      bigOppAwardDateStart: "",
      bigOppAwardDateEnd: "",
    });
    setRefreshKey(prev => prev + 1);
  };

  const formatAmount = (val: number) => {
    return val?.toLocaleString() || "-";
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 pt-6 pb-4 flex-shrink-0">
        <h2 className="text-lg font-medium text-gray-900">商机奖奖励清单</h2>
        <p className="text-sm text-gray-500 mt-1">查询商机奖奖励发放明细</p>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="mt-4 space-y-4">
          {/* 查询条件 */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-4 gap-x-6 gap-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">地市</label>
                <Select value={formData.cityId} onValueChange={(v) => setFormData({ ...formData, cityId: v })}>
                  <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ningbo">宁波</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">区县</label>
                <Select value={formData.qxId} onValueChange={(v) => setFormData({ ...formData, qxId: v })} disabled={!formData.cityId}>
                  <SelectTrigger><SelectValue placeholder="请先选择地市" /></SelectTrigger>
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
                  <SelectTrigger><SelectValue placeholder="请先选择区县" /></SelectTrigger>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">商机录入时间</label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={formData.oppCreateDateStart}
                    onChange={(e) => setFormData({ ...formData, oppCreateDateStart: e.target.value })}
                  />
                  <span className="self-center text-gray-400">至</span>
                  <Input
                    type="date"
                    value={formData.oppCreateDateEnd}
                    onChange={(e) => setFormData({ ...formData, oppCreateDateEnd: e.target.value })}
                  />
                </div>
              </div>
              {showMore && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">合同金额</label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={formData.contractAmountStart}
                        onChange={(e) => setFormData({ ...formData, contractAmountStart: e.target.value })}
                        placeholder="起"
                      />
                      <span className="self-center text-gray-400">至</span>
                      <Input
                        type="number"
                        value={formData.contractAmountEnd}
                        onChange={(e) => setFormData({ ...formData, contractAmountEnd: e.target.value })}
                        placeholder="止"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">有效商机奖发放日期</label>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={formData.effectiveAwardDateStart}
                        onChange={(e) => setFormData({ ...formData, effectiveAwardDateStart: e.target.value })}
                      />
                      <span className="self-center text-gray-400">至</span>
                      <Input
                        type="date"
                        value={formData.effectiveAwardDateEnd}
                        onChange={(e) => setFormData({ ...formData, effectiveAwardDateEnd: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">大额商机奖发放日期</label>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={formData.bigOppAwardDateStart}
                        onChange={(e) => setFormData({ ...formData, bigOppAwardDateStart: e.target.value })}
                      />
                      <span className="self-center text-gray-400">至</span>
                      <Input
                        type="date"
                        value={formData.bigOppAwardDateEnd}
                        onChange={(e) => setFormData({ ...formData, bigOppAwardDateEnd: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}
              <div className={showMore ? "flex items-end gap-2" : "flex items-end"}>
                {showMore && <div></div>}
                <Button className="btn btn-primary" onClick={handleSearch}>查询</Button>
                <Button className="btn btn-outline" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-1" />重置
                </Button>
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <Button
                variant="link"
                size="sm"
                onClick={() => setShowMore(!showMore)}
                className="text-blue-600 p-0"
              >
                {showMore ? "收起更多条件" : "展开更多条件"}
              </Button>
            </div>
          </div>

          {/* 表格 */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <colgroup>
                <col style={{ width: '70px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '180px' }} />
                <col style={{ width: '100px' }} />
                <col style={{ width: '120px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '90px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '110px' }} />
                <col style={{ width: '100px' }} />
                <col style={{ width: '130px' }} />
                <col style={{ width: '130px' }} />
              </colgroup>
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">区县</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">支局</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">商机名称</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">商机录入时间</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">商机编码</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">是否转化</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">合同总金额</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">客户经理</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">组织</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">电话</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">有效商机奖发放金额</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">有效商机奖发放日期</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">大额商机奖奖励金额</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">大额商机奖发放账期</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {mockData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.qxName}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.zjName}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap max-w-[180px] truncate">{item.saleOppName}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.oppCreateDate}</td>
                    <td className="px-2 py-2 text-xs text-blue-600 text-center whitespace-nowrap">{item.jtOppCode}</td>
                    <td className="px-2 py-2 text-center whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        item.transferFlagName === "已转化" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                      }`}>
                        {item.transferFlagName}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.contractAmount}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.custManagerName}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.orgnName}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.custManagerTele}</td>
                    <td className="px-2 py-2 text-xs text-blue-600 text-center whitespace-nowrap font-medium">{formatAmount(item.validOppAmount)}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.validOppGrantDate}</td>
                    <td className="px-2 py-2 text-xs text-blue-600 text-center whitespace-nowrap font-medium">{formatAmount(item.oppReward)}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.oppRewardCycle}</td>
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