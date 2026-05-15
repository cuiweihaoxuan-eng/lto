import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number, pageSize: number) => void;
  showTotal?: boolean;
  showQuickJumper?: boolean;
  size?: "sm" | "md";
}

/**
 * 统一分页组件
 * 统一所有页面的分页样式
 */
export function Pagination({
  current,
  total,
  pageSize,
  onChange,
  showTotal = true,
  showQuickJumper = true,
  size = "md"
}: PaginationProps) {
  const [jumpValue, setJumpValue] = useState("");

  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== current) {
      onChange(page, pageSize);
    }
  };

  const handleJump = () => {
    const page = parseInt(jumpValue, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      handlePageChange(page);
      setJumpValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleJump();
    }
  };

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (current >= totalPages - 3) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const btnSize = size === "sm" ? "h-7 text-xs" : "h-8 text-sm";
  const inputSize = size === "sm" ? "w-10 h-7 text-xs" : "w-12 h-8 text-sm";

  return (
    <div className="pagination">
      {showTotal && (
        <span className="pagination-info">
          共 <strong>{total}</strong> 条
        </span>
      )}

      <button
        className={`pagination-btn ${btnSize}`}
        onClick={() => handlePageChange(1)}
        disabled={current === 1}
        title="首页"
      >
        <ChevronsLeft className="w-4 h-4" />
      </button>
      <button
        className={`pagination-btn ${btnSize}`}
        onClick={() => handlePageChange(current - 1)}
        disabled={current === 1}
        title="上一页"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {getPageNumbers().map((page, idx) =>
        page === "ellipsis" ? (
          <span key={`ellipsis-${idx}`} className={`${btnSize} flex items-center justify-center`}>
            ...
          </span>
        ) : (
          <button
            key={page}
            className={`pagination-btn ${btnSize} ${current === page ? "active" : ""}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        )
      )}

      <button
        className={`pagination-btn ${btnSize}`}
        onClick={() => handlePageChange(current + 1)}
        disabled={current === totalPages}
        title="下一页"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
      <button
        className={`pagination-btn ${btnSize}`}
        onClick={() => handlePageChange(totalPages)}
        disabled={current === totalPages}
        title="末页"
      >
        <ChevronsRight className="w-4 h-4" />
      </button>

      {showQuickJumper && (
        <div className="pagination-jump">
          <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>跳至</span>
          <input
            type="number"
            className={inputSize}
            value={jumpValue}
            onChange={(e) => setJumpValue(e.target.value)}
            onKeyDown={handleKeyDown}
            min={1}
            max={totalPages}
            placeholder=""
          />
          <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>页</span>
          <button
            className={`pagination-btn ${btnSize}`}
            onClick={handleJump}
          >
            确定
          </button>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 16 }}>
        <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>每页</span>
        <select
          value={pageSize}
          onChange={(e) => onChange(1, parseInt(e.target.value, 10))}
          style={{
            height: size === "sm" ? 28 : 32,
            padding: "0 8px",
            border: "1px solid var(--color-border)",
            borderRadius: 6,
            fontSize: 13,
            outline: "none",
            cursor: "pointer"
          }}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>条</span>
      </div>
    </div>
  );
}

export default Pagination;