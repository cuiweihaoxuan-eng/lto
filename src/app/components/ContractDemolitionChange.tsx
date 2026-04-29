import React, { useState } from "react";
import { ArrowLeft, Plus, Save, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

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

interface ContractDemolitionChangeProps {
  record: ContractDemolitionRecord;
  onBack: () => void;
  onSubmit: () => void;
}

export function ContractDemolitionChange({ record, onBack, onSubmit }: ContractDemolitionChangeProps) {
  const [changeType, setChangeType] = useState("amount");
  const [changeReason, setChangeReason] = useState("");

  // 当前生效的解构明细
  const currentItems = [
    {
      id: "1",
      itemCode: "ITEM-001",
      itemName: "软件开发服务费",
      amount: 3200000,
      taxRate: "6%",
      taxAmount: 192000,
      totalAmount: 3392000
    },
    {
      id: "2",
      itemCode: "ITEM-002",
      itemName: "硬件设备采购",
      amount: 1500000,
      taxRate: "13%",
      taxAmount: 195000,
      totalAmount: 1695000
    },
    {
      id: "3",
      itemCode: "ITEM-003",
      itemName: "技术服务费",
      amount: 800000,
      taxRate: "6%",
      taxAmount: 48000,
      totalAmount: 848000
    }
  ];

  // 变更后的解构明细
  const [newItems, setNewItems] = useState([
    {
      id: "1",
      itemCode: "ITEM-001",
      itemName: "软件开发服务费",
      amount: 3500000,
      taxRate: "6%",
      taxAmount: 210000,
      totalAmount: 3710000,
      changeType: "金额调整"
    },
    {
      id: "2",
      itemCode: "ITEM-002",
      itemName: "硬件设备采购",
      amount: 1500000,
      taxRate: "13%",
      taxAmount: 195000,
      totalAmount: 1695000,
      changeType: "无变化"
    },
    {
      id: "3",
      itemCode: "ITEM-003",
      itemName: "技术服务费",
      amount: 500000,
      taxRate: "6%",
      taxAmount: 30000,
      totalAmount: 530000,
      changeType: "金额调整"
    },
    {
      id: "4",
      itemCode: "ITEM-004",
      itemName: "系统集成服务费",
      amount: 300000,
      taxRate: "6%",
      taxAmount: 18000,
      totalAmount: 318000,
      changeType: "新增项"
    }
  ]);

  const currentTotal = currentItems.reduce((sum, item) => sum + item.totalAmount, 0);
  const newTotal = newItems.reduce((sum, item) => sum + item.totalAmount, 0);
  const difference = newTotal - currentTotal;

  return (
    <div className="p-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            返回详情
          </Button>
          <div>
            <h2 className="text-lg font-medium text-gray-900">合同解构变更</h2>
            <p className="text-sm text-gray-500 mt-1">{record.contractCode} / {record.contractName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            取消
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={onSubmit}>
            <Save className="w-4 h-4 mr-1" />
            提交变更申请
          </Button>
        </div>
      </div>

      {/* 变更信息 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
        <h3 className="text-base font-medium text-gray-900 mb-4">变更基本信息</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">变更类型 *</label>
            <Select value={changeType} onValueChange={setChangeType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="amount">金额变更</SelectItem>
                <SelectItem value="item">项目调整</SelectItem>
                <SelectItem value="tax">税率调整</SelectItem>
                <SelectItem value="other">其他变更</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">变更申请人</label>
            <Input value={record.handler} disabled className="bg-gray-100" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">申请时间</label>
            <Input value={new Date().toLocaleString('zh-CN')} disabled className="bg-gray-100" />
          </div>
          <div className="col-span-3">
            <label className="text-sm text-gray-600 mb-1 block">变更原因 *</label>
            <textarea 
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={3}
              placeholder="请详细说明变更原因..."
              value={changeReason}
              onChange={(e) => setChangeReason(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 变更对比 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
        <h3 className="text-base font-medium text-gray-900 mb-4">变更对比</h3>
        
        {/* 汇总对比 */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">变更前总额</div>
            <div className="text-xl font-semibold text-gray-900">
              ¥{currentTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">变更后总额</div>
            <div className="text-xl font-semibold text-blue-600">
              ¥{newTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">变更差额</div>
            <div className={`text-xl font-semibold ${difference >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {difference >= 0 ? '+' : ''}¥{difference.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
          </div>
        </div>

        {/* 明细对比 */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">变更前解构明细</h4>
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">科目编码</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">科目名称</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">金额</th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">税率</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">税额</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">价税合计</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="px-4 py-2 font-medium text-gray-900">{item.itemCode}</td>
                    <td className="px-4 py-2 text-gray-900">{item.itemName}</td>
                    <td className="px-4 py-2 text-right text-gray-900">{item.amount.toLocaleString()}</td>
                    <td className="px-4 py-2 text-center text-gray-600">{item.taxRate}</td>
                    <td className="px-4 py-2 text-right text-gray-600">{item.taxAmount.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right font-medium text-gray-900">{item.totalAmount.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="bg-blue-50 font-medium">
                  <td colSpan={2} className="px-4 py-2 text-right text-gray-900">合计：</td>
                  <td className="px-4 py-2 text-right text-gray-900">
                    {currentItems.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-2"></td>
                  <td className="px-4 py-2 text-right text-gray-900">
                    {currentItems.reduce((sum, item) => sum + item.taxAmount, 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-right text-gray-900">
                    {currentTotal.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="text-sm font-medium text-gray-900 pt-4">变更后解构明细</h4>
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">科目编码</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">科目名称</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">金额</th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">税率</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">税额</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">含税金额</th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">变更类型</th>
                </tr>
              </thead>
              <tbody>
                {newItems.map((item) => (
                  <tr key={item.id} className={`border-b border-gray-100 ${
                    item.changeType === "新增项" ? "bg-green-50" : 
                    item.changeType === "金额调整" ? "bg-yellow-50" : ""
                  }`}>
                    <td className="px-4 py-2 font-medium text-gray-900">{item.itemCode}</td>
                    <td className="px-4 py-2 text-gray-900">{item.itemName}</td>
                    <td className="px-4 py-2 text-right text-gray-900">{item.amount.toLocaleString()}</td>
                    <td className="px-4 py-2 text-center text-gray-600">{item.taxRate}</td>
                    <td className="px-4 py-2 text-right text-gray-600">{item.taxAmount.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right font-medium text-gray-900">{item.totalAmount.toLocaleString()}</td>
                    <td className="px-4 py-2 text-center">
                      <Badge className={
                        item.changeType === "新增项" ? "bg-green-100 text-green-700" :
                        item.changeType === "金额调整" ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-600"
                      }>
                        {item.changeType}
                      </Badge>
                    </td>
                  </tr>
                ))}
                <tr className="bg-blue-50 font-medium">
                  <td colSpan={2} className="px-4 py-2 text-right text-gray-900">合计：</td>
                  <td className="px-4 py-2 text-right text-gray-900">
                    {newItems.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-2"></td>
                  <td className="px-4 py-2 text-right text-gray-900">
                    {newItems.reduce((sum, item) => sum + item.taxAmount, 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-right text-blue-600">
                    {newTotal.toLocaleString()}
                  </td>
                  <td className="px-4 py-2"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 附件上传 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
        <h3 className="text-base font-medium text-gray-900 mb-4">支持文件</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Plus className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">点击或拖拽文件到此处上传</p>
          <p className="text-xs text-gray-500 mt-1">支持 PDF、Word、Excel、图片等格式，单个文件不超过 10MB</p>
        </div>
      </div>

      {/* 提示信息 */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 text-sm text-orange-800">
          <div className="font-medium mb-1">变更注意事项：</div>
          <ul className="list-disc list-inside space-y-1">
            <li>合同解构变更需要重新提交审批流程</li>
            <li>变更审批通过后，原解构方案将自动失效，新方案生效</li>
            <li>如变更涉及合同金额调整，需要同步更新相关财务数据</li>
            <li>请确保变更原因和支持文件的完整性，以便审批人员了解变更必要性</li>
          </ul>
        </div>
      </div>
    </div>
  );
}