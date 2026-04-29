import React from "react";
import { ReportTemplate, ReportColumn, ReportHeaderGroup } from "./ReportTemplate";
import type { ReportConfig } from "./ReportTemplate";

const columns: ReportColumn[] = [
  // 项目信息 (cols 0-5)
  { key: "period", label: "账期", width: 80, groupColor: "bg-gray-50" },
  { key: "city", label: "地市", width: 80, groupColor: "bg-gray-50" },
  { key: "district", label: "区县", width: 80, groupColor: "bg-gray-50" },
  { key: "mainProjectCode", label: "主项编码", width: 130, groupColor: "bg-gray-50" },
  { key: "subProjectCode", label: "子项目编码", width: 130, groupColor: "bg-gray-50" },
  { key: "subProjectName", label: "子项目名称", width: 180, groupColor: "bg-gray-50" },
  // 金额信息 (cols 6-9)
  { key: "costType", label: "直接成本类型", width: 120, groupColor: "bg-blue-50" },
  { key: "taxExemptAmount", label: "不含税金额", width: 120, align: "right", groupColor: "bg-blue-50" },
  { key: "taxRate", label: "税率", width: 80, align: "center", groupColor: "bg-blue-50" },
  { key: "taxAmount", label: "含税金额", width: 120, align: "right", groupColor: "bg-blue-50" },
  // 预算信息 (cols 10-12)
  { key: "budgetCenter", label: "预算责任中心", width: 150, groupColor: "bg-green-50" },
  { key: "budgetIndicator", label: "预算指标", width: 150, groupColor: "bg-green-50" },
  { key: "totalBudget", label: "子项目总体预算", width: 130, align: "right", groupColor: "bg-green-50" },
  // 执行情况 (cols 13-15)
  { key: "onTheWayBudget", label: "在途总体预算金额", width: 130, align: "right", groupColor: "bg-orange-50" },
  { key: "cumulativeExpense", label: "累计支出（不包含在途）", width: 150, align: "right", groupColor: "bg-orange-50" },
  { key: "availableBudget", label: "项目可用总体预算", width: 130, align: "right", groupColor: "bg-orange-50" },
  // 状态 (col 16)
  { key: "subProjectStatus", label: "子项目状态", width: 90, groupColor: "bg-gray-50" },
];

const topGroups: ReportHeaderGroup[] = [
  { label: "项目信息", startCol: 0, span: 6, color: "bg-gray-100" },
  { label: "金额信息", startCol: 6, span: 4, color: "bg-blue-100" },
  { label: "预算信息", startCol: 10, span: 3, color: "bg-green-100" },
  { label: "执行情况", startCol: 13, span: 3, color: "bg-orange-100" },
  { label: "状态", startCol: 16, span: 1, color: "bg-gray-100" },
];

const mockData: Record<string, string | number>[] = [
  {
    period: "2026-03", city: "杭州", district: "西湖区",
    mainProjectCode: "ICTA33010016100341", subProjectCode: "ICTA3301001610034101",
    subProjectName: "浙江日报报业集团IDC",
    costType: "系统集成支出", taxExemptAmount: 134000, taxRate: "6%",
    taxAmount: 142040,
    budgetCenter: "网络运营部（网络与信息安全管理部）",
    budgetIndicator: "CW0402行业数字平台支出",
    totalBudget: 134000, onTheWayBudget: 0, cumulativeExpense: 55707.74,
    availableBudget: 78292.26, subProjectStatus: "未关闭",
  },
  {
    period: "2026-03", city: "宁波", district: "鄞州区",
    mainProjectCode: "ICTA33020016100342", subProjectCode: "ICTA3302001610034201",
    subProjectName: "宁波某医院信息化系统",
    costType: "软件开发支出", taxExemptAmount: 250000, taxRate: "6%",
    taxAmount: 265000,
    budgetCenter: "医疗行业部",
    budgetIndicator: "CW0403医疗信息化支出",
    totalBudget: 250000, onTheWayBudget: 50000, cumulativeExpense: 120000,
    availableBudget: 80000, subProjectStatus: "实施中",
  },
  {
    period: "2026-03", city: "温州", district: "鹿城区",
    mainProjectCode: "ICTA33030016100343", subProjectCode: "ICTA3303001610034301",
    subProjectName: "温州某学校智慧校园",
    costType: "系统集成支出", taxExemptAmount: 180000, taxRate: "6%",
    taxAmount: 190800,
    budgetCenter: "教育行业部",
    budgetIndicator: "CW0404教育信息化支出",
    totalBudget: 180000, onTheWayBudget: 30000, cumulativeExpense: 95000,
    availableBudget: 55000, subProjectStatus: "未关闭",
  },
];

const queryFields = [
  {
    fields: [
      { key: "city", label: "地市", type: "select" as const, options: [
        { label: "杭州", value: "hangzhou" }, { label: "宁波", value: "ningbo" },
        { label: "温州", value: "wenzhou" }
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
      { key: "mainProjectCode", label: "项目编码", type: "text" as const, placeholder: "请输入" },
      { key: "subProjectCode", label: "子项目编码", type: "text" as const, placeholder: "请输入" },
      { key: "subProjectName", label: "子项目名称", type: "text" as const, placeholder: "请输入" },
      { key: "costType", label: "直接成本类型", type: "select" as const, options: [
        { label: "系统集成支出", value: "integration" },
        { label: "软件开发支出", value: "development" },
        { label: "运维服务支出", value: "operation" }
      ]},
      { key: "budgetCenter", label: "预算责任中心", type: "select" as const, options: [
        { label: "网络运营部", value: "network" },
        { label: "医疗行业部", value: "medical" },
        { label: "教育行业部", value: "education" }
      ]},
      { key: "budgetIndicator", label: "预算指标", type: "select" as const, options: [
        { label: "CW0402行业数字平台支出", value: "cw0402" },
        { label: "CW0403医疗信息化支出", value: "cw0403" },
        { label: "CW0404教育信息化支出", value: "cw0404" }
      ]},
      { key: "subProjectStatus", label: "子项目状态", type: "select" as const, options: [
        { label: "未关闭", value: "open" },
        { label: "已关闭", value: "closed" },
        { label: "实施中", value: "implementing" }
      ]},
    ]
  },
  {
    title: "项目金额",
    fields: [
      { key: "taxExemptAmount", label: "子项目不含税金额", type: "number-range" as const },
      { key: "totalBudget", label: "子项目总体预算", type: "number-range" as const },
      { key: "onTheWayBudget", label: "在途总体预算金额", type: "number-range" as const },
      { key: "cumulativeExpense", label: "累计支出（不包含在途）", type: "number-range" as const },
      { key: "availableBudget", label: "项目可用总体预算", type: "number-range" as const },
    ]
  },
];

const config: ReportConfig = {
  title: "ICT项目预算明细",
  description: "ICT项目预算明细查询",
  columns,
  headerGroups: topGroups,
  hasThreeLevelHeader: false,
};

export function IctBudgetDetail() {
  return (
    <ReportTemplate config={config} queryFields={queryFields} data={mockData} />
  );
}
