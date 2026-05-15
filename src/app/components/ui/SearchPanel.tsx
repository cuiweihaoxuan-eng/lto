import React, { useState } from "react";
import { Search, RefreshCw, ChevronUp, ChevronDown } from "lucide-react";

/* ============ 类型定义 ============ */

export interface SearchField {
  /** 字段ID */
  id: string;
  /** 字段标签 */
  label: string;
  /** 字段类型 */
  type?: "input" | "select" | "date" | "number";
  /** 占位符 */
  placeholder?: string;
  /** 选项（select时使用） */
  options?: { label: string; value: string }[];
  /** 默认值 */
  defaultValue?: string;
}

export interface SearchPanelProps {
  /** 搜索字段配置 */
  fields: SearchField[];
  /** 查询回调 */
  onSearch: (values: Record<string, string>) => void;
  /** 重置回调 */
  onReset?: () => void;
  /** 是否显示更多条件 */
  showMoreToggle?: boolean;
  /** 额外按钮 */
  extraButtons?: React.ReactNode;
  /** 紧凑模式 */
  compact?: boolean;
}

/* ============ 组件 ============ */

/**
 * 统一搜索面板组件
 */
export function SearchPanel({
  fields,
  onSearch,
  onReset,
  showMoreToggle = true,
  extraButtons,
  compact = false,
}: SearchPanelProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.defaultValue !== undefined) {
        initial[f.id] = f.defaultValue;
      }
    });
    return initial;
  });

  const [showMore, setShowMore] = useState(false);

  const handleChange = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSearch = () => {
    onSearch(values);
  };

  const handleReset = () => {
    const cleared: Record<string, string> = {};
    fields.forEach((f) => { cleared[f.id] = ""; });
    setValues(cleared);
    onReset?.();
  };

  // 分为两行显示：第一行是主要字段，第二行是更多字段
  const visibleFields = showMoreToggle && !showMore ? fields.slice(0, 4) : fields;
  const hiddenFields = showMoreToggle && !showMore ? fields.slice(4) : [];

  const rowClass = compact ? "gap-3" : "gap-4";
  const itemClass = compact ? "min-w-[160px]" : "min-w-[200px]";

  return (
    <div className="search-panel">
      {/* 主要字段行 */}
      <div className={`flex flex-wrap items-end ${rowClass}`}>
        {visibleFields.map((field) => (
          <div key={field.id} className={`search-item ${itemClass}`}>
            <label className="search-label">{field.label}</label>
            {field.type === "select" ? (
              <select
                className="search-field"
                value={values[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
              >
                <option value="">{field.placeholder || "请选择"}</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type || "text"}
                className="search-field"
                placeholder={field.placeholder || `请输入${field.label}`}
                value={values[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
              />
            )}
          </div>
        ))}

        {/* 操作按钮 */}
        <div className="search-actions">
          {extraButtons}
          <button className="btn btn-primary" onClick={handleSearch}>
            <Search className="w-4 h-4" />
            查询
          </button>
          <button className="btn btn-secondary" onClick={handleReset}>
            <RefreshCw className="w-4 h-4" />
            重置
          </button>
          {showMoreToggle && hiddenFields.length > 0 && (
            <button
              className="btn btn-secondary"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  收起
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  展开
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 展开的更多字段 */}
      {showMore && hiddenFields.length > 0 && (
        <div className={`flex flex-wrap items-end ${rowClass} mt-4 pt-4 border-t border-gray-200`}>
          {hiddenFields.map((field) => (
            <div key={field.id} className={`search-item ${itemClass}`}>
              <label className="search-label">{field.label}</label>
              {field.type === "select" ? (
                <select
                  className="search-field"
                  value={values[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                >
                  <option value="">{field.placeholder || "请选择"}</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || "text"}
                  className="search-field"
                  placeholder={field.placeholder || `请输入${field.label}`}
                  value={values[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchPanel;