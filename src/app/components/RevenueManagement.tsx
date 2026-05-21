import React, { useState } from "react";
import { Search, RefreshCw, ChevronDown, ChevronRight, ChevronUp, Plus, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { RevenueApplyDialog } from "./RevenueApplyDialog";
import { RevenueDetailDialog } from "./RevenueDetailDialog";
import { InnerApprovalList } from "./InnerApprovalList";

interface RevenueRecord {
  id: string;
  index: number;
  oppName: string;
  oppCode: string;
  contractName: string;
  contractCode: string;
  projectName: string;
  projectCode: string;
  isCompleted: boolean;
  lastRevenueTime: string;
  totalAmount: {
    total: string;
    service: string;
    standard: string;
    basic: string;
    equipment: string;
    agency: string;
  };
  confirmedAmount: {
    total: string;
    service: string;
    standard: string;
    basic: string;
    equipment: string;
    agency: string;
  };
  unconfirmedAmount: {
    total: string;
    service: string;
    standard: string;
    basic: string;
    equipment: string;
    agency: string;
  };
  approvalList: ApprovalRecord[];
  otherChannelList: OtherChannelRecord[];
}

interface OtherChannelRecord {
  id: string;
  index: number;
  contractName: string;
  contractCode: string;
  productRevenue: string;
  productRevenueCode: string;
  billingPeriod: string;
  amountWithoutTax: string;
}

interface ApprovalRecord {
  id: string;
  index: number;
  name: string;
  amount: string;
  eipNumber: string;
  eipDocId: string;
  draftDept: string;
  syncEipTime: string;
  eipStatus: string;
  presaleOrderNo: string;
  orderId: string;
  orderCode: string;
  sync30Time: string;
}

const mockData: RevenueRecord[] = [
  {
    id: "1",
    index: 1,
    oppName: "中国邮政速递物流股份有限公司台州市分公司ICT项目",
    oppCode: "20260428TZ84",
    contractName: "台州邮政ICT服务合同",
    contractCode: "HT202604001",
    projectName: "台州邮政ICT实施项目",
    projectCode: "XM202604001",
    isCompleted: true,
    lastRevenueTime: "2026-05-10 09:30",
    totalAmount: { total: "500,000.00", service: "300,000.00", standard: "100,000.00", basic: "50,000.00", equipment: "30,000.00", agency: "20,000.00" },
    confirmedAmount: { total: "450,000.00", service: "270,000.00", standard: "90,000.00", basic: "45,000.00", equipment: "27,000.00", agency: "18,000.00" },
    unconfirmedAmount: { total: "50,000.00", service: "30,000.00", standard: "10,000.00", basic: "5,000.00", equipment: "3,000.00", agency: "2,000.00" },
    approvalList: [
      { id: "a1", index: 1, name: "2026年4月服务费确认", amount: "50,000.00", eipNumber: "EIP20260415001", eipDocId: "DOC001", draftDept: "杭州分公司", syncEipTime: "2026-04-15 10:30", eipStatus: "审核通过", presaleOrderNo: "PSO202604001", orderId: "ORD001", orderCode: "ORD202604001", sync30Time: "2026-04-16 09:00" },
      { id: "a2", index: 2, name: "2026年3月服务费确认", amount: "50,000.00", eipNumber: "EIP20260315002", eipDocId: "DOC002", draftDept: "杭州分公司", syncEipTime: "2026-03-15 10:30", eipStatus: "审核通过", presaleOrderNo: "PSO202603001", orderId: "ORD002", orderCode: "ORD202603001", sync30Time: "2026-03-16 09:00" }
    ],
    otherChannelList: [
      { id: "oc1", index: 1, contractName: "台州邮政ICT服务合同", contractCode: "HT202604001", productRevenue: "ICT服务费", productRevenueCode: "P001", billingPeriod: "2026-04", amountWithoutTax: "9,433.96" },
      { id: "oc2", index: 2, contractName: "台州邮政ICT服务合同", contractCode: "HT202604001", productRevenue: "运维服务费", productRevenueCode: "P002", billingPeriod: "2026-03", amountWithoutTax: "4,716.98" }
    ]
  },
  {
    id: "2",
    index: 2,
    oppName: "中国美术学院校园算力项目",
    oppCode: "20260428HZ01",
    contractName: "算力服务合同",
    contractCode: "HT202604002",
    projectName: "校园算力建设",
    projectCode: "XM202604002",
    isCompleted: false,
    lastRevenueTime: "2026-04-20 14:00",
    totalAmount: { total: "200,000.00", service: "120,000.00", standard: "50,000.00", basic: "20,000.00", equipment: "10,000.00", agency: "0.00" },
    confirmedAmount: { total: "80,000.00", service: "48,000.00", standard: "20,000.00", basic: "8,000.00", equipment: "4,000.00", agency: "0.00" },
    unconfirmedAmount: { total: "120,000.00", service: "72,000.00", standard: "30,000.00", basic: "12,000.00", equipment: "6,000.00", agency: "0.00" },
    approvalList: [
      { id: "a3", index: 1, name: "2026年4月算力服务确认", amount: "40,000.00", eipNumber: "EIP20260420003", eipDocId: "DOC003", draftDept: "杭州分公司", syncEipTime: "-", eipStatus: "待提交", presaleOrderNo: "PSO202604002", orderId: "ORD003", orderCode: "ORD202604002", sync30Time: "-" },
      { id: "a4", index: 2, name: "2026年5月算力服务确认", amount: "40,000.00", eipNumber: "EIP20260515004", eipDocId: "DOC004", draftDept: "杭州分公司", syncEipTime: "2026-05-15 10:30", eipStatus: "审核中", presaleOrderNo: "PSO202605001", orderId: "ORD004", orderCode: "ORD202605001", sync30Time: "-" },
      { id: "a5", index: 3, name: "2026年3月算力服务确认", amount: "40,000.00", eipNumber: "EIP20260315005", eipDocId: "DOC005", draftDept: "杭州分公司", syncEipTime: "2026-03-15 10:30", eipStatus: "审核驳回", presaleOrderNo: "PSO202603001", orderId: "ORD005", orderCode: "ORD202603001", sync30Time: "-" }
    ],
    otherChannelList: [
      { id: "oc3", index: 1, contractName: "算力服务合同", contractCode: "HT202604002", productRevenue: "算力服务费", productRevenueCode: "P003", billingPeriod: "2026-04", amountWithoutTax: "37,735.85" }
    ]
  },
  {
    id: "3",
    index: 3,
    oppName: "宁波港数字化转型ICT项目",
    oppCode: "20260428NB25",
    contractName: "宁波港数字化转型合同",
    contractCode: "HT202604003",
    projectName: "数字化转型一期",
    projectCode: "XM202604003",
    isCompleted: false,
    lastRevenueTime: "-",
    totalAmount: { total: "800,000.00", service: "500,000.00", standard: "150,000.00", basic: "100,000.00", equipment: "50,000.00", agency: "0.00" },
    confirmedAmount: { total: "0.00", service: "0.00", standard: "0.00", basic: "0.00", equipment: "0.00", agency: "0.00" },
    unconfirmedAmount: { total: "800,000.00", service: "500,000.00", standard: "150,000.00", basic: "100,000.00", equipment: "50,000.00", agency: "0.00" },
    approvalList: [],
    otherChannelList: []
  }
];

// 金额类别配置
const amountSubItems = ["产数服务", "产数标品", "基本面", "设备销售", "代收代付"];

export function RevenueManagement() {
  const [searchOppName, setSearchOppName] = useState("");
  const [searchOppCode, setSearchOppCode] = useState("");
  const [searchContractName, setSearchContractName] = useState("");
  const [searchContractCode, setSearchContractCode] = useState("");
  const [searchProjectName, setSearchProjectName] = useState("");
  const [searchProjectCode, setSearchProjectCode] = useState("");
  const [searchStatus, setSearchStatus] = useState("全部");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [expandedAmountCols, setExpandedAmountCols] = useState<Set<string>>(new Set());
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<(RevenueRecord & { selectedApproval?: ApprovalRecord }) | null>(null);
  const [showAllConditions, setShowAllConditions] = useState(false);
  const [copiedApproval, setCopiedApproval] = useState<ApprovalRecord | null>(null);

  // 计算录收状态：未录收 / 部分录收 / 录收完成
  const getRevenueStatus = (row: RevenueRecord): "未录收" | "部分录收" | "录收完成" => {
    if (row.isCompleted) return "录收完成";
    if (row.approvalList.length > 0) return "部分录收";
    return "未录收";
  };

  const toggleRowExpand = (id: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleCopyRecord = (record: ApprovalRecord) => {
    setCopiedApproval(record);
    setApplyDialogOpen(true);
  };

  const toggleAmountCol = (colId: string) => {
    setExpandedAmountCols(prev => {
      const newSet = new Set(prev);
      if (newSet.has(colId)) newSet.delete(colId);
      else newSet.add(colId);
      return newSet;
    });
  };

  const getAmountValue = (row: RevenueRecord, categoryId: string, itemName: string) => {
    const amountObj = categoryId === "confirmedAmount" ? row.confirmedAmount :
                     categoryId === "unconfirmedAmount" ? row.unconfirmedAmount :
                     row.totalAmount;
    switch (itemName) {
      case "产数服务": return amountObj.service;
      case "产数标品": return amountObj.standard;
      case "基本面": return amountObj.basic;
      case "设备销售": return amountObj.equipment;
      case "代收代付": return amountObj.agency;
      default: return amountObj.total;
    }
  };

  const filteredData = mockData.filter(item => {
    if (searchOppName && !item.oppName.includes(searchOppName)) return false;
    if (searchOppCode && !item.oppCode.includes(searchOppCode)) return false;
    if (searchContractName && !item.contractName.includes(searchContractName)) return false;
    if (searchContractCode && !item.contractCode.includes(searchContractCode)) return false;
    if (searchProjectName && !item.projectName.includes(searchProjectName)) return false;
    if (searchProjectCode && !item.projectCode.includes(searchProjectCode)) return false;
    if (searchStatus !== "全部") {
      const status = getRevenueStatus(item);
      if (searchStatus === "未录收" && status !== "未录收") return false;
      if (searchStatus === "部分录收" && status !== "部分录收") return false;
      if (searchStatus === "录收完成" && status !== "录收完成") return false;
    }
    return true;
  });

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 页面标题 */}
      <div className="px-6 pt-6 pb-0 flex-shrink-0">
        <h2 className="text-lg font-medium text-gray-900">录收管理</h2>
        <p className="text-sm text-gray-500 mt-1">商机录收情况统计与管理</p>
      </div>



      {/* 查询条件区域 */}
      <div className="px-6 mt-6 flex-shrink-0">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-4 gap-x-6 gap-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">商机名称</label>
              <Input placeholder="请输入" value={searchOppName} onChange={e => setSearchOppName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">商机编码</label>
              <Input placeholder="请输入" value={searchOppCode} onChange={e => setSearchOppCode(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">合同名称</label>
              <Input placeholder="请输入" value={searchContractName} onChange={e => setSearchContractName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">合同编码</label>
              <Input placeholder="请输入" value={searchContractCode} onChange={e => setSearchContractCode(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">项目名称</label>
              <Input placeholder="请输入" value={searchProjectName} onChange={e => setSearchProjectName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">项目编码</label>
              <Input placeholder="请输入" value={searchProjectCode} onChange={e => setSearchProjectCode(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">录收状态</label>
              <Select value={searchStatus} onValueChange={setSearchStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="全部">全部</SelectItem>
                  <SelectItem value="未录收">未录收</SelectItem>
                  <SelectItem value="部分录收">部分录收</SelectItem>
                  <SelectItem value="录收完成">录收完成</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button className="gap-1">
                <Search className="w-4 h-4" />
                查询
              </Button>
              <Button variant="outline" className="gap-1">
                <RefreshCw className="w-4 h-4" />
                重置
              </Button>
              <Button variant="link" size="sm" onClick={() => setShowAllConditions(!showAllConditions)}>
                {showAllConditions ? "收起" : "更多"}
                {showAllConditions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 操作栏 */}
      <div className="px-6 py-3 flex-shrink-0 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          共 <span className="font-medium text-gray-900">{filteredData.length}</span> 条记录
        </div>
        <Button className="gap-1" onClick={() => setApplyDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          申请录收
        </Button>
      </div>

      {/* 表格 - 框内横向滚动 */}
      <div className="flex-1 overflow-hidden px-6 pb-6">
        <div className="h-full bg-white rounded-lg border border-gray-200 overflow-x-auto overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-10">展开</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-12">序号</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600">商机名称</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-32">商机编码</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600">合同名称</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-32">合同编码</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600">项目名称</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-32">项目编码</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-24">是否录收完成</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-32">最新录收时间</th>

                {/* 项目总金额 */}
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-600 w-28">
                  <button
                    onClick={() => toggleAmountCol("totalAmount")}
                    className="flex items-center justify-center gap-1 hover:text-blue-600 transition-colors w-full"
                  >
                    <span>项目总金额</span>
                    {expandedAmountCols.has("totalAmount") ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </button>
                </th>
                {expandedAmountCols.has("totalAmount") && amountSubItems.map((item) => (
                  <th key={`totalAmount_${item}`} className="px-3 py-3 text-center text-xs font-medium text-gray-500 bg-blue-50 w-24">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-400">{item}</span>
                    </div>
                  </th>
                ))}

                {/* 确认录收金额 */}
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-600 w-28">
                  <button
                    onClick={() => toggleAmountCol("confirmedAmount")}
                    className="flex items-center justify-center gap-1 hover:text-blue-600 transition-colors w-full"
                  >
                    <span>确认录收金额</span>
                    {expandedAmountCols.has("confirmedAmount") ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </button>
                </th>
                {expandedAmountCols.has("confirmedAmount") && amountSubItems.map((item) => (
                  <th key={`confirmedAmount_${item}`} className="px-3 py-3 text-center text-xs font-medium text-gray-500 bg-blue-50 w-24">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-400">{item}</span>
                    </div>
                  </th>
                ))}

                {/* 未确认录收金额 */}
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-600 w-28">
                  <button
                    onClick={() => toggleAmountCol("unconfirmedAmount")}
                    className="flex items-center justify-center gap-1 hover:text-blue-600 transition-colors w-full"
                  >
                    <span>未确认录收金额</span>
                    {expandedAmountCols.has("unconfirmedAmount") ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </button>
                </th>
                {expandedAmountCols.has("unconfirmedAmount") && amountSubItems.map((item) => (
                  <th key={`unconfirmedAmount_${item}`} className="px-3 py-3 text-center text-xs font-medium text-gray-500 bg-blue-50 w-24">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-400">{item}</span>
                    </div>
                  </th>
                ))}

                {/* 操作列 - 固定在右侧 */}
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-44 bg-gray-50 sticky right-0 z-20">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map(row => (
                <React.Fragment key={row.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-3">
                      {(getRevenueStatus(row) === "部分录收" || getRevenueStatus(row) === "录收完成") ? (
                        <button onClick={() => toggleRowExpand(row.id)} className="p-1 hover:bg-gray-100 rounded">
                          {expandedRows.has(row.id) ? (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                      ) : (
                        <span className="w-4 inline-block"></span>
                      )}
                    </td>
                    <td className="px-3 py-3">{row.index}</td>
                    <td className="px-3 py-3 max-w-48 truncate" title={row.oppName}>{row.oppName}</td>
                    <td className="px-3 py-3">{row.oppCode}</td>
                    <td className="px-3 py-3 max-w-32 truncate" title={row.contractName}>{row.contractName}</td>
                    <td className="px-3 py-3">{row.contractCode}</td>
                    <td className="px-3 py-3 max-w-32 truncate" title={row.projectName}>{row.projectName}</td>
                    <td className="px-3 py-3">{row.projectCode}</td>
                    <td className="px-3 py-3">
                      {getRevenueStatus(row) === "录收完成" && (
                        <Badge className="bg-green-100 text-green-700">录收完成</Badge>
                      )}
                      {getRevenueStatus(row) === "部分录收" && (
                        <Badge className="bg-blue-100 text-blue-700">部分录收</Badge>
                      )}
                      {getRevenueStatus(row) === "未录收" && (
                        <Badge className="bg-orange-100 text-orange-700">未录收</Badge>
                      )}
                    </td>
                    <td className="px-3 py-3">{row.lastRevenueTime}</td>

                    {/* 项目总金额数据 */}
                    <td className="px-3 py-3 text-right font-medium">{row.totalAmount.total}</td>
                    {expandedAmountCols.has("totalAmount") && amountSubItems.map((item) => (
                      <td key={`totalAmount_${item}`} className="px-3 py-3 text-right text-xs text-gray-400 bg-blue-50/50">
                        {getAmountValue(row, "totalAmount", item)}
                      </td>
                    ))}

                    {/* 确认录收金额数据 */}
                    <td className="px-3 py-3 text-right font-medium text-green-600">{row.confirmedAmount.total}</td>
                    {expandedAmountCols.has("confirmedAmount") && amountSubItems.map((item) => (
                      <td key={`confirmedAmount_${item}`} className="px-3 py-3 text-right text-xs text-gray-400 bg-blue-50/50">
                        {getAmountValue(row, "confirmedAmount", item)}
                      </td>
                    ))}

                    {/* 未确认录收金额数据 */}
                    <td className="px-3 py-3 text-right font-medium text-orange-600">{row.unconfirmedAmount.total}</td>
                    {expandedAmountCols.has("unconfirmedAmount") && amountSubItems.map((item) => (
                      <td key={`unconfirmedAmount_${item}`} className="px-3 py-3 text-right text-xs text-gray-400 bg-blue-50/50">
                        {getAmountValue(row, "unconfirmedAmount", item)}
                      </td>
                    ))}

                    {/* 操作列 - 固定在右侧 */}
                    <td className="px-3 py-3 bg-gray-50 sticky right-0 z-10">
                      <div className="flex gap-2">
                        {/* 未录收：仅申请录收 */}
                        {getRevenueStatus(row) === "未录收" && (
                          <Button variant="link" size="sm" className="text-blue-600 h-auto p-0 flex items-center gap-1 whitespace-nowrap" onClick={() => setApplyDialogOpen(true)}>
                            <Plus className="w-3 h-3" />
                            申请录收
                          </Button>
                        )}
                        {/* 部分录收：查看审批单 + 申请录收 + 复制录收 */}
                        {getRevenueStatus(row) === "部分录收" && (
                          <>
                            <Button variant="link" size="sm" className="text-blue-600 h-auto p-0 flex items-center gap-1 whitespace-nowrap" onClick={() => toggleRowExpand(row.id)}>
                              <Eye className="w-3 h-3" />
                              查看审批单
                            </Button>
                            <Button variant="link" size="sm" className="text-blue-600 h-auto p-0 flex items-center gap-1 whitespace-nowrap" onClick={() => setApplyDialogOpen(true)}>
                              <Plus className="w-3 h-3" />
                              申请录收
                            </Button>
                            <Button variant="link" size="sm" className="text-blue-600 h-auto p-0 flex items-center gap-1 whitespace-nowrap" onClick={() => {
                              setCopiedApproval(row.approvalList[0]);
                              setApplyDialogOpen(true);
                            }}>
                              复制录收
                            </Button>
                          </>
                        )}
                        {/* 录收完成：仅查看审批单 */}
                        {getRevenueStatus(row) === "录收完成" && (
                          <Button variant="link" size="sm" className="text-blue-600 h-auto p-0 flex items-center gap-1 whitespace-nowrap" onClick={() => toggleRowExpand(row.id)}>
                            <Eye className="w-3 h-3" />
                            查看审批单
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* 内层列表 */}
                  {expandedRows.has(row.id) && (
                    <tr className="bg-gray-50">
                      <td colSpan={14 + (expandedAmountCols.has("totalAmount") ? 5 : 0) + (expandedAmountCols.has("confirmedAmount") ? 5 : 0) + (expandedAmountCols.has("unconfirmedAmount") ? 5 : 0)} className="p-0 align-top">
                        <div className="space-y-3 py-3 px-4">
                          {/* 录收审批单列表 */}
                          {row.approvalList.length > 0 && <InnerApprovalList list={row.approvalList} onCopyRecord={handleCopyRecord} onViewDetail={(approval) => { setSelectedRecord({ ...row, selectedApproval: approval }); setDetailDialogOpen(true); }} />}
                          {/* 其他渠道录收列表 */}
                          <div className="bg-white border border-gray-200 rounded-lg">
                            <div className="px-4 py-2 border-b border-gray-200 bg-gray-200">
                              <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <span className="w-1 h-4 bg-blue-500 rounded flex-shrink-0"></span>
                                其他渠道录收列表
                              </div>
                            </div>
                            {row.otherChannelList.length > 0 ? (
                              <div className="overflow-x-auto" style={{ maxHeight: "200px" }}>
                                <table className="w-full text-sm" style={{ minWidth: "100%" }}>
                                  <thead className="bg-gray-100 border-b border-gray-200 sticky top-0 z-10">
                                    <tr>
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-12">序号</th>
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-40">合同名称</th>
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-28">合同编码</th>
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-40">产品收入项</th>
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-28">产品收入项编码</th>
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-20">账期</th>
                                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-600 w-28">金额（不含税）</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                    {row.otherChannelList.map(item => (
                                      <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-3 py-2">{item.index}</td>
                                        <td className="px-3 py-2 max-w-40 truncate" title={item.contractName}>{item.contractName}</td>
                                        <td className="px-3 py-2">{item.contractCode}</td>
                                        <td className="px-3 py-2 max-w-40 truncate" title={item.productRevenue}>{item.productRevenue}</td>
                                        <td className="px-3 py-2">{item.productRevenueCode}</td>
                                        <td className="px-3 py-2">{item.billingPeriod}</td>
                                        <td className="px-3 py-2 text-right font-medium text-green-600">{item.amountWithoutTax}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="px-4 py-6 text-center text-sm text-gray-400">暂无数据</div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={20} className="px-3 py-8 text-center text-gray-500">
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 申请录收弹窗 */}
      <RevenueApplyDialog
        open={applyDialogOpen}
        onClose={() => {
          setApplyDialogOpen(false);
          setCopiedApproval(null);
        }}
        initialApproval={copiedApproval}
      />

      {/* 录收详情弹窗 */}
      <RevenueDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        record={selectedRecord}
      />
</div>
  );
}
