import { useState } from "react";

export type CheckState = 0 | 1 | 2; // 0=unchecked, 1=checked, 2=indeterminate

export interface HeaderGroupForHook {
  label: string;
  startCol: number;
  span: number;
  color?: string;
  children?: { label: string; startCol: number; span: number }[];
}

export interface ColumnDefForHook {
  key: string;
  label: string;
  width?: number;
}

export function useColumnVisibility(columns: ColumnDefForHook[], groups: HeaderGroupForHook[], level: 2 | 3) {
  const [visibility, setVisibility] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(columns.map(c => [c.key, true]))
  );

  const toggleColumn = (key: string, visible: boolean) => {
    setVisibility(prev => ({ ...prev, [key]: visible }));
  };

  const toggleAll = (visible: boolean) => {
    setVisibility(Object.fromEntries(columns.map(c => [c.key, visible])));
  };

  const toggleGroup = (groupIdx: number, visible: boolean) => {
    const group = groups[groupIdx];
    if (!group) return;
    setVisibility(prev => {
      const next = { ...prev };
      for (let ci = group.startCol; ci < group.startCol + group.span; ci++) {
        const col = columns[ci];
        if (col) next[col.key] = visible;
      }
      return next;
    });
  };

  const toggleSubGroup = (groupIdx: number, childIdx: number, visible: boolean) => {
    const group = groups[groupIdx];
    const child = group?.children?.[childIdx];
    if (!child) return;
    setVisibility(prev => {
      const next = { ...prev };
      for (let ci = child.startCol; ci < child.startCol + child.span; ci++) {
        const col = columns[ci];
        if (col) next[col.key] = visible;
      }
      return next;
    });
  };

  const getGroupState = (groupIdx: number): CheckState => {
    const group = groups[groupIdx];
    if (!group) return 0;
    let checked = 0, unchecked = 0;
    for (let ci = group.startCol; ci < group.startCol + group.span; ci++) {
      const col = columns[ci];
      if (!col) continue;
      visibility[col.key] ? checked++ : unchecked++;
    }
    if (unchecked === 0) return 1;
    if (checked === 0) return 0;
    return 2;
  };

  const getSubGroupState = (groupIdx: number, childIdx: number): CheckState => {
    const group = groups[groupIdx];
    const child = group?.children?.[childIdx];
    if (!child) return 0;
    let checked = 0, unchecked = 0;
    for (let ci = child.startCol; ci < child.startCol + child.span; ci++) {
      const col = columns[ci];
      if (!col) continue;
      visibility[col.key] ? checked++ : unchecked++;
    }
    if (unchecked === 0) return 1;
    if (checked === 0) return 0;
    return 2;
  };

  const visibleColumns = columns.filter(c => visibility[c.key] !== false);
  const visibleCount = Object.values(visibility).filter(Boolean).length;

  return {
    visibility,
    visibleColumns,
    visibleCount,
    totalCount: columns.length,
    toggleColumn,
    toggleAll,
    toggleGroup,
    toggleSubGroup,
    getGroupState,
    getSubGroupState,
  };
}