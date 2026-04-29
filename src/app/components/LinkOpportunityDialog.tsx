import React, { useState, useEffect, useCallback } from 'react';
import { X, Search, AlertTriangle, ChevronDown } from 'lucide-react';

interface Opportunity {
  id: string;
  code: string;
  name: string;
  customerName: string;
  customerCode: string;
  amount: number;
  createTime: string;
  accountManager: string;
  accountManagerPhone: string;
  hasLinkedInfo: boolean;
}

interface LinkOpportunityDialogProps {
  open: boolean;
  onClose: () => void;
  businessInfo: Record<string, unknown>;
  onLink: (opp: Opportunity) => void;
}

const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    code: '20260409HZA5',
    name: '杭州市云数智能综合高阶政企客户经理段丽华的商机',
    customerName: '阿里巴巴',
    customerCode: 'zj3242353',
    amount: 0,
    createTime: '2026-04-09 18:40:13',
    accountManager: '段丽华',
    accountManagerPhone: '13800138000',
    hasLinkedInfo: false,
  },
  {
    id: '2',
    code: '20260409HZA6',
    name: '2026年杭州北至科技有限公司...',
    customerName: '安讯网络技术（杭州）有限公司',
    customerCode: 'zj8901234',
    amount: 50,
    createTime: '2026-04-09 18:38:01',
    accountManager: '李明',
    accountManagerPhone: '13800138001',
    hasLinkedInfo: true,
  },
  {
    id: '3',
    code: '20260409TZA6',
    name: '中国联合医院基业部政府公关',
    customerName: '浙江大学医学院附属第一医院',
    customerCode: 'zj5678901',
    amount: 120,
    createTime: '2026-04-09 18:30:52',
    accountManager: '张三',
    accountManagerPhone: '13800138002',
    hasLinkedInfo: false,
  },
  {
    id: '4',
    code: '20260409SXA9',
    name: '杭州元云凯尔文化创意产业...',
    customerName: '杭州元云凯尔文化创意有限公司',
    customerCode: 'zj1234567',
    amount: 80,
    createTime: '2026-04-09 18:26:35',
    accountManager: '王五',
    accountManagerPhone: '13800138003',
    hasLinkedInfo: false,
  },
  {
    id: '5',
    code: '20260409SXA10',
    name: '杭州元安全京工保校及...',
    customerName: '浙江电信',
    customerCode: 'zj9876543',
    amount: 200,
    createTime: '2026-04-09 18:21:08',
    accountManager: '赵六',
    accountManagerPhone: '13800138004',
    hasLinkedInfo: true,
  },
];

export function LinkOpportunityDialog({ open, onClose, onLink }: LinkOpportunityDialogProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [showReminder, setShowReminder] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [reminderChecked, setReminderChecked] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedLinkStatus, setSelectedLinkStatus] = useState('');
  const [selectedManager, setSelectedManager] = useState('');

  const defaultColWidths = { name: 200, customer: 160, amount: 80, createTime: 140, manager: 140, status: 80 };
  const [colWidths, setColWidths] = useState(defaultColWidths);
  const [resizing, setResizing] = useState<keyof typeof defaultColWidths | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);

  const handleResizeStart = (e: React.MouseEvent, colId: keyof typeof defaultColWidths, startWidth: number) => {
    e.preventDefault();
    e.stopPropagation();
    setResizing(colId);
    setResizeStartX(e.clientX);
    setResizeStartWidth(startWidth);
  };

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!resizing) return;
    const diff = e.clientX - resizeStartX;
    const newWidth = Math.max(60, resizeStartWidth + diff);
    setColWidths(prev => ({ ...prev, [resizing]: newWidth }));
  }, [resizing, resizeStartX, resizeStartWidth]);

  const handleResizeEnd = useCallback(() => {
    setResizing(null);
  }, []);

  useEffect(() => {
    if (resizing) {
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
      return () => {
        window.removeEventListener('mousemove', handleResizeMove);
        window.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [resizing, handleResizeMove, handleResizeEnd]);

  useEffect(() => {
    if (open) {
      setShowReminder(true);
      setReminderChecked(false);
      setSelectedOpp(null);
      setSearchText('');
    }
  }, [open]);

  if (!open) return null;

  const filteredOpps = mockOpportunities.filter(opp => {
    const matchSearch = !searchText || opp.name.includes(searchText) || opp.code.includes(searchText);
    const matchCustomer = !selectedCustomer || opp.customerName.includes(selectedCustomer);
    const matchStatus = !selectedLinkStatus || (selectedLinkStatus === '已关联' && opp.hasLinkedInfo) || (selectedLinkStatus === '未关联' && !opp.hasLinkedInfo);
    const matchManager = !selectedManager || opp.accountManager.includes(selectedManager);
    return matchSearch && matchCustomer && matchStatus && matchManager;
  });

  const handleConfirmClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    if (selectedOpp) {
      onLink(selectedOpp);
    }
    setShowConfirmDialog(false);
    setReminderChecked(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-[800px] max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">关联已有商机</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 重要提醒Banner */}
        {showReminder && (
          <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-medium text-yellow-800 mb-1 text-sm">重要提醒</div>
                <div className="text-sm text-yellow-700">
                  商情中标前30天内请勿对关联的商机作以下两类修改(如强行修改，集团会判为虚假商机，算作漏单!!!):
                  <ol className="list-decimal list-inside mt-1 ml-2 space-y-0.5">
                    <li>客户名称变更</li>
                    <li>商机名称+商机金额+客户需求同时变更</li>
                  </ol>
                </div>
              </div>
              <button onClick={() => setShowReminder(false)} className="text-yellow-600 hover:text-yellow-800">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 搜索和筛选 */}
        <div className="px-6 py-4 border-b bg-gray-50 rounded-b-none">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1 min-w-[200px] flex-1">
              <label className="text-sm text-gray-600">商机名称</label>
              <input
                type="text"
                placeholder="请输入商机名称"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1 min-w-[160px]">
              <label className="text-sm text-gray-600">客户名称</label>
              <input
                type="text"
                placeholder="请输入客户名称"
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1 min-w-[120px]">
              <label className="text-sm text-gray-600">关联状态</label>
              <select
                value={selectedLinkStatus}
                onChange={(e) => setSelectedLinkStatus(e.target.value)}
                className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">全部</option>
                <option value="未关联">未关联</option>
                <option value="已关联">已关联</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 min-w-[140px]">
              <label className="text-sm text-gray-600">客户经理</label>
              <input
                type="text"
                placeholder="请输入客户经理"
                value={selectedManager}
                onChange={(e) => setSelectedManager(e.target.value)}
                className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchText(searchText)}
                className="px-4 py-1.5 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 flex items-center gap-1"
              >
                <Search className="w-4 h-4" />
                查询
              </button>
              <button
                onClick={() => { setSearchText(''); setSelectedCustomer(''); setSelectedLinkStatus(''); setSelectedManager(''); }}
                className="px-4 py-1.5 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                重置
              </button>
            </div>
          </div>
        </div>

        {/* 商机列表 */}
        <div className="flex-1 overflow-hidden px-6">
          <div className="h-full overflow-auto py-4">
            <table className="w-full text-sm" style={{ tableLayout: 'fixed', minWidth: '100%' }}>
            <colgroup>
              <col style={{ width: 40 }} />
              <col style={{ width: colWidths.name }} />
              <col style={{ width: colWidths.customer }} />
              <col style={{ width: colWidths.amount }} />
              <col style={{ width: colWidths.createTime }} />
              <col style={{ width: colWidths.manager }} />
              <col style={{ width: colWidths.status }} />
            </colgroup>
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 pr-0"></th>
                <th className="py-2 pr-2 text-left text-gray-600 font-medium whitespace-nowrap relative group">
                  商机名称/编码
                  <div
                    className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize bg-transparent hover:bg-blue-400 group-hover:bg-blue-300"
                    onMouseDown={(e) => handleResizeStart(e, 'name', colWidths.name)}
                  />
                </th>
                <th className="py-2 pr-2 text-left text-gray-600 font-medium whitespace-nowrap relative group">
                  客户名称
                  <div
                    className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize bg-transparent hover:bg-blue-400 group-hover:bg-blue-300"
                    onMouseDown={(e) => handleResizeStart(e, 'customer', colWidths.customer)}
                  />
                </th>
                <th className="py-2 pr-2 text-center text-gray-600 font-medium whitespace-nowrap relative group">
                  金额(万)
                  <div
                    className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize bg-transparent hover:bg-blue-400 group-hover:bg-blue-300"
                    onMouseDown={(e) => handleResizeStart(e, 'amount', colWidths.amount)}
                  />
                </th>
                <th className="py-2 pr-2 text-left text-gray-600 font-medium whitespace-nowrap relative group">
                  创建时间
                  <div
                    className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize bg-transparent hover:bg-blue-400 group-hover:bg-blue-300"
                    onMouseDown={(e) => handleResizeStart(e, 'createTime', colWidths.createTime)}
                  />
                </th>
                <th className="py-2 pr-2 text-left text-gray-600 font-medium whitespace-nowrap relative group">
                  客户经理
                  <div
                    className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize bg-transparent hover:bg-blue-400 group-hover:bg-blue-300"
                    onMouseDown={(e) => handleResizeStart(e, 'manager', colWidths.manager)}
                  />
                </th>
                <th className="py-2 text-center text-gray-600 font-medium whitespace-nowrap relative group">
                  关联状态
                  <div
                    className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize bg-transparent hover:bg-blue-400 group-hover:bg-blue-300"
                    onMouseDown={(e) => handleResizeStart(e, 'status', colWidths.status)}
                  />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOpps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">暂无匹配的商机</td>
                </tr>
              ) : filteredOpps.map((opp) => (
                <tr
                  key={opp.id}
                  onClick={() => setSelectedOpp(selectedOpp?.id === opp.id ? null : opp)}
                  className={`cursor-pointer transition-colors ${
                    selectedOpp?.id === opp.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="py-2 text-center">
                    <div className={`w-4 h-4 rounded-full border-2 mx-auto flex items-center justify-center ${
                      selectedOpp?.id === opp.id ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                    }`}>
                      {selectedOpp?.id === opp.id && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </td>
                  <td className="py-2 overflow-hidden">
                    <div className="text-gray-900 font-medium whitespace-nowrap overflow-hidden text-ellipsis">{opp.name}</div>
                    <div className="text-gray-500 text-xs whitespace-nowrap">{opp.code}</div>
                  </td>
                  <td className="py-2 text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">{opp.customerName}（{opp.customerCode}）</td>
                  <td className="py-2 text-center whitespace-nowrap">
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded font-medium">{opp.amount}万</span>
                  </td>
                  <td className="py-2 text-gray-600 whitespace-nowrap">{opp.createTime}</td>
                  <td className="py-2 text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{opp.accountManager}（{opp.accountManagerPhone}）</td>
                  <td className="py-2 text-center">
                    {opp.hasLinkedInfo && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">已关联</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        {/* 底部 */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">
            取消
          </button>
          <button
            onClick={handleConfirmClick}
            disabled={!selectedOpp}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            确定
          </button>
        </div>

        {/* 确认关联弹窗 */}
        {showConfirmDialog && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50" onClick={() => setShowConfirmDialog(false)}>
            <div className="bg-white rounded-xl shadow-2xl w-[480px]" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">重要提醒</h3>
                </div>
                <div className="text-sm text-gray-700 mb-4">
                  商情中标前30天内请勿对关联的商机作以下两类修改(如强行修改，集团会判为虚假商机，算作漏单!!!):
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>客户名称变更</li>
                    <li>商机名称+商机金额+客户需求同时变更</li>
                  </ol>
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-700 mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reminderChecked}
                    onChange={(e) => setReminderChecked(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  我已知悉上述提醒
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowConfirmDialog(false)}
                    className="flex-1 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={!reminderChecked}
                    className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    确认关联
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
