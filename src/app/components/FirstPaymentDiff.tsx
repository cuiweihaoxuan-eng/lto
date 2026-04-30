import React from "react";
import { ReportTemplate, ReportColumn, ReportHeaderGroup } from "./ReportTemplate";
import type { ReportConfig } from "./ReportTemplate";

const allColumns: ReportColumn[] = [
  // 项目基本信息
  { key: "currentPeriod", label: "当前账期", width: 100 },
  { key: "city", label: "地市", width: 80 },
  { key: "district", label: "区县", width: 80 },
  { key: "projectCode", label: "项目编号", width: 130 },
  { key: "projectName", label: "项目名称", width: 180 },
  { key: "projectType", label: "项目类型", width: 100 },
  { key: "projectManager", label: "项目经理", width: 90 },
  { key: "projectStartTime", label: "立项时点", width: 110 },
  { key: "projectStatus", label: "项目状态", width: 90 },
  // 收款
  { key: "contractAmount", label: "项目总金额（含税）", width: 140, align: "right", groupColor: "bg-teal-50" },
  { key: "receivedAmount", label: "项目累计实收金额", width: 140, align: "right", groupColor: "bg-teal-50" },
  { key: "receiveProgress", label: "收款进度", width: 100, align: "right", groupColor: "bg-teal-50" },
  { key: "receivableBasedOnContract", label: "基于合同金额的累计应收款项", width: 160, align: "right", groupColor: "bg-teal-50" },
  // 付款
  { key: "paymentPlanAmount", label: "项目计划支出总金额（含税）", width: 160, align: "right", groupColor: "bg-green-50" },
  { key: "paidAmount", label: "项目累计付款金额", width: 140, align: "right", groupColor: "bg-green-50" },
  { key: "paymentProgress", label: "付款进度", width: 100, align: "right", groupColor: "bg-green-50" },
  { key: "payableBasedOnContract", label: "基于合同金额的累计应付款项", width: 160, align: "right", groupColor: "bg-green-50" },
  // 进度差异
  { key: "paymentDiffRate", label: "收付款进度差异率", width: 130, align: "right", groupColor: "bg-orange-50" },
  { key: "netCashFlow", label: "净现金流", width: 110, align: "right", groupColor: "bg-orange-50" },
  { key: "invoicedAmount", label: "累计已开票金额（含税）", width: 150, align: "right", groupColor: "bg-orange-50" },
  { key: "invoicedNotReceived", label: "累计已开票未收款金额（含税）", width: 170, align: "right", groupColor: "bg-orange-50" },
];

const topGroups: ReportHeaderGroup[] = [
  { label: "项目基本信息", startCol: 0, span: 9, color: "bg-gray-100" },
  { label: "收款", startCol: 9, span: 4, color: "bg-teal-100" },
  { label: "付款", startCol: 13, span: 4, color: "bg-green-100" },
  { label: "进度差异", startCol: 17, span: 4, color: "bg-orange-100" },
];

const mockData: Record<string, string | number>[] = [
  {
    currentPeriod: "2026-03", city: "杭州", district: "西湖区",
    projectCode: "JHTB-2026-001", projectName: "某区政府信息化项目",
    projectType: "政府信息化", projectManager: "张明",
    projectStartTime: "2026-01-15", projectStatus: "实施中",
    contractAmount: 580, receivedAmount: 300, receiveProgress: "51.7%",
    receivableBasedOnContract: 406,
    paymentPlanAmount: 420, paidAmount: 280, paymentProgress: "66.7%",
    payableBasedOnContract: 140,
    paymentDiffRate: "15.0%", netCashFlow: 20, invoicedAmount: 350, invoicedNotReceived: 50,
  },
  {
    currentPeriod: "2026-03", city: "宁波", district: "鄞州区",
    projectCode: "JHTB-2026-002", projectName: "智慧校园建设项目",
    projectType: "教育信息化", projectManager: "李华",
    projectStartTime: "2026-02-01", projectStatus: "实施中",
    contractAmount: 800, receivedAmount: 400, receiveProgress: "50.0%",
    receivableBasedOnContract: 560,
    paymentPlanAmount: 580, paidAmount: 380, paymentProgress: "65.5%",
    payableBasedOnContract: 200,
    paymentDiffRate: "15.5%", netCashFlow: 20, invoicedAmount: 450, invoicedNotReceived: 50,
  },
  {
    currentPeriod: "2026-03", city: "温州", district: "鹿城区",
    projectCode: "JHTB-2026-003", projectName: "智慧医疗系统项目",
    projectType: "医疗信息化", projectManager: "王芳",
    projectStartTime: "2026-02-20", projectStatus: "实施中",
    contractAmount: 350, receivedAmount: 150, receiveProgress: "42.9%",
    receivableBasedOnContract: 245,
    paymentPlanAmount: 250, paidAmount: 160, paymentProgress: "64.0%",
    payableBasedOnContract: 90,
    paymentDiffRate: "21.1%", netCashFlow: -10, invoicedAmount: 180, invoicedNotReceived: 30,
  },
];

const queryFields = [
  // 基础信息 - 默认展示（不显示分组标题）
  {
    fields: [
      { key: "city", label: "地市", type: "select" as const, options: [
        { label: "杭州", value: "hangzhou" }, { label: "宁波", value: "ningbo" },
        { label: "温州", value: "wenzhou" }, { label: "金华", value: "jinhua" }
      ]},
      { key: "district", label: "区县", type: "select" as const, options: [
        { label: "西湖区", value: "xihu" }, { label: "鄞州区", value: "yinzhou" },
        { label: "鹿城区", value: "lucheng" }
      ]},
      { key: "accountBook", label: "帐套", type: "select" as const, options: [
        { label: "股份公司", value: "gufen" }, { label: "信产公司", value: "xinchan" }
      ]},
      { key: "oppCode", label: "商机编码", type: "text" as const, placeholder: "请输入" },
      { key: "customerDept", label: "客户管控部门名称", type: "select" as const, options: [
        { label: "政企客户部", value: "zhengqi" }, { label: "教育行业部", value: "jiaoyu" },
        { label: "医疗行业部", value: "yiliao" }
      ]},
    ]
  },
  // 项目信息 - 需展开
  {
    title: "项目信息",
    fields: [
      { key: "projectCode", label: "项目编码", type: "text" as const, placeholder: "请输入" },
      { key: "projectName", label: "项目名称", type: "text" as const, placeholder: "请输入" },
      { key: "projectType", label: "项目类型", type: "select" as const, options: [
        { label: "政务信息化", value: "zhengwu" }, { label: "教育信息化", value: "jiaoyu" },
        { label: "医疗信息化", value: "yiliao" }
      ]},
      { key: "projectTime", label: "立项时间", type: "date-range" as const },
      { key: "projectAmount", label: "项目总金额", type: "number-range" as const },
      { key: "projectStatus", label: "项目状态", type: "select" as const, options: [
        { label: "实施中", value: "shishi" }, { label: "已完成", value: "wancheng" }
      ]},
      { key: "projectManager", label: "项目经理", type: "text" as const, placeholder: "请输入" },
    ]
  },
  // 合同信息 - 需展开
  {
    title: "合同信息",
    fields: [
      { key: "contractCode", label: "合同编码", type: "text" as const, placeholder: "请输入" },
      { key: "contractName", label: "合同名称", type: "text" as const, placeholder: "请输入" },
      { key: "contractType", label: "合同类型", type: "select" as const, options: [
        { label: "框架合同", value: "kuangjia" }, { label: "项目合同", value: "xiangmu" }
      ]},
      { key: "signDate", label: "合同签约日期", type: "date-range" as const },
      { key: "signAmount", label: "合同签约金额", type: "number-range" as const },
      { key: "contractStartDate", label: "合同履行开始日期", type: "date-range" as const },
      { key: "contractEndDate", label: "合同履行结束日期", type: "date-range" as const },
    ]
  },
  // 进度情况 - 需展开
  {
    title: "进度情况",
    fields: [
      { key: "contractAmount", label: "项目总金额（含税）", type: "number-range" as const },
      { key: "paymentPlanAmount", label: "项目计划支出总金额（含税）", type: "number-range" as const },
      { key: "receiveProgress", label: "收款进度", type: "text" as const, placeholder: "如: 51.7", showPercent: true },
      { key: "paymentProgress", label: "付款进度", type: "text" as const, placeholder: "如: 66.7", showPercent: true },
      { key: "receivableBasedOnContract", label: "基于合同金额的累计应收款项", type: "number-range" as const },
      { key: "payableBasedOnContract", label: "基于合同金额的累计应付款项", type: "number-range" as const },
      { key: "paymentDiffRate", label: "收付款进度差异率", type: "text" as const, placeholder: "如: 15.0", showPercent: true },
    ]
  },
];

const config: ReportConfig = {
  title: "收款与付款进度差异报表",
  description: "项目收款与付款进度差异预警分析",
  columns: allColumns,
  headerGroups: topGroups,
  hasThreeLevelHeader: false,
};

export function FirstPaymentDiff() {
  return (
    <ReportTemplate
      config={config}
      queryFields={queryFields}
      data={mockData}
      showDetail={true}
    />
  );
}
