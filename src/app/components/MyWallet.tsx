import React, { useState } from "react";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Button } from "./ui/button";
import { TabNav } from "./ui/tab-nav";
import { RotateCcw, X, Check, User, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";

// ============ 人员选择弹窗 ============
interface PersonItemData {
  id: string;
  name: string;
  phone: string;
  empNo: string;
  dept: string;
}

interface PersonSelectDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (person: PersonItemData) => void;
}

const mockPersons: PersonItemData[] = [
  { id: "p1", name: "张三", phone: "13800138001", empNo: "EMP001", dept: "政企部" },
  { id: "p2", name: "李四", phone: "13800138002", empNo: "EMP002", dept: "技术部" },
  { id: "p3", name: "王五", phone: "13800138003", empNo: "EMP003", dept: "销售部" },
];

function PersonSelectDialog({ open, onClose, onSelect }: PersonSelectDialogProps) {
  const [searchFields, setSearchFields] = useState({ name: "", phone: "" });

  const filteredData = mockPersons.filter(item => {
    if (searchFields.name && !item.name.includes(searchFields.name)) return false;
    if (searchFields.phone && !item.phone.includes(searchFields.phone)) return false;
    return true;
  });

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>选择人员</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-4 py-2">
          <Input size="sm" placeholder="姓名" value={searchFields.name} onChange={e => setSearchFields({...searchFields, name: e.target.value})} />
          <Input size="sm" placeholder="电话" value={searchFields.phone} onChange={e => setSearchFields({...searchFields, phone: e.target.value})} />
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">姓名</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">电话</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">工号</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">部门</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-20">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredData.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">{item.name}</td>
                  <td className="px-3 py-2">{item.phone}</td>
                  <td className="px-3 py-2">{item.empNo}</td>
                  <td className="px-3 py-2">{item.dept}</td>
                  <td className="px-3 py-2"><Button size="sm" variant="outline" onClick={() => onSelect(item)}>选择</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============ 团队成员类型 ============
interface TeamMember {
  id: string;
  team: string;
  teamName: string;
  name: string;
  phone: string;
  dept: string;
  role: string;
  contribution: number;
  isMain: boolean;
  reward: string;
  isEditing?: boolean;
  isNew?: boolean;
}

// 模拟数据 - 有效商机奖（当前登录人数据）
const mockValidOppData = [
  { id: 1, saleOppName: "XX单位信息化建设", jtOppCode: "SJ-2026-001", custName: "XX单位", custCode: "C001", validOppAmount: 50000, oppCreateDate: "2026-01-15", custManagerName: "张三", qxName: "鄞州", zjName: "鄞州支局", auditState: "待审核" },
  { id: 2, saleOppName: "YY学校智慧校园", jtOppCode: "SJ-2026-002", custName: "YY学校", custCode: "C002", validOppAmount: 40000, oppCreateDate: "2026-01-20", custManagerName: "张三", qxName: "江北", zjName: "江北支局", auditState: "已审核" },
];

// 模拟数据 - 大额商机奖（当前登录人数据）
const mockBigOppData = [
  { id: 1, saleOppName: "XX单位信息化建设", jtOppCode: "SJ-2026-001", contractAmount: 500, bigOppAmount: 20000, custManagerName: "张三", qxName: "鄞州", zjName: "鄞州支局", receiveState: "已收款", signState: "已签报", oppCreateDate: "2026-01-15", oppTransferDate: "2026-02-15", signReportCode: "QB-2026-001", auditState: "已审核", submitUser: "李四", orgnName: "政企部", auditTime: "2026-03-10" },
  { id: 2, saleOppName: "YY学校智慧校园", jtOppCode: "SJ-2026-002", contractAmount: 300, bigOppAmount: 15000, custManagerName: "张三", qxName: "江北", zjName: "江北支局", receiveState: "待收款", signState: "待签报", oppCreateDate: "2026-01-20", oppTransferDate: "2026-02-20", signReportCode: "", auditState: "待分配", submitUser: "王五", orgnName: "政企部", auditTime: "" },
];

// 模拟数据 - 项目提成奖（当前登录人数据）
const mockCommissionData = [
  { id: 1, saleOppName: "XX单位信息化建设", jtOppCode: "SJ-2026-001", itemName: "XX单位信息化项目", itemCode: "XM-2026-001", contractAmount: 500, ictAmount: 300, receiveAmount: 100, itemType: "ICT", budgetMargin: "25%", settleMargin: "22%", totalReward: 100000, issuedReward: 80000, firstManager: "张三", teamMembers: "4（2）3（1）2（1）1（0）", qxName: "鄞州", zjName: "鄞州支局", receiveState: "部分收款", signState: "已签报", memberAuditState: "已审核" },
  { id: 2, saleOppName: "YY学校智慧校园", jtOppCode: "SJ-2026-002", itemName: "YY学校智慧校园项目", itemCode: "XM-2026-002", contractAmount: 300, ictAmount: 200, receiveAmount: 0, itemType: "ICT", budgetMargin: "30%", settleMargin: "28%", totalReward: 80000, issuedReward: 0, firstManager: "张三", teamMembers: "4（1）3（1）2（0）1（1）", qxName: "江北", zjName: "江北支局", receiveState: "未收款", signState: "待签报", memberAuditState: "待审核" },
];

// 初始团队成员模拟数据
const initialMockTeamMembers: TeamMember[] = [
  { id: "m1", team: "4", teamName: "售前销售团队", name: "张三", phone: "138****1234", dept: "政企部", role: "客户经理", contribution: 60, isMain: true, reward: "6000/8000元" },
];

const teamOptions = [
  { value: "4", label: "4-售前销售团队" },
  { value: "3", label: "3-售前支撑团队" },
  { value: "2", label: "2-售中团队" },
  { value: "1", label: "1-售后团队" },
];

const roleOptions = [
  { value: "客户经理", label: "客户经理" },
  { value: "解决方案经理", label: "解决方案经理" },
  { value: "项目经理", label: "项目经理" },
  { value: "技术经理", label: "技术经理" },
];

const auditStateOptions = [
  { value: "all", label: "全部" },
  { value: "待审核", label: "待审核" },
  { value: "已审核", label: "已审核" },
];

const receiveStateOptions = [
  { value: "all", label: "全部" },
  { value: "已收款", label: "已收款" },
  { value: "部分收款", label: "部分收款" },
  { value: "未收款", label: "未收款" },
];

const signStateOptions = [
  { value: "all", label: "全部" },
  { value: "已签报", label: "已签报" },
  { value: "待签报", label: "待签报" },
];

export function MyWallet() {
  const [activeTab, setActiveTab] = useState("validOpp");

  // 有效商机奖查询条件
  const [validOppParams, setValidOppParams] = useState({
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

  // 大额商机奖查询条件
  const [bigOppParams, setBigOppParams] = useState({
    saleOppName: "",
    jtOppCode: "",
    qxId: "",
    zjId: "",
    custManagerName: "",
    receiveState: "",
    signState: "",
  });

  // 项目提成奖查询条件
  const [commissionParams, setCommissionParams] = useState({
    saleOppName: "",
    jtOppCode: "",
    itemName: "",
    itemCode: "",
    qxId: "",
    zjId: "",
    firstManager: "",
    memberAuditState: "",
    receiveState: "",
    signState: "",
  });

  // 审核弹窗状态
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);
  const [currentAuditItem, setCurrentAuditItem] = useState<typeof mockValidOppData[0] | null>(null);
  const [auditOpinion, setAuditOpinion] = useState("");

  // 邀请成员弹窗
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<typeof mockCommissionData[0] | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialMockTeamMembers);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<Partial<TeamMember>>({});
  const [personSelectOpen, setPersonSelectOpen] = useState(false);

  // 定档审核弹窗
  const [memberAuditDialogOpen, setMemberAuditDialogOpen] = useState(false);
  const [memberAuditConfirmed, setMemberAuditConfirmed] = useState(false);
  const [memberAuditOpinion, setMemberAuditOpinion] = useState("");

  // 变更记录弹窗
  const [changeRecordDialogOpen, setChangeRecordDialogOpen] = useState(false);

  // 发放记录弹窗
  const [grantDialogOpen, setGrantDialogOpen] = useState(false);

  // 审核记录弹窗
  const [auditRecordDialogOpen, setAuditRecordDialogOpen] = useState(false);

  const formatAmount = (val: number) => {
    return val?.toLocaleString() || "-";
  };

  const getStateTagClass = (state: string) => {
    if (state === "已收款" || state === "已签报" || state === "已审核" || state === "已分配" || state === "已发放") {
      return "bg-green-100 text-green-700";
    }
    if (state === "待收款" || state === "待签报" || state === "待审核" || state === "待分配" || state === "部分收款") {
      return "bg-yellow-100 text-yellow-700";
    }
    return "bg-gray-100 text-gray-600";
  };

  // 有效商机奖操作
  const handleValidOppSearch = () => console.log("查询有效商机奖", validOppParams);
  const handleValidOppReset = () => setValidOppParams({ saleOppName: "", jtOppCode: "", custName: "", custCode: "", qxId: "", zjId: "", custManagerName: "", auditState: "", oppCreateDateStart: "", oppCreateDateEnd: "" });
  const handleOpenValidOppAudit = (item: typeof mockValidOppData[0]) => { setCurrentAuditItem(item); setAuditOpinion(""); setAuditDialogOpen(true); };
  const handleConfirmValidOppAudit = () => { console.log("审核有效商机奖", { id: currentAuditItem?.id, opinion: auditOpinion }); setAuditDialogOpen(false); };

  // 大额商机奖操作
  const handleBigOppSearch = () => console.log("查询大额商机奖", bigOppParams);
  const handleBigOppReset = () => setBigOppParams({ saleOppName: "", jtOppCode: "", qxId: "", zjId: "", custManagerName: "", receiveState: "", signState: "" });

  // 项目提成奖操作
  const handleCommissionSearch = () => console.log("查询项目提成奖", commissionParams);
  const handleCommissionReset = () => setCommissionParams({ saleOppName: "", jtOppCode: "", itemName: "", itemCode: "", qxId: "", zjId: "", firstManager: "", memberAuditState: "", receiveState: "", signState: "" });
  const handleOpenInvite = (item: typeof mockCommissionData[0]) => { setCurrentProject(item); setTeamMembers([...initialMockTeamMembers]); setEditingMemberId(null); setEditingMember({}); setInviteDialogOpen(true); };
  const handleOpenMemberAudit = (item: typeof mockCommissionData[0]) => { setCurrentProject(item); setMemberAuditConfirmed(false); setMemberAuditOpinion(""); setMemberAuditDialogOpen(true); };
  const handleOpenChangeRecord = () => setChangeRecordDialogOpen(true);
  const handleOpenGrant = () => setGrantDialogOpen(true);
  const handleOpenAuditRecord = () => setAuditRecordDialogOpen(true);
  const handleSelectPerson = (person: PersonItemData) => { setEditingMember(prev => ({...prev, name: person.name, phone: person.phone, dept: person.dept})); setPersonSelectOpen(false); };
  const handleSaveMember = () => { if (!editingMemberId || !editingMember) return; setTeamMembers(prev => prev.map(m => m.id === editingMemberId ? {...m, ...editingMember, isEditing: false} as TeamMember : m)); setEditingMemberId(null); setEditingMember({}); };
  const handleCancelEdit = () => { setEditingMemberId(null); setEditingMember({}); };
  const handleDeleteMember = (id: string) => setTeamMembers(prev => prev.filter(m => m.id !== id));

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 pt-6 pb-4 flex-shrink-0">
        <h2 className="text-lg font-medium text-gray-900">我的钱包</h2>
        <p className="text-sm text-gray-500 mt-1">查看我的商机奖和项目提成奖</p>
      </div>

      <div className="px-6 flex-shrink-0">
        <TabNav
          tabs={[
            { id: "validOpp", label: "有效商机奖" },
            { id: "bigOpp", label: "大额商机奖" },
            { id: "commission", label: "项目提成奖" },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          style="pill"
        />
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6">

        {/* 有效商机奖 Tab */}
        {activeTab === "validOpp" && (
          <div className="mt-4 space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">商机名称</label>
                  <Input value={validOppParams.saleOppName} onChange={(e) => setValidOppParams({...validOppParams, saleOppName: e.target.value})} placeholder="请输入" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">商机编码</label>
                  <Input value={validOppParams.jtOppCode} onChange={(e) => setValidOppParams({...validOppParams, jtOppCode: e.target.value})} placeholder="请输入" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">客户名称</label>
                  <Input value={validOppParams.custName} onChange={(e) => setValidOppParams({...validOppParams, custName: e.target.value})} placeholder="请输入" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">客户编码</label>
                  <Input value={validOppParams.custCode} onChange={(e) => setValidOppParams({...validOppParams, custCode: e.target.value})} placeholder="请输入" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">区县</label>
                  <Select value={validOppParams.qxId} onValueChange={(v) => setValidOppParams({...validOppParams, qxId: v})}>
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
                  <Select value={validOppParams.zjId} onValueChange={(v) => setValidOppParams({...validOppParams, zjId: v})} disabled={!validOppParams.qxId}>
                    <SelectTrigger><SelectValue placeholder="请先选择区县" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zj1">支局1</SelectItem>
                      <SelectItem value="zj2">支局2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">客户经理</label>
                  <Input value={validOppParams.custManagerName} onChange={(e) => setValidOppParams({...validOppParams, custManagerName: e.target.value})} placeholder="请输入" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">审核状态</label>
                  <Select value={validOppParams.auditState || "all"} onValueChange={(v) => setValidOppParams({...validOppParams, auditState: v === "all" ? "" : v})}>
                    <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent>{auditStateOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">录入时间范围</label>
                  <div className="flex gap-2">
                    <Input type="date" value={validOppParams.oppCreateDateStart} onChange={(e) => setValidOppParams({...validOppParams, oppCreateDateStart: e.target.value})} />
                    <span className="self-center text-gray-400">至</span>
                    <Input type="date" value={validOppParams.oppCreateDateEnd} onChange={(e) => setValidOppParams({...validOppParams, oppCreateDateEnd: e.target.value})} />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleValidOppSearch}>查询</Button>
                  <Button variant="outline" className="ml-2" onClick={handleValidOppReset}><RotateCcw className="w-4 h-4 mr-1" />重置</Button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 table-fixed">
                <colgroup>
                  <col style={{ width: '160px' }} /><col style={{ width: '120px' }} /><col style={{ width: '100px' }} /><col style={{ width: '80px' }} /><col style={{ width: '100px' }} /><col style={{ width: '90px' }} /><col style={{ width: '80px' }} /><col style={{ width: '80px' }} /><col style={{ width: '80px' }} /><col style={{ width: '80px' }} /><col style={{ width: '70px' }} />
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
                  {mockValidOppData.map((item) => (
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
                      <td className="px-2 py-2 text-center whitespace-nowrap"><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${item.auditState === '已审核' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.auditState}</span></td>
                      <td className="px-2 py-2 text-center whitespace-nowrap">{item.auditState === '待审核' && (<button className="text-blue-600 hover:underline text-xs" onClick={() => handleOpenValidOppAudit(item)}>审核</button>)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 大额商机奖 Tab */}
        {activeTab === "bigOpp" && (
          <div className="mt-4 space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">商机名称</label>
                  <Input value={bigOppParams.saleOppName} onChange={(e) => setBigOppParams({...bigOppParams, saleOppName: e.target.value})} placeholder="请输入" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">商机编码</label>
                  <Input value={bigOppParams.jtOppCode} onChange={(e) => setBigOppParams({...bigOppParams, jtOppCode: e.target.value})} placeholder="请输入" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">区县</label>
                  <Select value={bigOppParams.qxId} onValueChange={(v) => setBigOppParams({...bigOppParams, qxId: v})}>
                    <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent><SelectItem value="yinzhou">鄞州</SelectItem><SelectItem value="jiangbei">江北</SelectItem><SelectItem value="zhenhai">镇海</SelectItem></SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">支局</label>
                  <Select value={bigOppParams.zjId} onValueChange={(v) => setBigOppParams({...bigOppParams, zjId: v})} disabled={!bigOppParams.qxId}>
                    <SelectTrigger><SelectValue placeholder="请先选择区县" /></SelectTrigger>
                    <SelectContent><SelectItem value="zj1">支局1</SelectItem><SelectItem value="zj2">支局2</SelectItem></SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">客户经理</label>
                  <Input value={bigOppParams.custManagerName} onChange={(e) => setBigOppParams({...bigOppParams, custManagerName: e.target.value})} placeholder="请输入" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">收款状态</label>
                  <Select value={bigOppParams.receiveState || "all"} onValueChange={(v) => setBigOppParams({...bigOppParams, receiveState: v === "all" ? "" : v})}>
                    <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent>{receiveStateOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">签报状态</label>
                  <Select value={bigOppParams.signState || "all"} onValueChange={(v) => setBigOppParams({...bigOppParams, signState: v === "all" ? "" : v})}>
                    <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent>{signStateOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleBigOppSearch}>查询</Button>
                  <Button variant="outline" className="ml-2" onClick={handleBigOppReset}><RotateCcw className="w-4 h-4 mr-1" />重置</Button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 table-fixed">
                <colgroup>
                  <col style={{ width: '160px' }} /><col style={{ width: '120px' }} /><col style={{ width: '90px' }} /><col style={{ width: '100px' }} /><col style={{ width: '80px' }} /><col style={{ width: '70px' }} /><col style={{ width: '70px' }} /><col style={{ width: '80px' }} /><col style={{ width: '80px' }} /><col style={{ width: '90px' }} /><col style={{ width: '90px' }} /><col style={{ width: '120px' }} /><col style={{ width: '80px' }} /><col style={{ width: '80px' }} /><col style={{ width: '90px' }} />
                </colgroup>
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">商机名称</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">商机编码</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">合同金额(万元)</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">大额商机奖金额</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">客户经理</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">区县</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">支局</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">收款状态</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">签报状态</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">商机录入时间</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">商机转化时间</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">关联签报文号</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">审核状态</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">送审人</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">审批时间</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {mockBigOppData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap max-w-[160px] truncate">{item.saleOppName}</td>
                      <td className="px-2 py-2 text-xs text-blue-600 text-center whitespace-nowrap">{item.jtOppCode}</td>
                      <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{formatAmount(item.contractAmount)}</td>
                      <td className="px-2 py-2 text-xs text-blue-600 text-center whitespace-nowrap font-medium">{formatAmount(item.bigOppAmount)}</td>
                      <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.custManagerName}</td>
                      <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.qxName}</td>
                      <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.zjName}</td>
                      <td className="px-2 py-2 text-center whitespace-nowrap"><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getStateTagClass(item.receiveState)}`}>{item.receiveState}</span></td>
                      <td className="px-2 py-2 text-center whitespace-nowrap"><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getStateTagClass(item.signState)}`}>{item.signState}</span></td>
                      <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.oppCreateDate}</td>
                      <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.oppTransferDate || "-"}</td>
                      <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.signReportCode || "-"}</td>
                      <td className="px-2 py-2 text-center whitespace-nowrap"><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getStateTagClass(item.auditState)}`}>{item.auditState}</span></td>
                      <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.submitUser}</td>
                      <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.auditTime || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 项目提成奖 Tab */}
        {activeTab === "commission" && (
          <div className="mt-4 space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="grid grid-cols-5 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">商机名称</label>
                  <Input value={commissionParams.saleOppName} onChange={(e) => setCommissionParams({...commissionParams, saleOppName: e.target.value})} placeholder="请输入" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">商机编码</label>
                  <Input value={commissionParams.jtOppCode} onChange={(e) => setCommissionParams({...commissionParams, jtOppCode: e.target.value})} placeholder="请输入" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">项目名称</label>
                  <Input value={commissionParams.itemName} onChange={(e) => setCommissionParams({...commissionParams, itemName: e.target.value})} placeholder="请输入" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">项目编码</label>
                  <Input value={commissionParams.itemCode} onChange={(e) => setCommissionParams({...commissionParams, itemCode: e.target.value})} placeholder="请输入" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">区县</label>
                  <Select value={commissionParams.qxId} onValueChange={(v) => setCommissionParams({...commissionParams, qxId: v})}>
                    <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent><SelectItem value="yinzhou">鄞州</SelectItem><SelectItem value="jiangbei">江北</SelectItem><SelectItem value="zhenhai">镇海</SelectItem></SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">支局</label>
                  <Select value={commissionParams.zjId} onValueChange={(v) => setCommissionParams({...commissionParams, zjId: v})} disabled={!commissionParams.qxId}>
                    <SelectTrigger><SelectValue placeholder="请先选择区县" /></SelectTrigger>
                    <SelectContent><SelectItem value="zj1">支局1</SelectItem><SelectItem value="zj2">支局2</SelectItem></SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">第一责任人</label>
                  <Input value={commissionParams.firstManager} onChange={(e) => setCommissionParams({...commissionParams, firstManager: e.target.value})} placeholder="请输入" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">成员审核状态</label>
                  <Select value={commissionParams.memberAuditState || "all"} onValueChange={(v) => setCommissionParams({...commissionParams, memberAuditState: v === "all" ? "" : v})}>
                    <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent><SelectItem value="all">全部</SelectItem><SelectItem value="待审核">待审核</SelectItem><SelectItem value="已审核">已审核</SelectItem></SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">收款状态</label>
                  <Select value={commissionParams.receiveState || "all"} onValueChange={(v) => setCommissionParams({...commissionParams, receiveState: v === "all" ? "" : v})}>
                    <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent>{receiveStateOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">签报状态</label>
                  <Select value={commissionParams.signState || "all"} onValueChange={(v) => setCommissionParams({...commissionParams, signState: v === "all" ? "" : v})}>
                    <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent>{signStateOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={handleCommissionSearch}>查询</Button>
                <Button variant="outline" className="ml-2" onClick={handleCommissionReset}><RotateCcw className="w-4 h-4 mr-1" />重置</Button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 table-fixed">
                <colgroup>
                  <col style={{ width: '140px' }} /><col style={{ width: '100px' }} /><col style={{ width: '140px' }} /><col style={{ width: '100px' }} /><col style={{ width: '80px' }} /><col style={{ width: '80px' }} /><col style={{ width: '80px' }} /><col style={{ width: '60px' }} /><col style={{ width: '80px' }} /><col style={{ width: '80px' }} /><col style={{ width: '90px' }} /><col style={{ width: '90px' }} /><col style={{ width: '80px' }} /><col style={{ width: '100px' }} /><col style={{ width: '70px' }} /><col style={{ width: '70px' }} /><col style={{ width: '80px' }} /><col style={{ width: '80px' }} /><col style={{ width: '280px' }} />
                </colgroup>
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">商机名称</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">商机编码</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">项目名称</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">项目编码</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">合同金额(万元)</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">ICT金额(万元)</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">收款金额(万元)</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">类型</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">预算毛利</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">结算毛利</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">总奖励(元)</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">已发放(元)</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">责任人</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">团队成员</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">区县</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">支局</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">收款状态</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">签报状态</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {mockCommissionData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap max-w-[140px] truncate">{item.saleOppName}</td>
                      <td className="px-2 py-2 text-xs text-blue-600 text-center whitespace-nowrap">{item.jtOppCode}</td>
                      <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap max-w-[140px] truncate">{item.itemName}</td>
                      <td className="px-2 py-2 text-xs text-blue-600 text-center whitespace-nowrap">{item.itemCode}</td>
                      <td className="px-2 py-2 text-xs text-blue-600 text-center whitespace-nowrap font-medium">{formatAmount(item.contractAmount)}</td>
                      <td className="px-2 py-2 text-xs text-blue-600 text-center whitespace-nowrap">{formatAmount(item.ictAmount)}</td>
                      <td className="px-2 py-2 text-xs text-blue-600 text-center whitespace-nowrap">{formatAmount(item.receiveAmount)}</td>
                      <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.itemType}</td>
                      <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.budgetMargin}</td>
                      <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.settleMargin}</td>
                      <td className="px-2 py-2 text-xs text-blue-600 text-center whitespace-nowrap font-medium">{formatAmount(item.totalReward)}</td>
                      <td className="px-2 py-2 text-xs text-blue-600 text-center whitespace-nowrap">{formatAmount(item.issuedReward)}</td>
                      <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.firstManager}</td>
                      <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.teamMembers}</td>
                      <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.qxName}</td>
                      <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.zjName}</td>
                      <td className="px-2 py-2 text-center whitespace-nowrap"><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getStateTagClass(item.receiveState)}`}>{item.receiveState}</span></td>
                      <td className="px-2 py-2 text-center whitespace-nowrap"><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getStateTagClass(item.signState)}`}>{item.signState}</span></td>
                      <td className="px-2 py-2 text-center whitespace-nowrap">
                        <div className="flex flex-wrap gap-1 justify-center">
                          <button className="text-blue-600 hover:underline text-xs" onClick={() => handleOpenInvite(item)}>邀请成员</button>
                          <button className="text-blue-600 hover:underline text-xs" onClick={() => handleOpenMemberAudit(item)}>定档审核</button>
                          <button className="text-blue-600 hover:underline text-xs" onClick={() => handleOpenChangeRecord()}>变更记录</button>
                          <button className="text-blue-600 hover:underline text-xs" onClick={() => handleOpenGrant()}>发放记录</button>
                          <button className="text-blue-600 hover:underline text-xs" onClick={() => handleOpenAuditRecord()}>审核记录</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 人员选择弹窗 */}
      <PersonSelectDialog open={personSelectOpen} onClose={() => setPersonSelectOpen(false)} onSelect={handleSelectPerson} />

      {/* 有效商机奖审核弹窗 */}
      <Dialog open={auditDialogOpen} onOpenChange={setAuditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>审核有效商机奖</DialogTitle>
            <DialogDescription>{currentAuditItem?.saleOppName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 rounded p-3 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-500">商机编码：</span><span className="text-gray-900">{currentAuditItem?.jtOppCode}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">客户名称：</span><span className="text-gray-900">{currentAuditItem?.custName}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">有效商机奖金额：</span><span className="text-blue-600 font-medium">{formatAmount(currentAuditItem?.validOppAmount || 0)}元</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">客户经理：</span><span className="text-gray-900">{currentAuditItem?.custManagerName}</span></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">审核意见</label>
              <Textarea value={auditOpinion} onChange={(e) => setAuditOpinion(e.target.value)} placeholder="请输入审核意见（选填）" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAuditDialogOpen(false)}>取消</Button>
            <Button onClick={handleConfirmValidOppAudit}>确认审核</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 邀请成员弹窗 */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-5xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>邀请成员</DialogTitle>
            <DialogDescription>{currentProject?.itemName}</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="border rounded flex-1 overflow-hidden flex flex-col">
              <div className="bg-gray-50 px-4 py-2 border-b font-medium text-sm flex items-center justify-between">
                <span>已添加成员</span>
                <Button size="sm" onClick={() => {
                  const newMember: TeamMember = { id: `new_${Date.now()}`, team: "4", teamName: "售前销售团队", name: "", phone: "", dept: "", role: "", contribution: 0, isMain: false, reward: "-", isNew: true };
                  setTeamMembers(prev => [...prev, newMember]);
                  setEditingMemberId(newMember.id);
                  setEditingMember({ ...newMember });
                }}><Plus className="w-4 h-4 mr-1" />添加成员</Button>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-sm min-w-[800px]">
                  <thead className="bg-gray-50 border-b sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap w-28">团队</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap w-24">姓名</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap w-28">电话</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap w-28">部门</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap w-28">角色</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap w-20">贡献度</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap w-20">责任人</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap w-24">可发放奖励</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap w-24">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {teamMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        {editingMemberId === member.id ? (
                          <>
                            <td className="px-2 py-1"><Select value={editingMember.team || "4"} onValueChange={(v) => setEditingMember({...editingMember, team: v, teamName: teamOptions.find(t => t.value === v)?.label.replace(/^\d-/, "") || v})}>
                              <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="选择" /></SelectTrigger>
                              <SelectContent>{teamOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent>
                            </Select></td>
                            <td className="px-2 py-1"><div className="flex items-center gap-1"><Input className="h-7 text-xs w-16" value={editingMember.name || ""} onChange={(e) => setEditingMember({...editingMember, name: e.target.value})} placeholder="姓名" /><Button size="sm" variant="ghost" className="h-7 px-1" onClick={() => setPersonSelectOpen(true)}><User className="w-3 h-3" /></Button></div></td>
                            <td className="px-2 py-1"><Input className="h-7 text-xs" value={editingMember.phone || ""} onChange={(e) => setEditingMember({...editingMember, phone: e.target.value})} placeholder="电话" /></td>
                            <td className="px-2 py-1"><Input className="h-7 text-xs" value={editingMember.dept || ""} onChange={(e) => setEditingMember({...editingMember, dept: e.target.value})} placeholder="部门" /></td>
                            <td className="px-2 py-1"><Select value={editingMember.role || ""} onValueChange={(v) => setEditingMember({...editingMember, role: v})}>
                              <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="选择" /></SelectTrigger>
                              <SelectContent>{roleOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent>
                            </Select></td>
                            <td className="px-2 py-1"><Input type="number" className="h-7 text-xs w-16" value={editingMember.contribution || ""} onChange={(e) => setEditingMember({...editingMember, contribution: parseInt(e.target.value) || 0})} placeholder="%" /></td>
                            <td className="px-2 py-1 text-center"><Checkbox checked={editingMember.isMain || false} onCheckedChange={(checked) => setEditingMember({...editingMember, isMain: !!checked})} /></td>
                            <td className="px-2 py-1 text-center text-xs">{member.reward}</td>
                            <td className="px-2 py-1 text-center"><Button size="sm" variant="ghost" className="h-7 px-1" onClick={handleSaveMember}><Check className="w-4 h-4 text-green-600" /></Button><Button size="sm" variant="ghost" className="h-7 px-1" onClick={handleCancelEdit}><X className="w-4 h-4 text-red-600" /></Button></td>
                          </>
                        ) : (
                          <>
                            <td className="px-2 py-1 text-center text-xs whitespace-nowrap">{member.teamName}</td>
                            <td className="px-2 py-1 text-center text-xs whitespace-nowrap">{member.name}</td>
                            <td className="px-2 py-1 text-center text-xs whitespace-nowrap">{member.phone}</td>
                            <td className="px-2 py-1 text-center text-xs whitespace-nowrap">{member.dept}</td>
                            <td className="px-2 py-1 text-center text-xs whitespace-nowrap">{member.role}</td>
                            <td className="px-2 py-1 text-center text-xs whitespace-nowrap">{member.contribution}%</td>
                            <td className="px-2 py-1 text-center text-xs whitespace-nowrap">{member.isMain ? "是" : "否"}</td>
                            <td className="px-2 py-1 text-center text-xs whitespace-nowrap">{member.reward}</td>
                            <td className="px-2 py-1 text-center"><button className="text-red-600 hover:underline text-xs mr-2" onClick={() => handleDeleteMember(member.id)}>删除</button><button className="text-blue-600 hover:underline text-xs" onClick={() => { setEditingMemberId(member.id); setEditingMember({ ...member }); }}>修改</button></td>
                          </>
                        )}
                      </tr>
                    ))}
                    {teamMembers.length === 0 && (<tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400 text-sm">暂无成员，请点击上方"添加成员"按钮添加</td></tr>)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setInviteDialogOpen(false)}>关闭</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 定档审核弹窗 */}
      <Dialog open={memberAuditDialogOpen} onOpenChange={setMemberAuditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>成员定档审核</DialogTitle>
            <DialogDescription>{currentProject?.itemName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center"><Checkbox id="memberAuditConfirmed" checked={memberAuditConfirmed} onCheckedChange={(checked) => setMemberAuditConfirmed(!!checked)} /><label htmlFor="memberAuditConfirmed" className="ml-2 text-sm font-medium">已确认</label></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">审核意见</label><Textarea value={memberAuditOpinion} onChange={(e) => setMemberAuditOpinion(e.target.value)} placeholder="请输入审核意见（选填）" rows={3} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setMemberAuditDialogOpen(false)}>取消</Button><Button onClick={() => { console.log("成员定档审核", { id: currentProject?.id, confirmed: memberAuditConfirmed, opinion: memberAuditOpinion }); setMemberAuditDialogOpen(false); }}>确认</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 变更记录弹窗 */}
      <Dialog open={changeRecordDialogOpen} onOpenChange={setChangeRecordDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader><DialogTitle>成员变更记录</DialogTitle></DialogHeader>
          <div className="py-4 text-center text-gray-500">暂无变更记录</div>
          <DialogFooter><Button variant="outline" onClick={() => setChangeRecordDialogOpen(false)}>关闭</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 发放记录弹窗 */}
      <Dialog open={grantDialogOpen} onOpenChange={setGrantDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>发放记录</DialogTitle></DialogHeader>
          <div className="py-4 text-center text-gray-500">暂无发放记录</div>
          <DialogFooter><Button variant="outline" onClick={() => setGrantDialogOpen(false)}>关闭</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 审核记录弹窗 */}
      <Dialog open={auditRecordDialogOpen} onOpenChange={setAuditRecordDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader><DialogTitle>审核记录</DialogTitle></DialogHeader>
          <div className="py-4 text-center text-gray-500">暂无审核记录</div>
          <DialogFooter><Button variant="outline" onClick={() => setAuditRecordDialogOpen(false)}>关闭</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}