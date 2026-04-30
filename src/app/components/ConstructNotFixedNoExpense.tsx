import { ReportTemplate, ReportColumn, ReportHeaderGroup } from "./ReportTemplate";
import type { ReportConfig } from "./ReportTemplate";

const columns: ReportColumn[] = [
  // 账期信息 (col 0)
  { key: "period", label: "账期", width: 80, groupColor: "bg-gray-50" },
  // 基础数据 (cols 1-4)
  { key: "ictProjectSource", label: "ICT项目来源", width: 100, groupColor: "bg-blue-50" },
  { key: "engineeringSource", label: "工程项目来源", width: 100, groupColor: "bg-blue-50" },
  { key: "hasData", label: "是否有数据", width: 90, groupColor: "bg-blue-50" },
  { key: "companyType", label: "公司类型", width: 100, groupColor: "bg-blue-50" },
  // ICT项目信息 (cols 5-12)
  { key: "ictProjectCode", label: "ICT项目编码", width: 130, groupColor: "bg-green-50" },
  { key: "ictProjectName", label: "ICT项目名称", width: 180, groupColor: "bg-green-50" },
  { key: "ictProjectBudget", label: "ICT项目总体预算", width: 120, align: "right", groupColor: "bg-green-50" },
  { key: "ictProjectAccount", label: "ICT项目所属账套", width: 120, groupColor: "bg-green-50" },
  { key: "ictProjectType", label: "ICT项目类型", width: 100, groupColor: "bg-green-50" },
  { key: "cumulativeIncome", label: "累计确认产数收入", width: 130, align: "right", groupColor: "bg-green-50" },
  { key: "firstIncomeTime", label: "首次产数收入时间", width: 120, groupColor: "bg-green-50" },
  { key: "cumulativeCost", label: "累计产数成本支出", width: 130, align: "right", groupColor: "bg-green-50" },
  // 工程项目信息 (cols 13-21)
  { key: "engineeringCode", label: "工程项目编码", width: 130, groupColor: "bg-orange-50" },
  { key: "engineeringName", label: "工程项目名称", width: 180, groupColor: "bg-orange-50" },
  { key: "engineeringTime", label: "工程立项时间", width: 110, groupColor: "bg-orange-50" },
  { key: "engineeringAccount", label: "工程项目所属账套", width: 120, groupColor: "bg-orange-50" },
  { key: "preFixDate", label: "预转固日期", width: 110, groupColor: "bg-orange-50" },
  { key: "fixDate", label: "转固日期", width: 110, groupColor: "bg-orange-50" },
  { key: "engineeringStatus", label: "工程项目状态", width: 100, groupColor: "bg-orange-50" },
  { key: "engineeringBudget", label: "工程项目立项批复金额", width: 140, align: "right", groupColor: "bg-orange-50" },
  { key: "investRatio", label: "投资占比(%)", width: 100, align: "right", groupColor: "bg-orange-50" },
  { key: "cumulativeInvest", label: "累计已发生投资额", width: 130, align: "right", groupColor: "bg-orange-50" },
  // 稽核结果 (col 22)
  { key: "auditResult", label: "稽核结果", width: 200, groupColor: "bg-red-50" },
];

const topGroups: ReportHeaderGroup[] = [
  { label: "账期", startCol: 0, span: 1, color: "bg-gray-100" },
  { label: "基础数据", startCol: 1, span: 4, color: "bg-blue-100" },
  { label: "ICT项目信息", startCol: 5, span: 8, color: "bg-green-100" },
  { label: "工程项目信息", startCol: 13, span: 10, color: "bg-orange-100" },
  { label: "稽核结果", startCol: 22, span: 1, color: "bg-red-100" },
];

const mockData: Record<string, string | number>[] = [
  {
    period: "2026-03",
    ictProjectSource: "6.18表", engineeringSource: "6.18表", hasData: "有数据",
    companyType: "股份/信产", ictProjectCode: "ICT-2026-001", ictProjectName: "某区政府ICT项目",
    ictProjectBudget: 500000, ictProjectAccount: "股份公司", ictProjectType: "成本型",
    cumulativeIncome: 150000, firstIncomeTime: "2026-01-15", cumulativeCost: 0,
    engineeringCode: "ENG-2026-001", engineeringName: "政府网络基础设施工程",
    engineeringTime: "2025-12-01", engineeringAccount: "股份公司",
    preFixDate: "待申请", fixDate: "待申请", engineeringStatus: "待转固",
    engineeringBudget: 300000, investRatio: "60%", cumulativeInvest: 180000,
    auditResult: "已列产数收入，工程未转固（或预转固），未列产数成本",
  },
  {
    period: "2026-03",
    ictProjectSource: "6.18表", engineeringSource: "6.18表", hasData: "有数据",
    companyType: "信产", ictProjectCode: "ICT-2026-002", ictProjectName: "医院信息化ICT项目",
    ictProjectBudget: 800000, ictProjectAccount: "信产公司", ictProjectType: "分成型",
    cumulativeIncome: 200000, firstIncomeTime: "2026-02-01", cumulativeCost: 100000,
    engineeringCode: "ENG-2026-002", engineeringName: "医院网络改造工程",
    engineeringTime: "2025-11-15", engineeringAccount: "股份公司",
    preFixDate: "2026-03-15", fixDate: "", engineeringStatus: "预转固",
    engineeringBudget: 500000, investRatio: "40%", cumulativeInvest: 200000,
    auditResult: "已列产数收入，工程未转固（或预转固），已列产数成本",
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
      { key: "accountBook", label: "帐套", type: "select" as const, options: [
        { label: "股份公司", value: "gufen" }, { label: "信产公司", value: "xinchan" }
      ]},
    ]
  },
  {
    title: "项目信息",
    fields: [
      { key: "ictProjectCode", label: "项目编码", type: "text" as const, placeholder: "请输入" },
      { key: "ictProjectName", label: "项目名称", type: "text" as const, placeholder: "请输入" },
      { key: "ictProjectType", label: "项目类型", type: "select" as const, options: [
        { label: "成本型", value: "cost" }, { label: "分成型", value: "share" }
      ]},
      { key: "projectTime", label: "立项时间", type: "date-range" as const },
      { key: "ictProjectAccount", label: "ICT项目所属账套", type: "select" as const, options: [
        { label: "股份公司", value: "gufen" }, { label: "信产公司", value: "xinchan" }
      ]},
      { key: "cumulativeIncome", label: "累计确认产数收入", type: "number-range" as const },
      { key: "firstIncomeTime", label: "首次产数收入时间", type: "date-range" as const },
      { key: "cumulativeCost", label: "累计产数成本支出（服务+标品）", type: "number-range" as const },
    ]
  },
  {
    title: "工程信息",
    fields: [
      { key: "engineeringCode", label: "工程项目编码", type: "text" as const, placeholder: "请输入" },
      { key: "engineeringName", label: "工程项目名称", type: "text" as const, placeholder: "请输入" },
      { key: "engineeringStatus", label: "工程项目状态", type: "select" as const, options: [
        { label: "待转固", value: "pending" }, { label: "预转固", value: "pre" },
        { label: "已转固", value: "fixed" }
      ]},
      { key: "engineeringTime", label: "工程立项时间", type: "date-range" as const },
      { key: "engineeringAccount", label: "工程项目所属账套", type: "select" as const, options: [
        { label: "股份公司", value: "gufen" }, { label: "信产公司", value: "xinchan" }
      ]},
      { key: "preFixDate", label: "预转固日期", type: "date-range" as const },
      { key: "fixDate", label: "转固日期", type: "date-range" as const },
      { key: "engineeringBudget", label: "工程项目立项批复金额", type: "number-range" as const },
      { key: "investRatio", label: "投资占比(%)", type: "number-range" as const },
      { key: "cumulativeInvest", label: "累计已发生投资额", type: "number-range" as const },
    ]
  },
  {
    title: "稽核",
    fields: [
      { key: "auditResult", label: "稽核结果", type: "select" as const, options: [
        { label: "已列产数收入，工程未转固（或预转固），未列产数成本", value: "no-cost" },
        { label: "已列产数收入，工程未转固（或预转固），已列产数成本", value: "has-cost" },
        { label: "使用投资资源，但ICT项目类型为成本型或分成型", value: "invest-abnormal" },
        { label: "疑似违规使用股份公司投资资源", value: "violate" },
      ]},
    ]
  },
];

const config: ReportConfig = {
  title: "已列收工程未转固无支出",
  description: "已列收工程未转固无支出情况查询",
  columns,
  headerGroups: topGroups,
  hasThreeLevelHeader: false,
};

export function ConstructNotFixedNoExpense() {
  return (
    <ReportTemplate config={config} queryFields={queryFields} data={mockData} showDetail={true} />
  );
}
