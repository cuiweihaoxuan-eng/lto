import React, { useState } from "react";
import { X, Plus, Trash2, Search, Upload, FileText, Image, Check, AlertTriangle, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";

// ============ 类型定义 ============
type ProjectType = "项目型" | "小微标品" | "三联单";
type SettlementMethod = "451定额" | "350人天";
type SmallProductSubType = "视联网" | "机房整治";

interface PersonItem {
  id: string;
  name: string;
  code: string;
  amount?: string;
  personDays?: number;
}

interface ProjectOption {
  id: string;
  customerName: string;
  customerCode: string;
  oppName: string;
  oppCode: string;
  contractName: string;
  contractCode: string;
  contractAmount: string;
  projectName: string;
  projectCode: string;
  projectType: string;
  selfDeliveryForwardAmount: string;
  selfDeliveryCostAmount: string;
  profit: string;
  forwardContractAmount: string;
  maxApplyAmount: string;
  appliedAmount: string;
  appliedProfit: string;
}

interface OrderOption {
  id: string;
  orderName: string;
  orderCode: string;
  orderAmount: string;
}

interface TripleOption {
  id: string;
  tripleName: string;
  tripleCode: string;
  tripleAmount: string;
}

interface AttachmentItem {
  id: string;
  name: string;
  required: boolean;
  source: "auto" | "manual";
  type: string;
  status: "uploaded" | "pending";
  files: { name: string; url?: string }[]; // 支持多文件
}

interface SettlementRecord {
  id: string;
  index: number;
  businessUnit: string;
  branch: string;
  type: "项目型" | "小微标品" | "三联单";
  oppName: string;
  oppCode: string;
  contractName: string;
  contractCode: string;
  projectName: string;
  projectCode: string;
  customerName: string;
  customerCode: string;
  forwardAmount: string;
  isWarrantyProject: boolean;
  cycle: string;
  startDate: string;
  endDate: string;
  selfDeliveryForwardAmount: string;
  selfDeliveryCostAmount: string;
  forwardContractSelfDeliveryAmount: string;
  canApplyAmount: string;
  appliedAmount: string;
  approvedAmount: string;
  actualPaidAmount: string;
  status: string;
  innerList: any[];
}

interface SelfDeliveryApplyDialogProps {
  open: boolean;
  onClose: () => void;
  rowData?: SettlementRecord | null;
}

// ============ 模拟数据 ============
const mockProjectOptions: ProjectOption[] = [
  {
    id: "p1",
    customerName: "杭州某医院",
    customerCode: "KH202604001",
    oppName: "杭州某医院信息化建设项目",
    oppCode: "OPP202604001",
    contractName: "医院ICT服务合同",
    contractCode: "HT202604001",
    contractAmount: "500,000.00",
    projectName: "医院信息化建设项目",
    projectCode: "XM202604001",
    projectType: "项目型",
    selfDeliveryForwardAmount: "50,000.00",
    selfDeliveryCostAmount: "35,000.00",
    profit: "30%",
    forwardContractAmount: "15,000.00",
    maxApplyAmount: "15,000.00",
    appliedAmount: "8,000.00",
    appliedProfit: "5%"
  },
  {
    id: "p2",
    customerName: "宁波某企业",
    customerCode: "KH202604002",
    oppName: "宁波某企业云服务采购项目",
    oppCode: "OPP202604002",
    contractName: "云服务采购合同",
    contractCode: "HT202604002",
    contractAmount: "200,000.00",
    projectName: "企业云服务项目",
    projectCode: "XM202604002",
    projectType: "项目型",
    selfDeliveryForwardAmount: "20,000.00",
    selfDeliveryCostAmount: "14,000.00",
    profit: "30%",
    forwardContractAmount: "6,000.00",
    maxApplyAmount: "6,000.00",
    appliedAmount: "0.00",
    appliedProfit: "0%"
  }
];

const mockOrderOptions: OrderOption[] = [
  { id: "o1", orderName: "企业云服务年度订单", orderCode: "DD202604001", orderAmount: "50,000.00" },
  { id: "o2", orderName: "网络维护服务订单", orderCode: "DD202604002", orderAmount: "30,000.00" },
  { id: "o3", orderName: "视联网服务订单", orderCode: "DD202604003", orderAmount: "80,000.00" }
];

const mockTripleOptions: TripleOption[] = [
  { id: "t1", tripleName: "智慧校园一期三联单", tripleCode: "SLD202604001", tripleAmount: "100,000.00" },
  { id: "t2", tripleName: "数字化工厂三联单", tripleCode: "SLD202604002", tripleAmount: "150,000.00" }
];

// 默认附件配置（带mock数据）- 三种类型附件统一
const getDefaultAttachments = (): AttachmentItem[] => {
  const manualAttachments: AttachmentItem[] = [
    { id: "a1", name: "交付清单", required: true, source: "manual", type: "交付清单", status: "uploaded", files: [{ name: "交付清单_20260514.pdf" }] },
    { id: "a2", name: "设计图", required: false, source: "manual", type: "设计图", status: "pending", files: [] },
    { id: "a3", name: "实施过程照片", required: true, source: "manual", type: "实施照片", status: "uploaded", files: [{ name: "实施照片_现场01.jpg" }, { name: "实施照片_现场02.jpg" }] }
  ];

  return [
    { id: "a4", name: "模式会纪要", required: true, source: "auto", type: "模式会纪要", status: "uploaded", files: [{ name: "模式会纪要_2026年第1期.pdf" }] },
    { id: "a5", name: "前向合同", required: true, source: "auto", type: "前向合同", status: "uploaded", files: [{ name: "ICT服务合同_HT202604001.pdf" }] },
    { id: "a6", name: "前向录收订单", required: false, source: "auto", type: "前向录收", status: "uploaded", files: [{ name: "录收审批单_LS202604001.pdf" }] },
    { id: "a7", name: "前向验收报告", required: true, source: "auto", type: "验收报告", status: "uploaded", files: [{ name: "验收报告_YS202604001.pdf" }] },
    { id: "a8", name: "收款记录", required: false, source: "auto", type: "收款记录", status: "pending", files: [] },
    ...manualAttachments
  ];
};

// ============ 项目选择弹窗 ============
interface ProjectSelectDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (project: ProjectOption) => void;
}

function ProjectSelectDialog({ open, onClose, onSelect }: ProjectSelectDialogProps) {
  const [searchFields, setSearchFields] = useState({
    customerName: "",
    customerCode: "",
    oppName: "",
    oppCode: "",
    contractName: "",
    contractCode: "",
    projectName: "",
    projectCode: ""
  });

  const filteredData = mockProjectOptions.filter(item => {
    if (searchFields.customerName && !item.customerName.includes(searchFields.customerName)) return false;
    if (searchFields.customerCode && !item.customerCode.includes(searchFields.customerCode)) return false;
    if (searchFields.oppName && !item.oppName.includes(searchFields.oppName)) return false;
    if (searchFields.oppCode && !item.oppCode.includes(searchFields.oppCode)) return false;
    if (searchFields.contractName && !item.contractName.includes(searchFields.contractName)) return false;
    if (searchFields.contractCode && !item.contractCode.includes(searchFields.contractCode)) return false;
    if (searchFields.projectName && !item.projectName.includes(searchFields.projectName)) return false;
    if (searchFields.projectCode && !item.projectCode.includes(searchFields.projectCode)) return false;
    return true;
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg shadow-xl w-[900px] max-h-[80vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium">选择项目</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">客户名称</label>
              <Input size="sm" placeholder="请输入" value={searchFields.customerName} onChange={e => setSearchFields({...searchFields, customerName: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">客户编码</label>
              <Input size="sm" placeholder="请输入" value={searchFields.customerCode} onChange={e => setSearchFields({...searchFields, customerCode: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">商机名称</label>
              <Input size="sm" placeholder="请输入" value={searchFields.oppName} onChange={e => setSearchFields({...searchFields, oppName: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">商机编码</label>
              <Input size="sm" placeholder="请输入" value={searchFields.oppCode} onChange={e => setSearchFields({...searchFields, oppCode: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">合同名称</label>
              <Input size="sm" placeholder="请输入" value={searchFields.contractName} onChange={e => setSearchFields({...searchFields, contractName: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">合同编码</label>
              <Input size="sm" placeholder="请输入" value={searchFields.contractCode} onChange={e => setSearchFields({...searchFields, contractCode: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">项目名称</label>
              <Input size="sm" placeholder="请输入" value={searchFields.projectName} onChange={e => setSearchFields({...searchFields, projectName: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">项目编码</label>
              <Input size="sm" placeholder="请输入" value={searchFields.projectCode} onChange={e => setSearchFields({...searchFields, projectCode: e.target.value})} />
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <Button size="sm" variant="outline" className="gap-1">
              <Search className="w-3 h-3" />
              查询
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">选择</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">客户名称</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">客户编码</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">商机名称</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">商机编码</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">合同名称</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">合同编码</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">项目名称</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">项目编码</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map(item => (
                <tr key={item.id} className="hover:bg-blue-50 cursor-pointer" onClick={() => { onSelect(item); onClose(); }}>
                  <td className="px-3 py-2">
                    <button className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
                      <Check className="w-3 h-3 text-transparent" />
                    </button>
                  </td>
                  <td className="px-3 py-2 max-w-24 truncate">{item.customerName}</td>
                  <td className="px-3 py-2">{item.customerCode}</td>
                  <td className="px-3 py-2 max-w-32 truncate">{item.oppName}</td>
                  <td className="px-3 py-2">{item.oppCode}</td>
                  <td className="px-3 py-2 max-w-28 truncate">{item.contractName}</td>
                  <td className="px-3 py-2">{item.contractCode}</td>
                  <td className="px-3 py-2 max-w-28 truncate">{item.projectName}</td>
                  <td className="px-3 py-2">{item.projectCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============ 订单选择弹窗 ============
interface OrderSelectDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (order: OrderOption) => void;
}

function OrderSelectDialog({ open, onClose, onSelect }: OrderSelectDialogProps) {
  const [searchFields, setSearchFields] = useState({
    orderName: "",
    orderCode: ""
  });

  const filteredData = mockOrderOptions.filter(item => {
    if (searchFields.orderName && !item.orderName.includes(searchFields.orderName)) return false;
    if (searchFields.orderCode && !item.orderCode.includes(searchFields.orderCode)) return false;
    return true;
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg shadow-xl w-[600px] max-h-[60vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium">选择订单</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">订单名称</label>
              <Input size="sm" placeholder="请输入" value={searchFields.orderName} onChange={e => setSearchFields({...searchFields, orderName: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">订单编码</label>
              <Input size="sm" placeholder="请输入" value={searchFields.orderCode} onChange={e => setSearchFields({...searchFields, orderCode: e.target.value})} />
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <Button size="sm" variant="outline" className="gap-1">
              <Search className="w-3 h-3" />
              查询
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">选择</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">订单名称</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">订单编码</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">订单金额</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map(item => (
                <tr key={item.id} className="hover:bg-blue-50 cursor-pointer" onClick={() => { onSelect(item); onClose(); }}>
                  <td className="px-3 py-2">
                    <button className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
                      <Check className="w-3 h-3 text-transparent" />
                    </button>
                  </td>
                  <td className="px-3 py-2">{item.orderName}</td>
                  <td className="px-3 py-2">{item.orderCode}</td>
                  <td className="px-3 py-2 text-right">{item.orderAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============ 三联单选择弹窗 ============
interface TripleSelectDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (triple: TripleOption) => void;
}

function TripleSelectDialog({ open, onClose, onSelect }: TripleSelectDialogProps) {
  const [searchFields, setSearchFields] = useState({
    tripleName: "",
    tripleCode: ""
  });

  const filteredData = mockTripleOptions.filter(item => {
    if (searchFields.tripleName && !item.tripleName.includes(searchFields.tripleName)) return false;
    if (searchFields.tripleCode && !item.tripleCode.includes(searchFields.tripleCode)) return false;
    return true;
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg shadow-xl w-[600px] max-h-[60vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium">选择三联单</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">三联单名称</label>
              <Input size="sm" placeholder="请输入" value={searchFields.tripleName} onChange={e => setSearchFields({...searchFields, tripleName: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">三联单编码</label>
              <Input size="sm" placeholder="请输入" value={searchFields.tripleCode} onChange={e => setSearchFields({...searchFields, tripleCode: e.target.value})} />
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <Button size="sm" variant="outline" className="gap-1">
              <Search className="w-3 h-3" />
              查询
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">选择</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">三联单名称</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">三联单编码</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">三联单金额</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map(item => (
                <tr key={item.id} className="hover:bg-blue-50 cursor-pointer" onClick={() => { onSelect(item); onClose(); }}>
                  <td className="px-3 py-2">
                    <button className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
                      <Check className="w-3 h-3 text-transparent" />
                    </button>
                  </td>
                  <td className="px-3 py-2">{item.tripleName}</td>
                  <td className="px-3 py-2">{item.tripleCode}</td>
                  <td className="px-3 py-2 text-right">{item.tripleAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

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
  onSelect: (persons: PersonItemData[]) => void;
  selectedPersons: PersonItemData[];
}

const mockDepartments = [
  { id: "d1", name: "西湖支局", children: [
    { id: "d1-1", name: "销售部" },
    { id: "d1-2", name: "技术部" }
  ]},
  { id: "d2", name: "滨江支局", children: [
    { id: "d2-1", name: "销售部" },
    { id: "d2-2", name: "技术部" }
  ]},
  { id: "d3", name: "云中台", children: [
    { id: "d3-1", name: "研发部" },
    { id: "d3-2", name: "运维部" }
  ]},
  { id: "d4", name: "财务部", children: [] },
  { id: "d5", name: "人力部", children: [] },
  { id: "d6", name: "网运部", children: [] }
];

const mockPersons: PersonItemData[] = [
  { id: "p1", name: "张三", phone: "13800138001", empNo: "EMP001", dept: "西湖支局-销售部" },
  { id: "p2", name: "李四", phone: "13800138002", empNo: "EMP002", dept: "西湖支局-技术部" },
  { id: "p3", name: "王五", phone: "13800138003", empNo: "EMP003", dept: "滨江支局-销售部" },
  { id: "p4", name: "赵六", phone: "13800138004", empNo: "EMP004", dept: "云中台-研发部" },
  { id: "p5", name: "钱七", phone: "13800138005", empNo: "EMP005", dept: "财务部" },
  { id: "p6", name: "孙八", phone: "13800138006", empNo: "EMP006", dept: "人力部" },
  { id: "p7", name: "周九", phone: "13800138007", empNo: "EMP007", dept: "网运部" },
  { id: "p8", name: "吴十", phone: "13800138008", empNo: "EMP008", dept: "西湖支局-销售部" }
];

function PersonSelectDialog({ open, onClose, onSelect, selectedPersons }: PersonSelectDialogProps) {
  const [searchFields, setSearchFields] = useState({ name: "", phone: "", dept: "", empNo: "" });
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedPersons.map(p => p.id)));

  React.useEffect(() => {
    setSelected(new Set(selectedPersons.map(p => p.id)));
  }, [selectedPersons]);

  const filteredData = mockPersons.filter(item => {
    if (searchFields.name && !item.name.includes(searchFields.name)) return false;
    if (searchFields.phone && !item.phone.includes(searchFields.phone)) return false;
    if (searchFields.dept && !item.dept.includes(searchFields.dept)) return false;
    if (searchFields.empNo && !item.empNo.includes(searchFields.empNo)) return false;
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

  const togglePerson = (id: string) => {
    setSelected(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleConfirm = () => {
    const selectedList = mockPersons.filter(p => selected.has(p.id));
    onSelect(selectedList);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg shadow-xl w-[900px] max-h-[80vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium">选择人员</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* 左侧组织树 */}
          <div className="w-48 border-r border-gray-200 bg-gray-50 p-2 overflow-y-auto">
            {mockDepartments.map(dept => (
              <div key={dept.id}>
                <button
                  onClick={() => dept.children.length > 0 && toggleDept(dept.id)}
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-200 rounded flex items-center justify-between"
                >
                  <span>{dept.name}</span>
                  {dept.children.length > 0 && (
                    expandedDepts.has(dept.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
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
          <div className="flex-1 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-4 gap-3">
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
                <div>
                  <label className="block text-xs text-gray-500 mb-1">工号</label>
                  <Input size="sm" placeholder="请输入" value={searchFields.empNo} onChange={e => setSearchFields({...searchFields, empNo: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-10">选择</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">姓名</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">电话</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">工号</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">部门</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredData.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <button
                          onClick={() => togglePerson(item.id)}
                          className={`w-4 h-4 border rounded flex items-center justify-center ${
                            selected.has(item.id) ? "bg-blue-500 border-blue-500" : "border-gray-300"
                          }`}
                        >
                          {selected.has(item.id) && <Check className="w-3 h-3 text-white" />}
                        </button>
                      </td>
                      <td className="px-3 py-2">{item.name}</td>
                      <td className="px-3 py-2">{item.phone}</td>
                      <td className="px-3 py-2">{item.empNo}</td>
                      <td className="px-3 py-2">{item.dept}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={handleConfirm}>确定</Button>
        </div>
      </div>
    </div>
  );
}

// ============ 主弹窗组件（单页面滚动形式） ============
export function SelfDeliveryApplyDialog({ open, onClose, rowData = null }: SelfDeliveryApplyDialogProps) {
  // 根据 rowData 判断弹窗模式
  // isViewMode: rowData有innerList且有数据 = 查看模式
  // isEditMode: rowData有innerList = 修改模式（和新增一样但有数据）
  const isViewMode = rowData && rowData.innerList && rowData.innerList.length > 0 && !rowData.isEditMode;
  const [projectType, setProjectType] = useState<ProjectType>("项目型");

  // 选择弹窗状态
  const [projectSelectOpen, setProjectSelectOpen] = useState(false);
  const [orderSelectOpen, setOrderSelectOpen] = useState(false);
  const [tripleSelectOpen, setTripleSelectOpen] = useState(false);
  const [mainPersonSelectOpen, setMainPersonSelectOpen] = useState(false);
  const [countersignPersonSelectOpen, setCountersignPersonSelectOpen] = useState(false);
  const [ccPersonSelectOpen, setCcPersonSelectOpen] = useState(false);

  // 选中数据 - 如果有 rowData 则自动填充
  const [selectedProject, setSelectedProject] = useState<ProjectOption | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderOption | null>(null);
  const [selectedTriple, setSelectedTriple] = useState<TripleOption | null>(null);

  // 初始化：如果有 rowData，自动填充项目信息
  React.useEffect(() => {
    if (rowData) {
      // 根据类型设置项目数据
      const type = rowData.type;
      setProjectType(type);

      if (type === "项目型") {
        setSelectedProject({
          id: rowData.id,
          customerName: rowData.customerName,
          customerCode: rowData.customerCode,
          oppName: rowData.oppName,
          oppCode: rowData.oppCode,
          contractName: rowData.contractName,
          contractCode: rowData.contractCode,
          contractAmount: rowData.forwardAmount,
          projectName: rowData.projectName,
          projectCode: rowData.projectCode,
          projectType: rowData.type,
          selfDeliveryForwardAmount: rowData.selfDeliveryForwardAmount,
          selfDeliveryCostAmount: rowData.selfDeliveryCostAmount,
          profit: rowData.canApplyAmount,
          forwardContractAmount: rowData.forwardContractSelfDeliveryAmount,
          maxApplyAmount: rowData.canApplyAmount,
          appliedAmount: rowData.appliedAmount,
          appliedProfit: rowData.approvedAmount
        });
      } else if (type === "小微标品") {
        setSelectedOrder({
          id: rowData.id,
          orderName: rowData.projectName,
          orderCode: rowData.projectCode,
          orderAmount: rowData.forwardAmount
        });
      } else if (type === "三联单") {
        setSelectedTriple({
          id: rowData.id,
          tripleName: rowData.projectName,
          tripleCode: rowData.projectCode,
          tripleAmount: rowData.forwardAmount
        });
      }
    } else {
      // 没有 rowData 时重置为新增模式
      setSelectedProject(null);
      setSelectedOrder(null);
      setSelectedTriple(null);
      setProjectType("项目型");
    }
  }, [rowData]);

  // 结算信息状态
  const [settlementMethod, setSettlementMethod] = useState<SettlementMethod>("451定额");
  const [smallProductSubType, setSmallProductSubType] = useState<SmallProductSubType>("视联网");
  const [personList, setPersonList] = useState<PersonItem[]>([
    { id: "1", name: "张三", code: "EMP001", amount: "5,000" }
  ]);

  // 视联网/机房整治表单状态
  const [visionForm, setVisionForm] = useState({
    nvrCount: "10",
    cameraCount: "50",
    startDate: "2026-01-01",
    endDate: "2026-12-31"
  });

  const [roomForm, setRoomForm] = useState({
    cabinet9u: "2",
    cabinet22u: "3",
    cabinet42u: "1",
    cabinet1u: "5",
    infoPoints: "20"
  });

  // 项目维保信息状态
  const [isCycleMaintenance, setIsCycleMaintenance] = useState<"是" | "否">("否");
  const [projectStartDate, setProjectStartDate] = useState("");
  const [projectEndDate, setProjectEndDate] = useState("");
  const [cycle, setCycle] = useState("");

  // 描述类型状态
  const [descriptionType, setDescriptionType] = useState("");

  // 基本情况描述
  const [description, setDescription] = useState("根据用户的需求提供宿舍大楼内的机房整治与固话线路的优化服务，大楼共计5层楼，7个人工累计服务15天，服务时间共计为105个工时。");

  // 附件状态（带mock数据）- 三种类型统一
  const [attachments, setAttachments] = useState<AttachmentItem[]>(getDefaultAttachments());

  // 审批信息状态
  const [mainRecipients, setMainRecipients] = useState<PersonItemData[]>([]);
  const [countersignUsers, setCountersignUsers] = useState<PersonItemData[]>([]);
  const [ccUsers, setCcUsers] = useState<PersonItemData[]>([]);

  // 重置表单
  const resetForm = () => {
    setSelectedProject(null);
    setSelectedOrder(null);
    setSelectedTriple(null);
    setSettlementMethod("451定额");
    setSmallProductSubType("视联网");
    setPersonList([{ id: "1", name: "张三", code: "EMP001", amount: "5,000" }]);
    setVisionForm({ nvrCount: "10", cameraCount: "50", startDate: "2026-01-01", endDate: "2026-12-31" });
    setRoomForm({ cabinet9u: "2", cabinet22u: "3", cabinet42u: "1", cabinet1u: "5", infoPoints: "20" });
    setDescription("根据用户的需求提供宿舍大楼内的机房整治与固话线路的优化服务，大楼共计5层楼，7个人工累计服务15天，服务时间共计为105个工时。");
    setAttachments(getDefaultAttachments());
    setIsCycleMaintenance("否");
    setProjectStartDate("");
    setProjectEndDate("");
    setCycle("");
    setDescriptionType("");
    setMainRecipients([]);
    setCountersignUsers([]);
    setCcUsers([]);
  };

  // 关闭弹窗
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // 添加人员
  const addPerson = () => {
    setPersonList([...personList, { id: Date.now().toString(), name: "", code: "", amount: "" }]);
  };

  // 删除人员
  const removePerson = (id: string) => {
    if (personList.length > 1) {
      setPersonList(personList.filter(p => p.id !== id));
    }
  };

  // 更新人员信息
  const updatePerson = (id: string, field: keyof PersonItem, value: string | number) => {
    setPersonList(personList.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  // 计算视联网金额
  const calculateVisionAmount = () => {
    const nvr = parseInt(visionForm.nvrCount) || 0;
    const camera = parseInt(visionForm.cameraCount) || 0;
    const start = visionForm.startDate ? new Date(visionForm.startDate) : null;
    const end = visionForm.endDate ? new Date(visionForm.endDate) : null;
    let months = 1;
    if (start && end) {
      months = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (30 * 24 * 60 * 60 * 1000)));
    }
    return nvr * 100 + camera * 100 + months * 3;
  };

  // 计算机房整治金额
  const calculateRoomAmount = () => {
    const cabinet9u = parseInt(roomForm.cabinet9u) || 0;
    const cabinet22u = parseInt(roomForm.cabinet22u) || 0;
    const cabinet42u = parseInt(roomForm.cabinet42u) || 0;
    const cabinet1u = parseInt(roomForm.cabinet1u) || 0;
    const infoPoints = parseInt(roomForm.infoPoints) || 0;
    return cabinet9u * 200 + cabinet22u * 400 + cabinet42u * 800 + cabinet1u * 80 + infoPoints * 25;
  };

  // 上传附件（模拟）- 支持多文件
  const handleUpload = (id: string) => {
    const newFileName = `新文件_${new Date().toISOString().slice(0, 10)}.pdf`;
    setAttachments(attachments.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: "uploaded" as const,
          files: [...a.files, { name: newFileName }]
        };
      }
      return a;
    }));
  };

  // 删除附件中的单个文件
  const handleDeleteFile = (attachmentId: string, fileIndex: number) => {
    setAttachments(attachments.map(a => {
      if (a.id === attachmentId) {
        const newFiles = a.files.filter((_, index) => index !== fileIndex);
        return {
          ...a,
          status: newFiles.length > 0 ? "uploaded" as const : "pending" as const,
          files: newFiles
        };
      }
      return a;
    }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[1000px] max-h-[90vh] flex flex-col">
        {/* 头部 */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-lg font-medium">{isViewMode ? "查看自交付结算" : "申请自交付结算"}</h3>
            <p className="text-sm text-gray-500 mt-1">{isViewMode ? "只读查看模式" : "请填写相关信息"}</p>
          </div>
          <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

          {/* 内容区（滚动） */}
          <div className="flex-1 overflow-auto p-6 space-y-6">
            {/* ============ 第一部分：选择申请项目 ============ */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">1</span>
                选择申请项目
              </h4>

              {isViewMode ? (
                /* 查看模式：只读展示项目信息 */
                <div className="space-y-4">
                  {/* 项目类型标签 */}
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-700">{projectType}</Badge>
                  </div>

                  {/* 项目型只读展示 */}
                  {projectType === "项目型" && selectedProject && (
                    <div className="space-y-4">
                      <div className="bg-white rounded border border-gray-200 p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">客户名称</label>
                            <div className="text-sm font-medium">{selectedProject.customerName}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">客户编码</label>
                            <div className="text-sm">{selectedProject.customerCode}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">合同名称</label>
                            <div className="text-sm">{selectedProject.contractName}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">合同编码</label>
                            <div className="text-sm">{selectedProject.contractCode}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">合同金额</label>
                            <div className="text-sm font-medium text-green-600">{selectedProject.contractAmount}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">项目名称</label>
                            <div className="text-sm">{selectedProject.projectName}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">项目编码</label>
                            <div className="text-sm">{selectedProject.projectCode}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">项目类型</label>
                            <Badge className="bg-blue-100 text-blue-700">{selectedProject.projectType}</Badge>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <div className="grid grid-cols-4 gap-4">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">前向金额</label>
                              <div className="text-sm">{selectedProject.selfDeliveryForwardAmount}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">成本金额</label>
                              <div className="text-sm">{selectedProject.selfDeliveryCostAmount}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">毛利</label>
                              <div className="text-sm text-green-600">{selectedProject.profit}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">自交付金额</label>
                              <div className="text-sm">{selectedProject.forwardContractAmount}</div>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-3 mt-3 bg-yellow-50 p-3 rounded">
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">最多可申请金额</label>
                              <div className="text-lg font-bold text-blue-600">{selectedProject.maxApplyAmount}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">已申请金额</label>
                              <div className="text-lg font-medium text-gray-900">{selectedProject.appliedAmount}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">已申请金额毛利</label>
                              <div className="text-lg font-medium text-red-600">{selectedProject.appliedProfit}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 小微标品只读展示 */}
                  {projectType === "小微标品" && selectedOrder && (
                    <div className="bg-white rounded border border-gray-200 p-4 space-y-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">订单名称</label>
                          <div className="text-sm font-medium">{selectedOrder.orderName}</div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">订单编码</label>
                          <div className="text-sm">{selectedOrder.orderCode}</div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">订单金额</label>
                          <div className="text-lg font-medium text-green-600">{selectedOrder.orderAmount}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 三联单只读展示 */}
                  {projectType === "三联单" && selectedTriple && (
                    <div className="bg-white rounded border border-gray-200 p-4 space-y-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">三联单名称</label>
                          <div className="text-sm font-medium">{selectedTriple.tripleName}</div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">三联单编码</label>
                          <div className="text-sm">{selectedTriple.tripleCode}</div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">三联单金额</label>
                          <div className="text-lg font-medium text-green-600">{selectedTriple.tripleAmount}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* 新增模式：可编辑表单 */
                <div className="space-y-4">
                  {/* 项目类型选择 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">申请类型</label>
                    <div className="flex gap-4">
                      {(["项目型", "小微标品", "三联单"] as ProjectType[]).map(type => (
                        <button
                          key={type}
                          onClick={() => setProjectType(type)}
                          className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                            projectType === type
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 选择项目按钮和已选展示 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-700">已选{projectType === "项目型" ? "项目" : projectType === "小微标品" ? "订单" : "三联单"}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => {
                          if (projectType === "项目型") setProjectSelectOpen(true);
                          else if (projectType === "小微标品") setOrderSelectOpen(true);
                          else setTripleSelectOpen(true);
                        }}
                      >
                        <Search className="w-4 h-4" />
                        选择{projectType === "项目型" ? "项目" : projectType === "小微标品" ? "订单" : "三联单"}
                      </Button>
                    </div>

                    {/* 项目型选中展示 */}
                    {projectType === "项目型" && selectedProject && (
                      <div className="bg-white rounded border border-gray-200 p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">客户名称</label>
                            <div className="text-sm font-medium">{selectedProject.customerName}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">客户编码</label>
                            <div className="text-sm">{selectedProject.customerCode}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">合同名称</label>
                            <div className="text-sm">{selectedProject.contractName}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">合同编码</label>
                            <div className="text-sm">{selectedProject.contractCode}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">合同金额</label>
                            <div className="text-sm font-medium text-green-600">{selectedProject.contractAmount}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">项目名称</label>
                            <div className="text-sm">{selectedProject.projectName}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">项目编码</label>
                            <div className="text-sm">{selectedProject.projectCode}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">项目类型</label>
                            <Badge className="bg-blue-100 text-blue-700">{selectedProject.projectType}</Badge>
                          </div>
                        </div>

                        {/* 维保信息字段 */}
                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">是否周期型维保项目</label>
                              <div className="flex gap-2 mt-1">
                                <button
                                  onClick={() => setIsCycleMaintenance("是")}
                                  className={`px-3 py-1 text-xs rounded border ${
                                    isCycleMaintenance === "是"
                                      ? "bg-blue-500 text-white border-blue-500"
                                      : "bg-white text-gray-600 border-gray-300"
                                  }`}
                                >
                                  是
                                </button>
                                <button
                                  onClick={() => setIsCycleMaintenance("否")}
                                  className={`px-3 py-1 text-xs rounded border ${
                                    isCycleMaintenance === "否"
                                      ? "bg-blue-500 text-white border-blue-500"
                                      : "bg-white text-gray-600 border-gray-300"
                                  }`}
                                >
                                  否
                                </button>
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">周期</label>
                              <Input size="sm" placeholder="如：12个月" value={cycle} onChange={e => setCycle(e.target.value)} />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">开始时间</label>
                              <Input type="date" size="sm" value={projectStartDate} onChange={e => setProjectStartDate(e.target.value)} />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">结束时间</label>
                              <Input type="date" size="sm" value={projectEndDate} onChange={e => setProjectEndDate(e.target.value)} />
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <div className="grid grid-cols-4 gap-4">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">前向金额</label>
                              <div className="text-sm">{selectedProject.selfDeliveryForwardAmount}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">成本金额</label>
                              <div className="text-sm">{selectedProject.selfDeliveryCostAmount}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">毛利</label>
                              <div className="text-sm text-green-600">{selectedProject.profit}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">自交付金额</label>
                              <div className="text-sm">{selectedProject.forwardContractAmount}</div>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-3 mt-3 bg-yellow-50 p-3 rounded">
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">最多可申请金额</label>
                              <div className="text-lg font-bold text-blue-600">{selectedProject.maxApplyAmount}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">已申请金额</label>
                              <div className="text-lg font-medium text-gray-900">{selectedProject.appliedAmount}</div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">已申请金额毛利</label>
                              <div className="text-lg font-medium text-red-600">{selectedProject.appliedProfit}</div>
                            </div>
                          </div>
                          {selectedProject.appliedProfit === "5%" && (
                            <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                              <AlertTriangle className="w-4 h-4" />
                              <span>已申请金额毛利为5%，严重低于模式会阶段毛利</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* 小微标品选中展示 */}
                    {projectType === "小微标品" && selectedOrder && (
                      <div className="bg-white rounded border border-gray-200 p-4 space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">订单名称</label>
                            <div className="text-sm font-medium">{selectedOrder.orderName}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">订单编码</label>
                            <div className="text-sm">{selectedOrder.orderCode}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">订单金额</label>
                            <div className="text-lg font-medium text-green-600">{selectedOrder.orderAmount}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 三联单选中展示 */}
                    {projectType === "三联单" && selectedTriple && (
                      <div className="bg-white rounded border border-gray-200 p-4 space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">三联单名称</label>
                            <div className="text-sm font-medium">{selectedTriple.tripleName}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">三联单编码</label>
                            <div className="text-sm">{selectedTriple.tripleCode}</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">三联单金额</label>
                            <div className="text-lg font-medium text-green-600">{selectedTriple.tripleAmount}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {!selectedProject && !selectedOrder && !selectedTriple && (
                      <div className="text-center py-8 text-gray-400">
                        请点击上方按钮选择{projectType === "项目型" ? "项目" : projectType === "小微标品" ? "订单" : "三联单"}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ============ 第二部分：结算信息 ============ */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">2</span>
                结算信息
              </h4>

              {isViewMode ? (
                /* 查看模式：只读展示结算信息 */
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">结算类型</label>
                        <Badge className="bg-blue-100 text-blue-700">{settlementMethod}</Badge>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">总人工费</label>
                        <div className="text-lg font-medium text-green-600">¥8,000.00</div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">结算金额</label>
                        <div className="text-lg font-bold text-blue-600">¥3,200.00</div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">结算单号</label>
                        <div className="text-sm">JSD202605001</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded border border-gray-200 p-4">
                    <div className="text-sm font-medium text-gray-700 mb-3">人员列表</div>
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">姓名</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">人力编码</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">金额</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr>
                          <td className="px-3 py-2">孙八</td>
                          <td className="px-3 py-2">EMP005</td>
                          <td className="px-3 py-2 text-green-600">¥4,500.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* 新增/修改模式 */
                <div className="space-y-4">
                  {/* 小微标品子类型选择 */}
                  {projectType === "小微标品" && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">小微标品类型</label>
                      <div className="flex gap-4">
                        {(["视联网", "机房整治"] as SmallProductSubType[]).map(subType => (
                          <button
                            key={subType}
                            onClick={() => setSmallProductSubType(subType)}
                            className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                              smallProductSubType === subType
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            {subType}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 视联网表单 */}
                  {projectType === "小微标品" && smallProductSubType === "视联网" && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">NVR数量（台）</label>
                          <Input type="number" value={visionForm.nvrCount} onChange={e => setVisionForm({...visionForm, nvrCount: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">摄像头点位数量（个）</label>
                          <Input type="number" value={visionForm.cameraCount} onChange={e => setVisionForm({...visionForm, cameraCount: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">维护开始时间</label>
                          <Input type="date" value={visionForm.startDate} onChange={e => setVisionForm({...visionForm, startDate: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">维护结束时间</label>
                          <Input type="date" value={visionForm.endDate} onChange={e => setVisionForm({...visionForm, endDate: e.target.value})} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 机房整治表单 */}
                  {projectType === "小微标品" && smallProductSubType === "机房整治" && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-5 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">9U机柜（个）</label>
                          <Input type="number" value={roomForm.cabinet9u} onChange={e => setRoomForm({...roomForm, cabinet9u: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">22U机柜（个）</label>
                          <Input type="number" value={roomForm.cabinet22u} onChange={e => setRoomForm({...roomForm, cabinet22u: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">42U机柜（个）</label>
                          <Input type="number" value={roomForm.cabinet42u} onChange={e => setRoomForm({...roomForm, cabinet42u: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">1U机柜整治（个）</label>
                          <Input type="number" value={roomForm.cabinet1u} onChange={e => setRoomForm({...roomForm, cabinet1u: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">信息点集成（个）</label>
                          <Input type="number" value={roomForm.infoPoints} onChange={e => setRoomForm({...roomForm, infoPoints: e.target.value})} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 提示信息 */}
                  <div className="bg-blue-50 rounded-lg p-3 mb-4 text-xs text-gray-500">
                    {projectType === "项目型" && "项目型提示：451定额=总人工费×0.4，350人天=人天×350"}
                    {projectType === "小微标品" && smallProductSubType === "视联网" && "视联网提示：451定额=总人工费×0.4，350人天=人天×350"}
                    {projectType === "小微标品" && smallProductSubType === "机房整治" && "机房整治提示：451定额=总人工费×0.4，350人天=人天×350"}
                    {projectType === "三联单" && "三联单提示：451定额=总人工费×0.4，350人天=人天×350"}
                  </div>

                  {/* 结算类型选择 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">结算类型</label>
                    <div className="flex gap-4">
                      {(["451定额", "350人天"] as SettlementMethod[]).map(method => (
                        <button
                          key={method}
                          onClick={() => setSettlementMethod(method)}
                          className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                            settlementMethod === method
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 451定额表单 */}
                  {settlementMethod === "451定额" && (
                    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">451定额结算</span>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Upload className="w-4 h-4" />
                          上传451预算表
                        </Button>
                      </div>
                      <div className="bg-white rounded border border-gray-200 p-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">总人工费</label>
                            <Input placeholder="请输入" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">结算金额</label>
                            <div className="text-lg font-medium text-green-600">总人工费 × 0.4</div>
                          </div>
                        </div>
                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">人员列表</span>
                            <Button variant="ghost" size="sm" className="gap-1" onClick={addPerson}>
                              <Plus className="w-4 h-4" />
                              添加人
                            </Button>
                          </div>
                          <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">姓名</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">人力编码</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">金额</th>
                                <th className="px-3 py-2 w-12"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {personList.map(person => (
                                <tr key={person.id}>
                                  <td className="px-3 py-2">
                                    <Input size="sm" placeholder="姓名" value={person.name} onChange={e => updatePerson(person.id, "name", e.target.value)} />
                                  </td>
                                  <td className="px-3 py-2">
                                    <Input size="sm" placeholder="编码" value={person.code} onChange={e => updatePerson(person.id, "code", e.target.value)} />
                                  </td>
                                  <td className="px-3 py-2">
                                    <Input size="sm" placeholder="金额" value={person.amount} onChange={e => updatePerson(person.id, "amount", e.target.value)} />
                                  </td>
                                  <td className="px-3 py-2">
                                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => removePerson(person.id)}>
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 350人天表单 */}
                  {settlementMethod === "350人天" && (
                    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                      <span className="font-medium text-gray-700">350人天结算</span>
                      <div className="bg-white rounded border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-700">人员列表</span>
                          <Button variant="ghost" size="sm" className="gap-1" onClick={addPerson}>
                            <Plus className="w-4 h-4" />
                            添加人
                          </Button>
                        </div>
                        <table className="w-full text-sm">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">姓名</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">人力编码</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">人天</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">金额（自动计算）</th>
                              <th className="px-3 py-2 w-12"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                        {personList.map(person => (
                          <tr key={person.id}>
                            <td className="px-3 py-2">
                              <Input size="sm" placeholder="姓名" value={person.name} onChange={e => updatePerson(person.id, "name", e.target.value)} />
                            </td>
                            <td className="px-3 py-2">
                              <Input size="sm" placeholder="编码" value={person.code} onChange={e => updatePerson(person.id, "code", e.target.value)} />
                            </td>
                            <td className="px-3 py-2">
                              <Input size="sm" placeholder="人天" type="number" value={person.personDays || ""} onChange={e => updatePerson(person.id, "personDays", parseInt(e.target.value) || 0)} />
                            </td>
                            <td className="px-3 py-2">
                              <div className="text-green-600 font-medium">
                                ¥{((person.personDays || 0) * 350).toLocaleString()}
                              </div>
                            </td>
                            <td className="px-3 py-2">
                              <Button variant="ghost" size="sm" className="text-red-600" onClick={() => removePerson(person.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

            {/* ============ 第三部分：基本情况描述 ============ */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">3</span>
                自交付基本情况描述
              </h4>

              {isViewMode ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">描述类型</label>
                    <Badge className="bg-blue-100 text-blue-700">网络维护</Badge>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">情况描述</label>
                    <div className="bg-gray-50 rounded border border-gray-200 p-3 text-sm text-gray-700">
                      根据用户的需求提供宿舍大楼内的机房整治与固话线路的优化服务，大楼共计5层楼，7个人工累计服务15天，服务时间共计为105个工时。
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">描述类型</label>
                    <Select value={descriptionType} onValueChange={setDescriptionType}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="请选择描述类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="机房整治">机房整治</SelectItem>
                        <SelectItem value="网络维护">网络维护</SelectItem>
                        <SelectItem value="设备安装">设备安装</SelectItem>
                        <SelectItem value="系统集成">系统集成</SelectItem>
                        <SelectItem value="其他">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <textarea
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请输入自交付基本情况描述..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* ============ 第四部分：附件 ============ */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">4</span>
                附件
              </h4>

              {isViewMode ? (
                /* 查看模式：只读展示附件 */
                <div className="space-y-4">
                  {/* 自动带出区域 */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <h5 className="font-medium text-gray-700">自动带出附件</h5>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {attachments.filter(a => a.source === "auto").map(item => (
                        <div key={item.id} className="bg-white rounded border border-gray-200 p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium">{item.name}</span>
                            {item.required && <span className="text-xs text-red-500">*</span>}
                          </div>
                          {item.files.length > 0 ? (
                            <div className="space-y-1">
                              {item.files.map((file, index) => (
                                <div key={index} className="text-xs text-gray-600 bg-gray-50 rounded px-2 py-1 truncate">
                                  {file.name}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">暂无数据</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* 手工上传区域 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Upload className="w-5 h-5 text-gray-500" />
                      <h5 className="font-medium text-gray-700">手工上传附件</h5>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {attachments.filter(a => a.source === "manual").map(item => (
                        <div key={item.id} className="bg-white rounded border border-gray-200 p-3">
                          <div className="flex items-center gap-2 mb-2">
                            {item.type === "实施照片" ? (
                              <Image className="w-4 h-4 text-orange-500" />
                            ) : (
                              <FileText className="w-4 h-4 text-gray-500" />
                            )}
                            <span className="text-sm font-medium">{item.name}</span>
                            {item.required && <span className="text-xs text-red-500">*</span>}
                          </div>
                          {item.files.length > 0 ? (
                            <div className="space-y-1">
                              {item.files.map((file, index) => (
                                <div key={index} className="text-xs text-gray-600 bg-gray-50 rounded px-2 py-1 truncate">
                                  {file.name}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">暂无数据</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* 新增/修改模式 */
                <div className="space-y-4">
                  {/* 自动带出区域 */}
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <h5 className="font-medium text-gray-700">自动带出附件</h5>
                      <span className="text-xs text-gray-500">（从LTO其他模块关联数据）</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {attachments.filter(a => a.source === "auto").map(item => (
                        <div key={item.id} className="bg-white rounded border border-gray-200 p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-blue-500" />
                              <span className="text-sm font-medium">{item.name}</span>
                              {item.required && <span className="text-xs text-red-500">*</span>}
                            </div>
                            <Button variant="ghost" size="sm" className="text-blue-600 h-auto p-0" onClick={() => handleUpload(item.id)}>
                              上传
                            </Button>
                          </div>
                          {/* 文件列表 - 支持多文件 */}
                          {item.files.length > 0 ? (
                            <div className="space-y-1">
                              {item.files.map((file, index) => (
                                <div key={index} className="flex items-center justify-between text-xs bg-gray-50 rounded px-2 py-1">
                                  <span className="text-gray-600 truncate flex-1">{file.name}</span>
                                  <div className="flex items-center gap-1 ml-1">
                                    <button
                                      onClick={() => handleUpload(item.id)}
                                      className="text-blue-600 hover:text-blue-800"
                                      title="重新上传"
                                    >
                                      <Upload className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteFile(item.id, index)}
                                      className="text-red-500 hover:text-red-700"
                                      title="删除"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">暂无数据</span>
                          )}
                        </div>
                      ))}
                      {attachments.filter(a => a.source === "auto").length === 0 && (
                        <div className="col-span-3 text-center py-4 text-gray-400 text-sm">
                          该类型项目无自动带出附件
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 手工上传区域 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Upload className="w-5 h-5 text-gray-500" />
                      <h5 className="font-medium text-gray-700">手工上传附件</h5>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {attachments.filter(a => a.source === "manual").map(item => (
                        <div key={item.id} className="bg-white rounded border border-gray-200 p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {item.type === "实施照片" ? (
                                <Image className="w-4 h-4 text-orange-500" />
                              ) : (
                                <FileText className="w-4 h-4 text-gray-500" />
                              )}
                              <span className="text-sm font-medium">{item.name}</span>
                              {item.required && <span className="text-xs text-red-500">*</span>}
                            </div>
                          </div>
                          {/* 文件列表 - 支持多文件 */}
                          {item.files.length > 0 ? (
                            <div className="space-y-1 mb-2">
                              {item.files.map((file, index) => (
                                <div key={index} className="flex items-center justify-between text-xs bg-gray-50 rounded px-2 py-1">
                                  <span className="text-gray-600 truncate flex-1">{file.name}</span>
                                  <div className="flex items-center gap-1 ml-1">
                                    <button
                                      onClick={() => handleUpload(item.id)}
                                      className="text-blue-600 hover:text-blue-800"
                                      title="重新上传"
                                    >
                                      <Upload className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteFile(item.id, index)}
                                      className="text-red-500 hover:text-red-700"
                                      title="删除"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : null}
                          {/* 上传按钮 */}
                          <Button variant="outline" size="sm" className="w-full mt-2 gap-1" onClick={() => handleUpload(item.id)}>
                            <Upload className="w-4 h-4" />
                            上传
                          </Button>
                          <p className="text-xs text-gray-400 mt-1">支持 jpg、png、pdf 格式</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ============ 第五部分：审批 ============ */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">5</span>
                审批
              </h4>

              {isViewMode ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">审批流程</h5>
                    <div className="space-y-3">
                      <div className="flex items-start gap-4 p-3 bg-white rounded border border-gray-200">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">1</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-800">西湖支局</span>
                            <Badge className="bg-green-100 text-green-700">审批通过</Badge>
                          </div>
                          <div className="text-xs text-gray-500">审批人：张明 | 审批时间：2026-05-10 14:30</div>
                          <div className="text-xs text-gray-600 mt-1">审批意见：同意，材料齐全，符合结算条件。</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-3 bg-white rounded border border-gray-200">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">2</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-800">人力部</span>
                            <Badge className="bg-green-100 text-green-700">审批通过</Badge>
                          </div>
                          <div className="text-xs text-gray-500">审批人：李华 | 审批时间：2026-05-11 09:15</div>
                          <div className="text-xs text-gray-600 mt-1">审批意见：人员信息核对无误，结算金额合理。</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-3 bg-white rounded border border-gray-200">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">3</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-800">财务部</span>
                            <Badge className="bg-blue-100 text-blue-700">审核中</Badge>
                          </div>
                          <div className="text-xs text-gray-500">审批人：待分配 | 审批时间：-</div>
                          <div className="text-xs text-gray-400 mt-1">审批意见：-</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3 text-xs text-gray-600">
                    <div className="font-medium text-yellow-700 mb-1">审批人范围：</div>
                    <div>1. ICT前端业务需求部门先同意（如<strong>支局</strong>）</div>
                    <div>2. 经营单元（属地自交付）或市公司（调用市公司能力）的人力、财务、云中台、网运部审批</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">主送单位会签人员信息</label>
                    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <Button variant="outline" size="sm" className="mb-2" onClick={() => setMainPersonSelectOpen(true)}>
                        <Plus className="w-4 h-4 mr-1" />
                        添加人员
                      </Button>
                      {mainRecipients.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {mainRecipients.map(person => (
                            <span key={person.id} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                              {person.name}
                              <button onClick={() => setMainRecipients(mainRecipients.filter(p => p.id !== person.id))} className="hover:text-blue-900">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      {mainRecipients.length === 0 && (
                        <div className="text-xs text-gray-400 mt-1">暂未添加人员</div>
                      )}
                    </div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3 text-xs text-gray-600">
                    <div className="font-medium text-yellow-700 mb-1">审批人范围：</div>
                    <div>1. ICT前端业务需求部门先同意（如<strong>支局</strong>）</div>
                    <div>2. 经营单元（属地自交付）或市公司（调用市公司能力）的人力、财务、云中台、网运部审批</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 底部按钮 */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2 flex-shrink-0">
            <Button variant="outline" onClick={handleClose}>
              取消
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              提交申请
            </Button>
          </div>
        </div>
      </div>

      {/* 子弹窗 */}
      <ProjectSelectDialog
        open={projectSelectOpen}
        onClose={() => setProjectSelectOpen(false)}
        onSelect={(project) => setSelectedProject(project)}
      />
      <OrderSelectDialog
        open={orderSelectOpen}
        onClose={() => setOrderSelectOpen(false)}
        onSelect={(order) => setSelectedOrder(order)}
      />
      <TripleSelectDialog
        open={tripleSelectOpen}
        onClose={() => setTripleSelectOpen(false)}
        onSelect={(triple) => setSelectedTriple(triple)}
      />
      {/* 主送人员选择弹窗 */}
      <PersonSelectDialog
        open={mainPersonSelectOpen}
        onClose={() => setMainPersonSelectOpen(false)}
        onSelect={(persons) => setMainRecipients(persons)}
        selectedPersons={mainRecipients}
      />
      {/* 抄送人员选择弹窗 */}
      <PersonSelectDialog
        open={ccPersonSelectOpen}
        onClose={() => setCcPersonSelectOpen(false)}
        onSelect={(persons) => setCcUsers(persons)}
        selectedPersons={ccUsers}
      />
    </div>
  );
}