import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Search } from "lucide-react";
import { DraggableResizableDialog } from "./DraggableResizableDialog";

interface AddReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface BankTransaction {
  id: string;
  selected: boolean;
  transactionSerial: string;
  debitAmount: number;
  creditAmount: number;
  transactionTime: string;
  counterpartyAccount: string;
  counterpartyAccountName: string;
  claimant: string;
  claimantOrg: string;
  phone: string;
  purpose: string;
  addendum: string;
  summary: string;
  remark: string;
}

export function AddReceiptDialog({ open, onOpenChange }: AddReceiptDialogProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [counterpartyName, setCounterpartyName] = useState("");
  const [claimant, setClaimant] = useState("");
  const [accountAmount, setAccountAmount] = useState("");
  const [transactionSerial, setTransactionSerial] = useState("");
  const [summary, setSummary] = useState("");

  const [transactions, setTransactions] = useState<BankTransaction[]>([
    {
      id: "1",
      selected: false,
      transactionSerial: "20240115001234567890",
      debitAmount: 500000,
      creditAmount: 0,
      transactionTime: "2024-01-15 10:30:45",
      counterpartyAccount: "6222021001012345678",
      counterpartyAccountName: "瓦洪县人民政府",
      claimant: "张三",
      claimantOrg: "销售部",
      phone: "13800138000",
      purpose: "项目款",
      addendum: "首期款项",
      summary: "ZJZ0250404080649项目首期款",
      remark: ""
    },
    {
      id: "2",
      selected: false,
      transactionSerial: "20240120001234567891",
      debitAmount: 300000,
      creditAmount: 0,
      transactionTime: "2024-01-20 14:22:15",
      counterpartyAccount: "6222021001012345679",
      counterpartyAccountName: "瓦洪县财政局",
      claimant: "李四",
      claimantOrg: "财务部",
      phone: "13800138001",
      purpose: "服务费",
      addendum: "第二期款项",
      summary: "ZJZ0250404080649项目二期款",
      remark: "已核对"
    },
    {
      id: "3",
      selected: false,
      transactionSerial: "20240125001234567892",
      debitAmount: 200000,
      creditAmount: 0,
      transactionTime: "2024-01-25 09:15:30",
      counterpartyAccount: "6222021001012345680",
      counterpartyAccountName: "瓦洪县教育局",
      claimant: "王五",
      claimantOrg: "项目部",
      phone: "13800138002",
      purpose: "项目款",
      addendum: "",
      summary: "ZJZ0250404080649项目尾款",
      remark: ""
    }
  ]);

  const handleSelectAll = (checked: boolean) => {
    setTransactions(transactions.map(item => ({ ...item, selected: checked })));
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setTransactions(transactions.map(item => 
      item.id === id ? { ...item, selected: checked } : item
    ));
  };

  const handleSearch = () => {
    console.log("Searching...");
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setCounterpartyName("");
    setClaimant("");
    setAccountAmount("");
    setTransactionSerial("");
    setSummary("");
  };

  const handleConfirm = () => {
    const selectedItems = transactions.filter(item => item.selected);
    console.log("Selected items:", selectedItems);
    onOpenChange(false);
  };

  const allSelected = transactions.length > 0 && transactions.every(item => item.selected);

  return (
    <DraggableResizableDialog 
      open={open} 
      onOpenChange={onOpenChange}
      defaultWidth={1400}
      defaultHeight={800}
      minWidth={1000}
      minHeight={600}
    >
      <div className="flex flex-col h-full p-6">
        <div className="dialog-drag-handle cursor-move">
          <h2 className="text-xl">添加银行流水明细</h2>
          <p className="text-sm text-gray-500">选择并添加银行流水明细到收据中。</p>
        </div>

        {/* Search Form */}
        <div className="space-y-4 border-b pb-4 mt-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-gray-600 block">查询起止时间</label>
              <div className="flex gap-2">
                <Input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="开始日期"
                  className="flex-1"
                />
                <Input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="结束日期"
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-600 block">对方账户名称</label>
              <Input 
                value={counterpartyName}
                onChange={(e) => setCounterpartyName(e.target.value)}
                placeholder="请输入对方账户名称"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-600 block">认领人</label>
              <Input 
                value={claimant}
                onChange={(e) => setClaimant(e.target.value)}
                placeholder="请输入认领人"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-600 block">账户金额</label>
              <Input 
                type="number"
                value={accountAmount}
                onChange={(e) => setAccountAmount(e.target.value)}
                placeholder="请输入账户金额"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-gray-600 block">交易流水号</label>
              <Input 
                value={transactionSerial}
                onChange={(e) => setTransactionSerial(e.target.value)}
                placeholder="请输入交易流水号"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-600 block">摘要</label>
              <Input 
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="请输入摘要"
              />
            </div>
            <div className="col-span-2 flex items-end gap-2">
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
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[150px] max-w-[200px]">交易流水号</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[110px] max-w-[130px]">借方金额</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[110px] max-w-[130px]">贷方金额</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[150px] max-w-[180px]">交易时间</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[160px] max-w-[200px]">对方账号</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[150px] max-w-[200px]">对方账号名称</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[100px] max-w-[120px]">认领人</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[180px] max-w-[250px]">认领人组织</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[120px] max-w-[150px]">电话</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[100px] max-w-[130px]">用途</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[120px] max-w-[180px]">附言</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[150px] max-w-[200px]">摘要</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 min-w-[150px] max-w-[200px]">备注</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}>
                    <td className="px-3 py-3 min-w-[50px]">
                      <Checkbox 
                        checked={item.selected}
                        onCheckedChange={(checked) => handleSelectOne(item.id, checked as boolean)}
                      />
                    </td>
                    <td className="px-3 py-3 min-w-[150px] max-w-[200px] break-words">{item.transactionSerial}</td>
                    <td className="px-3 py-3 min-w-[110px] max-w-[130px]">
                      {item.debitAmount > 0 ? `¥${item.debitAmount.toLocaleString()}` : "-"}
                    </td>
                    <td className="px-3 py-3 min-w-[110px] max-w-[130px]">
                      {item.creditAmount > 0 ? `¥${item.creditAmount.toLocaleString()}` : "-"}
                    </td>
                    <td className="px-3 py-3 min-w-[150px] max-w-[180px]">{item.transactionTime}</td>
                    <td className="px-3 py-3 min-w-[160px] max-w-[200px] break-words">{item.counterpartyAccount}</td>
                    <td className="px-3 py-3 min-w-[150px] max-w-[200px] break-words">{item.counterpartyAccountName}</td>
                    <td className="px-3 py-3 min-w-[100px] max-w-[120px]">{item.claimant}</td>
                    <td className="px-3 py-3 min-w-[180px] max-w-[250px] break-words">{item.claimantOrg}</td>
                    <td className="px-3 py-3 min-w-[120px] max-w-[150px]">{item.phone}</td>
                    <td className="px-3 py-3 min-w-[100px] max-w-[130px]">{item.purpose}</td>
                    <td className="px-3 py-3 min-w-[120px] max-w-[180px] break-words">{item.addendum || "-"}</td>
                    <td className="px-3 py-3 min-w-[150px] max-w-[200px] break-words">{item.summary}</td>
                    <td className="px-3 py-3 min-w-[150px] max-w-[200px] break-words">{item.remark || "-"}</td>
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