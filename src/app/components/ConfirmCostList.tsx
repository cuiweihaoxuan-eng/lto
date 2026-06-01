import React, { useState, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { RotateCcw, Upload, Download, Search } from "lucide-react";

// CSV 表格列定义
interface CostItem {
  companyCode: string;
  fiscalYear: string;
  lineItem: string;
  profitCenter: string;
  postingDate: string;
  documentNumber: string;
  customer: string;
  supplier: string;
  text: string;
  account: string;
  costCenter: string;
  referenceCode1: string;
  debitCreditFlag: string;
  localCurrencyAmount: string;
  expenseReportNumber: string;
  yearMonth: string;
  clearingDocument: string;
  businessScope: string;
  documentType: string;
  documentDate: string;
  postingCode: string;
  economicItem: string;
  functionScope: string;
  wbsElement: string;
  wbsDescription: string;
  purchaseDocument: string;
  referenceCode3: string;
  businessType: string;
  projectCode: string;
  backwardContractCode: string;
  supplierName: string;
  category1: string;
  category2: string;
  category3: string;
  uniqueCode: string;
}

// CSV 字段与中文表头映射
const columnDefs: { key: keyof CostItem; label: string; width?: number }[] = [
  { key: "companyCode", label: "公司代码", width: 80 },
  { key: "fiscalYear", label: "财年", width: 60 },
  { key: "lineItem", label: "行项目", width: 60 },
  { key: "profitCenter", label: "利润中心", width: 100 },
  { key: "postingDate", label: "过账日期", width: 100 },
  { key: "documentNumber", label: "凭证编号", width: 120 },
  { key: "customer", label: "客户", width: 100 },
  { key: "supplier", label: "供应商", width: 100 },
  { key: "text", label: "文本", width: 200 },
  { key: "account", label: "科目", width: 100 },
  { key: "costCenter", label: "成本中心", width: 100 },
  { key: "referenceCode1", label: "参考码", width: 130 },
  { key: "debitCreditFlag", label: "借/贷标识", width: 80 },
  { key: "localCurrencyAmount", label: "本币金额", width: 120 },
  { key: "expenseReportNumber", label: "报账单号", width: 130 },
  { key: "yearMonth", label: "年度/月份", width: 100 },
  { key: "clearingDocument", label: "清帐凭证", width: 100 },
  { key: "businessScope", label: "业务范围", width: 100 },
  { key: "documentType", label: "凭证类型", width: 80 },
  { key: "documentDate", label: "凭证日期", width: 100 },
  { key: "postingCode", label: "记帐代码", width: 80 },
  { key: "economicItem", label: "经济事项", width: 100 },
  { key: "functionScope", label: "功能范围", width: 80 },
  { key: "wbsElement", label: "WBS要素", width: 130 },
  { key: "wbsDescription", label: "WBS描述", width: 150 },
  { key: "purchaseDocument", label: "采购凭证", width: 100 },
  { key: "referenceCode3", label: "参考码3", width: 100 },
  { key: "businessType", label: "业务类型", width: 100 },
  { key: "projectCode", label: "项目编号", width: 120 },
  { key: "backwardContractCode", label: "后向合同编号", width: 130 },
  { key: "supplierName", label: "供应商名称", width: 150 },
  { key: "category1", label: "分类1", width: 100 },
  { key: "category2", label: "分类2", width: 120 },
  { key: "category3", label: "分类3", width: 150 },
  { key: "uniqueCode", label: "唯一编号", width: 180 },
];

// Mock 数据
const mockData: CostItem[] = [
  {
    companyCode: "A011", fiscalYear: "2022", lineItem: "2", profitCenter: "A330100",
    postingDate: "2022/1/25", documentNumber: "2500040114", customer: "", supplier: "",
    text: "列杭州IDC（云计算）运营中心报中国电信股份有限公司云计算内蒙古分公司DICT业务-项目型(1002",
    account: "6401560101", costCenter: "A330100020", referenceCode1: "钱薇",
    debitCreditFlag: "S", localCurrencyAmount: " 13,279,620.18 ",
    expenseReportNumber: "TYA01102010000182201001013", yearMonth: "2022/01",
    clearingDocument: "", businessScope: "", documentType: "KR",
    documentDate: "2022/1/26", postingCode: "40", economicItem: "10020403",
    functionScope: "1000", wbsElement: "ICTA3301001610024628", wbsDescription: "浙江天猫技术有限公司IDC",
    purchaseDocument: "", referenceCode3: "", businessType: "服务成本",
    projectCode: "", backwardContractCode: "ZJHAA1921792CGY00",
    supplierName: "", category1: "", category2: "手工挂账",
    category3: "服务成本-手工挂账-支出类合同",
    uniqueCode: "A011202222500040114",
  },
  {
    companyCode: "A011", fiscalYear: "2022", lineItem: "2", profitCenter: "A330100",
    postingDate: "2022/1/25", documentNumber: "2500044489", customer: "", supplier: "",
    text: "暂估杭州IDC运营中心报云计算内蒙古分公司2022年1月系统集成费 (A5楼）",
    account: "6401560202", costCenter: "A330100020", referenceCode1: "钱薇",
    debitCreditFlag: "S", localCurrencyAmount: " 2,624,437.73 ",
    expenseReportNumber: "TYA01102010000182201002002", yearMonth: "2022/01",
    clearingDocument: "", businessScope: "", documentType: "KR",
    documentDate: "2022/1/26", postingCode: "40", economicItem: "10020403",
    functionScope: "1000", wbsElement: "XYJAHQGF02101000090201", wbsDescription: "阿里巴巴（中国）有限公司与中国电信股份有限公司关于内蒙A5机房数据中心合作协议",
    purchaseDocument: "", referenceCode3: "", businessType: "服务成本",
    projectCode: "", backwardContractCode: "ZJHAA2116809CGY00",
    supplierName: "", category1: "", category2: "手工挂账",
    category3: "服务成本-手工挂账-支出类合同",
    uniqueCode: "A011202222500044489",
  },
  {
    companyCode: "A011", fiscalYear: "2022", lineItem: "2", profitCenter: "A330100",
    postingDate: "2022/1/25", documentNumber: "2500043165", customer: "", supplier: "",
    text: "暂估云计算内蒙古分公司2022年1月系统集成费 (A6楼）",
    account: "6401560101", costCenter: "A330100020", referenceCode1: "钱薇",
    debitCreditFlag: "S", localCurrencyAmount: " 4,769,939.62 ",
    expenseReportNumber: "TYA01102010000182201002003", yearMonth: "2022/01",
    clearingDocument: "", businessScope: "", documentType: "KR",
    documentDate: "2022/1/26", postingCode: "40", economicItem: "10020403",
    functionScope: "1000", wbsElement: "XYJAHQGF02101000100201", wbsDescription: "阿里巴巴（中国）有限公司与中国电信股份有限公司关于内蒙A6机房数据中心合作协议",
    purchaseDocument: "", referenceCode3: "", businessType: "服务成本",
    projectCode: "", backwardContractCode: "ZJHAA2116808CGY00",
    supplierName: "", category1: "", category2: "手工挂账",
    category3: "服务成本-手工挂账-支出类合同",
    uniqueCode: "A011202222500043165",
  },
  {
    companyCode: "A011", fiscalYear: "2022", lineItem: "2", profitCenter: "A330101",
    postingDate: "2022/1/31", documentNumber: "2500048857", customer: "", supplier: "",
    text: "杭州政企客户中心报DICT业务-项目型",
    account: "6401560202", costCenter: "A330101001", referenceCode1: "胡嘉璐",
    debitCreditFlag: "S", localCurrencyAmount: " 10,233.60 ",
    expenseReportNumber: "TYA01102010000342202000001", yearMonth: "2022/01",
    clearingDocument: "", businessScope: "", documentType: "KR",
    documentDate: "2022/2/2", postingCode: "40", economicItem: "10020403",
    functionScope: "1000", wbsElement: "XYJAZJHAA21090094301", wbsDescription: "浙江泰隆商业银行大数据分控产品服务合同",
    purchaseDocument: "", referenceCode3: "", businessType: "服务成本",
    projectCode: "", backwardContractCode: "ZJHAA2132317EGN00",
    supplierName: "", category1: "", category2: "手工挂账",
    category3: "服务成本-手工挂账-支出类合同",
    uniqueCode: "A011202222500048857",
  },
  {
    companyCode: "A011", fiscalYear: "2022", lineItem: "2", profitCenter: "A330101",
    postingDate: "2022/1/24", documentNumber: "3800019291", customer: "", supplier: "",
    text: "系统集成业务物资出入库-安防监控系统-ICT物资",
    account: "6401211300", costCenter: "A330100014", referenceCode1: "蔡珏",
    debitCreditFlag: "S", localCurrencyAmount: " 1,352,991.15 ",
    expenseReportNumber: "", yearMonth: "2022/01",
    clearingDocument: "", businessScope: "", documentType: "WA",
    documentDate: "2022/1/24", postingCode: "81", economicItem: "",
    functionScope: "1000", wbsElement: "XYJAZJHAA21100035001", wbsDescription: "杭州市交通运输行政执法队移动终端及网络租用项目合同",
    purchaseDocument: "4101543600", referenceCode3: "", businessType: "设备成本",
    projectCode: "", backwardContractCode: "",
    supplierName: "", category1: "", category2: "手工挂账",
    category3: "设备成本-手工挂账-支出类合同",
    uniqueCode: "A011202223800019291",
  },
];

// 解析 CSV 文本
function parseCSV(text: string): CostItem[] {
  const lines = text.split("\n").filter(line => line.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
  const data: CostItem[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx]?.trim().replace(/^"|"$/g, "") || "";
    });

    data.push({
      companyCode: row["公司代码"] || row["companyCode"] || "",
      fiscalYear: row["财年"] || row["fiscalYear"] || "",
      lineItem: row["行项目"] || row["lineItem"] || "",
      profitCenter: row["利润中心"] || row["profitCenter"] || "",
      postingDate: row["过账日期"] || row["postingDate"] || "",
      documentNumber: row["凭证编号"] || row["documentNumber"] || "",
      customer: row["客户"] || row["customer"] || "",
      supplier: row["供应商"] || row["supplier"] || "",
      text: row["文本"] || row["text"] || "",
      account: row["科目"] || row["account"] || "",
      costCenter: row["成本中心"] || row["costCenter"] || "",
      referenceCode1: row["参考码 (标题) 1"] || row["参考码"] || row["referenceCode1"] || "",
      debitCreditFlag: row["借/贷标识"] || row["debitCreditFlag"] || "",
      localCurrencyAmount: row[" 本币金额 "] || row["本币金额"] || row["localCurrencyAmount"] || "",
      expenseReportNumber: row["报账单号"] || row["expenseReportNumber"] || "",
      yearMonth: row["年度/月份"] || row["yearMonth"] || "",
      clearingDocument: row["清帐凭证"] || row["clearingDocument"] || "",
      businessScope: row["业务范围"] || row["businessScope"] || "",
      documentType: row["凭证类型"] || row["documentType"] || "",
      documentDate: row["凭证日期"] || row["documentDate"] || "",
      postingCode: row["记帐代码"] || row["postingCode"] || "",
      economicItem: row["经济事项"] || row["economicItem"] || "",
      functionScope: row["功能范围"] || row["functionScope"] || "",
      wbsElement: row["WBS 要素"] || row["WBS要素"] || row["wbsElement"] || "",
      wbsDescription: row["WBS描述"] || row["wbsDescription"] || "",
      purchaseDocument: row["采购凭证"] || row["purchaseDocument"] || "",
      referenceCode3: row["参考码3"] || row["referenceCode3"] || "",
      businessType: row["业务类型"] || row["businessType"] || "",
      projectCode: row["项目编号"] || row["projectCode"] || "",
      backwardContractCode: row["后向合同编号"] || row["backwardContractCode"] || "",
      supplierName: row["供应商名称"] || row["supplierName"] || "",
      category1: row["分类1"] || row["category1"] || "",
      category2: row["分类2"] || row["category2"] || "",
      category3: row["分类3"] || row["category3"] || "",
      uniqueCode: row["唯一编号（公司代码+财年+行项目+凭证编号）"] || row["唯一编号"] || row["uniqueCode"] || "",
    });
  }
  return data;
}

// 解析 CSV 行（处理引号内的逗号）
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      current += char;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

// 导出为 CSV
function exportToCSV(data: CostItem[], filename: string = "确认成本清单.csv") {
  const headers = columnDefs.map(col => col.label);
  const rows = data.map(item =>
    columnDefs.map(col => {
      const val = item[col.key] || "";
      return `"${val}"`;
    }).join(",")
  );

  const csvContent = [headers.join(","), ...rows].join("\n");
  const blob = new Blob(["﻿" + csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function ConfirmCostList() {
  const [queryParams, setQueryParams] = useState({
    documentNumber: "",
    projectCode: "",
    amountMin: "",
    amountMax: "",
    fiscalYear: "",
    postingDateStart: "",
    postingDateEnd: "",
    backwardContractCode: "",
    expenseReportNumber: "",
  });
  const [tableData, setTableData] = useState<CostItem[]>(mockData);
  const [importedFileName, setImportedFileName] = useState<string>("确认成本清单示例");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleQuery = () => {
    console.log("查询条件:", queryParams);
    // 这里可以添加实际的查询逻辑
  };

  const handleReset = () => {
    setQueryParams({
      documentNumber: "",
      projectCode: "",
      amountMin: "",
      amountMax: "",
      fiscalYear: "",
      postingDateStart: "",
      postingDateEnd: "",
      backwardContractCode: "",
      expenseReportNumber: "",
    });
  };

  const handleExport = () => {
    if (tableData.length === 0) {
      alert("请先导入数据后再导出");
      return;
    }
    exportToCSV(tableData, importedFileName || "确认成本清单.csv");
  };

  const handleImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportedFileName(file.name.replace(".csv", ""));

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsedData = parseCSV(text);
      setTableData(parsedData);
      console.log("导入数据条数:", parsedData.length);
    };
    reader.readAsText(file);

    // 清空 input，允许重复选择同一文件
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 pt-6 pb-4 flex-shrink-0">
        <h2 className="text-lg font-medium text-gray-900">确认成本清单</h2>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6">
        {/* 查询条件 */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <div className="grid grid-cols-4 gap-x-6 gap-y-4">
            {/* 凭证编号 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">凭证编号</label>
              <Input
                placeholder="请输入凭证编号"
                value={queryParams.documentNumber}
                onChange={(e) => setQueryParams({ ...queryParams, documentNumber: e.target.value })}
              />
            </div>

            {/* ICT项目编码 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ICT项目编码</label>
              <Input
                placeholder="请输入ICT项目编码"
                value={queryParams.projectCode}
                onChange={(e) => setQueryParams({ ...queryParams, projectCode: e.target.value })}
              />
            </div>

            {/* 本币金额范围 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">本币金额</label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  placeholder="最小值"
                  value={queryParams.amountMin}
                  onChange={(e) => setQueryParams({ ...queryParams, amountMin: e.target.value })}
                />
                <span className="text-gray-400">-</span>
                <Input
                  type="number"
                  placeholder="最大值"
                  value={queryParams.amountMax}
                  onChange={(e) => setQueryParams({ ...queryParams, amountMax: e.target.value })}
                />
              </div>
            </div>

            {/* 财年 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">财年</label>
              <Input
                placeholder="请输入财年，如：2022"
                value={queryParams.fiscalYear}
                onChange={(e) => setQueryParams({ ...queryParams, fiscalYear: e.target.value })}
              />
            </div>

            {/* 过账日期 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">过账日期</label>
              <div className="flex gap-2 items-center">
                <Input
                  type="date"
                  value={queryParams.postingDateStart}
                  onChange={(e) => setQueryParams({ ...queryParams, postingDateStart: e.target.value })}
                />
                <span className="text-gray-400">至</span>
                <Input
                  type="date"
                  value={queryParams.postingDateEnd}
                  onChange={(e) => setQueryParams({ ...queryParams, postingDateEnd: e.target.value })}
                />
              </div>
            </div>

            {/* 后向合同编号 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">后向合同编号</label>
              <Input
                placeholder="请输入后向合同编号"
                value={queryParams.backwardContractCode}
                onChange={(e) => setQueryParams({ ...queryParams, backwardContractCode: e.target.value })}
              />
            </div>

            {/* 报账单号 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">报账单号</label>
              <Input
                placeholder="请输入报账单号"
                value={queryParams.expenseReportNumber}
                onChange={(e) => setQueryParams({ ...queryParams, expenseReportNumber: e.target.value })}
              />
            </div>
          </div>

          {/* 按钮区域 */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              {tableData.length > 0 && (
                <span>已导入 <strong>{tableData.length}</strong> 条数据{importedFileName && `（${importedFileName}）`}</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleQuery}>
                <Search className="w-4 h-4 mr-1" />
                查询
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-1" />
                重置
              </Button>
              <Button variant="outline" onClick={handleImportClick}>
                <Upload className="w-4 h-4 mr-1" />
                导入
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-1" />
                导出
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleImport}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* 表格 */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columnDefs.map((col) => (
                    <th
                      key={col.key}
                      className="px-3 py-3 text-center text-sm font-medium text-gray-700 whitespace-nowrap"
                      style={{ minWidth: col.width }}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {tableData.length === 0 ? (
                  <tr>
                    <td colSpan={columnDefs.length} className="px-3 py-8 text-center text-gray-500">
                      未查询到匹配的数据
                    </td>
                  </tr>
                ) : (
                  tableData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      {columnDefs.map((col) => (
                        <td
                          key={col.key}
                          className="px-3 py-2 text-sm text-gray-900 whitespace-nowrap"
                          style={{ minWidth: col.width }}
                        >
                          {item[col.key] || "-"}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}