import React, { useState } from "react";
import { ReportTemplate, ReportColumn, ReportHeaderGroup } from "./ReportTemplate";
import type { ReportConfig } from "./ReportTemplate";
import { Button } from "./ui/button";
import { RotateCcw } from "lucide-react";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";

// 月报列定义
const monthColumns: ReportColumn[] = [
  // 项目基本信息 (cols 0-10)
  { key: "period", label: "账期", width: 80, groupColor: "bg-gray-50" },
  { key: "province", label: "省份", width: 80, groupColor: "bg-gray-50" },
  { key: "city", label: "地市", width: 80, groupColor: "bg-gray-50" },
  { key: "district", label: "区县", width: 80, groupColor: "bg-gray-50" },
  { key: "projectCode", label: "项目编号", width: 130, groupColor: "bg-gray-50" },
  { key: "projectName", label: "项目名称", width: 180, groupColor: "bg-gray-50" },
  { key: "projectTypeName", label: "项目类型名称", width: 100, groupColor: "bg-gray-50" },
  { key: "projectStartTime", label: "立项时间", width: 110, groupColor: "bg-gray-50" },
  { key: "projectStatus", label: "项目状态", width: 90, groupColor: "bg-gray-50" },
  { key: "projectManager", label: "项目经理", width: 90, groupColor: "bg-gray-50" },
  { key: "projectCategory", label: "项目分类", width: 90, groupColor: "bg-gray-50" },
  // 前向合同信息 (cols 11-16)
  { key: "forwardContractCode", label: "前向合同编号", width: 130, groupColor: "bg-blue-50" },
  { key: "forwardContractName", label: "前向合同名称", width: 180, groupColor: "bg-blue-50" },
  { key: "forwardContractType", label: "前向合同类型", width: 100, groupColor: "bg-blue-50" },
  { key: "forwardSignType", label: "前向签约类型", width: 100, groupColor: "bg-blue-50" },
  { key: "planIncomeTotal", label: "计划收入总金额", width: 120, align: "right", groupColor: "bg-blue-50" },
  { key: "signDate", label: "合同签约日期", width: 110, groupColor: "bg-blue-50" },
  // 分成合同信息 (cols 17-22)
  { key: "shareContractCode", label: "分成合同编号", width: 130, groupColor: "bg-teal-50" },
  { key: "shareContractName", label: "分成合同名称", width: 180, groupColor: "bg-teal-50" },
  { key: "shareContractType", label: "分成合同类型", width: 100, groupColor: "bg-teal-50" },
  { key: "shareSignType", label: "分成签约类型", width: 100, groupColor: "bg-teal-50" },
  { key: "reductionPlanTotal", label: "减收计划总金额", width: 120, align: "right", groupColor: "bg-teal-50" },
  { key: "shareSignDate", label: "分成合同签约日期", width: 110, groupColor: "bg-teal-50" },
  // 收入/减收数据 (cols 23-27)
  { key: "monthDICTIncome", label: "本月DICT收入金额", width: 130, align: "right", groupColor: "bg-green-50" },
  { key: "monthDICTReduction", label: "本月DICT减收金额", width: 130, align: "right", groupColor: "bg-green-50" },
  { key: "monthReductionPlan", label: "本月减收计划金额", width: 130, align: "right", groupColor: "bg-green-50" },
  { key: "monthIncomeProgress", label: "本月收入进度", width: 100, align: "right", groupColor: "bg-green-50" },
  { key: "monthReductionProgress", label: "本月减收进度", width: 100, align: "right", groupColor: "bg-green-50" },
  // 稽核结果 (col 28)
  { key: "auditResult", label: "稽核结果", width: 200, groupColor: "bg-red-50" },
];

// 年报列定义（包含累计数据）
const yearColumns: ReportColumn[] = [
  // 项目基本信息 (cols 0-10)
  { key: "period", label: "账期", width: 80, groupColor: "bg-gray-50" },
  { key: "province", label: "省份", width: 80, groupColor: "bg-gray-50" },
  { key: "city", label: "地市", width: 80, groupColor: "bg-gray-50" },
  { key: "district", label: "区县", width: 80, groupColor: "bg-gray-50" },
  { key: "projectCode", label: "项目编号", width: 130, groupColor: "bg-gray-50" },
  { key: "projectName", label: "项目名称", width: 180, groupColor: "bg-gray-50" },
  { key: "projectTypeName", label: "项目类型名称", width: 100, groupColor: "bg-gray-50" },
  { key: "projectStartTime", label: "立项时间", width: 110, groupColor: "bg-gray-50" },
  { key: "projectStatus", label: "项目状态", width: 90, groupColor: "bg-gray-50" },
  { key: "projectManager", label: "项目经理", width: 90, groupColor: "bg-gray-50" },
  { key: "projectCategory", label: "项目分类", width: 90, groupColor: "bg-gray-50" },
  // 前向合同信息 (cols 11-16)
  { key: "forwardContractCode", label: "前向合同编号", width: 130, groupColor: "bg-blue-50" },
  { key: "forwardContractName", label: "前向合同名称", width: 180, groupColor: "bg-blue-50" },
  { key: "forwardContractType", label: "前向合同类型", width: 100, groupColor: "bg-blue-50" },
  { key: "forwardSignType", label: "前向签约类型", width: 100, groupColor: "bg-blue-50" },
  { key: "planIncomeTotal", label: "计划收入总金额", width: 120, align: "right", groupColor: "bg-blue-50" },
  { key: "signDate", label: "合同签约日期", width: 110, groupColor: "bg-blue-50" },
  // 分成合同信息 (cols 17-22)
  { key: "shareContractCode", label: "分成合同编号", width: 130, groupColor: "bg-teal-50" },
  { key: "shareContractName", label: "分成合同名称", width: 180, groupColor: "bg-teal-50" },
  { key: "shareContractType", label: "分成合同类型", width: 100, groupColor: "bg-teal-50" },
  { key: "shareSignType", label: "分成签约类型", width: 100, groupColor: "bg-teal-50" },
  { key: "reductionPlanTotal", label: "减收计划总金额", width: 120, align: "right", groupColor: "bg-teal-50" },
  { key: "shareSignDate", label: "分成合同签约日期", width: 110, groupColor: "bg-teal-50" },
  // 累计数据 (cols 23-27)
  { key: "totalDICTIncome", label: "累计DICT收入金额", width: 130, align: "right", groupColor: "bg-green-50" },
  { key: "totalDICTReduction", label: "累计DICT减收金额", width: 130, align: "right", groupColor: "bg-green-50" },
  { key: "yearDICTIncome", label: "本年DICT收入金额", width: 130, align: "right", groupColor: "bg-green-50" },
  { key: "yearDICTReduction", label: "本年DICT减收金额", width: 130, align: "right", groupColor: "bg-green-50" },
  { key: "yearReductionPlan", label: "本年减收计划金额", width: 130, align: "right", groupColor: "bg-green-50" },
  // 进度 (cols 28-31)
  { key: "totalIncomeProgress", label: "累计收入进度", width: 100, align: "right", groupColor: "bg-purple-50" },
  { key: "totalReductionProgress", label: "累计减收进度", width: 100, align: "right", groupColor: "bg-purple-50" },
  { key: "yearIncomeProgress", label: "本年收入进度", width: 100, align: "right", groupColor: "bg-purple-50" },
  { key: "yearReductionProgress", label: "本年减收进度", width: 100, align: "right", groupColor: "bg-purple-50" },
  // 稽核结果 (cols 32-33)
  { key: "totalAuditResult", label: "累计数据稽核结果", width: 200, groupColor: "bg-red-50" },
  { key: "yearAuditResult", label: "本年数据稽核结果", width: 200, groupColor: "bg-red-50" },
];

// 月报Mock数据
const monthMockData: Record<string, string | number>[] = [
  {
    period: "2026-03", province: "浙江省", city: "杭州", district: "西湖区",
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
  {
    period: "2026-03", province: "浙江省", city: "宁波", district: "鄞州区",
    projectCode: "JHTB-2026-002", projectName: "智慧校园建设项目",
    projectTypeName: "成本型", projectStartTime: "2026-02-01", projectStatus: "实施中",
    projectManager: "李华", projectCategory: "自拓",
    forwardContractCode: "HT-2026-002", forwardContractName: "教育信息化合同",
    forwardContractType: "框架合同", forwardSignType: "合同",
    planIncomeTotal: 800, signDate: "2026-02-15",
    shareContractCode: "FC-2026-002", shareContractName: "分成合作合同",
    shareContractType: "分成合同", shareSignType: "合同",
    reductionPlanTotal: 80, shareSignDate: "2026-02-18",
    monthDICTIncome: 0, monthDICTReduction: 0, monthReductionPlan: 6,
    monthIncomeProgress: "0%", monthReductionProgress: "0%",
    auditResult: "当月有减收计划，但实际未减收",
  },
];

// 年报Mock数据
const yearMockData: Record<string, string | number>[] = [
  {
    period: "2026-03", province: "浙江省", city: "杭州", district: "西湖区",
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
    yearAuditResult: "当月DICT收入金额小于DICT减收金额",
  },
];

export function IctShareAbnormalReport() {
  const [activeTab, setActiveTab] = useState<"month" | "year">("month");
  const [showAllConditions, setShowAllConditions] = useState(false);
  const [queryParams, setQueryParams] = useState<Record<string, unknown>>({});

  const isYear = activeTab === "year";
  const columns = isYear ? yearColumns : monthColumns;
  const data = isYear ? yearMockData : monthMockData;

  // 计算查询区总宽度（与表格对齐）
  const queryAreaWidth = columns.reduce((sum, c) => sum + (c.width ?? 120), 0);

  const topGroups: ReportHeaderGroup[] = isYear
    ? [
        { label: "项目基本信息", startCol: 0, span: 11, color: "bg-gray-100" },
        { label: "前向合同信息", startCol: 11, span: 6, color: "bg-blue-100" },
        { label: "分成合同信息", startCol: 17, span: 6, color: "bg-teal-100" },
        { label: "累计/本年数据", startCol: 23, span: 5, color: "bg-green-100" },
        { label: "进度", startCol: 28, span: 4, color: "bg-purple-100" },
        { label: "稽核结果", startCol: 32, span: 2, color: "bg-red-100" },
      ]
    : [
        { label: "项目基本信息", startCol: 0, span: 11, color: "bg-gray-100" },
        { label: "前向合同信息", startCol: 11, span: 6, color: "bg-blue-100" },
        { label: "分成合同信息", startCol: 17, span: 6, color: "bg-teal-100" },
        { label: "收入/减收数据", startCol: 23, span: 5, color: "bg-green-100" },
        { label: "稽核结果", startCol: 28, span: 1, color: "bg-red-100" },
      ];

  const config: ReportConfig = {
    title: "ICT项目分成异常报表",
    description: "ICT项目分成异常情况分析",
    columns,
    headerGroups: topGroups,
    hasThreeLevelHeader: false,
  };

  // 基础信息字段
  const basicFields = [
    { key: "city", label: "地市", type: "select" as const, options: [
      { label: "杭州", value: "hangzhou" }, { label: "宁波", value: "ningbo" }, { label: "温州", value: "wenzhou" }
    ]},
    { key: "district", label: "区县", type: "select" as const, options: [
      { label: "西湖区", value: "xihu" }, { label: "鄞州区", value: "yinzhou" }, { label: "鹿城区", value: "lucheng" }
    ]},
    { key: "accountBook", label: "帐套", type: "select" as const, options: [
      { label: "股份公司", value: "gufen" }, { label: "信产公司", value: "xinchan" }
    ]},
    { key: "oppCode", label: "商机编码", type: "text" as const, placeholder: "请输入" },
    { key: "customerDept", label: "客户管控部门名称", type: "select" as const, options: [
      { label: "政企客户部", value: "zhengqi" }, { label: "教育行业部", value: "jiaoyu" }
    ]},
  ];

  // 项目信息字段
  const projectFields = [
    { key: "projectCode", label: "项目编码", type: "text" as const, placeholder: "请输入" },
    { key: "projectName", label: "项目名称", type: "text" as const, placeholder: "请输入" },
    { key: "projectType", label: "项目类型", type: "select" as const, options: [
      { label: "成本型", value: "cost" }, { label: "分成型", value: "share" }
    ]},
    { key: "projectTime", label: "立项时间", type: "date-range" as const },
    { key: "projectAmount", label: "项目总金额", type: "number-range" as const },
    { key: "projectStatus", label: "项目状态", type: "select" as const, options: [
      { label: "实施中", value: "shishi" }, { label: "已完成", value: "wancheng" }
    ]},
    { key: "projectManager", label: "项目经理", type: "text" as const, placeholder: "请输入" },
    { key: "projectCategory", label: "项目分类", type: "select" as const, options: [
      { label: "自拓", value: "self" }, { label: "非自拓", value: "non-self" }
    ]},
  ];

  // 更多条件字段（默认收起）
  const extraFields = [
    { key: "forwardContractCode", label: "前向合同编号", type: "text" as const, placeholder: "请输入" },
    { key: "forwardContractName", label: "前向合同名称", type: "text" as const, placeholder: "请输入" },
    { key: "shareContractCode", label: "分成合同编号", type: "text" as const, placeholder: "请输入" },
    { key: "shareContractName", label: "分成合同名称", type: "text" as const, placeholder: "请输入" },
    { key: "projectModel", label: "项目模式", type: "select" as const, options: [
      { label: "DICT", value: "dict" }, { label: "ICT", value: "ict" }, { label: "集成", value: "jicheng" }
    ]},
    { key: "projectMode", label: "签约模式", type: "select" as const, options: [
      { label: "合同", value: "contract" }, { label: "订单", value: "order" }
    ]},
    { key: "auditResult", label: "稽核结果", type: "text" as const, placeholder: "请输入" },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 标题 */}
      <div className="px-6 pt-6 pb-4 flex-shrink-0">
        <h2 className="text-lg font-medium text-gray-900">ICT项目分成异常报表</h2>
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        {/* Tab切换 */}
        <div className="mb-4 flex gap-2">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "month"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("month")}
          >
            月报
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "year"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("year")}
          >
            年度
          </button>
        </div>

        {/* 查询条件卡片 */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4" style={{ width: queryAreaWidth, minWidth: queryAreaWidth }}>
          {/* 基础信息 */}
          <div>
            <div className="grid grid-cols-5 gap-x-6 gap-y-3">
              {basicFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  {field.type === "select" ? (
                    <Select value={(queryParams[field.key] as string) ?? ""} onValueChange={v => setQueryParams(p => ({ ...p, [field.key]: v }))}>
                      <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                      <SelectContent>
                        {field.options?.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input placeholder={field.placeholder ?? "请输入"} value={(queryParams[field.key] as string) ?? ""}
                      onChange={e => setQueryParams(p => ({ ...p, [field.key]: e.target.value }))} />
                  )}
                </div>
              ))}
            </div>
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
                  {field.type === "select" ? (
                    <Select value={(queryParams[field.key] as string) ?? ""} onValueChange={v => setQueryParams(p => ({ ...p, [field.key]: v }))}>
                      <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                      <SelectContent>
                        {field.options?.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : field.type === "date-range" ? (
                    <div className="flex gap-2 items-center">
                      <Input type="date" value={(queryParams[`${field.key}Start`] as string) ?? ""}
                        onChange={e => setQueryParams(p => ({ ...p, [`${field.key}Start`]: e.target.value }))} />
                      <span className="text-gray-400">-</span>
                      <Input type="date" value={(queryParams[`${field.key}End`] as string) ?? ""}
                        onChange={e => setQueryParams(p => ({ ...p, [`${field.key}End`]: e.target.value }))} />
                    </div>
                  ) : field.type === "number-range" ? (
                    <div className="flex gap-2 items-center">
                      <Input type="number" placeholder="起" value={(queryParams[`${field.key}Min`] as string) ?? ""}
                        onChange={e => setQueryParams(p => ({ ...p, [`${field.key}Min`]: e.target.value }))} />
                      <span className="text-gray-400">-</span>
                      <Input type="number" placeholder="止" value={(queryParams[`${field.key}Max`] as string) ?? ""}
                        onChange={e => setQueryParams(p => ({ ...p, [`${field.key}Max`]: e.target.value }))} />
                    </div>
                  ) : (
                    <Input placeholder={field.placeholder ?? "请输入"} value={(queryParams[field.key] as string) ?? ""}
                      onChange={e => setQueryParams(p => ({ ...p, [field.key]: e.target.value }))} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 更多条件（默认收起） */}
          {showAllConditions && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                <span className="w-1 h-4 bg-orange-500 rounded mr-2"></span>
                更多条件
              </div>
              <div className="grid grid-cols-5 gap-x-6 gap-y-3">
                {extraFields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    {field.type === "select" ? (
                      <Select value={(queryParams[field.key] as string) ?? ""} onValueChange={v => setQueryParams(p => ({ ...p, [field.key]: v }))}>
                        <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                        <SelectContent>
                          {field.options?.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input placeholder={field.placeholder ?? "请输入"} value={(queryParams[field.key] as string) ?? ""}
                        onChange={e => setQueryParams(p => ({ ...p, [field.key]: e.target.value }))} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 展开更多条件 */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <button className="text-sm text-blue-600 hover:text-blue-700" onClick={() => setShowAllConditions(!showAllConditions)}>
              {showAllConditions ? "收起更多条件" : "展开更多条件"}
            </button>
            <div className="flex gap-2">
              <Button variant="default" size="sm">查询</Button>
              <Button variant="outline" size="sm"><RotateCcw className="w-4 h-4 mr-1" />重置</Button>
            </div>
          </div>
        </div>

        {/* 表格（只传空queryFields，由外层控制查询条件） */}
        <ReportTemplate config={config} queryFields={[]} data={data} hideTitle={true} hideQueryArea={true} />
      </div>
    </div>
  );
}
