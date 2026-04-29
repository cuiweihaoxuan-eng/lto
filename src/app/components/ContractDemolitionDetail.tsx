import React from "react";
import { ArrowLeft, Calendar, User, FileText, Clock, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface ContractDemolitionRecord {
  id: string;
  projectCode: string;
  projectName: string;
  contractCode: string;
  contractName: string;
  contractAmount: number;
  projectPeriod: string;
  status: "待解构" | "审批中" | "已生效" | "已驳回" | "变更中" | "已作废";
  approvalProgress: string;
  handler: string;
  lastUpdateTime: string;
}

interface ContractDemolitionDetailProps {
  record: ContractDemolitionRecord;
  onBack: () => void;
  onEdit: () => void;
}

export function ContractDemolitionDetail({ record, onBack, onEdit }: ContractDemolitionDetailProps) {
  const getStatusBadge = (status: ContractDemolitionRecord["status"]) => {
    const variants: Record<ContractDemolitionRecord["status"], string> = {
      "待解构": "bg-gray-100 text-gray-600 border border-gray-300",
      "审批中": "bg-blue-50 text-blue-600 border border-blue-300",
      "已生效": "bg-green-50 text-green-600 border border-green-300",
      "已驳回": "bg-red-50 text-red-600 border border-red-300",
      "变更中": "bg-orange-50 text-orange-600 border border-orange-300",
      "已作废": "bg-gray-100 text-gray-400 border border-gray-300"
    };
    return <Badge className={variants[status]}>{status}</Badge>;
  };

  // 模拟解构明细数据
  const demolitionItems = [
    {
      id: "1",
      itemName: "软件开发服务费",
      itemCode: "ITEM-001",
      amount: 3200000,
      taxRate: "6%",
      taxAmount: 192000,
      totalAmount: 3392000,
      description: "系统平台软件开发与定制服务"
    },
    {
      id: "2",
      itemName: "硬件设备采购",
      itemCode: "ITEM-002",
      amount: 1500000,
      taxRate: "13%",
      taxAmount: 195000,
      totalAmount: 1695000,
      description: "服务器、网络设备等硬件设施采购"
    },
    {
      id: "3",
      itemName: "技术服务费",
      itemCode: "ITEM-003",
      amount: 800000,
      taxRate: "6%",
      taxAmount: 48000,
      totalAmount: 848000,
      description: "技术支持与运维服务"
    },
    {
      id: "4",
      itemName: "项目管理费",
      itemCode: "ITEM-004",
      amount: 300000,
      taxRate: "6%",
      taxAmount: 18000,
      totalAmount: 318000,
      description: "项目实施管理与协调服务"
    }
  ];

  // 审批流程记录
  const approvalHistory = [
    { step: "项目经理审批", approver: "张三", time: "2024-03-10 09:30", status: "已通���", comment: "同意解构方案" },
    { step: "财务审核", approver: "李四", time: "2024-03-10 11:20", status: "已通过", comment: "财务数据无误" },
    { step: "部门负责人审批", approver: "王五", time: "2024-03-10 14:15", status: "已通过", comment: "批准执行" },
    { step: "总经理审批", approver: "赵六", time: "2024-03-10 16:30", status: "已通过", comment: "同意" }
  ];

  return (
    <div className="p-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            返回列表
          </Button>
          <div>
            <h2 className="text-lg font-medium text-gray-900">合同解构详情</h2>
            <p className="text-sm text-gray-500 mt-1">{record.contractCode} / {record.contractName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {(record.status === "待解构" || record.status === "已驳回") && (
            <Button className="bg-[#1890ff] hover:bg-[#0d7dea] text-white" onClick={onEdit}>
              编辑解构
            </Button>
          )}
          {record.status === "已生效" && (
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              申请变更
            </Button>
          )}
        </div>
      </div>

      {/* 基本信息 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-medium text-gray-900">基本信息</h3>
          {getStatusBadge(record.status)}
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-gray-500 mb-1">项目编号</div>
            <div className="font-medium text-gray-900">{record.projectCode}</div>
          </div>
          <div className="col-span-2">
            <div className="text-sm text-gray-500 mb-1">项目名称</div>
            <div className="font-medium text-gray-900">{record.projectName}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">合同编号</div>
            <div className="font-medium text-gray-900">{record.contractCode}</div>
          </div>
          <div className="col-span-2">
            <div className="text-sm text-gray-500 mb-1">合同名称</div>
            <div className="font-medium text-gray-900">{record.contractName}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">���总金额</div>
            <div className="font-medium text-red-600 text-lg">¥{(record.contractAmount / 10000).toFixed(2)}万</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">项目工期</div>
            <div className="font-medium text-gray-900">{record.projectPeriod}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">审批进度</div>
            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
              {record.approvalProgress}
            </Badge>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">经办人</div>
            <div className="font-medium text-gray-900">{record.handler}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">最近更新时间</div>
            <div className="font-medium text-gray-900">{record.lastUpdateTime}</div>
          </div>
        </div>
      </div>

      {/* 解构明细 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
        <h3 className="text-base font-medium text-gray-900 mb-4">解构明细</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">序号</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">科目编码</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">科目名称</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">金额（元）</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">税率</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">税额（元）</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">含税金额（元）</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">备注</th>
              </tr>
            </thead>
            <tbody>
              {demolitionItems.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{item.itemCode}</td>
                  <td className="px-4 py-3 text-gray-900">{item.itemName}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    {item.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">{item.taxRate}</td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {item.taxAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-blue-600">
                    {item.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.description}</td>
                </tr>
              ))}
              <tr className="bg-blue-50 font-medium">
                <td colSpan={3} className="px-4 py-3 text-right text-gray-900">合计：</td>
                <td className="px-4 py-3 text-right text-gray-900">
                  {demolitionItems.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                </td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 text-right text-gray-900">
                  {demolitionItems.reduce((sum, item) => sum + item.taxAmount, 0).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-blue-600">
                  {demolitionItems.reduce((sum, item) => sum + item.totalAmount, 0).toLocaleString()}
                </td>
                <td className="px-4 py-3"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 审批流程 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-base font-medium text-gray-900 mb-4">审批流程</h3>
        <div className="space-y-4">
          {approvalHistory.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  item.status === "已通过" ? "bg-green-100" : "bg-gray-100"
                }`}>
                  <CheckCircle className={`w-4 h-4 ${
                    item.status === "已通过" ? "text-green-600" : "text-gray-400"
                  }`} />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-medium text-gray-900">{item.step}</span>
                  <Badge className={item.status === "已通过" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-600"}>
                    {item.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {item.approver}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {item.time}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">审批意见：{item.comment}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}