import React, { useState } from "react";
import { Search, RefreshCw, GitMerge, AlertCircle, CheckCircle2, Eye, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface DuplicateLead {
  id: string;
  leadCode: string;
  companyName: string;
  contactPhone: string;
  contactEmail: string;
  duplicateReason: string[];
  similarityScore: number;
  status: "待合并" | "已合并" | "已忽略";
  detectTime: string;
}

const mockDuplicates: DuplicateLead[] = [
  {
    id: "1",
    leadCode: "LD-2024-001",
    companyName: "XX市智慧城市建设管理办公室",
    contactPhone: "138****1234",
    contactEmail: "zhang***@gov.cn",
    duplicateReason: ["公司名称相似度98%", "联系电话相同"],
    similarityScore: 95,
    status: "待合并",
    detectTime: "2024-03-10 14:30"
  },
  {
    id: "2",
    leadCode: "LD-2024-005",
    companyName: "XX市政府智慧城市建设办",
    contactPhone: "138****1234",
    contactEmail: "zhangsan***@gov.cn",
    duplicateReason: ["公司名称相似度98%", "联系电话相同"],
    similarityScore: 95,
    status: "待合并",
    detectTime: "2024-03-10 14:30"
  }
];

export function LeadMerge() {
  const [searchText, setSearchText] = useState("");
  const [duplicates] = useState<DuplicateLead[]>(mockDuplicates);
  const [selectedMain, setSelectedMain] = useState<string | null>(null);

  const getSimilarityBadge = (score: number) => {
    if (score >= 90) {
      return <Badge className="bg-red-50 text-red-600 border-red-300">高相似 {score}%</Badge>;
    } else if (score >= 70) {
      return <Badge className="bg-orange-50 text-orange-600 border-orange-300">中相似 {score}%</Badge>;
    }
    return <Badge className="bg-yellow-50 text-yellow-600 border-yellow-300">低相似 {score}%</Badge>;
  };

  const getStatusBadge = (status: DuplicateLead["status"]) => {
    const variants: Record<DuplicateLead["status"], string> = {
      "待合并": "bg-orange-50 text-orange-600 border-orange-300",
      "已合并": "bg-green-50 text-green-600 border-green-300",
      "已忽略": "bg-gray-100 text-gray-600 border-gray-300"
    };
    return <Badge className={variants[status]}>{status}</Badge>;
  };

  const filteredDuplicates = duplicates.filter(dup => 
    dup.companyName.includes(searchText) || dup.leadCode.includes(searchText)
  );

  const pendingCount = duplicates.filter(d => d.status === "待合并").length;
  const mergedCount = duplicates.filter(d => d.status === "已合并").length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">线索合并</h2>
        <p className="text-sm text-gray-500 mt-1">自动识别重复线索，支持合并管理和数据迁移</p>
      </div>

      <Tabs defaultValue="duplicate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="duplicate">重复线索检测</TabsTrigger>
          <TabsTrigger value="merge">合并管理</TabsTrigger>
          <TabsTrigger value="migration">数据迁移配置</TabsTrigger>
        </TabsList>

        <TabsContent value="duplicate" className="space-y-4">
          {/* 统计卡片 */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-orange-50 to-white rounded-lg p-4 border border-orange-100">
              <div className="text-sm text-gray-600 mb-1">待合并线索</div>
              <div className="text-2xl font-semibold text-orange-600">{pendingCount}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-4 border border-green-100">
              <div className="text-sm text-gray-600 mb-1">已合并线索</div>
              <div className="text-2xl font-semibold text-green-600">{mergedCount}</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border border-blue-100">
              <div className="text-sm text-gray-600 mb-1">相似度阈值</div>
              <div className="text-2xl font-semibold text-blue-600">80%</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-4 border border-purple-100">
              <div className="text-sm text-gray-600 mb-1">本月检测次数</div>
              <div className="text-2xl font-semibold text-purple-600">45</div>
            </div>
          </div>

          {/* 检测规则说明 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              重复线索检测规则
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded p-3">
                <div className="font-medium text-gray-900 mb-1">公司名称匹配</div>
                <div className="text-gray-600">相似度 ≥ 80%</div>
              </div>
              <div className="bg-white rounded p-3">
                <div className="font-medium text-gray-900 mb-1">联系电话匹配</div>
                <div className="text-gray-600">完全相同</div>
              </div>
              <div className="bg-white rounded p-3">
                <div className="font-medium text-gray-900 mb-1">电子邮箱匹配</div>
                <div className="text-gray-600">完全相同</div>
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
              <div className="col-span-2 flex justify-between items-center">
                <Button className="bg-[#1890ff] hover:bg-[#0d7dea] text-white">
                  <Search className="w-4 h-4 mr-1" />
                  开始检测
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  刷新
                </Button>
              </div>
            </div>
          </div>

          {/* 待合并列表 */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">重复线索列表</h3>
            </div>
            
            {/* 分组展示重复线索 */}
            <div className="p-4 space-y-4">
              <div className="border border-orange-200 rounded-lg overflow-hidden">
                <div className="bg-orange-50 p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitMerge className="w-4 h-4 text-orange-600" />
                    <span className="font-medium text-orange-900">重复组 #1</span>
                    {getSimilarityBadge(95)}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">忽略</Button>
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                      <GitMerge className="w-3.5 h-3.5 mr-1" />
                      执行合并
                    </Button>
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-12"></TableHead>
                      <TableHead>线索编号</TableHead>
                      <TableHead>公司名称</TableHead>
                      <TableHead>联系电话</TableHead>
                      <TableHead>电子邮箱</TableHead>
                      <TableHead>重复原因</TableHead>
                      <TableHead>检测时间</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDuplicates.map((dup) => (
                      <TableRow key={dup.id} className={selectedMain === dup.id ? "bg-blue-50" : ""}>
                        <TableCell>
                          <input
                            type="radio"
                            name="mainLead"
                            checked={selectedMain === dup.id}
                            onChange={() => setSelectedMain(dup.id)}
                            className="w-4 h-4"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{dup.leadCode}</TableCell>
                        <TableCell className="font-medium">{dup.companyName}</TableCell>
                        <TableCell className="text-gray-600">{dup.contactPhone}</TableCell>
                        <TableCell className="text-gray-600">{dup.contactEmail}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {dup.duplicateReason.map((reason, idx) => (
                              <Badge key={idx} className="bg-red-50 text-red-600 border-red-200 text-xs">
                                {reason}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">{dup.detectTime}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-blue-600 hover:bg-blue-50">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="bg-gray-50 p-3 text-sm text-gray-600">
                  <span className="font-medium">提示：</span>请选择一条线索作为主线索（保留），其他线索将被合并到主线索中
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="merge" className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-medium text-gray-900 mb-6">合并操作管理</h3>
            
            {/* 合并流程说明 */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-4">合并流程</h4>
              <div className="flex items-center justify-between">
                <div className="flex-1 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Search className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="font-medium text-gray-900">1. 检测重复</div>
                  <div className="text-sm text-gray-500">自动识别</div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="h-0.5 w-full bg-gray-300" />
                </div>
                <div className="flex-1 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="font-medium text-gray-900">2. 校验确认</div>
                  <div className="text-sm text-gray-500">状态检查</div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="h-0.5 w-full bg-gray-300" />
                </div>
                <div className="flex-1 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Eye className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="font-medium text-gray-900">3. 预览确认</div>
                  <div className="text-sm text-gray-500">信息对比</div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="h-0.5 w-full bg-gray-300" />
                </div>
                <div className="flex-1 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <GitMerge className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="font-medium text-gray-900">4. 执行合并</div>
                  <div className="text-sm text-gray-500">完成合并</div>
                </div>
              </div>
            </div>

            {/* 合并前校验规则 */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-medium text-gray-900 mb-4">合并前校验规则</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded border border-green-200">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-green-900">允许合并的线索状态</div>
                    <div className="text-sm text-gray-600 mt-1">待分配、跟进中（需负责人确认）</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded border border-red-200">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-red-900">禁止合并的线索状态</div>
                    <div className="text-sm text-gray-600 mt-1">已转化（防止影响已生成的商机）、已关闭（已终止的线索）</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 合并历史记录 */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h4 className="font-medium text-gray-900 mb-4">最近合并记录</h4>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>合并时间</TableHead>
                    <TableHead>主线索</TableHead>
                    <TableHead>被合并线索数</TableHead>
                    <TableHead>操作人</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-sm text-gray-500">2024-03-13 10:25</TableCell>
                    <TableCell className="font-medium">LD-2024-001</TableCell>
                    <TableCell className="text-center">2</TableCell>
                    <TableCell className="text-sm text-gray-600">张三</TableCell>
                    <TableCell>
                      <Badge className="bg-green-50 text-green-600 border-green-300">成功</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-blue-600">
                        查看详情
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="migration" className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-medium text-gray-900 mb-6">数据迁移与冲突处理配置</h3>
            
            {/* 字段映射规则 */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-4">字段映射与优先级策略</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>字段名称</TableHead>
                      <TableHead>冲突处理策略</TableHead>
                      <TableHead>说明</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">公司名称</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-50 text-blue-600">保留主线索</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">以选定的主线索信息为准</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">联系人信息</TableCell>
                      <TableCell>
                        <Badge className="bg-green-50 text-green-600">保留非空值</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">优先保留有值的字段</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">预估金额</TableCell>
                      <TableCell>
                        <Badge className="bg-purple-50 text-purple-600">保留最大值</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">取多条线索中的最大金额</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">跟进记录</TableCell>
                      <TableCell>
                        <Badge className="bg-orange-50 text-orange-600">自动合并</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">按时间顺序合并所有跟进记录</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">附件文档</TableCell>
                      <TableCell>
                        <Badge className="bg-cyan-50 text-cyan-600">全部保留</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">保留所有线索的附件</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* 迁移任务监控 */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-medium text-gray-900 mb-4">迁移任务监控</h4>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">15</div>
                  <div className="text-sm text-gray-600 mt-1">总任务数</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">12</div>
                  <div className="text-sm text-gray-600 mt-1">成功</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">2</div>
                  <div className="text-sm text-gray-600 mt-1">处理中</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">1</div>
                  <div className="text-sm text-gray-600 mt-1">失败</div>
                </div>
              </div>
            </div>

            {/* 错误处理机制 */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h4 className="font-medium text-gray-900 mb-4">错误处理与重试机制</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">支持失败任务的错误定位和详细日志查看</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">提供手动修复接口，管理员可直接修正错误数据</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">支持任务重试，系统自动或手动触发重试机制</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
