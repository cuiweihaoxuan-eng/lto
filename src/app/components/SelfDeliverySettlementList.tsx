import React, { useState } from "react";
import { Search, RefreshCw, Download, Plus, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";

// 业务类型
type BusinessType = "项目型" | "小微标品" | "三联单";
// 结算状态
type SettlementStatus = "审核中" | "审核通过" | "审核驳回" | "发放中" | "可发放" | "已发放";

interface ListItem {
  id: string;
  index: number;
  settlementName: string;       // 结算单名称
  settlementCode: string;       // 结算单编码
  businessUnit: string;         // 经营单元
  branch: string;               // 支局
  businessType: BusinessType;   // 业务类型
  businessCode: string;         // 合同/小微工单/三联单编码
  forwardAmount: string;        // 前向自交付金额
  appliedAmount: string;        // 已申请自交付金额
  currentApplyAmount: string;   // 本次申请自交付金额
  payPersonnel: string[];       // 发放人员
  applyDate: string;             // 申请日期
  applicant: string;            // 申请人
  status: SettlementStatus;     // 结算状态
}

// Mock数据
const mockListData: ListItem[] = [
  { id: "1", index: 1, settlementName: "2026年4月自交付结算", settlementCode: "JSD202604001", businessUnit: "杭州分公司", branch: "西湖支局", businessType: "项目型", businessCode: "HT202604001", forwardAmount: "50,000.00", appliedAmount: "13,000.00", currentApplyAmount: "8,000.00", payPersonnel: ["张三", "李四", "王五"], applyDate: "2026-04-15", applicant: "张明", status: "审核中" },
  { id: "2", index: 2, settlementName: "2026年3月自交付结算", settlementCode: "JSD202603001", businessUnit: "杭州分公司", branch: "西湖支局", businessType: "项目型", businessCode: "HT202604001", forwardAmount: "50,000.00", appliedAmount: "5,000.00", currentApplyAmount: "5,000.00", payPersonnel: ["张三", "李四"], applyDate: "2026-03-15", applicant: "张明", status: "已发放" },
  { id: "3", index: 3, settlementName: "2026年4月自交付结算", settlementCode: "JSD202604002", businessUnit: "宁波分公司", branch: "鄞州支局", businessType: "小微标品", businessCode: "WO202604001", forwardAmount: "20,000.00", appliedAmount: "6,000.00", currentApplyAmount: "6,000.00", payPersonnel: ["赵六", "钱七"], applyDate: "2026-04-10", applicant: "李华", status: "已发放" },
  { id: "4", index: 4, settlementName: "2026年5月自交付结算", settlementCode: "JSD202605001", businessUnit: "台州分公司", branch: "椒江支局", businessType: "小微标品", businessCode: "WO202604005", forwardAmount: "15,000.00", appliedAmount: "0.00", currentApplyAmount: "4,500.00", payPersonnel: ["孙八"], applyDate: "2026-05-10", applicant: "王九", status: "审核中" },
  { id: "5", index: 5, settlementName: "2026年4月自交付结算", settlementCode: "JSD202604003", businessUnit: "温州分公司", branch: "鹿城支局", businessType: "三联单", businessCode: "DD202604001", forwardAmount: "80,000.00", appliedAmount: "12,000.00", currentApplyAmount: "12,000.00", payPersonnel: ["周十", "吴一", "郑二"], applyDate: "2026-04-20", applicant: "刘十一", status: "审核通过" },
  { id: "6", index: 6, settlementName: "2026年5月自交付结算", settlementCode: "JSD202605002", businessUnit: "金华分公司", branch: "婺城支局", businessType: "三联单", businessCode: "DD202604006", forwardAmount: "40,000.00", appliedAmount: "0.00", currentApplyAmount: "8,000.00", payPersonnel: ["周明", "吴华"], applyDate: "2026-05-15", applicant: "刘美", status: "审核驳回" },
];

export function SelfDeliverySettlementList() {
  const [searchBusinessUnit, setSearchBusinessUnit] = useState("");
  const [searchBranch, setSearchBranch] = useState("");
  const [searchBusinessType, setSearchBusinessType] = useState<string>("全部");
  const [searchStatus, setSearchStatus] = useState<string>("全部");
  const [searchBusinessCode, setSearchBusinessCode] = useState("");
  const [searchApplicant, setSearchApplicant] = useState("");
  const [searchDateStart, setSearchDateStart] = useState("");
  const [searchDateEnd, setSearchDateEnd] = useState("");

  // 筛选
  const filteredData = mockListData.filter(item => {
    if (searchBusinessUnit && !item.businessUnit.includes(searchBusinessUnit)) return false;
    if (searchBranch && !item.branch.includes(searchBranch)) return false;
    if (searchBusinessType !== "全部" && item.businessType !== searchBusinessType) return false;
    if (searchStatus !== "全部" && item.status !== searchStatus) return false;
    if (searchBusinessCode && !item.businessCode.includes(searchBusinessCode)) return false;
    if (searchApplicant && !item.applicant.includes(searchApplicant)) return false;
    if (searchDateStart && item.applyDate < searchDateStart) return false;
    if (searchDateEnd && item.applyDate > searchDateEnd) return false;
    return true;
  });

  const getStatusBadge = (status: SettlementStatus) => {
    const styles: Record<SettlementStatus, string> = {
      "审核中": "bg-blue-100 text-blue-700",
      "审核通过": "bg-green-100 text-green-700",
      "审核驳回": "bg-red-100 text-red-700",
      "发放中": "bg-orange-100 text-orange-700",
      "可发放": "bg-amber-100 text-amber-700",
      "已发放": "bg-emerald-100 text-emerald-700"
    };
    return styles[status];
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 pt-6 pb-0 flex-shrink-0">
        <h2 className="text-lg font-medium text-gray-900">自交付结算清单</h2>
        <p className="text-sm text-gray-500 mt-1">自交付结算单明细查询</p>
      </div>

      {/* 查询条件 */}
      <div className="px-6 mt-4 flex-shrink-0">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-4 gap-x-6 gap-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">经营单元</label>
              <Input placeholder="请输入" value={searchBusinessUnit} onChange={e => setSearchBusinessUnit(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">支局</label>
              <Input placeholder="请输入" value={searchBranch} onChange={e => setSearchBranch(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">业务类型</label>
              <Select value={searchBusinessType} onValueChange={setSearchBusinessType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="全部">全部</SelectItem>
                  <SelectItem value="项目型">项目型</SelectItem>
                  <SelectItem value="小微标品">小微标品</SelectItem>
                  <SelectItem value="三联单">三联单</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">结算状态</label>
              <Select value={searchStatus} onValueChange={setSearchStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="全部">全部</SelectItem>
                  <SelectItem value="审核中">审核中</SelectItem>
                  <SelectItem value="审核通过">审核通过</SelectItem>
                  <SelectItem value="审核驳回">审核驳回</SelectItem>
                  <SelectItem value="发放中">发放中</SelectItem>
                  <SelectItem value="可发放">可发放</SelectItem>
                  <SelectItem value="已发放">已发放</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">合同/小微工单/三联单编码</label>
              <Input placeholder="请输入编码" value={searchBusinessCode} onChange={e => setSearchBusinessCode(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">申请人</label>
              <Input placeholder="请输入" value={searchApplicant} onChange={e => setSearchApplicant(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">申请时间起</label>
              <Input type="date" value={searchDateStart} onChange={e => setSearchDateStart(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">申请时间止</label>
              <Input type="date" value={searchDateEnd} onChange={e => setSearchDateEnd(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
            <Button variant="outline" className="gap-1" onClick={() => {
              setSearchBusinessUnit(""); setSearchBranch(""); setSearchBusinessType("全部"); setSearchStatus("全部");
              setSearchBusinessCode(""); setSearchApplicant(""); setSearchDateStart(""); setSearchDateEnd("");
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
          共 <span className="font-medium text-gray-900">{filteredData.length}</span> 条记录
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1" onClick={() => console.log("导出")}>
            <Download className="w-4 h-4" />导出
          </Button>
        </div>
      </div>

      {/* 列表 */}
      <div className="flex-1 overflow-hidden px-6 pb-6">
        <div className="h-full bg-white rounded-lg border border-gray-200 overflow-auto">
          <table className="w-full text-sm table-fixed">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-12">序号</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 min-w-32">结算单名称</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-32">结算单编码</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-24">经营单元</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">支局</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">业务类型</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-32">合同/小微工单/三联单编码</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-600 w-28">前向自交付金额</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-600 w-28">已申请自交付金额</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-600 w-28">本次申请自交付金额</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-32">发放人员</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-600 w-24">申请日期</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">申请人</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">结算状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-3 py-3 w-12">{row.index}</td>
                  <td className="px-3 py-3 min-w-32">{row.settlementName}</td>
                  <td className="px-3 py-3 w-32">{row.settlementCode}</td>
                  <td className="px-3 py-3 w-24">{row.businessUnit}</td>
                  <td className="px-3 py-3 w-20">{row.branch}</td>
                  <td className="px-3 py-3 w-20">
                    <Badge className={row.businessType === "项目型" ? "bg-blue-100 text-blue-700" : row.businessType === "小微标品" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"}>
                      {row.businessType}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 w-32">{row.businessCode}</td>
                  <td className="px-3 py-3 w-28 text-right">{row.forwardAmount}</td>
                  <td className="px-3 py-3 w-28 text-right text-blue-600">{row.appliedAmount}</td>
                  <td className="px-3 py-3 w-28 text-right font-medium text-green-600">{row.currentApplyAmount}</td>
                  <td className="px-3 py-3 w-32">
                    <div className="flex flex-wrap gap-1">
                      {row.payPersonnel.map((p, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">{p}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3 w-24 text-center">{row.applyDate}</td>
                  <td className="px-3 py-3 w-20">{row.applicant}</td>
                  <td className="px-3 py-3 w-20">
                    <Badge className={getStatusBadge(row.status)}>{row.status}</Badge>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr><td colSpan={14} className="px-3 py-8 text-center text-gray-500">暂无数据</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
