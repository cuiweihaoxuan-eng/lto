import React, { useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useSearchParams } from "react-router";
import { BarChart3, Loader2 } from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { ProjectInfoBar } from "./components/ProjectInfoBar";
import { ProcessFlowBar } from "./components/ProcessFlowBar";
import { FunctionMenu } from "./components/FunctionMenu";
import { FloatAIBtn } from "./components/FloatAIBtn";
import { AISidebar } from "./components/AISidebar";
import { ResizeDivider } from "./components/ResizeDivider";

// 懒加载组件 - 使用命名导入
const Dashboard = lazy(() => import("./components/Dashboard").then(m => ({ default: m.default })));
const ProcessNodeConfig = lazy(() => import("./components/ProcessNodeConfig").then(m => ({ default: m.ProcessNodeConfig })));
const SixPositioning = lazy(() => import("./components/SixPositioning").then(m => ({ default: m.SixPositioning })));
const ExpertReportPage = lazy(() => import("./components/ExpertReportPage").then(m => ({ default: m.ExpertReportPage })));
const FullFlowTable = lazy(() => import("./components/FullFlowTable").then(m => ({ default: m.FullFlowTable })));
const LowMarginReport = lazy(() => import("./components/LowMarginReport").then(m => ({ default: m.LowMarginReport })));
const RevenuePlanActualDiff = lazy(() => import("./components/RevenuePlanActualDiff").then(m => ({ default: m.RevenuePlanActualDiff })));
const RevenueCostDiff = lazy(() => import("./components/RevenueCostDiff").then(m => ({ default: m.RevenueCostDiff })));
const FirstPaymentDiff = lazy(() => import("./components/FirstPaymentDiff").then(m => ({ default: m.FirstPaymentDiff })));
const IctShareAbnormalReport = lazy(() => import("./components/IctShareAbnormalReport").then(m => ({ default: m.IctShareAbnormalReport })));
const IctGrossProfitReport = lazy(() => import("./components/IctGrossProfitReport").then(m => ({ default: m.IctGrossProfitReport })));
const IctBudgetDetail = lazy(() => import("./components/IctBudgetDetail").then(m => ({ default: m.IctBudgetDetail })));
const ConstructNotFixedNoExpense = lazy(() => import("./components/ConstructNotFixedNoExpense").then(m => ({ default: m.ConstructNotFixedNoExpense })));
const BusinessInfoManagement = lazy(() => import("./components/BusinessInfoManagement").then(m => ({ default: m.BusinessInfoManagement })));
const LeadAcquisition = lazy(() => import("./components/LeadAcquisition").then(m => ({ default: m.LeadAcquisition })));
const LeadPoolManagement = lazy(() => import("./components/LeadPoolManagement").then(m => ({ default: m.LeadPoolManagement })));
const LeadMerge = lazy(() => import("./components/LeadMerge").then(m => ({ default: m.LeadMerge })));
const LeadDistribution = lazy(() => import("./components/LeadDistribution").then(m => ({ default: m.LeadDistribution })));
const OpportunityQuery = lazy(() => import("./components/OpportunityQuery").then(m => ({ default: m.OpportunityQuery })));
const OpportunityDetail = lazy(() => import("./components/OpportunityDetail").then(m => ({ default: m.OpportunityDetail })));
const ForwardBackwardMatching = lazy(() => import("./components/ForwardBackwardMatching").then(m => ({ default: m.ForwardBackwardMatching })));
const ProgressManagement = lazy(() => import("./components/ProgressManagement").then(m => ({ default: m.ProgressManagement })));
const ContractPaymentConfirmation = lazy(() => import("./components/ContractPaymentConfirmation").then(m => ({ default: m.ContractPaymentConfirmation })));
const ContractDemolition = lazy(() => import("./components/ContractDemolition").then(m => ({ default: m.ContractDemolition })));
const ImplementationMonitoring = lazy(() => import("./components/ImplementationMonitoring").then(m => ({ default: m.ImplementationMonitoring })));
const QualityControl = lazy(() => import("./components/QualityControl").then(m => ({ default: m.QualityControl })));
const InvoiceApplication = lazy(() => import("./components/InvoiceApplication").then(m => ({ default: m.InvoiceApplication })));

// 加载中组件
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );
}

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
  const isOpportunityQueryPage = ["opportunity", "business-info"].includes(activeSidebarItem);

  // 判断是否为首页
  const isDashboardPage = activeSidebarItem === "dashboard";

  // 判断是否为配置页面或六到位页面或报表页面
  const yecaiReportIds = [
    "full-flow-table", "low-margin-report", "revenue-plan-actual-diff",
    "revenue-cost-diff", "first-payment-diff",
    "ict-share-abnormal", "ict-budget-detail", "construct-not-fixed-no-expense",
    "ict-gross-profit-report"
  ];
  const isReportPage = ["report", "expert-report", "yecai-report-group", ...yecaiReportIds].includes(activeSidebarItem);
  const isConfigOrSixPositioningPage = ["process-config", "six-positioning", "business-info"].includes(activeSidebarItem) || isReportPage;

  // 判断当前节点是否需要显示左侧子功能菜单和流程导航
  const isAcceptanceNode = activeNode === "acceptance";
  const showFunctionMenu = isAcceptanceNode && !isLeadManagementPage && !isDashboardPage && !isOpportunityQueryPage && !isConfigOrSixPositioningPage;

  const renderContent = () => {
    // 首页
    if (activeSidebarItem === "dashboard") {
      return <Suspense fallback={<LoadingSpinner />}><Dashboard /></Suspense>;
    }

    // 流程节点配置
    if (activeSidebarItem === "process-config") {
      return <Suspense fallback={<LoadingSpinner />}><ProcessNodeConfig /></Suspense>;
    }

    // 六到位
    if (activeSidebarItem === "six-positioning") {
      return <Suspense fallback={<LoadingSpinner />}><SixPositioning /></Suspense>;
    }

    // 专家任务报表
    if (activeSidebarItem === "report" || activeSidebarItem === "expert-report") {
      return <Suspense fallback={<LoadingSpinner />}><ExpertReportPage /></Suspense>;
    }

    // 业财融合报表
    if (activeSidebarItem === "full-flow-table") return <Suspense fallback={<LoadingSpinner />}><FullFlowTable /></Suspense>;
    if (activeSidebarItem === "low-margin-report") return <Suspense fallback={<LoadingSpinner />}><LowMarginReport /></Suspense>;
    if (activeSidebarItem === "revenue-plan-actual-diff") return <Suspense fallback={<LoadingSpinner />}><RevenuePlanActualDiff /></Suspense>;
    if (activeSidebarItem === "revenue-cost-diff") return <Suspense fallback={<LoadingSpinner />}><RevenueCostDiff /></Suspense>;
    if (activeSidebarItem === "first-payment-diff") return <Suspense fallback={<LoadingSpinner />}><FirstPaymentDiff /></Suspense>;
    if (activeSidebarItem === "ict-share-abnormal") return <Suspense fallback={<LoadingSpinner />}><IctShareAbnormalReport /></Suspense>;
    if (activeSidebarItem === "ict-gross-profit-report") return <Suspense fallback={<LoadingSpinner />}><IctGrossProfitReport /></Suspense>;
    if (activeSidebarItem === "ict-budget-detail") return <Suspense fallback={<LoadingSpinner />}><IctBudgetDetail /></Suspense>;
    if (activeSidebarItem === "construct-not-fixed-no-expense") return <Suspense fallback={<LoadingSpinner />}><ConstructNotFixedNoExpense /></Suspense>;
    if (activeSidebarItem === "business-info") return <Suspense fallback={<LoadingSpinner />}><BusinessInfoManagement /></Suspense>;
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
      return <Suspense fallback={<LoadingSpinner />}><LeadAcquisition /></Suspense>;
    }
    if (activeSidebarItem === "lead-pool") {
      return <Suspense fallback={<LoadingSpinner />}><LeadPoolManagement /></Suspense>;
    }
    if (activeSidebarItem === "lead-merge") {
      return <Suspense fallback={<LoadingSpinner />}><LeadMerge /></Suspense>;
    }
    if (activeSidebarItem === "lead-distribution") {
      return <Suspense fallback={<LoadingSpinner />}><LeadDistribution /></Suspense>;
    }

    // 商机管理页面
    if (activeSidebarItem === "opportunity" || isOppDetailFromUrl) {
      const detailId = isOppDetailFromUrl ? (urlOppCode as string) : oppDetailId;
      if (detailId) {
        return <Suspense fallback={<LoadingSpinner />}><OpportunityDetail onBack={() => { if (isOppDetailFromUrl) { window.close(); } else { setOppDetailId(null); } }} /></Suspense>;
      }
      return <Suspense fallback={<LoadingSpinner />}><OpportunityQuery onRowClick={(id) => setOppDetailId(id)} /></Suspense>;
    }

    // 验收节点子功能
    if (isAcceptanceNode) {
      switch (activeSubFunction) {
        case "matching":
          return <Suspense fallback={<LoadingSpinner />}><ForwardBackwardMatching /></Suspense>;
        case "progress":
          return <Suspense fallback={<LoadingSpinner />}><ProgressManagement /></Suspense>;
        case "payment":
          return <Suspense fallback={<LoadingSpinner />}><ContractPaymentConfirmation /></Suspense>;
        case "six-positioning":
          return <Suspense fallback={<LoadingSpinner />}><SixPositioning /></Suspense>;
        default:
          return <Suspense fallback={<LoadingSpinner />}><ForwardBackwardMatching /></Suspense>;
      }
    }

    // 其他节点：直接显示对应页面
    switch (activeNode) {
      case "contract-demolition":
        return <Suspense fallback={<LoadingSpinner />}><ContractDemolition /></Suspense>;
      case "implementation-monitoring":
        return <Suspense fallback={<LoadingSpinner />}><ImplementationMonitoring /></Suspense>;
      case "quality-control":
        return <Suspense fallback={<LoadingSpinner />}><QualityControl /></Suspense>;
      case "invoice-application":
        return <Suspense fallback={<LoadingSpinner />}><InvoiceApplication /></Suspense>;
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
