import React, { useState } from "react";
import { ReportTemplate } from "./ReportTemplate";
import type { ReportConfig, ReportColumn, QueryFieldGroup } from "./ReportTemplate";
import { Button } from "./ui/button";
import { RotateCcw } from "lucide-react";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";

const columns: ReportColumn[] = [
  // 基础维度
  { key: "city", label: "市级", width: 120, groupColor: "bg-gray-50", sortable: true },
  { key: "district", label: "区县", width: 120, groupColor: "bg-gray-50", sortable: true },
  { key: "period", label: "账期", width: 90, groupColor: "bg-gray-50", sortable: true },
  // 本年累计
  { key: "ictIncomeCur", label: "ICT收入（1）", width: 120, align: "right", groupColor: "bg-blue-50", sortable: true },
  { key: "iotIncomeCur", label: "物联网收入（2）", width: 120, align: "right", groupColor: "bg-blue-50", sortable: true },
  { key: "platformSupportCur", label: "产数平台支撑费考核口径（3）", width: 150, align: "right", groupColor: "bg-blue-50", sortable: true },
  { key: "ictCostCur", label: "ICT业务支出考核口径（4）", width: 150, align: "right", groupColor: "bg-blue-50", sortable: true },
  { key: "iotCostCur", label: "物联网成本考核口径（5）", width: 150, align: "right", groupColor: "bg-blue-50", sortable: true },
  { key: "grossProfitCur", label: "ICT毛利额（6）", width: 120, align: "right", groupColor: "bg-green-50", sortable: true },
  // 上年同期
  { key: "ictIncomeLast", label: "ICT收入（1）", width: 120, align: "right", groupColor: "bg-purple-50", sortable: true },
  { key: "iotIncomeLast", label: "物联网收入（2）", width: 120, align: "right", groupColor: "bg-purple-50", sortable: true },
  { key: "platformSupportLast", label: "产数平台支撑费考核口径（3）", width: 150, align: "right", groupColor: "bg-purple-50", sortable: true },
  { key: "ictCostLast", label: "ICT业务支出考核口径（4）", width: 150, align: "right", groupColor: "bg-purple-50", sortable: true },
  { key: "iotCostLast", label: "物联网成本考核口径（5）", width: 150, align: "right", groupColor: "bg-purple-50", sortable: true },
  { key: "grossProfitLast", label: "ICT毛利额（6）", width: 120, align: "right", groupColor: "bg-green-50", sortable: true },
];

const mockData: Record<string, string | number>[] = [
  { city: "杭州市", district: "本部", period: "2026-03", ictIncomeCur: 580, iotIncomeCur: 120, platformSupportCur: 35, ictCostCur: 320, iotCostCur: 80, grossProfitCur: 315, ictIncomeLast: 520, iotIncomeLast: 95, platformSupportLast: 28, ictCostLast: 295, iotCostLast: 65, grossProfitLast: 283 },
  { city: "杭州市", district: "上城一分局", period: "2026-03", ictIncomeCur: 210, iotIncomeCur: 45, platformSupportCur: 12, ictCostCur: 115, iotCostCur: 30, grossProfitCur: 122, ictIncomeLast: 185, iotIncomeLast: 38, platformSupportLast: 10, ictCostLast: 100, iotCostLast: 25, grossProfitLast: 108 },
  { city: "宁波市", district: "鄞州分局", period: "2026-03", ictIncomeCur: 380, iotIncomeCur: 72, platformSupportCur: 22, ictCostCur: 210, iotCostCur: 48, grossProfitCur: 216, ictIncomeLast: 340, iotIncomeLast: 60, platformSupportLast: 18, ictCostLast: 185, iotCostLast: 40, grossProfitLast: 193 },
  { city: "温州市", district: "鹿城分局", period: "2026-03", ictIncomeCur: 165, iotIncomeCur: 38, platformSupportCur: 10, ictCostCur: 90, iotCostCur: 25, grossProfitCur: 98, ictIncomeLast: 148, iotIncomeLast: 32, platformSupportLast: 8, ictCostLast: 80, iotCostLast: 20, grossProfitLast: 88 },
  { city: "嘉兴市", district: "南湖分局", period: "2026-03", ictIncomeCur: 95, iotIncomeCur: 22, platformSupportCur: 6, ictCostCur: 52, iotCostCur: 14, grossProfitCur: 57, ictIncomeLast: 82, iotIncomeLast: 18, platformSupportLast: 5, ictCostLast: 45, iotCostLast: 12, grossProfitLast: 48 },
];

const config: ReportConfig = {
  title: "ICT毛利额区域统计报表",
  description: "ICT项目毛利额按区域统计汇总",
  columns,
};

export function IctGrossProfitReport() {
  const [queryParams, setQueryParams] = useState<Record<string, unknown>>({});

  const queryFields: QueryFieldGroup[] = [
    {
      title: "",
      fields: [
        { key: "city", label: "地市", type: "select" as const, options: [
          { label: "杭州市", value: "hangzhou" }, { label: "宁波市", value: "ningbo" },
          { label: "温州市", value: "wenzhou" }, { label: "嘉兴市", value: "jiaxing" }
        ]},
        { key: "district", label: "区县", type: "select" as const, options: [
          { label: "本部", value: "benbu" }, { label: "上城一分局", value: "shangcheng" },
          { label: "鄞州分局", value: "yinzhou" }, { label: "鹿城分局", value: "lucheng" }
        ]},
        { key: "period", label: "账期", type: "select" as const, options: [
          { label: "2026-03", value: "2026-03" }, { label: "2026-02", value: "2026-02" },
          { label: "2026-01", value: "2026-01" }, { label: "2025-12", value: "2025-12" }
        ]},
      ],
    },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 pt-6 pb-4 flex-shrink-0">
        <h2 className="text-lg font-medium text-gray-900">ICT毛利额区域统计报表</h2>
      </div>
      <div className="flex-1 overflow-hidden">
        <ReportTemplate
          config={{ ...config, headerGroups: [
            { label: "基础维度", startCol: 0, span: 3, color: "bg-gray-100" },
            { label: "本年累计", startCol: 3, span: 6, color: "bg-blue-100" },
            { label: "上年同期", startCol: 9, span: 6, color: "bg-purple-100" },
          ]}}
          queryFields={queryFields}
          data={mockData}
          onQuery={(params) => console.log("查询", params)}
          onReset={() => setQueryParams({})}
          hideTitle={true}
        />
      </div>
    </div>
  );
}
