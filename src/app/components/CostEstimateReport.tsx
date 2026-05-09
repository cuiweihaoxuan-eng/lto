import React from "react";
import { ReportTemplate, ReportColumn, ReportHeaderGroup } from "./ReportTemplate";
import type { ReportConfig } from "./ReportTemplate";

const columns: ReportColumn[] = [
  // 项目基本信息 (cols 0-8)
  { key: "period", label: "账期", width: 90, groupColor: "bg-gray-50" },
  { key: "city", label: "地市", width: 80, groupColor: "bg-gray-50" },
  { key: "district", label: "区县", width: 80, groupColor: "bg-gray-50" },
  { key: "projectCode", label: "项目编号", width: 130, groupColor: "bg-gray-50" },
  { key: "projectName", label: "项目名称", width: 180, groupColor: "bg-gray-50" },
  { key: "projectType", label: "项目类型", width: 100, groupColor: "bg-gray-50" },
  { key: "projectManager", label: "项目经理", width: 90, groupColor: "bg-gray-50" },
  { key: "projectStartTime", label: "立项时间", width: 110, groupColor: "bg-gray-50" },
  { key: "projectStatus", label: "项目状态", width: 90, groupColor: "bg-gray-50" },
  // 产数服务 (cols 9-15)
  { key: "serviceIncomePlan", label: "收入计划", width: 110, align: "right", groupColor: "bg-blue-50" },
  { key: "serviceIncomeActual", label: "实际入收", width: 110, align: "right", groupColor: "bg-blue-50" },
  { key: "serviceIncomeProgress", label: "确收进度", width: 90, align: "right", groupColor: "bg-blue-50" },
  { key: "serviceCostPlan", label: "支出计划", width: 110, align: "right", groupColor: "bg-blue-50" },
  { key: "serviceCostActual", label: "实际支出", width: 110, align: "right", groupColor: "bg-blue-50" },
  { key: "serviceCostProgress", label: "支出进度", width: 90, align: "right", groupColor: "bg-blue-50" },
  { key: "serviceCostDiffRate", label: "收支差异率", width: 100, align: "right", groupColor: "bg-blue-50" },
  // 设备销售 (cols 16-22)
  { key: "equipIncomePlan", label: "收入计划", width: 110, align: "right", groupColor: "bg-green-50" },
  { key: "equipIncomeActual", label: "实际入收", width: 110, align: "right", groupColor: "bg-green-50" },
  { key: "equipIncomeProgress", label: "确收进度", width: 90, align: "right", groupColor: "bg-green-50" },
  { key: "equipCostPlan", label: "支出计划", width: 110, align: "right", groupColor: "bg-green-50" },
  { key: "equipCostActual", label: "实际支出", width: 110, align: "right", groupColor: "bg-green-50" },
  { key: "equipCostProgress", label: "支出进度", width: 90, align: "right", groupColor: "bg-green-50" },
  { key: "equipCostDiffRate", label: "收支差异率", width: 100, align: "right", groupColor: "bg-green-50" },
];

const topGroups: ReportHeaderGroup[] = [
  { label: "项目基本信息", startCol: 0, span: 9, color: "bg-gray-100" },
  { label: "产数服务", startCol: 9, span: 7, color: "bg-blue-100" },
  { label: "设备销售", startCol: 16, span: 7, color: "bg-green-100" },
];

const mockData: Record<string, string | number>[] = [
  {
    period: "2026-03", city: "杭州", district: "西湖区",
    projectCode: "JHTB-2026-001", projectName: "某区政府信息化项目",
    projectType: "政府信息化", projectManager: "张明",
    projectStartTime: "2026-01-15", projectStatus: "实施中",
    serviceIncomePlan: 320, serviceIncomeActual: 280, serviceIncomeProgress: "87.5%",
    serviceCostPlan: 240, serviceCostActual: 200, serviceCostProgress: "83.3%", serviceCostDiffRate: "4.2%",
    equipIncomePlan: 150, equipIncomeActual: 130, equipIncomeProgress: "86.7%",
    equipCostPlan: 100, equipCostActual: 85, equipCostProgress: "85.0%", equipCostDiffRate: "1.7%",
  },
  {
    period: "2026-03", city: "宁波", district: "鄞州区",
    projectCode: "JHTB-2026-002", projectName: "智慧校园建设项目",
    projectType: "教育信息化", projectManager: "李华",
    projectStartTime: "2026-02-01", projectStatus: "实施中",
    serviceIncomePlan: 450, serviceIncomeActual: 400, serviceIncomeProgress: "88.9%",
    serviceCostPlan: 320, serviceCostActual: 290, serviceCostProgress: "90.6%", serviceCostDiffRate: "-1.7%",
    equipIncomePlan: 200, equipIncomeActual: 180, equipIncomeProgress: "90.0%",
    equipCostPlan: 140, equipCostActual: 125, equipCostProgress: "89.3%", equipCostDiffRate: "0.7%",
  },
  {
    period: "2026-03", city: "温州", district: "鹿城区",
    projectCode: "JHTB-2026-003", projectName: "智慧医疗系统项目",
    projectType: "医疗信息化", projectManager: "王芳",
    projectStartTime: "2026-02-20", projectStatus: "实施中",
    serviceIncomePlan: 280, serviceIncomeActual: 250, serviceIncomeProgress: "89.3%",
    serviceCostPlan: 200, serviceCostActual: 180, serviceCostProgress: "90.0%", serviceCostDiffRate: "-0.7%",
    equipIncomePlan: 120, equipIncomeActual: 100, equipIncomeProgress: "83.3%",
    equipCostPlan: 80, equipCostActual: 70, equipCostProgress: "87.5%", equipCostDiffRate: "-4.2%",
  },
];

const queryFields = [
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
      { key: "period", label: "账期", type: "select" as const, options: [
        { label: "2026-03", value: "2026-03" }, { label: "2026-02", value: "2026-02" }
      ]},
    ]
  },
  {
    title: "项目信息",
    fields: [
      { key: "projectCode", label: "项目编码", type: "text" as const, placeholder: "请输入" },
      { key: "projectName", label: "项目名称", type: "text" as const, placeholder: "请输入" },
      { key: "projectType", label: "项目类型", type: "select" as const, options: [
        { label: "政府信息化", value: "zhengwu" }, { label: "教育信息化", value: "jiaoyu" },
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
  {
    title: "产数服务",
    fields: [
      { key: "serviceIncomePlan", label: "收入计划", type: "number-range" as const },
      { key: "serviceIncomeActual", label: "实际入收", type: "number-range" as const },
      { key: "serviceIncomeProgress", label: "确收进度(%)", type: "text" as const, placeholder: "如: 87.5" },
      { key: "serviceCostPlan", label: "支出计划", type: "number-range" as const },
      { key: "serviceCostActual", label: "实际支出", type: "number-range" as const },
      { key: "serviceCostProgress", label: "支出进度(%)", type: "text" as const, placeholder: "如: 83.3" },
      { key: "serviceCostDiffRate", label: "收支差异率(%)", type: "text" as const, placeholder: "如: 4.2" },
      { key: "serviceShouldAmount", label: "应入账金额", type: "number-range" as const },
      { key: "serviceEstimateAmount", label: "暂估金额", type: "number-range" as const },
      { key: "serviceUnestimatedAmount", label: "未估金额", type: "number-range" as const },
      { key: "servicePostingRate", label: "列账率(%)", type: "text" as const, placeholder: "如: 95.0" },
    ]
  },
  {
    title: "设备销售",
    fields: [
      { key: "equipIncomePlan", label: "收入计划", type: "number-range" as const },
      { key: "equipIncomeActual", label: "实际入收", type: "number-range" as const },
      { key: "equipIncomeProgress", label: "确收进度(%)", type: "text" as const, placeholder: "如: 86.7" },
      { key: "equipCostPlan", label: "支出计划", type: "number-range" as const },
      { key: "equipCostActual", label: "实际支出", type: "number-range" as const },
      { key: "equipCostProgress", label: "支出进度(%)", type: "text" as const, placeholder: "如: 85.0" },
      { key: "equipCostDiffRate", label: "收支差异率(%)", type: "text" as const, placeholder: "如: 1.7" },
      { key: "equipShouldAmount", label: "应入账金额", type: "number-range" as const },
      { key: "equipEstimateAmount", label: "暂估金额", type: "number-range" as const },
      { key: "equipUnestimatedAmount", label: "未估金额", type: "number-range" as const },
      { key: "equipPostingRate", label: "列账率(%)", type: "text" as const, placeholder: "如: 95.0" },
    ]
  },
];

const config: ReportConfig = {
  title: "成本暂估列账率报表",
  description: "成本暂估列账率分析",
  columns,
  headerGroups: topGroups,
  hasThreeLevelHeader: false,
};

export function CostEstimateReport() {
  return (
    <ReportTemplate
      config={config}
      queryFields={queryFields}
      data={mockData}
      showDetail={true}
    />
  );
}