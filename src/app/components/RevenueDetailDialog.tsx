import React, { useState } from "react";
import { X, ChevronUp, Paperclip, FileText, Edit, RotateCcw, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";

interface RevenueDetailDialogProps {
  open: boolean;
  onClose: () => void;
  record?: (RevenueRecord & { selectedApproval?: ApprovalRecord }) | null;
}

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
  totalAmount: { total: string; service: string; standard: string; basic: string; equipment: string; agency: string };
  confirmedAmount: { total: string; service: string; standard: string; basic: string; equipment: string; agency: string };
  unconfirmedAmount: { total: string; service: string; standard: string; basic: string; equipment: string; agency: string };
  approvalList: ApprovalRecord[];
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

interface SixPositionItem {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  attachments: { id: string; name: string; size: string; uploadTime: string }[];
}

const mockSixPositionData: SixPositionItem[] = [
  { id: "customer", name: "客情掌握", description: "客户档案、拜访记录、商机提前录入、近三年信息化项目", isActive: true, attachments: [{ id: "c1", name: "客户档案清单.xlsx", size: "256KB", uploadTime: "2026-04-15 10:30" }, { id: "c2", name: "拜访记录汇总.pdf", size: "1.2MB", uploadTime: "2026-04-16 14:20" }] },
  { id: "plan", name: "方案总控", description: "组建团队、方案设计与审核、方案结构与中台把关", isActive: true, attachments: [{ id: "p1", name: "团队组建方案.docx", size: "520KB", uploadTime: "2026-04-10 09:00" }, { id: "p2", name: "方案设计模板.pdf", size: "890KB", uploadTime: "2026-04-12 16:45" }] },
  { id: "bidding", name: "谈判/应标自主", description: "参标记录、应标结果记录、商务谈判、前向合同信息", isActive: false, attachments: [{ id: "b1", name: "参标记录表.xlsx", size: "128KB", uploadTime: "2026-04-20 11:00" }] },
  { id: "procurement", name: "采购自主", description: "标前决策、后向资料、业务解构、业务风险防控", isActive: true, attachments: [{ id: "pr1", name: "采购决策审批单.pdf", size: "345KB", uploadTime: "2026-04-18 15:30" }, { id: "pr2", name: "供应商资质证明.zip", size: "2.1MB", uploadTime: "2026-04-19 09:15" }] },
  { id: "project", name: "项目强管控", description: "项目实施总体设计、变更记录、验收报告、项目实施文件、审计清单", isActive: true, attachments: [{ id: "pj1", name: "项目总体设计方案.docx", size: "1.5MB", uploadTime: "2026-04-05 10:00" }, { id: "pj2", name: "变更记录表.xlsx", size: "180KB", uploadTime: "2026-04-08 14:30" }, { id: "pj3", name: "验收报告.pdf", size: "560KB", uploadTime: "2026-04-25 16:00" }] },
  { id: "maintenance", name: "运维自主", description: "数字平台、第一服务界面、售后其他资料", isActive: false, attachments: [{ id: "m1", name: "运维服务方案.docx", size: "420KB", uploadTime: "2026-04-22 11:30" }] }
];

// 已选收入计划mock数据
const mockSelectedIncomePlans = [
  { id: "p1", index: 1, productRevenue: "ICT服务费", businessType: "产数服务", invoiceType: "增值税专用发票", taxRate: "6%", planConfirmTotalWithTax: "10,000.00", planConfirmTotalWithoutTax: "9,433.96", estimatedConfirmDate: "2026-05-15", revenueTriggerSystem: "BOSS系统", planStatus: "已确认", summary: "5月ICT服务费确认", type: "周期性" },
  { id: "np1", index: 2, productRevenue: "设备销售-服务器", businessType: "设备销售", invoiceType: "增值税专用发票", taxRate: "13%", unitPrice: "50,000.00", quantity: "2", confirmAmountWithTax: "113,000.00", confirmAmountWithoutTax: "100,000.00", frequency: "1", startDate: "2026-06-01", endDate: "2026-06-30", planStatus: "待确认", summary: "服务器销售确认", type: "非周期性" },
];

export function RevenueDetailDialog({ open, onClose, record }: RevenueDetailDialogProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showContractInfo, setShowContractInfo] = useState(true);
  const [showIncomePlan, setShowIncomePlan] = useState(true);
  const [showSixPositioning, setShowSixPositioning] = useState(true);
  const [showApprovalList, setShowApprovalList] = useState(true);

  const approval = record?.selectedApproval;
  const row = record;

  const planRevenue = "50,000.00";
  const actualRevenue = "42,000.00"; // 模拟不匹配数据，默认高亮
  const planAccount = "52,000.00";
  const actualAccount = "50,000.00";
  const contractAmount = row?.totalAmount.total || "500,000.00";
  const contractConfirmedRevenue = row?.confirmedAmount.total || "450,000.00";
  const contractUnconfirmedRevenue = row?.unconfirmedAmount.total || "50,000.00";

  const calculateMismatch = () => {
    const plan = parseFloat(planRevenue.replace(/,/g, '')) || 0;
    const actual = parseFloat(actualRevenue.replace(/,/g, '')) || 0;
    if (plan === 0) return 0;
    return Math.abs((plan - actual) / plan * 100).toFixed(2);
  };

  const mismatch = parseFloat(calculateMismatch());
  const hasMismatch = mismatch > 10;

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
          <div>
            <span className="text-base font-medium text-gray-900">录收详情</span>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-xs text-gray-500">申请时间：{approval?.syncEipTime || row?.lastRevenueTime || "-"}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                approval?.eipStatus === "审核通过" ? "bg-green-100 text-green-700" :
                approval?.eipStatus === "审核中" ? "bg-yellow-100 text-yellow-700" :
                "bg-gray-100 text-gray-700"
              }`}>
                EIP状态：{approval?.eipStatus || "审核通过"}
              </span>
            </div>
          </div>
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
            <button onClick={onClose} className="p-1.5 hover:bg-red-100 rounded transition-colors">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* 合同/项目信息 */}
          <div className="px-6 pb-4 border-b">
            <div
              className="flex justify-between items-center mb-3 cursor-pointer"
              onClick={() => setShowContractInfo(!showContractInfo)}
            >
              <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-500 rounded"></span>
                合同/项目信息
              </div>
              <button className="p-1 hover:bg-gray-100 rounded">
                <ChevronUp className={`w-4 h-4 text-gray-500 transition-transform ${showContractInfo ? '' : 'rotate-180'}`} />
              </button>
            </div>

            {showContractInfo && (
              <div className="bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100 p-4 space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">商机名称</div>
                    <div className="text-sm font-medium text-gray-900 truncate" title={row?.oppName}>{row?.oppName || "-"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">商机编码</div>
                    <div className="text-sm text-gray-700">{row?.oppCode || "-"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">合同名称</div>
                    <div className="text-sm font-medium text-gray-900 truncate" title={row?.contractName}>{row?.contractName || "-"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">合同编码</div>
                    <div className="text-sm text-gray-700">{row?.contractCode || "-"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">项目名称</div>
                    <div className="text-sm font-medium text-gray-900 truncate" title={row?.projectName}>{row?.projectName || "-"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">项目编码</div>
                    <div className="text-sm text-gray-700">{row?.projectCode || "-"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">合同金额</div>
                    <div className="text-sm font-bold text-blue-600">{contractAmount}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">合同确认录收金额</div>
                    <div className="text-sm font-medium text-green-600">{contractConfirmedRevenue}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">合同未确认录收金额</div>
                    <div className="text-sm font-medium text-orange-600">{contractUnconfirmedRevenue}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">合同累计确认收款金额</div>
                    <div className="text-sm text-gray-700">480,000.00</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">合同剩余未收款金额</div>
                    <div className="text-sm font-medium text-red-600">20,000.00</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">是否录收完成</div>
                    <div className={`text-sm font-medium ${row?.isCompleted ? "text-green-600" : "text-orange-600"}`}>
                      {row?.isCompleted ? "录收完成" : "未录收"}
                    </div>
                  </div>
                </div>

                {/* 收支不匹配提醒 - 默认醒目展示 */}
                <div className={`border-2 rounded-lg p-4 ${hasMismatch ? 'bg-red-50 border-red-300 animate-pulse' : 'bg-green-50 border-green-200'}`}>
                  <div className="flex items-center gap-2">
                    {hasMismatch ? (
                      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className={`text-sm font-bold ${hasMismatch ? 'text-red-700' : 'text-green-700'}`}>
                        {hasMismatch ? '⚠️ 收支不匹配超10%' : '✓ 收支匹配正常'}
                      </div>
                      <div className={`text-xs ${hasMismatch ? 'text-red-600' : 'text-green-600'}`}>
                        当前项目截止当月：计划列收 {planRevenue} 元，已列收 {actualRevenue} 元，计划列账 {planAccount} 元，已列支 {actualAccount} 元
                      </div>
                    </div>
                    <div className={`text-2xl font-bold ${hasMismatch ? 'text-red-600' : 'text-green-600'}`}>
                      {calculateMismatch()}%
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 已选收入计划 */}
          <div className="px-6 py-4 border-b">
            <div
              className="flex justify-between items-center mb-3 cursor-pointer"
              onClick={() => setShowIncomePlan(!showIncomePlan)}
            >
              <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-500 rounded"></span>
                已选收入计划
                <span className="ml-2 px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700">{mockSelectedIncomePlans.length}条</span>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded">
                <ChevronUp className={`w-4 h-4 text-gray-500 transition-transform ${showIncomePlan ? '' : 'rotate-180'}`} />
              </button>
            </div>

            {showIncomePlan && (
              <div className="bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100 p-4">
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
                        <th className="px-2 py-2 text-right w-24">计划确认总金额(含税)</th>
                        <th className="px-2 py-2 text-right w-24">计划确认总金额(不含税)</th>
                        <th className="px-2 py-2 text-left w-20">预计确认日期</th>
                        <th className="px-2 py-2 text-left w-20">收入触发系统</th>
                        <th className="px-2 py-2 text-left w-16">计划状态</th>
                        <th className="px-2 py-2 text-left w-32">摘要</th>
                        <th className="px-2 py-2 text-left w-16">类型</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {mockSelectedIncomePlans.map((plan) => (
                        <tr key={plan.id} className="hover:bg-blue-50">
                          <td className="px-2 py-2">
                            <Checkbox checked={true} disabled />
                          </td>
                          <td className="px-2 py-2">{plan.index}</td>
                          <td className="px-2 py-2 max-w-28 truncate">{plan.productRevenue}</td>
                          <td className="px-2 py-2">{plan.businessType}</td>
                          <td className="px-2 py-2">{plan.invoiceType}</td>
                          <td className="px-2 py-2">{plan.taxRate}</td>
                          <td className="px-2 py-2 text-right font-medium">{plan.planConfirmTotalWithTax || plan.confirmAmountWithTax}</td>
                          <td className="px-2 py-2 text-right">{plan.planConfirmTotalWithoutTax || plan.confirmAmountWithoutTax}</td>
                          <td className="px-2 py-2">{plan.estimatedConfirmDate || `${plan.startDate}~${plan.endDate}`}</td>
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
                {/* 合计行 */}
                <div className="mt-3 pt-3 border-t border-blue-100 flex justify-end">
                  <div className="text-sm">
                    <span className="text-gray-500">已选收入计划合计：</span>
                    <span className="font-bold text-blue-600 ml-2">
                      含税 {mockSelectedIncomePlans.reduce((sum, p) => sum + parseFloat((p.planConfirmTotalWithTax || p.confirmAmountWithTax).replace(/,/g, '')), 0).toLocaleString()} 元
                    </span>
                    <span className="text-gray-400 mx-2">|</span>
                    <span className="font-medium text-gray-600">
                      不含税 {mockSelectedIncomePlans.reduce((sum, p) => sum + parseFloat((p.planConfirmTotalWithoutTax || p.confirmAmountWithoutTax).replace(/,/g, '')), 0).toLocaleString()} 元
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 录收审批单信息 */}
          {approval && (
            <div className="px-6 py-4 border-b">
              <div
                className="flex justify-between items-center mb-3 cursor-pointer"
                onClick={() => setShowApprovalList(!showApprovalList)}
              >
                <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
                  <span className="w-1 h-4 bg-blue-500 rounded"></span>
                  录收审批单信息
                </div>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <ChevronUp className={`w-4 h-4 text-gray-500 transition-transform ${showApprovalList ? '' : 'rotate-180'}`} />
                </button>
              </div>

              {showApprovalList && (
                <div className="bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100 p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-gray-500">录收名称</div>
                      <div className="text-sm font-medium text-gray-900">{approval.name}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">录收金额</div>
                      <div className="text-sm font-bold text-green-600">{approval.amount}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">EIP文号</div>
                      <div className="text-sm text-gray-700">{approval.eipNumber}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">EIP发文id</div>
                      <div className="text-sm text-gray-700">{approval.eipDocId}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">拟稿部门</div>
                      <div className="text-sm text-gray-700">{approval.draftDept}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">同步EIP时间</div>
                      <div className="text-sm text-gray-700">{approval.syncEipTime}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">EIP审核状态</div>
                      <div>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          approval.eipStatus === "审核通过" ? "bg-green-100 text-green-700" :
                          approval.eipStatus === "审核中" ? "bg-yellow-100 text-yellow-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {approval.eipStatus}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">预售理单号</div>
                      <div className="text-sm text-gray-700">{approval.presaleOrderNo}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">订单id</div>
                      <div className="text-sm text-gray-700">{approval.orderId}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">订单编码</div>
                      <div className="text-sm text-gray-700">{approval.orderCode}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">同步3.0时间</div>
                      <div className="text-sm text-gray-700">{approval.sync30Time}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 六到位附件详情 */}
          <div className="px-6 py-4">
            <div
              className="flex justify-between items-center mb-3 cursor-pointer"
              onClick={() => setShowSixPositioning(!showSixPositioning)}
            >
              <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-500 rounded"></span>
                六到位附件详情
                <span className="text-xs text-gray-400 ml-1">（一行3个，自适应宽度）</span>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded">
                <ChevronUp className={`w-4 h-4 text-gray-500 transition-transform ${showSixPositioning ? '' : 'rotate-180'}`} />
              </button>
            </div>

            {showSixPositioning && (
              <div className="space-y-3">
                {/* 六个到位 - 响应式网格：默认3列，小屏幕2列，更小1列 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {mockSixPositionData.map((item) => (
                    <div
                      key={item.id}
                      className={`rounded-lg border p-3 ${
                        item.isActive ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.isActive ? "bg-green-500" : "bg-gray-300"}`}></span>
                          <span className={`text-sm font-medium ${item.isActive ? "text-green-700" : "text-gray-500"}`}>
                            六到位-{item.name}
                          </span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${
                            item.isActive ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-400"
                          }`}>
                            {item.isActive ? "已点亮" : "未点亮"}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">{item.attachments.length}个附件</span>
                      </div>
                      {item.attachments.length > 0 && (
                        <div className="space-y-1">
                          {item.attachments.map((att) => (
                            <div key={att.id} className="flex items-center gap-2 text-xs text-gray-600 bg-white rounded p-1.5 border border-gray-100">
                              <FileText className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                              <span className="truncate flex-1" title={att.name}>{att.name}</span>
                              <span className="text-gray-400 flex-shrink-0">{att.size}</span>
                              <span className="text-gray-400 flex-shrink-0">{att.uploadTime}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* 形象进度表 */}
                <div>
                  <div className="text-sm font-medium text-gray-800 mb-2">形象进度表</div>
                  <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span className="truncate">项目形象进度表_202605.xlsx</span>
                      <span className="text-gray-400 flex-shrink-0 ml-2">256KB · 2026-05-10 09:15</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 px-6 py-4 border-t bg-gradient-to-r from-gray-50 to-white flex justify-end gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <RotateCcw className="w-4 h-4" />
            撤回
          </Button>
          <Button variant="outline" className="gap-1">
            <Edit className="w-4 h-4" />
            编辑
          </Button>
          <Button onClick={onClose}>
            关闭
          </Button>
        </div>
      </div>
    </div>
  );
}
