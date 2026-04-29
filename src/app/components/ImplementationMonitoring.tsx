import React, { useState } from "react";
import { Search, RefreshCw, Download, FileText, TrendingUp, AlertTriangle, CheckCircle, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ProjectProgressRecord {
  id: string;
  projectName: string;
  projectManager: string;
  overallProgress: number;
  plannedProgress: number;
  deviation: number;
  delayedMilestone: string;
  delayDays: number;
  riskLevel: "正常" | "一般" | "较大" | "重大";
}

const mockProgressData: ProjectProgressRecord[] = [
  {
    id: "1",
    projectName: "智慧城市综合管理平台建设项目",
    projectManager: "张三",
    overallProgress: 75,
    plannedProgress: 85,
    deviation: -10,
    delayedMilestone: "系统集成测试",
    delayDays: 15,
    riskLevel: "较大"
  },
  {
    id: "2",
    projectName: "政务云平台升级改造项目",
    projectManager: "李四",
    overallProgress: 92,
    plannedProgress: 90,
    deviation: 2,
    delayedMilestone: "-",
    delayDays: 0,
    riskLevel: "正常"
  },
  {
    id: "3",
    projectName: "数据中心基础设施建设项目",
    projectManager: "王五",
    overallProgress: 55,
    plannedProgress: 75,
    deviation: -20,
    delayedMilestone: "硬件设备安装",
    delayDays: 30,
    riskLevel: "重大"
  }
];

export function ImplementationMonitoring() {
  const [searchText, setSearchText] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [data] = useState<ProjectProgressRecord[]>(mockProgressData);

  const getRiskBadge = (level: ProjectProgressRecord["riskLevel"]) => {
    const variants: Record<ProjectProgressRecord["riskLevel"], string> = {
      "正常": "bg-green-50 text-green-600 border border-green-300",
      "一般": "bg-blue-50 text-blue-600 border border-blue-300",
      "较大": "bg-orange-50 text-orange-600 border border-orange-300",
      "重大": "bg-red-50 text-red-600 border border-red-300"
    };
    return <Badge className={variants[level]}>{level}</Badge>;
  };

  const getDeviationColor = (deviation: number) => {
    if (deviation >= 0) return "text-green-600";
    if (deviation > -10) return "text-orange-600";
    return "text-red-600";
  };

  const filteredData = data.filter(item => {
    const matchesSearch = item.projectName.includes(searchText) || item.projectManager.includes(searchText);
    const matchesRisk = riskFilter === "all" || item.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const totalProjects = data.length;
  const normalProjects = data.filter(item => item.deviation >= 0).length;
  const delayedProjects = data.filter(item => item.deviation < 0).length;
  const totalMilestones = data.length * 5; // 假设每个项目5个里程碑
  const completedMilestones = Math.floor(totalMilestones * 0.65);
  const milestoneRate = ((completedMilestones / totalMilestones) * 100).toFixed(1);

  // 图表数据
  const deptProgressData = [
    { dept: "研发部", progress: 85 },
    { dept: "工程部", progress: 78 },
    { dept: "测试部", progress: 92 },
    { dept: "实施部", progress: 68 },
    { dept: "运维部", progress: 88 }
  ];

  const deviationDistribution = [
    { name: "正常", value: 35, color: "#10b981" },
    { name: "轻微延误", value: 28, color: "#f59e0b" },
    { name: "严重延误", value: 15, color: "#ef4444" },
    { name: "超前", value: 22, color: "#3b82f6" }
  ];

  const monthlyTrend = [
    { month: "10月", planned: 45, actual: 42 },
    { month: "11月", planned: 52, actual: 48 },
    { month: "12月", planned: 58, actual: 55 },
    { month: "1月", planned: 65, actual: 62 },
    { month: "2月", planned: 72, actual: 68 },
    { month: "3月", planned: 78, actual: 75 }
  ];

  const ganttData = [
    { project: "智慧城市平台", start: 0, duration: 75, color: "#3b82f6" },
    { project: "政务云平台", start: 10, duration: 92, color: "#10b981" },
    { project: "数据中心建设", start: 20, duration: 55, color: "#ef4444" }
  ];

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">实施进度监控</h2>
        <p className="text-sm text-gray-500 mt-1">项目进度可视化监控，展示全量项目的进度情况、里程碑达成情况、工期偏差</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">进度总览</TabsTrigger>
          <TabsTrigger value="detail">进度明细</TabsTrigger>
          <TabsTrigger value="warning">风险预警</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* 核心指标卡片区 */}
          <div className="grid grid-cols-6 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600">项目总数</div>
                <TrendingUp className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-semibold text-gray-900">{totalProjects}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-4 border border-green-100">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600">正常推进</div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-2xl font-semibold text-green-600">{normalProjects}</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-white rounded-lg p-4 border border-red-100">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600">滞后项目</div>
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-2xl font-semibold text-red-600">{delayedProjects}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-4 border border-purple-100">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600">里程碑总数</div>
              </div>
              <div className="text-2xl font-semibold text-gray-900">{totalMilestones}</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-lg p-4 border border-indigo-100">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600">已达成数</div>
              </div>
              <div className="text-2xl font-semibold text-indigo-600">{completedMilestones}</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-white rounded-lg p-4 border border-cyan-100">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600">达成率</div>
              </div>
              <div className="text-2xl font-semibold text-cyan-600">{milestoneRate}%</div>
            </div>
          </div>

          {/* 可视化图表区占位 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-base font-medium text-gray-900 mb-4">项目进度甘特图</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ganttData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="project" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="duration" fill="#3b82f6" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-base font-medium text-gray-900 mb-4">部门进度排名</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={deptProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dept" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="progress" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-base font-medium text-gray-900 mb-4">工期偏差分布</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={deviationDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {deviationDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-base font-medium text-gray-900 mb-4">月度里程碑达成趋势</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="planned" stroke="#94a3b8" strokeWidth={2} name="计划" />
                  <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} name="实际" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 滞后项目预警清单 */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-base font-medium text-gray-900">滞后项目预警清单</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>项目名称</TableHead>
                  <TableHead>项目经理</TableHead>
                  <TableHead>整体进度偏差率</TableHead>
                  <TableHead>滞后里程碑节点</TableHead>
                  <TableHead>滞后时长(天)</TableHead>
                  <TableHead>风险等级</TableHead>
                  <TableHead className="w-24">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.filter(item => item.deviation < 0).map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{item.projectName}</TableCell>
                    <TableCell>{item.projectManager}</TableCell>
                    <TableCell className={`font-medium ${getDeviationColor(item.deviation)}`}>
                      {item.deviation}%
                    </TableCell>
                    <TableCell className="text-gray-600">{item.delayedMilestone}</TableCell>
                    <TableCell className="font-medium text-red-600">{item.delayDays}</TableCell>
                    <TableCell>{getRiskBadge(item.riskLevel)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        查看
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="detail" className="space-y-4">
          {/* 查询筛选区 */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="搜索项目名称、项目经理"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Select value={riskFilter} onValueChange={setRiskFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="风险等级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部等级</SelectItem>
                    <SelectItem value="正常">正常</SelectItem>
                    <SelectItem value="一般">一般</SelectItem>
                    <SelectItem value="较大">较大</SelectItem>
                    <SelectItem value="重大">重大</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setSearchText(""); setRiskFilter("all"); }}>
                  重置
                </Button>
              </div>
            </div>
          </div>

          {/* 操作按钮区 */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-1" />
                批量导出
              </Button>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-1" />
                导出甘特图
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
                  <TableHead>项目名称</TableHead>
                  <TableHead>项目经理</TableHead>
                  <TableHead>实际进度</TableHead>
                  <TableHead>计划进度</TableHead>
                  <TableHead>进度偏差</TableHead>
                  <TableHead>滞后里程碑</TableHead>
                  <TableHead>滞后时长</TableHead>
                  <TableHead>风险等级</TableHead>
                  <TableHead className="w-32">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {item.projectName}
                    </TableCell>
                    <TableCell>{item.projectManager}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${item.overallProgress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{item.overallProgress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{item.plannedProgress}%</span>
                    </TableCell>
                    <TableCell className={`font-medium ${getDeviationColor(item.deviation)}`}>
                      {item.deviation > 0 ? '+' : ''}{item.deviation}%
                    </TableCell>
                    <TableCell className="text-gray-600">{item.delayedMilestone}</TableCell>
                    <TableCell className={item.delayDays > 0 ? "text-red-600 font-medium" : ""}>
                      {item.delayDays > 0 ? `${item.delayDays}天` : "-"}
                    </TableCell>
                    <TableCell>{getRiskBadge(item.riskLevel)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          详情
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-green-600 hover:text-green-700 hover:bg-green-50">
                          填报
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="warning" className="space-y-4">
          {/* 风险预警统计 */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-red-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">严重预警</span>
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-2xl font-semibold text-red-600">3</div>
              <div className="text-xs text-gray-500 mt-1">需立即处理</div>
            </div>
            <div className="bg-white rounded-lg border border-orange-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">重要预警</span>
                <AlertTriangle className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-2xl font-semibold text-orange-600">5</div>
              <div className="text-xs text-gray-500 mt-1">3日内处理</div>
            </div>
            <div className="bg-white rounded-lg border border-yellow-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">一般预警</span>
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              </div>
              <div className="text-2xl font-semibold text-yellow-600">8</div>
              <div className="text-xs text-gray-500 mt-1">7日内处理</div>
            </div>
            <div className="bg-white rounded-lg border border-green-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">已处理</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-2xl font-semibold text-green-600">24</div>
              <div className="text-xs text-gray-500 mt-1">本月累计</div>
            </div>
          </div>

          {/* 筛选和操作 */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部预警</SelectItem>
                    <SelectItem value="critical">严重预警</SelectItem>
                    <SelectItem value="important">重要预警</SelectItem>
                    <SelectItem value="normal">一般预警</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="pending">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">待处理</SelectItem>
                    <SelectItem value="processing">处理中</SelectItem>
                    <SelectItem value="completed">已完成</SelectItem>
                    <SelectItem value="closed">已销号</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="搜索预警内容..." className="w-64" />
              </div>
              <Button className="bg-[#1890ff] hover:bg-[#0d7dea] text-white">
                <Plus className="w-4 h-4 mr-1" />
                新增预警
              </Button>
            </div>
          </div>

          {/* 预警列表 */}
          <div className="bg-white rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[100px]">预警级别</TableHead>
                  <TableHead className="w-[140px]">预警时间</TableHead>
                  <TableHead className="w-[140px]">预警类型</TableHead>
                  <TableHead>预警内容</TableHead>
                  <TableHead className="w-[100px]">责任人</TableHead>
                  <TableHead className="w-[100px]">状态</TableHead>
                  <TableHead className="w-[100px]">处理期限</TableHead>
                  <TableHead className="w-[180px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-red-600 font-medium">严重</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">2024-03-15 09:20</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">进度延误</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="max-w-md">
                      核心模块开发进度严重滞后，已延误5天，可能影响整体项目交付
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">张三</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">处理中</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-red-600">2024-03-16</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        处置
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                        详情
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-red-600 font-medium">严重</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">2024-03-14 14:35</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">质量问题</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="max-w-md">
                      系统测试发现5个严重BUG，影响核心业务功能正常使用
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">李四</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">待处理</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-red-600">2024-03-15</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        处置
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                        详情
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-red-600 font-medium">严重</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">2024-03-13 16:10</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">资源风险</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="max-w-md">
                      关键技术人员离职，项目团队人员不足，急需补充
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">王五</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">待处理</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-red-600">2024-03-14</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        处置
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                        详情
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <span className="text-orange-600 font-medium">重要</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">2024-03-15 11:45</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">需求变更</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="max-w-md">
                      客户提出重要功能调整需求，需评估对项目进度的影响
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">赵六</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">待处理</Badge>
                  </TableCell>
                  <TableCell className="text-sm">2024-03-18</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        处置
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                        详情
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <span className="text-orange-600 font-medium">重要</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">2024-03-14 10:20</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">成本超支</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="max-w-md">
                      开发成本预计超出预算15%，需要采取控制措施
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">钱七</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">处理中</Badge>
                  </TableCell>
                  <TableCell className="text-sm">2024-03-17</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        处置
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                        详情
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span className="text-yellow-600 font-medium">一般</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">2024-03-15 15:30</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">文档缺失</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="max-w-md">
                      部分技术文档未及时更新，需要补充完善
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">孙八</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">待处理</Badge>
                  </TableCell>
                  <TableCell className="text-sm">2024-03-20</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        处置
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                        详情
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 font-medium">已处理</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">2024-03-12 09:15</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">沟通问题</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="max-w-md">
                      客户沟通不畅，需求理解存在偏差
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">周九</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">已完成</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">2024-03-13</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                        详情
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                        销号
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* 预警处理流程说明 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-medium text-blue-900 mb-2">风险预警处理流程</div>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>1. <strong>预警识别：</strong>系统自动监测或人工发现风险，创建预警记录</p>
                  <p>2. <strong>预警处置：</strong>责任人接收预警，分析原因，制定处置措施并执行</p>
                  <p>3. <strong>处置复核：</strong>项目经理或质量管理员复核处置结果，确认是否有效</p>
                  <p>4. <strong>预警销号：</strong>风险消除后，由授权人员进行预警销号，归档留痕</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}