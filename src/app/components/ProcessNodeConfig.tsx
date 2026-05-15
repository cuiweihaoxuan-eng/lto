import React, { useState } from "react";
import { ProcessList } from "./ProcessList";
import { NodeList } from "./NodeList";

export function ProcessNodeConfig() {
  const [activeTab, setActiveTab] = useState<"process" | "node">("process");

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 页面标题 */}
      <div className="px-6 pt-6 pb-4 flex-shrink-0">
        <h2 className="text-lg font-medium text-gray-900">流程节点配置</h2>
        <p className="text-sm text-gray-500 mt-1">管理流程节点配置信息</p>
      </div>

      {/* Tab Header */}
      <div className="px-6 flex-shrink-0">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("process")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "process"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            流程列表
          </button>
          <button
            onClick={() => setActiveTab("node")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "node"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            节点列表
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto px-6 pb-6 mt-4">
        {activeTab === "process" ? <ProcessList /> : <NodeList />}
      </div>
    </div>
  );
}
