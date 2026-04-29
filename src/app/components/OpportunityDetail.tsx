import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { AddBidDialog } from "./AddBidDialog";
import {
  ChevronLeft, Link2, Star, Award, Users, Clock, FileText,
  ShoppingCart, Building2, FileCheck, FolderOpen, FileSignature, Target
} from "lucide-react";

interface BidRecord {
  id: string;
  // 发标信息
  isStart: string;
  bidType: string;
  startTime: string;
  biddingDocumentsFiles: { name: string }[];
  // 发标应对信息
  bidBody: string;
  expectedPartners: string;
  tagMeetingDecisionFiles: { name: string }[];
  isBid: string;
  // 投标信息
  tenderDocumentFiles: { name: string }[];
  bidResult: string;
  // ===== 通用投标信息（中标/丢标都有）=====
  bidTime: string;
  // ===== 中标/已签约信息 =====
  winBidTime: string;
  customerContact: string;
  customerContactPhone: string;
  expectedCompleteTime: string;
  winBidAmount: string;
  contractObject: string;
  winBidNoticeFiles: { name: string }[];
  businessNegotiationTime: string;
  // 签约信息
  signBody: string;
  signAmount: string;
  signTime: string;
  signBodyFiles: { name: string }[];
  // ===== 丢标信息 =====
  loseReason: string;
  loseReasonOther: string;
  // ===== 弃标信息 =====
  isApprove: string;
  approver: string;
  approverHrCode: string;
  approverPhonenumber: string;
  approverRole: string;
  winningStatus: string;
  abandBidResult: string;
  qbFqTime: string;
  qbTgTime: string;
  // ===== 未开标信息 =====
  notOpenReason: string;
  // ===== 未签约信息 =====
  failResult: string;
  failReasonOther: string;
}

// ===== 一级Tab =====
const level1Tabs = [
  { id: "presale", label: "售前视图" },
  { id: "sale", label: "售中视图" },
  { id: "fund", label: "资金视图" },
];

// ===== 常用工具按钮（在一级Tab右侧）=====
const toolButtons = [
  { id: "reward", label: "商机奖励", icon: <Star className="w-3.5 h-3.5" /> },
  { id: "matching", label: "前后匹配表", icon: <Link2 className="w-3.5 h-3.5" /> },
  { id: "dispatch", label: "派单", icon: <FileText className="w-3.5 h-3.5" /> },
  { id: "participants", label: "参会人员组", icon: <Users className="w-3.5 h-3.5" /> },
  { id: "log", label: "跟踪日志", icon: <Clock className="w-3.5 h-3.5" /> },
  { id: "team", label: "团队", icon: <Users className="w-3.5 h-3.5" /> },
  { id: "score", label: "积分", icon: <Award className="w-3.5 h-3.5" /> },
  { id: "contract", label: "合同", icon: <FileSignature className="w-3.5 h-3.5" /> },
  { id: "docs", label: "资料", icon: <FolderOpen className="w-3.5 h-3.5" /> },
  { id: "bidding", label: "集采竞价", icon: <ShoppingCart className="w-3.5 h-3.5" /> },
  { id: "partner", label: "合作伙伴", icon: <Building2 className="w-3.5 h-3.5" /> },
  { id: "certificate", label: "资质证书", icon: <FileCheck className="w-3.5 h-3.5" /> },
];

// ===== 流程步骤 =====
const processSteps = [
  { id: "opp", label: "商机" },
  { id: "review", label: "方案评审" },
  { id: "mode", label: "模式会" },
  { id: "forward-bid", label: "前向投标" },
  { id: "forward-contract", label: "前向合同" },
  { id: "project", label: "项目立项" },
  { id: "deconstruct", label: "业务解构" },
  { id: "backward-contract", label: "后向合同" },
];

// ===== 流程步骤对应内容 =====

// ===== FieldItem helper =====
function FieldItem({ label, value, valueClass = "" }: { label: string; value?: string; valueClass?: string }) {
  return (
    <div className="flex items-start gap-1 min-w-0">
      <span className="text-xs text-gray-500 shrink-0">{label}：</span>
      <span className={`text-sm text-gray-900 ${valueClass}`}>{value || "-"}</span>
    </div>
  );
}

function FileField({ label, files }: { label: string; files: { name: string }[] }) {
  if (files.length === 0) return <FieldItem label={label} value="" />;
  return (
    <div className="flex items-start gap-1 min-w-0">
      <span className="text-xs text-gray-500 shrink-0">{label}：</span>
      <div className="flex gap-1 flex-wrap">
        {files.map((f, i) => (
          <span key={i} className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded">{f.name}</span>
        ))}
      </div>
    </div>
  );
}

function ContentForwardBid({ onAddBid, bidRecords }: { onAddBid?: () => void; bidRecords: BidRecord[] }) {
  const [activeL3Tab, setActiveL3Tab] = useState("bid-record");
  const [downloadStatus, setDownloadStatus] = useState("");

  return (
    <div className="space-y-4">
      {/* 三级Tab */}
      <div className="flex gap-1 border-b border-gray-200 pb-0">
        {[
          { id: "bid-record", label: "投标记录" },
          { id: "partner-score", label: "合作伙伴解决方案评分" },
          { id: "construction", label: "施工单" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveL3Tab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeL3Tab === tab.id
                ? "border-[#1890ff] text-[#1890ff]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 投标记录内容 */}
      {activeL3Tab === "bid-record" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 font-medium">投标管理</span>
            <Button size="sm" className="bg-[#1890ff] hover:bg-[#0d7dea] text-white h-7 px-3" onClick={onAddBid}>
              维护投标信息
            </Button>
          </div>
          {bidRecords.length === 0 ? (
            <div className="border border-gray-200 rounded flex items-center justify-center py-12">
              <span className="text-sm text-gray-400">暂无数据</span>
            </div>
          ) : (
            <div className="space-y-3">
              {bidRecords.map((record) => {
                const badgeClass = record.bidResult === '中标' ? 'bg-green-50 text-green-600 border-green-300'
                  : record.bidResult === '丢标' ? 'bg-red-50 text-red-600 border-red-300'
                  : record.bidResult === '弃标' ? 'bg-orange-50 text-orange-600 border-orange-300'
                  : record.bidResult === '已签约' ? 'bg-purple-50 text-purple-600 border-purple-300'
                  : record.bidResult === '未签约' ? 'bg-gray-50 text-gray-600 border-gray-300'
                  : 'bg-blue-50 text-blue-600 border-blue-300';
                return (
                  <div key={record.id} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                    {/* 卡片头部 */}
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500">是否发标：{record.isStart === "1" ? "是" : "否"}</span>
                        <span className="text-xs text-gray-400">|</span>
                        <span className="text-xs text-gray-500">是否应标：{record.isBid === "1" ? "是" : "否"}</span>
                        <span className="text-xs text-gray-400">|</span>
                        <span className="text-xs text-gray-500">应标结果：</span>
                      </div>
                      <Badge className={`text-xs ${badgeClass}`}>{record.bidResult}</Badge>
                    </div>

                    {/* 发标信息 */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="text-xs font-medium text-[#1890ff] mb-2 flex items-center gap-1.5">
                        <span className="w-1 h-3 bg-[#1890ff] rounded-sm"></span>
                        发标信息
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4">
                        <FieldItem label="是否发标" value={record.isStart === "1" ? "是" : "否"} />
                        <FieldItem label="发标类型" value={record.bidType} />
                        <FieldItem label="发标时间" value={record.startTime} />
                        <FileField label="招标文件" files={record.biddingDocumentsFiles} />
                      </div>
                    </div>

                    {/* 发标应对信息 */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="text-xs font-medium text-green-600 mb-2 flex items-center gap-1.5">
                        <span className="w-1 h-3 bg-green-500 rounded-sm"></span>
                        发标应对信息
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4">
                        <FieldItem label="投标/签约主体" value={record.bidBody} />
                        <FieldItem label="预计合作伙伴" value={record.expectedPartners} />
                        <FileField label="标前会议决策记录" files={record.tagMeetingDecisionFiles} />
                        <FieldItem label="是否应标" value={record.isBid === "1" ? "是" : "否"} />
                        <FileField label="投标依据/标书" files={record.tenderDocumentFiles} />
                        <FieldItem label="应标结果" value={record.bidResult} />
                      </div>
                    </div>

                    {/* 中标信息 */}
                    {record.bidResult === "中标" && (
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="text-xs font-medium text-purple-600 mb-2 flex items-center gap-1.5">
                          <span className="w-1 h-3 bg-purple-500 rounded-sm"></span>
                          中标信息
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4">
                          <FieldItem label="投标时间" value={record.bidTime} />
                          <FieldItem label="中标金额（万元）" value={record.winBidAmount} valueClass="text-orange-600 font-medium" />
                          <FieldItem label="中标时间" value={record.winBidTime} />
                          <FieldItem label="签约对象" value={record.contractObject} />
                          <FieldItem label="客户项目联系人" value={record.customerContact} />
                          <FieldItem label="客户项目联系方式" value={record.customerContactPhone} />
                          <FieldItem label="项目期望完成时间" value={record.expectedCompleteTime} />
                          <FileField label="中标通知书" files={record.winBidNoticeFiles} />
                        </div>
                      </div>
                    )}

                    {/* 丢标信息 */}
                    {record.bidResult === "丢标" && (
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="text-xs font-medium text-red-500 mb-2 flex items-center gap-1.5">
                          <span className="w-1 h-3 bg-red-500 rounded-sm"></span>
                          丢标信息
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4">
                          <FieldItem label="投标时间" value={record.bidTime} />
                          <FieldItem label="丢标原因" value={record.loseReason} />
                          {record.loseReasonOther && <FieldItem label="其他丢标原因" value={record.loseReasonOther} />}
                        </div>
                      </div>
                    )}

                    {/* 弃标信息 */}
                    {record.bidResult === "弃标" && (
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="text-xs font-medium text-red-500 mb-2 flex items-center gap-1.5">
                          <span className="w-1 h-3 bg-red-500 rounded-sm"></span>
                          弃标信息
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4">
                          <FieldItem label="是否完成弃标审批" value={record.isApprove === "1" ? "是" : "否"} />
                          <FieldItem label="弃标审批人" value={record.approver} />
                          <FieldItem label="审批人人力编码" value={record.approverHrCode} />
                          <FieldItem label="审批人手机号" value={record.approverPhonenumber} />
                          <FieldItem label="审批人角色" value={record.approverRole} />
                          <FieldItem label="弃标审批结果" value={record.winningStatus} />
                          <FieldItem label="弃标原因" value={record.abandBidResult} />
                          <FieldItem label="弃标审批发起时间" value={record.qbFqTime} />
                          <FieldItem label="弃标审批通过时间" value={record.qbTgTime} />
                        </div>
                      </div>
                    )}

                    {/* 已签约信息 */}
                    {record.bidResult === "已签约" && (
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="text-xs font-medium text-purple-600 mb-2 flex items-center gap-1.5">
                          <span className="w-1 h-3 bg-purple-500 rounded-sm"></span>
                          已签约信息
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4">
                          <FieldItem label="商务谈判时间" value={record.businessNegotiationTime} />
                          <FieldItem label="客户项目联系人" value={record.customerContact} />
                          <FieldItem label="客户项目联系方式" value={record.customerContactPhone} />
                          <FieldItem label="项目期望完成时间" value={record.expectedCompleteTime} />
                        </div>
                      </div>
                    )}

                    {/* 未签约信息 */}
                    {record.bidResult === "未签约" && (
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1.5">
                          <span className="w-1 h-3 bg-gray-500 rounded-sm"></span>
                          未签约信息
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4">
                          <FieldItem label="签约失败原因" value={record.failResult} />
                          <FieldItem label="其他签约失败原因" value={record.failReasonOther} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeL3Tab === "partner-score" && (
        <div className="py-8 text-center text-gray-400 text-sm">合作伙伴解决方案评分 — 暂无数据</div>
      )}

      {activeL3Tab === "construction" && (
        <div className="py-8 text-center text-gray-400 text-sm">施工单 — 暂无数据</div>
      )}

      {/* 资质证书区域 */}
      <div className="border-t border-gray-200 pt-4">
        <div className="text-sm font-medium text-gray-700 mb-3">资质证书</div>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">下载状态：</span>
            <Select value={downloadStatus} onValueChange={setDownloadStatus}>
              <SelectTrigger className="h-8 w-36 text-sm"><SelectValue placeholder="全部" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="downloaded">已下载</SelectItem>
                <SelectItem value="not-downloaded">未下载</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button size="sm" className="bg-[#1890ff] hover:bg-[#0d7dea] text-white h-8">查询</Button>
        </div>

        <div className="flex gap-2 mb-3">
          {["资质证书调用", "证书及资质下载", "申请记录", "实际使用"].map(btn => (
            <Button key={btn} size="sm" variant="outline" className="h-8 text-[#1890ff] border-[#1890ff] hover:bg-blue-50">
              {btn}
            </Button>
          ))}
        </div>

        {/* 证书使用情况 */}
        <div className="text-sm font-medium text-gray-700 mb-2">证书使用情况</div>
        <div className="border border-gray-200 rounded mb-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-center text-gray-700 font-medium w-8"><Checkbox /></th>
                <th className="px-3 py-2 text-center text-gray-700 font-medium w-12">序号</th>
                <th className="px-3 py-2 text-left text-gray-700 font-medium">实际使用情况</th>
                <th className="px-3 py-2 text-left text-gray-700 font-medium">证书编号</th>
                <th className="px-3 py-2 text-left text-gray-700 font-medium">证书名称</th>
                <th className="px-3 py-2 text-left text-gray-700 font-medium">证书所属人/人力编码</th>
                <th className="px-3 py-2 text-left text-gray-700 font-medium">证书所属人电话</th>
                <th className="px-3 py-2 text-left text-gray-700 font-medium">所属部门</th>
                <th className="px-3 py-2 text-left text-gray-700 font-medium">证书类别</th>
                <th className="px-3 py-2 text-left text-gray-700 font-medium">专业/领域</th>
                <th className="px-3 py-2 text-left text-gray-700 font-medium">级别</th>
                <th className="px-3 py-2 text-center text-gray-700 font-medium w-16">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={12} className="px-3 py-6 text-center text-gray-400">暂无数据</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 公司资质表 */}
        <div className="text-sm font-medium text-gray-700 mb-2">公司资质表</div>
        <div className="border border-gray-200 rounded overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-center text-gray-700 font-medium w-8"><Checkbox /></th>
                <th className="px-3 py-2 text-center text-gray-700 font-medium w-12">序号</th>
                <th className="px-3 py-2 text-left text-gray-700 font-medium">资质编号</th>
                <th className="px-3 py-2 text-left text-gray-700 font-medium">公司资质名称</th>
                <th className="px-3 py-2 text-left text-gray-700 font-medium">授予主体</th>
                <th className="px-3 py-2 text-left text-gray-700 font-medium">资质类型</th>
                <th className="px-3 py-2 text-left text-gray-700 font-medium">所属公司</th>
                <th className="px-3 py-2 text-left text-gray-700 font-medium">获取时间</th>
                <th className="px-3 py-2 text-left text-gray-700 font-medium">资质到期时间</th>
                <th className="px-3 py-2 text-left text-gray-700 font-medium">申请流水</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={10} className="px-3 py-6 text-center text-gray-400">暂无数据</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ContentPlaceholder({ label }: { label: string }) {
  return (
    <div className="py-16 text-center text-gray-400 text-sm">{label} — 暂无数据</div>
  );
}

// ===== 主组件 =====
interface OpportunityDetailProps {
  onBack?: () => void;
}

export function OpportunityDetail({ onBack }: OpportunityDetailProps) {
  const [activeLevel1, setActiveLevel1] = useState("presale");
  const [activeProcess, setActiveProcess] = useState("forward-bid");
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [showAddBid, setShowAddBid] = useState(false);
  const [bidRecords] = useState<BidRecord[]>([
    // 中标
    {
      id: "1",
      isStart: "1",
      bidType: "公开招标",
      startTime: "2026-02-20",
      biddingDocumentsFiles: [{ name: "招标文件.pdf" }],
      bidBody: "北京大学",
      expectedPartners: "中电信数智科技有限公司",
      tagMeetingDecisionFiles: [{ name: "标前会议纪要.pdf" }],
      isBid: "1",
      tenderDocumentFiles: [{ name: "投标方案.pdf" }],
      bidResult: "中标",
      bidTime: "2026-03-10",
      winBidAmount: "500",
      winBidTime: "2026-03-15",
      customerContact: "张老师",
      customerContactPhone: "13800138000",
      expectedCompleteTime: "2026-12-31",
      contractObject: "中电信数智科技有限公司",
      winBidNoticeFiles: [{ name: "中标通知书.pdf" }],
      businessNegotiationTime: "2026-04-01",
      signBody: "中电信数智科技有限公司",
      signAmount: "480",
      signTime: "2026-04-01",
      signBodyFiles: [{ name: "商务谈判记录.pdf" }],
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
    },
    // 丢标
    {
      id: "2",
      isStart: "1",
      bidType: "邀请招标",
      startTime: "2026-01-10",
      biddingDocumentsFiles: [{ name: "招标邀请书.pdf" }],
      bidBody: "杭州市教育局",
      expectedPartners: "浙江华络通信技术有限公司",
      tagMeetingDecisionFiles: [],
      isBid: "1",
      tenderDocumentFiles: [{ name: "投标响应文件.pdf" }],
      bidResult: "丢标",
      bidTime: "2026-02-05",
      winBidAmount: "",
      winBidTime: "",
      customerContact: "李主任",
      customerContactPhone: "13900139000",
      expectedCompleteTime: "",
      contractObject: "",
      winBidNoticeFiles: [],
      businessNegotiationTime: "",
      signBody: "",
      signAmount: "",
      signTime: "",
      signBodyFiles: [],
      loseReason: "技术方案无法全面响应，技术丢分多",
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
    },
    // 弃标
    {
      id: "3",
      isStart: "1",
      bidType: "竞争性谈判",
      startTime: "2026-01-25",
      biddingDocumentsFiles: [{ name: "竞争性谈判公告.pdf" }],
      bidBody: "浙江省人民医院",
      expectedPartners: "杭州智云科技有限公司",
      tagMeetingDecisionFiles: [{ name: "内部评审纪要.pdf" }],
      isBid: "1",
      tenderDocumentFiles: [],
      bidResult: "弃标",
      bidTime: "",
      winBidAmount: "",
      winBidTime: "",
      customerContact: "王医生",
      customerContactPhone: "13700137000",
      expectedCompleteTime: "",
      contractObject: "",
      winBidNoticeFiles: [],
      businessNegotiationTime: "",
      signBody: "",
      signAmount: "",
      signTime: "",
      signBodyFiles: [],
      loseReason: "",
      loseReasonOther: "",
      isApprove: "1",
      approver: "陈总",
      approverHrCode: "EMP00888",
      approverPhonenumber: "13888888888",
      approverRole: "行业总裁",
      winningStatus: "审核通过",
      abandBidResult: "综合评估中标概率很低",
      qbFqTime: "2026-02-01",
      qbTgTime: "2026-02-03",
      notOpenReason: "",
      failResult: "",
      failReasonOther: "",
    },
    // 已签约
    {
      id: "4",
      isStart: "1",
      bidType: "单一来源采购",
      startTime: "2026-03-01",
      biddingDocumentsFiles: [{ name: "采购需求说明.pdf" }],
      bidBody: "宁波市政府办公厅",
      expectedPartners: "宁波电信系统集成有限公司",
      tagMeetingDecisionFiles: [],
      isBid: "1",
      tenderDocumentFiles: [],
      bidResult: "已签约",
      bidTime: "",
      winBidAmount: "",
      winBidTime: "",
      customerContact: "赵秘书",
      customerContactPhone: "13600136000",
      expectedCompleteTime: "2026-12-31",
      contractObject: "",
      winBidNoticeFiles: [],
      businessNegotiationTime: "2026-03-20",
      signBody: "",
      signAmount: "",
      signTime: "",
      signBodyFiles: [],
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
    },
    // 未签约
    {
      id: "5",
      isStart: "1",
      bidType: "直接签约",
      startTime: "2026-02-15",
      biddingDocumentsFiles: [{ name: "直接采购说明.pdf" }],
      bidBody: "温州市轨道交通集团",
      expectedPartners: "温州电信网络工程有限公司",
      tagMeetingDecisionFiles: [],
      isBid: "1",
      tenderDocumentFiles: [],
      bidResult: "未签约",
      bidTime: "",
      winBidAmount: "",
      winBidTime: "",
      customerContact: "周经理",
      customerContactPhone: "13500135000",
      expectedCompleteTime: "",
      contractObject: "",
      winBidNoticeFiles: [],
      businessNegotiationTime: "",
      signBody: "",
      signAmount: "",
      signTime: "",
      signBodyFiles: [],
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
      failResult: "客户需求变更或取消",
      failReasonOther: "",
    },
    // 未开标
    {
      id: "6",
      isStart: "1",
      bidType: "询价",
      startTime: "2026-04-01",
      biddingDocumentsFiles: [{ name: "询价采购公告.pdf" }],
      bidBody: "金华市财政局",
      expectedPartners: "暂无",
      tagMeetingDecisionFiles: [],
      isBid: "1",
      tenderDocumentFiles: [],
      bidResult: "未开标",
      bidTime: "",
      winBidAmount: "",
      winBidTime: "",
      customerContact: "",
      customerContactPhone: "",
      expectedCompleteTime: "",
      contractObject: "",
      winBidNoticeFiles: [],
      businessNegotiationTime: "",
      signBody: "",
      signAmount: "",
      signTime: "",
      signBodyFiles: [],
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
    },
  ]);

  const renderProcessContent = () => {
    switch (activeProcess) {
      case "forward-bid": return <ContentForwardBid onAddBid={() => setShowAddBid(true)} bidRecords={bidRecords} />;
      case "opp": return <ContentPlaceholder label="商机" />;
      case "review": return <ContentPlaceholder label="方案评审" />;
      case "mode": return <ContentPlaceholder label="模式会" />;
      case "forward-contract": return <ContentPlaceholder label="前向合同" />;
      case "project": return <ContentPlaceholder label="项目立项" />;
      case "deconstruct": return <ContentPlaceholder label="业务解构" />;
      case "backward-contract": return <ContentPlaceholder label="后向合同" />;
      default: return <ContentPlaceholder label="" />;
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#f0f5ff]">
      {/* 顶部商机信息栏 */}
      <div className="bg-white border-b border-gray-200 px-4 pt-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          {/* 左：返回 + 商机信息 */}
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-500 hover:text-gray-700 p-1">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-gray-500">商机编号：</span>
                  <span className="text-sm font-medium text-gray-900">0423</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-gray-500">客户：</span>
                  <span className="text-sm font-medium text-gray-900">杭州市物价局</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-gray-500">省商机编码：</span>
                  <span className="text-sm text-gray-700">20260428HZ01</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-gray-500">集团商机编码：</span>
                  <span className="text-sm text-gray-700">-</span>
                </div>
              </div>
            </div>
          </div>
          {/* 右：状态标签 + 操作按钮 */}
          <div className="flex items-center gap-2">
            <Badge className="bg-green-50 text-green-600 border-green-300 text-xs">已同步集团</Badge>
            <Badge className="bg-blue-50 text-blue-600 border-blue-300 text-xs">跟进中</Badge>
            <Button size="sm" variant="outline" className="h-8 text-sm">相似案例</Button>
            <Button size="sm" variant="outline" className="h-8 text-sm">推荐伙伴</Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white h-8 text-sm">
              <Link2 className="w-3.5 h-3.5 mr-1" />
              绑定项目
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-sm">商机轨迹</Button>
            <Button size="sm" variant="outline" className="h-8 text-sm">商机两级上报节点</Button>
            <Button size="sm" variant="outline" className="h-8 text-sm text-orange-600 border-orange-300">关闭此商机</Button>
          </div>
        </div>

        {/* 一级Tab + 常用工具按钮 */}
        <div className="flex items-center border-b border-gray-200 -mb-px">
          {level1Tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveLevel1(tab.id)}
              className={`px-1 py-2 mr-4 text-sm font-medium border-b-2 transition-colors ${
                activeLevel1 === tab.id
                  ? "border-[#1890ff] text-[#1890ff]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
          <div className="h-5 w-px bg-gray-300 mx-1" />
          <div className="flex items-center overflow-x-auto ml-auto">
          {toolButtons.map(btn => (
            <button
              key={btn.id}
              onClick={() => setActiveTool(activeTool === btn.id ? null : btn.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors border-b-2 ${
                activeTool === btn.id
                  ? "border-[#1890ff] text-[#1890ff]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className={activeTool === btn.id ? "text-[#1890ff]" : "text-gray-400"}>{btn.icon}</span>
              {btn.label}
            </button>
          ))}
          </div>
        </div>
      </div>

      {/* 主体区域：左侧流程 + 右侧内容 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧：流程步骤 */}
        <div className="w-52 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 flex-1">
            <div className="text-xs text-gray-500 mb-2">流程步骤</div>
            <div className="space-y-0.5">
              {processSteps.map((step, idx) => {
                const isActive = activeProcess === step.id;
                const currentIdx = processSteps.findIndex(s => s.id === activeProcess);
                const isPast = currentIdx > idx;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveProcess(step.id)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${
                      isActive
                        ? "bg-[#1890ff] text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                      isActive ? "bg-white text-[#1890ff]" : isPast ? "bg-green-400 text-white" : "border border-gray-300"
                    }`}>
                      {isPast ? "✓" : idx + 1}
                    </div>
                    <span className="truncate">{step.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-4">
              <Button size="sm" className="w-full bg-[#1890ff] hover:bg-[#0d7dea] text-white h-8 text-sm">
                推进
              </Button>
            </div>
          </div>

          {/* 图例 */}
          <div className="p-4 border-t border-gray-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-[#1890ff] flex-shrink-0" />
                <span className="text-gray-500">进行中</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-red-400 flex-shrink-0" />
                <span className="text-gray-500">超时完成</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-green-400 flex-shrink-0" />
                <span className="text-gray-500">已完成</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0" />
                <span className="text-gray-500">待进行</span>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧内容 */}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            {renderProcessContent()}
          </div>
        </div>
      </div>

      {/* 右下角悬浮 */}
      <div className="fixed bottom-6 right-6 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer">
        <Target className="w-5 h-5" />
      </div>

      {/* 新增投标弹窗 */}
      <AddBidDialog open={showAddBid} onClose={() => setShowAddBid(false)} />
    </div>
  );
}
