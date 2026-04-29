import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Checkbox } from "./ui/checkbox";
import { ChevronDown, ChevronUp, Upload, Trash2, Link, FileText } from "lucide-react";
import { AddReceiptDialog } from "./AddReceiptDialog";
import { AssociateReceiptDialog } from "./AssociateReceiptDialog";

interface ReceiptRecord {
  id: string;
  contractCode: string;
  accountPeriod: string;
  productItem: string;
  productItemCode: string;
  listedAmount: number;
  currentReceiptAmount: number;
  receivedAmount: number;
  remainingAmount: number;
  associateDate: string;
  associatePerson: string;
}

interface ReceiptData {
  id: string;
  serialNo: number;
  projectCode: string;
  projectName: string;
  contractCode: string;
  contractName: string;
  bankSerial: string;
  claimAmount: number;
  claimDate: string;
  fundPurpose: '销账' | '预存款';
  claimPerson: string;
  claimPersonCode: string;
  profitCenter: string;
  profitCenterName: string;
  costCenter: string;
  costCenterName: string;
  associatedRecords: ReceiptRecord[];
  expanded: boolean;
}

export function ForwardReceiptConfirmation() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAssociateDialog, setShowAssociateDialog] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  
  const [receiptData, setReceiptData] = useState<ReceiptData[]>([
    {
      id: "1",
      serialNo: 1,
      projectCode: "ZJZ0250404080649",
      projectName: "25年瓦洪县人民政府采购服务项目",
      contractCode: "LC01H5287160000",
      contractName: "杭州市城区市政府采购服务",
      bankSerial: "20240115001234567",
      claimAmount: 154602,
      claimDate: "2024-01-15 10:30:00",
      fundPurpose: '销账',
      claimPerson: "李四",
      claimPersonCode: "LS001",
      profitCenter: "PC001",
      profitCenterName: "利润中心1",
      costCenter: "CC001",
      costCenterName: "成本中心1",
      associatedRecords: [
        {
          id: "1-1",
          contractCode: "LC01H5287160000",
          accountPeriod: "2024-01",
          productItem: "软件服务",
          productItemCode: "PROD001",
          listedAmount: 154602,
          currentReceiptAmount: 154602,
          receivedAmount: 154602,
          remainingAmount: 0,
          associateDate: "2024-01-15",
          associatePerson: "王五"
        }
      ],
      expanded: false
    },
    {
      id: "2",
      serialNo: 2,
      projectCode: "ZJZ0250404080649",
      projectName: "25年瓦洪县人民政府采购服务项目",
      contractCode: "LC01H5287160000",
      contractName: "杭州市城区市政府采购服务",
      bankSerial: "20240120001234568",
      claimAmount: 87401,
      claimDate: "2024-01-20 14:20:00",
      fundPurpose: '预存款',
      claimPerson: "张三",
      claimPersonCode: "ZS001",
      profitCenter: "PC002",
      profitCenterName: "利润中心2",
      costCenter: "CC002",
      costCenterName: "成本中心2",
      associatedRecords: [],
      expanded: false
    }
  ]);

  const toggleExpand = (id: string) => {
    setReceiptData(receiptData.map(item => 
      item.id === id ? { ...item, expanded: !item.expanded } : item
    ));
  };

  const handleAssociate = (id: string) => {
    setSelectedRecordId(id);
    setShowAssociateDialog(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这条记录吗？")) {
      setReceiptData(receiptData.filter(item => item.id !== id));
    }
  };

  const handleDeleteSubRecord = (parentId: string, recordId: string) => {
    if (confirm("确定要删除这条关联记录吗？")) {
      setReceiptData(receiptData.map(item => {
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
            <div className="text-gray-600 text-sm mb-1">应收账款金额(万元)</div>
            <div className="font-medium text-lg text-blue-600">200.00</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm mb-1">项目累计确认收款金额(万元)</div>
            <div className="font-medium text-lg text-green-600">123.46</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm mb-1">项目剩余未收款金额(万元)</div>
            <div className="font-medium text-lg text-orange-600">122.22</div>
          </div>
        </div>
        
        <div className="border-t pt-3 space-y-2">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-gray-600 text-sm mb-1">合同1-LC01H5287160000总金额(万元)</div>
              <div className="font-medium text-lg">150.00</div>
            </div>
            <div>
              <div className="text-gray-600 text-sm mb-1">合同1-应收账款金额(万元)</div>
              <div className="font-medium text-lg text-blue-600">120.00</div>
            </div>
            <div>
              <div className="text-gray-600 text-sm mb-1">合同1-累计确认收款金额(万元)</div>
              <div className="font-medium text-lg text-green-600">80.00</div>
            </div>
            <div>
              <div className="text-gray-600 text-sm mb-1">合同1-剩余未收款金额(万元)</div>
              <div className="font-medium text-lg text-orange-600">70.00</div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-gray-600 text-sm mb-1">合同2-LC02H5287160001总金额(万元)</div>
              <div className="font-medium text-lg">95.68</div>
            </div>
            <div>
              <div className="text-gray-600 text-sm mb-1">合同2-应收账款金额(万元)</div>
              <div className="font-medium text-lg text-blue-600">80.00</div>
            </div>
            <div>
              <div className="text-gray-600 text-sm mb-1">合同2-累计确认收款金额(万元)</div>
              <div className="font-medium text-lg text-green-600">43.46</div>
            </div>
            <div>
              <div className="text-gray-600 text-sm mb-1">合同2-剩余未收款金额(万元)</div>
              <div className="font-medium text-lg text-orange-600">52.22</div>
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
          新增收款确认
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-max">
            <thead className="bg-[#f5f6f7]">
              <tr>
                <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap border-r">序号</th>
                <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap border-r">项目编码</th>
                <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap border-r">项目名称</th>
                <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap border-r">前向合同编号</th>
                <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap border-r">前向合同名称</th>
                <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap border-r">银行流水号</th>
                <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap border-r">收款认领金额</th>
                <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap border-r">认领日期</th>
                <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap border-r">资金用途（销账/预存款）</th>
                <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap border-r">认领人</th>
                <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap border-r">认领人号码</th>
                <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap border-r">利润中心</th>
                <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap border-r">利润中心名称</th>
                <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap border-r">成本中心</th>
                <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap border-r">成本中心名称</th>
                <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap border-r sticky right-[140px] bg-[#f5f6f7] z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.05)]">关联确收记录</th>
                <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap sticky right-0 bg-[#f5f6f7] z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.05)]">操作</th>
              </tr>
            </thead>
            <tbody>
              {receiptData.map((item, index) => (
                <React.Fragment key={item.id}>
                  <tr className={index % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}>
                    <td className="px-3 py-3 whitespace-nowrap border-r">{item.serialNo}</td>
                    <td className="px-3 py-3 whitespace-nowrap border-r">{item.projectCode}</td>
                    <td className="px-3 py-3 whitespace-nowrap border-r">{item.projectName}</td>
                    <td className="px-3 py-3 whitespace-nowrap border-r">{item.contractCode}</td>
                    <td className="px-3 py-3 whitespace-nowrap border-r">{item.contractName}</td>
                    <td className="px-3 py-3 whitespace-nowrap border-r">{item.bankSerial}</td>
                    <td className="px-3 py-3 whitespace-nowrap border-r">¥{item.claimAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
                    <td className="px-3 py-3 whitespace-nowrap border-r">{item.claimDate}</td>
                    <td className="px-3 py-3 whitespace-nowrap border-r">
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.fundPurpose === '销账' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {item.fundPurpose}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap border-r">{item.claimPerson}</td>
                    <td className="px-3 py-3 whitespace-nowrap border-r">{item.claimPersonCode}</td>
                    <td className="px-3 py-3 whitespace-nowrap border-r">{item.profitCenter}</td>
                    <td className="px-3 py-3 whitespace-nowrap border-r">{item.profitCenterName}</td>
                    <td className="px-3 py-3 whitespace-nowrap border-r">{item.costCenter}</td>
                    <td className="px-3 py-3 whitespace-nowrap border-r">{item.costCenterName}</td>
                    <td className={`px-3 py-3 whitespace-nowrap border-r sticky right-[140px] z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.05)] ${index % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}>
                      <button
                        className="flex items-center gap-1 text-[#2e7cff] hover:underline"
                        onClick={() => toggleExpand(item.id)}
                      >
                        {item.associatedRecords.length}条
                        {item.expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className={`px-3 py-3 whitespace-nowrap sticky right-0 z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.05)] ${index % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}>
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
                      <td colSpan={19} className="px-4 py-2 bg-[#f0f7ff]">
                        <div className="ml-8">
                          <table className="w-full text-sm min-w-max">
                            <thead className="bg-[#e6f2ff]">
                              <tr>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[150px]">合同编码</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[100px]">账期</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[120px]">产品收入项</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[150px]">产品收入项编码</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[140px]">列收金额（含税）</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[140px]">本次收款金额</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[120px]">已收款金额</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[140px]">剩余未收款金额</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[120px]">关联日期</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[100px]">关联人</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-600 whitespace-nowrap min-w-[120px]">操作</th>
                              </tr>
                            </thead>
                            <tbody>
                              {item.associatedRecords.map((record) => (
                                <tr key={record.id} className="bg-white border-t">
                                  <td className="px-4 py-2 whitespace-nowrap">{record.contractCode}</td>
                                  <td className="px-4 py-2 whitespace-nowrap">{record.accountPeriod}</td>
                                  <td className="px-4 py-2 whitespace-nowrap">{record.productItem}</td>
                                  <td className="px-4 py-2 whitespace-nowrap">{record.productItemCode}</td>
                                  <td className="px-4 py-2 whitespace-nowrap">¥{record.listedAmount.toLocaleString()}</td>
                                  <td className="px-4 py-2 whitespace-nowrap">
                                    <Input 
                                      type="number" 
                                      value={record.currentReceiptAmount}
                                      className="w-32"
                                    />
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap">¥{record.receivedAmount.toLocaleString()}</td>
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

      {/* Add Receipt Dialog */}
      <AddReceiptDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />

      {/* Associate Dialog */}
      <AssociateReceiptDialog 
        open={showAssociateDialog}
        onOpenChange={setShowAssociateDialog}
      />
    </div>
  );
}