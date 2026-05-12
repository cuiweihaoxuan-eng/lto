import React, { useState } from "react";
import { X, Search, ChevronUp, RefreshCw, Paperclip, FileText, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "./ui/textarea";
import { SixPositioningDetail } from "./SixPositioningDetail";

interface RevenueApplyDialogProps {
  open: boolean;
  onClose: () => void;
  initialApproval?: ApprovalRecord | null;
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

interface ContractProject {
  id: string;
  customerName: string;
  customerCode: string;
  contractName: string;
  contractCode: string;
  contractAmount: string;
  projectName: string;
  projectCode: string;
  contractConfirmedRevenue: string;
  contractUnconfirmedRevenue: string;
  contractTotalReceived: string;
  contractRemainingReceived: string;
  planRevenue: string;
  actualRevenue: string;
  planAccount: string;
  actualAccount: string;
}

interface PeriodicPlan {
  id: string;
  index: number;
  productRevenue: string;
  businessType: string;
  invoiceType: string;
  taxRate: string;
  planConfirmTotalWithTax: string;
  planConfirmTotalWithoutTax: string;
  estimatedConfirmDate: string;
  revenueTriggerSystem: string;
  planStatus: string;
  summary: string;
  type: string;
}

interface NonPeriodicPlan {
  id: string;
  index: number;
  productRevenue: string;
  businessType: string;
  invoiceType: string;
  taxRate: string;
  unitPrice: string;
  quantity: string;
  confirmAmountWithTax: string;
  confirmAmountWithoutTax: string;
  frequency: string;
  confirmTotalWithTax: string;
  confirmTotalWithoutTax: string;
  startDate: string;
  endDate: string;
  revenueTriggerSystem: string;
  planStatus: string;
  summary: string;
  type: string;
}

interface SixPositionAttachment {
  id: string;
  name: string;
  size: string;
  uploadTime: string;
}

interface SixPositionItem {
  id: string;
  name: string;
  description: string;
  attachments: SixPositionAttachment[];
}

const mockContracts: ContractProject[] = [
  {
    id: "1",
    customerName: "中国邮政速递物流股份有限公司台州市分公司",
    customerCode: "ZJ2019060400004795",
    contractName: "台州邮政ICT服务合同",
    contractCode: "HT202604001",
    contractAmount: "500,000.00",
    projectName: "台州邮政ICT实施项目",
    projectCode: "XM202604001",
    contractConfirmedRevenue: "450,000.00",
    contractUnconfirmedRevenue: "50,000.00",
    contractTotalReceived: "480,000.00",
    contractRemainingReceived: "20,000.00",
    planRevenue: "50,000.00",
    actualRevenue: "48,000.00",
    planAccount: "52,000.00",
    actualAccount: "50,000.00"
  },
  {
    id: "2",
    customerName: "中国美术学院",
    customerCode: "ZJ2020010100001234",
    contractName: "算力服务合同",
    contractCode: "HT202604002",
    contractAmount: "200,000.00",
    projectName: "校园算力建设",
    projectCode: "XM202604002",
    contractConfirmedRevenue: "80,000.00",
    contractUnconfirmedRevenue: "120,000.00",
    contractTotalReceived: "80,000.00",
    contractRemainingReceived: "120,000.00",
    planRevenue: "30,000.00",
    actualRevenue: "28,000.00",
    planAccount: "30,000.00",
    actualAccount: "28,000.00"
  },
  {
    id: "3",
    customerName: "宁波港集团有限公司",
    customerCode: "ZJ2019051500001234",
    contractName: "宁波港数字化转型合同",
    contractCode: "HT202604003",
    contractAmount: "800,000.00",
    projectName: "数字化转型一期",
    projectCode: "XM202604003",
    contractConfirmedRevenue: "0.00",
    contractUnconfirmedRevenue: "800,000.00",
    contractTotalReceived: "0.00",
    contractRemainingReceived: "800,000.00",
    planRevenue: "100,000.00",
    actualRevenue: "85,000.00",
    planAccount: "100,000.00",
    actualAccount: "95,000.00"
  }
];

const mockPeriodicPlans: PeriodicPlan[] = [
  { id: "p1", index: 1, productRevenue: "ICT服务费", businessType: "产数服务", invoiceType: "增值税专用发票", taxRate: "6%", planConfirmTotalWithTax: "10,000.00", planConfirmTotalWithoutTax: "9,433.96", estimatedConfirmDate: "2026-05-15", revenueTriggerSystem: "BOSS系统", planStatus: "待确认", summary: "5月ICT服务费确认", type: "周期性" },
  { id: "p2", index: 2, productRevenue: "运维服务费", businessType: "产数服务", invoiceType: "增值税专用发票", taxRate: "6%", planConfirmTotalWithTax: "5,000.00", planConfirmTotalWithoutTax: "4,716.98", estimatedConfirmDate: "2026-05-20", revenueTriggerSystem: "BOSS系统", planStatus: "待确认", summary: "5月运维服务费确认", type: "周期性" },
  { id: "p3", index: 3, productRevenue: "技术支持费", businessType: "产数服务", invoiceType: "增值税专用发票", taxRate: "6%", planConfirmTotalWithTax: "8,000.00", planConfirmTotalWithoutTax: "7,547.17", estimatedConfirmDate: "2026-05-25", revenueTriggerSystem: "BOSS系统", planStatus: "已确认", summary: "5月技术支持费确认", type: "周期性" }
];

const mockNonPeriodicPlans: NonPeriodicPlan[] = [
  { id: "np1", index: 1, productRevenue: "设备销售-服务器", businessType: "设备销售", invoiceType: "增值税专用发票", taxRate: "13%", unitPrice: "50,000.00", quantity: "2", confirmAmountWithTax: "113,000.00", confirmAmountWithoutTax: "100,000.00", frequency: "1", confirmTotalWithTax: "113,000.00", confirmTotalWithoutTax: "100,000.00", startDate: "2026-06-01", endDate: "2026-06-30", revenueTriggerSystem: "BOSS系统", planStatus: "待确认", summary: "服务器销售确认", type: "非周期性" },
  { id: "np2", index: 2, productRevenue: "软件授权费", businessType: "产数标品", invoiceType: "增值税专用发票", taxRate: "13%", unitPrice: "30,000.00", quantity: "1", confirmAmountWithTax: "33,900.00", confirmAmountWithoutTax: "30,000.00", frequency: "1", confirmTotalWithTax: "33,900.00", confirmTotalWithoutTax: "30,000.00", startDate: "2026-06-15", endDate: "2026-06-30", revenueTriggerSystem: "BOSS系统", planStatus: "待确认", summary: "软件授权确认", type: "非周期性" }
];

// 六到位mock数据
const mockSixPositionData: SixPositionItem[] = [
  {
    id: "customer",
    name: "客情掌握",
    description: "客户档案、拜访记录、商机提前录入、近三年信息化项目",
    attachments: [
      { id: "c1", name: "客户档案清单.xlsx", size: "256KB", uploadTime: "2026-04-15 10:30" },
      { id: "c2", name: "拜访记录汇总.pdf", size: "1.2MB", uploadTime: "2026-04-16 14:20" }
    ]
  },
  {
    id: "plan",
    name: "方案总控",
    description: "组建团队、方案设计与审核、方案结构与中台把关",
    attachments: [
      { id: "p1", name: "团队组建方案.docx", size: "520KB", uploadTime: "2026-04-10 09:00" },
      { id: "p2", name: "方案设计模板.pdf", size: "890KB", uploadTime: "2026-04-12 16:45" }
    ]
  },
  {
    id: "bidding",
    name: "谈判/应标自主",
    description: "参标记录、应标结果记录、商务谈判、前向合同信息",
    attachments: [
      { id: "b1", name: "参标记录表.xlsx", size: "128KB", uploadTime: "2026-04-20 11:00" }
    ]
  },
  {
    id: "procurement",
    name: "采购自主",
    description: "标前决策、后向资料、业务解构、业务风险防控",
    attachments: [
      { id: "pr1", name: "采购决策审批单.pdf", size: "345KB", uploadTime: "2026-04-18 15:30" },
      { id: "pr2", name: "供应商资质证明.zip", size: "2.1MB", uploadTime: "2026-04-19 09:15" }
    ]
  },
  {
    id: "project",
    name: "项目强管控",
    description: "项目实施总体设计、变更记录、验收报告、项目实施文件、审计清单",
    attachments: [
      { id: "pj1", name: "项目总体设计方案.docx", size: "1.5MB", uploadTime: "2026-04-05 10:00" },
      { id: "pj2", name: "变更记录表.xlsx", size: "180KB", uploadTime: "2026-04-08 14:30" },
      { id: "pj3", name: "验收报告.pdf", size: "560KB", uploadTime: "2026-04-25 16:00" }
    ]
  },
  {
    id: "maintenance",
    name: "运维自主",
    description: "数字平台、第一服务界面、售后其他资料",
    attachments: [
      { id: "m1", name: "运维服务方案.docx", size: "420KB", uploadTime: "2026-04-22 11:30" }
    ]
  }
];

export function RevenueApplyDialog({ open, onClose, initialApproval }: RevenueApplyDialogProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectDialogOpen, setSelectDialogOpen] = useState(false);
  const [sixPositionDialogOpen, setSixPositionDialogOpen] = useState(false);
  const [activePlanTab, setActivePlanTab] = useState<"periodic" | "nonPeriodic">("periodic");
  const [selectedContract, setSelectedContract] = useState<ContractProject | null>(null);
  const [selectedPeriodicPlans, setSelectedPeriodicPlans] = useState<Set<string>>(new Set());
  const [selectedNonPeriodicPlans, setSelectedNonPeriodicPlans] = useState<Set<string>>(new Set());
  const [searchCustomerName, setSearchCustomerName] = useState("");
  const [searchCustomerCode, setSearchCustomerCode] = useState("");
  const [searchContractName, setSearchContractName] = useState("");
  const [searchContractCode, setSearchContractCode] = useState("");
  const [searchProjectName, setSearchProjectName] = useState("");
  const [searchProjectCode, setSearchProjectCode] = useState("");
  const [applyReason, setApplyReason] = useState("");

  // 复制录收单时预填数据：自动选择合同/项目并预填申请事由
  React.useEffect(() => {
    if (open && initialApproval) {
      // 从审批单中提取关键词匹配合同
      const matchedContract = mockContracts.find(c =>
        c.contractName.includes(initialApproval.name) ||
        initialApproval.name.includes(c.contractName) ||
        c.contractName.includes(initialApproval.eipNumber)
      ) || mockContracts[0];
      setSelectedContract(matchedContract);
      setApplyReason(`基于录收审批单【${initialApproval.name}】（EIP文号：${initialApproval.eipNumber}）发起录收申请`);
    }
  }, [open, initialApproval]);
  const [showContractInfo, setShowContractInfo] = useState(true);
  const [showIncomePlan, setShowIncomePlan] = useState(true);
  const [showSixPositioning, setShowSixPositioning] = useState(true);

  const handleSelectContract = (contract: ContractProject) => {
    setSelectedContract(contract);
    setSelectDialogOpen(false);
  };

  const togglePeriodicPlan = (id: string) => {
    setSelectedPeriodicPlans(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const toggleNonPeriodicPlan = (id: string) => {
    setSelectedNonPeriodicPlans(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const calculateMismatch = () => {
    if (!selectedContract) return 0;
    const plan = parseFloat(selectedContract.planRevenue.replace(/,/g, '')) || 0;
    const actual = parseFloat(selectedContract.actualRevenue.replace(/,/g, '')) || 0;
    if (plan === 0) return 0;
    return Math.abs((plan - actual) / plan * 100).toFixed(2);
  };

  const isMismatchOver10 = () => {
    const mismatch = parseFloat(calculateMismatch());
    return mismatch > 10;
  };

  const filteredContracts = mockContracts.filter(c => {
    if (searchCustomerName && !c.customerName.includes(searchCustomerName)) return false;
    if (searchCustomerCode && !c.customerCode.includes(searchCustomerCode)) return false;
    if (searchContractName && !c.contractName.includes(searchContractName)) return false;
    if (searchContractCode && !c.contractCode.includes(searchContractCode)) return false;
    if (searchProjectName && !c.projectName.includes(searchProjectName)) return false;
    if (searchProjectCode && !c.projectCode.includes(searchProjectCode)) return false;
    return true;
  });

  const handleSubmit = () => {
    alert("录收申请已提交！");
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setSelectedContract(null);
    setSelectedPeriodicPlans(new Set());
    setSelectedNonPeriodicPlans(new Set());
    setApplyReason("");
    setSearchCustomerName("");
    setSearchCustomerCode("");
    setSearchContractName("");
    setSearchContractCode("");
    setSearchProjectName("");
    setSearchProjectCode("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl flex flex-col transition-all duration-300"
        style={{
          width: isFullscreen ? "98vw" : "95vw",
          height: isFullscreen ? "98vh" : "90vh",
          maxWidth: "98vw",
          maxHeight: "98vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0 bg-gradient-to-r from-blue-50 to-white">
          <span className="text-base font-medium text-gray-900">申请录收</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 hover:bg-blue-100 rounded transition-colors"
            >
              {isFullscreen ? (
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" /></svg>
              ) : (
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
              )}
            </button>
            <button onClick={handleClose} className="p-1.5 hover:bg-red-100 rounded transition-colors">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* 合同/项目选择 */}
          <div className="p-6 border-b">
            <div
              className="flex justify-between items-center mb-3 cursor-pointer"
              onClick={() => setShowContractInfo(!showContractInfo)}
            >
              <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-500 rounded"></span>
                <span className="text-red-500">*</span>合同/项目信息
              </div>
              <button className="p-1 hover:bg-gray-100 rounded">
                <ChevronUp className={`w-4 h-4 text-gray-500 transition-transform ${showContractInfo ? '' : 'rotate-180'}`} />
              </button>
            </div>

            {showContractInfo && (
              <>
                <div className="mb-4 flex justify-end">
                  <Button variant="default" size="sm" onClick={() => setSelectDialogOpen(true)}>
                    选择合同/项目
                  </Button>
                </div>

                {selectedContract && (
                  <div className="bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100 p-4 space-y-3">
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <div className="text-xs text-gray-500">客户名称</div>
                        <div className="text-sm font-medium text-gray-900">{selectedContract.customerName}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">客户编码</div>
                        <div className="text-sm text-gray-700">{selectedContract.customerCode}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">合同名称</div>
                        <div className="text-sm font-medium text-gray-900">{selectedContract.contractName}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">合同编码</div>
                        <div className="text-sm text-gray-700">{selectedContract.contractCode}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">合同金额</div>
                        <div className="text-sm font-bold text-blue-600">{selectedContract.contractAmount}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">项目名称</div>
                        <div className="text-sm font-medium text-gray-900">{selectedContract.projectName}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">项目编码</div>
                        <div className="text-sm text-gray-700">{selectedContract.projectCode}</div>
                      </div>
                    </div>

                    <div className="border-t border-blue-100 pt-3 mt-3 grid grid-cols-4 gap-4">
                      <div>
                        <div className="text-xs text-gray-500">合同确认录收金额</div>
                        <div className="text-sm font-medium text-green-600">{selectedContract.contractConfirmedRevenue}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">合同未确认录收金额</div>
                        <div className="text-sm font-medium text-orange-600">{selectedContract.contractUnconfirmedRevenue}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">合同累计确认收款金额</div>
                        <div className="text-sm text-gray-700">{selectedContract.contractTotalReceived}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">合同剩余未收款金额</div>
                        <div className="text-sm font-medium text-red-600">{selectedContract.contractRemainingReceived}</div>
                      </div>
                    </div>

                    {/* 收支不匹配提醒 - 更醒目 */}
                    <div className={`border-2 rounded-lg p-4 mt-3 ${isMismatchOver10() ? 'bg-red-50 border-red-300 animate-pulse' : 'bg-green-50 border-green-200'}`}>
                      <div className="flex items-center gap-2">
                        {isMismatchOver10() ? (
                          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.765 1.36-.213 2.98-1.742 2.98H4.42c-1.53 0-2.507-1.62-1.742-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                        <div>
                          <div className={`text-sm font-bold ${isMismatchOver10() ? 'text-red-700' : 'text-green-700'}`}>
                            {isMismatchOver10() ? '⚠️ 收支不匹配超10%' : '✓ 收支匹配正常'}
                          </div>
                          <div className={`text-lg font-bold ${isMismatchOver10() ? 'text-red-600' : 'text-green-600'}`}>
                            {calculateMismatch()}%
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 mt-3">
                      <div className="text-xs text-gray-600 leading-relaxed">
                        <span className="text-gray-500">当前项目截止当月：</span>
                        计划列收<span className="font-medium text-blue-600">{selectedContract.planRevenue}</span>元，
                        已列收<span className="font-medium text-green-600">{selectedContract.actualRevenue}</span>元，
                        计划列账<span className="font-medium text-blue-600">{selectedContract.planAccount}</span>元，
                        已列支<span className="font-medium text-green-600">{selectedContract.actualAccount}</span>元
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* 收入计划选择 */}
          {selectedContract && (
            <div className="p-6 border-b">
              <div
                className="flex justify-between items-center mb-3 cursor-pointer"
                onClick={() => setShowIncomePlan(!showIncomePlan)}
              >
                <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
                  <span className="w-1 h-4 bg-blue-500 rounded"></span>
                  <span className="text-red-500">*</span>选择收入计划
                </div>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <ChevronUp className={`w-4 h-4 text-gray-500 transition-transform ${showIncomePlan ? '' : 'rotate-180'}`} />
                </button>
              </div>

              {showIncomePlan && (
                <>
                  <div className="flex gap-4 border-b border-gray-200 mb-4">
                    <button
                      onClick={() => setActivePlanTab("periodic")}
                      className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                        activePlanTab === "periodic"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      周期性收入计划
                    </button>
                    <button
                      onClick={() => setActivePlanTab("nonPeriodic")}
                      className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                        activePlanTab === "nonPeriodic"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      非周期性收入计划
                    </button>
                  </div>

                  {activePlanTab === "periodic" && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-blue-50 border-b border-blue-100">
                          <tr>
                            <th className="px-2 py-2 text-left w-8"></th>
                            <th className="px-2 py-2 text-left w-8">序号</th>
                            <th className="px-2 py-2 text-left w-28">产品收入项</th>
                            <th className="px-2 py-2 text-left w-20">业务类型</th>
                            <th className="px-2 py-2 text-left w-20">发票种类</th>
                            <th className="px-2 py-2 text-left w-12">税率</th>
                            <th className="px-2 py-2 text-right w-28">计划确认总金额(含税)</th>
                            <th className="px-2 py-2 text-right w-28">计划确认总金额(不含税)</th>
                            <th className="px-2 py-2 text-left w-20">预计确认日期</th>
                            <th className="px-2 py-2 text-left w-20">收入触发系统</th>
                            <th className="px-2 py-2 text-left w-16">计划状态</th>
                            <th className="px-2 py-2 text-left w-32">摘要</th>
                            <th className="px-2 py-2 text-left w-16">类型</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {mockPeriodicPlans.map(plan => (
                            <tr key={plan.id} className="hover:bg-blue-50">
                              <td className="px-2 py-2">
                                <Checkbox
                                  checked={selectedPeriodicPlans.has(plan.id)}
                                  onCheckedChange={() => togglePeriodicPlan(plan.id)}
                                />
                              </td>
                              <td className="px-2 py-2">{plan.index}</td>
                              <td className="px-2 py-2 max-w-28 truncate">{plan.productRevenue}</td>
                              <td className="px-2 py-2">{plan.businessType}</td>
                              <td className="px-2 py-2">{plan.invoiceType}</td>
                              <td className="px-2 py-2">{plan.taxRate}</td>
                              <td className="px-2 py-2 text-right font-medium">{plan.planConfirmTotalWithTax}</td>
                              <td className="px-2 py-2 text-right">{plan.planConfirmTotalWithoutTax}</td>
                              <td className="px-2 py-2">{plan.estimatedConfirmDate}</td>
                              <td className="px-2 py-2">{plan.revenueTriggerSystem}</td>
                              <td className="px-2 py-2">
                                <span className={`px-1.5 py-0.5 rounded text-xs ${
                                  plan.planStatus === "已确认" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                }`}>
                                  {plan.planStatus}
                                </span>
                              </td>
                              <td className="px-2 py-2 max-w-32 truncate">{plan.summary}</td>
                              <td className="px-2 py-2">{plan.type}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activePlanTab === "nonPeriodic" && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-blue-50 border-b border-blue-100">
                          <tr>
                            <th className="px-2 py-2 text-left w-8"></th>
                            <th className="px-2 py-2 text-left w-8">序号</th>
                            <th className="px-2 py-2 text-left w-28">产品收入项</th>
                            <th className="px-2 py-2 text-left w-20">业务类型</th>
                            <th className="px-2 py-2 text-left w-20">发票种类</th>
                            <th className="px-2 py-2 text-left w-12">税率</th>
                            <th className="px-2 py-2 text-right w-16">单价</th>
                            <th className="px-2 py-2 text-right w-12">数量</th>
                            <th className="px-2 py-2 text-right w-20">确认金额(含税)</th>
                            <th className="px-2 py-2 text-right w-20">确认金额(不含税)</th>
                            <th className="px-2 py-2 text-center w-12">频率(月)</th>
                            <th className="px-2 py-2 text-right w-24">确认总金额(含税)</th>
                            <th className="px-2 py-2 text-right w-24">确认总金额(不含税)</th>
                            <th className="px-2 py-2 text-left w-20">起始日期</th>
                            <th className="px-2 py-2 text-left w-20">终止日期</th>
                            <th className="px-2 py-2 text-left w-20">收入触发系统</th>
                            <th className="px-2 py-2 text-left w-16">计划状态</th>
                            <th className="px-2 py-2 text-left w-32">摘要</th>
                            <th className="px-2 py-2 text-left w-16">类型</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {mockNonPeriodicPlans.map(plan => (
                            <tr key={plan.id} className="hover:bg-blue-50">
                              <td className="px-2 py-2">
                                <Checkbox
                                  checked={selectedNonPeriodicPlans.has(plan.id)}
                                  onCheckedChange={() => toggleNonPeriodicPlan(plan.id)}
                                />
                              </td>
                              <td className="px-2 py-2">{plan.index}</td>
                              <td className="px-2 py-2 max-w-28 truncate">{plan.productRevenue}</td>
                              <td className="px-2 py-2">{plan.businessType}</td>
                              <td className="px-2 py-2">{plan.invoiceType}</td>
                              <td className="px-2 py-2">{plan.taxRate}</td>
                              <td className="px-2 py-2 text-right">{plan.unitPrice}</td>
                              <td className="px-2 py-2 text-right">{plan.quantity}</td>
                              <td className="px-2 py-2 text-right font-medium">{plan.confirmAmountWithTax}</td>
                              <td className="px-2 py-2 text-right">{plan.confirmAmountWithoutTax}</td>
                              <td className="px-2 py-2 text-center">{plan.frequency}</td>
                              <td className="px-2 py-2 text-right">{plan.confirmTotalWithTax}</td>
                              <td className="px-2 py-2 text-right">{plan.confirmTotalWithoutTax}</td>
                              <td className="px-2 py-2">{plan.startDate}</td>
                              <td className="px-2 py-2">{plan.endDate}</td>
                              <td className="px-2 py-2">{plan.revenueTriggerSystem}</td>
                              <td className="px-2 py-2">
                                <span className={`px-1.5 py-0.5 rounded text-xs ${
                                  plan.planStatus === "已确认" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                }`}>
                                  {plan.planStatus}
                                </span>
                              </td>
                              <td className="px-2 py-2 max-w-32 truncate">{plan.summary}</td>
                              <td className="px-2 py-2">{plan.type}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* 申请事由和附件 */}
          {selectedContract && (
            <div className="p-6">
              <div
                className="flex justify-between items-center mb-3 cursor-pointer"
                onClick={() => setShowSixPositioning(!showSixPositioning)}
              >
                <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
                  <span className="w-1 h-4 bg-blue-500 rounded"></span>
                  申请事由和附件
                </div>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <ChevronUp className={`w-4 h-4 text-gray-500 transition-transform ${showSixPositioning ? '' : 'rotate-180'}`} />
                </button>
              </div>

              {showSixPositioning && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      申请事由<span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      value={applyReason}
                      onChange={e => setApplyReason(e.target.value)}
                      placeholder="请输入申请事由..."
                      className="w-full h-24 resize-none"
                    />
                  </div>

                  {/* 六到位附件上传情况 - 响应式网格，一行3个，点亮状态 */}
                  <div className="bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100 p-4">
                    <div className="text-sm font-medium text-gray-800 mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-blue-500" />
                        六到位附件情况
                      </div>
                      <Button variant="default" size="sm" className="gap-1" onClick={() => setSixPositionDialogOpen(true)}>
                        <Upload className="w-3 h-3" />
                        录入
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {mockSixPositionData.map((item) => (
                        <div
                          key={item.id}
                          className={`rounded-lg border p-3 ${
                            item.attachments.length > 0
                              ? "bg-green-50 border-green-200"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${item.attachments.length > 0 ? "bg-green-500" : "bg-gray-300"}`}></span>
                              <span className={`text-sm font-medium ${item.attachments.length > 0 ? "text-green-700" : "text-gray-500"}`}>
                                六到位-{item.name}
                              </span>
                            </div>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${item.attachments.length > 0 ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-400"}`}>
                              {item.attachments.length > 0 ? "已录入" : "未录入"}
                            </span>
                          </div>
                          {item.attachments.length > 0 && (
                            <div className="space-y-1">
                              {item.attachments.map((att) => (
                                <div key={att.id} className="flex items-center gap-2 text-xs text-gray-600">
                                  <FileText className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                  <span className="truncate flex-1">{att.name}</span>
                                  <span className="text-gray-400 flex-shrink-0">{att.size}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 形象进度表 */}
                  <div>
                    <div className="text-sm font-medium text-gray-800 mb-2">形象进度表</div>
                    <div className="border-2 border-dashed border-blue-200 rounded-lg p-8 text-center bg-gradient-to-r from-blue-50 to-white hover:border-blue-400 transition-colors cursor-pointer">
                      <div className="text-sm text-gray-500 mb-2">拖拽文件到此处，或点击上传</div>
                      <Button variant="outline" size="sm">
                        上传文件
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* 六到位管理弹窗（使用现有六到位组件） */}
              <SixPositioningDetail
                isOpen={sixPositionDialogOpen}
                onClose={() => setSixPositionDialogOpen(false)}
                opportunityName={selectedContract?.contractName}
                opportunityCode={selectedContract?.contractCode}
              />
            </div>
          )}
        </div>

        <div className="flex-shrink-0 px-6 py-4 border-t bg-gradient-to-r from-gray-50 to-white flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={handleClose}>
            取消
          </Button>
          <Button
            variant="default"
            size="sm"
            disabled={!selectedContract || (selectedPeriodicPlans.size === 0 && selectedNonPeriodicPlans.size === 0)}
            onClick={handleSubmit}
          >
            提交申请
          </Button>
        </div>
      </div>

      {/* 选择合同/项目弹窗 */}
      {selectDialogOpen && (
        <div
          className="fixed inset-0 z-[101] flex items-center justify-center bg-black/50"
          onClick={() => setSelectDialogOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl flex flex-col"
            style={{ width: "90vw", height: "80vh", maxWidth: "90vw", maxHeight: "80vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <span className="text-base font-medium text-gray-900">选择合同/项目</span>
              <button onClick={() => setSelectDialogOpen(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="px-6 py-4 border-b bg-gray-50">
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500">客户名称</label>
                  <Input placeholder="请输入" value={searchCustomerName} onChange={e => setSearchCustomerName(e.target.value)} className="w-40" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500">客户编码</label>
                  <Input placeholder="请输入" value={searchCustomerCode} onChange={e => setSearchCustomerCode(e.target.value)} className="w-32" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500">合同名称</label>
                  <Input placeholder="请输入" value={searchContractName} onChange={e => setSearchContractName(e.target.value)} className="w-40" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500">合同编码</label>
                  <Input placeholder="请输入" value={searchContractCode} onChange={e => setSearchContractCode(e.target.value)} className="w-32" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500">项目名称</label>
                  <Input placeholder="请输入" value={searchProjectName} onChange={e => setSearchProjectName(e.target.value)} className="w-40" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500">项目编码</label>
                  <Input placeholder="请输入" value={searchProjectCode} onChange={e => setSearchProjectCode(e.target.value)} className="w-32" />
                </div>
                <Button variant="default" size="sm" className="gap-1">
                  <Search className="w-4 h-4" />
                  查询
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <RefreshCw className="w-4 h-4" />
                  重置
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-10"></th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">客户名称</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-28">客户编码</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">合同名称</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-28">合同编码</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">项目名称</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-28">项目编码</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredContracts.map(contract => (
                    <tr
                      key={contract.id}
                      className={`hover:bg-blue-50 cursor-pointer transition-colors ${selectedContract?.id === contract.id ? 'bg-blue-50' : ''}`}
                      onClick={() => handleSelectContract(contract)}
                    >
                      <td className="px-3 py-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedContract?.id === contract.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                        }`}>
                          {selectedContract?.id === contract.id && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2 max-w-40 truncate" title={contract.customerName}>{contract.customerName}</td>
                      <td className="px-3 py-2">{contract.customerCode}</td>
                      <td className="px-3 py-2 max-w-40 truncate" title={contract.contractName}>{contract.contractName}</td>
                      <td className="px-3 py-2">{contract.contractCode}</td>
                      <td className="px-3 py-2 max-w-40 truncate" title={contract.projectName}>{contract.projectName}</td>
                      <td className="px-3 py-2">{contract.projectCode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex-shrink-0 px-6 py-4 border-t bg-gray-50 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectDialogOpen(false)}>
                取消
              </Button>
              <Button variant="default" size="sm" onClick={() => setSelectDialogOpen(false)} disabled={!selectedContract}>
                确定
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
