import React, { useState } from "react";
import { Search, RefreshCw, Download, Upload, Plus, FileDown } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { TabNav } from "./ui/tab-nav";
import { StatusBadge } from "./ui/status-badge";
import { Pagination } from "./ui/pagination";
import { RiskDispatchDialog } from "./RiskDispatchDialog";
import { RiskDetailDialog } from "./RiskDetailDialog";
import { RiskRecordDialog } from "./RiskRecordDialog";
import { FlowTrackDialog } from "./FlowTrackDialog";

// 模拟数据 - 风险派单表格（带新增字段）
const mockDispatchData = [
  {
    id: 1,
    city: "杭州分公司",
    riskType: "空壳企业风险,企业失信风险",
    riskFindTime: "2025-11-14 00:40:47",
    riskModel: "信用评级(300)",
    bizCode: "ZJ20240422391820",
    bizName: "杭州市余杭区党政机关系统深化信创(2024年第...",
    projectCode: "XYJAZJHAA241101387",
    projectName: "杭州市余杭区党政机关系统深化...",
    projectAmount: 5445600,
    isDispatched: "是",
    dispatchTime: "2025-12-01 10:30:00",
    currentLink: "省业务复核",
    currentHandler: "郦文",
    // 新增字段
    riskAccumulateDuration: "15天3小时",
    isConfirmedRisk: "是",
    isRectified: "否",
    riskDescription: "企业无自有能力风险，疑似虚假贸易",
    handlingOpinion: "待核实后决定是否终止项目",
    isTerminateProject: "否",
    isNetIncome: "否",
  },
  {
    id: 2,
    city: "浙江实业公司",
    riskType: "前后向关联风险,其他",
    riskFindTime: "2025-11-14 00:40:47",
    riskModel: "空转走单(50)",
    bizCode: "JT20241107672281",
    bizName: "国家体育总局体育信息中心大型...",
    projectCode: "XYJAZJXCA250100002",
    projectName: "国家体育总局体育信息中心大型...",
    projectAmount: 1490000,
    isDispatched: "是",
    dispatchTime: "2025-11-20 14:00:00",
    currentLink: "地市政企处理",
    currentHandler: "余娅",
    // 新增字段
    riskAccumulateDuration: "7天5小时",
    isConfirmedRisk: "是",
    isRectified: "是",
    riskDescription: "前后向关联风险，需核实供应链",
    handlingOpinion: "已完成整改，等待复核",
    isTerminateProject: "否",
    isNetIncome: "是",
  },
  {
    id: 3,
    city: "宁波分公司",
    riskType: "空壳企业风险,企业...",
    riskFindTime: "2025-11-10 17:01:52",
    riskModel: "信用评级(300)",
    bizCode: "ZJ20250819241151",
    bizName: "龙元建设集团股份有限公司监控等智能化改造...",
    projectCode: "XYJAZJNBA250800598",
    projectName: "龙元建设集团股份有限公司监控...",
    projectAmount: 227300,
    isDispatched: "是",
    dispatchTime: "2026-01-05 09:00:00",
    currentLink: "地市财务处理",
    currentHandler: "张明",
    // 新增字段
    riskAccumulateDuration: "3天8小时",
    isConfirmedRisk: "否",
    isRectified: "待确认",
    riskDescription: "企业信用评级较低，需进一步核查",
    handlingOpinion: "继续观察",
    isTerminateProject: "否",
    isNetIncome: "否",
  },
  {
    id: 4,
    city: "湖州分公司",
    riskType: "企业失信风险,现金...",
    riskFindTime: "2025-11-14 00:40:47",
    riskModel: "融资贸易(150)",
    bizCode: "ZJ20230922864773",
    bizName: "南太湖新区管委会污染源(废气)监管项目",
    projectCode: "XYJAZJHZB240500058",
    projectName: "湖州大享玻璃制品有限公司在线...",
    projectAmount: 19000,
    isDispatched: "是",
    dispatchTime: "2026-01-10 11:20:00",
    currentLink: "已归档",
    currentHandler: "李华",
    // 新增字段
    riskAccumulateDuration: "20天0小时",
    isConfirmedRisk: "是",
    isRectified: "是",
    riskDescription: "融资贸易风险，已完成整改",
    handlingOpinion: "已归档处理",
    isTerminateProject: "是",
    isNetIncome: "是",
  },
  {
    id: 5,
    city: "金华分公司",
    riskType: "企业失信风险",
    riskFindTime: "2025-11-10 17:02:14",
    riskModel: "信用评级(300)",
    bizCode: "ZJ20250626713622",
    bizName: "2025年6月融兴建设集团有限公司新增监控",
    projectCode: "XYJAZJJHA250600559",
    projectName: "磐安电信2025年融兴建设集团...",
    projectAmount: 8800,
    isDispatched: "否",
    dispatchTime: "-",
    currentLink: "-",
    currentHandler: "-",
    // 新增字段
    riskAccumulateDuration: "-",
    isConfirmedRisk: "待确认",
    isRectified: "待确认",
    riskDescription: "-",
    handlingOpinion: "-",
    isTerminateProject: "待确认",
    isNetIncome: "待确认",
  },
];

// 模拟数据 - 疑似风险项目清单
const mockRiskProjectData = [
  {
    id: 1,
    city: "杭州分",
    district: "杭州萧",
    bizName: "2025杭州天元涤纶有限公司环保监控",
    bizCode: "ZJ20241216432909",
    projectName: "杭州天元涤纶有限公司环保监控项目",
    projectCode: "XYJAZJHAA241201976",
    projectType: "网络资源型",
    projectManager: "孔秀萍",
    signDate: "-",
    contractName: "杭州天元涤纶有限公司监控合同",
    signAmount: 13100,
    riskScore: 300,
    firstFindTime: "2025-06-24 21:48:06",
    lastFindTime: "2025-11-10 16:42:59",
    riskType: "企业失信风险,空壳企业风险",
    isDispatched: "是",
  },
  {
    id: 2,
    city: "温州分",
    district: "温州南",
    bizName: "某政府机关安防系统",
    bizCode: "ZJ20241101442189",
    projectName: "温州某区政府安防监控系统",
    projectCode: "XYJAZJWZA241001234",
    projectType: "成本类",
    projectManager: "卞小红",
    signDate: "-",
    contractName: "温州某区政府人脸识别合同",
    signAmount: 14610,
    riskScore: 200,
    firstFindTime: "2025-07-15 10:20:30",
    lastFindTime: "2025-11-12 08:15:22",
    riskType: "前后向关联风险",
    isDispatched: "是",
  },
  {
    id: 3,
    city: "宁波分",
    district: "宁波北",
    bizName: "宁波某高校智慧校园建设项目",
    bizCode: "ZJ20250318762345",
    projectName: "宁波某高校智慧校园一期工程",
    projectCode: "XYJAZJNBA250300123",
    projectType: "网络资源型",
    projectManager: "陈建国",
    signDate: "2025-03-15",
    contractName: "宁波某高校智慧校园建设合同",
    signAmount: 8500,
    riskScore: 150,
    firstFindTime: "2025-04-10 14:30:00",
    lastFindTime: "2025-05-20 09:15:00",
    riskType: "空壳企业风险",
    isDispatched: "否",
  },
  {
    id: 4,
    city: "金华分",
    district: "金华婺",
    bizName: "金华某医院信息化系统升级",
    bizCode: "ZJ20250226654821",
    projectName: "金华某医院信息化升级项目",
    projectCode: "XYJAZJJHA250200456",
    projectType: "成本类",
    projectManager: "刘晓红",
    signDate: "2025-02-28",
    contractName: "金华某医院信息化系统采购合同",
    signAmount: 5200,
    riskScore: 180,
    firstFindTime: "2025-03-05 16:20:00",
    lastFindTime: "2025-04-18 11:40:00",
    riskType: "企业失信风险,前后向关联风险",
    isDispatched: "否",
  },
  {
    id: 5,
    city: "绍兴分",
    district: "绍兴越",
    bizName: "绍兴某制造企业智能化改造",
    bizCode: "ZJ20250111345289",
    projectName: "绍兴某制造企业智能化改造项目",
    projectCode: "XYJAZJSXA250100789",
    projectType: "网络资源型",
    projectManager: "王建平",
    signDate: "2025-01-20",
    contractName: "绍兴某制造企业智能化改造合同",
    signAmount: 3600,
    riskScore: 220,
    firstFindTime: "2025-02-01 08:00:00",
    lastFindTime: "2025-03-10 15:30:00",
    riskType: "空壳企业风险,融资贸易风险",
    isDispatched: "是",
  },
];

type TabType = "all" | "todo" | "done" | "riskProject";

// 表头配置（标签中只允许一个换行符，用 \n 分隔）
const tableColumns = [
  { key: "city", label: "地市", width: 100 },
  { key: "riskType", label: "风险类型", width: 160 },
  { key: "riskFindTime", label: "风险发现时间", width: 150 },
  { key: "riskModel", label: "风险模型", width: 120 },
  { key: "bizCode", label: "商机编码/商情编码", width: 160 },
  { key: "bizName", label: "商机名称/商情名称", width: 200 },
  { key: "projectCode", label: "项目编码", width: 160 },
  { key: "projectName", label: "项目名称", width: 200 },
  { key: "projectAmount", label: "项目金额", width: 120 },
  { key: "isDispatched", label: "是否已派单", width: 100 },
  { key: "dispatchTime", label: "派单时间", width: 150 },
  { key: "currentLink", label: "当前环节", width: 120 },
  { key: "currentHandler", label: "当前处理人", width: 100 },
  // 新增字段
  { key: "riskAccumulateDuration", label: "风险累积处理时长", width: 128 },
  { key: "isConfirmedRisk", label: "是否确认为风险", width: 112 },
  { key: "isRectified", label: "风险是否已整改", width: 112 },
  { key: "riskDescription", label: "风险说明", width: 200 },
  { key: "handlingOpinion", label: "处理意见", width: 200 },
  { key: "isTerminateProject", label: "是否终止或取消项目", width: 128 },
  { key: "isNetIncome", label: "是否净额列收", width: 112 },
];

export default function RiskManagement() {
  // Tab状态
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [showAllConditions, setShowAllConditions] = useState(false);

  // 查询条件 - 风险派单
  const [city, setCity] = useState("");
  const [riskType, setRiskType] = useState("");
  const [riskFindTimeStart, setRiskFindTimeStart] = useState("");
  const [riskFindTimeEnd, setRiskFindTimeEnd] = useState("");
  const [bizCode, setBizCode] = useState("");
  const [projectCode, setProjectCode] = useState("");
  const [isDispatched, setIsDispatched] = useState("");
  const [riskScore, setRiskScore] = useState("");
  const [dispatchTimeStart, setDispatchTimeStart] = useState("");
  const [dispatchTimeEnd, setDispatchTimeEnd] = useState("");
  const [currentHandler, setCurrentHandler] = useState("");
  const [isConfirmedRisk, setIsConfirmedRisk] = useState("");
  const [isRectified, setIsRectified] = useState("");
  const [currentLink, setCurrentLink] = useState("");

  // 查询条件 - 疑似风险项目清单
  const [riskScoreMin, setRiskScoreMin] = useState("");
  const [riskScoreMax, setRiskScoreMax] = useState("");
  const [isGeneratedDispatch, setIsGeneratedDispatch] = useState("");
  const [projectName, setProjectName] = useState("");

  // 弹窗状态
  const [dispatchDialogOpen, setDispatchDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [flowTrackDialogOpen, setFlowTrackDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  // 分页
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 选中行
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const tabs = [
    { id: "all", label: "全部风险派单" },
    { id: "todo", label: "待办风险派单" },
    { id: "done", label: "已办风险派单" },
    { id: "riskProject", label: "疑似风险项目清单" },
  ];

  const handleQuery = () => {
    setCurrentPage(1);
    console.log("查询条件:", { city, riskType, riskFindTimeStart, riskFindTimeEnd, bizCode, projectCode, isDispatched, riskScore, dispatchTimeStart, dispatchTimeEnd, currentHandler, isConfirmedRisk, isRectified, currentLink });
  };

  const handleReset = () => {
    setCity("");
    setRiskType("");
    setRiskFindTimeStart("");
    setRiskFindTimeEnd("");
    setBizCode("");
    setProjectCode("");
    setIsDispatched("");
    setRiskScore("");
    setDispatchTimeStart("");
    setDispatchTimeEnd("");
    setCurrentHandler("");
    setIsConfirmedRisk("");
    setIsRectified("");
    setCurrentLink("");
    setRiskScoreMin("");
    setRiskScoreMax("");
    setIsGeneratedDispatch("");
    setProjectName("");
    setCurrentPage(1);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(currentData.map(d => d.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    }
  };

  const handleDispatch = (row: any) => {
    setSelectedRow(row);
    setDispatchDialogOpen(true);
  };

  const handleDetail = (row: any) => {
    setSelectedRow(row);
    setDetailDialogOpen(true);
  };

  const handleRecord = (row: any) => {
    setSelectedRow(row);
    setRecordDialogOpen(true);
  };

  const handleFlowTrack = (row: any) => {
    setSelectedRow(row);
    setFlowTrackDialogOpen(true);
  };

  // 获取状态标签样式
  const getStatusVariant = (status: string): "success" | "warning" | "neutral" => {
    if (status === "是") return "success";
    if (status === "否") return "neutral";
    if (status === "待确认" || status === "待核实") return "warning";
    return "neutral";
  };

  // 计算表格总宽度
  const totalTableWidth = tableColumns.reduce((sum, col) => sum + col.width, 0) + 200; // 200 = 复选框 + 序号 + 操作列

  // 根据Tab过滤数据
  const getFilteredData = () => {
    switch (activeTab) {
      case "todo":
        return mockDispatchData.filter(item => item.isDispatched === "否");
      case "done":
        return mockDispatchData.filter(item => item.isDispatched === "是");
      case "riskProject":
        return mockRiskProjectData;
      default:
        return mockDispatchData;
    }
  };

  const currentData = getFilteredData();

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 标题区 */}
      <div className="px-6 pt-6 pb-4 flex-shrink-0">
        <h2 className="text-lg font-medium text-gray-900">风险管理</h2>
        <p className="text-sm text-gray-500 mt-1">风险派单查询与管理</p>
      </div>

      {/* Tab 切换 */}
      <div className="px-6 flex-shrink-0 relative z-10">
        <TabNav
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          style="pill"
        />
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        {activeTab !== "riskProject" ? (
          <div className="mt-4 space-y-4">
            {/* 查询条件卡片 */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">地市</label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hangzhou">杭州</SelectItem>
                      <SelectItem value="ningbo">宁波</SelectItem>
                      <SelectItem value="wenzhou">温州</SelectItem>
                      <SelectItem value="jinhua">金华</SelectItem>
                      <SelectItem value="huzhou">湖州</SelectItem>
                      <SelectItem value="shaoxing">绍兴</SelectItem>
                      <SelectItem value="taizhou">台州</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">风险类型</label>
                  <Select value={riskType} onValueChange={setRiskType}>
                    <SelectTrigger><SelectValue placeholder="请选择风险类型" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit">信用评级</SelectItem>
                      <SelectItem value="shell">空壳企业风险</SelectItem>
                      <SelectItem value="credit-loss">企业失信风险</SelectItem>
                      <SelectItem value="relation">前后向关联风险</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">风险发现时间</label>
                  <div className="flex gap-2">
                    <Input type="date" value={riskFindTimeStart} onChange={e => setRiskFindTimeStart(e.target.value)} />
                    <span className="self-center text-gray-400">-</span>
                    <Input type="date" value={riskFindTimeEnd} onChange={e => setRiskFindTimeEnd(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">商机/商情编码</label>
                  <Input placeholder="请输入" value={bizCode} onChange={e => setBizCode(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">项目编码</label>
                  <Input placeholder="请输入" value={projectCode} onChange={e => setProjectCode(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">是否派单</label>
                  <Select value={isDispatched} onValueChange={setIsDispatched}>
                    <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">是</SelectItem>
                      <SelectItem value="no">否</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">风险分值</label>
                  <Input placeholder="请输入" value={riskScore} onChange={e => setRiskScore(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">派单时间</label>
                  <div className="flex gap-2">
                    <Input type="date" value={dispatchTimeStart} onChange={e => setDispatchTimeStart(e.target.value)} />
                    <span className="self-center text-gray-400">-</span>
                    <Input type="date" value={dispatchTimeEnd} onChange={e => setDispatchTimeEnd(e.target.value)} />
                  </div>
                </div>
              </div>

              {showAllConditions && (
                <div className="grid grid-cols-4 gap-x-6 gap-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">当前处理人</label>
                    <Select value={currentHandler} onValueChange={setCurrentHandler}>
                      <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="li">郦文</SelectItem>
                        <SelectItem value="yu">余娅</SelectItem>
                        <SelectItem value="zhang">张明</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">是否确认为风险</label>
                    <Select value={isConfirmedRisk} onValueChange={setIsConfirmedRisk}>
                      <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">是</SelectItem>
                        <SelectItem value="no">否</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">风险是否已整改</label>
                    <Select value={isRectified} onValueChange={setIsRectified}>
                      <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">是</SelectItem>
                        <SelectItem value="no">否</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">当前环节</label>
                    <Select value={currentLink} onValueChange={setCurrentLink}>
                      <SelectTrigger><SelectValue placeholder="请选择当前环节" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dispatch">省业务派单</SelectItem>
                        <SelectItem value="city-biz">地市政企处理</SelectItem>
                        <SelectItem value="city-finance">地市财务处理</SelectItem>
                        <SelectItem value="province-review">省业务复核</SelectItem>
                        <SelectItem value="archived">已归档</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setShowAllConditions(!showAllConditions)}
                  className="text-blue-600 p-0"
                >
                  {showAllConditions ? "收起更多条件" : "展开更多条件"}
                </Button>
                <div className="flex gap-2">
                  <Button onClick={handleQuery}>
                    <Search className="w-4 h-4 mr-1" />
                    查询
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    <RefreshCw className="w-4 h-4 mr-1" />
                    重置
                  </Button>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            {activeTab === "all" && (
              <div className="flex items-center gap-2">
                <Button variant="warning" disabled={selectedRows.length === 0}>
                  <Upload className="w-3.5 h-3.5 mr-1" />
                  批量派单
                </Button>
                <Button variant="outline" className="h-8 px-4">
                  <Download className="w-3.5 h-3.5 mr-1" />
                  导出
                </Button>
                <Button variant="outline" className="h-8 px-4">
                  <FileDown className="w-3.5 h-3.5 mr-1" />
                  任务下载列表
                </Button>
              </div>
            )}

            {/* 表格 */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="divide-y divide-gray-200" style={{ tableLayout: 'fixed', minWidth: `${totalTableWidth}px` }}>
                  <thead className="bg-gray-50">
                    <tr>
                      {/* 复选框 */}
                      <th className="px-3 py-3 text-center text-sm font-medium text-gray-700 sticky left-0 bg-gray-50 z-20" style={{ width: 50, minWidth: 50 }}>
                        <Checkbox checked={selectedRows.length === currentData.length} onCheckedChange={handleSelectAll} />
                      </th>
                      {/* 序号 */}
                      <th className="px-3 py-3 text-center text-sm font-medium text-gray-700 sticky left-[50px] bg-gray-50 z-20" style={{ width: 60, minWidth: 60 }}>
                        序号
                      </th>
                      {/* 动态表头 */}
                      {tableColumns.map((col) => (
                          <th
                            key={col.key}
                            className="px-3 py-3 text-center text-sm font-medium text-gray-700"
                            style={{ width: col.width, minWidth: col.width }}
                          >
                            <span className={col.label.includes('\n') ? 'whitespace-pre-line' : ''}>{col.label}</span>
                          </th>
                        ))}
                      {/* 操作列 - 固定在最右侧 */}
                      <th className="px-3 py-3 text-center text-sm font-medium text-gray-700 sticky right-0 bg-gray-50 z-20" style={{ width: 140, minWidth: 140 }}>
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.map((row, index) => (
                      <tr key={row.id} className="hover:bg-gray-50">
                        {/* 复选框 */}
                        <td className="px-3 py-3 text-center sticky left-0 bg-white z-10" style={{ width: 50, minWidth: 50 }}>
                          <Checkbox checked={selectedRows.includes(row.id)} onCheckedChange={(checked) => handleSelectRow(row.id, checked as boolean)} />
                        </td>
                        {/* 序号 */}
                        <td className="px-3 py-3 text-sm text-gray-600 text-center sticky left-[50px] bg-white z-10" style={{ width: 60, minWidth: 60 }}>
                          {index + 1}
                        </td>
                        {/* 动态列 */}
                        <td className="px-3 py-3 text-sm text-gray-600" style={{ width: 100 }}>{row.city}</td>
                        <td className="px-3 py-3 text-sm text-gray-600" style={{ width: 140 }}>{row.riskType}</td>
                        <td className="px-3 py-3 text-sm text-gray-600" style={{ width: 150 }}>{row.riskFindTime}</td>
                        <td className="px-3 py-3 text-sm text-gray-600" style={{ width: 120 }}>{row.riskModel}</td>
                        <td className="px-3 py-3 text-sm text-gray-600" style={{ width: 160 }}>{row.bizCode}</td>
                        <td className="px-3 py-3 text-sm text-gray-600 truncate" style={{ width: 200 }} title={row.bizName}>{row.bizName}</td>
                        <td className="px-3 py-3 text-sm text-gray-600" style={{ width: 150 }}>{row.projectCode}</td>
                        <td className="px-3 py-3 text-sm text-gray-600 truncate" style={{ width: 200 }} title={row.projectName}>{row.projectName}</td>
                        <td className="px-3 py-3 text-sm text-gray-600 text-right" style={{ width: 120 }}>{row.projectAmount.toLocaleString()}</td>
                        <td className="px-3 py-3 text-sm text-center" style={{ width: 100 }}>
                          <StatusBadge label={row.isDispatched} variant={getStatusVariant(row.isDispatched)} />
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-600" style={{ width: 150 }}>{row.dispatchTime}</td>
                        <td className="px-3 py-3 text-sm text-gray-600" style={{ width: 120 }}>{row.currentLink}</td>
                        <td className="px-3 py-3 text-sm text-gray-600" style={{ width: 100 }}>{row.currentHandler}</td>
                        {/* 新增字段 */}
                        <td className="px-3 py-3 text-sm text-gray-600 text-center" style={{ width: 120 }}>{row.riskAccumulateDuration}</td>
                        <td className="px-3 py-3 text-sm text-center" style={{ width: 100 }}>
                          <StatusBadge label={row.isConfirmedRisk} variant={getStatusVariant(row.isConfirmedRisk)} />
                        </td>
                        <td className="px-3 py-3 text-sm text-center" style={{ width: 100 }}>
                          <StatusBadge label={row.isRectified} variant={getStatusVariant(row.isRectified)} />
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-600 truncate" style={{ width: 180 }} title={row.riskDescription}>{row.riskDescription}</td>
                        <td className="px-3 py-3 text-sm text-gray-600 truncate" style={{ width: 180 }} title={row.handlingOpinion}>{row.handlingOpinion}</td>
                        <td className="px-3 py-3 text-sm text-center" style={{ width: 110 }}>
                          <StatusBadge label={row.isTerminateProject} variant={getStatusVariant(row.isTerminateProject)} />
                        </td>
                        <td className="px-3 py-3 text-sm text-center" style={{ width: 110 }}>
                          <StatusBadge label={row.isNetIncome} variant={getStatusVariant(row.isNetIncome)} />
                        </td>
                        {/* 操作列 - 固定在最右侧 */}
                        <td className="px-3 py-3 text-sm text-center sticky right-0 bg-white z-10" style={{ width: 140 }}>
                          <div className="flex items-center justify-center gap-2 text-sm">
                            {row.isDispatched === "否" ? (
                              <button onClick={() => handleDispatch(row)} className="text-blue-500 hover:text-blue-700 whitespace-nowrap text-sm">派单</button>
                            ) : null}
                            <button onClick={() => handleDetail(row)} className="text-blue-500 hover:text-blue-700 whitespace-nowrap text-sm">风险详情</button>
                            {row.isDispatched === "是" && (
                              <button onClick={() => handleFlowTrack(row)} className="text-blue-500 hover:text-blue-700 whitespace-nowrap text-sm">过程详情</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 分页 */}
              <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-end">
                <Pagination
                  current={currentPage}
                  total={currentData.length}
                  pageSize={pageSize}
                  onChange={(page, size) => { setCurrentPage(page); setPageSize(size); }}
                  showQuickJumper={false}
                />
              </div>
            </div>
          </div>
        ) : (
          /* 疑似风险项目清单 Tab */
          <div className="mt-4 space-y-4">
            {/* 查询条件卡片 */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">地市</label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hangzhou">杭州</SelectItem>
                      <SelectItem value="ningbo">宁波</SelectItem>
                      <SelectItem value="wenzhou">温州</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">风险类型</label>
                  <Select value={riskType} onValueChange={setRiskType}>
                    <SelectTrigger><SelectValue placeholder="请选择风险类型" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit">信用评级</SelectItem>
                      <SelectItem value="shell">空壳企业风险</SelectItem>
                      <SelectItem value="credit-loss">企业失信风险</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">风险发现时间</label>
                  <div className="flex gap-2">
                    <Input type="date" value={riskFindTimeStart} onChange={e => setRiskFindTimeStart(e.target.value)} />
                    <span className="self-center text-gray-400">-</span>
                    <Input type="date" value={riskFindTimeEnd} onChange={e => setRiskFindTimeEnd(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">商机/商情编码</label>
                  <Input placeholder="请输入" value={bizCode} onChange={e => setBizCode(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">项目编码</label>
                  <Input placeholder="请输入" value={projectCode} onChange={e => setProjectCode(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">风险分值</label>
                  <div className="flex gap-2">
                    <Input placeholder="最小值" value={riskScoreMin} onChange={e => setRiskScoreMin(e.target.value)} />
                    <span className="self-center text-gray-400">-</span>
                    <Input placeholder="最大值" value={riskScoreMax} onChange={e => setRiskScoreMax(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">是否生成派单</label>
                  <Select value={isGeneratedDispatch} onValueChange={setIsGeneratedDispatch}>
                    <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">是</SelectItem>
                      <SelectItem value="no">否</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">项目名称</label>
                  <Input placeholder="请输入" value={projectName} onChange={e => setProjectName(e.target.value)} />
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-2">
                  <Button onClick={handleQuery}>
                    <Search className="w-4 h-4 mr-1" />
                    查询
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    <RefreshCw className="w-4 h-4 mr-1" />
                    重置
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="h-8 px-4">
                    <Download className="w-3.5 h-3.5 mr-1" />
                    导出
                  </Button>
                  <Button variant="warning" disabled={selectedRows.length === 0}>
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    批量生成
                  </Button>
                </div>
              </div>
            </div>

            {/* 表格 */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-center text-sm font-medium text-gray-700" style={{ width: 50, minWidth: 50 }}>
                        <Checkbox checked={activeTab === "riskProject" && selectedRows.length === mockRiskProjectData.length} onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedRows(mockRiskProjectData.map(d => d.id));
                      } else {
                        setSelectedRows([]);
                      }
                    }} />
                      </th>
                      <th className="px-3 py-3 text-center text-sm font-medium text-gray-700" style={{ width: 60, minWidth: 60 }}>序号</th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-700" style={{ width: 80, minWidth: 80 }}>地市</th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-700" style={{ width: 80, minWidth: 80 }}>区县</th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-700" style={{ width: 180, minWidth: 180 }}>商机名称/商情名称</th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-700" style={{ width: 160, minWidth: 160 }}>商机编码/商情编码</th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-700" style={{ width: 180, minWidth: 180 }}>项目名称</th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-700" style={{ width: 150, minWidth: 150 }}>项目编码</th>
                      <th className="px-3 py-3 text-center text-sm font-medium text-gray-700" style={{ width: 90, minWidth: 90 }}>项目类型</th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-700" style={{ width: 100, minWidth: 100 }}>项目经理</th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-700" style={{ width: 100, minWidth: 100 }}>立项时间</th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-700" style={{ width: 160, minWidth: 160 }}>收入合同名称</th>
                      <th className="px-3 py-3 text-right text-sm font-medium text-gray-700" style={{ width: 120, minWidth: 120 }}>签约金额(万元)</th>
                      <th className="px-3 py-3 text-center text-sm font-medium text-gray-700" style={{ width: 100, minWidth: 100 }}>风险总分值</th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-700" style={{ width: 160, minWidth: 160 }}>风险发现时间</th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-700" style={{ width: 140, minWidth: 140 }}>风险类型</th>
                      <th className="px-3 py-3 text-center text-sm font-medium text-gray-700" style={{ width: 100, minWidth: 100 }}>是否生成派单</th>
                      <th className="px-3 py-3 text-center text-sm font-medium text-gray-700 sticky right-0 bg-gray-50 z-10" style={{ width: 80, minWidth: 80 }}>操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.map((row, index) => (
                      <tr key={row.id} className="hover:bg-gray-50">
                        <td className="px-3 py-3 text-center">
                          <Checkbox checked={selectedRows.includes(row.id)} onCheckedChange={(checked) => handleSelectRow(row.id, checked as boolean)} />
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-600 text-center">{index + 1}</td>
                        <td className="px-3 py-3 text-sm text-gray-600">{row.city}</td>
                        <td className="px-3 py-3 text-sm text-gray-600">{row.district}</td>
                        <td className="px-3 py-3 text-sm text-gray-600 truncate max-w-[180px]" title={row.bizName}>{row.bizName}</td>
                        <td className="px-3 py-3 text-sm text-gray-600">{row.bizCode}</td>
                        <td className="px-3 py-3 text-sm text-gray-600 truncate max-w-[180px]" title={row.projectName}>{row.projectName}</td>
                        <td className="px-3 py-3 text-sm text-gray-600">{row.projectCode}</td>
                        <td className="px-3 py-3 text-sm text-gray-600 text-center">{row.projectType}</td>
                        <td className="px-3 py-3 text-sm text-gray-600">{row.projectManager}</td>
                        <td className="px-3 py-3 text-sm text-gray-600">{row.signDate}</td>
                        <td className="px-3 py-3 text-sm text-gray-600 truncate max-w-[150px]" title={row.contractName}>{row.contractName}</td>
                        <td className="px-3 py-3 text-sm text-gray-600 text-right">{row.signAmount.toLocaleString()}</td>
                        <td className="px-3 py-3 text-sm text-gray-600 text-center">{row.riskScore}</td>
                        <td className="px-3 py-3 text-sm text-gray-600">{row.firstFindTime}</td>
                        <td className="px-3 py-3 text-sm text-gray-600">{row.riskType}</td>
                        <td className="px-3 py-3 text-sm text-center">
                          <button
                            onClick={() => row.isDispatched === "是" && setActiveTab("todo")}
                            className={row.isDispatched === "是" ? "cursor-pointer" : ""}
                          >
                            <Badge variant={row.isDispatched === "是" ? "success" : "secondary"} className="cursor-pointer">{row.isDispatched}</Badge>
                          </button>
                        </td>
                        <td className="px-3 py-3 text-sm text-center sticky right-0 bg-white z-10">
                          {row.isDispatched === "否" ? (
                            <button onClick={() => handleDispatch(row)} className="text-blue-500 hover:text-blue-700 text-sm whitespace-nowrap">派单</button>
                          ) : (
                            <button onClick={() => handleRecord(row)} className="text-blue-500 hover:text-blue-700 text-sm">查看</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 分页 */}
              <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-end">
                <Pagination
                  current={currentPage}
                  total={currentData.length}
                  pageSize={pageSize}
                  onChange={(page, size) => { setCurrentPage(page); setPageSize(size); }}
                  showQuickJumper={false}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 弹窗 */}
      {selectedRow && (
        <>
          <RiskDispatchDialog open={dispatchDialogOpen} onClose={() => setDispatchDialogOpen(false)} rowData={selectedRow} />
          <RiskDetailDialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} rowData={selectedRow} onFlowTrack={() => { setDetailDialogOpen(false); setFlowTrackDialogOpen(true); }} />
          <RiskRecordDialog open={recordDialogOpen} onClose={() => setRecordDialogOpen(false)} rowData={selectedRow} />
          <FlowTrackDialog open={flowTrackDialogOpen} onClose={() => setFlowTrackDialogOpen(false)} rowData={selectedRow} />
        </>
      )}
    </div>
  );
}