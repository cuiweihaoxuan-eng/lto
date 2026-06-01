import React, { useState } from "react";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Button } from "./ui/button";
import { TabNav } from "./ui/tab-nav";
import { RotateCcw, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Textarea } from "./ui/textarea";

// 模拟数据 - 有效商机奖
const mockData = [
  { id: 1, saleOppName: "XX单位信息化建设", jtOppCode: "SJ-2026-001", custName: "XX单位", custCode: "C001", validOppAmount: 50000, oppCreateDate: "2026-01-15", custManagerName: "张三", qxName: "鄞州", zjName: "鄞州支局", auditState: "待审核" },
  { id: 2, saleOppName: "YY学校智慧校园", jtOppCode: "SJ-2026-002", custName: "YY学校", custCode: "C002", validOppAmount: 40000, oppCreateDate: "2026-01-20", custManagerName: "李四", qxName: "江北", zjName: "江北支局", auditState: "已审核" },
  { id: 3, saleOppName: "ZZ医院信息化系统", jtOppCode: "SJ-2026-003", custName: "ZZ医院", custCode: "C003", validOppAmount: 45000, oppCreateDate: "2026-02-01", custManagerName: "王五", qxName: "镇海", zjName: "镇海支局", auditState: "待审核" },
  { id: 4, saleOppName: "AA社区智慧党建", jtOppCode: "SJ-2026-004", custName: "AA社区", custCode: "C004", validOppAmount: 35000, oppCreateDate: "2026-02-10", custManagerName: "赵六", qxName: "鄞州", zjName: "鄞州支局", auditState: "已审核" },
  { id: 5, saleOppName: "BB企业数字化转型", jtOppCode: "SJ-2026-005", custName: "BB企业", custCode: "C005", validOppAmount: 60000, oppCreateDate: "2026-02-15", custManagerName: "孙七", qxName: "江北", zjName: "江北支局", auditState: "待审核" },
];

// 模拟数据 - 有效商机奖免审核设置
const mockNoAuditData = [
  { id: 1, qxName: "鄞州", zjName: "鄞州支局", exemptCount: 5, createTime: "2026-03-10 10:30", createUserName: "张三" },
  { id: 2, qxName: "鄞州", zjName: "鄞州东部分局", exemptCount: 3, createTime: "2026-03-11 14:20", createUserName: "李四" },
  { id: 3, qxName: "江北", zjName: "江北支局", exemptCount: 4, createTime: "2026-03-12 09:15", createUserName: "王五" },
  { id: 4, qxName: "江北", zjName: "江北东部分局", exemptCount: 2, createTime: "2026-03-13 16:30", createUserName: "赵六" },
  { id: 5, qxName: "镇海", zjName: "镇海支局", exemptCount: 6, createTime: "2026-03-14 11:45", createUserName: "孙七" },
];

const auditStateOptions = [
  { value: "all", label: "全部" },
  { value: "待审核", label: "待审核" },
  { value: "已审核", label: "已审核" },
];

export function EffectiveBusinessOpportunityAward() {
  const [activeTab, setActiveTab] = useState("list");
  const [formData, setFormData] = useState({
    saleOppName: "",
    jtOppCode: "",
    custName: "",
    custCode: "",
    qxId: "",
    zjId: "",
    custManagerName: "",
    auditState: "",
    oppCreateDateStart: "",
    oppCreateDateEnd: "",
  });

  // 审核弹窗状态
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);
  const [currentAuditItem, setCurrentAuditItem] = useState<typeof mockData[0] | null>(null);
  const [auditOpinion, setAuditOpinion] = useState("");

  // 免审核设置查询条件
  const [noAuditParams, setNoAuditParams] = useState({
    qxId: "",
    zjId: "",
    createUserName: "",
    countRange: "",
  });

  const handleSearch = () => {
    console.log("查询有效商机奖", formData);
  };

  const handleReset = () => {
    setFormData({
      saleOppName: "",
      jtOppCode: "",
      custName: "",
      custCode: "",
      qxId: "",
      zjId: "",
      custManagerName: "",
      auditState: "",
      oppCreateDateStart: "",
      oppCreateDateEnd: "",
    });
  };

  const handleOpenAudit = (item: typeof mockData[0]) => {
    setCurrentAuditItem(item);
    setAuditOpinion("");
    setAuditDialogOpen(true);
  };

  const handleConfirmAudit = () => {
    console.log("审核有效商机奖", { id: currentAuditItem?.id, opinion: auditOpinion });
    setAuditDialogOpen(false);
  };

  // 免审核设置查询和重置
  const handleNoAuditSearch = () => {
    console.log("查询免审核设置", noAuditParams);
  };

  const handleNoAuditReset = () => {
    setNoAuditParams({
      qxId: "",
      zjId: "",
      createUserName: "",
      countRange: "",
    });
  };

  const formatAmount = (val: number) => {
    return val?.toLocaleString() || "-";
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 标题区 */}
      <div className="px-6 pt-6 pb-4 flex-shrink-0">
        <h2 className="text-lg font-medium text-gray-900">有效商机奖</h2>
        <p className="text-sm text-gray-500 mt-1">查询和审核有效商机奖发放</p>
      </div>

      {/* Tab 切换 */}
      <div className="px-6 flex-shrink-0">
        <TabNav
          tabs={[
            { id: "list", label: "有效商机奖" },
            { id: "noAudit", label: "有效商机奖免审核设置" },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          style="pill"
        />
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        {activeTab === "list" && (
        <div className="mt-4 space-y-4">
          {/* 查询条件卡片 */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-4 gap-x-6 gap-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">商机名称</label>
                <Input
                  value={formData.saleOppName}
                  onChange={(e) => setFormData({ ...formData, saleOppName: e.target.value })}
                  placeholder="请输入"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">商机编码</label>
                <Input
                  value={formData.jtOppCode}
                  onChange={(e) => setFormData({ ...formData, jtOppCode: e.target.value })}
                  placeholder="请输入"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">客户名称</label>
                <Input
                  value={formData.custName}
                  onChange={(e) => setFormData({ ...formData, custName: e.target.value })}
                  placeholder="请输入"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">客户编码</label>
                <Input
                  value={formData.custCode}
                  onChange={(e) => setFormData({ ...formData, custCode: e.target.value })}
                  placeholder="请输入"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">区县</label>
                <Select value={formData.qxId} onValueChange={(v) => setFormData({ ...formData, qxId: v })}>
                  <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yinzhou">鄞州</SelectItem>
                    <SelectItem value="jiangbei">江北</SelectItem>
                    <SelectItem value="zhenhai">镇海</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">支局</label>
                <Select value={formData.zjId} onValueChange={(v) => setFormData({ ...formData, zjId: v })} disabled={!formData.qxId}>
                  <SelectTrigger><SelectValue placeholder="请先选择区县" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zj1">支局1</SelectItem>
                    <SelectItem value="zj2">支局2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">客户经理</label>
                <Input
                  value={formData.custManagerName}
                  onChange={(e) => setFormData({ ...formData, custManagerName: e.target.value })}
                  placeholder="请输入"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">审核状态</label>
                <Select value={formData.auditState || "all"} onValueChange={(v) => setFormData({ ...formData, auditState: v === "all" ? "" : v })}>
                  <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                  <SelectContent>
                    {auditStateOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">录入时间范围</label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={formData.oppCreateDateStart}
                    onChange={(e) => setFormData({ ...formData, oppCreateDateStart: e.target.value })}
                  />
                  <span className="self-center text-gray-400">至</span>
                  <Input
                    type="date"
                    value={formData.oppCreateDateEnd}
                    onChange={(e) => setFormData({ ...formData, oppCreateDateEnd: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch}>查询</Button>
                <Button variant="outline" className="ml-2" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-1" />重置
                </Button>
                <Button variant="outline" className="ml-2" onClick={() => console.log("导出有效商机奖")}>
                  <Download className="w-4 h-4 mr-1" />导出
                </Button>
              </div>
            </div>
          </div>

          {/* 表格 */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <colgroup>
                <col style={{ width: '160px' }} />
                <col style={{ width: '120px' }} />
                <col style={{ width: '100px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '100px' }} />
                <col style={{ width: '90px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '70px' }} />
              </colgroup>
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">商机名称</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">商机编码</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">客户名称</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">客户编码</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">有效商机奖金额</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">录入时间</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">客户经理</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">区县</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">支局</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">审核状态</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {mockData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap max-w-[160px] truncate">{item.saleOppName}</td>
                    <td className="px-2 py-2 text-xs text-blue-600 text-center whitespace-nowrap">{item.jtOppCode}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.custName}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.custCode}</td>
                    <td className="px-2 py-2 text-xs text-blue-600 text-center whitespace-nowrap font-medium">{formatAmount(item.validOppAmount)}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.oppCreateDate}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.custManagerName}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.qxName}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.zjName}</td>
                    <td className="px-2 py-2 text-center whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        item.auditState === '已审核' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.auditState}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-center whitespace-nowrap">
                      {item.auditState === '待审核' && (
                        <button
                          className="text-blue-600 hover:underline text-xs"
                          onClick={() => handleOpenAudit(item)}
                        >
                          审核
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 免审核设置页面 */}
      {activeTab === "noAudit" && (
        <div className="mt-4 space-y-4">
          {/* 查询条件卡片 */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-4 gap-x-6 gap-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">区县</label>
                <Select value={noAuditParams.qxId} onValueChange={(v) => setNoAuditParams({ ...noAuditParams, qxId: v })}>
                  <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yinzhou">鄞州</SelectItem>
                    <SelectItem value="jiangbei">江北</SelectItem>
                    <SelectItem value="zhenhai">镇海</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">支局</label>
                <Select value={noAuditParams.zjId} onValueChange={(v) => setNoAuditParams({ ...noAuditParams, zjId: v })} disabled={!noAuditParams.qxId}>
                  <SelectTrigger><SelectValue placeholder="请先选择区县" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zj1">支局1</SelectItem>
                    <SelectItem value="zj2">支局2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">设置人</label>
                <Input
                  value={noAuditParams.createUserName}
                  onChange={(e) => setNoAuditParams({ ...noAuditParams, createUserName: e.target.value })}
                  placeholder="请输入"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">数量范围</label>
                <Input
                  value={noAuditParams.countRange}
                  onChange={(e) => setNoAuditParams({ ...noAuditParams, countRange: e.target.value })}
                  placeholder="请输入"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleNoAuditSearch}>查询</Button>
                <Button variant="outline" className="ml-2" onClick={handleNoAuditReset}>
                  <RotateCcw className="w-4 h-4 mr-1" />重置
                </Button>
                <Button variant="outline" className="ml-2" onClick={() => console.log("导出免审核设置")}>
                  <Download className="w-4 h-4 mr-1" />导出
                </Button>
              </div>
            </div>
          </div>

          {/* 表格 */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <colgroup>
                <col style={{ width: '100px' }} />
                <col style={{ width: '120px' }} />
                <col style={{ width: '150px' }} />
                <col style={{ width: '140px' }} />
                <col style={{ width: '100px' }} />
              </colgroup>
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">区县</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">支局</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">有效商机奖免审核数量</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">设置时间</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">设置人</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {mockNoAuditData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.qxName}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.zjName}</td>
                    <td className="px-2 py-2 text-xs text-blue-600 text-center whitespace-nowrap font-medium">{item.exemptCount}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.createTime}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.createUserName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>
      <Dialog open={auditDialogOpen} onOpenChange={setAuditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>审核有效商机奖</DialogTitle>
            <DialogDescription>
              {currentAuditItem?.saleOppName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 rounded p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">商机编码：</span>
                <span className="text-gray-900">{currentAuditItem?.jtOppCode}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">客户名称：</span>
                <span className="text-gray-900">{currentAuditItem?.custName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">有效商机奖金额：</span>
                <span className="text-blue-600 font-medium">{formatAmount(currentAuditItem?.validOppAmount || 0)}元</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">客户经理：</span>
                <span className="text-gray-900">{currentAuditItem?.custManagerName}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">审核意见</label>
              <Textarea
                value={auditOpinion}
                onChange={(e) => setAuditOpinion(e.target.value)}
                placeholder="请输入审核意见（选填）"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAuditDialogOpen(false)}>取消</Button>
            <Button onClick={handleConfirmAudit}>确认审核</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}