import React, { useState } from "react";
import { Search, Plus, RefreshCw, Eye, Edit, FileText, Trash2, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { ContractDemolitionDetail } from "./ContractDemolitionDetail";
import { ContractDemolitionEdit } from "./ContractDemolitionEdit";
import { ContractDemolitionChange } from "./ContractDemolitionChange";

interface ContractDemolitionRecord {
  id: string;
  projectCode: string;
  projectName: string;
  contractCode: string;
  contractName: string;
  contractAmount: number;
  projectPeriod: string;
  status: "待解构" | "审批中" | "已生效" | "已驳回" | "变更中" | "已作废";
  approvalProgress: string;
  handler: string;
  lastUpdateTime: string;
}

const mockData: ContractDemolitionRecord[] = [
  {
    id: "1",
    projectCode: "PRJ-2024-001",
    projectName: "智慧城市综合管理平台建设项目",
    contractCode: "CT-2024-001",
    contractName: "智慧城市综合管理平台采购合同",
    contractAmount: 5800000,
    projectPeriod: "2024-01-15 至 2024-12-31",
    status: "已生效",
    approvalProgress: "4/4",
    handler: "张三 / 技术部",
    lastUpdateTime: "2024-03-10 14:30:25"
  },
  {
    id: "2",
    projectCode: "PRJ-2024-002",
    projectName: "政务云平台升级改造项目",
    contractCode: "CT-2024-002",
    contractName: "政务云平台升级改造合同",
    contractAmount: 3200000,
    projectPeriod: "2024-02-01 至 2024-10-31",
    status: "审批中",
    approvalProgress: "2/4",
    handler: "李四 / 技术部",
    lastUpdateTime: "2024-03-12 10:15:30"
  },
  {
    id: "3",
    projectCode: "PRJ-2024-003",
    projectName: "数据中心基础设施建设项目",
    contractCode: "CT-2024-003",
    contractName: "数据中心基础设施采购合同",
    contractAmount: 8900000,
    projectPeriod: "2024-03-01 至 2025-02-28",
    status: "待解构",
    approvalProgress: "0/4",
    handler: "王五 / 工程部",
    lastUpdateTime: "2024-03-13 09:20:15"
  }
];

export function ContractDemolition() {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [data] = useState<ContractDemolitionRecord[]>(mockData);
  const [currentView, setCurrentView] = useState<"list" | "detail" | "edit" | "change">("list");
  const [selectedRecord, setSelectedRecord] = useState<ContractDemolitionRecord | null>(null);

  const getStatusBadge = (status: ContractDemolitionRecord["status"]) => {
    const variants: Record<ContractDemolitionRecord["status"], string> = {
      "待解构": "bg-gray-100 text-gray-600 border border-gray-300",
      "审批中": "bg-blue-50 text-blue-600 border border-blue-300",
      "已生效": "bg-green-50 text-green-600 border border-green-300",
      "已驳回": "bg-red-50 text-red-600 border border-red-300",
      "变更中": "bg-orange-50 text-orange-600 border border-orange-300",
      "已作废": "bg-gray-100 text-gray-400 border border-gray-300"
    };
    return <Badge className={variants[status]}>{status}</Badge>;
  };

  const filteredData = data.filter(item => {
    const matchesSearch = 
      item.projectName.includes(searchText) || 
      item.projectCode.includes(searchText) ||
      item.contractCode.includes(searchText);
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 根据当前视图显示不同内容
  if (currentView === "detail" && selectedRecord) {
    return (
      <ContractDemolitionDetail 
        record={selectedRecord} 
        onBack={() => setCurrentView("list")}
        onEdit={() => setCurrentView("edit")}
      />
    );
  }

  if (currentView === "edit" && selectedRecord) {
    return (
      <ContractDemolitionEdit 
        record={selectedRecord} 
        onBack={() => setCurrentView("detail")}
        onSave={() => {
          alert("保存成功！");
          setCurrentView("detail");
        }}
      />
    );
  }

  if (currentView === "change" && selectedRecord) {
    return (
      <ContractDemolitionChange 
        record={selectedRecord} 
        onBack={() => setCurrentView("detail")}
        onSubmit={() => {
          alert("变更申请已提交！");
          setCurrentView("detail");
        }}
      />
    );
  }

  // 列表视图
  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">合同解构管理</h2>
        <p className="text-sm text-gray-500 mt-1">集中展示所有项目合同的解构状态、审批进度、变更记录</p>
      </div>

      {/* 查询筛选区 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="��索项目名称/编号、合同编号"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="解构状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="待解构">待解构</SelectItem>
                <SelectItem value="审批中">审批中</SelectItem>
                <SelectItem value="已生效">已生效</SelectItem>
                <SelectItem value="已驳回">已驳回</SelectItem>
                <SelectItem value="变更中">变更中</SelectItem>
                <SelectItem value="已作废">已作废</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => { setSearchText(""); setStatusFilter("all"); }}>
              重置
            </Button>
          </div>
        </div>
      </div>

      {/* 操作按钮区 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <Button className="bg-[#1890ff] hover:bg-[#0d7dea] text-white">
            <Plus className="w-4 h-4 mr-1" />
            新增解构
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-1" />
            批量导出
          </Button>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-1" />
          刷新
        </Button>
      </div>

      {/* 数据统计栏 */}
      <div className="grid grid-cols-6 gap-4 mb-4">
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border border-blue-100">
          <div className="text-sm text-gray-600 mb-1">合同总数</div>
          <div className="text-2xl font-semibold text-gray-900">{data.length}</div>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">待解构</div>
          <div className="text-2xl font-semibold text-gray-900">
            {data.filter(item => item.status === "待解构").length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border border-blue-100">
          <div className="text-sm text-gray-600 mb-1">审批中</div>
          <div className="text-2xl font-semibold text-blue-600">
            {data.filter(item => item.status === "审批中").length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-4 border border-green-100">
          <div className="text-sm text-gray-600 mb-1">已生效</div>
          <div className="text-2xl font-semibold text-green-600">
            {data.filter(item => item.status === "已生效").length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-white rounded-lg p-4 border border-orange-100">
          <div className="text-sm text-gray-600 mb-1">变更中</div>
          <div className="text-2xl font-semibold text-orange-600">
            {data.filter(item => item.status === "变更中").length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-white rounded-lg p-4 border border-red-100">
          <div className="text-sm text-gray-600 mb-1">已驳回</div>
          <div className="text-2xl font-semibold text-red-600">
            {data.filter(item => item.status === "已驳回").length}
          </div>
        </div>
      </div>

      {/* 数据列表区 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">序号</TableHead>
              <TableHead>项目编号</TableHead>
              <TableHead>项目名称</TableHead>
              <TableHead>合同编号</TableHead>
              <TableHead>合同名称</TableHead>
              <TableHead>合同总金额</TableHead>
              <TableHead>项目工期</TableHead>
              <TableHead>解构状态</TableHead>
              <TableHead>审批进度</TableHead>
              <TableHead>经办人</TableHead>
              <TableHead>最近更新</TableHead>
              <TableHead className="w-32">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, index) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell className="text-gray-500">{index + 1}</TableCell>
                <TableCell className="font-medium">{item.projectCode}</TableCell>
                <TableCell className="max-w-[200px] truncate" title={item.projectName}>
                  {item.projectName}
                </TableCell>
                <TableCell className="font-medium">{item.contractCode}</TableCell>
                <TableCell className="max-w-[200px] truncate" title={item.contractName}>
                  {item.contractName}
                </TableCell>
                <TableCell className="text-right font-medium">
                  ¥{(item.contractAmount / 10000).toFixed(2)}万
                </TableCell>
                <TableCell className="text-sm text-gray-600">{item.projectPeriod}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                    {item.approvalProgress}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-600">{item.handler}</TableCell>
                <TableCell className="text-sm text-gray-500">{item.lastUpdateTime}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => { setCurrentView("detail"); setSelectedRecord(item); }}>
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                    {(item.status === "待解构" || item.status === "已驳回") && (
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => { setCurrentView("edit"); setSelectedRecord(item); }}>
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    {item.status === "已生效" && (
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50" onClick={() => { setCurrentView("change"); setSelectedRecord(item); }}>
                        <FileText className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    {(item.status === "待解构" || item.status === "已驳回") && (
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 分页控件 */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          共 {filteredData.length} 条记录
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>上一页</Button>
          <Button variant="outline" size="sm" className="bg-[#1890ff] text-white border-[#1890ff]">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">下一页</Button>
        </div>
      </div>
    </div>
  );
}