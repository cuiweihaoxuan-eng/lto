import React from "react";
import { ReportTemplate, ReportColumn, ReportHeaderGroup } from "./ReportTemplate";
import type { ReportConfig } from "./ReportTemplate";

// 40列，精确对应CSV Row51-53结构：
// 0-9:   基本信息(10列)
// 10-20: 预算阶段(11列)
// 21-31: 结算阶段(11列)
// 32-35: 项目进度(4列)
// 36-39: 项目差异率(4列)

const allColumns: ReportColumn[] = [
  // 基本信息 dense 0-9 (10列)
  { key: "currentPeriod", label: "当前账期", width: 100 },
  { key: "city", label: "地市", width: 80 },
  { key: "district", label: "区县", width: 80 },
  { key: "projectCode", label: "项目编号", width: 130 },
  { key: "projectName", label: "项目名称", width: 180 },
  { key: "projectType", label: "项目类型", width: 100 },
  { key: "projectManager", label: "项目经理", width: 90 },
  { key: "projectStartTime", label: "立项时点", width: 110 },
  { key: "projectStatus", label: "项目状态", width: 90 },
  { key: "rowType", label: "类型", width: 80 },

  // 预算阶段 dense 10-20 (11列)
  { key: "budgetPlanTotal", label: "项目计划金额", width: 120, align: "right", groupColor: "bg-blue-50" },
  { key: "budgetPlanService", label: "（1）服务支出", width: 120, align: "right", groupColor: "bg-blue-50" },
  { key: "budgetPlanServiceCost1", label: "其中：解析计划（成本列账）", width: 140, align: "right", groupColor: "bg-blue-50" },
  { key: "budgetPlanServiceCost2", label: "其中：解析计划（减收）", width: 130, align: "right", groupColor: "bg-blue-50" },
  { key: "budgetPlanServiceCost3", label: "其中：ICT采购订单", width: 120, align: "right", groupColor: "bg-blue-50" },
  { key: "budgetPlanServiceCost4", label: "其中：投资", width: 80, align: "right", groupColor: "bg-blue-50" },
  { key: "budgetPlanServiceCost5", label: "其中：原子能力订单", width: 120, align: "right", groupColor: "bg-blue-50" },
  { key: "budgetPlanEquip", label: "（2）设备支出", width: 120, align: "right", groupColor: "bg-blue-50" },
  { key: "budgetPlanEquipCost1", label: "其中：解析计划（减收）", width: 120, align: "right", groupColor: "bg-blue-50" },
  { key: "budgetPlanEquipCost2", label: "其中：ICT采购订单", width: 120, align: "right", groupColor: "bg-blue-50" },
  { key: "budgetPlanOther", label: "（3）代收代付", width: 100, align: "right", groupColor: "bg-blue-50" },

  // 结算阶段 dense 21-31 (11列)
  { key: "settleActualTotal", label: "项目实际金额", width: 120, align: "right", groupColor: "bg-teal-50" },
  { key: "settleActualService", label: "（1）服务支出", width: 120, align: "right", groupColor: "bg-teal-50" },
  { key: "settleActualServiceCost1", label: "其中：成本列账", width: 100, align: "right", groupColor: "bg-teal-50" },
  { key: "settleActualServiceCost2", label: "其中：实际减收", width: 100, align: "right", groupColor: "bg-teal-50" },
  { key: "settleActualServiceCost3", label: "其中：ICT服务确认", width: 120, align: "right", groupColor: "bg-teal-50" },
  { key: "settleActualServiceCost4", label: "其中：投资", width: 80, align: "right", groupColor: "bg-teal-50" },
  { key: "settleActualServiceCost5", label: "其中：原子能力出账", width: 120, align: "right", groupColor: "bg-teal-50" },
  { key: "settleActualEquip", label: "（2）设备支出", width: 120, align: "right", groupColor: "bg-teal-50" },
  { key: "settleActualEquipCost1", label: "其中：实际减收", width: 100, align: "right", groupColor: "bg-teal-50" },
  { key: "settleActualEquipCost2", label: "其中：ICT到货确认", width: 120, align: "right", groupColor: "bg-teal-50" },
  { key: "settleActualOther", label: "（3）代收代付", width: 100, align: "right", groupColor: "bg-teal-50" },

  // 项目进度 dense 32-35 (4列)
  { key: "progressTotal", label: "项目确收进度", width: 110, align: "right", groupColor: "bg-green-50" },
  { key: "progressService", label: "其中：产数服务", width: 120, align: "right", groupColor: "bg-green-50" },
  { key: "progressEquip", label: "其中：设备销售、租赁", width: 130, align: "right", groupColor: "bg-green-50" },
  { key: "progressOther", label: "其中：代收代付", width: 110, align: "right", groupColor: "bg-green-50" },

  // 项目差异率 dense 36-39 (4列)
  { key: "diffTotal", label: "项目差异率", width: 100, align: "right", groupColor: "bg-purple-50" },
  { key: "diffService", label: "其中：产数服务", width: 110, align: "right", groupColor: "bg-purple-50" },
  { key: "diffEquip", label: "其中：设备销售、租赁", width: 130, align: "right", groupColor: "bg-purple-50" },
  { key: "diffOther", label: "其中：代收代付", width: 110, align: "right", groupColor: "bg-purple-50" },
];

// 三级表头（3行）：
// Row1: 一级分组名称（rowSpan=3）
// Row2: 二级分组名称（合并显示：项目基本信息、项目计划金额、其中：产数服务等）
//        subRowLabels 用于跨越多列的合并标签（如"其中：产数服务" span=6）
// Row3: 三级列名（当前账期、其中：解析计划（成本列账）等）
const topGroups: ReportHeaderGroup[] = [
  // 一级: 项目基本信息 → rowSpan=3
  {
    label: "项目基本信息", startCol: 0, span: 10, color: "bg-gray-100",
    children: [
      { label: "项目基本信息", startCol: 0, span: 10, hasChildren: false },
    ],
  },

  // 一级: 预算阶段-项目计划（dense 10-20, span=11）
  {
    label: "预算阶段-项目计划", startCol: 10, span: 11, color: "bg-blue-50",
    children: [
      // 项目计划金额（无子行标签，单列）
      { label: "项目计划金额", startCol: 10, span: 1, hasChildren: false },
      // 产数服务（子行标签跨越6列）
      {
        label: "其中：产数服务", startCol: 11, span: 6, hasChildren: false,
        subRowLabels: [
          { label: "其中：产数服务", span: 6, color: "bg-blue-50" },
        ],
      },
      // 设备销售、租赁（子行标签跨越3列）
      {
        label: "其中：设备销售、租赁", startCol: 17, span: 3, hasChildren: false,
        subRowLabels: [
          { label: "其中：设备销售、租赁", span: 3, color: "bg-blue-50" },
        ],
      },
      // 代收代付（子行标签跨越2列）
      {
        label: "其中：代收代付", startCol: 20, span: 2, hasChildren: false,
        subRowLabels: [
          { label: "其中：代收代付", span: 2, color: "bg-blue-50" },
        ],
      },
    ],
  },

  // 一级: 结算阶段-项目实际收入及支出（dense 21-31, span=11）
  {
    label: "结算阶段-项目实际收入及支出", startCol: 21, span: 11, color: "bg-teal-50",
    children: [
      // 项目实际金额（无子行标签，单列）
      { label: "项目实际金额", startCol: 21, span: 1, hasChildren: false },
      // 产数服务（子行标签跨越6列）
      {
        label: "其中：产数服务", startCol: 22, span: 6, hasChildren: false,
        subRowLabels: [
          { label: "其中：产数服务", span: 6, color: "bg-teal-50" },
        ],
      },
      // 设备销售、租赁（子行标签跨越3列）
      {
        label: "其中：设备销售、租赁", startCol: 28, span: 3, hasChildren: false,
        subRowLabels: [
          { label: "其中：设备销售、租赁", span: 3, color: "bg-teal-50" },
        ],
      },
      // 代收代付（子行标签跨越2列）
      {
        label: "其中：代收代付", startCol: 31, span: 2, hasChildren: false,
        subRowLabels: [
          { label: "其中：代收代付", span: 2, color: "bg-teal-50" },
        ],
      },
    ],
  },

  // 一级: 项目进度（dense 32-35, span=4）
  {
    label: "项目进度", startCol: 32, span: 4, color: "bg-green-100",
    children: [
      { label: "项目进度", startCol: 32, span: 1, hasChildren: false },
      { label: "其中：产数服务", startCol: 33, span: 1, hasChildren: false },
      { label: "其中：设备销售、租赁", startCol: 34, span: 1, hasChildren: false },
      { label: "其中：代收代付", startCol: 35, span: 1, hasChildren: false },
    ],
  },

  // 一级: 项目差异率（dense 36-39, span=4）
  {
    label: "项目差异率", startCol: 36, span: 4, color: "bg-purple-100",
    children: [
      { label: "项目差异率", startCol: 36, span: 1, hasChildren: false },
      { label: "其中：产数服务", startCol: 37, span: 1, hasChildren: false },
      { label: "其中：设备销售、租赁", startCol: 38, span: 1, hasChildren: false },
      { label: "其中：代收代付", startCol: 39, span: 1, hasChildren: false },
    ],
  },
];

// 数据：每个项目2行（收入行 + 支出行）
const mockData: Record<string, string | number>[] = [
  // 项目1 - 收入行
  {
    rowType: "收入",
    currentPeriod: "2026-03", city: "杭州", district: "西湖区",
    projectCode: "JHTB-2026-001", projectName: "某区政府信息化项目",
    projectType: "政府信息化", projectManager: "张明",
    projectStartTime: "2026-01-15", projectStatus: "实施中",
    budgetPlanTotal: 580, budgetPlanService: 0, budgetPlanServiceCost1: 0,
    budgetPlanServiceCost2: 0, budgetPlanServiceCost3: 0, budgetPlanServiceCost4: 0,
    budgetPlanServiceCost5: 0, budgetPlanEquip: 0, budgetPlanEquipCost1: 0,
    budgetPlanEquipCost2: 0, budgetPlanOther: 0,
    settleActualTotal: 540, settleActualService: 0, settleActualServiceCost1: 0,
    settleActualServiceCost2: 0, settleActualServiceCost3: 0, settleActualServiceCost4: 0,
    settleActualServiceCost5: 0, settleActualEquip: 0, settleActualEquipCost1: 0,
    settleActualEquipCost2: 0, settleActualOther: 15,
    progressTotal: "93.1%", progressService: "92.2%", progressEquip: "94.2%", progressOther: "-",
    diffTotal: "-6.9%", diffService: "-7.8%", diffEquip: "-5.8%", diffOther: "-",
  },
  // 项目1 - 支出行
  {
    rowType: "支出",
    currentPeriod: "", city: "", district: "",
    projectCode: "", projectName: "",
    projectType: "", projectManager: "",
    projectStartTime: "", projectStatus: "",
    budgetPlanTotal: 0, budgetPlanService: 180, budgetPlanServiceCost1: 20,
    budgetPlanServiceCost2: 15, budgetPlanServiceCost3: 5, budgetPlanServiceCost4: 0,
    budgetPlanServiceCost5: 0, budgetPlanEquip: 0, budgetPlanEquipCost1: 0,
    budgetPlanEquipCost2: 0, budgetPlanOther: 0,
    settleActualTotal: 0, settleActualService: 170, settleActualServiceCost1: 22,
    settleActualServiceCost2: 14, settleActualServiceCost3: 4, settleActualServiceCost4: 0,
    settleActualServiceCost5: 0, settleActualEquip: 0, settleActualEquipCost1: 0,
    settleActualEquipCost2: 0, settleActualOther: 0,
    progressTotal: "", progressService: "", progressEquip: "", progressOther: "",
    diffTotal: "", diffService: "", diffEquip: "", diffOther: "",
  },

  // 项目2 - 收入行
  {
    rowType: "收入",
    currentPeriod: "2026-03", city: "宁波", district: "鄞州区",
    projectCode: "JHTB-2026-002", projectName: "智慧校园建设项目",
    projectType: "教育信息化", projectManager: "李华",
    projectStartTime: "2026-02-01", projectStatus: "实施中",
    budgetPlanTotal: 800, budgetPlanService: 0, budgetPlanServiceCost1: 0,
    budgetPlanServiceCost2: 0, budgetPlanServiceCost3: 0, budgetPlanServiceCost4: 0,
    budgetPlanServiceCost5: 0, budgetPlanEquip: 0, budgetPlanEquipCost1: 0,
    budgetPlanEquipCost2: 0, budgetPlanOther: 0,
    settleActualTotal: 740, settleActualService: 0, settleActualServiceCost1: 0,
    settleActualServiceCost2: 0, settleActualServiceCost3: 0, settleActualServiceCost4: 0,
    settleActualServiceCost5: 0, settleActualEquip: 0, settleActualEquipCost1: 0,
    settleActualEquipCost2: 0, settleActualOther: 15,
    progressTotal: "92.5%", progressService: "92.2%", progressEquip: "92.9%", progressOther: "-",
    diffTotal: "-7.5%", diffService: "-7.8%", diffEquip: "-7.1%", diffOther: "-",
  },
  // 项目2 - 支出行
  {
    rowType: "支出",
    currentPeriod: "", city: "", district: "",
    projectCode: "", projectName: "",
    projectType: "", projectManager: "",
    projectStartTime: "", projectStatus: "",
    budgetPlanTotal: 0, budgetPlanService: 250, budgetPlanServiceCost1: 28,
    budgetPlanServiceCost2: 17, budgetPlanServiceCost3: 5, budgetPlanServiceCost4: 0,
    budgetPlanServiceCost5: 0, budgetPlanEquip: 0, budgetPlanEquipCost1: 0,
    budgetPlanEquipCost2: 0, budgetPlanOther: 0,
    settleActualTotal: 0, settleActualService: 230, settleActualServiceCost1: 26,
    settleActualServiceCost2: 16, settleActualServiceCost3: 8, settleActualServiceCost4: 0,
    settleActualServiceCost5: 0, settleActualEquip: 0, settleActualEquipCost1: 0,
    settleActualEquipCost2: 0, settleActualOther: 0,
    progressTotal: "", progressService: "", progressEquip: "", progressOther: "",
    diffTotal: "", diffService: "", diffEquip: "", diffOther: "",
  },

  // 项目3 - 收入行
  {
    rowType: "收入",
    currentPeriod: "2026-03", city: "温州", district: "鹿城区",
    projectCode: "JHTB-2026-003", projectName: "智慧医疗系统项目",
    projectType: "医疗信息化", projectManager: "王芳",
    projectStartTime: "2026-02-20", projectStatus: "实施中",
    budgetPlanTotal: 350, budgetPlanService: 0, budgetPlanServiceCost1: 0,
    budgetPlanServiceCost2: 0, budgetPlanServiceCost3: 0, budgetPlanServiceCost4: 0,
    budgetPlanServiceCost5: 0, budgetPlanEquip: 0, budgetPlanEquipCost1: 0,
    budgetPlanEquipCost2: 0, budgetPlanOther: 0,
    settleActualTotal: 325, settleActualService: 0, settleActualServiceCost1: 0,
    settleActualServiceCost2: 0, settleActualServiceCost3: 0, settleActualServiceCost4: 0,
    settleActualServiceCost5: 0, settleActualEquip: 0, settleActualEquipCost1: 0,
    settleActualEquipCost2: 0, settleActualOther: 15,
    progressTotal: "92.9%", progressService: "92.5%", progressEquip: "93.3%", progressOther: "-",
    diffTotal: "-7.1%", diffService: "-7.5%", diffEquip: "-6.7%", diffOther: "-",
  },
  // 项目3 - 支出行
  {
    rowType: "支出",
    currentPeriod: "", city: "", district: "",
    projectCode: "", projectName: "",
    projectType: "", projectManager: "",
    projectStartTime: "", projectStatus: "",
    budgetPlanTotal: 0, budgetPlanService: 120, budgetPlanServiceCost1: 15,
    budgetPlanServiceCost2: 8, budgetPlanServiceCost3: 2, budgetPlanServiceCost4: 0,
    budgetPlanServiceCost5: 0, budgetPlanEquip: 0, budgetPlanEquipCost1: 0,
    budgetPlanEquipCost2: 0, budgetPlanOther: 0,
    settleActualTotal: 0, settleActualService: 112, settleActualServiceCost1: 14,
    settleActualServiceCost2: 7, settleActualServiceCost3: 2, settleActualServiceCost4: 0,
    settleActualServiceCost5: 0, settleActualEquip: 0, settleActualEquipCost1: 0,
    settleActualEquipCost2: 0, settleActualOther: 0,
    progressTotal: "", progressService: "", progressEquip: "", progressOther: "",
    diffTotal: "", diffService: "", diffEquip: "", diffOther: "",
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
  {
    title: "收入情况",
    fields: [
      { key: "planIncome", label: "项目计划总收入", type: "number-range" as const },
      { key: "actualIncome", label: "项目实际入收总金额", type: "number-range" as const },
      { key: "incomeProgress", label: "项目确收进度", type: "text" as const, placeholder: "如: 93.1", showPercent: true },
    ]
  },
  {
    title: "支出情况",
    fields: [
      { key: "planExpense", label: "项目计划支出总金额", type: "number-range" as const },
      { key: "actualExpense", label: "项目实际支出总金额", type: "number-range" as const },
      { key: "expenseProgress", label: "项目支出进度", type: "text" as const, placeholder: "如: 66.7", showPercent: true },
    ]
  },
  {
    title: "差异情况",
    fields: [
      { key: "diffRate", label: "项目差异率", type: "text" as const, placeholder: "如: -6.9", showPercent: true },
      { key: "serviceDiffRate", label: "项目差异率（产数服务）", type: "text" as const, placeholder: "如: -7.8", showPercent: true },
      { key: "equipDiffRate", label: "项目差异率（设备销售/租赁）", type: "text" as const, placeholder: "如: -5.8", showPercent: true },
      { key: "otherDiffRate", label: "代收代付差异率", type: "text" as const, placeholder: "如: 0", showPercent: true },
    ]
  },
];

const config: ReportConfig = {
  title: "收入确认与成本列账进度差异",
  description: "项目预算计划与实际收入成本列账进度差异分析",
  columns: allColumns,
  headerGroups: topGroups,
  hasThreeLevelHeader: true,
  hasFiveLevelHeader: false,
  dataRowSpan: 2,
};

export function RevenueCostDiff() {
  return (
    <ReportTemplate
      config={config}
      queryFields={queryFields}
      data={mockData}
    />
  );
}
