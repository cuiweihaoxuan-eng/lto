import React, { useState } from "react";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Button } from "./ui/button";
import { RotateCcw, X, Check, User, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";

// ============ 人员选择弹窗（复用SelfDeliveryApplyDialog中的逻辑）============
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

const mockDepartments = [
  { id: "d1", name: "西湖支局", children: [{ id: "d1-1", name: "销售部" }, { id: "d1-2", name: "技术部" }] },
  { id: "d2", name: "滨江支局", children: [{ id: "d2-1", name: "销售部" }, { id: "d2-2", name: "技术部" }] },
  { id: "d3", name: "云中台", children: [{ id: "d3-1", name: "研发部" }, { id: "d3-2", name: "运维部" }] },
  { id: "d4", name: "财务部", children: [] },
  { id: "d5", name: "人力部", children: [] },
];

const mockPersons: PersonItemData[] = [
  { id: "p1", name: "张三", phone: "13800138001", empNo: "EMP001", dept: "西湖支局-销售部" },
  { id: "p2", name: "李四", phone: "13800138002", empNo: "EMP002", dept: "西湖支局-技术部" },
  { id: "p3", name: "王五", phone: "13800138003", empNo: "EMP003", dept: "滨江支局-销售部" },
  { id: "p4", name: "赵六", phone: "13800138004", empNo: "EMP004", dept: "云中台-研发部" },
  { id: "p5", name: "钱七", phone: "13800138005", empNo: "EMP005", dept: "财务部" },
  { id: "p6", name: "孙八", phone: "13800138006", empNo: "EMP006", dept: "人力部" },
  { id: "p7", name: "周九", phone: "13800138007", empNo: "EMP007", dept: "西湖支局-销售部" },
  { id: "p8", name: "吴十", phone: "13800138008", empNo: "EMP008", dept: "云中台-运维部" },
];

function PersonSelectDialog({ open, onClose, onSelect }: PersonSelectDialogProps) {
  const [searchFields, setSearchFields] = useState({ name: "", phone: "", dept: "" });
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());

  const filteredData = mockPersons.filter(item => {
    if (searchFields.name && !item.name.includes(searchFields.name)) return false;
    if (searchFields.phone && !item.phone.includes(searchFields.phone)) return false;
    if (searchFields.dept && !item.dept.includes(searchFields.dept)) return false;
    return true;
  });

  const toggleDept = (id: string) => {
    setExpandedDepts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>选择人员</DialogTitle>
        </DialogHeader>
        <div className="flex flex-1 overflow-hidden">
          {/* 左侧组织树 */}
          <div className="w-48 border-r border-gray-200 bg-gray-50 p-2 overflow-y-auto flex-shrink-0">
            {mockDepartments.map(dept => (
              <div key={dept.id}>
                <button
                  onClick={() => dept.children.length > 0 && toggleDept(dept.id)}
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-200 rounded flex items-center justify-between"
                >
                  <span>{dept.name}</span>
                  {dept.children.length > 0 && (
                    <span className="text-gray-400">{expandedDepts.has(dept.id) ? "▼" : "▶"}</span>
                  )}
                </button>
                {expandedDepts.has(dept.id) && dept.children.map(child => (
                  <button
                    key={child.id}
                    onClick={() => {}}
                    className="w-full text-left px-4 py-1.5 text-sm hover:bg-gray-200 rounded"
                  >
                    {child.name}
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* 右侧人员列表 */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">姓名</label>
                  <Input size="sm" placeholder="请输入" value={searchFields.name} onChange={e => setSearchFields({...searchFields, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">电话</label>
                  <Input size="sm" placeholder="请输入" value={searchFields.phone} onChange={e => setSearchFields({...searchFields, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">部门</label>
                  <Input size="sm" placeholder="请输入" value={searchFields.dept} onChange={e => setSearchFields({...searchFields, dept: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">姓名</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">电话</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">工号</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">部门</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-16">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredData.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">{item.name}</td>
                      <td className="px-3 py-2">{item.phone}</td>
                      <td className="px-3 py-2">{item.empNo}</td>
                      <td className="px-3 py-2">{item.dept}</td>
                      <td className="px-3 py-2">
                        <Button size="sm" variant="outline" onClick={() => onSelect(item)}>选择</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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

// 模拟数据
const mockData = [
  { id: 1, saleOppName: "XX单位信息化建设", jtOppCode: "SJ-2026-001", itemName: "XX单位信息化项目", itemCode: "XM-2026-001", contractAmount: 500, ictAmount: 300, receiveAmount: 100, itemType: "ICT", budgetMargin: "25%", settleMargin: "22%", totalReward: 100000, issuedReward: 80000, firstManager: "张三", teamMembers: "4（2）3（1）2（1）1（0）", qxName: "鄞州", zjName: "鄞州支局", receiveState: "部分收款", signState: "已签报", memberAuditState: "已审核" },
  { id: 2, saleOppName: "YY学校智慧校园", jtOppCode: "SJ-2026-002", itemName: "YY学校智慧校园项目", itemCode: "XM-2026-002", contractAmount: 300, ictAmount: 200, receiveAmount: 0, itemType: "ICT", budgetMargin: "30%", settleMargin: "28%", totalReward: 80000, issuedReward: 0, firstManager: "李四", teamMembers: "4（1）3（1）2（0）1（1）", qxName: "江北", zjName: "江北支局", receiveState: "未收款", signState: "待签报", memberAuditState: "待审核" },
  { id: 3, saleOppName: "ZZ医院信息化系统", jtOppCode: "SJ-2026-003", itemName: "ZZ医院信息化系统", itemCode: "XM-2026-003", contractAmount: 400, ictAmount: 250, receiveAmount: 200, itemType: "ICT", budgetMargin: "28%", settleMargin: "26%", totalReward: 90000, issuedReward: 90000, firstManager: "王五", teamMembers: "4（1）3（1）2（1）1（0）", qxName: "镇海", zjName: "镇海支局", receiveState: "已收款", signState: "已签报", memberAuditState: "已审核" },
  { id: 4, saleOppName: "AA社区智慧党建", jtOppCode: "SJ-2026-004", itemName: "AA社区智慧党建平台", itemCode: "XM-2026-004", contractAmount: 200, ictAmount: 150, receiveAmount: 0, itemType: "ICT", budgetMargin: "22%", settleMargin: "20%", totalReward: 60000, issuedReward: 0, firstManager: "赵六", teamMembers: "4（0）3（1）2（1）1（1）", qxName: "鄞州", zjName: "鄞州支局", receiveState: "未收款", signState: "待签报", memberAuditState: "待审核" },
  { id: 5, saleOppName: "BB企业数字化转型", jtOppCode: "SJ-2026-005", itemName: "BB企业数字化转型项目", itemCode: "XM-2026-005", contractAmount: 600, ictAmount: 400, receiveAmount: 300, itemType: "ICT", budgetMargin: "26%", settleMargin: "24%", totalReward: 120000, issuedReward: 60000, firstManager: "孙七", teamMembers: "4（2）3（1）2（1）1（0）", qxName: "江北", zjName: "江北支局", receiveState: "部分收款", signState: "已签报", memberAuditState: "已审核" },
];

// 初始团队成员模拟数据
const initialMockTeamMembers: TeamMember[] = [
  { id: "m1", team: "4", teamName: "售前销售团队", name: "张三", phone: "138****1234", dept: "政企部", role: "客户经理", contribution: 60, isMain: true, reward: "6000/8000元" },
  { id: "m2", team: "4", teamName: "售前销售团队", name: "李四", phone: "139****5678", dept: "政企部", role: "解决方案经理", contribution: 40, isMain: false, reward: "2000/4000元" },
  { id: "m3", team: "3", teamName: "售前支撑团队", name: "王五", phone: "137****9012", dept: "技术部", role: "技术经理", contribution: 50, isMain: false, reward: "3000/5000元" },
];

// 变更记录模拟数据
const mockChangeRecords = [
  { id: 1, changeUser: "张三", changeTime: "2026-03-15 10:30", status: "已确认", details: [{ team: "4", name: "李四", role: "解决方案经理", type: "加入", oldRatio: "-", newRatio: "40%" }] },
  { id: 2, changeUser: "李四", changeTime: "2026-03-16 14:20", status: "已确认", details: [{ team: "4", name: "李四", role: "解决方案经理", type: "比例调整", oldRatio: "30%", newRatio: "40%" }] },
];

// 发放记录模拟数据
const mockGrantRecords = [
  { id: 1, type: "奖金", name: "张三", team: "售前销售团队", role: "负责人", contribution: "60%", amount: "300元" },
  { id: 2, type: "奖金", name: "李四", team: "售前销售团队", role: "成员", contribution: "40%", amount: "100元" },
];

// 审核记录模拟数据
const mockAuditRecords = [
  { auditRecord: "项目提成奖审核通过", submitUser: "张三", orgnName: "政企部", auditTime: "2026-03-15 10:30", signFile: "签报文件.pdf", signCode: "QB-2026-001", auditState: "已审核" },
  { auditRecord: "成员定档审核通过", submitUser: "李四", orgnName: "政企部", auditTime: "2026-03-16 14:20", signFile: "", signCode: "", auditState: "已审核" },
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

const memberAuditStateOptions = [
  { value: "all", label: "全部" },
  { value: "已审核", label: "已审核" },
  { value: "待审核", label: "待审核" },
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

export function ProjectCommissionAward() {
  const [formData, setFormData] = useState({
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

  // 邀请成员弹窗
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<typeof mockData[0] | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialMockTeamMembers);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<Partial<TeamMember>>({});
  const [personSelectOpen, setPersonSelectOpen] = useState(false);

  // 成员定档审核弹窗
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);
  const [auditConfirmed, setAuditConfirmed] = useState(false);
  const [auditOpinion, setAuditOpinion] = useState("");

  // 成员变更记录弹窗
  const [changeRecordDialogOpen, setChangeRecordDialogOpen] = useState(false);
  const [changeDetailDialogOpen, setChangeDetailDialogOpen] = useState(false);
  const [currentChangeRecord, setCurrentChangeRecord] = useState<typeof mockChangeRecords[0] | null>(null);

  // 发放记录弹窗
  const [grantDialogOpen, setGrantDialogOpen] = useState(false);
  const [currentGrantData, setCurrentGrantData] = useState<{ contractAmount: number; receiveAmount: number; ratio: number; totalAmount: number } | null>(null);

  // 审核记录弹窗
  const [auditRecordDialogOpen, setAuditRecordDialogOpen] = useState(false);

  const handleSearch = () => {
    console.log("查询项目提成奖", formData);
  };

  const handleReset = () => {
    setFormData({
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
  };

  const handleOpenInvite = (item: typeof mockData[0]) => {
    setCurrentProject(item);
    setTeamMembers([...initialMockTeamMembers]);
    setEditingMemberId(null);
    setEditingMember({});
    setInviteDialogOpen(true);
  };

  const handleOpenAudit = (item: typeof mockData[0]) => {
    setCurrentProject(item);
    setAuditConfirmed(false);
    setAuditOpinion("");
    setAuditDialogOpen(true);
  };

  const handleOpenChangeRecord = (item: typeof mockData[0]) => {
    setCurrentProject(item);
    setChangeRecordDialogOpen(true);
  };

  const handleOpenChangeDetail = (record: typeof mockChangeRecords[0]) => {
    setCurrentChangeRecord(record);
    setChangeDetailDialogOpen(true);
  };

  const handleOpenGrant = (item: typeof mockData[0]) => {
    setCurrentGrantData({
      contractAmount: item.contractAmount,
      receiveAmount: item.receiveAmount,
      ratio: 80,
      totalAmount: item.totalReward,
    });
    setGrantDialogOpen(true);
  };

  const handleOpenAuditRecord = (item: typeof mockData[0]) => {
    setCurrentProject(item);
    setAuditRecordDialogOpen(true);
  };

  // 修改成员 - 进入编辑状态
  const handleEditMember = (member: TeamMember) => {
    setEditingMemberId(member.id);
    setEditingMember({ ...member });
  };

  // 保存成员修改
  const handleSaveMember = () => {
    if (!editingMemberId || !editingMember) return;
    setTeamMembers(prev => prev.map(m => m.id === editingMemberId ? { ...m, ...editingMember, isEditing: false } as TeamMember : m));
    setEditingMemberId(null);
    setEditingMember({});
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingMemberId(null);
    setEditingMember({});
  };

  // 删除成员
  const handleDeleteMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };

  // 选择人员弹窗回调 - 更新当前编辑行的人员信息并关闭弹窗
  const handleSelectPerson = (person: PersonItemData) => {
    setEditingMember(prev => ({
      ...prev,
      name: person.name,
      phone: person.phone,
      dept: person.dept,
    }));
    setPersonSelectOpen(false);
  };

  const formatAmount = (val: number) => {
    return val?.toLocaleString() || "-";
  };

  const getStateTagClass = (state: string) => {
    if (state === "已收款" || state === "已签报" || state === "已审核" || state === "已分配") {
      return "bg-green-100 text-green-700";
    }
    if (state === "部分收款" || state === "待审核") {
      return "bg-yellow-100 text-yellow-700";
    }
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 标题区 */}
      <div className="px-6 pt-6 pb-4 flex-shrink-0">
        <h2 className="text-lg font-medium text-gray-900">项目提成奖</h2>
        <p className="text-sm text-gray-500 mt-1">查询和分配项目提成奖，管理团队成员</p>
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="mt-4 space-y-4">
          {/* 查询条件卡片 */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-5 gap-x-6 gap-y-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">项目名称</label>
                <Input
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  placeholder="请输入"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">项目编码</label>
                <Input
                  value={formData.itemCode}
                  onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">第一责任人</label>
                <Input
                  value={formData.firstManager}
                  onChange={(e) => setFormData({ ...formData, firstManager: e.target.value })}
                  placeholder="请输入"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">成员审核状态</label>
                <Select value={formData.memberAuditState || "all"} onValueChange={(v) => setFormData({ ...formData, memberAuditState: v === "all" ? "" : v })}>
                  <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                  <SelectContent>
                    {memberAuditStateOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">收款状态</label>
                <Select value={formData.receiveState || "all"} onValueChange={(v) => setFormData({ ...formData, receiveState: v === "all" ? "" : v })}>
                  <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                  <SelectContent>
                    {receiveStateOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">签报状态</label>
                <Select value={formData.signState || "all"} onValueChange={(v) => setFormData({ ...formData, signState: v === "all" ? "" : v })}>
                  <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                  <SelectContent>
                    {signStateOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={handleSearch}>查询</Button>
              <Button variant="outline" className="ml-2" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-1" />重置
              </Button>
            </div>
          </div>

          {/* 表格 */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <colgroup>
                <col style={{ width: '140px' }} />
                <col style={{ width: '100px' }} />
                <col style={{ width: '140px' }} />
                <col style={{ width: '100px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '60px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '90px' }} />
                <col style={{ width: '90px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '100px' }} />
                <col style={{ width: '70px' }} />
                <col style={{ width: '70px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '280px' }} />
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
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">项目类型</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">预算毛利</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">结算毛利</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">总奖励(元)</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">已发放(元)</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">第一责任人</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">团队成员</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">区县</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">支局</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">收款状态</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">签报状态</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {mockData.map((item) => (
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
                    <td className="px-2 py-2 text-center whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getStateTagClass(item.receiveState)}`}>
                        {item.receiveState}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-center whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getStateTagClass(item.signState)}`}>
                        {item.signState}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-center whitespace-nowrap">
                      <div className="flex flex-wrap gap-1 justify-center">
                        <button className="text-blue-600 hover:underline text-xs" onClick={() => handleOpenInvite(item)}>邀请成员</button>
                        <button className="text-blue-600 hover:underline text-xs" onClick={() => handleOpenAudit(item)}>定档审核</button>
                        <button className="text-blue-600 hover:underline text-xs" onClick={() => handleOpenChangeRecord(item)}>变更记录</button>
                        <button className="text-blue-600 hover:underline text-xs" onClick={() => handleOpenGrant(item)}>发放记录</button>
                        <button className="text-blue-600 hover:underline text-xs" onClick={() => handleOpenAuditRecord(item)}>审核记录</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 人员选择弹窗 */}
      <PersonSelectDialog
        open={personSelectOpen}
        onClose={() => setPersonSelectOpen(false)}
        onSelect={handleSelectPerson}
      />

      {/* 邀请成员弹窗 */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-5xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>邀请成员</DialogTitle>
            <DialogDescription>{currentProject?.itemName}</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* 成员列表 - 带横向滚动 */}
            <div className="border rounded flex-1 overflow-hidden flex flex-col">
              <div className="bg-gray-50 px-4 py-2 border-b font-medium text-sm flex items-center justify-between">
                <span>已添加成员</span>
                <Button size="sm" onClick={() => {
                  // 默认增加一行可编辑状态
                  const newMember: TeamMember = {
                    id: `new_${Date.now()}`,
                    team: "4",
                    teamName: "售前销售团队",
                    name: "",
                    phone: "",
                    dept: "",
                    role: "",
                    contribution: 0,
                    isMain: false,
                    reward: "-",
                    isNew: true,
                  };
                  setTeamMembers(prev => [...prev, newMember]);
                  setEditingMemberId(newMember.id);
                  setEditingMember({ ...newMember });
                }}>
                  <Plus className="w-4 h-4 mr-1" />添加成员
                </Button>
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
                            <td className="px-2 py-1">
                              <Select value={editingMember.team || "4"} onValueChange={(v) => setEditingMember({...editingMember, team: v, teamName: teamOptions.find(t => t.value === v)?.label.replace(/^\d-/, "") || v})}>
                                <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="选择" /></SelectTrigger>
                                <SelectContent>
                                  {teamOptions.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="px-2 py-1">
                              <div className="flex items-center gap-1">
                                <Input
                                  className="h-7 text-xs w-16"
                                  value={editingMember.name || ""}
                                  onChange={(e) => setEditingMember({...editingMember, name: e.target.value})}
                                  placeholder="姓名"
                                />
                                <Button size="sm" variant="ghost" className="h-7 px-1" onClick={() => setPersonSelectOpen(true)}>
                                  <User className="w-3 h-3" />
                                </Button>
                              </div>
                            </td>
                            <td className="px-2 py-1">
                              <Input
                                className="h-7 text-xs"
                                value={editingMember.phone || ""}
                                onChange={(e) => setEditingMember({...editingMember, phone: e.target.value})}
                                placeholder="电话"
                              />
                            </td>
                            <td className="px-2 py-1">
                              <Input
                                className="h-7 text-xs"
                                value={editingMember.dept || ""}
                                onChange={(e) => setEditingMember({...editingMember, dept: e.target.value})}
                                placeholder="部门"
                              />
                            </td>
                            <td className="px-2 py-1">
                              <Select value={editingMember.role || ""} onValueChange={(v) => setEditingMember({...editingMember, role: v})}>
                                <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="选择" /></SelectTrigger>
                                <SelectContent>
                                  {roleOptions.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="px-2 py-1">
                              <Input
                                type="number"
                                className="h-7 text-xs w-16"
                                value={editingMember.contribution || ""}
                                onChange={(e) => setEditingMember({...editingMember, contribution: parseInt(e.target.value) || 0})}
                                placeholder="%"
                              />
                            </td>
                            <td className="px-2 py-1 text-center">
                              <Checkbox
                                checked={editingMember.isMain || false}
                                onCheckedChange={(checked) => setEditingMember({...editingMember, isMain: !!checked})}
                              />
                            </td>
                            <td className="px-2 py-1 text-center text-xs">{member.reward}</td>
                            <td className="px-2 py-1 text-center">
                              <Button size="sm" variant="ghost" className="h-7 px-1" onClick={() => {
                                // 保存新成员
                                if (member.isNew) {
                                  setTeamMembers(prev => prev.map(m => m.id === member.id ? { ...editingMember, id: member.id, isEditing: false, isNew: false } as TeamMember : m));
                                } else {
                                  setTeamMembers(prev => prev.map(m => m.id === member.id ? { ...m, ...editingMember, isEditing: false } as TeamMember : m));
                                }
                                setEditingMemberId(null);
                                setEditingMember({});
                              }}><Check className="w-4 h-4 text-green-600" /></Button>
                              <Button size="sm" variant="ghost" className="h-7 px-1" onClick={() => {
                                if (member.isNew) {
                                  // 新增的行点取消则删除
                                  setTeamMembers(prev => prev.filter(m => m.id !== member.id));
                                }
                                setEditingMemberId(null);
                                setEditingMember({});
                              }}><X className="w-4 h-4 text-red-600" /></Button>
                            </td>
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
                            <td className="px-2 py-1 text-center">
                              <button className="text-red-600 hover:underline text-xs mr-2" onClick={() => handleDeleteMember(member.id)}>删除</button>
                              <button className="text-blue-600 hover:underline text-xs" onClick={() => handleEditMember(member)}>修改</button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                    {teamMembers.length === 0 && (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center text-gray-400 text-sm">
                          暂无成员，请点击上方"添加成员"按钮添加
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 成员定档审核弹窗 */}
      <Dialog open={auditDialogOpen} onOpenChange={setAuditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>成员定档审核</DialogTitle>
            <DialogDescription>{currentProject?.itemName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center">
              <Checkbox
                id="auditConfirmed"
                checked={auditConfirmed}
                onCheckedChange={(checked) => setAuditConfirmed(!!checked)}
              />
              <label htmlFor="auditConfirmed" className="ml-2 text-sm font-medium">已确认</label>
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
            <Button onClick={() => {
              console.log("成员定档审核", { id: currentProject?.id, confirmed: auditConfirmed, opinion: auditOpinion });
              setAuditDialogOpen(false);
            }}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 成员变更记录弹窗 */}
      <Dialog open={changeRecordDialogOpen} onOpenChange={setChangeRecordDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>成员变更记录</DialogTitle>
            <DialogDescription>{currentProject?.itemName}</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto py-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap">序号</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap">变更人</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap">变更时间</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap">状态</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap">变更详情</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {mockChangeRecords.map((record, index) => (
                    <tr key={record.id}>
                      <td className="px-4 py-2 text-center whitespace-nowrap">{index + 1}</td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">{record.changeUser}</td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">{record.changeTime}</td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          record.status === "已确认" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}>{record.status}</span>
                      </td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">
                        <button className="text-blue-600 hover:underline" onClick={() => handleOpenChangeDetail(record)}>查看</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangeRecordDialogOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 变更详情弹窗 */}
      <Dialog open={changeDetailDialogOpen} onOpenChange={setChangeDetailDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>变更详情</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap">团队</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap">姓名</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap">角色</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap">类型</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap">原比例</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap">新比例</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {currentChangeRecord?.details.map((detail, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-center whitespace-nowrap">{detail.team}</td>
                    <td className="px-4 py-2 text-center whitespace-nowrap">{detail.name}</td>
                    <td className="px-4 py-2 text-center whitespace-nowrap">{detail.role}</td>
                    <td className="px-4 py-2 text-center whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        detail.type === "加入" ? "bg-blue-100 text-blue-700" :
                        detail.type === "离开" ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>{detail.type}</span>
                    </td>
                    <td className="px-4 py-2 text-center whitespace-nowrap">{detail.oldRatio}</td>
                    <td className="px-4 py-2 text-center whitespace-nowrap">{detail.newRatio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangeDetailDialogOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 发放记录弹窗 */}
      <Dialog open={grantDialogOpen} onOpenChange={setGrantDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>发放记录</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {/* 汇总信息 */}
            <div className="bg-gray-50 rounded p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">合同金额：</span>
                <span className="text-gray-900">{currentGrantData?.contractAmount.toFixed(2)}万元</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">本期收款金额：</span>
                <span className="text-gray-900">{currentGrantData?.receiveAmount.toFixed(2)}万元</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">提成奖发放比例：</span>
                <span className="text-gray-900">{currentGrantData?.ratio}%</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t">
                <span className="text-gray-500 font-medium">发放项目提成奖：</span>
                <span className="text-blue-600 font-medium text-lg">{formatAmount(currentGrantData?.totalAmount || 0)}元</span>
              </div>
            </div>

            {/* 发放明细 */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[400px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap">类型</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap">姓名</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap">团队</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap">角色</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap">贡献值</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap">金额</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {mockGrantRecords.map((record, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-center whitespace-nowrap">{record.type}</td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">{record.name}</td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">{record.team}</td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">{record.role}</td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">{record.contribution}</td>
                      <td className="px-4 py-2 text-center text-blue-600 font-medium whitespace-nowrap">{record.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGrantDialogOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 审核记录弹窗 - 带横向滚动 */}
      <Dialog open={auditRecordDialogOpen} onOpenChange={setAuditRecordDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>审核记录</DialogTitle>
            <DialogDescription>{currentProject?.itemName}</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto py-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[800px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap">审核记录</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap">送审人</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap">所在组织</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap">审批时间</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap">签报文件</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap">签报文号</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 whitespace-nowrap">审核状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {mockAuditRecords.map((record, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-center whitespace-nowrap">{record.auditRecord}</td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">{record.submitUser}</td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">{record.orgnName}</td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">{record.auditTime}</td>
                      <td className="px-4 py-2 text-center text-blue-600 hover:underline whitespace-nowrap cursor-pointer">{record.signFile || "-"}</td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">{record.signCode || "-"}</td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 whitespace-nowrap">{record.auditState}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAuditRecordDialogOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}