import React, { useState } from "react";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Button } from "./ui/button";
import { RotateCcw } from "lucide-react";

// 模拟数据
const mockData = [
  { id: 1, saleOppName: "XX单位信息化建设", jtOppCode: "SJ-2026-001", contractAmount: 500, bigOppAmount: 20000, custManagerName: "张三", qxName: "鄞州", zjName: "鄞州支局", receiveState: "已收款", signState: "已签报", oppCreateDate: "2026-01-15", oppTransferDate: "2026-02-15", signReportCode: "QB-2026-001", auditState: "已审核", submitUser: "李四", orgnName: "政企部", auditTime: "2026-03-10" },
  { id: 2, saleOppName: "YY学校智慧校园", jtOppCode: "SJ-2026-002", contractAmount: 300, bigOppAmount: 15000, custManagerName: "李四", qxName: "江北", zjName: "江北支局", receiveState: "待收款", signState: "待签报", oppCreateDate: "2026-01-20", oppTransferDate: "2026-02-20", signReportCode: "", auditState: "待分配", submitUser: "王五", orgnName: "政企部", auditTime: "" },
  { id: 3, saleOppName: "ZZ医院信息化系统", jtOppCode: "SJ-2026-003", contractAmount: 400, bigOppAmount: 18000, custManagerName: "王五", qxName: "镇海", zjName: "镇海支局", receiveState: "已收款", signState: "已签报", oppCreateDate: "2026-02-01", oppTransferDate: "2026-03-01", signReportCode: "QB-2026-002", auditState: "已分配", submitUser: "赵六", orgnName: "政企部", auditTime: "2026-03-15" },
  { id: 4, saleOppName: "AA社区智慧党建", jtOppCode: "SJ-2026-004", contractAmount: 200, bigOppAmount: 10000, custManagerName: "赵六", qxName: "鄞州", zjName: "鄞州支局", receiveState: "已收款", signState: "已签报", oppCreateDate: "2026-02-10", oppTransferDate: "2026-03-10", signReportCode: "QB-2026-003", auditState: "已分配", submitUser: "孙七", orgnName: "政企部", auditTime: "2026-03-18" },
  { id: 5, saleOppName: "BB企业数字化转型", jtOppCode: "SJ-2026-005", contractAmount: 600, bigOppAmount: 25000, custManagerName: "孙七", qxName: "江北", zjName: "江北支局", receiveState: "待收款", signState: "待签报", oppCreateDate: "2026-02-15", oppTransferDate: "", signReportCode: "", auditState: "待分配", submitUser: "张三", orgnName: "政企部", auditTime: "" },
];

const receiveStateOptions = [
  { value: "all", label: "全部" },
  { value: "已收款", label: "已收款" },
  { value: "待收款", label: "待收款" },
];

const signStateOptions = [
  { value: "all", label: "全部" },
  { value: "已签报", label: "已签报" },
  { value: "待签报", label: "待签报" },
];

export function LargeBusinessOpportunityAward() {
  const [formData, setFormData] = useState({
    saleOppName: "",
    jtOppCode: "",
    qxId: "",
    zjId: "",
    custManagerName: "",
    receiveState: "",
    signState: "",
  });

  const handleSearch = () => {
    console.log("查询大额商机奖", formData);
  };

  const handleReset = () => {
    setFormData({
      saleOppName: "",
      jtOppCode: "",
      qxId: "",
      zjId: "",
      custManagerName: "",
      receiveState: "",
      signState: "",
    });
  };

  const formatAmount = (val: number) => {
    return val?.toLocaleString() || "-";
  };

  const getStateTagClass = (state: string) => {
    if (state === "已收款" || state === "已签报" || state === "已分配" || state === "已审核") {
      return "bg-green-100 text-green-700";
    }
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 标题区 */}
      <div className="px-6 pt-6 pb-4 flex-shrink-0">
        <h2 className="text-lg font-medium text-gray-900">大额商机奖</h2>
        <p className="text-sm text-gray-500 mt-1">查询和分配大额商机奖发放</p>
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="mt-4 space-y-4">
          {/* 查询条件卡片 */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-4 gap-x-6 gap-y-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">区县</label>
                <Select value={formData.qxId} onValueChange={(v) => setFormData({ ...formData, qxId: v })}>
                  <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">客户经理</label>
                <Input
                  value={formData.custManagerName}
                  onChange={(e) => setFormData({ ...formData, custManagerName: e.target.value })}
                  placeholder="请输入"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">收款状态</label>
                <Select value={formData.receiveState || "all"} onValueChange={(v) => setFormData({ ...formData, receiveState: v === "all" ? "" : v })}>
                  <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                  <SelectContent>
                    {receiveStateOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">签报状态</label>
                <Select value={formData.signState || "all"} onValueChange={(v) => setFormData({ ...formData, signState: v === "all" ? "" : v })}>
                  <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                  <SelectContent>
                    {signStateOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch}>查询</Button>
                <Button variant="outline" className="ml-2" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-1" />重置
                </Button>
              </div>
            </div>
          </div>

          {/* 表格 */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <colgroup>
                <col style={{ width: '160px' }} />
                <col style={{ width: '120px' }} />
                <col style={{ width: '90px' }} />
                <col style={{ width: '100px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '70px' }} />
                <col style={{ width: '70px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '90px' }} />
                <col style={{ width: '90px' }} />
                <col style={{ width: '120px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '90px' }} />
              </colgroup>
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">商机名称</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">商机编码</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">合同金额(万元)</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">大额商机奖金额</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">客户经理</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">区县</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">支局</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">收款状态</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">签报状态</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">商机录入时间</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">商机转化时间</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">关联签报文号</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">审核状态</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">送审人</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">审批时间</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {mockData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap max-w-[160px] truncate">{item.saleOppName}</td>
                    <td className="px-2 py-2 text-xs text-blue-600 text-center whitespace-nowrap">{item.jtOppCode}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{formatAmount(item.contractAmount)}</td>
                    <td className="px-2 py-2 text-xs text-blue-600 text-center whitespace-nowrap font-medium">{formatAmount(item.bigOppAmount)}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.custManagerName}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.qxName}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.zjName}</td>
                    <td className="px-2 py-2 text-center whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getStateTagClass(item.receiveState)}`}>
                        {item.receiveState}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-center whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getStateTagClass(item.signState)}`}>
                        {item.signState}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.oppCreateDate}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.oppTransferDate || "-"}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.signReportCode || "-"}</td>
                    <td className="px-2 py-2 text-center whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getStateTagClass(item.auditState)}`}>
                        {item.auditState}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.submitUser}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.auditTime || "-"}</td>
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