import React, { useState, useEffect, useRef } from "react";
import { Check, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { TabNav } from "./ui/tab-nav";
import type {
  BusinessPreDemolition,
  TotalIncomeRow,
  HardwareRow,
  SoftwareRow,
  CloudServiceRow,
  ContractAllocationRow,
  BusinessIncomeRow,
  MilestoneNodeRow,
  MilestoneNonPeriodicRow,
  MilestonePeriodicRow,
  RevenuePlanNonPeriodicRow,
  RevenuePlanPeriodicRow,
  CollectionPlanNonPeriodicRow,
  CollectionPlanPeriodicRow,
} from "./BusinessPreDemolitionList";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: BusinessPreDemolition;
}

const formatNum = (n: number | string) => {
  const v = typeof n === "string" ? parseFloat(n) : n;
  if (isNaN(v) || v === 0 || v === undefined || v === null) return "-";
  return v.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// ========== 通用可编辑单元格 ==========
interface EditableCellProps {
  value: any;
  type?: "text" | "number" | "date" | "select";
  options?: string[];
  onChange: (v: any) => void;
  align?: "left" | "right" | "center";
  placeholder?: string;
}

function EditableCell({ value, type = "text", options, onChange, align = "left", placeholder = "点击编辑" }: EditableCellProps) {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value ?? "");
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  useEffect(() => {
    setTemp(value ?? "");
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const commit = () => {
    let final: any = temp;
    if (type === "number") {
      final = temp === "" || temp === "-" ? 0 : Number(temp);
    }
    onChange(final);
    setEditing(false);
  };

  const cancel = () => {
    setTemp(value ?? "");
    setEditing(false);
  };

  const display = () => {
    if (value === undefined || value === null || value === "" || value === 0) {
      return <span className="text-gray-400">{placeholder}</span>;
    }
    if (type === "number") return formatNum(value);
    return value;
  };

  const alignClass = align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";

  if (editing) {
    return (
      <td className={`px-2 py-1.5 border-r border-b border-gray-100 ${alignClass}`}>
        <div className="flex items-center gap-1">
          {type === "select" && options ? (
            <select
              ref={inputRef as React.RefObject<HTMLSelectElement>}
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              onBlur={commit}
              className="flex-1 h-6 text-xs border border-blue-400 rounded px-1 outline-none focus:border-blue-600"
            >
              <option value="">-</option>
              {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : (
            <Input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type={type === "number" ? "number" : type === "date" ? "date" : "text"}
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit();
                if (e.key === "Escape") cancel();
              }}
              onBlur={commit}
              className="h-6 text-xs px-1 py-0"
            />
          )}
          <button onClick={commit} className="p-0.5 hover:bg-green-100 rounded text-green-600">
            <Check className="w-3 h-3" />
          </button>
          <button onClick={cancel} className="p-0.5 hover:bg-red-100 rounded text-red-600">
            <X className="w-3 h-3" />
          </button>
        </div>
      </td>
    );
  }

  return (
    <td
      onClick={() => setEditing(true)}
      className={`px-2 py-1.5 border-r border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors ${alignClass}`}
      title="点击编辑"
    >
      {display()}
    </td>
  );
}

// ========== 通用表头（对齐 SelfDeliverySettlement 浅色表头） ==========
function Th({ children, className = "", align = "left" }: { children: React.ReactNode; className?: string; align?: "left" | "right" | "center" }) {
  const a = align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";
  return (
    <th className={`px-3 py-2 text-left text-xs font-medium text-gray-600 bg-gray-50 border-b border-gray-200 whitespace-nowrap ${a} ${className}`}>
      {children}
    </th>
  );
}

// ========== 区块包装：子标题 + 表格卡片（对齐 SelfDeliverySettlement 样式） ==========
function Section({ title, children, summary }: { title: string; children: React.ReactNode; summary?: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="px-4 py-2 border-b border-gray-200 bg-gray-100">
        <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <span className="w-1 h-4 bg-blue-500 rounded flex-shrink-0"></span>
          {title}
        </div>
      </div>
      <div className="overflow-x-auto" style={{ maxHeight: "360px" }}>
        <table className="w-full text-sm border-collapse">
          {children}
        </table>
      </div>
      {summary && (
        <div className="border-t border-gray-200 bg-blue-50 px-3 py-2 text-xs">
          {summary}
        </div>
      )}
    </div>
  );
}

export function BusinessPreDemolitionDetailModal({ open, onOpenChange, data }: Props) {
  const [activeTab, setActiveTab] = useState("total");
  const [editing, setEditing] = useState(data);
  useEffect(() => {
    setEditing(data);
    setActiveTab("total");
  }, [data]);

  const update = (patch: Partial<typeof editing>) => setEditing(prev => ({ ...prev, ...patch }));

  if (!open) return null;

  const tabs = [
    { id: "total", label: "总表" },
    { id: "hardware", label: "硬件" },
    { id: "software", label: "软件" },
    { id: "cloud", label: "云网资源、服务及标品" },
    { id: "contract", label: "合同金额分摊" },
    { id: "businessIncome", label: "业务收入列表" },
    { id: "milestone", label: "里程碑计划" },
    { id: "revenue", label: "收入计划" },
    { id: "collection", label: "收款计划" },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[1400px] mx-4 max-h-[90vh] flex flex-col">
        {/* 弹窗头 */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div>
            <div className="text-lg font-medium text-gray-900 flex items-center gap-2">
              {editing.oppName}
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-[10px]">业务预解构</Badge>
            </div>
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-4">
              <span>合同编码：{editing.contractCode}</span>
              <span>项目编码：{editing.projectCode}</span>
              <span>合同金额：{formatNum(editing.contractAmount)} 万元</span>
              <span>客户经理：{editing.customerManager}</span>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-600"
            aria-label="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab 导航（pill 样式，对齐 SelfDeliverySettlement） */}
        <div className="px-6 pt-4 flex-shrink-0">
          <TabNav style="pill" tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* 弹窗体 */}
        <div className="flex-1 overflow-auto px-6 py-4 space-y-4">
          {/* === 总表 === */}
          {activeTab === "total" && (
            <div className="space-y-4">
              <Section
                title="收支信息"
                summary={
                  <div>
                    预计收入合计：
                    <span className="text-blue-600 font-semibold">
                      {formatNum(editing.preDemolition.totalIncome.reduce((s, r) => s + (Number(r.expectedIncome) || 0), 0))}
                    </span> 元；
                    预计支出合计：
                    <span className="text-orange-600 font-semibold">
                      {formatNum(editing.preDemolition.totalIncome.reduce((s, r) => s + (Number(r.expectedExpense) || 0), 0))}
                    </span> 元
                  </div>
                }
              >
                <thead>
                  <tr>
                    <Th>分类</Th>
                    <Th align="right">预计收入合计(元)</Th>
                    <Th align="right">预计支出合计(元)</Th>
                  </tr>
                </thead>
                <tbody>
                  {editing.preDemolition.totalIncome.map((row, i) => (
                    <tr key={i} className={row.category === "合计" ? "bg-blue-50 font-semibold" : "hover:bg-gray-50"}>
                      <EditableCell
                        value={row.category}
                        onChange={(v) => {
                          const arr = [...editing.preDemolition.totalIncome];
                          arr[i] = { ...row, category: v };
                          update({ preDemolition: { ...editing.preDemolition, totalIncome: arr } });
                        }}
                      />
                      <EditableCell
                        value={row.expectedIncome}
                        type="number"
                        align="right"
                        onChange={(v) => {
                          const arr = [...editing.preDemolition.totalIncome];
                          arr[i] = { ...row, expectedIncome: v };
                          update({ preDemolition: { ...editing.preDemolition, totalIncome: arr } });
                        }}
                      />
                      <EditableCell
                        value={row.expectedExpense}
                        type="number"
                        align="right"
                        onChange={(v) => {
                          const arr = [...editing.preDemolition.totalIncome];
                          arr[i] = { ...row, expectedExpense: v };
                          update({ preDemolition: { ...editing.preDemolition, totalIncome: arr } });
                        }}
                      />
                    </tr>
                  ))}
                </tbody>
              </Section>

              <div className="grid grid-cols-2 gap-4">
                <Section title="合同信息">
                  <tbody>
                    {([
                      { k: "合同编码", v: editing.preDemolition.totalContract.contractCode, f: "contractCode" },
                      { k: "合同金额(元)", v: editing.preDemolition.totalContract.contractAmount, f: "contractAmount", type: "number" },
                      { k: "合同类型", v: editing.preDemolition.totalContract.contractType, f: "contractType" },
                      { k: "我方名称", v: editing.preDemolition.totalContract.ourName, f: "ourName" },
                      { k: "对方名称", v: editing.preDemolition.totalContract.partyName, f: "partyName" },
                      { k: "合同履约期限", v: editing.preDemolition.totalContract.contractPeriod, f: "contractPeriod" },
                      { k: "合同适用对象", v: editing.preDemolition.totalContract.contractTarget, f: "contractTarget" },
                    ] as const).map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-3 py-2 border-r border-b border-gray-100 bg-gray-50 font-medium text-xs text-gray-600 w-32">{item.k}</td>
                        <EditableCell
                          value={item.v}
                          type={(item as any).type}
                          onChange={(v) => {
                            update({ preDemolition: { ...editing.preDemolition, totalContract: { ...editing.preDemolition.totalContract, [item.f]: v } } });
                          }}
                        />
                      </tr>
                    ))}
                  </tbody>
                </Section>

                <Section title="项目信息">
                  <tbody>
                    {([
                      { k: "项目分类", v: editing.preDemolition.totalProject.projectCategory, f: "projectCategory" },
                      { k: "是否有履约保证金", v: editing.preDemolition.totalProject.hasGuarantee, f: "hasGuarantee", type: "select", options: ["是", "否"] },
                      { k: "是否有维保要求", v: editing.preDemolition.totalProject.hasMaintenance, f: "hasMaintenance", type: "select", options: ["是", "否"] },
                      { k: "是否有审计条款", v: editing.preDemolition.totalProject.hasAudit, f: "hasAudit", type: "select", options: ["是", "否"] },
                      { k: "发票种类", v: editing.preDemolition.totalProject.invoiceType, f: "invoiceType" },
                      { k: "该合同实际利润归属单位", v: editing.preDemolition.totalProject.profitUnit, f: "profitUnit" },
                      { k: "项目经理", v: editing.preDemolition.totalProject.projectManager, f: "projectManager" },
                      { k: "项目管控部门", v: editing.preDemolition.totalProject.controlDept, f: "controlDept" },
                      { k: "客户联系人", v: editing.preDemolition.totalProject.customerContact, f: "customerContact" },
                      { k: "客户联系人联系方式", v: editing.preDemolition.totalProject.contactPhone, f: "contactPhone" },
                      { k: "项目预计完成时间", v: editing.preDemolition.totalProject.expectedFinishDate, f: "expectedFinishDate" },
                      { k: "项目描述", v: editing.preDemolition.totalProject.projectDesc, f: "projectDesc" },
                    ] as const).map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-3 py-2 border-r border-b border-gray-100 bg-gray-50 font-medium text-xs text-gray-600 w-40">{item.k}</td>
                        <EditableCell
                          value={item.v}
                          type={(item as any).type}
                          options={(item as any).options}
                          onChange={(v) => {
                            update({ preDemolition: { ...editing.preDemolition, totalProject: { ...editing.preDemolition.totalProject, [item.f]: v } } });
                          }}
                        />
                      </tr>
                    ))}
                  </tbody>
                </Section>
              </div>
            </div>
          )}

          {/* === 硬件 === */}
          {activeTab === "hardware" && (
            <HardwareTable
              data={editing.preDemolition.hardware}
              onChange={(arr) => update({ preDemolition: { ...editing.preDemolition, hardware: arr } })}
            />
          )}

          {/* === 软件 === */}
          {activeTab === "software" && (
            <SoftwareTable
              data={editing.preDemolition.software}
              onChange={(arr) => update({ preDemolition: { ...editing.preDemolition, software: arr } })}
            />
          )}

          {/* === 云网资源 === */}
          {activeTab === "cloud" && (
            <CloudTable
              data={editing.preDemolition.cloudService}
              onChange={(arr) => update({ preDemolition: { ...editing.preDemolition, cloudService: arr } })}
            />
          )}

          {/* === 合同金额分摊 === */}
          {activeTab === "contract" && (
            <ContractAllocTable
              data={editing.preDemolition.contractAllocation}
              onChange={(arr) => update({ preDemolition: { ...editing.preDemolition, contractAllocation: arr } })}
            />
          )}

          {/* === 业务收入列表 === */}
          {activeTab === "businessIncome" && (
            <BusinessIncomeTable
              data={editing.preDemolition.businessIncome}
              onChange={(arr) => update({ preDemolition: { ...editing.preDemolition, businessIncome: arr } })}
            />
          )}

          {/* === 里程碑计划 === */}
          {activeTab === "milestone" && (
            <MilestonePlanView
              data={editing.preDemolition.milestone}
              onChange={(d) => update({ preDemolition: { ...editing.preDemolition, milestone: d } })}
            />
          )}

          {/* === 收入计划 === */}
          {activeTab === "revenue" && (
            <RevenuePlanView
              data={editing.preDemolition.revenuePlan}
              onChange={(d) => update({ preDemolition: { ...editing.preDemolition, revenuePlan: d } })}
            />
          )}

          {/* === 收款计划 === */}
          {activeTab === "collection" && (
            <CollectionPlanView
              data={editing.preDemolition.collectionPlan}
              onChange={(d) => update({ preDemolition: { ...editing.preDemolition, collectionPlan: d } })}
            />
          )}
        </div>

        {/* 弹窗底 */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>关闭</Button>
          <Button
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => {
              console.log("保存业务预解构:", editing);
              alert("保存成功（mock）");
              onOpenChange(false);
            }}
          >
            保存
          </Button>
        </div>
      </div>
    </div>
  );
}

// ========== 硬件表 ==========
function HardwareTable({ data, onChange }: { data: HardwareRow[]; onChange: (d: HardwareRow[]) => void }) {
  const fields: Array<{ key: keyof HardwareRow; label: string; type?: "text" | "number" | "select"; options?: string[]; align?: "left" | "right" }> = [
    { key: "deviceType", label: "设备类型", type: "select", options: ["服务器", "存储", "网络设备", "安全设备", "其他"] },
    { key: "deviceName", label: "设备名称" },
    { key: "brand", label: "品牌(原厂商)" },
    { key: "model", label: "设备型号" },
    { key: "spec", label: "技术规格" },
    { key: "unit", label: "单位" },
    { key: "qty", label: "数量", type: "number", align: "right" },
    { key: "forwardUnitPrice", label: "前向收入单价(元)", type: "number", align: "right" },
    { key: "forwardTotal", label: "前向收入合计(元)", type: "number", align: "right" },
    { key: "backwardUnitPrice", label: "后向支出单价(元)", type: "number", align: "right" },
    { key: "backwardTotal", label: "后向支出合计(元)", type: "number", align: "right" },
    { key: "implMethod", label: "实施方式" },
    { key: "materialCode", label: "物料编码" },
    { key: "tags", label: "标签" },
    { key: "fundUseMethod", label: "资金使用方式" },
    { key: "bizModel", label: "商务模式" },
    { key: "purchaseMode", label: "预计采购模式" },
    { key: "partner", label: "预计合作伙伴" },
    { key: "investBizType", label: "投资业务类型" },
  ];

  const total = {
    forward: data.reduce((s, r) => s + (Number(r.forwardTotal) || 0), 0),
    backward: data.reduce((s, r) => s + (Number(r.backwardTotal) || 0), 0),
  };

  return (
    <Section
      title="硬件清单"
      summary={
        <div>
          硬件部分合计 收入:
          <span className="text-blue-600 font-semibold"> {formatNum(total.forward)}元</span>  支出:
          <span className="text-orange-600 font-semibold"> {formatNum(total.backward)}元</span>
        </div>
      }
    >
      <thead>
        <tr>
          <Th>序号</Th>
          {fields.map(f => <Th key={f.key as string} align={f.align}>{f.label}</Th>)}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={row.id} className="hover:bg-gray-50">
            <td className="px-3 py-2 border-r border-b border-gray-100 text-center text-xs">{i + 1}</td>
            {fields.map(f => (
              <EditableCell
                key={f.key as string}
                value={row[f.key] as any}
                type={f.type}
                options={f.options}
                align={f.align}
                onChange={(v) => {
                  const arr = [...data];
                  arr[i] = { ...row, [f.key]: v };
                  onChange(arr);
                }}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </Section>
  );
}

// ========== 软件表 ==========
function SoftwareTable({ data, onChange }: { data: SoftwareRow[]; onChange: (d: SoftwareRow[]) => void }) {
  const fields: Array<{ key: keyof SoftwareRow; label: string; type?: "text" | "number" | "select"; align?: "left" | "right" }> = [
    { key: "level1", label: "一级(平台/系统)" },
    { key: "level2", label: "二级(子系统/子模块)" },
    { key: "level3", label: "三级(功能点)" },
    { key: "funcDesc", label: "功能描述" },
    { key: "forwardTotal", label: "前向收入合计(元)", type: "number", align: "right" },
    { key: "backwardTotal", label: "后向支出合计(元)", type: "number", align: "right" },
    { key: "implMethod", label: "实施方式" },
    { key: "productName", label: "中国电信产品/能力名称" },
    { key: "unifiedCode", label: "统一编码" },
    { key: "tags", label: "标签" },
    { key: "fundUseMethod", label: "资金使用方式" },
    { key: "bizModel", label: "商务模式" },
    { key: "purchaseMode", label: "预计采购模式" },
    { key: "acceptMode", label: "预计受理模式" },
    { key: "partner", label: "预计合作伙伴" },
    { key: "investBizType", label: "投资业务类型" },
  ];

  return (
    <Section title="软件清单">
      <thead>
        <tr>
          <Th>序号</Th>
          {fields.map(f => <Th key={f.key as string} align={f.align}>{f.label}</Th>)}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={row.id} className="hover:bg-gray-50">
            <td className="px-3 py-2 border-r border-b border-gray-100 text-center text-xs">{i + 1}</td>
            {fields.map(f => (
              <EditableCell
                key={f.key as string}
                value={row[f.key] as any}
                type={f.type}
                align={f.align}
                onChange={(v) => {
                  const arr = [...data];
                  arr[i] = { ...row, [f.key]: v };
                  onChange(arr);
                }}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </Section>
  );
}

// ========== 云网资源表 ==========
function CloudTable({ data, onChange }: { data: CloudServiceRow[]; onChange: (d: CloudServiceRow[]) => void }) {
  const fields: Array<{ key: keyof CloudServiceRow; label: string; type?: "text" | "number" | "select"; options?: string[]; align?: "left" | "right" }> = [
    { key: "type", label: "类型", type: "select", options: ["标品", "集成服务", "维保服务", "其他"] },
    { key: "productName", label: "产品名称" },
    { key: "specDesc", label: "规格描述" },
    { key: "vendor", label: "厂商" },
    { key: "unit", label: "单位" },
    { key: "qty", label: "数量", type: "number", align: "right" },
    { key: "forwardUnitPrice", label: "前向收入单价(元)", type: "number", align: "right" },
    { key: "forwardTotal", label: "前向收入合计(元)", type: "number", align: "right" },
    { key: "backwardUnitPrice", label: "后向支出单价(元)", type: "number", align: "right" },
    { key: "backwardTotal", label: "后向支出合计(元)", type: "number", align: "right" },
    { key: "implMethod", label: "实施方式" },
    { key: "productCode", label: "产品编码" },
    { key: "tags", label: "标签" },
    { key: "fundUseMethod", label: "资金使用方式" },
    { key: "purchaseMode", label: "预计采购模式" },
    { key: "acceptMode", label: "预计受理模式" },
    { key: "partner", label: "预计合作伙伴" },
    { key: "investBizType", label: "投资业务类型" },
  ];

  const total = {
    forward: data.reduce((s, r) => s + (Number(r.forwardTotal) || 0), 0),
    backward: data.reduce((s, r) => s + (Number(r.backwardTotal) || 0), 0),
  };

  return (
    <Section
      title="云网资源、服务及标品"
      summary={
        <div>
          云网资源部分合计 收入:
          <span className="text-blue-600 font-semibold"> {formatNum(total.forward)}元</span>  支出:
          <span className="text-orange-600 font-semibold"> {formatNum(total.backward)}元</span>
        </div>
      }
    >
      <thead>
        <tr>
          <Th>序号</Th>
          {fields.map(f => <Th key={f.key as string} align={f.align}>{f.label}</Th>)}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={row.id} className="hover:bg-gray-50">
            <td className="px-3 py-2 border-r border-b border-gray-100 text-center text-xs">{i + 1}</td>
            {fields.map(f => (
              <EditableCell
                key={f.key as string}
                value={row[f.key] as any}
                type={f.type}
                options={f.options}
                align={f.align}
                onChange={(v) => {
                  const arr = [...data];
                  arr[i] = { ...row, [f.key]: v };
                  onChange(arr);
                }}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </Section>
  );
}

// ========== 合同金额分摊表 ==========
function ContractAllocTable({ data, onChange }: { data: ContractAllocationRow[]; onChange: (d: ContractAllocationRow[]) => void }) {
  const total = data.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  return (
    <Section
      title="合同金额分摊"
      summary={<div>合同分摊总金额(含税) 合计: <span className="text-blue-600 font-semibold">{formatNum(total)}元</span></div>}
    >
      <thead>
        <tr>
          <Th>序号</Th>
          <Th>合同分摊对象</Th>
          <Th>后向来源(签约单位视角)</Th>
          <Th align="right">合同分摊金额(元)</Th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={row.id} className="hover:bg-gray-50">
            <td className="px-3 py-2 border-r border-b border-gray-100 text-center text-xs">{i + 1}</td>
            <EditableCell
              value={row.allocationObject}
              onChange={(v) => {
                const arr = [...data];
                arr[i] = { ...row, allocationObject: v };
                onChange(arr);
              }}
            />
            <EditableCell
              value={row.backwardSource}
              onChange={(v) => {
                const arr = [...data];
                arr[i] = { ...row, backwardSource: v };
                onChange(arr);
              }}
            />
            <EditableCell
              value={row.amount}
              type="number"
              align="right"
              onChange={(v) => {
                const arr = [...data];
                arr[i] = { ...row, amount: v };
                onChange(arr);
              }}
            />
          </tr>
        ))}
      </tbody>
    </Section>
  );
}

// ========== 业务收入列表表 ==========
function BusinessIncomeTable({ data, onChange }: { data: BusinessIncomeRow[]; onChange: (d: BusinessIncomeRow[]) => void }) {
  const totalAlloc = data.reduce((s, r) => s + (Number(r.contractAllocation) || 0), 0);
  const totalPlan = data.reduce((s, r) => s + (Number(r.planConfirmed) || 0), 0);
  return (
    <Section
      title="业务收入列表"
      summary={
        <div>
          业务收入列表合计 合同分摊总金额(含税):
          <span className="text-blue-600 font-semibold"> {formatNum(totalAlloc)}元</span>  计划确认总金额(含税):
          <span className="text-blue-600 font-semibold"> {formatNum(totalPlan)}元</span>
        </div>
      }
    >
      <thead>
        <tr>
          <Th>序号</Th>
          <Th>业务收入对象</Th>
          <Th>所属分类</Th>
          <Th>客户发票税点</Th>
          <Th>周期性/非周期性</Th>
          <Th>列收方式-总额法/净额法</Th>
          <Th>列收方式-时段法/时点法</Th>
          <Th>业务模式</Th>
          <Th>列收方式-投入法/产出法</Th>
          <Th align="right">合同分摊总金额(含税)</Th>
          <Th align="right">计划确认总金额(含税)</Th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={row.id} className="hover:bg-gray-50">
            <td className="px-3 py-2 border-r border-b border-gray-100 text-center text-xs">{i + 1}</td>
            <EditableCell value={row.incomeObject} onChange={(v) => { const a = [...data]; a[i] = { ...row, incomeObject: v }; onChange(a); }} />
            <EditableCell value={row.category} onChange={(v) => { const a = [...data]; a[i] = { ...row, category: v }; onChange(a); }} />
            <EditableCell value={row.taxRate} onChange={(v) => { const a = [...data]; a[i] = { ...row, taxRate: v }; onChange(a); }} />
            <EditableCell value={row.period} type="select" options={["周期性", "非周期性"]} onChange={(v) => { const a = [...data]; a[i] = { ...row, period: v }; onChange(a); }} />
            <EditableCell value={row.methodGrossNet} onChange={(v) => { const a = [...data]; a[i] = { ...row, methodGrossNet: v }; onChange(a); }} />
            <EditableCell value={row.methodTimePeriod} type="select" options={["时点", "时段"]} onChange={(v) => { const a = [...data]; a[i] = { ...row, methodTimePeriod: v }; onChange(a); }} />
            <EditableCell value={row.bizModel} onChange={(v) => { const a = [...data]; a[i] = { ...row, bizModel: v }; onChange(a); }} />
            <EditableCell value={row.methodInputOutput} type="select" options={["投入法", "产出法", "不涉及"]} onChange={(v) => { const a = [...data]; a[i] = { ...row, methodInputOutput: v }; onChange(a); }} />
            <EditableCell value={row.contractAllocation} type="number" align="right" onChange={(v) => { const a = [...data]; a[i] = { ...row, contractAllocation: v }; onChange(a); }} />
            <EditableCell value={row.planConfirmed} type="number" align="right" onChange={(v) => { const a = [...data]; a[i] = { ...row, planConfirmed: v }; onChange(a); }} />
          </tr>
        ))}
      </tbody>
    </Section>
  );
}

// ========== 里程碑计划视图 ==========
function MilestonePlanView({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div className="space-y-4">
      <Section title="里程碑节点">
        <thead>
          <tr>
            <Th>*项目里程碑</Th>
            <Th>预计达成时间</Th>
          </tr>
        </thead>
        <tbody>
          {data.nodes.map((row: MilestoneNodeRow, i: number) => (
            <tr key={i} className="hover:bg-gray-50">
              <EditableCell
                value={row.name}
                onChange={(v) => {
                  const nodes = [...data.nodes];
                  nodes[i] = { ...row, name: v };
                  onChange({ ...data, nodes });
                }}
              />
              <EditableCell
                value={row.expectedDate}
                type="date"
                onChange={(v) => {
                  const nodes = [...data.nodes];
                  nodes[i] = { ...row, expectedDate: v };
                  onChange({ ...data, nodes });
                }}
              />
            </tr>
          ))}
        </tbody>
      </Section>

      <Section title="非周期性里程碑计划">
        <thead>
          <tr>
            <Th>业务收入对象</Th>
            <Th>列收方式-时段法/时点法</Th>
            <Th>列收方式-总额法/净额法</Th>
            <Th>业务模式</Th>
            <Th>列收方式-投入法/产出法</Th>
            <Th align="right">合同分摊总金额(含税)</Th>
            <Th align="right">计划确认总金额(含税)</Th>
            <Th>客户发票税点</Th>
            <Th>*对应里程碑</Th>
            <Th>对应时间</Th>
            <Th>对应账期</Th>
            <Th>合同分摊对象</Th>
          </tr>
        </thead>
        <tbody>
          {data.nonPeriodic.map((row: MilestoneNonPeriodicRow, i: number) => (
            <tr key={row.id} className="hover:bg-gray-50">
              <EditableCell value={row.incomeObject} onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, incomeObject: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.methodTimePeriod} onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, methodTimePeriod: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.methodGrossNet} onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, methodGrossNet: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.bizModel} onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, bizModel: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.methodInputOutput} onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, methodInputOutput: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.contractAllocation} type="number" align="right" onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, contractAllocation: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.planConfirmed} type="number" align="right" onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, planConfirmed: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.taxRate} onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, taxRate: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.milestone} onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, milestone: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.date} type="date" onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, date: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.period} onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, period: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.allocationObject} onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, allocationObject: v }; onChange({ ...data, nonPeriodic: a }); }} />
            </tr>
          ))}
        </tbody>
      </Section>

      <Section title="周期性里程碑计划(一般为等额且按月确认)">
        <thead>
          <tr>
            <Th>业务收入对象</Th>
            <Th>列收方式-时段法/时点法</Th>
            <Th>列收方式-总额法/净额法</Th>
            <Th>业务模式</Th>
            <Th>列收方式-投入法/产出法</Th>
            <Th align="right">合同分摊总金额(含税)</Th>
            <Th align="right">计划确认总金额(含税)</Th>
            <Th>客户发票税点</Th>
            <Th>*对应里程碑(开始)</Th>
            <Th>*对应里程碑(结束)</Th>
            <Th>开始时间</Th>
            <Th>开始账期</Th>
            <Th>合同分摊对象</Th>
          </tr>
        </thead>
        <tbody>
          {data.periodic.map((row: MilestonePeriodicRow, i: number) => (
            <tr key={row.id} className="hover:bg-gray-50">
              <EditableCell value={row.incomeObject} onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, incomeObject: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.methodTimePeriod} onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, methodTimePeriod: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.methodGrossNet} onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, methodGrossNet: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.bizModel} onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, bizModel: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.methodInputOutput} onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, methodInputOutput: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.contractAllocation} type="number" align="right" onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, contractAllocation: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.planConfirmed} type="number" align="right" onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, planConfirmed: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.taxRate} onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, taxRate: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.milestoneStart} onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, milestoneStart: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.milestoneEnd} onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, milestoneEnd: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.startDate} type="date" onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, startDate: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.startPeriod} onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, startPeriod: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.allocationObject} onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, allocationObject: v }; onChange({ ...data, periodic: a }); }} />
            </tr>
          ))}
        </tbody>
      </Section>
    </div>
  );
}

// ========== 收入计划视图 ==========
function RevenuePlanView({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div className="space-y-4">
      <Section title="收入计划-非周期性">
        <thead>
          <tr>
            <Th>序号</Th>
            <Th>*收费省</Th>
            <Th>*收费市</Th>
            <Th>对方名称</Th>
            <Th>利润中心</Th>
            <Th>省端产品编码</Th>
            <Th>产品编码</Th>
            <Th>产品名称</Th>
            <Th>业务类型</Th>
            <Th align="right">合同分摊金额(元)</Th>
            <Th align="right">合同分摊金额(不含税)</Th>
            <Th>*发票种类</Th>
            <Th>*税率</Th>
            <Th align="right">计划确认总金额(含税)</Th>
            <Th align="right">计划确认总金额(不含税)</Th>
            <Th>*预计确认日期</Th>
          </tr>
        </thead>
        <tbody>
          {data.nonPeriodic.map((row: RevenuePlanNonPeriodicRow, i: number) => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 border-r border-b border-gray-100 text-center text-xs">{i + 1}</td>
              <EditableCell value={row.province} onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, province: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.city} onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, city: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.partyName} onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, partyName: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.profitCenter} onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, profitCenter: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.productCode} onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, productCode: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.productName} onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, productName: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.bizType} onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, bizType: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.contractAllocAmount} type="number" align="right" onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, contractAllocAmount: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.contractAllocAmountNoTax} type="number" align="right" onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, contractAllocAmountNoTax: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.invoiceType} onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, invoiceType: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.taxRate} onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, taxRate: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.planConfirmAmount} type="number" align="right" onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, planConfirmAmount: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.planConfirmAmountNoTax} type="number" align="right" onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, planConfirmAmountNoTax: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.expectedConfirmDate} type="date" onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, expectedConfirmDate: v }; onChange({ ...data, nonPeriodic: a }); }} />
            </tr>
          ))}
        </tbody>
      </Section>

      <Section title="收入计划-周期性">
        <thead>
          <tr>
            <Th>序号</Th>
            <Th>*收费省</Th>
            <Th>*收费市</Th>
            <Th>对方名称</Th>
            <Th>利润中心</Th>
            <Th>产品编码</Th>
            <Th>*发票种类</Th>
            <Th>*税率</Th>
            <Th align="right">单价</Th>
            <Th>数量</Th>
            <Th align="right">确认金额(含税)</Th>
            <Th align="right">确认金额(不含税)</Th>
            <Th>*起始日期</Th>
            <Th>*频率(月)</Th>
            <Th>*终止日期</Th>
          </tr>
        </thead>
        <tbody>
          {data.periodic.map((row: RevenuePlanPeriodicRow, i: number) => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 border-r border-b border-gray-100 text-center text-xs">{i + 1}</td>
              <EditableCell value={row.province} onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, province: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.city} onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, city: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.partyName} onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, partyName: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.profitCenter} onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, profitCenter: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.productCode} onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, productCode: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.invoiceType} onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, invoiceType: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.taxRate} onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, taxRate: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.unitPrice} type="number" align="right" onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, unitPrice: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.qty} type="number" onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, qty: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.confirmAmount} type="number" align="right" onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, confirmAmount: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.confirmAmountNoTax} type="number" align="right" onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, confirmAmountNoTax: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.startDate} type="date" onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, startDate: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.frequency} type="number" onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, frequency: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.endDate} type="date" onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, endDate: v }; onChange({ ...data, periodic: a }); }} />
            </tr>
          ))}
        </tbody>
      </Section>
    </div>
  );
}

// ========== 收款计划视图 ==========
function CollectionPlanView({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div className="space-y-4">
      <Section title="收款计划-非周期性">
        <thead>
          <tr>
            <Th>序号</Th>
            <Th>对方名称</Th>
            <Th>第N次</Th>
            <Th>履约要求</Th>
            <Th>里程碑节点</Th>
            <Th>预计里程碑日期</Th>
            <Th>付款延展期限(月)</Th>
            <Th>预计收款日期</Th>
            <Th>合同约定缴费期(月)</Th>
            <Th align="right">约定收款比例(%)</Th>
            <Th align="right">约定收款金额(元)</Th>
            <Th>收款触发系统</Th>
          </tr>
        </thead>
        <tbody>
          {data.nonPeriodic.map((row: CollectionPlanNonPeriodicRow, i: number) => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 border-r border-b border-gray-100 text-center text-xs">{i + 1}</td>
              <EditableCell value={row.partyName} onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, partyName: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.seq} type="number" onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, seq: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.performanceReq} type="select" options={["预付款", "进度款", "初验款", "终验款", "维保款"]} onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, performanceReq: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.milestone} onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, milestone: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.expectedMilestoneDate} type="date" onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, expectedMilestoneDate: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.payExtendMonth} type="number" onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, payExtendMonth: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.expectedCollectionDate} type="date" onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, expectedCollectionDate: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.contractPayPeriodMonth} type="number" onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, contractPayPeriodMonth: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.collectionRatio} type="number" align="right" onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, collectionRatio: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.collectionAmount} type="number" align="right" onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, collectionAmount: v }; onChange({ ...data, nonPeriodic: a }); }} />
              <EditableCell value={row.triggerSystem} onChange={(v) => { const a = [...data.nonPeriodic]; a[i] = { ...row, triggerSystem: v }; onChange({ ...data, nonPeriodic: a }); }} />
            </tr>
          ))}
        </tbody>
      </Section>

      <Section title="收款计划-周期性">
        <thead>
          <tr>
            <Th>序号</Th>
            <Th>对方名称</Th>
            <Th>合同履约起始日期</Th>
            <Th>合同履约终止日期</Th>
            <Th>周期方式</Th>
            <Th>频率</Th>
            <Th>预计收款起始日期</Th>
            <Th>合同约定缴费期(月)</Th>
            <Th align="right">每期金额</Th>
            <Th align="right">金额合计</Th>
            <Th>收款触发系统</Th>
          </tr>
        </thead>
        <tbody>
          {data.periodic.map((row: CollectionPlanPeriodicRow, i: number) => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 border-r border-b border-gray-100 text-center text-xs">{i + 1}</td>
              <EditableCell value={row.partyName} onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, partyName: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.contractStartDate} type="date" onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, contractStartDate: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.contractEndDate} type="date" onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, contractEndDate: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.periodType} type="select" options={["月", "季", "半年", "年"]} onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, periodType: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.frequency} type="number" onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, frequency: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.expectedStartDate} type="date" onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, expectedStartDate: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.contractPayPeriodMonth} type="number" onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, contractPayPeriodMonth: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.perAmount} type="number" align="right" onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, perAmount: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.totalAmount} type="number" align="right" onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, totalAmount: v }; onChange({ ...data, periodic: a }); }} />
              <EditableCell value={row.triggerSystem} onChange={(v) => { const a = [...data.periodic]; a[i] = { ...row, triggerSystem: v }; onChange({ ...data, periodic: a }); }} />
            </tr>
          ))}
        </tbody>
      </Section>
    </div>
  );
}
