import React, { useState, useCallback, useRef, useEffect } from "react";

/* ============ 类型定义 ============ */

export interface ColumnDef<T> {
  /** 列ID，用于拖拽和排序 */
  id: string;
  /** 列标题 */
  header: string;
  /** 列宽（px） */
  width?: number;
  /** 最小宽度 */
  minWidth?: number;
  /** 是否可拖拽调整宽度 */
  resizable?: boolean;
  /** 对齐方式 */
  align?: "left" | "center" | "right";
  /** 是否固定在左侧 */
  sticky?: "left";
  /** 是否固定在右侧 */
  stickyRight?: boolean;
  /** 一级表头分组背景色 */
  headerGroup?: "blue" | "green" | "yellow" | "orange" | "red" | "purple" | "cyan" | "gray";
  /** 是否合并到一级表头 */
  colSpan?: number;
  /** 行合并 */
  rowSpan?: number;
  /** 自定义渲染 */
  cell?: (row: T, index: number) => React.ReactNode;
}

export interface HeaderGroup {
  /** 分组标题 */
  title: string;
  /** 该分组包含的列数 */
  colSpan: number;
  /** 分组背景色 */
  bgColor?: "blue" | "green" | "yellow" | "orange" | "red" | "purple" | "cyan" | "gray";
}

/* ============ 样式常量 ============ */

const HEADER_GROUP_COLORS: Record<string, string> = {
  blue: "bg-blue-50",
  green: "bg-green-50",
  yellow: "bg-yellow-50",
  orange: "bg-orange-50",
  red: "bg-red-50",
  purple: "bg-purple-50",
  cyan: "bg-cyan-50",
  gray: "bg-gray-50",
};

const STICKY_LEFT_CLASSES = ["sticky left-0 z-20", "sticky left-[40px] z-20", "sticky left-[88px] z-20", "sticky left-[136px] z-20"];

/* ============ 工具函数 ============ */

/**
 * 计算 sticky 左侧偏移量
 */
function getStickyLeftOffset(colIndex: number, columnWidths: Map<string, number>, firstResizableIndex: number): string {
  if (colIndex === 0) return "0px";

  const colIds = Array.from(columnWidths.keys());
  let offset = 0;
  for (let i = 0; i < colIndex; i++) {
    offset += columnWidths.get(colIds[i]) || 100;
  }
  return `${offset}px`;
}

/* ============ DataTable 组件 ============ */

interface DataTableProps<T> {
  /** 列定义 */
  columns: ColumnDef<T>[];
  /** 行数据 */
  data: T[];
  /** 一级表头分组（可选） */
  headerGroups?: HeaderGroup[];
  /** 是否显示斑马纹 */
  striped?: boolean;
  /** 行点击回调 */
  onRowClick?: (row: T, index: number) => void;
  /** 空状态文本 */
  emptyText?: string;
  /** 表头背景色（默认） */
  defaultHeaderBg?: string;
  /** className */
  className?: string;
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  headerGroups,
  striped = true,
  onRowClick,
  emptyText = "暂无数据",
  defaultHeaderBg = "bg-gray-50",
  className = "",
}: DataTableProps<T>) {
  // 列宽状态
  const [columnWidths, setColumnWidths] = useState<Map<string, number>>(() => {
    const map = new Map<string, number>();
    columns.forEach((col) => {
      map.set(col.id, col.width || 120);
    });
    return map;
  });

  // 拖拽状态
  const [resizing, setResizing] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);
  const resizeRef = useRef<{ colId: string; startX: number; startWidth: number } | null>(null);

  // 开始拖拽
  const handleResizeStart = useCallback((e: React.MouseEvent, colId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const startWidth = columnWidths.get(colId) || 120;
    resizeRef.current = { colId, startX: e.clientX, startWidth };
    setResizing(colId);
    setResizeStartX(e.clientX);
    setResizeStartWidth(startWidth);
  }, [columnWidths]);

  // 拖拽中
  useEffect(() => {
    if (!resizing || !resizeRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - resizeRef.current!.startX;
      const newWidth = Math.max(50, resizeRef.current!.startWidth + diff);
      setColumnWidths((prev) => {
        const next = new Map(prev);
        next.set(resizing, newWidth);
        return next;
      });
    };

    const handleMouseUp = () => {
      setResizing(null);
      resizeRef.current = null;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizing]);

  // 获取列的背景色
  const getHeaderBg = (col: ColumnDef<T>) => {
    if (col.headerGroup) return HEADER_GROUP_COLORS[col.headerGroup] || defaultHeaderBg;
    return defaultHeaderBg;
  };

  // 获取列的 sticky 样式
  const getStickyStyle = (col: ColumnDef<T>, colIndex: number) => {
    if (col.sticky === "left") {
      return {
        position: "sticky" as const,
        left: getStickyLeftOffset(colIndex, columnWidths, columns.findIndex(c => c.resizable)),
        zIndex: 20,
      };
    }
    if (col.stickyRight) {
      return {
        position: "sticky" as const,
        right: 0,
        zIndex: 20,
      };
    }
    return {};
  };

  // 计算 sticky 列的累积宽度
  const getStickyLeftValue = (colIndex: number): number => {
    let total = 0;
    for (let i = 0; i < colIndex; i++) {
      if (columns[i].sticky === "left") {
        total += columnWidths.get(columns[i].id) || 120;
      }
    }
    return total;
  };

  // 没有表头分组时渲染
  const renderSimpleHeader = () => (
    <thead className={defaultHeaderBg}>
      <tr className="divide-x divide-gray-200">
        {columns.map((col, colIndex) => {
          const width = columnWidths.get(col.id) || col.width || 120;
          const bg = getHeaderBg(col);
          const isStickyLeft = col.sticky === "left";
          const stickyOffset = isStickyLeft ? getStickyLeftValue(colIndex) : 0;

          return (
            <th
              key={col.id}
              style={{
                width,
                minWidth: col.minWidth || width,
                ...(isStickyLeft ? { left: stickyOffset } : {}),
              }}
              className={`px-3 py-3 text-sm font-medium text-gray-700 whitespace-nowrap border-b border-gray-200 ${isStickyLeft ? "sticky z-20" : ""} ${bg} ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}`}
            >
              <div className="flex items-center justify-between">
                <span className={col.align === "right" ? "mr-2" : col.align === "center" ? "mx-auto" : ""}>
                  {col.header}
                </span>
                {col.resizable && (
                  <div
                    className="w-1 cursor-col-resize hover:bg-blue-400 active:bg-blue-500 transition-colors flex-shrink-0"
                    style={{ height: "100%", position: "absolute", right: 0, top: 0 }}
                    onMouseDown={(e) => handleResizeStart(e, col.id)}
                  />
                )}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );

  // 渲染一级表头分组
  const renderGroupedHeader = () => {
    if (!headerGroups || headerGroups.length === 0) return renderSimpleHeader();

    return (
      <>
        {/* 一级表头 */}
        <thead className={defaultHeaderBg}>
          <tr className="divide-x divide-gray-200">
            {headerGroups.map((group, idx) => (
              <th
                key={`group-${idx}`}
                colSpan={group.colSpan}
                className={`px-3 py-3 text-center text-sm font-semibold text-gray-700 border-b border-gray-200 ${
                  group.bgColor ? HEADER_GROUP_COLORS[group.bgColor] : "bg-gray-50"
                }`}
              >
                {group.title}
              </th>
            ))}
          </tr>
        </thead>
        {/* 二级表头 */}
        <thead>
          <tr className="divide-x divide-gray-200">
            {columns.map((col, colIndex) => {
              const width = columnWidths.get(col.id) || col.width || 120;
              const bg = getHeaderBg(col);
              const isStickyLeft = col.sticky === "left";
              const stickyOffset = isStickyLeft ? getStickyLeftValue(colIndex) : 0;

              return (
                <th
                  key={col.id}
                  style={{
                    width,
                    minWidth: col.minWidth || width,
                    ...(isStickyLeft ? { left: stickyOffset } : {}),
                  }}
                  className={`px-3 py-2 text-xs font-medium text-gray-600 whitespace-nowrap border-b border-gray-200 ${isStickyLeft ? "sticky z-20" : ""} ${bg}`}
                >
                  <div className="flex items-center justify-between relative">
                    <span className={col.align === "right" ? "mr-2" : col.align === "center" ? "mx-auto" : ""}>
                      {col.header}
                    </span>
                    {col.resizable && (
                      <div
                        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-400 active:bg-blue-500 transition-colors"
                        onMouseDown={(e) => handleResizeStart(e, col.id)}
                      />
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
      </>
    );
  };

  return (
    <div className={`overflow-x-auto border border-gray-200 rounded-lg ${className}`}>
      <table
        className="w-full border-collapse divide-y divide-gray-200"
        style={{ tableLayout: "fixed", minWidth: columns.reduce((acc, col) => acc + (columnWidths.get(col.id) || 120), 0) }}
      >
        {renderGroupedHeader()}

        {/* 表体 */}
        <tbody className="divide-y divide-gray-100 bg-white">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-gray-400 text-sm"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row.id ?? rowIndex}
                className={`divide-x divide-gray-100 transition-colors ${
                  striped && rowIndex % 2 === 1 ? "bg-gray-50/50" : ""
                } ${onRowClick ? "cursor-pointer hover:bg-blue-50/30" : ""}`}
                onClick={() => onRowClick?.(row, rowIndex)}
              >
                {columns.map((col, colIndex) => {
                  const width = columnWidths.get(col.id) || col.width || 120;
                  const isStickyLeft = col.sticky === "left";
                  const stickyOffset = isStickyLeft ? getStickyLeftValue(colIndex) : 0;

                  return (
                    <td
                      key={col.id}
                      style={{
                        width,
                        minWidth: col.minWidth || width,
                        ...(isStickyLeft ? { left: stickyOffset } : {}),
                        ...(col.stickyRight ? { right: 0 } : {}),
                      }}
                      className={`px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap ${
                        isStickyLeft ? "sticky bg-white z-10" : col.stickyRight ? "sticky bg-white z-10" : ""
                      } ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""}`}
                    >
                      {col.cell ? col.cell(row, rowIndex) : (row as Record<string, unknown>)[col.id] as React.ReactNode}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;