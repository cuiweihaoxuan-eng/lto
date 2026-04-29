import React, { useState } from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { DraggableResizableDialog } from "./DraggableResizableDialog";

interface AssociateReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ConfirmedIncomeItem {
  id: string;
  selected: boolean;
  accountingYear: string;
  accountingPeriod: string;
  projectCode: string;
  projectName: string;
  contractName: string;
  contractCode: string;
  productItemName: string;
  productItemCode: string;
  confirmedIncomeWithTax: number;
  confirmedIncomeWithoutTax: number;
  associatedReceiptAmount: number;
  accountingSubject: string;
  company: string;
  profitCenter: string;
  costCenter: string;
}

export function AssociateReceiptDialog({ open, onOpenChange }: AssociateReceiptDialogProps) {
  const [items, setItems] = useState<ConfirmedIncomeItem[]>([
    {
      id: "1",
      selected: false,
      accountingYear: "2024",
      accountingPeriod: "2024-01",
      projectCode: "ZJZ0250404080649",
      projectName: "25年瓦洪县人民政府采购服务项目",
      contractName: "瓦洪县政府服务合同",
      contractCode: "FWD0250404080000",
      productItemName: "系统开发服务",
      productItemCode: "P001",
      confirmedIncomeWithTax: 500000,
      confirmedIncomeWithoutTax: 442478,
      associatedReceiptAmount: 200000,
      accountingSubject: "6001-主营业务收入",
      company: "华为技术有限公司",
      profitCenter: "PC001",
      costCenter: "CC001"
    },
    {
      id: "2",
      selected: false,
      accountingYear: "2024",
      accountingPeriod: "2024-02",
      projectCode: "ZJZ0250404080649",
      projectName: "25年瓦洪县人民政府采购服务项目",
      contractName: "瓦洪县政府服务合同",
      contractCode: "FWD0250404080000",
      productItemName: "技术支持服务",
      productItemCode: "P002",
      confirmedIncomeWithTax: 300000,
      confirmedIncomeWithoutTax: 265487,
      associatedReceiptAmount: 100000,
      accountingSubject: "6001-主营业务收入",
      company: "华为技术有限公司",
      profitCenter: "PC002",
      costCenter: "CC002"
    },
    {
      id: "3",
      selected: false,
      accountingYear: "2024",
      accountingPeriod: "2024-03",
      projectCode: "ZJZ0250404080649",
      projectName: "25年瓦洪县人民政府采购服务项目",
      contractName: "瓦洪县政府服务合同",
      contractCode: "FWD0250404080000",
      productItemName: "运维服务",
      productItemCode: "P003",
      confirmedIncomeWithTax: 200000,
      confirmedIncomeWithoutTax: 176991,
      associatedReceiptAmount: 0,
      accountingSubject: "6001-主营业务收入",
      company: "华为技术有限公司",
      profitCenter: "PC001",
      costCenter: "CC001"
    }
  ]);

  const handleSelectAll = (checked: boolean) => {
    setItems(items.map(item => ({ ...item, selected: checked })));
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, selected: checked } : item
    ));
  };

  const handleConfirm = () => {
    const selectedItems = items.filter(item => item.selected);
    console.log("Selected items:", selectedItems);
    onOpenChange(false);
  };

  const allSelected = items.length > 0 && items.every(item => item.selected);

  return (
    <DraggableResizableDialog 
      open={open} 
      onOpenChange={onOpenChange}
      defaultWidth={1500}
      defaultHeight={750}
      minWidth={1100}
      minHeight={550}
    >
      <div className="flex flex-col h-full p-6">
        <div className="dialog-drag-handle cursor-move">
          <h2 className="text-xl">关联确收信息</h2>
          <p className="text-sm text-gray-500">请选择要关联的确认收入项。</p>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden flex-1 min-h-0 mt-4">
          <div className="overflow-auto h-full">
            <table className="w-full text-sm">
              <thead className="bg-[#f5f6f7] sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-3 min-w-[50px]">
                    <Checkbox 
                      checked={allSelected}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[100px] max-w-[120px]">会计年度</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[100px] max-w-[130px]">会计期间</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[150px] max-w-[200px]">项目编码</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[200px] max-w-[280px]">项目名称</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[180px] max-w-[250px]">合同名称</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[150px] max-w-[200px]">合同编码</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[120px] max-w-[160px]">产品收入项名称</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[140px] max-w-[180px]">产品收入项编码</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[150px] max-w-[180px]">已确认收入金额（含税）</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[160px] max-w-[200px]">已确认收入金额（不含税）</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[140px] max-w-[180px]">已关联收款金额</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[150px] max-w-[200px]">会计科目</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[150px] max-w-[200px]">公司</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[100px] max-w-[130px]">利润中心</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[100px] max-w-[130px]">成本中心</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}>
                    <td className="px-3 py-3 min-w-[50px]">
                      <Checkbox 
                        checked={item.selected}
                        onCheckedChange={(checked) => handleSelectOne(item.id, checked as boolean)}
                      />
                    </td>
                    <td className="px-3 py-3 min-w-[100px] max-w-[120px]">{item.accountingYear}</td>
                    <td className="px-3 py-3 min-w-[100px] max-w-[130px]">{item.accountingPeriod}</td>
                    <td className="px-3 py-3 min-w-[150px] max-w-[200px] break-words">{item.projectCode}</td>
                    <td className="px-3 py-3 min-w-[200px] max-w-[280px] break-words">{item.projectName}</td>
                    <td className="px-3 py-3 min-w-[180px] max-w-[250px] break-words">{item.contractName}</td>
                    <td className="px-3 py-3 min-w-[150px] max-w-[200px] break-words">{item.contractCode}</td>
                    <td className="px-3 py-3 min-w-[120px] max-w-[160px]">{item.productItemName}</td>
                    <td className="px-3 py-3 min-w-[140px] max-w-[180px]">{item.productItemCode}</td>
                    <td className="px-3 py-3 min-w-[150px] max-w-[180px]">¥{item.confirmedIncomeWithTax.toLocaleString()}</td>
                    <td className="px-3 py-3 min-w-[160px] max-w-[200px]">¥{item.confirmedIncomeWithoutTax.toLocaleString()}</td>
                    <td className="px-3 py-3 min-w-[140px] max-w-[180px]">¥{item.associatedReceiptAmount.toLocaleString()}</td>
                    <td className="px-3 py-3 min-w-[150px] max-w-[200px] break-words">{item.accountingSubject}</td>
                    <td className="px-3 py-3 min-w-[150px] max-w-[200px] break-words">{item.company}</td>
                    <td className="px-3 py-3 min-w-[100px] max-w-[130px]">{item.profitCenter}</td>
                    <td className="px-3 py-3 min-w-[100px] max-w-[130px]">{item.costCenter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button 
            className="bg-[#2e7cff] hover:bg-[#1e6eef]"
            onClick={handleConfirm}
          >
            确认
          </Button>
        </div>
      </div>
    </DraggableResizableDialog>
  );
}