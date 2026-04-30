import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { RotateCcw, Settings2, Eye, X } from "lucide-react";
import { ColumnVisibilityModal } from "./ui/ColumnVisibilityModal";
import { useColumnVisibility } from "./hooks/useColumnVisibility";

// ==================== 两层表头定义 ====================
// Row2(一级): 项目基本信息 | 收入(25列) | 收款(4列) | 基本信息(3列) | 支出(34列) | 投资(7列) | 付款(4列) = 102列
// Row3(二级): 分类子标题
// Row4+(实际列名): 根据row3的分类，每个子标题下的列名
// 支出部分在row4/7/9/11有额外子行：(1)服务支出、(2)设备支出、(3)代收代付

// 一级表头分组
const level1Groups = [
  { label: "项目基本信息", colStart: 0, colEnd: 24 },
  { label: "收入",       colStart: 25, colEnd: 49 },
  { label: "收款",       colStart: 50, colEnd: 53 },
  { label: "基本信息",    colStart: 54, colEnd: 56 },
  { label: "支出",       colStart: 57, colEnd: 90 },
  { label: "投资",       colStart: 91, colEnd: 97 },
  { label: "付款",       colStart: 98, colEnd: 101 },
];

// 收入二级子标题(横跨col25-49)
const incomeSubGroups = [
  { label: "项目总金额",         colStart: 25, colEnd: 31, rows: 1 },
  { label: "累计到期收入计划",   colStart: 32, colEnd: 37, rows: 1 },
  { label: "当年收入",           colStart: 38, colEnd: 43, rows: 1 },
  { label: "当月收入",           colStart: 44, colEnd: 49, rows: 1 },
];

// 支出二级子标题(col57-90)
const costSubGroups = [
  { label: "项目总支出",         colStart: 57, colEnd: 68, rows: 1 },
  { label: "当年支出",           colStart: 69, colEnd: 79, rows: 1 },
  { label: "当月支出",           colStart: 80, colEnd: 90, rows: 1 },
];

// 实际列名定义
export interface ColumnDef {
  key: string;
  label: string;
  width?: number;
  align?: "left" | "center" | "right";
}

const allColumns: ColumnDef[] = [
  // 项目基本信息 (0-24)
  { key: "currentPeriod",       label: "当前账期",                  width: 90,  align: "center" },
  { key: "city",                label: "地市",                      width: 70,  align: "center" },
  { key: "district",           label: "区县",                      width: 70,  align: "center" },
  { key: "projectCode",        label: "项目编号",                  width: 120, align: "left" },
  { key: "projectName",        label: "项目名称",                  width: 160, align: "left" },
  { key: "projectType",        label: "项目类型",                  width: 100, align: "center" },
  { key: "projectStartTime",    label: "立项时间",                  width: 100, align: "center" },
  { key: "projectStatus",      label: "项目状态",                  width: 80,  align: "center" },
  { key: "industry",           label: "所属行业",                  width: 90,  align: "center" },
  { key: "projectManager",     label: "项目经理",                  width: 80,  align: "center" },
  { key: "projectCategory",    label: "立项类型名称",              width: 100, align: "center" },
  { key: "oppCode",            label: "商机编码",                  width: 120, align: "left" },
  { key: "contractCode",       label: "合同编号",                  width: 120, align: "left" },
  { key: "contractName",       label: "合同名称",                  width: 160, align: "left" },
  { key: "contractStartDate",  label: "合同履行开始日期",          width: 120, align: "center" },
  { key: "contractEndDate",    label: "合同履行结束日期",          width: 120, align: "center" },
  { key: "contractType",       label: "合同类型",                  width: 90,  align: "center" },
  { key: "contractStatus",     label: "合同状态",                  width: 80,  align: "center" },
  { key: "customerCode",       label: "客户编码(P码)",            width: 110, align: "left" },
  { key: "customerName",       label: "客户名称",                  width: 150, align: "left" },
  { key: "customerIndustry",   label: "客户行业属性(三级)",        width: 130, align: "center" },
  { key: "customerDept",       label: "客户管控部门名称",          width: 140, align: "center" },
  { key: "signAmount",         label: "合同签约金额",              width: 110, align: "right" },
  { key: "signDate",          label: "合同签约日期",              width: 100, align: "center" },
  { key: "projectStage",       label: "项目环节",                  width: 80,  align: "center" },
  // 收入-项目总金额 (25-31)
  { key: "incomeTotalTax",     label: "项目总金额（含税）",        width: 130, align: "right" },
  { key: "incomeTotal",       label: "项目总金额（不含税）",      width: 130, align: "right" },
  { key: "incomeBasic",       label: "其中：基本面收入",          width: 120, align: "right" },
  { key: "incomeService",     label: "其中：产数服务收入",        width: 130, align: "right" },
  { key: "incomeProduct",     label: "其中：产数标品收入",        width: 130, align: "right" },
  { key: "incomeEquip",       label: "其中：设备销售、租赁收入",  width: 150, align: "right" },
  { key: "incomeOther",       label: "其中：代收代付",            width: 110, align: "right" },
  // 收入-累计到期收入计划 (32-37)
  { key: "incomePlanTotal",   label: "累计到期收入计划（不含税）",width: 150, align: "right" },
  { key: "incomePlanBasic",   label: "其中：基本面收入",          width: 120, align: "right" },
  { key: "incomePlanService", label: "其中：产数服务收入",        width: 130, align: "right" },
  { key: "incomePlanProduct", label: "其中：产数标品收入",        width: 130, align: "right" },
  { key: "incomePlanEquip",   label: "其中：设备销售、租赁收入",  width: 150, align: "right" },
  { key: "incomePlanOther",   label: "其中：代收代付",            width: 110, align: "right" },
  // 收入-当年收入 (38-43)
  { key: "incomeYearTotal",   label: "当年收入（不含税）",        width: 130, align: "right" },
  { key: "incomeYearBasic",   label: "其中：基本面收入",          width: 120, align: "right" },
  { key: "incomeYearService", label: "其中：产数服务收入",        width: 130, align: "right" },
  { key: "incomeYearProduct", label: "其中：产数标品收入",        width: 130, align: "right" },
  { key: "incomeYearEquip",   label: "其中：设备销售、租赁收入",  width: 150, align: "right" },
  { key: "incomeYearOther",   label: "其中：代收代付",            width: 110, align: "right" },
  // 收入-当月收入 (44-49)
  { key: "incomeMonthTotal",   label: "当月收入（不含税）",        width: 130, align: "right" },
  { key: "incomeMonthBasic",  label: "其中：基本面收入",          width: 120, align: "right" },
  { key: "incomeMonthService",label: "其中：产数服务收入",        width: 130, align: "right" },
  { key: "incomeMonthProduct",label: "其中：产数标品收入",        width: 130, align: "right" },
  { key: "incomeMonthEquip",  label: "其中：设备销售、租赁收入",  width: 150, align: "right" },
  { key: "incomeMonthOther",  label: "其中：代收代付",            width: 110, align: "right" },
  // 收款 (50-53)
  { key: "receivedAmount",     label: "项目收款金额",              width: 120, align: "right" },
  { key: "receivedYearAmt",   label: "项目当年收款金额",          width: 130, align: "right" },
  { key: "receivedMonthAmt",   label: "项目当月收款金额",          width: 130, align: "right" },
  { key: "receivableAmt",      label: "项目累计应收账款",          width: 130, align: "right" },
  // 基本信息 (54-56)
  { key: "supplierContractCode", label: "后向合同编码",          width: 120, align: "left" },
  { key: "supplierContractName", label: "后向合同名称",          width: 160, align: "left" },
  { key: "supplierName",      label: "供应商名称",                width: 140, align: "left" },
  // 支出-项目总支出 (57-68)
  { key: "costTotalTax",       label: "项目支出总金额（含税）",    width: 140, align: "right" },
  { key: "costTotal",         label: "项目支出总金额（不含税）",  width: 140, align: "right" },
  { key: "costService",       label: "（1）服务支出（不含税）",  width: 140, align: "right" },
  { key: "costRecorded",     label: "其中：成本列账",            width: 110, align: "right" },
  { key: "costReduction",     label: "其中：实际减收",            width: 110, align: "right" },
  { key: "costIctService",   label: "其中：ICT服务确认",          width: 120, align: "right" },
  { key: "costInvest",        label: "其中：投资",                width: 90,  align: "right" },
  { key: "costCapability",    label: "其中：原子能力出账",        width: 120, align: "right" },
  { key: "costEquip",        label: "（2）设备支出（不含税）",   width: 130, align: "right" },
  { key: "costEquipReduction",label: "其中：实际减收",            width: 110, align: "right" },
  { key: "costEquipConfirm",  label: "其中：ICT到货确认",          width: 120, align: "right" },
  { key: "costOther",        label: "（3）代收代付（不含税）",  width: 120, align: "right" },
  // 支出-当年支出 (69-79)
  { key: "costYearTotal",      label: "项目当年支出总金额（不含税）",width: 150, align: "right" },
  { key: "costYearService",   label: "（1）服务支出（不含税）",  width: 140, align: "right" },
  { key: "costYearRecorded",  label: "其中：成本列账",            width: 110, align: "right" },
  { key: "costYearReduction",label: "其中：实际减收",            width: 110, align: "right" },
  { key: "costYearIctService",label: "其中：ICT服务确认",         width: 120, align: "right" },
  { key: "costYearInvest",   label: "其中：投资",                width: 90,  align: "right" },
  { key: "costYearCapability",label: "其中：原子能力出账",        width: 120, align: "right" },
  { key: "costYearEquip",   label: "（2）设备支出（不含税）",   width: 130, align: "right" },
  { key: "costYearEquipRed",label: "其中：实际减收",              width: 110, align: "right" },
  { key: "costYearEquipConfirm",label: "其中：ICT到货确认",        width: 120, align: "right" },
  { key: "costYearOther",   label: "（3）代收代付（不含税）",  width: 120, align: "right" },
  // 支出-当月支出 (80-90)
  { key: "costMonthTotal",    label: "项目当月支出总金额（不含税）",width: 150, align: "right" },
  { key: "costMonthService",  label: "（1）服务支出（不含税）",  width: 140, align: "right" },
  { key: "costMonthRecorded", label: "其中：成本列账",            width: 110, align: "right" },
  { key: "costMonthReduction",label: "其中：实际减收",            width: 110, align: "right" },
  { key: "costMonthIctService",label: "其中：ICT服务确认",         width: 120, align: "right" },
  { key: "costMonthInvest",  label: "其中：投资",                width: 90,  align: "right" },
  { key: "costMonthCapability",label: "其中：原子能力出账",        width: 120, align: "right" },
  { key: "costMonthEquip",   label: "（2）设备支出（不含税）",   width: 130, align: "right" },
  { key: "costMonthEquipRed",label: "其中：实际减收",            width: 110, align: "right" },
  { key: "costMonthEquipConfirm",label: "其中：ICT到货确认",      width: 120, align: "right" },
  { key: "costMonthOther",   label: "（3）代收代付（不含税）",  width: 120, align: "right" },
  // 投资 (91-97)
  { key: "wbsCode",           label: "WBS项目编码",              width: 120, align: "left" },
  { key: "wbsName",           label: "WBS项目名称",              width: 140, align: "left" },
  { key: "wbsAmount",         label: "WBS项目立项金额",          width: 120, align: "right" },
  { key: "ictServiceCost",   label: "ICT子项目直接成本（服务）", width: 150, align: "right" },
  { key: "ictEquipCost",     label: "ICT子项目直接成本（设备）", width: 150, align: "right" },
  { key: "invoicedAmount",   label: "累计已开票金额（含税）",    width: 140, align: "right" },
  { key: "totalBudget",      label: "ICT项目总体可用预算",        width: 140, align: "right" },
  // 付款 (98-101)
  { key: "paymentAmount",    label: "项目付款金额",              width: 120, align: "right" },
  { key: "paymentYearAmount",label: "项目当年付款金额",          width: 130, align: "right" },
  { key: "paymentMonthAmount",label: "项目当月付款金额",          width: 130, align: "right" },
  { key: "unpaidAmount",      label: "项目累计未付款金额（应付金额）",width: 160, align: "right" },
];

// 列key到index映射
const colIndexMap: Record<string, number> = {};
allColumns.forEach((c, i) => { colIndexMap[c.key] = i; });

// 支出分项行（在支出二级分组下，每个支出子类有(1)(2)(3)子行）
const costSubItems = [
  { label: "（1）服务支出",  colStart: 59, colEnd: 64, parentCol: 58 },
  { label: "（2）设备支出",  colStart: 65, colEnd: 67, parentCol: 58 },
  { label: "（3）代收代付", colStart: 68, colEnd: 68, parentCol: 58 },
];

// 支出当年/当月子行
const costYearSubItems = [
  { label: "（1）服务支出",  colStart: 70, colEnd: 75, parentCol: 69 },
  { label: "（2）设备支出",  colStart: 76, colEnd: 78, parentCol: 69 },
  { label: "（3）代收代付", colStart: 79, colEnd: 79, parentCol: 69 },
];

const costMonthSubItems = [
  { label: "（1）服务支出",  colStart: 81, colEnd: 86, parentCol: 80 },
  { label: "（2）设备支出",  colStart: 87, colEnd: 89, parentCol: 80 },
  { label: "（3）代收代付", colStart: 90, colEnd: 90, parentCol: 80 },
];

// ==================== 颜色主题 ====================
// 一级分组颜色(bg)
const level1Colors: Record<string, string> = {
  "项目基本信息": "bg-gray-100",
  "收入":         "bg-blue-50",
  "收款":         "bg-teal-50",
  "基本信息":      "bg-orange-50",
  "支出":         "bg-red-50",
  "投资":         "bg-purple-50",
  "付款":         "bg-green-50",
};
const level1TextColors: Record<string, string> = {
  "项目基本信息": "text-gray-800",
  "收入":         "text-blue-700",
  "收款":         "text-teal-700",
  "基本信息":      "text-orange-700",
  "支出":         "text-red-700",
  "投资":         "text-purple-700",
  "付款":         "text-green-700",
};
// 一级分组边框
const level1Borders: Record<string, string> = {
  "项目基本信息": "border-gray-300",
  "收入":         "border-blue-300",
  "收款":         "border-teal-300",
  "基本信息":      "border-orange-300",
  "支出":         "border-red-300",
  "投资":         "border-purple-300",
  "付款":         "border-green-300",
};

// 二级分组颜色（在一级颜色基础上调整透明度）
const level2Colors: Record<string, { bg: string; text: string; border: string }> = {
  "项目总金额":         { bg: "bg-blue-100",  text: "text-blue-800",  border: "border-blue-200" },
  "累计到期收入计划":   { bg: "bg-blue-50",   text: "text-blue-700",  border: "border-blue-100" },
  "当年收入":           { bg: "bg-blue-50",   text: "text-blue-700",  border: "border-blue-100" },
  "当月收入":           { bg: "bg-blue-50",   text: "text-blue-700",  border: "border-blue-100" },
  "项目总支出":         { bg: "bg-red-100",  text: "text-red-800",  border: "border-red-200" },
  "当年支出":           { bg: "bg-red-50",   text: "text-red-700",  border: "border-red-100" },
  "当月支出":           { bg: "bg-red-50",   text: "text-red-700",  border: "border-red-100" },
  "项目收款金额":       { bg: "bg-teal-100",text: "text-teal-800",border: "border-teal-200" },
  "项目当年收款金额":   { bg: "bg-teal-50", text: "text-teal-700",border: "border-teal-100" },
  "项目当月收款金额":   { bg: "bg-teal-50", text: "text-teal-700",border: "border-teal-100" },
  "项目累计应收账款":   { bg: "bg-teal-50", text: "text-teal-700",border: "border-teal-100" },
};

// 子行颜色（更淡）
const subItemColor = { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" };

// ==================== 类型定义 ====================
type RowData = Record<string, string | number | undefined>;

interface FullFlowTableProps {}

export function FullFlowTable(_props: FullFlowTableProps) {
  const [queryParams, setQueryParams] = useState<Record<string, unknown>>({});
  const [showAllConditions, setShowAllConditions] = useState(false);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [detailPanel, setDetailPanel] = useState<{ row: Record<string, unknown> | null; pinned: boolean }>({ row: null, pinned: false });
  const [columnWidths] = useState<Record<string, number>>(
    Object.fromEntries(allColumns.map(c => [c.key, c.width ?? 120]))
  );

  // 列可见性（3级表头）
  const groups3: { label: string; startCol: number; span: number; color?: string; children?: { label: string; startCol: number; span: number }[] }[] = [
    { label: "项目基本信息", startCol: 0, span: 25, color: "bg-gray-100" },
    {
      label: "收入", startCol: 25, span: 25, color: "bg-blue-100",
      children: incomeSubGroups.map(sg => ({ label: sg.label, startCol: sg.colStart, span: sg.colEnd - sg.colStart + 1 })),
    },
    { label: "收款", startCol: 50, span: 4, color: "bg-teal-100" },
    { label: "基本信息", startCol: 54, span: 3, color: "bg-orange-100" },
    {
      label: "支出", startCol: 57, span: 34, color: "bg-red-100",
      children: costSubGroups.map(sg => ({ label: sg.label, startCol: sg.colStart, span: sg.colEnd - sg.colStart + 1 })),
    },
    { label: "投资", startCol: 91, span: 7, color: "bg-purple-100" },
    { label: "付款", startCol: 98, span: 4, color: "bg-green-100" },
  ];
  const colVis = useColumnVisibility(allColumns as any, groups3 as any, 3);

  // Mock数据：每个项目4行（概算/预算/结算/决算）
  const projects = [
    {
      basic: {
        currentPeriod: "2026-03", city: "杭州", district: "西湖区",
        projectCode: "JHTB-2026-001", projectName: "某区政府信息化项目",
        projectType: "政府信息化", projectStartTime: "2026-01-15", projectStatus: "实施中",
        industry: "政务", projectManager: "张明", projectCategory: "自拓",
        oppCode: "OPP-2026-001", contractCode: "HT-2026-001",
        contractName: "政务云服务合同", contractStartDate: "2026-02-01",
        contractEndDate: "2026-12-31", contractType: "框架合同", contractStatus: "执行中",
        customerCode: "P-2026-001", customerName: "杭州某某区政府",
        customerIndustry: "政务", customerDept: "政企客户部",
        signAmount: "580万", signDate: "2026-01-20",
        wbsCode: "WBS-001", wbsName: "政务云WBS",
        wbsAmount: 300, ictServiceCost: 100, ictEquipCost: 80,
        invoicedAmount: 250, totalBudget: 400,
      },
      est: {
        incomeTotalTax: 580, incomeTotal: 513, incomeBasic: 300, incomeService: 150, incomeProduct: 63, incomeEquip: 0, incomeOther: 0,
        incomePlanTotal: 480, incomePlanBasic: 280, incomePlanService: 140, incomePlanProduct: 60, incomePlanEquip: 0, incomePlanOther: 0,
        incomeYearTotal: 0, incomeYearBasic: 0, incomeYearService: 0, incomeYearProduct: 0, incomeYearEquip: 0, incomeYearOther: 0,
        incomeMonthTotal: 0, incomeMonthBasic: 0, incomeMonthService: 0, incomeMonthProduct: 0, incomeMonthEquip: 0, incomeMonthOther: 0,
        receivedAmount: 0, receivedYearAmt: 0, receivedMonthAmt: 0, receivableAmt: 0,
        supplierContractCode: "SUPP-001", supplierContractName: "某某科技供货合同", supplierName: "杭州某某科技",
        costTotalTax: 0, costTotal: 0, costService: 0, costRecorded: 0, costReduction: 0, costIctService: 0, costInvest: 0, costCapability: 0,
        costEquip: 0, costEquipReduction: 0, costEquipConfirm: 0, costOther: 0,
        costYearTotal: 0, costYearService: 0, costYearRecorded: 0, costYearReduction: 0, costYearIctService: 0, costYearInvest: 0, costYearCapability: 0,
        costYearEquip: 0, costYearEquipRed: 0, costYearEquipConfirm: 0, costYearOther: 0,
        costMonthTotal: 0, costMonthService: 0, costMonthRecorded: 0, costMonthReduction: 0, costMonthIctService: 0, costMonthInvest: 0, costMonthCapability: 0,
        costMonthEquip: 0, costMonthEquipRed: 0, costMonthEquipConfirm: 0, costMonthOther: 0,
        paymentAmount: 0, paymentYearAmount: 0, paymentMonthAmount: 0, unpaidAmount: 0,
      },
      plan: {
        incomeTotalTax: 580, incomeTotal: 513, incomeBasic: 300, incomeService: 150, incomeProduct: 63, incomeEquip: 0, incomeOther: 0,
        incomePlanTotal: 520, incomePlanBasic: 300, incomePlanService: 150, incomePlanProduct: 70, incomePlanEquip: 0, incomePlanOther: 0,
        incomeYearTotal: 200, incomeYearBasic: 120, incomeYearService: 55, incomeYearProduct: 25, incomeYearEquip: 0, incomeYearOther: 0,
        incomeMonthTotal: 80, incomeMonthBasic: 48, incomeMonthService: 22, incomeMonthProduct: 10, incomeMonthEquip: 0, incomeMonthOther: 0,
        receivedAmount: 300, receivedYearAmt: 200, receivedMonthAmt: 50, receivableAmt: 213,
        supplierContractCode: "SUPP-001", supplierContractName: "某某科技供货合同", supplierName: "杭州某某科技",
        costTotalTax: 420, costTotal: 370, costService: 220, costRecorded: 180, costReduction: 20, costIctService: 15, costInvest: 5, costCapability: 0,
        costEquip: 150, costEquipReduction: 0, costEquipConfirm: 150, costOther: 0,
        costYearTotal: 150, costYearService: 90, costYearRecorded: 75, costYearReduction: 8, costYearIctService: 5, costYearInvest: 2, costYearCapability: 0,
        costYearEquip: 60, costYearEquipRed: 0, costYearEquipConfirm: 60, costYearOther: 0,
        costMonthTotal: 40, costMonthService: 25, costMonthRecorded: 20, costMonthReduction: 3, costMonthIctService: 2, costMonthInvest: 0, costMonthCapability: 0,
        costMonthEquip: 15, costMonthEquipRed: 0, costMonthEquipConfirm: 15, costMonthOther: 0,
        paymentAmount: 280, paymentYearAmount: 180, paymentMonthAmount: 40, unpaidAmount: 140,
      },
      settle: {
        incomeTotalTax: 580, incomeTotal: 513, incomeBasic: 300, incomeService: 150, incomeProduct: 63, incomeEquip: 0, incomeOther: 0,
        incomePlanTotal: 500, incomePlanBasic: 290, incomePlanService: 145, incomePlanProduct: 65, incomePlanEquip: 0, incomePlanOther: 0,
        incomeYearTotal: 250, incomeYearBasic: 145, incomeYearService: 70, incomeYearProduct: 35, incomeYearEquip: 0, incomeYearOther: 0,
        incomeMonthTotal: 100, incomeMonthBasic: 58, incomeMonthService: 28, incomeMonthProduct: 14, incomeMonthEquip: 0, incomeMonthOther: 0,
        receivedAmount: 420, receivedYearAmt: 320, receivedMonthAmt: 100, receivableAmt: 93,
        supplierContractCode: "SUPP-001", supplierContractName: "某某科技供货合同", supplierName: "杭州某某科技",
        costTotalTax: 430, costTotal: 380, costService: 225, costRecorded: 185, costReduction: 20, costIctService: 15, costInvest: 5, costCapability: 0,
        costEquip: 155, costEquipReduction: 0, costEquipConfirm: 155, costOther: 0,
        costYearTotal: 180, costYearService: 108, costYearRecorded: 90, costYearReduction: 10, costYearIctService: 6, costYearInvest: 2, costYearCapability: 0,
        costYearEquip: 72, costYearEquipRed: 0, costYearEquipConfirm: 72, costYearOther: 0,
        costMonthTotal: 55, costMonthService: 33, costMonthRecorded: 28, costMonthReduction: 3, costMonthIctService: 2, costMonthInvest: 0, costMonthCapability: 0,
        costMonthEquip: 22, costMonthEquipRed: 0, costMonthEquipConfirm: 22, costMonthOther: 0,
        paymentAmount: 310, paymentYearAmount: 210, paymentMonthAmount: 55, unpaidAmount: 120,
      },
      final: {
        incomeTotalTax: 580, incomeTotal: 513, incomeBasic: 300, incomeService: 150, incomeProduct: 63, incomeEquip: 0, incomeOther: 0,
        incomePlanTotal: 480, incomePlanBasic: 280, incomePlanService: 140, incomePlanProduct: 60, incomePlanEquip: 0, incomePlanOther: 0,
        incomeYearTotal: 280, incomeYearBasic: 162, incomeYearService: 78, incomeYearProduct: 40, incomeYearEquip: 0, incomeYearOther: 0,
        incomeMonthTotal: 120, incomeMonthBasic: 70, incomeMonthService: 34, incomeMonthProduct: 16, incomeMonthEquip: 0, incomeMonthOther: 0,
        receivedAmount: 480, receivedYearAmt: 380, receivedMonthAmt: 120, receivableAmt: 33,
        supplierContractCode: "SUPP-001", supplierContractName: "某某科技供货合同", supplierName: "杭州某某科技",
        costTotalTax: 435, costTotal: 385, costService: 228, costRecorded: 188, costReduction: 20, costIctService: 15, costInvest: 5, costCapability: 0,
        costEquip: 157, costEquipReduction: 0, costEquipConfirm: 157, costOther: 0,
        costYearTotal: 195, costYearService: 117, costYearRecorded: 97, costYearReduction: 10, costYearIctService: 6, costYearInvest: 4, costYearCapability: 0,
        costYearEquip: 78, costYearEquipRed: 0, costYearEquipConfirm: 78, costYearOther: 0,
        costMonthTotal: 60, costMonthService: 36, costMonthRecorded: 30, costMonthReduction: 4, costMonthIctService: 2, costMonthInvest: 0, costMonthCapability: 0,
        costMonthEquip: 24, costMonthEquipRed: 0, costMonthEquipConfirm: 24, costMonthOther: 0,
        paymentAmount: 340, paymentYearAmount: 240, paymentMonthAmount: 65, unpaidAmount: 95,
      },
    },
    {
      basic: {
        currentPeriod: "2026-03", city: "宁波", district: "鄞州区",
        projectCode: "JHTB-2026-002", projectName: "智慧校园建设项目",
        projectType: "教育信息化", projectStartTime: "2026-02-01", projectStatus: "实施中",
        industry: "教育", projectManager: "李华", projectCategory: "自拓",
        oppCode: "OPP-2026-002", contractCode: "HT-2026-002",
        contractName: "教育信息化合同", contractStartDate: "2026-03-01",
        contractEndDate: "2027-02-28", contractType: "项目合同", contractStatus: "执行中",
        customerCode: "P-2026-002", customerName: "宁波某某学校",
        customerIndustry: "教育", customerDept: "教育行业部",
        signAmount: "800万", signDate: "2026-02-15",
        wbsCode: "WBS-002", wbsName: "校园网WBS",
        wbsAmount: 450, ictServiceCost: 150, ictEquipCost: 120,
        invoicedAmount: 320, totalBudget: 600,
      },
      est: {
        incomeTotalTax: 800, incomeTotal: 720, incomeBasic: 420, incomeService: 200, incomeProduct: 100, incomeEquip: 0, incomeOther: 0,
        incomePlanTotal: 700, incomePlanBasic: 400, incomePlanService: 190, incomePlanProduct: 110, incomePlanEquip: 0, incomePlanOther: 0,
        incomeYearTotal: 0, incomeYearBasic: 0, incomeYearService: 0, incomeYearProduct: 0, incomeYearEquip: 0, incomeYearOther: 0,
        incomeMonthTotal: 0, incomeMonthBasic: 0, incomeMonthService: 0, incomeMonthProduct: 0, incomeMonthEquip: 0, incomeMonthOther: 0,
        receivedAmount: 0, receivedYearAmt: 0, receivedMonthAmt: 0, receivableAmt: 0,
        supplierContractCode: "SUPP-002", supplierContractName: "某某设备供货合同", supplierName: "宁波某某设备公司",
        costTotalTax: 0, costTotal: 0, costService: 0, costRecorded: 0, costReduction: 0, costIctService: 0, costInvest: 0, costCapability: 0,
        costEquip: 0, costEquipReduction: 0, costEquipConfirm: 0, costOther: 0,
        costYearTotal: 0, costYearService: 0, costYearRecorded: 0, costYearReduction: 0, costYearIctService: 0, costYearInvest: 0, costYearCapability: 0,
        costYearEquip: 0, costYearEquipRed: 0, costYearEquipConfirm: 0, costYearOther: 0,
        costMonthTotal: 0, costMonthService: 0, costMonthRecorded: 0, costMonthReduction: 0, costMonthIctService: 0, costMonthInvest: 0, costMonthCapability: 0,
        costMonthEquip: 0, costMonthEquipRed: 0, costMonthEquipConfirm: 0, costMonthOther: 0,
        paymentAmount: 0, paymentYearAmount: 0, paymentMonthAmount: 0, unpaidAmount: 0,
      },
      plan: {
        incomeTotalTax: 800, incomeTotal: 720, incomeBasic: 420, incomeService: 200, incomeProduct: 100, incomeEquip: 0, incomeOther: 0,
        incomePlanTotal: 650, incomePlanBasic: 380, incomePlanService: 175, incomePlanProduct: 95, incomePlanEquip: 0, incomePlanOther: 0,
        incomeYearTotal: 280, incomeYearBasic: 165, incomeYearService: 78, incomeYearProduct: 37, incomeYearEquip: 0, incomeYearOther: 0,
        incomeMonthTotal: 100, incomeMonthBasic: 58, incomeMonthService: 28, incomeMonthProduct: 14, incomeMonthEquip: 0, incomeMonthOther: 0,
        receivedAmount: 350, receivedYearAmt: 250, receivedMonthAmt: 80, receivableAmt: 300,
        supplierContractCode: "SUPP-002", supplierContractName: "某某设备供货合同", supplierName: "宁波某某设备公司",
        costTotalTax: 560, costTotal: 500, costService: 300, costRecorded: 250, costReduction: 25, costIctService: 18, costInvest: 7, costCapability: 0,
        costEquip: 200, costEquipReduction: 0, costEquipConfirm: 200, costOther: 0,
        costYearTotal: 180, costYearService: 108, costYearRecorded: 90, costYearReduction: 10, costYearIctService: 6, costYearInvest: 2, costYearCapability: 0,
        costYearEquip: 72, costYearEquipRed: 0, costYearEquipConfirm: 72, costYearOther: 0,
        costMonthTotal: 50, costMonthService: 30, costMonthRecorded: 25, costMonthReduction: 3, costMonthIctService: 2, costMonthInvest: 0, costMonthCapability: 0,
        costMonthEquip: 20, costMonthEquipRed: 0, costMonthEquipConfirm: 20, costMonthOther: 0,
        paymentAmount: 320, paymentYearAmount: 220, paymentMonthAmount: 50, unpaidAmount: 180,
      },
      settle: {
        incomeTotalTax: 800, incomeTotal: 720, incomeBasic: 420, incomeService: 200, incomeProduct: 100, incomeEquip: 0, incomeOther: 0,
        incomePlanTotal: 620, incomePlanBasic: 360, incomePlanService: 165, incomePlanProduct: 95, incomePlanEquip: 0, incomePlanOther: 0,
        incomeYearTotal: 350, incomeYearBasic: 205, incomeYearService: 98, incomeYearProduct: 47, incomeYearEquip: 0, incomeYearOther: 0,
        incomeMonthTotal: 120, incomeMonthBasic: 70, incomeMonthService: 35, incomeMonthProduct: 15, incomeMonthEquip: 0, incomeMonthOther: 0,
        receivedAmount: 480, receivedYearAmt: 380, receivedMonthAmt: 120, receivableAmt: 140,
        supplierContractCode: "SUPP-002", supplierContractName: "某某设备供货合同", supplierName: "宁波某某设备公司",
        costTotalTax: 580, costTotal: 515, costService: 310, costRecorded: 260, costReduction: 25, costIctService: 18, costInvest: 7, costCapability: 0,
        costEquip: 205, costEquipReduction: 0, costEquipConfirm: 205, costOther: 0,
        costYearTotal: 210, costYearService: 126, costYearRecorded: 105, costYearReduction: 12, costYearIctService: 7, costYearInvest: 2, costYearCapability: 0,
        costYearEquip: 84, costYearEquipRed: 0, costYearEquipConfirm: 84, costYearOther: 0,
        costMonthTotal: 60, costMonthService: 36, costMonthRecorded: 30, costMonthReduction: 4, costMonthIctService: 2, costMonthInvest: 0, costMonthCapability: 0,
        costMonthEquip: 24, costMonthEquipRed: 0, costMonthEquipConfirm: 24, costMonthOther: 0,
        paymentAmount: 380, paymentYearAmount: 260, paymentMonthAmount: 65, unpaidAmount: 155,
      },
      final: {
        incomeTotalTax: 800, incomeTotal: 720, incomeBasic: 420, incomeService: 200, incomeProduct: 100, incomeEquip: 0, incomeOther: 0,
        incomePlanTotal: 580, incomePlanBasic: 340, incomePlanService: 155, incomePlanProduct: 85, incomePlanEquip: 0, incomePlanOther: 0,
        incomeYearTotal: 420, incomeYearBasic: 245, incomeYearService: 118, incomeYearProduct: 57, incomeYearEquip: 0, incomeYearOther: 0,
        incomeMonthTotal: 150, incomeMonthBasic: 88, incomeMonthService: 42, incomeMonthProduct: 18, incomeMonthEquip: 0, incomeMonthOther: 0,
        receivedAmount: 560, receivedYearAmt: 460, receivedMonthAmt: 150, receivableAmt: 60,
        supplierContractCode: "SUPP-002", supplierContractName: "某某设备供货合同", supplierName: "宁波某某设备公司",
        costTotalTax: 595, costTotal: 528, costService: 318, costRecorded: 268, costReduction: 25, costIctService: 18, costInvest: 7, costCapability: 0,
        costEquip: 210, costEquipReduction: 0, costEquipConfirm: 210, costOther: 0,
        costYearTotal: 240, costYearService: 144, costYearRecorded: 120, costYearReduction: 12, costYearIctService: 8, costYearInvest: 4, costYearCapability: 0,
        costYearEquip: 96, costYearEquipRed: 0, costYearEquipConfirm: 96, costYearOther: 0,
        costMonthTotal: 70, costMonthService: 42, costMonthRecorded: 35, costMonthReduction: 5, costMonthIctService: 2, costMonthInvest: 0, costMonthCapability: 0,
        costMonthEquip: 28, costMonthEquipRed: 0, costMonthEquipConfirm: 28, costMonthOther: 0,
        paymentAmount: 450, paymentYearAmount: 310, paymentMonthAmount: 80, unpaidAmount: 110,
      },
    },
    {
      basic: {
        currentPeriod: "2026-03", city: "温州", district: "鹿城区",
        projectCode: "JHTB-2026-003", projectName: "智慧医疗系统项目",
        projectType: "医疗信息化", projectStartTime: "2026-02-20", projectStatus: "实施中",
        industry: "医疗", projectManager: "王芳", projectCategory: "自拓",
        oppCode: "OPP-2026-003", contractCode: "HT-2026-003",
        contractName: "医疗信息化合同", contractStartDate: "2026-04-01",
        contractEndDate: "2027-03-31", contractType: "框架合同", contractStatus: "执行中",
        customerCode: "P-2026-003", customerName: "温州某某医院",
        customerIndustry: "医疗", customerDept: "医疗行业部",
        signAmount: "350万", signDate: "2026-03-10",
        wbsCode: "WBS-003", wbsName: "医疗云WBS",
        wbsAmount: 180, ictServiceCost: 60, ictEquipCost: 50,
        invoicedAmount: 150, totalBudget: 280,
      },
      est: {
        incomeTotalTax: 350, incomeTotal: 315, incomeBasic: 180, incomeService: 90, incomeProduct: 45, incomeEquip: 0, incomeOther: 0,
        incomePlanTotal: 300, incomePlanBasic: 170, incomePlanService: 85, incomePlanProduct: 45, incomePlanEquip: 0, incomePlanOther: 0,
        incomeYearTotal: 0, incomeYearBasic: 0, incomeYearService: 0, incomeYearProduct: 0, incomeYearEquip: 0, incomeYearOther: 0,
        incomeMonthTotal: 0, incomeMonthBasic: 0, incomeMonthService: 0, incomeMonthProduct: 0, incomeMonthEquip: 0, incomeMonthOther: 0,
        receivedAmount: 0, receivedYearAmt: 0, receivedMonthAmt: 0, receivableAmt: 0,
        supplierContractCode: "SUPP-003", supplierContractName: "医疗设备供货合同", supplierName: "温州某某医疗科技",
        costTotalTax: 0, costTotal: 0, costService: 0, costRecorded: 0, costReduction: 0, costIctService: 0, costInvest: 0, costCapability: 0,
        costEquip: 0, costEquipReduction: 0, costEquipConfirm: 0, costOther: 0,
        costYearTotal: 0, costYearService: 0, costYearRecorded: 0, costYearReduction: 0, costYearIctService: 0, costYearInvest: 0, costYearCapability: 0,
        costYearEquip: 0, costYearEquipRed: 0, costYearEquipConfirm: 0, costYearOther: 0,
        costMonthTotal: 0, costMonthService: 0, costMonthRecorded: 0, costMonthReduction: 0, costMonthIctService: 0, costMonthInvest: 0, costMonthCapability: 0,
        costMonthEquip: 0, costMonthEquipRed: 0, costMonthEquipConfirm: 0, costMonthOther: 0,
        paymentAmount: 0, paymentYearAmount: 0, paymentMonthAmount: 0, unpaidAmount: 0,
      },
      plan: {
        incomeTotalTax: 350, incomeTotal: 315, incomeBasic: 180, incomeService: 90, incomeProduct: 45, incomeEquip: 0, incomeOther: 0,
        incomePlanTotal: 280, incomePlanBasic: 158, incomePlanService: 78, incomePlanProduct: 44, incomePlanEquip: 0, incomePlanOther: 0,
        incomeYearTotal: 120, incomeYearBasic: 68, incomeYearService: 35, incomeYearProduct: 17, incomeYearEquip: 0, incomeYearOther: 0,
        incomeMonthTotal: 50, incomeMonthBasic: 28, incomeMonthService: 14, incomeMonthProduct: 8, incomeMonthEquip: 0, incomeMonthOther: 0,
        receivedAmount: 150, receivedYearAmt: 100, receivedMonthAmt: 30, receivableAmt: 170,
        supplierContractCode: "SUPP-003", supplierContractName: "医疗设备供货合同", supplierName: "温州某某医疗科技",
        costTotalTax: 240, costTotal: 215, costService: 130, costRecorded: 108, costReduction: 12, costIctService: 8, costInvest: 2, costCapability: 0,
        costEquip: 85, costEquipReduction: 0, costEquipConfirm: 85, costOther: 0,
        costYearTotal: 85, costYearService: 51, costYearRecorded: 43, costYearReduction: 5, costYearIctService: 3, costYearInvest: 0, costYearCapability: 0,
        costYearEquip: 34, costYearEquipRed: 0, costYearEquipConfirm: 34, costYearOther: 0,
        costMonthTotal: 25, costMonthService: 15, costMonthRecorded: 12, costMonthReduction: 2, costMonthIctService: 1, costMonthInvest: 0, costMonthCapability: 0,
        costMonthEquip: 10, costMonthEquipRed: 0, costMonthEquipConfirm: 10, costMonthOther: 0,
        paymentAmount: 160, paymentYearAmount: 110, paymentMonthAmount: 30, unpaidAmount: 80,
      },
      settle: {
        incomeTotalTax: 350, incomeTotal: 315, incomeBasic: 180, incomeService: 90, incomeProduct: 45, incomeEquip: 0, incomeOther: 0,
        incomePlanTotal: 260, incomePlanBasic: 148, incomePlanService: 72, incomePlanProduct: 40, incomePlanEquip: 0, incomePlanOther: 0,
        incomeYearTotal: 160, incomeYearBasic: 92, incomeYearService: 47, incomeYearProduct: 21, incomeYearEquip: 0, incomeYearOther: 0,
        incomeMonthTotal: 65, incomeMonthBasic: 38, incomeMonthService: 19, incomeMonthProduct: 8, incomeMonthEquip: 0, incomeMonthOther: 0,
        receivedAmount: 220, receivedYearAmt: 170, receivedMonthAmt: 60, receivableAmt: 95,
        supplierContractCode: "SUPP-003", supplierContractName: "医疗设备供货合同", supplierName: "温州某某医疗科技",
        costTotalTax: 250, costTotal: 225, costService: 136, costRecorded: 114, costReduction: 12, costIctService: 8, costInvest: 2, costCapability: 0,
        costEquip: 89, costEquipReduction: 0, costEquipConfirm: 89, costOther: 0,
        costYearTotal: 100, costYearService: 60, costYearRecorded: 50, costYearReduction: 6, costYearIctService: 4, costYearInvest: 0, costYearCapability: 0,
        costYearEquip: 40, costYearEquipRed: 0, costYearEquipConfirm: 40, costYearOther: 0,
        costMonthTotal: 30, costMonthService: 18, costMonthRecorded: 15, costMonthReduction: 2, costMonthIctService: 1, costMonthInvest: 0, costMonthCapability: 0,
        costMonthEquip: 12, costMonthEquipRed: 0, costMonthEquipConfirm: 12, costMonthOther: 0,
        paymentAmount: 200, paymentYearAmount: 140, paymentMonthAmount: 40, unpaidAmount: 60,
      },
      final: {
        incomeTotalTax: 350, incomeTotal: 315, incomeBasic: 180, incomeService: 90, incomeProduct: 45, incomeEquip: 0, incomeOther: 0,
        incomePlanTotal: 240, incomePlanBasic: 136, incomePlanService: 68, incomePlanProduct: 36, incomePlanEquip: 0, incomePlanOther: 0,
        incomeYearTotal: 200, incomeYearBasic: 115, incomeYearService: 58, incomeYearProduct: 27, incomeYearEquip: 0, incomeYearOther: 0,
        incomeMonthTotal: 80, incomeMonthBasic: 46, incomeMonthService: 24, incomeMonthProduct: 10, incomeMonthEquip: 0, incomeMonthOther: 0,
        receivedAmount: 280, receivedYearAmt: 230, receivedMonthAmt: 80, receivableAmt: 35,
        supplierContractCode: "SUPP-003", supplierContractName: "医疗设备供货合同", supplierName: "温州某某医疗科技",
        costTotalTax: 255, costTotal: 230, costService: 139, costRecorded: 117, costReduction: 12, costIctService: 8, costInvest: 2, costCapability: 0,
        costEquip: 91, costEquipReduction: 0, costEquipConfirm: 91, costOther: 0,
        costYearTotal: 115, costYearService: 69, costYearRecorded: 58, costYearReduction: 6, costYearIctService: 5, costYearInvest: 0, costYearCapability: 0,
        costYearEquip: 46, costYearEquipRed: 0, costYearEquipConfirm: 46, costYearOther: 0,
        costMonthTotal: 35, costMonthService: 21, costMonthRecorded: 17, costMonthReduction: 3, costMonthIctService: 1, costMonthInvest: 0, costMonthCapability: 0,
        costMonthEquip: 14, costMonthEquipRed: 0, costMonthEquipConfirm: 14, costMonthOther: 0,
        paymentAmount: 235, paymentYearAmount: 165, paymentMonthAmount: 50, unpaidAmount: 45,
      },
    },
    {
      basic: {
        currentPeriod: "2026-03", city: "金华", district: "婺城区",
        projectCode: "JHTB-2026-004", projectName: "智慧政务平台项目",
        projectType: "政务信息化", projectStartTime: "2026-01-10", projectStatus: "实施中",
        industry: "政务", projectManager: "赵强", projectCategory: "自拓",
        oppCode: "OPP-2026-004", contractCode: "HT-2026-004",
        contractName: "政务服务平台合同", contractStartDate: "2026-02-15",
        contractEndDate: "2026-11-30", contractType: "框架合同", contractStatus: "执行中",
        customerCode: "P-2026-004", customerName: "金华某某区政府",
        customerIndustry: "政务", customerDept: "政企客户部",
        signAmount: "420万", signDate: "2026-01-25",
        wbsCode: "WBS-004", wbsName: "政务平台WBS",
        wbsAmount: 220, ictServiceCost: 75, ictEquipCost: 60,
        invoicedAmount: 180, totalBudget: 350,
      },
      est: {
        incomeTotalTax: 420, incomeTotal: 378, incomeBasic: 220, incomeService: 110, incomeProduct: 48, incomeEquip: 0, incomeOther: 0,
        incomePlanTotal: 360, incomePlanBasic: 205, incomePlanService: 105, incomePlanProduct: 50, incomePlanEquip: 0, incomePlanOther: 0,
        incomeYearTotal: 0, incomeYearBasic: 0, incomeYearService: 0, incomeYearProduct: 0, incomeYearEquip: 0, incomeYearOther: 0,
        incomeMonthTotal: 0, incomeMonthBasic: 0, incomeMonthService: 0, incomeMonthProduct: 0, incomeMonthEquip: 0, incomeMonthOther: 0,
        receivedAmount: 0, receivedYearAmt: 0, receivedMonthAmt: 0, receivableAmt: 0,
        supplierContractCode: "SUPP-004", supplierContractName: "政务软件合同", supplierName: "金华某某软件公司",
        costTotalTax: 0, costTotal: 0, costService: 0, costRecorded: 0, costReduction: 0, costIctService: 0, costInvest: 0, costCapability: 0,
        costEquip: 0, costEquipReduction: 0, costEquipConfirm: 0, costOther: 0,
        costYearTotal: 0, costYearService: 0, costYearRecorded: 0, costYearReduction: 0, costYearIctService: 0, costYearInvest: 0, costYearCapability: 0,
        costYearEquip: 0, costYearEquipRed: 0, costYearEquipConfirm: 0, costYearOther: 0,
        costMonthTotal: 0, costMonthService: 0, costMonthRecorded: 0, costMonthReduction: 0, costMonthIctService: 0, costMonthInvest: 0, costMonthCapability: 0,
        costMonthEquip: 0, costMonthEquipRed: 0, costMonthEquipConfirm: 0, costMonthOther: 0,
        paymentAmount: 0, paymentYearAmount: 0, paymentMonthAmount: 0, unpaidAmount: 0,
      },
      plan: {
        incomeTotalTax: 420, incomeTotal: 378, incomeBasic: 220, incomeService: 110, incomeProduct: 48, incomeEquip: 0, incomeOther: 0,
        incomePlanTotal: 330, incomePlanBasic: 188, incomePlanService: 96, incomePlanProduct: 46, incomePlanEquip: 0, incomePlanOther: 0,
        incomeYearTotal: 150, incomeYearBasic: 88, incomeYearService: 42, incomeYearProduct: 20, incomeYearEquip: 0, incomeYearOther: 0,
        incomeMonthTotal: 60, incomeMonthBasic: 35, incomeMonthService: 18, incomeMonthProduct: 7, incomeMonthEquip: 0, incomeMonthOther: 0,
        receivedAmount: 200, receivedYearAmt: 140, receivedMonthAmt: 40, receivableAmt: 178,
        supplierContractCode: "SUPP-004", supplierContractName: "政务软件合同", supplierName: "金华某某软件公司",
        costTotalTax: 290, costTotal: 260, costService: 155, costRecorded: 130, costReduction: 15, costIctService: 8, costInvest: 2, costCapability: 0,
        costEquip: 105, costEquipReduction: 0, costEquipConfirm: 105, costOther: 0,
        costYearTotal: 105, costYearService: 63, costYearRecorded: 53, costYearReduction: 6, costYearIctService: 4, costYearInvest: 0, costYearCapability: 0,
        costYearEquip: 42, costYearEquipRed: 0, costYearEquipConfirm: 42, costYearOther: 0,
        costMonthTotal: 30, costMonthService: 18, costMonthRecorded: 15, costMonthReduction: 2, costMonthIctService: 1, costMonthInvest: 0, costMonthCapability: 0,
        costMonthEquip: 12, costMonthEquipRed: 0, costMonthEquipConfirm: 12, costMonthOther: 0,
        paymentAmount: 185, paymentYearAmount: 125, paymentMonthAmount: 35, unpaidAmount: 95,
      },
      settle: {
        incomeTotalTax: 420, incomeTotal: 378, incomeBasic: 220, incomeService: 110, incomeProduct: 48, incomeEquip: 0, incomeOther: 0,
        incomePlanTotal: 310, incomePlanBasic: 175, incomePlanService: 90, incomePlanProduct: 45, incomePlanEquip: 0, incomePlanOther: 0,
        incomeYearTotal: 200, incomeYearBasic: 118, incomeYearService: 56, incomeYearProduct: 26, incomeYearEquip: 0, incomeYearOther: 0,
        incomeMonthTotal: 80, incomeMonthBasic: 46, incomeMonthService: 24, incomeMonthProduct: 10, incomeMonthEquip: 0, incomeMonthOther: 0,
        receivedAmount: 300, receivedYearAmt: 240, receivedMonthAmt: 80, receivableAmt: 78,
        supplierContractCode: "SUPP-004", supplierContractName: "政务软件合同", supplierName: "金华某某软件公司",
        costTotalTax: 300, costTotal: 268, costService: 160, costRecorded: 135, costReduction: 15, costIctService: 8, costInvest: 2, costCapability: 0,
        costEquip: 108, costEquipReduction: 0, costEquipConfirm: 108, costOther: 0,
        costYearTotal: 125, costYearService: 75, costYearRecorded: 63, costYearReduction: 7, costYearIctService: 5, costYearInvest: 0, costYearCapability: 0,
        costYearEquip: 50, costYearEquipRed: 0, costYearEquipConfirm: 50, costYearOther: 0,
        costMonthTotal: 38, costMonthService: 23, costMonthRecorded: 19, costMonthReduction: 2, costMonthIctService: 2, costMonthInvest: 0, costMonthCapability: 0,
        costMonthEquip: 15, costMonthEquipRed: 0, costMonthEquipConfirm: 15, costMonthOther: 0,
        paymentAmount: 230, paymentYearAmount: 160, paymentMonthAmount: 50, unpaidAmount: 60,
      },
      final: {
        incomeTotalTax: 420, incomeTotal: 378, incomeBasic: 220, incomeService: 110, incomeProduct: 48, incomeEquip: 0, incomeOther: 0,
        incomePlanTotal: 290, incomePlanBasic: 165, incomePlanService: 84, incomePlanProduct: 41, incomePlanEquip: 0, incomePlanOther: 0,
        incomeYearTotal: 250, incomeYearBasic: 148, incomeYearService: 70, incomeYearProduct: 32, incomeYearEquip: 0, incomeYearOther: 0,
        incomeMonthTotal: 100, incomeMonthBasic: 58, incomeMonthService: 30, incomeMonthProduct: 12, incomeMonthEquip: 0, incomeMonthOther: 0,
        receivedAmount: 380, receivedYearAmt: 320, receivedMonthAmt: 100, receivableAmt: 0,
        supplierContractCode: "SUPP-004", supplierContractName: "政务软件合同", supplierName: "金华某某软件公司",
        costTotalTax: 310, costTotal: 278, costService: 168, costRecorded: 142, costReduction: 15, costIctService: 9, costInvest: 2, costCapability: 0,
        costEquip: 110, costEquipReduction: 0, costEquipConfirm: 110, costOther: 0,
        costYearTotal: 145, costYearService: 87, costYearRecorded: 73, costYearReduction: 7, costYearIctService: 5, costYearInvest: 2, costYearCapability: 0,
        costYearEquip: 58, costYearEquipRed: 0, costYearEquipConfirm: 58, costYearOther: 0,
        costMonthTotal: 45, costMonthService: 27, costMonthRecorded: 22, costMonthReduction: 3, costMonthIctService: 2, costMonthInvest: 0, costMonthCapability: 0,
        costMonthEquip: 18, costMonthEquipRed: 0, costMonthEquipConfirm: 18, costMonthOther: 0,
        paymentAmount: 275, paymentYearAmount: 195, paymentMonthAmount: 60, unpaidAmount: 35,
      },
    },
  ];

  // 将projects展开为4行×1项目的扁平数据，并标注阶段颜色
  const stageColors = [
    { label: "概算", bg: "bg-blue-50",  text: "text-blue-700", border: "border-blue-200" },
    { label: "预算", bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
    { label: "结算", bg: "bg-green-50",  text: "text-green-700", border: "border-green-200" },
    { label: "决算", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  ];

  const flatRows: { data: RowData; stageLabel: string; stageColor: typeof stageColors[0]; projectIndex: number; rowInProject: number }[] = [];
  projects.forEach((p, pIdx) => {
    const stages = [
      { stage: p.est, label: "概算" },
      { stage: p.plan, label: "预算" },
      { stage: p.settle, label: "结算" },
      { stage: p.final, label: "决算" },
    ];
    stages.forEach((s, idx) => {
      flatRows.push({
        data: { ...p.basic, ...s.stage, projectStage: s.label },
        stageLabel: s.label,
        stageColor: stageColors[idx],
        projectIndex: pIdx,
        rowInProject: idx,
      });
    });
  });

  // 项目间交替背景色（白色/浅灰）
  const projectBgColors = ["bg-white", "bg-gray-50"];

  // 计算一级分组colspan
  const getLevel1Colspan = (label: string) => {
    const g = level1Groups.find(g => g.label === label);
    if (!g) return 1;
    return g.colEnd - g.colStart + 1;
  };

  const getLevel2Colspan = (colStart: number, colEnd: number) => colEnd - colStart + 1;

  const getCol = (key: string) => allColumns[colIndexMap[key]];

  const cellStyle = (key: string) => ({
    width: columnWidths[key],
    minWidth: columnWidths[key],
  });

  const alignClass = (col: ColumnDef) =>
    col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left";

// 从可见列计算各维度数据
  const visCols = colVis.visibleColumns as ColumnDef[];
  const visKeys = new Set(visCols.map(c => c.key));
  // 基本信息列：不含 projectStage（col 0-23），col 24 单独处理
  const basicVisCols = visCols.filter(c => {
    const idx = colIndexMap[c.key];
    return idx >= 0 && idx <= 23;
  });

  // 计算可见的一级分组（重新统计span）
  const visLevel1Groups = level1Groups
    .map(g => {
      const visInGroup = visCols.filter(c => {
        const idx = colIndexMap[c.key];
        return idx >= g.colStart && idx <= g.colEnd;
      });
      return { ...g, span: visInGroup.length };
    })
    .filter(g => g.span > 0);

  // 计算可见的二级子分组
  const visIncomeSubGroups = incomeSubGroups
    .map(sg => {
      const visInGroup = visCols.filter(c => {
        const idx = colIndexMap[c.key];
        return idx >= sg.colStart && idx <= sg.colEnd;
      });
      return { ...sg, span: visInGroup.length };
    })
    .filter(sg => sg.span > 0);

  const visCostSubGroups = costSubGroups
    .map(sg => {
      const visInGroup = visCols.filter(c => {
        const idx = colIndexMap[c.key];
        return idx >= sg.colStart && idx <= sg.colEnd;
      });
      return { ...sg, span: visInGroup.length };
    })
    .filter(sg => sg.span > 0);

  // 计算表格总宽度
  const tableWidth = visCols.reduce((sum, c) => sum + (columnWidths[c.key] ?? 120), 0);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 pt-6 pb-4 flex-shrink-0">
        <h2 className="text-lg font-medium text-gray-900">业财全流程宽表</h2>
        <p className="text-sm text-gray-500 mt-1">产数项目全流程财务数据总览</p>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6">
        {/* 查询条件 */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          {/* 基础信息（不显示分组标题） */}
          <div className="mb-4">
            <div className="grid grid-cols-5 gap-x-6 gap-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">地市</label>
                <Select value={(queryParams.city as string) ?? ""} onValueChange={v => setQueryParams(p => ({ ...p, city: v }))}>
                  <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hangzhou">杭州</SelectItem>
                    <SelectItem value="ningbo">宁波</SelectItem>
                    <SelectItem value="wenzhou">温州</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">区县</label>
                <Select value={(queryParams.district as string) ?? ""} onValueChange={v => setQueryParams(p => ({ ...p, district: v }))}>
                  <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xihu">西湖区</SelectItem>
                    <SelectItem value="yinzhou">鄞州区</SelectItem>
                    <SelectItem value="lucheng">鹿城区</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">帐套</label>
                <Select value={(queryParams.accountBook as string) ?? ""} onValueChange={v => setQueryParams(p => ({ ...p, accountBook: v }))}>
                  <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gufen">股份公司</SelectItem>
                    <SelectItem value="xinchan">信产公司</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">商机编码</label>
                <Input placeholder="请输入" value={(queryParams.oppCode as string) ?? ""}
                  onChange={e => setQueryParams(p => ({ ...p, oppCode: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">客户管控部门名称</label>
                <Select value={(queryParams.customerDept as string) ?? ""} onValueChange={v => setQueryParams(p => ({ ...p, customerDept: v }))}>
                  <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zhengqi">政企客户部</SelectItem>
                    <SelectItem value="jiaoyu">教育行业部</SelectItem>
                    <SelectItem value="yiliao">医疗行业部</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 项目信息 */}
          <div className="mb-4 pt-4 border-t border-gray-100">
            <div className="text-sm font-medium text-gray-800 mb-2 flex items-center">
              <span className="w-1 h-4 bg-green-500 rounded mr-2"></span>
              项目信息
            </div>
            <div className="grid grid-cols-5 gap-x-6 gap-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">项目编码</label>
                <Input placeholder="请输入" value={(queryParams.projectCode as string) ?? ""}
                  onChange={e => setQueryParams(p => ({ ...p, projectCode: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">项目名称</label>
                <Input placeholder="请输入" value={(queryParams.projectName as string) ?? ""}
                  onChange={e => setQueryParams(p => ({ ...p, projectName: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">项目类型</label>
                <Select value={(queryParams.projectType as string) ?? ""} onValueChange={v => setQueryParams(p => ({ ...p, projectType: v }))}>
                  <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zhengwu">政务信息化</SelectItem>
                    <SelectItem value="jiaoyu">教育信息化</SelectItem>
                    <SelectItem value="yiliao">医疗信息化</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">立项时间</label>
                <div className="flex gap-2 items-center">
                  <Input type="date" value={(queryParams.projectTimeStart as string) ?? ""}
                    onChange={e => setQueryParams(p => ({ ...p, projectTimeStart: e.target.value }))} />
                  <span className="text-gray-400">-</span>
                  <Input type="date" value={(queryParams.projectTimeEnd as string) ?? ""}
                    onChange={e => setQueryParams(p => ({ ...p, projectTimeEnd: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">项目总金额</label>
                <div className="flex gap-2 items-center">
                  <Input type="number" placeholder="起" value={(queryParams.amountMin as string) ?? ""}
                    onChange={e => setQueryParams(p => ({ ...p, amountMin: e.target.value }))} />
                  <span className="text-gray-400">-</span>
                  <Input type="number" placeholder="止" value={(queryParams.amountMax as string) ?? ""}
                    onChange={e => setQueryParams(p => ({ ...p, amountMax: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">项目状态</label>
                <Select value={(queryParams.projectStatus as string) ?? ""} onValueChange={v => setQueryParams(p => ({ ...p, projectStatus: v }))}>
                  <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shishi">实施中</SelectItem>
                    <SelectItem value="wancheng">已完成</SelectItem>
                    <SelectItem value="yiquxiao">已取消</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">项目经理</label>
                <Input placeholder="请输入" value={(queryParams.projectManager as string) ?? ""}
                  onChange={e => setQueryParams(p => ({ ...p, projectManager: e.target.value }))} />
              </div>
            </div>
          </div>

          {/* 合同信息 */}
          {showAllConditions && (
            <div className="pt-4 border-t border-gray-100">
              <div className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                <span className="w-1 h-4 bg-orange-500 rounded mr-2"></span>
                合同信息
              </div>
              <div className="grid grid-cols-5 gap-x-6 gap-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">合同编码</label>
                  <Input placeholder="请输入" value={(queryParams.contractCode as string) ?? ""}
                    onChange={e => setQueryParams(p => ({ ...p, contractCode: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">合同名称</label>
                  <Input placeholder="请输入" value={(queryParams.contractName as string) ?? ""}
                    onChange={e => setQueryParams(p => ({ ...p, contractName: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">合同类型</label>
                  <Select value={(queryParams.contractType as string) ?? ""} onValueChange={v => setQueryParams(p => ({ ...p, contractType: v }))}>
                    <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kuangjia">框架合同</SelectItem>
                      <SelectItem value="xiangmu">项目合同</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">合同签约日期</label>
                  <div className="flex gap-2 items-center">
                    <Input type="date" value={(queryParams.signDateStart as string) ?? ""}
                      onChange={e => setQueryParams(p => ({ ...p, signDateStart: e.target.value }))} />
                    <span className="text-gray-400">-</span>
                    <Input type="date" value={(queryParams.signDateEnd as string) ?? ""}
                      onChange={e => setQueryParams(p => ({ ...p, signDateEnd: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">合同签约金额</label>
                  <div className="flex gap-2 items-center">
                    <Input type="number" placeholder="起" value={(queryParams.signAmountMin as string) ?? ""}
                      onChange={e => setQueryParams(p => ({ ...p, signAmountMin: e.target.value }))} />
                    <span className="text-gray-400">-</span>
                    <Input type="number" placeholder="止" value={(queryParams.signAmountMax as string) ?? ""}
                      onChange={e => setQueryParams(p => ({ ...p, signAmountMax: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">合同履行开始日期</label>
                  <div className="flex gap-2 items-center">
                    <Input type="date" value={(queryParams.contractStartDateStart as string) ?? ""}
                      onChange={e => setQueryParams(p => ({ ...p, contractStartDateStart: e.target.value }))} />
                    <span className="text-gray-400">-</span>
                    <Input type="date" value={(queryParams.contractStartDateEnd as string) ?? ""}
                      onChange={e => setQueryParams(p => ({ ...p, contractStartDateEnd: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">合同履行结束日期</label>
                  <div className="flex gap-2 items-center">
                    <Input type="date" value={(queryParams.contractEndDateStart as string) ?? ""}
                      onChange={e => setQueryParams(p => ({ ...p, contractEndDateStart: e.target.value }))} />
                    <span className="text-gray-400">-</span>
                    <Input type="date" value={(queryParams.contractEndDateEnd as string) ?? ""}
                      onChange={e => setQueryParams(p => ({ ...p, contractEndDateEnd: e.target.value }))} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 收起/展开按钮 */}
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="link"
              size="sm"
              onClick={() => setShowAllConditions(!showAllConditions)}
              className="text-blue-600 p-0"
            >
              {showAllConditions ? "收起更多条件" : "展开更多条件"}
            </Button>
            <div className="flex gap-2">
              <Button variant="default" size="sm">查询</Button>
              <Button variant="outline" size="sm"><RotateCcw className="w-4 h-4 mr-1" />重置</Button>
            </div>
          </div>
        </div>

        {/* 表格 */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col" style={{ maxHeight: "calc(100vh - 280px)" }}>
          {/* 工具栏 */}
          <div className="flex items-center justify-end px-4 py-2 border-b border-gray-200 bg-gray-50 flex-shrink-0">
            <button
              className="flex items-center gap-1.5 px-3 py-1 text-xs text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
              onClick={() => setShowColumnModal(true)}
            >
              <Settings2 className="w-4 h-4" />
              自定义表头
            </button>
          </div>
          {/* 表格+侧边栏容器 */}
          <div className="flex flex-1 min-h-0">
            {/* 详情侧边栏 - 左侧，宽度40% */}
            {detailPanel.row && (
              <div className="w-[40%] flex-shrink-0 border-r border-gray-200 bg-white flex flex-col overflow-hidden min-h-0">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-800">详情</span>
                    {detailPanel.pinned && <span className="text-xs text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">已固定</span>}
                  </div>
                  <button onClick={() => setDetailPanel({ row: null, pinned: false })} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {Object.entries({
                    "项目基本信息": ["currentPeriod","city","district","projectCode","projectName","projectType","projectStartTime","projectStatus","industry","projectManager","projectCategory","oppCode","contractCode","contractName","contractStartDate","contractEndDate","contractType","contractStatus","customerCode","customerName","customerIndustry","customerDept","signAmount","signDate","projectStage"],
                    "收入": ["incomeTotalTax","incomeTotal","incomeBasic","incomeService","incomeProduct","incomeEquip","incomeOther","incomePlanTotal","incomePlanBasic","incomePlanService","incomePlanProduct","incomePlanEquip","incomePlanOther","incomeYearTotal","incomeYearBasic","incomeYearService","incomeYearProduct","incomeYearEquip","incomeYearOther","incomeMonthTotal","incomeMonthBasic","incomeMonthService","incomeMonthProduct","incomeMonthEquip","incomeMonthOther"],
                    "收款": ["receivedAmount","receivedYearAmt","receivedMonthAmt","receivableAmt","supplierContractCode","supplierContractName","supplierName"],
                    "支出": ["costTotalTax","costTotal","costService","costRecorded","costReduction","costIctService","costInvest","costCapability","costEquip","costEquipReduction","costEquipConfirm","costOther","costYearTotal","costYearService","costYearRecorded","costYearReduction","costYearIctService","costYearInvest","costYearCapability","costYearEquip","costYearEquipRed","costYearEquipConfirm","costYearOther","costMonthTotal","costMonthService","costMonthRecorded","costMonthReduction","costMonthIctService","costMonthInvest","costMonthCapability","costMonthEquip","costMonthEquipRed","costMonthEquipConfirm","costMonthOther"],
                    "付款": ["paymentAmount","paymentYearAmount","paymentMonthAmount","unpaidAmount"],
                  }).map(([group, keys]) => {
                    const items = keys.filter(k => detailPanel.row![k] !== undefined && detailPanel.row![k] !== "" && detailPanel.row![k] !== null);
                    if (items.length === 0) return null;
                    return (
                      <div key={group} className="mb-4">
                        <div className="text-xs font-semibold text-gray-500 mb-2 pb-1 border-b border-gray-100">{group}</div>
                        <div className="grid grid-cols-3 gap-x-4 gap-y-1.5">
                          {items.map(k => {
                            const col = allColumns[colIndexMap[k]];
                            return col ? (
                              <div key={k} className="col-span-1">
                                <div className="text-xs text-gray-400">{col.label}</div>
                                <div className="text-sm text-gray-800 truncate">{String(detailPanel.row![k] ?? "-")}</div>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 表格区域 */}
            <div className="flex-1 min-w-0 overflow-auto">
              <table className="min-w-full border-collapse" style={{ width: tableWidth }}>
              {/* 表头Row2: 一级分组（按可见列重新计算span） */}
              <thead>
                <tr>
                  {visLevel1Groups.map((g, gi) => (
                    <th
                      key={gi}
                      colSpan={g.span}
                      className={`px-2 py-2.5 text-center text-sm font-semibold border border-gray-200 ${g.color}`}
                    >
                      {g.label}
                    </th>
                  ))}
                  <th className="px-2 py-2.5 text-center text-sm font-semibold border border-gray-200 bg-gray-100 sticky right-0 z-10">操作</th>
                </tr>
                {/* 表头Row3: 二级子分组 */}
                <tr>
                  {basicVisCols.length > 0 && (
                    <th colSpan={basicVisCols.length} className="px-2 py-2 text-center text-xs font-medium bg-gray-200 text-gray-700 border border-gray-300">项目基本信息</th>
                  )}
                  {visIncomeSubGroups.filter(sg => sg.span > 0).map((sg, i) => (
                    <th key={`vis-income-${i}`} colSpan={sg.span}
                      className="px-2 py-2 text-center text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                      {sg.label}
                    </th>
                  ))}
                  {visKeys.has("receivedAmount") && (
                    <th colSpan={visCols.filter(c => { const i = colIndexMap[c.key]; return i >= 50 && i <= 53; }).length || 4}
                      className="px-2 py-2 text-center text-xs font-medium bg-teal-100 text-teal-700 border border-teal-200">收款</th>
                  )}
                  {visKeys.has("supplierContractCode") && (
                    <th colSpan={visCols.filter(c => { const i = colIndexMap[c.key]; return i >= 54 && i <= 56; }).length || 3}
                      className="px-2 py-2 text-center text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">基本信息</th>
                  )}
                  {visCostSubGroups.filter(sg => sg.span > 0).map((sg, i) => (
                    <th key={`vis-cost-${i}`} colSpan={sg.span}
                      className="px-2 py-2 text-center text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                      {sg.label}
                    </th>
                  ))}
                  {visKeys.has("wbsCode") && (
                    <th colSpan={visCols.filter(c => { const i = colIndexMap[c.key]; return i >= 91 && i <= 97; }).length || 7}
                      className="px-2 py-2 text-center text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">投资</th>
                  )}
                  {visKeys.has("paymentAmount") && (
                    <th colSpan={visCols.filter(c => { const i = colIndexMap[c.key]; return i >= 98; }).length || 4}
                      className="px-2 py-2 text-center text-xs font-medium bg-green-100 text-green-700 border border-green-200">付款</th>
                  )}
                  <th className="px-2 py-2 text-center text-xs font-medium bg-gray-200 border border-gray-300 sticky right-0 z-10">操作</th>
                </tr>
                {/* 表头Row4: 实际列名（按可见列过滤） */}
                <tr>
                  {visCols.map((col) => {
                    const idx = colIndexMap[col.key];
                    let bg = "bg-gray-100";
                    let text = "text-gray-700";
                    if (idx >= 25 && idx <= 49) { bg = "bg-blue-100"; text = "text-blue-700"; }
                    else if (idx >= 50 && idx <= 53) { bg = "bg-teal-100"; text = "text-teal-700"; }
                    else if (idx >= 54 && idx <= 56) { bg = "bg-orange-100"; text = "text-orange-700"; }
                    else if (idx >= 57 && idx <= 90) { bg = "bg-red-100"; text = "text-red-700"; }
                    else if (idx >= 91 && idx <= 97) { bg = "bg-purple-100"; text = "text-purple-700"; }
                    else if (idx >= 98) { bg = "bg-green-100"; text = "text-green-700"; }
                    return (
                      <th
                        key={col.key}
                        style={cellStyle(col.key)}
                        className={`px-2 py-2 text-center text-xs font-medium border ${bg} ${text} whitespace-nowrap`}
                      >
                        {col.label}
                      </th>
                    );
                  })}
                  <th className="px-2 py-2 text-center text-xs font-medium bg-gray-200 border border-gray-300 sticky right-0 z-10">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {projects.map((project, pIdx) => {
                  const projBg = projectBgColors[pIdx % 2];
                  const stages = [
                    { stage: project.est, label: "概算" },
                    { stage: project.plan, label: "预算" },
                    { stage: project.settle, label: "结算" },
                    { stage: project.final, label: "决算" },
                  ];

                  return stages.map((s, sIdx) => {
                    const isFirst = sIdx === 0;
                    const rowData = { ...project.basic, ...s.stage, projectStage: s.label };
                    const stageColor = stageColors[sIdx];

                    return (
                      <tr
                        key={`${pIdx}-${sIdx}`}
                        className="hover:bg-blue-50"
                      >
                        {isFirst && (
                          <>
                            {basicVisCols.map(col => (
                              <td
                                key={col.key}
                                rowSpan={4}
                                style={cellStyle(col.key)}
                                className={`px-2 py-2 text-sm border border-gray-200 ${alignClass(col)} ${projBg}`}
                              >
                                {String(rowData[col.key] ?? "")}
                              </td>
                            ))}
                          </>
                        )}
                        {/* 项目环节：每行显示对应阶段 */}
                        <td
                          style={cellStyle("projectStage")}
                          className={`px-2 py-2 text-sm text-center border border-gray-200 ${stageColor.bg} ${stageColor.text}`}
                        >
                          {s.label}
                        </td>

                        {visCols.filter(c => {
                          const idx = colIndexMap[c.key];
                          return idx >= 25;
                        }).map(col => (
                          <td
                            key={col.key}
                            style={cellStyle(col.key)}
                            className={`px-2 py-2 text-sm border border-gray-200 ${alignClass(col)}`}
                          >
                            {rowData[col.key] !== undefined && rowData[col.key] !== 0 ? String(rowData[col.key]) : ""}
                          </td>
                        ))}
                        {/* 查看按钮 */}
                        <td className="px-2 py-2 text-center border border-gray-200 bg-white">
                          <button
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              const isPinned = detailPanel.pinned && detailPanel.row === rowData;
                              setDetailPanel({ row: rowData, pinned: !isPinned });
                            }}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            {detailPanel.row === rowData && detailPanel.pinned ? "关闭" : "查看"}
                          </button>
                        </td>
                      </tr>
                    );
                  });
                })}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </div>

      {/* 列可见性弹窗 */}
      <ColumnVisibilityModal
        show={showColumnModal}
        onClose={() => setShowColumnModal(false)}
        columns={allColumns}
        groups={groups3}
        level={3}
        visibility={colVis.visibility}
        onToggle={colVis.toggleColumn}
        onToggleGroup={colVis.toggleGroup}
        onToggleSubGroup={colVis.toggleSubGroup}
        onToggleAll={colVis.toggleAll}
        getGroupState={colVis.getGroupState}
        getSubGroupState={colVis.getSubGroupState}
      />
    </div>
  );
}
