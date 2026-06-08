import * as XLSX from "xlsx";

export interface SheetData {
  name: string;        // Sheet名称
  headers: string[];   // 表头
  rows: (string | number)[][]; // 数据行
}

/**
 * 导出多个Sheet到一个Excel文件
 */
export function exportToXlsx(sheets: SheetData[], filename: string) {
  const wb = XLSX.utils.book_new();

  sheets.forEach(sheet => {
    // 转换为AOA格式（数组的数组）
    const aoa: any[][] = [];
    aoa.push(sheet.headers);
    sheet.rows.forEach(row => aoa.push(row));
    const ws = XLSX.utils.aoa_to_sheet(aoa);

    // 自动设置列宽
    const colWidths = sheet.headers.map(h => ({ wch: Math.max(h.length * 2, 12) }));
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, sheet.name.substring(0, 31));
  });

  XLSX.writeFile(wb, filename);
}
