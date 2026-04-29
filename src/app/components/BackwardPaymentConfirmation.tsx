import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Checkbox } from "./ui/checkbox";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { AddPaymentDialog } from "./AddPaymentDialog";
import { AssociatePaymentDialog } from "./AssociatePaymentDialog";

interface PaymentRecord {
  id: string;
  backContractName: string;
  backContractCode: string;
  operatingUser: string;
  reimbursementPerson: string;
  reimbursementNo: string;
  subjectCode: string;
  costElementName: string;
  costElementCode: string;
  debitAmount: number;
  creditAmount: number;
  voucherNo: string;
  voucherDate: string;
  purchaseVoucherNo: string;
  materialNo: string;
  quantity: number;
  materialDesc: string;
  profitCenter: string;
  costCenter: string;
  currentPaymentAmount: number;
  paidAmount: number;
  remainingAmount: number;
  associateDate: string;
  associatePerson: string;
}

interface PaymentData {
  id: string;
  serialNo: number;
  projectName: string;
  projectCode: string;
  backContractName: string;
  backContractCode: string;
  contractAmount: number;
  sapVoucherNo: string;
  financeReimbursementNo: string;
  counterpartyName: string;
  paymentAmount: number;
  taxAmount: number;
  paymentDate: string;
  postingDate: string;
  associatedRecords: PaymentRecord[];
  expanded: boolean;
}

export function BackwardPaymentConfirmation() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAssociateDialog, setShowAssociateDialog] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  
  const [paymentData, setPaymentData] = useState<PaymentData[]>([
    {
      id: "1",
      serialNo: 1,
      projectName: "25年瓦洪县人民政府采购服务项目",
      projectCode: "ZJZ0250404080649",
      backContractName: "后向采购合同A",
      backContractCode: "BC001H5287160000",
      contractAmount: 500000,
      sapVoucherNo: "SAP20240115001",
      financeReimbursementNo: "FIN20240115001",
      counterpartyName: "杭州某科技有限公司",
      paymentAmount: 200000,
      taxAmount: 26000,
      paymentDate: "2024-01-15",
      postingDate: "2024-01-16",
      associatedRecords: [
        {
          id: "1-1",
          backContractName: "后向采购合同A",
          backContractCode: "BC001H5287160000",
          operatingUser: "张三",
          reimbursementPerson: "李四",
          reimbursementNo: "RB20240115001",
          subjectCode: "5001",
          costElementName: "软件采购费",
          costElementCode: "CE001",
          debitAmount: 200000,
          creditAmount: 0,
          voucherNo: "VC20240115001",
          voucherDate: "2024-01-15",
          purchaseVoucherNo: "PO20240110001",
          materialNo: "MAT001",
          quantity: 1,
          materialDesc: "业务管理系统",
          profitCenter: "PC001",
          costCenter: "CC001",
          currentPaymentAmount: 200000,
          paidAmount: 200000,
          remainingAmount: 0,
          associateDate: "2024-01-16",
          associatePerson: "王五"
        }
      ],
      expanded: false
    },
    {
      id: "2",
      serialNo: 2,
      projectName: "25年瓦洪县人民政府采购服务项目",
      projectCode: "ZJZ0250404080649",
      backContractName: "后向采购合同B",
      backContractCode: "BC002H5287160001",
      contractAmount: 300000,
      sapVoucherNo: "SAP20240120001",
      financeReimbursementNo: "FIN20240120001",
      counterpartyName: "杭州某咨询公司",
      paymentAmount: 150000,
      taxAmount: 19500,
      paymentDate: "2024-01-20",
      postingDate: "2024-01-21",
      associatedRecords: [],
      expanded: false
    }
  ]);

  const toggleExpand = (id: string) => {
    setPaymentData(paymentData.map(item => 
      item.id === id ? { ...item, expanded: !item.expanded } : item
    ));
  };

  const handleAssociate = (id: string) => {
    setSelectedRecordId(id);
    setShowAssociateDialog(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这条记录吗？")) {
      setPaymentData(paymentData.filter(item => item.id !== id));
    }
  };

  const handleDeleteSubRecord = (parentId: string, recordId: string) => {
    if (confirm("确定要删除这条关联记录吗？")) {
      setPaymentData(paymentData.map(item => {
        if (item.id === parentId) {
          return {
            ...item,
            associatedRecords: item.associatedRecords.filter(r => r.id !== recordId)
          };
        }
        return item;
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <div className="bg-[#f7f8fa] p-4 rounded space-y-3">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <div className="text-gray-600 text-sm mb-1">项目总金额(万元)</div>
            <div className="font-medium text-lg">245.68</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm mb-1">应付账款金额(万元)</div>
            <div className="font-medium text-lg text-blue-600">180.00</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm mb-1">项目累计确认付款金额(万元)</div>
            <div className="font-medium text-lg text-red-600">85.68</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm mb-1">项目剩余未付款金额(万元)</div>
            <div className="font-medium text-lg text-orange-600">160.00</div>
          </div>
        </div>
        
        <div className="border-t pt-3 space-y-2">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-gray-600 text-sm mb-1">合同1-BC001H5287160000总金额(万元)</div>
              <div className="font-medium text-lg">50.00</div>
            </div>
            <div>
              <div className="text-gray-600 text-sm mb-1">合同1-应付账款金额(万元)</div>
              <div className="font-medium text-lg text-blue-600">40.00</div>
            </div>
            <div>
              <div className="text-gray-600 text-sm mb-1">合同1-累计确认付款金额(万元)</div>
              <div className="font-medium text-lg text-red-600">20.00</div>
            </div>
            <div>
              <div className="text-gray-600 text-sm mb-1">合同1-剩余未付款金额(万元)</div>
              <div className="font-medium text-lg text-orange-600">30.00</div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-gray-600 text-sm mb-1">合同2-BC002H5287160001总金额(万元)</div>
              <div className="font-medium text-lg">30.00</div>
            </div>
            <div>
              <div className="text-gray-600 text-sm mb-1">合同2-应付账款金额(万元)</div>
              <div className="font-medium text-lg text-blue-600">25.00</div>
            </div>
            <div>
              <div className="text-gray-600 text-sm mb-1">合同2-累计确认付款金额(万元)</div>
              <div className="font-medium text-lg text-red-606">15.00</div>
            </div>
            <div>
              <div className="text-gray-600 text-sm mb-1">合同2-剩余未付款金额(万元)</div>
              <div className="font-medium text-lg text-orange-600">15.00</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div>
        <Button 
          className="bg-[#2e7cff] hover:bg-[#1e6eef]"
          onClick={() => setShowAddDialog(true)}
        >
          新增付款确认
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-max">
            <thead className="bg-[#f5f6f7]">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap min-w-[60px]">序号</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap min-w-[200px]">项目名称</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap min-w-[150px]">项目编码</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap min-w-[150px]">后合同名称</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap min-w-[150px]">后合同编码</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap min-w-[120px]">合同金额</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap min-w-[150px]">SAP凭证号</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap min-w-[150px]">财辅报账单号</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap min-w-[150px]">对方名称</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap min-w-[120px]">收付款金额</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap min-w-[100px]">税额</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap min-w-[120px]">收付款日期</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap min-w-[120px] sticky right-[280px] bg-[#f5f6f7] z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.05)]">过账日期</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap min-w-[140px] sticky right-[140px] bg-[#f5f6f7] z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.05)]">关联列账记录</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap min-w-[140px] sticky right-0 bg-[#f5f6f7] z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.05)]">操作</th>
              </tr>
            </thead>
            <tbody>
              {paymentData.map((item, index) => (
                <React.Fragment key={item.id}>
                  <tr className={index % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}>
                    <td className="px-4 py-3 whitespace-nowrap">{item.serialNo}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.projectName}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.projectCode}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.backContractName}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.backContractCode}</td>
                    <td className="px-4 py-3 whitespace-nowrap">¥{item.contractAmount.toLocaleString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.sapVoucherNo}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.financeReimbursementNo}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.counterpartyName}</td>
                    <td className="px-4 py-3 whitespace-nowrap">¥{item.paymentAmount.toLocaleString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap">¥{item.taxAmount.toLocaleString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.paymentDate}</td>
                    <td className={`px-4 py-3 whitespace-nowrap sticky right-[280px] z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.05)] ${index % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}>{item.postingDate}</td>
                    <td className={`px-4 py-3 whitespace-nowrap sticky right-[140px] z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.05)] ${index % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}>
                      <button
                        className="flex items-center gap-1 text-[#2e7cff] hover:underline"
                        onClick={() => toggleExpand(item.id)}
                      >
                        {item.associatedRecords.length}条
                        {item.expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap sticky right-0 z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.05)] ${index % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}>
                      <div className="flex gap-2">
                        <button 
                          className="text-[#2e7cff] hover:underline"
                          onClick={() => handleAssociate(item.id)}
                        >
                          关联
                        </button>
                        <button 
                          className="text-red-500 hover:underline"
                          onClick={() => handleDelete(item.id)}
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Nested Table */}
                  {item.expanded && item.associatedRecords.length > 0 && (
                    <tr>
                      <td colSpan={15} className="px-4 py-2 bg-[#f0f7ff]">
                        <div className="ml-8">
                          <table className="w-full text-sm min-w-max">
                            <thead className="bg-[#e6f2ff]">
                              <tr>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[150px]">后向合同名称</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[150px]">后合同编码</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[100px]">操作用户</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[100px]">报账人</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[150px]">报账单号</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[100px]">科目编码</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[120px]">成本要素名称</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[120px]">成本要素编码</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[120px]">借方金额</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[120px]">贷方金额</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[120px]">凭证编号</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[120px]">凭证日期</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[120px]">采购凭证号</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[100px]">物料号</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[80px]">数量</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[150px]">物料描述</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[100px]">利润中心</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[100px]">成本中心</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[140px]">本次付款金额</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[120px]">已付款金额</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[140px]">剩余未付款金额</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[120px]">关联日期</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[100px]">关联人</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[120px]">操作</th>
                              </tr>
                            </thead>
                            <tbody>
                              {item.associatedRecords.map((record) => (
                                <tr key={record.id} className="bg-white border-t">
                                  <td className="px-4 py-2 whitespace-nowrap">{record.backContractName}</td>
                                  <td className="px-4 py-2 whitespace-nowrap">{record.backContractCode}</td>
                                  <td className="px-4 py-2 whitespace-nowrap">{record.operatingUser}</td>
                                  <td className="px-4 py-2 whitespace-nowrap">{record.reimbursementPerson}</td>
                                  <td className="px-4 py-2 whitespace-nowrap">{record.reimbursementNo}</td>
                                  <td className="px-4 py-2 whitespace-nowrap">{record.subjectCode}</td>
                                  <td className="px-4 py-2 whitespace-nowrap">{record.costElementName}</td>
                                  <td className="px-4 py-2 whitespace-nowrap">{record.costElementCode}</td>
                                  <td className="px-4 py-2 whitespace-nowrap">¥{record.debitAmount.toLocaleString()}</td>
                                  <td className="px-4 py-2 whitespace-nowrap">¥{record.creditAmount.toLocaleString()}</td>
                                  <td className="px-4 py-2 whitespace-nowrap">{record.voucherNo}</td>
                                  <td className="px-4 py-2 whitespace-nowrap">{record.voucherDate}</td>
                                  <td className="px-4 py-2 whitespace-nowrap">{record.purchaseVoucherNo}</td>
                                  <td className="px-4 py-2 whitespace-nowrap">{record.materialNo}</td>
                                  <td className="px-4 py-2 whitespace-nowrap">{record.quantity}</td>
                                  <td className="px-4 py-2 whitespace-nowrap">{record.materialDesc}</td>
                                  <td className="px-4 py-2 whitespace-nowrap">{record.profitCenter}</td>
                                  <td className="px-4 py-2 whitespace-nowrap">{record.costCenter}</td>
                                  <td className="px-4 py-2 whitespace-nowrap">
                                    <Input 
                                      type="number" 
                                      value={record.currentPaymentAmount}
                                      className="w-32"
                                    />
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap">¥{record.paidAmount.toLocaleString()}</td>
                                  <td className="px-4 py-2 whitespace-nowrap">¥{record.remainingAmount.toLocaleString()}</td>
                                  <td className="px-4 py-2 whitespace-nowrap">{record.associateDate}</td>
                                  <td className="px-4 py-2 whitespace-nowrap">{record.associatePerson}</td>
                                  <td className="px-4 py-2 whitespace-nowrap">
                                    <div className="flex gap-2">
                                      <button className="text-[#2e7cff] hover:underline">编辑</button>
                                      <button 
                                        className="text-red-500 hover:underline"
                                        onClick={() => handleDeleteSubRecord(item.id, record.id)}
                                      >
                                        删除
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payment Dialog */}
      <AddPaymentDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />

      {/* Associate Dialog */}
      <AssociatePaymentDialog 
        open={showAssociateDialog}
        onOpenChange={setShowAssociateDialog}
      />
    </div>
  );
}