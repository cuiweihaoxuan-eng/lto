import React from "react";

export type TabStyle = "underlined" | "pill";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

interface TabNavProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  style?: TabStyle;
  className?: string;
}

/**
 * 统一 Tab 导航组件
 * pill 样式：选中为白色背景+阴影，未选中为灰色背景（参考专家调用报表）
 */
export function TabNav({ tabs, activeTab, onTabChange, style = "underlined", className = "" }: TabNavProps) {
  if (style === "pill") {
    return (
      <div className={`flex gap-1 bg-[#f3f4f6] p-1 rounded-lg w-fit ${className}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-1 ${
              activeTab === tab.id
                ? "text-gray-900 bg-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            disabled={tab.disabled}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span style={{
                marginLeft: 6,
                padding: "1px 6px",
                borderRadius: 10,
                fontSize: 11,
                background: activeTab === tab.id ? "rgba(0,0,0,0.1)" : "#d1d5db",
                color: activeTab === tab.id ? "#374151" : "#6b7280"
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex border-b border-gray-200 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-1 ${
            activeTab === tab.id
              ? "text-[#1890ff] border-[#1890ff]"
              : "text-gray-500 border-transparent hover:text-gray-700"
          }`}
          onClick={() => !tab.disabled && onTabChange(tab.id)}
          disabled={tab.disabled}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span style={{
              marginLeft: 6,
              padding: "1px 6px",
              borderRadius: 10,
              fontSize: 11,
              background: activeTab === tab.id ? "rgba(0,0,0,0.1)" : "#e5e7eb",
              color: activeTab === tab.id ? "#fff" : "#6b7280"
            }}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

/**
 * 下划线 Tab 组件（便捷函数）
 */
export function UnderlinedTabNav(props: Omit<TabNavProps, "style">) {
  return <TabNav {...props} style="underlined" />;
}

/**
 * 胶囊 Tab 组件（便捷函数）
 */
export function PillTabNav(props: Omit<TabNavProps, "style">) {
  return <TabNav {...props} style="pill" />;
}
