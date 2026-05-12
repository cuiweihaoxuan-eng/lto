import React from "react";
import { Button } from "./ui/button";
import { Copy, RefreshCw, Cloud } from "lucide-react";

interface ApprovalRecord {
  id: string;
  index: number;
  name: string;
  amount: string;
  eipNumber: string;
  eipDocId: string;
  draftDept: string;
  syncEipTime: string;
  eipStatus: string;
  presaleOrderNo: string;
  orderId: string;
  orderCode: string;
  sync30Time: string;
}

interface InnerApprovalListProps {
  list: ApprovalRecord[];
  onViewDetail?: (record: ApprovalRecord) => void;
  onCopyRecord?: (record: ApprovalRecord) => void;
}

export function InnerApprovalList({ list, onViewDetail, onCopyRecord }: InnerApprovalListProps) {
  return (
    <div className="bg-gray-100 border border-gray-200 rounded-lg">
      <div className="px-4 py-2 border-b border-gray-200 bg-gray-200">
        <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <span className="w-1 h-4 bg-blue-500 rounded flex-shrink-0"></span>
          录收审批单列表
        </div>
      </div>
      {/* 内层表格 - 自适应父容器宽度，固定列宽超出时滚动，操作列固定右侧 */}
      <div className="mx-3 my-2 overflow-x-auto overflow-y-auto" style={{ maxHeight: "320px" }}>
        <table className="w-full text-sm" style={{ minWidth: "100%" }}>
          <thead className="bg-gray-200 border-b border-gray-300 sticky top-0 z-10">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-12">序号</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-40">
                <div className="leading-tight">录收名称</div>
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-28">
                <div className="leading-tight">录收金额</div>
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-32">
                <div className="leading-tight">EIP文号</div>
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-28">
                <div className="leading-tight">EIP发文id</div>
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-24">
                <div className="leading-tight">拟稿部门</div>
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-36">
                <div className="leading-tight">同步EIP时间</div>
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-24">
                <div className="leading-tight">EIP审核状态</div>
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-32">
                <div className="leading-tight">预售理单号</div>
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-28">
                <div className="leading-tight">订单id</div>
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-32">
                <div className="leading-tight">订单编码</div>
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-36">
                <div className="leading-tight">同步3.0时间</div>
              </th>
              {/* 操作列固定在右侧 */}
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-56 bg-gray-200 sticky right-0 z-20">
                <div className="leading-tight">操作</div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {list.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-3 py-2">{item.index}</td>
                <td className="px-3 py-2 max-w-40 truncate" title={item.name}>{item.name}</td>
                <td className="px-3 py-2 text-right">{item.amount}</td>
                <td className="px-3 py-2">{item.eipNumber}</td>
                <td className="px-3 py-2">{item.eipDocId}</td>
                <td className="px-3 py-2">{item.draftDept}</td>
                <td className="px-3 py-2">{item.syncEipTime}</td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 rounded text-xs whitespace-nowrap ${
                    item.eipStatus === "审核通过" ? "bg-green-100 text-green-700" :
                    item.eipStatus === "审核中" ? "bg-yellow-100 text-yellow-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {item.eipStatus}
                  </span>
                </td>
                <td className="px-3 py-2">{item.presaleOrderNo}</td>
                <td className="px-3 py-2">{item.orderId}</td>
                <td className="px-3 py-2">{item.orderCode}</td>
                <td className="px-3 py-2">{item.sync30Time}</td>
                {/* 操作列固定在右侧 */}
                <td className="px-3 py-2 bg-gray-100 sticky right-0 z-10">
                  <div className="flex gap-2 whitespace-nowrap">
                    {/* 复制和录收详情始终显示 */}
                    <Button
                      variant="link"
                      size="sm"
                      className="text-blue-800 h-auto p-0 flex items-center gap-1 font-medium"
                      onClick={() => onCopyRecord?.(item)}
                    >
                      <Copy className="w-3 h-3" />
                      复制
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-blue-800 h-auto p-0 flex items-center gap-1 font-medium"
                      onClick={() => onViewDetail?.(item)}
                    >
                      录收详情
                    </Button>
                    {/* 根据EIP审核状态显示第三按钮 */}
                    {/* 未同步EIP：显示同步EIP */}
                    {(!item.syncEipTime || item.syncEipTime === "-") && (
                      <Button variant="link" size="sm" className="text-blue-800 h-auto p-0 flex items-center gap-1 font-medium">
                        <RefreshCw className="w-3 h-3" />
                        同步EIP
                      </Button>
                    )}
                    {/* 审核中：显示取消审批 */}
                    {item.eipStatus === "审核中" && (
                      <Button variant="link" size="sm" className="text-red-600 h-auto p-0 flex items-center gap-1 font-medium">
                        取消审批
                      </Button>
                    )}
                    {/* 审核通过：显示同步3.0 */}
                    {item.eipStatus === "审核通过" && (
                      <Button variant="link" size="sm" className="text-blue-800 h-auto p-0 flex items-center gap-1 font-medium">
                        <Cloud className="w-3 h-3" />
                        同步3.0
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
