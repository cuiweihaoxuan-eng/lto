import React, { useState } from "react";
import { ReportTemplate, ReportColumn, ReportHeaderGroup } from "./ReportTemplate";
import type { ReportConfig } from "./ReportTemplate";
import { Button } from "./ui/button";
import { RotateCcw } from "lucide-react";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { TabNav } from "./ui/tab-nav";

// 月报列定义
const monthColumns: ReportColumn[] = [
  { key: "period", label: "账期", width: 80, groupColor: "bg-gray-50" },
  { key: "city", label: "地市", width: 80, groupColor: "bg-gray-50" },
  { key: "district", label: "区县", width: 80, groupColor: "bg-gray-50" },
  { key: "projectCode", label: "项目编号", width: 130, groupColor: "bg-gray-50" },
  { key: "projectName", label: "项目名称", width: 180, groupColor: "bg-gray-50" },
  { key: "projectTypeName", label: "项目类型名称", width: 100, groupColor: "bg-gray-50" },
  { key: "projectStartTime", label: "立项时间", width: 110, groupColor: "bg-gray-50" },
  { key: "projectStatus", label: "项目状态", width: 90, groupColor: "bg-gray-50" },
  { key: "projectManager", label: "项目经理", width: 90, groupColor: "bg-gray-50" },
  { key: "projectCategory", label: "项目分类", width: 90, groupColor: "bg-gray-50" },
  { key: "forwardContractCode", label: "前向合同编号", width: 130, groupColor: "bg-blue-50" },
  { key: "forwardContractName", label: "前向合同名称", width: 180, groupColor: "bg-blue-50" },
  { key: "forwardContractType", label: "前向合同类型", width: 100, groupColor: "bg-blue-50" },
  { key: "forwardSignType", label: "前向签约类型", width: 100, groupColor: "bg-blue-50" },
  { key: "planIncomeTotal", label: "计划收入总金额", width: 120, align: "right", groupColor: "bg-blue-50" },
  { key: "signDate", label: "合同签约日期", width: 110, groupColor: "bg-blue-50" },
  { key: "shareContractCode", label: "分成合同编号", width: 130, groupColor: "bg-teal-50" },
  { key: "shareContractName", label: "分成合同名称", width: 180, groupColor: "bg-teal-50" },
  { key: "shareContractType", label: "分成合同类型", width: 100, groupColor: "bg-teal-50" },
  { key: "shareSignType", label: "分成签约类型", width: 100, groupColor: "bg-teal-50" },
  { key: "reductionPlanTotal", label: "减收计划总金额", width: 120, align: "right", groupColor: "bg-teal-50" },
  { key: "shareSignDate", label: "分成合同签约日期", width: 110, groupColor: "bg-teal-50" },
  { key: "monthDICTIncome", label: "本月DICT收入金额", width: 130, align: "right", groupColor: "bg-green-50" },
  { key: "monthDICTReduction", label: "本月DICT减收金额", width: 130, align: "right", groupColor: "bg-green-50" },
  { key: "monthReductionPlan", label: "本月减收计划金额", width: 130, align: "right", groupColor: "bg-green-50" },
  { key: "monthIncomeProgress", label: "本月收入进度", width: 100, align: "right", groupColor: "bg-green-50" },
  { key: "monthReductionProgress", label: "本月减收进度", width: 100, align: "right", groupColor: "bg-green-50" },
  { key: "auditResult", label: "稽核结果", width: 200, groupColor: "bg-red-50" },
];

// 年报列定义
const yearColumns: ReportColumn[] = [
  { key: "period", label: "账期", width: 80, groupColor: "bg-gray-50" },
  { key: "city", label: "地市", width: 80, groupColor: "bg-gray-50" },
  { key: "district", label: "区县", width: 80, groupColor: "bg-gray-50" },
  { key: "projectCode", label: "项目编号", width: 130, groupColor: "bg-gray-50" },
  { key: "projectName", label: "项目名称", width: 180, groupColor: "bg-gray-50" },
  { key: "projectTypeName", label: "项目类型名称", width: 100, groupColor: "bg-gray-50" },
  { key: "projectStartTime", label: "立项时间", width: 110, groupColor: "bg-gray-50" },
  { key: "projectStatus", label: "项目状态", width: 90, groupColor: "bg-gray-50" },
  { key: "projectManager", label: "项目经理", width: 90, groupColor: "bg-gray-50" },
  { key: "projectCategory", label: "项目分类", width: 90, groupColor: "bg-gray-50" },
  { key: "forwardContractCode", label: "前向合同编号", width: 130, groupColor: "bg-blue-50" },
  { key: "forwardContractName", label: "前向合同名称", width: 180, groupColor: "bg-blue-50" },
  { key: "forwardContractType", label: "前向合同类型", width: 100, groupColor: "bg-blue-50" },
  { key: "forwardSignType", label: "前向签约类型", width: 100, groupColor: "bg-blue-50" },
  { key: "planIncomeTotal", label: "计划收入总金额", width: 120, align: "right", groupColor: "bg-blue-50" },
  { key: "signDate", label: "合同签约日期", width: 110, groupColor: "bg-blue-50" },
  { key: "shareContractCode", label: "分成合同编号", width: 130, groupColor: "bg-teal-50" },
  { key: "shareContractName", label: "分成合同名称", width: 180, groupColor: "bg-teal-50" },
  { key: "shareContractType", label: "分成合同类型", width: 100, groupColor: "bg-teal-50" },
  { key: "shareSignType", label: "分成签约类型", width: 100, groupColor: "bg-teal-50" },
  { key: "reductionPlanTotal", label: "减收计划总金额", width: 120, align: "right", groupColor: "bg-teal-50" },
  { key: "shareSignDate", label: "分成合同签约日期", width: 110, groupColor: "bg-teal-50" },
  { key: "totalDICTIncome", label: "累计DICT收入金额", width: 130, align: "right", groupColor: "bg-green-50" },
  { key: "totalDICTReduction", label: "累计DICT减收金额", width: 130, align: "right", groupColor: "bg-green-50" },
  { key: "yearDICTIncome", label: "本年DICT收入金额", width: 130, align: "right", groupColor: "bg-green-50" },
  { key: "yearDICTReduction", label: "本年DICT减收金额", width: 130, align: "right", groupColor: "bg-green-50" },
  { key: "yearReductionPlan", label: "本年减收计划金额", width: 130, align: "right", groupColor: "bg-green-50" },
  { key: "totalIncomeProgress", label: "累计收入进度", width: 100, align: "right", groupColor: "bg-purple-50" },
  { key: "totalReductionProgress", label: "累计减收进度", width: 100, align: "right", groupColor: "bg-purple-50" },
  { key: "yearIncomeProgress", label: "本年收入进度", width: 100, align: "right", groupColor: "bg-purple-50" },
  { key: "yearReductionProgress", label: "本年减收进度", width: 100, align: "right", groupColor: "bg-purple-50" },
  { key: "totalAuditResult", label: "累计数据稽核结果", width: 200, groupColor: "bg-red-50" },
  { key: "yearAuditResult", label: "本年数据稽核结果", width: 200, groupColor: "bg-red-50" },
];

// 月报Mock数据
const monthMockData: Record<string, string | number>[] = [
  {
    period: "2026-03", city: "杭州", district: "西湖区",
    projectCode: "JHTB-2026-001", projectName: "某区政府信息化项目",
    projectTypeName: "分成型", projectStartTime: "2026-01-15", projectStatus: "实施中",
    projectManager: "张明", projectCategory: "自拓",
    forwardContractCode: "HT-2026-001", forwardContractName: "政务云服务合同",
    forwardContractType: "项目合同", forwardSignType: "合同",
    planIncomeTotal: 580, signDate: "2026-01-20",
    shareContractCode: "FC-2026-001", shareContractName: "分成合作合同",
    shareContractType: "分成合同", shareSignType: "合同",
    reductionPlanTotal: 50, shareSignDate: "2026-01-22",
    monthDICTIncome: 45, monthDICTReduction: 42, monthReductionPlan: 4,
    monthIncomeProgress: "7.8%", monthReductionProgress: "84.0%",
    auditResult: "当月DICT收入金额小于DICT减收金额",
  },
];

// 年报Mock数据
const yearMockData: Record<string, string | number>[] = [
  {
    period: "2026-03", city: "杭州", district: "西湖区",
    projectCode: "JHTB-2026-001", projectName: "某区政府信息化项目",
    projectTypeName: "分成型", projectStartTime: "2026-01-15", projectStatus: "实施中",
    projectManager: "张明", projectCategory: "自拓",
    forwardContractCode: "HT-2026-001", forwardContractName: "政务云服务合同",
    forwardContractType: "项目合同", forwardSignType: "合同",
    planIncomeTotal: 580, signDate: "2026-01-20",
    shareContractCode: "FC-2026-001", shareContractName: "分成合作合同",
    shareContractType: "分成合同", shareSignType: "合同",
    reductionPlanTotal: 50, shareSignDate: "2026-01-22",
    totalDICTIncome: 135, totalDICTReduction: 126, yearDICTIncome: 45, yearDICTReduction: 42,
    yearReductionPlan: 4,
    totalIncomeProgress: "23.3%", totalReductionProgress: "252.0%",
    yearIncomeProgress: "7.8%", yearReductionProgress: "84.0%",
    totalAuditResult: "该项目累计DICT收入小于累计DICT减收",
    yearAuditResult: "该项目的本年收入进度和减收进度不一致",
  },
];

// 合同类型选项
const contractTypeOptions = [
  { label: "项目合同", value: "project" },
  { label: "框架合同", value: "framework" },
  { label: "补充协议", value: "supplementary" },
];

// 签约类型选项
const signTypeOptions = [
  { label: "合同", value: "contract" },
  { label: "订单", value: "order" },
];

// 稽核结果选项
const auditResultOptions = [
  { label: "正常", value: "normal" },
  { label: "当月有减收计划，但实际未减收", value: "no_reduction" },
  { label: "当月有DICT收入，当月未减收", value: "income_no_reduction" },
  { label: "当月DICT收入金额小于DICT减收金额", value: "income_less_than_reduction" },
  { label: "当月收入进度和减收进度不一致", value: "progress_inconsistent" },
];

// 年报稽核结果选项
const yearAuditResultOptions = [
  { label: "正常", value: "normal" },
  { label: "该项目有累计DICT收入，无减收", value: "total_no_reduction" },
  { label: "该项目累计DICT收入小于累计DICT减收", value: "total_income_less" },
  { label: "该项目的累计收入进度和减收进度不一致", value: "total_progress_inconsistent" },
  { label: "该项目本年有减收计划，但实际未减收", value: "year_no_reduction" },
  { label: "该项目本年有收入，无减收", value: "year_income_no_reduction" },
  { label: "该项目本年DICT收入金额小于本年DICT减收金额", value: "year_income_less" },
  { label: "该项目的本年收入进度和减收进度不一致", value: "year_progress_inconsistent" },
];

export function IctShareAbnormalReport() {
  const [activeTab, setActiveTab] = useState<"month" | "year">("month");
  const [queryParams, setQueryParams] = useState<Record<string, unknown>>({});
  const [showAllConditions, setShowAllConditions] = useState(false);

  const isYear = activeTab === "year";
  const columns = isYear ? yearColumns : monthColumns;
  const data = isYear ? yearMockData : monthMockData;
  const pageTitle = isYear ? "ICT项目分成异常报表-年度" : "ICT项目分成异常报表-月报";

  const topGroups: ReportHeaderGroup[] = isYear
    ? [
        { label: "项目基本信息", startCol: 0, span: 10, color: "bg-gray-100" },
        { label: "前向合同信息", startCol: 10, span: 6, color: "bg-blue-100" },
        { label: "分成合同信息", startCol: 16, span: 6, color: "bg-teal-100" },
        { label: "累计/本年数据", startCol: 22, span: 5, color: "bg-green-100" },
        { label: "进度", startCol: 27, span: 4, color: "bg-purple-100" },
        { label: "稽核结果", startCol: 31, span: 2, color: "bg-red-100" },
      ]
    : [
        { label: "项目基本信息", startCol: 0, span: 10, color: "bg-gray-100" },
        { label: "前向合同信息", startCol: 10, span: 6, color: "bg-blue-100" },
        { label: "分成合同信息", startCol: 16, span: 6, color: "bg-teal-100" },
        { label: "收入/减收数据", startCol: 22, span: 5, color: "bg-green-100" },
        { label: "稽核结果", startCol: 27, span: 1, color: "bg-red-100" },
      ];

  const config: ReportConfig = {
    title: pageTitle,
    description: "ICT项目分成异常情况分析",
    columns,
    headerGroups: topGroups,
    hasThreeLevelHeader: false,
  };

  // 基础条件字段
  const basicFields = [
    { key: "city", label: "地市", type: "select" as const, options: [
      { label: "杭州", value: "hangzhou" }, { label: "宁波", value: "ningbo" }, { label: "温州", value: "wenzhou" }, { label: "嘉兴", value: "jiaxing" }, { label: "湖州", value: "huzhou" }, { label: "绍兴", value: "shaoxing" }, { label: "金华", value: "jinhua" }, { label: "衢州", value: "quzhou" }, { label: "舟山", value: "zhoushan" }, { label: "台州", value: "taizhou" }, { label: "丽水", value: "lishui" }
    ]},
    { key: "district", label: "区县", type: "select" as const, options: [
      { label: "西湖区", value: "xihu" }, { label: "鄞州区", value: "yinzhou" }, { label: "鹿城区", value: "lucheng" }, { label: "海曙区", value: "haishu" }, { label: "江北区", value: "jiangbei" }
    ]},
    { key: "period", label: "账期", type: "select" as const, options: [
      { label: "2026-01", value: "2026-01" }, { label: "2026-02", value: "2026-02" }, { label: "2026-03", value: "2026-03" }, { label: "2026-04", value: "2026-04" }
    ]},
  ];

  // 项目信息字段
  const projectFields = [
    { key: "projectCode", label: "项目编码", type: "text" as const, placeholder: "请输入" },
    { key: "projectName", label: "项目名称", type: "text" as const, placeholder: "请输入" },
    { key: "projectType", label: "项目类型", type: "select" as const, options: [
      { label: "成本型", value: "cost" }, { label: "分成型", value: "share" }, { label: "混合型", value: "mixed" }
    ]},
    { key: "projectTime", label: isYear ? "立项时间范围" : "立项时间", type: "date-range" as const },
    { key: "projectAmount", label: "项目总金额", type: "number-range" as const },
    { key: "projectStatus", label: "项目状态", type: "select" as const, options: [
      { label: "实施中", value: "implementing" }, { label: "已完成", value: "completed" }, { label: "已终止", value: "terminated" }
    ]},
    { key: "projectManager", label: "项目经理", type: "text" as const, placeholder: "请输入" },
  ];

  // 前向合同信息字段（月报）
  const forwardContractFieldsMonth = [
    { key: "forwardContractCode", label: "前向合同编码", type: "text" as const, placeholder: "请输入" },
    { key: "forwardContractName", label: "前向合同名称", type: "text" as const, placeholder: "请输入" },
    { key: "forwardContractType", label: "前向合同类型", type: "select" as const, options: contractTypeOptions },
    { key: "forwardSignDate", label: "前向合同签约日期", type: "date-range" as const },
    { key: "planIncomeTotal", label: "计划收入总金额", type: "number-range" as const },
    { key: "forwardSignType", label: "前向签约类型", type: "select" as const, options: signTypeOptions },
    { key: "monthDICTIncome", label: "本月DICT收入金额", type: "number-range" as const },
    { key: "monthIncomeProgress", label: "本月收入进度(%)", type: "number-range" as const, isPercent: true },
  ];

  // 前向合同信息字段（年报）
  const forwardContractFieldsYear = [
    { key: "forwardContractCode", label: "前向合同编码", type: "text" as const, placeholder: "请输入" },
    { key: "forwardContractName", label: "前向合同名称", type: "text" as const, placeholder: "请输入" },
    { key: "forwardContractType", label: "前向合同类型", type: "select" as const, options: contractTypeOptions },
    { key: "forwardSignDate", label: "前向合同签约日期", type: "date-range" as const },
    { key: "planIncomeTotal", label: "计划收入总金额", type: "number-range" as const },
    { key: "forwardSignType", label: "前向签约类型", type: "select" as const, options: signTypeOptions },
    { key: "monthDICTIncome", label: "本月DICT收入金额", type: "number-range" as const },
    { key: "monthIncomeProgress", label: "本月收入进度(%)", type: "number-range" as const, isPercent: true },
    { key: "totalDICTIncome", label: "累计DICT收入金额", type: "number-range" as const },
    { key: "totalIncomeProgress", label: "累计收入进度(%)", type: "number-range" as const, isPercent: true },
    { key: "yearDICTIncome", label: "本年DICT收入金额", type: "number-range" as const },
    { key: "yearIncomeProgress", label: "本年收入进度(%)", type: "number-range" as const, isPercent: true },
  ];

  // 分成合同信息字段（月报）
  const shareContractFieldsMonth = [
    { key: "shareContractCode", label: "分成合同编码", type: "text" as const, placeholder: "请输入" },
    { key: "shareContractName", label: "分成合同名称", type: "text" as const, placeholder: "请输入" },
    { key: "shareContractType", label: "分成合同类型", type: "select" as const, options: contractTypeOptions },
    { key: "shareSignDate", label: "分成合同签约日期", type: "date-range" as const },
    { key: "reductionPlanTotal", label: "减收计划总金额", type: "number-range" as const },
    { key: "shareSignType", label: "分成签约类型", type: "select" as const, options: signTypeOptions },
    { key: "monthDICTReduction", label: "本月DICT减收金额", type: "number-range" as const },
    { key: "monthReductionProgress", label: "本月减收进度(%)", type: "number-range" as const, isPercent: true },
  ];

  // 分成合同信息字段（年报）
  const shareContractFieldsYear = [
    { key: "shareContractCode", label: "分成合同编码", type: "text" as const, placeholder: "请输入" },
    { key: "shareContractName", label: "分成合同名称", type: "text" as const, placeholder: "请输入" },
    { key: "shareContractType", label: "分成合同类型", type: "select" as const, options: contractTypeOptions },
    { key: "shareSignDate", label: "分成合同签约日期", type: "date-range" as const },
    { key: "reductionPlanTotal", label: "减收计划总金额", type: "number-range" as const },
    { key: "shareSignType", label: "分成签约类型", type: "select" as const, options: signTypeOptions },
    { key: "monthDICTReduction", label: "本月DICT减收金额", type: "number-range" as const },
    { key: "monthReductionProgress", label: "本月减收进度(%)", type: "number-range" as const, isPercent: true },
    { key: "totalDICTReduction", label: "累计DICT减收金额", type: "number-range" as const },
    { key: "totalReductionProgress", label: "累计减收进度(%)", type: "number-range" as const, isPercent: true },
    { key: "yearDICTReduction", label: "本年DICT减收金额", type: "number-range" as const },
    { key: "yearReductionProgress", label: "本年减收进度(%)", type: "number-range" as const, isPercent: true },
  ];

  // 稽核字段（月报）
  const auditFieldsMonth = [
    { key: "auditResult", label: "稽核结果", type: "select" as const, options: auditResultOptions },
  ];

  // 稽核字段（年报）
  const auditFieldsYear = [
    { key: "totalAuditResult", label: "累计数据稽核结果", type: "select" as const, options: yearAuditResultOptions },
    { key: "yearAuditResult", label: "本年数据稽核结果", type: "select" as const, options: yearAuditResultOptions },
  ];

  // 渲染通用字段
  const renderField = (field: typeof projectFields[0]) => {
    const isPercent = 'isPercent' in field && field.isPercent;
    const suffix = isPercent ? "%" : "";

    if (field.type === "select") {
      return (
        <Select value={(queryParams[field.key] as string) ?? ""} onValueChange={v => setQueryParams(p => ({ ...p, [field.key]: v }))}>
          <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
          <SelectContent>
            {field.options?.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
          </SelectContent>
        </Select>
      );
    }

    if (field.type === "date-range") {
      return (
        <div className="flex gap-2 items-center">
          <Input type="date" value={(queryParams[`${field.key}Start`] as string) ?? ""}
            onChange={e => setQueryParams(p => ({ ...p, [`${field.key}Start`]: e.target.value }))} />
          <span className="text-gray-400">-</span>
          <Input type="date" value={(queryParams[`${field.key}End`] as string) ?? ""}
            onChange={e => setQueryParams(p => ({ ...p, [`${field.key}End`]: e.target.value }))} />
        </div>
      );
    }

    if (field.type === "number-range") {
      return (
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Input type="number" placeholder="起" value={(queryParams[`${field.key}Min`] as string) ?? ""}
              onChange={e => setQueryParams(p => ({ ...p, [`${field.key}Min`]: e.target.value }))} />
            {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{suffix}</span>}
          </div>
          <span className="text-gray-400">-</span>
          <div className="relative flex-1">
            <Input type="number" placeholder="止" value={(queryParams[`${field.key}Max`] as string) ?? ""}
              onChange={e => setQueryParams(p => ({ ...p, [`${field.key}Max`]: e.target.value }))} />
            {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{suffix}</span>}
          </div>
        </div>
      );
    }

    return (
      <div className="relative">
        <Input placeholder={field.placeholder ?? "请输入"} value={(queryParams[field.key] as string) ?? ""}
          onChange={e => setQueryParams(p => ({ ...p, [field.key]: e.target.value }))} />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{suffix}</span>}
      </div>
    );
  };

  const handleReset = () => {
    setQueryParams({});
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 pt-6 pb-4 flex-shrink-0">
        <h2 className="text-lg font-medium text-gray-900">{pageTitle}</h2>
      </div>
      <div className="flex-1 overflow-auto px-6 pb-6">
        {/* Tab切换 */}
        <div className="mb-4">
          <TabNav
            tabs={[
              { id: "month", label: "月报" },
              { id: "year", label: "年度" },
            ]}
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab as "month" | "year")}
            style="pill"
          />
        </div>

        {/* 查询条件 */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          {/* 基础条件 */}
          <div className="grid grid-cols-5 gap-x-6 gap-y-3">
            {basicFields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                {renderField(field)}
              </div>
            ))}
          </div>

          {/* 项目信息 */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm font-medium text-gray-800 mb-2 flex items-center">
              <span className="w-1 h-4 bg-green-500 rounded mr-2"></span>
              项目信息
            </div>
            <div className="grid grid-cols-5 gap-x-6 gap-y-3">
              {projectFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  {renderField(field)}
                </div>
              ))}
            </div>
          </div>

          {/* 前向合同信息 - 展开更多条件后显示 */}
          {showAllConditions && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                <span className="w-1 h-4 bg-blue-500 rounded mr-2"></span>
                前向合同信息
              </div>
              <div className="grid grid-cols-5 gap-x-6 gap-y-3">
                {(isYear ? forwardContractFieldsYear : forwardContractFieldsMonth).map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 分成合同信息 - 展开更多条件后显示 */}
          {showAllConditions && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                <span className="w-1 h-4 bg-teal-500 rounded mr-2"></span>
                分成合同信息
              </div>
              <div className="grid grid-cols-5 gap-x-6 gap-y-3">
                {(isYear ? shareContractFieldsYear : shareContractFieldsMonth).map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 稽核 - 展开更多条件后显示 */}
          {showAllConditions && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                <span className="w-1 h-4 bg-red-500 rounded mr-2"></span>
                稽核
              </div>
              <div className="grid grid-cols-5 gap-x-6 gap-y-3">
                {(isYear ? auditFieldsYear : auditFieldsMonth).map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <button className="text-sm text-blue-600 hover:text-blue-700" onClick={() => setShowAllConditions(!showAllConditions)}>
              {showAllConditions ? "收起更多条件" : "展开更多条件"}
            </button>
            <div className="flex gap-2">
              <Button>查询</Button>
              <Button variant="outline" onClick={handleReset}><RotateCcw className="w-4 h-4 mr-1" />重置</Button>
              <Button variant="outline">导出</Button>
            </div>
          </div>
        </div>

        <ReportTemplate config={config} queryFields={[]} data={data} hideTitle={true} hideQueryArea={true} showDetail={true} />
      </div>
    </div>
  );
}
