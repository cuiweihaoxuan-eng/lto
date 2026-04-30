import React, { useState } from "react";
import { ReportTemplate, ReportColumn, ReportHeaderGroup } from "./ReportTemplate";
import type { ReportConfig } from "./ReportTemplate";

const allColumns: ReportColumn[] = [
  // 项目基本信息 0-14
  { key: "currentPeriod", label: "当前账期", width: 100 },
  { key: "city", label: "地市", width: 80 },
  { key: "district", label: "区县", width: 80 },
  { key: "projectCode", label: "项目编号", width: 130 },
  { key: "projectName", label: "项目名称", width: 180 },
  { key: "projectType", label: "项目类型", width: 100 },
  { key: "projectManager", label: "项目经理", width: 90 },
  { key: "projectStartTime", label: "立项时间", width: 110 },
  { key: "projectStatus", label: "项目状态", width: 90 },
  { key: "contractCode", label: "合同编码", width: 130 },
  { key: "contractName", label: "合同名称", width: 180 },
  { key: "contractType", label: "合同类型", width: 100 },
  { key: "contractStatus", label: "合同状态", width: 90 },
  { key: "contractStartTime", label: "合同履行开始时间", width: 130 },
  { key: "contractEndTime", label: "合同履行结束时间", width: 130 },
  // 项目差异情况 15-26
  { key: "projectDiffAmount", label: "项目差异额", width: 110, align: "right", groupColor: "bg-orange-50" },
  { key: "projectDiffRate", label: "项目差异率", width: 100, align: "right", groupColor: "bg-orange-50" },
  { key: "basicDiffAmount", label: "基本面差异额", width: 110, align: "right", groupColor: "bg-orange-50" },
  { key: "basicDiffRate", label: "基本面差异率", width: 100, align: "right", groupColor: "bg-orange-50" },
  { key: "serviceDiffAmount", label: "服务差异额", width: 110, align: "right", groupColor: "bg-orange-50" },
  { key: "serviceDiffRate", label: "服务差异率", width: 100, align: "right", groupColor: "bg-orange-50" },
  { key: "productDiffAmount", label: "标品差异额", width: 110, align: "right", groupColor: "bg-orange-50" },
  { key: "productDiffRate", label: "标品差异率", width: 100, align: "right", groupColor: "bg-orange-50" },
  { key: "equipDiffAmount", label: "设备销售/租赁差异额", width: 130, align: "right", groupColor: "bg-orange-50" },
  { key: "equipDiffRate", label: "设备销售/租赁差异率", width: 130, align: "right", groupColor: "bg-orange-50" },
  { key: "otherDiffAmount", label: "代收代付差异额", width: 120, align: "right", groupColor: "bg-orange-50" },
  { key: "otherDiffRate", label: "代收代付差异率", width: 110, align: "right", groupColor: "bg-orange-50" },
  // 累计到期收入计划 27-31
  { key: "planBasic", label: "基本面收入", width: 120, align: "right", groupColor: "bg-blue-50" },
  { key: "planService", label: "产数服务", width: 120, align: "right", groupColor: "bg-blue-50" },
  { key: "planProduct", label: "产数标品", width: 120, align: "right", groupColor: "bg-blue-50" },
  { key: "planEquip", label: "设备销售/租赁", width: 130, align: "right", groupColor: "bg-blue-50" },
  { key: "planOther", label: "代收代付", width: 110, align: "right", groupColor: "bg-blue-50" },
  // 项目实际收入 32-37
  { key: "actualTotal", label: "项目实际收入总金额", width: 140, align: "right", groupColor: "bg-green-50" },
  { key: "actualBasic", label: "项目实际基本面收入", width: 140, align: "right", groupColor: "bg-green-50" },
  { key: "actualService", label: "项目实际产数服务", width: 130, align: "right", groupColor: "bg-green-50" },
  { key: "actualProduct", label: "项目实际产数标品", width: 130, align: "right", groupColor: "bg-green-50" },
  { key: "actualEquip", label: "项目实际设备销售/租赁", width: 150, align: "right", groupColor: "bg-green-50" },
  { key: "actualOther", label: "项目实际代收代付", width: 130, align: "right", groupColor: "bg-green-50" },
];

const topGroups: ReportHeaderGroup[] = [
  { label: "项目基本信息", startCol: 0, span: 15, color: "bg-gray-100" },
  { label: "项目差异情况", startCol: 15, span: 12, color: "bg-orange-100" },
  { label: "累计到期收入计划", startCol: 27, span: 5, color: "bg-blue-100" },
  { label: "项目实际收入", startCol: 32, span: 6, color: "bg-green-100" },
];

const mockData: Record<string, string | number>[] = [
  {
    currentPeriod: "2026-03", city: "杭州", district: "西湖区",
    projectCode: "JHTB-2026-001", projectName: "某区政府信息化项目",
    projectType: "政府信息化", projectManager: "张明",
    projectStartTime: "2026-01-15", projectStatus: "实施中",
    contractCode: "HT-2026-001", contractName: "政务云服务合同",
    contractType: "框架合同", contractStatus: "执行中",
    contractStartTime: "2026-02-01", contractEndTime: "2026-12-31",
    projectDiffAmount: -42, projectDiffRate: "-7.2%",
    basicDiffAmount: -25, basicDiffRate: "-6.5%",
    serviceDiffAmount: -10, serviceDiffRate: "-7.4%",
    productDiffAmount: -5, productDiffRate: "-7.1%",
    equipDiffAmount: -2, equipDiffRate: "-8.0%",
    otherDiffAmount: 0, otherDiffRate: "0%",
    planBasic: 385, planService: 135, planProduct: 70, planEquip: 100, planOther: 20,
    actualTotal: 540, actualBasic: 360, actualService: 125, actualProduct: 65, actualEquip: 90, actualOther: 20,
  },
  {
    currentPeriod: "2026-03", city: "宁波", district: "鄞州区",
    projectCode: "JHTB-2026-002", projectName: "智慧校园建设项目",
    projectType: "教育信息化", projectManager: "李华",
    projectStartTime: "2026-02-01", projectStatus: "实施中",
    contractCode: "HT-2026-002", contractName: "教育信息化合同",
    contractType: "项目合同", contractStatus: "执行中",
    contractStartTime: "2026-03-01", contractEndTime: "2027-02-28",
    projectDiffAmount: -60, projectDiffRate: "-7.5%",
    basicDiffAmount: -35, basicDiffRate: "-7.4%",
    serviceDiffAmount: -15, serviceDiffRate: "-7.9%",
    productDiffAmount: -8, productDiffRate: "-7.3%",
    equipDiffAmount: -2, equipDiffRate: "-6.7%",
    otherDiffAmount: 0, otherDiffRate: "0%",
    planBasic: 475, planService: 190, planProduct: 110, planEquip: 135, planOther: 30,
    actualTotal: 740, actualBasic: 440, actualService: 175, actualProduct: 102, actualEquip: 123, actualOther: 30,
  },
  {
    currentPeriod: "2026-03", city: "温州", district: "鹿城区",
    projectCode: "JHTB-2026-003", projectName: "智慧医疗系统项目",
    projectType: "医疗信息化", projectManager: "王芳",
    projectStartTime: "2026-02-20", projectStatus: "实施中",
    contractCode: "HT-2026-003", contractName: "医疗信息化合同",
    contractType: "框架合同", contractStatus: "执行中",
    contractStartTime: "2026-04-01", contractEndTime: "2027-03-31",
    projectDiffAmount: -25, projectDiffRate: "-7.1%",
    basicDiffAmount: -15, basicDiffRate: "-7.1%",
    serviceDiffAmount: -6, serviceDiffRate: "-7.3%",
    productDiffAmount: -3, productDiffRate: "-6.8%",
    equipDiffAmount: -1, equipDiffRate: "-6.7%",
    otherDiffAmount: 0, otherDiffRate: "0%",
    planBasic: 210, planService: 82, planProduct: 48, planEquip: 60, planOther: 15,
    actualTotal: 325, actualBasic: 195, actualService: 76, actualProduct: 45, actualEquip: 54, actualOther: 15,
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
  // 差异情况 - 需展开
  {
    title: "差异情况",
    fields: [
      { key: "projectDiffAmount", label: "项目差异额", type: "number-range" as const },
      { key: "projectDiffRate", label: "项目差异率", type: "text" as const, placeholder: "如: -7.2", showPercent: true },
      { key: "serviceDiffAmount", label: "服务差异额", type: "number-range" as const },
      { key: "serviceDiffRate", label: "服务差异率", type: "text" as const, placeholder: "如: -7.4", showPercent: true },
      { key: "equipDiffAmount", label: "设备销售/租赁差异额", type: "number-range" as const },
      { key: "equipDiffRate", label: "设备销售/租赁差异率", type: "text" as const, placeholder: "如: -8.0", showPercent: true },
      { key: "otherDiffAmount", label: "代收代付差异额", type: "number-range" as const },
      { key: "otherDiffRate", label: "代收代付差异率", type: "text" as const, placeholder: "如: 0", showPercent: true },
    ]
  },
];

const config: ReportConfig = {
  title: "收入计划与实际确收差异",
  description: "项目收入计划与实际确收情况差异分析",
  columns: allColumns,
  headerGroups: topGroups,
  hasThreeLevelHeader: false,
};

export function RevenuePlanActualDiff() {
  return (
    <ReportTemplate
      config={config}
      queryFields={queryFields}
      data={mockData}
      showDetail={true}
    />
  );
}
