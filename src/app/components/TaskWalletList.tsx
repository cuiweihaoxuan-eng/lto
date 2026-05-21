import React, { useState, useCallback, useRef, useEffect } from "react";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Button } from "./ui/button";
import { TabNav } from "./ui/tab-nav";
import { RotateCcw, GripVertical, Upload, FileText, X, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { EIPSignOffDetail } from "./EIPSignOffDetail";

// 模拟数据 - 项目清单（完整字段）
const projectListData = [
  {
    id: 1,
    cycleMonth: "202603",
    cityName: "宁波",
    qxName: "鄞州分局",
    zjName: "鄞州支局",
    jtOppCode: "SJ-2026-001",
    contractCode: "HT-2026-001",
    itemName: "XX单位信息化建设",
    itemCode: "XM-2026-001",
    applyBeginDate: "2026-01-15",
    itemStatus: "进行中",
    clientName: "XX单位",
    partyNbr: "P001",
    itemAmt: 5000000,
    itemType: "ICT",
    bigOppAmt: 20000,
    bigOppStatus: "已发放",
    itemDrawAmt: 50000,
    itemDrawAmtSet: 45000,
    itemDrawAmtMax: 50000,
    itemIssuedAmt: 30000,
    itemRewardStatus: "待发放",
    memberStatus: "正常",
    isLsFinish: "是",
    isSkFinish: "是",
    isSkEgYls: "是",
    isSkEgYfk: "是",
    srjhAll: 6000000,
    srjhNotaxAll: 5309734,
    srjhIct: 4000000,
    srjhNotaxIct: 3548672,
    srAll: 3000000,
    srNotaxAll: 2654867,
    srIct: 2000000,
    srNotaxIct: 1778761,
    hxContractname: "后向采购合同",
    hxContractcode: "HX-2026-001",
    zcjhAll: 4000000,
    zcjhNotaxAll: 3548672,
    cblzZcjhNotaxAll: 1500000,
    cgZcjhNotaxAll: 1000000,
    yznlZcjhNotaxAll: 500000,
    sjjsZcjhNotaxAll: 300000,
    investZcjhNotaxAll: 248672,
    signGrossMargin: "25%",
    signGrossMarginNotax: "28%",
    zcAll: 2000000,
    zcNotaxAll: 1778761,
    cblzZcNotaxAll: 800000,
    cgZcNotaxAll: 500000,
    yznlZcNotaxAll: 300000,
    sjjsZcNotaxAll: 150000,
    investZcNotaxAll: 28761,
    progressGrossMargin: "22%",
    progressGrossMarginNotax: "25%",
    skAll: 3000000,
    remainSkAmt: 2000000,
    fkAll: 1500000,
    remainFkAmt: 500000,
  },
  {
    id: 2,
    cycleMonth: "202603",
    cityName: "宁波",
    qxName: "江北分局",
    zjName: "江北支局",
    jtOppCode: "SJ-2026-002",
    contractCode: "HT-2026-002",
    itemName: "YY学校智慧校园建设",
    itemCode: "XM-2026-002",
    applyBeginDate: "2026-02-01",
    itemStatus: "已完成",
    clientName: "YY学校",
    partyNbr: "P002",
    itemAmt: 3000000,
    itemType: "ICT",
    bigOppAmt: 15000,
    bigOppStatus: "已发放",
    itemDrawAmt: 30000,
    itemDrawAmtSet: 28000,
    itemDrawAmtMax: 30000,
    itemIssuedAmt: 28000,
    itemRewardStatus: "已发放",
    memberStatus: "正常",
    isLsFinish: "是",
    isSkFinish: "是",
    isSkEgYls: "是",
    isSkEgYfk: "是",
    srjhAll: 3500000,
    srjhNotaxAll: 3106194,
    srjhIct: 2500000,
    srjhNotaxIct: 2216814,
    srAll: 3500000,
    srNotaxAll: 3106194,
    srIct: 2500000,
    srNotaxIct: 2216814,
    hxContractname: "后向服务合同",
    hxContractcode: "HX-2026-002",
    zcjhAll: 2200000,
    zcjhNotaxAll: 1946902,
    cblzZcjhNotaxAll: 800000,
    cgZcjhNotaxAll: 600000,
    yznlZcjhNotaxAll: 300000,
    sjjsZcjhNotaxAll: 200000,
    investZcjhNotaxAll: 46902,
    signGrossMargin: "30%",
    signGrossMarginNotax: "33%",
    zcAll: 2200000,
    zcNotaxAll: 1946902,
    cblzZcNotaxAll: 800000,
    cgZcNotaxAll: 600000,
    yznlZcNotaxAll: 300000,
    sjjsZcNotaxAll: 200000,
    investZcNotaxAll: 46902,
    progressGrossMargin: "30%",
    progressGrossMarginNotax: "33%",
    skAll: 3500000,
    remainSkAmt: 0,
    fkAll: 2200000,
    remainFkAmt: 0,
  },
];

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

// 模拟数据 - 奖金池（完整字段）
const bonusPoolData = [
  {
    id: 1,
    cycleMonth: "202603",
    qxName: "鄞州分局",
    bonusAmount: 100,
    createTime: "2026-03-10",
    createUserName: "张三",
    updateTime: "2026-03-15",
    updateUserName: "李四",
    statusCd: "已审核",
    signFileName: "会签记录.pdf",
  },
  {
    id: 2,
    cycleMonth: "202603",
    qxName: "江北分局",
    bonusAmount: 80,
    createTime: "2026-03-11",
    createUserName: "王五",
    updateTime: "2026-03-16",
    updateUserName: "赵六",
    statusCd: "待审核",
    signFileName: "",
  },
  {
    id: 3,
    cycleMonth: "202603",
    qxName: "镇海分局",
    bonusAmount: 60,
    createTime: "2026-03-12",
    createUserName: "赵六",
    updateTime: "2026-03-17",
    updateUserName: "孙七",
    statusCd: "已驳回",
    signFileName: "",
  },
];

export function TaskWalletList() {
  const [activeTab, setActiveTab] = useState("project");
  const [showAllConditions, setShowAllConditions] = useState(false);

  // 项目提成奖修改弹窗状态
  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<{
    id: number;
    itemDrawAmtSet: number;
    itemDrawAmtMax: number;
    itemName: string;
  } | null>(null);
  const [rewardInput, setRewardInput] = useState("");
  const [rewardError, setRewardError] = useState("");

  // 奖金池金额修改弹窗状态
  const [bonusModalOpen, setBonusModalOpen] = useState(false);
  const [editingBonus, setEditingBonus] = useState<{
    id: number;
    bonusAmount: number;
    qxName: string;
    cycleMonth: string;
  } | null>(null);
  const [bonusInput, setBonusInput] = useState("");

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

  // 上传会签记录弹窗状态
  const [uploadSignDialogOpen, setUploadSignDialogOpen] = useState(false);
  const [uploadSignFile, setUploadSignFile] = useState<{ fileName: string; filePath: string } | null>(null);

  // 项目清单查询条件
  const [projectParams, setProjectParams] = useState({
    orgId: "",
    cycleMonth: "",
    itemType: "",
    itemRewardStatus: "",
    saleOppName: "",
    jtOppCode: "",
    itemName: "",
    itemCode: "",
    contractName: "",
    contractCode: "",
    applyBeginDateStart: "",
    applyBeginDateEnd: "",
    isSLSFinish: "",
    isGDDFinish: "",
  });

  // 奖励签报清单查询条件
  const [rewardParams, setRewardParams] = useState({
    qxId: "",
    startDate: "",
    endDate: "",
    auditState: "",
    createUserName: "",
  });

  // 奖金池查询条件
  const [bonusParams, setBonusParams] = useState({
    qxId: "",
    cycleMonth: "",
    startDate: "",
    endDate: "",
    statusCd: "",
    receiveUser: "",
  });

  // 项目清单表格列宽状态
  const [projectColumnWidths, setProjectColumnWidths] = useState<Record<string, number>>({
    cycleMonth: 90,
    cityName: 70,
    qxName: 100,
    zjName: 80,
    jtOppCode: 140,
    contractCode: 140,
    itemName: 160,
    itemCode: 140,
    applyBeginDate: 110,
    itemStatus: 80,
    clientName: 100,
    partyNbr: 90,
    itemAmt: 100,
    itemType: 80,
    bigOppAmt: 120,
    bigOppStatus: 90,
    itemDrawAmt: 120,
    itemDrawAmtSet: 120,
    itemIssuedAmt: 100,
    itemRewardStatus: 90,
    memberStatus: 80,
    isLsFinish: 100,
    isSkFinish: 100,
    isSkEgYls: 100,
    isSkEgYfk: 100,
    srjhAll: 130,
    srjhNotaxAll: 140,
    srjhIct: 150,
    srjhNotaxIct: 160,
    srAll: 130,
    srNotaxAll: 140,
    srIct: 150,
    srNotaxIct: 160,
    hxContractname: 140,
    hxContractcode: 130,
    zcjhAll: 140,
    zcjhNotaxAll: 150,
    cblzZcjhNotaxAll: 110,
    cgZcjhNotaxAll: 110,
    yznlZcjhNotaxAll: 110,
    sjjsZcjhNotaxAll: 90,
    investZcjhNotaxAll: 90,
    signGrossMargin: 120,
    signGrossMarginNotax: 130,
    zcAll: 130,
    zcNotaxAll: 140,
    cblzZcNotaxAll: 110,
    cgZcNotaxAll: 110,
    yznlZcNotaxAll: 110,
    sjjsZcNotaxAll: 90,
    investZcNotaxAll: 90,
    progressGrossMargin: 120,
    progressGrossMarginNotax: 130,
    skAll: 120,
    remainSkAmt: 120,
    fkAll: 120,
    remainFkAmt: 120,
  });

  // 拖拽状态
  const [resizing, setResizing] = useState<string | null>(null);
  const resizeStartXRef = useRef(0);
  const resizeStartWidthRef = useRef(0);

  const handleProjectResizeStart = useCallback((e: React.MouseEvent, colId: string) => {
    e.preventDefault();
    e.stopPropagation();
    resizeStartXRef.current = e.clientX;
    resizeStartWidthRef.current = projectColumnWidths[colId] || 100;
    setResizing(colId);
  }, [projectColumnWidths]);

  useEffect(() => {
    if (!resizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - resizeStartXRef.current;
      const newWidth = Math.max(50, resizeStartWidthRef.current + diff);
      setProjectColumnWidths(prev => ({ ...prev, [resizing]: newWidth }));
    };

    const handleMouseUp = () => {
      setResizing(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing]);

  // 项目清单表头渲染
  const renderProjectHeaderCell = (id: string, label: string, style?: React.CSSProperties, borderRight?: boolean) => (
    <th
      key={id}
      style={{ width: projectColumnWidths[id], minWidth: projectColumnWidths[id], ...style }}
      className={`px-1 py-2 text-center text-xs font-medium text-gray-600 relative select-none${borderRight ? ' border-r border-gray-200' : ''}`}
    >
      <div className="flex items-center justify-center whitespace-nowrap">{label}</div>
      <div
        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-300 transition-colors"
        onMouseDown={(e) => handleProjectResizeStart(e, id)}
      />
    </th>
  );

  const handleProjectQuery = () => {
    console.log("查询项目清单", projectParams);
  };

  const handleProjectReset = () => {
    setProjectParams({
      orgId: "",
      cycleMonth: "",
      itemType: "",
      itemRewardStatus: "",
      saleOppName: "",
      jtOppCode: "",
      itemName: "",
      itemCode: "",
      contractName: "",
      contractCode: "",
      applyBeginDateStart: "",
      applyBeginDateEnd: "",
      isSLSFinish: "",
      isGDDFinish: "",
    });
  };

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

  const handleBonusQuery = () => {
    console.log("查询奖金池", bonusParams);
  };

  const handleBonusReset = () => {
    setBonusParams({
      qxId: "",
      cycleMonth: "",
      startDate: "",
      endDate: "",
      statusCd: "",
      receiveUser: "",
    });
  };

  // 格式化金额
  const formatAmount = (val: number | undefined) => {
    if (val === undefined || val === null) return "-";
    return val.toLocaleString();
  };

  // 打开项目提成奖修改弹窗
  const handleOpenRewardModal = (item: typeof projectListData[0]) => {
    setEditingReward({
      id: item.id,
      itemDrawAmtSet: item.itemDrawAmtSet,
      itemDrawAmtMax: 50000, // 模拟最大奖励金额
      itemName: item.itemName,
    });
    setRewardInput(item.itemDrawAmtSet?.toString() || "0");
    setRewardError("");
    setRewardModalOpen(true);
  };

  // 验证项目提成奖输入
  const validateRewardInput = (value: string) => {
    const pattern = /^-?\d+(\.\d+)?$/;
    if (!pattern.test(value)) {
      return "请输入有效的数字";
    }
    if (editingReward) {
      const newValue = parseFloat(value);
      if (newValue >= editingReward.itemDrawAmtMax) {
        return `不能超过最大奖励金额 ${editingReward.itemDrawAmtMax.toLocaleString()}`;
      }
    }
    return "";
  };

  // 确认修改项目提成奖
  const handleConfirmReward = () => {
    const error = validateRewardInput(rewardInput);
    if (error) {
      setRewardError(error);
      return;
    }
    // 模拟API调用
    console.log("修改项目提成奖", { id: editingReward?.id, itemDrawAmtSet: rewardInput });
    setRewardModalOpen(false);
    // 实际项目中需要刷新列表
  };

  // 打开奖金池金额修改弹窗
  const handleOpenBonusModal = (item: typeof bonusPoolData[0]) => {
    setEditingBonus({
      id: item.id,
      bonusAmount: item.bonusAmount,
      qxName: item.qxName,
      cycleMonth: item.cycleMonth,
    });
    setBonusInput(item.bonusAmount?.toString() || "0");
    setBonusModalOpen(true);
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

  // 打开上传会签记录弹窗
  const handleOpenUploadSignDialog = () => {
    setUploadSignFile(null);
    setUploadSignDialogOpen(true);
  };

  // 上传会签记录文件
  const handleUploadSignFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadSignFile({
        fileName: file.name,
        filePath: URL.createObjectURL(file),
      });
    }
  };

  // 删除会签记录文件
  const handleDeleteSignFile = () => {
    setUploadSignFile(null);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 标题区 */}
      <div className="px-6 pt-6 pb-4 flex-shrink-0">
        <h2 className="text-lg font-medium text-gray-900">钱包列表</h2>
        <p className="text-sm text-gray-500 mt-1">项目清单、奖励签报清单与奖金池查询</p>
      </div>

      {/* Tab 切换 */}
      <div className="px-6 flex-shrink-0">
        <TabNav
          tabs={[
            { id: "project", label: "项目清单" },
            { id: "reward", label: "奖励签报清单" },
            { id: "bonus", label: "奖金池" },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          style="pill"
        />
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        {activeTab === "project" ? (
          <div className="mt-4 space-y-4">
            {/* 查询条件卡片 */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">账期</label>
                  <Input
                    type="month"
                    value={projectParams.cycleMonth}
                    onChange={(e) => setProjectParams({ ...projectParams, cycleMonth: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">商机编码</label>
                  <Input
                    value={projectParams.jtOppCode}
                    onChange={(e) => setProjectParams({ ...projectParams, jtOppCode: e.target.value })}
                    placeholder="请输入"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">项目名称</label>
                  <Input
                    value={projectParams.itemName}
                    onChange={(e) => setProjectParams({ ...projectParams, itemName: e.target.value })}
                    placeholder="请输入"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">项目编码</label>
                  <Input
                    value={projectParams.itemCode}
                    onChange={(e) => setProjectParams({ ...projectParams, itemCode: e.target.value })}
                    placeholder="请输入"
                  />
                </div>
              </div>

              {showAllConditions && (
                <div className="grid grid-cols-4 gap-x-6 gap-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">合同编码</label>
                    <Input
                      value={projectParams.contractCode}
                      onChange={(e) => setProjectParams({ ...projectParams, contractCode: e.target.value })}
                      placeholder="请输入"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">项目提成奖状态</label>
                    <Select value={projectParams.itemRewardStatus} onValueChange={(v) => setProjectParams({ ...projectParams, itemRewardStatus: v })}>
                      <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="待发放">待发放</SelectItem>
                        <SelectItem value="已发放">已发放</SelectItem>
                        <SelectItem value="已撤销">已撤销</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">是否列收完成</label>
                    <Select value={projectParams.isSLSFinish} onValueChange={(v) => setProjectParams({ ...projectParams, isSLSFinish: v })}>
                      <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="是">是</SelectItem>
                        <SelectItem value="否">否</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">是否收款完成</label>
                    <Select value={projectParams.isGDDFinish} onValueChange={(v) => setProjectParams({ ...projectParams, isGDDFinish: v })}>
                      <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="是">是</SelectItem>
                        <SelectItem value="否">否</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setShowAllConditions(!showAllConditions)}
                  className="text-blue-600 p-0"
                >
                  {showAllConditions ? "收起更多条件" : "展开更多条件"}
                </Button>
                <div className="flex gap-2">
                  <Button onClick={handleProjectQuery}>查询</Button>
                  <Button variant="outline" onClick={handleProjectReset}>
                    <RotateCcw className="w-4 h-4 mr-1" />重置
                  </Button>
                </div>
              </div>
            </div>

            {/* 表格 - 项目清单（完整字段） */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 table-fixed">
                <thead>
                  <tr className="bg-gray-50">
                    <th colSpan={13} className="px-2 py-2 text-center text-sm font-medium text-gray-700 border-b border-r border-gray-200 whitespace-nowrap">项目基本信息</th>
                    <th colSpan={12} className="px-2 py-2 text-center text-sm font-medium text-gray-700 border-b border-r border-gray-200 whitespace-nowrap" style={{ background: '#FFD79B' }}>项目奖励信息</th>
                    <th colSpan={4} className="px-2 py-2 text-center text-sm font-medium text-gray-700 border-b border-r border-gray-200 whitespace-nowrap" style={{ background: '#FFC2A0' }}>前向收入计划</th>
                    <th colSpan={4} className="px-2 py-2 text-center text-sm font-medium text-gray-700 border-b border-r border-gray-200 whitespace-nowrap" style={{ background: '#FFB1A0' }}>前向实际</th>
                    <th colSpan={11} className="px-2 py-2 text-center text-sm font-medium text-gray-700 border-b border-r border-gray-200 whitespace-nowrap" style={{ background: '#92D1FF' }}>后向计划</th>
                    <th colSpan={9} className="px-2 py-2 text-center text-sm font-medium text-gray-700 border-b border-r border-gray-200 whitespace-nowrap" style={{ background: '#B3D9FF' }}>项目实际支出总金额</th>
                    <th colSpan={2} className="px-2 py-2 text-center text-sm font-medium text-gray-700 border-b border-r border-gray-200 whitespace-nowrap" style={{ background: '#FFC1CC' }}>前向收款</th>
                    <th colSpan={2} className="px-2 py-2 text-center text-sm font-medium text-gray-700 border-b whitespace-nowrap" style={{ background: '#E1BEE7' }}>后向付款</th>
                  </tr>
                  <tr className="bg-gray-50">
                    {/* 项目基本信息 */}
                    {renderProjectHeaderCell("cycleMonth", "账期")}
                    {renderProjectHeaderCell("cityName", "地市")}
                    {renderProjectHeaderCell("qxName", "区县分局")}
                    {renderProjectHeaderCell("zjName", "支局")}
                    {renderProjectHeaderCell("jtOppCode", "商机编码")}
                    {renderProjectHeaderCell("contractCode", "合同编码")}
                    {renderProjectHeaderCell("itemName", "项目名称")}
                    {renderProjectHeaderCell("itemCode", "项目编码")}
                    {renderProjectHeaderCell("applyBeginDate", "立项开始时间")}
                    {renderProjectHeaderCell("itemStatus", "项目状态")}
                    {renderProjectHeaderCell("clientName", "客户名称")}
                    {renderProjectHeaderCell("partyNbr", "客户p码")}
                    {renderProjectHeaderCell("itemAmt", "项目金额", undefined, true)}
                    {/* 项目奖励信息 */}
                    {renderProjectHeaderCell("itemType", "项目类型", { background: '#FFE5C2' })}
                    {renderProjectHeaderCell("bigOppAmt", "大额商机奖金额", { background: '#FFE5C2' })}
                    {renderProjectHeaderCell("bigOppStatus", "奖励状态", { background: '#FFE5C2' })}
                    {renderProjectHeaderCell("itemDrawAmt", "项目提成奖金额", { background: '#FFE5C2' })}
                    {renderProjectHeaderCell("itemDrawAmtSet", "设置项目提成奖金额", { background: '#FFE5C2' })}
                    {renderProjectHeaderCell("itemIssuedAmt", "已发放金额", { background: '#FFE5C2' })}
                    {renderProjectHeaderCell("itemRewardStatus", "奖励状态", { background: '#FFE5C2' })}
                    {renderProjectHeaderCell("memberStatus", "成员状态", { background: '#FFE5C2' })}
                    {renderProjectHeaderCell("isLsFinish", "是否列收完成", { background: '#FFE5C2' })}
                    {renderProjectHeaderCell("isSkFinish", "是否收款完成", { background: '#FFE5C2' })}
                    {renderProjectHeaderCell("isSkEgYls", "收款≥已列收", { background: '#FFE5C2' })}
                    {renderProjectHeaderCell("isSkEgYfk", "收款≥已付款", { background: '#FFE5C2', borderRight: true } as any)}
                    {/* 前向收入计划 */}
                    {renderProjectHeaderCell("srjhAll", "计划总收入(含税)", { background: '#FFD9CC' })}
                    {renderProjectHeaderCell("srjhNotaxAll", "计划总收入(不含税)", { background: '#FFD9CC' })}
                    {renderProjectHeaderCell("srjhIct", "ICT计划总金额(含税)", { background: '#FFD9CC' })}
                    {renderProjectHeaderCell("srjhNotaxIct", "ICT计划总金额(不含税)", { background: '#FFD9CC', borderRight: true } as any)}
                    {/* 前向实际 */}
                    {renderProjectHeaderCell("srAll", "实际总收入(含税)", { background: '#FFCBB8' })}
                    {renderProjectHeaderCell("srNotaxAll", "实际总收入(不含税)", { background: '#FFCBB8' })}
                    {renderProjectHeaderCell("srIct", "ICT实际总金额(含税)", { background: '#FFCBB8' })}
                    {renderProjectHeaderCell("srNotaxIct", "ICT实际总金额(不含税)", { background: '#FFCBB8', borderRight: true } as any)}
                    {/* 后向计划 */}
                    {renderProjectHeaderCell("hxContractname", "后向合同名称", { background: '#C2E5FF' })}
                    {renderProjectHeaderCell("hxContractcode", "后向合同编码", { background: '#C2E5FF' })}
                    {renderProjectHeaderCell("zcjhAll", "计划支出总金额(含税)", { background: '#C2E5FF' })}
                    {renderProjectHeaderCell("zcjhNotaxAll", "计划支出总金额(不含税)", { background: '#C2E5FF' })}
                    {renderProjectHeaderCell("cblzZcjhNotaxAll", "其中成本列账", { background: '#C2E5FF' })}
                    {renderProjectHeaderCell("cgZcjhNotaxAll", "其中采购订单", { background: '#C2E5FF' })}
                    {renderProjectHeaderCell("yznlZcjhNotaxAll", "其中原子能力", { background: '#C2E5FF' })}
                    {renderProjectHeaderCell("sjjsZcjhNotaxAll", "其中分成", { background: '#C2E5FF' })}
                    {renderProjectHeaderCell("investZcjhNotaxAll", "其中投资", { background: '#C2E5FF' })}
                    {renderProjectHeaderCell("signGrossMargin", "计划毛利率(含税)", { background: '#C2E5FF' })}
                    {renderProjectHeaderCell("signGrossMarginNotax", "计划毛利率(不含税)", { background: '#C2E5FF', borderRight: true } as any)}
                    {/* 项目实际支出 */}
                    {renderProjectHeaderCell("zcAll", "实际支出(含税)", { background: '#CCEBFF' })}
                    {renderProjectHeaderCell("zcNotaxAll", "实际支出(不含税)", { background: '#CCEBFF' })}
                    {renderProjectHeaderCell("cblzZcNotaxAll", "其中成本列账", { background: '#CCEBFF' })}
                    {renderProjectHeaderCell("cgZcNotaxAll", "其中采购订单", { background: '#CCEBFF' })}
                    {renderProjectHeaderCell("yznlZcNotaxAll", "其中原子能力", { background: '#CCEBFF' })}
                    {renderProjectHeaderCell("sjjsZcNotaxAll", "其中分成", { background: '#CCEBFF' })}
                    {renderProjectHeaderCell("investZcNotaxAll", "其中投资", { background: '#CCEBFF' })}
                    {renderProjectHeaderCell("progressGrossMargin", "实际毛利率(含税)", { background: '#CCEBFF' })}
                    {renderProjectHeaderCell("progressGrossMarginNotax", "实际毛利率(不含税)", { background: '#CCEBFF', borderRight: true } as any)}
                    {/* 前向收款 */}
                    {renderProjectHeaderCell("skAll", "累计实收金额", { background: '#FFDAE2' })}
                    {renderProjectHeaderCell("remainSkAmt", "累计应收账款", { background: '#FFDAE2', borderRight: true } as any)}
                    {/* 后向付款 */}
                    {renderProjectHeaderCell("fkAll", "累计付款金额", { background: '#EDD6F0' })}
                    {renderProjectHeaderCell("remainFkAmt", "累计未付款金额", { background: '#EDD6F0' })}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {projectListData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      {/* 项目基本信息 */}
                      <td style={{ width: projectColumnWidths["cycleMonth"], minWidth: projectColumnWidths["cycleMonth"] }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.cycleMonth}</td>
                      <td style={{ width: projectColumnWidths["cityName"], minWidth: projectColumnWidths["cityName"] }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.cityName}</td>
                      <td style={{ width: projectColumnWidths["qxName"], minWidth: projectColumnWidths["qxName"] }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.qxName}</td>
                      <td style={{ width: projectColumnWidths["zjName"], minWidth: projectColumnWidths["zjName"] }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.zjName}</td>
                      <td style={{ width: projectColumnWidths["jtOppCode"], minWidth: projectColumnWidths["jtOppCode"] }} className="px-1 py-2 text-xs text-blue-600 text-center whitespace-nowrap">{item.jtOppCode}</td>
                      <td style={{ width: projectColumnWidths["contractCode"], minWidth: projectColumnWidths["contractCode"] }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.contractCode}</td>
                      <td style={{ width: projectColumnWidths["itemName"], minWidth: projectColumnWidths["itemName"] }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap max-w-[150px] truncate">{item.itemName}</td>
                      <td style={{ width: projectColumnWidths["itemCode"], minWidth: projectColumnWidths["itemCode"] }} className="px-1 py-2 text-xs text-blue-600 text-center whitespace-nowrap">{item.itemCode}</td>
                      <td style={{ width: projectColumnWidths["applyBeginDate"], minWidth: projectColumnWidths["applyBeginDate"] }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.applyBeginDate}</td>
                      <td style={{ width: projectColumnWidths["itemStatus"], minWidth: projectColumnWidths["itemStatus"] }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.itemStatus}</td>
                      <td style={{ width: projectColumnWidths["clientName"], minWidth: projectColumnWidths["clientName"] }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.clientName}</td>
                      <td style={{ width: projectColumnWidths["partyNbr"], minWidth: projectColumnWidths["partyNbr"] }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.partyNbr}</td>
                      <td style={{ width: projectColumnWidths["itemAmt"], minWidth: projectColumnWidths["itemAmt"] }} className="px-1 py-2 text-xs text-blue-600 text-center whitespace-nowrap font-medium border-r">{formatAmount(item.itemAmt)}</td>
                      {/* 项目奖励信息 */}
                      <td style={{ width: projectColumnWidths["itemType"], minWidth: projectColumnWidths["itemType"], background: '#FFF5EB' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.itemType}</td>
                      <td style={{ width: projectColumnWidths["bigOppAmt"], minWidth: projectColumnWidths["bigOppAmt"], background: '#FFF5EB' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{formatAmount(item.bigOppAmt)}</td>
                      <td style={{ width: projectColumnWidths["bigOppStatus"], minWidth: projectColumnWidths["bigOppStatus"], background: '#FFF5EB' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-xs ${
                          item.bigOppStatus === '已发放' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>{item.bigOppStatus}</span>
                      </td>
                      <td style={{ width: projectColumnWidths["itemDrawAmt"], minWidth: projectColumnWidths["itemDrawAmt"], background: '#FFF5EB' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{formatAmount(item.itemDrawAmt)}</td>
                      <td style={{ width: projectColumnWidths["itemDrawAmtSet"], minWidth: projectColumnWidths["itemDrawAmtSet"], background: '#FFF5EB' }} className="px-1 py-2 text-xs text-blue-600 text-center whitespace-nowrap font-medium cursor-pointer hover:underline"
                        onClick={() => handleOpenRewardModal(item)}
                      >{formatAmount(item.itemDrawAmtSet)}</td>
                      <td style={{ width: projectColumnWidths["itemIssuedAmt"], minWidth: projectColumnWidths["itemIssuedAmt"], background: '#FFF5EB' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{formatAmount(item.itemIssuedAmt)}</td>
                      <td style={{ width: projectColumnWidths["itemRewardStatus"], minWidth: projectColumnWidths["itemRewardStatus"], background: '#FFF5EB' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-xs ${
                          item.itemRewardStatus === '已发放' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>{item.itemRewardStatus}</span>
                      </td>
                      <td style={{ width: projectColumnWidths["memberStatus"], minWidth: projectColumnWidths["memberStatus"], background: '#FFF5EB' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.memberStatus}</td>
                      <td style={{ width: projectColumnWidths["isLsFinish"], minWidth: projectColumnWidths["isLsFinish"], background: '#FFF5EB' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.isLsFinish}</td>
                      <td style={{ width: projectColumnWidths["isSkFinish"], minWidth: projectColumnWidths["isSkFinish"], background: '#FFF5EB' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.isSkFinish}</td>
                      <td style={{ width: projectColumnWidths["isSkEgYls"], minWidth: projectColumnWidths["isSkEgYls"], background: '#FFF5EB' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.isSkEgYls}</td>
                      <td style={{ width: projectColumnWidths["isSkEgYfk"], minWidth: projectColumnWidths["isSkEgYfk"], background: '#FFF5EB' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap border-r">{item.isSkEgYfk}</td>
                      {/* 前向收入计划 */}
                      <td style={{ width: projectColumnWidths["srjhAll"], minWidth: projectColumnWidths["srjhAll"], background: '#FFF0EA' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{formatAmount(item.srjhAll)}</td>
                      <td style={{ width: projectColumnWidths["srjhNotaxAll"], minWidth: projectColumnWidths["srjhNotaxAll"], background: '#FFF0EA' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{formatAmount(item.srjhNotaxAll)}</td>
                      <td style={{ width: projectColumnWidths["srjhIct"], minWidth: projectColumnWidths["srjhIct"], background: '#FFF0EA' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{formatAmount(item.srjhIct)}</td>
                      <td style={{ width: projectColumnWidths["srjhNotaxIct"], minWidth: projectColumnWidths["srjhNotaxIct"], background: '#FFF0EA' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap border-r">{formatAmount(item.srjhNotaxIct)}</td>
                      {/* 前向实际 */}
                      <td style={{ width: projectColumnWidths["srAll"], minWidth: projectColumnWidths["srAll"], background: '#FFE6DD' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{formatAmount(item.srAll)}</td>
                      <td style={{ width: projectColumnWidths["srNotaxAll"], minWidth: projectColumnWidths["srNotaxAll"], background: '#FFE6DD' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{formatAmount(item.srNotaxAll)}</td>
                      <td style={{ width: projectColumnWidths["srIct"], minWidth: projectColumnWidths["srIct"], background: '#FFE6DD' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{formatAmount(item.srIct)}</td>
                      <td style={{ width: projectColumnWidths["srNotaxIct"], minWidth: projectColumnWidths["srNotaxIct"], background: '#FFE6DD' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap border-r">{formatAmount(item.srNotaxIct)}</td>
                      {/* 后向计划 */}
                      <td style={{ width: projectColumnWidths["hxContractname"], minWidth: projectColumnWidths["hxContractname"], background: '#E8F7FF' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap max-w-[150px] truncate">{item.hxContractname}</td>
                      <td style={{ width: projectColumnWidths["hxContractcode"], minWidth: projectColumnWidths["hxContractcode"], background: '#E8F7FF' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.hxContractcode}</td>
                      <td style={{ width: projectColumnWidths["zcjhAll"], minWidth: projectColumnWidths["zcjhAll"], background: '#E8F7FF' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{formatAmount(item.zcjhAll)}</td>
                      <td style={{ width: projectColumnWidths["zcjhNotaxAll"], minWidth: projectColumnWidths["zcjhNotaxAll"], background: '#E8F7FF' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{formatAmount(item.zcjhNotaxAll)}</td>
                      <td style={{ width: projectColumnWidths["cblzZcjhNotaxAll"], minWidth: projectColumnWidths["cblzZcjhNotaxAll"], background: '#E8F7FF' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{formatAmount(item.cblzZcjhNotaxAll)}</td>
                      <td style={{ width: projectColumnWidths["cgZcjhNotaxAll"], minWidth: projectColumnWidths["cgZcjhNotaxAll"], background: '#E8F7FF' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{formatAmount(item.cgZcjhNotaxAll)}</td>
                      <td style={{ width: projectColumnWidths["yznlZcjhNotaxAll"], minWidth: projectColumnWidths["yznlZcjhNotaxAll"], background: '#E8F7FF' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{formatAmount(item.yznlZcjhNotaxAll)}</td>
                      <td style={{ width: projectColumnWidths["sjjsZcjhNotaxAll"], minWidth: projectColumnWidths["sjjsZcjhNotaxAll"], background: '#E8F7FF' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{formatAmount(item.sjjsZcjhNotaxAll)}</td>
                      <td style={{ width: projectColumnWidths["investZcjhNotaxAll"], minWidth: projectColumnWidths["investZcjhNotaxAll"], background: '#E8F7FF' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{formatAmount(item.investZcjhNotaxAll)}</td>
                      <td style={{ width: projectColumnWidths["signGrossMargin"], minWidth: projectColumnWidths["signGrossMargin"], background: '#E8F7FF' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.signGrossMargin}</td>
                      <td style={{ width: projectColumnWidths["signGrossMarginNotax"], minWidth: projectColumnWidths["signGrossMarginNotax"], background: '#E8F7FF' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap border-r">{item.signGrossMarginNotax}</td>
                      {/* 项目实际支出 */}
                      <td style={{ width: projectColumnWidths["zcAll"], minWidth: projectColumnWidths["zcAll"], background: '#E5F4FF' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{formatAmount(item.zcAll)}</td>
                      <td style={{ width: projectColumnWidths["zcNotaxAll"], minWidth: projectColumnWidths["zcNotaxAll"], background: '#E5F4FF' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{formatAmount(item.zcNotaxAll)}</td>
                      <td style={{ width: projectColumnWidths["cblzZcNotaxAll"], minWidth: projectColumnWidths["cblzZcNotaxAll"], background: '#E5F4FF' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{formatAmount(item.cblzZcNotaxAll)}</td>
                      <td style={{ width: projectColumnWidths["cgZcNotaxAll"], minWidth: projectColumnWidths["cgZcNotaxAll"], background: '#E5F4FF' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{formatAmount(item.cgZcNotaxAll)}</td>
                      <td style={{ width: projectColumnWidths["yznlZcNotaxAll"], minWidth: projectColumnWidths["yznlZcNotaxAll"], background: '#E5F4FF' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{formatAmount(item.yznlZcNotaxAll)}</td>
                      <td style={{ width: projectColumnWidths["sjjsZcNotaxAll"], minWidth: projectColumnWidths["sjjsZcNotaxAll"], background: '#E5F4FF' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{formatAmount(item.sjjsZcNotaxAll)}</td>
                      <td style={{ width: projectColumnWidths["investZcNotaxAll"], minWidth: projectColumnWidths["investZcNotaxAll"], background: '#E5F4FF' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{formatAmount(item.investZcNotaxAll)}</td>
                      <td style={{ width: projectColumnWidths["progressGrossMargin"], minWidth: projectColumnWidths["progressGrossMargin"], background: '#E5F4FF' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.progressGrossMargin}</td>
                      <td style={{ width: projectColumnWidths["progressGrossMarginNotax"], minWidth: projectColumnWidths["progressGrossMarginNotax"], background: '#E5F4FF' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap border-r">{item.progressGrossMarginNotax}</td>
                      {/* 前向收款 */}
                      <td style={{ width: projectColumnWidths["skAll"], minWidth: projectColumnWidths["skAll"], background: '#FFEEF2' }} className="px-1 py-2 text-xs text-blue-600 text-center whitespace-nowrap font-medium">{formatAmount(item.skAll)}</td>
                      <td style={{ width: projectColumnWidths["remainSkAmt"], minWidth: projectColumnWidths["remainSkAmt"], background: '#FFEEF2' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap border-r">{formatAmount(item.remainSkAmt)}</td>
                      {/* 后向付款 */}
                      <td style={{ width: projectColumnWidths["fkAll"], minWidth: projectColumnWidths["fkAll"], background: '#F5EAF8' }} className="px-1 py-2 text-xs text-orange-600 text-center whitespace-nowrap font-medium">{formatAmount(item.fkAll)}</td>
                      <td style={{ width: projectColumnWidths["remainFkAmt"], minWidth: projectColumnWidths["remainFkAmt"], background: '#F5EAF8' }} className="px-1 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{formatAmount(item.remainFkAmt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === "reward" ? (
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
        ) : (
          <div className="mt-4 space-y-4">
            {/* 查询条件卡片 */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">账期</label>
                  <Input
                    type="month"
                    value={bonusParams.cycleMonth}
                    onChange={(e) => setBonusParams({ ...bonusParams, cycleMonth: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">申请时间</label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={bonusParams.startDate}
                      onChange={(e) => setBonusParams({ ...bonusParams, startDate: e.target.value })}
                    />
                    <span className="self-center text-gray-400">-</span>
                    <Input
                      type="date"
                      value={bonusParams.endDate}
                      onChange={(e) => setBonusParams({ ...bonusParams, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">审核状态</label>
                  <Select value={bonusParams.statusCd} onValueChange={(v) => setBonusParams({ ...bonusParams, statusCd: v })}>
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
                    value={bonusParams.receiveUser}
                    onChange={(e) => setBonusParams({ ...bonusParams, receiveUser: e.target.value })}
                    placeholder="请输入"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分局</label>
                  <Select value={bonusParams.qxId} onValueChange={(v) => setBonusParams({ ...bonusParams, qxId: v })}>
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
                  <Button onClick={handleBonusQuery}>查询</Button>
                  <Button variant="outline" onClick={handleBonusReset}>
                    <RotateCcw className="w-4 h-4 mr-1" />重置
                  </Button>
                </div>
              </div>
            </div>

            {/* 表格 - 奖金池（完整字段） */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 table-fixed">
                <colgroup>
                  <col style={{ width: '80px' }} />
                  <col style={{ width: '100px' }} />
                  <col style={{ width: '120px' }} />
                  <col style={{ width: '100px' }} />
                  <col style={{ width: '70px' }} />
                  <col style={{ width: '100px' }} />
                  <col style={{ width: '70px' }} />
                  <col style={{ width: '80px' }} />
                  <col style={{ width: '120px' }} />
                </colgroup>
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">账期</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">区县分局</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">奖金池额度(万元)</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">设置时间</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">设置人</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">变更时间</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">变更人</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">审核状态</th>
                    <th className="px-2 py-3 text-center text-xs font-medium text-gray-700 whitespace-nowrap">会签记录</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {bonusPoolData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.cycleMonth}</td>
                      <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.qxName}</td>
                      <td className="px-2 py-2 text-xs text-blue-600 text-center whitespace-nowrap font-medium cursor-pointer hover:underline"
                        onClick={() => handleOpenBonusModal(item)}
                      >{item.bonusAmount}</td>
                      <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.createTime}</td>
                      <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.createUserName}</td>
                      <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.updateTime}</td>
                      <td className="px-2 py-2 text-xs text-gray-900 text-center whitespace-nowrap">{item.updateUserName}</td>
                      <td className="px-2 py-2 text-center whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          item.statusCd === "已审核"
                            ? "bg-green-100 text-green-700"
                            : item.statusCd === "待审核"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {item.statusCd}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-center whitespace-nowrap">
                        {item.signFileName ? (
                          <span className="text-blue-600 text-xs">{item.signFileName}</span>
                        ) : (
                          <button className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleOpenUploadSignDialog}>上传会签记录</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 项目提成奖修改弹窗 */}
        <Dialog open={rewardModalOpen} onOpenChange={setRewardModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>设置项目提成奖金额</DialogTitle>
              <DialogDescription>
                {editingReward?.itemName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">奖励金额（元）</label>
                <Input
                  type="number"
                  value={rewardInput}
                  onChange={(e) => {
                    setRewardInput(e.target.value);
                    setRewardError(validateRewardInput(e.target.value));
                  }}
                  placeholder="请输入奖励金额"
                  className={rewardError ? "border-red-500" : ""}
                />
                {rewardError && (
                  <p className="mt-1 text-sm text-red-500">{rewardError}</p>
                )}
                {editingReward && (
                  <p className="mt-1 text-sm text-gray-500">
                    最大奖励金额：{editingReward.itemDrawAmtMax.toLocaleString()} 元
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setRewardModalOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleConfirmReward}>
                  确定
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 奖金池金额修改弹窗 */}
        <Dialog open={bonusModalOpen} onOpenChange={setBonusModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>设置奖金池金额</DialogTitle>
              <DialogDescription>
                {editingBonus?.qxName} - {editingBonus?.cycleMonth}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">奖金池额度（万元）</label>
                <Input
                  type="number"
                  value={bonusInput}
                  onChange={(e) => setBonusInput(e.target.value)}
                  placeholder="请输入奖金池额度"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setBonusModalOpen(false)}>
                  取消
                </Button>
                <Button onClick={() => {
                  console.log("修改奖金池金额", { id: editingBonus?.id, bonusAmount: bonusInput });
                  setBonusModalOpen(false);
                }}>
                  确定
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* EIP签报详情弹窗 */}
        <EIPSignOffDetail
          open={eipSignOffDetailOpen}
          onOpenChange={setEipSignOffDetailOpen}
          basicInfo={eipSignOffDetailData || undefined}
          qxName={eipSignOffDetailData?.qxName}
          cycleMonth={eipSignOffDetailData?.cycleMonth}
        />

        {/* 上传会签记录弹窗 */}
        <Dialog open={uploadSignDialogOpen} onOpenChange={setUploadSignDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>上传会签记录</DialogTitle>
              <DialogDescription>请上传会签记录文件</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                {uploadSignFile ? (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded border border-gray-200 flex-1">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-700 flex-1">{uploadSignFile.fileName}</span>
                    <button
                      onClick={handleDeleteSignFile}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-gray-100 flex-1">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-500">选择文件</span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleUploadSignFile}
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-gray-400">支持pdf、doc、docx格式，文件大小不超过50MB</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setUploadSignDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={() => {
                  console.log("上传会签记录", uploadSignFile);
                  setUploadSignDialogOpen(false);
                }} disabled={!uploadSignFile}>
                  确定
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}