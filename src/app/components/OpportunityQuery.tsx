import React, { useState, useCallback, useEffect } from "react";
import {
  Search, RefreshCw, Download, Plus, X, ChevronDown, FileText, BarChart3, DollarSign
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";

interface Opportunity {
  id: string;
  oppName: string;
  stage: string;
  provinceCode: string;
  groupCode: string;
  receiveDate: string;
  modifyDate: string;
  customerId: string;
  customerName: string;
  city: string;
  district: string;
  bu: string;
  customerIndustry: string;
  controlDept: string;
  contractName: string;
  contractCode: string;
  contractAmount: string;
  projectName: string;
  projectCode: string;
  status: string;
  isTeamFormed: string;
  amount: number;
  myScore: string;
  scoreDistRate: string;
  groupCustomerCode: string;
  source: string;
  customerManager: string;
  followed: boolean;
}

const mockOpportunities: Opportunity[] = [
  {
    id: "1",
    oppName: "中国邮政速递物流股份有限公司台州市分公司ICT项目",
    stage: "商机录入",
    provinceCode: "20260428TZ84",
    groupCode: "-",
    receiveDate: "2026-04-28 18:13:08",
    modifyDate: "2026-04-28 18:13:09",
    customerId: "ZJ2019060400004795",
    customerName: "中国邮政速递物流股份有限公司台州市分公司",
    city: "台州分公司",
    district: "台州政企客户部",
    bu: "交通物流",
    customerIndustry: "未知",
    controlDept: "其他部门",
    contractName: "-",
    contractCode: "-",
    contractAmount: "-",
    projectName: "-",
    projectCode: "-",
    status: "跟进中",
    isTeamFormed: "否",
    amount: 15,
    myScore: "-",
    scoreDistRate: "-",
    groupCustomerCode: "332210316000004046",
    source: "线索转商机",
    customerManager: "洪婷婷/W1238405@ZJ",
    followed: false
  },
  {
    id: "2",
    oppName: "中国美术学院校园算力项目",
    stage: "商机录入",
    provinceCode: "20260428HZ01",
    groupCode: "-",
    receiveDate: "2026-04-28 17:30:00",
    modifyDate: "2026-04-28 17:35:00",
    customerId: "ZJ2020010100001234",
    customerName: "中国美术学院",
    city: "杭州分公司",
    district: "杭州政企客户部",
    bu: "教育行业",
    customerIndustry: "教育行业",
    controlDept: "教育行业拓展部",
    contractName: "-",
    contractCode: "-",
    contractAmount: "-",
    projectName: "-",
    projectCode: "-",
    status: "跟进中",
    isTeamFormed: "否",
    amount: 200,
    myScore: "-",
    scoreDistRate: "-",
    groupCustomerCode: "331100320000000234",
    source: "线索转商机",
    customerManager: "张明/ZM12345@ZJ",
    followed: false
  },
  {
    id: "3",
    oppName: "宁波港数字化转型ICT项目",
    stage: "商机挖掘",
    provinceCode: "20260428NB25",
    groupCode: "-",
    receiveDate: "2026-04-27 10:00:00",
    modifyDate: "2026-04-27 10:30:00",
    customerId: "ZJ2019051500001234",
    customerName: "宁波港集团有限公司",
    city: "宁波分公司",
    district: "宁波政企客户部",
    bu: "交通物流",
    customerIndustry: "交通物流",
    controlDept: "交通物流拓展部",
    contractName: "-",
    contractCode: "-",
    contractAmount: "-",
    projectName: "-",
    projectCode: "-",
    status: "跟进中",
    isTeamFormed: "否",
    amount: 500,
    myScore: "-",
    scoreDistRate: "-",
    groupCustomerCode: "331200220000001234",
    source: "主动挖掘",
    customerManager: "李华/LH56789@ZJ",
    followed: true
  }
];

const functionMenuItems = [
  { id: "matching", label: "前后向匹配", icon: <FileText className="w-4 h-4" /> },
  { id: "progress", label: "形象进度管理", icon: <BarChart3 className="w-4 h-4" /> },
  { id: "payment", label: "合同收付款确认", icon: <DollarSign className="w-4 h-4" /> }
];

const viewTabs = [
  { id: "list", label: "我发起的商机" },
  { id: "card", label: "我管理的商机" },
  { id: "card", label: "我支撑的商机" },
  { id: "card", label: "我管理人员所支撑的商机" },
  { id: "card", label: "我关注的商机" },
];

const statusTabs = ["全部", "跟进中", "推进中", "已转化", "已关闭"];

const defaultColumnWidths = {
  select: 40,
  oppName: 256,
  stage: 96,
  provinceCode: 144,
  groupCode: 144,
  receiveDate: 144,
  modifyDate: 144,
  customerId: 144,
  customerName: 256,
  city: 96,
  district: 128,
  bu: 96,
  customerIndustry: 96,
  controlDept: 128,
  contractName: 192,
  contractCode: 128,
  contractAmount: 112,
  projectName: 192,
  projectCode: 128,
  status: 96,
  isTeamFormed: 96,
  amount: 112,
  myScore: 80,
  scoreDistRate: 112,
  groupCustomerCode: 128,
  source: 96,
  customerManager: 144,
  actions: 80
};

export function OpportunityQuery({ onRowClick }: { onRowClick?: (id: string) => void }) {
  const [activeViewTab, setActiveViewTab] = useState("list");
  const [activeStatusTab, setActiveStatusTab] = useState("全部");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const [columnWidths, setColumnWidths] = useState(defaultColumnWidths);
  const [resizing, setResizing] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);

  const [createDateStart, setCreateDateStart] = useState("");
  const [createDateEnd, setCreateDateEnd] = useState("");
  const [amountMin, setAmountMin] = useState("");
  const [amountMax, setAmountMax] = useState("");
  const [contractAmountMin, setContractAmountMin] = useState("");
  const [contractAmountMax, setContractAmountMax] = useState("");
  const [oppName, setOppName] = useState("");
  const [oppCode, setOppCode] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectCode, setProjectCode] = useState("");
  const [contractName, setContractName] = useState("");
  const [contractCode, setContractCode] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerCode, setCustomerCode] = useState("");

  const opportunities = mockOpportunities;

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedRows(new Set(opportunities.map(o => o.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
    setSelectAll(newSelected.size === opportunities.length);
  };

  const handleFollow = (id: string) => {
    console.log("关注商机:", id);
  };

  const handleQuery = () => {
    console.log("查询商机");
  };

  const handleReset = () => {
    setCreateDateStart("");
    setCreateDateEnd("");
    setAmountMin("");
    setAmountMax("");
    setContractAmountMin("");
    setContractAmountMax("");
    setOppName("");
    setOppCode("");
    setProjectName("");
    setProjectCode("");
    setContractName("");
    setContractCode("");
    setCustomerName("");
    setCustomerCode("");
    setSelectedRows(new Set());
    setSelectAll(false);
  };

  const handleResizeStart = (e: React.MouseEvent, columnId: string, startWidth: number) => {
    e.preventDefault();
    e.stopPropagation();
    setResizing(columnId);
    setResizeStartX(e.clientX);
    setResizeStartWidth(startWidth);
  };

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!resizing) return;
    const diff = e.clientX - resizeStartX;
    const newWidth = Math.max(50, resizeStartWidth + diff);
    setColumnWidths(prev => ({ ...prev, [resizing]: newWidth }));
  }, [resizing, resizeStartX, resizeStartWidth]);

  const handleResizeEnd = useCallback(() => {
    setResizing(null);
  }, []);

  useEffect(() => {
    if (resizing) {
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
      return () => {
        window.removeEventListener('mousemove', handleResizeMove);
        window.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [resizing, handleResizeMove, handleResizeEnd]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      "跟进中": "bg-blue-50 text-blue-600 border-blue-300",
      "推进中": "bg-blue-50 text-blue-600 border-blue-300",
      "已转化": "bg-green-50 text-green-600 border-green-300",
      "已关闭": "bg-gray-100 text-gray-600 border-gray-300"
    };
    return <Badge className={variants[status] || "bg-gray-50 text-gray-600 border-gray-300"}>{status}</Badge>;
  };

  const getIctBadge = (name: string) => {
    if (name.toLowerCase().includes("ict")) {
      return <Badge className="bg-orange-50 text-orange-600 border-orange-300 text-xs ml-1">ICT</Badge>;
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 pt-6 pb-4 flex-shrink-0">
        <h2 className="text-lg font-medium text-gray-900">商机管理</h2>
        <p className="text-sm text-gray-500 mt-1">商机信息查询与管理</p>
      </div>

      <div className="px-6 flex-shrink-0">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          {viewTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveViewTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeViewTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6">
        {/* 查询筛选区 */}

          {/* 查询筛选区 */}
          <div className="bg-white border-b border-gray-200 px-4 py-4">
            <div className="grid grid-cols-5 gap-4 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">商机创建日期：</span>
                <Input type="date" value={createDateStart} onChange={e => setCreateDateStart(e.target.value)} className="flex-1 h-8 text-sm" />
                <span className="text-gray-400">-</span>
                <Input type="date" value={createDateEnd} onChange={e => setCreateDateEnd(e.target.value)} className="flex-1 h-8 text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">商机金额区间：</span>
                <Input placeholder="最小值" value={amountMin} onChange={e => setAmountMin(e.target.value)} className="flex-1 h-8 text-sm" />
                <span className="text-gray-400">-</span>
                <Input placeholder="最大值" value={amountMax} onChange={e => setAmountMax(e.target.value)} className="flex-1 h-8 text-sm" />
                <span className="text-sm text-gray-500">万元</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">合同金额区间：</span>
                <Input placeholder="最小值" value={contractAmountMin} onChange={e => setContractAmountMin(e.target.value)} className="flex-1 h-8 text-sm" />
                <span className="text-gray-400">-</span>
                <Input placeholder="最大值" value={contractAmountMax} onChange={e => setContractAmountMax(e.target.value)} className="flex-1 h-8 text-sm" />
                <span className="text-sm text-gray-500">万元</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">商机名称：</span>
                <Input placeholder="请输入" value={oppName} onChange={e => setOppName(e.target.value)} className="flex-1 h-8 text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">商机编码：</span>
                <Input placeholder="请输入" value={oppCode} onChange={e => setOppCode(e.target.value)} className="flex-1 h-8 text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">项目名称：</span>
                <Input placeholder="请输入" value={projectName} onChange={e => setProjectName(e.target.value)} className="flex-1 h-8 text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">项目编码：</span>
                <Input placeholder="请输入" value={projectCode} onChange={e => setProjectCode(e.target.value)} className="flex-1 h-8 text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">合同名称：</span>
                <Input placeholder="请输入" value={contractName} onChange={e => setContractName(e.target.value)} className="flex-1 h-8 text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">合同编码：</span>
                <Input placeholder="请输入" value={contractCode} onChange={e => setContractCode(e.target.value)} className="flex-1 h-8 text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">客户名称：</span>
                <Input placeholder="请输入" value={customerName} onChange={e => setCustomerName(e.target.value)} className="flex-1 h-8 text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">客户编码：</span>
                <Input placeholder="请输入" value={customerCode} onChange={e => setCustomerCode(e.target.value)} className="flex-1 h-8 text-sm" />
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-2">
            <Button onClick={handleQuery} className="bg-[#1890ff] hover:bg-[#0d7dea] text-white h-8 px-4">
              <Search className="w-3.5 h-3.5 mr-1" />
              查询
            </Button>
            <Button variant="outline" onClick={handleReset} className="h-8 px-4">
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              重置
            </Button>
            <div className="flex-1" />
            <Button className="bg-green-600 hover:bg-green-700 text-white h-8 px-4">
              <Download className="w-3.5 h-3.5 mr-1" />
              同步集团
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white h-8 px-4">
              <Plus className="w-3.5 h-3.5 mr-1" />
              新建项目
            </Button>
            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white h-8 px-4">
              <X className="w-3.5 h-3.5 mr-1" />
              关闭商机
            </Button>
            <div className="relative">
              <Button variant="outline" onClick={() => setShowMoreMenu(!showMoreMenu)} className="h-8 px-3">
                更多
                <ChevronDown className="w-3.5 h-3.5 ml-1" />
              </Button>
              {showMoreMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[120px]">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">导出数据</button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">批量编辑</button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">分配商机</button>
                </div>
              )}
            </div>
          </div>

          {/* 状态标签页 */}
          <div className="bg-white border-b border-gray-200 px-4">
            <div className="flex items-center gap-1 py-2">
              {statusTabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveStatusTab(tab)}
                  className={`px-4 py-1.5 text-sm rounded transition-colors ${
                    activeStatusTab === tab
                      ? "bg-[#1890ff] text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* 数据表格区 */}
          <div className="flex-1 overflow-auto bg-white">
            <div className="overflow-x-auto" style={{ minWidth: '100%' }}>
              <table className="divide-y divide-gray-200" style={{ tableLayout: 'fixed', minWidth: '2800px' }}>
              <thead className="bg-gray-50">
                <tr>
                  <th style={{ width: columnWidths.select }} className="px-3 py-3 text-center text-sm font-medium text-gray-700 sticky left-0 bg-gray-50 z-10 relative select-none">
                    <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
                  </th>
                  <th style={{ width: columnWidths.oppName }} className="px-3 py-3 text-left text-sm font-medium text-gray-700 sticky left-[40px] bg-gray-50 z-10 relative select-none">
                    <div className="pr-3">商机名称</div>
                    <div className="absolute inset-y-0 right-0 w-3 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'oppName', columnWidths.oppName)} />
                  </th>
                  <th style={{ width: columnWidths.stage }} className="px-3 py-3 text-center text-sm font-medium text-gray-700 sticky left-[296px] bg-gray-50 z-10 relative select-none">
                    <div className="pr-3">阶段</div>
                    <div className="absolute inset-y-0 right-0 w-3 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'stage', columnWidths.stage)} />
                  </th>
                  <th style={{ width: columnWidths.provinceCode }} className="px-3 py-3 text-center text-sm font-medium text-gray-700 relative select-none">
                    <div className="pr-3">省内商机编码</div>
                    <div className="absolute inset-y-0 right-0 w-3 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'provinceCode', columnWidths.provinceCode)} />
                  </th>
                  <th style={{ width: columnWidths.groupCode }} className="px-3 py-3 text-center text-sm font-medium text-gray-700 relative select-none">
                    <div className="pr-3">集团商机编码</div>
                    <div className="absolute inset-y-0 right-0 w-3 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'groupCode', columnWidths.groupCode)} />
                  </th>
                  <th style={{ width: columnWidths.receiveDate }} className="px-3 py-3 text-center text-sm font-medium text-gray-700 relative select-none">
                    <div className="pr-3">商机接收日期</div>
                    <div className="absolute inset-y-0 right-0 w-3 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'receiveDate', columnWidths.receiveDate)} />
                  </th>
                  <th style={{ width: columnWidths.modifyDate }} className="px-3 py-3 text-center text-sm font-medium text-gray-700 relative select-none">
                    <div className="pr-3">商机修改日期</div>
                    <div className="absolute inset-y-0 right-0 w-3 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'modifyDate', columnWidths.modifyDate)} />
                  </th>
                  <th style={{ width: columnWidths.customerId }} className="px-3 py-3 text-center text-sm font-medium text-gray-700 relative select-none">
                    <div className="pr-3">政企客户身份证</div>
                    <div className="absolute inset-y-0 right-0 w-3 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'customerId', columnWidths.customerId)} />
                  </th>
                  <th style={{ width: columnWidths.customerName }} className="px-3 py-3 text-left text-sm font-medium text-gray-700 relative select-none">
                    <div className="pr-3">客户名称</div>
                    <div className="absolute inset-y-0 right-0 w-3 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'customerName', columnWidths.customerName)} />
                  </th>
                  <th style={{ width: columnWidths.city }} className="px-3 py-3 text-center text-sm font-medium text-gray-700 relative select-none">
                    <div className="pr-3">市</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: "6px" }} onMouseDown={(e) => handleResizeStart(e, 'city', columnWidths.city)} />
                  </th>
                  <th style={{ width: columnWidths.city }} className="px-3 py-3 text-center text-sm font-medium text-gray-700 relative select-none">
                    <div className="pr-3">市</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'city', columnWidths.city)} />
                  </th>
                  <th style={{ width: columnWidths.district }} className="px-3 py-3 text-center text-sm font-medium text-gray-700 relative select-none">
                    <div className="pr-3">区/县</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'district', columnWidths.district)} />
                  </th>
                  <th style={{ width: columnWidths.bu }} className="px-3 py-3 text-center text-sm font-medium text-gray-700 relative select-none">
                    <div className="pr-3">BU</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'bu', columnWidths.bu)} />
                  </th>
                  <th style={{ width: columnWidths.customerIndustry }} className="px-3 py-3 text-center text-sm font-medium text-gray-700 relative select-none">
                    <div className="pr-3">客户行业</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'customerIndustry', columnWidths.customerIndustry)} />
                  </th>
                  <th style={{ width: columnWidths.controlDept }} className="px-3 py-3 text-center text-sm font-medium text-gray-700 relative select-none">
                    <div className="pr-3">管控部门</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'controlDept', columnWidths.controlDept)} />
                  </th>
                  <th style={{ width: columnWidths.contractName }} className="px-3 py-3 text-left text-sm font-medium text-gray-700 relative select-none">
                    <div className="pr-3">合同名称</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'contractName', columnWidths.contractName)} />
                  </th>
                  <th style={{ width: columnWidths.contractCode }} className="px-3 py-3 text-center text-sm font-medium text-gray-700 relative select-none">
                    <div className="pr-3">合同编码</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: "6px" }} onMouseDown={(e) => handleResizeStart(e, 'contractCode', columnWidths.contractCode)} />
                  </th>
                  <th style={{ width: columnWidths.contractAmount }} className="px-3 py-3 text-right text-sm font-medium text-gray-700 relative select-none">
                    <div className="pr-3">合同金额(万元)</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: "6px" }} onMouseDown={(e) => handleResizeStart(e, 'contractAmount', columnWidths.contractAmount)} />
                  </th>
                  <th style={{ width: columnWidths.projectName }} className="px-3 py-3 text-left text-sm font-medium text-gray-700 relative select-none">
                    <div className="pr-3">项目名称</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: "6px" }} onMouseDown={(e) => handleResizeStart(e, 'projectName', columnWidths.projectName)} />
                  </th>
                  <th style={{ width: columnWidths.projectCode }} className="px-3 py-3 text-center text-sm font-medium text-gray-700 relative select-none">
                    <div className="pr-3">项目编码</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: "6px" }} onMouseDown={(e) => handleResizeStart(e, 'projectCode', columnWidths.projectCode)} />
                  </th>
                  <th style={{ width: columnWidths.status }} className="px-3 py-3 text-center text-sm font-medium text-gray-700 relative select-none">
                    <div className="pr-3">商机状态</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: "6px" }} onMouseDown={(e) => handleResizeStart(e, 'status', columnWidths.status)} />
                  </th>
                  <th style={{ width: columnWidths.isTeamFormed }} className="px-3 py-3 text-center text-sm font-medium text-gray-700 relative select-none">
                    <div className="pr-3">是否组建团队</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: "6px" }} onMouseDown={(e) => handleResizeStart(e, 'isTeamFormed', columnWidths.isTeamFormed)} />
                  </th>
                  <th style={{ width: columnWidths.myScore }} className="px-3 py-3 text-right text-sm font-medium text-gray-700 relative select-none">
                    <div className="pr-3">我的积分</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: "6px" }} onMouseDown={(e) => handleResizeStart(e, 'myScore', columnWidths.myScore)} />
                  </th>
                  <th style={{ width: columnWidths.scoreDistRate }} className="px-3 py-3 text-right text-sm font-medium text-gray-700 relative select-none">
                    <div className="pr-3">项目积分已分配比例</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: "6px" }} onMouseDown={(e) => handleResizeStart(e, 'scoreDistRate', columnWidths.scoreDistRate)} />
                  </th>
                  <th style={{ width: columnWidths.groupCustomerCode }} className="px-3 py-3 text-center text-sm font-medium text-gray-700 relative select-none">
                    <div className="pr-3">集团客户编码</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: "6px" }} onMouseDown={(e) => handleResizeStart(e, 'groupCustomerCode', columnWidths.groupCustomerCode)} />
                  </th>
                  <th style={{ width: columnWidths.source }} className="px-3 py-3 text-center text-sm font-medium text-gray-700 relative select-none">
                    <div className="pr-3">商机来源</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: "6px" }} onMouseDown={(e) => handleResizeStart(e, 'source', columnWidths.source)} />
                  </th>
                  <th style={{ width: columnWidths.customerManager }} className="px-3 py-3 text-center text-sm font-medium text-gray-700 relative select-none">
                    <div className="pr-3">客户经理</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: "6px" }} onMouseDown={(e) => handleResizeStart(e, 'customerManager', columnWidths.customerManager)} />
                  </th>
                  <th style={{ width: columnWidths.actions }} className="px-3 py-3 text-center text-sm font-medium text-gray-700 sticky right-0 bg-gray-50 z-10">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {opportunities.map(opp => (
                  <tr key={opp.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 sticky left-0 bg-white z-10">
                      <Checkbox
                        checked={selectedRows.has(opp.id)}
                        onCheckedChange={checked => handleSelectRow(opp.id, checked as boolean)}
                      />
                    </td>
                    <td className="px-3 py-3 text-sm font-medium max-w-[256px] truncate sticky left-[40px] bg-white z-10">
                      <span
                      className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium"
                      onClick={() => onRowClick?.(opp.id)}
                    >
                      {opp.oppName}{getIctBadge(opp.oppName)}
                    </span>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-600 text-center sticky left-[296px] bg-white z-10">
                      {opp.stage}
                    </td>
                    <td className="px-3 py-3 text-sm font-mono text-gray-600 text-xs">{opp.provinceCode}</td>
                    <td className="px-3 py-3 text-sm font-mono text-gray-600 text-xs">{opp.groupCode}</td>
                    <td className="px-3 py-3 text-sm text-gray-600 text-xs">{opp.receiveDate}</td>
                    <td className="px-3 py-3 text-sm text-gray-600 text-xs">{opp.modifyDate}</td>
                    <td className="px-3 py-3 text-sm font-mono text-gray-600 text-xs">{opp.customerId}</td>
                    <td className="px-3 py-3 text-sm text-gray-600 max-w-[256px] truncate">{opp.customerName}</td>
                    <td className="px-3 py-3 text-sm text-gray-600 text-center">{opp.city}</td>
                    <td className="px-3 py-3 text-sm text-gray-600 text-center">{opp.district}</td>
                    <td className="px-3 py-3 text-sm text-gray-600 text-center">{opp.bu}</td>
                    <td className="px-3 py-3 text-sm text-gray-600 text-center">{opp.customerIndustry}</td>
                    <td className="px-3 py-3 text-sm text-gray-600 text-center">{opp.controlDept}</td>
                    <td className="px-3 py-3 text-sm text-gray-600 max-w-[192px] truncate">{opp.contractName}</td>
                    <td className="px-3 py-3 text-sm font-mono text-gray-600 text-xs">{opp.contractCode}</td>
                    <td className="px-3 py-3 text-sm text-right font-medium">
                      {opp.contractAmount === "-" ? "-" : `¥${opp.contractAmount}`}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-600 max-w-[192px] truncate">{opp.projectName}</td>
                    <td className="px-3 py-3 text-sm font-mono text-gray-600 text-xs">{opp.projectCode}</td>
                    <td className="px-3 py-3">{getStatusBadge(opp.status)}</td>
                    <td className="px-3 py-3 text-sm text-gray-600 text-center">{opp.isTeamFormed}</td>
                    <td className="px-3 py-3 text-sm text-right font-medium text-orange-600">
                      {opp.amount.toFixed(2)}
                    </td>
                    <td className="px-3 py-3 text-sm text-right text-gray-600">{opp.myScore}</td>
                    <td className="px-3 py-3 text-sm text-right text-gray-600">{opp.scoreDistRate}</td>
                    <td className="px-3 py-3 text-sm font-mono text-gray-600 text-xs">{opp.groupCustomerCode}</td>
                    <td className="px-3 py-3 text-sm text-gray-600">{opp.source}</td>
                    <td className="px-3 py-3 text-sm text-gray-700">{opp.customerManager}</td>
                    <td className="px-3 py-3 sticky right-0 bg-white z-10">
                      <button
                        className={`text-xs ${opp.followed ? "text-gray-400" : "text-blue-600 hover:text-blue-700"}`}
                        onClick={() => handleFollow(opp.id)}
                      >
                        {opp.followed ? "已关注" : "+ 关注"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          {/* 底部统计和分页 */}
          <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              共 {opportunities.length} 条
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="10">
                <SelectTrigger className="w-24 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10条/页</SelectItem>
                  <SelectItem value="20">20条/页</SelectItem>
                  <SelectItem value="50">50条/页</SelectItem>
                  <SelectItem value="100">100条/页</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>
                <span className="text-xs">‹</span>
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-[#1890ff] text-white border-[#1890ff]">
                <span className="text-xs">1</span>
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <span className="text-xs">2</span>
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <span className="text-xs">3</span>
              </Button>
              <Button variant="outline" size="sm" className="h-8 px-2">
                ...
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <span className="text-xs">›</span>
              </Button>
              <div className="flex items-center gap-1 ml-2">
                <span className="text-sm text-gray-500">前往</span>
                <Input className="w-12 h-8 text-sm text-center" defaultValue="1" />
                <span className="text-sm text-gray-500">页</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}