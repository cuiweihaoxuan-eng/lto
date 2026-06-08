import React, { useState, useMemo } from "react";
import { Search, RefreshCw, Download, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Pagination } from "./ui/pagination";
import { BusinessPreDemolitionDetailModal } from "./BusinessPreDemolitionDetailModal";

export interface BusinessPreDemolition {
  id: string;
  city: string;
  district: string;
  oppName: string;
  groupOppCode: string;
  oppCreateDate: string;
  stage: string;
  oppStatus: string;
  customerManager: string;
  contractName: string;
  contractCode: string;
  contractAmount: number;
  projectName: string;
  projectCode: string;
  // 预解构数据
  preDemolition: PreDemolitionData;
}

export interface PreDemolitionData {
  // 总表
  totalIncome: TotalIncomeRow[];
  totalContract: TotalContractInfo;
  totalProject: TotalProjectInfo;
  // 硬件
  hardware: HardwareRow[];
  // 软件
  software: SoftwareRow[];
  // 云网资源、服务及标品
  cloudService: CloudServiceRow[];
  // 合同金额分摊
  contractAllocation: ContractAllocationRow[];
  // 业务收入列表
  businessIncome: BusinessIncomeRow[];
  // 里程碑计划
  milestone: MilestoneData;
  // 收入计划
  revenuePlan: RevenuePlanData;
  // 收款计划
  collectionPlan: CollectionPlanData;
  // 附件
  attachments: AttachmentRow[];
}

export interface TotalIncomeRow {
  category: string;
  expectedIncome: number;
  expectedExpense: number;
}

export interface TotalContractInfo {
  contractCode: string;
  contractAmount: number;
  contractType: string;
  ourName: string;
  partyName: string;
  contractPeriod: string;
  contractTarget: string;
}

export interface TotalProjectInfo {
  projectCategory: string;
  hasGuarantee: string;
  hasMaintenance: string;
  hasAudit: string;
  invoiceType: string;
  profitUnit: string;
  projectManager: string;
  controlDept: string;
  customerContact: string;
  contactPhone: string;
  expectedFinishDate: string;
  projectDesc: string;
}

export interface HardwareRow {
  id: string;
  deviceType: string;
  deviceName: string;
  brand: string;
  model: string;
  spec: string;
  unit: string;
  qty: number;
  forwardUnitPrice: number;
  forwardTotal: number;
  backwardUnitPrice: number;
  backwardTotal: number;
  implMethod: string;
  materialCode: string;
  tags: string;
  fundUseMethod: string;
  bizModel: string;
  purchaseMode: string;
  partner: string;
  investBizType: string;
}

export interface SoftwareRow {
  id: string;
  level1: string;
  level2: string;
  level3: string;
  funcDesc: string;
  forwardTotal: number;
  backwardTotal: number;
  implMethod: string;
  productName: string;
  unifiedCode: string;
  tags: string;
  fundUseMethod: string;
  bizModel: string;
  purchaseMode: string;
  acceptMode: string;
  partner: string;
  investBizType: string;
}

export interface CloudServiceRow {
  id: string;
  type: string;
  productName: string;
  specDesc: string;
  vendor: string;
  unit: string;
  qty: number;
  forwardUnitPrice: number;
  forwardTotal: number;
  backwardUnitPrice: number;
  backwardTotal: number;
  implMethod: string;
  productCode: string;
  tags: string;
  fundUseMethod: string;
  purchaseMode: string;
  acceptMode: string;
  partner: string;
  investBizType: string;
}

export interface ContractAllocationRow {
  id: string;
  allocationObject: string;
  backwardSource: string;
  amount: number;
}

export interface BusinessIncomeRow {
  id: string;
  incomeObject: string;
  category: string;
  taxRate: string;
  period: string;
  methodGrossNet: string;
  methodTimePeriod: string;
  bizModel: string;
  methodInputOutput: string;
  contractAllocation: number;
  planConfirmed: number;
}

export interface MilestoneNodeRow {
  name: string;
  expectedDate: string;
}

export interface MilestoneNonPeriodicRow {
  id: string;
  incomeObject: string;
  methodTimePeriod: string;
  methodGrossNet: string;
  bizModel: string;
  methodInputOutput: string;
  contractAllocation: number;
  planConfirmed: number;
  taxRate: string;
  milestone: string;
  date: string;
  period: string;
  allocationObject: string;
}

export interface MilestonePeriodicRow {
  id: string;
  incomeObject: string;
  methodTimePeriod: string;
  methodGrossNet: string;
  bizModel: string;
  methodInputOutput: string;
  contractAllocation: number;
  planConfirmed: number;
  taxRate: string;
  milestoneStart: string;
  milestoneEnd: string;
  startDate: string;
  startPeriod: string;
  allocationObject: string;
}

export interface MilestoneData {
  nodes: MilestoneNodeRow[];
  nonPeriodic: MilestoneNonPeriodicRow[];
  periodic: MilestonePeriodicRow[];
}

export interface RevenuePlanNonPeriodicRow {
  id: string;
  province: string;
  city: string;
  partyName: string;
  profitCenter: string;
  productCode: string;
  productName: string;
  incomeItem: string;
  bizType: string;
  methodGrossNet: string;
  methodTimePeriod: string;
  bizModel: string;
  methodInputOutput: string;
  contractAllocAmount: number;
  contractAllocAmountNoTax: number;
  invoiceType: string;
  taxRate: string;
  discountRate: string;
  taxItem: string;
  rateBandwidth: string;
  planConfirmAmount: number;
  planConfirmAmountNoTax: number;
  expectedConfirmDate: string;
  actualConfirmDate: string;
  milestoneNode: string;
  isNetworkOpen: string;
  incomeTriggerSystem: string;
  modifyTime: string;
  changeType: string;
  subProjectCode: string;
  allocationObject: string;
}

export interface RevenuePlanPeriodicRow {
  id: string;
  province: string;
  city: string;
  partyName: string;
  profitCenter: string;
  productCode: string;
  productName: string;
  incomeItem: string;
  bizType: string;
  methodGrossNet: string;
  methodTimePeriod: string;
  bizModel: string;
  methodInputOutput: string;
  contractAllocAmount: number;
  contractAllocAmountNoTax: number;
  invoiceType: string;
  taxRate: string;
  taxItem: string;
  unitPrice: number;
  qty: number;
  confirmAmount: number;
  confirmAmountNoTax: number;
  startDate: string;
  frequency: number;
  endDate: string;
  confirmTotal: number;
  confirmTotalNoTax: number;
  isNetworkOpen: string;
  incomeTriggerSystem: string;
  modifyTime: string;
  changeType: string;
  subProjectCode: string;
  allocationObject: string;
}

export interface RevenuePlanData {
  nonPeriodic: RevenuePlanNonPeriodicRow[];
  periodic: RevenuePlanPeriodicRow[];
}

export interface CollectionPlanNonPeriodicRow {
  id: string;
  partyName: string;
  seq: number;
  performanceReq: string;
  milestone: string;
  expectedMilestoneDate: string;
  payExtendMonth: number;
  expectedCollectionDate: string;
  contractPayPeriodMonth: number;
  collectionRatio: number;
  collectionAmount: number;
  triggerSystem: string;
  actualMilestoneDate: string;
}

export interface CollectionPlanPeriodicRow {
  id: string;
  partyName: string;
  contractStartDate: string;
  contractEndDate: string;
  periodType: string;
  frequency: number;
  expectedStartDate: string;
  actualStartDate: string;
  contractPayPeriodMonth: number;
  perAmount: number;
  totalAmount: number;
  triggerSystem: string;
}

export interface CollectionPlanData {
  nonPeriodic: CollectionPlanNonPeriodicRow[];
  periodic: CollectionPlanPeriodicRow[];
}

export interface AttachmentRow {
  id: string;
  name: string;
  size: string;
  uploadTime: string;
  uploader: string;
}

// 系统自动生成的模拟数据 - 基于CSV案例ZJ20220317222776
const generatePreDemolitionData = (oppName: string): PreDemolitionData => ({
  totalIncome: [
    { category: "硬件部分", expectedIncome: 28093000, expectedExpense: 27812070 },
    { category: "软件部分", expectedIncome: 11237200, expectedExpense: 9439248 },
    { category: "标品", expectedIncome: 2247440, expectedExpense: 0 },
    { category: "服务_集成服务", expectedIncome: 6742320, expectedExpense: 5730972 },
    { category: "服务_维保服务", expectedIncome: 4775810, expectedExpense: 4537019.5 },
    { category: "服务_其他", expectedIncome: 0, expectedExpense: 0 },
    { category: "云网资源", expectedIncome: 0, expectedExpense: 0 },
    { category: "其他", expectedIncome: 3090230, expectedExpense: 3090230 },
    { category: "合计", expectedIncome: 56186000, expectedExpense: 50609539.5 },
  ],
  totalContract: {
    contractCode: "ZJHAA2221255CGN00",
    contractAmount: 56186000,
    contractType: "C-17",
    ourName: "中国电信股份有限公司杭州分公司",
    partyName: "杭州市大数据管理服务中心(杭州市人民政府电子政务中心)",
    contractPeriod: "2022/10/1",
    contractTarget: "无",
  },
  totalProject: {
    projectCategory: "成本",
    hasGuarantee: "否",
    hasMaintenance: "是",
    hasAudit: "是",
    invoiceType: "增值税专用发票",
    profitUnit: "股份杭州市本部",
    projectManager: "闻婷",
    controlDept: "交通物流行业事业部",
    customerContact: "张三",
    contactPhone: "189********",
    expectedFinishDate: "2025/9/30",
    projectDesc: oppName,
  },
  hardware: [
    {
      id: "h1",
      deviceType: "服务器",
      deviceName: "周界防范分析主机",
      brand: "海康威视",
      model: "iDS-8664NX-I16/S-AT(标配)/大模型",
      spec: "1、存储接口：≥16个SATA接口，支持硬盘热插拔2、视频接口：≥2×HDMI，≥2×VGA3、网络接口：≥2×RJ45 10/100/1000Mbps自适应以太网口4、报警接口：≥16路报警输入，≥9路报警输出",
      unit: "台",
      qty: 1,
      forwardUnitPrice: 0,
      forwardTotal: 0,
      backwardUnitPrice: 0,
      backwardTotal: 0,
      implMethod: "非集采",
      materialCode: "",
      tags: "数据处理与存储,服务器",
      fundUseMethod: "往来款",
      bizModel: "设备自采销售",
      purchaseMode: "不涉及采购",
      partner: "",
      investBizType: "",
    },
  ],
  software: [
    {
      id: "s1",
      level1: "软件开发",
      level2: "智慧交通",
      level3: "智慧交通",
      funcDesc: "智慧交通",
      forwardTotal: 0,
      backwardTotal: 0,
      implMethod: "电信体系外采购",
      productName: "",
      unifiedCode: "",
      tags: "",
      fundUseMethod: "成本",
      bizModel: "定制化软件开发",
      purchaseMode: "公开询比",
      acceptMode: "无需受理",
      partner: "",
      investBizType: "",
    },
  ],
  cloudService: [
    { id: "c1", type: "标品", productName: "组网专线", specDesc: "500M", vendor: "电信", unit: "条", qty: 1, forwardUnitPrice: 0, forwardTotal: 0, backwardUnitPrice: 0, backwardTotal: 0, implMethod: "电信自有", productCode: "", tags: "", fundUseMethod: "不涉及付现支出", purchaseMode: "不涉及采购", acceptMode: "CRM受理", partner: "", investBizType: "" },
    { id: "c2", type: "集成服务", productName: "设备集成", specDesc: "满足客户需要", vendor: "其他", unit: "项", qty: 1, forwardUnitPrice: 0, forwardTotal: 0, backwardUnitPrice: 0, backwardTotal: 0, implMethod: "外采", productCode: "", tags: "成本", fundUseMethod: "成本", purchaseMode: "公开询比", acceptMode: "CRM受理", partner: "", investBizType: "" },
    { id: "c3", type: "维保服务", productName: "平台维护", specDesc: "3年维保", vendor: "其他", unit: "项", qty: 1, forwardUnitPrice: 0, forwardTotal: 0, backwardUnitPrice: 0, backwardTotal: 0, implMethod: "外采", productCode: "", tags: "成本", fundUseMethod: "成本", purchaseMode: "不涉及采购", acceptMode: "CRM受理", partner: "", investBizType: "" },
    { id: "c4", type: "其他", productName: "施工", specDesc: "线路施工", vendor: "其他", unit: "项", qty: 1, forwardUnitPrice: 0, forwardTotal: 0, backwardUnitPrice: 0, backwardTotal: 0, implMethod: "外采", productCode: "", tags: "往来款", fundUseMethod: "往来款", purchaseMode: "不涉及采购", acceptMode: "CRM受理", partner: "", investBizType: "" },
  ],
  contractAllocation: Array.from({ length: 10 }, (_, i) => ({
    id: `a${i + 1}`,
    allocationObject: "0",
    backwardSource: "0",
    amount: 0,
  })),
  businessIncome: Array.from({ length: 10 }, (_, i) => ({
    id: `b${i + 1}`,
    incomeObject: "0",
    category: "0",
    taxRate: "0%",
    period: "非周期性",
    methodGrossNet: "0",
    methodTimePeriod: "0",
    bizModel: "0",
    methodInputOutput: "0",
    contractAllocation: 0,
    planConfirmed: 0,
  })),
  milestone: {
    nodes: [
      { name: "合同签订", expectedDate: "2022/1/10" },
      { name: "初验", expectedDate: "" },
      { name: "终验", expectedDate: "" },
      { name: "维保到期", expectedDate: "" },
    ],
    nonPeriodic: Array.from({ length: 7 }, (_, i) => ({
      id: `mn${i + 1}`,
      incomeObject: "0",
      methodTimePeriod: "0",
      methodGrossNet: "0",
      bizModel: "0",
      methodInputOutput: "0",
      contractAllocation: 0,
      planConfirmed: 0,
      taxRate: "0%",
      milestone: "0",
      date: "",
      period: i < 2 ? "202201" : i < 4 ? "202203" : "202205",
      allocationObject: "",
    })),
    periodic: Array.from({ length: 3 }, () => ({
      id: `mp${Math.random()}`,
      incomeObject: "",
      methodTimePeriod: "",
      methodGrossNet: "",
      bizModel: "",
      methodInputOutput: "",
      contractAllocation: 0,
      planConfirmed: 0,
      taxRate: "0%",
      milestoneStart: "",
      milestoneEnd: "",
      startDate: "",
      startPeriod: "202203",
      allocationObject: "",
    })),
  },
  revenuePlan: {
    nonPeriodic: [
      { id: "rn1", province: "浙江省", city: "杭州市", partyName: "杭州市大数据管理服务中心(杭州市人民政府电子政务中心)", profitCenter: "股份杭州市本部", productCode: "JTSJCP03006", productName: "0", incomeItem: "0", bizType: "0", methodGrossNet: "0", methodTimePeriod: "0", bizModel: "0", methodInputOutput: "0", contractAllocAmount: 0, contractAllocAmountNoTax: 0, invoiceType: "增值税专用发票", taxRate: "0%", discountRate: "", taxItem: "0", rateBandwidth: "", planConfirmAmount: 0, planConfirmAmountNoTax: 0, expectedConfirmDate: "", actualConfirmDate: "", milestoneNode: "0", isNetworkOpen: "0", incomeTriggerSystem: "0", modifyTime: "", changeType: "", subProjectCode: "", allocationObject: "" },
      { id: "rn2", province: "浙江省", city: "杭州市", partyName: "杭州市大数据管理服务中心(杭州市人民政府电子政务中心)", profitCenter: "股份杭州市本部", productCode: "JTSJCP02078", productName: "0", incomeItem: "0", bizType: "0", methodGrossNet: "0", methodTimePeriod: "0", bizModel: "0", methodInputOutput: "0", contractAllocAmount: 0, contractAllocAmountNoTax: 0, invoiceType: "增值税专用发票", taxRate: "0%", discountRate: "", taxItem: "0", rateBandwidth: "", planConfirmAmount: 0, planConfirmAmountNoTax: 0, expectedConfirmDate: "", actualConfirmDate: "", milestoneNode: "0", isNetworkOpen: "0", incomeTriggerSystem: "0", modifyTime: "", changeType: "", subProjectCode: "", allocationObject: "" },
      { id: "rn3", province: "浙江省", city: "杭州市", partyName: "杭州市大数据管理服务中心(杭州市人民政府电子政务中心)", profitCenter: "股份杭州市本部", productCode: "JTSJCP02068", productName: "0", incomeItem: "0", bizType: "0", methodGrossNet: "0", methodTimePeriod: "0", bizModel: "0", methodInputOutput: "0", contractAllocAmount: 0, contractAllocAmountNoTax: 0, invoiceType: "增值税专用发票", taxRate: "0%", discountRate: "", taxItem: "0", rateBandwidth: "", planConfirmAmount: 0, planConfirmAmountNoTax: 0, expectedConfirmDate: "", actualConfirmDate: "", milestoneNode: "0", isNetworkOpen: "0", incomeTriggerSystem: "0", modifyTime: "", changeType: "", subProjectCode: "", allocationObject: "" },
    ],
    periodic: [
      { id: "rp1", province: "浙江省", city: "杭州市", partyName: "杭州市大数据管理服务中心(杭州市人民政府电子政务中心)", profitCenter: "股份杭州市本部", productCode: "JTSJCP02041", productName: "0", incomeItem: "0", bizType: "0", methodGrossNet: "0", methodTimePeriod: "0", bizModel: "0", methodInputOutput: "0", contractAllocAmount: 0, contractAllocAmountNoTax: 0, invoiceType: "增值税专用发票", taxRate: "0%", taxItem: "0", unitPrice: 0, qty: 0, confirmAmount: 0, confirmAmountNoTax: 0, startDate: "", frequency: 0, endDate: "", confirmTotal: 0, confirmTotalNoTax: 0, isNetworkOpen: "0", incomeTriggerSystem: "0", modifyTime: "", changeType: "", subProjectCode: "", allocationObject: "0" },
    ],
  },
  collectionPlan: {
    nonPeriodic: [
      { id: "cn1", partyName: "杭州市大数据管理服务中心(杭州市人民政府电子政务中心)", seq: 1, performanceReq: "预付款", milestone: "0", expectedMilestoneDate: "", payExtendMonth: 1, expectedCollectionDate: "", contractPayPeriodMonth: 1, collectionRatio: 10, collectionAmount: 5618600, triggerSystem: "", actualMilestoneDate: "" },
      { id: "cn2", partyName: "杭州市大数据管理服务中心(杭州市人民政府电子政务中心)", seq: 2, performanceReq: "初验款", milestone: "0", expectedMilestoneDate: "", payExtendMonth: 1, expectedCollectionDate: "", contractPayPeriodMonth: 1, collectionRatio: 20, collectionAmount: 11237200, triggerSystem: "", actualMilestoneDate: "" },
      { id: "cn3", partyName: "杭州市大数据管理服务中心(杭州市人民政府电子政务中心)", seq: 3, performanceReq: "验收款", milestone: "0", expectedMilestoneDate: "", payExtendMonth: 1, expectedCollectionDate: "", contractPayPeriodMonth: 1, collectionRatio: 20, collectionAmount: 11237200, triggerSystem: "", actualMilestoneDate: "" },
    ],
    periodic: [
      { id: "cp1", partyName: "0", contractStartDate: "", contractEndDate: "", periodType: "月", frequency: 13, expectedStartDate: "2022/6/30", actualStartDate: "", contractPayPeriodMonth: 1, perAmount: 0, totalAmount: 0, triggerSystem: "" },
    ],
  },
  attachments: [
    { id: "at1", name: "合同扫描件.pdf", size: "2.4 MB", uploadTime: "2026-05-30 14:23", uploader: "谢邦亮" },
    { id: "at2", name: "业务解构说明.docx", size: "1.1 MB", uploadTime: "2026-05-30 15:10", uploader: "谢邦亮" },
  ],
});

// 系统自动生成的商机列表（mock）
const mockList: BusinessPreDemolition[] = [
  {
    id: "1",
    city: "台州市",
    district: "临海市",
    oppName: "鑫港海鲜餐饮连锁店智能化改造项目",
    groupOppCode: "ZJ20220317222776",
    oppCreateDate: "2026-05-30 18:49",
    stage: "已签约",
    oppStatus: "ICT业务",
    customerManager: "谢邦亮",
    contractName: "鑫港海鲜餐饮连锁店智能化升级改造项目合同",
    contractCode: "ZJTZA2605712CGN00",
    contractAmount: 33.00,
    projectName: "鑫港海鲜餐饮连锁店智能化升级改造项目",
    projectCode: "XYJAZJTZA260500871",
    preDemolition: generatePreDemolitionData("鑫港海鲜餐饮连锁店智能化改造项目"),
  },
  {
    id: "2",
    city: "杭州市",
    district: "西湖区",
    oppName: "杭州市大数据管理服务中心政务云扩容项目",
    groupOppCode: "ZJ20220930145682",
    oppCreateDate: "2022-09-30 10:15",
    stage: "已签约",
    oppStatus: "ICT业务",
    customerManager: "闻婷",
    contractName: "杭州市政务云平台扩容项目合同",
    contractCode: "ZJHAA2221255CGN00",
    contractAmount: 5618.60,
    projectName: "杭州市政务云平台扩容项目",
    projectCode: "XYHZ20220930001",
    preDemolition: generatePreDemolitionData("杭州市政务云平台扩容项目"),
  },
  {
    id: "3",
    city: "宁波市",
    district: "鄞州区",
    oppName: "宁波港智慧物流园区ICT基础设施建设项目",
    groupOppCode: "ZJ20230115234001",
    oppCreateDate: "2023-01-15 09:30",
    stage: "商机录入",
    oppStatus: "跟进中",
    customerManager: "洪婷婷",
    contractName: "-",
    contractCode: "-",
    contractAmount: 0,
    projectName: "-",
    projectCode: "-",
    preDemolition: generatePreDemolitionData("宁波港智慧物流园区ICT基础设施建设项目"),
  },
  {
    id: "4",
    city: "温州市",
    district: "鹿城区",
    oppName: "温州医科大学附属第一医院信息化升级项目",
    groupOppCode: "ZJ20230422096521",
    oppCreateDate: "2023-04-22 14:20",
    stage: "已签约",
    oppStatus: "ICT业务",
    customerManager: "陈思远",
    contractName: "温州医科大学附属第一医院信息化升级项目合同",
    contractCode: "ZJTZA2304220CGN00",
    contractAmount: 1280.50,
    projectName: "温州医科大学附属第一医院信息化升级项目",
    projectCode: "XYWZ20230422001",
    preDemolition: generatePreDemolitionData("温州医科大学附属第一医院信息化升级项目"),
  },
  {
    id: "5",
    city: "嘉兴市",
    district: "南湖区",
    oppName: "嘉兴市政府数字化办公平台项目",
    groupOppCode: "ZJ20230718067845",
    oppCreateDate: "2023-07-18 11:08",
    stage: "方案制定",
    oppStatus: "跟进中",
    customerManager: "李明华",
    contractName: "-",
    contractCode: "-",
    contractAmount: 0,
    projectName: "-",
    projectCode: "-",
    preDemolition: generatePreDemolitionData("嘉兴市政府数字化办公平台项目"),
  },
  {
    id: "6",
    city: "绍兴市",
    district: "越城区",
    oppName: "绍兴市智慧文旅大数据平台建设项目",
    groupOppCode: "ZJ20231025091234",
    oppCreateDate: "2023-10-25 16:42",
    stage: "已签约",
    oppStatus: "ICT业务",
    customerManager: "赵晓燕",
    contractName: "绍兴市智慧文旅大数据平台建设项目合同",
    contractCode: "ZJTZA2310250CGN00",
    contractAmount: 866.30,
    projectName: "绍兴市智慧文旅大数据平台建设项目",
    projectCode: "XYSX20231025001",
    preDemolition: generatePreDemolitionData("绍兴市智慧文旅大数据平台建设项目"),
  },
  {
    id: "7",
    city: "金华市",
    district: "婺城区",
    oppName: "金华职业技术学院智慧校园建设ICT项目",
    groupOppCode: "ZJ20240108112456",
    oppCreateDate: "2024-01-08 09:55",
    stage: "商机录入",
    oppStatus: "跟进中",
    customerManager: "王建国",
    contractName: "-",
    contractCode: "-",
    contractAmount: 0,
    projectName: "-",
    projectCode: "-",
    preDemolition: generatePreDemolitionData("金华职业技术学院智慧校园建设ICT项目"),
  },
  {
    id: "8",
    city: "衢州市",
    district: "柯城区",
    oppName: "衢州市智慧农业大数据监测平台项目",
    groupOppCode: "ZJ20240320087654",
    oppCreateDate: "2024-03-20 13:20",
    stage: "已签约",
    oppStatus: "ICT业务",
    customerManager: "刘晓东",
    contractName: "衢州市智慧农业大数据监测平台项目合同",
    contractCode: "ZJTZA2403200CGN00",
    contractAmount: 458.80,
    projectName: "衢州市智慧农业大数据监测平台项目",
    projectCode: "XYQZ20240320001",
    preDemolition: generatePreDemolitionData("衢州市智慧农业大数据监测平台项目"),
  },
];

export function BusinessPreDemolitionList() {
  const [searchKey, setSearchKey] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [searchContractCode, setSearchContractCode] = useState("");
  const [searchProjectCode, setSearchProjectCode] = useState("");
  const [stageFilter, setStageFilter] = useState("全部");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [detailId, setDetailId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return mockList.filter(item => {
      if (searchKey && !item.oppName.includes(searchKey) && !item.groupOppCode.includes(searchKey)) return false;
      if (searchCity && !item.city.includes(searchCity)) return false;
      if (searchContractCode && !item.contractCode.includes(searchContractCode)) return false;
      if (searchProjectCode && !item.projectCode.includes(searchProjectCode)) return false;
      if (stageFilter !== "全部" && item.stage !== stageFilter) return false;
      if (statusFilter !== "全部" && item.oppStatus !== statusFilter) return false;
      return true;
    });
  }, [searchKey, searchCity, searchContractCode, searchProjectCode, stageFilter, statusFilter]);

  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const detail = mockList.find(i => i.id === detailId) || null;

  const stageOptions = Array.from(new Set(mockList.map(i => i.stage)));
  const statusOptions = Array.from(new Set(mockList.map(i => i.oppStatus)));

  const formatAmount = (amt: number) => {
    if (!amt) return "-";
    return amt.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleReset = () => {
    setSearchKey("");
    setSearchCity("");
    setSearchContractCode("");
    setSearchProjectCode("");
    setStageFilter("全部");
    setStatusFilter("全部");
    setCurrentPage(1);
  };

  const getStageBadge = (stage: string) => {
    const styles: Record<string, string> = {
      "已签约": "bg-green-100 text-green-700",
      "商机录入": "bg-blue-100 text-blue-700",
      "方案制定": "bg-yellow-100 text-yellow-700",
    };
    return styles[stage] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 页面标题 */}
      <div className="px-6 pt-6 pb-0 flex-shrink-0">
        <h2 className="text-lg font-medium text-gray-900">业务预解构</h2>
        <p className="text-sm text-gray-500 mt-1">系统自动生成业务预解构数据，可点击查看并编辑</p>
      </div>

      {/* 查询条件区域 */}
      <div className="px-6 mt-4 flex-shrink-0">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-4 gap-x-6 gap-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">商机名称/编码</label>
              <Input placeholder="请输入" value={searchKey} onChange={e => setSearchKey(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">地市</label>
              <Input placeholder="请输入" value={searchCity} onChange={e => setSearchCity(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">合同编码</label>
              <Input placeholder="请输入" value={searchContractCode} onChange={e => setSearchContractCode(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">项目编码</label>
              <Input placeholder="请输入" value={searchProjectCode} onChange={e => setSearchProjectCode(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">阶段</label>
              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="全部">全部</SelectItem>
                  {stageOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">商机状态</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="全部">全部</SelectItem>
                  {statusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end items-center pt-4 border-t border-gray-100">
            <div className="flex gap-2">
              <Button variant="outline" className="gap-1" onClick={handleReset}>
                <RefreshCw className="w-4 h-4" />
                重置
              </Button>
              <Button className="gap-1" onClick={() => setCurrentPage(1)}>
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
          共 <span className="font-medium text-gray-900">{filtered.length}</span> 条记录
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1">
            <Download className="w-4 h-4" />
            导出
          </Button>
        </div>
      </div>

      {/* 表格 */}
      <div className="flex-1 overflow-hidden px-6 pb-6">
        <div className="h-full bg-white rounded-lg border border-gray-200 overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-12">序号</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">地市</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-24">区县</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 min-w-[200px]">商机名称</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-40">集团商机i编码</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-600 w-36">商机创建日期</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-600 w-20">阶段</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">商机状态</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-24">客户经理</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 min-w-[200px]">合同名称</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-44">合同编码</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-600 w-32">合同金额(万元)</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 min-w-[200px]">项目名称</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-44">项目编码</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-24 bg-gray-50 sticky right-0 z-20">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paged.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-3 py-3">{(currentPage - 1) * pageSize + idx + 1}</td>
                  <td className="px-3 py-3">{item.city}</td>
                  <td className="px-3 py-3">{item.district}</td>
                  <td className="px-3 py-3 text-blue-600 max-w-[200px] truncate" title={item.oppName}>{item.oppName}</td>
                  <td className="px-3 py-3">{item.groupOppCode}</td>
                  <td className="px-3 py-3 text-center">{item.oppCreateDate}</td>
                  <td className="px-3 py-3 text-center">
                    <Badge className={getStageBadge(item.stage)}>{item.stage}</Badge>
                  </td>
                  <td className="px-3 py-3">{item.oppStatus}</td>
                  <td className="px-3 py-3">{item.customerManager}</td>
                  <td className="px-3 py-3 max-w-[200px] truncate" title={item.contractName}>{item.contractName}</td>
                  <td className="px-3 py-3">{item.contractCode}</td>
                  <td className="px-3 py-3 text-right">{formatAmount(item.contractAmount)}</td>
                  <td className="px-3 py-3 max-w-[200px] truncate" title={item.projectName}>{item.projectName}</td>
                  <td className="px-3 py-3">{item.projectCode}</td>
                  <td className="px-3 py-3 bg-gray-50 sticky right-0 z-10">
                    <Button variant="link" size="sm" className="text-blue-600 h-auto p-0 flex items-center gap-1 whitespace-nowrap" onClick={() => setDetailId(item.id)}>
                      <Eye className="w-3 h-3" />查看详情
                    </Button>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={15} className="px-3 py-8 text-center text-gray-500">
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 分页 */}
      <div className="px-6 pb-4 flex-shrink-0 flex justify-end">
        <Pagination
          current={currentPage}
          total={filtered.length}
          pageSize={pageSize}
          onChange={(p) => setCurrentPage(p)}
          onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }}
        />
      </div>

      {/* 详情/编辑弹窗 */}
      {detail && (
        <BusinessPreDemolitionDetailModal
          open={!!detailId}
          onOpenChange={(o) => { if (!o) setDetailId(null); }}
          data={detail}
        />
      )}
    </div>
  );
}
