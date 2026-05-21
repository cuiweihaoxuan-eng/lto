import React, { useState } from "react";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Button } from "./ui/button";
import { RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { EIPSignOffDetail } from "./EIPSignOffDetail";

// 模拟数据 - 奖励签报清单（完整字段）
const rewardReportData = [
  {
    id: 1,
    cityName: "宁波",
    qxName: "鄞州分局",
    cycleMonth: "202603",
    itemCnt: 5,
    contractAmount: 500,
    contractIctAmount: 300,
    skAll: 200,
    totalReward: 100000,
    oppReward: 20000,
    itemReward: 80000,
    auditState: "已审核",
    createUserName: "张三",
    submitTime: "2026-03-15 10:30",
  },
  {
    id: 2,
    cityName: "宁波",
    qxName: "江北分局",
    cycleMonth: "202603",
    itemCnt: 3,
    contractAmount: 300,
    contractIctAmount: 200,
    skAll: 150,
    totalReward: 75000,
    oppReward: 15000,
    itemReward: 60000,
    auditState: "待审核",
    createUserName: "李四",
    submitTime: "2026-03-16 14:20",
  },
  {
    id: 3,
    cityName: "宁波",
    qxName: "镇海分局",
    cycleMonth: "202603",
    itemCnt: 4,
    contractAmount: 400,
    contractIctAmount: 250,
    skAll: 180,
    totalReward: 85000,
    oppReward: 18000,
    itemReward: 67000,
    auditState: "已驳回",
    createUserName: "王五",
    submitTime: "2026-03-17 09:15",
  },
];

export function RewardSignReport() {
  // 奖励签报清单查询条件
  const [rewardParams, setRewardParams] = useState({
    qxId: "",
    startDate: "",
    endDate: "",
    auditState: "",
    createUserName: "",
  });

  // EIP签报详情弹窗状态
  const [eipSignOffDetailOpen, setEipSignOffDetailOpen] = useState(false);
  const [eipSignOffDetailData, setEipSignOffDetailData] = useState<{
    qxName: string;
    cycleMonth: string;
    itemCnt: number;
    contractAmount: number;
    contractIctAmount: number;
    skAll: number;
    totalReward: number;
    oppReward: number;
    itemReward: number;
  } | null>(null);

  const handleRewardQuery = () => {
    console.log("查询奖励签报清单", rewardParams);
  };

  const handleRewardReset = () => {
    setRewardParams({
      qxId: "",
      startDate: "",
      endDate: "",
      auditState: "",
      createUserName: "",
    });
  };

  // 格式化金额
  const formatAmount = (val: number | undefined) => {
    if (val === undefined || val === null) return "-";
    return val.toLocaleString();
  };

  // 打开EIP签报详情弹窗
  const handleOpenEIPSignOffDetail = (item: typeof rewardReportData[0]) => {
    setEipSignOffDetailData({
      qxName: item.qxName,
      cycleMonth: item.cycleMonth,
      itemCnt: item.itemCnt,
      contractAmount: item.contractAmount,
      contractIctAmount: item.contractIctAmount,
      skAll: item.skAll,
      totalReward: item.totalReward,
      oppReward: item.oppReward,
      itemReward: item.itemReward,
    });
    setEipSignOffDetailOpen(true);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 标题区 */}
      <div className="px-6 pt-6 pb-4 flex-shrink-0">
        <h2 className="text-lg font-medium text-gray-900">奖励签报清单</h2>
        <p className="text-sm text-gray-500 mt-1">奖励签报清单查询</p>
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="mt-4 space-y-4">
          {/* 查询条件卡片 */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-4 gap-x-6 gap-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">申请时间</label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={rewardParams.startDate}
                    onChange={(e) => setRewardParams({ ...rewardParams, startDate: e.target.value })}
                  />
                  <span className="self-center text-gray-400">-</span>
                  <Input
                    type="date"
                    value={rewardParams.endDate}
                    onChange={(e) => setRewardParams({ ...rewardParams, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">审核状态</label>
                <Select value={rewardParams.auditState} onValueChange={(v) => setRewardParams({ ...rewardParams, auditState: v })}>
                  <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="待审核">待审核</SelectItem>
                    <SelectItem value="已审核">已审核</SelectItem>
                    <SelectItem value="已驳回">已驳回</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">送审人</label>
                <Input
                  value={rewardParams.createUserName}
                  onChange={(e) => setRewardParams({ ...rewardParams, createUserName: e.target.value })}
                  placeholder="请输入"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分局</label>
                <Select value={rewardParams.qxId} onValueChange={(v) => setRewardParams({ ...rewardParams, qxId: v })}>
                  <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ningbo">宁波</SelectItem>
                    <SelectItem value="yinzhou">鄞州</SelectItem>
                    <SelectItem value="jiangbei">江北</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-end mt-4">
              <div className="flex gap-2">
                <Button onClick={handleRewardQuery}>查询</Button>
                <Button variant="outline" onClick={handleRewardReset}>
                  <RotateCcw className="w-4 h-4 mr-1" />重置
                </Button>
              </div>
            </div>
          </div>

          {/* 表格 - 奖励签报清单（完整字段） */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <colgroup>
                <col style={{ width: '70px' }} />
                <col style={{ width: '90px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '60px' }} />
                <col style={{ width: '100px' }} />
                <col style={{ width: '110px' }} />
                <col style={{ width: '90px' }} />
                <col style={{ width: '110px' }} />
                <col style={{ width: '80px' }} />
                <col style={{ width: '110px' }} />
                <col style={{ width: '70px' }} />
                <col style={{ width: '70px' }} />
                <col style={{ width: '120px' }} />
                <col style={{ width: '100px' }} />
              </colgroup>
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">地市</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">区县分局</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">账期</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">项目数</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">合同金额(万元)</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">合同ICT金额(万元)</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">收款金额(万元)</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">总奖励金额(元)</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">商机奖(元)</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">项目提成奖(元)</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">状态</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">送审人</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">送审时间</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {rewardReportData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.cityName}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.qxName}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.cycleMonth}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.itemCnt}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.contractAmount}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.contractIctAmount}</td>
                    <td className="px-2 py-2 text-xs text-blue-600 text-center whitespace-nowrap font-medium">{item.skAll}</td>
                    <td className="px-2 py-2 text-xs text-blue-600 text-center whitespace-nowrap font-medium">{formatAmount(item.totalReward)}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{formatAmount(item.oppReward)}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{formatAmount(item.itemReward)}</td>
                    <td className="px-2 py-2 text-center whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        item.auditState === "已审核"
                          ? "bg-green-100 text-green-700"
                          : item.auditState === "待审核"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {item.auditState}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.createUserName}</td>
                    <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.submitTime}</td>
                    <td className="px-2 py-2 text-center whitespace-nowrap">
                      {item.auditState !== "待审核" && (
                        <button className="text-blue-600 hover:underline text-xs" onClick={() => handleOpenEIPSignOffDetail(item)}>EIP签报详情</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* EIP签报详情弹窗 */}
      <EIPSignOffDetail
        open={eipSignOffDetailOpen}
        onOpenChange={setEipSignOffDetailOpen}
        basicInfo={eipSignOffDetailData || undefined}
        qxName={eipSignOffDetailData?.qxName}
        cycleMonth={eipSignOffDetailData?.cycleMonth}
      />
    </div>
  );
}