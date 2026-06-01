import React, { useState } from "react";
import { X, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface Contract {
  id: string;
  contractCode: string;
  contractName: string;
  ictProjectCode: string;
  ictProjectName: string;
  customerName: string;
  customerCode: string;
  contractAmount: string;
  startDate: string;
  endDate: string;
}

interface ContractSelectModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (contract: Contract) => void;
}

// 模拟合同列表数据
const mockContracts: Contract[] = [
  {
    id: "1",
    contractCode: "HT202601001",
    contractName: "智慧城市建设项目合同",
    ictProjectCode: "ICT202601001",
    ictProjectName: "智慧城市建设项目",
    customerName: "杭州市政府",
    customerCode: "KH202601001",
    contractAmount: "5,000,000.00",
    startDate: "2026-01-01",
    endDate: "2028-12-31"
  },
  {
    id: "2",
    contractCode: "HT202601002",
    contractName: "企业云服务采购合同",
    ictProjectCode: "ICT202601002",
    ictProjectName: "企业云服务项目",
    customerName: "宁波某企业",
    customerCode: "KH202601002",
    contractAmount: "800,000.00",
    startDate: "2026-02-01",
    endDate: "2027-01-31"
  },
  {
    id: "3",
    contractCode: "HT202601003",
    contractName: "医院ICT服务合同",
    ictProjectCode: "ICT202601003",
    ictProjectName: "医院信息化建设项目",
    customerName: "杭州某医院",
    customerCode: "KH202601003",
    contractAmount: "2,000,000.00",
    startDate: "2026-03-01",
    endDate: "2029-02-28"
  },
  {
    id: "4",
    contractCode: "HT202601004",
    contractName: "学校智慧校园建设合同",
    ictProjectCode: "ICT202601004",
    ictProjectName: "学校信息化项目",
    customerName: "温州某学校",
    customerCode: "KH202601004",
    contractAmount: "1,500,000.00",
    startDate: "2026-04-01",
    endDate: "2028-03-31"
  },
  {
    id: "5",
    contractCode: "HT202601005",
    contractName: "数字化转型服务合同",
    ictProjectCode: "ICT202601005",
    ictProjectName: "工厂数字化转型项目",
    customerName: "嘉兴某工厂",
    customerCode: "KH202601005",
    contractAmount: "1,200,000.00",
    startDate: "2026-05-01",
    endDate: "2027-04-30"
  },
  {
    id: "6",
    contractCode: "HT202601006",
    contractName: "网络升级改造合同",
    ictProjectCode: "ICT202601006",
    ictProjectName: "网络升级项目",
    customerName: "台州某单位",
    customerCode: "KH202601006",
    contractAmount: "600,000.00",
    startDate: "2026-06-01",
    endDate: "2027-05-31"
  },
  {
    id: "7",
    contractCode: "HT202601007",
    contractName: "数据中心建设合同",
    ictProjectCode: "ICT202601007",
    ictProjectName: "数据中心建设",
    customerName: "金华某企业",
    customerCode: "KH202601007",
    contractAmount: "3,000,000.00",
    startDate: "2026-07-01",
    endDate: "2029-06-30"
  },
  {
    id: "8",
    contractCode: "HT202601008",
    contractName: "智能化改造合同",
    ictProjectCode: "ICT202601008",
    ictProjectName: "智能化改造项目",
    customerName: "绍兴某小区",
    customerCode: "KH202601008",
    contractAmount: "400,000.00",
    startDate: "2026-08-01",
    endDate: "2027-07-31"
  },
  {
    id: "9",
    contractCode: "HT202601009",
    contractName: "安防监控系统合同",
    ictProjectCode: "ICT202601009",
    ictProjectName: "安防监控项目",
    customerName: "湖州某单位",
    customerCode: "KH202601009",
    contractAmount: "500,000.00",
    startDate: "2026-09-01",
    endDate: "2027-08-31"
  },
  {
    id: "10",
    contractCode: "HT202601010",
    contractName: "视频会议系统合同",
    ictProjectCode: "ICT202601010",
    ictProjectName: "视频会议项目",
    customerName: "衢州某企业",
    customerCode: "KH202601010",
    contractAmount: "350,000.00",
    startDate: "2026-10-01",
    endDate: "2027-09-30"
  },
  {
    id: "11",
    contractCode: "HT202601011",
    contractName: "综合布线工程合同",
    ictProjectCode: "ICT202601011",
    ictProjectName: "综合布线项目",
    customerName: "丽水某单位",
    customerCode: "KH202601011",
    contractAmount: "280,000.00",
    startDate: "2026-11-01",
    endDate: "2027-10-31"
  },
  {
    id: "12",
    contractCode: "HT202601012",
    contractName: "无线覆盖工程合同",
    ictProjectCode: "ICT202601012",
    ictProjectName: "无线覆盖项目",
    customerName: "舟山某区域",
    customerCode: "KH202601012",
    contractAmount: "450,000.00",
    startDate: "2026-12-01",
    endDate: "2027-11-30"
  }
];

export function ContractSelectModal({ open, onClose, onSelect }: ContractSelectModalProps) {
  const [searchContractCode, setSearchContractCode] = useState("");
  const [searchContractName, setSearchContractName] = useState("");
  const [searchCustomerName, setSearchCustomerName] = useState("");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 筛选数据
  const filteredContracts = mockContracts.filter(contract => {
    if (searchContractCode && !contract.contractCode.includes(searchContractCode)) return false;
    if (searchContractName && !contract.contractName.includes(searchContractName)) return false;
    if (searchCustomerName && !contract.customerName.includes(searchCustomerName)) return false;
    return true;
  });

  // 分页计算
  const totalContracts = filteredContracts.length;
  const totalPages = Math.ceil(totalContracts / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalContracts);
  const currentContracts = filteredContracts.slice(startIndex, endIndex);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl mx-4 max-h-[90vh] flex flex-col">
        {/* 标题栏 */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h3 className="text-lg font-medium text-gray-900">选择合同（自动带出项目信息）</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 查询条件 */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="grid grid-cols-4 gap-x-4 gap-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">合同编码</label>
              <Input placeholder="请输入" value={searchContractCode} onChange={e => setSearchContractCode(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">合同名称</label>
              <Input placeholder="请输入" value={searchContractName} onChange={e => setSearchContractName(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">客户名称</label>
              <Input placeholder="请输入" value={searchCustomerName} onChange={e => setSearchCustomerName(e.target.value)} />
            </div>
            <div className="flex items-end gap-2">
              <Button variant="outline" size="sm" onClick={() => { setSearchContractCode(""); setSearchContractName(""); setSearchCustomerName(""); }}>
                <Search className="w-4 h-4 mr-1" />
                重置
              </Button>
              <Button size="sm" onClick={() => setCurrentPage(1)}>
                <Search className="w-4 h-4 mr-1" />
                查询
              </Button>
            </div>
          </div>
        </div>

        {/* 表格 */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-10 bg-gray-50 sticky left-0 z-30">选择</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-12">序号</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600">ICT项目名称</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-28">ICT项目编码</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600">合同名称</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-28">合同编码</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-24">客户名称</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-600 w-28">合同金额</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentContracts.map((contract, idx) => (
                <tr key={contract.id} className={`hover:bg-gray-50 cursor-pointer ${selectedContract?.id === contract.id ? 'bg-blue-50' : ''}`} onClick={() => setSelectedContract(contract)}>
                  <td className="px-3 py-3 bg-white sticky left-0 z-10">
                    <input type="radio" name="contract" checked={selectedContract?.id === contract.id} onChange={() => setSelectedContract(contract)} />
                  </td>
                  <td className="px-3 py-3">{startIndex + idx + 1}</td>
                  <td className="px-3 py-3 max-w-36 truncate" title={contract.ictProjectName}>{contract.ictProjectName}</td>
                  <td className="px-3 py-3">{contract.ictProjectCode}</td>
                  <td className="px-3 py-3 max-w-36 truncate" title={contract.contractName}>{contract.contractName}</td>
                  <td className="px-3 py-3">{contract.contractCode}</td>
                  <td className="px-3 py-3 max-w-24 truncate" title={contract.customerName}>{contract.customerName}</td>
                  <td className="px-3 py-3 text-right">{contract.contractAmount}</td>
                </tr>
              ))}
              {currentContracts.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center text-gray-500">
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        <div className="px-6 py-3 border-t border-gray-200 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>每页显示</span>
            <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1); }}>
              <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span>条</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              第 {currentPage} / {totalPages} 页，共 {totalContracts} 条
            </span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>首页</Button>
              <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>上一页</Button>
              <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>下一页</Button>
              <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>末页</Button>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600" disabled={!selectedContract} onClick={() => { if (selectedContract) onSelect(selectedContract); }}>
            确认选择
          </Button>
        </div>
      </div>
    </div>
  );
}