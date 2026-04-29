import React, { useState } from "react";
import { Search, RefreshCw, UserPlus, RotateCcw, Clock, CheckCircle2, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface PoolLead {
  id: string;
  leadCode: string;
  companyName: string;
  region: string;
  potentialValue: number;
  leadLevel: "A级" | "B级" | "C级";
  createTime: string;
  status: "待分配" | "已分配" | "已回收";
  assignee?: string;
  followUpDays?: number;
}

const mockPoolLeads: PoolLead[] = [
  {
    id: "1",
    leadCode: "LD-2024-010",
    companyName: "XX省教育厅",
    region: "华北地区",
    potentialValue: 1200,
    leadLevel: "A级",
    createTime: "2024-03-13 09:00",
    status: "待分配"
  },
  {
    id: "2",
    leadCode: "LD-2024-011",
    companyName: "XX市卫健委",
    region: "华东地区",
    potentialValue: 850,
    leadLevel: "B级",
    createTime: "2024-03-13 10:30",
    status: "待分配"
  },
  {
    id: "3",
    leadCode: "LD-2024-002",
    companyName: "XX市智慧城市办",
    region: "华北地区",
    potentialValue: 1500,
    leadLevel: "A级",
    createTime: "2024-03-10 09:30",
    status: "已分配",
    assignee: "李四 / 销售一部",
    followUpDays: 3
  }
];

interface TeamMember {
  id: string;
  name: string;
  department: string;
  currentLeads: number;
  maxLeads: number;
  conversionRate: number;
}

const mockMembers: TeamMember[] = [
  {
    id: "1",
    name: "李四",
    department: "销售一部",
    currentLeads: 15,
    maxLeads: 20,
    conversionRate: 35
  },
  {
    id: "2",
    name: "王五",
    department: "销售二部",
    currentLeads: 8,
    maxLeads: 20,
    conversionRate: 42
  },
  {
    id: "3",
    name: "赵六",
    department: "销售一部",
    currentLeads: 12,
    maxLeads: 20,
    conversionRate: 38
  }
];

export function LeadDistribution() {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [leads] = useState<PoolLead[]>(mockPoolLeads);
  const [members] = useState<TeamMember[]>(mockMembers);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

  const getStatusBadge = (status: PoolLead["status"]) => {
    const variants: Record<PoolLead["status"], string> = {
      "待分配": "bg-orange-50 text-orange-600 border-orange-300",
      "已分配": "bg-blue-50 text-blue-600 border-blue-300",
      "已回收": "bg-gray-100 text-gray-600 border-gray-300"
    };
    return <Badge className={variants[status]}>{status}</Badge>;
  };

  const getLevelBadge = (level: PoolLead["leadLevel"]) => {
    const variants: Record<PoolLead["leadLevel"], string> = {
      "A级": "bg-red-50 text-red-600 border-red-300",
      "B级": "bg-orange-50 text-orange-600 border-orange-300",
      "C级": "bg-yellow-50 text-yellow-600 border-yellow-300"
    };
    return <Badge className={variants[level]}>{level}</Badge>;
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.companyName.includes(searchText) || lead.leadCode.includes(searchText);
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectLead = (id: string) => {
    setSelectedLeads(prev => 
      prev.includes(id) ? prev.filter(leadId => leadId !== id) : [...prev, id]
    );
  };

  const toAssignCount = leads.filter(l => l.status === "待分配").length;
  const assignedCount = leads.filter(l => l.status === "已分配").length;
  const retrievedCount = leads.filter(l => l.status === "已回收").length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">线索分配</h2>
        <p className="text-sm text-gray-500 mt-1">支持主动领取和分配派发，完整的线索流转管理</p>
      </div>

      <Tabs defaultValue="claim" className="space-y-4">
        <TabsList>
          <TabsTrigger value="claim">主动领取</TabsTrigger>
          <TabsTrigger value="assign">分配派发</TabsTrigger>
          <TabsTrigger value="retrieve">线索回收</TabsTrigger>
          <TabsTrigger value="statistics">成员统计</TabsTrigger>
        </TabsList>

        <TabsContent value="claim" className="space-y-4">
          {/* 统计卡片 */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-orange-50 to-white rounded-lg p-4 border border-orange-100">
              <div className="text-sm text-gray-600 mb-1">待分配线索</div>
              <div className="text-2xl font-semibold text-orange-600">{toAssignCount}</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border border-blue-100">
              <div className="text-sm text-gray-600 mb-1">已分配线索</div>
              <div className="text-2xl font-semibold text-blue-600">{assignedCount}</div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border border-gray-100">
              <div className="text-sm text-gray-600 mb-1">已回收线索</div>
              <div className="text-2xl font-semibold text-gray-600">{retrievedCount}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-4 border border-green-100">
              <div className="text-sm text-gray-600 mb-1">我的待跟进</div>
              <div className="text-2xl font-semibold text-green-600">8</div>
            </div>
          </div>

          {/* 领取规则说明 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-3">主动领取规则</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded p-3">
                <div className="font-medium text-gray-900 mb-1">数量限制</div>
                <div className="text-gray-600">每人最多同时跟进20条线索</div>
              </div>
              <div className="bg-white rounded p-3">
                <div className="font-medium text-gray-900 mb-1">领取权限</div>
                <div className="text-gray-600">仅可领取待分配状态的线索</div>
              </div>
              <div className="bg-white rounded p-3">
                <div className="font-medium text-gray-900 mb-1">自动更新</div>
                <div className="text-gray-600">领取后状态自动变更为跟进中</div>
              </div>
            </div>
          </div>

          {/* 查询筛选 */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="搜索公司名称、线索编号"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="线索状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="待分配">待分配</SelectItem>
                    <SelectItem value="已分配">已分配</SelectItem>
                    <SelectItem value="已回收">已回收</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 线索列表 */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-12">
                    <input type="checkbox" className="w-4 h-4" />
                  </TableHead>
                  <TableHead>线索编号</TableHead>
                  <TableHead>公司名称</TableHead>
                  <TableHead>所属区域</TableHead>
                  <TableHead>预估金额</TableHead>
                  <TableHead>线索等级</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>负责人</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.filter(l => l.status === "待分配").map((lead) => (
                  <TableRow key={lead.id} className="hover:bg-gray-50">
                    <TableCell>
                      <input 
                        type="checkbox" 
                        className="w-4 h-4"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => handleSelectLead(lead.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{lead.leadCode}</TableCell>
                    <TableCell className="font-medium">{lead.companyName}</TableCell>
                    <TableCell className="text-gray-600">{lead.region}</TableCell>
                    <TableCell className="text-right font-medium">
                      ¥{lead.potentialValue.toFixed(2)}万
                    </TableCell>
                    <TableCell>{getLevelBadge(lead.leadLevel)}</TableCell>
                    <TableCell className="text-sm text-gray-500">{lead.createTime}</TableCell>
                    <TableCell>{getStatusBadge(lead.status)}</TableCell>
                    <TableCell className="text-sm text-gray-600">{lead.assignee || "-"}</TableCell>
                    <TableCell>
                      <Button size="sm" className="bg-[#1890ff] hover:bg-[#0d7dea] text-white h-7">
                        领取
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* 批量操作 */}
          {selectedLeads.length > 0 && (
            <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
              <span className="text-sm text-gray-700">
                已选择 <span className="font-medium text-blue-600">{selectedLeads.length}</span> 条线索
              </span>
              <Button className="bg-[#1890ff] hover:bg-[#0d7dea] text-white">
                批量领取
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="assign" className="space-y-4">
          {/* 分配策略 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">分配策略</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <div className="font-medium text-gray-900">手动指定</div>
                </div>
                <div className="text-sm text-gray-600">选择特定成员进行分配</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <UserPlus className="w-5 h-5 text-green-600" />
                  <div className="font-medium text-gray-900">团队分配</div>
                </div>
                <div className="text-sm text-gray-600">按团队维度批量分配</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <RotateCcw className="w-5 h-5 text-purple-600" />
                  <div className="font-medium text-gray-900">负载均衡</div>
                </div>
                <div className="text-sm text-gray-600">根据成员负载自动分配</div>
              </div>
            </div>
          </div>

          {/* 待分配线索列表 */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-medium text-gray-900">待分配线索</h3>
              <Button className="bg-[#1890ff] hover:bg-[#0d7dea] text-white">
                <UserPlus className="w-4 h-4 mr-1" />
                批量分配
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-12">
                    <input type="checkbox" className="w-4 h-4" />
                  </TableHead>
                  <TableHead>线索编号</TableHead>
                  <TableHead>公司名称</TableHead>
                  <TableHead>线索等级</TableHead>
                  <TableHead>预估金额</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>待分配时长</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.filter(l => l.status === "待分配").map((lead) => {
                  const hours = Math.floor((Date.now() - new Date(lead.createTime).getTime()) / (1000 * 60 * 60));
                  return (
                    <TableRow key={lead.id} className="hover:bg-gray-50">
                      <TableCell>
                        <input type="checkbox" className="w-4 h-4" />
                      </TableCell>
                      <TableCell className="font-medium">{lead.leadCode}</TableCell>
                      <TableCell className="font-medium">{lead.companyName}</TableCell>
                      <TableCell>{getLevelBadge(lead.leadLevel)}</TableCell>
                      <TableCell className="text-right font-medium">
                        ¥{lead.potentialValue.toFixed(2)}万
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">{lead.createTime}</TableCell>
                      <TableCell>
                        <Badge className={hours > 48 ? "bg-red-50 text-red-600 border-red-300" : "bg-gray-100 text-gray-600"}>
                          {hours}小时
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" className="h-7">
                          分配
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="retrieve" className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-medium text-gray-900 mb-6">线索回收管理</h3>
            
            {/* 回收规则 */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-4">回收触发条件</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded border border-orange-200">
                  <Clock className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-orange-900">长期未跟进</div>
                    <div className="text-sm text-gray-600 mt-1">
                      超过7天未添加跟进记录的线索将被标记为异常，可由管理员回收
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded border border-blue-200">
                  <UserPlus className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-900">成员主动退回</div>
                    <div className="text-sm text-gray-600 mt-1">
                      成员可主动将不适合的线索退回线索池，需填写退回原因
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded border border-purple-200">
                  <RotateCcw className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-purple-900">管理员强制回收</div>
                    <div className="text-sm text-gray-600 mt-1">
                      管理员可强制回收任意线索，需填写回收原因并记录操作日志
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 异常线索列表 */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-medium text-gray-900 mb-4">异常跟进线索（可回收）</h4>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>线索编号</TableHead>
                    <TableHead>公司名称</TableHead>
                    <TableHead>当前负责人</TableHead>
                    <TableHead>分配时间</TableHead>
                    <TableHead>未跟进天数</TableHead>
                    <TableHead>上次跟进</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="hover:bg-gray-50">
                    <TableCell className="font-medium">LD-2024-005</TableCell>
                    <TableCell className="font-medium">XX省水利厅</TableCell>
                    <TableCell className="text-sm text-gray-600">李四 / 销售一部</TableCell>
                    <TableCell className="text-sm text-gray-500">2024-03-05</TableCell>
                    <TableCell>
                      <Badge className="bg-red-50 text-red-600 border-red-300">8天</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">2024-03-05 15:20</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" className="h-7 text-orange-600 border-orange-300 hover:bg-orange-50">
                        <RotateCcw className="w-3.5 h-3.5 mr-1" />
                        回收
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* 回收历史 */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h4 className="font-medium text-gray-900 mb-4">回收历史记录</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">LD-2024-003 已回收</div>
                      <div className="text-gray-600">原负责人：王五 / 销售二部 | 回收原因：长期未跟进</div>
                    </div>
                  </div>
                  <span className="text-gray-500">2024-03-12 10:30</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-medium text-gray-900 mb-6">成员工作统计</h3>
            
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>成员姓名</TableHead>
                  <TableHead>所属部门</TableHead>
                  <TableHead>当前线索数</TableHead>
                  <TableHead>线索上限</TableHead>
                  <TableHead>负载率</TableHead>
                  <TableHead>转化率</TableHead>
                  <TableHead>状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => {
                  const loadRate = (member.currentLeads / member.maxLeads * 100).toFixed(0);
                  const isOverload = member.currentLeads >= member.maxLeads;
                  
                  return (
                    <TableRow key={member.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell className="text-gray-600">{member.department}</TableCell>
                      <TableCell className="text-center font-medium">{member.currentLeads}</TableCell>
                      <TableCell className="text-center text-gray-600">{member.maxLeads}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${isOverload ? "bg-red-500" : "bg-blue-500"}`}
                              style={{ width: `${Math.min(Number(loadRate), 100)}%` }}
                            />
                          </div>
                          <span className={`text-sm font-medium ${isOverload ? "text-red-600" : "text-gray-700"}`}>
                            {loadRate}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-50 text-green-600 border-green-300">
                          {member.conversionRate}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {isOverload ? (
                          <Badge className="bg-red-50 text-red-600 border-red-300">满载</Badge>
                        ) : (
                          <Badge className="bg-green-50 text-green-600 border-green-300">可分配</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
