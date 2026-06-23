import React, { useState } from "react";
import { Search, RefreshCw, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";

type BusinessType = "项目型" | "小微标品" | "三联单";
type SettlementStatus = "审核中" | "审核通过" | "审核驳回" | "待发放" | "可发放" | "已发放";

interface PersonListItem {
  id: string;
  index: number;
  businessUnit: string;
  branch: string;
  personName: string;
  phone: string;
  empNo: string;
  dept: string;
  settlementName: string;
  settlementCode: string;
  isCycle: boolean;            // 是否周期项目
  paymentPeriod: string;      // 发放账期 (YYYY-MM)
  status: SettlementStatus;
  settlementAmount: string;
  businessType: BusinessType;
  businessCode: string;
  applicant: string;
  applyTime: string;
}

const mockData: PersonListItem[] = [
  { id: "1", index: 1, businessUnit: "杭州分公司", branch: "西湖支局", personName: "张三", phone: "138****1234", empNo: "EMP001", dept: "西湖支局-销售部", settlementName: "2026年4月自交付结算", settlementCode: "JSD202604001", isCycle: false, paymentPeriod: "2026-04", status: "审核中", settlementAmount: "2,500.00", businessType: "项目型", businessCode: "HT202604001", applicant: "张明", applyTime: "2026-04-15 10:30" },
  { id: "2", index: 2, businessUnit: "杭州分公司", branch: "西湖支局", personName: "李四", phone: "138****2345", empNo: "EMP002", dept: "西湖支局-销售部", settlementName: "2026年4月自交付结算", settlementCode: "JSD202604001", isCycle: false, paymentPeriod: "2026-04", status: "审核中", settlementAmount: "2,800.00", businessType: "项目型", businessCode: "HT202604001", applicant: "张明", applyTime: "2026-04-15 10:30" },
  { id: "3", index: 3, businessUnit: "杭州分公司", branch: "西湖支局", personName: "王五", phone: "138****3456", empNo: "EMP003", dept: "西湖支局-销售部", settlementName: "2026年4月自交付结算", settlementCode: "JSD202604001", isCycle: false, paymentPeriod: "2026-04", status: "审核中", settlementAmount: "2,700.00", businessType: "项目型", businessCode: "HT202604001", applicant: "张明", applyTime: "2026-04-15 10:30" },
  { id: "4", index: 4, businessUnit: "杭州分公司", branch: "西湖支局", personName: "张三", phone: "138****1234", empNo: "EMP001", dept: "西湖支局-销售部", settlementName: "2026年3月自交付结算", settlementCode: "JSD202603001", isCycle: false, paymentPeriod: "2026-03", status: "已发放", settlementAmount: "2,500.00", businessType: "项目型", businessCode: "HT202604001", applicant: "张明", applyTime: "2026-03-15 14:20" },
  { id: "5", index: 5, businessUnit: "杭州分公司", branch: "西湖支局", personName: "李四", phone: "138****2345", empNo: "EMP002", dept: "西湖支局-销售部", settlementName: "2026年3月自交付结算", settlementCode: "JSD202603001", isCycle: false, paymentPeriod: "2026-03", status: "已发放", settlementAmount: "2,500.00", businessType: "项目型", businessCode: "HT202604001", applicant: "张明", applyTime: "2026-03-15 14:20" },
  { id: "6", index: 6, businessUnit: "宁波分公司", branch: "鄞州支局", personName: "赵六", phone: "138****4567", empNo: "EMP004", dept: "鄞州支局-销售部", settlementName: "2026年4月自交付结算", settlementCode: "JSD202604002", isCycle: true, paymentPeriod: "2026-04", status: "已发放", settlementAmount: "3,000.00", businessType: "小微标品", businessCode: "WO202604001", applicant: "李华", applyTime: "2026-04-10 09:15" },
  { id: "7", index: 7, businessUnit: "宁波分公司", branch: "鄞州支局", personName: "钱七", phone: "138****5678", empNo: "EMP005", dept: "鄞州支局-销售部", settlementName: "2026年4月自交付结算", settlementCode: "JSD202604002", isCycle: true, paymentPeriod: "2026-04", status: "已发放", settlementAmount: "3,000.00", businessType: "小微标品", businessCode: "WO202604001", applicant: "李华", applyTime: "2026-04-10 09:15" },
  { id: "8", index: 8, businessUnit: "台州分公司", branch: "椒江支局", personName: "孙八", phone: "138****6789", empNo: "EMP006", dept: "椒江支局-销售部", settlementName: "2026年5月自交付结算", settlementCode: "JSD202605001", isCycle: true, paymentPeriod: "2026-05", status: "审核中", settlementAmount: "4,500.00", businessType: "小微标品", businessCode: "WO202604005", applicant: "王九", applyTime: "2026-05-10 11:00" },
  { id: "9", index: 9, businessUnit: "温州分公司", branch: "鹿城支局", personName: "周十", phone: "138****7890", empNo: "EMP007", dept: "鹿城支局-销售部", settlementName: "2026年4月自交付结算", settlementCode: "JSD202604003", isCycle: false, paymentPeriod: "2026-04", status: "审核通过", settlementAmount: "4,000.00", businessType: "三联单", businessCode: "DD202604001", applicant: "刘十一", applyTime: "2026-04-20 15:30" },
  { id: "10", index: 10, businessUnit: "温州分公司", branch: "鹿城支局", personName: "吴一", phone: "138****8901", empNo: "EMP008", dept: "鹿城支局-销售部", settlementName: "2026年4月自交付结算", settlementCode: "JSD202604003", isCycle: false, paymentPeriod: "2026-04", status: "审核通过", settlementAmount: "4,000.00", businessType: "三联单", businessCode: "DD202604001", applicant: "刘十一", applyTime: "2026-04-20 15:30" },
  { id: "11", index: 11, businessUnit: "温州分公司", branch: "鹿城支局", personName: "郑二", phone: "138****9012", empNo: "EMP009", dept: "鹿城支局-销售部", settlementName: "2026年4月自交付结算", settlementCode: "JSD202604003", isCycle: false, paymentPeriod: "2026-04", status: "审核通过", settlementAmount: "4,000.00", businessType: "三联单", businessCode: "DD202604001", applicant: "刘十一", applyTime: "2026-04-20 15:30" },
];

export function PersonSettlementList() {
  const [searchBusinessUnit, setSearchBusinessUnit] = useState("");
  const [searchBranch, setSearchBranch] = useState("");
  const [searchPerson, setSearchPerson] = useState("");
  const [searchBusinessType, setSearchBusinessType] = useState<string>("全部");
  const [searchStatus, setSearchStatus] = useState<string>("全部");
  const [searchBusinessCode, setSearchBusinessCode] = useState("");
  const [searchApplicant, setSearchApplicant] = useState("");
  const [searchDateStart, setSearchDateStart] = useState("");
  const [searchDateEnd, setSearchDateEnd] = useState("");
  const [searchIsCycle, setSearchIsCycle] = useState<string>("全部");
  const [searchPaymentPeriod, setSearchPaymentPeriod] = useState("");

  const filteredData = mockData.filter(item => {
    if (searchBusinessUnit && !item.businessUnit.includes(searchBusinessUnit)) return false;
    if (searchBranch && !item.branch.includes(searchBranch)) return false;
    if (searchPerson && !item.personName.includes(searchPerson)) return false;
    if (searchBusinessType !== "全部" && item.businessType !== searchBusinessType) return false;
    if (searchStatus !== "全部" && item.status !== searchStatus) return false;
    if (searchBusinessCode && !item.businessCode.includes(searchBusinessCode)) return false;
    if (searchApplicant && !item.applicant.includes(searchApplicant)) return false;
    if (searchDateStart && item.applyTime < searchDateStart) return false;
    if (searchDateEnd && item.applyTime > searchDateEnd + " 23:59") return false;
    if (searchIsCycle !== "全部" && item.isCycle !== (searchIsCycle === "是")) return false;
    if (searchPaymentPeriod && !item.paymentPeriod.includes(searchPaymentPeriod)) return false;
    return true;
  });

  const getStatusBadge = (status: SettlementStatus) => {
    const styles: Record<SettlementStatus, string> = {
      "审核中": "bg-blue-100 text-blue-700",
      "审核通过": "bg-green-100 text-green-700",
      "审核驳回": "bg-red-100 text-red-700",
      "待发放": "bg-gray-100 text-gray-700",
      "可发放": "bg-amber-100 text-amber-700",
      "已发放": "bg-emerald-100 text-emerald-700"
    };
    return styles[status];
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 pt-6 pb-0 flex-shrink-0">
        <h2 className="text-lg font-medium text-gray-900">人员自交付结算清单</h2>
        <p className="text-sm text-gray-500 mt-1">人员维度自交付结算明细查询</p>
      </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-1">结算人员</label>
              <Input placeholder="请输入姓名" value={searchPerson} onChange={e => setSearchPerson(e.target.value)} />
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
                  <SelectItem value="待发放">待发放</SelectItem>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">是否周期项目</label>
              <Select value={searchIsCycle} onValueChange={setSearchIsCycle}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="全部">全部</SelectItem>
                  <SelectItem value="是">是</SelectItem>
                  <SelectItem value="否">否</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">发放账期</label>
              <Input type="month" value={searchPaymentPeriod} onChange={e => setSearchPaymentPeriod(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
            <Button variant="outline" className="gap-1" onClick={() => {
              setSearchBusinessUnit(""); setSearchBranch(""); setSearchPerson(""); setSearchBusinessType("全部");
              setSearchStatus("全部"); setSearchBusinessCode(""); setSearchApplicant(""); setSearchDateStart(""); setSearchDateEnd("");
              setSearchIsCycle("全部"); setSearchPaymentPeriod("");
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
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-12">序号</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-24">经营单元</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">支局</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">姓名</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-24">电话</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">工号</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-28">部门</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 min-w-32">结算单名称</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-32">结算单号</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-600 w-24">是否周期项目</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-600 w-24">发放账期</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">结算状态</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-600 w-24">结算金额</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">业务类型</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-32">合同/小微工单/三联单编码</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">申请人</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-600 w-32">申请时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-3 py-3">{row.index}</td>
                  <td className="px-3 py-3">{row.businessUnit}</td>
                  <td className="px-3 py-3">{row.branch}</td>
                  <td className="px-3 py-3 font-medium">{row.personName}</td>
                  <td className="px-3 py-3 text-gray-500">{row.phone}</td>
                  <td className="px-3 py-3">{row.empNo}</td>
                  <td className="px-3 py-3 text-xs text-gray-600">{row.dept}</td>
                  <td className="px-3 py-3">{row.settlementName}</td>
                  <td className="px-3 py-3">{row.settlementCode}</td>
                  <td className="px-3 py-3 text-center">{row.isCycle ? "是" : "否"}</td>
                  <td className="px-3 py-3 text-center text-gray-600">{row.paymentPeriod}</td>
                  <td className="px-3 py-3">
                    <Badge className={getStatusBadge(row.status)}>{row.status}</Badge>
                  </td>
                  <td className="px-3 py-3 text-right text-green-600 font-medium">{row.settlementAmount}</td>
                  <td className="px-3 py-3">
                    <Badge className={row.businessType === "项目型" ? "bg-blue-100 text-blue-700" : row.businessType === "小微标品" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"}>
                      {row.businessType}
                    </Badge>
                  </td>
                  <td className="px-3 py-3">{row.businessCode}</td>
                  <td className="px-3 py-3">{row.applicant}</td>
                  <td className="px-3 py-3 text-center text-xs text-gray-600">{row.applyTime}</td>
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
