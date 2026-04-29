import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Search } from "lucide-react";
import { DraggableResizableDialog } from "./DraggableResizableDialog";

interface AssociatePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AccountingItem {
  id: string;
  selected: boolean;
  serialNo: number;
  projectName: string;
  projectCode: string;
  backContractName: string;
  backContractCode: string;
  operatingUser: string;
  reimbursementPerson: string;
  reimbursementNo: string;
  subjectCode: string;
  costElementName: string;
  costElementCode: string;
  debitAmount: number;
  associatedPaymentAmount: number;
  creditAmount: number;
  voucherNo: string;
  voucherDate: string;
  purchaseVoucherNo: string;
  materialNo: string;
  quantity: number;
  materialDesc: string;
  profitCenter: string;
  costCenter: string;
}

export function AssociatePaymentDialog({ open, onOpenChange }: AssociatePaymentDialogProps) {
  const [contractCode, setContractCode] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [costElementName, setCostElementName] = useState("");
  const [materialNo, setMaterialNo] = useState("");
  const [reimbursementNo, setReimbursementNo] = useState("");
  const [purchaseVoucherNo, setPurchaseVoucherNo] = useState("");

  const [items, setItems] = useState<AccountingItem[]>([
    {
      id: "1",
      selected: false,
      serialNo: 1,
      projectName: "25年瓦洪县人民政府采购服务项目",
      projectCode: "ZJZ0250404080649",
      backContractName: "后向采购合同A",
      backContractCode: "BC001H5287160000",
      operatingUser: "张三",
      reimbursementPerson: "李四",
      reimbursementNo: "RB20240115001",
      subjectCode: "5001",
      costElementName: "软件采购费",
      costElementCode: "CE001",
      debitAmount: 500000,
      associatedPaymentAmount: 200000,
      creditAmount: 0,
      voucherNo: "VC20240115001",
      voucherDate: "2024-01-15",
      purchaseVoucherNo: "PO20240110001",
      materialNo: "MAT001",
      quantity: 1,
      materialDesc: "业务管理系统",
      profitCenter: "PC001",
      costCenter: "CC001"
    },
    {
      id: "2",
      selected: false,
      serialNo: 2,
      projectName: "25年瓦洪县人民政府采购服务项目",
      projectCode: "ZJZ0250404080649",
      backContractName: "后向采购合同B",
      backContractCode: "BC002H5287160001",
      operatingUser: "王五",
      reimbursementPerson: "赵六",
      reimbursementNo: "RB20240120001",
      subjectCode: "5002",
      costElementName: "咨询服务费",
      costElementCode: "CE002",
      debitAmount: 300000,
      associatedPaymentAmount: 150000,
      creditAmount: 0,
      voucherNo: "VC20240120001",
      voucherDate: "2024-01-20",
      purchaseVoucherNo: "PO20240115001",
      materialNo: "MAT002",
      quantity: 1,
      materialDesc: "项目咨询服务",
      profitCenter: "PC002",
      costCenter: "CC002"
    },
    {
      id: "3",
      selected: false,
      serialNo: 3,
      projectName: "25年瓦洪县人民政府采购服务项目",
      projectCode: "ZJZ0250404080649",
      backContractName: "后向服务合同C",
      backContractCode: "BC003H5287160002",
      operatingUser: "张三",
      reimbursementPerson: "李四",
      reimbursementNo: "RB20240125001",
      subjectCode: "5003",
      costElementName: "技术服务费",
      costElementCode: "CE003",
      debitAmount: 180000,
      associatedPaymentAmount: 0,
      creditAmount: 0,
      voucherNo: "VC20240125001",
      voucherDate: "2024-01-25",
      purchaseVoucherNo: "PO20240120001",
      materialNo: "MAT003",
      quantity: 1,
      materialDesc: "技术支持服务",
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

  const handleSearch = () => {
    console.log("Searching...");
  };

  const handleReset = () => {
    setContractCode("");
    setSubjectCode("");
    setCostElementName("");
    setMaterialNo("");
    setReimbursementNo("");
    setPurchaseVoucherNo("");
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
      defaultWidth={1650}
      defaultHeight={850}
      minWidth={1250}
      minHeight={650}
    >
      <div className="flex flex-col h-full p-6">
        <div className="dialog-drag-handle cursor-move">
          <h2 className="text-xl">关联列账信息</h2>
          <p className="text-sm text-gray-500">选择需要关联的列账信息</p>
        </div>

        {/* Search Form */}
        <div className="space-y-4 border-b pb-4 mt-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-gray-600 block">合同编码</label>
              <Input 
                value={contractCode}
                onChange={(e) => setContractCode(e.target.value)}
                placeholder="请输入合同编码"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-600 block">科目编码</label>
              <Input 
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                placeholder="请输入科目编码"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-600 block">成本要素名称</label>
              <Input 
                value={costElementName}
                onChange={(e) => setCostElementName(e.target.value)}
                placeholder="请输入成本要素名称"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-gray-600 block">物料号</label>
              <Input 
                value={materialNo}
                onChange={(e) => setMaterialNo(e.target.value)}
                placeholder="请输入物料号"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-600 block">报账单号</label>
              <Input 
                value={reimbursementNo}
                onChange={(e) => setReimbursementNo(e.target.value)}
                placeholder="请输入报账单号"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-600 block">采购凭证号</label>
              <Input 
                value={purchaseVoucherNo}
                onChange={(e) => setPurchaseVoucherNo(e.target.value)}
                placeholder="请输入采购凭证号"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button 
                className="bg-[#2e7cff] hover:bg-[#1e6eef]"
                onClick={handleSearch}
              >
                <Search className="w-4 h-4 mr-2" />
                搜索
              </Button>
              <Button 
                variant="outline"
                onClick={handleReset}
              >
                重置
              </Button>
            </div>
          </div>
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
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[70px] max-w-[90px]">序号</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[200px] max-w-[280px]">项目名称</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[150px] max-w-[200px]">项目编码</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[150px] max-w-[200px]">后向合同名称</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[150px] max-w-[200px]">后合同编码</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[100px] max-w-[130px]">操作人</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[100px] max-w-[130px]">报账人</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[130px] max-w-[170px]">报账单号</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[100px] max-w-[130px]">科目编码</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[120px] max-w-[160px]">成本要素名称</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[130px] max-w-[170px]">成本要素编码</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[110px] max-w-[140px]">借方金额</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[130px] max-w-[170px]">已关联付款金额</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[110px] max-w-[140px]">贷方金额</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[100px] max-w-[130px]">凭证号</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[110px] max-w-[140px]">凭证日期</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[130px] max-w-[170px]">采购凭证号</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[100px] max-w-[130px]">物料号</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[70px] max-w-[90px]">数量</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[150px] max-w-[220px]">物料描述</th>
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
                    <td className="px-3 py-3 min-w-[70px] max-w-[90px]">{item.serialNo}</td>
                    <td className="px-3 py-3 min-w-[200px] max-w-[280px] break-words">{item.projectName}</td>
                    <td className="px-3 py-3 min-w-[150px] max-w-[200px] break-words">{item.projectCode}</td>
                    <td className="px-3 py-3 min-w-[150px] max-w-[200px] break-words">{item.backContractName}</td>
                    <td className="px-3 py-3 min-w-[150px] max-w-[200px] break-words">{item.backContractCode}</td>
                    <td className="px-3 py-3 min-w-[100px] max-w-[130px]">{item.operatingUser}</td>
                    <td className="px-3 py-3 min-w-[100px] max-w-[130px]">{item.reimbursementPerson}</td>
                    <td className="px-3 py-3 min-w-[130px] max-w-[170px]">{item.reimbursementNo}</td>
                    <td className="px-3 py-3 min-w-[100px] max-w-[130px]">{item.subjectCode}</td>
                    <td className="px-3 py-3 min-w-[120px] max-w-[160px]">{item.costElementName}</td>
                    <td className="px-3 py-3 min-w-[130px] max-w-[170px]">{item.costElementCode}</td>
                    <td className="px-3 py-3 min-w-[110px] max-w-[140px]">¥{item.debitAmount.toLocaleString()}</td>
                    <td className="px-3 py-3 min-w-[130px] max-w-[170px]">¥{item.associatedPaymentAmount.toLocaleString()}</td>
                    <td className="px-3 py-3 min-w-[110px] max-w-[140px]">
                      {item.creditAmount > 0 ? `¥${item.creditAmount.toLocaleString()}` : "-"}
                    </td>
                    <td className="px-3 py-3 min-w-[100px] max-w-[130px]">{item.voucherNo}</td>
                    <td className="px-3 py-3 min-w-[110px] max-w-[140px]">{item.voucherDate}</td>
                    <td className="px-3 py-3 min-w-[130px] max-w-[170px]">{item.purchaseVoucherNo}</td>
                    <td className="px-3 py-3 min-w-[100px] max-w-[130px]">{item.materialNo}</td>
                    <td className="px-3 py-3 min-w-[70px] max-w-[90px]">{item.quantity}</td>
                    <td className="px-3 py-3 min-w-[150px] max-w-[220px] break-words">{item.materialDesc}</td>
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