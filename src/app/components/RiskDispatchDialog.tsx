import React, { useState } from "react";
import { X, Maximize2, Minimize2, Upload, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface RiskDispatchDialogProps {
  open: boolean;
  onClose: () => void;
  rowData: any;
}

type StepKey = "dispatch" | "cityBiz" | "cityFinance" | "otherCityExpert" | "provinceBiz" | "provinceFinance" | "violation";

interface StepInfo {
  key: StepKey;
  label: string;
  description: string;
}

const steps: StepInfo[] = [
  { key: "dispatch", label: "省业务派单", description: "填写派单信息" },
  { key: "cityBiz", label: "地市政企", description: "核实项目信息" },
  { key: "cityFinance", label: "地市财务", description: "财务风险说明" },
  { key: "otherCityExpert", label: "其他地市专家财务", description: "专家财务审核" },
  { key: "provinceBiz", label: "省业务", description: "省业务复核" },
  { key: "provinceFinance", label: "省财务", description: "省财务审核" },
  { key: "violation", label: "违规处理", description: "违规认定" },
];

// 财务答复步骤共用的表单组件
function FinanceReplyForm({
  label,
  financeNote,
  setFinanceNote,
  isAgree,
  setIsAgree,
}: {
  label: string;
  financeNote: string;
  setFinanceNote: (v: string) => void;
  isAgree: string;
  setIsAgree: (v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-gray-600 mb-1.5">
          <span className="text-red-500">*</span> 是否同意
        </label>
        <Select value={isAgree} onValueChange={setIsAgree}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="请选择" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">是</SelectItem>
            <SelectItem value="no">否</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1.5">
          <span className="text-red-500">*</span> {label}
        </label>
        <Textarea
          value={financeNote}
          onChange={(e) => setFinanceNote(e.target.value)}
          placeholder="请输入财务风险说明"
          rows={8}
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1.5">
          <span className="text-red-500">*</span> 附件
        </label>
        <Button variant="outline" className="h-9">
          <Upload className="w-4 h-4 mr-2" />
          点击上传
        </Button>
        <p className="text-xs text-gray-500 mt-1">支持pdf、doc、docx、xls、xlsx格式，文件大小不超过20MB</p>
      </div>
    </div>
  );
}

export function RiskDispatchDialog({ open, onClose, rowData }: RiskDispatchDialogProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeStep, setActiveStep] = useState<StepKey>("dispatch");

  // 派单表单
  const [dispatchNote, setDispatchNote] = useState("");
  const [cityBizHandler, setCityBizHandler] = useState("");

  // 地市政企答复表单
  const [isFakeTrade, setIsFakeTrade] = useState("");
  const [isInfoError, setIsInfoError] = useState("");
  const [isTerminate, setIsTerminate] = useState("");
  const [isNetIncome, setIsNetIncome] = useState("");
  const [netIncomeAmount, setNetIncomeAmount] = useState("0");
  const [netIncomeDate, setNetIncomeDate] = useState("");
  const [forwardCustomerType, setForwardCustomerType] = useState("");
  const [backSupplierCount, setBackSupplierCount] = useState("");
  const [isPublicBid, setIsPublicBid] = useState("");
  const [hardwareRatio, setHardwareRatio] = useState("");
  const [hardwareAccount, setHardwareAccount] = useState("");
  const [isForwardFinalCustomer, setIsForwardFinalCustomer] = useState("");
  const [isFinalCustomerBid, setIsFinalCustomerBid] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isDeliveryInProvince, setIsDeliveryInProvince] = useState("");
  const [hasSelfOwnedAbility, setHasSelfOwnedAbility] = useState("");
  const [noSelfOwnedContent, setNoSelfOwnedContent] = useState("");
  const [isSingleSource, setIsSingleSource] = useState("");
  const [isNotSubcontracted, setIsNotSubcontracted] = useState("");
  const [forwardAcceptDate, setForwardAcceptDate] = useState("");
  const [backAcceptDate, setBackAcceptDate] = useState("");
  const [customerManager, setCustomerManager] = useState("");
  const [customerManagerPhone, setCustomerManagerPhone] = useState("");
  const [projectManager, setProjectManager] = useState("");
  const [projectManagerPhone, setProjectManagerPhone] = useState("");
  const [solutionManager, setSolutionManager] = useState("");
  const [solutionManagerPhone, setSolutionManagerPhone] = useState("");

  // 地市财务答复 + 其他地市专家财务 + 省财务 共用
  const [cityFinanceNote, setCityFinanceNote] = useState("");
  const [cityFinanceIsAgree, setCityFinanceIsAgree] = useState("");
  const [otherCityExpertFinanceNote, setOtherCityExpertFinanceNote] = useState("");
  const [otherCityExpertFinanceIsAgree, setOtherCityExpertFinanceIsAgree] = useState("");
  const [provinceFinanceNote, setProvinceFinanceNote] = useState("");
  const [provinceFinanceIsAgree, setProvinceFinanceIsAgree] = useState("");

  // 省业务复核表单
  const [reviewNote, setReviewNote] = useState("");
  const [isContentComplete, setIsContentComplete] = useState("");
  const [isRectified, setIsRectified] = useState("");

  // 违规处理表单
  const [isViolation, setIsViolation] = useState("");
  const [violationType, setViolationType] = useState("");
  const [violationSubject, setViolationSubject] = useState("");
  const [violationCode, setViolationCode] = useState("");
  const [violationPhone, setViolationPhone] = useState("");
  const [harmAmount, setHarmAmount] = useState("");
  const [isAccountable, setIsAccountable] = useState("");
  const [accountableMethod, setAccountableMethod] = useState("");
  const [penaltyAmount, setPenaltyAmount] = useState("");
  const [recoveredAmount, setRecoveredAmount] = useState("");
  const [disposalOpinion, setDisposalOpinion] = useState("");

  const handleSubmit = () => {
    console.log("提交派单");
    onClose();
  };

  const currentStepIndex = steps.findIndex(s => s.key === activeStep);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl flex flex-col transition-all duration-300"
        style={{
          width: isFullscreen ? "98vw" : "95vw",
          height: isFullscreen ? "98vh" : "90vh",
          maxWidth: "98vw",
          maxHeight: "98vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <span className="text-base font-medium text-gray-900">派单下发</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-1 hover:bg-gray-100 rounded">
              {isFullscreen ? <Minimize2 className="w-4 h-4 text-gray-500" /> : <Maximize2 className="w-4 h-4 text-gray-500" />}
            </button>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* 步骤条 */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.key}>
                <button
                  onClick={() => setActiveStep(step.key)}
                  className="flex flex-col items-center min-w-[100px] cursor-pointer"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1 transition-colors ${
                    index < currentStepIndex
                      ? "bg-green-500 text-white"
                      : index === currentStepIndex
                        ? "bg-[#1890ff] text-white"
                        : "bg-gray-200 text-gray-500"
                  }`}>
                    {index < currentStepIndex ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className={`text-xs font-medium text-center leading-tight ${
                    index === currentStepIndex ? "text-[#1890ff]" : "text-gray-600"
                  }`}>{step.label}</span>
                  <span className="text-xs text-gray-400 text-center leading-tight mt-0.5">{step.description}</span>
                </button>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 ${
                    index < currentStepIndex ? "bg-green-500" : "bg-gray-200"
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-auto p-6">
          {/* 1. 省业务派单 */}
          {activeStep === "dispatch" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">疑似风险详情</h3>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">风险类型</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">风险分值</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">风险模型</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">分值</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">发现时间</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">风险主体类型</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">风险主体</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">风险描述</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">风险状态</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-200">
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">信用评级</td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">300</td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">企业无自有能力风险</td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">100</td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">2025-09-25 16:13:11</td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">供应商</td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">陕西天润科技股份有限公司</td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap max-w-[200px] truncate">陕西天润科技股份有限公司作为供应商...</td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">有效</td>
                      </tr>
                      {rowData?.riskModel?.includes("空壳") && (
                        <tr className="border-t border-gray-200">
                          <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">疑似空壳</td>
                          <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">200</td>
                          <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">空壳企业风险_异地经营</td>
                          <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">200</td>
                          <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">2025-11-14 00:16:08</td>
                          <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">供应商</td>
                          <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">-</td>
                          <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">-</td>
                          <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">-</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">派单信息填写</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">派单说明</label>
                    <Textarea
                      value={dispatchNote}
                      onChange={(e) => setDispatchNote(e.target.value)}
                      placeholder="请输入派单说明"
                      rows={3}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">附件</label>
                    <Button variant="outline" className="h-9">
                      <Upload className="w-4 h-4 mr-2" />
                      点击上传
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">支持pdf、doc、docx、xls、xlsx格式，文件大小不超过20MB</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">
                      <span className="text-red-500">*</span> 地市政企处理人
                    </label>
                    <Select value={cityBizHandler} onValueChange={setCityBizHandler}>
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="请选择处理人" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yuya">余娅</SelectItem>
                        <SelectItem value="liming">李明</SelectItem>
                        <SelectItem value="zhangsan">张三</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. 地市政企 */}
          {activeStep === "cityBiz" && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    <span className="text-red-500">*</span> 是否确认该项目是虚假贸易业务
                  </label>
                  <Select value={isFakeTrade} onValueChange={setIsFakeTrade}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">是</SelectItem>
                      <SelectItem value="no">否</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    <span className="text-red-500">*</span> 是否项目信息有误
                  </label>
                  <Select value={isInfoError} onValueChange={setIsInfoError}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">是</SelectItem>
                      <SelectItem value="no">否</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    <span className="text-red-500">*</span> 是否终止或取消项目
                  </label>
                  <Select value={isTerminate} onValueChange={setIsTerminate}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">是</SelectItem>
                      <SelectItem value="no">否</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    <span className="text-red-500">*</span> 是否净额列收
                  </label>
                  <Select value={isNetIncome} onValueChange={setIsNetIncome}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">是</SelectItem>
                      <SelectItem value="no">否</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">净额整改冲减收入金额（万元）</label>
                  <Input type="number" value={netIncomeAmount} onChange={(e) => setNetIncomeAmount(e.target.value)} placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">净额整改冲减收入时间</label>
                  <Input type="date" value={netIncomeDate} onChange={(e) => setNetIncomeDate(e.target.value)} />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-4">【请填写以下项目信息】</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">
                      <span className="text-red-500">*</span> 前向客户性质
                    </label>
                    <Select value={forwardCustomerType} onValueChange={setForwardCustomerType}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="请选择" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="central">央国企</SelectItem>
                        <SelectItem value="private">民营企业</SelectItem>
                        <SelectItem value="government">政府机关</SelectItem>
                        <SelectItem value="other">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">
                      <span className="text-red-500">*</span> 后向供应商数量
                    </label>
                    <Input type="number" value={backSupplierCount} onChange={(e) => setBackSupplierCount(e.target.value)} placeholder="请输入" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">
                      <span className="text-red-500">*</span> 项目是否公开招标
                    </label>
                    <Select value={isPublicBid} onValueChange={setIsPublicBid}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="请选择" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">是</SelectItem>
                        <SelectItem value="no">否</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">
                      <span className="text-red-500">*</span> 项目硬件收入占比
                    </label>
                    <Input type="number" value={hardwareRatio} onChange={(e) => setHardwareRatio(e.target.value)} placeholder="请输入" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">项目硬件收入列收科目</label>
                    <Input value={hardwareAccount} onChange={(e) => setHardwareAccount(e.target.value)} placeholder="请输入" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">
                      <span className="text-red-500">*</span> 前向客户是否最终客户
                    </label>
                    <Select value={isForwardFinalCustomer} onValueChange={setIsForwardFinalCustomer}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="请选择" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">是</SelectItem>
                        <SelectItem value="no">否</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">
                      <span className="text-red-500">*</span> 最终客户是否公开招标
                    </label>
                    <Select value={isFinalCustomerBid} onValueChange={setIsFinalCustomerBid}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="请选择" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">是</SelectItem>
                        <SelectItem value="no">否</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-600 mb-1.5">
                      <span className="text-red-500">*</span> 项目实施交付的具体地点（详细地址）
                    </label>
                    <Input value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="请输入详细地址" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">
                      <span className="text-red-500">*</span> 项目实施交付是否省内
                    </label>
                    <Select value={isDeliveryInProvince} onValueChange={setIsDeliveryInProvince}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="请选择" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">是</SelectItem>
                        <SelectItem value="no">否</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">
                      <span className="text-red-500">*</span> 项目是否含电信自有能力/产品
                    </label>
                    <Select value={hasSelfOwnedAbility} onValueChange={setHasSelfOwnedAbility}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="请选择" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">是</SelectItem>
                        <SelectItem value="no">否</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-600 mb-1.5">项目不含自有能力/产品内容</label>
                    <Textarea value={noSelfOwnedContent} onChange={(e) => setNoSelfOwnedContent(e.target.value)} placeholder="请输入" rows={2} className="w-full" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">
                      <span className="text-red-500">*</span> 后向供应商是否单一来源采购
                    </label>
                    <Select value={isSingleSource} onValueChange={setIsSingleSource}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="请选择" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">是</SelectItem>
                        <SelectItem value="no">否</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">
                      <span className="text-red-500">*</span> 供应商是否最终供应商
                    </label>
                    <Select value={isNotSubcontracted} onValueChange={setIsNotSubcontracted}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="请选择" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">是</SelectItem>
                        <SelectItem value="no">否</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">前向验收日期</label>
                    <Input type="date" value={forwardAcceptDate} onChange={(e) => setForwardAcceptDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">后向验收日期</label>
                    <Input type="date" value={backAcceptDate} onChange={(e) => setBackAcceptDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">客户经理姓名</label>
                    <Input value={customerManager} onChange={(e) => setCustomerManager(e.target.value)} placeholder="请输入" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">客户经理电话</label>
                    <Input value={customerManagerPhone} onChange={(e) => setCustomerManagerPhone(e.target.value)} placeholder="请输入" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">项目经理姓名</label>
                    <Input value={projectManager} onChange={(e) => setProjectManager(e.target.value)} placeholder="请输入" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">项目经理电话</label>
                    <Input value={projectManagerPhone} onChange={(e) => setProjectManagerPhone(e.target.value)} placeholder="请输入" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">解决方案经理姓名</label>
                    <Input value={solutionManager} onChange={(e) => setSolutionManager(e.target.value)} placeholder="请输入" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">解决方案经理电话</label>
                    <Input value={solutionManagerPhone} onChange={(e) => setSolutionManagerPhone(e.target.value)} placeholder="请输入" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm text-gray-600 mb-1.5">
                    <span className="text-red-500">*</span> "六必有"等证明材料
                  </label>
                  <Button variant="outline" className="h-9">
                    <Upload className="w-4 h-4 mr-2" />
                    点击上传
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">支持pdf、doc、docx、xls、xlsx格式，文件大小不超过20MB</p>
                </div>
              </div>
            </div>
          )}

          {/* 3. 地市财务 */}
          {activeStep === "cityFinance" && (
            <FinanceReplyForm
              label="地市财务风险说明"
              financeNote={cityFinanceNote}
              setFinanceNote={setCityFinanceNote}
              isAgree={cityFinanceIsAgree}
              setIsAgree={setCityFinanceIsAgree}
            />
          )}

          {/* 4. 其他地市专家财务 */}
          {activeStep === "otherCityExpert" && (
            <FinanceReplyForm
              label="其他地市专家财务风险说明"
              financeNote={otherCityExpertFinanceNote}
              setFinanceNote={setOtherCityExpertFinanceNote}
              isAgree={otherCityExpertFinanceIsAgree}
              setIsAgree={setOtherCityExpertFinanceIsAgree}
            />
          )}

          {/* 5. 省业务复核 */}
          {activeStep === "provinceBiz" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">
                  <span className="text-red-500">*</span> 风险反馈确认说明
                </label>
                <Textarea
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="请输入风险反馈确认说明"
                  rows={8}
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    <span className="text-red-500">*</span> 风险反馈内容是否完整
                  </label>
                  <Select value={isContentComplete} onValueChange={setIsContentComplete}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">是</SelectItem>
                      <SelectItem value="no">否</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    <span className="text-red-500">*</span> 反馈内容是否已整改
                  </label>
                  <Select value={isRectified} onValueChange={setIsRectified}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">是</SelectItem>
                      <SelectItem value="no">否</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* 6. 省财务 */}
          {activeStep === "provinceFinance" && (
            <FinanceReplyForm
              label="省财务风险说明"
              financeNote={provinceFinanceNote}
              setFinanceNote={setProvinceFinanceNote}
              isAgree={provinceFinanceIsAgree}
              setIsAgree={setProvinceFinanceIsAgree}
            />
          )}

          {/* 7. 违规处理 */}
          {activeStep === "violation" && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">是否违规</label>
                  <Select value={isViolation} onValueChange={setIsViolation}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">是</SelectItem>
                      <SelectItem value="no">否</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    <span className="text-red-500">*</span> 违规主体类型
                  </label>
                  <Select value={violationType} onValueChange={setViolationType}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="person">个人</SelectItem>
                      <SelectItem value="company">单位</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    <span className="text-red-500">*</span> 违规人员/单位
                  </label>
                  <Input value={violationSubject} onChange={(e) => setViolationSubject(e.target.value)} placeholder="请输入" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    <span className="text-red-500">*</span> 违规人员/单位编码
                  </label>
                  <Input value={violationCode} onChange={(e) => setViolationCode(e.target.value)} placeholder="请输入" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    <span className="text-red-500">*</span> 违规人员手机号码
                  </label>
                  <Input value={violationPhone} onChange={(e) => setViolationPhone(e.target.value)} placeholder="请输入" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    <span className="text-red-500">*</span> 侵害涉及金额（元）
                  </label>
                  <Input type="number" value={harmAmount} onChange={(e) => setHarmAmount(e.target.value)} placeholder="请输入" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    <span className="text-red-500">*</span> 业务部门是否追责问责
                  </label>
                  <Select value={isAccountable} onValueChange={setIsAccountable}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">是</SelectItem>
                      <SelectItem value="no">否</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    <span className="text-red-500">*</span> 追责问责方式
                  </label>
                  <Select value={accountableMethod} onValueChange={setAccountableMethod}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warning">警告</SelectItem>
                      <SelectItem value="deduction">扣绩效</SelectItem>
                      <SelectItem value="dismiss">开除</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    <span className="text-red-500">*</span> 经济处罚金额（元）
                  </label>
                  <Input type="number" value={penaltyAmount} onChange={(e) => setPenaltyAmount(e.target.value)} placeholder="请输入" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    <span className="text-red-500">*</span> 挽回经济损失金额（元）
                  </label>
                  <Input type="number" value={recoveredAmount} onChange={(e) => setRecoveredAmount(e.target.value)} placeholder="请输入" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">
                  <span className="text-red-500">*</span> 风险明细处置意见
                </label>
                <Textarea
                  value={disposalOpinion}
                  onChange={(e) => setDisposalOpinion(e.target.value)}
                  placeholder="请输入风险明细处置意见"
                  rows={4}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="text-sm text-gray-500">
            步骤 {currentStepIndex + 1} / {steps.length}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose}>
              取消
            </Button>
            {currentStepIndex > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  const prevStep = steps[currentStepIndex - 1];
                  setActiveStep(prevStep.key);
                }}
              >
                上一步
              </Button>
            )}
            {currentStepIndex < steps.length - 1 ? (
              <Button
                onClick={() => {
                  const nextStep = steps[currentStepIndex + 1];
                  setActiveStep(nextStep.key);
                }}
                className="bg-[#1890ff] hover:bg-[#0d7dea] text-white"
              >
                下一步
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-[#1890ff] hover:bg-[#0d7dea] text-white">
                提交派单
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
