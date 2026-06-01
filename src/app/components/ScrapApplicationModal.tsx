import React, { useState, useEffect } from "react";
import { X, Trash2, Upload, Search, ChevronDown, ChevronRight, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface FixedAsset {
  id: string;
  assetName: string;
  assetCardNo: string;
  assetNature: string;
  equipmentAmount: string;
  sapAssetClass: string;
  capitalizationDate: string;
  overdueDate: string;
  purchaseAmount: string;
  depreciationAmount: string;
  responsiblePerson: string;
  projectCode: string;
  ictProjectCode: string;
}

interface PersonItemData {
  id: string;
  name: string;
  phone: string;
  empNo: string;
  dept: string;
}

interface ScrapApplicationModalProps {
  open: boolean;
  onClose: () => void;
  selectedAssets: FixedAsset[];
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

// 审批人选择弹窗
function ApproverSelectDialog({ open, onClose, onSelect, selectedApprover }: {
  open: boolean;
  onClose: () => void;
  onSelect: (approver: string) => void;
  selectedApprover: string;
}) {
  const [searchFields, setSearchFields] = useState({ name: "", phone: "", dept: "", empNo: "" });
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (selectedApprover) {
      const person = mockPersons.find(p => p.name === selectedApprover);
      if (person) {
        setSelected(new Set([person.id]));
      }
    }
  }, [selectedApprover]);

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
    setSelected(new Set([id]));
  };

  const handleConfirm = () => {
    const selectedPerson = mockPersons.find(p => selected.has(p.id));
    if (selectedPerson) {
      onSelect(selectedPerson.name);
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg shadow-xl w-[900px] max-h-[80vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium">选择审批人</h3>
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

export function ScrapApplicationModal({ open, onClose, selectedAssets }: ScrapApplicationModalProps) {
  const [scrapDate, setScrapDate] = useState("");
  const [scrapReason, setScrapReason] = useState("");
  const [attachment, setAttachment] = useState("");
  const [assetList, setAssetList] = useState<FixedAsset[]>(selectedAssets);
  const [approver, setApprover] = useState("");
  const [approverSelectOpen, setApproverSelectOpen] = useState(false);

  // 当selectedAssets变化时更新assetList
  useEffect(() => {
    setAssetList(selectedAssets);
  }, [selectedAssets]);

  // 计算总金额和折旧金额
  const totalAmount = assetList.reduce((sum, asset) => {
    return sum + parseFloat(asset.purchaseAmount.replace(/,/g, '') || '0');
  }, 0);

  const totalDepreciation = assetList.reduce((sum, asset) => {
    return sum + parseFloat(asset.depreciationAmount.replace(/,/g, '') || '0');
  }, 0);

  const removeAsset = (id: string) => {
    setAssetList(prev => prev.filter(a => a.id !== id));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
        {/* 标题栏 */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h3 className="text-lg font-medium text-gray-900">新增资产报废申请</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 提示信息 */}
        <div className="px-6 py-3 bg-red-50 border-b border-red-100 flex-shrink-0">
          <p className="text-sm text-red-700">
            清单范围：勾选资产可添加到资产报废申请中生成报废审批单
          </p>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* 基本信息 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-800 mb-4 flex items-center">
              <span className="w-1 h-4 bg-red-500 rounded mr-2"></span>
              基本信息
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">报废日期</label>
                <Input type="date" value={scrapDate} onChange={e => setScrapDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">附件</label>
                <div className="flex gap-2">
                  <Input placeholder="点击上传" value={attachment} readOnly className="flex-1" />
                  <Button variant="outline" size="sm" onClick={() => alert('上传附件')}>
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">报废原因说明</label>
                <Textarea placeholder="请输入报废原因说明" value={scrapReason} onChange={e => setScrapReason(e.target.value)} rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">审批人</label>
                <div className="flex gap-2">
                  <Input placeholder="请选择审批人" value={approver} readOnly className="flex-1" />
                  <Button variant="outline" size="sm" onClick={() => setApproverSelectOpen(true)}>
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">总金额</label>
                <Input value={totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">当前折旧总金额</label>
                <Input value={totalDepreciation.toLocaleString('zh-CN', { minimumFractionDigits: 2 })} readOnly />
              </div>
            </div>
          </div>

          {/* 报废资产清单 */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div className="text-sm font-medium text-gray-700 flex items-center">
                <span className="w-1 h-4 bg-red-500 rounded mr-2"></span>
                报废资产清单
              </div>
            </div>
            <div className="overflow-x-auto max-h-64">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-10">序号</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">资产名称</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">资产卡片号</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">SAP资产分类</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-600">资本化日期</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-600">逾龄日期</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">设备采购金额</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">折旧金额</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">责任人</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">工程编码</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">ICT项目编码</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-600 w-16">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {assetList.map((asset, idx) => (
                    <tr key={asset.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">{idx + 1}</td>
                      <td className="px-3 py-2 max-w-32 truncate" title={asset.assetName}>{asset.assetName}</td>
                      <td className="px-3 py-2">{asset.assetCardNo}</td>
                      <td className="px-3 py-2 max-w-32 truncate" title={asset.sapAssetClass}>{asset.sapAssetClass}</td>
                      <td className="px-3 py-2 text-center">{asset.capitalizationDate}</td>
                      <td className="px-3 py-2 text-center">{asset.overdueDate}</td>
                      <td className="px-3 py-2 text-right">{asset.purchaseAmount}</td>
                      <td className="px-3 py-2 text-right">{asset.depreciationAmount}</td>
                      <td className="px-3 py-2">{asset.responsiblePerson}</td>
                      <td className="px-3 py-2">{asset.projectCode}</td>
                      <td className="px-3 py-2">{asset.ictProjectCode}</td>
                      <td className="px-3 py-2 text-center">
                        <Button variant="link" size="sm" className="text-red-600 h-auto p-0" onClick={() => removeAsset(asset.id)}>
                          <Trash2 className="w-3 h-3 mr-1" />
                          删除
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {assetList.length === 0 && (
                    <tr>
                      <td colSpan={12} className="px-3 py-4 text-center text-gray-500">
                        暂无资产
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button className="bg-red-500 hover:bg-red-600" onClick={() => alert('提交资产报废申请')}>
            提交
          </Button>
        </div>
      </div>

      {/* 审批人选择弹窗 */}
      <ApproverSelectDialog
        open={approverSelectOpen}
        onClose={() => setApproverSelectOpen(false)}
        onSelect={(name) => setApprover(name)}
        selectedApprover={approver}
      />
    </div>
  );
}