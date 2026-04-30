import React from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface ReportDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  columns: {
    key: string;
    label: string;
    groupColor?: string;
    groupLabel?: string;
    align?: string;
  }[];
  headerGroups?: {
    label: string;
    startCol: number;
    span: number;
    color: string;
  }[];
  rowData: Record<string, unknown>;
}

export function ReportDetailModal({
  isOpen,
  onClose,
  title,
  columns,
  headerGroups,
  rowData,
}: ReportDetailModalProps) {
  if (!isOpen) return null;

  // 按一级表头分组
  const groups = headerGroups || [];

  // 构建每个字段属于哪个组
  const getGroupForColumn = (colIndex: number): string | null => {
    for (const group of groups) {
      if (colIndex >= group.startCol && colIndex < group.startCol + group.span) {
        return group.label;
      }
    }
    return null;
  };

  // 按组分割字段
  const groupedColumns: Record<string, typeof columns> = {};
  columns.forEach((col, index) => {
    const groupLabel = getGroupForColumn(index) || "基础信息";
    if (!groupedColumns[groupLabel]) {
      groupedColumns[groupLabel] = [];
    }
    groupedColumns[groupLabel].push(col);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-[900px] max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {Object.entries(groupedColumns).map(([groupLabel, cols]) => (
              <div key={groupLabel}>
                <h3 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
                  {groupLabel}
                </h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {cols.map(col => (
                    <div key={col.key} className="flex items-start">
                      <span className="text-sm text-gray-500 w-40 flex-shrink-0">
                        {col.label}：
                      </span>
                      <span className={`text-sm text-gray-900 flex-1 ${
                        col.align === "right" ? "text-right" : ""
                      }`}>
                        {rowData[col.key] !== undefined && rowData[col.key] !== null && rowData[col.key] !== ""
                          ? String(rowData[col.key])
                          : "-"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 底部 */}
        <div className="flex items-center justify-center gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" size="sm" onClick={onClose}>关闭</Button>
        </div>
      </div>
    </div>
  );
}
