import React, { useState } from "react";
import { Search, Plus, RefreshCw, Eye, Edit, Download, CheckCircle, XCircle, FileText, Clock, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface QualityControlPoint {
  id: string;
  controlPointCode: string;
  controlPointName: string;
  projectName: string;
  milestone: string;
  level: "一级" | "二级" | "三级";
  acceptanceStandard: string;
  acceptanceSubject: string;
  status: "未启用" | "待验收" | "已验收" | "已作废";
}

interface QualityIssue {
  id: string;
  issueCode: string;
  projectName: string;
  controlPoint: string;
  issueDescription: string;
  issueLevel: "一般" | "较大" | "重大";
  rectificationStatus: "待整改" | "整改中" | "待复核" | "已闭环" | "已超期";
  responsiblePerson: string;
  deadline: string;
}

const mockControlPoints: QualityControlPoint[] = [
  {
    id: "1",
    controlPointCode: "QCP-2024-001",
    controlPointName: "初验文档质量核验",
    projectName: "智慧城市综合管理平台建设项目",
    milestone: "初步验收",
    level: "一级",
    acceptanceStandard: "文档完整性>=95%，格式规范性100%",
    acceptanceSubject: "质量管控部",
    status: "已验收"
  },
  {
    id: "2",
    controlPointCode: "QCP-2024-002",
    controlPointName: "系统功能性能测试",
    projectName: "智慧城市综合管理平台建设项目",
    milestone: "系统测试",
    level: "一级",
    acceptanceStandard: "功能完整性100%，性能指标达标率>=98%",
    acceptanceSubject: "技术部",
    status: "待验收"
  },
  {
    id: "3",
    controlPointCode: "QCP-2024-003",
    controlPointName: "硬件设备安装质量检查",
    projectName: "数据中心基础设施建设项目",
    milestone: "设备安装",
    level: "二级",
    acceptanceStandard: "安装规范符合率100%，设备运行正常率100%",
    acceptanceSubject: "工程部",
    status: "待验收"
  }
];

const mockIssues: QualityIssue[] = [
  {
    id: "1",
    issueCode: "QI-2024-001",
    projectName: "智慧城市综合管理平台建设项目",
    controlPoint: "系统功能性能测试",
    issueDescription: "部分模块响应时间超过标准要求",
    issueLevel: "较大",
    rectificationStatus: "整改中",
    responsiblePerson: "张三",
    deadline: "2024-03-20"
  },
  {
    id: "2",
    issueCode: "QI-2024-002",
    projectName: "数据中心基础设施建设项目",
    controlPoint: "硬件设备安装质量检查",
    issueDescription: "机柜布线不符合规范要求",
    issueLevel: "一般",
    rectificationStatus: "待整改",
    responsiblePerson: "李四",
    deadline: "2024-03-18"
  }
];

export function QualityControl() {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [controlPoints] = useState<QualityControlPoint[]>(mockControlPoints);
  const [issues] = useState<QualityIssue[]>(mockIssues);

  const getStatusBadge = (status: QualityControlPoint["status"]) => {
    const variants: Record<QualityControlPoint["status"], string> = {
      "未启用": "bg-gray-100 text-gray-600 border border-gray-300",
      "待验收": "bg-blue-50 text-blue-600 border border-blue-300",
      "已验收": "bg-green-50 text-green-600 border border-green-300",
      "已作废": "bg-gray-100 text-gray-400 border border-gray-300"
    };
    return <Badge className={variants[status]}>{status}</Badge>;
  };

  const getLevelBadge = (level: QualityControlPoint["level"]) => {
    const variants: Record<QualityControlPoint["level"], string> = {
      "一级": "bg-red-50 text-red-600 border border-red-300",
      "二级": "bg-orange-50 text-orange-600 border border-orange-300",
      "三级": "bg-blue-50 text-blue-600 border border-blue-300"
    };
    return <Badge className={variants[level]}>{level}</Badge>;
  };

  const getIssueLevelBadge = (level: QualityIssue["issueLevel"]) => {
    const variants: Record<QualityIssue["issueLevel"], string> = {
      "一般": "bg-blue-50 text-blue-600 border border-blue-300",
      "较大": "bg-orange-50 text-orange-600 border border-orange-300",
      "重大": "bg-red-50 text-red-600 border border-red-300"
    };
    return <Badge className={variants[level]}>{level}</Badge>;
  };

  const getIssueStatusBadge = (status: QualityIssue["rectificationStatus"]) => {
    const variants: Record<QualityIssue["rectificationStatus"], string> = {
      "待整改": "bg-gray-100 text-gray-600 border border-gray-300",
      "整改中": "bg-blue-50 text-blue-600 border border-blue-300",
      "待复核": "bg-orange-50 text-orange-600 border border-orange-300",
      "已闭环": "bg-green-50 text-green-600 border border-green-300",
      "已超期": "bg-red-50 text-red-600 border border-red-300"
    };
    return <Badge className={variants[status]}>{status}</Badge>;
  };

  const filteredControlPoints = controlPoints.filter(item => {
    const matchesSearch = item.projectName.includes(searchText) || item.controlPointName.includes(searchText);
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalControlPoints = controlPoints.length;
  const acceptanceRate = ((controlPoints.filter(item => item.status === "已验收").length / totalControlPoints) * 100).toFixed(1);
  const totalIssues = issues.length;
  const closedIssues = issues.filter(item => item.rectificationStatus === "已闭环").length;
  const issueClosureRate = ((closedIssues / totalIssues) * 100).toFixed(1);
  const criticalIssues = issues.filter(item => item.issueLevel === "重大").length;

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">项目质量管控</h2>
        <p className="text-sm text-gray-500 mt-1">质量控制点配置、验收管理、质量问题整改的全流程管控</p>
      </div>

      <Tabs defaultValue="control-points" className="space-y-4">
        <TabsList>
          <TabsTrigger value="control-points">质量控制点</TabsTrigger>
          <TabsTrigger value="acceptance">质量验收</TabsTrigger>
          <TabsTrigger value="issues">问题整改</TabsTrigger>
          <TabsTrigger value="analysis">质量分析</TabsTrigger>
        </TabsList>

        <TabsContent value="control-points" className="space-y-4">
          {/* 查询筛选区 */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="搜索项目名称、控制点名称"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="控制点状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="未启用">未启用</SelectItem>
                    <SelectItem value="待验收">待验收</SelectItem>
                    <SelectItem value="已验收">已验收</SelectItem>
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
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button className="bg-[#1890ff] hover:bg-[#0d7dea] text-white">
                <Plus className="w-4 h-4 mr-1" />
                新增控制点
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-1" />
                导入模板
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

          {/* 数据列表 */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-12">序号</TableHead>
                  <TableHead>控制点编号</TableHead>
                  <TableHead>控制点名称</TableHead>
                  <TableHead>所属项目</TableHead>
                  <TableHead>对应里程碑</TableHead>
                  <TableHead>控制点等级</TableHead>
                  <TableHead>验收标准</TableHead>
                  <TableHead>验收主体</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="w-32">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredControlPoints.map((item, index) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell className="text-gray-500">{index + 1}</TableCell>
                    <TableCell className="font-medium">{item.controlPointCode}</TableCell>
                    <TableCell className="font-medium">{item.controlPointName}</TableCell>
                    <TableCell className="max-w-[180px] truncate" title={item.projectName}>
                      {item.projectName}
                    </TableCell>
                    <TableCell className="text-gray-600">{item.milestone}</TableCell>
                    <TableCell>{getLevelBadge(item.level)}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={item.acceptanceStandard}>
                      {item.acceptanceStandard}
                    </TableCell>
                    <TableCell className="text-gray-600">{item.acceptanceSubject}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        {item.status === "未启用" && (
                          <>
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-green-600 hover:text-green-700 hover:bg-green-50">
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                              <CheckCircle className="w-3.5 h-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="acceptance" className="space-y-4">
          {/* 验收统计 */}
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-white rounded-lg border border-blue-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">待验收</span>
                <FileText className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-semibold text-blue-600">12</div>
              <div className="text-xs text-gray-500 mt-1">本月新增8项</div>
            </div>
            <div className="bg-white rounded-lg border border-orange-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">验收中</span>
                <Clock className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-2xl font-semibold text-orange-600">6</div>
              <div className="text-xs text-gray-500 mt-1">进行中项目</div>
            </div>
            <div className="bg-white rounded-lg border border-green-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">已通过</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-2xl font-semibold text-green-600">45</div>
              <div className="text-xs text-gray-500 mt-1">本月完成32项</div>
            </div>
            <div className="bg-white rounded-lg border border-red-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">未通过</span>
                <XCircle className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-2xl font-semibold text-red-600">3</div>
              <div className="text-xs text-gray-500 mt-1">需整改后复验</div>
            </div>
            <div className="bg-white rounded-lg border border-purple-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">通过率</span>
                <TrendingUp className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-semibold text-purple-600">93.8%</div>
              <div className="text-xs text-gray-500 mt-1">较上月提升2%</div>
            </div>
          </div>

          {/* 筛选操作区 */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部验收</SelectItem>
                    <SelectItem value="pending">待验收</SelectItem>
                    <SelectItem value="processing">验收中</SelectItem>
                    <SelectItem value="passed">已通过</SelectItem>
                    <SelectItem value="failed">未通过</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-type">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-type">全部类型</SelectItem>
                    <SelectItem value="milestone">里程碑验收</SelectItem>
                    <SelectItem value="phase">阶段验收</SelectItem>
                    <SelectItem value="final">最终验收</SelectItem>
                    <SelectItem value="special">专项验收</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="搜索验收项目..." className="w-64" />
              </div>
              <div className="flex gap-2">
                <Button className="bg-[#1890ff] hover:bg-[#0d7dea] text-white">
                  <Plus className="w-4 h-4 mr-1" />
                  新建验收
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-1" />
                  导出
                </Button>
              </div>
            </div>
          </div>

          {/* 验收列表 */}
          <div className="bg-white rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-12">序号</TableHead>
                  <TableHead className="w-[140px]">验收编号</TableHead>
                  <TableHead className="w-[120px]">验收类型</TableHead>
                  <TableHead>验收内容</TableHead>
                  <TableHead className="w-[100px]">验收人</TableHead>
                  <TableHead className="w-[120px]">计划验收时间</TableHead>
                  <TableHead className="w-[120px]">实际验收时间</TableHead>
                  <TableHead className="w-[100px]">验收结果</TableHead>
                  <TableHead className="w-[180px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell className="font-medium">AC-2024-001</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">里程碑验收</Badge>
                  </TableCell>
                  <TableCell className="text-sm">需求分析阶段验收</TableCell>
                  <TableCell className="text-sm">张三</TableCell>
                  <TableCell className="text-sm">2024-03-20</TableCell>
                  <TableCell className="text-sm text-gray-400">-</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">待验收</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        开始验收
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                        详情
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2</TableCell>
                  <TableCell className="font-medium">AC-2024-002</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-cyan-50 text-cyan-600 border-cyan-200">阶段验收</Badge>
                  </TableCell>
                  <TableCell className="text-sm">系统设计文档评审</TableCell>
                  <TableCell className="text-sm">李四</TableCell>
                  <TableCell className="text-sm">2024-03-18</TableCell>
                  <TableCell className="text-sm text-orange-600">2024-03-18</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">验收中</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        继续验收
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                        详情
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>3</TableCell>
                  <TableCell className="font-medium">AC-2024-003</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200">专项验收</Badge>
                  </TableCell>
                  <TableCell className="text-sm">安全测试专项验收</TableCell>
                  <TableCell className="text-sm">王五</TableCell>
                  <TableCell className="text-sm">2024-03-15</TableCell>
                  <TableCell className="text-sm">2024-03-15</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">已通过</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                        查看报告
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                        详情
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>4</TableCell>
                  <TableCell className="font-medium">AC-2024-004</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">里程碑验收</Badge>
                  </TableCell>
                  <TableCell className="text-sm">数据库设计评审验收</TableCell>
                  <TableCell className="text-sm">赵六</TableCell>
                  <TableCell className="text-sm">2024-03-12</TableCell>
                  <TableCell className="text-sm">2024-03-12</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">已通过</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                        查看报告
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                        详情
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>5</TableCell>
                  <TableCell className="font-medium">AC-2024-005</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-cyan-50 text-cyan-600 border-cyan-200">阶段验收</Badge>
                  </TableCell>
                  <TableCell className="text-sm">编码阶段代码审查</TableCell>
                  <TableCell className="text-sm">钱七</TableCell>
                  <TableCell className="text-sm">2024-03-10</TableCell>
                  <TableCell className="text-sm">2024-03-11</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">未通过</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
                        整改记录
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                        详情
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>6</TableCell>
                  <TableCell className="font-medium">AC-2024-006</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200">专项验收</Badge>
                  </TableCell>
                  <TableCell className="text-sm">性能测试专项验收</TableCell>
                  <TableCell className="text-sm">孙八</TableCell>
                  <TableCell className="text-sm">2024-03-08</TableCell>
                  <TableCell className="text-sm">2024-03-08</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">已通过</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                        查看报告
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                        详情
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>7</TableCell>
                  <TableCell className="font-medium">AC-2024-007</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-pink-50 text-pink-600 border-pink-200">最终验收</Badge>
                  </TableCell>
                  <TableCell className="text-sm">系统集成测试验收</TableCell>
                  <TableCell className="text-sm">周九</TableCell>
                  <TableCell className="text-sm">2024-03-22</TableCell>
                  <TableCell className="text-sm text-gray-400">-</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">待验收</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        开始验收
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                        详情
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>8</TableCell>
                  <TableCell className="font-medium">AC-2024-008</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">里程碑验收</Badge>
                  </TableCell>
                  <TableCell className="text-sm">接口设计文档验收</TableCell>
                  <TableCell className="text-sm">吴十</TableCell>
                  <TableCell className="text-sm">2024-03-05</TableCell>
                  <TableCell className="text-sm">2024-03-05</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">已通过</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                        查看报告
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                        详情
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* 验收标准说明 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-medium text-blue-900 mb-2">质量验收规范</div>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>1. <strong>验收准备：</strong>验收前需提交完整的交付物清单、测试报告、技术文档</p>
                  <p>2. <strong>验收执行：</strong>按照验收检查表逐项核验，记录偏差和问题</p>
                  <p>3. <strong>验收判定：</strong>所有必检项通过且关键指标达标，方可判定为通过</p>
                  <p>4. <strong>验收记录：</strong>形成验收报告，归档保存，作为项目交付依据</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          {/* 操作按钮 */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
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

          {/* 问题整改列表 */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-12">序号</TableHead>
                  <TableHead>整改单编号</TableHead>
                  <TableHead>所属项目</TableHead>
                  <TableHead>对应控制点</TableHead>
                  <TableHead>问题描述</TableHead>
                  <TableHead>问题等级</TableHead>
                  <TableHead>整改责任人</TableHead>
                  <TableHead>要求完成时间</TableHead>
                  <TableHead>整改状态</TableHead>
                  <TableHead className="w-32">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issues.map((item, index) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell className="text-gray-500">{index + 1}</TableCell>
                    <TableCell className="font-medium">{item.issueCode}</TableCell>
                    <TableCell className="max-w-[180px] truncate" title={item.projectName}>
                      {item.projectName}
                    </TableCell>
                    <TableCell className="text-gray-600">{item.controlPoint}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={item.issueDescription}>
                      {item.issueDescription}
                    </TableCell>
                    <TableCell>{getIssueLevelBadge(item.issueLevel)}</TableCell>
                    <TableCell className="text-gray-600">{item.responsiblePerson}</TableCell>
                    <TableCell className="text-gray-600">{item.deadline}</TableCell>
                    <TableCell>{getIssueStatusBadge(item.rectificationStatus)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          详情
                        </Button>
                        {(item.rectificationStatus === "待整改" || item.rectificationStatus === "整改中") && (
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-green-600 hover:text-green-700 hover:bg-green-50">
                            提交
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          {/* 核心指标卡片 */}
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border border-blue-100">
              <div className="text-sm text-gray-600 mb-1">验收控制点总数</div>
              <div className="text-2xl font-semibold text-gray-900">{totalControlPoints}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-4 border border-green-100">
              <div className="text-sm text-gray-600 mb-1">一次验收合格率</div>
              <div className="text-2xl font-semibold text-green-600">{acceptanceRate}%</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-white rounded-lg p-4 border border-orange-100">
              <div className="text-sm text-gray-600 mb-1">质量问题总数</div>
              <div className="text-2xl font-semibold text-orange-600">{totalIssues}</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-white rounded-lg p-4 border border-cyan-100">
              <div className="text-sm text-gray-600 mb-1">问题闭环整改率</div>
              <div className="text-2xl font-semibold text-cyan-600">{issueClosureRate}%</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-white rounded-lg p-4 border border-red-100">
              <div className="text-sm text-gray-600 mb-1">重大问题数量</div>
              <div className="text-2xl font-semibold text-red-600">{criticalIssues}</div>
            </div>
          </div>

          {/* 分析图表占位 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-base font-medium text-gray-900 mb-4">项目质量合格率对比</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { name: '项目A', 合格率: 95 },
                  { name: '项目B', 合格率: 85 },
                  { name: '项目C', 合格率: 90 },
                  { name: '项目D', 合格率: 80 },
                  { name: '项目E', 合格率: 92 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="合格率" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-base font-medium text-gray-900 mb-4">问题类型分布</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: '一般问题', value: 40 },
                      { name: '较大问题', value: 30 },
                      { name: '重大问题', value: 30 }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#8884d8" />
                    <Cell fill="#82ca9d" />
                    <Cell fill="#ffc658" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-base font-medium text-gray-900 mb-4">月度验收趋势</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={[
                  { name: '1月', 验收数量: 10 },
                  { name: '2月', 验收数量: 15 },
                  { name: '3月', 验收数量: 20 },
                  { name: '4月', 验收数量: 25 },
                  { name: '5月', 验收数量: 30 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="验收数量" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-base font-medium text-gray-900 mb-4">整改时效分析</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { name: '项目A', 整改时间: 5 },
                  { name: '项目B', 整改时间: 7 },
                  { name: '项目C', 整改时间: 6 },
                  { name: '项目D', 整改时间: 8 },
                  { name: '项目E', 整改时间: 4 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="整改时间" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 导出按钮 */}
          <div className="flex justify-end gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-1" />
              导出报表
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-1" />
              导出明细
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}