import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useSearchParams } from "react-router";
import { BarChart3 } from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { ProjectInfoBar } from "./components/ProjectInfoBar";
import { ProcessFlowBar } from "./components/ProcessFlowBar";
import { FunctionMenu } from "./components/FunctionMenu";
import { ForwardBackwardMatching } from "./components/ForwardBackwardMatching";
import { ProgressManagement } from "./components/ProgressManagement";
import { ContractPaymentConfirmation } from "./components/ContractPaymentConfirmation";
import { ContractDemolition } from "./components/ContractDemolition";
import { ImplementationMonitoring } from "./components/ImplementationMonitoring";
import { QualityControl } from "./components/QualityControl";
import { InvoiceApplication } from "./components/InvoiceApplication";
import { LeadAcquisition } from "./components/LeadAcquisition";
import { LeadPoolManagement } from "./components/LeadPoolManagement";
import { LeadMerge } from "./components/LeadMerge";
import { LeadDistribution } from "./components/LeadDistribution";
import { Dashboard } from "./components/Dashboard";
import { ProcessNodeConfig } from "./components/ProcessNodeConfig";
import { SixPositioning } from "./components/SixPositioning";
import { ExpertReportPage } from "./components/ExpertReportPage";
import { OpportunityQuery } from "./components/OpportunityQuery";
import { OpportunityDetail } from "./components/OpportunityDetail";
import { FullFlowTable } from "./components/FullFlowTable";
import { LowMarginReport } from "./components/LowMarginReport";
import { RevenuePlanActualDiff } from "./components/RevenuePlanActualDiff";
import { RevenueCostDiff } from "./components/RevenueCostDiff";
import { FirstPaymentDiff } from "./components/FirstPaymentDiff";
import { IctShareAbnormalReport } from "./components/IctShareAbnormalReport";
import { IctBudgetDetail } from "./components/IctBudgetDetail";
import { ConstructNotFixedNoExpense } from "./components/ConstructNotFixedNoExpense";

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [processFlowCollapsed, setProcessFlowCollapsed] = useState(false);
  const [activeNode, setActiveNode] = useState("acceptance");
  const [activeSubFunction, setActiveSubFunction] = useState("matching");
  const [activeSidebarItem, setActiveSidebarItem] = useState("dashboard");
  const [oppDetailId, setOppDetailId] = useState<string | null>(null);

  // 从 URL 获取商机编码参数（用于六到位跳转）
  const params = new URLSearchParams(window.location.search);
  const urlOppCode = params.get("code");
  const isOppDetailFromUrl = !!urlOppCode;

  // 判断当前是否在线索管理模块
  const isLeadManagementPage = ["lead-acquisition", "lead-pool", "lead-merge", "lead-distribution"].includes(activeSidebarItem);

  // 判断当前是否在商机查询页面
  const isOpportunityQueryPage = ["opp-query", "opp-participated", "opp-discovered", "opp-managed"].includes(activeSidebarItem);

  // 判断是否为首页
  const isDashboardPage = activeSidebarItem === "dashboard";

  // 判断是否为配置页面或六到位页面或报表页面
  const yecaiReportIds = [
    "full-flow-table", "low-margin-report", "revenue-plan-actual-diff",
    "revenue-cost-diff", "first-payment-diff",
    "ict-share-abnormal", "ict-budget-detail", "construct-not-fixed-no-expense"
  ];
  const isReportPage = ["report", "expert-report", "yecai-report-group", ...yecaiReportIds].includes(activeSidebarItem);
  const isConfigOrSixPositioningPage = ["process-config", "six-positioning"].includes(activeSidebarItem) || isReportPage;

  // 判断当前节点是否需要显示左侧子功能菜单和流程导航
  const isAcceptanceNode = activeNode === "acceptance";
  const showFunctionMenu = isAcceptanceNode && !isLeadManagementPage && !isDashboardPage && !isOpportunityQueryPage && !isConfigOrSixPositioningPage;

  const renderContent = () => {
    // 首页
    if (activeSidebarItem === "dashboard") {
      return <Dashboard />;
    }

    // 流程节点配置
    if (activeSidebarItem === "process-config") {
      return <ProcessNodeConfig />;
    }

    // 六到位
    if (activeSidebarItem === "six-positioning") {
      return <SixPositioning />;
    }

    // 专家任务报表
    if (activeSidebarItem === "report" || activeSidebarItem === "expert-report") {
      return <ExpertReportPage />;
    }

    // 业财融合报表
    if (activeSidebarItem === "full-flow-table") return <FullFlowTable />;
    if (activeSidebarItem === "low-margin-report") return <LowMarginReport />;
    if (activeSidebarItem === "revenue-plan-actual-diff") return <RevenuePlanActualDiff />;
    if (activeSidebarItem === "revenue-cost-diff") return <RevenueCostDiff />;
    if (activeSidebarItem === "first-payment-diff") return <FirstPaymentDiff />;
    if (activeSidebarItem === "ict-share-abnormal") return <IctShareAbnormalReport />;
    if (activeSidebarItem === "ict-budget-detail") return <IctBudgetDetail />;
    if (activeSidebarItem === "construct-not-fixed-no-expense") return <ConstructNotFixedNoExpense />;
    if (["invest-fixed-unbilled", "cooperation-share-report", "cost-provision-report", "project-budget-detail", "ict-gross-profit-report", "monthly-revenue-detail"].includes(activeSidebarItem)) {
      return (
        <div className="h-full flex flex-col">
          <div className="px-6 pt-6 pb-4 flex-shrink-0">
            <h2 className="text-lg font-medium text-gray-900">业财融合报表</h2>
            <p className="text-sm text-gray-500 mt-1">报表内容开发中...</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">该报表内容待提供</p>
            </div>
          </div>
        </div>
      );
    }

    // 线索管理页面
    if (activeSidebarItem === "lead-acquisition") {
      return <LeadAcquisition />;
    }
    if (activeSidebarItem === "lead-pool") {
      return <LeadPoolManagement />;
    }
    if (activeSidebarItem === "lead-merge") {
      return <LeadMerge />;
    }
    if (activeSidebarItem === "lead-distribution") {
      return <LeadDistribution />;
    }

    // 商机管理页面
    if (["opp-query", "opp-participated", "opp-discovered", "opp-managed"].includes(activeSidebarItem) || isOppDetailFromUrl) {
      const detailId = isOppDetailFromUrl ? (urlOppCode as string) : oppDetailId;
      if (detailId) {
        return <OpportunityDetail onBack={() => { if (isOppDetailFromUrl) { window.close(); } else { setOppDetailId(null); } }} />;
      }
      return <OpportunityQuery onRowClick={(id) => setOppDetailId(id)} />;
    }

    // 验收节点子功能
    if (isAcceptanceNode) {
      switch (activeSubFunction) {
        case "matching":
          return <ForwardBackwardMatching />;
        case "progress":
          return <ProgressManagement />;
        case "payment":
          return <ContractPaymentConfirmation />;
        case "six-positioning":
          return <SixPositioning />;
        default:
          return <ForwardBackwardMatching />;
      }
    }

    // 其他节点：直接显示对应页面
    switch (activeNode) {
      case "contract-demolition":
        return <ContractDemolition />;
      case "implementation-monitoring":
        return <ImplementationMonitoring />;
      case "quality-control":
        return <QualityControl />;
      case "invoice-application":
        return <InvoiceApplication />;
      default:
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold">{activeNode}</h2>
            <p className="mt-2">该节点内容开发中...</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#f0f5ff] overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeItem={activeSidebarItem}
        onItemChange={setActiveSidebarItem}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        {!oppDetailId && <Header />}

        {/* Project Info Bar */}
        {!isDashboardPage && !isLeadManagementPage && !isOpportunityQueryPage && !isConfigOrSixPositioningPage && !oppDetailId && <ProjectInfoBar />}

        {/* Process Flow Bar */}
        {!isDashboardPage && !isLeadManagementPage && !isOpportunityQueryPage && !isConfigOrSixPositioningPage && !oppDetailId && (
          <ProcessFlowBar
            isCollapsed={processFlowCollapsed}
            onToggle={() => setProcessFlowCollapsed(!processFlowCollapsed)}
            activeNode={activeNode}
            onNodeChange={setActiveNode}
          />
        )}

        {/* Main Content Area with Optional Left Function Menu */}
        <div className="flex-1 overflow-hidden flex bg-[#f0f5ff]">
          {/* Left Function Menu - 只在验收节点显示 */}
          {showFunctionMenu && (
            <FunctionMenu
              activeItem={activeSubFunction}
              onItemChange={setActiveSubFunction}
            />
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <div className="bg-white rounded shadow-sm h-full">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}