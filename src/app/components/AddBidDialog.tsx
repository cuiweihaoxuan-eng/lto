import React, { useState } from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";

interface AddBidDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: FormData) => void;
}

export interface FormData {
  // 发标信息
  isStart: string;
  bidType: string;
  startTime: string;
  biddingDocumentsFiles: FileItem[];
  // 发标应对信息
  bidBody: string;
  expectedPartners: string;
  tagMeetingDecisionFiles: FileItem[];
  isBid: string;
  // 投标信息
  tenderDocumentFiles: FileItem[];
  bidResult: string;
  // 通用投标信息（中标/丢标都有）
  bidTime: string;
  // 中标信息
  winBidAmount: string;
  winBidTime: string;
  customerContact: string;
  customerContactPhone: string;
  expectedCompleteTime: string;
  contractObject: string;
  winBidNoticeFiles: FileItem[];
  // 签约信息
  signBody: string;
  signAmount: string;
  signTime: string;
  signBodyFiles: FileItem[];
  // 商务谈判时间
  businessNegotiationTime: string;
  // 丢标信息
  loseReason: string;
  loseReasonOther: string;
  // 弃标信息
  isApprove: string;
  approver: string;
  approverHrCode: string;
  approverPhonenumber: string;
  approverRole: string;
  winningStatus: string;
  abandBidResult: string;
  qbFqTime: string;
  qbTgTime: string;
  // 未开标信息
  notOpenReason: string;
  // 未签约信息
  failResult: string;
  failReasonOther: string;
}

interface FileItem {
  name: string;
  path: string;
}

const bidResultOptions = [
  { value: "1", label: "中标" },
  { value: "2", label: "丢标" },
  { value: "3", label: "未开标" },
  { value: "4", label: "已签约" },
  { value: "5", label: "未签约" },
  { value: "6", label: "弃标" },
];

function getAvailableBidResults(bidType: string) {
  if (bidType === "4" || bidType === "6") {
    return bidResultOptions.filter(o => o.value === "4" || o.value === "5");
  }
  return bidResultOptions.filter(o => o.value === "1" || o.value === "2" || o.value === "3" || o.value === "6");
}

const bidTypeOptions = [
  { value: "1", label: "公开招标" },
  { value: "2", label: "邀请招标" },
  { value: "3", label: "竞争性谈判" },
  { value: "4", label: "单一来源采购" },
  { value: "5", label: "询价" },
  { value: "6", label: "直接签约" },
];

function FileUpload({
  label,
  files,
  onChange,
  required,
}: {
  label: string;
  files: FileItem[];
  onChange: (files: FileItem[]) => void;
  required?: boolean;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    setUploading(true);
    setTimeout(() => {
      const newFiles = Array.from(fileList).map(f => ({ name: f.name, path: `/uploads/${f.name}` }));
      onChange([...files, ...newFiles]);
      setUploading(false);
    }, 500);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="space-y-2">
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded px-2 py-1 text-xs text-blue-700">
                <span className="truncate max-w-[120px]">{f.name}</span>
                <button
                  onClick={() => onChange(files.filter((_, j) => j !== i))}
                  className="text-blue-400 hover:text-blue-600 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-gray-300 rounded cursor-pointer text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors">
          <span>点击上传</span>
          <input type="file" multiple className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx,.xls,.xlsx" />
        </label>
        <span className="text-xs text-gray-400 ml-2">支持pdf/word/excel</span>
      </div>
    </div>
  );
}

export function AddBidDialog({ open, onClose, onSubmit }: AddBidDialogProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [form, setForm] = useState<FormData>({
    isStart: "",
    bidType: "",
    startTime: "",
    biddingDocumentsFiles: [],
    bidBody: "",
    expectedPartners: "",
    tagMeetingDecisionFiles: [],
    isBid: "",
    tenderDocumentFiles: [],
    bidResult: "",
    winBidAmount: "",
    winBidTime: "",
    customerContact: "",
    customerContactPhone: "",
    expectedCompleteTime: "",
    signBody: "",
    signAmount: "",
    signTime: "",
    winBidNoticeFiles: [],
    signBodyFiles: [],
    bidTime: "",
    contractObject: "",
    businessNegotiationTime: "",
    loseReason: "",
    loseReasonOther: "",
    isApprove: "",
    approver: "",
    approverHrCode: "",
    approverPhonenumber: "",
    approverRole: "",
    winningStatus: "",
    abandBidResult: "",
    qbFqTime: "",
    qbTgTime: "",
    notOpenReason: "",
    failResult: "",
    failReasonOther: "",
  });

  const set = (key: keyof FormData, value: unknown) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  if (!open) return null;

  const dialogStyle = isFullscreen
    ? "fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
    : "fixed inset-0 z-[100] flex items-center justify-center bg-black/50";

  const cardStyle = isFullscreen
    ? "bg-white w-full h-full flex flex-col rounded-none"
    : "bg-white rounded-lg shadow-xl w-[900px] max-h-[90vh] flex flex-col";

  return (
    <div className={dialogStyle} onClick={onClose}>
      <div className={cardStyle} onClick={e => e.stopPropagation()}>
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1890ff] text-white rounded-t-lg flex-shrink-0">
          <span className="text-base font-medium">新增投标-项目发标</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 表单内容 */}
        <div className="flex-1 overflow-auto px-6 py-5">
          <div className="space-y-6">
            {/* 发标信息 */}
            <div>
              <div className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                <span className="w-1 h-4 bg-[#1890ff] rounded mr-2"></span>
                发标信息
              </div>
              <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    是否发标<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <Select value={form.isStart} onValueChange={v => set("isStart", v)}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">是</SelectItem>
                      <SelectItem value="0">否</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    发标类型{form.isStart === "1" && <span className="text-red-500 ml-0.5">*</span>}
                  </label>
                  <Select value={form.bidType} onValueChange={v => set("bidType", v)}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent>
                      {bidTypeOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    发标时间{form.isStart === "1" && <span className="text-red-500 ml-0.5">*</span>}
                  </label>
                  <Input type="date" value={form.startTime} onChange={e => set("startTime", e.target.value)} className="h-9 text-sm" />
                </div>
                <div className="col-span-3">
                  <FileUpload
                    label="招标文件/招标公告"
                    files={form.biddingDocumentsFiles}
                    onChange={v => set("biddingDocumentsFiles", v)}
                    required={form.isStart === "1"}
                  />
                </div>
              </div>
            </div>

            {/* 发标应对信息 */}
            <div>
              <div className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                <span className="w-1 h-4 bg-green-500 rounded mr-2"></span>
                发标应对信息
              </div>
              <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    投标主体<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <Input placeholder="请输入" value={form.bidBody} onChange={e => set("bidBody", e.target.value)} className="h-9 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    预计合作伙伴<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <Input placeholder="请输入" value={form.expectedPartners} onChange={e => set("expectedPartners", e.target.value)} className="h-9 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    是否应标<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <div className="flex items-center gap-4 h-9">
                    <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="isBid"
                        value="1"
                        checked={form.isBid === "1"}
                        onChange={e => set("isBid", e.target.value)}
                        className="accent-[#1890ff]"
                      />
                      是
                    </label>
                    <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="isBid"
                        value="0"
                        checked={form.isBid === "0"}
                        onChange={e => set("isBid", e.target.value)}
                        className="accent-[#1890ff]"
                      />
                      否
                    </label>
                  </div>
                </div>
                <div className="col-span-3">
                  <FileUpload
                    label="标前会议决策记录"
                    files={form.tagMeetingDecisionFiles}
                    onChange={v => set("tagMeetingDecisionFiles", v)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* 应标信息（isBid=是时显示） */}
            {form.isBid === "1" && (
              <div>
                <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      应标结果<span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <Select value={form.bidResult} onValueChange={v => set("bidResult", v)}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="请选择" /></SelectTrigger>
                      <SelectContent>
                        {getAvailableBidResults(form.bidType).map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <FileUpload
                      label="投标依据/标书"
                      files={form.tenderDocumentFiles}
                      onChange={v => set("tenderDocumentFiles", v)}
                      required={form.isBid === "1"}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 动态扩展字段：应标结果=中标 */}
            {form.bidResult === "1" && (
              <div>
                <div className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                  <span className="w-1 h-4 bg-purple-500 rounded mr-2"></span>
                  中标信息
                </div>
                <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">投标时间<span className="text-red-500 ml-0.5">*</span></label>
                    <Input type="date" value={form.bidTime} onChange={e => set("bidTime", e.target.value)} className="h-9 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">中标金额（万元）<span className="text-red-500 ml-0.5">*</span></label>
                    <Input placeholder="请输入" value={form.winBidAmount} onChange={e => set("winBidAmount", e.target.value)} className="h-9 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">中标时间<span className="text-red-500 ml-0.5">*</span></label>
                    <Input type="date" value={form.winBidTime} onChange={e => set("winBidTime", e.target.value)} className="h-9 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">签约对象<span className="text-red-500 ml-0.5">*</span></label>
                    <Input placeholder="请输入" value={form.contractObject} onChange={e => set("contractObject", e.target.value)} className="h-9 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">客户项目联系人<span className="text-red-500 ml-0.5">*</span></label>
                    <Input placeholder="请输入" value={form.customerContact} onChange={e => set("customerContact", e.target.value)} className="h-9 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">客户项目联系方式<span className="text-red-500 ml-0.5">*</span></label>
                    <Input placeholder="请输入" value={form.customerContactPhone} onChange={e => set("customerContactPhone", e.target.value)} className="h-9 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">项目期望完成时间</label>
                    <Input type="date" value={form.expectedCompleteTime} onChange={e => set("expectedCompleteTime", e.target.value)} className="h-9 text-sm" />
                  </div>
                  <div className="col-span-3">
                    <FileUpload
                      label="中标通知书"
                      files={form.winBidNoticeFiles}
                      onChange={v => set("winBidNoticeFiles", v)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 动态扩展字段：应标结果=已签约 */}
            {form.bidResult === "4" && (
              <div>
                <div className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                  <span className="w-1 h-4 bg-purple-500 rounded mr-2"></span>
                  已签约信息
                </div>
                <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">商务谈判时间</label>
                    <Input type="date" value={form.businessNegotiationTime} onChange={e => set("businessNegotiationTime", e.target.value)} className="h-9 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">客户项目联系人<span className="text-red-500 ml-0.5">*</span></label>
                    <Input placeholder="请输入" value={form.customerContact} onChange={e => set("customerContact", e.target.value)} className="h-9 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">客户项目联系方式<span className="text-red-500 ml-0.5">*</span></label>
                    <Input placeholder="请输入" value={form.customerContactPhone} onChange={e => set("customerContactPhone", e.target.value)} className="h-9 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">项目期望完成时间</label>
                    <Input type="date" value={form.expectedCompleteTime} onChange={e => set("expectedCompleteTime", e.target.value)} className="h-9 text-sm" />
                  </div>
                </div>
              </div>
            )}

            {/* 动态扩展字段：应标结果=丢标 */}
            {form.bidResult === "2" && (
              <div>
                <div className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                  <span className="w-1 h-4 bg-red-500 rounded mr-2"></span>
                  丢标信息
                </div>
                <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">投标时间<span className="text-red-500 ml-0.5">*</span></label>
                    <Input type="date" value={form.bidTime} onChange={e => set("bidTime", e.target.value)} className="h-9 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      丢标原因<span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <Select value={form.loseReason} onValueChange={v => set("loseReason", v)}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="请选择" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">商机未提前知晓</SelectItem>
                        <SelectItem value="2">客情关系不足，未提前介入项目</SelectItem>
                        <SelectItem value="3">技术方案无法全面响应，技术丢分多</SelectItem>
                        <SelectItem value="4">价格因素丢分</SelectItem>
                        <SelectItem value="5">缺乏标书要求的企业资质或个人证书，商务丢分多</SelectItem>
                        <SelectItem value="6">云网资源不满足项目需求</SelectItem>
                        <SelectItem value="7">投标失误</SelectItem>
                        <SelectItem value="8">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {form.loseReason === "8" && (
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">其他丢标原因</label>
                      <Input placeholder="请输入" value={form.loseReasonOther} onChange={e => set("loseReasonOther", e.target.value)} className="h-9 text-sm" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 动态扩展字段：应标结果=弃标 */}
            {form.bidResult === "6" && (
              <div>
                <div className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                  <span className="w-1 h-4 bg-red-500 rounded mr-2"></span>
                  弃标信息
                </div>
                <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      是否完成弃标审批<span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <Select value={form.isApprove} onValueChange={v => set("isApprove", v)}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="请选择" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">是</SelectItem>
                        <SelectItem value="0">否</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      弃标审批人<span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <Input placeholder="请输入" value={form.approver} onChange={e => set("approver", e.target.value)} className="h-9 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      审批人人力编码<span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <Input placeholder="请输入" value={form.approverHrCode} onChange={e => set("approverHrCode", e.target.value)} className="h-9 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">审批人手机号</label>
                    <Input placeholder="请输入" value={form.approverPhonenumber} onChange={e => set("approverPhonenumber", e.target.value)} className="h-9 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      审批人角色<span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <Select value={form.approverRole} onValueChange={v => set("approverRole", v)}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="请选择" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">部门经理</SelectItem>
                        <SelectItem value="2">行业总裁</SelectItem>
                        <SelectItem value="3">领导</SelectItem>
                        <SelectItem value="4">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      弃标审批结果<span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <Select value={form.winningStatus} onValueChange={v => set("winningStatus", v)}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="请选择" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">未审批</SelectItem>
                        <SelectItem value="1">审核通过</SelectItem>
                        <SelectItem value="2">已退回</SelectItem>
                        <SelectItem value="3">未通过</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      弃标原因<span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <Select value={form.abandBidResult} onValueChange={v => set("abandBidResult", v)}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="请选择" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">不满足招标文件要求，如特殊的企业资质门槛，特定的项目案例等</SelectItem>
                        <SelectItem value="2">技术方案不满足项目需求</SelectItem>
                        <SelectItem value="3">项目利润率低，不符合电信管控要求</SelectItem>
                        <SelectItem value="4">商机前期不知晓，时间太短，无法按时提交投标文件</SelectItem>
                        <SelectItem value="5">综合评估中标概率很低</SelectItem>
                        <SelectItem value="6">属于公司限制的项目类型，如纯设备集成、设备代购等</SelectItem>
                        <SelectItem value="7">竞合项目，可通过被集成或分包获取收益</SelectItem>
                        <SelectItem value="8">其他</SelectItem>
                        <SelectItem value="9">商业模式不支持，如PPP、合资公司、无任何承诺服务合同</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      弃标审批发起时间<span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <Input type="date" value={form.qbFqTime} onChange={e => set("qbFqTime", e.target.value)} className="h-9 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      弃标审批通过时间<span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <Input type="date" value={form.qbTgTime} onChange={e => set("qbTgTime", e.target.value)} className="h-9 text-sm" />
                  </div>
                </div>
              </div>
            )}

            {/* 动态扩展字段：应标结果=未开标（无录入字段，不展示区块） */}

            {/* 动态扩展字段：应标结果=未签约 */}
            {form.bidResult === "5" && (
              <div>
                <div className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                  <span className="w-1 h-4 bg-gray-500 rounded mr-2"></span>
                  未签约信息
                </div>
                <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      签约失败原因<span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <Select value={form.failResult} onValueChange={v => set("failResult", v)}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="请选择" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">客户需求变更或取消</SelectItem>
                        <SelectItem value="2">丢单</SelectItem>
                        <SelectItem value="3">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">其他签约失败原因<span className="text-red-500 ml-0.5">*</span></label>
                    <Input
                      placeholder="请输入"
                      value={form.failReasonOther}
                      onChange={e => set("failReasonOther", e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 flex-shrink-0">
          <Button variant="outline" className="h-9 text-sm" onClick={onClose}>取消</Button>
          <Button variant="outline" className="h-9 text-sm" onClick={() => {}}>暂存</Button>
          <Button
            className="h-9 text-sm bg-[#1890ff] hover:bg-[#0d7dea] text-white"
            onClick={() => {
              onSubmit?.(form);
              onClose();
            }}
          >
            提交
          </Button>
        </div>
      </div>
    </div>
  );
}
