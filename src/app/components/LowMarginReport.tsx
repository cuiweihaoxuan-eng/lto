import React, { useState, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Settings2, Eye } from "lucide-react";
import { ColumnVisibilityModal } from "./ui/ColumnVisibilityModal";
import { useColumnVisibility } from "./hooks/useColumnVisibility";

// 配色
const groupColors: Record<string, string> = {
  basic: "bg-gray-100",
  income: "bg-blue-50",
  cost: "bg-red-50",
  margin: "bg-purple-50",
  marginDiff: "bg-orange-50",
};

const stageColors: Record<string, string> = {
  概算: "bg-blue-50",
  预算: "bg-yellow-50",
  结算: "bg-green-50",
  决算: "bg-purple-50",
};

const stageTextColors: Record<string, string> = {
  概算: "text-blue-700",
  预算: "text-yellow-700",
  结算: "text-green-700",
  决算: "text-purple-700",
};

// 表头配置（两级表头）
const headerGroups = [
  { label: "项目基本信息", startCol: 0, span: 20, color: "bg-gray-100" },
  { label: "收入", startCol: 20, span: 3, color: "bg-blue-100" },
  { label: "支出", startCol: 23, span: 3, color: "bg-red-100" },
  { label: "毛利", startCol: 26, span: 3, color: "bg-purple-100" },
  { label: "毛利差异", startCol: 29, span: 3, color: "bg-orange-100" },
];

const columns = [
  // 项目基本信息 0-19 (合并20列，含项目环节col19)
  { key: "currentPeriod", label: "当前账期", width: 100 },
  { key: "city", label: "地市", width: 80 },
  { key: "district", label: "区县", width: 80 },
  { key: "projectCode", label: "项目编号", width: 130 },
  { key: "projectName", label: "项目名称", width: 180 },
  { key: "projectType", label: "项目类型", width: 100 },
  { key: "projectStartTime", label: "立项时间", width: 110 },
  { key: "projectStatus", label: "项目状态", width: 90 },
  { key: "projectManager", label: "项目经理", width: 90 },
  { key: "oppCode", label: "商机编码", width: 130 },
  { key: "contractCode", label: "合同编号", width: 130 },
  { key: "contractName", label: "合同名称", width: 180 },
  { key: "contractStartTime", label: "合同履行开始日期", width: 130 },
  { key: "contractEndTime", label: "合同履行结束日期", width: 130 },
  { key: "contractType", label: "合同类型", width: 100 },
  { key: "contractStatus", label: "合同状态", width: 90 },
  { key: "customerCode", label: "客户编码(P码)", width: 120 },
  { key: "customerName", label: "客户名称", width: 160 },
  { key: "signDate", label: "合同签约日期", width: 110 },
  { key: "projectStage", label: "项目环节", width: 80 },
  // 收入 20-22
  { key: "incomeTotal", label: "收入总金额", width: 120, groupColor: "bg-blue-50" },
  { key: "incomeService", label: "其中：产数服务", width: 130, groupColor: "bg-blue-50" },
  { key: "incomeEquip", label: "设备销售/租赁", width: 130, groupColor: "bg-blue-50" },
  // 支出 23-25
  { key: "costTotal", label: "支出总金额", width: 120, groupColor: "bg-red-50" },
  { key: "costService", label: "其中：产数服务", width: 130, groupColor: "bg-red-50" },
  { key: "costEquip", label: "设备销售/租赁", width: 130, groupColor: "bg-red-50" },
  // 毛利 26-28
  { key: "marginRate", label: "毛利率", width: 100, groupColor: "bg-purple-50" },
  { key: "marginService", label: "服务毛利率", width: 110, groupColor: "bg-purple-50" },
  { key: "marginEquip", label: "设备毛利率", width: 120, groupColor: "bg-purple-50" },
  // 毛利差异 29-31
  { key: "marginDiffRate", label: "毛利率差异", width: 100, groupColor: "bg-orange-50" },
  { key: "marginDiffService", label: "服务毛利率差异", width: 120, groupColor: "bg-orange-50" },
  { key: "marginDiffEquip", label: "设备毛利率差异", width: 120, groupColor: "bg-orange-50" },
];

const stages = ["概算", "预算", "结算", "决算"] as const;

// 模拟数据 - 每个项目4行
const projectData = [
  {
    basic: {
      currentPeriod: "3月", city: "杭州", district: "西湖区",
      projectCode: "JHTB-2026-001", projectName: "某区政府信息化项目",
      projectType: "政府信息化", projectStartTime: "2026-01-15", projectStatus: "实施中",
      projectManager: "张明", oppCode: "OPP-2026-001", contractCode: "HT-2026-001",
      contractName: "政务云服务合同", contractStartTime: "2026-02-01", contractEndTime: "2026-12-31",
      contractType: "框架合同", contractStatus: "执行中",
      customerCode: "P-2026-001", customerName: "杭州某某区政府", signDate: "2026-01-20",
    },
    rows: [
      { stage: "概算", income: { total: 580, service: 320, equip: 260 }, cost: { total: 420, service: 240, equip: 180 }, margin: { rate: "27.6%", service: "25.0%", equip: "30.8%" }, marginDiff: { rate: "-", service: "-", equip: "-" } },
      { stage: "预算", income: { total: 560, service: 310, equip: 250 }, cost: { total: 410, service: 235, equip: 175 }, margin: { rate: "26.8%", service: "24.2%", equip: "30.0%" }, marginDiff: { rate: "-0.8pp", service: "-0.8pp", equip: "-0.8pp" } },
      { stage: "结算", income: { total: 520, service: 290, equip: 230 }, cost: { total: 390, service: 225, equip: 165 }, margin: { rate: "25.0%", service: "22.4%", equip: "28.3%" }, marginDiff: { rate: "-1.8pp", service: "-1.8pp", equip: "-1.7pp" } },
      { stage: "决算", income: { total: 480, service: 270, equip: 210 }, cost: { total: 370, service: 215, equip: 155 }, margin: { rate: "22.9%", service: "20.4%", equip: "26.2%" }, marginDiff: { rate: "-2.1pp", service: "-2.0pp", equip: "-2.1pp" } },
    ],
  },
  {
    basic: {
      currentPeriod: "3月", city: "宁波", district: "鄞州区",
      projectCode: "JHTB-2026-002", projectName: "智慧校园建设项目",
      projectType: "教育信息化", projectStartTime: "2026-02-01", projectStatus: "实施中",
      projectManager: "李华", oppCode: "OPP-2026-002", contractCode: "HT-2026-002",
      contractName: "教育信息化合同", contractStartTime: "2026-03-01", contractEndTime: "2027-02-28",
      contractType: "项目合同", contractStatus: "执行中",
      customerCode: "P-2026-002", customerName: "宁波某某学校", signDate: "2026-02-15",
    },
    rows: [
      { stage: "概算", income: { total: 800, service: 450, equip: 350 }, cost: { total: 580, service: 330, equip: 250 }, margin: { rate: "27.5%", service: "26.7%", equip: "28.6%" }, marginDiff: { rate: "-", service: "-", equip: "-" } },
      { stage: "预算", income: { total: 780, service: 440, equip: 340 }, cost: { total: 565, service: 320, equip: 245 }, margin: { rate: "27.6%", service: "27.3%", equip: "27.9%" }, marginDiff: { rate: "+0.1pp", service: "+0.6pp", equip: "-0.7pp" } },
      { stage: "结算", income: { total: 720, service: 410, equip: 310 }, cost: { total: 530, service: 305, equip: 225 }, margin: { rate: "26.4%", service: "25.6%", equip: "27.4%" }, marginDiff: { rate: "-1.2pp", service: "-1.7pp", equip: "-0.5pp" } },
      { stage: "决算", income: { total: 680, service: 390, equip: 290 }, cost: { total: 510, service: 295, equip: 215 }, margin: { rate: "25.0%", service: "24.4%", equip: "25.9%" }, marginDiff: { rate: "-1.4pp", service: "-1.2pp", equip: "-1.5pp" } },
    ],
  },
  {
    basic: {
      currentPeriod: "3月", city: "温州", district: "鹿城区",
      projectCode: "JHTB-2026-003", projectName: "智慧医疗系统项目",
      projectType: "医疗信息化", projectStartTime: "2026-02-20", projectStatus: "实施中",
      projectManager: "王芳", oppCode: "OPP-2026-003", contractCode: "HT-2026-003",
      contractName: "医疗信息化合同", contractStartTime: "2026-04-01", contractEndTime: "2027-03-31",
      contractType: "框架合同", contractStatus: "执行中",
      customerCode: "P-2026-003", customerName: "温州某某医院", signDate: "2026-03-10",
    },
    rows: [
      { stage: "概算", income: { total: 350, service: 200, equip: 150 }, cost: { total: 250, service: 145, equip: 105 }, margin: { rate: "28.6%", service: "27.5%", equip: "30.0%" }, marginDiff: { rate: "-", service: "-", equip: "-" } },
      { stage: "预算", income: { total: 340, service: 195, equip: 145 }, cost: { total: 245, service: 142, equip: 103 }, margin: { rate: "27.9%", service: "27.2%", equip: "29.0%" }, marginDiff: { rate: "-0.7pp", service: "-0.3pp", equip: "-1.0pp" } },
      { stage: "结算", income: { total: 300, service: 175, equip: 125 }, cost: { total: 225, service: 132, equip: 93 }, margin: { rate: "25.0%", service: "24.6%", equip: "25.6%" }, marginDiff: { rate: "-2.9pp", service: "-2.6pp", equip: "-3.4pp" } },
      { stage: "决算", income: { total: 280, service: 165, equip: 115 }, cost: { total: 220, service: 130, equip: 90 }, margin: { rate: "21.4%", service: "21.2%", equip: "21.7%" }, marginDiff: { rate: "-3.6pp", service: "-3.4pp", equip: "-3.9pp" } },
    ],
  },
];

// 可拖动列宽
function useColumnResize(totalWidth: number) {
  const [colWidths, setColWidths] = useState<number[]>(() => columns.map(c => c.width));
  const [resizing, setResizing] = useState<number | null>(null);
  const [totalW, setTotalW] = useState(totalWidth);
  const startXRef = useRef(0);
  const startWRef = useRef(0);

  const handleResizeStart = useCallback((idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    setResizing(idx);
    startXRef.current = e.clientX;
    startWRef.current = colWidths[idx];
  }, [colWidths]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (resizing === null) return;
    const diff = e.clientX - startXRef.current;
    const newWidth = Math.max(60, startWRef.current + diff);
    setColWidths(prev => {
      const next = [...prev];
      next[resizing] = newWidth;
      return next;
    });
  }, [resizing]);

  const handleMouseUp = useCallback(() => {
    setResizing(null);
    setTotalW(colWidths.reduce((a, b) => a + b, 0));
  }, [colWidths]);

  return { colWidths, resizing, handleResizeStart, handleMouseMove, handleMouseUp, totalW };
}

export function LowMarginReport() {
  const [query, setQuery] = useState({ city: "", projectTime: "", projectName: "", projectManager: "", marginRange: "" });
  const [showFilters, setShowFilters] = useState(true);
  const [showAllConditions, setShowAllConditions] = useState(false);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [detailPanel, setDetailPanel] = useState<{ project: typeof projectData[0] | null; pinned: boolean }>({ project: null, pinned: false });
  const tableRef = useRef<HTMLDivElement>(null);

  // 列可见性
  const colVis = useColumnVisibility(columns as any, headerGroups as any, 2);

  // 总宽度
  const totalColWidth = columns.reduce((a, c) => a + c.width, 0);
  const { colWidths, resizing, handleResizeStart, handleMouseMove, handleMouseUp } = useColumnResize(totalColWidth);

  React.useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // 可见列及索引
  const visCols = colVis.visibleColumns;
  const visKeys = new Set(visCols.map(c => c.key));
  const visColIdxSet = new Set(visCols.map((_, i) => i));
  // 可见的基本信息列（从visCols中找，映射到原列索引）
  const basicVisCols = visCols.filter(c => {
    const idx = columns.findIndex(col => col.key === c.key);
    return idx >= 0 && idx < 19;
  });
  // 第一列可见的基本列索引（原列索引）
  const firstBasicVisIdx = basicVisCols.length > 0
    ? columns.findIndex(col => col.key === basicVisCols[0].key)
    : -1;

  // 工具栏：已选X/Y列
  const { colWidths: visColWidths } = useColumnResize(
    visCols.reduce((a, c) => a + (c.width ?? 100), 0)
  );

  // 实际可见的表头分组（每组span按可见列重新计算）
  function getVisibleGroups() {
    return headerGroups.map(g => {
      let visibleSpan = 0;
      for (let ci = g.startCol; ci < g.startCol + g.span; ci++) {
        if (visKeys.has(columns[ci]?.key)) visibleSpan++;
      }
      return { ...g, span: visibleSpan };
    }).filter(g => g.span > 0);
  }

  const visGroups = getVisibleGroups();
  const tableWidth = visCols.reduce((a, c) => a + (c.width ?? 100), 0);

  return (
    <div className="h-full flex flex-col">
      {/* 标题区 */}
      <div className="px-6 pt-6 pb-4 flex-shrink-0">
        <h2 className="text-lg font-medium text-gray-900">项目低负毛利预警</h2>
        <p className="text-sm text-gray-500 mt-1">项目各阶段毛利情况预警分析</p>
      </div>

      {/* 查询条件区 */}
      {showFilters && (
        <div className="px-6 pb-4 flex-shrink-0">
          <div className="bg-white rounded border border-gray-200 p-4">
            {/* 基础信息（不显示分组标题） */}
            <div className="mb-4">
              <div className="grid grid-cols-5 gap-x-6 gap-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">地市</label>
                  <select className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm" value={query.city} onChange={e => setQuery({ ...query, city: e.target.value })}>
                    <option value="">全部</option>
                    <option value="hangzhou">杭州</option>
                    <option value="ningbo">宁波</option>
                    <option value="wenzhou">温州</option>
                    <option value="jinhua">金华</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">区县</label>
                  <select className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm">
                    <option value="">全部</option>
                    <option value="xihu">西湖区</option>
                    <option value="yinzhou">鄞州区</option>
                    <option value="lucheng">鹿城区</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">帐套</label>
                  <select className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm">
                    <option value="">全部</option>
                    <option value="gufen">股份公司</option>
                    <option value="xinchan">信产公司</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">商机编码</label>
                  <input type="text" className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm" placeholder="请输入" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">客户管控部门名称</label>
                  <select className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm">
                    <option value="">全部</option>
                    <option value="zhengqi">政企客户部</option>
                    <option value="jiaoyu">教育行业部</option>
                    <option value="yiliao">医疗行业部</option>
                  </select>
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
                  <label className="block text-xs text-gray-500 mb-1">项目编码</label>
                  <input type="text" className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm" placeholder="请输入" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">项目名称</label>
                  <input type="text" className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm" placeholder="请输入" value={query.projectName} onChange={e => setQuery({ ...query, projectName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">项目类型</label>
                  <select className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm">
                    <option value="">全部</option>
                    <option value="zhengwu">政务信息化</option>
                    <option value="jiaoyu">教育信息化</option>
                    <option value="yiliao">医疗信息化</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">立项时间</label>
                  <input type="date" className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm" value={query.projectTime} onChange={e => setQuery({ ...query, projectTime: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">项目总金额</label>
                  <input type="text" className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm" placeholder="请输入" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">项目状态</label>
                  <select className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm">
                    <option value="">全部</option>
                    <option value="shishi">实施中</option>
                    <option value="wancheng">已完成</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">项目经理</label>
                  <input type="text" className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm" placeholder="请输入" value={query.projectManager} onChange={e => setQuery({ ...query, projectManager: e.target.value })} />
                </div>
              </div>
            </div>

            {/* 模式会 */}
            {showAllConditions && (
              <div className="mb-4 pt-4 border-t border-gray-100">
                <div className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                  <span className="w-1 h-4 bg-orange-500 rounded mr-2"></span>
                  模式会
                </div>
                <div className="grid grid-cols-5 gap-x-6 gap-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">模式会收入总金额</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm" placeholder="请输入" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">模式会支出总金额</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm" placeholder="请输入" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">模式会毛利率(%)</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm" placeholder="请输入" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">模式会服务毛利率(%)</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm" placeholder="请输入" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">模式会设备销售、租赁毛利率(%)</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm" placeholder="请输入" />
                  </div>
                </div>
              </div>
            )}

            {/* 合同签约 */}
            {showAllConditions && (
              <div className="mb-4 pt-4 border-t border-gray-100">
                <div className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                  <span className="w-1 h-4 bg-purple-500 rounded mr-2"></span>
                  合同签约
                </div>
                <div className="grid grid-cols-5 gap-x-6 gap-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">合同编码</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm" placeholder="请输入" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">合同名称</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm" placeholder="请输入" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">合同类型</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm">
                      <option value="">全部</option>
                      <option value="kuangjia">框架合同</option>
                      <option value="xiangmu">项目合同</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">合同签约日期</label>
                    <input type="date" className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">合同签约计划总收入</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm" placeholder="请输入" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">合同签约计划支出总金额</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm" placeholder="请输入" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">合同签约毛利率(%)</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm" placeholder="请输入" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">合同签约服务毛利率(%)</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm" placeholder="请输入" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">合同签约设备销售、租赁毛利率(%)</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm" placeholder="请输入" />
                  </div>
                </div>
              </div>
            )}

            {/* 收起/展开按钮 */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <button
                className="text-sm text-blue-600 hover:text-blue-700"
                onClick={() => setShowAllConditions(!showAllConditions)}
              >
                {showAllConditions ? "收起更多条件" : "展开更多条件"}
              </button>
              <div className="flex gap-2">
                <button className="px-4 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">重置</button>
                <button className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">查询</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 标签页 */}
      <div className="px-6 pb-2 flex-shrink-0 flex items-center gap-1">
        <button className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-full">数据明细</button>
        <button className="px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-full" onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? "隐藏查询" : "显示查询"}
        </button>
      </div>

      {/* 表格区 */}
      <div ref={tableRef} className="flex-1 overflow-auto px-6 pb-6">
        <div className="border border-gray-200 rounded bg-white" style={{ minWidth: tableWidth + 2 }}>
          {/* 工具栏 */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
            <span className="text-xs text-gray-500">已选 {colVis.visibleCount}/{colVis.totalCount} 列</span>
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-1.5 px-3 py-1 text-xs text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
                onClick={() => setShowColumnModal(true)}
              >
                <Settings2 className="w-4 h-4" />
                自定义表头
              </button>
              <button
                className="flex items-center gap-1.5 px-3 py-1 text-xs text-blue-600 border border-blue-300 rounded hover:bg-blue-50"
                onClick={() => setDetailPanel({ project: projectData[0] || null, pinned: true })}
              >
                <Eye className="w-4 h-4" />
                查看详情
              </button>
            </div>
          </div>
          <div className="flex flex-1 min-h-0">
            {/* 详情侧边栏 - 左侧，宽度40% */}
            {detailPanel.project && (
              <div className="w-[40%] flex-shrink-0 border-r border-gray-200 bg-white flex flex-col min-h-0">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-800">详情</span>
                    {detailPanel.pinned && <span className="text-xs text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">已固定</span>}
                  </div>
                  <button onClick={() => setDetailPanel({ project: null, pinned: false })} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {(() => {
                      const p = detailPanel.project!;
                      const groups = headerGroups;
                      const getGroupForColumn = (colIdx: number): string | null => {
                        for (const g of groups) {
                          if (colIdx >= g.startCol && colIdx < g.startCol + g.span) return g.label;
                        }
                        return null;
                      };
                      const groupedCols: Record<string, typeof columns> = {};
                      columns.forEach((col, i) => {
                        const gl = getGroupForColumn(i) || "基础信息";
                        if (!groupedCols[gl]) groupedCols[gl] = [];
                        groupedCols[gl].push(col);
                      });
                      return Object.entries(groupedCols).map(([gl, cols]) => (
                        <div key={gl} className="mb-4">
                          <h4 className="text-xs font-semibold text-gray-700 mb-2 pb-1 border-b border-gray-100">{gl}</h4>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            {cols.map(col => (
                              <div key={col.key} className="flex items-start py-1">
                                <span className="text-xs text-gray-500 w-24 flex-shrink-0 truncate">{col.label}：</span>
                                <span className="text-xs text-gray-900 flex-1 truncate">
                                  {p.basic[col.key as keyof typeof p.basic] !== undefined
                                    ? String(p.basic[col.key as keyof typeof p.basic] ?? "-")
                                    : "-"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* 表格区域 */}
            <div className="flex-1 overflow-x-auto min-w-0">
              <table className="border-collapse w-full" style={{ width: tableWidth }}>
                <thead>
                  {/* 第一行：一级分组（按可见列重新计算span） */}
                  <tr>
                    {visGroups.map((g, i) => (
                      <th
                        key={i}
                        colSpan={g.span}
                        className={`${g.color} border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-800 text-center`}
                      >
                        {g.label}
                      </th>
                    ))}
                    <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-800 text-center bg-gray-100">操作</th>
                  </tr>
                  {/* 第二行：列名（按可见列过滤） */}
                  <tr>
                    {visCols.map((col, i) => {
                      const origIdx = columns.findIndex(c => c.key === col.key);
                      let cellColor = "bg-gray-100";
                      if (origIdx >= 19 && origIdx <= 22) cellColor = "bg-blue-50";
                      else if (origIdx >= 23 && origIdx <= 25) cellColor = "bg-red-50";
                      else if (origIdx >= 26 && origIdx <= 28) cellColor = "bg-purple-50";
                      else if (origIdx >= 29 && origIdx <= 31) cellColor = "bg-orange-50";
                      return (
                        <th
                          key={col.key}
                          className={`border border-gray-300 px-2 py-2 text-xs font-medium text-center ${cellColor}`}
                          style={{ width: col.width, minWidth: col.width }}
                        >
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-gray-700">{col.label}</span>
                          </div>
                        </th>
                      );
                    })}
                    <th className="border border-gray-300 px-2 py-2 text-xs font-medium text-center bg-gray-100">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {projectData.map((project, pIdx) => {
                      const projBg = pIdx % 2 === 0 ? "" : "bg-gray-50/40";
                      return (
                        <>
                          {project.rows.map((row, rIdx) => {
                            return (
                              <tr key={`${pIdx}-${rIdx}`}
                                className={`${projBg} hover:bg-blue-50 cursor-pointer ${detailPanel.project === project ? "bg-blue-50" : ""}`}
                                onMouseEnter={() => setDetailPanel({ project, pinned: detailPanel.pinned })}
                                onMouseLeave={() => !detailPanel.pinned && setDetailPanel({ project: null, pinned: false })}
                              >
                                {/* 基本信息列 rowSpan: 只在第一行可见的基本列渲染rowSpan */}
                                {rIdx === 0 && visCols.map((col, ci) => {
                                  const origIdx = columns.findIndex(c => c.key === col.key);
                                  // 仅在origIdx < 19时rowSpan
                                  if (origIdx < 19) {
                                    return (
                                      <td key={col.key} rowSpan={4}
                                        className={`border border-gray-300 px-2 py-2 text-xs text-gray-700 text-center align-middle ${projBg}`}
                                        style={{ width: col.width }}>
                                        {String((project.basic as any)[col.key] ?? "")}
                                      </td>
                                    );
                                  }
                                  // origIdx >= 19: 无rowSpan
                                  return (
                                    <td key={col.key}
                                      className={`border border-gray-300 px-2 py-2 text-xs text-gray-700 text-center align-middle ${projBg}`}
                                      style={{ width: col.width }}>
                                      {origIdx === 19 ? row.stage : ""}
                                    </td>
                                  );
                                })}
                                {/* 查看按钮 */}
                                <td className="border border-gray-300 px-2 py-2 text-center">
                                  <button
                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const isPinned = detailPanel.pinned && detailPanel.project === project;
                                      setDetailPanel({ project, pinned: !isPinned });
                                    }}
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    {detailPanel.project === project && detailPanel.pinned ? "关闭" : "查看"}
                                  </button>
                                </td>
                            );
                          })}
                        </>
                      );
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
        columns={columns}
        groups={headerGroups}
        level={2}
        visibility={colVis.visibility}
        onToggle={colVis.toggleColumn}
        onToggleGroup={colVis.toggleGroup}
        onToggleSubGroup={() => {}}
        onToggleAll={colVis.toggleAll}
        getGroupState={colVis.getGroupState}
        getSubGroupState={() => 0}
      />
    </div>
  );
}