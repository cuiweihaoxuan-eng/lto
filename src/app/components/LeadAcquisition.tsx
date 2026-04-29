import React, { useState } from "react";
import { Search, Plus, RefreshCw, Eye, Edit, Download, Star, Tag, MessageSquare, Clock, User, Building2, Phone, Mail, MapPin, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface Lead {
  id: string;
  leadCode: string;
  companyName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  region: string;
  industry: string;
  leadSource: string;
  businessOpportunityCode?: string;
  potentialValue: number;
  urgencyLevel: "高" | "中" | "低";
  demandMatch: "高" | "中" | "低";
  leadLevel: "A级" | "B级" | "C级";
  status: "待分配" | "跟进中" | "已转化" | "已关闭";
  createTime: string;
  assignee?: string;
  followUpCount: number;
}

const mockLeads: Lead[] = [
  {
    id: "1",
    leadCode: "LD-2024-001",
    companyName: "XX市智慧城市建设管理办公室",
    contactPerson: "张主任",
    contactPhone: "138****1234",
    contactEmail: "zhang***@gov.cn",
    region: "华北地区",
    industry: "政府机关",
    leadSource: "商情派发",
    businessOpportunityCode: "BIZ-2024-003",
    potentialValue: 1500,
    urgencyLevel: "高",
    demandMatch: "高",
    leadLevel: "A级",
    status: "跟进中",
    createTime: "2024-03-10 09:30:00",
    assignee: "李四 / 销售一部",
    followUpCount: 5
  },
  {
    id: "2",
    leadCode: "LD-2024-002",
    companyName: "XX省交通运输厅",
    contactPerson: "王处长",
    contactPhone: "139****5678",
    contactEmail: "wang***@gov.cn",
    region: "华东地区",
    industry: "政府机关",
    leadSource: "商情派发",
    businessOpportunityCode: "BIZ-2024-008",
    potentialValue: 2800,
    urgencyLevel: "高",
    demandMatch: "中",
    leadLevel: "A级",
    status: "待分配",
    createTime: "2024-03-12 14:20:00",
    followUpCount: 0
  },
  {
    id: "3",
    leadCode: "LD-2024-003",
    companyName: "XX市公安局",
    contactPerson: "赵科长",
    contactPhone: "136****9012",
    contactEmail: "zhao***@police.cn",
    region: "华南地区",
    industry: "政府机关",
    leadSource: "商情派发",
    potentialValue: 980,
    urgencyLevel: "中",
    demandMatch: "高",
    leadLevel: "B级",
    status: "跟进中",
    createTime: "2024-03-11 16:45:00",
    assignee: "王五 / 销售二部",
    followUpCount: 3
  }
];

export function LeadAcquisition() {
  const [searchText, setSearchText] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [leads] = useState<Lead[]>(mockLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");

  const getStatusBadge = (status: Lead["status"]) => {
    const variants: Record<Lead["status"], string> = {
      "待分配": "bg-orange-50 text-orange-600 border border-orange-300",
      "跟进中": "bg-blue-50 text-blue-600 border border-blue-300",
      "已转化": "bg-green-50 text-green-600 border border-green-300",
      "已关闭": "bg-gray-100 text-gray-600 border border-gray-300"
    };
    return <Badge className={variants[status]}>{status}</Badge>;
  };

  const getLevelBadge = (level: Lead["leadLevel"]) => {
    const variants: Record<Lead["leadLevel"], string> = {
      "A级": "bg-red-50 text-red-600 border border-red-300",
      "B级": "bg-orange-50 text-orange-600 border border-orange-300",
      "C级": "bg-yellow-50 text-yellow-600 border border-yellow-300"
    };
    return <Badge className={variants[level]}>{level}</Badge>;
  };

  const getUrgencyBadge = (level: "高" | "中" | "低") => {
    const variants = {
      "高": "bg-red-50 text-red-600",
      "中": "bg-orange-50 text-orange-600",
      "低": "bg-green-50 text-green-600"
    };
    return <Badge className={variants[level]}>{level}</Badge>;
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.companyName.includes(searchText) || 
      lead.leadCode.includes(searchText) ||
      lead.contactPerson.includes(searchText);
    const matchesLevel = levelFilter === "all" || lead.leadLevel === levelFilter;
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const handleViewDetail = (lead: Lead) => {
    setSelectedLead(lead);
    setViewMode("detail");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedLead(null);
  };

  // 统计数据
  const totalLeads = leads.length;
  const aLevelCount = leads.filter(l => l.leadLevel === "A级").length;
  const bLevelCount = leads.filter(l => l.leadLevel === "B级").length;
  const cLevelCount = leads.filter(l => l.leadLevel === "C级").length;
  const followingCount = leads.filter(l => l.status === "跟进中").length;
  const convertedCount = leads.filter(l => l.status === "已转化").length;

  if (viewMode === "detail" && selectedLead) {
    return (
      <div className="p-6 space-y-4">
        {/* 返回按钮 */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleBackToList}>
            ← 返回列表
          </Button>
          <div className="flex items-center gap-2">
            {getStatusBadge(selectedLead.status)}
            {getLevelBadge(selectedLead.leadLevel)}
          </div>
        </div>

        {/* 基本信息 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-base font-medium text-gray-900 mb-4 pb-3 border-b border-gray-200 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            线索基本信息
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">线索编号</div>
              <div className="text-sm font-medium text-gray-900">{selectedLead.leadCode}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">客户名称</div>
              <div className="text-sm font-medium text-gray-900">{selectedLead.companyName}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">所属行业</div>
              <div className="text-sm font-medium text-gray-900">{selectedLead.industry}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">所属区域</div>
              <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {selectedLead.region}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">线索来源</div>
              <div className="text-sm font-medium text-blue-600">{selectedLead.leadSource}</div>
            </div>
            {selectedLead.businessOpportunityCode && (
              <div>
                <div className="text-sm text-gray-500 mb-1">关联商情编号</div>
                <div className="text-sm font-medium text-blue-600">{selectedLead.businessOpportunityCode}</div>
              </div>
            )}
            <div>
              <div className="text-sm text-gray-500 mb-1">创建时间</div>
              <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                {selectedLead.createTime}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">负责人</div>
              <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-gray-400" />
                {selectedLead.assignee || "待分配"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">跟进次数</div>
              <div className="text-sm font-medium text-gray-900">{selectedLead.followUpCount} 次</div>
            </div>
          </div>
        </div>

        {/* 联系人信息 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-base font-medium text-gray-900 mb-4 pb-3 border-b border-gray-200 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            联系人信息
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">联系人</div>
              <div className="text-sm font-medium text-gray-900">{selectedLead.contactPerson}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">联系电话</div>
              <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                {selectedLead.contactPhone}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">电子邮箱</div>
              <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                {selectedLead.contactEmail}
              </div>
            </div>
          </div>
        </div>

        {/* 线索评分信息 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-base font-medium text-gray-900 mb-4 pb-3 border-b border-gray-200 flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-600" />
            线索评分信息
          </h3>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">线索等级</div>
              <div className="mt-1">{getLevelBadge(selectedLead.leadLevel)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">潜在价值</div>
              <div className="mt-1">{getUrgencyBadge(selectedLead.urgencyLevel)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">紧急程度</div>
              <div className="mt-1">{getUrgencyBadge(selectedLead.urgencyLevel)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">需求匹配度</div>
              <div className="mt-1">{getUrgencyBadge(selectedLead.demandMatch)}</div>
            </div>
            <div className="col-span-4">
              <div className="text-sm text-gray-500 mb-2">预估金额</div>
              <div className="text-2xl font-semibold text-blue-600">
                ¥{selectedLead.potentialValue.toFixed(2)}万
              </div>
            </div>
          </div>
        </div>

        {/* 跟进记录 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-base font-medium text-gray-900 mb-4 pb-3 border-b border-gray-200 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            跟进记录
          </h3>
          <div className="space-y-3">
            {selectedLead.followUpCount > 0 ? (
              <>
                <div className="flex gap-4 pb-4 border-b border-gray-100">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="w-0.5 h-16 bg-blue-200 mt-2" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">电话沟通</span>
                      <span className="text-sm text-gray-500">2024-03-13 14:30</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      跟进人：{selectedLead.assignee}
                    </div>
                    <div className="bg-gray-50 rounded p-3 text-sm text-gray-700">
                      与张主任电话沟通，确认了项目需求和预算范围，客户对我们的解决方案表示认可，计划下周安排现场交流。
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">首次接触</span>
                      <span className="text-sm text-gray-500">2024-03-10 10:15</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      跟进人：{selectedLead.assignee}
                    </div>
                    <div className="bg-gray-50 rounded p-3 text-sm text-gray-700">
                      商情派发后首次联系客户，客户表示有智慧城市建设需求，初步了解了项目背景和时间节点。
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                暂无跟进记录
              </div>
            )}
          </div>
        </div>

        {/* 操作日志 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-base font-medium text-gray-900 mb-4 pb-3 border-b border-gray-200">
            操作日志
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">系统自动评分</span>
              </div>
              <span className="text-gray-500">2024-03-10 09:31</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">商情派发创建线索</span>
              </div>
              <span className="text-gray-500">2024-03-10 09:30</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">线索获取</h2>
        <p className="text-sm text-gray-500 mt-1">商情派发自动创建线索，支持线索分级评分和全流程跟踪管理</p>
      </div>

      <Tabs defaultValue="leads" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leads">线索列表</TabsTrigger>
          <TabsTrigger value="grading">线索分级标准</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-4">
          {/* 统计卡片 */}
          <div className="grid grid-cols-6 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border border-blue-100">
              <div className="text-sm text-gray-600 mb-1">线索总数</div>
              <div className="text-2xl font-semibold text-gray-900">{totalLeads}</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-white rounded-lg p-4 border border-red-100">
              <div className="text-sm text-gray-600 mb-1">A级线索</div>
              <div className="text-2xl font-semibold text-red-600">{aLevelCount}</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-white rounded-lg p-4 border border-orange-100">
              <div className="text-sm text-gray-600 mb-1">B级线索</div>
              <div className="text-2xl font-semibold text-orange-600">{bLevelCount}</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-white rounded-lg p-4 border border-yellow-100">
              <div className="text-sm text-gray-600 mb-1">C级线索</div>
              <div className="text-2xl font-semibold text-yellow-600">{cLevelCount}</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-white rounded-lg p-4 border border-cyan-100">
              <div className="text-sm text-gray-600 mb-1">跟进中</div>
              <div className="text-2xl font-semibold text-cyan-600">{followingCount}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-4 border border-green-100">
              <div className="text-sm text-gray-600 mb-1">已转化</div>
              <div className="text-2xl font-semibold text-green-600">{convertedCount}</div>
            </div>
          </div>

          {/* 查询筛选区 */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="搜索客户名称、线索编号、联系人"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="线索等级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部等级</SelectItem>
                    <SelectItem value="A级">A级</SelectItem>
                    <SelectItem value="B级">B级</SelectItem>
                    <SelectItem value="C级">C级</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="线索状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="待分配">待分配</SelectItem>
                    <SelectItem value="跟进中">跟进中</SelectItem>
                    <SelectItem value="已转化">已转化</SelectItem>
                    <SelectItem value="已关闭">已关闭</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 操作按钮区 */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button className="bg-[#1890ff] hover:bg-[#0d7dea] text-white">
                <Plus className="w-4 h-4 mr-1" />
                新增线索
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-1" />
                导出数据
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-1" />
              刷新
            </Button>
          </div>

          {/* 数据列表 */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-12">序号</TableHead>
                  <TableHead>线索编号</TableHead>
                  <TableHead>客户名称</TableHead>
                  <TableHead>联系人</TableHead>
                  <TableHead>联系电话</TableHead>
                  <TableHead>所属区域</TableHead>
                  <TableHead>线索来源</TableHead>
                  <TableHead>关联商情</TableHead>
                  <TableHead>预估金额</TableHead>
                  <TableHead>线索等级</TableHead>
                  <TableHead>线索状态</TableHead>
                  <TableHead>负责人</TableHead>
                  <TableHead>跟进次数</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="w-24">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead, index) => (
                  <TableRow key={lead.id} className="hover:bg-gray-50">
                    <TableCell className="text-gray-500">{index + 1}</TableCell>
                    <TableCell className="font-medium">{lead.leadCode}</TableCell>
                    <TableCell className="max-w-[180px] truncate font-medium" title={lead.companyName}>
                      {lead.companyName}
                    </TableCell>
                    <TableCell>{lead.contactPerson}</TableCell>
                    <TableCell className="text-gray-600">{lead.contactPhone}</TableCell>
                    <TableCell className="text-gray-600">{lead.region}</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-50 text-blue-600 border-blue-200">{lead.leadSource}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-blue-600">
                      {lead.businessOpportunityCode || "-"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ¥{lead.potentialValue.toFixed(2)}万
                    </TableCell>
                    <TableCell>{getLevelBadge(lead.leadLevel)}</TableCell>
                    <TableCell>{getStatusBadge(lead.status)}</TableCell>
                    <TableCell className="text-sm text-gray-600">{lead.assignee || "待分配"}</TableCell>
                    <TableCell className="text-center">{lead.followUpCount}</TableCell>
                    <TableCell className="text-sm text-gray-500">{lead.createTime}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => handleViewDetail(lead)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-green-600 hover:text-green-700 hover:bg-green-50">
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* 分页 */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              共 {filteredLeads.length} 条记录
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>上一页</Button>
              <Button variant="outline" size="sm" className="bg-[#1890ff] text-white border-[#1890ff]">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">下一页</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="grading" className="space-y-4">
          {/* 分级标准配置 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-medium text-gray-900 mb-4 pb-3 border-b border-gray-200">
              自定义线索分级标准
            </h3>
            
            <div className="space-y-6">
              {/* 潜在价值维度 */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">潜在价值评分</h4>
                  <Badge className="bg-blue-50 text-blue-600 border-blue-200">权重：40%</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <div className="font-medium text-red-600 mb-2">高（8-10分）</div>
                    <div className="text-sm text-gray-600">预估金额 ≥ 1000万元</div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded p-3">
                    <div className="font-medium text-orange-600 mb-2">中（5-7分）</div>
                    <div className="text-sm text-gray-600">500万 ≤ 预估金额 &lt; 1000万</div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <div className="font-medium text-yellow-600 mb-2">低（1-4分）</div>
                    <div className="text-sm text-gray-600">预估金额 &lt; 500万元</div>
                  </div>
                </div>
              </div>

              {/* 紧急程度维度 */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">紧急程度评分</h4>
                  <Badge className="bg-blue-50 text-blue-600 border-blue-200">权重：30%</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <div className="font-medium text-red-600 mb-2">高（8-10分）</div>
                    <div className="text-sm text-gray-600">1个月内需求明确</div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded p-3">
                    <div className="font-medium text-orange-600 mb-2">中（5-7分）</div>
                    <div className="text-sm text-gray-600">3个月内有采购计划</div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <div className="font-medium text-yellow-600 mb-2">低（1-4分）</div>
                    <div className="text-sm text-gray-600">6个月后或不确定</div>
                  </div>
                </div>
              </div>

              {/* 需求匹配度维度 */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">需求匹配度评分</h4>
                  <Badge className="bg-blue-50 text-blue-600 border-blue-200">权重：30%</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <div className="font-medium text-red-600 mb-2">高（8-10分）</div>
                    <div className="text-sm text-gray-600">需求与产品高度匹配</div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded p-3">
                    <div className="font-medium text-orange-600 mb-2">中（5-7分）</div>
                    <div className="text-sm text-gray-600">需求基本匹配，需定制</div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <div className="font-medium text-yellow-600 mb-2">低（1-4分）</div>
                    <div className="text-sm text-gray-600">需求匹配度较低</div>
                  </div>
                </div>
              </div>

              {/* 线索等级规则 */}
              <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                <h4 className="font-medium text-gray-900 mb-4">线索等级评定规则</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-50 text-red-600 border-red-300">A级</Badge>
                    <span className="text-gray-700">综合得分 ≥ 8分，优先跟进</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-orange-50 text-orange-600 border-orange-300">B级</Badge>
                    <span className="text-gray-700">5分 ≤ 综合得分 &lt; 8分，正常跟进</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-50 text-yellow-600 border-yellow-300">C级</Badge>
                    <span className="text-gray-700">综合得分 &lt; 5分，储备跟进</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline">重置默认</Button>
              <Button className="bg-[#1890ff] hover:bg-[#0d7dea] text-white">保存配置</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}