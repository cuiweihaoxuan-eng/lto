import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Upload, FileText, X, Eye, Maximize2, Minimize2 } from "lucide-react";

// 基本信息
interface BasicInfo {
  itemCnt: number;
  contractAmount: number;
  contractIctAmount: number;
  skAll: number;
  totalReward: number;
  oppReward: number;
  itemReward: number;
}

// 模拟数据 - 大额商机奖清单
const mockOppRewardData = [
  {
    saleOppName: "XX单位信息化建设",
    jtOppCode: "SJ-2026-001",
    contractAmount: 500,
    skCycle: 200,
    oppReward: 8000,
    oppRewardCycle: 8000,
    teamMembers: [
      { teamMember: "张三", oppReward: 3000, oppRewardCycle: 3000 },
      { teamMember: "李四", oppReward: 5000, oppRewardCycle: 5000 },
    ],
  },
  {
    saleOppName: "YY学校智慧校园",
    jtOppCode: "SJ-2026-002",
    contractAmount: 300,
    skCycle: 150,
    oppReward: 5000,
    oppRewardCycle: 5000,
    teamMembers: [
      { teamMember: "王五", oppReward: 2500, oppRewardCycle: 2500 },
      { teamMember: "赵六", oppReward: 2500, oppRewardCycle: 2500 },
    ],
  },
];

// 模拟数据 - 项目提成奖清单
const mockItemRewardData = [
  {
    saleOppName: "XX单位信息化建设",
    jtOppCode: "SJ-2026-001",
    itemName: "XX单位信息化项目",
    itemCode: "XM-2026-001",
    contractAmount: 500,
    contractIctAmount: 300,
    skCycle: 200,
    itemReward: 85000,
    itemRewardCycle: 85000,
    teamMembers: [
      { teamMember: "张三", itemRewardUser: 30000, itemRewardUserCycle: 30000 },
      { teamMember: "李四", itemRewardUser: 55000, itemRewardUserCycle: 55000 },
    ],
  },
  {
    saleOppName: "YY学校智慧校园",
    jtOppCode: "SJ-2026-002",
    itemName: "YY学校智慧校园项目",
    itemCode: "XM-2026-002",
    contractAmount: 300,
    contractIctAmount: 200,
    skCycle: 150,
    itemReward: 60000,
    itemRewardCycle: 60000,
    teamMembers: [
      { teamMember: "王五", itemRewardUser: 25000, itemRewardUserCycle: 25000 },
      { teamMember: "赵六", itemRewardUser: 35000, itemRewardUserCycle: 35000 },
    ],
  },
];

interface EIPSignOffDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  basicInfo?: BasicInfo;
  qxName?: string;
  cycleMonth?: string;
  cityId?: string | number;
  qxId?: string | number;
  areaId?: string | number;
}

export function EIPSignOffDetail({
  open,
  onOpenChange,
  basicInfo,
  qxName = "鄞州分局",
  cycleMonth = "202603",
}: EIPSignOffDetailProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [approvalFile, setApprovalFile] = useState<{ fileName: string; filePath: string } | null>(null);
  const [approvalFileList, setApprovalFileList] = useState<any[]>([]);
  const [filePreviewVisible, setFilePreviewVisible] = useState(false);
  const [currentPageOpp, setCurrentPageOpp] = useState(1);
  const [currentPageItem, setCurrentPageItem] = useState(1);
  const pageSize = 10;

  const formatAmount = (val: number | undefined) => {
    return val?.toLocaleString() || "0";
  };

  const formatNumber = (num: number | undefined, decimals = 2) => {
    if (num === undefined || num === null) return "0.00";
    return num.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  const formatCycleMonth = (month: string) => {
    if (month && month.length === 6) {
      return `${month.substring(0, 4)}年${month.substring(4, 6)}月`;
    }
    return month;
  };

  // 处理大额商机奖数据，展开团队成员
  const getOppRewardExpandedData = () => {
    const expandedData: any[] = [];
    mockOppRewardData.forEach((record) => {
      const members = record.teamMembers || [];
      if (members.length === 0) {
        expandedData.push({
          ...record,
          teamMember: "--",
          _memberIndex: 0,
          _totalMembers: 1,
        });
      } else {
        members.forEach((member, index) => {
          expandedData.push({
            ...record,
            teamMember: member.teamMember,
            _memberIndex: index,
            _totalMembers: members.length,
          });
        });
      }
    });
    return expandedData;
  };

  // 处理项目提成奖数据，展开团队成员
  const getItemRewardExpandedData = () => {
    const expandedData: any[] = [];
    mockItemRewardData.forEach((record) => {
      const members = record.teamMembers || [];
      if (members.length === 0) {
        expandedData.push({
          ...record,
          teamMember: "--",
          _memberIndex: 0,
          _totalMembers: 1,
        });
      } else {
        members.forEach((member, index) => {
          expandedData.push({
            ...record,
            teamMember: member.teamMember,
            _memberIndex: index,
            _totalMembers: members.length,
          });
        });
      }
    });
    return expandedData;
  };

  // 获取需要合并的行信息
  const getOppRewardSpanMap = () => {
    const spanMap: { [key: number]: number } = {};
    let rowIndex = 0;
    mockOppRewardData.forEach((record) => {
      const members = record.teamMembers?.length || 1;
      if (members > 0) {
        spanMap[rowIndex] = members;
      }
      rowIndex += members;
    });
    return spanMap;
  };

  const getItemRewardSpanMap = () => {
    const spanMap: { [key: number]: number } = {};
    let rowIndex = 0;
    mockItemRewardData.forEach((record) => {
      const members = record.teamMembers?.length || 1;
      if (members > 0) {
        spanMap[rowIndex] = members;
      }
      rowIndex += members;
    });
    return spanMap;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setApprovalFile({
        fileName: file.name,
        filePath: URL.createObjectURL(file),
      });
      setApprovalFileList([{ fileName: file.name, filePath: URL.createObjectURL(file) }]);
    }
  };

  const handleDeleteFile = () => {
    setApprovalFile(null);
    setApprovalFileList([]);
  };

  const handlePreviewFile = () => {
    if (approvalFile?.filePath) {
      setFilePreviewVisible(true);
    }
  };

  // 大额商机奖表格列
  const oppRewardColumns = [
    { label: "商机名称", prop: "saleOppName", width: 150 },
    { label: "商机编码", prop: "jtOppCode", width: 150 },
    { label: "总合同金额(万元)", prop: "contractAmount", width: 130 },
    { label: "本次收款金额(万元)", prop: "skCycle", width: 130 },
    { label: "商机奖(元)", prop: "oppReward", width: 100 },
    { label: "本次奖励金额(元)", prop: "oppRewardCycle", width: 130 },
    { label: "团队成员", prop: "teamMember", width: 100 },
    { label: "商机奖(元)", prop: "", width: 100 },
    { label: "本次奖励金额(元)", prop: "", width: 120 },
  ];

  // 项目提成奖表格列
  const itemRewardColumns = [
    { label: "商机名称", prop: "saleOppName", width: 120 },
    { label: "商机编码", prop: "jtOppCode", width: 120 },
    { label: "项目名称", prop: "itemName", width: 150 },
    { label: "项目编码", prop: "itemCode", width: 120 },
    { label: "合同金额(万元)", prop: "contractAmount", width: 110 },
    { label: "合同ICT金额(万元)", prop: "contractIctAmount", width: 120 },
    { label: "本次收款金额(万元)", prop: "skCycle", width: 120 },
    { label: "项目提成奖(元)", prop: "itemReward", width: 110 },
    { label: "本次奖励金额(元)", prop: "itemRewardCycle", width: 120 },
    { label: "团队成员", prop: "teamMember", width: 100 },
    { label: "项目提成奖(元)", prop: "", width: 110 },
    { label: "本次奖励金额(元)", prop: "", width: 120 },
  ];

  const expandedOppData = getOppRewardExpandedData();
  const expandedItemData = getItemRewardExpandedData();
  const oppSpanMap = getOppRewardSpanMap();
  const itemSpanMap = getItemRewardSpanMap();

  return (
    <>
      {/* 使用自定义弹窗样式，参考风险派单页面 */}
      {!open ? null : (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
          onClick={() => onOpenChange(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl flex flex-col transition-all duration-300"
            style={{
              width: isFullscreen ? "98vw" : "95vw",
              height: isFullscreen ? "98vh" : "90vh",
              maxWidth: "98vw",
              maxHeight: "98vh",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 标题栏 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <div>
                <h2 className="text-base font-medium text-gray-900">奖金分批审批</h2>
                <p className="text-sm text-gray-500 mt-0.5">{qxName} {formatCycleMonth(cycleMonth)}月份ICT商机奖及提成奖签报详情</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-1.5 hover:bg-gray-100 rounded">
                  {isFullscreen ? <Minimize2 className="w-4 h-4 text-gray-500" /> : <Maximize2 className="w-4 h-4 text-gray-500" />}
                </button>
                <button onClick={() => onOpenChange(false)} className="p-1.5 hover:bg-gray-100 rounded">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* 内容区 */}
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {/* 基本信息区域 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-700 mb-3">基本信息</div>
                <div className="grid grid-cols-7 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">项目数量</div>
                    <div className="text-lg font-semibold text-gray-900">{basicInfo?.itemCnt || 0}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">合同金额(万元)</div>
                    <div className="text-lg font-semibold text-gray-900">{formatNumber((basicInfo?.contractAmount || 0) / 10000, 4)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">ICT合同金额(万元)</div>
                    <div className="text-lg font-semibold text-gray-900">{formatNumber((basicInfo?.contractIctAmount || 0) / 10000, 4)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">收款金额(万元)</div>
                    <div className="text-lg font-semibold text-gray-900">{formatNumber((basicInfo?.skAll || 0) / 10000, 4)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">总奖励金额(元)</div>
                    <div className="text-lg font-semibold text-blue-600">{formatAmount(basicInfo?.totalReward)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">商机奖(元)</div>
                    <div className="text-lg font-semibold text-gray-900">{formatAmount(basicInfo?.oppReward)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">项目提成奖(元)</div>
                    <div className="text-lg font-semibold text-gray-900">{formatAmount(basicInfo?.itemReward)}</div>
                  </div>
                </div>
              </div>

              {/* 大额商机奖清单 */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                  <div className="text-sm font-semibold text-gray-800">大额商机奖清单</div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">清单导出</Button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-700 bg-blue-50" rowSpan={2}>商机名称</th>
                        <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-700 bg-blue-50" rowSpan={2}>商机编码</th>
                        <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-700 bg-blue-50" rowSpan={2}>总合同金额(万元)</th>
                        <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-700 bg-blue-50" rowSpan={2}>本次收款金额(万元)</th>
                        <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-700 bg-blue-50" rowSpan={2}>商机奖(元)</th>
                        <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-700 bg-blue-50" rowSpan={2}>本次奖励金额(元)</th>
                        <th colSpan={3} className="px-3 py-2.5 text-center text-xs font-medium text-gray-700 bg-blue-100">团队成员</th>
                      </tr>
                      <tr className="bg-blue-100">
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-600">团队成员</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-600">商机奖(元)</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-600">本次奖励金额(元)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {expandedOppData.map((row, index) => {
                        const isFirstRow = oppSpanMap[index] !== undefined;
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            {isFirstRow ? (
                              <>
                                <td rowSpan={oppSpanMap[index]} className="px-3 py-2 text-xs text-gray-900 text-center max-w-[150px] truncate">{row.saleOppName}</td>
                                <td rowSpan={oppSpanMap[index]} className="px-3 py-2 text-xs text-blue-600 text-center">{row.jtOppCode}</td>
                                <td rowSpan={oppSpanMap[index]} className="px-3 py-2 text-xs text-gray-900 text-center">{row.contractAmount}</td>
                                <td rowSpan={oppSpanMap[index]} className="px-3 py-2 text-xs text-gray-900 text-center">{row.skCycle}</td>
                                <td rowSpan={oppSpanMap[index]} className="px-3 py-2 text-xs text-blue-600 text-center font-medium">{formatAmount(row.oppReward)}</td>
                                <td rowSpan={oppSpanMap[index]} className="px-3 py-2 text-xs text-blue-600 text-center font-medium">{formatAmount(row.oppRewardCycle)}</td>
                              </>
                            ) : null}
                            <td className="px-3 py-2 text-xs text-gray-900 text-center">{row.teamMember}</td>
                            <td className="px-3 py-2 text-xs text-gray-900 text-center">-</td>
                            <td className="px-3 py-2 text-xs text-gray-900 text-center">-</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 项目提成奖清单 */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                  <div className="text-sm font-semibold text-gray-800">项目提成奖清单</div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">重新生成清单</Button>
                    <Button size="sm" variant="outline">清单导出</Button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-2.5 text-center text-xs font-medium text-gray-700 bg-orange-50" rowSpan={2}>商机名称</th>
                        <th className="px-2 py-2.5 text-center text-xs font-medium text-gray-700 bg-orange-50" rowSpan={2}>商机编码</th>
                        <th className="px-2 py-2.5 text-center text-xs font-medium text-gray-700 bg-orange-50" rowSpan={2}>项目名称</th>
                        <th className="px-2 py-2.5 text-center text-xs font-medium text-gray-700 bg-orange-50" rowSpan={2}>项目编码</th>
                        <th className="px-2 py-2.5 text-center text-xs font-medium text-gray-700 bg-orange-50" rowSpan={2}>合同金额(万元)</th>
                        <th className="px-2 py-2.5 text-center text-xs font-medium text-gray-700 bg-orange-50" rowSpan={2}>合同ICT金额(万元)</th>
                        <th className="px-2 py-2.5 text-center text-xs font-medium text-gray-700 bg-orange-50" rowSpan={2}>本次收款金额(万元)</th>
                        <th colSpan={2} className="px-2 py-2.5 text-center text-xs font-medium text-gray-700 bg-orange-100">项目提成奖</th>
                        <th colSpan={3} className="px-2 py-2.5 text-center text-xs font-medium text-gray-700 bg-orange-200">团队成员</th>
                      </tr>
                      <tr className="bg-orange-100">
                        <th className="px-2 py-2 text-center text-xs font-medium text-gray-600">项目提成奖(元)</th>
                        <th className="px-2 py-2 text-center text-xs font-medium text-gray-600">本次奖励金额(元)</th>
                        <th className="px-2 py-2 text-center text-xs font-medium text-gray-600">团队成员</th>
                        <th className="px-2 py-2 text-center text-xs font-medium text-gray-600">项目提成奖(元)</th>
                        <th className="px-2 py-2 text-center text-xs font-medium text-gray-600">本次奖励金额(元)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {expandedItemData.map((row, index) => {
                        const isFirstRow = itemSpanMap[index] !== undefined;
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            {isFirstRow ? (
                              <>
                                <td rowSpan={itemSpanMap[index]} className="px-2 py-2 text-xs text-gray-900 text-center max-w-[120px] truncate">{row.saleOppName}</td>
                                <td rowSpan={itemSpanMap[index]} className="px-2 py-2 text-xs text-blue-600 text-center">{row.jtOppCode}</td>
                                <td rowSpan={itemSpanMap[index]} className="px-2 py-2 text-xs text-gray-900 text-center max-w-[150px] truncate">{row.itemName}</td>
                                <td rowSpan={itemSpanMap[index]} className="px-2 py-2 text-xs text-blue-600 text-center">{row.itemCode}</td>
                                <td rowSpan={itemSpanMap[index]} className="px-2 py-2 text-xs text-gray-900 text-center">{row.contractAmount}</td>
                                <td rowSpan={itemSpanMap[index]} className="px-2 py-2 text-xs text-gray-900 text-center">{row.contractIctAmount}</td>
                                <td rowSpan={itemSpanMap[index]} className="px-2 py-2 text-xs text-gray-900 text-center">{row.skCycle}</td>
                                <td rowSpan={itemSpanMap[index]} className="px-2 py-2 text-xs text-blue-600 text-center font-medium">{formatAmount(row.itemReward)}</td>
                                <td rowSpan={itemSpanMap[index]} className="px-2 py-2 text-xs text-blue-600 text-center font-medium">{formatAmount(row.itemRewardCycle)}</td>
                              </>
                            ) : null}
                            <td className="px-2 py-2 text-xs text-gray-900 text-center">{row.teamMember}</td>
                            <td className="px-2 py-2 text-xs text-gray-900 text-center">-</td>
                            <td className="px-2 py-2 text-xs text-gray-900 text-center">-</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 文件管理区域 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-700 mb-3">*项目奖励签批文件</div>
                <div className="flex items-center gap-4">
                  {approvalFile ? (
                    <div className="flex items-center gap-3 px-4 py-2 bg-white rounded border border-gray-200">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-700">{approvalFile.fileName}</span>
                      <button
                        onClick={handlePreviewFile}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        预览
                      </button>
                      <button
                        onClick={handleDeleteFile}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center gap-2 px-4 py-2 bg-white rounded border border-gray-200 cursor-pointer hover:bg-gray-50">
                      <Upload className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">选择文件</span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                      />
                    </label>
                  )}
                  <span className="text-xs text-gray-400">支持pdf、doc、docx格式，文件大小不超过50MB</span>
                </div>
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 flex-shrink-0">
              <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
              <Button>确认提交</Button>
            </div>
          </div>
        </div>
      )}

      {/* 文件预览弹窗 */}
      <Dialog open={filePreviewVisible} onOpenChange={setFilePreviewVisible}>
        <DialogContent className="max-w-[1000px]">
          <DialogHeader>
            <DialogTitle>文件预览</DialogTitle>
          </DialogHeader>
          <div className="h-[600px] bg-gray-100 flex items-center justify-center">
            {approvalFile ? (
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">{approvalFile.fileName}</p>
              </div>
            ) : (
              <p className="text-gray-500">暂无文件</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}