import React from "react";
import { Button } from "./button";
import { Settings2 } from "lucide-react";

interface ColumnDef {
  key: string;
  label: string;
  width?: number;
  groupColor?: string;
}

interface HeaderGroupDef {
  label: string;
  startCol: number;
  span: number;
  color?: string;
  children?: HeaderGroupDef[];
}

interface ColumnVisibilityModalProps {
  show: boolean;
  onClose: () => void;
  columns: ColumnDef[];
  groups: HeaderGroupDef[];
  /** 两级表头还是三级表头 */
  level: 2 | 3;
  visibility: Record<string, boolean>;
  onToggle: (key: string, visible: boolean) => void;
  onToggleGroup: (groupIdx: number, visible: boolean) => void;
  onToggleSubGroup: (groupIdx: number, childIdx: number, visible: boolean) => void;
  onToggleAll: (visible: boolean) => void;
  /** 0=unchecked, 1=checked, 2=indeterminate */
  getGroupState: (groupIdx: number) => 0 | 1 | 2;
  getSubGroupState: (groupIdx: number, childIdx: number) => 0 | 1 | 2;
}

function checkIcon(state: 0 | 1 | 2) {
  if (state === 1) return (
    <svg className="w-4 h-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
    </svg>
  );
  if (state === 2) return (
    <svg className="w-4 h-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
    </svg>
  );
  return (
    <div className="w-4 h-4 border border-gray-300 rounded"/>
  );
}

export function ColumnVisibilityModal({
  show, onClose, columns, groups, level, visibility,
  onToggle, onToggleGroup, onToggleSubGroup, onToggleAll,
  getGroupState, getSubGroupState,
}: ColumnVisibilityModalProps) {
  if (!show) return null;

  const visibleCount = Object.values(visibility).filter(Boolean).length;
  const totalCount = columns.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-[640px] max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">自定义表头</h3>
          <button className="text-gray-400 hover:text-gray-600 text-xl leading-none" onClick={onClose}>×</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {/* 全选行 */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
            <button
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 cursor-pointer"
              onClick={() => {
                const allOn = visibleCount === totalCount;
                onToggleAll(!allOn);
              }}
            >
              <span className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                visibleCount === totalCount ? "bg-blue-600 border-blue-600" : "border-gray-300"
              }`}>
                {visibleCount === totalCount && (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {visibleCount > 0 && visibleCount < totalCount && (
                  <div className="w-2 h-0.5 bg-white rounded"/>
                )}
              </span>
              全选 ({visibleCount}/{totalCount})
            </button>
          </div>

          {/* 分组列表 */}
          <div className="space-y-3">
            {groups.map((group, gi) => {
              const gState = getGroupState(gi);
              return (
                <div key={gi} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* 一级分组行 */}
                  <button
                    className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-left"
                    onClick={() => onToggleGroup(gi, gState !== 1)}
                  >
                    <span className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors flex-shrink-0 ${
                      gState === 1 ? "bg-blue-600 border-blue-600" : "border-gray-300"
                    }`}>
                      {gState === 1 && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                      {gState === 2 && <div className="w-2 h-0.5 bg-white rounded"/>}
                    </span>
                    <span className="text-sm font-semibold text-gray-800">{group.label}</span>
                  </button>

                  {/* 二级：列名列表 */}
                  {level === 2 ? (
                    <div className="bg-white">
                      {columns.slice(group.startCol, group.startCol + group.span).map(col => (
                        <label key={col.key}
                          className="flex items-center gap-2 px-4 py-1.5 hover:bg-gray-50 cursor-pointer">
                          <input type="checkbox" checked={visibility[col.key] !== false}
                            onChange={e => onToggle(col.key, e.target.checked)}
                            className="w-4 h-4 accent-blue-600 rounded" />
                          <span className={`text-sm ${visibility[col.key] === false ? "text-gray-400" : "text-gray-600"}`}>
                            {col.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : group.children ? (
                    <div className="bg-white">
                      {group.children.map((child, ci) => {
                        const cState = getSubGroupState(gi, ci);
                        return (
                          <div key={ci}>
                            <button
                              className="w-full flex items-center gap-2 px-4 py-1.5 hover:bg-gray-50 text-left"
                              onClick={() => onToggleSubGroup(gi, ci, cState !== 1)}
                            >
                              <span className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors flex-shrink-0 ${
                                cState === 1 ? "bg-blue-600 border-blue-600" : "border-gray-300"
                              }`}>
                                {cState === 1 && (
                                  <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                                {cState === 2 && <div className="w-2 h-0.5 bg-white rounded"/>}
                              </span>
                              <span className="text-sm font-medium text-gray-700">{child.label}</span>
                            </button>
                            <div className="pl-10 bg-gray-25">
                              {columns.slice(child.startCol, child.startCol + child.span).map(col => (
                                <label key={col.key}
                                  className="flex items-center gap-2 px-3 py-1 hover:bg-gray-50 cursor-pointer">
                                  <input type="checkbox" checked={visibility[col.key] !== false}
                                    onChange={e => onToggle(col.key, e.target.checked)}
                                    className="w-4 h-4 accent-blue-600 rounded" />
                                  <span className={`text-sm ${visibility[col.key] === false ? "text-gray-400" : "text-gray-600"}`}>
                                    {col.label}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-white">
                      {columns.slice(group.startCol, group.startCol + group.span).map(col => (
                        <label key={col.key}
                          className="flex items-center gap-2 px-4 py-1.5 hover:bg-gray-50 cursor-pointer">
                          <input type="checkbox" checked={visibility[col.key] !== false}
                            onChange={e => onToggle(col.key, e.target.checked)}
                            className="w-4 h-4 accent-blue-600 rounded" />
                          <span className={`text-sm ${visibility[col.key] === false ? "text-gray-400" : "text-gray-600"}`}>
                            {col.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-end gap-2 px-6 py-3 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" size="sm" onClick={() => onToggleAll(true)}>恢复默认</Button>
          <Button variant="default" size="sm" onClick={onClose}>确定</Button>
        </div>
      </div>
    </div>
  );
}

// 工具函数：根据列索引获取分组信息
export function getColumnGroupIndex(columns: ColumnDef[], groups: HeaderGroupDef[], colIdx: number) {
  for (let gi = 0; gi < groups.length; gi++) {
    const g = groups[gi];
    if (colIdx >= g.startCol && colIdx < g.startCol + g.span) return gi;
  }
  return -1;
}