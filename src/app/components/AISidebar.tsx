import React, { useState, useRef, useEffect, KeyboardEvent, DragEvent } from "react";
import { X, Send, Paperclip, Image, Sparkles, User, ChevronDown, ChevronUp, Trash2, Brain, Terminal, BarChart3, PieChart, LineChart, Download, Copy, RefreshCw, Volume2 } from "lucide-react";
import { sendDifyMessage, generateMessageId, type DifyMessage, type FileItem, getConversations, getConversationMessages, type ToolCall } from "../services/difyApi";
import { DIFY_CONFIG, DIFY_CONFIG_LTO } from "../config/dify";
import { loadAIConfigs, getConfigByName, updateSessionCount } from "../config/aiAssistant";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, LineChart as RechartsLineChart, Line } from 'recharts';

type AgentType = 'ontology' | 'lto';

interface ConversationItem {
  id: string;
  name: string;
  created_at: string;
}

interface AISidebarProps {
  isOpen: boolean;
  onClose: () => void;
  width?: number;
}

interface ThoughtBlock {
  id: string;
  thought: string;
  observation?: string;
  tool?: string;
  isCollapsed: boolean;
}

interface ToolCallBlock {
  id: string;
  toolName: string;
  thought: string;
  observation?: string;
  request?: Record<string, unknown>;
  response?: Record<string, unknown>;
  isCollapsed: boolean;
  isRealToolCall?: boolean;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  files?: FileItem[];
  conversationId?: string;
  thoughts: ToolCallBlock[];
  userQuery?: string; // 保存用户的原始输入，用于重新生成
}

// 格式化日期（处理时间戳或字符串）
function formatDate(value: string | number | undefined): string {
  if (!value) return '未知时间';
  const date = typeof value === 'number' ? new Date(value * 1000) : new Date(value);
  if (isNaN(date.getTime())) return '未知时间';
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

// 下载CSV函数
function downloadCSV(headerCells: string[], rows: string[][], filename: string = 'data.csv') {
  // 转义CSV内容
  const escapeCSV = (str: string) => {
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  // 构建CSV内容
  const header = headerCells.map(escapeCSV).join(',');
  const dataRows = rows.map(row => row.map(escapeCSV).join(','));
  const csvContent = [header, ...dataRows].join('\n');

  // 添加BOM以支持中文
  const BOM = '﻿';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 解析 Markdown 链接和标题格式
function renderMarkdownLinks(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const lines = text.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // 检查是否是标题
    const h1Match = trimmedLine.match(/^#\s+(.+)$/);
    const h2Match = trimmedLine.match(/^##\s+(.+)$/);
    const h3Match = trimmedLine.match(/^###\s+(.+)$/);
    const h4Match = trimmedLine.match(/^####\s+(.+)$/);

    if (h1Match) {
      parts.push(<h1 key={`h1-${i}`} className="text-xl font-bold text-gray-800 mt-4 mb-2">{h1Match[1]}</h1>);
    } else if (h2Match) {
      parts.push(<h2 key={`h2-${i}`} className="text-lg font-semibold text-gray-800 mt-3 mb-2">{h2Match[1]}</h2>);
    } else if (h3Match) {
      parts.push(<h3 key={`h3-${i}`} className="text-base font-medium text-gray-700 mt-2 mb-1">{h3Match[1]}</h3>);
    } else if (h4Match) {
      parts.push(<h4 key={`h4-${i}`} className="text-sm font-medium text-gray-600 mt-2 mb-1">{h4Match[1]}</h4>);
    } else {
      // 处理连续序号换行
      const lineWithNewlines = processSequentialNumbers(trimmedLine);
      const lineContent = processInlineFormatting(lineWithNewlines);
      if (lineContent) {
        parts.push(<span key={`line-${i}`}>{lineContent}</span>);
      }
    }
    i++;
  }

  return parts;
}

// 处理连续序号换行（1、2、3、或 第一、第二、第三）
// 只处理明确的序号格式，普通大数字不换行
function processSequentialNumbers(text: string): string {
  // 模式1：数字+顿号格式，如：1、2、3、 -> 换行
  text = text.replace(/(\d+[、])(?=\d)/g, (match) => match + '\n');

  // 模式2：第x格式，如：第一步：xxx，第二步：xxx
  // 简单直接：找到所有"第一步"、"第二步"等，在它们前面加换行
  const diRegex = /第[一二三四五六七八九十百千\d]+[步次章节阶段点级][^，,。\n]*/g;
  const matches = text.match(diRegex);

  if (matches && matches.length > 1) {
    // 从后往前替换，避免位置偏移问题
    const reversedPositions: { match: string; index: number }[] = [];
    let searchFrom = 0;
    for (const match of matches) {
      const idx = text.indexOf(match, searchFrom);
      if (idx !== -1) {
        reversedPositions.push({ match, index: idx });
        searchFrom = idx + 1;
      }
    }

    // 反向遍历，从后往前插入换行
    for (let i = reversedPositions.length - 1; i > 0; i--) {
      const current = reversedPositions[i];
      // 在当前匹配项前面插入换行
      if (current.index > 0 && text[current.index - 1] !== '\n') {
        text = text.slice(0, current.index) + '\n' + text.slice(current.index);
      }
    }
  }

  // 模式3：纯数字+句号列表格式，如：1. xxx 2. xxx -> 换行
  text = text.replace(/(\d+\.\s*)(?=\d+\.)/g, '\n$1');

  // 模式4：明确的多位数序号（如 ① ② ③）
  text = text.replace(/(①|②|③|④|⑤|⑥|⑦|⑧|⑨|⑩)(?=[^；；])/g, '\n$1');

  return text;
}

// 处理行内格式化：链接和加粗
function processInlineFormatting(text: string): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))/g;
  let lastIdx = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // 添加匹配前的纯文本
    if (match.index > lastIdx) {
      result.push(text.slice(lastIdx, match.index));
    }

    if (match[1]) {
      // 加粗：**xxx** - 带半透明背景
      result.push(
        <span key={`bold-${match.index}`} className="px-1 py-0.5 mx-0.5 rounded bg-blue-100/70 text-blue-800 font-medium">
          {match[1].replace(/\*\*/g, '')}
        </span>
      );
    } else if (match[2]) {
      // 链接：[text](url)
      const linkMatch = match[2].match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        const url = linkMatch[2];
        const params = new URLSearchParams(url.split('?')[1] || '');
        const page = params.get('page');

        // 如果是页面跳转链接
        if (page) {
          const componentMap: Record<string, string> = {
            'dashboard': 'Dashboard', 'opportunity': 'OpportunityQuery',
            'business-info': 'BusinessInfoManagement', 'lead-acquisition': 'LeadAcquisition',
            'lead-pool': 'LeadPoolManagement', 'lead-merge': 'LeadMerge',
            'lead-distribution': 'LeadDistribution', 'process-config': 'ProcessNodeConfig',
            'risk-dispatch': 'RiskManagement', 'six-positioning': 'SixPositioning',
            'revenue-management': 'RevenueManagement', 'self-delivery-settlement': 'SelfDeliverySettlement',
            'progress-management': 'ProgressManagement', 'contract-payment-confirmation': 'ContractPaymentConfirmation',
            'expert-report': 'ExpertReportPage', 'full-flow-table': 'FullFlowTable',
            'low-margin-report': 'LowMarginReport', 'revenue-plan-actual-diff': 'RevenuePlanActualDiff',
            'revenue-cost-diff': 'RevenueCostDiff', 'first-payment-diff': 'FirstPaymentDiff',
            'ict-share-abnormal': 'IctShareAbnormalReport', 'ict-gross-profit-report': 'IctGrossProfitReport',
            'ict-budget-detail': 'IctBudgetDetail', 'construct-not-fixed-no-expense': 'ConstructNotFixedNoExpense',
            'cost-estimate-report': 'CostEstimateReport', 'my-wallet': 'MyWallet',
            'project-list': 'ProjectList', 'effective-business-opportunity-award': 'EffectiveBusinessOpportunityAward',
            'large-business-opportunity-award': 'LargeBusinessOpportunityAward',
            'project-commission-award': 'ProjectCommissionAward', 'reward-sign-report': 'RewardSignReport',
            'bonus-pool': 'BonusPool', 'task-wallet-list': 'TaskWalletList',
          };
          const componentName = componentMap[page];
          if (componentName) {
            result.push(
              <a
                key={`link-${match.index}`}
                href={url}
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('switch-page', { detail: { component: componentName } }));
                }}
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {linkMatch[1]}
              </a>
            );
          }
        } else {
          // 其他链接（下载链接等），直接跳转
          // 检测是否是下载链接
          const isDownloadLink = linkMatch[1].includes('下载') || url.includes('download') || url.includes('csv') || url.includes('export');
          if (isDownloadLink) {
            result.push(
              <a
                key={`link-${match.index}`}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 mx-1 my-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {linkMatch[1]}
              </a>
            );
          } else {
            result.push(
              <a
                key={`link-${match.index}`}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {linkMatch[1]}
              </a>
            );
          }
        }
      }
    }

    lastIdx = match.index + match[0].length;
  }

  // 添加剩余文本
  if (lastIdx < text.length) {
    result.push(text.slice(lastIdx));
  }

  return result;
}

// 表格+图表展示组件
function TableWithChart({ headerCells, rows }: { headerCells: string[]; rows: string[][] }) {
  const [viewMode, setViewMode] = useState<'table' | 'bar' | 'pie' | 'line'>('table');

  console.log('[图表] 解析到表格:', { headerCells, rows: rows.slice(0, 3) });

  // 尝试识别哪些列是数字列
  const numericColumns: number[] = [];
  if (rows.length > 0) {
    for (let i = 0; i < headerCells.length; i++) {
      // 检查前几行是否都是数字
      let numericCount = 0;
      for (let j = 0; j < Math.min(rows.length, 3); j++) {
        const value = rows[j]?.[i];
        if (value) {
          // 移除逗号、人民币符号等
          const cleaned = value.replace(/[¥$,，：:\s]/g, '').trim();
          if (!isNaN(parseFloat(cleaned)) && cleaned !== '') {
            numericCount++;
          }
        }
      }
      // 如果超过一半的行是数字，则认为是数字列
      if (numericCount >= Math.min(rows.length, 3) * 0.5) {
        numericColumns.push(i);
      }
    }
  }

  console.log('[图表] 识别到数字列:', numericColumns);

  // 转换为图表数据
  const chartData = rows.slice(0, 30).map((row, idx) => {
    const dataPoint: Record<string, string | number> = { name: String(row[0] || `项${idx + 1}`).slice(0, 15) };
    numericColumns.forEach(colIdx => {
      const value = parseFloat(String(row[colIdx] || '0').replace(/[¥$,，：:\s]/g, ''));
      dataPoint[`value_${colIdx}`] = isNaN(value) || !isFinite(value) ? 0 : value;
    });
    return dataPoint;
  });

  console.log('[图表] chartData:', JSON.stringify(chartData).slice(0, 500));

  // 颜色配置
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

  // 饼图数据（取前8条）
  const pieData = numericColumns.slice(0, 1).flatMap((colIdx) =>
    rows.slice(0, 8).map((row, rowIdx) => ({
      name: (row[0] || `项${rowIdx + 1}`).slice(0, 10), // 截断名称避免过长
      value: Math.abs(parseFloat((row[colIdx] || '0').replace(/[¥$,，：:\s]/g, ''))) || 0,
    }))
  );

  // 有数字列且有数据就显示图表切换按钮（放宽到30条）
  const canShowChart = numericColumns.length >= 1 && chartData.length > 0;

  if (!canShowChart) {
    // 数据不适合图表，只显示表格
    return (
      <div className="my-3 overflow-x-auto">
        {/* 下载按钮 */}
        <div className="flex justify-end mb-2">
          <button
            onClick={() => downloadCSV(headerCells, rows, `导出数据_${Date.now()}.csv`)}
            className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg flex items-center gap-1 transition-colors"
          >
            <Download className="w-3 h-3" /> 下载CSV
          </button>
        </div>
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              {headerCells.map((cell, i) => (
                <th key={i} className="border border-gray-300 px-3 py-2 text-left font-semibold">
                  {processInlineFormatting(cell)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 1 ? 'bg-gray-50' : ''}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border border-gray-300 px-3 py-2">
                    {processInlineFormatting(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="my-3">
      {/* 切换按钮和下载 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 text-xs rounded-lg transition-colors ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            表格
          </button>
          <button
            onClick={() => setViewMode('bar')}
            className={`px-3 py-1 text-xs rounded-lg transition-colors flex items-center gap-1 ${viewMode === 'bar' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <BarChart3 className="w-3 h-3" /> 柱状图
          </button>
          {pieData.length > 0 && (
            <button
              onClick={() => setViewMode('pie')}
              className={`px-3 py-1 text-xs rounded-lg transition-colors flex items-center gap-1 ${viewMode === 'pie' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <PieChart className="w-3 h-3" /> 饼图
          </button>
        )}
        <button
          onClick={() => setViewMode('line')}
          className={`px-3 py-1 text-xs rounded-lg transition-colors flex items-center gap-1 ${viewMode === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          <LineChart className="w-3 h-3" /> 折线图
        </button>
        </div>
        <button
          onClick={() => downloadCSV(headerCells, rows, `导出数据_${Date.now()}.csv`)}
          className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg flex items-center gap-1 transition-colors"
        >
          <Download className="w-3 h-3" /> 下载CSV
        </button>
      </div>

      {/* 表格视图 */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                {headerCells.map((cell, i) => (
                  <th key={i} className="border border-gray-300 px-3 py-2 text-left font-semibold">
                    {processInlineFormatting(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 1 ? 'bg-gray-50' : ''}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border border-gray-300 px-3 py-2">
                      {processInlineFormatting(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 柱状图视图 */}
      {viewMode === 'bar' && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
              {numericColumns.map((colIdx, idx) => (
                <Bar
                  key={colIdx}
                  dataKey={`value_${colIdx}`}
                  name={headerCells[colIdx]}
                  fill={COLORS[idx % COLORS.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 饼图视图 */}
      {viewMode === 'pie' && pieData.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPie>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPie>
          </ResponsiveContainer>
        </div>
      )}

      {/* 折线图视图 */}
      {viewMode === 'line' && numericColumns.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          {chartData.length >= 2 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 12 }} width={60} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                {numericColumns.map((colIdx, idx) => {
                  const dataKey = `value_${colIdx}`;
                  return (
                    <Line
                      key={dataKey}
                      type="monotone"
                      dataKey={dataKey}
                      name={headerCells[colIdx]}
                      stroke={COLORS[idx % COLORS.length]}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      isAnimationActive={true}
                    />
                  );
                })}
              </RechartsLineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500 py-8">折线图需要至少2条数据</div>
          )}
        </div>
      )}
    </div>
  );
}

// 解析 Markdown 表格为 HTML 表格
function renderMarkdownTable(text: string): React.ReactNode {
  const tableRegex = /\|(.+)\|[\r\n]+\|[-:\s|]+\|[\r\n]+((?:\|.+\|[\r\n]*)+)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = tableRegex.exec(text)) !== null) {
    // 添加表格前的文本
    if (match.index > lastIndex) {
      parts.push(renderMarkdownLinks(text.slice(lastIndex, match.index)));
    }

    // 解析表头
    const headerCells = match[1].split('|').filter(cell => cell.trim()).map(cell => cell.trim());
    // 解析数据行
    const rows = match[2].trim().split('\n').map(row =>
      row.split('|').filter(cell => cell.trim()).map(cell => cell.trim())
    );

    // 使用带图表的表格组件
    parts.push(
      <TableWithChart key={`table-${match.index}`} headerCells={headerCells} rows={rows} />
    );

    lastIndex = match.index + match[0].length;
  }

  // 添加剩余文本
  if (lastIndex < text.length) {
    parts.push(renderMarkdownLinks(text.slice(lastIndex)));
  }

  return parts.length > 0 ? <>{parts}</> : <>{renderMarkdownLinks(text)}</>;
}

// 渲染完整的消息内容（支持表格）
// 会过滤掉已被Thinking块显示的思考内容，避免重复
function renderMessageContent(content: string, thoughts: { thought: string }[] = []): React.ReactNode {
  // 安全检查：确保 content 是字符串
  if (typeof content !== 'string') {
    return null;
  }

  let filteredContent = content;

  // 如果content是完整的Markdown格式（以<think>开头），说明是AI直接输出完整内容
  // 需要过滤掉<think>...标签对
  if (/<\/think>/.test(filteredContent)) {
    filteredContent = filteredContent
      .replace(/<think>[\s\S]*?<\/think>/g, '')
      .trim();
  }

  // 清理残留的空行
  filteredContent = filteredContent.replace(/\n{3,}/g, '\n\n').trim();

  if (!filteredContent || filteredContent.length < 2) {
    return <span className="text-gray-400 text-xs">正在处理...</span>;
  }

  // 处理表格和链接
  return <>{renderMarkdownTable(filteredContent)}</>;
}

// Thinking块组件 - 蓝色页眉
function ThinkingBlock({ thought, observation, toolName, isCollapsed, onToggle }: {
  thought: string;
  observation?: string;
  toolName: string;
  isCollapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mt-2 rounded-lg overflow-hidden border border-gray-200">
      <div
        className="flex items-center justify-between px-3 py-2 bg-blue-500 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <Brain className="w-3.5 h-3.5 text-white" />
          <span className="text-sm text-white font-medium">已使用 {toolName}</span>
        </div>
        {isCollapsed ? (
          <ChevronDown className="w-4 h-4 text-white" />
        ) : (
          <ChevronUp className="w-4 h-4 text-white" />
        )}
      </div>
      {!isCollapsed && (
        <div className="p-3 bg-gray-50 text-sm">
          {thought && (
            <div className="mb-2">
              <div className="text-gray-500 text-xs mb-1">思考</div>
              <div className="text-gray-700 whitespace-pre-wrap">{thought}</div>
            </div>
          )}
          {observation && (
            <div>
              <div className="text-gray-500 text-xs mb-1">观察</div>
              <div className="text-gray-700 whitespace-pre-wrap">{observation}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 工具调用块组件
function ToolCallBlock({ toolName, request, response, thought, isCollapsed, onToggle, isRealToolCall }: {
  toolName: string;
  request?: Record<string, unknown>;
  response?: Record<string, unknown>;
  thought?: string;
  isCollapsed: boolean;
  onToggle: () => void;
  isRealToolCall?: boolean;
}) {
  // 根据类型选择样式：真正的工具调用用蓝色页眉，思考过程用灰色页眉
  const isBlueHeader = isRealToolCall;
  const headerBg = isBlueHeader ? 'bg-blue-500' : 'bg-gray-100';
  const headerTextColor = isBlueHeader ? 'text-white' : 'text-gray-600';
  const iconColor = isBlueHeader ? 'text-white' : 'text-gray-600';
  const chevronColor = isBlueHeader ? 'text-white' : 'text-gray-500';
  const labelBg = isBlueHeader ? 'bg-blue-100' : 'bg-purple-100';
  const labelTextColor = isBlueHeader ? 'text-blue-700' : 'text-purple-700';

  return (
    <div className="mt-2 rounded-lg border border-gray-200 overflow-hidden">
      <div
        className={`flex items-center justify-between px-3 py-2 ${headerBg} cursor-pointer select-none`}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        <div className="flex items-center gap-2">
          <Brain className={`w-3.5 h-3.5 ${iconColor}`} />
          <span className={`px-2 py-0.5 text-xs font-medium rounded border ${labelBg} ${labelTextColor} ${isBlueHeader ? 'border-blue-200' : 'border-purple-200'}`}>
            {isRealToolCall ? `已使用 ${toolName}` : toolName}
          </span>
        </div>
        {isCollapsed ? (
          <ChevronDown className={`w-4 h-4 ${chevronColor}`} />
        ) : (
          <ChevronUp className={`w-4 h-4 ${chevronColor}`} />
        )}
      </div>
      {!isCollapsed && (
        <div className="p-3 space-y-3 bg-gray-50">
          {thought && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1 h-4 bg-blue-500 rounded"></div>
                <span className="text-xs font-medium text-gray-600">思考</span>
              </div>
              <pre className="text-xs text-gray-700 whitespace-pre-wrap bg-white p-2 rounded border border-gray-200 overflow-x-auto max-h-60">
                {thought}
              </pre>
            </div>
          )}
          {request && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1 h-4 bg-blue-500 rounded"></div>
                <span className="text-xs font-medium text-gray-600">请求参数</span>
              </div>
              <pre className="text-xs text-gray-700 whitespace-pre-wrap bg-white p-2 rounded border border-gray-200 overflow-x-auto max-h-60">
                {JSON.stringify(request, null, 2)}
              </pre>
            </div>
          )}
          {response && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1 h-4 bg-blue-500 rounded"></div>
                <span className="text-xs font-medium text-gray-600">响应结果</span>
              </div>
              <pre className="text-xs text-gray-700 whitespace-pre-wrap bg-white p-2 rounded border border-gray-200 overflow-x-auto max-h-60">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AISidebar({ isOpen, onClose, width = 400 }: AISidebarProps) {
  const [activeAgent, setActiveAgent] = useState<AgentType>('ontology');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "你好！我是 AI 助手，可以帮你分析数据、解答问题、生成报表。有什么可以帮你的吗？",
      timestamp: new Date(),
      thoughts: [],
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<FileItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyCollapsed, setHistoryCollapsed] = useState(true);
  const [conversationId, setConversationId] = useState<string>('');
  const [conversationIdLto, setConversationIdLto] = useState<string>('');
  const [conversationList, setConversationList] = useState<ConversationItem[]>([]);
  const [currentStreamId, setCurrentStreamId] = useState<string | null>(null);
  const [streamController, setStreamController] = useState<AbortController | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // 切换 Agent 时清空对话
  const handleAgentSwitch = (agent: AgentType) => {
    if (agent === activeAgent) return;
    if (streamController) {
      streamController.abort();
      setStreamController(null);
    }
    setIsTyping(false);
    setCurrentStreamId(null);
    setActiveAgent(agent);
    setConversationList([]); // 清空历史对话列表
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: agent === 'ontology'
          ? "你好！我是本体查询助手，可以帮你查询业务数据。有什么可以帮你的吗？"
          : "你好！我是 LTO 客服助手，可以帮你解答问题、导航页面。有什么可以帮你的吗？",
        timestamp: new Date(),
      },
    ]);
    if (agent === 'ontology') {
      setConversationId('');
    } else {
      setConversationIdLto('');
    }
  };

  // 获取当前 Agent 的配置和对话 ID
  const getCurrentAgentConfig = () => {
    // 从动态配置中获取
    const configs = loadAIConfigs();
    const configName = activeAgent === 'lto' ? 'LTO客服助手' : '本体查询助手';
    const dynamicConfig = getConfigByName(configName);

    if (activeAgent === 'lto') {
      return {
        config: dynamicConfig ? {
          baseUrl: dynamicConfig.url,
          apiKey: dynamicConfig.apiKey,
          user: dynamicConfig.user,
        } : DIFY_CONFIG_LTO,
        conversationId: conversationIdLto,
        setConversationId: setConversationIdLto,
        configId: dynamicConfig?.id,
        platform: dynamicConfig?.platform || '星辰平台',  // 从配置获取平台类型
      };
    }
    return {
      config: dynamicConfig ? {
        baseUrl: dynamicConfig.url,
        apiKey: dynamicConfig.apiKey,
        user: dynamicConfig.user,
      } : DIFY_CONFIG,
      conversationId,
      setConversationId,
      configId: dynamicConfig?.id,
      platform: dynamicConfig?.platform || '星辰平台',  // 从配置获取平台类型
    };
  };

  // 自动滚动到底部（只在有新消息内容时滚动，折叠操作不滚动）
  const prevMessagesLengthRef = useRef(0);
  useEffect(() => {
    // 只有当消息数量增加或内容变化时才滚动
    if (messages.length > prevMessagesLengthRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

  // 展开历史时加载对话列表
  useEffect(() => {
    if (!historyCollapsed && conversationList.length === 0) {
      const agentConfig = getCurrentAgentConfig();
      getConversations(agentConfig.config.apiKey, agentConfig.config.baseUrl, agentConfig.config.user)
        .then((list) => {
          setConversationList(list);
        });
    }
  }, [historyCollapsed]);

  // 自动调整文本框高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  const handleSend = () => {
    if (!inputValue.trim() && attachedFiles.length === 0) return;

    const agentConfig = getCurrentAgentConfig();

    // 构建文件描述
    const filesDesc = attachedFiles.length > 0
      ? attachedFiles.map(f => `[${f.type === "image" ? "图片" : "文件"}: ${f.name}]`).join(" ")
      : "";

    const userQuery = inputValue.trim();
    const userMessage: Message = {
      id: generateMessageId(),
      role: "user",
      content: userQuery + (filesDesc ? `\n\n${filesDesc}` : ""),
      timestamp: new Date(),
      files: attachedFiles.length > 0 ? [...attachedFiles] : undefined,
      userQuery: userQuery,
    };

    console.log("[AISidebar] 准备发送消息，files:", userMessage.files);

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setAttachedFiles([]);
    setIsTyping(true);

    // 创建 AI 消息占位（用于流式追加内容）
    const aiMessageId = generateMessageId();
    setCurrentStreamId(aiMessageId);
    setMessages((prev) => [...prev, {
      id: aiMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      conversationId: agentConfig.conversationId,
      thoughts: [],
      userQuery: userQuery, // 保存用户输入，用于重新生成
    }]);

    // 调用 Dify API
    const controller = new AbortController();
    setStreamController(controller);

    // 收集流式内容
    let fullAnswer = "";

    sendDifyMessage({
      query: userMessage.content,
      conversationId: agentConfig.conversationId || undefined,
      apiKey: agentConfig.config.apiKey,
      baseUrl: agentConfig.config.baseUrl,
      platform: agentConfig.platform || '星辰平台',  // 传递平台类型
      files: userMessage.files,
      onMessage: (chunk) => {
        fullAnswer += chunk;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMessageId
              ? { ...m, content: fullAnswer }
              : m
          )
        );
      },
      onToolCall: (toolCall) => {
        console.log('[AISidebar] 收到 toolCall:', JSON.stringify(toolCall, null, 2));
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMessageId
              ? {
                  ...m,
                  thoughts: (() => {
                    // 尝试合并同 toolName 的工具调用
                    const existingIndex = m.thoughts.findIndex(t =>
                      t.isRealToolCall && t.toolName === toolCall.toolName
                    );

                    if (existingIndex >= 0) {
                      // 合并到已存在的工具调用
                      const updated = [...m.thoughts];
                      const existing = updated[existingIndex];
                      updated[existingIndex] = {
                        ...existing,
                        response: toolCall.response || existing.response,
                        thought: toolCall.thought || existing.thought,
                      };
                      return updated;
                    } else {
                      // 添加新的工具调用
                      return [...m.thoughts, {
                        id: toolCall.id,
                        toolName: toolCall.toolName,
                        thought: toolCall.thought,
                        observation: toolCall.observation,
                        request: toolCall.request,
                        response: toolCall.response,
                        isCollapsed: true,
                        isRealToolCall: toolCall.isRealToolCall,
                      }];
                    }
                  })(),
                }
              : m
          )
        );
      },
      onComplete: (newConversationId) => {
        setIsTyping(false);
        setCurrentStreamId(null);
        setStreamController(null);
        // 更新会话次数
        if (agentConfig.configId) {
          updateSessionCount(agentConfig.configId);
        }
        if (newConversationId) {
          agentConfig.setConversationId(newConversationId);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiMessageId
                ? { ...m, conversationId: newConversationId }
                : m
            )
          );
        }
      },
      onError: (error) => {
        setIsTyping(false);
        setCurrentStreamId(null);
        setStreamController(null);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMessageId
              ? { ...m, content: `抱歉，发生了错误：${error.message}` }
              : m
          )
        );
      },
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      const isImage = file.type.startsWith("image/");
      const fileItem: FileItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: isImage ? "image" : "file",
        preview: URL.createObjectURL(file),
      };
      setAttachedFiles((prev) => [...prev, fileItem]);
    });
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const removeFile = (fileId: string) => {
    setAttachedFiles((prev) => {
      const file = prev.find((f) => f.id === fileId);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== fileId);
    });
  };

  const clearChat = () => {
    // 如果有正在进行的流式请求，先停止
    if (streamController) {
      streamController.abort();
      setStreamController(null);
    }
    setIsTyping(false);
    setCurrentStreamId(null);
    const agentConfig = getCurrentAgentConfig();
    agentConfig.setConversationId('');
    setConversationList([]); // 清空历史对话列表
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: activeAgent === 'ontology'
          ? "对话已清空。本体查询助手随时为你服务。"
          : "对话已清空。LTO 客服助手随时为你服务。",
        timestamp: new Date(),
        thoughts: [],
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`h-full flex flex-col transition-all duration-300 ease-in-out z-[9998] bg-white`}
      style={{ width }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
    >
      {/* 拖拽覆盖层 */}
      {isDragOver && (
        <div className="absolute inset-0 bg-blue-50/90 z-50 flex items-center justify-center border-4 border-dashed border-blue-400 rounded-lg m-4">
          <div className="text-center">
            <Image className="w-12 h-12 text-blue-400 mx-auto mb-2" />
            <p className="text-blue-600 font-medium">将文件拖放到这里上传</p>
          </div>
        </div>
      )}

      {/* 头部 */}
      <div className="flex-shrink-0 h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 1024 1024" width="20" height="20">
            <path
              d="M493.226667 152.519111l9.386666 34.247111 0.170667 1.024 41.528889 140.344889 132.892444 0.113778a170.382222 170.382222 0 0 1 170.097778 160.256l0.284445 10.012444v11.377778A51.370667 51.370667 0 0 1 910.222222 559.786667v70.200889a51.2 51.2 0 0 1-62.577778 49.948444v23.153778a170.325333 170.325333 0 0 1-170.439111 170.268444H306.005333a170.382222 170.382222 0 0 1-170.439111-170.268444v-25.031111A59.335111 59.335111 0 0 1 56.888889 621.909333v-54.044444A59.278222 59.278222 0 0 1 135.566222 512v-13.482667A170.325333 170.325333 0 0 1 306.062222 328.192h160.711111L436.906667 227.157333l-107.633778 27.989334a22.414222 22.414222 0 0 1-27.306667-15.815111l-9.272889-34.247112a22.357333 22.357333 0 0 1 16.042667-27.477333l157.354667-40.96a22.414222 22.414222 0 0 1 27.306666 15.758222l-0.113777 0.056889z m183.978666 234.951111H306.005333a111.160889 111.160889 0 0 0-111.217777 111.047111v204.572445c0 61.326222 49.777778 110.990222 111.217777 110.990222h371.256889a111.104 111.104 0 0 0 111.217778-110.990222V498.517333a111.104 111.104 0 0 0-111.217778-111.047111h-0.056889z m-363.52 130.958222a29.582222 29.582222 0 0 1 29.297778 25.258667l0.341333 4.380445v118.385777A29.582222 29.582222 0 0 1 284.444444 670.833778l-0.341333-4.380445V548.067556a29.582222 29.582222 0 0 1 29.582222-29.582223z m363.747556-1.422222a28.785778 28.785778 0 0 1 40.732444 40.732445l-38.286222 38.229333 38.627556 38.570667a28.728889 28.728889 0 0 1 0.967111 39.594666l-1.024 1.137778a28.842667 28.842667 0 0 1-39.651556 0.967111l-1.024-1.024-56.433778-56.32a28.672 28.672 0 0 1-2.730666-43.178666l58.823111-58.709334zM571.619556 113.777778a41.528889 41.528889 0 1 1 0 83.114666h-0.113778a41.528889 41.528889 0 0 1 0-83.114666h0.113778z"
              fill="var(--color-primary)"
            />
          </svg>
          <span className="font-semibold text-gray-700">AI 助手</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clearChat}
            className="p-2 hover:bg-[var(--color-primary-light)] rounded-lg transition-colors"
            title="清空对话"
          >
            <Trash2 className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--color-primary-light)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* 对话历史折叠区 */}
      <div className="border-b border-gray-100">
        <button
          onClick={() => {
            setHistoryCollapsed(!historyCollapsed);
          }}
          className="w-full px-4 py-2 flex items-center justify-between text-sm text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <span>对话历史</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${historyCollapsed ? "" : "rotate-180"}`}
          />
        </button>
        {!historyCollapsed && (
          <div className="px-4 pb-2 space-y-1">
            {conversationList.length === 0 ? (
              <div className="text-sm text-gray-400 px-3 py-2">暂无历史对话</div>
            ) : (
              conversationList.map((conv) => (
                <button
                  key={conv.id}
                  onClick={async () => {
                    // 收起历史列表
                    setHistoryCollapsed(true);
                    // 加载选中的对话历史
                    const agentConfig = getCurrentAgentConfig();
                    const messages = await getConversationMessages(agentConfig.config.apiKey, agentConfig.config.baseUrl, conv.id, agentConfig.config.user);
                    // 转换为 Message 格式并显示
                    if (messages.length > 0) {
                      const historyMessages: Message[] = messages.map((m, idx) => ({
                        id: `history-${idx}`,
                        role: m.role as 'user' | 'assistant',
                        content: m.content,
                        timestamp: new Date(m.created_at),
                        thoughts: [],
                        files: [],
                      }));
                      setMessages(historyMessages);
                      agentConfig.setConversationId(conv.id);
                    } else {
                      // 没有历史消息，直接切换到该对话继续聊天
                      agentConfig.setConversationId(conv.id);
                      setMessages([
                        {
                          id: "welcome",
                          role: "assistant",
                          content: "已切换到该对话，可以继续聊天。",
                          timestamp: new Date(),
                          thoughts: [],
                        },
                      ]);
                    }
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg truncate"
                >
                  {conv.name || `对话 ${formatDate(conv.created_at)}`}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {/* 头像 */}
            <div
              className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                message.role === "user"
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[#3b82f6]"
              }`}
            >
              {message.role === "user" ? (
                <User className="w-4 h-4" />
              ) : (
                <svg viewBox="0 0 1024 1024" width="20" height="20">
                  <path
                    d="M493.226667 152.519111l9.386666 34.247111 0.170667 1.024 41.528889 140.344889 132.892444 0.113778a170.382222 170.382222 0 0 1 170.097778 160.256l0.284445 10.012444v11.377778A51.370667 51.370667 0 0 1 910.222222 559.786667v70.200889a51.2 51.2 0 0 1-62.577778 49.948444v23.153778a170.325333 170.325333 0 0 1-170.439111 170.268444H306.005333a170.382222 170.382222 0 0 1-170.439111-170.268444v-25.031111A59.335111 59.335111 0 0 1 56.888889 621.909333v-54.044444A59.278222 59.278222 0 0 1 135.566222 512v-13.482667A170.325333 170.325333 0 0 1 306.062222 328.192h160.711111L436.906667 227.157333l-107.633778 27.989334a22.414222 22.414222 0 0 1-27.306667-15.815111l-9.272889-34.247112a22.357333 22.357333 0 0 1 16.042667-27.477333l157.354667-40.96a22.414222 22.414222 0 0 1 27.306666 15.758222l-0.113777 0.056889z m183.978666 234.951111H306.005333a111.160889 111.160889 0 0 0-111.217777 111.047111v204.572445c0 61.326222 49.777778 110.990222 111.217777 110.990222h371.256889a111.104 111.104 0 0 0 111.217778-110.990222V498.517333a111.104 111.104 0 0 0-111.217778-111.047111h-0.056889z m-363.52 130.958222a29.582222 29.582222 0 0 1 29.297778 25.258667l0.341333 4.380445v118.385777A29.582222 29.582222 0 0 1 284.444444 670.833778l-0.341333-4.380445V548.067556a29.582222 29.582222 0 0 1 29.582222-29.582223z m363.747556-1.422222a28.785778 28.785778 0 0 1 40.732444 40.732445l-38.286222 38.229333 38.627556 38.570667a28.728889 28.728889 0 0 1 0.967111 39.594666l-1.024 1.137778a28.842667 28.842667 0 0 1-39.651556 0.967111l-1.024-1.024-56.433778-56.32a28.672 28.672 0 0 1-2.730666-43.178666l58.823111-58.709334zM571.619556 113.777778a41.528889 41.528889 0 1 1 0 83.114666h-0.113778a41.528889 41.528889 0 0 1 0-83.114666h0.113778z"
                    fill="#ffffff"
                  />
                </svg>
              )}
            </div>

            {/* 消息内容 */}
            <div
              className={`max-w-[85%] rounded-xl px-3 py-2 ${
                message.role === "user"
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {/* 文件附件 */}
              {message.files && message.files.length > 0 && (
                <div className="mb-1.5 flex flex-wrap gap-1">
                  {message.files.map((file) => (
                    <div
                      key={file.id}
                      className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs ${
                        message.role === "user" ? "bg-[var(--color-primary)] text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {file.type === "image" ? (
                        <Image className="w-3 h-3" />
                      ) : (
                        <Paperclip className="w-3 h-3" />
                      )}
                      <span className="truncate max-w-[100px]">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* 文本内容 - 回复内容（先显示，避免遮挡） */}
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {renderMessageContent(message.content, message.thoughts)}
              </div>

              {/* Thinking/工具调用块 - 显示在回复内容之后，按返回顺序展示 */}
              {message.role === "assistant" && message.thoughts?.length > 0 && (
                <div className="mt-2 space-y-2">
                  {message.thoughts.map((thought) => (
                    <ToolCallBlock
                      key={thought.id}
                      toolName={thought.toolName}
                      request={thought.request}
                      response={thought.response}
                      thought={thought.thought}
                      isCollapsed={thought.isCollapsed}
                      isRealToolCall={thought.isRealToolCall}
                      onToggle={() => {
                        setMessages((prev) =>
                          prev.map((m) =>
                            m.id === message.id
                              ? {
                                  ...m,
                                  thoughts: m.thoughts.map((t) =>
                                    t.id === thought.id ? { ...t, isCollapsed: !t.isCollapsed } : t
                                  ),
                                }
                              : m
                          )
                        );
                      }}
                    />
                  ))}
                </div>
              )}

              {/* 时间戳和操作按钮 */}
              <div className="flex items-center justify-between mt-1">
                <p
                  className={`text-xs ${
                    message.role === "user" ? "text-blue-200" : "text-gray-400"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString("zh-CN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                {/* 操作按钮 */}
                <div className="flex items-center gap-1">
                  {/* 复制 */}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(message.content).then(() => {
                        // 可以添加一个提示
                      });
                    }}
                    className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600 transition-colors"
                    title="复制内容"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  {/* 刷新重新生成 - 仅对助手消息显示 */}
                  {message.role === "assistant" && message.userQuery && (
                    <button
                      onClick={async () => {
                        const agentConfig = getCurrentAgentConfig();
                        setIsTyping(true);

                        // 清空当前消息内容
                        setMessages((prev) =>
                          prev.map((m) =>
                            m.id === message.id ? { ...m, content: "", thoughts: [] } : m
                          )
                        );

                        // 调用 Dify API 重新生成
                        const controller = new AbortController();
                        setStreamController(controller);

                        let fullAnswer = "";

                        sendDifyMessage({
                          query: message.userQuery,
                          conversationId: agentConfig.conversationId || undefined,
                          apiKey: agentConfig.config.apiKey,
                          baseUrl: agentConfig.config.baseUrl,
                          onMessage: (chunk) => {
                            fullAnswer = chunk;
                            setMessages((prev) =>
                              prev.map((m) =>
                                m.id === message.id ? { ...m, content: fullAnswer } : m
                              )
                            );
                          },
                          onToolCall: (toolCall) => {
                            setMessages((prev) =>
                              prev.map((m) =>
                                m.id === message.id
                                  ? {
                                      ...m,
                                      thoughts: (() => {
                                        const existingIndex = m.thoughts.findIndex(t =>
                                          t.isRealToolCall && t.toolName === toolCall.toolName
                                        );
                                        if (existingIndex >= 0) {
                                          const updated = [...m.thoughts];
                                          const existing = updated[existingIndex];
                                          updated[existingIndex] = {
                                            ...existing,
                                            response: toolCall.response || existing.response,
                                            thought: toolCall.thought || existing.thought,
                                          };
                                          return updated;
                                        } else {
                                          return [...m.thoughts, {
                                            id: toolCall.id,
                                            toolName: toolCall.toolName,
                                            thought: toolCall.thought,
                                            observation: toolCall.observation,
                                            request: toolCall.request,
                                            response: toolCall.response,
                                            isCollapsed: true,
                                            isRealToolCall: toolCall.isRealToolCall,
                                          }];
                                        }
                                      })(),
                                    }
                                  : m
                              )
                            );
                          },
                          onComplete: (newConversationId) => {
                            setIsTyping(false);
                            if (newConversationId) {
                              agentConfig.setConversationId(newConversationId);
                            }
                          },
                          onError: (error) => {
                            setIsTyping(false);
                            console.error('重新生成失败:', error);
                          },
                        });
                      }}
                      className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600 transition-colors"
                      title="重新生成"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  )}
                  {/* 朗读 - 仅对助手消息显示 */}
                  {message.role === "assistant" && (
                    <button
                      onClick={() => {
                        if ('speechSynthesis' in window) {
                          window.speechSynthesis.cancel();
                          const utterance = new SpeechSynthesisUtterance(message.content);
                          utterance.lang = 'zh-CN';
                          utterance.rate = 1;
                          window.speechSynthesis.speak(utterance);
                        }
                      }}
                      className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600 transition-colors"
                      title="朗读内容"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* 正在输入指示器 */}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1890ff] to-[#40a9ff] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="flex-shrink-0 border-t border-gray-100 bg-gray-50 p-3">
        {/* Agent 标签切换 */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => handleAgentSwitch('ontology')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeAgent === 'ontology'
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            本体查询
          </button>
          <button
            onClick={() => handleAgentSwitch('lto')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeAgent === 'lto'
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            LTO 客服助手
          </button>
          <span className="text-xs text-gray-400 ml-2">
            {activeAgent === 'ontology' ? '本体查询助手' : 'LTO 客服助手'}
          </span>
        </div>

        {/* 已上传文件预览 */}
        {attachedFiles.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded border group"
              >
                {file.type === "image" && file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-8 h-8 object-cover rounded"
                  />
                ) : (
                  <Paperclip className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-sm text-gray-600 max-w-[100px] truncate">{file.name}</span>
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 输入框 */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={(e) => {
              // 处理粘贴事件，支持粘贴图片或文件
              const items = e.clipboardData?.items;
              if (items) {
                for (const item of Array.from(items)) {
                  if (item.kind === 'file') {
                    const file = item.getAsFile();
                    if (file) {
                      e.preventDefault();
                      // 创建一个 FileList 模拟对象
                      const dataTransfer = new DataTransfer();
                      dataTransfer.items.add(file);
                      handleFileSelect(dataTransfer.files);
                      // 同时复制文本（如果有）
                      const text = e.clipboardData?.getData('text/plain');
                      if (text) {
                        setInputValue(prev => prev + text);
                      }
                    }
                  }
                }
              }
            }}
            placeholder="输入消息，Shift+Enter 换行，Enter 发送，Ctrl+V 粘贴图片或文件..."
            className="w-full px-3 py-2 pr-20 bg-white border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#1890ff] focus:border-transparent text-sm"
            rows={1}
            style={{ minHeight: 40, maxHeight: 100 }}
          />

          {/* 工具按钮 */}
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="上传文件"
            >
              <Paperclip className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => imageInputRef.current?.click()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="上传图片"
            >
              <Image className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* 隐藏的文件输入 */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />

              </div>
    </div>
  );
}