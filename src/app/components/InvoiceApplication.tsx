import React, { useState } from "react";
import { Search, Plus, RefreshCw, Eye, Edit, Download, FileText, AlertCircle, CheckCircle2, XCircle, Clock, ArrowLeft, Paperclip } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface InvoiceApplicationRecord {
  id: string;
  applicationCode: string;
  projectCode: string;
  projectName: string;
  contractCode: string;
  invoiceAmount: number;
  paymentNode: string;
  applicant: string;
  applicationTime: string;
  status: "待提交" | "审批中" | "已驳回" | "已审批" | "开票中" | "已开票" | "已作废";
  approvalProgress: string;
  invoiceNumber?: string;
}

interface InvoiceLedgerRecord {
  id: string;
  projectName: string;
  contractCode: string;
  applicationCode: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceAmount: number;
  taxRate: string;
  paymentNode: string;
  paymentStatus: "未回款" | "部分回款" | "已回款";
  receivedAmount: number;
  receivedDate?: string;
}

const mockApplications: InvoiceApplicationRecord[] = [
  {
    id: "1",
    applicationCode: "IA-2024-001",
    projectCode: "PRJ-2024-001",
    projectName: "智慧城市综合管理平台建设项目",
    contractCode: "CT-2024-001",
    invoiceAmount: 2320000,
    paymentNode: "初验完成",
    applicant: "张三 / 技术部",
    applicationTime: "2024-03-10 14:30:25",
    status: "已开票",
    approvalProgress: "4/4",
    invoiceNumber: "INV-2024-0315-001"
  },
  {
    id: "2",
    applicationCode: "IA-2024-002",
    projectCode: "PRJ-2024-002",
    projectName: "政务云平台升级改造项目",
    contractCode: "CT-2024-002",
    invoiceAmount: 1280000,
    paymentNode: "系统上线",
    applicant: "李四 / 技术部",
    applicationTime: "2024-03-12 10:15:30",
    status: "审批中",
    approvalProgress: "2/4"
  },
  {
    id: "3",
    applicationCode: "IA-2024-003",
    projectCode: "PRJ-2024-003",
    projectName: "数据中心基础设施建设项目",
    contractCode: "CT-2024-003",
    invoiceAmount: 3560000,
    paymentNode: "设备安装完成",
    applicant: "王五 / 工程部",
    applicationTime: "2024-03-13 09:20:15",
    status: "待提交",
    approvalProgress: "0/4"
  }
];

const mockLedger: InvoiceLedgerRecord[] = [
  {
    id: "1",
    projectName: "智慧���市综合管理平台建设项目",
    contractCode: "CT-2024-001",
    applicationCode: "IA-2024-001",
    invoiceNumber: "INV-2024-0315-001",
    invoiceDate: "2024-03-15",
    invoiceAmount: 2320000,
    taxRate: "6%",
    paymentNode: "初验完成",
    paymentStatus: "部分回款",
    receivedAmount: 1500000,
    receivedDate: "2024-03-18"
  }
];

export function InvoiceApplication() {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [applications] = useState<InvoiceApplicationRecord[]>(mockApplications);
  const [ledger] = useState<InvoiceLedgerRecord[]>(mockLedger);
  const [viewMode, setViewMode] = useState<"list" | "new" | "edit" | "detail">("list");
  const [selectedApplication, setSelectedApplication] = useState<InvoiceApplicationRecord | null>(null);

  // 新增表单状态
  const [formData, setFormData] = useState({
    projectCode: "",
    projectName: "",
    contractCode: "",
    contractAmount: "",
    invoiceAmount: "",
    paymentNode: "",
    invoiceType: "增值税专用发票",
    taxRate: "6%",
    buyerName: "",
    buyerTaxNo: "",
    buyerAddress: "",
    buyerPhone: "",
    buyerBank: "",
    buyerAccount: "",
    remark: ""
  });

  const handleNewInvoiceApplication = () => {
    setViewMode("new");
    setFormData({
      projectCode: "",
      projectName: "",
      contractCode: "",
      contractAmount: "",
      invoiceAmount: "",
      paymentNode: "",
      invoiceType: "增值税专用发票",
      taxRate: "6%",
      buyerName: "",
      buyerTaxNo: "",
      buyerAddress: "",
      buyerPhone: "",
      buyerBank: "",
      buyerAccount: "",
      remark: ""
    });
  };

  const handleEditApplication = (application: InvoiceApplicationRecord) => {
    setSelectedApplication(application);
    setViewMode("edit");
    setFormData({
      projectCode: application.projectCode,
      projectName: application.projectName,
      contractCode: application.contractCode,
      contractAmount: "1790",
      invoiceAmount: (application.invoiceAmount / 10000).toString(),
      paymentNode: application.paymentNode,
      invoiceType: "增值税专用发票",
      taxRate: "6%",
      buyerName: "XX市政府",
      buyerTaxNo: "91XXXXXXXXXX",
      buyerAddress: "XX市XX区XX路XX号",
      buyerPhone: "0XX-XXXXXXXX",
      buyerBank: "XX银行XX支行",
      buyerAccount: "XXXXXXXXXXXXXXXXXXXX",
      remark: ""
    });
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedApplication(null);
  };

  const handleSubmitForm = () => {
    alert("开票申请已提交，等待审批");
    handleBackToList();
  };

  const handleSaveDraft = () => {
    alert("草稿已保存");
    handleBackToList();
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleViewDetail = (application: InvoiceApplicationRecord) => {
    setSelectedApplication(application);
    setViewMode("detail");
  };

  const getStatusBadge = (status: InvoiceApplicationRecord["status"]) => {
    const variants: Record<InvoiceApplicationRecord["status"], string> = {
      "待提交": "bg-gray-100 text-gray-600 border border-gray-300",
      "审批中": "bg-blue-50 text-blue-600 border border-blue-300",
      "已驳回": "bg-red-50 text-red-600 border border-red-300",
      "已审批": "bg-green-50 text-green-600 border border-green-300",
      "开票中": "bg-orange-50 text-orange-600 border border-orange-300",
      "已开票": "bg-green-50 text-green-600 border border-green-300",
      "已作废": "bg-gray-100 text-gray-400 border border-gray-300"
    };
    return <Badge className={variants[status]}>{status}</Badge>;
  };

  const getPaymentStatusBadge = (status: InvoiceLedgerRecord["paymentStatus"]) => {
    const variants: Record<InvoiceLedgerRecord["paymentStatus"], string> = {
      "未回款": "bg-red-50 text-red-600 border border-red-300",
      "部分回款": "bg-orange-50 text-orange-600 border border-orange-300",
      "已回款": "bg-green-50 text-green-600 border border-green-300"
    };
    return <Badge className={variants[status]}>{status}</Badge>;
  };

  const filteredApplications = applications.filter(item => {
    const matchesSearch = 
      item.projectName.includes(searchText) || 
      item.projectCode.includes(searchText) ||
      item.contractCode.includes(searchText) ||
      item.applicationCode.includes(searchText);
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 计算统计数据
  const totalContractAmount = 17900000; // 示例合同总金额
  const totalInvoicedAmount = ledger.reduce((sum, item) => sum + item.invoiceAmount, 0);
  const invoiceCompletionRate = ((totalInvoicedAmount / totalContractAmount) * 100).toFixed(1);
  const totalReceivedAmount = ledger.reduce((sum, item) => sum + item.receivedAmount, 0);
  const receivedRate = ((totalReceivedAmount / totalInvoicedAmount) * 100).toFixed(1);
  const unreceived = totalInvoicedAmount - totalReceivedAmount;

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">项目开票申请</h2>
        <p className="text-sm text-gray-500 mt-1">开票申请管理、审批流程、开票台账的全流程管理</p>
      </div>

      {viewMode === "list" ? (
        <Tabs defaultValue="applications" className="space-y-4">
          <TabsList>
            <TabsTrigger value="applications">开票申请</TabsTrigger>
            <TabsTrigger value="ledger">开票台账</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-4">
            {/* 查询筛选区 */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="搜索项目名称/编号、合同编号、申请单编号"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="申请状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="待提交">待提交</SelectItem>
                      <SelectItem value="审批中">审批中</SelectItem>
                      <SelectItem value="已驳回">已驳回</SelectItem>
                      <SelectItem value="已审批">已审批</SelectItem>
                      <SelectItem value="开票中">开票中</SelectItem>
                      <SelectItem value="已开票">已开票</SelectItem>
                      <SelectItem value="已作废">已作废</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setSearchText(""); setStatusFilter("all"); }}>
                    重置
                  </Button>
                </div>
              </div>
            </div>

            {/* 操作按钮区 */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button className="bg-[#1890ff] hover:bg-[#0d7dea] text-white" onClick={handleNewInvoiceApplication}>
                  <Plus className="w-4 h-4 mr-1" />
                  新增开票申请
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-1" />
                  批量导出
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-1" />
                刷新
              </Button>
            </div>

            {/* 金额统计栏 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">累计申请金额</div>
                    <div className="text-2xl font-semibold text-gray-900">
                      ¥{(applications.reduce((sum, item) => sum + item.invoiceAmount, 0) / 10000).toFixed(2)}万
                    </div>
                  </div>
                  <FileText className="w-8 h-8 text-blue-500 opacity-50" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-4 border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">已开票金额</div>
                    <div className="text-2xl font-semibold text-green-600">
                      ¥{(totalInvoicedAmount / 10000).toFixed(2)}万
                    </div>
                  </div>
                  <FileText className="w-8 h-8 text-green-500 opacity-50" />
                </div>
              </div>
            </div>

            {/* 数据列表 */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12">序号</TableHead>
                    <TableHead>申请单编号</TableHead>
                    <TableHead>项目编号</TableHead>
                    <TableHead>项目名称</TableHead>
                    <TableHead>合同编号</TableHead>
                    <TableHead>申请开票金额</TableHead>
                    <TableHead>对应付款节点</TableHead>
                    <TableHead>申请人</TableHead>
                    <TableHead>申请时间</TableHead>
                    <TableHead>申请状态</TableHead>
                    <TableHead>审批进度</TableHead>
                    <TableHead>发票号码</TableHead>
                    <TableHead className="w-32">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((item, index) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="text-gray-500">{index + 1}</TableCell>
                      <TableCell className="font-medium">{item.applicationCode}</TableCell>
                      <TableCell className="font-medium">{item.projectCode}</TableCell>
                      <TableCell className="max-w-[180px] truncate" title={item.projectName}>
                        {item.projectName}
                      </TableCell>
                      <TableCell className="font-medium">{item.contractCode}</TableCell>
                      <TableCell className="text-right font-medium">
                        ¥{(item.invoiceAmount / 10000).toFixed(2)}万
                      </TableCell>
                      <TableCell className="text-gray-600">{item.paymentNode}</TableCell>
                      <TableCell className="text-sm text-gray-600">{item.applicant}</TableCell>
                      <TableCell className="text-sm text-gray-500">{item.applicationTime}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                          {item.approvalProgress}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        {item.invoiceNumber || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleViewDetail(item)}>
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          {(item.status === "待提交" || item.status === "已驳回") && (
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleEditApplication(item)}>
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                          )}
                          {item.status === "审批中" && (
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                              <AlertCircle className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* 分页控件 */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                共 {filteredApplications.length} 条记录
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>上一页</Button>
                <Button variant="outline" size="sm" className="bg-[#1890ff] text-white border-[#1890ff]">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">下一页</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ledger" className="space-y-4">
            {/* 核心统计卡片 */}
            <div className="grid grid-cols-6 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border border-blue-100">
                <div className="text-sm text-gray-600 mb-1">合同总金额</div>
                <div className="text-2xl font-semibold text-gray-900">
                  ¥{(totalContractAmount / 10000).toFixed(2)}万
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-4 border border-green-100">
                <div className="text-sm text-gray-600 mb-1">累计开票金额</div>
                <div className="text-2xl font-semibold text-green-600">
                  ¥{(totalInvoicedAmount / 10000).toFixed(2)}万
                </div>
              </div>
              <div className="bg-gradient-to-br from-cyan-50 to-white rounded-lg p-4 border border-cyan-100">
                <div className="text-sm text-gray-600 mb-1">开票完成率</div>
                <div className="text-2xl font-semibold text-cyan-600">{invoiceCompletionRate}%</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-4 border border-purple-100">
                <div className="text-sm text-gray-600 mb-1">累计回款金额</div>
                <div className="text-2xl font-semibold text-purple-600">
                  ¥{(totalReceivedAmount / 10000).toFixed(2)}万
                </div>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-white rounded-lg p-4 border border-indigo-100">
                <div className="text-sm text-gray-600 mb-1">回款率</div>
                <div className="text-2xl font-semibold text-indigo-600">{receivedRate}%</div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-white rounded-lg p-4 border border-red-100">
                <div className="text-sm text-gray-600 mb-1">未回款金额</div>
                <div className="text-2xl font-semibold text-red-600">
                  ¥{(unreceived / 10000).toFixed(2)}万
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-1" />
                  导出台账
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-1" />
                刷新
              </Button>
            </div>

            {/* 台账列表 */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12">序号</TableHead>
                    <TableHead>项目名称</TableHead>
                    <TableHead>合同编号</TableHead>
                    <TableHead>申请单编号</TableHead>
                    <TableHead>发票号码</TableHead>
                    <TableHead>开票日期</TableHead>
                    <TableHead>开票金额</TableHead>
                    <TableHead>税率</TableHead>
                    <TableHead>对应付款节点</TableHead>
                    <TableHead>回款状态</TableHead>
                    <TableHead>已回款金额</TableHead>
                    <TableHead>未回款金额</TableHead>
                    <TableHead>回款日期</TableHead>
                    <TableHead className="w-24">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ledger.map((item, index) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="text-gray-500">{index + 1}</TableCell>
                      <TableCell className="max-w-[180px] truncate font-medium" title={item.projectName}>
                        {item.projectName}
                      </TableCell>
                      <TableCell className="font-medium">{item.contractCode}</TableCell>
                      <TableCell className="font-medium">{item.applicationCode}</TableCell>
                      <TableCell className="font-medium text-green-600">{item.invoiceNumber}</TableCell>
                      <TableCell className="text-gray-600">{item.invoiceDate}</TableCell>
                      <TableCell className="text-right font-medium">
                        ¥{(item.invoiceAmount / 10000).toFixed(2)}万
                      </TableCell>
                      <TableCell className="text-gray-600">{item.taxRate}</TableCell>
                      <TableCell className="text-gray-600">{item.paymentNode}</TableCell>
                      <TableCell>{getPaymentStatusBadge(item.paymentStatus)}</TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        ¥{(item.receivedAmount / 10000).toFixed(2)}万
                      </TableCell>
                      <TableCell className="text-right font-medium text-red-600">
                        ¥{((item.invoiceAmount - item.receivedAmount) / 10000).toFixed(2)}万
                      </TableCell>
                      <TableCell className="text-gray-600">{item.receivedDate || "-"}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          详情
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* 分页控件 */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                共 {ledger.length} 条记录
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>上一页</Button>
                <Button variant="outline" size="sm" className="bg-[#1890ff] text-white border-[#1890ff]">1</Button>
                <Button variant="outline" size="sm">下一页</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      ) : null}

      {/* 新增/编辑表单 */}
      {viewMode === "new" || viewMode === "edit" ? (
        <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              {viewMode === "new" ? "新增开票申请" : "编辑开票申请"}
            </h3>
            <Button variant="outline" size="sm" onClick={handleBackToList}>
              返回列表
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">项目编号</label>
              <Input
                value={formData.projectCode}
                onChange={(e) => handleFormChange("projectCode", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">项目名称</label>
              <Input
                value={formData.projectName}
                onChange={(e) => handleFormChange("projectName", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">合同编号</label>
              <Input
                value={formData.contractCode}
                onChange={(e) => handleFormChange("contractCode", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">合同金额（万元）</label>
              <Input
                value={formData.contractAmount}
                onChange={(e) => handleFormChange("contractAmount", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">申请开票金额（万元）</label>
              <Input
                value={formData.invoiceAmount}
                onChange={(e) => handleFormChange("invoiceAmount", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">对应付款节点</label>
              <Input
                value={formData.paymentNode}
                onChange={(e) => handleFormChange("paymentNode", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">发票类型</label>
              <Select value={formData.invoiceType} onValueChange={(value) => handleFormChange("invoiceType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="发票类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="增值税专用发票">增值税专用发票</SelectItem>
                  <SelectItem value="增值税普通发票">增值税普通发票</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">税率</label>
              <Select value={formData.taxRate} onValueChange={(value) => handleFormChange("taxRate", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="税率" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6%">6%</SelectItem>
                  <SelectItem value="9%">9%</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">购买方名称</label>
              <Input
                value={formData.buyerName}
                onChange={(e) => handleFormChange("buyerName", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">购买方税号</label>
              <Input
                value={formData.buyerTaxNo}
                onChange={(e) => handleFormChange("buyerTaxNo", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">购买方地址</label>
              <Input
                value={formData.buyerAddress}
                onChange={(e) => handleFormChange("buyerAddress", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">购买方电话</label>
              <Input
                value={formData.buyerPhone}
                onChange={(e) => handleFormChange("buyerPhone", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">购买方开户银行</label>
              <Input
                value={formData.buyerBank}
                onChange={(e) => handleFormChange("buyerBank", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">购买方银行账号</label>
              <Input
                value={formData.buyerAccount}
                onChange={(e) => handleFormChange("buyerAccount", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">备注</label>
              <Input
                value={formData.remark}
                onChange={(e) => handleFormChange("remark", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="flex items-center justify-end mt-4">
            <Button variant="outline" size="sm" onClick={handleSaveDraft}>
              保存草稿
            </Button>
            <Button className="bg-[#1890ff] hover:bg-[#0d7dea] text-white" size="sm" onClick={handleSubmitForm}>
              提交申请
            </Button>
          </div>
        </div>
      ) : null}

      {/* 审批详情页 */}
      {viewMode === "detail" && selectedApplication ? (
        <div className="space-y-4">
          {/* 返回按钮和状态 */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handleBackToList}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              返回列表
            </Button>
            <div className="flex items-center gap-4">
              {getStatusBadge(selectedApplication.status)}
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                审批进度：{selectedApplication.approvalProgress}
              </Badge>
            </div>
          </div>

          {/* 申请单基本信息 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-medium text-gray-900 mb-4 pb-3 border-b border-gray-200">
              申请单基本信息
            </h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">申请单编号</div>
                <div className="text-sm font-medium text-gray-900">{selectedApplication.applicationCode}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">申请时间</div>
                <div className="text-sm font-medium text-gray-900">{selectedApplication.applicationTime}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">申请人</div>
                <div className="text-sm font-medium text-gray-900">{selectedApplication.applicant}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">项目编号</div>
                <div className="text-sm font-medium text-gray-900">{selectedApplication.projectCode}</div>
              </div>
              <div className="col-span-2">
                <div className="text-sm text-gray-500 mb-1">项目名称</div>
                <div className="text-sm font-medium text-gray-900">{selectedApplication.projectName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">合同编号</div>
                <div className="text-sm font-medium text-gray-900">{selectedApplication.contractCode}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">对应付款节点</div>
                <div className="text-sm font-medium text-gray-900">{selectedApplication.paymentNode}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">申请开票金额</div>
                <div className="text-lg font-semibold text-blue-600">
                  ¥{(selectedApplication.invoiceAmount / 10000).toFixed(2)}万
                </div>
              </div>
            </div>
          </div>

          {/* 开票详细信息 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-medium text-gray-900 mb-4 pb-3 border-b border-gray-200">
              开票详细信息
            </h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">发票类型</div>
                <div className="text-sm font-medium text-gray-900">增值税专用发票</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">税率</div>
                <div className="text-sm font-medium text-gray-900">6%</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">税额</div>
                <div className="text-sm font-medium text-gray-900">
                  ¥{(selectedApplication.invoiceAmount * 0.06 / 10000).toFixed(2)}万
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">价税合计</div>
                <div className="text-lg font-semibold text-green-600">
                  ¥{(selectedApplication.invoiceAmount * 1.06 / 10000).toFixed(2)}万
                </div>
              </div>
              {selectedApplication.invoiceNumber && (
                <>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">发票号码</div>
                    <div className="text-sm font-medium text-green-600">{selectedApplication.invoiceNumber}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">开票日期</div>
                    <div className="text-sm font-medium text-gray-900">2024-03-15</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 购买方信息 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-medium text-gray-900 mb-4 pb-3 border-b border-gray-200">
              购买方信息
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">购买方名称</div>
                <div className="text-sm font-medium text-gray-900">XX市政府</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">纳税人识别号</div>
                <div className="text-sm font-medium text-gray-900">91XXXXXXXXXX</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">地址</div>
                <div className="text-sm font-medium text-gray-900">XX市XX区XX路XX号</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">电话</div>
                <div className="text-sm font-medium text-gray-900">0XX-XXXXXXXX</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">开户银行</div>
                <div className="text-sm font-medium text-gray-900">XX银行XX支行</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">银行账号</div>
                <div className="text-sm font-medium text-gray-900">XXXXXXXXXXXXXXXXXXXX</div>
              </div>
            </div>
          </div>

          {/* 审批流程 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-medium text-gray-900 mb-4 pb-3 border-b border-gray-200">
              审批流程
            </h3>
            <div className="space-y-4">
              {/* 审批节点1 - 申请提交 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="w-0.5 h-16 bg-green-200" />
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-900">申请提交</div>
                    <Badge className="bg-green-50 text-green-600 border-green-200">已完成</Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    申请人：{selectedApplication.applicant}
                  </div>
                  <div className="text-sm text-gray-500">
                    提交时间：{selectedApplication.applicationTime}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    申请开票金额 ¥{(selectedApplication.invoiceAmount / 10000).toFixed(2)}万
                  </div>
                </div>
              </div>

              {/* 审批节点2 - 部门经理审批 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="w-0.5 h-16 bg-green-200" />
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-900">部门经理审批</div>
                    <Badge className="bg-green-50 text-green-600 border-green-200">已通过</Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    审批人：李经理 / 技术部
                  </div>
                  <div className="text-sm text-gray-500">
                    审批时间：2024-03-10 16:20:15
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded p-2 mt-2 text-sm text-gray-700">
                    <span className="font-medium">审批意见：</span>同意开票申请，项目已达到开票条件。
                  </div>
                </div>
              </div>

              {/* 审批节点3 - 财务审核 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="w-0.5 h-16 bg-gray-200" />
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-900">财务审核</div>
                    <Badge className="bg-green-50 text-green-600 border-green-200">已通过</Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    审批人：王会计 / 财务部
                  </div>
                  <div className="text-sm text-gray-500">
                    审批时间：2024-03-11 10:15:30
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded p-2 mt-2 text-sm text-gray-700">
                    <span className="font-medium">审批意见：</span>已核实合同及付款节点信息，财务审核通过。
                  </div>
                </div>
              </div>

              {/* 审批节点4 - 总经理审批 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  {selectedApplication.status === "已开票" || selectedApplication.status === "已审批" ? (
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                  ) : selectedApplication.status === "审批中" ? (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-900">总经理审批</div>
                    {selectedApplication.status === "已开票" || selectedApplication.status === "已审批" ? (
                      <Badge className="bg-green-50 text-green-600 border-green-200">已通过</Badge>
                    ) : selectedApplication.status === "审批中" ? (
                      <Badge className="bg-blue-50 text-blue-600 border-blue-200">审批中</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-600 border-gray-300">待审批</Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    审批人：赵总 / 公司
                  </div>
                  {selectedApplication.status === "已开票" || selectedApplication.status === "已审批" ? (
                    <>
                      <div className="text-sm text-gray-500">
                        审批时间：2024-03-11 14:20:00
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded p-2 mt-2 text-sm text-gray-700">
                        <span className="font-medium">审批意见：</span>批准开票，请财务及时办理。
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-500">待审批</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 附件列表 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-medium text-gray-900 mb-4 pb-3 border-b border-gray-200">
              附件列表
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100">
                <div className="flex items-center gap-3">
                  <Paperclip className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">合同扫描件.pdf</div>
                    <div className="text-xs text-gray-500">2.3 MB · 2024-03-10 14:25</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600">
                  下载
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100">
                <div className="flex items-center gap-3">
                  <Paperclip className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">付款节点证明.pdf</div>
                    <div className="text-xs text-gray-500">1.8 MB · 2024-03-10 14:26</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600">
                  下载
                </Button>
              </div>
            </div>
          </div>

          {/* 操作按钮区 */}
          {selectedApplication.status === "审批中" && (
            <div className="flex items-center justify-end gap-3 bg-white rounded-lg border border-gray-200 p-4">
              <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                <XCircle className="w-4 h-4 mr-1" />
                驳回
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                通过审批
              </Button>
            </div>
          )}

          {(selectedApplication.status === "待提交" || selectedApplication.status === "已驳回") && (
            <div className="flex items-center justify-end gap-3 bg-white rounded-lg border border-gray-200 p-4">
              <Button variant="outline" onClick={() => handleEditApplication(selectedApplication)}>
                <Edit className="w-4 h-4 mr-1" />
                编辑申请
              </Button>
              <Button className="bg-[#1890ff] hover:bg-[#0d7dea] text-white">
                提交审批
              </Button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}