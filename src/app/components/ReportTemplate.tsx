import React, { useState, useCallback, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { RotateCcw, Settings2, Eye } from "lucide-react";
import { ReportDetailModal } from "./ReportDetailModal";

/** 单列定义 */
export interface ReportColumn {
  key: string;
  label: string;
  width?: number;
  minWidth?: number;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  render?: (value: unknown, record: Record<string, unknown>) => React.ReactNode;
  /** 表头列的颜色（Tailwind bg类），用于第二层列名行上色 */
  groupColor?: string;
}

/** 表头分组（两层或三层表头用） */
export interface ReportHeaderGroup {
  label: string;
  /** 该分组从第几列开始（基于所有列的 index），从 0 计 */
  startCol: number;
  /** 跨越几列 */
  span: number;
  /** 是否该分组下所有列的 label 已在 ReportColumn 中定义（即第三层） */
  hasChildren?: boolean;
  /** 子分组（用于三层表头） */
  children?: ReportHeaderGroup[];
  /** 一级分组颜色（Tailwind bg 类），用于表头行上色 */
  color?: string;
  /** 子行标签（第四/五层），每个标签对应跨越分组内的部分列 */
  subRowLabels?: { label: string; span: number; color?: string }[];
  /** 五层表头时，row4（第4行）的行标签，如"收入"/"支出" */
  row4Label?: string;
}

/** 报表配置 */
export interface ReportConfig {
  title: string;
  description?: string;
  columns: ReportColumn[];
  /** 两层表头时的分组（可不传，走单层） */
  headerGroups?: ReportHeaderGroup[];
  /** 是否三层表头（两层 + 有子分组） */
  hasThreeLevelHeader?: boolean;
  /** 是否五层表头（含row4 收入/支出 标签行） */
  hasFiveLevelHeader?: boolean;
  /** 每个项目的数据行数（用于基本信息列的rowSpan合并）；默认1 */
  dataRowSpan?: number;
  defaultColumnWidths?: Record<string, number>;
}

/** 查询条件字段 */
export interface QueryField {
  key: string;
  label: string;
  type: "text" | "date-range" | "select" | "number-range";
  placeholder?: string;
  options?: { label: string; value: string }[];
  /** 是否在输入框后显示百分号 */
  showPercent?: boolean;
}

/** 查询条件分组 */
export interface QueryFieldGroup {
  /** 分组标题，为空则不使用标题区块 */
  title?: string;
  fields: QueryField[];
}

interface ReportTemplateProps {
  config: ReportConfig;
  /** 支持分组查询条件（新版）或扁平数组（旧版兼容） */
  queryFields: QueryFieldGroup[] | QueryField[];
  data: Record<string, unknown>[];
  onQuery?: (params: Record<string, unknown>) => void;
  onReset?: () => void;
  /** 隐藏标题区（外部已提供标题时使用） */
  hideTitle?: boolean;
  /** 隐藏查询条件区（外部已提供查询区时使用） */
  hideQueryArea?: boolean;
  /** 是否显示查看按钮 */
  showDetail?: boolean;
}

export function ReportTemplate({
  config,
  queryFields,
  data,
  onQuery,
  onReset,
  hideTitle,
  hideQueryArea,
  showDetail = false,
}: ReportTemplateProps) {
  const [queryParams, setQueryParams] = useState<Record<string, unknown>>({});
  const [detailPanel, setDetailPanel] = useState<{ row: Record<string, unknown> | null; pinned: boolean }>({ row: null, pinned: false });
  const [showAllConditions, setShowAllConditions] = useState(false);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(config.columns.map(c => [c.key, true]))
  );

  // 列宽状态
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(
    config.defaultColumnWidths ||
      Object.fromEntries(config.columns.map((c) => [c.key, c.width ?? 120]))
  );


  // 拖拽状态
  const [resizing, setResizing] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, key: string) => {
      e.preventDefault();
      e.stopPropagation();
      setResizing(key);
      setResizeStartX(e.clientX);
      setResizeStartWidth(columnWidths[key] ?? 120);
    },
    [columnWidths]
  );

  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (!resizing) return;
      const diff = e.clientX - resizeStartX;
      const newWidth = Math.max(50, resizeStartWidth + diff);
      setColumnWidths((prev) => ({ ...prev, [resizing]: newWidth }));
    },
    [resizing, resizeStartX, resizeStartWidth]
  );

  const handleResizeEnd = useCallback(() => {
    setResizing(null);
  }, []);

  useEffect(() => {
    if (resizing) {
      window.addEventListener("mousemove", handleResizeMove);
      window.addEventListener("mouseup", handleResizeEnd);
      return () => {
        window.removeEventListener("mousemove", handleResizeMove);
        window.removeEventListener("mouseup", handleResizeEnd);
      };
    }
  }, [resizing, handleResizeMove, handleResizeEnd]);

  const handleSort = (key: string) => {
    if (sortField === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(key);
      setSortDir("desc");
    }
  };

  const handleQuery = () => {
    onQuery?.(queryParams);
  };

  const handleReset = () => {
    setQueryParams({});
    onReset?.();
  };

  const updateParam = (key: string, value: unknown) => {
    setQueryParams((prev) => ({ ...prev, [key]: value }));
  };

  // ---- 列可见性相关 ----
  const hasHeaderGroups = !!config.headerGroups && config.headerGroups.length > 0;
  const headerLevel = hasHeaderGroups ? (config.hasThreeLevelHeader ? 3 : 2) : 1;

  const toggleColumn = (key: string, visible: boolean) => {
    setColumnVisibility(prev => ({ ...prev, [key]: visible }));
  };

  const toggleAllColumns = (visible: boolean) => {
    setColumnVisibility(Object.fromEntries(config.columns.map(c => [c.key, visible])));
  };

  const toggleGroupColumns = (groupIdx: number, visible: boolean) => {
    const groups = config.headerGroups ?? [];
    const group = groups[groupIdx];
    if (!group) return;
    setColumnVisibility(prev => {
      const next = { ...prev };
      for (let ci = group.startCol; ci < group.startCol + group.span; ci++) {
        const col = config.columns[ci];
        if (col) next[col.key] = visible;
      }
      return next;
    });
  };

  const toggleSubGroupColumns = (groupIdx: number, childIdx: number, visible: boolean) => {
    const groups = config.headerGroups ?? [];
    const group = groups[groupIdx];
    const child = group?.children?.[childIdx];
    if (!child) return;
    setColumnVisibility(prev => {
      const next = { ...prev };
      for (let ci = child.startCol; ci < child.startCol + child.span; ci++) {
        const col = config.columns[ci];
        if (col) next[col.key] = visible;
      }
      return next;
    });
  };

  const getGroupCheckedState = (groupIdx: number): "checked" | "unchecked" | "indeterminate" => {
    const groups = config.headerGroups ?? [];
    const group = groups[groupIdx];
    if (!group) return "unchecked";
    let checked = 0, unchecked = 0;
    for (let ci = group.startCol; ci < group.startCol + group.span; ci++) {
      const col = config.columns[ci];
      if (!col) continue;
      columnVisibility[col.key] ? checked++ : unchecked++;
    }
    if (unchecked === 0) return "checked";
    if (checked === 0) return "unchecked";
    return "indeterminate";
  };

  const getSubGroupCheckedState = (groupIdx: number, childIdx: number): "checked" | "unchecked" | "indeterminate" => {
    const groups = config.headerGroups ?? [];
    const group = groups[groupIdx];
    const child = group?.children?.[childIdx];
    if (!child) return "unchecked";
    let checked = 0, unchecked = 0;
    for (let ci = child.startCol; ci < child.startCol + child.span; ci++) {
      const col = config.columns[ci];
      if (!col) continue;
      columnVisibility[col.key] ? checked++ : unchecked++;
    }
    if (unchecked === 0) return "checked";
    if (checked === 0) return "unchecked";
    return "indeterminate";
  };

  const visibleCount = Object.values(columnVisibility).filter(Boolean).length;
  const totalCount = config.columns.length;
  const visibleColumns = config.columns.filter(c => columnVisibility[c.key] !== false);
  const totalTableWidth = visibleColumns.reduce((sum, c) => sum + (columnWidths[c.key] ?? 120), 0);

  // ---- 列可见性弹窗 ----
  const renderColumnModal = () => {
    if (!showColumnModal) return null;
    const groups = config.headerGroups ?? [];

    // 两级表头：group -> columns
    if (headerLevel === 2) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setShowColumnModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-[640px] max-h-[80vh] flex flex-col"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900">自定义表头</h3>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowColumnModal(false)}>✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {/* 全选 */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={visibleCount === totalCount}
                    ref={el => { if (el) el.indeterminate = visibleCount > 0 && visibleCount < totalCount; }}
                    onChange={e => toggleAllColumns(e.target.checked)}
                    className="w-4 h-4 accent-blue-600" />
                  全选 ({visibleCount}/{totalCount})
                </label>
              </div>
              {/* 一级分组 */}
              <div className="space-y-3">
                {groups.map((group, gi) => {
                  const state = getGroupCheckedState(gi);
                  const childCols: React.ReactNode[] = [];
                  for (let ci = group.startCol; ci < group.startCol + group.span; ci++) {
                    const col = config.columns[ci];
                    if (!col) continue;
                    childCols.push(
                      <label key={col.key} className="flex items-center gap-2 pl-6 py-1 hover:bg-gray-50 rounded cursor-pointer">
                        <input type="checkbox" checked={columnVisibility[col.key] !== false}
                          onChange={e => toggleColumn(col.key, e.target.checked)}
                          className="w-4 h-4 accent-blue-600" />
                        <span className="text-sm text-gray-600">{col.label}</span>
                      </label>
                    );
                  }
                  return (
                    <div key={gi} className="border border-gray-200 rounded-lg overflow-hidden">
                      <label className="flex items-center gap-2 px-3 py-2 bg-gray-50 cursor-pointer">
                        <input type="checkbox" checked={state === "checked"}
                          ref={el => { if (el) el.indeterminate = state === "indeterminate"; }}
                          onChange={e => toggleGroupColumns(gi, e.target.checked)}
                          className="w-4 h-4 accent-blue-600" />
                        <span className="text-sm font-medium text-gray-800">{group.label}</span>
                      </label>
                      <div className="bg-white">{childCols}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-3 border-t border-gray-200 bg-gray-50">
              <Button variant="outline" size="sm" onClick={() => {
                toggleAllColumns(true);
              }}>恢复默认</Button>
              <Button variant="default" size="sm" onClick={() => setShowColumnModal(false)}>确定</Button>
            </div>
          </div>
        </div>
      );
    }

    // 三级表头：group -> child -> columns
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        onClick={() => setShowColumnModal(false)}>
        <div className="bg-white rounded-xl shadow-2xl w-[720px] max-h-[80vh] flex flex-col"
          onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-900">自定义表头</h3>
            <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowColumnModal(false)}>✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {/* 全选 */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                <input type="checkbox" checked={visibleCount === totalCount}
                  ref={el => { if (el) el.indeterminate = visibleCount > 0 && visibleCount < totalCount; }}
                  onChange={e => toggleAllColumns(e.target.checked)}
                  className="w-4 h-4 accent-blue-600" />
                全选 ({visibleCount}/{totalCount})
              </label>
            </div>
            {/* 一级分组 */}
            <div className="space-y-3">
              {groups.map((group, gi) => {
                const gState = getGroupCheckedState(gi);
                return (
                  <div key={gi} className="border border-gray-200 rounded-lg overflow-hidden">
                    <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 cursor-pointer">
                      <input type="checkbox" checked={gState === "checked"}
                        ref={el => { if (el) el.indeterminate = gState === "indeterminate"; }}
                        onChange={e => toggleGroupColumns(gi, e.target.checked)}
                        className="w-4 h-4 accent-blue-600" />
                      <span className="text-sm font-semibold text-gray-800">{group.label}</span>
                    </label>
                    {group.children && (
                      <div className="bg-white">
                        {group.children.map((child, ci) => {
                          const cState = getSubGroupCheckedState(gi, ci);
                          const childCols: React.ReactNode[] = [];
                          for (let cci = child.startCol; cci < child.startCol + child.span; cci++) {
                            const col = config.columns[cci];
                            if (!col) continue;
                            childCols.push(
                              <label key={col.key} className="flex items-center gap-2 pl-8 pr-3 py-1 hover:bg-gray-50 rounded cursor-pointer">
                                <input type="checkbox" checked={columnVisibility[col.key] !== false}
                                  onChange={e => toggleColumn(col.key, e.target.checked)}
                                  className="w-4 h-4 accent-blue-600" />
                                <span className="text-sm text-gray-600">{col.label}</span>
                              </label>
                            );
                          }
                          return (
                            <div key={ci}>
                              <label className="flex items-center gap-2 pl-4 py-1.5 hover:bg-gray-50 cursor-pointer">
                                <input type="checkbox" checked={cState === "checked"}
                                  ref={el => { if (el) el.indeterminate = cState === "indeterminate"; }}
                                  onChange={e => toggleSubGroupColumns(gi, ci, e.target.checked)}
                                  className="w-4 h-4 accent-blue-600" />
                                <span className="text-sm font-medium text-gray-700">{child.label}</span>
                              </label>
                              {childCols}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-end gap-2 px-6 py-3 border-t border-gray-200 bg-gray-50">
            <Button variant="outline" size="sm" onClick={() => toggleAllColumns(true)}>恢复默认</Button>
            <Button variant="default" size="sm" onClick={() => setShowColumnModal(false)}>确定</Button>
          </div>
        </div>
      </div>
    );
  };

  // ---- 表头渲染 ----
  const renderSingleHeader = () => (
    <tr>
      {visibleColumns.map((col) => (
        <th
          key={col.key}
          style={{ width: columnWidths[col.key], minWidth: columnWidths[col.key] }}
          className={`px-2 py-2.5 text-center text-sm font-medium text-gray-700 relative select-none border-b border-gray-200 ${col.groupColor ?? "bg-gray-50"}`}
        >
          <div className={`flex items-center justify-center gap-1 ${col.sortable ? "cursor-pointer" : ""}`}
            onClick={() => col.sortable && handleSort(col.key)}>
            <span className="whitespace-nowrap">{col.label}</span>
            {col.sortable && sortField === col.key && (
              <span className="text-blue-500">{sortDir === "asc" ? "↑" : "↓"}</span>
            )}
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-blue-300 transition-colors"
            onMouseDown={(e) => handleResizeStart(e, col.key)} />
        </th>
      ))}
      {showDetail && (
        <th className="px-2 py-2.5 text-center text-sm font-medium text-gray-700 bg-gray-50 border-b border-gray-200 w-20">
          操作
        </th>
      )}
    </tr>
  );

  // 过滤表头分组（只保留有可见列的分组）
  const getVisibleGroups = () => {
    if (!hasHeaderGroups) return [];
    const groups = config.headerGroups ?? [];
    // 两层表头：跳过没有任何可见列的顶层分组
    if (headerLevel === 2) {
      return groups.filter(g => {
        for (let ci = g.startCol; ci < g.startCol + g.span; ci++) {
          const col = config.columns[ci];
          if (col && columnVisibility[col.key] !== false) return true;
        }
        return false;
      });
    }
    // 三层表头：保留顶层分组，过滤没有可见子列的子分组
    return groups.map(g => ({
      ...g,
      children: g.children?.filter(c => {
        for (let ci = c.startCol; ci < c.startCol + c.span; ci++) {
          const col = config.columns[ci];
          if (col && columnVisibility[col.key] !== false) return true;
        }
        return false;
      })
    }));
  };

  const renderTwoLevelHeader = () => {
    const visibleGroups = getVisibleGroups();
    return (
      <>
        {/* 第一层：分组行 */}
        <tr>
          {visibleGroups.map((group, gi) => {
            // 计算该分组中可见列的span
            let visibleSpan = 0;
            for (let ci = group.startCol; ci < group.startCol + group.span; ci++) {
              const col = config.columns[ci];
              if (col && columnVisibility[col.key] !== false) visibleSpan++;
            }
            return (
              <th key={gi} colSpan={visibleSpan}
                className={`px-2 py-2 text-center text-sm font-semibold text-gray-800 border-b border-gray-200 ${group.color ?? "bg-gray-100"}`}>
                {group.label}
              </th>
            );
          })}
          {showDetail && (
            <th rowSpan={2} className="px-2 py-2 text-center text-sm font-semibold text-gray-800 bg-gray-50 border-b border-gray-200">
              操作
            </th>
          )}
        </tr>
        {/* 第二层：列名（只渲染可见列） */}
        <tr>
          {visibleColumns.map((col) => (
            <th key={col.key}
              style={{ width: columnWidths[col.key], minWidth: columnWidths[col.key] }}
              className={`px-2 py-2 text-center text-sm font-medium text-gray-700 border-b border-r border-gray-200 relative select-none ${col.groupColor ?? "bg-gray-50"}`}>
              <div className={`flex items-center justify-center gap-1 ${col.sortable ? "cursor-pointer" : ""}`}
                onClick={() => col.sortable && handleSort(col.key)}>
                <span className="whitespace-nowrap">{col.label}</span>
                {col.sortable && sortField === col.key && (
                  <span className="text-blue-500">{sortDir === "asc" ? "↑" : "↓"}</span>
                )}
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-blue-300 transition-colors"
                onMouseDown={(e) => handleResizeStart(e, col.key)} />
            </th>
          ))}
          {!showDetail && null}
        </tr>
      </>
    );
  };

  const renderThreeLevelHeader = () => {
    const groups = getVisibleGroups() as (ReportHeaderGroup & { children?: ReportHeaderGroup[] })[];
    const N = visibleColumns.length;
    if (N === 0) return null;

    // 可见列的原始索引
    const visOrigIdxs = visibleColumns.map(col => config.columns.indexOf(col));
    // 列所属顶层分组索引
    const visGroupIdx = visOrigIdxs.map(oi => {
      for (let gi = 0; gi < groups.length; gi++) {
        if (oi >= groups[gi].startCol && oi < groups[gi].startCol + groups[gi].span) return gi;
      }
      return -1;
    });

    // Row1: 按顶层分组聚合可见列
    const row1Cells: { gi: number; label: string; color: string; span: number }[] = [];
    let r1i = 0;
    while (r1i < N) {
      const gi = visGroupIdx[r1i];
      const g = groups[gi] ?? { label: "", color: "bg-gray-100" };
      let count = 0;
      while (r1i + count < N && visGroupIdx[r1i + count] === gi) count++;
      row1Cells.push({ gi, label: g.label, color: g.color ?? "bg-gray-100", span: count });
      r1i += count;
    }

    // 找到每个顶层分组下各子分组的范围
    const visChildIdx = visOrigIdxs.map(oi => {
      for (let gi = 0; gi < groups.length; gi++) {
        const children = groups[gi].children ?? [];
        for (let ci = 0; ci < children.length; ci++) {
          if (oi >= children[ci].startCol && oi < children[ci].startCol + children[ci].span) return { gi, ci };
        }
      }
      return { gi: -1, ci: -1 };
    });

    // Row2: 按子分组聚合（跨顶层分组边界时各自独立）
    const row2Cells: { label: string; color: string; span: number; subLabel?: string }[] = [];
    let r2i = 0;
    while (r2i < N) {
      const { gi, ci } = visChildIdx[r2i];
      const g = groups[gi];
      // 确定该列的标签
      let label = "";
      let color = g?.color ?? "bg-gray-100";
      if (ci >= 0 && g?.children?.[ci]) {
        label = g.children[ci].label;
        // 如果子分组有subRowLabels，row2不渲染子行标签列（由row3处理）
        const childDef = g.children[ci];
        const origIdx = visOrigIdxs[r2i];
        // 检查是否是多行子标签的一部分
        const subRowIdx = childDef.subRowLabels
          ? findSubRowLabelIndex(origIdx, childDef)
          : -1;
        if (subRowIdx >= 0) {
          label = childDef.subRowLabels![subRowIdx].label;
          color = childDef.subRowLabels![subRowIdx].color ?? color;
        }
      } else if (gi >= 0) {
        label = g.label;
      }
      // 合并相邻同标签的列
      let count = 0;
      while (r2i + count < N) {
        const { gi: gi2, ci: ci2 } = visChildIdx[r2i + count];
        const g2 = groups[gi2];
        let nextLabel = "";
        if (ci2 >= 0 && g2?.children?.[ci2]) {
          const childDef2 = g2.children[ci2];
          const origIdx2 = visOrigIdxs[r2i + count];
          const subRowIdx2 = childDef2.subRowLabels ? findSubRowLabelIndex(origIdx2, childDef2) : -1;
          if (subRowIdx2 >= 0) nextLabel = childDef2.subRowLabels![subRowIdx2].label;
          else nextLabel = childDef2.label;
        } else if (gi2 >= 0) nextLabel = g2.label;
        if (nextLabel !== label) break;
        count++;
      }
      row2Cells.push({ label, color, span: count });
      r2i += count;
    }

    return (
      <>
        <tr>
          {row1Cells.map((cell, i) => (
            <th key={`r1-${i}`} colSpan={cell.span}
              className={`px-2 py-2 text-center text-sm font-semibold text-gray-800 border-b border-r border-gray-200 ${cell.color}`}>
              {cell.label}
            </th>
          ))}
          {showDetail && (
            <th rowSpan={3} className="px-2 py-2 text-center text-sm font-semibold text-gray-800 bg-gray-50 border-b border-gray-200">
              操作
            </th>
          )}
        </tr>
        <tr>
          {row2Cells.map((cell, i) => (
            <th key={`r2-${i}`} colSpan={cell.span}
              className={`px-2 py-2 text-center text-xs font-medium text-gray-600 border-b border-r border-gray-200 ${cell.color}`}>
              {cell.label}
            </th>
          ))}
        </tr>
        <tr>
          {visibleColumns.map((col) => (
            <th key={col.key}
              style={{ width: columnWidths[col.key], minWidth: columnWidths[col.key] }}
              className={`px-2 py-2 text-center text-xs font-medium border-b border-r border-gray-200 relative select-none ${col.groupColor ?? "bg-gray-50"}`}>
              <div className={`flex items-center justify-center gap-1 ${col.sortable ? "cursor-pointer" : ""}`}
                onClick={() => col.sortable && handleSort(col.key)}>
                <span className="whitespace-nowrap">{col.label}</span>
                {col.sortable && sortField === col.key && (
                  <span className="text-blue-500">{sortDir === "asc" ? "↑" : "↓"}</span>
                )}
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-blue-300 transition-colors"
                onMouseDown={(e) => handleResizeStart(e, col.key)} />
            </th>
          ))}
        </tr>
      </>
    );
  };

  function findSubRowLabelIndex(origIdx: number, childDef: ReportHeaderGroup): number {
    if (!childDef.subRowLabels) return -1;
    let offset = 0;
    for (const srl of childDef.subRowLabels) {
      if (origIdx >= childDef.startCol + offset && origIdx < childDef.startCol + offset + srl.span) {
        return childDef.subRowLabels.indexOf(srl);
      }
      offset += srl.span;
    }
    return -1;
  }

  // ---- 查询条件渲染 ----
  const isGroupedQuery = Array.isArray(queryFields) && queryFields.length > 0 && "fields" in queryFields[0];
  const DEFAULT_VISIBLE_ROWS = 2;

  const flatFields: QueryField[] = Array.isArray(queryFields) && !isGroupedQuery
    ? (queryFields as QueryField[])
    : [];

  const renderFlatQuery = () => {
    const fields = flatFields;
    return (
      <div className="grid grid-cols-5 gap-x-6 gap-y-3">
        {fields.map(field => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            {field.type === "select" ? (
              <Select value={(queryParams[field.key] as string) ?? ""} onValueChange={v => updateParam(field.key, v)}>
                <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                <SelectContent>
                  {field.options?.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
            ) : field.type === "date-range" ? (
              <div className="flex gap-2 items-center">
                <Input type="date" value={(queryParams[`${field.key}Start`] as string) ?? ""}
                  onChange={e => updateParam(`${field.key}Start`, e.target.value)} />
                <span className="text-gray-400">-</span>
                <Input type="date" value={(queryParams[`${field.key}End`] as string) ?? ""}
                  onChange={e => updateParam(`${field.key}End`, e.target.value)} />
              </div>
            ) : field.type === "number-range" ? (
              <div className="flex gap-2 items-center">
                <Input type="number" placeholder="起" value={(queryParams[`${field.key}Min`] as string) ?? ""}
                  onChange={e => updateParam(`${field.key}Min`, e.target.value)} />
                <span className="text-gray-400">-</span>
                <Input type="number" placeholder="止" value={(queryParams[`${field.key}Max`] as string) ?? ""}
                  onChange={e => updateParam(`${field.key}Max`, e.target.value)} />
              </div>
            ) : (
              <Input
                placeholder={field.placeholder ?? "请输入"}
                type={field.showPercent ? "number" : "text"}
                value={(queryParams[field.key] as string) ?? ""}
                onChange={e => updateParam(field.key, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderGroupedQuery = () => {
    const groups = (queryFields as QueryFieldGroup[]);
    const visibleGroups = showAllConditions ? groups : groups.slice(0, DEFAULT_VISIBLE_ROWS);
    return (
      <>
        {visibleGroups.map((group, gi) => (
          <div key={gi} className={gi > 0 ? "mt-4 pt-4 border-t border-gray-100" : ""}>
            {group.title && (
              <div className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                <span className="w-1 h-4 bg-blue-500 rounded mr-2"></span>
                {group.title}
              </div>
            )}
            <div className="grid grid-cols-5 gap-x-6 gap-y-3">
              {group.fields.map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  {field.type === "select" ? (
                    <Select value={(queryParams[field.key] as string) ?? ""} onValueChange={v => updateParam(field.key, v)}>
                      <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                      <SelectContent>
                        {field.options?.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : field.type === "date-range" ? (
                    <div className="flex gap-2 items-center">
                      <Input type="date" value={(queryParams[`${field.key}Start`] as string) ?? ""}
                        onChange={e => updateParam(`${field.key}Start`, e.target.value)} />
                      <span className="text-gray-400">-</span>
                      <Input type="date" value={(queryParams[`${field.key}End`] as string) ?? ""}
                        onChange={e => updateParam(`${field.key}End`, e.target.value)} />
                    </div>
                  ) : field.type === "number-range" ? (
                    <div className="flex gap-2 items-center">
                      <Input type="number" placeholder="起" value={(queryParams[`${field.key}Min`] as string) ?? ""}
                        onChange={e => updateParam(`${field.key}Min`, e.target.value)} />
                      <span className="text-gray-400">-</span>
                      <Input type="number" placeholder="止" value={(queryParams[`${field.key}Max`] as string) ?? ""}
                        onChange={e => updateParam(`${field.key}Max`, e.target.value)} />
                    </div>
                  ) : (
                    <Input
                      placeholder={field.placeholder ?? "请输入"}
                      type={field.showPercent ? "number" : "text"}
                      value={(queryParams[field.key] as string) ?? ""}
                      onChange={e => updateParam(field.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </>
    );
  };

  // ---- 渲染 ----
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 标题 */}
      {!hideTitle && (
        <div className="px-6 pt-6 pb-4 flex-shrink-0">
          <h2 className="text-lg font-medium text-gray-900">{config.title}</h2>
          {config.description && (
            <p className="text-sm text-gray-500 mt-1">{config.description}</p>
          )}
        </div>
      )}

      {/* 内容区 */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        {/* 查询条件卡片 */}
        {!hideQueryArea && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          {isGroupedQuery ? renderGroupedQuery() : renderFlatQuery()}

          <div className="flex items-center justify-between mt-4">
            {(isGroupedQuery ? (queryFields as QueryFieldGroup[]).length > DEFAULT_VISIBLE_ROWS : flatFields.length > 8) && (
              <Button variant="link" size="sm" onClick={() => setShowAllConditions(!showAllConditions)} className="text-blue-600 p-0">
                {showAllConditions ? "收起更多条件" : "展开更多条件"}
              </Button>
            )}
            <div className="flex gap-2">
              <Button variant="default" size="sm" onClick={handleQuery}>查询</Button>
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-1" />重置
              </Button>
            </div>
          </div>
        </div>
        )}

        {/* 表格 */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* 表格工具栏 */}
          <div className="flex items-center justify-end gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50">
            <span className="text-xs text-gray-400 mr-auto">
              已选 {visibleCount}/{totalCount} 列
            </span>
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1"
              onClick={() => setShowColumnModal(true)}>
              <Settings2 className="w-3.5 h-3.5" />
              自定义表头
            </Button>
          </div>
          <div className="flex">
            {/* 详情侧边栏 - 左侧 */}
            {showDetail && detailPanel.row && (
              <div className="w-[480px] flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900">详情</h3>
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => setDetailPanel({ row: null, pinned: false })}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-4">
                    {/* 按一级/二级表头分组展示 */}
                    {(() => {
                      const groups = config.headerGroups || [];
                      const getGroupForColumn = (colIndex: number): string | null => {
                        for (const group of groups) {
                          if (colIndex >= group.startCol && colIndex < group.startCol + group.span) {
                            return group.label;
                          }
                        }
                        return null;
                      };
                      const groupedColumns: Record<string, typeof config.columns> = {};
                      config.columns.forEach((col, index) => {
                        const groupLabel = getGroupForColumn(index) || "基础信息";
                        if (!groupedColumns[groupLabel]) {
                          groupedColumns[groupLabel] = [];
                        }
                        groupedColumns[groupLabel].push(col);
                      });
                      return Object.entries(groupedColumns).map(([groupLabel, cols]) => (
                        <div key={groupLabel}>
                          <h4 className="text-xs font-semibold text-gray-700 mb-2 pb-1 border-b border-gray-100">
                            {groupLabel}
                          </h4>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            {cols.map(col => (
                              <div key={col.key} className="flex items-start py-1">
                                <span className="text-xs text-gray-500 w-24 flex-shrink-0 truncate">
                                  {col.label}：
                                </span>
                                <span className={`text-xs text-gray-900 flex-1 truncate ${col.align === "right" ? "text-right" : ""}`}>
                                  {detailPanel.row[col.key] !== undefined && detailPanel.row[col.key] !== null && detailPanel.row[col.key] !== ""
                                    ? String(detailPanel.row[col.key])
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

            <div className="flex-1 overflow-x-auto">
              <table className="border-collapse" style={{ minWidth: totalTableWidth }}>
                <thead>
                  {headerLevel === 1 && renderSingleHeader()}
                  {headerLevel === 2 && renderTwoLevelHeader()}
                  {headerLevel === 3 && renderThreeLevelHeader()}
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {data.map((row, ri) => {
                    const dataRowSpan = config.dataRowSpan ?? 1;
                    const isFirstRowOfGroup = ri % dataRowSpan === 0;
                    const rowType = row["rowType"] as string | undefined;

                    return (
                      <tr key={ri}
                        className={`hover:bg-blue-50 cursor-pointer ${detailPanel.row === row ? "bg-blue-50" : ""}`}
                        onMouseEnter={() => showDetail && setDetailPanel({ row, pinned: detailPanel.pinned })}
                        onMouseLeave={() => showDetail && !detailPanel.pinned && setDetailPanel({ row: null, pinned: false })}
                      >
                        {visibleColumns.map((col, ci) => {
                          const origIdx = config.columns.indexOf(col);
                          // 基本信息列 rowSpan 合并
                          if (origIdx < 10 && dataRowSpan > 1) {
                            if (!isFirstRowOfGroup) return null;
                            const val = row[col.key];
                            return (
                              <td key={col.key} rowSpan={dataRowSpan}
                                style={{ width: columnWidths[col.key], minWidth: columnWidths[col.key] }}
                                className={`px-2 py-2.5 text-sm text-gray-800 border-b border-gray-100 ${
                                  col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                                }`}>
                                {col.render ? col.render(val, row) : String(val ?? "")}
                              </td>
                            );
                          }
                          // rowType 列
                          if (origIdx === 9) {
                            return (
                              <td key={col.key}
                                style={{ width: columnWidths[col.key], minWidth: columnWidths[col.key] }}
                                className="px-2 py-2.5 text-sm text-gray-800 border-b border-gray-100 text-center font-medium bg-gray-50">
                                {rowType ?? ""}
                              </td>
                            );
                          }
                          const val = row[col.key];
                          const isEmpty = val === 0 || val === "" || val === undefined || val === null;
                          return (
                            <td key={col.key}
                              style={{ width: columnWidths[col.key], minWidth: columnWidths[col.key] }}
                              className={`px-2 py-2.5 text-sm border-b border-gray-100 ${
                                isEmpty ? "text-gray-300"
                                  : col.align === "right" ? "text-right text-gray-800"
                                  : col.align === "center" ? "text-center text-gray-800"
                                  : "text-left text-gray-800"
                              }`}>
                              {col.render ? col.render(val, row) : String(val ?? "")}
                            </td>
                          );
                        })}
                        {showDetail && (
                          <td className="px-2 py-2.5 text-center border-b border-gray-100 bg-white sticky right-0 z-10">
                            <button
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDetailPanel({ row, pinned: !detailPanel.pinned || detailPanel.row !== row });
                              }}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              {detailPanel.row === row && detailPanel.pinned ? "关闭" : "查看"}
                            </button>
                          </td>
                        )}
                      </tr>
                  );
                })}
              </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 列可见性弹窗 */}
      {renderColumnModal()}
    </div>
  );
}