import React, { useState, useCallback, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Badge } from "./ui/badge";
import { Download, RotateCcw, Search, Eye, ChevronDown, ChevronRight } from "lucide-react";
import { SixPositioningDetail } from "./SixPositioningDetail";

interface QueryParams {
  city: string;
  createTimeStart: string;
  createTimeEnd: string;
  opportunityName: string;
  opportunityCode: string;
  opportunityType: string;
  contractTimeStart: string;
  contractTimeEnd: string;
  contractName: string;
  contractCode: string;
  hasCustomerControl: string;
  hasPlanControl: string;
  hasBiddingAutonomy: string;
  hasProcurementAutonomy: string;
  hasProjectManagement: string;
  hasMaintenanceAutonomy: string;
}

interface SixPositionCategory {
  id: string;
  name: string;
  items: string[];
  color: string;
  bgColor: string;
}

const sixPositionCategories: SixPositionCategory[] = [
  {
    id: "customerControl",
    name: "具备客情掌握",
    items: ["具备客户档案", "具备拜访记录", "具备商机提前录入", "具备近三年信息化项目"],
    color: "text-green-600",
    bgColor: "bg-green-500"
  },
  {
    id: "planControl",
    name: "具备方案总控",
    items: ["具备组建团队", "具备方案设计与审核", "具备方案结构与中台把关"],
    color: "text-blue-600",
    bgColor: "bg-blue-500"
  },
  {
    id: "biddingAutonomy",
    name: "具备谈判/应标自主",
    items: ["具备参标记录", "具备应标结果记录", "具备商务谈判", "具备前向合同信息"],
    color: "text-purple-600",
    bgColor: "bg-purple-500"
  },
  {
    id: "procurementAutonomy",
    name: "具备采购自主",
    items: ["具备标前决策", "具备后向资料", "具备业务解构", "具备业务风险防控"],
    color: "text-orange-600",
    bgColor: "bg-orange-500"
  },
  {
    id: "projectManagement",
    name: "具备项目强管理",
    items: ["具备项目实施总体设计", "具备变更记录", "具备验收报告", "具备项目实施文件", "具备审计清单"],
    color: "text-red-600",
    bgColor: "bg-red-500"
  },
  {
    id: "maintenanceAutonomy",
    name: "具备运维自主",
    items: ["具备数字平台", "具备第一服务界面", "具备售后其他资料"],
    color: "text-cyan-600",
    bgColor: "bg-cyan-500"
  }
];

interface TableData {
  id: number;
  city: string;
  district: string;
  opportunityName: string;
  opportunityCode: string;
  opportunityCreateDate: string;
  contractName: string;
  contractAmount: string;
  contractDate: string;
  nodeCount: number;
  customerControl: string[];
  planControl: string[];
  biddingAutonomy: string[];
  procurementAutonomy: string[];
  projectManagement: string[];
  maintenanceAutonomy: string[];
}

const mockData: TableData[] = [
  {
    id: 1,
    city: "杭州",
    district: "西湖区",
    opportunityName: "某区政府信息化项目",
    opportunityCode: "OPP2024001",
    opportunityCreateDate: "2024-01-15",
    contractName: "政务云服务合同",
    contractAmount: "500",
    contractDate: "2024-02-20",
    nodeCount: 15,
    customerControl: ["具备客户档案", "具备拜访记录"],
    planControl: ["具备组建团队", "具备方案设计与审核"],
    biddingAutonomy: ["具备参标记录", "具备应标结果记录"],
    procurementAutonomy: ["具备标前决策"],
    projectManagement: ["具备项目实施总体设计", "具备变更记录"],
    maintenanceAutonomy: ["具备数字平台"]
  },
  {
    id: 2,
    city: "宁波",
    district: "鄞州区",
    opportunityName: "智慧校园建设项目",
    opportunityCode: "OPP2024002",
    opportunityCreateDate: "2024-02-01",
    contractName: "教育信息化合同",
    contractAmount: "800",
    contractDate: "2024-03-15",
    nodeCount: 17,
    customerControl: ["具备客户档案", "具备拜访记录", "具备商机提前录入"],
    planControl: ["具备组建团队", "具备方案设计与审核", "具备方案结构与中台把关"],
    biddingAutonomy: ["具备参标记录", "具备应标结果记录", "具备商务谈判"],
    procurementAutonomy: ["具备标前决策", "具备后向资料", "具备业务解构"],
    projectManagement: ["具备项目实施总体设计", "具备变更记录", "具备验收报告"],
    maintenanceAutonomy: ["具备数字平台", "具备第一服务界面", "具备售后其他资料"]
  },
  {
    id: 3,
    city: "温州",
    district: "鹿城区",
    opportunityName: "智慧医疗系统",
    opportunityCode: "OPP2024003",
    opportunityCreateDate: "2024-02-20",
    contractName: "医疗信息化合同",
    contractAmount: "350",
    contractDate: "2024-04-01",
    nodeCount: 12,
    customerControl: ["具备客户档案"],
    planControl: ["具备组建团队"],
    biddingAutonomy: ["具备参标记录"],
    procurementAutonomy: [],
    projectManagement: ["具备项目实施总体设计"],
    maintenanceAutonomy: []
  }
];

function StatusIndicator({ hasItem, itemName }: { hasItem: boolean; itemName: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2.5 h-2.5 rounded-full ${hasItem ? "bg-green-500" : "bg-red-500"}`} />
      <span className="text-xs text-gray-600">{itemName.replace("具备", "")}</span>
    </div>
  );
}

export function SixPositioning() {
  const [activeTab, setActiveTab] = useState<"list" | "statistics">("list");
  const [expandedHeaders, setExpandedHeaders] = useState<Set<string>>(new Set());
  const [showAllConditions, setShowAllConditions] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<{name: string; code: string} | null>(null);
  const handleNavigateForwardBid = (oppCode: string) => {
    window.open(`/opp-forward-bid?code=${oppCode}`, "_blank");
  };
  const [queryParams, setQueryParams] = useState<QueryParams>({
    city: "",
    createTimeStart: "",
    createTimeEnd: "",
    opportunityName: "",
    opportunityCode: "",
    opportunityType: "",
    contractTimeStart: "",
    contractTimeEnd: "",
    contractName: "",
    contractCode: "",
    hasCustomerControl: "",
    hasPlanControl: "",
    hasBiddingAutonomy: "",
    hasProcurementAutonomy: "",
    hasProjectManagement: "",
    hasMaintenanceAutonomy: ""
  });

  // 列宽状态
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    serialNo: 60,
    city: 80,
    district: 80,
    opportunityName: 160,
    opportunityCode: 120,
    opportunityCreateDate: 120,
    contractName: 160,
    contractAmount: 120,
    contractDate: 120,
    nodeCount: 100,
  });

  const [resizing, setResizing] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);

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

  const handleOpenDetail = (row: { opportunityName: string; opportunityCode: string }) => {
    setSelectedOpportunity({ name: row.opportunityName, code: row.opportunityCode });
    setDetailModalOpen(true);
  };

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

  const toggleHeader = (id: string) => {
    setExpandedHeaders(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleReset = () => {
    setQueryParams({
      city: "",
      createTimeStart: "",
      createTimeEnd: "",
      opportunityName: "",
      opportunityCode: "",
      opportunityType: "",
      contractTimeStart: "",
      contractTimeEnd: "",
      contractName: "",
      contractCode: "",
      hasCustomerControl: "",
      hasPlanControl: "",
      hasBiddingAutonomy: "",
      hasProcurementAutonomy: "",
      hasProjectManagement: "",
      hasMaintenanceAutonomy: ""
    });
  };

  const getCategoryData = (row: TableData, categoryId: string): string[] => {
    switch (categoryId) {
      case "customerControl": return row.customerControl;
      case "planControl": return row.planControl;
      case "biddingAutonomy": return row.biddingAutonomy;
      case "procurementAutonomy": return row.procurementAutonomy;
      case "projectManagement": return row.projectManagement;
      case "maintenanceAutonomy": return row.maintenanceAutonomy;
      default: return [];
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 pt-6 pb-4 flex-shrink-0">
        <h2 className="text-lg font-medium text-gray-900">六到位管理</h2>
        <p className="text-sm text-gray-500 mt-1">商机六到位情况统计与分析</p>
      </div>

      <div className="px-6 flex-shrink-0">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("list")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "list"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            列表视图
          </button>
          <button
            onClick={() => setActiveTab("statistics")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "statistics"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            统计视图
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6">
        {activeTab === "list" ? (
          <>
            <div className="mt-4 space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">地市</label>
                    <Select value={queryParams.city} onValueChange={(v) => setQueryParams({...queryParams, city: v})}>
                      <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hangzhou">杭州</SelectItem>
                        <SelectItem value="ningbo">宁波</SelectItem>
                        <SelectItem value="wenzhou">温州</SelectItem>
                        <SelectItem value="jinhua">金华</SelectItem>
                        <SelectItem value="shaoxing">绍兴</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">商机创建时间</label>
                    <div className="flex gap-2">
                      <Input type="date" value={queryParams.createTimeStart} onChange={(e) => setQueryParams({...queryParams, createTimeStart: e.target.value})} />
                      <span className="self-center text-gray-400">-</span>
                      <Input type="date" value={queryParams.createTimeEnd} onChange={(e) => setQueryParams({...queryParams, createTimeEnd: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">商机名称</label>
                    <Input value={queryParams.opportunityName} onChange={(e) => setQueryParams({...queryParams, opportunityName: e.target.value})} placeholder="请输入" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">商机编码</label>
                    <Input value={queryParams.opportunityCode} onChange={(e) => setQueryParams({...queryParams, opportunityCode: e.target.value})} placeholder="请输入" />
                  </div>
                </div>

                {showAllConditions && (
                  <>
                    <div className="grid grid-cols-4 gap-x-6 gap-y-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">商机类型</label>
                        <Select value={queryParams.opportunityType} onValueChange={(v) => setQueryParams({...queryParams, opportunityType: v})}>
                          <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="government">政务</SelectItem>
                            <SelectItem value="enterprise">企业</SelectItem>
                            <SelectItem value="education">教育</SelectItem>
                            <SelectItem value="medical">医疗</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">合同签约时间</label>
                        <div className="flex gap-2">
                          <Input type="date" value={queryParams.contractTimeStart} onChange={(e) => setQueryParams({...queryParams, contractTimeStart: e.target.value})} />
                          <span className="self-center text-gray-400">-</span>
                          <Input type="date" value={queryParams.contractTimeEnd} onChange={(e) => setQueryParams({...queryParams, contractTimeEnd: e.target.value})} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">合同名称</label>
                        <Input value={queryParams.contractName} onChange={(e) => setQueryParams({...queryParams, contractName: e.target.value})} placeholder="请输入" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">合同编码</label>
                        <Input value={queryParams.contractCode} onChange={(e) => setQueryParams({...queryParams, contractCode: e.target.value})} placeholder="请输入" />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-x-6 gap-y-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">具备客情掌握</label>
                        <Select value={queryParams.hasCustomerControl} onValueChange={(v) => setQueryParams({...queryParams, hasCustomerControl: v})}>
                          <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">是</SelectItem>
                            <SelectItem value="no">否</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">具备方案总控</label>
                        <Select value={queryParams.hasPlanControl} onValueChange={(v) => setQueryParams({...queryParams, hasPlanControl: v})}>
                          <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">是</SelectItem>
                            <SelectItem value="no">否</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">具备谈判/应标自主</label>
                        <Select value={queryParams.hasBiddingAutonomy} onValueChange={(v) => setQueryParams({...queryParams, hasBiddingAutonomy: v})}>
                          <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">是</SelectItem>
                            <SelectItem value="no">否</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">具备采购自主</label>
                        <Select value={queryParams.hasProcurementAutonomy} onValueChange={(v) => setQueryParams({...queryParams, hasProcurementAutonomy: v})}>
                          <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">是</SelectItem>
                            <SelectItem value="no">否</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-x-6 gap-y-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">具备项目强管理</label>
                        <Select value={queryParams.hasProjectManagement} onValueChange={(v) => setQueryParams({...queryParams, hasProjectManagement: v})}>
                          <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">是</SelectItem>
                            <SelectItem value="no">否</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">具备运维自主</label>
                        <Select value={queryParams.hasMaintenanceAutonomy} onValueChange={(v) => setQueryParams({...queryParams, hasMaintenanceAutonomy: v})}>
                          <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">是</SelectItem>
                            <SelectItem value="no">否</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between mt-4">
                  <Button variant="link" size="sm" onClick={() => setShowAllConditions(!showAllConditions)} className="text-blue-600 p-0">
                    {showAllConditions ? '收起更多条件' : '展开更多条件'}
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="default" size="sm">
                      <Search className="w-4 h-4 mr-1" />查询
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleReset}>
                      <RotateCcw className="w-4 h-4 mr-1" />重置
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />下载清单
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />下载附件
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th style={{ width: columnWidths.serialNo, minWidth: columnWidths.serialNo }} className="px-3 py-3 text-center text-sm font-medium text-gray-700 relative select-none">
                          <div className="flex items-center justify-center">序号</div>
                          <div
                            className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-200 transition-colors"
                            onMouseDown={(e) => handleResizeStart(e, 'serialNo', columnWidths.serialNo)}
                          />
                        </th>
                        <th style={{ width: columnWidths.city, minWidth: columnWidths.city }} className="px-3 py-3 text-center text-sm font-medium text-gray-700 relative select-none">
                          <div className="flex items-center justify-center">地市</div>
                          <div
                            className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-200 transition-colors"
                            onMouseDown={(e) => handleResizeStart(e, 'city', columnWidths.city)}
                          />
                        </th>
                        <th style={{ width: columnWidths.district, minWidth: columnWidths.district }} className="px-3 py-3 text-center text-sm font-medium text-gray-700 relative select-none">
                          <div className="flex items-center justify-center">区县</div>
                          <div
                            className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-200 transition-colors"
                            onMouseDown={(e) => handleResizeStart(e, 'district', columnWidths.district)}
                          />
                        </th>
                        <th style={{ width: columnWidths.opportunityName, minWidth: columnWidths.opportunityName }} className="px-3 py-3 text-center text-sm font-medium text-gray-700 relative select-none">
                          <div className="flex items-center justify-center">商机名称</div>
                          <div
                            className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-200 transition-colors"
                            onMouseDown={(e) => handleResizeStart(e, 'opportunityName', columnWidths.opportunityName)}
                          />
                        </th>
                        <th style={{ width: columnWidths.opportunityCode, minWidth: columnWidths.opportunityCode }} className="px-3 py-3 text-center text-sm font-medium text-gray-700 relative select-none">
                          <div className="flex items-center justify-center">商机编码</div>
                          <div
                            className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-200 transition-colors"
                            onMouseDown={(e) => handleResizeStart(e, 'opportunityCode', columnWidths.opportunityCode)}
                          />
                        </th>
                        <th style={{ width: columnWidths.opportunityCreateDate, minWidth: columnWidths.opportunityCreateDate }} className="px-3 py-3 text-center text-sm font-medium text-gray-700 relative select-none">
                          <div className="flex items-center justify-center">商机创建日期</div>
                          <div
                            className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-200 transition-colors"
                            onMouseDown={(e) => handleResizeStart(e, 'opportunityCreateDate', columnWidths.opportunityCreateDate)}
                          />
                        </th>
                        <th style={{ width: columnWidths.contractName, minWidth: columnWidths.contractName }} className="px-3 py-3 text-center text-sm font-medium text-gray-700 relative select-none">
                          <div className="flex items-center justify-center">合同名称</div>
                          <div
                            className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-200 transition-colors"
                            onMouseDown={(e) => handleResizeStart(e, 'contractName', columnWidths.contractName)}
                          />
                        </th>
                        <th style={{ width: columnWidths.contractAmount, minWidth: columnWidths.contractAmount }} className="px-3 py-3 text-center text-sm font-medium text-gray-700 relative select-none">
                          <div className="flex items-center justify-center">合同签约金额(万元)</div>
                          <div
                            className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-200 transition-colors"
                            onMouseDown={(e) => handleResizeStart(e, 'contractAmount', columnWidths.contractAmount)}
                          />
                        </th>
                        <th style={{ width: columnWidths.contractDate, minWidth: columnWidths.contractDate }} className="px-3 py-3 text-center text-sm font-medium text-gray-700 relative select-none">
                          <div className="flex items-center justify-center">合同签约日期</div>
                          <div
                            className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-200 transition-colors"
                            onMouseDown={(e) => handleResizeStart(e, 'contractDate', columnWidths.contractDate)}
                          />
                        </th>
                        <th style={{ width: columnWidths.nodeCount, minWidth: columnWidths.nodeCount }} className="px-3 py-3 text-center text-sm font-medium text-gray-700 relative select-none">
                          <div className="flex items-center justify-center">六到位17节点具备数量</div>
                          <div
                            className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-200 transition-colors"
                            onMouseDown={(e) => handleResizeStart(e, 'nodeCount', columnWidths.nodeCount)}
                          />
                        </th>
                        {sixPositionCategories.map((category, catIndex) => (
                          <React.Fragment key={category.id}>
                            <th className="px-3 py-3 text-center text-sm font-medium text-gray-700 min-w-32 align-top relative select-none bg-gray-50">
                              <div className="flex flex-col items-center gap-1">
                                <button onClick={() => toggleHeader(category.id)} className="inline-flex items-center justify-center gap-1 hover:text-blue-600 transition-colors">
                                  <span className="text-center text-xs">{category.name}</span>
                                  <span className={`${category.color} flex-shrink-0`}>
                                    {expandedHeaders.has(category.id) ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                  </span>
                                </button>
                              </div>
                              <div
                                className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-200 transition-colors"
                                onMouseDown={(e) => handleResizeStart(e, `cat_${category.id}`, 128)}
                              />
                            </th>
                            {expandedHeaders.has(category.id) && category.items.map((item, itemIndex) => (
                              <th key={item} className="px-3 py-3 text-center text-xs font-medium text-gray-600 min-w-20 align-top relative select-none">
                                <div className="flex items-center justify-center">{item.replace("具备", "")}</div>
                                <div
                                  className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-200 transition-colors"
                                  onMouseDown={(e) => handleResizeStart(e, `item_${category.id}_${itemIndex}`, 80)}
                                />
                              </th>
                            ))}
                          </React.Fragment>
                        ))}
                        <th className="sticky right-0 px-4 py-3 text-center text-sm font-medium text-gray-700 w-32 bg-gray-50 shadow-[-2px_0_4px_rgba(0,0,0,0.05)] z-10">操作</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {mockData.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50">
                          <td style={{ width: columnWidths.serialNo, minWidth: columnWidths.serialNo }} className="px-3 py-3 text-center text-sm text-gray-900">{row.id}</td>
                          <td style={{ width: columnWidths.city, minWidth: columnWidths.city }} className="px-3 py-3 text-center text-sm text-gray-900">{row.city}</td>
                          <td style={{ width: columnWidths.district, minWidth: columnWidths.district }} className="px-3 py-3 text-center text-sm text-gray-900">{row.district}</td>
                          <td style={{ width: columnWidths.opportunityName, minWidth: columnWidths.opportunityName }} className="px-3 py-3 text-sm text-gray-900 truncate" title={row.opportunityName}>{row.opportunityName}</td>
                          <td style={{ width: columnWidths.opportunityCode, minWidth: columnWidths.opportunityCode }} className="px-3 py-3 text-center text-sm text-blue-600">{row.opportunityCode}</td>
                          <td style={{ width: columnWidths.opportunityCreateDate, minWidth: columnWidths.opportunityCreateDate }} className="px-3 py-3 text-center text-sm text-gray-600">{row.opportunityCreateDate}</td>
                          <td style={{ width: columnWidths.contractName, minWidth: columnWidths.contractName }} className="px-3 py-3 text-sm text-gray-900 truncate" title={row.contractName}>{row.contractName}</td>
                          <td style={{ width: columnWidths.contractAmount, minWidth: columnWidths.contractAmount }} className="px-3 py-3 text-right text-sm text-gray-900">{row.contractAmount}</td>
                          <td style={{ width: columnWidths.contractDate, minWidth: columnWidths.contractDate }} className="px-3 py-3 text-center text-sm text-gray-600">{row.contractDate}</td>
                          <td style={{ width: columnWidths.nodeCount, minWidth: columnWidths.nodeCount }} className="px-3 py-3 text-center">
                            <Badge variant={row.nodeCount >= 15 ? "default" : "secondary"}>{row.nodeCount}/17</Badge>
                          </td>
                          {sixPositionCategories.map((category) => {
                            const categoryData = getCategoryData(row, category.id);
                            const hasCategory = categoryData.length > 0;
                            return (
                              <React.Fragment key={category.id}>
                                <td className="px-3 py-3 text-center align-top">
                                  <div className="flex flex-col items-center gap-1">
                                    <div className={`w-3 h-3 rounded-full ${hasCategory ? "bg-green-500" : "bg-red-500"}`} />
                                    <span className="text-xs text-gray-600 whitespace-nowrap">{categoryData.length}/{category.items.length}</span>
                                  </div>
                                </td>
                                {expandedHeaders.has(category.id) && category.items.map((item) => (
                                  <td key={item} className="px-3 py-3 text-center align-top">
                                    <div className={`w-3 h-3 rounded-full mx-auto ${categoryData.includes(item) ? "bg-green-500" : "bg-red-500"}`} />
                                  </td>
                                ))}
                              </React.Fragment>
                            );
                          })}
                          <td className="sticky right-0 px-4 py-3 text-center bg-white shadow-[-2px_0_4px_rgba(0,0,0,0.05)] z-10">
                            <div className="flex flex-col gap-1">
                              <Button variant="ghost" size="sm" className="text-blue-600 h-6 text-xs"><Download className="w-3 h-3 mr-1" />下载附件</Button>
                              <Button variant="ghost" size="sm" className="text-blue-600 h-6 text-xs" onClick={() => handleOpenDetail({ opportunityName: row.opportunityName, opportunityCode: row.opportunityCode })}><Eye className="w-3 h-3 mr-1" />省内视图</Button>
                              <Button variant="ghost" size="sm" className="text-blue-600 h-6 text-xs"><Eye className="w-3 h-3 mr-1" />集团视图</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="mt-4 bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-blue-600">156</div>
                <div className="text-sm text-gray-600 mt-2">商机总数</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-600">89</div>
                <div className="text-sm text-gray-600 mt-2">具备客情掌握</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-purple-600">72</div>
                <div className="text-sm text-gray-600 mt-2">具备方案总控</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-orange-600">65</div>
                <div className="text-sm text-gray-600 mt-2">具备谈判/应标自主</div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-6 mt-4">
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-red-600">58</div>
                <div className="text-sm text-gray-600 mt-2">具备采购自主</div>
              </div>
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-teal-600">61</div>
                <div className="text-sm text-gray-600 mt-2">具备项目强管理</div>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-indigo-600">49</div>
                <div className="text-sm text-gray-600 mt-2">具备运维自主</div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-gray-600">17</div>
                <div className="text-sm text-gray-600 mt-2">六到位全具备</div>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">各区域六到位覆盖率</h3>
              <div className="space-y-4">
                {[{ name: "杭州", value: 78, color: "bg-blue-500" }, { name: "宁波", value: 85, color: "bg-green-500" }, { name: "温州", value: 62, color: "bg-purple-500" }, { name: "金华", value: 71, color: "bg-orange-500" }].map((item) => (
                  <div key={item.name} className="flex items-center gap-4">
                    <span className="w-12 text-sm">{item.name}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div className={`${item.color} h-4 rounded-full`} style={{ width: `${item.value}%` }}></div>
                    </div>
                    <span className="w-12 text-sm text-right">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 六到位明细弹窗 */}
      <SixPositioningDetail
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        opportunityName={selectedOpportunity?.name}
        opportunityCode={selectedOpportunity?.code}
        onNavigateForwardBid={handleNavigateForwardBid}
      />
    </div>
  );
}