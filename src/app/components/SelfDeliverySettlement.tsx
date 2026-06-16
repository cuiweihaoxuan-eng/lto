import React, { useState } from "react";
import { Search, RefreshCw, ChevronDown, ChevronRight, ChevronUp, Upload, Download, Plus, Eye, Edit, Trash2, CheckCircle, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { TabNav } from "./ui/tab-nav";
import { SelfDeliveryApplyDialog } from "./SelfDeliveryApplyDialog";
import { exportToXlsx, SheetData } from "../utils/excelExport";

// ============ 类型定义 ============
type SettlementType = "项目型" | "小微标品" | "三联单";
type SettlementStatus = "未发" | "已申请" | "审核中" | "审核通过" | "发放完成";
type InnerStatus = "已申请" | "审核中" | "审核驳回" | "审核通过" | "已发放";
type SettlementMethod = "451定额" | "350元人天";
type RecordType = "自动生成" | "手动生成";

interface SettlementMethodItem {
  method: SettlementMethod; // 451定额 / 350人天
  applyAmount: string;       // 该类型申请金额
  personList: { name: string; amount?: string; personDays?: number }[];
}

interface InnerRecord {
  id: string;
  name: string;
  code: string;
  settlementMethods: SettlementMethodItem[]; // 支持多个结算类型
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
  appliedProfitPercent: string;
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
    appliedAmount: "2,000.00",
    approvedAmount: "800.00",
    actualPaidAmount: "0.00",
    status: "审核中",
    appliedProfitPercent: "5%",
    innerList: [
      {
        id: "i1",
        name: "2026年4月自交付结算",
        code: "JSD202604001",
        settlementMethods: [
          { method: "451定额", applyAmount: "8,000.00", personList: [
            { name: "张三", amount: "2,500" },
            { name: "李四", amount: "2,800" },
            { name: "王五", amount: "2,700" }
          ]}
        ],
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
        settlementMethods: [
          { method: "451定额", applyAmount: "2,500.00", personList: [
            { name: "张三", amount: "1,200" },
            { name: "李四", amount: "1,300" }
          ]},
          { method: "350人天", applyAmount: "2,500.00", personList: [
            { name: "王五", personDays: 7 }
          ]}
        ],
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
    appliedProfitPercent: "10%",
    innerList: [
      {
        id: "i3",
        name: "2026年4月自交付结算",
        code: "JSD202604002",
        settlementMethods: [
          { method: "451定额", applyAmount: "6,000.00", personList: [
            { name: "赵六", amount: "3,000" },
            { name: "钱七", amount: "3,000" }
          ]}
        ],
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
    appliedProfitPercent: "0%",
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
    appliedProfitPercent: "0%",
    innerList: []
  },
  {
    id: "4",
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
    appliedProfitPercent: "8%",
    innerList: [
      {
        id: "i4",
        name: "2026年5月自交付结算",
        code: "JSD202605001",
        settlementMethods: [
          { method: "350人天", applyAmount: "4,500.00", personList: [
            { name: "孙八", personDays: 13 }
          ]}
        ],
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
        settlementMethods: [
          { method: "451定额", applyAmount: "12,000.00", personList: [
            { name: "周十", amount: "4,000" },
            { name: "吴一", amount: "4,000" },
            { name: "郑二", amount: "4,000" }
          ]}
        ],
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
  const [searchArea, setSearchArea] = useState("");
  const [searchBusinessUnit, setSearchBusinessUnit] = useState("");
  const [searchStatus, setSearchStatus] = useState<string>("全部");
  const [searchApplyTimeStart, setSearchApplyTimeStart] = useState("");
  const [searchApplyTimeEnd, setSearchApplyTimeEnd] = useState("");
  const [searchCustomerName, setSearchCustomerName] = useState("");

  // 项目型查询条件
  const [searchOppName, setSearchOppName] = useState("");
  const [searchOppCode, setSearchOppCode] = useState("");
  const [searchContractName, setSearchContractName] = useState("");
  const [searchContractCode, setSearchContractCode] = useState("");
  const [searchProjectName, setSearchProjectName] = useState("");
  const [searchProjectCode, setSearchProjectCode] = useState("");

  // 小微标品查询条件
  const [searchWorkOrderNo, setSearchWorkOrderNo] = useState("");
  const [searchMainOrderCode, setSearchMainOrderCode] = useState("");
  const [searchOrderCode, setSearchOrderCode] = useState("");
  const [searchSmallProductType, setSearchSmallProductType] = useState<string>("全部");

  // 三联单查询条件
  const [searchTripleOrderCode, setSearchTripleOrderCode] = useState("");
  const [searchServiceNumber, setSearchServiceNumber] = useState("");
  const [searchAssetCode, setSearchAssetCode] = useState("");
  const [searchDiscountCode, setSearchDiscountCode] = useState("");
  const [searchDiscountName, setSearchDiscountName] = useState("");
  const [searchAcceptTimeStart, setSearchAcceptTimeStart] = useState("");
  const [searchAcceptTimeEnd, setSearchAcceptTimeEnd] = useState("");

  // 小微标品/三联单创建时间范围
  const [searchCreateTimeStart, setSearchCreateTimeStart] = useState("");
  const [searchCreateTimeEnd, setSearchCreateTimeEnd] = useState("");

  // 各类型的展开/收起状态
  const [expandedProject, setExpandedProject] = useState(false);
  const [expandedSmallProduct, setExpandedSmallProduct] = useState(false);
  const [expandedTriple, setExpandedTriple] = useState(false);

  // 展开状态
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // 弹窗状态
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<SettlementRecord | null>(null);
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);
  const [auditRecord, setAuditRecord] = useState<InnerRecord | null>(null);
  const [auditResult, setAuditResult] = useState<"通过" | "驳回" | null>(null);
  const [auditOpinion, setAuditOpinion] = useState("");
  const [typeTab, setTypeTab] = useState<SettlementType>("项目型");
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importType, setImportType] = useState<"三联单" | "小微标品" | "凭证">("三联单");

  // 切换行展开
  const toggleRowExpand = (id: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // 导出Excel - 3个Sheet
  const handleExport = () => {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");

    // Sheet1: 外层列表（按当前Tab类型生成对应表头）
    const outerHeaders: Record<string, string[]> = {
      "项目型": ["序号", "经营单元", "支局", "类型", "商机名称", "商机编码", "合同名称", "合同编码", "项目名称", "项目编码", "客户名称", "客户编码", "前向金额", "是否维保", "周期", "开始时间", "结束时间", "前向合同自交付金额", "可申请", "已申请", "可发放", "实际发放", "状态"],
      "小微标品": ["序号", "区域", "经营单元", "类型", "工单编号", "主订单编码", "订单编码", "业务类型", "客户名称", "工单状态", "收单人", "环节名称", "可申请", "已申请", "可发放", "实际发放", "状态"],
      "三联单": ["序号", "经营单元", "类型", "VIP客户名称", "VIP卡号", "统计合同额", "竣工时间", "受理归属分局", "受理归属支局", "受理人名称", "受理人工号", "受理金额", "受理时间", "订单编码", "订单状态", "资产唯一编码", "受理的业务号码", "优惠编码", "优惠名称", "翼装大师", "营销归属分局", "营销归属支局", "营销人姓名", "营销人工号", "可申请", "已申请", "可发放", "实际发放", "状态"]
    };

    const buildOuterRow = (row: typeof mockSettlementData[number]): (string | number)[] => {
      if (typeTab === "项目型") {
        return [row.index, row.businessUnit, row.branch, row.type, row.oppName, row.oppCode, row.contractName, row.contractCode, row.projectName, row.projectCode, row.customerName, row.customerCode, row.forwardAmount, row.isWarrantyProject ? "是" : "否", row.cycle, row.startDate, row.endDate, row.forwardContractSelfDeliveryAmount, row.canApplyAmount, row.appliedAmount, row.approvedAmount, row.actualPaidAmount, row.status];
      } else if (typeTab === "小微标品") {
        return [row.index, row.branch, row.businessUnit, row.type, row.projectCode, "-", "-", "-", row.customerName, "-", "-", "-", row.canApplyAmount, row.appliedAmount, row.approvedAmount, row.actualPaidAmount, row.status];
      } else {
        return [row.index, row.businessUnit, row.type, row.customerName, row.customerCode, row.forwardAmount, row.endDate, row.businessUnit, row.branch, "-", "-", row.selfDeliveryForwardAmount, row.startDate, row.projectCode, "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", row.canApplyAmount, row.appliedAmount, row.approvedAmount, row.actualPaidAmount, row.status];
      }
    };

    const outerRows = filteredData.map(buildOuterRow);
    const sheets: SheetData[] = [];

    // 按业务类型分别输出
    ["项目型", "小微标品", "三联单"].forEach(bizType => {
      const bizData = mockSettlementData.filter(r => r.type === bizType);
      if (bizData.length > 0) {
        sheets.push({
          name: `外层列表-${bizType}`,
          headers: outerHeaders[bizType],
          rows: bizData.map(buildOuterRow)
        });
      }
    });

    // Sheet2: 内层列表（按业务类型分组，每组独立表头）
    const innerHeaders = ["业务类型", "合同/小微工单/三联单编码", "序号", "结算单名称", "结算单号", "结算类型", "申请金额", "人员列表", "申请日期", "申请人", "状态", "发放凭证"];
    const innerRows: (string | number)[][] = [];
    mockSettlementData.forEach(row => {
      // 根据业务类型取对应编码
      let businessCode = "";
      if (row.type === "项目型") businessCode = row.contractCode;       // 合同编码
      else if (row.type === "小微标品") businessCode = row.projectCode; // 工单编号
      else if (row.type === "三联单") businessCode = row.projectCode;   // 三联单编码

      row.innerList.forEach(item => {
        item.settlementMethods.forEach(sm => {
          innerRows.push([
            row.type,
            businessCode,
            item.id.replace("i", ""),
            item.name,
            item.code,
            sm.method,
            sm.applyAmount,
            sm.personList.map(p => `${p.name}${p.amount ? " ¥" + p.amount : ""}${p.personDays ? " " + p.personDays + "人天" : ""}`).join("、"),
            item.applyDate,
            item.applicant,
            item.status,
            item.voucher || "-"
          ]);
        });
      });
    });
    if (innerRows.length > 0) {
      sheets.push({
        name: "内层结算单",
        headers: innerHeaders,
        rows: innerRows
      });
    }

    // Sheet3: 人员自交付结算清单（基于内层人员明细展开）
    const personHeaders = ["序号", "经营单元", "支局", "业务类型", "合同/小微工单/三联单编码", "结算单名称", "结算单号", "人员姓名", "金额", "人天", "结算状态", "申请人", "申请时间"];
    const personRows: (string | number)[][] = [];
    let pIdx = 0;
    mockSettlementData.forEach(row => {
      let businessCode = "";
      if (row.type === "项目型") businessCode = row.contractCode;
      else if (row.type === "小微标品") businessCode = row.projectCode;
      else if (row.type === "三联单") businessCode = row.projectCode;

      row.innerList.forEach(item => {
        item.settlementMethods.forEach(sm => {
          sm.personList.forEach(p => {
            pIdx++;
            personRows.push([
              pIdx,
              row.businessUnit,
              row.branch,
              row.type,
              businessCode,
              item.name,
              item.code,
              p.name,
              p.amount || (p.personDays ? (p.personDays * 350).toFixed(2) : "0.00"),
              p.personDays || "-",
              item.status,
              item.applicant,
              item.applyDate
            ]);
          });
        });
      });
    });
    if (personRows.length > 0) {
      sheets.push({
        name: "人员结算清单",
        headers: personHeaders,
        rows: personRows
      });
    }

    exportToXlsx(sheets, `自交付结算数据_${today}.xlsx`);
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
      "审核中": "bg-blue-100 text-blue-700",
      "审核驳回": "bg-red-100 text-red-700",
      "审核通过": "bg-green-100 text-green-700",
      "已发放": "bg-emerald-100 text-emerald-700"
    };
    return styles[status];
  };

  // 渲染内层结算单列表（统一支持多结算类型）
  const renderInnerList = (row: SettlementRecord, themeColor: string) => (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="px-4 py-2 border-b border-gray-200 bg-gray-100">
        <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <span className={`w-1 h-4 ${themeColor} rounded flex-shrink-0`}></span>
          结算单列表
        </div>
      </div>
      {row.innerList.length > 0 ? (
        <div className="overflow-x-auto" style={{ maxHeight: "280px" }}>
          <table className="w-full text-sm table-fixed">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-12">序号</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-40">结算单名称</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-32">结算单号</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 min-w-48">结算类型 / 申请金额 / 人员</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-600 w-24">申请日期</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-20">申请人</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-600 w-20">状态</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-32">发放凭证</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-600 min-w-28">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {row.innerList.map(item => (
                <React.Fragment key={item.id}>
                  {item.settlementMethods.map((sm, smIdx) => (
                    <tr key={`${item.id}-${smIdx}`} className="hover:bg-gray-50">
                      <td className="px-3 py-2 w-12">
                        {smIdx === 0 && <span className="text-xs text-gray-400">{item.id.replace("i", "")}.</span>}
                      </td>
                      <td className="px-3 py-2 w-40 max-w-40 truncate" title={item.name}>{smIdx === 0 ? item.name : ""}</td>
                      <td className="px-3 py-2 w-32">{smIdx === 0 ? item.code : ""}</td>
                      <td className="px-3 py-2 min-w-48">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={sm.method === "451定额" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}>{sm.method}</Badge>
                          <span className="text-green-600 font-medium">¥{sm.applyAmount}</span>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {sm.personList.map((p, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">
                              {p.name}{p.amount ? ` ¥${p.amount}` : ""}{p.personDays ? ` ${p.personDays}人天` : ""}
                            </span>
                          ))}
                        </div>
                      </td>
                      {smIdx === 0 && (
                        <>
                          <td className="px-3 py-2 text-center w-24" rowSpan={item.settlementMethods.length}>{item.applyDate}</td>
                          <td className="px-3 py-2 w-20" rowSpan={item.settlementMethods.length}>{item.applicant}</td>
                          <td className="px-3 py-2 text-center w-20" rowSpan={item.settlementMethods.length}><Badge className={getInnerStatusBadge(item.status)}>{item.status}</Badge></td>
                          <td className="px-3 py-2 w-32 max-w-32 truncate" rowSpan={item.settlementMethods.length} title={item.voucher}>{item.voucher || "-"}</td>
                          <td className="px-3 py-2 min-w-28" rowSpan={item.settlementMethods.length}>
                            <div className="flex flex-col gap-1">
                              <Button variant="link" size="sm" className="text-blue-600 h-auto p-0" onClick={() => { setSelectedRowData(row); setApplyDialogOpen(true); }}><Eye className="w-3 h-3 mr-1" />查看</Button>
                              {(item.status === "已申请" || item.status === "审核中") && (
                                <Button variant="link" size="sm" className="text-orange-600 h-auto p-0" onClick={() => { setSelectedRowData(row); setApplyDialogOpen(true); }}><CheckCircle className="w-3 h-3 mr-1" />审核</Button>
                              )}
                              {item.status === "已申请" && (
                                <Button variant="link" size="sm" className="text-green-600 h-auto p-0" onClick={() => { setSelectedRowData({ ...row, isEditMode: true }); setApplyDialogOpen(true); }}><Edit className="w-3 h-3 mr-1" />修改</Button>
                              )}
                              {item.status === "已申请" && (
                                <Button variant="link" size="sm" className="text-red-600 h-auto p-0" onClick={() => { if(confirm('确定删除该结算单？')) { alert('删除功能开发中'); } }}><Trash2 className="w-3 h-3 mr-1" />删除</Button>
                              )}
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-4 py-6 text-center text-sm text-gray-400">暂无结算单数据</div>
      )}
    </div>
  );

  // 筛选数据
  const filteredData = mockSettlementData.filter(item => {
    // 按类型Tab筛选
    if (item.type !== typeTab) return false;
    // 基本信息筛选
    if (searchArea && !item.branch.includes(searchArea)) return false;
    if (searchBusinessUnit && !item.businessUnit.includes(searchBusinessUnit)) return false;
    if (searchStatus !== "全部" && item.status !== searchStatus) return false;

    // 项目型筛选
    if (item.type === "项目型") {
      if (searchOppName && !item.oppName.includes(searchOppName)) return false;
      if (searchOppCode && !item.oppCode.includes(searchOppCode)) return false;
      if (searchContractName && !item.contractName.includes(searchContractName)) return false;
      if (searchContractCode && !item.contractCode.includes(searchContractCode)) return false;
      if (searchProjectName && !item.projectName.includes(searchProjectName)) return false;
      if (searchProjectCode && !item.projectCode.includes(searchProjectCode)) return false;
    }

    // 小微标品筛选
    if (item.type === "小微标品") {
      if (searchWorkOrderNo && !item.projectCode.includes(searchWorkOrderNo)) return false;
      if (searchMainOrderCode && !item.projectCode.includes(searchMainOrderCode)) return false;
      if (searchOrderCode && !item.projectCode.includes(searchOrderCode)) return false;
    }

    // 三联单筛选
    if (item.type === "三联单") {
      if (searchTripleOrderCode && !item.projectCode.includes(searchTripleOrderCode)) return false;
      if (searchServiceNumber && !item.projectCode.includes(searchServiceNumber)) return false;
      if (searchAssetCode && !item.projectCode.includes(searchAssetCode)) return false;
    }

    return true;
  });

  // 计算统计数据（基于全量数据，不受Tab筛选影响）
  const calculateStats = (type: SettlementType | null) => {
    const data = type ? mockSettlementData.filter(d => d.type === type) : mockSettlementData;

    // 全部：所有记录
    const all = data;
    // 可申请：canApplyAmount > 0 的记录
    const canApply = data.filter(d => parseFloat(d.canApplyAmount.replace(/,/g, '')) > 0);
    // 审核通过：status === "审核通过" 的记录
    const approved = data.filter(d => d.status === "审核通过");
    // 审核通过可发放：status === "审核通过" 的记录（金额用 canApplyAmount）
    const approvedPayable = data.filter(d => d.status === "审核通过");
    // 审核通过实际发放：status === "发放完成" 的记录（金额用 actualPaidAmount）
    const approvedPaid = data.filter(d => d.status === "发放完成");

    const sumAmount = (records: SettlementRecord[], field: keyof SettlementRecord = "canApplyAmount") =>
      records.reduce((sum, r) => {
        const value = r[field] as string;
        return sum + parseFloat(value.replace(/,/g, ''));
      }, 0);

    return {
      all: { count: all.length, amount: sumAmount(all).toLocaleString('zh-CN', { minimumFractionDigits: 2 }) },
      canApply: { count: canApply.length, amount: sumAmount(canApply).toLocaleString('zh-CN', { minimumFractionDigits: 2 }) },
      approved: { count: approved.length, amount: sumAmount(approved).toLocaleString('zh-CN', { minimumFractionDigits: 2 }) },
      approvedPayable: { count: approvedPayable.length, amount: sumAmount(approvedPayable).toLocaleString('zh-CN', { minimumFractionDigits: 2 }) },
      approvedPaid: { count: approvedPaid.length, amount: sumAmount(approvedPaid, "actualPaidAmount").toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }
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

      {/* 统计卡片区域 - 15个统计卡片分3组，每组5个 */}
      <div className="px-6 mt-4 flex-shrink-0">
        <div className="grid grid-cols-3 gap-3">
          {/* 项目型自交付 */}
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-sm font-medium text-blue-700 mb-2">项目型自交付</div>
            <div className="grid grid-cols-5 gap-2">
              <StatItem label="全部" count={projectStats.all.count.toString()} amount={projectStats.all.amount} color="text-blue-600" />
              <StatItem label="可申请" count={projectStats.canApply.count.toString()} amount={projectStats.canApply.amount} color="text-blue-600" />
              <StatItem label="审核通过" count={projectStats.approved.count.toString()} amount={projectStats.approved.amount} color="text-blue-600" />
              <StatItem label="审核通过可发放" count={projectStats.approvedPayable.count.toString()} amount={projectStats.approvedPayable.amount} color="text-blue-600" />
              <StatItem label="审核通过实际发放" count={projectStats.approvedPaid.count.toString()} amount={projectStats.approvedPaid.amount} color="text-blue-600" />
            </div>
          </div>
          {/* 小微标品 */}
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-sm font-medium text-green-700 mb-2">小微标品</div>
            <div className="grid grid-cols-5 gap-2">
              <StatItem label="全部" count={standardStats.all.count.toString()} amount={standardStats.all.amount} color="text-green-600" />
              <StatItem label="可申请" count={standardStats.canApply.count.toString()} amount={standardStats.canApply.amount} color="text-green-600" />
              <StatItem label="审核通过" count={standardStats.approved.count.toString()} amount={standardStats.approved.amount} color="text-green-600" />
              <StatItem label="审核通过可发放" count={standardStats.approvedPayable.count.toString()} amount={standardStats.approvedPayable.amount} color="text-green-600" />
              <StatItem label="审核通过实际发放" count={standardStats.approvedPaid.count.toString()} amount={standardStats.approvedPaid.amount} color="text-green-600" />
            </div>
          </div>
          {/* 三联单 */}
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-sm font-medium text-purple-700 mb-2">三联单</div>
            <div className="grid grid-cols-5 gap-2">
              <StatItem label="全部" count={tripleStats.all.count.toString()} amount={tripleStats.all.amount} color="text-purple-600" />
              <StatItem label="可申请" count={tripleStats.canApply.count.toString()} amount={tripleStats.canApply.amount} color="text-purple-600" />
              <StatItem label="审核通过" count={tripleStats.approved.count.toString()} amount={tripleStats.approved.amount} color="text-purple-600" />
              <StatItem label="审核通过可发放" count={tripleStats.approvedPayable.count.toString()} amount={tripleStats.approvedPayable.amount} color="text-purple-600" />
              <StatItem label="审核通过实际发放" count={tripleStats.approvedPaid.count.toString()} amount={tripleStats.approvedPaid.amount} color="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 类型Tab页签 */}
      <div className="px-6 mt-4 flex-shrink-0">
        <TabNav
          style="pill"
          tabs={[
            { id: "项目型", label: "项目型", count: projectStats.all.count },
            { id: "小微标品", label: "小微标品", count: standardStats.all.count },
            { id: "三联单", label: "三联单", count: tripleStats.all.count }
          ]}
          activeTab={typeTab}
          onTabChange={(id) => setTypeTab(id as SettlementType)}
        />
      </div>

      {/* 查询条件区域 */}
      <div className="px-6 mt-4 flex-shrink-0">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          {/* 项目型查询 */}
          {typeTab === "项目型" && (
            <div className="grid grid-cols-4 gap-x-6 gap-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">区域</label>
                <Input placeholder="请输入" value={searchArea} onChange={e => setSearchArea(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">经营单元</label>
                <Input placeholder="请输入" value={searchBusinessUnit} onChange={e => setSearchBusinessUnit(e.target.value)} />
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">商机名称</label>
                <Input placeholder="请输入" value={searchOppName} onChange={e => setSearchOppName(e.target.value)} />
              </div>
              {expandedProject && (
                <>
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
                </>
              )}
            </div>
          )}

          {/* 小微标品查询 */}
          {typeTab === "小微标品" && (
            <div className="grid grid-cols-4 gap-x-6 gap-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">区域</label>
                <Input placeholder="请输入" value={searchArea} onChange={e => setSearchArea(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">经营单元</label>
                <Input placeholder="请输入" value={searchBusinessUnit} onChange={e => setSearchBusinessUnit(e.target.value)} />
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">工单编号</label>
                <Input placeholder="请输入" value={searchWorkOrderNo} onChange={e => setSearchWorkOrderNo(e.target.value)} />
              </div>
              {expandedSmallProduct && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">主定单编码</label>
                    <Input placeholder="请输入" value={searchMainOrderCode} onChange={e => setSearchMainOrderCode(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">订单编码</label>
                    <Input placeholder="请输入" value={searchOrderCode} onChange={e => setSearchOrderCode(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">业务类型</label>
                    <Select value={searchSmallProductType} onValueChange={setSearchSmallProductType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="全部">全部</SelectItem>
                        <SelectItem value="视联网">视联网</SelectItem>
                        <SelectItem value="机房整治">机房整治</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">创建时间</label>
                    <div className="flex gap-2">
                      <Input type="date" value={searchCreateTimeStart} onChange={e => setSearchCreateTimeStart(e.target.value)} />
                      <span className="self-center text-gray-400">-</span>
                      <Input type="date" value={searchCreateTimeEnd} onChange={e => setSearchCreateTimeEnd(e.target.value)} />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* 三联单查询 - 合并基础查询和特有查询 */}
          {typeTab === "三联单" && (
            <div>
              <div className="grid grid-cols-4 gap-x-6 gap-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">经营单元</label>
                  <Input placeholder="请输入" value={searchBusinessUnit} onChange={e => setSearchBusinessUnit(e.target.value)} />
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">订单编码</label>
                  <Input placeholder="请输入" value={searchTripleOrderCode} onChange={e => setSearchTripleOrderCode(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">受理的业务号码</label>
                  <Input placeholder="请输入" value={searchServiceNumber} onChange={e => setSearchServiceNumber(e.target.value)} />
                </div>
                {expandedTriple && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">资产唯一编码</label>
                      <Input placeholder="请输入" value={searchAssetCode} onChange={e => setSearchAssetCode(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">优惠编码</label>
                      <Input placeholder="请输入" value={searchDiscountCode} onChange={e => setSearchDiscountCode(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">优惠名称</label>
                      <Input placeholder="请输入" value={searchDiscountName} onChange={e => setSearchDiscountName(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">创建时间</label>
                      <div className="flex gap-2">
                        <Input type="date" value={searchCreateTimeStart} onChange={e => setSearchCreateTimeStart(e.target.value)} />
                        <span className="self-center text-gray-400">-</span>
                        <Input type="date" value={searchCreateTimeEnd} onChange={e => setSearchCreateTimeEnd(e.target.value)} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* 更多按钮和操作 */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <button
              onClick={() => {
                setExpandedProject(!expandedProject);
                setExpandedSmallProduct(!expandedSmallProduct);
                setExpandedTriple(!expandedTriple);
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {(typeTab === "项目型" && expandedProject) ||
               (typeTab === "小微标品" && expandedSmallProduct) ||
               (typeTab === "三联单" && expandedTriple)
                ? "收起更多条件" : "展开更多条件"}
            </button>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-1">
                <RefreshCw className="w-4 h-4" />
                重置
              </Button>
              <Button className="gap-1">
                <Search className="w-4 h-4" />
                查询
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
          <Button variant="outline" className="gap-1" onClick={() => { setImportType("三联单"); setImportDialogOpen(true); }}>
            <Upload className="w-4 h-4" />
            导入三联单
          </Button>
          <Button variant="outline" className="gap-1" onClick={() => { setImportType("小微标品"); setImportDialogOpen(true); }}>
            <Upload className="w-4 h-4" />
            导入小微标品工单
          </Button>
          <Button variant="outline" className="gap-1" onClick={() => { setImportType("凭证"); setImportDialogOpen(true); }}>
            <Upload className="w-4 h-4" />
            导入已发放凭证
          </Button>
          <Button variant="outline" className="gap-1" onClick={handleExport}>
            <Download className="w-4 h-4" />
            导出
          </Button>
        </div>
      </div>

      {/* 表格 */}
      <div className="flex-1 overflow-hidden px-6 pb-6">
        <div className="h-full bg-white rounded-lg border border-gray-200 overflow-auto">
          <table className="w-full text-sm table-fixed">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              {/* 项目型表头 */}
              {typeTab === "项目型" && (
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-10 bg-gray-50 sticky left-0 z-30">展开</th>
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
              )}
              {/* 小微标品表头 */}
              {typeTab === "小微标品" && (
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-10 bg-gray-50 sticky left-0 z-30">展开</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-12">序号</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-24">区域</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-24">经营单元</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">类型</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-28">工单编号</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-32">主订单编码</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-28">订单编码</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">业务类型</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-28">客户名称</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">工单状态</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">收单人</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-28">环节名称</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-600 w-24">可申请</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-600 w-24">已申请</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-600 w-28">可发放</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-600 w-24">实际发放</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">状态</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-32 bg-gray-50 sticky right-0 z-20">操作</th>
                </tr>
              )}
              {/* 三联单表头 */}
              {typeTab === "三联单" && (
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-10 bg-gray-50 sticky left-0 z-30">展开</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-12">序号</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-24">经营单元</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">类型</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-28">VIP客户名称</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-28">VIP卡号</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-600 w-24">统计合同额</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-600 w-32">竣工时间</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-24">受理归属分局</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-24">受理归属支局</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">受理人名称</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">受理人工号</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-600 w-24">受理金额</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-600 w-32">受理时间</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-28">订单编码</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">订单状态</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-28">资产唯一编码</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-28">受理的业务号码</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-24">优惠编码</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-28">优惠名称</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-600 w-24">翼装大师</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-24">营销归属分局</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-24">营销归属支局</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">营销人姓名</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">营销人工号</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-600 w-24">可申请</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-600 w-24">已申请</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-600 w-28">可发放</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-600 w-24">实际发放</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">状态</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-32 bg-gray-50 sticky right-0 z-20">操作</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map(row => (
                <React.Fragment key={row.id}>
                  {/* 项目型行 */}
                  {typeTab === "项目型" && (
                    <>
                      <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleRowExpand(row.id)}>
                        <td className="px-3 py-3 w-10 bg-white sticky left-0 z-10">
                          <button onClick={(e) => { e.stopPropagation(); toggleRowExpand(row.id); }} className="p-1 hover:bg-gray-100 rounded">
                            {expandedRows.has(row.id) ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                          </button>
                        </td>
                        <td className="px-3 py-3 w-12">{row.index}</td>
                        <td className="px-3 py-3 w-24">{row.businessUnit}</td>
                        <td className="px-3 py-3 w-20">{row.branch}</td>
                        <td className="px-3 py-3 w-20"><Badge className="bg-blue-100 text-blue-700">{row.type}</Badge></td>
                        <td className="px-3 py-3 max-w-36 truncate" title={row.oppName}>{row.oppName}</td>
                        <td className="px-3 py-3 w-28">{row.oppCode}</td>
                        <td className="px-3 py-3 max-w-32 truncate" title={row.contractName}>{row.contractName}</td>
                        <td className="px-3 py-3 w-28">{row.contractCode}</td>
                        <td className="px-3 py-3 max-w-32 truncate" title={row.projectName}>{row.projectName}</td>
                        <td className="px-3 py-3 w-28">{row.projectCode}</td>
                        <td className="px-3 py-3 w-28">{row.customerName}</td>
                        <td className="px-3 py-3 w-24">{row.customerCode}</td>
                        <td className="px-3 py-3 w-28 text-right">{row.forwardAmount}</td>
                        <td className="px-3 py-3 w-20 text-center">{row.isWarrantyProject ? "是" : "否"}</td>
                        <td className="px-3 py-3 w-20 text-center">{row.cycle}</td>
                        <td className="px-3 py-3 w-24 text-center">{row.startDate}</td>
                        <td className="px-3 py-3 w-24 text-center">{row.endDate}</td>
                        <td className="px-3 py-3 w-28 text-right">{row.selfDeliveryForwardAmount}</td>
                        <td className="px-3 py-3 w-28 text-right">{row.selfDeliveryCostAmount}</td>
                        <td className="px-3 py-3 w-28 text-right">{row.forwardContractSelfDeliveryAmount}</td>
                        <td className="px-3 py-3 w-24 text-right font-medium">{row.canApplyAmount}</td>
                        <td className="px-3 py-3 w-24 text-right text-blue-600">{row.appliedAmount}</td>
                        <td className="px-3 py-3 w-28 text-right text-green-600">{row.approvedAmount}</td>
                        <td className="px-3 py-3 w-24 text-right font-medium text-emerald-600">{row.actualPaidAmount}</td>
                        <td className="px-3 py-3 w-20"><Badge className={getStatusBadge(row.status)}>{row.status}</Badge></td>
                        <td className="px-3 py-3 w-32 bg-gray-50 sticky right-0 z-10">
                          <Button variant="link" size="sm" className="text-blue-600 h-auto p-0 flex items-center gap-1 whitespace-nowrap" onClick={() => { setSelectedRowData({ ...row, innerList: [], isEditMode: false }); setApplyDialogOpen(true); }}>
                            <Plus className="w-3 h-3" />申请自交付结算
                          </Button>
                        </td>
                      </tr>
                      {/* 项目型内层结算单列表 */}
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
                                  <div className="overflow-x-auto" style={{ maxHeight: "280px" }}>
                                    <table className="w-full text-sm table-fixed">
                                      <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                                        <tr>
                                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-12">序号</th>
                                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-40">结算单名称</th>
                                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-32">结算单号</th>
                                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-28">结算类型</th>
                                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-600 w-24">申请金额</th>
                                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 min-w-56">人员（金额/人天）</th>
                                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-600 w-24">申请日期</th>
                                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-20">申请人</th>
                                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-600 w-20">状态</th>
                                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-32">发放凭证</th>
                                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-600 min-w-28">操作</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-100">
                                        {row.innerList.map(item => (
                                          <React.Fragment key={item.id}>
                                            {item.settlementMethods.map((sm, smIdx) => (
                                              <tr key={`${item.id}-${smIdx}`} className="hover:bg-gray-50">
                                                <td className="px-3 py-2 w-12 align-top">
                                                  {smIdx === 0 && <span className="text-xs text-gray-400 mr-1">{item.id.replace("i", "")}.</span>}
                                                  {smIdx > 0 && <span className="text-xs text-gray-300 mr-1">└</span>}
                                                </td>
                                                <td className="px-3 py-2 w-40 max-w-40 align-top truncate" title={item.name}>{smIdx === 0 ? item.name : ""}</td>
                                                <td className="px-3 py-2 w-32 align-top">{smIdx === 0 ? item.code : ""}</td>
                                                <td className="px-3 py-2 w-28 align-top">
                                                  <Badge className={sm.method === "451定额" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}>{sm.method}</Badge>
                                                </td>
                                                <td className="px-3 py-2 w-24 align-top text-right text-green-600 font-medium">¥{sm.applyAmount}</td>
                                                <td className="px-3 py-2 min-w-56 align-top">
                                                  <div className="flex flex-wrap gap-1">
                                                    {sm.personList.map((p, idx) => (
                                                      <span key={idx} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">
                                                        {p.name}{p.amount ? ` ¥${p.amount}` : ""}{p.personDays ? ` ${p.personDays}人天` : ""}
                                                      </span>
                                                    ))}
                                                  </div>
                                                </td>
                                                {smIdx === 0 && (
                                                  <>
                                                    <td className="px-3 py-2 w-24 text-center align-top" rowSpan={item.settlementMethods.length}>{item.applyDate}</td>
                                                    <td className="px-3 py-2 w-20 align-top" rowSpan={item.settlementMethods.length}>{item.applicant}</td>
                                                    <td className="px-3 py-2 w-20 text-center align-top" rowSpan={item.settlementMethods.length}><Badge className={getInnerStatusBadge(item.status)}>{item.status}</Badge></td>
                                                    <td className="px-3 py-2 w-32 max-w-32 align-top truncate" rowSpan={item.settlementMethods.length} title={item.voucher}>{item.voucher || "-"}</td>
                                                    <td className="px-3 py-2 min-w-28 align-top" rowSpan={item.settlementMethods.length}>
                                                      <div className="flex flex-col gap-1">
                                                        <Button variant="link" size="sm" className="text-blue-600 h-auto p-0" onClick={() => { setSelectedRowData(row); setApplyDialogOpen(true); }}><Eye className="w-3 h-3 mr-1" />查看</Button>
                                                        {(item.status === "已申请" || item.status === "审核中") && (
                                                          <Button variant="link" size="sm" className="text-orange-600 h-auto p-0" onClick={() => { setSelectedRowData(row); setApplyDialogOpen(true); }}><CheckCircle className="w-3 h-3 mr-1" />审核</Button>
                                                        )}
                                                        {item.status === "已申请" && (
                                                          <Button variant="link" size="sm" className="text-green-600 h-auto p-0" onClick={() => { setSelectedRowData({ ...row, isEditMode: true }); setApplyDialogOpen(true); }}><Edit className="w-3 h-3 mr-1" />修改</Button>
                                                        )}
                                                        {item.status === "已申请" && (
                                                          <Button variant="link" size="sm" className="text-red-600 h-auto p-0" onClick={() => { if(confirm('确定删除该结算单？')) { alert('删除功能开发中'); } }}><Trash2 className="w-3 h-3 mr-1" />删除</Button>
                                                        )}
                                                      </div>
                                                    </td>
                                                  </>
                                                )}
                                              </tr>
                                            ))}
                                          </React.Fragment>
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
                    </>
                  )}
                  {/* 小微标品行 */}
                  {typeTab === "小微标品" && (
                    <>
                      <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleRowExpand(row.id)}>
                        <td className="px-3 py-3 bg-white sticky left-0 z-10">
                          <button onClick={(e) => { e.stopPropagation(); toggleRowExpand(row.id); }} className="p-1 hover:bg-gray-100 rounded">
                            {expandedRows.has(row.id) ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                          </button>
                        </td>
                        <td className="px-3 py-3">{row.index}</td>
                        <td className="px-3 py-3">{row.branch}</td>
                        <td className="px-3 py-3">{row.businessUnit}</td>
                        <td className="px-3 py-3"><Badge className="bg-green-100 text-green-700">小微标品</Badge></td>
                        <td className="px-3 py-3">{row.projectCode}</td>
                        <td className="px-3 py-3">-</td>
                        <td className="px-3 py-3">-</td>
                        <td className="px-3 py-3">-</td>
                        <td className="px-3 py-3 max-w-24 truncate" title={row.customerName}>{row.customerName}</td>
                        <td className="px-3 py-3">-</td>
                        <td className="px-3 py-3">-</td>
                        <td className="px-3 py-3">-</td>
                        <td className="px-3 py-3 text-right font-medium">{row.canApplyAmount}</td>
                        <td className="px-3 py-3 text-right text-blue-600">{row.appliedAmount}</td>
                        <td className="px-3 py-3 text-right text-green-600">{row.approvedAmount}</td>
                        <td className="px-3 py-3 text-right font-medium text-emerald-600">{row.actualPaidAmount}</td>
                        <td className="px-3 py-3"><Badge className={getStatusBadge(row.status)}>{row.status}</Badge></td>
                        <td className="px-3 py-3 bg-gray-50 sticky right-0 z-10">
                          <Button variant="link" size="sm" className="text-blue-600 h-auto p-0 flex items-center gap-1 whitespace-nowrap" onClick={() => { setSelectedRowData({ ...row, innerList: [], isEditMode: false }); setApplyDialogOpen(true); }}>
                            <Plus className="w-3 h-3" />申请自交付结算
                          </Button>
                        </td>
                      </tr>
                      {/* 小微标品内层结算单列表 */}
                      {expandedRows.has(row.id) && (
                        <tr className="bg-gray-50">
                          <td colSpan={19} className="p-0 align-top">
                            <div className="py-3 px-4">
                              <div className="bg-white border border-gray-200 rounded-lg">
                                {renderInnerList(row, "bg-green-500")}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                  {/* 三联单行 */}
                  {typeTab === "三联单" && (
                    <>
                      <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleRowExpand(row.id)}>
                        <td className="px-3 py-3 bg-white sticky left-0 z-10">
                          <button onClick={(e) => { e.stopPropagation(); toggleRowExpand(row.id); }} className="p-1 hover:bg-gray-100 rounded">
                            {expandedRows.has(row.id) ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                          </button>
                        </td>
                        <td className="px-3 py-3">{row.index}</td>
                        <td className="px-3 py-3">{row.businessUnit}</td>
                        <td className="px-3 py-3"><Badge className="bg-purple-100 text-purple-700">三联单</Badge></td>
                        <td className="px-3 py-3">{row.customerName}</td>
                        <td className="px-3 py-3">{row.customerCode}</td>
                        <td className="px-3 py-3 text-right">{row.forwardAmount}</td>
                        <td className="px-3 py-3 text-center">{row.endDate}</td>
                        <td className="px-3 py-3">{row.businessUnit}</td>
                        <td className="px-3 py-3">{row.branch}</td>
                        <td className="px-3 py-3">-</td>
                        <td className="px-3 py-3">-</td>
                        <td className="px-3 py-3 text-right">{row.selfDeliveryForwardAmount}</td>
                        <td className="px-3 py-3 text-center">{row.startDate}</td>
                        <td className="px-3 py-3">{row.projectCode}</td>
                        <td className="px-3 py-3">-</td>
                        <td className="px-3 py-3">-</td>
                        <td className="px-3 py-3">-</td>
                        <td className="px-3 py-3">-</td>
                        <td className="px-3 py-3">-</td>
                        <td className="px-3 py-3 text-center">-</td>
                        <td className="px-3 py-3">-</td>
                        <td className="px-3 py-3">-</td>
                        <td className="px-3 py-3">-</td>
                        <td className="px-3 py-3">-</td>
                        <td className="px-3 py-3 text-right font-medium">{row.canApplyAmount}</td>
                        <td className="px-3 py-3 text-right text-blue-600">{row.appliedAmount}</td>
                        <td className="px-3 py-3 text-right text-green-600">{row.approvedAmount}</td>
                        <td className="px-3 py-3 text-right font-medium text-emerald-600">{row.actualPaidAmount}</td>
                        <td className="px-3 py-3"><Badge className={getStatusBadge(row.status)}>{row.status}</Badge></td>
                        <td className="px-3 py-3 bg-gray-50 sticky right-0 z-10">
                          <Button variant="link" size="sm" className="text-blue-600 h-auto p-0 flex items-center gap-1 whitespace-nowrap" onClick={() => { setSelectedRowData({ ...row, innerList: [], isEditMode: false }); setApplyDialogOpen(true); }}>
                            <Plus className="w-3 h-3" />申请自交付结算
                          </Button>
                        </td>
                      </tr>
                      {/* 三联单内层结算单列表 */}
                      {expandedRows.has(row.id) && (
                        <tr className="bg-gray-50">
                          <td colSpan={30} className="p-0 align-top">
                            <div className="py-3 px-4">
                              {renderInnerList(row, "bg-purple-500")}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </React.Fragment>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={typeTab === "三联单" ? 30 : typeTab === "小微标品" ? 19 : 26} className="px-3 py-8 text-center text-gray-500">
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
        onAudit={(rec) => { setApplyDialogOpen(false); setAuditRecord(rec as InnerRecord); setAuditResult(null); setAuditOpinion(""); setAuditDialogOpen(true); }}
      />

      {/* 审核弹窗 */}
      {auditDialogOpen && auditRecord && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">审核结算单</h3>
              <button onClick={() => { setAuditDialogOpen(false); setAuditRecord(null); setAuditResult(null); setAuditOpinion(""); }} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">结算单名称</span>
                  <span className="text-sm font-medium">{auditRecord.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">结算单号</span>
                  <span className="text-sm font-medium">{auditRecord.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">申请金额</span>
                  <span className="text-sm font-medium text-green-600">¥{auditRecord.applyAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">结算方式</span>
                  <span className="text-sm font-medium">{auditRecord.settlementMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">申请人</span>
                  <span className="text-sm font-medium">{auditRecord.applicant}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">审核结果</label>
                <div className="flex gap-4">
                  <label className={`flex-1 px-4 py-2 rounded-lg border-2 cursor-pointer text-center transition-colors ${auditResult === "通过" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 hover:border-green-300"}`}>
                    <input type="radio" name="auditResult" value="通过" checked={auditResult === "通过"} onChange={() => setAuditResult("通过")} className="sr-only" />
                    通过
                  </label>
                  <label className={`flex-1 px-4 py-2 rounded-lg border-2 cursor-pointer text-center transition-colors ${auditResult === "驳回" ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 hover:border-red-300"}`}>
                    <input type="radio" name="auditResult" value="驳回" checked={auditResult === "驳回"} onChange={() => setAuditResult("驳回")} className="sr-only" />
                    驳回
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">审批意见</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="请输入审批意见..."
                  value={auditOpinion}
                  onChange={e => setAuditOpinion(e.target.value)}
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setAuditDialogOpen(false); setAuditRecord(null); setAuditResult(null); setAuditOpinion(""); }}>
                取消
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600" disabled={!auditResult} onClick={() => { alert(`提交审核结果：${auditResult}，意见：${auditOpinion}`); setAuditDialogOpen(false); setAuditRecord(null); setAuditResult(null); setAuditOpinion(""); }}>
                提交审核
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 导入弹窗 */}
      {importDialogOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">导入{importType === "三联单" ? "三联单" : importType === "小微标品" ? "小微标品工单" : "已发放凭证"}</h3>
              <button onClick={() => setImportDialogOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">请上传 {importType === "三联单" ? "三联单" : importType === "小微标品" ? "小微标品工单" : "已发放凭证"} Excel 文件</span>
                <Button variant="outline" size="sm" className="gap-1" onClick={() => alert('下载模版')}>
                  <Download className="w-4 h-4" />
                  下载模版
                </Button>
              </div>
              {/* 拖拽上传区域 */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-blue-400', 'bg-blue-50'); }}
                onDragLeave={(e) => { e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50'); }}
                onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50'); alert('文件上传中...'); }}
                onClick={() => alert('请选择文件上传')}
              >
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-gray-500">将文件拖拽到此处，或<span className="text-blue-600">点击选择文件</span></p>
                <p className="text-xs text-gray-400 mt-2">支持 .xlsx, .xls 格式</p>
              </div>
              {/* 模版说明 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">模版字段说明：</p>
                {importType === "三联单" && (
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>工单编号、经营单元、区域、主定单编码、备件库标签</p>
                    <p>标准小微标签、业务类型、收单人/岗、环节名称、订单编码</p>
                    <p>结束日期、工单状态、客户名称、id、创建时间</p>
                    <p>历时、收单人/岗</p>
                  </div>
                )}
                {importType === "小微标品" && (
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>统计日期、资产唯一编码、订单编码、受理的业务号码、优惠编码</p>
                    <p>优惠名称、受理金额、受理归属分局、受理归属支局</p>
                    <p>ICT协议编号、受理时间、竣工时间、VIP卡号、受理人工号</p>
                    <p>受理人名称、营销人工号、营销人姓名、营销人员归属分局</p>
                    <p>营销人员归属支局、订单来源是否翼装大师、优惠开始时间</p>
                    <p>优惠结束时间、订单状态、vip客户名称、是否三联单（剔除MSS）</p>
                    <p>统计合同额、月份、日期、季度、经营单元</p>
                  </div>
                )}
                {importType === "凭证" && (
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>结算单名称、结算单号、申请金额、结算类型</p>
                    <p>人员列表（姓名、人力编码、金额）、发放日期</p>
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
                取消
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600">
                开始导入
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}