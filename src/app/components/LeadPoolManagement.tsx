import React, { useState } from "react";
import { Search, Plus, RefreshCw, Eye, Edit, Trash2, Users, Shield, TrendingUp, BarChart3 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface LeadPool {
  id: string;
  poolCode: string;
  poolName: string;
  type: "区域" | "产品线" | "渠道" | "客户等级" | "业务阶段";
  dimension: string;
  totalCount: number;
  toAssignCount: number;
  followingCount: number;
  retrievedCount: number;
  convertedCount: number;
  closedCount: number;
  status: "启用" | "停用";
  createTime: string;
  creator: string;
}

const mockPools: LeadPool[] = [
  {
    id: "1",
    poolCode: "POOL-001",
    poolName: "华北区域线索池",
    type: "区域",
    dimension: "华北地区",
    totalCount: 156,
    toAssignCount: 23,
    followingCount: 98,
    retrievedCount: 12,
    convertedCount: 18,
    closedCount: 5,
    status: "启用",
    createTime: "2024-01-15",
    creator: "张三"
  },
  {
    id: "2",
    poolCode: "POOL-002",
    poolName: "智慧城市产品线索池",
    type: "产品线",
    dimension: "智慧城市",
    totalCount: 89,
    toAssignCount: 15,
    followingCount: 52,
    retrievedCount: 8,
    convertedCount: 12,
    closedCount: 2,
    status: "启用",
    createTime: "2024-02-10",
    creator: "李四"
  }
];

export function LeadPoolManagement() {
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [pools] = useState<LeadPool[]>(mockPools);

  const getStatusBadge = (status: LeadPool["status"]) => {
    return status === "启用" 
      ? <Badge className="bg-green-50 text-green-600 border border-green-300">启用</Badge>
      : <Badge className="bg-gray-100 text-gray-600 border border-gray-300">停用</Badge>;
  };

  const filteredPools = pools.filter(pool => {
    const matchesSearch = pool.poolName.includes(searchText) || pool.poolCode.includes(searchText);
    const matchesType = typeFilter === "all" || pool.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // 统计
  const totalPools = pools.length;
  const totalLeads = pools.reduce((sum, p) => sum + p.totalCount, 0);
  const totalFollowing = pools.reduce((sum, p) => sum + p.followingCount, 0);
  const totalConverted = pools.reduce((sum, p) => sum + p.convertedCount, 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">商情线索池管理</h2>
        <p className="text-sm text-gray-500 mt-1">线索池分类管理、权限管理和状态跟踪</p>
      </div>

      <Tabs defaultValue="pools" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pools">线索池管理</TabsTrigger>
          <TabsTrigger value="permissions">权限管理</TabsTrigger>
          <TabsTrigger value="tracking">状态跟踪</TabsTrigger>
        </TabsList>

        <TabsContent value="pools" className="space-y-4">
          {/* 统计卡片 */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border border-blue-100">
              <div className="text-sm text-gray-600 mb-1">线索池总数</div>
              <div className="text-2xl font-semibold text-gray-900">{totalPools}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-4 border border-purple-100">
              <div className="text-sm text-gray-600 mb-1">线索总量</div>
              <div className="text-2xl font-semibold text-purple-600">{totalLeads}</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-white rounded-lg p-4 border border-cyan-100">
              <div className="text-sm text-gray-600 mb-1">跟进中</div>
              <div className="text-2xl font-semibold text-cyan-600">{totalFollowing}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-4 border border-green-100">
              <div className="text-sm text-gray-600 mb-1">已转化</div>
              <div className="text-2xl font-semibold text-green-600">{totalConverted}</div>
            </div>
          </div>

          {/* 查询筛选 */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="搜索线索池名称、编码"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="线索池类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="区域">区域</SelectItem>
                    <SelectItem value="产品线">产品线</SelectItem>
                    <SelectItem value="渠道">渠道</SelectItem>
                    <SelectItem value="客户等级">客户等级</SelectItem>
                    <SelectItem value="业务阶段">业务阶段</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button className="bg-[#1890ff] hover:bg-[#0d7dea] text-white">
                <Plus className="w-4 h-4 mr-1" />
                新建线索池
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
                  <TableHead>线索池编号</TableHead>
                  <TableHead>线索池名称</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>所属维度</TableHead>
                  <TableHead>线索总量</TableHead>
                  <TableHead>待分配</TableHead>
                  <TableHead>跟进中</TableHead>
                  <TableHead>已回收</TableHead>
                  <TableHead>已转化</TableHead>
                  <TableHead>已关闭</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>创建人</TableHead>
                  <TableHead className="w-32">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPools.map((pool, index) => (
                  <TableRow key={pool.id} className="hover:bg-gray-50">
                    <TableCell className="text-gray-500">{index + 1}</TableCell>
                    <TableCell className="font-medium">{pool.poolCode}</TableCell>
                    <TableCell className="font-medium">{pool.poolName}</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-50 text-blue-600 border-blue-200">{pool.type}</Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">{pool.dimension}</TableCell>
                    <TableCell className="text-center font-medium">{pool.totalCount}</TableCell>
                    <TableCell className="text-center text-orange-600">{pool.toAssignCount}</TableCell>
                    <TableCell className="text-center text-blue-600">{pool.followingCount}</TableCell>
                    <TableCell className="text-center text-gray-600">{pool.retrievedCount}</TableCell>
                    <TableCell className="text-center text-green-600">{pool.convertedCount}</TableCell>
                    <TableCell className="text-center text-gray-500">{pool.closedCount}</TableCell>
                    <TableCell>{getStatusBadge(pool.status)}</TableCell>
                    <TableCell className="text-sm text-gray-500">{pool.createTime}</TableCell>
                    <TableCell className="text-sm text-gray-600">{pool.creator}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-blue-600 hover:bg-blue-50">
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-green-600 hover:bg-green-50">
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-red-600 hover:bg-red-50">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-medium text-gray-900 mb-6">线索池权限管理</h3>
            
            <div className="space-y-4">
              {/* 管理员权限 */}
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-blue-900">管理员权限</h4>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-700">✓</Badge>
                    <span className="text-gray-700">查看所有线索完整信息</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-700">✓</Badge>
                    <span className="text-gray-700">新增、编辑、删除线索</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-700">✓</Badge>
                    <span className="text-gray-700">导入、导出线索数据</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-700">✓</Badge>
                    <span className="text-gray-700">线索分配、转移、回收</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-700">✓</Badge>
                    <span className="text-gray-700">添加/移除协作人</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-700">✓</Badge>
                    <span className="text-gray-700">管理线索池配置</span>
                  </div>
                </div>
              </div>

              {/* 成员权限 */}
              <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <h4 className="font-medium text-green-900">成员权限</h4>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700">✓</Badge>
                    <span className="text-gray-700">查看自己的线索全量信息</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700">✓</Badge>
                    <span className="text-gray-700">新增、编辑自己的线索</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700">✓</Badge>
                    <span className="text-gray-700">导出自己的线索数据</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700">✓</Badge>
                    <span className="text-gray-700">线索池内主动领取线索</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-700">✗</Badge>
                    <span className="text-gray-500">查看他人敏感信息（脱敏）</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-700">✗</Badge>
                    <span className="text-gray-500">修改他人线索</span>
                  </div>
                </div>
              </div>

              {/* 协作人权限 */}
              <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-orange-600" />
                  <h4 className="font-medium text-orange-900">协作人权限</h4>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-orange-100 text-orange-700">✓</Badge>
                    <span className="text-gray-700">查看被授权的特定线索</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-orange-100 text-orange-700">✓</Badge>
                    <span className="text-gray-700">补充跟进记录</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-orange-100 text-orange-700">✓</Badge>
                    <span className="text-gray-700">添加技术方案</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-700">✗</Badge>
                    <span className="text-gray-500">查看敏感联系方式</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-700">✗</Badge>
                    <span className="text-gray-500">修改线索核心信息</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-700">✗</Badge>
                    <span className="text-gray-500">分配或转移线索</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-medium text-gray-900 mb-6">线索状态跟踪管理</h3>
            
            {/* 状态流转图 */}
            <div className="mb-8">
              <h4 className="font-medium text-gray-900 mb-4">状态流转规则</h4>
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="bg-orange-100 border-2 border-orange-400 rounded-lg p-4 w-32">
                    <div className="font-medium text-orange-700">待分配</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">新建线索</div>
                </div>
                <div className="text-2xl text-gray-400">→</div>
                <div className="text-center">
                  <div className="bg-blue-100 border-2 border-blue-400 rounded-lg p-4 w-32">
                    <div className="font-medium text-blue-700">跟进中</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">分配/领取</div>
                </div>
                <div className="text-2xl text-gray-400">→</div>
                <div className="text-center">
                  <div className="bg-green-100 border-2 border-green-400 rounded-lg p-4 w-32">
                    <div className="font-medium text-green-700">已转化</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">转商机</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="text-center">
                  <div className="bg-gray-100 border-2 border-gray-400 rounded-lg p-4 w-32">
                    <div className="font-medium text-gray-700">已回收</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">超时/异常</div>
                </div>
                <div className="text-2xl text-gray-400">←</div>
                <div className="text-center">
                  <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4 w-32">
                    <div className="font-medium text-red-700">已关闭</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">无效线索</div>
                </div>
              </div>
            </div>

            {/* 统计看板 */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-medium text-gray-900 mb-4">线索池统计看板</h4>
              <div className="grid grid-cols-5 gap-4">
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-orange-600">38</div>
                  <div className="text-sm text-gray-600 mt-1">待分配</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600">150</div>
                  <div className="text-sm text-gray-600 mt-1">跟进中</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-gray-600">20</div>
                  <div className="text-sm text-gray-600 mt-1">已回收</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">30</div>
                  <div className="text-sm text-gray-600 mt-1">已转化</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-red-600">7</div>
                  <div className="text-sm text-gray-600 mt-1">已关闭</div>
                </div>
              </div>
            </div>

            {/* 预警提醒 */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h4 className="font-medium text-gray-900 mb-4">预警提醒配置</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded border border-orange-200">
                  <div>
                    <div className="font-medium text-gray-900">待分配超时提醒</div>
                    <div className="text-sm text-gray-600">线索创建后48小时未分配</div>
                  </div>
                  <Badge className="bg-orange-100 text-orange-700">已启用</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-200">
                  <div>
                    <div className="font-medium text-gray-900">跟进预警提醒</div>
                    <div className="text-sm text-gray-600">7天未跟进的线索预警</div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700">已启用</Badge>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
