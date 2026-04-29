import React, { useState, useCallback, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { ArrowUpDown, ArrowUp, ArrowDown, RotateCcw } from "lucide-react";

// 专家调用清单 mock 数据
const expertCallListData = [
  { id: 1, taskName: "XX项目技术支持", dispatcher: "张明", dispatcherDept: "政企客户部", dispatcherPhone: "138****1234", dispatchTime: "2026-03-01 09:30", invitedExpert: "李华", expertDept: "解决方案部", expertPhone: "139****5678", acceptStatus: "已接单", acceptTime: "2026-03-01 10:00", actuallyJoined: "是", joinTime: "2026-03-05 14:00", customerName: "杭州XX科技有限公司", customerCode: "KH-2026-001", opportunityName: "XX单位信息化建设采购", opportunityCode: "CG-2026-001" },
  { id: 2, taskName: "YY项目方案评审", dispatcher: "王芳", dispatcherDept: "解决方案部", dispatcherPhone: "137****9012", dispatchTime: "2026-03-02 14:20", invitedExpert: "赵强", expertDept: "项目管理部", expertPhone: "136****3456", acceptStatus: "已接单", acceptTime: "2026-03-02 15:00", actuallyJoined: "是", joinTime: "2026-03-08 10:00", customerName: "杭州YY科技有限公司", customerCode: "KH-2026-002", opportunityName: "YY学校智慧校园建设", opportunityCode: "CG-2026-002" },
  { id: 3, taskName: "ZZ项目技术咨询", dispatcher: "李华", dispatcherDept: "政企客户部", dispatcherPhone: "139****5678", dispatchTime: "2026-03-03 11:00", invitedExpert: "张明", expertDept: "解决方案部", expertPhone: "138****1234", acceptStatus: "未接单", acceptTime: "-", actuallyJoined: "否", joinTime: "-", customerName: "杭州ZZ科技有限公司", customerCode: "KH-2026-003", opportunityName: "ZZ医院信息化系统", opportunityCode: "CG-2026-003" },
  { id: 4, taskName: "WW项目交付支持", dispatcher: "赵强", dispatcherDept: "项目管理部", dispatcherPhone: "136****3456", dispatchTime: "2026-03-04 16:30", invitedExpert: "李华", expertDept: "解决方案部", expertPhone: "139****5678", acceptStatus: "已接单", acceptTime: "2026-03-04 17:00", actuallyJoined: "是", joinTime: "2026-03-10 09:00", customerName: "杭州WW科技有限公司", customerCode: "KH-2026-004", opportunityName: "WW政务云平台建设", opportunityCode: "CG-2026-004" },
];

// 专家统计 mock 数据
const expertStatsData = [
  { id: 1, expertName: "李华", expertDept: "解决方案部", expertPhone: "139****5678", dispatchCount: 5, applyCount: 4, acceptCount: 3, joinCount: 2, totalContribution: 86 },
  { id: 2, expertName: "张明", expertDept: "解决方案部", expertPhone: "138****1234", dispatchCount: 4, applyCount: 3, acceptCount: 3, joinCount: 2, totalContribution: 75 },
  { id: 3, expertName: "赵强", expertDept: "项目管理部", expertPhone: "136****3456", dispatchCount: 3, applyCount: 2, acceptCount: 2, joinCount: 2, totalContribution: 62 },
  { id: 4, expertName: "王芳", expertDept: "解决方案部", expertPhone: "137****9012", dispatchCount: 2, applyCount: 2, acceptCount: 2, joinCount: 1, totalContribution: 45 },
];

interface ExpertReportPageProps {
  activeTab?: "expert-call-list" | "expert-call-stats";
}

export function ExpertReportPage({ activeTab: initialTab = "expert-call-list" }: ExpertReportPageProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [showAllConditions, setShowAllConditions] = useState(false);

  // 列宽状态 - 专家调用清单
  const [callColumnWidths, setCallColumnWidths] = useState<Record<string, number>>({
    taskName: 140,
    dispatcher: 80,
    dispatcherDept: 110,
    dispatcherPhone: 110,
    dispatchTime: 140,
    invitedExpert: 80,
    expertDept: 110,
    expertPhone: 110,
    acceptStatus: 80,
    acceptTime: 140,
    actuallyJoined: 90,
    joinTime: 140,
    customerName: 150,
    customerCode: 120,
    opportunityName: 160,
    opportunityCode: 120,
  });

  // 列宽状态 - 专家统计
  const [statsColumnWidths, setStatsColumnWidths] = useState<Record<string, number>>({
    expertName: 100,
    expertDept: 120,
    expertPhone: 110,
    dispatchCount: 120,
    applyCount: 120,
    acceptCount: 100,
    joinCount: 110,
    totalContribution: 120,
  });

  // 拖拽状态
  const [resizing, setResizing] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);
  const [resizeTarget, setResizeTarget] = useState<"call" | "stats" | null>(null);

  const handleResizeStart = (
    e: React.MouseEvent,
    columnId: string,
    startWidth: number,
    target: "call" | "stats"
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setResizing(columnId);
    setResizeStartX(e.clientX);
    setResizeStartWidth(startWidth);
    setResizeTarget(target);
  };

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!resizing || !resizeTarget) return;
    const diff = e.clientX - resizeStartX;
    const newWidth = Math.max(50, resizeStartWidth + diff);
    if (resizeTarget === "call") {
      setCallColumnWidths(prev => ({ ...prev, [resizing]: newWidth }));
    } else {
      setStatsColumnWidths(prev => ({ ...prev, [resizing]: newWidth }));
    }
  }, [resizing, resizeStartX, resizeStartWidth, resizeTarget]);

  const handleResizeEnd = useCallback(() => {
    setResizing(null);
    setResizeTarget(null);
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

  // 专家调用清单查询条件
  const [callParams, setCallParams] = useState({
    dispatchTimeStart: "",
    dispatchTimeEnd: "",
    acceptTimeStart: "",
    acceptTimeEnd: "",
    expertName: "",
    dispatcher: "",
    acceptStatus: "",
    joinStatus: "",
    customerName: "",
    opportunityName: "",
    opportunityCode: "",
  });

  // 专家统计查询条件
  const [statsParams, setStatsParams] = useState({
    dispatchTimeStart: "",
    dispatchTimeEnd: "",
    acceptTimeStart: "",
    acceptTimeEnd: "",
    expertName: "",
    contributionMin: "",
    contributionMax: "",
  });

  // 排序状态
  const [sortField, setSortField] = useState<string>("dispatchCount");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const handleCallQuery = () => {
    console.log("查询专家调用清单", callParams);
  };

  const handleStatsQuery = () => {
    console.log("查询专家统计", statsParams);
  };

  const handleCallReset = () => {
    setCallParams({
      dispatchTimeStart: "",
      dispatchTimeEnd: "",
      acceptTimeStart: "",
      acceptTimeEnd: "",
      expertName: "",
      dispatcher: "",
      acceptStatus: "",
      joinStatus: "",
      customerName: "",
      opportunityName: "",
      opportunityCode: "",
    });
  };

  const handleStatsReset = () => {
    setStatsParams({
      dispatchTimeStart: "",
      dispatchTimeEnd: "",
      acceptTimeStart: "",
      acceptTimeEnd: "",
      expertName: "",
      contributionMin: "",
      contributionMax: "",
    });
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const sortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 text-gray-300" />;
    return sortDir === "asc" ? <ArrowUp className="w-3 h-3 text-blue-500" /> : <ArrowDown className="w-3 h-3 text-blue-500" />;
  };

  const sortedStats = [...expertStatsData].sort((a, b) => {
    const aVal = a[sortField as keyof typeof a] as number;
    const bVal = b[sortField as keyof typeof b] as number;
    return sortDir === "asc" ? aVal - bVal : bVal - aVal;
  });

  // 生成可拖动表头单元格
  const callTh = (id: string, label: string, sortable = false) => (
    <th
      key={id}
      style={{ width: callColumnWidths[id], minWidth: callColumnWidths[id] }}
      className="px-3 py-3 text-center text-sm font-medium text-gray-700 relative select-none"
    >
      <div className={sortable ? "flex items-center justify-center gap-1 cursor-pointer" : "flex items-center justify-center"}>
        {label}
      </div>
      <div
        className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-200 transition-colors"
        onMouseDown={(e) => handleResizeStart(e, id, callColumnWidths[id], "call")}
      />
    </th>
  );

  const statsTh = (id: string, label: string, sortable = false, extraContent?: React.ReactNode) => (
    <th
      key={id}
      style={{ width: statsColumnWidths[id], minWidth: statsColumnWidths[id] }}
      className="px-3 py-3 text-center text-sm font-medium text-gray-700 relative select-none"
    >
      <div className={sortable ? "flex items-center justify-center gap-1 cursor-pointer" : "flex items-center justify-center"}>
        {label}
        {extraContent}
      </div>
      <div
        className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-200 transition-colors"
        onMouseDown={(e) => handleResizeStart(e, id, statsColumnWidths[id], "stats")}
      />
    </th>
  );

  const callTd = (id: string, content: React.ReactNode) => (
    <td
      key={id}
      style={{ width: callColumnWidths[id], minWidth: callColumnWidths[id] }}
      className="px-3 py-3 text-sm text-gray-900"
    >
      {content}
    </td>
  );

  const statsTd = (id: string, content: React.ReactNode) => (
    <td
      key={id}
      style={{ width: statsColumnWidths[id], minWidth: statsColumnWidths[id] }}
      className="px-3 py-3 text-sm text-gray-900"
    >
      {content}
    </td>
  );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 标题区 */}
      <div className="px-6 pt-6 pb-4 flex-shrink-0">
        <h2 className="text-lg font-medium text-gray-900">专家调用报表</h2>
        <p className="text-sm text-gray-500 mt-1">专家调用清单与统计查询</p>
      </div>

      {/* Tab 切换 */}
      <div className="px-6 flex-shrink-0">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("expert-call-list")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "expert-call-list"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            专家调用清单
          </button>
          <button
            onClick={() => setActiveTab("expert-call-stats")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "expert-call-stats"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            专家调用统计
          </button>
        </div>
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        {activeTab === "expert-call-list" ? (
          <div className="mt-4 space-y-4">
            {/* 查询条件卡片 */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">派单时间</label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={callParams.dispatchTimeStart}
                      onChange={(e) => setCallParams({ ...callParams, dispatchTimeStart: e.target.value })}
                    />
                    <span className="self-center text-gray-400">-</span>
                    <Input
                      type="date"
                      value={callParams.dispatchTimeEnd}
                      onChange={(e) => setCallParams({ ...callParams, dispatchTimeEnd: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">接单时间</label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={callParams.acceptTimeStart}
                      onChange={(e) => setCallParams({ ...callParams, acceptTimeStart: e.target.value })}
                    />
                    <span className="self-center text-gray-400">-</span>
                    <Input
                      type="date"
                      value={callParams.acceptTimeEnd}
                      onChange={(e) => setCallParams({ ...callParams, acceptTimeEnd: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">专家名称</label>
                  <Input
                    value={callParams.expertName}
                    onChange={(e) => setCallParams({ ...callParams, expertName: e.target.value })}
                    placeholder="请输入"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">派单人</label>
                  <Input
                    value={callParams.dispatcher}
                    onChange={(e) => setCallParams({ ...callParams, dispatcher: e.target.value })}
                    placeholder="请输入"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">接单状态</label>
                  <Select value={callParams.acceptStatus} onValueChange={(v) => setCallParams({ ...callParams, acceptStatus: v })}>
                    <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="已接单">已接单</SelectItem>
                      <SelectItem value="未接单">未接单</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">参与状态</label>
                  <Select value={callParams.joinStatus} onValueChange={(v) => setCallParams({ ...callParams, joinStatus: v })}>
                    <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="是">是</SelectItem>
                      <SelectItem value="否">否</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">客户名称</label>
                  <Input
                    value={callParams.customerName}
                    onChange={(e) => setCallParams({ ...callParams, customerName: e.target.value })}
                    placeholder="请输入"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">商机名称</label>
                  <Input
                    value={callParams.opportunityName}
                    onChange={(e) => setCallParams({ ...callParams, opportunityName: e.target.value })}
                    placeholder="请输入"
                  />
                </div>
              </div>

              {showAllConditions && (
                <div className="grid grid-cols-4 gap-x-6 gap-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">商机编码</label>
                    <Input
                      value={callParams.opportunityCode}
                      onChange={(e) => setCallParams({ ...callParams, opportunityCode: e.target.value })}
                      placeholder="请输入"
                    />
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
                  <Button variant="default" size="sm" onClick={handleCallQuery}>查询</Button>
                  <Button variant="outline" size="sm" onClick={handleCallReset}>
                    <RotateCcw className="w-4 h-4 mr-1" />重置
                  </Button>
                </div>
              </div>
            </div>

            {/* 表格 */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {callTh("taskName", "任务名称")}
                      {callTh("dispatcher", "派单人")}
                      {callTh("dispatcherDept", "派单人部门")}
                      {callTh("dispatcherPhone", "派单人电话")}
                      {callTh("dispatchTime", "派单时间")}
                      {callTh("invitedExpert", "邀请专家")}
                      {callTh("expertDept", "专家部门")}
                      {callTh("expertPhone", "专家电话")}
                      {callTh("acceptStatus", "是否接单")}
                      {callTh("acceptTime", "接单时间")}
                      {callTh("actuallyJoined", "实际是否参与")}
                      {callTh("joinTime", "参与时间")}
                      {callTh("customerName", "客户名称")}
                      {callTh("customerCode", "客户编码")}
                      {callTh("opportunityName", "商机名称")}
                      {callTh("opportunityCode", "商机编码")}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {expertCallListData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        {callTd("taskName", item.taskName)}
                        {callTd("dispatcher", item.dispatcher)}
                        {callTd("dispatcherDept", item.dispatcherDept)}
                        {callTd("dispatcherPhone", item.dispatcherPhone)}
                        {callTd("dispatchTime", item.dispatchTime)}
                        {callTd("invitedExpert", item.invitedExpert)}
                        {callTd("expertDept", item.expertDept)}
                        {callTd("expertPhone", item.expertPhone)}
                        {callTd("acceptStatus", (
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                            item.acceptStatus === "已接单"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {item.acceptStatus}
                          </span>
                        ))}
                        {callTd("acceptTime", item.acceptTime)}
                        {callTd("actuallyJoined", (
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                            item.actuallyJoined === "是"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            {item.actuallyJoined}
                          </span>
                        ))}
                        {callTd("joinTime", item.joinTime)}
                        {callTd("customerName", item.customerName)}
                        {callTd("customerCode", item.customerCode)}
                        {callTd("opportunityName", item.opportunityName)}
                        {callTd("opportunityCode", <span className="text-blue-600">{item.opportunityCode}</span>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {/* 查询条件卡片 */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">派单时间</label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={statsParams.dispatchTimeStart}
                      onChange={(e) => setStatsParams({ ...statsParams, dispatchTimeStart: e.target.value })}
                    />
                    <span className="self-center text-gray-400">-</span>
                    <Input
                      type="date"
                      value={statsParams.dispatchTimeEnd}
                      onChange={(e) => setStatsParams({ ...statsParams, dispatchTimeEnd: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">接单时间</label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={statsParams.acceptTimeStart}
                      onChange={(e) => setStatsParams({ ...statsParams, acceptTimeStart: e.target.value })}
                    />
                    <span className="self-center text-gray-400">-</span>
                    <Input
                      type="date"
                      value={statsParams.acceptTimeEnd}
                      onChange={(e) => setStatsParams({ ...statsParams, acceptTimeEnd: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">专家名称</label>
                  <Input
                    value={statsParams.expertName}
                    onChange={(e) => setStatsParams({ ...statsParams, expertName: e.target.value })}
                    placeholder="请输入"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">贡献度</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={statsParams.contributionMin}
                      onChange={(e) => setStatsParams({ ...statsParams, contributionMin: e.target.value })}
                      placeholder="起"
                    />
                    <span className="self-center text-gray-400">-</span>
                    <Input
                      type="number"
                      value={statsParams.contributionMax}
                      onChange={(e) => setStatsParams({ ...statsParams, contributionMax: e.target.value })}
                      placeholder="止"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end mt-4">
                <div className="flex gap-2">
                  <Button variant="default" size="sm" onClick={handleStatsQuery}>查询</Button>
                  <Button variant="outline" size="sm" onClick={handleStatsReset}>
                    <RotateCcw className="w-4 h-4 mr-1" />重置
                  </Button>
                </div>
              </div>
            </div>

            {/* 表格 */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {statsTh("expertName", "专家名称")}
                      {statsTh("expertDept", "专家部门")}
                      {statsTh("expertPhone", "专家电话")}
                      {statsTh("dispatchCount", "调用派单次数", true, sortIcon("dispatchCount"))}
                      {statsTh("applyCount", "申请接单次数", true, sortIcon("applyCount"))}
                      {statsTh("acceptCount", "接单次数", true, sortIcon("acceptCount"))}
                      {statsTh("joinCount", "实际参与次数", true, sortIcon("joinCount"))}
                      {statsTh("totalContribution", "累计总贡献度", true, sortIcon("totalContribution"))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {sortedStats.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        {statsTd("expertName", item.expertName)}
                        {statsTd("expertDept", item.expertDept)}
                        {statsTd("expertPhone", item.expertPhone)}
                        {statsTd("dispatchCount", (
                          <div className="text-center cursor-pointer" onClick={() => handleSort("dispatchCount")}>
                            {item.dispatchCount}
                          </div>
                        ))}
                        {statsTd("applyCount", (
                          <div className="text-center cursor-pointer" onClick={() => handleSort("applyCount")}>
                            {item.applyCount}
                          </div>
                        ))}
                        {statsTd("acceptCount", (
                          <div className="text-center cursor-pointer" onClick={() => handleSort("acceptCount")}>
                            {item.acceptCount}
                          </div>
                        ))}
                        {statsTd("joinCount", (
                          <div className="text-center cursor-pointer" onClick={() => handleSort("joinCount")}>
                            {item.joinCount}
                          </div>
                        ))}
                        {statsTd("totalContribution", (
                          <div className="text-center cursor-pointer text-blue-600 font-medium" onClick={() => handleSort("totalContribution")}>
                            {item.totalContribution}
                          </div>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
