import React from 'react';

interface DataTableProps {
  children: React.ReactNode;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
}

/**
 * 通用数据表格组件
 * 自动应用以下样式：
 * - 表头：背景色 + 固定顶部
 * - 斑马纹行（可选）
 * - 行悬停效果（可选）
 */
export function DataTable({ children, className = '', striped = true, hoverable = true }: DataTableProps) {
  const tableClass = [
    'w-full text-sm',
    'data-table',
    striped ? 'zebra-striped' : '',
    hoverable ? 'table-hoverable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="border rounded-lg overflow-hidden flex-1 min-h-0">
      <div className="overflow-auto h-full">
        <table className={tableClass}>
          {children}
        </table>
      </div>
    </div>
  );
}

interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
  sticky?: boolean;
}

export function TableHead({ children, className = '', sticky = true }: TableHeadProps) {
  const headClass = [
    'table-thead',
    sticky ? 'sticky top-0 z-10' : '',
    className
  ].filter(Boolean).join(' ');

  return <thead className={headClass}>{children}</thead>;
}

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function TableBody({ children, className = '' }: TableBodyProps) {
  return <tbody className={className}>{children}</tbody>;
}

interface TableRowProps {
  children: React.ReactNode;
  index: number;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export function TableRow({ children, index, className = '', onClick, selected = false }: TableRowProps) {
  const rowClass = [
    onClick ? 'cursor-pointer' : '',
    selected ? 'bg-blue-50' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <tr
      className={rowClass}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  width?: string;
  maxWidth?: string;
}

export function TableCell({ children, className = '', width, maxWidth }: TableCellProps) {
  const cellClass = [
    'table-td',
    className
  ].filter(Boolean).join(' ');

  const style: React.CSSProperties = {};
  if (width) {
    style.minWidth = width;
    style.maxWidth = maxWidth || width;
  }

  return (
    <td className={cellClass} style={style}>
      {children}
    </td>
  );
}

interface TableHeaderCellProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
  maxWidth?: string;
}

export function TableHeaderCell({ children, className = '', align = 'left', width, maxWidth }: TableHeaderCellProps) {
  const cellClass = [
    'table-th',
    align === 'center' ? 'text-center' : '',
    align === 'right' ? 'text-right' : '',
    className
  ].filter(Boolean).join(' ');

  const style: React.CSSProperties = {};
  if (width) {
    style.minWidth = width;
    style.maxWidth = maxWidth || width;
  }

  return (
    <th className={cellClass} style={style}>
      {children}
    </th>
  );
}