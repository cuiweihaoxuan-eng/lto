import React, { useState } from "react";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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

interface DemolitionItem {
  id: string;
  itemCode: string;
  itemName: string;
  amount: number;
  taxRate: string;
  description: string;
}

interface ContractDemolitionEditProps {
  record: ContractDemolitionRecord;
  onBack: () => void;
  onSave: () => void;
}

export function ContractDemolitionEdit({ record, onBack, onSave }: ContractDemolitionEditProps) {
  const [items, setItems] = useState<DemolitionItem[]>([
    {
      id: "1",
      itemCode: "ITEM-001",
      itemName: "软件开发服务费",
      amount: 3200000,
      taxRate: "6%",
      description: "系统平台软件开发与定制服务"
    },
    {
      id: "2",
      itemCode: "ITEM-002",
      itemName: "硬件设备采购",
      amount: 1500000,
      taxRate: "13%",
      description: "服务器、网络设备等硬件设施采购"
    }
  ]);

  const addItem = () => {
    const newItem: DemolitionItem = {
      id: Date.now().toString(),
      itemCode: "",
      itemName: "",
      amount: 0,
      taxRate: "6%",
      description: ""
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof DemolitionItem, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateTaxAmount = (amount: number, taxRate: string) => {
    const rate = parseFloat(taxRate) / 100;
    return amount * rate;
  };

  const calculateTotal = (amount: number, taxRate: string) => {
    return amount + calculateTaxAmount(amount, taxRate);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
  const totalTax = items.reduce((sum, item) => sum + calculateTaxAmount(item.amount, item.taxRate), 0);
  const grandTotal = items.reduce((sum, item) => sum + calculateTotal(item.amount, item.taxRate), 0);

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
            <h2 className="text-lg font-medium text-gray-900">编辑合同解构</h2>
            <p className="text-sm text-gray-500 mt-1">{record.contractCode} / {record.contractName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            取消
          </Button>
          <Button className="bg-[#1890ff] hover:bg-[#0d7dea] text-white" onClick={onSave}>
            <Save className="w-4 h-4 mr-1" />
            保存并提交审批
          </Button>
        </div>
      </div>

      {/* 基本信息（只读） */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
        <h3 className="text-base font-medium text-gray-900 mb-4">合同基本信息</h3>
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
            <div className="text-sm text-gray-500 mb-1">合同总金额</div>
            <div className="font-medium text-red-600 text-lg">¥{(record.contractAmount / 10000).toFixed(2)}万</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">项目工期</div>
            <div className="font-medium text-gray-900">{record.projectPeriod}</div>
          </div>
        </div>
      </div>

      {/* 解构明细编辑 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-medium text-gray-900">解构明细编辑</h3>
          <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={addItem}>
            <Plus className="w-4 h-4 mr-1" />
            添加项目
          </Button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-start justify-between mb-4">
                <div className="font-medium text-gray-900">项目 {index + 1}</div>
                {items.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    删除
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <label className="text-sm text-gray-600 mb-1 block">科目编码 *</label>
                  <Input 
                    value={item.itemCode}
                    onChange={(e) => updateItem(item.id, 'itemCode', e.target.value)}
                    placeholder="请输入科目编码"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-600 mb-1 block">科目名��� *</label>
                  <Input 
                    value={item.itemName}
                    onChange={(e) => updateItem(item.id, 'itemName', e.target.value)}
                    placeholder="请输入科目名称"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">税率 *</label>
                  <Select 
                    value={item.taxRate}
                    onValueChange={(value) => updateItem(item.id, 'taxRate', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0%">0%</SelectItem>
                      <SelectItem value="3%">3%</SelectItem>
                      <SelectItem value="6%">6%</SelectItem>
                      <SelectItem value="9%">9%</SelectItem>
                      <SelectItem value="13%">13%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">金额（元）*</label>
                  <Input 
                    type="number"
                    value={item.amount}
                    onChange={(e) => updateItem(item.id, 'amount', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">税额（元）</label>
                  <Input 
                    value={calculateTaxAmount(item.amount, item.taxRate).toFixed(2)}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">价税合计（元）</label>
                  <Input 
                    value={calculateTotal(item.amount, item.taxRate).toFixed(2)}
                    disabled
                    className="bg-gray-100 font-medium"
                  />
                </div>
                <div className="col-span-4">
                  <label className="text-sm text-gray-600 mb-1 block">科目说明</label>
                  <Input 
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="请输入科目说明"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 汇总信息 */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">解构科目数</div>
              <div className="text-xl font-semibold text-gray-900">{items.length}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">金额合计</div>
              <div className="text-xl font-semibold text-gray-900">¥{totalAmount.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">税额合计</div>
              <div className="text-xl font-semibold text-gray-900">¥{totalTax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">价税总计</div>
              <div className="text-xl font-semibold text-blue-600">¥{grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="text-sm text-gray-600">
              原合同金额：¥{record.contractAmount.toLocaleString()} 
              <span className={`ml-4 font-medium ${Math.abs(grandTotal - record.contractAmount) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(grandTotal - record.contractAmount) < 0.01 
                  ? '✓ 金额一致' 
                  : `差额：¥${(grandTotal - record.contractAmount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 提交说明 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-base font-medium text-gray-900 mb-4">提交说明</h3>
        <div className="mb-4">
          <label className="text-sm text-gray-600 mb-1 block">解构说明</label>
          <textarea 
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="请输入合同解构的详细说明..."
          />
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800">
          <strong>提示：</strong>提交后将进入审批流程，审批通过后解构方案将正式生效。
        </div>
      </div>
    </div>
  );
}