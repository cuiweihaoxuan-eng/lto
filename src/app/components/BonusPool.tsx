import React, { useState } from "react";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Button } from "./ui/button";
import { RotateCcw, Upload, FileText, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";

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

export function BonusPool() {
  // 奖金池查询条件
  const [bonusParams, setBonusParams] = useState({
    qxId: "",
    cycleMonth: "",
    startDate: "",
    endDate: "",
    statusCd: "",
    receiveUser: "",
  });

  // 奖金池金额修改弹窗状态
  const [bonusModalOpen, setBonusModalOpen] = useState(false);
  const [editingBonus, setEditingBonus] = useState<{
    id: number;
    bonusAmount: number;
    qxName: string;
    cycleMonth: string;
  } | null>(null);
  const [bonusInput, setBonusInput] = useState("");

  // 上传会签记录弹窗状态
  const [uploadSignDialogOpen, setUploadSignDialogOpen] = useState(false);
  const [uploadSignFile, setUploadSignFile] = useState<{ fileName: string; filePath: string } | null>(null);

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
        <h2 className="text-lg font-medium text-gray-900">奖金池</h2>
        <p className="text-sm text-gray-500 mt-1">奖金池查询</p>
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-auto px-6 pb-6">
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
      </div>

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
  );
}