import React, { useState } from "react";
import { X, Search, ChevronDown, ChevronRight, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface PersonItemData {
  id: string;
  name: string;
  phone: string;
  empNo: string;
  dept: string;
}

interface ApprovalSelectModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (approver: string) => void;
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

export function ApprovalSelectModal({ open, onClose, onSelect }: ApprovalSelectModalProps) {
  const [searchFields, setSearchFields] = useState({ name: "", phone: "", dept: "", empNo: "" });
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());

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
    if (selectedList.length > 0) {
      onSelect(selectedList.map(p => p.name).join("、"));
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]">
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