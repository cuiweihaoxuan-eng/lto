import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Printer, Download, FileEdit } from "lucide-react";
import { FinancialProgressTimeline } from "./FinancialProgressTimeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface ProgressRow {
  id: string;
  serialNo: number;
  type: string;
  contractCode: string;
  subject: string;
  amountTax: number;
  taxRate: number;
  amountNoTax: number;
  previousProgress: number;
  previousAmountTax: number;
  previousAmountNoTax: number;
  currentProgress: number;
  currentAmountTax: number;
  currentAmountNoTax: number;
  cumulativeProgress: number;
  cumulativeAmountTax: number;
  cumulativeAmountNoTax: number;
}

export function ProgressManagement() {
  const [activeTab, setActiveTab] = useState("income");

  // Mock data for income
  const incomeData: ProgressRow[] = [
    {
      id: "1",
      serialNo: 1,
      type: "收入",
      contractCode: "合同编码1",
      subject: "收入科目1",
      amountTax: 1000000,
      taxRate: 13,
      amountNoTax: 884955.75,
      previousProgress: 60,
      previousAmountTax: 600000,
      previousAmountNoTax: 530973.45,
      currentProgress: 40,
      currentAmountTax: 400000,
      currentAmountNoTax: 353982.3,
      cumulativeProgress: 100,
      cumulativeAmountTax: 1000000,
      cumulativeAmountNoTax: 884955.75
    },
    {
      id: "2",
      serialNo: 2,
      type: "收入",
      contractCode: "合同编码1",
      subject: "收入科目2",
      amountTax: 2000000,
      taxRate: 6,
      amountNoTax: 1886792.45,
      previousProgress: 60,
      previousAmountTax: 1200000,
      previousAmountNoTax: 1132075.47,
      currentProgress: 40,
      currentAmountTax: 800000,
      currentAmountNoTax: 754716.98,
      cumulativeProgress: 100,
      cumulativeAmountTax: 2000000,
      cumulativeAmountNoTax: 1886792.45
    }
  ];

  // Mock data for expense
  const expenseData: ProgressRow[] = [
    {
      id: "3",
      serialNo: 1,
      type: "支出",
      contractCode: "合同编码2",
      subject: "支出科目1",
      amountTax: 1000000,
      taxRate: 13,
      amountNoTax: 884955.75,
      previousProgress: 60,
      previousAmountTax: 600000,
      previousAmountNoTax: 530973.45,
      currentProgress: 40,
      currentAmountTax: 400000,
      currentAmountNoTax: 353982.3,
      cumulativeProgress: 100,
      cumulativeAmountTax: 1000000,
      cumulativeAmountNoTax: 884955.75
    }
  ];

  // Mock data for receipt
  const receiptData: ProgressRow[] = [
    {
      id: "4",
      serialNo: 1,
      type: "收款",
      contractCode: "合同编码3",
      subject: "收款科目1",
      amountTax: 1000000,
      taxRate: 13,
      amountNoTax: 884955.75,
      previousProgress: 60,
      previousAmountTax: 600000,
      previousAmountNoTax: 530973.45,
      currentProgress: 40,
      currentAmountTax: 400000,
      currentAmountNoTax: 353982.3,
      cumulativeProgress: 100,
      cumulativeAmountTax: 1000000,
      cumulativeAmountNoTax: 884955.75
    }
  ];

  // Mock data for payment
  const paymentData: ProgressRow[] = [
    {
      id: "5",
      serialNo: 1,
      type: "付款",
      contractCode: "合同编码4",
      subject: "付款科目1",
      amountTax: 1000000,
      taxRate: 13,
      amountNoTax: 884955.75,
      previousProgress: 60,
      previousAmountTax: 600000,
      previousAmountNoTax: 530973.45,
      currentProgress: 40,
      currentAmountTax: 400000,
      currentAmountNoTax: 353982.3,
      cumulativeProgress: 100,
      cumulativeAmountTax: 1000000,
      cumulativeAmountNoTax: 884955.75
    }
  ];

  const calculateTotals = (data: ProgressRow[]) => {
    return data.reduce((acc, item) => ({
      amountTax: acc.amountTax + item.amountTax,
      amountNoTax: acc.amountNoTax + item.amountNoTax,
      previousAmountTax: acc.previousAmountTax + item.previousAmountTax,
      previousAmountNoTax: acc.previousAmountNoTax + item.previousAmountNoTax,
      currentAmountTax: acc.currentAmountTax + item.currentAmountTax,
      currentAmountNoTax: acc.currentAmountNoTax + item.currentAmountNoTax,
      cumulativeAmountTax: acc.cumulativeAmountTax + item.cumulativeAmountTax,
      cumulativeAmountNoTax: acc.cumulativeAmountNoTax + item.cumulativeAmountNoTax,
    }), {
      amountTax: 0,
      amountNoTax: 0,
      previousAmountTax: 0,
      previousAmountNoTax: 0,
      currentAmountTax: 0,
      currentAmountNoTax: 0,
      cumulativeAmountTax: 0,
      cumulativeAmountNoTax: 0,
    });
  };

  const renderProgressTable = (data: ProgressRow[], tabType: string) => {
    const totals = calculateTotals(data);

    return (
      <div className="space-y-4">
        {/* Summary Section */}
        <div className="bg-[#f7f8fa] p-4 rounded space-y-3">
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div className="flex">
              <span className="text-gray-600 w-40">所属会计期：</span>
              <span className="font-medium">2023年9月</span>
            </div>
            <div className="flex">
              <span className="text-gray-600 w-48">合同总金额（含税、元）：</span>
              <span className="font-medium">¥4,000,000.00</span>
            </div>
            
            <div className="flex">
              <span className="text-gray-600 w-40">ICT项目编号：</span>
              <span className="font-medium">协议级项目编号，XYJ开头</span>
            </div>
            <div className="flex">
              <span className="text-gray-600 w-48">ICT项目名称：</span>
              <span className="font-medium">协议级项目名称</span>
            </div>
            
            <div className="flex">
              <span className="text-gray-600 w-40">合同编号：</span>
              <span className="font-medium">合同编号</span>
            </div>
            <div className="flex">
              <span className="text-gray-600 w-48">合同名称：</span>
              <span className="font-medium">合同名称</span>
            </div>
            
            <div className="flex">
              <span className="text-gray-600 w-40">合同甲方：</span>
              <span className="font-medium">合同甲方主体名称</span>
            </div>
            <div className="flex">
              <span className="text-gray-600 w-48">合同乙方：</span>
              <span className="font-medium">合同乙方主体名称</span>
            </div>
          </div>
        </div>

        {/* Progress Table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-max">
              <thead className="bg-[#f5f6f7]">
                <tr>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap border-r">序号</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap border-r">类型</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap border-r">合同编码</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap border-r">科目</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap border-r">A.金额（含税）</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap border-r">B.增值税税率（%）</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap border-r">C.金额（不含税）<br/>A/(1+B)</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap border-r">D.前期已确认<br/>进度（%）</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap border-r">E.前期已确认<br/>金额（含税）<br/>A*D</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap border-r">F.前期已确认<br/>金额（不含税）<br/>C*D</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap border-r bg-yellow-50">G.本期确认<br/>进度（%）</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap border-r bg-yellow-50">H.本期确认<br/>金额（含税）<br/>A*G</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap border-r bg-yellow-50">I.本期确认<br/>金额（不含税）<br/>C*G</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap border-r">J.累计确认<br/>进度（%）<br/>D+G</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap border-r">K.累计确认<br/>金额（含税）<br/>A*J=E+H</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap">L.累计确认<br/>金额（不含税）<br/>C*J=F+I</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}>
                    <td className="px-3 py-3 whitespace-nowrap border-r">{item.serialNo}</td>
                    <td className="px-3 py-3 whitespace-nowrap border-r">{item.type}</td>
                    <td className="px-3 py-3 whitespace-nowrap border-r">{item.contractCode}</td>
                    <td className="px-3 py-3 whitespace-nowrap border-r">{item.subject}</td>
                    <td className="px-3 py-3 whitespace-nowrap border-r">
                      ¥{item.amountTax.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap border-r">{item.taxRate}%</td>
                    <td className="px-3 py-3 whitespace-nowrap border-r">
                      ¥{item.amountNoTax.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap border-r">{item.previousProgress}%</td>
                    <td className="px-3 py-3 whitespace-nowrap border-r">
                      ¥{item.previousAmountTax.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap border-r">
                      ¥{item.previousAmountNoTax.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap border-r bg-yellow-50">{item.currentProgress}%</td>
                    <td className="px-3 py-3 whitespace-nowrap border-r bg-yellow-50">
                      ¥{item.currentAmountTax.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap border-r bg-yellow-50">
                      ¥{item.currentAmountNoTax.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap border-r">{item.cumulativeProgress}%</td>
                    <td className="px-3 py-3 whitespace-nowrap border-r">
                      ¥{item.cumulativeAmountTax.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      ¥{item.cumulativeAmountNoTax.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
                
                {/* Subtotal Row */}
                <tr className="bg-[#f5f6f7] font-medium">
                  <td colSpan={4} className="px-3 py-3 whitespace-nowrap border-r">小计</td>
                  <td className="px-3 py-3 whitespace-nowrap border-r">
                    ¥{totals.amountTax.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap border-r"></td>
                  <td className="px-3 py-3 whitespace-nowrap border-r">
                    ¥{totals.amountNoTax.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap border-r"></td>
                  <td className="px-3 py-3 whitespace-nowrap border-r">
                    ¥{totals.previousAmountTax.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap border-r">
                    ¥{totals.previousAmountNoTax.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap border-r bg-yellow-50"></td>
                  <td className="px-3 py-3 whitespace-nowrap border-r bg-yellow-50">
                    ¥{totals.currentAmountTax.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap border-r bg-yellow-50">
                    ¥{totals.currentAmountNoTax.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap border-r"></td>
                  <td className="px-3 py-3 whitespace-nowrap border-r">
                    ¥{totals.cumulativeAmountTax.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    ¥{totals.cumulativeAmountNoTax.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Signature Section */}
        <div className="bg-[#f7f8fa] p-4 rounded space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">甲方单位签字人（签字）：</span>
            </div>
            <div>
              <span className="text-gray-600">乙方单位签字人（签字）：</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">甲方单位（盖章）：</span>
            </div>
            <div>
              <span className="text-gray-600">乙方单位（盖章）：</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">日期：</span>
            </div>
            <div>
              <span className="text-gray-600">日期：</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full overflow-auto">
      <div className="border-2 border-gray-200 rounded-lg p-4 bg-white m-4">
        <div className="space-y-6">
          {/* Financial Progress Timeline */}
          <FinancialProgressTimeline />

          {/* Progress Tabs */}
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0">
                <TabsTrigger
                  value="income"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#2e7cff] rounded-none px-6 data-[state=active]:bg-transparent data-[state=active]:text-[#2e7cff]"
                >
                  收入进度
                </TabsTrigger>
                <TabsTrigger
                  value="expense"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#2e7cff] rounded-none px-6 data-[state=active]:bg-transparent data-[state=active]:text-[#2e7cff]"
                >
                  支出进度
                </TabsTrigger>
                <TabsTrigger
                  value="receipt"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#2e7cff] rounded-none px-6 data-[state=active]:bg-transparent data-[state=active]:text-[#2e7cff]"
                >
                  收款进度
                </TabsTrigger>
                <TabsTrigger
                  value="payment"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#2e7cff] rounded-none px-6 data-[state=active]:bg-transparent data-[state=active]:text-[#2e7cff]"
                >
                  付款进度
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="income" className="m-0">
                  {renderProgressTable(incomeData, "收入")}
                </TabsContent>

                <TabsContent value="expense" className="m-0">
                  {renderProgressTable(expenseData, "支出")}
                </TabsContent>

                <TabsContent value="receipt" className="m-0">
                  {renderProgressTable(receiptData, "收款")}
                </TabsContent>

                <TabsContent value="payment" className="m-0">
                  {renderProgressTable(paymentData, "付款")}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}