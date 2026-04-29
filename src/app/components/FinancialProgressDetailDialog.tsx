import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";

interface TimelineEvent {
  id: string;
  name: string;
  amount: number;
  date: string;
  progress: number;
  type: 'plan' | 'actual';
  details?: {
    description?: string;
    status?: string;
    relatedItems?: string[];
  };
}

interface DetailDialogProps {
  open: boolean;
  onClose: () => void;
  event: TimelineEvent | null;
  lineType: string;
}

export function FinancialProgressDetailDialog({ open, onClose, event, lineType }: DetailDialogProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && dialogRef.current) {
      const rect = dialogRef.current.getBoundingClientRect();
      setPosition({
        x: (window.innerWidth - rect.width) / 2,
        y: (window.innerHeight - rect.height) / 2
      });
    }
  }, [open]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.dialog-header')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  if (!open || !event) return null;

  // 确定详情类型
  const detailType = `${lineType}${event.type === 'plan' ? '计划' : ''}`;

  // Mock数据生成函数
  const getMockData = () => {
    if (lineType === '收入' && event.type === 'plan') {
      // 收入计划
      return [
        {
          contractCode: 'LC01H5287160000',
          contractName: '杭州市城区市政府采购服务',
          contractDept: '销售一部',
          contractCompany: '浙江分公司',
          contractHandler: '张三',
          contractTotal: 4000000,
          subProjectCode: 'SUB001',
          projectCode: 'ZJZ0250404080649',
          type: '主营业务',
          productItem: '软件服务',
          businessType: '项目实施',
          invoiceType: '增值税专用发票',
          taxRate: 13,
          unitPrice: 100000,
          quantity: 10,
          confirmAmountTax: 1000000,
          confirmAmountNoTax: 884955.75,
          frequency: 1,
          totalConfirmTax: 4000000,
          totalConfirmNoTax: 3539823,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          triggerSystem: 'CRM',
          planStatus: '执行中',
          summary: '按月确认收入',
          type2: '合同'
        },
        {
          contractCode: 'LC01H5287160000',
          contractName: '杭州市城区市政府采购服务',
          contractDept: '销售一部',
          contractCompany: '浙江分公司',
          contractHandler: '李四',
          contractTotal: 4000000,
          subProjectCode: 'SUB002',
          projectCode: 'ZJZ0250404080649',
          type: '主营业务',
          productItem: '技术支持',
          businessType: '服务支持',
          invoiceType: '增值税专用发票',
          taxRate: 6,
          unitPrice: 50000,
          quantity: 20,
          confirmAmountTax: 500000,
          confirmAmountNoTax: 471698.11,
          frequency: 1,
          totalConfirmTax: 2000000,
          totalConfirmNoTax: 1886792.45,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          triggerSystem: 'CRM',
          planStatus: '执行中',
          summary: '按月确认收入',
          type2: '合同'
        }
      ];
    } else if (lineType === '收入' && event.type === 'actual') {
      // 收入
      return [
        {
          projectCode: 'ZJZ0250404080649',
          projectName: '25年瓦洪县人民政府采购服务项目',
          forwardContract: '杭州市城区市政府采购服务',
          crmOrderContract: 'LC01H5287160000',
          accountYear: '2024',
          accountPeriod: '2024-01',
          productItemName: '软件服务',
          allRevenueItems: '软件服务、技术支持',
          confirmedAmount: 250000,
          confirmedAmountNoTax: 221238.94,
          allRevenueSales: '产品A、产品B',
          accountSubject: '6001-主营业务收入',
          businessType: '项目实施',
          companyCode: 'C001',
          profitCenter: 'PC001',
          profitCenterName: '销售利润中心',
          costCenter: 'CC001',
          costCenterName: '销售成本中心'
        }
      ];
    } else if (lineType === '支出' && event.type === 'plan') {
      // 支出计划
      return [
        {
          projectCode: 'ZJZ0250404080649',
          projectName: '25年瓦洪县人民政府采购服务项目',
          forwardContractCode: 'LC01H5287160000',
          forwardContractName: '杭州市城区市政府采购服务',
          economicItem: '设备采购',
          purpose: '项目实施设备',
          accountDate: '2024-03-15',
          taxRate: 13,
          amountNoTax: 283185.84,
          amountTax: 320000,
          taxAmount: 36814.16,
          contractParseDate: '2024-03-01',
          status: '已列账',
          summary: '采购服务器设备',
          supplierCode: 'SUP001',
          supplier: '华为技术有限公司',
          signDate: '2024-03-01',
          endDate: '2024-03-31',
          invoiceType: '增值税专用发票',
          calcMethod: '按实际',
          profitCenterCode: 'PC001',
          profitCenterName1: '销售利润中心',
          profitCenter: 'PC001',
          profitCenterName: '销售利润中心',
          costCenter1: 'CC001',
          costCenter: 'CC001',
          costCenterName: '销售成本中心',
          idcCenter: 'IDC-HZ-01',
          subProjectCode1: 'SUB001',
          subProjectCode2: 'SUB001',
          operationType: '新增',
          relatedTransaction: 'TXN001'
        }
      ];
    } else if (lineType === '支出' && event.type === 'actual') {
      // 支出
      return [
        {
          projectCode: 'ZJZ0250404080649',
          projectName: '25年瓦洪县人民政府采购服务项目',
          engineeringCode: 'ENG001',
          engineeringName: '核心系统建设',
          forwardContractCode: 'LC01H5287160000',
          forwardContractName: '杭州市城区市政府采购服务',
          backwardContractCode: 'BC001',
          backwardContractName: '设备采购合同',
          operator: '李四',
          reimbursePerson: '王五',
          reimburseNo: 'RB20240315001',
          subjectCode: '5001',
          costElementName: '设备费',
          costElementCode: 'CE001',
          debitAmount: 320000,
          creditAmount: 0,
          voucherNo: 'VC20240315001',
          voucherDate: '2024-03-15',
          purchaseVoucherNo: 'PV20240315001',
          materialNo: 'MAT001',
          quantity: 5,
          materialDesc: '服务器设备',
          profitCenter: 'PC001',
          profitCenterName: '销售利润中心',
          costCenter: 'CC001',
          costCenterName: '销售成本中心'
        }
      ];
    } else if (lineType === '收款' && event.type === 'plan') {
      // 收款计划
      return [
        {
          projectCode: 'ZJZ0250404080649',
          projectName: '25年瓦洪县人民政府采购服务项目',
          forwardContractCode: 'LC01H5287160000',
          forwardContractName: '杭州市城区市政府采购服务',
          totalReceivable: 4000000,
          expectedStartDate: '2024-02-01',
          periodAmount: 1000000,
          planStatus: '执行中',
          profitCenter: 'PC001',
          profitCenterName: '销售利润中心',
          costCenter: 'CC001',
          costCenterName: '销售成本中心'
        }
      ];
    } else if (lineType === '收款' && event.type === 'actual') {
      // 收款
      return [
        {
          projectCode: 'ZJZ0250404080649',
          projectName: '25年瓦洪县人民政府采购服务项目',
          forwardContractCode: 'LC01H5287160000',
          forwardContractName: '杭州市城区市政府采购服务',
          receiptAmount: 150000,
          receiptDate: '2024-02-10',
          bankSerial: '20240210001234567',
          claimPerson: '李四',
          claimPersonNo: 'EMP001',
          profitCenter: 'PC001',
          profitCenterName: '销售利润中心',
          costCenter: 'CC001',
          costCenterName: '销售成本中心'
        }
      ];
    } else if (lineType === '付款' && event.type === 'plan') {
      // 付款计划
      return [
        {
          projectCode: 'ZJZ0250404080649',
          projectName: '25年瓦洪县人民政府采购服务项目',
          backwardContractCode: 'BC001',
          backwardContractName: '设备采购合同',
          totalPayable: 320000,
          expectedStartDate: '2024-03-25',
          periodAmount: 160000,
          planStatus: '执行中',
          profitCenter: 'PC001',
          profitCenterName: '销售利润中心',
          costCenter: 'CC001',
          costCenterName: '销售成本中心'
        }
      ];
    } else if (lineType === '付款' && event.type === 'actual') {
      // 付款
      return [
        {
          projectCode: 'ZJZ0250404080649',
          projectName: '25年瓦洪县人民政府采购服务项目',
          contractCode: 'BC001',
          contractName: '设备采购合同',
          contractAmount: 320000,
          contractType: '采购合同',
          contractStatus: '执行中',
          sapVoucherNo: 'SAP20240401001',
          financeReimburseNo: 'FIN20240401001',
          counterpartyName: '华为技术有限公司',
          paymentMethod: '银行转账',
          paymentAmount: 85000,
          taxAmount: 9823.01,
          paymentDate: '2024-04-01',
          postingDate: '2024-04-02',
          debitCredit: '贷方',
          profitCenter: 'PC001'
        }
      ];
    }
    return [];
  };

  const mockData = getMockData();

  // 根据类型渲染表格
  const renderDetailTable = () => {
    if (lineType === '收入' && event.type === 'plan') {
      // 收入计划表格
      return (
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-[#f5f6f7] sticky top-0 z-10">
              <tr>
                <th className="px-2 py-2 text-left border whitespace-nowrap">合同编码</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">合同名称</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">合同签订部门</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">合同所在公司</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">合同承办人</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">合同总金额</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">子项目编码</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">项目编码</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">类型</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">产品收入项</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">业务类型</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">发票种类</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">税率</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">单价</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">数量</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">确认金额（含税）</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">确认金额（不含税）</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">频率（月）</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">确认总金额（含税）</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">确认总金额（不含税）</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">起始日期</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">终止日期</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">收入触发系统</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">计划状态</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">摘要</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">类型</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((row: any, idx: number) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}>
                  <td className="px-2 py-2 border">{row.contractCode}</td>
                  <td className="px-2 py-2 border">{row.contractName}</td>
                  <td className="px-2 py-2 border">{row.contractDept}</td>
                  <td className="px-2 py-2 border">{row.contractCompany}</td>
                  <td className="px-2 py-2 border">{row.contractHandler}</td>
                  <td className="px-2 py-2 border">¥{row.contractTotal.toLocaleString()}</td>
                  <td className="px-2 py-2 border">{row.subProjectCode}</td>
                  <td className="px-2 py-2 border">{row.projectCode}</td>
                  <td className="px-2 py-2 border">{row.type}</td>
                  <td className="px-2 py-2 border">{row.productItem}</td>
                  <td className="px-2 py-2 border">{row.businessType}</td>
                  <td className="px-2 py-2 border">{row.invoiceType}</td>
                  <td className="px-2 py-2 border">{row.taxRate}%</td>
                  <td className="px-2 py-2 border">¥{row.unitPrice.toLocaleString()}</td>
                  <td className="px-2 py-2 border">{row.quantity}</td>
                  <td className="px-2 py-2 border">¥{row.confirmAmountTax.toLocaleString()}</td>
                  <td className="px-2 py-2 border">¥{row.confirmAmountNoTax.toLocaleString()}</td>
                  <td className="px-2 py-2 border">{row.frequency}</td>
                  <td className="px-2 py-2 border">¥{row.totalConfirmTax.toLocaleString()}</td>
                  <td className="px-2 py-2 border">¥{row.totalConfirmNoTax.toLocaleString()}</td>
                  <td className="px-2 py-2 border">{row.startDate}</td>
                  <td className="px-2 py-2 border">{row.endDate}</td>
                  <td className="px-2 py-2 border">{row.triggerSystem}</td>
                  <td className="px-2 py-2 border">{row.planStatus}</td>
                  <td className="px-2 py-2 border">{row.summary}</td>
                  <td className="px-2 py-2 border">{row.type2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (lineType === '收入' && event.type === 'actual') {
      // 收入表格
      return (
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-[#f5f6f7] sticky top-0 z-10">
              <tr>
                <th className="px-2 py-2 text-left border whitespace-nowrap">项目编码</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">项目名称</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">前向合同名称</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">当月入收CRM订单编号关联的前向合同</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">会计年度</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">会计期间</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">产品收入项名称</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">全部已确认收入对应的收入项</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">已确认的收入金额</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">全部已确认收入金额（不含税）</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">全部已确认收入对应的销售品</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">会计科目</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">业务类型</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">公司代码</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">利润中心</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">利润中心名称</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">成本中心</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">成本中心名称</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((row: any, idx: number) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}>
                  <td className="px-2 py-2 border">{row.projectCode}</td>
                  <td className="px-2 py-2 border">{row.projectName}</td>
                  <td className="px-2 py-2 border">{row.forwardContract}</td>
                  <td className="px-2 py-2 border">{row.crmOrderContract}</td>
                  <td className="px-2 py-2 border">{row.accountYear}</td>
                  <td className="px-2 py-2 border">{row.accountPeriod}</td>
                  <td className="px-2 py-2 border">{row.productItemName}</td>
                  <td className="px-2 py-2 border">{row.allRevenueItems}</td>
                  <td className="px-2 py-2 border">¥{row.confirmedAmount.toLocaleString()}</td>
                  <td className="px-2 py-2 border">¥{row.confirmedAmountNoTax.toLocaleString()}</td>
                  <td className="px-2 py-2 border">{row.allRevenueSales}</td>
                  <td className="px-2 py-2 border">{row.accountSubject}</td>
                  <td className="px-2 py-2 border">{row.businessType}</td>
                  <td className="px-2 py-2 border">{row.companyCode}</td>
                  <td className="px-2 py-2 border">{row.profitCenter}</td>
                  <td className="px-2 py-2 border">{row.profitCenterName}</td>
                  <td className="px-2 py-2 border">{row.costCenter}</td>
                  <td className="px-2 py-2 border">{row.costCenterName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (lineType === '支出' && event.type === 'plan') {
      // 支出计划表格 - 字段太多，使用滚动容器
      return (
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-[#f5f6f7] sticky top-0 z-10">
              <tr>
                <th className="px-2 py-2 text-left border whitespace-nowrap">项目编码</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">项目名称</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">前向合同编号</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">前向合同名称</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">经济事项</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">用途</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">列账日期</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">税率</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">列账金额(不含税)</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">列账金额(含税)</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">列账税额</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">合同解析日期</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">状态</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">合约交易摘要</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">供应商编码</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">供应商</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">签约日期</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">结束日期</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">票据类型</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">计算方式</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">利润中心编码</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">利润中心名</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">利润中心</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">利润中心名称</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">成本中心</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">成本中心</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">成本中心名称</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">IDC数据中心</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">子项目编码</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">子项目编码</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">操作类型</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">关联交易</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((row: any, idx: number) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}>
                  <td className="px-2 py-2 border">{row.projectCode}</td>
                  <td className="px-2 py-2 border">{row.projectName}</td>
                  <td className="px-2 py-2 border">{row.forwardContractCode}</td>
                  <td className="px-2 py-2 border">{row.forwardContractName}</td>
                  <td className="px-2 py-2 border">{row.economicItem}</td>
                  <td className="px-2 py-2 border">{row.purpose}</td>
                  <td className="px-2 py-2 border">{row.accountDate}</td>
                  <td className="px-2 py-2 border">{row.taxRate}%</td>
                  <td className="px-2 py-2 border">¥{row.amountNoTax.toLocaleString()}</td>
                  <td className="px-2 py-2 border">¥{row.amountTax.toLocaleString()}</td>
                  <td className="px-2 py-2 border">¥{row.taxAmount.toLocaleString()}</td>
                  <td className="px-2 py-2 border">{row.contractParseDate}</td>
                  <td className="px-2 py-2 border">{row.status}</td>
                  <td className="px-2 py-2 border">{row.summary}</td>
                  <td className="px-2 py-2 border">{row.supplierCode}</td>
                  <td className="px-2 py-2 border">{row.supplier}</td>
                  <td className="px-2 py-2 border">{row.signDate}</td>
                  <td className="px-2 py-2 border">{row.endDate}</td>
                  <td className="px-2 py-2 border">{row.invoiceType}</td>
                  <td className="px-2 py-2 border">{row.calcMethod}</td>
                  <td className="px-2 py-2 border">{row.profitCenterCode}</td>
                  <td className="px-2 py-2 border">{row.profitCenterName1}</td>
                  <td className="px-2 py-2 border">{row.profitCenter}</td>
                  <td className="px-2 py-2 border">{row.profitCenterName}</td>
                  <td className="px-2 py-2 border">{row.costCenter1}</td>
                  <td className="px-2 py-2 border">{row.costCenter}</td>
                  <td className="px-2 py-2 border">{row.costCenterName}</td>
                  <td className="px-2 py-2 border">{row.idcCenter}</td>
                  <td className="px-2 py-2 border">{row.subProjectCode1}</td>
                  <td className="px-2 py-2 border">{row.subProjectCode2}</td>
                  <td className="px-2 py-2 border">{row.operationType}</td>
                  <td className="px-2 py-2 border">{row.relatedTransaction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (lineType === '支出' && event.type === 'actual') {
      // 支出表格
      return (
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-[#f5f6f7] sticky top-0 z-10">
              <tr>
                <th className="px-2 py-2 text-left border whitespace-nowrap">项目编码</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">项目名称</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">工程编号（子项目编码）</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">协议及工程名称（子项目名称）</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">前向合同编号</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">前向合同名称</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">后向合同编码</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">后向合同名称</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">操作用户</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">报账人姓名</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">报账单号</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">科目编码</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">成本要素名称</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">成本要素（编码）</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">借方金额</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">贷方金额</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">凭证编号</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">凭证日期</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">采购凭证号</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">物料号</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">数量</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">物料描述</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">利润中心</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">利润中心名称</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">成本中心</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">成本中心名称</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((row: any, idx: number) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}>
                  <td className="px-2 py-2 border">{row.projectCode}</td>
                  <td className="px-2 py-2 border">{row.projectName}</td>
                  <td className="px-2 py-2 border">{row.engineeringCode}</td>
                  <td className="px-2 py-2 border">{row.engineeringName}</td>
                  <td className="px-2 py-2 border">{row.forwardContractCode}</td>
                  <td className="px-2 py-2 border">{row.forwardContractName}</td>
                  <td className="px-2 py-2 border">{row.backwardContractCode}</td>
                  <td className="px-2 py-2 border">{row.backwardContractName}</td>
                  <td className="px-2 py-2 border">{row.operator}</td>
                  <td className="px-2 py-2 border">{row.reimbursePerson}</td>
                  <td className="px-2 py-2 border">{row.reimburseNo}</td>
                  <td className="px-2 py-2 border">{row.subjectCode}</td>
                  <td className="px-2 py-2 border">{row.costElementName}</td>
                  <td className="px-2 py-2 border">{row.costElementCode}</td>
                  <td className="px-2 py-2 border">¥{row.debitAmount.toLocaleString()}</td>
                  <td className="px-2 py-2 border">¥{row.creditAmount.toLocaleString()}</td>
                  <td className="px-2 py-2 border">{row.voucherNo}</td>
                  <td className="px-2 py-2 border">{row.voucherDate}</td>
                  <td className="px-2 py-2 border">{row.purchaseVoucherNo}</td>
                  <td className="px-2 py-2 border">{row.materialNo}</td>
                  <td className="px-2 py-2 border">{row.quantity}</td>
                  <td className="px-2 py-2 border">{row.materialDesc}</td>
                  <td className="px-2 py-2 border">{row.profitCenter}</td>
                  <td className="px-2 py-2 border">{row.profitCenterName}</td>
                  <td className="px-2 py-2 border">{row.costCenter}</td>
                  <td className="px-2 py-2 border">{row.costCenterName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (lineType === '收款' && event.type === 'plan') {
      // 收款计划表格
      return (
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-[#f5f6f7] sticky top-0 z-10">
              <tr>
                <th className="px-2 py-2 text-left border whitespace-nowrap">项目编码</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">项目名称</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">前向合同编号</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">前向合同名称</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">需收款总金额</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">预计收款起始日期</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">每期金额</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">计划状态</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">利润中心</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">利润中心名称</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">成本中心</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">成本中心名称</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((row: any, idx: number) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}>
                  <td className="px-2 py-2 border">{row.projectCode}</td>
                  <td className="px-2 py-2 border">{row.projectName}</td>
                  <td className="px-2 py-2 border">{row.forwardContractCode}</td>
                  <td className="px-2 py-2 border">{row.forwardContractName}</td>
                  <td className="px-2 py-2 border">¥{row.totalReceivable.toLocaleString()}</td>
                  <td className="px-2 py-2 border">{row.expectedStartDate}</td>
                  <td className="px-2 py-2 border">¥{row.periodAmount.toLocaleString()}</td>
                  <td className="px-2 py-2 border">{row.planStatus}</td>
                  <td className="px-2 py-2 border">{row.profitCenter}</td>
                  <td className="px-2 py-2 border">{row.profitCenterName}</td>
                  <td className="px-2 py-2 border">{row.costCenter}</td>
                  <td className="px-2 py-2 border">{row.costCenterName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (lineType === '收款' && event.type === 'actual') {
      // 收款表格
      return (
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-[#f5f6f7] sticky top-0 z-10">
              <tr>
                <th className="px-2 py-2 text-left border whitespace-nowrap">项目编码</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">项目名称</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">前向合同编号</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">前向合同名称</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">收款金额</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">收款日期</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">银行流水号</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">认领人</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">认领人号码</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">利润中心</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">利润中心名称</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">成本中心</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">成本中心名称</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((row: any, idx: number) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}>
                  <td className="px-2 py-2 border">{row.projectCode}</td>
                  <td className="px-2 py-2 border">{row.projectName}</td>
                  <td className="px-2 py-2 border">{row.forwardContractCode}</td>
                  <td className="px-2 py-2 border">{row.forwardContractName}</td>
                  <td className="px-2 py-2 border">¥{row.receiptAmount.toLocaleString()}</td>
                  <td className="px-2 py-2 border">{row.receiptDate}</td>
                  <td className="px-2 py-2 border">{row.bankSerial}</td>
                  <td className="px-2 py-2 border">{row.claimPerson}</td>
                  <td className="px-2 py-2 border">{row.claimPersonNo}</td>
                  <td className="px-2 py-2 border">{row.profitCenter}</td>
                  <td className="px-2 py-2 border">{row.profitCenterName}</td>
                  <td className="px-2 py-2 border">{row.costCenter}</td>
                  <td className="px-2 py-2 border">{row.costCenterName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (lineType === '付款' && event.type === 'plan') {
      // 付款计划表格
      return (
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-[#f5f6f7] sticky top-0 z-10">
              <tr>
                <th className="px-2 py-2 text-left border whitespace-nowrap">项目编码</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">项目名称</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">后向合同编号</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">后向合同名称</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">需付款总金额</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">预计付款起始日期</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">每期金额</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">计划状态</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">利润中心</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">利润中心名称</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">成本中心</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">成本中心名称</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((row: any, idx: number) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}>
                  <td className="px-2 py-2 border">{row.projectCode}</td>
                  <td className="px-2 py-2 border">{row.projectName}</td>
                  <td className="px-2 py-2 border">{row.backwardContractCode}</td>
                  <td className="px-2 py-2 border">{row.backwardContractName}</td>
                  <td className="px-2 py-2 border">¥{row.totalPayable.toLocaleString()}</td>
                  <td className="px-2 py-2 border">{row.expectedStartDate}</td>
                  <td className="px-2 py-2 border">¥{row.periodAmount.toLocaleString()}</td>
                  <td className="px-2 py-2 border">{row.planStatus}</td>
                  <td className="px-2 py-2 border">{row.profitCenter}</td>
                  <td className="px-2 py-2 border">{row.profitCenterName}</td>
                  <td className="px-2 py-2 border">{row.costCenter}</td>
                  <td className="px-2 py-2 border">{row.costCenterName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (lineType === '付款' && event.type === 'actual') {
      // 付款表格
      return (
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-[#f5f6f7] sticky top-0 z-10">
              <tr>
                <th className="px-2 py-2 text-left border whitespace-nowrap">项目编码</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">项目名称</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">合同编号</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">合同名称</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">合同金额</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">合同类型</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">合同状态</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">sap凭证号</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">财辅报账单号</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">对方名称</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">收付款方式</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">收付款金额</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">税额</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">收付款日期</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">过账日期</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">借贷方</th>
                <th className="px-2 py-2 text-left border whitespace-nowrap">利润中心</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((row: any, idx: number) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}>
                  <td className="px-2 py-2 border">{row.projectCode}</td>
                  <td className="px-2 py-2 border">{row.projectName}</td>
                  <td className="px-2 py-2 border">{row.contractCode}</td>
                  <td className="px-2 py-2 border">{row.contractName}</td>
                  <td className="px-2 py-2 border">¥{row.contractAmount.toLocaleString()}</td>
                  <td className="px-2 py-2 border">{row.contractType}</td>
                  <td className="px-2 py-2 border">{row.contractStatus}</td>
                  <td className="px-2 py-2 border">{row.sapVoucherNo}</td>
                  <td className="px-2 py-2 border">{row.financeReimburseNo}</td>
                  <td className="px-2 py-2 border">{row.counterpartyName}</td>
                  <td className="px-2 py-2 border">{row.paymentMethod}</td>
                  <td className="px-2 py-2 border">¥{row.paymentAmount.toLocaleString()}</td>
                  <td className="px-2 py-2 border">¥{row.taxAmount.toLocaleString()}</td>
                  <td className="px-2 py-2 border">{row.paymentDate}</td>
                  <td className="px-2 py-2 border">{row.postingDate}</td>
                  <td className="px-2 py-2 border">{row.debitCredit}</td>
                  <td className="px-2 py-2 border">{row.profitCenter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div 
        ref={dialogRef}
        className="bg-white rounded-lg shadow-xl max-w-[90vw] w-full cursor-move"
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="dialog-header px-6 py-4 border-b flex items-center justify-between cursor-move">
          <h3 className="font-medium">{detailType} - 详细信息</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-3 pb-4 border-b">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">类型:</span>
                <span className="font-medium">{event.type === 'plan' ? '计划' : '实际'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">细项名称:</span>
                <span className="font-medium">{event.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">金额:</span>
                <span className="font-medium text-lg">¥{event.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">时间:</span>
                <span className="font-medium">{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">进度比例:</span>
                <span className="font-medium">{event.progress}% 已完成</span>
              </div>
            </div>
          </div>
          
          {/* 明细表格 */}
          {renderDetailTable()}
        </div>
        <div className="px-6 py-4 border-t flex justify-end">
          <Button onClick={onClose} variant="outline">关闭</Button>
        </div>
      </div>
    </div>
  );
}
