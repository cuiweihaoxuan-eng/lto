import React, { useState } from "react";
import { X, Plus, Trash2, Search, Upload, FileText, Image, Check, AlertTriangle, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "./ui/select";
import { Badge } from "./ui/badge";

// ============ 类型定义 ============
type ProjectType = "项目型" | "小微标品" | "三联单";
type SettlementMethod = "451定额" | "350人天";
type SmallProductSubType = "视联网" | "机房整治";

interface PersonItem {
  id: string;
  name: string;
  code: string;
  amount?: string;
  personDays?: number;
}

interface ProjectOption {
  id: string;
  customerName: string;
  customerCode: string;
  oppName: string;
  oppCode: string;
  contractName: string;
  contractCode: string;
  contractAmount: string;
  projectName: string;
  projectCode: string;
  projectType: string;
  selfDeliveryForwardAmount: string;
  selfDeliveryCostAmount: string;
  profit: string;
  forwardContractAmount: string;
  maxApplyAmount: string;
  appliedAmount: string;
  appliedProfit: string;
}

interface OrderOption {
  id: string;
  // 工单编号
  workOrderNo: string;
  // 经营单元
  businessUnit: string;
  // 区域
  area: string;
  // 主定单编码
  mainOrderCode: string;
  // 备件库标签
  sparePartsLabel: string;
  // 标准小微标签
  standardLabel: string;
  // 业务类型
  businessType: string;
  // 收单人/岗
  receiver: string;
  // 环节名称
  stageName: string;
  // 订单编码
  orderCode: string;
  // 结束日期
  endDate: string;
  // 工单状态
  workOrderStatus: string;
  // 客户名称
  customerName: string;
  // id
  dataId: string;
  // 创建时间
  createTime: string;
  // 历时
  duration: string;
}

interface TripleOption {
  id: string;
  // 统计日期
  statisticsDate: string;
  // 资产唯一编码
  assetCode: string;
  // 订单编码
  orderCode: string;
  // 受理的业务号码
  serviceNumber: string;
  // 优惠编码
  discountCode: string;
  // 优惠名称
  discountName: string;
  // 受理金额
  acceptAmount: string;
  // 受理归属分局
  acceptBranch: string;
  // 受理归属支局
  acceptSubBranch: string;
  // ICT协议编号
  ictAgreementNo: string;
  // 受理时间
  acceptTime: string;
  // 竣工时间
  completionTime: string;
  // VIP卡号
  vipCardNo: string;
  // 受理人工号
  acceptEmpNo: string;
  // 受理人名称
  acceptEmpName: string;
  // 营销人工号
  marketingEmpNo: string;
  // 营销人姓名
  marketingEmpName: string;
  // 营销人员归属分局
  marketingBranch: string;
  // 营销人员归属支局
  marketingSubBranch: string;
  // 订单来源是否翼装大师
  isYizhuang: string;
  // 优惠开始时间
  discountStartTime: string;
  // 优惠结束时间
  discountEndTime: string;
  // 订单状态
  orderStatus: string;
  // vip客户名称
  vipCustomerName: string;
  // 是否三联单（剔除MSS）
  isTriple: string;
  // 统计合同额
  contractAmount: string;
  // 月份
  month: string;
  // 日期
  date: string;
  // 季度
  quarter: string;
  // 经营单元
  businessUnit: string;
}

interface AttachmentItem {
  id: string;
  name: string;
  required: boolean;
  source: "auto" | "manual";
  type: string;
  status: "uploaded" | "pending";
  files: { name: string; url?: string }[]; // 支持多文件
}

// 结算section（支持平铺添加多个451定额/350人天）
interface SettlementSection {
  id: string;
  method: SettlementMethod;
  totalLaborCost: string;   // 451定额：总人工费；350人天：人员金额合计
  settlementAmount: string; // 结算金额（可手动修改）
  personList: PersonItem[];
  uploadedFileName?: string; // 451定额上传的文件名
}

interface SettlementRecord {
  id: string;
  index: number;
  businessUnit: string;
  branch: string;
  type: "项目型" | "小微标品" | "三联单";
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
  status: string;
  innerList: any[];
}

interface SelfDeliveryApplyDialogProps {
  open: boolean;
  onClose: () => void;
  rowData?: SettlementRecord | null;
}

// ============ 模拟数据 ============
const mockProjectOptions: ProjectOption[] = [
  {
    id: "p1",
    customerName: "杭州某医院",
    customerCode: "KH202604001",
    oppName: "杭州某医院信息化建设项目",
    oppCode: "OPP202604001",
    contractName: "医院ICT服务合同",
    contractCode: "HT202604001",
    contractAmount: "500,000.00",
    projectName: "医院信息化建设项目",
    projectCode: "XM202604001",
    projectType: "项目型",
    selfDeliveryForwardAmount: "50,000.00",
    selfDeliveryCostAmount: "35,000.00",
    profit: "30%",
    forwardContractAmount: "15,000.00",
    maxApplyAmount: "15,000.00",
    appliedAmount: "8,000.00",
    appliedProfit: "5%"
  },
  {
    id: "p2",
    customerName: "宁波某企业",
    customerCode: "KH202604002",
    oppName: "宁波某企业云服务采购项目",
    oppCode: "OPP202604002",
    contractName: "云服务采购合同",
    contractCode: "HT202604002",
    contractAmount: "200,000.00",
    projectName: "企业云服务项目",
    projectCode: "XM202604002",
    projectType: "项目型",
    selfDeliveryForwardAmount: "20,000.00",
    selfDeliveryCostAmount: "14,000.00",
    profit: "30%",
    forwardContractAmount: "6,000.00",
    maxApplyAmount: "6,000.00",
    appliedAmount: "0.00",
    appliedProfit: "0%"
  }
];

const mockOrderOptions: OrderOption[] = [
  { id: "o1", workOrderNo: "WO202604001", businessUnit: "杭州西湖支局", area: "西湖区", mainOrderCode: "MOD202604001", sparePartsLabel: "备件A", standardLabel: "标准小微", businessType: "视联网", receiver: "张三", stageName: "竣工", orderCode: "DD202604001", endDate: "2026-04-15", workOrderStatus: "已完成", customerName: "杭州某医院", dataId: "1", createTime: "2026-03-01", duration: "15天", },
  { id: "o2", workOrderNo: "WO202604002", businessUnit: "宁波滨江支局", area: "滨江区", mainOrderCode: "MOD202604002", sparePartsLabel: "备件B", standardLabel: "标准小微", businessType: "机房整治", receiver: "李四", stageName: "施工中", orderCode: "DD202604002", endDate: "2026-04-20", workOrderStatus: "进行中", customerName: "宁波某企业", dataId: "2", createTime: "2026-03-05", duration: "20天", },
  { id: "o3", workOrderNo: "WO202604003", businessUnit: "温州鹿城支局", area: "鹿城区", mainOrderCode: "MOD202604003", sparePartsLabel: "备件C", standardLabel: "标准小微", businessType: "视联网", receiver: "王五", stageName: "竣工", orderCode: "DD202604003", endDate: "2026-04-25", workOrderStatus: "已完成", customerName: "温州某学校", dataId: "3", createTime: "2026-03-10", duration: "10天", }
];

const mockTripleOptions: TripleOption[] = [
  { id: "t1", statisticsDate: "2026-05-06", assetCode: "AST202604001", orderCode: "DD202604001", serviceNumber: "057112345678", discountCode: "DC202604001", discountName: "宽带优惠套餐A", acceptAmount: "5,000.00", acceptBranch: "西湖分局", acceptSubBranch: "西湖支局", ictAgreementNo: "ICT202604001", acceptTime: "2026-03-15 10:30", completionTime: "2026-04-20 15:00", vipCardNo: "VIP202604001", acceptEmpNo: "EMP001", acceptEmpName: "张三", marketingEmpNo: "MKT001", marketingEmpName: "李四", marketingBranch: "西湖分局", marketingSubBranch: "西湖支局", isYizhuang: "是", discountStartTime: "2026-03-15", discountEndTime: "2027-03-14", orderStatus: "竣工", vipCustomerName: "杭州某医院", isTriple: "是", contractAmount: "50,000.00", month: "2026-03", date: "2026-03-15", quarter: "2026Q1", businessUnit: "杭州西湖支局", },
  { id: "t2", statisticsDate: "2026-05-06", assetCode: "AST202604002", orderCode: "DD202604002", serviceNumber: "057212345678", discountCode: "DC202604002", discountName: "企业网关套餐B", acceptAmount: "8,000.00", acceptBranch: "滨江分局", acceptSubBranch: "滨江支局", ictAgreementNo: "ICT202604002", acceptTime: "2026-03-20 14:00", completionTime: "2026-04-25 16:30", vipCardNo: "VIP202604002", acceptEmpNo: "EMP002", acceptEmpName: "王五", marketingEmpNo: "MKT002", marketingEmpName: "赵六", marketingBranch: "滨江分局", marketingSubBranch: "滨江支局", isYizhuang: "否", discountStartTime: "2026-03-20", discountEndTime: "2027-03-19", orderStatus: "竣工", vipCustomerName: "宁波某企业", isTriple: "是", contractAmount: "80,000.00", month: "2026-03", date: "2026-03-20", quarter: "2026Q1", businessUnit: "宁波滨江支局", },
  { id: "t3", statisticsDate: "2026-05-06", assetCode: "AST202604003", orderCode: "DD202604003", serviceNumber: "057312345678", discountCode: "DC202604003", discountName: "云服务套餐C", acceptAmount: "12,000.00", acceptBranch: "鹿城分局", acceptSubBranch: "鹿城支局", ictAgreementNo: "ICT202604003", acceptTime: "2026-04-01 09:00", completionTime: "2026-05-01 11:00", vipCardNo: "VIP202604003", acceptEmpNo: "EMP003", acceptEmpName: "孙八", marketingEmpNo: "MKT003", marketingEmpName: "周九", marketingBranch: "鹿城分局", marketingSubBranch: "鹿城支局", isYizhuang: "是", discountStartTime: "2026-04-01", discountEndTime: "2027-03-31", orderStatus: "竣工", vipCustomerName: "温州某学校", isTriple: "是", contractAmount: "120,000.00", month: "2026-04", date: "2026-04-01", quarter: "2026Q2", businessUnit: "温州鹿城支局", }
];

// 默认附件配置（带mock数据）- 三种类型附件统一
const getDefaultAttachments = (projectType: ProjectType): AttachmentItem[] => {
  // 手工上传附件（所有类型共有：交付清单、设计图、实施过程照片）
  const baseManualAttachments: AttachmentItem[] = [
    { id: "a1", name: "交付清单", required: true, source: "manual", type: "交付清单", status: "uploaded", files: [{ name: "交付清单_20260514.pdf" }] },
    { id: "a2", name: "设计图", required: false, source: "manual", type: "设计图", status: "pending", files: [] },
    { id: "a3", name: "实施过程照片", required: true, source: "manual", type: "实施照片", status: "uploaded", files: [{ name: "实施照片_现场01.jpg" }, { name: "实施照片_现场02.jpg" }] }
  ];

  // 小微/三联单额外增加的附件：录收订单、验收报告、收款记录
  const extraManualAttachments: AttachmentItem[] = projectType === "项目型" ? [] : [
    { id: "m1", name: "录收订单", required: true, source: "manual", type: "录收订单", status: "uploaded", files: [{ name: "录收订单_LS202604001.pdf" }] },
    { id: "m2", name: "验收报告", required: true, source: "manual", type: "验收报告", status: "uploaded", files: [{ name: "验收报告_YS202604001.pdf" }] },
    { id: "m3", name: "收款记录", required: false, source: "manual", type: "收款记录", status: "pending", files: [] }
  ];

  // 小微标品额外的451结算表
  if (projectType === "小微标品") {
    extraManualAttachments.push({ id: "m4", name: "451结算表", required: true, source: "manual", type: "451结算表", status: "pending", files: [] });
  }

  const manualAttachments = [...baseManualAttachments, ...extraManualAttachments];

  // 小微/三联单无自动带出附件
  if (projectType !== "项目型") {
    return manualAttachments;
  }

  return [
    { id: "a4", name: "模式会纪要", required: true, source: "auto", type: "模式会纪要", status: "uploaded", files: [{ name: "模式会纪要_2026年第1期.pdf" }] },
    { id: "a5", name: "前向合同", required: true, source: "auto", type: "前向合同", status: "uploaded", files: [{ name: "ICT服务合同_HT202604001.pdf" }] },
    { id: "a6", name: "前向录收订单", required: false, source: "auto", type: "前向录收", status: "uploaded", files: [{ name: "录收审批单_LS202604001.pdf" }] },
    { id: "a7", name: "前向验收报告", required: true, source: "auto", type: "验收报告", status: "uploaded", files: [{ name: "验收报告_YS202604001.pdf" }] },
    { id: "a8", name: "收款记录", required: false, source: "auto", type: "收款记录", status: "pending", files: [] },
    ...manualAttachments
  ];
};

// ============ 项目选择弹窗 ============
interface ProjectSelectDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (project: ProjectOption) => void;
}

function ProjectSelectDialog({ open, onClose, onSelect }: ProjectSelectDialogProps) {
  const [searchFields, setSearchFields] = useState({
    customerName: "",
    customerCode: "",
    oppName: "",
    oppCode: "",
    contractName: "",
    contractCode: "",
    projectName: "",
    projectCode: ""
  });

  const filteredData = mockProjectOptions.filter(item => {
    if (searchFields.customerName && !item.customerName.includes(searchFields.customerName)) return false;
    if (searchFields.customerCode && !item.customerCode.includes(searchFields.customerCode)) return false;
    if (searchFields.oppName && !item.oppName.includes(searchFields.oppName)) return false;
    if (searchFields.oppCode && !item.oppCode.includes(searchFields.oppCode)) return false;
    if (searchFields.contractName && !item.contractName.includes(searchFields.contractName)) return false;
    if (searchFields.contractCode && !item.contractCode.includes(searchFields.contractCode)) return false;
    if (searchFields.projectName && !item.projectName.includes(searchFields.projectName)) return false;
    if (searchFields.projectCode && !item.projectCode.includes(searchFields.projectCode)) return false;
    return true;
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg shadow-xl w-[900px] max-h-[80vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium">选择项目</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">客户名称</label>
              <Input size="sm" placeholder="请输入" value={searchFields.customerName} onChange={e => setSearchFields({...searchFields, customerName: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">客户编码</label>
              <Input size="sm" placeholder="请输入" value={searchFields.customerCode} onChange={e => setSearchFields({...searchFields, customerCode: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">商机名称</label>
              <Input size="sm" placeholder="请输入" value={searchFields.oppName} onChange={e => setSearchFields({...searchFields, oppName: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">商机编码</label>
              <Input size="sm" placeholder="请输入" value={searchFields.oppCode} onChange={e => setSearchFields({...searchFields, oppCode: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">合同名称</label>
              <Input size="sm" placeholder="请输入" value={searchFields.contractName} onChange={e => setSearchFields({...searchFields, contractName: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">合同编码</label>
              <Input size="sm" placeholder="请输入" value={searchFields.contractCode} onChange={e => setSearchFields({...searchFields, contractCode: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">项目名称</label>
              <Input size="sm" placeholder="请输入" value={searchFields.projectName} onChange={e => setSearchFields({...searchFields, projectName: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">项目编码</label>
              <Input size="sm" placeholder="请输入" value={searchFields.projectCode} onChange={e => setSearchFields({...searchFields, projectCode: e.target.value})} />
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <Button size="sm" variant="outline" className="gap-1">
              <Search className="w-3 h-3" />
              查询
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">选择</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">客户名称</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">客户编码</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">商机名称</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">商机编码</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">合同名称</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">合同编码</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">项目名称</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">项目编码</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map(item => (
                <tr key={item.id} className="hover:bg-blue-50 cursor-pointer" onClick={() => { onSelect(item); onClose(); }}>
                  <td className="px-3 py-2">
                    <button className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
                      <Check className="w-3 h-3 text-transparent" />
                    </button>
                  </td>
                  <td className="px-3 py-2 max-w-24 truncate">{item.customerName}</td>
                  <td className="px-3 py-2">{item.customerCode}</td>
                  <td className="px-3 py-2 max-w-32 truncate">{item.oppName}</td>
                  <td className="px-3 py-2">{item.oppCode}</td>
                  <td className="px-3 py-2 max-w-28 truncate">{item.contractName}</td>
                  <td className="px-3 py-2">{item.contractCode}</td>
                  <td className="px-3 py-2 max-w-28 truncate">{item.projectName}</td>
                  <td className="px-3 py-2">{item.projectCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============ 订单选择弹窗（小微标品） ============
interface OrderSelectDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (order: OrderOption) => void;
}

function OrderSelectDialog({ open, onClose, onSelect }: OrderSelectDialogProps) {
  const [searchFields, setSearchFields] = useState({
    workOrderNo: "",
    orderCode: "",
    customerName: "",
    businessType: ""
  });

  const filteredData = mockOrderOptions.filter(item => {
    if (searchFields.workOrderNo && !item.workOrderNo.includes(searchFields.workOrderNo)) return false;
    if (searchFields.orderCode && !item.orderCode.includes(searchFields.orderCode)) return false;
    if (searchFields.customerName && !item.customerName.includes(searchFields.customerName)) return false;
    if (searchFields.businessType && !item.businessType.includes(searchFields.businessType)) return false;
    return true;
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg shadow-xl w-[1400px] max-h-[80vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h3 className="text-lg font-medium">选择小微标品工单</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">工单编号</label>
              <Input size="sm" placeholder="请输入" value={searchFields.workOrderNo} onChange={e => setSearchFields({...searchFields, workOrderNo: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">订单编码</label>
              <Input size="sm" placeholder="请输入" value={searchFields.orderCode} onChange={e => setSearchFields({...searchFields, orderCode: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">客户名称</label>
              <Input size="sm" placeholder="请输入" value={searchFields.customerName} onChange={e => setSearchFields({...searchFields, customerName: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">业务类型</label>
              <Input size="sm" placeholder="请输入" value={searchFields.businessType} onChange={e => setSearchFields({...searchFields, businessType: e.target.value})} />
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <Button size="sm" variant="outline" className="gap-1">
              <Search className="w-3 h-3" />
              查询
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-sm min-w-[1200px]">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-10">选择</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">工单编号</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">经营单元</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">区域</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">主定单编码</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">备件库标签</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">标准小微标签</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">业务类型</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">收单人/岗</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">环节名称</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">订单编码</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">结束日期</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">工单状态</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">客户名称</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">创建时间</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">历时</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map(item => (
                <tr key={item.id} className="hover:bg-blue-50 cursor-pointer" onClick={() => { onSelect(item); onClose(); }}>
                  <td className="px-3 py-2">
                    <button className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
                      <Check className="w-3 h-3 text-transparent" />
                    </button>
                  </td>
                  <td className="px-3 py-2">{item.workOrderNo}</td>
                  <td className="px-3 py-2">{item.businessUnit}</td>
                  <td className="px-3 py-2">{item.area}</td>
                  <td className="px-3 py-2">{item.mainOrderCode}</td>
                  <td className="px-3 py-2">{item.sparePartsLabel}</td>
                  <td className="px-3 py-2">{item.standardLabel}</td>
                  <td className="px-3 py-2">{item.businessType}</td>
                  <td className="px-3 py-2">{item.receiver}</td>
                  <td className="px-3 py-2">{item.stageName}</td>
                  <td className="px-3 py-2">{item.orderCode}</td>
                  <td className="px-3 py-2">{item.endDate}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${item.workOrderStatus === '已完成' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {item.workOrderStatus}
                    </span>
                  </td>
                  <td className="px-3 py-2">{item.customerName}</td>
                  <td className="px-3 py-2">{item.createTime}</td>
                  <td className="px-3 py-2">{item.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============ 三联单选择弹窗 ============
interface TripleSelectDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (triple: TripleOption) => void;
}

function TripleSelectDialog({ open, onClose, onSelect }: TripleSelectDialogProps) {
  const [searchFields, setSearchFields] = useState({
    orderCode: "",
    vipCustomerName: "",
    acceptBranch: "",
    businessUnit: ""
  });

  const filteredData = mockTripleOptions.filter(item => {
    if (searchFields.orderCode && !item.orderCode.includes(searchFields.orderCode)) return false;
    if (searchFields.vipCustomerName && !item.vipCustomerName.includes(searchFields.vipCustomerName)) return false;
    if (searchFields.acceptBranch && !item.acceptBranch.includes(searchFields.acceptBranch)) return false;
    if (searchFields.businessUnit && !item.businessUnit.includes(searchFields.businessUnit)) return false;
    return true;
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg shadow-xl w-[1600px] max-h-[85vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h3 className="text-lg font-medium">选择三联单</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">订单编码</label>
              <Input size="sm" placeholder="请输入" value={searchFields.orderCode} onChange={e => setSearchFields({...searchFields, orderCode: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">VIP客户名称</label>
              <Input size="sm" placeholder="请输入" value={searchFields.vipCustomerName} onChange={e => setSearchFields({...searchFields, vipCustomerName: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">受理归属分局</label>
              <Input size="sm" placeholder="请输入" value={searchFields.acceptBranch} onChange={e => setSearchFields({...searchFields, acceptBranch: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">经营单元</label>
              <Input size="sm" placeholder="请输入" value={searchFields.businessUnit} onChange={e => setSearchFields({...searchFields, businessUnit: e.target.value})} />
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <Button size="sm" variant="outline" className="gap-1">
              <Search className="w-3 h-3" />
              查询
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-sm min-w-[2200px]">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-10">选择</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">统计日期</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">资产唯一编码</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">订单编码</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">受理的业务号码</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">优惠编码</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">优惠名称</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">受理金额</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">受理归属分局</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">受理归属支局</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">ICT协议编号</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">受理时间</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">竣工时间</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">VIP卡号</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">受理人工号</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">受理人名称</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">营销人工号</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">营销人姓名</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">营销归属分局</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">营销归属支局</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">翼装大师</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">优惠开始时间</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">优惠结束时间</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">订单状态</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">VIP客户名称</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">是否三联单</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">统计合同额</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">月份</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">季度</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">经营单元</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map(item => (
                <tr key={item.id} className="hover:bg-blue-50 cursor-pointer" onClick={() => { onSelect(item); onClose(); }}>
                  <td className="px-3 py-2">
                    <button className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
                      <Check className="w-3 h-3 text-transparent" />
                    </button>
                  </td>
                  <td className="px-3 py-2">{item.statisticsDate}</td>
                  <td className="px-3 py-2">{item.assetCode}</td>
                  <td className="px-3 py-2">{item.orderCode}</td>
                  <td className="px-3 py-2">{item.serviceNumber}</td>
                  <td className="px-3 py-2">{item.discountCode}</td>
                  <td className="px-3 py-2">{item.discountName}</td>
                  <td className="px-3 py-2 text-right text-green-600 font-medium">{item.acceptAmount}</td>
                  <td className="px-3 py-2">{item.acceptBranch}</td>
                  <td className="px-3 py-2">{item.acceptSubBranch}</td>
                  <td className="px-3 py-2">{item.ictAgreementNo}</td>
                  <td className="px-3 py-2">{item.acceptTime}</td>
                  <td className="px-3 py-2">{item.completionTime}</td>
                  <td className="px-3 py-2">{item.vipCardNo}</td>
                  <td className="px-3 py-2">{item.acceptEmpNo}</td>
                  <td className="px-3 py-2">{item.acceptEmpName}</td>
                  <td className="px-3 py-2">{item.marketingEmpNo}</td>
                  <td className="px-3 py-2">{item.marketingEmpName}</td>
                  <td className="px-3 py-2">{item.marketingBranch}</td>
                  <td className="px-3 py-2">{item.marketingSubBranch}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${item.isYizhuang === '是' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {item.isYizhuang}
                    </span>
                  </td>
                  <td className="px-3 py-2">{item.discountStartTime}</td>
                  <td className="px-3 py-2">{item.discountEndTime}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${item.orderStatus === '竣工' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {item.orderStatus}
                    </span>
                  </td>
                  <td className="px-3 py-2">{item.vipCustomerName}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${item.isTriple === '是' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                      {item.isTriple}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right text-green-600 font-medium">{item.contractAmount}</td>
                  <td className="px-3 py-2">{item.month}</td>
                  <td className="px-3 py-2">{item.quarter}</td>
                  <td className="px-3 py-2">{item.businessUnit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============ 人员选择弹窗 ============
interface PersonItemData {
  id: string;
  name: string;
  phone: string;
  empNo: string;
  dept: string;
}

interface PersonSelectDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (persons: PersonItemData[]) => void;
  selectedPersons: PersonItemData[];
}

const mockDepartments = [
  { id: "d1", name: "西湖支局", children: [
    { id: "d1-1", name: "销售部" },
    { id: "d1-2", name: "技术部" }
  ]},
  { id: "d2", name: "滨江支局", children: [
    { id: "d2-1", name: "销售部" },
    { id: "d2-2", name: "技术部" }
  ]},
  { id: "d3", name: "云中台", children: [
    { id: "d3-1", name: "研发部" },
    { id: "d3-2", name: "运维部" }
  ]},
  { id: "d4", name: "财务部", children: [] },
  { id: "d5", name: "人力部", children: [] },
  { id: "d6", name: "网运部", children: [] }
];

const mockPersons: PersonItemData[] = [
  { id: "p1", name: "张三", phone: "13800138001", empNo: "EMP001", dept: "西湖支局-销售部" },
  { id: "p2", name: "李四", phone: "13800138002", empNo: "EMP002", dept: "西湖支局-技术部" },
  { id: "p3", name: "王五", phone: "13800138003", empNo: "EMP003", dept: "滨江支局-销售部" },
  { id: "p4", name: "赵六", phone: "13800138004", empNo: "EMP004", dept: "云中台-研发部" },
  { id: "p5", name: "钱七", phone: "13800138005", empNo: "EMP005", dept: "财务部" },
  { id: "p6", name: "孙八", phone: "13800138006", empNo: "EMP006", dept: "人力部" },
  { id: "p7", name: "周九", phone: "13800138007", empNo: "EMP007", dept: "网运部" },
  { id: "p8", name: "吴十", phone: "13800138008", empNo: "EMP008", dept: "西湖支局-销售部" }
];

function PersonSelectDialog({ open, onClose, onSelect, selectedPersons }: PersonSelectDialogProps) {
  const [searchFields, setSearchFields] = useState({ name: "", phone: "", dept: "", empNo: "" });
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedPersons.map(p => p.id)));

  React.useEffect(() => {
    setSelected(new Set(selectedPersons.map(p => p.id)));
  }, [selectedPersons]);

  const filteredData = mockPersons.filter(item => {
    if (searchFields.name && !item.name.includes(searchFields.name)) return false;
    if (searchFields.phone && !item.phone.includes(searchFields.phone)) return false;
    if (searchFields.dept && !item.dept.includes(searchFields.dept)) return false;
    if (searchFields.empNo && !item.empNo.includes(searchFields.empNo)) return false;
    return true;
  });

  const toggleDept = (id: string) => {
    setExpandedDepts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const togglePerson = (id: string) => {
    setSelected(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleConfirm = () => {
    const selectedList = mockPersons.filter(p => selected.has(p.id));
    onSelect(selectedList);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg shadow-xl w-[900px] max-h-[80vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium">选择人员</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* 左侧组织树 */}
          <div className="w-48 border-r border-gray-200 bg-gray-50 p-2 overflow-y-auto">
            {mockDepartments.map(dept => (
              <div key={dept.id}>
                <button
                  onClick={() => dept.children.length > 0 && toggleDept(dept.id)}
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-200 rounded flex items-center justify-between"
                >
                  <span>{dept.name}</span>
                  {dept.children.length > 0 && (
                    expandedDepts.has(dept.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {expandedDepts.has(dept.id) && dept.children.map(child => (
                  <button
                    key={child.id}
                    onClick={() => {}}
                    className="w-full text-left px-4 py-1.5 text-sm hover:bg-gray-200 rounded"
                  >
                    {child.name}
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* 右侧人员列表 */}
          <div className="flex-1 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">姓名</label>
                  <Input size="sm" placeholder="请输入" value={searchFields.name} onChange={e => setSearchFields({...searchFields, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">电话</label>
                  <Input size="sm" placeholder="请输入" value={searchFields.phone} onChange={e => setSearchFields({...searchFields, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">部门</label>
                  <Input size="sm" placeholder="请输入" value={searchFields.dept} onChange={e => setSearchFields({...searchFields, dept: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">工号</label>
                  <Input size="sm" placeholder="请输入" value={searchFields.empNo} onChange={e => setSearchFields({...searchFields, empNo: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-10">选择</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">姓名</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">电话</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">工号</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">部门</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredData.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <button
                          onClick={() => togglePerson(item.id)}
                          className={`w-4 h-4 border rounded flex items-center justify-center ${
                            selected.has(item.id) ? "bg-blue-500 border-blue-500" : "border-gray-300"
                          }`}
                        >
                          {selected.has(item.id) && <Check className="w-3 h-3 text-white" />}
                        </button>
                      </td>
                      <td className="px-3 py-2">{item.name}</td>
                      <td className="px-3 py-2">{item.phone}</td>
                      <td className="px-3 py-2">{item.empNo}</td>
                      <td className="px-3 py-2">{item.dept}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={handleConfirm}>确定</Button>
        </div>
      </div>
    </div>
  );
}

// ============ 主弹窗组件（单页面滚动形式） ============
export function SelfDeliveryApplyDialog({ open, onClose, rowData = null }: SelfDeliveryApplyDialogProps) {
  // 根据 rowData 判断弹窗模式
  // isViewMode: rowData有innerList且有数据 = 查看模式
  // isEditMode: rowData有innerList = 修改模式（和新增一样但有数据）
  const isViewMode = rowData && rowData.innerList && rowData.innerList.length > 0 && !rowData.isEditMode;
  const [projectType, setProjectType] = useState<ProjectType>("项目型");

  // 选择弹窗状态
  const [projectSelectOpen, setProjectSelectOpen] = useState(false);
  const [orderSelectOpen, setOrderSelectOpen] = useState(false);
  const [tripleSelectOpen, setTripleSelectOpen] = useState(false);
  const [mainPersonSelectOpen, setMainPersonSelectOpen] = useState(false);
  const [countersignPersonSelectOpen, setCountersignPersonSelectOpen] = useState(false);
  const [ccPersonSelectOpen, setCcPersonSelectOpen] = useState(false);

  // 审批流程类型
  const [approvalFlowType, setApprovalFlowType] = useState<"local" | "city">("local");

  // 选中数据 - 如果有 rowData 则自动填充
  const [selectedProject, setSelectedProject] = useState<ProjectOption | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderOption | null>(null);
  const [selectedTriple, setSelectedTriple] = useState<TripleOption | null>(null);

  // 初始化：如果有 rowData，自动填充项目信息
  React.useEffect(() => {
    if (rowData) {
      // 根据类型设置项目数据
      const type = rowData.type;
      setProjectType(type);
      // 切换类型时重新设置附件配置
      setAttachments(getDefaultAttachments(type));

      if (type === "项目型") {
        setSelectedProject({
          id: rowData.id,
          customerName: rowData.customerName,
          customerCode: rowData.customerCode,
          oppName: rowData.oppName,
          oppCode: rowData.oppCode,
          contractName: rowData.contractName,
          contractCode: rowData.contractCode,
          contractAmount: rowData.forwardAmount,
          projectName: rowData.projectName,
          projectCode: rowData.projectCode,
          projectType: rowData.type,
          selfDeliveryForwardAmount: rowData.selfDeliveryForwardAmount,
          selfDeliveryCostAmount: rowData.selfDeliveryCostAmount,
          profit: rowData.canApplyAmount,
          forwardContractAmount: rowData.forwardContractSelfDeliveryAmount,
          maxApplyAmount: rowData.canApplyAmount,
          appliedAmount: rowData.appliedAmount,
          // 申请实际毛利 = 已申请金额 / 前向合同自交付金额 * 100%
          appliedProfit: (() => {
            const applied = parseFloat((rowData.appliedAmount || "0").replace(/,/g, ''));
            const forward = parseFloat((rowData.forwardContractSelfDeliveryAmount || "0").replace(/,/g, ''));
            if (forward <= 0) return "0";
            return ((applied / forward) * 100).toFixed(0);
          })()
        });
      } else if (type === "小微标品") {
        setSelectedOrder({
          id: rowData.id,
          workOrderNo: rowData.projectCode || rowData.id,
          businessUnit: rowData.businessUnit || "",
          area: "",
          mainOrderCode: rowData.projectCode || "",
          sparePartsLabel: "",
          standardLabel: "",
          businessType: "",
          receiver: "",
          stageName: "",
          orderCode: rowData.projectCode || "",
          endDate: rowData.endDate || "",
          workOrderStatus: rowData.status || "",
          customerName: rowData.customerName || "",
          dataId: rowData.id || "",
          createTime: "",
          duration: rowData.cycle || ""
        });
      } else if (type === "三联单") {
        setSelectedTriple({
          id: rowData.id,
          statisticsDate: "",
          assetCode: "",
          orderCode: rowData.projectCode || "",
          serviceNumber: "",
          discountCode: "",
          discountName: "",
          acceptAmount: rowData.forwardAmount || "",
          acceptBranch: "",
          acceptSubBranch: "",
          ictAgreementNo: "",
          acceptTime: rowData.startDate || "",
          completionTime: rowData.endDate || "",
          vipCardNo: "",
          acceptEmpNo: "",
          acceptEmpName: "",
          marketingEmpNo: "",
          marketingEmpName: "",
          marketingBranch: "",
          marketingSubBranch: "",
          isYizhuang: "",
          discountStartTime: "",
          discountEndTime: "",
          orderStatus: rowData.status || "",
          vipCustomerName: rowData.customerName || "",
          isTriple: "是",
          contractAmount: rowData.forwardAmount || "",
          month: "",
          date: "",
          quarter: "",
          businessUnit: rowData.businessUnit || ""
        });
      }
    } else {
      // 没有 rowData 时重置为新增模式
      setSelectedProject(null);
      setSelectedOrder(null);
      setSelectedTriple(null);
      setProjectType("项目型");
    }
  }, [rowData]);

  // 结算信息状态 - 支持平铺添加多个section
  const [settlementSections, setSettlementSections] = useState<SettlementSection[]>([]);
  const [smallProductPersonList, setSmallProductPersonList] = useState<PersonItem[]>([
    { id: "1", name: "张三", code: "EMP001", amount: "5,000" }
  ]);
  const [smallProductSettlementAmount, setSmallProductSettlementAmount] = useState("");

  // 项目维保信息状态
  const [isCycleMaintenance, setIsCycleMaintenance] = useState<"是" | "否">("否");
  const [projectStartDate, setProjectStartDate] = useState("");
  const [projectEndDate, setProjectEndDate] = useState("");
  const [cycle, setCycle] = useState("");

  // 描述类型状态（两级级联）
  const [descriptionCategory, setDescriptionCategory] = useState("");
  const [descriptionSubType, setDescriptionSubType] = useState("");

  // 描述类型级联数据（一级分类 + 二级选项 + 详细描述）
  const descriptionOptions: { value: string; label: string; children: { value: string; label: string; description: string }[] }[] = [
    {
      value: "视联网收编", label: "视联网收编",
      children: [
        { value: "AI能力叠加", label: "AI 能力叠加", description: "给客户视联网系统添加 AI 功能，提升智能化，高效管理视频监控、减少人工成本。" },
        { value: "NVR_CVR调试", label: "NVR/CVR 调试", description: "调试监控录像存储设备，确保录像正常录制、回放、导出，保障录像可用可追溯。" }
      ]
    },
    {
      value: "服务器", label: "服务器",
      children: [
        { value: "私有云电脑部署", label: "私有云电脑部署", description: "部署专属云桌面，支持员工远程办公，保障数据安全，提升办公灵活性。" },
        { value: "网管平台部署", label: "网管平台部署", description: "安装调试网管平台，方便客户实时查看网络状态，快速排查网络故障。" },
        { value: "超融合部署", label: "超融合部署", description: "整合服务器、存储、网络资源，简化机房布局，提升资源利用率，降低维护成本。" },
        { value: "底层系统安装", label: "底层系统安装", description: "给服务器安装调试操作系统，确保服务器稳定运行。" },
        { value: "AI私有化部署", label: "AI 私有化部署", description: "将 AI 功能部署在客户本地设备，不依赖外部平台，满足 AI 需求且保障数据隐私。" }
      ]
    },
    {
      value: "网络传输", label: "网络传输（路由/交换/无线/FTTR-B）",
      children: [
        { value: "组网方案撰写", label: "组网方案撰写", description: "根据客户需求，撰写专属网络组网方案，明确设备和线路布局，提供实施依据。" },
        { value: "优化方案撰写", label: "优化方案撰写", description: "针对客户网络痛点，撰写优化方案，提出改进措施，提升网络性能。" },
        { value: "设备调试", label: "设备调试", description: "调试路由器、交换机等设备，确保设备正常工作，保障网络稳定连通。" },
        { value: "设备版本升级", label: "设备版本升级", description: "升级网络设备系统版本，提升设备性能和安全性，避免版本老旧引起的故障风险。" },
        { value: "业务割接", label: "业务割接", description: "网络升级、设备更换时，平稳切换原有业务至新设备/网络。" },
        { value: "网络排障", label: "网络排障", description: "快速排查网络故障（断网、卡顿等），及时修复，减少对客户办公的影响。" },
        { value: "网络维保", label: "网络维保", description: "定期维护网络系统，排查潜在隐患，确保网络长期稳定运行。" }
      ]
    },
    {
      value: "网络安全", label: "网络安全",
      children: [
        { value: "边界防护与访问控制", label: "边界防护与访问控制（防火墙-安全大脑）", description: "调试防火墙，控制内部上网权限，保障网络和数据安全。" },
        { value: "上网行为管理", label: "上网行为管理", description: "规范员工上网行为，限制不良网站访问、控制下载速度，避免网络卡顿和安全风险。" },
        { value: "定期扫描与风险评估", label: "定期扫描与风险评估（漏洞扫描）", description: "扫描网络、设备漏洞，评估风险并给出修复建议，防范安全事故。" },
        { value: "互联网VPN组网", label: "互联网 VPN 组网（非电信VPN）", description: "部署加密 VPN，支持员工远程安全访问公司内网，实现远程办公。" },
        { value: "认证服务器接入", label: "认证服务器接入", description: "接入认证服务器，设置会议访问权限，保障会议内容不泄露、不被干扰。" },
        { value: "国际网络接入", label: "国际网络接入（需审批）", description: "协助客户申请部署国际网络，保障国际视频会议、跨国业务顺畅。" }
      ]
    },
    {
      value: "会议保障", label: "会议保障",
      children: [
        { value: "重保方案撰写", label: "重保方案撰写", description: "为重要会议撰写网络保障方案，明确应急措施，确保会议网络稳定。" },
        { value: "会场无线调优", label: "会场无线调优", description: "优化会议现场 WiFi，避开干扰，避免卡顿断连，保障参会人员正常使用。" },
        { value: "5G信号保障车租赁", label: "5G 信号保障车租赁", description: "会议现场信号不佳时，租赁 5G 保障车，提供稳定高速网络。" },
        { value: "应急电源车租赁", label: "应急电源车租赁", description: "为重要会议提供应急供电，避免停电导致会议中断。" }
      ]
    },
    {
      value: "综合布线", label: "综合布线",
      children: [
        { value: "光缆布放熔接", label: "光缆布放熔接", description: "布放并熔接光缆，保障大带宽、远距离数据传输，适用于园区、办公楼内部互联。" },
        { value: "固话线路布放", label: "固话线路布放", description: "布放调试固话线路，确保固话正常通讯，满足办公联系需求。" },
        { value: "有线点位布放", label: "有线点位布放", description: "安装有线网络接口、布放网线，保障电脑、打印机等设备稳定联网。" },
        { value: "AP点位勘测", label: "AP 点位勘测与无线覆盖", description: "勘测 AP 安装位置，调试无线设备，实现办公区、园区稳定 WiFi 覆盖。" },
        { value: "门禁系统部署", label: "门禁系统部署", description: "安装调试门禁设备，设置访问权限，保障客户区域安全。" },
        { value: "监控系统部署", label: "监控系统部署", description: "安装调试监控设备，实现实时监控、录像回放，起到安全防范和追溯作用。" },
        { value: "道闸安装", label: "道闸安装", description: "安装道闸，调试道闸服务器，调通道闸网络，实现车辆、行人自动识别放行，方便管理。" },
        { value: "智能家居安装", label: "智能家居安装", description: "安装调试智能设备，实现便捷控制，提升办公舒适度。" }
      ]
    },
    {
      value: "机房搬迁", label: "机房搬迁",
      children: [
        { value: "服务器搬迁", label: "服务器搬迁", description: "安全拆卸、搬运、安装调试服务器，确保数据不丢失、业务不中断。" },
        { value: "网络设备搬迁", label: "网络设备搬迁", description: "搬迁调试路由器、交换机等设备，保障网络正常连通。" },
        { value: "安全设备搬迁", label: "安全设备搬迁", description: "搬迁调试防火墙等设备，确保网络安全防护不中断。" },
        { value: "UPS搬迁", label: "UPS 搬迁", description: "搬迁 UPS 电源，确保停电时保护设备，避免业务中断。" },
        { value: "线路整理", label: "线路整理", description: "整理机房杂乱线路，规范捆绑、做好标识，方便后续维护排查。" },
        { value: "拓扑绘制", label: "拓扑绘制", description: "摸排网络设备部署情况，绘制机房网络拓扑示意图，排查设备所有接口及配置。" },
        { value: "线路信息表", label: "线路信息表", description: "整理线路详细信息做成表格，方便查询和维护。" }
      ]
    },
    {
      value: "硬件巡检", label: "硬件巡检",
      children: [
        { value: "设备告警状态巡检", label: "设备告警状态巡检", description: "检查硬件设备状态，排查有无异常告警，避免设备故障中断业务。" },
        { value: "设备维保周期核查", label: "设备维保周期核查", description: "核对主流品牌设备维保期限，提醒客户续期，避免过保损失。" },
        { value: "评估报告输出", label: "评估报告输出", description: "巡检后出具报告，明确设备状态、隐患及改进建议，方便客户规划维护。" }
      ]
    }
  ];

  // 基本情况描述
  const [description, setDescription] = useState("根据用户的需求提供宿舍大楼内的机房整治与固话线路的优化服务，大楼共计5层楼，7个人工累计服务15天，服务时间共计为105个工时。");

  // 超额提示
  const [overAmountReason, setOverAmountReason] = useState("");
  const [overAmountAttachments, setOverAmountAttachments] = useState<{ name: string }[]>([]);

  // 附件状态（带mock数据）- 三种类型统一
  const [attachments, setAttachments] = useState<AttachmentItem[]>(getDefaultAttachments(projectType));

  // 审批信息状态
  const [mainRecipients, setMainRecipients] = useState<PersonItemData[]>([]);
  const [countersignUsers, setCountersignUsers] = useState<PersonItemData[]>([]);
  const [ccUsers, setCcUsers] = useState<PersonItemData[]>([]);

  // 重置表单
  const resetForm = () => {
    setSelectedProject(null);
    setSelectedOrder(null);
    setSelectedTriple(null);
    setSettlementSections([]);
    setSmallProductPersonList([{ id: "1", name: "张三", code: "EMP001", amount: "5,000" }]);
    setSmallProductSettlementAmount("");
    setDescription("根据用户的需求提供宿舍大楼内的机房整治与固话线路的优化服务，大楼共计5层楼，7个人工累计服务15天，服务时间共计为105个工时。");
    setAttachments(getDefaultAttachments(projectType));
    setIsCycleMaintenance("否");
    setProjectStartDate("");
    setProjectEndDate("");
    setCycle("");
    setDescriptionCategory("");
    setDescriptionSubType("");
    setMainRecipients([]);
    setCountersignUsers([]);
    setCcUsers([]);
    setOverAmountReason("");
    setOverAmountAttachments([]);
  };

  // 关闭弹窗
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // ============ 结算Section管理 ============
  // 添加section
  const addSettlementSection = (method: SettlementMethod) => {
    const newSection: SettlementSection = {
      id: Date.now().toString(),
      method,
      totalLaborCost: "",
      settlementAmount: "",
      personList: [{ id: Date.now().toString() + "_1", name: "", code: "", amount: "" }],
      uploadedFileName: undefined
    };
    setSettlementSections(prev => [...prev, newSection]);
  };

  // 删除section
  const removeSettlementSection = (sectionId: string) => {
    setSettlementSections(settlementSections.filter(s => s.id !== sectionId));
  };

  // 更新section基本信息
  const updateSettlementSection = (sectionId: string, field: keyof SettlementSection, value: string) => {
    setSettlementSections(prev => prev.map(s => s.id === sectionId ? { ...s, [field]: value } : s));
  };

  // 添加人员到section
  const addPersonToSection = (sectionId: string) => {
    setSettlementSections(prev => prev.map(s => {
      if (s.id === sectionId) {
        return { ...s, personList: [...s.personList, { id: Date.now().toString(), name: "", code: "", amount: "" }] };
      }
      return s;
    }));
  };

  // 从section删除人员
  const removePersonFromSection = (sectionId: string, personId: string) => {
    setSettlementSections(prev => prev.map(s => {
      if (s.id === sectionId) {
        if (s.personList.length <= 1) return s;
        return { ...s, personList: s.personList.filter(p => p.id !== personId) };
      }
      return s;
    }));
  };

  // 更新section中人员
  const updatePersonInSection = (sectionId: string, personId: string, field: keyof PersonItem, value: string | number) => {
    setSettlementSections(prev => prev.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          personList: s.personList.map(p => p.id === personId ? { ...p, [field]: value } : p)
        };
      }
      return s;
    }));
  };

  // 计算section的结算金额
  const calculateSectionAmount = (section: SettlementSection): string => {
    if (section.method === "451定额") {
      // 451定额：总人工费 × 0.4
      const labor = parseFloat(section.totalLaborCost.replace(/,/g, '')) || 0;
      return (labor * 0.4).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else {
      // 350人天：人员列表人天 × 350 之和
      const total = section.personList.reduce((sum, p) => {
        return sum + (p.personDays || 0) * 350;
      }, 0);
      return total.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  };

  // 自动更新section的结算金额
  const autoUpdateSectionAmount = (sectionId: string) => {
    setSettlementSections(prev => prev.map(s => {
      if (s.id === sectionId) {
        const newAmount = calculateSectionAmount(s);
        return { ...s, settlementAmount: newAmount };
      }
      return s;
    }));
  };

  // ============ 小微标品人员管理 ============
  const addSmallProductPerson = () => {
    setSmallProductPersonList(prev => [...prev, { id: Date.now().toString(), name: "", code: "", amount: "" }]);
  };
  const removeSmallProductPerson = (id: string) => {
    setSmallProductPersonList(prev => prev.length > 1 ? prev.filter(p => p.id !== id) : prev);
  };
  const updateSmallProductPerson = (id: string, field: keyof PersonItem, value: string | number) => {
    setSmallProductPersonList(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  // 计算所有section总额
  const getTotalSettlementAmount = (): number => {
    return settlementSections.reduce((sum, s) => {
      return sum + (parseFloat(s.settlementAmount.replace(/,/g, '')) || 0);
    }, 0);
  };

  // 判断是否超额
  const isOverAmount = (): boolean => {
    if (!selectedProject?.forwardContractAmount) return false;
    const limit = parseFloat(selectedProject.forwardContractAmount.replace(/,/g, '')) * 0.7;
    return getTotalSettlementAmount() > limit;
  };

  // 获取前向合同自交付金额（去掉逗号）
  const getForwardContractAmount = (): number => {
    if (!selectedProject?.forwardContractAmount) return 0;
    return parseFloat(selectedProject.forwardContractAmount.replace(/,/g, '')) || 0;
  };

  // 校验单section结算金额（强制不超过前向合同自交付金额）
  const validateSectionAmount = (value: string): string => {
    const num = parseFloat(value.replace(/,/g, '')) || 0;
    const limit = getForwardContractAmount();
    if (limit > 0 && num > limit) {
      return limit.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return value;
  };

  // 判断section金额是否超过前向合同自交付金额×0.7
  const isSectionOverLimit = (value: string): boolean => {
    const num = parseFloat(value.replace(/,/g, '')) || 0;
    const limit = getForwardContractAmount() * 0.7;
    return limit > 0 && num > limit;
  };

  // 上传附件（模拟）- 支持多文件
  const handleUpload = (id: string) => {
    const newFileName = `新文件_${new Date().toISOString().slice(0, 10)}.pdf`;
    setAttachments(attachments.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: "uploaded" as const,
          files: [...a.files, { name: newFileName }]
        };
      }
      return a;
    }));
  };

  // 删除附件中的单个文件
  const handleDeleteFile = (attachmentId: string, fileIndex: number) => {
    setAttachments(attachments.map(a => {
      if (a.id === attachmentId) {
        const newFiles = a.files.filter((_, index) => index !== fileIndex);
        return {
          ...a,
          status: newFiles.length > 0 ? "uploaded" as const : "pending" as const,
          files: newFiles
        };
      }
      return a;
    }));
  };

  if (!open) return null;

  return (
    <>
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[1000px] max-h-[90vh] flex flex-col">
        {/* 头部 */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-lg font-medium">{isViewMode ? "查看自交付结算" : "申请自交付结算"}</h3>
            <p className="text-sm text-gray-500 mt-1">{isViewMode ? "只读查看模式" : "请填写相关信息"}</p>
          </div>
          <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

          {/* 内容区（滚动） */}
          <div className="flex-1 overflow-auto p-6 space-y-6">
            {/* ============ 第一部分：选择申请项目 ============ */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">1</span>
                选择申请项目
              </h4>

              {isViewMode ? (
                /* 查看模式：只读展示项目信息 */
                <div className="space-y-4">
                  {/* 项目类型标签 */}
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-700">{projectType}</Badge>
                  </div>

                  {/* 项目型只读展示 */}
                  {projectType === "项目型" && selectedProject && (
                    <div className="space-y-4">
                      <div className="bg-white rounded border border-gray-200 p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">客户名称</label>
                            <div className="text-sm font-medium">{selectedProject.customerName}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">客户编码</label>
                            <div className="text-sm">{selectedProject.customerCode}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">合同名称</label>
                            <div className="text-sm">{selectedProject.contractName}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">合同编码</label>
                            <div className="text-sm">{selectedProject.contractCode}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">合同金额</label>
                            <div className="text-sm font-medium text-green-600">{selectedProject.contractAmount}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">项目名称</label>
                            <div className="text-sm">{selectedProject.projectName}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">项目编码</label>
                            <div className="text-sm">{selectedProject.projectCode}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">项目类型</label>
                            <div className="text-sm">{selectedProject.projectType}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">项目类别</label>
                            <div className="text-sm">{selectedProject.projectCategory}</div>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">模式会自交付前向金额</label>
                              <div className="text-sm font-medium">{selectedProject.selfDeliveryForwardAmount}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">模式会自交付成本金额</label>
                              <div className="text-sm font-medium">{selectedProject.selfDeliveryCostAmount}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">模式会毛利</label>
                              <div className="text-sm font-medium text-green-600">15%</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mt-3">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">前向合同自交付金额</label>
                              <div className="text-sm font-medium">{selectedProject.forwardContractAmount}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">最多可申请金额/已申请金额</label>
                              <div className="text-sm">
                                <span className="font-medium font-bold text-blue-600">{selectedProject.maxApplyAmount}</span>
                                <span className="text-gray-400 mx-1">/</span>
                                <span className="font-medium text-gray-900">{selectedProject.appliedAmount}</span>
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">申请实际毛利</label>
                              <div className="text-sm font-medium text-red-600">{selectedProject.appliedProfit}%</div>
                            </div>
                          </div>
                          {parseFloat(selectedProject.appliedProfit) < 15 && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                              <div className="flex items-center gap-2 text-red-600 font-medium mb-3">
                                <AlertTriangle className="w-4 h-4" />
                                <span>模式会毛利15%，申请金额毛利为5%，严重低于模式会阶段毛利</span>
                              </div>
                              <div className="mb-3">
                                <label className="block text-xs text-gray-500 mb-1">原因说明</label>
                                <textarea className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500" rows={2} placeholder="请说明毛利率低于模式会的原因..." />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">附件</label>
                                <div className="border-2 border-dashed border-red-200 rounded-lg p-4 text-center hover:border-red-400 cursor-pointer">
                                  <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                                  <span className="text-xs text-gray-500">点击或拖拽上传附件（jpg/png/pdf）</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 小微标品只读展示 */}
                  {projectType === "小微标品" && selectedOrder && (
                    <div className="bg-white rounded border border-gray-200 p-4">
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">工单编号</label>
                          <div className="text-sm font-medium">{selectedOrder.workOrderNo}</div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">经营单元</label>
                          <div className="text-sm">{selectedOrder.businessUnit}</div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">区域</label>
                          <div className="text-sm">{selectedOrder.area}</div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">主定单编码</label>
                          <div className="text-sm">{selectedOrder.mainOrderCode}</div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">备件库标签</label>
                          <div className="text-sm">{selectedOrder.sparePartsLabel}</div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">标准小微标签</label>
                          <div className="text-sm">{selectedOrder.standardLabel}</div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">业务类型</label>
                          <div className="text-sm">{selectedOrder.businessType}</div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">收单人/岗</label>
                          <div className="text-sm">{selectedOrder.receiver}</div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">环节名称</label>
                          <div className="text-sm">{selectedOrder.stageName}</div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">订单编码</label>
                          <div className="text-sm">{selectedOrder.orderCode}</div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">结束日期</label>
                          <div className="text-sm">{selectedOrder.endDate}</div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">工单状态</label>
                          <div className="text-sm">
                            <span className={`px-2 py-0.5 rounded text-xs ${selectedOrder.workOrderStatus === '已完成' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                              {selectedOrder.workOrderStatus}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">客户名称</label>
                          <div className="text-sm font-medium">{selectedOrder.customerName}</div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">创建时间</label>
                          <div className="text-sm">{selectedOrder.createTime}</div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">历时</label>
                          <div className="text-sm">{selectedOrder.duration}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 三联单只读展示 */}
                  {projectType === "三联单" && selectedTriple && (
                    <div className="space-y-4">
                      {/* 基本信息 */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h5 className="text-sm font-medium text-blue-700 mb-3">基本信息</h5>
                        <div className="grid grid-cols-5 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">经营单元</label>
                            <div className="text-sm font-medium">{selectedTriple.businessUnit}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">VIP客户名称</label>
                            <div className="text-sm">{selectedTriple.vipCustomerName}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">VIP卡号</label>
                            <div className="text-sm">{selectedTriple.vipCardNo}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">统计合同额</label>
                            <div className="text-lg font-medium text-green-600">{selectedTriple.contractAmount}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">竣工时间</label>
                            <div className="text-sm">{selectedTriple.completionTime}</div>
                          </div>
                        </div>
                      </div>

                      {/* 受理信息 */}
                      <div className="bg-white rounded border border-gray-200 p-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-3">受理信息</h5>
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">受理归属分局</label>
                            <div className="text-sm">{selectedTriple.acceptBranch}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">受理归属支局</label>
                            <div className="text-sm">{selectedTriple.acceptSubBranch}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">受理人名称</label>
                            <div className="text-sm">{selectedTriple.acceptEmpName}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">受理人工号</label>
                            <div className="text-sm">{selectedTriple.acceptEmpNo}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">受理金额</label>
                            <div className="text-sm font-medium text-green-600">{selectedTriple.acceptAmount}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">受理时间</label>
                            <div className="text-sm">{selectedTriple.acceptTime}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">订单编码</label>
                            <div className="text-sm">{selectedTriple.orderCode}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">订单状态</label>
                            <div className="text-sm">
                              <span className={`px-2 py-0.5 rounded text-xs ${selectedTriple.orderStatus === '竣工' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                {selectedTriple.orderStatus}
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">资产唯一编码</label>
                            <div className="text-sm">{selectedTriple.assetCode}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">受理的业务号码</label>
                            <div className="text-sm">{selectedTriple.serviceNumber}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">优惠编码</label>
                            <div className="text-sm">{selectedTriple.discountCode}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">优惠名称</label>
                            <div className="text-sm">{selectedTriple.discountName}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">订单来源是否翼装大师</label>
                            <div className="text-sm">{selectedTriple.isYizhuang}</div>
                          </div>
                        </div>
                      </div>

                      {/* 营销信息 */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-3">营销信息</h5>
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">营销人员归属分局</label>
                            <div className="text-sm">{selectedTriple.marketingBranch}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">营销人员归属支局</label>
                            <div className="text-sm">{selectedTriple.marketingSubBranch}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">营销人姓名</label>
                            <div className="text-sm">{selectedTriple.marketingEmpName}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">营销人工号</label>
                            <div className="text-sm">{selectedTriple.marketingEmpNo}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* 新增模式：可编辑表单 */
                <div className="space-y-4">
                  {/* 选择项目按钮和已选展示 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-700">已选{projectType === "项目型" ? "项目" : projectType === "小微标品" ? "工单" : "三联单"}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => {
                          if (projectType === "项目型") setProjectSelectOpen(true);
                          else if (projectType === "小微标品") setOrderSelectOpen(true);
                          else setTripleSelectOpen(true);
                        }}
                      >
                        <Search className="w-4 h-4" />
                        选择{projectType === "项目型" ? "项目" : projectType === "小微标品" ? "订单" : "三联单"}
                      </Button>
                    </div>

                    {/* 项目型选中展示 */}
                    {projectType === "项目型" && selectedProject && (
                      <div className="bg-white rounded border border-gray-200 p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">客户名称</label>
                            <div className="text-sm font-medium">{selectedProject.customerName}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">客户编码</label>
                            <div className="text-sm">{selectedProject.customerCode}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">合同名称</label>
                            <div className="text-sm">{selectedProject.contractName}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">合同编码</label>
                            <div className="text-sm">{selectedProject.contractCode}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">合同金额</label>
                            <div className="text-sm font-medium text-green-600">{selectedProject.contractAmount}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">项目名称</label>
                            <div className="text-sm">{selectedProject.projectName}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">项目编码</label>
                            <div className="text-sm">{selectedProject.projectCode}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">项目类型</label>
                            <div className="text-sm">{selectedProject.projectType}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">项目类别</label>
                            <div className="text-sm">{selectedProject.projectCategory}</div>
                          </div>
                        </div>

                        {/* 维保信息字段 */}
                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">是否周期型维保项目</label>
                              <div className="flex gap-2 mt-1">
                                <button
                                  onClick={() => setIsCycleMaintenance("是")}
                                  className={`px-3 py-1 text-xs rounded border ${
                                    isCycleMaintenance === "是"
                                      ? "bg-blue-500 text-white border-blue-500"
                                      : "bg-white text-gray-600 border-gray-300"
                                  }`}
                                >
                                  是
                                </button>
                                <button
                                  onClick={() => setIsCycleMaintenance("否")}
                                  className={`px-3 py-1 text-xs rounded border ${
                                    isCycleMaintenance === "否"
                                      ? "bg-blue-500 text-white border-blue-500"
                                      : "bg-white text-gray-600 border-gray-300"
                                  }`}
                                >
                                  否
                                </button>
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">周期</label>
                              <Input size="sm" placeholder="如：12个月" value={cycle} onChange={e => setCycle(e.target.value)} />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">开始时间</label>
                              <Input type="date" size="sm" value={projectStartDate} onChange={e => setProjectStartDate(e.target.value)} />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">结束时间</label>
                              <Input type="date" size="sm" value={projectEndDate} onChange={e => setProjectEndDate(e.target.value)} />
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">模式会自交付前向金额</label>
                              <div className="text-sm font-medium">{selectedProject.selfDeliveryForwardAmount}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">模式会自交付成本金额</label>
                              <div className="text-sm font-medium">{selectedProject.selfDeliveryCostAmount}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">模式会毛利</label>
                              <div className="text-sm font-medium text-green-600">15%</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mt-3">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">前向合同自交付金额</label>
                              <div className="text-sm font-medium">{selectedProject.forwardContractAmount}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">最多可申请金额/已申请金额</label>
                              <div className="text-sm">
                                <span className="font-medium font-bold text-blue-600">{selectedProject.maxApplyAmount}</span>
                                <span className="text-gray-400 mx-1">/</span>
                                <span className="font-medium text-gray-900">{selectedProject.appliedAmount}</span>
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">申请实际毛利</label>
                              <div className="text-sm font-medium text-red-600">{selectedProject.appliedProfit}%</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 小微标品选中展示 */}
                    {projectType === "小微标品" && selectedOrder && (
                      <div className="bg-white rounded border border-gray-200 p-4">
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">工单编号</label>
                            <div className="text-sm font-medium">{selectedOrder.workOrderNo}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">经营单元</label>
                            <div className="text-sm">{selectedOrder.businessUnit}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">区域</label>
                            <div className="text-sm">{selectedOrder.area}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">主定单编码</label>
                            <div className="text-sm">{selectedOrder.mainOrderCode}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">备件库标签</label>
                            <div className="text-sm">{selectedOrder.sparePartsLabel}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">标准小微标签</label>
                            <div className="text-sm">{selectedOrder.standardLabel}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">业务类型</label>
                            <div className="text-sm">{selectedOrder.businessType}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">收单人/岗</label>
                            <div className="text-sm">{selectedOrder.receiver}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">环节名称</label>
                            <div className="text-sm">{selectedOrder.stageName}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">订单编码</label>
                            <div className="text-sm">{selectedOrder.orderCode}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">结束日期</label>
                            <div className="text-sm">{selectedOrder.endDate}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">工单状态</label>
                            <div className="text-sm">
                              <span className={`px-2 py-0.5 rounded text-xs ${selectedOrder.workOrderStatus === '已完成' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                {selectedOrder.workOrderStatus}
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">客户名称</label>
                            <div className="text-sm font-medium">{selectedOrder.customerName}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">创建时间</label>
                            <div className="text-sm">{selectedOrder.createTime}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">历时</label>
                            <div className="text-sm">{selectedOrder.duration}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 三联单选中展示 */}
                    {projectType === "三联单" && selectedTriple && (
                      <div className="space-y-4">
                        {/* 基本信息 */}
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h5 className="text-sm font-medium text-blue-700 mb-3">基本信息</h5>
                          <div className="grid grid-cols-5 gap-4">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">经营单元</label>
                              <div className="text-sm font-medium">{selectedTriple.businessUnit}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">VIP客户名称</label>
                              <div className="text-sm">{selectedTriple.vipCustomerName}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">VIP卡号</label>
                              <div className="text-sm">{selectedTriple.vipCardNo}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">统计合同额</label>
                              <div className="text-lg font-medium text-green-600">{selectedTriple.contractAmount}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">竣工时间</label>
                              <div className="text-sm">{selectedTriple.completionTime}</div>
                            </div>
                          </div>
                        </div>

                        {/* 受理信息 */}
                        <div className="bg-white rounded border border-gray-200 p-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-3">受理信息</h5>
                          <div className="grid grid-cols-4 gap-4">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">受理归属分局</label>
                              <div className="text-sm">{selectedTriple.acceptBranch}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">受理归属支局</label>
                              <div className="text-sm">{selectedTriple.acceptSubBranch}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">受理人名称</label>
                              <div className="text-sm">{selectedTriple.acceptEmpName}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">受理人工号</label>
                              <div className="text-sm">{selectedTriple.acceptEmpNo}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">受理金额</label>
                              <div className="text-sm font-medium text-green-600">{selectedTriple.acceptAmount}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">受理时间</label>
                              <div className="text-sm">{selectedTriple.acceptTime}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">订单编码</label>
                              <div className="text-sm">{selectedTriple.orderCode}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">订单状态</label>
                              <div className="text-sm">
                                <span className={`px-2 py-0.5 rounded text-xs ${selectedTriple.orderStatus === '竣工' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                  {selectedTriple.orderStatus}
                                </span>
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">资产唯一编码</label>
                              <div className="text-sm">{selectedTriple.assetCode}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">受理的业务号码</label>
                              <div className="text-sm">{selectedTriple.serviceNumber}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">优惠编码</label>
                              <div className="text-sm">{selectedTriple.discountCode}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">优惠名称</label>
                              <div className="text-sm">{selectedTriple.discountName}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">订单来源是否翼装大师</label>
                              <div className="text-sm">{selectedTriple.isYizhuang}</div>
                            </div>
                          </div>
                        </div>

                        {/* 营销信息 */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-3">营销信息</h5>
                          <div className="grid grid-cols-4 gap-4">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">营销人员归属分局</label>
                              <div className="text-sm">{selectedTriple.marketingBranch}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">营销人员归属支局</label>
                              <div className="text-sm">{selectedTriple.marketingSubBranch}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">营销人姓名</label>
                              <div className="text-sm">{selectedTriple.marketingEmpName}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">营销人工号</label>
                              <div className="text-sm">{selectedTriple.marketingEmpNo}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {!selectedProject && !selectedOrder && !selectedTriple && (
                      <div className="text-center py-8 text-gray-400">
                        请点击上方按钮选择{projectType === "项目型" ? "项目" : projectType === "小微标品" ? "订单" : "三联单"}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ============ 第二部分：结算信息 ============ */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">2</span>
                结算信息
              </h4>

              {isViewMode ? (
                /* 查看模式：只读展示所有section */
                <div className="space-y-4">
                  {settlementSections.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm py-4">暂无结算信息</div>
                  ) : settlementSections.map((section, idx) => (
                    <div key={section.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-gray-700">结算 {idx + 1} - {section.method}</span>
                        <Badge className="bg-blue-100 text-blue-700">{section.method}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">总人工费</label>
                          <div className="text-lg font-medium text-green-600">¥{section.totalLaborCost || "0.00"}</div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">结算金额</label>
                          <div className="text-lg font-bold text-blue-600">¥{section.settlementAmount || "0.00"}</div>
                        </div>
                      </div>
                      <table className="w-full text-sm">
                        <thead className="bg-white">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">姓名</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">人力编码</th>
                            {section.method === "350人天" ? (
                              <>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">人天</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">金额</th>
                              </>
                            ) : (
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">金额</th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {section.personList.map(p => (
                            <tr key={p.id}>
                              <td className="px-3 py-2">{p.name || "-"}</td>
                              <td className="px-3 py-2">{p.code || "-"}</td>
                              {section.method === "350人天" ? (
                                <>
                                  <td className="px-3 py-2">{p.personDays || 0}</td>
                                  <td className="px-3 py-2 text-green-600">¥{((p.personDays || 0) * 350).toLocaleString()}</td>
                                </>
                              ) : (
                                <td className="px-3 py-2 text-green-600">¥{p.amount || "0"}</td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              ) : projectType === "小微标品" ? (
                /* 小微标品：人员列表 + 交付总人工费 = 结算金额 */
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-700">人员列表</span>
                      <Button variant="ghost" size="sm" className="gap-1" onClick={addSmallProductPerson}>
                        <Plus className="w-4 h-4" />
                        添加人
                      </Button>
                    </div>
                    <table className="w-full text-sm">
                      <thead className="bg-white">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">姓名</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">人力编码</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">金额</th>
                          <th className="px-3 py-2 w-12"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {smallProductPersonList.map(person => (
                          <tr key={person.id}>
                            <td className="px-3 py-2">
                              <Input size="sm" placeholder="姓名" value={person.name} onChange={e => updateSmallProductPerson(person.id, "name", e.target.value)} />
                            </td>
                            <td className="px-3 py-2">
                              <Input size="sm" placeholder="编码" value={person.code} onChange={e => updateSmallProductPerson(person.id, "code", e.target.value)} />
                            </td>
                            <td className="px-3 py-2">
                              <Input size="sm" placeholder="金额" value={person.amount ?? ""} onChange={e => {
                                const val = e.target.value;
                                setSmallProductPersonList(prev => {
                                  const next = prev.map(p => p.id === person.id ? { ...p, amount: val } : p);
                                  const total = next.reduce((sum, p) => sum + (parseFloat(p.amount || "0") || 0), 0);
                                  setSmallProductSettlementAmount(total.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                                  return next;
                                });
                              }} />
                            </td>
                            <td className="px-3 py-2">
                              <Button variant="ghost" size="sm" className="text-red-600" onClick={() => removeSmallProductPerson(person.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">交付总人工费</label>
                        <div className="text-lg font-bold text-blue-600">
                          ¥{smallProductPersonList.reduce((sum, p) => sum + (parseFloat(p.amount || "0") || 0), 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">结算金额（=交付总人工费）</label>
                        <Input
                          value={smallProductSettlementAmount}
                          onChange={e => {
                            const val = e.target.value;
                            const num = parseFloat(val.replace(/,/g, '')) || 0;
                            const limit = getForwardContractAmount();
                            if (limit > 0 && num > limit) {
                              setSmallProductSettlementAmount(limit.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                            } else {
                              setSmallProductSettlementAmount(val);
                            }
                          }}
                          placeholder="请输入结算金额"
                        />
                        {isSectionOverLimit(smallProductSettlementAmount) && (
                          <div className="text-xs text-orange-500 mt-1">已超过规范要求金额</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* 项目型/三联单：支持平铺添加多个451/350 section */
                <div className="space-y-4">
                  {settlementSections.length > 0 && (
                    <div className="text-sm font-medium text-gray-700">
                      已添加 {settlementSections.length} 个结算段
                    </div>
                  )}

                  {settlementSections.map((section, idx) => (
                    <div key={section.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-700">结算 {idx + 1}</span>
                          <Badge className="bg-blue-100 text-blue-700">{section.method}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {section.method === "451定额" && (
                            <div className="flex items-center gap-2">
                              {section.uploadedFileName ? (
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <FileText className="w-3 h-3 text-blue-500" />
                                  {section.uploadedFileName}
                                </span>
                              ) : null}
                              <Button variant="outline" size="sm" className="gap-1" onClick={() => {
                                // 模拟文件选择和解析
                                const input = document.createElement("input");
                                input.type = "file";
                                input.accept = ".xlsx,.xls,.pdf,.doc,.docx";
                                input.onchange = (e: any) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  // 模拟解析：随机生成一个总人工费
                                  const mockLabor = Math.floor(20000 + Math.random() * 80000);
                                  const newAmount = (mockLabor * 0.4).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                  setSettlementSections(prev => prev.map(s => s.id === section.id ? { ...s, uploadedFileName: file.name, totalLaborCost: mockLabor.toString(), settlementAmount: newAmount } : s));
                                };
                                input.click();
                              }}>
                                <Upload className="w-3 h-3" />
                                {section.uploadedFileName ? "重新上传" : "上传451文件"}
                              </Button>
                            </div>
                          )}
                          <Button variant="ghost" size="sm" className="text-red-600 gap-1" onClick={() => removeSettlementSection(section.id)}>
                            <Trash2 className="w-4 h-4" />
                            删除
                          </Button>
                        </div>
                      </div>

                      {section.method === "451定额" ? (
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">总人工费</label>
                            <Input
                              value={section.totalLaborCost}
                              onChange={e => {
                                const val = e.target.value;
                                const labor = parseFloat(val.replace(/,/g, '')) || 0;
                                const newAmount = (labor * 0.4).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                setSettlementSections(prev => prev.map(s => s.id === section.id ? { ...s, totalLaborCost: val, settlementAmount: newAmount } : s));
                              }}
                              placeholder="请输入总人工费"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">结算金额（自动=人工费×0.4，可修改）</label>
                            <Input
                              value={section.settlementAmount}
                              onChange={e => {
                                const val = e.target.value;
                                const num = parseFloat(val.replace(/,/g, '')) || 0;
                                const limit = getForwardContractAmount();
                                if (limit > 0 && num > limit) {
                                  updateSettlementSection(section.id, "settlementAmount", limit.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                                } else {
                                  updateSettlementSection(section.id, "settlementAmount", val);
                                }
                              }}
                              placeholder="请输入结算金额"
                            />
                            {isSectionOverLimit(section.settlementAmount) && (
                              <div className="text-xs text-orange-500 mt-1">已超过规范要求金额</div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">结算金额（自动=人天×350之和，可修改）</label>
                          <Input
                            value={section.settlementAmount}
                            onChange={e => {
                              const val = e.target.value;
                              const num = parseFloat(val.replace(/,/g, '')) || 0;
                              const limit = getForwardContractAmount();
                              if (limit > 0 && num > limit) {
                                updateSettlementSection(section.id, "settlementAmount", limit.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                              } else {
                                updateSettlementSection(section.id, "settlementAmount", val);
                              }
                            }}
                            placeholder="请输入结算金额"
                          />
                          {isSectionOverLimit(section.settlementAmount) && (
                            <div className="text-xs text-orange-500 mt-1">已超过规范要求金额</div>
                          )}
                        </div>
                      )}

                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-700">人员列表</span>
                          <Button variant="ghost" size="sm" className="gap-1" onClick={() => addPersonToSection(section.id)}>
                            <Plus className="w-4 h-4" />
                            添加人
                          </Button>
                        </div>
                        <table className="w-full text-sm">
                          <thead className="bg-white">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">姓名</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">人力编码</th>
                              {section.method === "350人天" ? (
                                <>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">人天</th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">金额（=人天×350）</th>
                                </>
                              ) : (
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">金额</th>
                              )}
                              <th className="px-3 py-2 w-12"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {section.personList.map(person => (
                              <tr key={person.id}>
                                <td className="px-3 py-2">
                                  <Input size="sm" placeholder="姓名" value={person.name} onChange={e => updatePersonInSection(section.id, person.id, "name", e.target.value)} />
                                </td>
                                <td className="px-3 py-2">
                                  <Input size="sm" placeholder="编码" value={person.code} onChange={e => updatePersonInSection(section.id, person.id, "code", e.target.value)} />
                                </td>
                                {section.method === "350人天" ? (
                                  <>
                                    <td className="px-3 py-2">
                                      <Input size="sm" type="number" placeholder="人天" value={person.personDays ?? ""} onChange={e => {
                                        const days = parseInt(e.target.value) || 0;
                                        setSettlementSections(prev => {
                                          const updated = prev.map(s => {
                                            if (s.id !== section.id) return s;
                                            return {
                                              ...s,
                                              personList: s.personList.map(p => p.id === person.id ? { ...p, personDays: days } : p)
                                            };
                                          });
                                          // 同步计算新section金额
                                          return updated.map(s => s.id === section.id ? { ...s, settlementAmount: calculateSectionAmount(s) } : s);
                                        });
                                      }} />
                                    </td>
                                    <td className="px-3 py-2 text-green-600">¥{((person.personDays || 0) * 350).toLocaleString()}</td>
                                  </>
                                ) : (
                                  <td className="px-3 py-2">
                                    <Input size="sm" placeholder="金额" value={person.amount} onChange={e => updatePersonInSection(section.id, person.id, "amount", e.target.value)} />
                                  </td>
                                )}
                                <td className="px-3 py-2">
                                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => removePersonFromSection(section.id, person.id)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="gap-1" onClick={() => addSettlementSection("451定额")}>
                      <Plus className="w-4 h-4" />
                      添加451定额
                    </Button>
                    <Button variant="outline" className="gap-1" onClick={() => addSettlementSection("350人天")}>
                      <Plus className="w-4 h-4" />
                      添加350人天
                    </Button>
                  </div>

                  {settlementSections.length > 0 && (
                    <>
                    <div className="bg-blue-50 rounded-lg p-3 text-sm">
                      <span className="text-gray-500">结算金额合计：</span>
                      <span className="ml-2 font-bold text-blue-600 text-lg">¥{getTotalSettlementAmount().toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>

                    {/* 周期型维保项目 - 自动拆分发放清单 */}
                    {isCycleMaintenance === "是" && cycle && projectStartDate && projectEndDate && (() => {
                      // 解析"12个月"格式的数字
                      const cycleMatch = cycle.match(/(\d+)/);
                      const months = cycleMatch ? parseInt(cycleMatch[1]) : 0;
                      if (months <= 0) return null;
                      const totalAmount = getTotalSettlementAmount();
                      const perMonth = totalAmount / months;
                      // 当前是2026-06，6月之前的"可发放"
                      const currentMonth = new Date().getMonth() + 1; // 6
                      const items = Array.from({ length: months }, (_, i) => {
                        const monthIndex = i + 1;
                        const isAvailable = monthIndex <= currentMonth;
                        const monthDate = new Date(projectStartDate);
                        monthDate.setMonth(monthDate.getMonth() + i);
                        return {
                          month: monthIndex,
                          date: monthDate.toISOString().slice(0, 10),
                          amount: perMonth,
                          status: isAvailable ? "可发放" : "待发放"
                        };
                      });
                      return (
                        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                          <div className="text-sm font-medium text-orange-700 mb-2">
                            维保发放清单（共 {months} 期，{perMonth.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 元/期）
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {items.map(item => (
                              <div key={item.month} className={`px-3 py-2 rounded text-xs ${item.status === "可发放" ? "bg-green-100 text-green-700 border border-green-300" : "bg-gray-100 text-gray-600 border border-gray-300"}`}>
                                <div className="font-medium">第 {item.month} 期</div>
                                <div>{item.date}</div>
                                <div>¥{item.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                <div className="mt-1 font-medium">{item.status}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* ============ 第三部分：基本情况描述 ============ */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">3</span>
                自交付基本情况描述
              </h4>

              {isViewMode ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">描述类型</label>
                    <div className="flex gap-2">
                      <Badge className="bg-blue-100 text-blue-700">{descriptionCategory || "-"}</Badge>
                      <Badge className="bg-green-100 text-green-700">{descriptionSubType || "-"}</Badge>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">详细描述</label>
                    <div className="bg-gray-50 rounded border border-gray-200 p-3 text-sm text-gray-700 whitespace-pre-wrap">
                      {description || "（暂无描述）"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">描述类型</label>
                    <Select
                      value={descriptionSubType}
                      onValueChange={v => {
                        // 从所有options的children中找到对应项
                        for (const cat of descriptionOptions) {
                          const sub = cat.children.find(s => s.value === v);
                          if (sub) {
                            setDescriptionCategory(cat.value);
                            setDescriptionSubType(v);
                            setDescription(sub.description);
                            return;
                          }
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="请选择描述类型" />
                      </SelectTrigger>
                      <SelectContent className="max-h-96">
                        {descriptionOptions.map(opt => (
                          <SelectGroup key={opt.value}>
                            <SelectLabel className="text-blue-600 font-medium">{opt.label}</SelectLabel>
                            {opt.children.map(sub => (
                              <SelectItem key={sub.value} value={sub.value}>{sub.label}</SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">详细描述</label>
                    <textarea
                      className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="请输入自交付基本情况描述..."
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                    />
                  </div>
                  {/* 项目型低毛利说明 */}
                  {projectType === "项目型" && selectedProject && parseFloat(selectedProject.appliedProfit) < 15 && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-600 font-medium mb-3">
                        <AlertTriangle className="w-4 h-4" />
                        <span>模式会毛利15%，申请金额毛利为{selectedProject.appliedProfit}%，严重低于模式会阶段毛利</span>
                      </div>
                      <div className="mb-3">
                        <label className="block text-xs text-gray-500 mb-1">原因说明</label>
                        <textarea className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500" rows={2} placeholder="请说明毛利率低于模式会的原因..." />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">附件</label>
                        <div className="border-2 border-dashed border-red-200 rounded-lg p-4 text-center hover:border-red-400 cursor-pointer">
                          <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                          <span className="text-xs text-gray-500">点击或拖拽上传附件（jpg/png/pdf）</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 自交付结算金额超额提示（项目型/三联单） */}
                  {isOverAmount() && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-600 font-medium mb-3">
                        <AlertTriangle className="w-4 h-4" />
                        <span>自交付结算金额大于前向合同自交付金额×0.7，请提交说明</span>
                      </div>
                      <div className="text-xs text-gray-600 mb-3">
                        结算金额合计：¥{getTotalSettlementAmount().toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} /
                        限额：¥{(getForwardContractAmount() * 0.7).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        （前向合同自交付金额 ¥{selectedProject?.forwardContractAmount || "0.00"}）
                      </div>
                      <div className="mb-3">
                        <label className="block text-xs text-gray-500 mb-1">原因说明</label>
                        <textarea
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                          rows={2}
                          placeholder="请说明结算金额超额的原因..."
                          value={overAmountReason}
                          onChange={e => setOverAmountReason(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">附件</label>
                        <div className="border-2 border-dashed border-red-200 rounded-lg p-4 text-center hover:border-red-400 cursor-pointer">
                          <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                          <span className="text-xs text-gray-500">点击或拖拽上传附件（jpg/png/pdf）</span>
                        </div>
                        {overAmountAttachments.length > 0 && (
                          <div className="mt-2 text-xs text-gray-600">
                            已上传 {overAmountAttachments.length} 个文件
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 自交付结算金额超额提示（小微标品） */}
                  {projectType === "小微标品" && isSectionOverLimit(smallProductSettlementAmount) && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-600 font-medium mb-3">
                        <AlertTriangle className="w-4 h-4" />
                        <span>自交付结算金额大于前向合同自交付金额×0.7，请提交说明</span>
                      </div>
                      <div className="text-xs text-gray-600 mb-3">
                        结算金额：¥{smallProductSettlementAmount} /
                        限额：¥{(getForwardContractAmount() * 0.7).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        （前向合同自交付金额 ¥{selectedProject?.forwardContractAmount || "0.00"}）
                      </div>
                      <div className="mb-3">
                        <label className="block text-xs text-gray-500 mb-1">原因说明</label>
                        <textarea
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                          rows={2}
                          placeholder="请说明结算金额超额的原因..."
                          value={overAmountReason}
                          onChange={e => setOverAmountReason(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">附件</label>
                        <div className="border-2 border-dashed border-red-200 rounded-lg p-4 text-center hover:border-red-400 cursor-pointer">
                          <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                          <span className="text-xs text-gray-500">点击或拖拽上传附件（jpg/png/pdf）</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ============ 第四部分：附件 ============ */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">4</span>
                附件
              </h4>

              {isViewMode ? (
                /* 查看模式：只读展示附件 */
                <div className="space-y-4">
                  {/* 自动带出区域 - 仅项目型显示 */}
                  {projectType === "项目型" && (
                    <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <h5 className="font-medium text-gray-700">自动带出附件</h5>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {attachments.filter(a => a.source === "auto").map(item => (
                        <div key={item.id} className="bg-white rounded border border-gray-200 p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium">{item.name}</span>
                            {item.required && <span className="text-xs text-red-500">*</span>}
                          </div>
                          {item.files.length > 0 ? (
                            <div className="space-y-1">
                              {item.files.map((file, index) => (
                                <div key={index} className="text-xs text-gray-600 bg-gray-50 rounded px-2 py-1 truncate">
                                  {file.name}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">暂无数据</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  )}
                  {/* 手工上传区域 */}
                  <div>
                    <div className="grid grid-cols-3 gap-3">
                      {attachments.filter(a => a.source === "manual").map(item => (
                        <div key={item.id} className="bg-white rounded border border-gray-200 p-3">
                          <div className="flex items-center gap-2 mb-2">
                            {item.type === "实施照片" ? (
                              <Image className="w-4 h-4 text-orange-500" />
                            ) : (
                              <FileText className="w-4 h-4 text-gray-500" />
                            )}
                            <span className="text-sm font-medium">{item.name}</span>
                            {item.required && <span className="text-xs text-red-500">*</span>}
                          </div>
                          {item.files.length > 0 ? (
                            <div className="space-y-1">
                              {item.files.map((file, index) => (
                                <div key={index} className="text-xs text-gray-600 bg-gray-50 rounded px-2 py-1 truncate">
                                  {file.name}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">暂无数据</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* 新增/修改模式 */
                <div className="space-y-4">
                  {/* 自动带出区域 - 仅项目型显示 */}
                  {projectType === "项目型" && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <h5 className="font-medium text-gray-700">自动带出附件</h5>
                      <span className="text-xs text-gray-500">（从LTO其他模块关联数据）</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {attachments.filter(a => a.source === "auto").map(item => (
                        <div key={item.id} className="bg-white rounded border border-gray-200 p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-blue-500" />
                              <span className="text-sm font-medium">{item.name}</span>
                              {item.required && <span className="text-xs text-red-500">*</span>}
                            </div>
                            <Button variant="ghost" size="sm" className="text-blue-600 h-auto p-0" onClick={() => handleUpload(item.id)}>
                              上传
                            </Button>
                          </div>
                          {/* 文件列表 - 支持多文件 */}
                          {item.files.length > 0 ? (
                            <div className="space-y-1">
                              {item.files.map((file, index) => (
                                <div key={index} className="flex items-center justify-between text-xs bg-gray-50 rounded px-2 py-1">
                                  <span className="text-gray-600 truncate flex-1">{file.name}</span>
                                  <div className="flex items-center gap-1 ml-1">
                                    <button
                                      onClick={() => handleUpload(item.id)}
                                      className="text-blue-600 hover:text-blue-800"
                                      title="重新上传"
                                    >
                                      <Upload className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteFile(item.id, index)}
                                      className="text-red-500 hover:text-red-700"
                                      title="删除"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">暂无数据</span>
                          )}
                        </div>
                      ))}
                      {attachments.filter(a => a.source === "auto").length === 0 && (
                        <div className="col-span-3 text-center py-4 text-gray-400 text-sm">
                          该类型项目无自动带出附件
                        </div>
                      )}
                    </div>
                  </div>
                  )}

                  {/* 手工上传区域 */}
                  <div>
                    <div className="grid grid-cols-3 gap-3">
                      {attachments.filter(a => a.source === "manual").map(item => (
                        <div key={item.id} className="bg-white rounded border border-gray-200 p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {item.type === "实施照片" ? (
                                <Image className="w-4 h-4 text-orange-500" />
                              ) : (
                                <FileText className="w-4 h-4 text-gray-500" />
                              )}
                              <span className="text-sm font-medium">{item.name}</span>
                              {item.required && <span className="text-xs text-red-500">*</span>}
                            </div>
                          </div>
                          {/* 文件列表 - 支持多文件 */}
                          {item.files.length > 0 ? (
                            <div className="space-y-1 mb-2">
                              {item.files.map((file, index) => (
                                <div key={index} className="flex items-center justify-between text-xs bg-gray-50 rounded px-2 py-1">
                                  <span className="text-gray-600 truncate flex-1">{file.name}</span>
                                  <div className="flex items-center gap-1 ml-1">
                                    <button
                                      onClick={() => handleUpload(item.id)}
                                      className="text-blue-600 hover:text-blue-800"
                                      title="重新上传"
                                    >
                                      <Upload className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteFile(item.id, index)}
                                      className="text-red-500 hover:text-red-700"
                                      title="删除"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : null}
                          {/* 上传按钮 */}
                          <Button variant="outline" size="sm" className="w-full mt-2 gap-1" onClick={() => handleUpload(item.id)}>
                            <Upload className="w-4 h-4" />
                            上传
                          </Button>
                          <p className="text-xs text-gray-400 mt-1">支持 jpg、png、pdf 格式</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ============ 第五部分：审批 ============ */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">5</span>
                审批
              </h4>

              {isViewMode ? (
                <div className="space-y-4">
                  {/* 审批流程类型 */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">审批流程：</span>
                    <Badge className="bg-blue-100 text-blue-700 px-3 py-1">{approvalFlowType === "local" ? "属地自交付" : "调用市公司能力"}</Badge>
                  </div>

                  {/* 审批流程图 - 标签样式 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">审批流程</h5>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-green-500 text-white rounded text-xs font-medium">1. 发起（{approvalFlowType === "local" ? "属地" : "地市"}）</span>
                        <span className="text-gray-400">→</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-blue-500 text-white rounded text-xs font-medium">2. 需求部门</span>
                        <span className="text-gray-400">→</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-orange-500 text-white rounded text-xs font-medium">3. {approvalFlowType === "local" ? "属地" : "市"}人力</span>
                        <span className="px-1 py-0.5 bg-gray-200 text-gray-600 rounded text-xs">|</span>
                        <span className="px-2 py-1 bg-green-600 text-white rounded text-xs font-medium">{approvalFlowType === "local" ? "属地" : "市"}财务</span>
                        <span className="px-1 py-0.5 bg-gray-200 text-gray-600 rounded text-xs">|</span>
                        <span className="px-2 py-1 bg-amber-500 text-white rounded text-xs font-medium">{approvalFlowType === "local" ? "属地" : "市"}云中台</span>
                        <span className="px-1 py-0.5 bg-gray-200 text-gray-600 rounded text-xs">|</span>
                        <span className="px-2 py-1 bg-purple-600 text-white rounded text-xs font-medium">{approvalFlowType === "local" ? "属地" : "市"}网运部</span>
                        <Badge variant="outline" className="text-xs">并行审批</Badge>
                      </div>
                    </div>
                  </div>

                  {/* 发起记录 */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">发起</h5>
                    <div className="p-3 bg-gray-50 rounded border border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <span className="text-gray-500">发起人：</span>
                          <span className="font-medium">张明（西湖支局）</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">发起时间：</span>
                          <span className="font-medium">2026-05-10 14:30</span>
                        </div>
                      </div>
                      <div className="text-sm mt-2">
                        <span className="text-gray-500">发起人部门：</span>
                        <span className="font-medium">西湖支局</span>
                      </div>
                    </div>
                  </div>

                  {/* 需求部门审批 */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">需求部门审批</h5>
                    <div className="p-3 bg-green-50 rounded border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-700">已通过</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <span className="text-gray-500">审批人：</span>
                          <span className="font-medium">李华（需求部门）</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">审批时间：</span>
                          <span className="font-medium">2026-05-11 09:15</span>
                        </div>
                      </div>
                      <div className="text-sm mt-2">
                        <span className="text-gray-500">审批意见：</span>
                        <span className="text-gray-700">人员信息核对无误，结算金额合理。</span>
                      </div>
                    </div>
                  </div>

                  {/* 人力/财务/云中台/网运部并行审批 */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">{approvalFlowType === "local" ? "属地部门" : "市部门"}审批</h5>
                    <div className="space-y-3">
                      {/* 人力 */}
                      <div className="p-3 bg-green-50 rounded border border-green-200 flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-4 mb-2">
                            <div className="text-sm">
                              <span className="text-gray-500">审批人：</span>
                              <span className="font-medium">王五（{approvalFlowType === "local" ? "属地人力部" : "市人力部"}）</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-500">审批时间：</span>
                              <span className="font-medium">2026-05-12 10:00</span>
                            </div>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">审批意见：</span>
                            <span className="text-gray-700">人力配置核实无误。</span>
                          </div>
                        </div>
                        <Badge className="bg-green-500 text-white px-2 py-1 text-xs font-bold">{approvalFlowType === "local" ? "属地人力" : "市人力"} · 已通过</Badge>
                      </div>
                      {/* 财务 */}
                      <div className="p-3 bg-green-50 rounded border border-green-200 flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-4 mb-2">
                            <div className="text-sm">
                              <span className="text-gray-500">审批人：</span>
                              <span className="font-medium">赵六（{approvalFlowType === "local" ? "属地财务部" : "市财务部"}）</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-500">审批时间：</span>
                              <span className="font-medium">2026-05-12 14:30</span>
                            </div>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">审批意见：</span>
                            <span className="text-gray-700">财务核算通过。</span>
                          </div>
                        </div>
                        <Badge className="bg-green-500 text-white px-2 py-1 text-xs font-bold">{approvalFlowType === "local" ? "属地财务" : "市财务"} · 已通过</Badge>
                      </div>
                      {/* 云中台 */}
                      <div className="p-3 bg-orange-50 rounded border border-orange-200 flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-4 mb-2">
                            <div className="text-sm">
                              <span className="text-gray-500">审批人：</span>
                              <span className="font-medium text-gray-400">待分配</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-500">审批时间：</span>
                              <span className="font-medium text-gray-400">-</span>
                            </div>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">审批意见：</span>
                            <span className="text-gray-400">-</span>
                          </div>
                        </div>
                        <Badge className="bg-orange-500 text-white px-2 py-1 text-xs font-bold">{approvalFlowType === "local" ? "属地云中台" : "市云中台"} · 审核中</Badge>
                      </div>
                      {/* 网运部 */}
                      <div className="p-3 bg-gray-100 rounded border border-gray-300 flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-4 mb-2">
                            <div className="text-sm">
                              <span className="text-gray-500">审批人：</span>
                              <span className="font-medium text-gray-400">-</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-500">审批时间：</span>
                              <span className="font-medium text-gray-400">-</span>
                            </div>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">审批意见：</span>
                            <span className="text-gray-400">-</span>
                          </div>
                        </div>
                        <Badge className="bg-gray-400 text-white px-2 py-1 text-xs font-bold">{approvalFlowType === "local" ? "属地网运部" : "市网运部"} · 待审批</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 审批流程类型选择 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">审批流程类型</label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setApprovalFlowType("local")}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${approvalFlowType === "local" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 hover:border-gray-300"}`}
                      >
                        属地自交付
                      </button>
                      <button
                        onClick={() => setApprovalFlowType("city")}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${approvalFlowType === "city" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 hover:border-gray-300"}`}
                      >
                        调用市公司能力
                      </button>
                    </div>
                  </div>

                  {/* 审批流程图 - 标签样式 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">审批流程</h5>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">1. 发起（{approvalFlowType === "local" ? "属地" : "地市"}）</span>
                        <span className="text-gray-400">→</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">2. 需求部门</span>
                        <span className="text-gray-400">→</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">3. {approvalFlowType === "local" ? "属地" : "市"}人力</span>
                        <span className="px-1 py-0.5 bg-gray-200 text-gray-600 rounded text-xs">|</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">{approvalFlowType === "local" ? "属地" : "市"}财务</span>
                        <span className="px-1 py-0.5 bg-gray-200 text-gray-600 rounded text-xs">|</span>
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">{approvalFlowType === "local" ? "属地" : "市"}云中台</span>
                        <span className="px-1 py-0.5 bg-gray-200 text-gray-600 rounded text-xs">|</span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">{approvalFlowType === "local" ? "属地" : "市"}网运部</span>
                        <Badge variant="outline" className="text-xs">并行审批</Badge>
                      </div>
                    </div>
                  </div>

                  {/* 按流程节点分组选择人员 */}
                  <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                    {/* 节点2 - 需求部门 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs mr-2">2</span>
                        需求部门（支局）会签人员
                      </label>
                      <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                        <Button variant="outline" size="sm" className="mb-2" onClick={() => setMainPersonSelectOpen(true)}>
                          <Plus className="w-4 h-4 mr-1" />
                          添加人员
                        </Button>
                        {mainRecipients.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {mainRecipients.map(person => (
                              <span key={person.id} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                {person.name}
                                <button onClick={() => setMainRecipients(mainRecipients.filter(p => p.id !== person.id))} className="hover:text-blue-900">
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                        {mainRecipients.length === 0 && (
                          <div className="text-xs text-gray-400 mt-1">暂未添加人员</div>
                        )}
                      </div>
                    </div>

                    {/* 节点3 - 属地/市部门 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs mr-2">3</span>
                        {approvalFlowType === "local" ? "属地部门" : "市部门"}会签人员
                        <span className="text-xs text-gray-400 ml-2">（人力/财务/云中台/网运部）</span>
                      </label>
                      <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                        <Button variant="outline" size="sm" className="mb-2" onClick={() => setCountersignPersonSelectOpen(true)}>
                          <Plus className="w-4 h-4 mr-1" />
                          添加人员
                        </Button>
                        {countersignUsers.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {countersignUsers.map(person => (
                              <span key={person.id} className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                                {person.name}
                                <button onClick={() => setCountersignUsers(countersignUsers.filter(p => p.id !== person.id))} className="hover:text-orange-900">
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                        {countersignUsers.length === 0 && (
                          <div className="text-xs text-gray-400 mt-1">暂未添加人员</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-3 text-xs text-gray-600">
                    <div className="font-medium text-yellow-700 mb-1">审批人范围：</div>
                    <div>1. ICT前端业务需求部门先同意（如<strong>支局</strong>）</div>
                    <div>2. 经营单元（属地自交付）或市公司（调用市公司能力）的人力、财务、云中台、网运部审批</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 底部按钮 */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2 flex-shrink-0">
            <Button variant="outline" onClick={handleClose}>
              取消
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              提交申请
            </Button>
          </div>
        </div>
      </div>

      {/* 子弹窗 */}
      <ProjectSelectDialog
        open={projectSelectOpen}
        onClose={() => setProjectSelectOpen(false)}
        onSelect={(project) => setSelectedProject(project)}
      />
      <OrderSelectDialog
        open={orderSelectOpen}
        onClose={() => setOrderSelectOpen(false)}
        onSelect={(order) => setSelectedOrder(order)}
      />
      <TripleSelectDialog
        open={tripleSelectOpen}
        onClose={() => setTripleSelectOpen(false)}
        onSelect={(triple) => setSelectedTriple(triple)}
      />
      {/* 主送人员选择弹窗 */}
      <PersonSelectDialog
        open={mainPersonSelectOpen}
        onClose={() => setMainPersonSelectOpen(false)}
        onSelect={(persons) => setMainRecipients(persons)}
        selectedPersons={mainRecipients}
      />
      {/* 抄送人员选择弹窗 */}
      <PersonSelectDialog
        open={ccPersonSelectOpen}
        onClose={() => setCcPersonSelectOpen(false)}
        onSelect={(persons) => setCcUsers(persons)}
        selectedPersons={ccUsers}
      />
    </>
  );
}