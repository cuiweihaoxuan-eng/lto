import React, { useState, useCallback, useEffect } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { BusinessInfoModal } from "./BusinessInfoModal";
import { LinkOpportunityDialog } from "./LinkOpportunityDialog";

interface FilterCategory {
  label: string;
  value: string;
  count: number;
}

interface SearchForm {
  businessInfoCode: string;
  projectName: string;
  projectCode: string;
  biddingUnit: string;
  industryType: string;
  businessInfoStatus: string;
  controlDepartment: string;
  businessInfoArea: string;
  dataType: string;
  operatorLabel: string;
  groupDispatchTimeStart: string;
  groupDispatchTimeEnd: string;
  biddingAmountMin: string;
  biddingAmountMax: string;
  biddingPublishTime: string;
  winningTime: string;
  currentOperationStep: string;
  currentOperationRole: string;
}

const defaultColumnWidths = {
  groupDispatchTime: 96,
  city: 64,
  district: 64,
  businessInfoCode: 112,
  projectCode: 112,
  projectName: 192,
  businessInfoStatus: 80,
  currentOperationStep: 96,
  currentOperationRole: 96,
  currentOperator: 112,
  accountManager: 96,
  groupBusinessCode: 112,
  businessName: 160,
  groupBusinessTime: 112,
  enterpriseName: 160,
  areaGroup: 64,
  dataType: 80,
  biddingAmount: 96,
  biddingPublishTime: 112,
  openingTime: 112,
  biddingDeadline: 112,
  winningTime: 112,
  biddingUnit: 160,
  companyDispatchName: 160,
  winningUnit: 160,
  operatorLabel: 80,
  projectType: 80,
  controlDepartment: 128,
  biddingUnitArea: 160,
  attachment: 80,
  actions: 80,
};

export function BusinessInfoManagement() {
  const [firstLevelFilter, setFirstLevelFilter] = useState<string>("all");
  const [secondLevelFilter, setSecondLevelFilter] = useState<string>("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFlowModalOpen, setIsFlowModalOpen] = useState(false);
  const [isLinkOppModalOpen, setIsLinkOppModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Record<string, unknown> | null>(null);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [columnWidths, setColumnWidths] = useState(defaultColumnWidths);
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

  const firstLevelFilters: FilterCategory[] = [
    { label: "全部", value: "all", count: 150 },
    { label: "未处理", value: "unprocessed", count: 80 },
    { label: "已处理", value: "processed", count: 60 },
    { label: "我关注的", value: "followed", count: 10 },
  ];

  const secondLevelFiltersMap: Record<string, FilterCategory[]> = {
    all: [
      { label: "未处理（待我处理）", value: "pending-me", count: 35 },
      { label: "未处理（他人处理）", value: "pending-other", count: 45 },
      { label: "转商机", value: "to-opportunity", count: 25 },
      { label: "已关联商机", value: "related", count: 20 },
      { label: "已回退集团", value: "returned", count: 15 },
    ],
    unprocessed: [
      { label: "待我处理", value: "pending-me", count: 35 },
      { label: "他人处理", value: "pending-other", count: 45 },
    ],
    processed: [
      { label: "已转商机", value: "to-opportunity", count: 25 },
      { label: "已关联商机", value: "related", count: 20 },
      { label: "已回退集团", value: "returned", count: 15 },
    ],
    followed: [
      { label: "未处理（待我处理）", value: "pending-me", count: 2 },
      { label: "未处理（他人处理）", value: "pending-other", count: 3 },
      { label: "转商机", value: "to-opportunity", count: 2 },
      { label: "已关联商机", value: "related", count: 2 },
      { label: "已回退集团", value: "returned", count: 1 },
    ],
  };

  const currentSecondFilters = secondLevelFiltersMap[firstLevelFilter] || [];

  const [searchForm, setSearchForm] = useState<SearchForm>({
    businessInfoCode: "",
    projectName: "",
    projectCode: "",
    biddingUnit: "",
    industryType: "",
    businessInfoStatus: "",
    controlDepartment: "",
    businessInfoArea: "",
    dataType: "",
    operatorLabel: "",
    groupDispatchTimeStart: "",
    groupDispatchTimeEnd: "",
    biddingAmountMin: "",
    biddingAmountMax: "",
    biddingPublishTime: "",
    winningTime: "",
    currentOperationStep: "",
    currentOperationRole: "",
  });

  const mockData = [
    {
      id: 1,
      groupDispatchTime: "2025-01-15",
      city: "杭州",
      district: "拱墅区",
      businessInfoCode: "SQ20250115001",
      projectCode: "PRJ2025001",
      projectName: "某高速公路智能化系统建设项目",
      businessInfoStatus: "未处理",
      currentOperationStep: "自动派单",
      currentOperationRole: "地市管理员",
      currentOperator: "张三、李四",
      accountManager: "王五",
      groupBusinessCode: "GBC20250115001",
      businessName: "高速智能化商机",
      groupBusinessTime: "2025-01-15 10:30:00",
      dataType: "招标",
      biddingAmount: "1500",
      biddingPublishTime: "2025-01-10",
      openingTime: "2025-02-10",
      biddingDeadline: "2025-02-05",
      winningTime: "",
      biddingUnit: "浙江高速信息工程技术有限公司",
      companyDispatchName: "浙江联通",
      winningUnit: "",
      operatorLabel: "移动、联通",
      projectType: "智慧交通",
      controlDepartment: "政企部",
      biddingUnitArea: "浙江省杭州市",
      attachment: "项目招标文件.pdf",
      isFavorite: false,
      currentOperators: ["张三", "李四"],
      enterpriseName: "中国联通浙江省分公司",
      areaGroup: "杭州",
      attachmentCount: 2,
    },
    {
      id: 2,
      groupDispatchTime: "2025-01-16",
      city: "宁波",
      district: "鄞州区",
      businessInfoCode: "SQ20250116002",
      projectCode: "PRJ2025002",
      projectName: "智慧城市建设一期项目",
      businessInfoStatus: "转商机",
      currentOperationStep: "派单给商机管理员",
      currentOperationRole: "客户经理",
      currentOperator: "赵六",
      accountManager: "陈七",
      groupBusinessCode: "GBC20250116002",
      businessName: "智慧城市商机",
      groupBusinessTime: "2025-01-16 14:20:00",
      dataType: "中标",
      biddingAmount: "2800",
      biddingPublishTime: "2024-12-20",
      openingTime: "2025-01-15",
      biddingDeadline: "2025-01-10",
      winningTime: "2025-01-16",
      biddingUnit: "宁波市政府",
      companyDispatchName: "浙江联通",
      winningUnit: "中国联通浙江分公司",
      operatorLabel: "联通",
      projectType: "智慧政务",
      controlDepartment: "政企部",
      biddingUnitArea: "浙江省宁波市",
      attachment: "中标通知书.pdf",
      isFavorite: true,
      currentOperators: ["赵六"],
      enterpriseName: "中国联通浙江省分公司",
      areaGroup: "宁波",
      attachmentCount: 1,
    },
    {
      id: 3,
      groupDispatchTime: "2025-01-17",
      city: "温州",
      district: "鹿城区",
      businessInfoCode: "SQ20250117003",
      projectCode: "PRJ2025003",
      projectName: "温州医科大学附属医院信息化建设项目",
      businessInfoStatus: "未处理",
      currentOperationStep: "自动派单",
      currentOperationRole: "地市管理员",
      currentOperator: "钱八",
      accountManager: "孙九",
      groupBusinessCode: "",
      businessName: "",
      groupBusinessTime: "",
      dataType: "招标",
      biddingAmount: "4200",
      biddingPublishTime: "2025-01-12",
      openingTime: "2025-02-20",
      biddingDeadline: "2025-02-15",
      winningTime: "",
      biddingUnit: "温州医科大学附属第一医院",
      companyDispatchName: "浙江移动",
      winningUnit: "",
      operatorLabel: "移动",
      projectType: "智慧医疗",
      controlDepartment: "医卫拓展部",
      biddingUnitArea: "浙江省温州市",
      attachment: "招标文件.pdf",
      isFavorite: false,
      currentOperators: ["钱八", "孙九"],
      enterpriseName: "中国移动浙江公司",
      areaGroup: "温州",
      attachmentCount: 3,
    },
    {
      id: 4,
      groupDispatchTime: "2025-01-18",
      city: "嘉兴",
      district: "南湖区",
      businessInfoCode: "SQ20250118004",
      projectCode: "PRJ2025004",
      projectName: "嘉兴市数字化政务平台项目",
      businessInfoStatus: "已关联商机",
      currentOperationStep: "关联商机",
      currentOperationRole: "客户经理",
      currentOperator: "周十",
      accountManager: "吴十一",
      groupBusinessCode: "GBC20250118004",
      businessName: "数字化政务商机",
      groupBusinessTime: "2025-01-18 16:00:00",
      dataType: "中标",
      biddingAmount: "1800",
      biddingPublishTime: "2024-12-25",
      openingTime: "2025-01-18",
      biddingDeadline: "2025-01-15",
      winningTime: "2025-01-18",
      biddingUnit: "嘉兴市政府办公室",
      companyDispatchName: "浙江电信",
      winningUnit: "中国电信嘉兴分公司",
      operatorLabel: "电信",
      projectType: "智慧政务",
      controlDepartment: "政企部",
      biddingUnitArea: "浙江省嘉兴市",
      attachment: "中标合同.pdf",
      isFavorite: true,
      currentOperators: ["周十"],
      enterpriseName: "中国电信浙江公司",
      areaGroup: "嘉兴",
      attachmentCount: 1,
    },
    {
      id: 5,
      groupDispatchTime: "2025-01-19",
      city: "绍兴",
      district: "越城区",
      businessInfoCode: "SQ20250119005",
      projectCode: "PRJ2025005",
      projectName: "绍兴市智慧交通信号系统升级项目",
      businessInfoStatus: "已回退集团",
      currentOperationStep: "回退集团",
      currentOperationRole: "区县管理员",
      currentOperator: "郑十二",
      accountManager: "冯十三",
      groupBusinessCode: "",
      businessName: "",
      groupBusinessTime: "",
      dataType: "招标",
      biddingAmount: "950",
      biddingPublishTime: "2025-01-15",
      openingTime: "2025-02-25",
      biddingDeadline: "2025-02-20",
      winningTime: "",
      biddingUnit: "绍兴市公安局交通警察支队",
      companyDispatchName: "浙江联通",
      winningUnit: "",
      operatorLabel: "联通、移动",
      projectType: "智慧交通",
      controlDepartment: "交通物流拓展部",
      biddingUnitArea: "浙江省绍兴市",
      attachment: "",
      isFavorite: false,
      currentOperators: ["郑十二"],
      enterpriseName: "中国联通浙江省分公司",
      areaGroup: "绍兴",
      attachmentCount: 0,
    },
  ];

  const handleReset = () => {
    setSearchForm({
      businessInfoCode: "",
      projectName: "",
      projectCode: "",
      biddingUnit: "",
      industryType: "",
      businessInfoStatus: "",
      controlDepartment: "",
      businessInfoArea: "",
      dataType: "",
      operatorLabel: "",
      groupDispatchTimeStart: "",
      groupDispatchTimeEnd: "",
      biddingAmountMin: "",
      biddingAmountMax: "",
      biddingPublishTime: "",
      winningTime: "",
      currentOperationStep: "",
      currentOperationRole: "",
    });
  };

  const handleFirstLevelChange = (value: string) => {
    setFirstLevelFilter(value);
    setSecondLevelFilter("");
  };

  const handleFollow = (row: Record<string, unknown>) => {
    console.log("关注商情:", row);
  };

  const handleViewDetail = (row: Record<string, unknown>) => {
    setSelectedRow(row);
    setIsDetailModalOpen(true);
  };

  const handleViewFlow = (row: Record<string, unknown>) => {
    setSelectedRow(row);
    setIsFlowModalOpen(true);
  };

  const handleLinkOpportunity = (opp: { id: string; code: string; name: string }) => {
    console.log("关联商机:", opp, selectedRow);
    if (selectedRow) {
      setSelectedRow({ ...selectedRow, groupBusinessCode: opp.code, businessName: opp.name });
    }
    setIsLinkOppModalOpen(false);
  };

  const statusBadgeClass = (status: string) => {
    if (status === "未处理") return "bg-orange-100 text-orange-700";
    if (status === "转商机") return "bg-blue-100 text-blue-700";
    return "bg-green-100 text-green-700";
  };

  const setField = (key: keyof SearchForm, value: string) => {
    setSearchForm(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col h-full w-full p-4">
      {/* 顶部过滤标签页 */}
      <div className="bg-white rounded-lg shadow-sm mb-4">
        <div className="flex items-center gap-2 px-4 py-3 border-b">
          {firstLevelFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleFirstLevelChange(filter.value)}
              className={`px-4 py-2 rounded text-sm flex items-center gap-2 transition-colors ${
                firstLevelFilter === filter.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span>{filter.label}</span>
              <span className={`text-xs ${firstLevelFilter === filter.value ? "text-blue-100" : "text-gray-500"}`}>
                ({filter.count})
              </span>
            </button>
          ))}
        </div>

        {currentSecondFilters.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b overflow-x-auto">
            {currentSecondFilters.map((subFilter) => (
              <button
                key={subFilter.value}
                onClick={() => setSecondLevelFilter(subFilter.value)}
                className={`px-3 py-1.5 rounded text-xs flex items-center gap-2 whitespace-nowrap ${
                  secondLevelFilter === subFilter.value
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-300"
                }`}
              >
                <span>{subFilter.label}</span>
                <span className={`text-xs ${secondLevelFilter === subFilter.value ? "text-blue-100" : "text-gray-400"}`}>
                  ({subFilter.count})
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 主内容区 */}
      <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
        {/* 查询条件 */}
        <div className="p-4 border-b mb-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">商情编号</label>
              <input
                type="text"
                value={searchForm.businessInfoCode}
                onChange={(e) => setField("businessInfoCode", e.target.value)}
                className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="请输入"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">项目名称</label>
              <input
                type="text"
                value={searchForm.projectName}
                onChange={(e) => setField("projectName", e.target.value)}
                className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="请输入"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">项目编码</label>
              <input
                type="text"
                value={searchForm.projectCode}
                onChange={(e) => setField("projectCode", e.target.value)}
                className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="请输入"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">招标单位</label>
              <input
                type="text"
                value={searchForm.biddingUnit}
                onChange={(e) => setField("biddingUnit", e.target.value)}
                className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="请输入"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">行业类型</label>
              <input
                type="text"
                value={searchForm.industryType}
                onChange={(e) => setField("industryType", e.target.value)}
                className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="请输入"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">商情状态</label>
              <select
                value={searchForm.businessInfoStatus}
                onChange={(e) => setField("businessInfoStatus", e.target.value)}
                className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">全部</option>
                <option value="unprocessed">未处理</option>
                <option value="to-opportunity">转商机</option>
                <option value="related">已关联</option>
                <option value="returned">已退回</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">管控部门</label>
              <input
                type="text"
                value={searchForm.controlDepartment}
                onChange={(e) => setField("controlDepartment", e.target.value)}
                className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="请输入"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">商情区域</label>
              <input
                type="text"
                value={searchForm.businessInfoArea}
                onChange={(e) => setField("businessInfoArea", e.target.value)}
                className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="请输入"
              />
            </div>

            {showMoreFilters && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-600">数据类型</label>
                  <input
                    type="text"
                    value={searchForm.dataType}
                    onChange={(e) => setField("dataType", e.target.value)}
                    className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="请输入"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-600">运营商标签</label>
                  <input
                    type="text"
                    value={searchForm.operatorLabel}
                    onChange={(e) => setField("operatorLabel", e.target.value)}
                    className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="请输入"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-600">集团派发时间</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="date"
                      value={searchForm.groupDispatchTimeStart}
                      onChange={(e) => setField("groupDispatchTimeStart", e.target.value)}
                      className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-500">-</span>
                    <input
                      type="date"
                      value={searchForm.groupDispatchTimeEnd}
                      onChange={(e) => setField("groupDispatchTimeEnd", e.target.value)}
                      className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-600">招标/中标金额(万)</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={searchForm.biddingAmountMin}
                      onChange={(e) => setField("biddingAmountMin", e.target.value)}
                      className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="最小"
                    />
                    <span className="text-xs text-gray-500">-</span>
                    <input
                      type="text"
                      value={searchForm.biddingAmountMax}
                      onChange={(e) => setField("biddingAmountMax", e.target.value)}
                      className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="最大"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-600">招标发布时间</label>
                  <input
                    type="date"
                    value={searchForm.biddingPublishTime}
                    onChange={(e) => setField("biddingPublishTime", e.target.value)}
                    className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-600">中标时间</label>
                  <input
                    type="date"
                    value={searchForm.winningTime}
                    onChange={(e) => setField("winningTime", e.target.value)}
                    className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-600">当前操作步骤</label>
                  <input
                    type="text"
                    value={searchForm.currentOperationStep}
                    onChange={(e) => setField("currentOperationStep", e.target.value)}
                    className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="请输入"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-600">当前操作角色</label>
                  <select
                    value={searchForm.currentOperationRole}
                    onChange={(e) => setField("currentOperationRole", e.target.value)}
                    className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="all">全部</option>
                    <option value="province">省管理员</option>
                    <option value="city">地市管理员</option>
                    <option value="district">区县管理员</option>
                    <option value="manager">客户经理</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => console.log("搜索参数:", searchForm)}
                className="px-4 py-1.5 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 flex items-center gap-1"
              >
                <Search className="w-4 h-4" />
                查询
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-1.5 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                重置
              </button>
            </div>
            <button
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className="px-4 py-1.5 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              {showMoreFilters ? (
                <><ChevronUp className="w-4 h-4" />收起</>
              ) : (
                <><ChevronDown className="w-4 h-4" />更多</>
              )}
            </button>
          </div>
        </div>

        {/* 表格 */}
        <div className="flex-1 overflow-auto bg-white">
          <div style={{ minWidth: '100%' }}>
            <table className="divide-y divide-gray-200" style={{ tableLayout: "fixed", minWidth: "2800px" }}>

              <thead className="sticky top-0 bg-gray-100 z-20">
                <tr className="divide-x divide-gray-300">
                  <th
                    colSpan={6}
                    className="px-3 py-3 text-center text-gray-700 font-medium bg-blue-50 sticky left-0 z-30"
                    style={{ width: 640, minWidth: 640 }}
                  >
                    商情基本信息
                  </th>
                  <th
                    colSpan={8}
                    className="px-3 py-3 text-center text-gray-700 font-medium bg-green-50"
                  >
                    商情处理信息
                  </th>
                  <th
                    colSpan={16}
                    className="px-3 py-3 text-center text-gray-700 font-medium bg-yellow-50"
                  >
                    商情信息
                  </th>
                  <th
                    rowSpan={2}
                    className="px-3 py-3 text-center text-gray-700 font-medium bg-gray-100 sticky right-0 z-30"
                    style={{ width: columnWidths.actions, minWidth: columnWidths.actions }}
                  >
                    操作
                  </th>
                </tr>

                <tr className="divide-x divide-gray-300">
                  <th style={{ width: columnWidths.groupDispatchTime, minWidth: columnWidths.groupDispatchTime }} className="px-3 py-3 text-left text-gray-700 font-medium whitespace-nowrap sticky left-0 bg-blue-50 z-30 relative select-none">
                    <div className="pr-3">集团派发时间</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'groupDispatchTime', columnWidths.groupDispatchTime)} />
                  </th>
                  <th style={{ width: columnWidths.city, minWidth: columnWidths.city }} className="px-3 py-3 text-left text-gray-700 font-medium whitespace-nowrap sticky left-[96px] bg-blue-50 z-30 relative select-none">
                    <div className="pr-3">地市</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'city', columnWidths.city)} />
                  </th>
                  <th style={{ width: columnWidths.district, minWidth: columnWidths.district }} className="px-3 py-3 text-left text-gray-700 font-medium whitespace-nowrap sticky left-[160px] bg-blue-50 z-30 relative select-none">
                    <div className="pr-3">区县</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'district', columnWidths.district)} />
                  </th>
                  <th style={{ width: columnWidths.businessInfoCode, minWidth: columnWidths.businessInfoCode }} className="px-3 py-3 text-left text-gray-700 font-medium whitespace-nowrap sticky left-[224px] bg-blue-50 z-30 relative select-none">
                    <div className="pr-3">商情编号</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'businessInfoCode', columnWidths.businessInfoCode)} />
                  </th>
                  <th style={{ width: columnWidths.projectCode, minWidth: columnWidths.projectCode }} className="px-3 py-3 text-left text-gray-700 font-medium whitespace-nowrap sticky left-[336px] bg-blue-50 z-30 relative select-none">
                    <div className="pr-3">项目编码</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'projectCode', columnWidths.projectCode)} />
                  </th>
                  <th style={{ width: columnWidths.projectName, minWidth: columnWidths.projectName }} className="px-3 py-3 text-left text-gray-700 font-medium whitespace-nowrap sticky left-[448px] bg-blue-50 z-30 relative select-none">
                    <div className="pr-3">项目名称</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'projectName', columnWidths.projectName)} />
                  </th>
                  <th style={{ width: columnWidths.businessInfoStatus, minWidth: columnWidths.businessInfoStatus }} className="px-3 py-3 text-left text-gray-700 font-medium whitespace-nowrap bg-green-50 relative select-none">
                    <div className="pr-3">商情状态</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'businessInfoStatus', columnWidths.businessInfoStatus)} />
                  </th>
                  <th style={{ width: columnWidths.currentOperationStep, minWidth: columnWidths.currentOperationStep }} className="px-3 py-3 text-left text-gray-700 font-medium whitespace-nowrap bg-green-50 relative select-none">
                    <div className="pr-3">当前操作步骤</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'currentOperationStep', columnWidths.currentOperationStep)} />
                  </th>
                  <th style={{ width: columnWidths.currentOperationRole, minWidth: columnWidths.currentOperationRole }} className="px-3 py-3 text-left text-gray-700 font-medium whitespace-nowrap bg-green-50 relative select-none">
                    <div className="pr-3">当前操作角色</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'currentOperationRole', columnWidths.currentOperationRole)} />
                  </th>
                  <th style={{ width: columnWidths.currentOperator, minWidth: columnWidths.currentOperator }} className="px-3 py-3 text-left text-gray-700 font-medium whitespace-nowrap bg-green-50 relative select-none">
                    <div className="pr-3">当前操作人</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'currentOperator', columnWidths.currentOperator)} />
                  </th>
                  <th style={{ width: columnWidths.accountManager, minWidth: columnWidths.accountManager }} className="px-3 py-3 text-left text-gray-700 font-medium whitespace-nowrap bg-green-50 relative select-none">
                    <div className="pr-3">客户经理</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'accountManager', columnWidths.accountManager)} />
                  </th>
                  <th style={{ width: columnWidths.groupBusinessCode, minWidth: columnWidths.groupBusinessCode }} className="px-3 py-3 text-left text-gray-700 font-medium whitespace-nowrap bg-green-50 relative select-none">
                    <div className="pr-3">集团商机编码</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'groupBusinessCode', columnWidths.groupBusinessCode)} />
                  </th>
                  <th style={{ width: columnWidths.businessName, minWidth: columnWidths.businessName }} className="px-3 py-3 text-left text-gray-700 font-medium whitespace-nowrap bg-green-50 relative select-none">
                    <div className="pr-3">商机名称</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'businessName', columnWidths.businessName)} />
                  </th>
                  <th style={{ width: columnWidths.groupBusinessTime, minWidth: columnWidths.groupBusinessTime }} className="px-3 py-3 text-left text-gray-700 font-medium whitespace-nowrap bg-green-50 relative select-none">
                    <div className="pr-3">集团商机编码时间</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'groupBusinessTime', columnWidths.groupBusinessTime)} />
                  </th>
                  <th style={{ width: columnWidths.dataType, minWidth: columnWidths.dataType }} className="px-3 py-3 text-left text-gray-700 font-medium whitespace-nowrap bg-yellow-50 relative select-none">
                    <div className="pr-3">数据类型</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'dataType', columnWidths.dataType)} />
                  </th>
                  <th style={{ width: columnWidths.biddingAmount, minWidth: columnWidths.biddingAmount }} className="px-3 py-3 text-right text-gray-700 font-medium whitespace-nowrap bg-yellow-50 relative select-none">
                    <div className="pr-3">招标/中标金额(万)</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'biddingAmount', columnWidths.biddingAmount)} />
                  </th>
                  <th style={{ width: columnWidths.biddingPublishTime, minWidth: columnWidths.biddingPublishTime }} className="px-3 py-3 text-left text-gray-700 font-medium whitespace-nowrap bg-yellow-50 relative select-none">
                    <div className="pr-3">招标发布时间</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'biddingPublishTime', columnWidths.biddingPublishTime)} />
                  </th>
                  <th style={{ width: columnWidths.openingTime, minWidth: columnWidths.openingTime }} className="px-3 py-3 text-left text-gray-700 font-medium whitespace-nowrap bg-yellow-50 relative select-none">
                    <div className="pr-3">开标时间</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'openingTime', columnWidths.openingTime)} />
                  </th>
                  <th style={{ width: columnWidths.biddingDeadline, minWidth: columnWidths.biddingDeadline }} className="px-3 py-3 text-left text-gray-700 font-medium whitespace-nowrap bg-yellow-50 relative select-none">
                    <div className="pr-3">招标截至时间</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'biddingDeadline', columnWidths.biddingDeadline)} />
                  </th>
                  <th style={{ width: columnWidths.winningTime, minWidth: columnWidths.winningTime }} className="px-3 py-3 text-left text-gray-700 font-medium whitespace-nowrap bg-yellow-50 relative select-none">
                    <div className="pr-3">中标时间</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'winningTime', columnWidths.winningTime)} />
                  </th>
                  <th style={{ width: columnWidths.biddingUnit, minWidth: columnWidths.biddingUnit }} className="px-3 py-3 text-left text-gray-700 font-medium whitespace-nowrap bg-yellow-50 relative select-none">
                    <div className="pr-3">招标单位</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'biddingUnit', columnWidths.biddingUnit)} />
                  </th>
                  <th style={{ width: columnWidths.companyDispatchName, minWidth: columnWidths.companyDispatchName }} className="px-3 py-3 text-left text-gray-700 font-medium whitespace-nowrap bg-yellow-50 relative select-none">
                    <div className="pr-3">企业派发名称</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'companyDispatchName', columnWidths.companyDispatchName)} />
                  </th>
                  <th style={{ width: columnWidths.winningUnit, minWidth: columnWidths.winningUnit }} className="px-3 py-3 text-left text-gray-700 font-medium whitespace-nowrap bg-yellow-50 relative select-none">
                    <div className="pr-3">中标单位</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'winningUnit', columnWidths.winningUnit)} />
                  </th>
                  <th style={{ width: columnWidths.operatorLabel, minWidth: columnWidths.operatorLabel }} className="px-3 py-3 text-left text-gray-700 font-medium whitespace-nowrap bg-yellow-50 relative select-none">
                    <div className="pr-3">运营商标签</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'operatorLabel', columnWidths.operatorLabel)} />
                  </th>
                  <th style={{ width: columnWidths.projectType, minWidth: columnWidths.projectType }} className="px-3 py-3 text-left text-gray-700 font-medium whitespace-nowrap bg-yellow-50 relative select-none">
                    <div className="pr-3">项目类型</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'projectType', columnWidths.projectType)} />
                  </th>
                  <th style={{ width: columnWidths.controlDepartment, minWidth: columnWidths.controlDepartment }} className="px-3 py-3 text-left text-gray-700 font-medium whitespace-nowrap bg-yellow-50 relative select-none">
                    <div className="pr-3">管控部门</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'controlDepartment', columnWidths.controlDepartment)} />
                  </th>
                  <th style={{ width: columnWidths.biddingUnitArea, minWidth: columnWidths.biddingUnitArea }} className="px-3 py-3 text-left text-gray-700 font-medium whitespace-nowrap bg-yellow-50 relative select-none">
                    <div className="pr-3">招标单位所属区域</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'biddingUnitArea', columnWidths.biddingUnitArea)} />
                  </th>
                  <th style={{ width: columnWidths.attachment, minWidth: columnWidths.attachment }} className="px-3 py-3 text-left text-gray-700 font-medium whitespace-nowrap bg-yellow-50 relative select-none">
                    <div className="pr-3">附件</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'attachment', columnWidths.attachment)} />
                  </th>
                  <th style={{ width: columnWidths.enterpriseName, minWidth: columnWidths.enterpriseName }} className="px-3 py-3 text-left text-gray-700 font-medium whitespace-nowrap bg-yellow-50 relative select-none">
                    <div className="pr-3">企业派发名称</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'enterpriseName', columnWidths.enterpriseName)} />
                  </th>
                  <th style={{ width: columnWidths.areaGroup, minWidth: columnWidths.areaGroup }} className="px-3 py-3 text-left text-gray-700 font-medium whitespace-nowrap bg-yellow-50 relative select-none">
                    <div className="pr-3">区域分组</div>
                    <div className="absolute inset-y-0 right-0 cursor-col-resize hover:bg-blue-300 active:bg-blue-400 transition-colors" style={{ width: '6px' }} onMouseDown={(e) => handleResizeStart(e, 'areaGroup', columnWidths.areaGroup)} />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {mockData.map((row) => (
                  <tr key={row.id} className="divide-x divide-gray-100 hover:bg-gray-50">
                    <td style={{ width: columnWidths.groupDispatchTime, minWidth: columnWidths.groupDispatchTime }} className="px-3 py-3 text-gray-700 text-sm whitespace-nowrap sticky left-0 bg-white z-10">
                      {row.groupDispatchTime}
                    </td>
                    <td style={{ width: columnWidths.city, minWidth: columnWidths.city }} className="px-3 py-3 text-gray-700 text-sm whitespace-nowrap sticky left-[96px] bg-white z-10">{row.city}</td>
                    <td style={{ width: columnWidths.district, minWidth: columnWidths.district }} className="px-3 py-3 text-gray-700 text-sm whitespace-nowrap sticky left-[160px] bg-white z-10">{row.district}</td>
                    <td style={{ width: columnWidths.businessInfoCode, minWidth: columnWidths.businessInfoCode }} className="px-3 py-3 text-blue-600 text-sm whitespace-nowrap sticky left-[224px] bg-white z-10">
                      {row.businessInfoCode}
                    </td>
                    <td style={{ width: columnWidths.projectCode, minWidth: columnWidths.projectCode }} className="px-3 py-3 text-gray-700 text-sm whitespace-nowrap sticky left-[336px] bg-white z-10">
                      {row.projectCode}
                    </td>
                    <td style={{ width: columnWidths.projectName, minWidth: columnWidths.projectName }} className="px-3 py-3 text-gray-700 text-sm whitespace-nowrap sticky left-[448px] bg-white z-10" title={row.projectName}>
                      <div className="w-48 truncate">{row.projectName}</div>
                    </td>
                    <td style={{ width: columnWidths.businessInfoStatus, minWidth: columnWidths.businessInfoStatus }} className="px-3 py-3 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 text-xs rounded ${statusBadgeClass(row.businessInfoStatus)}`}>
                        {row.businessInfoStatus}
                      </span>
                    </td>
                    <td style={{ width: columnWidths.currentOperationStep, minWidth: columnWidths.currentOperationStep }} className="px-3 py-3 whitespace-nowrap">
                      <button onClick={() => handleViewFlow(row)} className="text-blue-600 hover:underline">
                        {row.currentOperationStep}
                      </button>
                    </td>
                    <td style={{ width: columnWidths.currentOperationRole, minWidth: columnWidths.currentOperationRole }} className="px-3 py-3 text-gray-700 whitespace-nowrap">{row.currentOperationRole}</td>
                    <td style={{ width: columnWidths.currentOperator, minWidth: columnWidths.currentOperator }} className="px-3 py-3 text-gray-700 whitespace-nowrap" title={row.currentOperator}>
                      {row.currentOperator.length > 10 ? `${row.currentOperator.substring(0, 10)}...` : row.currentOperator}
                    </td>
                    <td style={{ width: columnWidths.accountManager, minWidth: columnWidths.accountManager }} className="px-3 py-3 text-gray-700 whitespace-nowrap">{row.accountManager}</td>
                    <td style={{ width: columnWidths.groupBusinessCode, minWidth: columnWidths.groupBusinessCode }} className="px-3 py-3 text-gray-700 whitespace-nowrap">{row.groupBusinessCode}</td>
                    <td style={{ width: columnWidths.businessName, minWidth: columnWidths.businessName }} className="px-3 py-3 text-gray-700 whitespace-nowrap">{row.businessName}</td>
                    <td style={{ width: columnWidths.groupBusinessTime, minWidth: columnWidths.groupBusinessTime }} className="px-3 py-3 text-gray-700 whitespace-nowrap">{row.groupBusinessTime}</td>
                    <td style={{ width: columnWidths.dataType, minWidth: columnWidths.dataType }} className="px-3 py-3 text-gray-700 whitespace-nowrap">{row.dataType}</td>
                    <td style={{ width: columnWidths.biddingAmount, minWidth: columnWidths.biddingAmount }} className="px-3 py-3 text-right text-gray-700 whitespace-nowrap">{row.biddingAmount}</td>
                    <td style={{ width: columnWidths.biddingPublishTime, minWidth: columnWidths.biddingPublishTime }} className="px-3 py-3 text-gray-700 whitespace-nowrap">{row.biddingPublishTime}</td>
                    <td style={{ width: columnWidths.openingTime, minWidth: columnWidths.openingTime }} className="px-3 py-3 text-gray-700 whitespace-nowrap">{row.openingTime}</td>
                    <td style={{ width: columnWidths.biddingDeadline, minWidth: columnWidths.biddingDeadline }} className="px-3 py-3 text-gray-700 whitespace-nowrap">{row.biddingDeadline}</td>
                    <td style={{ width: columnWidths.winningTime, minWidth: columnWidths.winningTime }} className="px-3 py-3 text-gray-700 whitespace-nowrap">{row.winningTime || "-"}</td>
                    <td style={{ width: columnWidths.biddingUnit, minWidth: columnWidths.biddingUnit }} className="px-3 py-3 text-gray-700 whitespace-nowrap">{row.biddingUnit}</td>
                    <td style={{ width: columnWidths.companyDispatchName, minWidth: columnWidths.companyDispatchName }} className="px-3 py-3 text-gray-700 whitespace-nowrap">{row.companyDispatchName}</td>
                    <td style={{ width: columnWidths.winningUnit, minWidth: columnWidths.winningUnit }} className="px-3 py-3 text-gray-700 whitespace-nowrap">{row.winningUnit || "-"}</td>
                    <td style={{ width: columnWidths.operatorLabel, minWidth: columnWidths.operatorLabel }} className="px-3 py-3 text-gray-700 whitespace-nowrap">{row.operatorLabel}</td>
                    <td style={{ width: columnWidths.projectType, minWidth: columnWidths.projectType }} className="px-3 py-3 text-gray-700 whitespace-nowrap">{row.projectType}</td>
                    <td style={{ width: columnWidths.controlDepartment, minWidth: columnWidths.controlDepartment }} className="px-3 py-3 text-gray-700 whitespace-nowrap">{row.controlDepartment}</td>
                    <td style={{ width: columnWidths.biddingUnitArea, minWidth: columnWidths.biddingUnitArea }} className="px-3 py-3 text-gray-700 whitespace-nowrap">{row.biddingUnitArea}</td>
                    <td style={{ width: columnWidths.attachment, minWidth: columnWidths.attachment }} className="px-3 py-3 text-blue-600 whitespace-nowrap">
                      <a href="#" className="hover:underline">{row.attachment || (row.attachmentCount ? `${row.attachmentCount}个附件` : '-')}</a>
                    </td>
                    <td style={{ width: columnWidths.enterpriseName, minWidth: columnWidths.enterpriseName }} className="px-3 py-3 text-gray-700 whitespace-nowrap">{row.enterpriseName || row.companyDispatchName}</td>
                    <td style={{ width: columnWidths.areaGroup, minWidth: columnWidths.areaGroup }} className="px-3 py-3 text-gray-700 whitespace-nowrap">{row.areaGroup || '-'}</td>
                    <td style={{ width: columnWidths.actions, minWidth: columnWidths.actions }} className="px-3 py-3 whitespace-nowrap sticky right-0 bg-white z-10">
                      <div className="flex gap-1">
                        <button onClick={() => handleFollow(row)} className={`px-2 py-1 text-xs ${row.isFavorite ? 'text-orange-500' : 'text-blue-600'} hover:opacity-80`}>
                          {row.isFavorite ? '★ 已关注' : '☆ 关注'}
                        </button>
                        <button onClick={() => handleViewDetail(row)} className="px-2 py-1 text-xs text-blue-600 hover:text-blue-700">详情</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <span className="text-sm text-gray-600">共 {mockData.length} 条</span>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">10条/页</span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">1</button>
              <span className="text-sm text-gray-600">共1页</span>
              <button className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">&lt;</button>
              <button className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">&gt;</button>
            </div>
          </div>
        </div>
      </div>

      {isDetailModalOpen && selectedRow && (
        <BusinessInfoModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          data={selectedRow}
          initialTab="detail"
          onLinkOpportunity={() => setIsLinkOppModalOpen(true)}
        />
      )}
      {isFlowModalOpen && selectedRow && (
        <BusinessInfoModal
          isOpen={isFlowModalOpen}
          onClose={() => setIsFlowModalOpen(false)}
          data={selectedRow}
          initialTab="flow"
          onLinkOpportunity={() => setIsLinkOppModalOpen(true)}
        />
      )}
      <LinkOpportunityDialog
        open={isLinkOppModalOpen}
        onClose={() => setIsLinkOppModalOpen(false)}
        businessInfo={selectedRow || {}}
        onLink={handleLinkOpportunity}
      />
    </div>
  );
}
