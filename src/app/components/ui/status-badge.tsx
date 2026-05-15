import React from "react";

/* ============ 类型定义 ============ */

export type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral" | "primary";

export interface StatusBadgeProps {
  /** 显示文本 */
  label: string;
  /** 样式变体 */
  variant?: BadgeVariant;
  /** 自定义样式 */
  className?: string;
  /** 是否显示圆点 */
  showDot?: boolean;
}

/* ============ 样式映射 ============ */

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  success: "bg-green-50 text-green-700 border border-green-200",
  warning: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  danger: "bg-red-50 text-red-700 border border-red-200",
  info: "bg-blue-50 text-blue-700 border border-blue-200",
  neutral: "bg-gray-100 text-gray-600 border border-gray-200",
  primary: "bg-[#1890ff]/10 text-[#1890ff] border border-[#1890ff]/20",
};

/* ============ 组件 ============ */

/**
 * 统一状态标签组件
 * 根据业务状态自动匹配样式
 */
export function StatusBadge({ label, variant = "neutral", className = "", showDot = false }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${VARIANT_STYLES[variant]} ${className}`}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            variant === "success" ? "bg-green-500" :
            variant === "warning" ? "bg-yellow-500" :
            variant === "danger" ? "bg-red-500" :
            variant === "info" ? "bg-blue-500" :
            variant === "neutral" ? "bg-gray-400" : "bg-[#1890ff]"
          }`}
        />
      )}
      {label}
    </span>
  );
}

/**
 * 根据状态值自动匹配样式的工具函数
 */
export function getStatusVariant(status: string): BadgeVariant {
  const statusMap: Record<string, BadgeVariant> = {
    // 成功/完成状态
    "已完成": "success",
    "已确认": "success",
    "已通过": "success",
    "已转化": "success",
    "完成": "success",
    "通过": "success",
    "已归档": "success",

    // 警告/待处理状态
    "待处理": "warning",
    "处理中": "warning",
    "待确认": "warning",
    "待审核": "warning",
    "进行中": "warning",
    "推进中": "warning",
    "跟进中": "warning",
    "审批中": "warning",
    "已派单": "warning",

    // 危险/拒绝状态
    "已驳回": "danger",
    "已拒绝": "danger",
    "已关闭": "danger",
    "失败": "danger",
    "异常": "danger",
    "超时": "danger",

    // 信息状态
    "新增": "info",
    "录入": "info",
    "草稿": "info",

    // 中性状态
    "未开始": "neutral",
    "待启动": "neutral",
  };

  return statusMap[status] || "neutral";
}

/**
 * 自动状态标签组件 - 根据文本自动匹配样式
 */
export function AutoStatusBadge({ label, className = "", showDot = false }: Omit<StatusBadgeProps, "variant">) {
  return <StatusBadge label={label} variant={getStatusVariant(label)} className={className} showDot={showDot} />;
}

export default StatusBadge;