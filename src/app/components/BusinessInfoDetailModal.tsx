import React from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface BusinessInfoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Record<string, unknown>;
}

export function BusinessInfoDetailModal({ isOpen, onClose, data }: BusinessInfoDetailModalProps) {
  if (!isOpen || !data) return null;

  const statusBadgeClass = (status: string) => {
    if (status === "未处理") return "bg-orange-100 text-orange-700";
    if (status === "转商机") return "bg-blue-100 text-blue-700";
    return "bg-green-100 text-green-700";
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div>
      <h3 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">{title}</h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">{children}</div>
    </div>
  );

  const Field = ({ label, value, fullWidth }: { label: string; value: React.ReactNode; fullWidth?: boolean }) => (
    <div className={fullWidth ? "col-span-2 flex items-start" : "flex items-start"}>
      <span className="text-sm text-gray-500 w-32 flex-shrink-0">{label}：</span>
      <span className="text-sm text-gray-900 flex-1">{value}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-[900px] max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">商情详情</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 选项卡 */}
        <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-200 bg-gray-50">
          <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">商情详情</button>
          <button className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">流转流程</button>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* 商情基本信息 */}
            <Section title="商情基本信息">
              <Field label="商情编号" value={data.businessInfoCode as string} />
              <Field label="项目编码" value={data.projectCode as string} />
              <Field label="项目名称" value={data.projectName as string} fullWidth />
              <Field label="地市" value={data.city as string} />
              <Field label="区县" value={data.district as string} />
              <Field label="集团派发时间" value={data.groupDispatchTime as string} />
              <Field label="项目类型" value={data.projectType as string} />
              <Field label="管控部门" value={data.controlDepartment as string} />
              <Field label="区域分组" value={(data.areaGroup as string) || '-'} />
            </Section>

            {/* 商情处理信息 */}
            <Section title="商情处理信息">
              <Field label="商情状态" value={
                <span className={`inline-block px-2 py-0.5 text-xs rounded ${statusBadgeClass(data.businessInfoStatus as string)}`}>
                  {data.businessInfoStatus as string}
                </span>
              } />
              <Field label="当前操作步骤" value={data.currentOperationStep as string} />
              <Field label="当前操作角色" value={data.currentOperationRole as string} />
              <Field label="当前操作人" value={
                Array.isArray(data.currentOperators)
                  ? (data.currentOperators as string[]).join('、')
                  : (data.currentOperator as string)
              } />
              <Field label="客户经理" value={data.accountManager as string} />
              <Field label="关联商机编码" value={data.groupBusinessCode as string || '-'} />
              <Field label="商机名称" value={data.businessName as string || '-'} fullWidth />
              <Field label="关联时间" value={data.groupBusinessTime as string || '-'} />
            </Section>

            {/* 招投标信息 */}
            <Section title="招投标信息">
              <Field label="数据类型" value={data.dataType as string} />
              <Field label="招标/中标金额" value={data.biddingAmount ? `${data.biddingAmount}万元` : '-'} />
              <Field label="招标发布时间" value={data.biddingPublishTime as string || '-'} />
              <Field label="开标时间" value={data.openingTime as string || '-'} />
              <Field label="招标截至时间" value={data.biddingDeadline as string || '-'} />
              <Field label="中标时间" value={data.winningTime as string || '-'} />
              <Field label="招标单位" value={data.biddingUnit as string} fullWidth />
              <Field label="企业派发名称" value={(data.enterpriseName as string) || (data.companyDispatchName as string) || '-'} />
              <Field label="中标单位" value={data.winningUnit as string || '-'} />
              <Field label="运营商标签" value={data.operatorLabel as string} />
              <Field label="招标单位所属区域" value={data.biddingUnitArea as string || '-'} fullWidth />
            </Section>

            {/* 附件 */}
            <Section title="附件">
              <div className="col-span-2">
                {data.attachment ? (
                  <a href="#" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    {data.attachment as string}
                  </a>
                ) : data.attachmentCount ? (
                  <span className="text-sm text-gray-700">共 {data.attachmentCount} 个附件</span>
                ) : (
                  <span className="text-sm text-gray-400">无附件</span>
                )}
              </div>
            </Section>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" size="sm" onClick={onClose}>关闭</Button>
        </div>
      </div>
    </div>
  );
}
