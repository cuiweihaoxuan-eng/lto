import React, { useState, lazy, Suspense, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { FloatAIBtn } from "./components/FloatAIBtn";
import { AISidebar } from "./components/AISidebar";
import { ResizeDivider } from "./components/ResizeDivider";
import { PrdPanel } from "./components/PrdPanel";

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
const CostEstimateReport = lazy(() => import("./components/CostEstimateReport").then(m => ({ default: m.CostEstimateReport })));
const BusinessInfoManagement = lazy(() => import("./components/BusinessInfoManagement").then(m => ({ default: m.BusinessInfoManagement })));
const LeadAcquisition = lazy(() => import("./components/LeadAcquisition").then(m => ({ default: m.LeadAcquisition })));
const LeadPoolManagement = lazy(() => import("./components/LeadPoolManagement").then(m => ({ default: m.LeadPoolManagement })));
const LeadMerge = lazy(() => import("./components/LeadMerge").then(m => ({ default: m.LeadMerge })));
const LeadDistribution = lazy(() => import("./components/LeadDistribution").then(m => ({ default: m.LeadDistribution })));
const OpportunityQuery = lazy(() => import("./components/OpportunityQuery").then(m => ({ default: m.OpportunityQuery })));
const OpportunityDetail = lazy(() => import("./components/OpportunityDetail").then(m => ({ default: m.OpportunityDetail })));
const ProgressManagement = lazy(() => import("./components/ProgressManagement").then(m => ({ default: m.ProgressManagement })));
const ContractPaymentConfirmation = lazy(() => import("./components/ContractPaymentConfirmation").then(m => ({ default: m.ContractPaymentConfirmation })));
const RiskManagement = lazy(() => import("./components/RiskManagement").then(m => ({ default: m.default })));
const RevenueManagement = lazy(() => import("./components/RevenueManagement").then(m => ({ default: m.RevenueManagement })));
const SelfDeliverySettlement = lazy(() => import("./components/SelfDeliverySettlement").then(m => ({ default: m.SelfDeliverySettlement })));

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
  const [activeSidebarItem, setActiveSidebarItem] = useState("dashboard");
  const [oppDetailId, setOppDetailId] = useState<string | null>(null);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);
  const [aiSidebarWidth, setAiSidebarWidth] = useState(400);
  const [prdSidebarOpen, setPrdSidebarOpen] = useState(false);

// 注入当前路由给 prd-inject.js（SPA 无法从 URL 识别路由）
useEffect(() => {
  window.__PRD_ROUTE__ = activeSidebarItem;
  const meta = document.querySelector('meta[name="prd-route"]');
  if (meta) meta.setAttribute('content', activeSidebarItem);
  else document.head.insertAdjacentHTML('beforeend', `<meta name="prd-route" content="${activeSidebarItem}">`);
}, [activeSidebarItem]);

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

    // 录收管理
    if (activeSidebarItem === "revenue-management") {
      return <Suspense fallback={<LoadingSpinner />}><RevenueManagement /></Suspense>;
    }

    // 自交付结算管理
    if (activeSidebarItem === "self-delivery-settlement") {
      return <Suspense fallback={<LoadingSpinner />}><SelfDeliverySettlement /></Suspense>;
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
    if (activeSidebarItem === "cost-estimate-report") return <Suspense fallback={<LoadingSpinner />}><CostEstimateReport /></Suspense>;

    // 形象进度管理
    if (activeSidebarItem === "progress-management") {
      return <Suspense fallback={<LoadingSpinner />}><ProgressManagement /></Suspense>;
    }

    // 合同收付款确认
    if (activeSidebarItem === "contract-payment-confirmation") {
      return <Suspense fallback={<LoadingSpinner />}><ContractPaymentConfirmation /></Suspense>;
    }
    if (activeSidebarItem === "business-info") return <Suspense fallback={<LoadingSpinner />}><BusinessInfoManagement /></Suspense>;
    
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
    if (activeSidebarItem === "opportunity") {
      return <Suspense fallback={<LoadingSpinner />}><OpportunityQuery onRowClick={(id) => setOppDetailId(id)} /></Suspense>;
    }
    if (activeSidebarItem === "opp-detail" && oppDetailId) {
      return <Suspense fallback={<LoadingSpinner />}><OpportunityDetail onBack={() => setOppDetailId(null)} /></Suspense>;
    }

    // 风险管理页面
    if (activeSidebarItem === "risk-dispatch") {
      return <Suspense fallback={<LoadingSpinner />}><RiskManagement /></Suspense>;
    }

    // 未匹配到任何页面时显示首页
    return <Suspense fallback={<LoadingSpinner />}><Dashboard /></Suspense>;
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

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden flex bg-[#f0f5ff]">
          {/* Content Area - 宽度随AI侧边栏和PRD侧边栏变化 */}
          <div
            className="overflow-auto transition-all duration-300 bg-[#f0f5ff]"
            style={{
              width: aiSidebarOpen
                ? `calc(100% - ${aiSidebarWidth + 6}px)`
                : prdSidebarOpen
                  ? `calc(100% - 560px)`
                  : '100%'
            }}
          >
            <div className="p-6 h-full flex flex-col">
              <div className="bg-white rounded shadow-sm flex-1">
                {renderContent()}
              </div>
            </div>
          </div>

          {/* Resize Divider - 仅在AI侧边栏打开时显示 */}
          <ResizeDivider
            onWidthChange={setAiSidebarWidth}
            minWidth={300}
            maxWidth={600}
            defaultWidth={400}
            visible={aiSidebarOpen}
          />

          {/* AI Sidebar */}
          <AISidebar
            isOpen={aiSidebarOpen}
            onClose={() => setAiSidebarOpen(false)}
            width={aiSidebarWidth}
          />

          {/* PRD Panel */}
          <PrdPanel
            route={activeSidebarItem}
            basePath="/lto"
            isOpen={prdSidebarOpen}
            onToggle={() => setPrdSidebarOpen(!prdSidebarOpen)}
          />
        </div>
      </div>

      {/* Floating AI Button */}
      <FloatAIBtn
        isOpen={aiSidebarOpen}
        onClick={() => setAiSidebarOpen(!aiSidebarOpen)}
      />

    </div>
  );
}
