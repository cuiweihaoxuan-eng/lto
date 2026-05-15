import React, { useState } from "react";
import { Search, RefreshCw, ChevronDown, ChevronRight, ChevronUp, Upload, Download, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { SelfDeliveryApplyDialog } from "./SelfDeliveryApplyDialog";

// ============ 类型定义 ============
type SettlementType = "项目型" | "小微标品" | "三联单";
type SettlementStatus = "未发" | "已申请" | "审核中" | "审核通过" | "发放完成";
type InnerStatus = "已申请" | "审核驳回" | "审核通过" | "已发放";
type SettlementMethod = "451定额" | "350元人天";
type RecordType = "自动生成" | "手动生成";

interface InnerRecord {
  id: string;
  name: string;
  code: string;
  applyAmount: string;
  settlementMethod: SettlementMethod;
  members: string[];
  personDays: number;
  applyDate: string;
  applicant: string;
  status: InnerStatus;
  voucher: string;
  recordType: RecordType;
}

interface SettlementRecord {
  id: string;
  index: number;
  businessUnit: string;
  branch: string;
  type: SettlementType;
  oppName: string;
  oppCode: string;
  contractName: string;
  contractCode: string;
  projectName: string;
  projectCode: string;
  customerName: string;
  customerCode: string;
  forwardAmount: string;
  isWarrantyProject: boolean;
  cycle: string;
  startDate: string;
  endDate: string;
  selfDeliveryForwardAmount: string;
  selfDeliveryCostAmount: string;
  forwardContractSelfDeliveryAmount: string;
  canApplyAmount: string;
  appliedAmount: string;
  approvedAmount: string;
  actualPaidAmount: string;
  status: SettlementStatus;
  innerList: InnerRecord[];
}

// ============ 模拟数据 ============
const mockSettlementData: SettlementRecord[] = [
  {
    id: "1",
    index: 1,
    businessUnit: "杭州分公司",
    branch: "西湖支局",
    type: "项目型",
    oppName: "杭州某医院信息化建设项目",
    oppCode: "OPP202604001",
    contractName: "医院ICT服务合同",
    contractCode: "HT202604001",
    projectName: "医院信息化建设项目",
    projectCode: "XM202604001",
    customerName: "杭州某医院",
    customerCode: "KH202604001",
    forwardAmount: "500,000.00",
    isWarrantyProject: false,
    cycle: "12个月",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    selfDeliveryForwardAmount: "50,000.00",
    selfDeliveryCostAmount: "35,000.00",
    forwardContractSelfDeliveryAmount: "15,000.00",
    canApplyAmount: "15,000.00",
    appliedAmount: "8,000.00",
    approvedAmount: "5,000.00",
    actualPaidAmount: "0.00",
    status: "审核中",
    innerList: [
      {
        id: "i1",
        name: "2026年4月自交付结算",
        code: "JSD202604001",
        applyAmount: "8,000.00",
        settlementMethod: "451定额",
        members: ["张三", "李四", "王五"],
        personDays: 15,
        applyDate: "2026-04-15",
        applicant: "张明",
        status: "审核中",
        voucher: "",
        recordType: "手动生成"
      },
      {
        id: "i2",
        name: "2026年3月自交付结算",
        code: "JSD202603001",
        applyAmount: "5,000.00",
        settlementMethod: "350元人天",
        members: ["张三", "李四"],
        personDays: 14,
        applyDate: "2026-03-15",
        applicant: "张明",
        status: "审核通过",
        voucher: "凭证001.pdf",
        recordType: "自动生成"
      }
    ]
  },
  {
    id: "2",
    index: 2,
    businessUnit: "宁波分公司",
    branch: "鄞州支局",
    type: "小微标品",
    oppName: "宁波某企业云服务采购项目",
    oppCode: "OPP202604002",
    contractName: "云服务采购合同",
    contractCode: "HT202604002",
    projectName: "企业云服务项目",
    projectCode: "XM202604002",
    customerName: "宁波某企业",
    customerCode: "KH202604002",
    forwardAmount: "200,000.00",
    isWarrantyProject: true,
    cycle: "6个月",
    startDate: "2026-02-01",
    endDate: "2026-07-31",
    selfDeliveryForwardAmount: "20,000.00",
    selfDeliveryCostAmount: "14,000.00",
    forwardContractSelfDeliveryAmount: "6,000.00",
    canApplyAmount: "6,000.00",
    appliedAmount: "6,000.00",
    approvedAmount: "6,000.00",
    actualPaidAmount: "6,000.00",
    status: "发放完成",
    innerList: [
      {
        id: "i3",
        name: "2026年4月自交付结算",
        code: "JSD202604002",
        applyAmount: "6,000.00",
        settlementMethod: "451定额",
        members: ["赵六", "钱七"],
        personDays: 20,
        applyDate: "2026-04-10",
        applicant: "李华",
        status: "已发放",
        voucher: "凭证002.pdf",
        recordType: "自动生成"
      }
    ]
  },
  {
    id: "3",
    index: 3,
    businessUnit: "温州分公司",
    branch: "鹿城支局",
    type: "三联单",
    oppName: "温州某学校智慧校园项目",
    oppCode: "OPP202604003",
    contractName: "智慧校园建设合同",
    contractCode: "HT202604003",
    projectName: "智慧校园一期",
    projectCode: "XM202604003",
    customerName: "温州某学校",
    customerCode: "KH202604003",
    forwardAmount: "800,000.00",
    isWarrantyProject: false,
    cycle: "18个月",
    startDate: "2025-10-01",
    endDate: "2027-03-31",
    selfDeliveryForwardAmount: "80,000.00",
    selfDeliveryCostAmount: "56,000.00",
    forwardContractSelfDeliveryAmount: "24,000.00",
    canApplyAmount: "24,000.00",
    appliedAmount: "0.00",
    approvedAmount: "0.00",
    actualPaidAmount: "0.00",
    status: "未发",
    innerList: []
  },
  {
    id: "4",
    index: 4,
    businessUnit: "嘉兴分公司",
    branch: "南湖支局",
    type: "项目型",
    oppName: "嘉兴某工厂数字化转型项目",
    oppCode: "OPP202604004",
    contractName: "数字化转型服务合同",
    contractCode: "HT202604004",
    projectName: "工厂数字化转型",
    projectCode: "XM202604004",
    customerName: "嘉兴某工厂",
    customerCode: "KH202604004",
    forwardAmount: "300,000.00",
    isWarrantyProject: false,
    cycle: "10个月",
    startDate: "2026-03-01",
    endDate: "2026-12-31",
    selfDeliveryForwardAmount: "30,000.00",
    selfDeliveryCostAmount: "21,000.00",
    forwardContractSelfDeliveryAmount: "9,000.00",
    canApplyAmount: "9,000.00",
    appliedAmount: "0.00",
    approvedAmount: "0.00",
    actualPaidAmount: "0.00",
    status: "未发",
    innerList: []
  },
  {
    id: "5",
    index: 5,
    businessUnit: "台州分公司",
    branch: "椒江支局",
    type: "小微标品",
    oppName: "台州某超市网络升级项目",
    oppCode: "OPP202604005",
    contractName: "网络升级合同",
    contractCode: "HT202604005",
    projectName: "超市网络升级",
    projectCode: "XM202604005",
    customerName: "台州某超市",
    customerCode: "KH202604005",
    forwardAmount: "150,000.00",
    isWarrantyProject: true,
    cycle: "3个月",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    selfDeliveryForwardAmount: "15,000.00",
    selfDeliveryCostAmount: "10,500.00",
    forwardContractSelfDeliveryAmount: "4,500.00",
    canApplyAmount: "4,500.00",
    appliedAmount: "4,500.00",
    approvedAmount: "0.00",
    actualPaidAmount: "0.00",
    status: "已申请",
    innerList: [
      {
        id: "i4",
        name: "2026年5月自交付结算",
        code: "JSD202605001",
        applyAmount: "4,500.00",
        settlementMethod: "350元人天",
        members: ["孙八"],
        personDays: 13,
        applyDate: "2026-05-10",
        applicant: "王九",
        status: "已申请",
        voucher: "",
        recordType: "手动生成"
      }
    ]
  },
  {
    id: "6",
    index: 6,
    businessUnit: "金华分公司",
    branch: "婺城支局",
    type: "三联单",
    oppName: "金华某小区智能化改造项目",
    oppCode: "OPP202604006",
    contractName: "智能化改造合同",
    contractCode: "HT202604006",
    projectName: "小区智能化改造",
    projectCode: "XM202604006",
    customerName: "金华某小区",
    customerCode: "KH202604006",
    forwardAmount: "400,000.00",
    isWarrantyProject: false,
    cycle: "8个月",
    startDate: "2026-01-15",
    endDate: "2026-09-15",
    selfDeliveryForwardAmount: "40,000.00",
    selfDeliveryCostAmount: "28,000.00",
    forwardContractSelfDeliveryAmount: "12,000.00",
    canApplyAmount: "12,000.00",
    appliedAmount: "0.00",
    approvedAmount: "0.00",
    actualPaidAmount: "0.00",
    status: "审核通过",
    innerList: [
      {
        id: "i5",
        name: "2026年4月自交付结算",
        code: "JSD202604003",
        applyAmount: "12,000.00",
        settlementMethod: "451定额",
        members: ["周十", "吴一", "郑二"],
        personDays: 30,
        applyDate: "2026-04-20",
        applicant: "刘十一",
        status: "审核通过",
        voucher: "凭证003.pdf",
        recordType: "自动生成"
      }
    ]
  }
];

// ============ 统计卡片组件（一行12个） ============
interface StatItemProps {
  label: string;
  count: string;
  amount: string;
  color: string;
}

function StatItem({ label, count, amount, color }: StatItemProps) {
  return (
    <div className="flex flex-col p-2 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
      <span className={`text-xs font-medium ${color}`}>{label}</span>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-lg font-bold text-gray-900">{count}</span>
        <span className="text-xs text-gray-400">个</span>
      </div>
      <div className="text-xs text-gray-500">{amount}元</div>
    </div>
  );
}

// ============ 主组件 ============
export function SelfDeliverySettlement() {
  // 查询条件状态
  const [searchType, setSearchType] = useState<string>("全部");
  const [searchOppName, setSearchOppName] = useState("");
  const [searchOppCode, setSearchOppCode] = useState("");
  const [searchContractName, setSearchContractName] = useState("");
  const [searchContractCode, setSearchContractCode] = useState("");
  const [searchProjectName, setSearchProjectName] = useState("");
  const [searchProjectCode, setSearchProjectCode] = useState("");
  const [searchOrderNo, setSearchOrderNo] = useState("");
  const [searchTripleNo, setSearchTripleNo] = useState("");
  const [searchStatus, setSearchStatus] = useState<string>("全部");

  // 展开状态
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // 弹窗状态
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<SettlementRecord | null>(null);

  // 切换行展开
  const toggleRowExpand = (id: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // 获取状态徽章样式
  const getStatusBadge = (status: SettlementStatus) => {
    const styles: Record<SettlementStatus, string> = {
      "未发": "bg-gray-100 text-gray-700",
      "已申请": "bg-yellow-100 text-yellow-700",
      "审核中": "bg-blue-100 text-blue-700",
      "审核通过": "bg-green-100 text-green-700",
      "发放完成": "bg-emerald-100 text-emerald-700"
    };
    return styles[status];
  };

  const getInnerStatusBadge = (status: InnerStatus) => {
    const styles: Record<InnerStatus, string> = {
      "已申请": "bg-yellow-100 text-yellow-700",
      "审核驳回": "bg-red-100 text-red-700",
      "审核通过": "bg-green-100 text-green-700",
      "已发放": "bg-emerald-100 text-emerald-700"
    };
    return styles[status];
  };

  // 筛选数据
  const filteredData = mockSettlementData.filter(item => {
    if (searchType !== "全部" && item.type !== searchType) return false;
    if (searchOppName && !item.oppName.includes(searchOppName)) return false;
    if (searchOppCode && !item.oppCode.includes(searchOppCode)) return false;
    if (searchContractName && !item.contractName.includes(searchContractName)) return false;
    if (searchContractCode && !item.contractCode.includes(searchContractCode)) return false;
    if (searchProjectName && !item.projectName.includes(searchProjectName)) return false;
    if (searchProjectCode && !item.projectCode.includes(searchProjectCode)) return false;
    if (searchOrderNo && !item.projectCode.includes(searchOrderNo)) return false;
    if (searchTripleNo && !item.projectCode.includes(searchTripleNo)) return false;
    if (searchStatus !== "全部" && item.status !== searchStatus) return false;
    return true;
  });

  // 计算统计数据
  const calculateStats = (type: SettlementType | null) => {
    const data = type ? filteredData.filter(d => d.type === type) : filteredData;

    const payable = data.filter(d => d.status === "审核通过" || d.status === "发放完成");
    const unpaid = data.filter(d => d.status === "未发" || d.status === "已申请" || d.status === "审核中");
    const approved = data.filter(d => d.status === "审核通过");
    const actualPaid = data.filter(d => d.status === "发放完成");

    const sumAmount = (records: SettlementRecord[]) =>
      records.reduce((sum, r) => sum + parseFloat(r.canApplyAmount.replace(/,/g, '')), 0);

    const sumActualPaid = (records: SettlementRecord[]) =>
      records.reduce((sum, r) => sum + parseFloat(r.actualPaidAmount.replace(/,/g, '')), 0);

    return {
      payable: { count: payable.length, amount: sumAmount(payable).toLocaleString('zh-CN', { minimumFractionDigits: 2 }) },
      unpaid: { count: unpaid.length, amount: sumAmount(unpaid).toLocaleString('zh-CN', { minimumFractionDigits: 2 }) },
      approved: { count: approved.length, amount: sumAmount(approved).toLocaleString('zh-CN', { minimumFractionDigits: 2 }) },
      actualPaid: { count: actualPaid.length, amount: sumActualPaid(actualPaid).toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }
    };
  };

  const projectStats = calculateStats("项目型");
  const standardStats = calculateStats("小微标品");
  const tripleStats = calculateStats("三联单");

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 页面标题 */}
      <div className="px-6 pt-6 pb-0 flex-shrink-0">
        <h2 className="text-lg font-medium text-gray-900">自交付结算管理</h2>
        <p className="text-sm text-gray-500 mt-1">自交付结算情况统计与管理</p>
      </div>

      {/* 统计卡片区域 - 12个统计卡片分3组 */}
      <div className="px-6 mt-4 flex-shrink-0">
        <div className="grid grid-cols-3 gap-3">
          {/* 项目型自交付 */}
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-sm font-medium text-blue-700 mb-2">项目型自交付</div>
            <div className="grid grid-cols-4 gap-2">
              <StatItem label="可发放" count={projectStats.payable.count.toString()} amount={projectStats.payable.amount} color="text-blue-600" />
              <StatItem label="未发放" count={projectStats.unpaid.count.toString()} amount={projectStats.unpaid.amount} color="text-blue-600" />
              <StatItem label="审核通过可发放" count={projectStats.approved.count.toString()} amount={projectStats.approved.amount} color="text-blue-600" />
              <StatItem label="实际发放" count={projectStats.actualPaid.count.toString()} amount={projectStats.actualPaid.amount} color="text-blue-600" />
            </div>
          </div>
          {/* 小微标品 */}
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-sm font-medium text-green-700 mb-2">小微标品</div>
            <div className="grid grid-cols-4 gap-2">
              <StatItem label="可发放" count={standardStats.payable.count.toString()} amount={standardStats.payable.amount} color="text-green-600" />
              <StatItem label="未发放" count={standardStats.unpaid.count.toString()} amount={standardStats.unpaid.amount} color="text-green-600" />
              <StatItem label="审核通过可发放" count={standardStats.approved.count.toString()} amount={standardStats.approved.amount} color="text-green-600" />
              <StatItem label="实际发放" count={standardStats.actualPaid.count.toString()} amount={standardStats.actualPaid.amount} color="text-green-600" />
            </div>
          </div>
          {/* 三联单 */}
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-sm font-medium text-purple-700 mb-2">三联单</div>
            <div className="grid grid-cols-4 gap-2">
              <StatItem label="可发放" count={tripleStats.payable.count.toString()} amount={tripleStats.payable.amount} color="text-purple-600" />
              <StatItem label="未发放" count={tripleStats.unpaid.count.toString()} amount={tripleStats.unpaid.amount} color="text-purple-600" />
              <StatItem label="审核通过可发放" count={tripleStats.approved.count.toString()} amount={tripleStats.approved.amount} color="text-purple-600" />
              <StatItem label="实际发放" count={tripleStats.actualPaid.count.toString()} amount={tripleStats.actualPaid.amount} color="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 查询条件区域 */}
      <div className="px-6 mt-4 flex-shrink-0">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-4 gap-x-6 gap-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">类型</label>
              <Select value={searchType} onValueChange={setSearchType}>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">结算状态</label>
              <Select value={searchStatus} onValueChange={setSearchStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="全部">全部</SelectItem>
                  <SelectItem value="未发">未发</SelectItem>
                  <SelectItem value="已申请">已申请</SelectItem>
                  <SelectItem value="审核中">审核中</SelectItem>
                  <SelectItem value="审核通过">审核通过</SelectItem>
                  <SelectItem value="发放完成">发放完成</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 查询条件 - 始终展开显示所有字段 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">订单号</label>
              <Input placeholder="请输入" value={searchOrderNo} onChange={e => setSearchOrderNo(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">三联单号</label>
              <Input placeholder="请输入" value={searchTripleNo} onChange={e => setSearchTripleNo(e.target.value)} />
            </div>

            <div className="flex items-end gap-2">
              <Button className="btn btn-primary gap-1">
                <Search className="w-4 h-4" />
                查询
              </Button>
              <Button className="btn btn-outline gap-1">
                <RefreshCw className="w-4 h-4" />
                重置
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
        <div className="flex gap-2">
          <Button className="btn btn-outline gap-1">
            <Upload className="w-4 h-4" />
            导入三联单
          </Button>
          <Button className="btn btn-outline gap-1">
            <Upload className="w-4 h-4" />
            导入小微标品订单
          </Button>
          <Button className="btn btn-outline gap-1">
            <Upload className="w-4 h-4" />
            导入已发放凭证
          </Button>
          <Button className="btn btn-outline gap-1">
            <Download className="w-4 h-4" />
            导出
          </Button>
          <Button className="btn btn-primary gap-1" onClick={() => { setSelectedRowData(null); setApplyDialogOpen(true); }}>
            <Plus className="w-4 h-4" />
            申请自交付结算
          </Button>
        </div>
      </div>

      {/* 表格 */}
      <div className="flex-1 overflow-hidden px-6 pb-6">
        <div className="h-full bg-white rounded-lg border border-gray-200 overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-10">展开</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-12">序号</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-24">经营单元</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">支局</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">类型</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600">商机名称</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-28">商机编码</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600">合同名称</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-28">合同编码</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600">项目名称</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-28">项目编码</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-28">客户名称</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-24">客户编码</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-600 w-28">前向金额</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-600 w-20">是否维保</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-600 w-20">周期</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-600 w-24">开始时间</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-600 w-24">结束时间</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-600 w-28">前向金额</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-600 w-28">成本金额</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-600 w-28">自交付金额</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-600 w-24">可申请</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-600 w-24">已申请</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-600 w-28">可发放</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-600 w-24">实际发放</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">状态</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-32 bg-gray-50 sticky right-0 z-20">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map(row => (
                <React.Fragment key={row.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-3">
                      {row.innerList.length > 0 ? (
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
                    <td className="px-3 py-3">{row.businessUnit}</td>
                    <td className="px-3 py-3">{row.branch}</td>
                    <td className="px-3 py-3">
                      <Badge className={
                        row.type === "项目型" ? "bg-blue-100 text-blue-700" :
                        row.type === "小微标品" ? "bg-green-100 text-green-700" :
                        "bg-purple-100 text-purple-700"
                      }>
                        {row.type}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 max-w-36 truncate" title={row.oppName}>{row.oppName}</td>
                    <td className="px-3 py-3">{row.oppCode}</td>
                    <td className="px-3 py-3 max-w-32 truncate" title={row.contractName}>{row.contractName}</td>
                    <td className="px-3 py-3">{row.contractCode}</td>
                    <td className="px-3 py-3 max-w-32 truncate" title={row.projectName}>{row.projectName}</td>
                    <td className="px-3 py-3">{row.projectCode}</td>
                    <td className="px-3 py-3 max-w-24 truncate" title={row.customerName}>{row.customerName}</td>
                    <td className="px-3 py-3">{row.customerCode}</td>
                    <td className="px-3 py-3 text-right">{row.forwardAmount}</td>
                    <td className="px-3 py-3 text-center">
                      {row.isWarrantyProject ? "是" : "否"}
                    </td>
                    <td className="px-3 py-3 text-center">{row.cycle}</td>
                    <td className="px-3 py-3 text-center">{row.startDate}</td>
                    <td className="px-3 py-3 text-center">{row.endDate}</td>
                    <td className="px-3 py-3 text-right">{row.selfDeliveryForwardAmount}</td>
                    <td className="px-3 py-3 text-right">{row.selfDeliveryCostAmount}</td>
                    <td className="px-3 py-3 text-right">{row.forwardContractSelfDeliveryAmount}</td>
                    <td className="px-3 py-3 text-right font-medium">{row.canApplyAmount}</td>
                    <td className="px-3 py-3 text-right text-blue-600">{row.appliedAmount}</td>
                    <td className="px-3 py-3 text-right text-green-600">{row.approvedAmount}</td>
                    <td className="px-3 py-3 text-right font-medium text-emerald-600">{row.actualPaidAmount}</td>
                    <td className="px-3 py-3">
                      <Badge className={getStatusBadge(row.status)}>{row.status}</Badge>
                    </td>
                    <td className="px-3 py-3 bg-gray-50 sticky right-0 z-10">
                      <Button
                        variant="link"
                        size="sm"
                        className="text-blue-600 h-auto p-0 flex items-center gap-1 whitespace-nowrap"
                        onClick={() => { setSelectedRowData(row); setApplyDialogOpen(true); }}
                      >
                        <Plus className="w-3 h-3" />
                        申请自交付结算
                      </Button>
                    </td>
                  </tr>

                  {/* 内层结算单列表 */}
                  {expandedRows.has(row.id) && (
                    <tr className="bg-gray-50">
                      <td colSpan={26} className="p-0 align-top">
                        <div className="py-3 px-4">
                          <div className="bg-white border border-gray-200 rounded-lg">
                            <div className="px-4 py-2 border-b border-gray-200 bg-gray-100">
                              <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <span className="w-1 h-4 bg-blue-500 rounded flex-shrink-0"></span>
                                结算单列表
                              </div>
                            </div>
                            {row.innerList.length > 0 ? (
                              <div className="overflow-x-auto" style={{ maxHeight: "300px" }}>
                                <table className="w-full text-sm">
                                  <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                                    <tr>
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-12">序号</th>
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-40">结算单名称</th>
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-28">结算单号</th>
                                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-600 w-24">申请金额</th>
                                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-600 w-24">结算类型</th>
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-48">人数（姓名）</th>
                                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-600 w-16">人天</th>
                                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-600 w-24">申请日期</th>
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-20">申请人</th>
                                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-600 w-20">状态</th>
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-28">发放凭证</th>
                                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-600 w-20">类型</th>
                                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-32">操作</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                    {row.innerList.map(item => (
                                      <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-3 py-2">{item.id.replace("i", "")}</td>
                                        <td className="px-3 py-2 max-w-40 truncate" title={item.name}>{item.name}</td>
                                        <td className="px-3 py-2">{item.code}</td>
                                        <td className="px-3 py-2 text-right font-medium text-green-600">{item.applyAmount}</td>
                                        <td className="px-3 py-2 text-center">
                                          <Badge className="bg-gray-100 text-gray-700">{item.settlementMethod}</Badge>
                                        </td>
                                        <td className="px-3 py-2">
                                          <div className="flex flex-wrap gap-1">
                                            {item.members.map((m, idx) => (
                                              <span key={idx} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">{m}</span>
                                            ))}
                                          </div>
                                        </td>
                                        <td className="px-3 py-2 text-center">{item.personDays}</td>
                                        <td className="px-3 py-2 text-center">{item.applyDate}</td>
                                        <td className="px-3 py-2">{item.applicant}</td>
                                        <td className="px-3 py-2 text-center">
                                          <Badge className={getInnerStatusBadge(item.status)}>{item.status}</Badge>
                                        </td>
                                        <td className="px-3 py-2 max-w-28 truncate" title={item.voucher}>
                                          {item.voucher || "-"}
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                          <Badge className="bg-gray-100 text-gray-600">{item.recordType}</Badge>
                                        </td>
                                        <td className="px-3 py-2">
                                          <div className="flex gap-2">
                                            <Button variant="link" size="sm" className="text-blue-600 h-auto p-0" onClick={() => { setSelectedRowData(row); setApplyDialogOpen(true); }}>
                                              <Eye className="w-3 h-3 mr-1" />
                                              查看
                                            </Button>
                                            {item.status === "已申请" && (
                                              <Button variant="link" size="sm" className="text-green-600 h-auto p-0" onClick={() => { setSelectedRowData({ ...row, isEditMode: true }); setApplyDialogOpen(true); }}>
                                                <Edit className="w-3 h-3 mr-1" />
                                                修改
                                              </Button>
                                            )}
                                            {item.status === "已申请" && (
                                              <Button variant="link" size="sm" className="text-red-600 h-auto p-0" onClick={() => { if(confirm('确定删除该结算单？')) { alert('删除功能开发中'); } }}>
                                                <Trash2 className="w-3 h-3 mr-1" />
                                                删除
                                              </Button>
                                            )}
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="px-4 py-6 text-center text-sm text-gray-400">暂无结算单数据</div>
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
                  <td colSpan={26} className="px-3 py-8 text-center text-gray-500">
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 申请自交付结算弹窗 */}
      <SelfDeliveryApplyDialog
        open={applyDialogOpen}
        onClose={() => { setApplyDialogOpen(false); setSelectedRowData(null); }}
        rowData={selectedRowData}
      />
    </div>
  );
}