import React, { useState } from "react";
import { Button } from "./ui/button";
import { X, ChevronDown, ChevronRight, Plus } from "lucide-react";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

// Mock数据常量
const initialMockData = {
  // 客户档案
  customerArchive: {
    customerName: "杭州某某科技有限公司",
    address: "浙江省杭州市西湖区文三路123号",
    contact: "张三",
    contactPhone: "138****1234",
    manager: "李四"
  },
  // 拜访信息
  visitRecords: [
    {
      id: 1,
      customerUnit: "杭州某某科技有限公司",
      contact: "张三",
      purpose: "商机跟进",
      date: "2026-04-15",
      location: "客户会议室",
      visitor: "李四、王五",
      photo: "已上传"
    },
    {
      id: 2,
      customerUnit: "杭州某某科技有限公司",
      contact: "张三",
      purpose: "需求沟通",
      date: "2026-04-10",
      location: "客户办公室",
      visitor: "李四",
      photo: "已上传"
    }
  ],
  // 商机录入
  opportunity: {
    opportunityName: "XX单位信息化建设采购项目",
    opportunityCode: "JHTB-2026-001",
    entryTime: "2026-04-10",
    isEarlyEntry: "是",
    biddingTime: "2026-04-15",
    signTime: "-"
  },
  // 近三年信息化项目
  threeYearProjects: [
    {
      id: 1,
      contractName: "XX医院信息化建设一期项目",
      contractCode: "HT-2024-001",
      signTime: "2024-03-15",
      amount: "¥5,800,000",
      vendor: "杭州某某科技有限公司"
    },
    {
      id: 2,
      contractName: "XX学校智慧校园建设项目",
      contractCode: "HT-2023-008",
      signTime: "2023-11-20",
      amount: "¥3,200,000",
      vendor: "浙江某某信息技术有限公司"
    },
    {
      id: 3,
      contractName: "XX政府办公自动化系统",
      contractCode: "HT-2022-015",
      signTime: "2022-06-08",
      amount: "¥1,500,000",
      vendor: "杭州某某科技有限公司"
    }
  ],
  // 客情掌握其它附件（支持多个）
  otherAttachments: [] as { name: string; size: string; uploadTime: string }[],
  // 组建团队
  teamMembers: [
    { id: 1, roleType: "第一责任人", userName: "张明", role: "项目经理", department: "政企客户部", entryTime: "2026-04-10", phone: "138****1234", inviter: "王总" },
    { id: 2, roleType: "客户经理", userName: "李华", role: "客户经理", department: "政企客户部", entryTime: "2026-04-10", phone: "139****5678", inviter: "张明" },
    { id: 3, roleType: "解决方案经理", userName: "王芳", role: "解决方案经理", department: "解决方案部", entryTime: "2026-04-11", phone: "137****9012", inviter: "张明" },
    { id: 4, roleType: "项目经理", userName: "赵强", role: "技术经理", department: "项目管理部", entryTime: "2026-04-12", phone: "136****3456", inviter: "张明" }
  ],
  // 方案设计与审核（支持多个文件）
  solutionDesign: {
    solutionDoc: [{ name: "XX项目解决方案文档.pdf", size: "2.5 MB", uploadTime: "2026-04-15 10:30", synced: true }] as { name: string; size: string; uploadTime: string; synced: boolean }[],
    reviewRecord: [] as { name: string; size: string; uploadTime: string; synced: boolean }[],
    seminarRecord: [] as { name: string; size: string; uploadTime: string; synced: boolean }[],
    feasibilityReport: [] as { name: string; size: string; uploadTime: string; synced: boolean }[],
    customerCommunicationRecord: [] as { name: string; size: string; uploadTime: string; synced: boolean }[]
  },
  // 项目实施总体设计
  projectOverallDesign: {
    overallPlanDoc: [] as { name: string; size: string; uploadTime: string; synced: boolean }[],
    supervisorReport: [] as { name: string; size: string; uploadTime: string }[],
    supervisorLog: [] as { name: string; size: string; uploadTime: string }[]
  },
  // 具备变更记录
  changeRecord: {
    changeContent: [] as { name: string; size: string; uploadTime: string; synced: boolean }[],
    changeReview: [] as { name: string; size: string; uploadTime: string; synced: boolean }[]
  },
  // 具备验收报告
  acceptanceReport: {
    initialAcceptance: [] as { name: string; size: string; uploadTime: string; synced: boolean }[],
    finalAcceptance: [] as { name: string; size: string; uploadTime: string; synced: boolean }[],
    progressForm: [] as { name: string; size: string; uploadTime: string; synced: boolean }[],
    trialReportAcceptance: [] as { name: string; size: string; uploadTime: string; synced: boolean }[]
  },
  // 项目实施文件
  implementationDocs: {
    meetingMinutes: [] as { name: string; size: string; uploadTime: string; synced: boolean }[],
    weeklyReport: [] as { name: string; size: string; uploadTime: string; synced: boolean }[],
    delayExplanation: [] as { name: string; size: string; uploadTime: string; synced: boolean }[],
    completionReport: [] as { name: string; size: string; uploadTime: string; synced: boolean }[],
    issueMinutes: [] as { name: string; size: string; uploadTime: string; synced: boolean }[],
    rentAttach: [] as { name: string; size: string; uploadTime: string; synced: boolean }[],
    hardwareList: [] as { name: string; size: string; uploadTime: string; synced: boolean }[],
    deliveryReport: [] as { name: string; size: string; uploadTime: string; synced: boolean }[],
    transferReport: [] as { name: string; size: string; uploadTime: string; synced: boolean }[],
    trialReport: [] as { name: string; size: string; uploadTime: string; synced: boolean }[]
  },
  // 审计清单
  auditList: {
    auditCommitmentBuilder: [] as { name: string; size: string; uploadTime: string }[],
    auditBasicInfo: [] as { name: string; size: string; uploadTime: string }[],
    forwardAuditReport: [] as { name: string; size: string; uploadTime: string }[],
    auditCommitmentContractor: [] as { name: string; size: string; uploadTime: string }[],
    backwardSettlementList: [] as { name: string; size: string; uploadTime: string }[]
  },
  // 数字资产平台
  digitalAsset: {
    assetArchive: [] as { name: string; size: string; uploadTime: string; synced: boolean }[]
  },
  // 具备第一服务界面
  firstServiceInterface: {
    serviceDesk: [] as { name: string; size: string; uploadTime: string; synced: boolean }[]
  },
  // 售后其他资料
  afterSalesDocs: {
    serverResource: [] as { name: string; size: string; uploadTime: string }[],
    maintenanceGroup: [] as { name: string; size: string; uploadTime: string }[],
    trainingRecord: [] as { name: string; size: string; uploadTime: string }[],
    trainingPhoto: [] as { name: string; size: string; uploadTime: string }[],
    requirementSpec: [] as { name: string; size: string; uploadTime: string }[],
    overallDesign: [] as { name: string; size: string; uploadTime: string }[],
    detailDesign: [] as { name: string; size: string; uploadTime: string }[],
    dbDesign: [] as { name: string; size: string; uploadTime: string }[]
  }
};

interface PositionDetail {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  rule: string;
  secondLevel: SecondLevelItem[];
}

interface SecondLevelItem {
  id: string;
  name: string;
  rule: string;
  includedInSixPosition: boolean;
  thirdLevel: ThirdLevelItem[];
}

interface ThirdLevelItem {
  id: string;
  name: string;
  rule: string;
  entryPoint: string;
  syncType: string;
  includedInSixPosition: boolean;
}

const sixPositionDetails: PositionDetail[] = [
  {
    id: "customerControl",
    name: "客情掌握",
    color: "text-green-600",
    bgColor: "bg-green-500",
    rule: "客户档案+拜访信息+录入商机点亮则一级节点自动点亮",
    secondLevel: [
      {
        id: "customerArchive",
        name: "客户档案",
        rule: "三级节点均点亮则二级节点自动点亮",
        includedInSixPosition: true,
        thirdLevel: [
          { id: "archiveInfo", name: "客户档案", rule: "需具备客户名称、注册地址、客户联系人、客户联系人手机号、客户经理", entryPoint: "省内CRM、集团CRM", syncType: "具备两级" }
        ]
      },
      {
        id: "visitRecord",
        name: "拜访信息",
        rule: "三级节点均点亮则二级节点自动点亮",
        includedInSixPosition: true,
        thirdLevel: [
          { id: "visitInfo", name: "拜访信息", rule: "签约前，通过线下或线上拜访客户不少于1次，并记录与商机相关的拜访信息", entryPoint: "省内CCPM、省内LTO六到位", syncType: "具备上送" }
        ]
      },
      {
        id: "opportunity",
        name: "录入商机",
        rule: "中标或已签约商机三级节点均点亮则二级节点自动点亮",
        includedInSixPosition: true,
        thirdLevel: [
          { id: "opportunityInfo", name: "商机信息", rule: "录入商机有效性审核通过后自动具备", entryPoint: "省内LTO商机、集团BPM", syncType: "具备两级" },
          { id: "entryTime", name: "录入时间", rule: "投标项目以投标时间为界限，至少提前3天录入商机", entryPoint: "省内LTO商机、集团BPM", syncType: "具备两级" }
        ]
      },
      {
        id: "threeYearProject",
        name: "近三年信息化项目",
        rule: "三级节点均点亮则二级节点自动点亮",
        includedInSixPosition: true,
        thirdLevel: [
          { id: "threeYearInfo", name: "近三年信息化项目", rule: "具备近三年信息化项目，不必填", entryPoint: "省内自动展示", syncType: "仅省内展示" }
        ]
      },
      {
        id: "otherAttachments",
        name: "客情掌握其它附件",
        rule: "三级节点均点亮则二级节点自动点亮",
        includedInSixPosition: true,
        thirdLevel: [
          { id: "attachmentUpload", name: "客情掌握其它附件", rule: "上传客情掌握相关附件", entryPoint: "省内LTO六到位", syncType: "仅省内展示" }
        ]
      }
    ]
  },
  {
    id: "planControl",
    name: "方案总控",
    color: "text-green-600",
    bgColor: "bg-green-500",
    rule: "组建团队+方案设计与审核+方案解构与中台把关点亮则一级节点自动点亮",
    secondLevel: [
      {
        id: "teamBuilding",
        name: "组建团队",
        rule: "三级节点均点亮则二级节点自动点亮",
        includedInSixPosition: true,
        thirdLevel: [
          { id: "firstResponsible", name: "第一责任人", rule: "系统确定第一责任人后则认为具备", entryPoint: "集团BPM", syncType: "具备两级" },
          { id: "projectTeam", name: "项目团队", rule: "完成组建团队(需包含客户经理、解决方案经理、项目经理等人员)", entryPoint: "集团BPM", syncType: "具备下发" }
        ]
      },
      {
        id: "solutionDesign",
        name: "方案设计与审核",
        rule: "三级节点均点亮则二级节点自动点亮",
        includedInSixPosition: true,
        thirdLevel: [
          { id: "solutionDoc", name: "总体解决方案文档", rule: "整合自有与合作伙伴能力、方案等，完成解决方案设计并上传系统", entryPoint: "省内LTO六到位、集团BPM下发", syncType: "具备两级" },
          { id: "reviewRecord", name: "方案审核记录", rule: "将方案提交上级主管审核，记录审核结果和变化点并上传系统", entryPoint: "集团BPM下发", syncType: "具备下发" },
          { id: "customerCommunicationRecord", name: "客户方案沟通记录", rule: "上传客户方案沟通记录", entryPoint: "省内LTO六到位", syncType: "仅省内展示" }
        ]
      },
      {
        id: "solutionDeconstruct",
        name: "方案解构与中台把关",
        rule: "三级节点均点亮则二级节点自动点亮",
        includedInSixPosition: true,
        thirdLevel: [
          { id: "deconstructComplete", name: "方案解构完成 *", rule: "依托客户需求及总结解决方案文档完成方案解构并在系统内提交", entryPoint: "集团BPM下发", syncType: "具备下发" },
          { id: "reviewOpinion", name: "把关意见 *", rule: "中台把关人员把关方案批注相关意见并在系统内提交", entryPoint: "集团BPM下发", syncType: "具备下发" }
        ]
      },
      {
        id: "planControlOther",
        name: "其他",
        rule: "文件上传则认为具备",
        includedInSixPosition: false,
        thirdLevel: [
          { id: "planControlAttach", name: "方案总控其它附件", rule: "上传方案总控相关附件", entryPoint: "省内LTO六到位", syncType: "仅省内展示" }
        ]
      }
    ]
  },
  {
    id: "biddingAutonomy",
    name: "谈判/应标自主",
    color: "text-green-600",
    bgColor: "bg-green-500",
    rule: "参与投标记录+应标结果记录均点亮或商务谈判点亮则一级节点自动点亮",
    secondLevel: [
      {
        id: "biddingRecord",
        name: "参与投标记录",
        rule: "三级节点均点亮则二级节点自动点亮",
        includedInSixPosition: true,
        thirdLevel: [
          { id: "biddingProcess", name: "投标过程记录", rule: "对公开招标项目，记录自主投标过程", entryPoint: "集团BPM下发", syncType: "结构化内容具备下发" },
          { id: "forwardBiddingRecord", name: "前向投标", rule: "录入前向投标记录", entryPoint: "省内LTO商机前向投标", syncType: "仅省内展示" }
        ]
      },
      {
        id: "biddingResult",
        name: "应标结果记录",
        rule: "三级节点均点亮则二级节点自动点亮",
        includedInSixPosition: true,
        thirdLevel: [
          { id: "biddingTime", name: "中标时间", rule: "对公开招标项目，记录自主应标结果", entryPoint: "集团BPM下发", syncType: "结构化内容具备下发" },
          { id: "forwardBiddingRecord", name: "前向投标", rule: "录入前向投标记录", entryPoint: "省内LTO商机前向投标", syncType: "仅省内展示" }
        ]
      },
      {
        id: "businessNegotiation",
        name: "商务谈判",
        rule: "三级节点均点亮则二级节点自动点亮",
        includedInSixPosition: true,
        thirdLevel: [
          { id: "negotiationRecord", name: "谈判记录", rule: "对非公开开招标项目，记录自主商务谈判情况及谈判结果", entryPoint: "集团BPM下发", syncType: "结构化内容具备下发" },
          { id: "forwardBiddingRecord", name: "前向投标", rule: "录入前向投标记录", entryPoint: "省内LTO商机前向投标", syncType: "仅省内展示" }
        ]
      },
      {
        id: "forwardContract",
        name: "前向合同信息",
        rule: "三级节点均点亮则二级节点自动点亮",
        includedInSixPosition: false,
        thirdLevel: [
          { id: "contractAttachment", name: "合同附件", rule: "文件上传则认为具备", entryPoint: "省内LTO六到位", syncType: "仅省内展示" }
        ]
      },
      {
        id: "biddingAutonomyOther",
        name: "其他",
        rule: "文件上传则认为具备",
        includedInSixPosition: false,
        thirdLevel: [
          { id: "biddingAutonomyAttach", name: "谈判应标其它附件", rule: "上传谈判应标相关附件", entryPoint: "省内LTO六到位", syncType: "仅省内展示" }
        ]
      }
    ]
  },
  {
    id: "procurementAutonomy",
    name: "采购自主",
    color: "text-green-600",
    bgColor: "bg-green-500",
    rule: "标前决策会+具备业务解构+业务风险及合规审核点亮则一级节点自动点亮",
    secondLevel: [
      {
        id: "preBidDecision",
        name: "标前决策会",
        rule: "三级节点均点亮则二级节点自动点亮",
        includedInSixPosition: true,
        thirdLevel: [
          { id: "decisionResult", name: "标前决策会决议结果", rule: "召开标前决策会，记录会议结果", entryPoint: "省内LTO模式会、集团BPM", syncType: "否" },
          { id: "partnerSelection", name: "预计合作伙伴", rule: "选择合作伙伴，应尽量使用遴选、比选、公开招标、集采等方式入围的供应商", entryPoint: "省内LTO模式会、集团BPM", syncType: "否" }
        ]
      },
      {
        id: "businessDeconstruct",
        name: "具备业务解构",
        rule: "三级节点均点亮则二级节点自动点亮",
        includedInSixPosition: true,
        thirdLevel: [
          { id: "deconstructResult", name: "业务解构完成", rule: "中标/签约后基于合同完成业务解构", entryPoint: "集团BPM、省内LTO六到位", syncType: "具备下发" }
        ]
      },
      {
        id: "riskReview",
        name: "业务风险及合规审核",
        rule: "三级节点均点亮则二级节点自动点亮",
        includedInSixPosition: true,
        thirdLevel: [
          { id: "auditResult", name: "审核结果", rule: "审核合同是否存在虚假贸易风险，谨防虚假业务", entryPoint: "集团BPM、省内LTO六到位", syncType: "否" }
        ]
      },
      {
        id: "backwardDocs",
        name: "后向资料",
        rule: "三级节点均点亮则二级节点自动点亮",
        includedInSixPosition: false,
        thirdLevel: [
          { id: "backwardBidding", name: "后向招标文件", rule: "文件上传则认为具备", entryPoint: "省内LTO六到位", syncType: "仅省内展示" }
        ]
      },
      {
        id: "procurementAutonomyOther",
        name: "其他",
        rule: "文件上传则认为具备",
        includedInSixPosition: false,
        thirdLevel: [
          { id: "procurementAutonomyAttach", name: "采购自主其它附件", rule: "上传采购自主相关附件", entryPoint: "省内LTO六到位", syncType: "仅省内展示" }
        ]
      }
    ]
  },
  {
    id: "projectManagement",
    name: "项目强管控",
    color: "text-green-600",
    bgColor: "bg-green-500",
    rule: "制定总体实施方案或项目总验收报告任意一个二级节点点亮则一级节点自动点亮",
    secondLevel: [
      {
        id: "overallPlan",
        name: "具备项目实施总体设计",
        rule: "三级节点均点亮则二级节点自动点亮",
        includedInSixPosition: true,
        thirdLevel: [
          { id: "overallPlanDoc", name: "总体实施方案文档", rule: "项目经理按照项目交付实施规范完成实施方案编制", entryPoint: "省内LTO六到位、集团PMS", syncType: "具备两级" }
        ]
      },
      {
        id: "changeRecord",
        name: "具备变更记录",
        rule: "三级节点均点亮则二级节点自动点亮",
        includedInSixPosition: true,
        thirdLevel: [
          { id: "changeContent", name: "变更内容", rule: "若项目涉及变更，应及时在项目管理系统发起变更申请", entryPoint: "省内LTO六到位、集团PMS", syncType: "具备两级" },
          { id: "changeReview", name: "变更审核", rule: "变更审核记录", entryPoint: "省内LTO六到位、集团PMS", syncType: "否" }
        ]
      },
      {
        id: "acceptanceReport",
        name: "具备验收报告",
        rule: "三级节点均点亮则二级节点自动点亮",
        includedInSixPosition: true,
        thirdLevel: [
          { id: "initialAcceptance", name: "初验报告", rule: "项目初验后上传", entryPoint: "省内LTO六到位、集团PMS", syncType: "具备两级" },
          { id: "finalAcceptance", name: "终验报告", rule: "项目终验后上传", entryPoint: "省内LTO六到位、集团PMS", syncType: "具备两级" }
        ]
      },
      {
        id: "implementationDocs",
        name: "项目实施文件",
        rule: "三级节点均点亮则二级节点自动点亮",
        includedInSixPosition: false,
        thirdLevel: [
          { id: "meetingMinutes", name: "会议纪要", rule: "文件上传则认为具备", entryPoint: "省内LTO六到位", syncType: "仅省内展示" },
          { id: "weeklyReport", name: "项目周报/月报", rule: "文件上传则认为具备", entryPoint: "省内LTO六到位", syncType: "仅省内展示" },
          { id: "delayExplanation", name: "延期说明", rule: "文件上传则认为具备", entryPoint: "省内LTO六到位", syncType: "仅省内展示" },
          { id: "completionReport", name: "竣工报告", rule: "文件上传则认为具备", entryPoint: "省内LTO六到位", syncType: "仅省内展示" },
          { id: "issueMinutes", name: "问题纪要", rule: "文件上传则认为具备", entryPoint: "省内LTO六到位", syncType: "仅省内展示" },
          { id: "rentAttach", name: "起租相关附件", rule: "文件上传则认为具备", entryPoint: "省内LTO六到位", syncType: "仅省内展示" },
          { id: "hardwareList", name: "软硬件设备或服务清单", rule: "文件上传则认为具备", entryPoint: "省内LTO六到位", syncType: "仅省内展示" },
          { id: "deliveryReport", name: "项目交付报告", rule: "文件上传则认为具备", entryPoint: "省内LTO六到位", syncType: "仅省内展示" },
          { id: "transferReport", name: "项目交维报告", rule: "文件上传则认为具备", entryPoint: "省内LTO六到位", syncType: "仅省内展示" },
          { id: "trialReport", name: "项目试运行报告", rule: "文件上传则认为具备", entryPoint: "省内LTO六到位", syncType: "仅省内展示" },
          { id: "vendorTaskPlan", name: "后向厂家任务计划", rule: "文件上传则认为具备", entryPoint: "省内LTO六到位", syncType: "仅省内展示" },
          { id: "vendorTeamList", name: "后向厂家团队清单", rule: "文件上传则认为具备", entryPoint: "省内LTO六到位", syncType: "仅省内展示" }
        ]
      },
      {
        id: "auditList",
        name: "审计清单",
        rule: "三级节点均点亮则二级节点自动点亮",
        includedInSixPosition: false,
        thirdLevel: [
          { id: "auditCommitmentBuilder", name: "项目送审承诺函-建设方", rule: "文件上传则认为具备", entryPoint: "省内LTO六到位", syncType: "仅省内展示" },
          { id: "auditBasicInfo", name: "送审项目基本信息表", rule: "文件上传则认为具备", entryPoint: "省内LTO六到位", syncType: "仅省内展示" },
          { id: "forwardAuditReport", name: "前向审计报告/前向结算审定书", rule: "文件上传则认为具备", entryPoint: "省内LTO六到位", syncType: "仅省内展示" },
          { id: "auditCommitmentContractor", name: "项目送审承诺函-施工方", rule: "文件上传则认为具备", entryPoint: "省内LTO六到位", syncType: "仅省内展示" },
          { id: "backwardSettlementList", name: "后向结算送审清单", rule: "文件上传则认为具备", entryPoint: "省内LTO六到位", syncType: "仅省内展示" }
        ]
      },
      {
        id: "projectManagementOther",
        name: "其他",
        rule: "文件上传则认为具备",
        includedInSixPosition: false,
        thirdLevel: [
          { id: "projectManagementAttach", name: "项目强管控其它附件", rule: "上传项目强管控相关附件", entryPoint: "省内LTO六到位", syncType: "仅省内展示" }
        ]
      }
    ]
  },
  {
    id: "maintenanceAutonomy",
    name: "运维自主",
    color: "text-green-600",
    bgColor: "bg-green-500",
    rule: "数字资产平台+具备第一服务界面点亮则一级节点自动点亮",
    secondLevel: [
      {
        id: "digitalAsset",
        name: "数字资产平台",
        rule: "三级节点均点亮则二级节点自动点亮",
        includedInSixPosition: true,
        thirdLevel: [
          { id: "assetArchive", name: "商机是否建档", rule: "对项目资产进行数字化管理，作为项目资产登记造册", entryPoint: "省内LTO六到位、集团BPM下发", syncType: "具备两级" }
        ]
      },
      {
        id: "firstServiceInterface",
        name: "具备第一服务界面",
        rule: "三级节点均点亮则二级节点自动点亮",
        includedInSixPosition: true,
        thirdLevel: [
          { id: "serviceDesk", name: "电话或在线台席项目记录", rule: "统筹内外部资源一站式提供运维服务", entryPoint: "省内LTO六到位、集团BPM下发", syncType: "具备两级" }
        ]
      },
      {
        id: "afterSalesDocs",
        name: "售后其他资料",
        rule: "三级节点均点亮则二级节点自动点亮",
        includedInSixPosition: false,
        thirdLevel: [
          { id: "serverResource", name: "服务器资源", rule: "文件上传则认为具备", entryPoint: "省内LTO六到位", syncType: "仅省内展示" },
          { id: "maintenanceGroup", name: "运维群", rule: "文件上传则认为具备", entryPoint: "省内LTO六到位", syncType: "仅省内展示" },
          { id: "trainingRecord", name: "培训记录", rule: "文件上传则认为具备", entryPoint: "省内LTO六到位", syncType: "仅省内展示" },
          { id: "trainingPhoto", name: "培训照片", rule: "文件上传则认为具备", entryPoint: "省内LTO六到位", syncType: "仅省内展示" },
          { id: "requirementSpec", name: "需求规格说明书", rule: "文件上传则认为具备", entryPoint: "省内LTO六到位", syncType: "仅省内展示" },
          { id: "overallDesign", name: "概要设计说明书", rule: "文件上传则认为具备", entryPoint: "省内LTO六到位", syncType: "仅省内展示" },
          { id: "detailDesign", name: "详细设计说明书", rule: "文件上传则认为具备", entryPoint: "省内LTO六到位", syncType: "仅省内展示" },
          { id: "dbDesign", name: "数据库设计说明书", rule: "文件上传则认为具备", entryPoint: "省内LTO六到位", syncType: "仅省内展示" }
        ]
      },
      {
        id: "maintenanceAutonomyOther",
        name: "其他",
        rule: "文件上传则认为具备",
        includedInSixPosition: false,
        thirdLevel: [
          { id: "maintenanceAutonomyAttach", name: "运维自主其它附件", rule: "上传运维自主相关附件", entryPoint: "省内LTO六到位", syncType: "仅省内展示" }
        ]
      }
    ]
  }
];

interface SixPositioningDetailProps {
  isOpen: boolean;
  onClose: () => void;
  opportunityName?: string;
  opportunityCode?: string;
  onNavigateForwardBid?: (opportunityCode: string) => void;
}

export function SixPositioningDetail({ isOpen, onClose, opportunityName, opportunityCode, onNavigateForwardBid }: SixPositioningDetailProps) {
  const [activePositionTab, setActivePositionTab] = useState<string>("overview");
  const [expandedSeconds, setExpandedSeconds] = useState<Set<string>>(
    new Set(sixPositionDetails.flatMap(p => p.secondLevel.map(s => s.id)))
  );

  const toggleSecondLevel = (id: string) => {
    setExpandedSeconds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (!isOpen) return null;

  const activePosition = sixPositionDetails.find(p => p.id === activePositionTab);

  return (
    <TooltipProvider>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl w-[90vw] max-w-6xl max-h-[85vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
            <h2 className="text-lg font-medium text-gray-900">
              {opportunityName ? `${opportunityName}商机六到位明细` : '六到位明细'}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Tab Bar */}
          <div className="px-4 pt-4 pb-2 flex-shrink-0">
            <div className="grid grid-cols-6 gap-3">
              <div
                className="col-span-6 cursor-pointer transition-all hover:opacity-80"
                onClick={() => setActivePositionTab("overview")}
              >
                <div className={`px-3 py-1.5 flex flex-row items-center justify-center gap-2 border-b ${activePositionTab === "overview" ? 'border-[#1890ff]' : 'border-gray-200 hover:bg-gray-100'}`}>
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${activePositionTab === "overview" ? 'bg-[#1890ff]' : 'bg-gray-300'}`} />
                  <span className={`font-medium text-sm ${activePositionTab === "overview" ? 'text-[#1890ff]' : 'text-gray-900'}`}>
                    总览
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 六个到位导航卡片 - sticky 固定在顶部 */}
          <div className="px-4 mt-1 flex-shrink-0">
            <div className="sticky top-0 z-20">
              <PositionCards activeId={activePositionTab} onSelect={setActivePositionTab} />
            </div>
          </div>

          {/* Content - 滚动区 */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {activePositionTab === "overview" && <OverviewContent expandedSeconds={expandedSeconds} toggleSecondLevel={toggleSecondLevel} />}
            {activePositionTab !== "overview" && activePosition && <DetailContent key={activePosition.id} position={activePosition} />}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

// 六个到位导航卡片组件
interface PositionCardsProps {
  activeId: string;
  onSelect: (id: string) => void;
}

function PositionCards({ activeId, onSelect }: PositionCardsProps) {
  return (
    <div className="grid grid-cols-6 gap-3 mb-4">
      {sixPositionDetails.map(position => (
            <div
              key={position.id}
              className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                activeId === position.id
                  ? 'ring-2 ring-[#2e7cff] ring-offset-1'
                  : 'hover:border-gray-300'
              }`}
              onClick={() => onSelect(position.id)}
            >
              <div className={`px-3 py-2.5 flex flex-row items-center gap-2 ${
                activeId === position.id ? 'bg-[#e6f0ff]' : 'bg-gray-50 hover:bg-gray-100'
              }`}>
                <div className={`w-4 h-4 rounded-full flex-shrink-0 ${position.bgColor}`} />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className={`font-medium text-sm cursor-help truncate ${
                      activeId === position.id ? 'text-[#2e7cff]' : 'text-gray-900'
                    }`}>
                      {position.name}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-xs">{position.rule}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          ))}
    </div>
  );
}

// 总览内容 - 横向展示六个到位，二级有展开/收起箭头
interface OverviewContentProps {
  expandedSeconds: Set<string>;
  toggleSecondLevel: (id: string) => void;
}

function OverviewContent({ expandedSeconds, toggleSecondLevel }: OverviewContentProps) {
  return (
    <div className="grid grid-cols-6 gap-3">
      {sixPositionDetails.map(position => (
        <div key={position.id} className="border border-gray-200 rounded-lg overflow-hidden">
          {/* 二级和三级内容 */}
          <div className="divide-y divide-gray-100">
            {position.secondLevel.map(second => (
              <div key={second.id} className="px-2 py-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className={`w-2 h-2 rounded-full ${second.includedInSixPosition ? 'bg-green-500' : 'bg-red-500'} flex-shrink-0`} />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-xs text-gray-700 truncate flex-1 cursor-help">{second.name}</span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-xs">{second.rule}</p>
                    </TooltipContent>
                  </Tooltip>
                  {second.thirdLevel.length > 0 && (
                    <button
                      className="p-0.5 hover:bg-gray-200 rounded"
                      onClick={() => toggleSecondLevel(second.id)}
                    >
                      {expandedSeconds.has(second.id) ? (
                        <ChevronDown className="w-3 h-3 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-gray-400" />
                      )}
                    </button>
                  )}
                </div>
                {/* 三级节点 */}
                {second.thirdLevel.length > 0 && expandedSeconds.has(second.id) && (
                  <div className="flex flex-wrap gap-1 ml-3">
                    {second.thirdLevel.map(third => (
                      <Tooltip key={third.id}>
                        <TooltipTrigger asChild>
                          <div className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] cursor-help ${third.includedInSixPosition ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            <div className={`w-1 h-1 rounded-full flex-shrink-0 ${third.includedInSixPosition ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="truncate">{third.name}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-xs">
                          <p className="text-xs font-medium mb-0.5">{third.name}</p>
                          <p className="text-xs">{third.rule}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// 详情内容
function DetailContent({ position }: { position: PositionDetail }) {
  const [expandedSeconds, setExpandedSeconds] = useState<Set<string>>(
    new Set(position.secondLevel.map(s => s.id))
  );
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [solutionUploadOpen, setSolutionUploadOpen] = useState(false);
  const [biddingUploadOpen, setBiddingUploadOpen] = useState(false);
  const [afterSalesUploadOpen, setAfterSalesUploadOpen] = useState(false);
  const [businessInfoModalOpen, setBusinessInfoModalOpen] = useState(false);
  const [uploadField, setUploadField] = useState<string>('');
  const [mockData, setMockData] = useState(initialMockData);
  const [biddingFiles, setBiddingFiles] = useState<Record<string, { name: string; size: string; uploadTime: string; synced: boolean }[]>>({
   招标文件: [],
    投标依据标书: [],
    发标证明文件: [],
    投标证明文件: [],
    弃标证明文件: []
  });
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, { name: string; size: string; uploadTime: string; synced: boolean }[]>>({});
  const [selectedBusinessInfo, setSelectedBusinessInfo] = useState<Set<number>>(new Set());
  const [businessInfoList, setBusinessInfoList] = useState([
    { id: 1, code: 'SQ20260326001', name: 'XX单位信息化建设采购项目', projectCode: 'CG-2026-001', customerName: '杭州某某科技有限公司', type: '公开招标', amount: '¥5,800,000', publishTime: '2026-03-15', deadline: '2026-04-10' },
    { id: 2, code: 'SQ20260325002', name: 'YY学校智慧校园建设采购', projectCode: 'CG-2026-002', customerName: '杭州某某科技有限公司', type: '公开招标', amount: '¥3,200,000', publishTime: '2026-03-10', deadline: '2026-04-05' },
    { id: 3, code: 'SQ20260324003', name: 'ZZ医院信息化系统采购', projectCode: 'CG-2026-003', customerName: '杭州某某科技有限公司', type: '竞争性磋商', amount: '¥2,100,000', publishTime: '2026-03-08', deadline: '2026-03-28' },
  ]);

  const toggleSecond = (id: string) => {
    setExpandedSeconds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // 判断是集团还是省内要求
  const getRequirementType = (second: SecondLevelItem) => {
    const types = second.thirdLevel.map(t => t.syncType);
    const hasGroup = types.some(t => t.includes('具备下发') || t.includes('结构化内容具备下发') || t.includes('具备两级') || t.includes('具备上送'));
    const hasProvince = types.some(t => t.includes('仅省内展示'));
    const hasGroupOnly = types.some(t => (t.includes('具备下发') || t.includes('结构化内容具备下发')) && !t.includes('两级') && !t.includes('上送'));

    if (hasGroupOnly) return '集团六到位要求';
    if (hasProvince && !hasGroup) return '省内六到位要求';
    if (hasGroup) return '集团六到位要求';
    return null;
  };

  // 获取录入入口
  const getEntryPoint = (second: SecondLevelItem) => {
    const all = second.thirdLevel.flatMap(t => t.entryPoint.split('、'));
    return [...new Set(all)].join('、');
  };

  return (
    <div className="space-y-3">
      {position.secondLevel.map(second => (
        <div key={second.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <div
            className="bg-gray-50 px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => second.thirdLevel.length > 0 && toggleSecond(second.id)}
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${second.includedInSixPosition ? 'bg-green-500' : 'bg-red-500'}`} />
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="font-medium text-gray-900 cursor-help">
                {second.name}
                {['customerArchive', 'visitRecord', 'opportunity', 'teamBuilding', 'solutionDesign', 'solutionDeconstruct', 'preBidDecision', 'businessDeconstruct', 'riskReview', 'projectOverallDesign', 'digitalAsset', 'firstServiceInterface'].includes(second.id) && <span className="text-red-500 ml-1">*</span>}
              </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-xs">{second.rule}</p>
                </TooltipContent>
              </Tooltip>
              {/* 要求类型标签 */}
              {getRequirementType(second) && (
                <Badge variant={getRequirementType(second) === '集团六到位要求' ? 'default' : 'secondary'} className="text-xs">
                  {getRequirementType(second)}
                </Badge>
              )}
              {/* 录入入口标签 */}
              {getEntryPoint(second) && (
                <Badge variant="outline" className="text-xs text-gray-600">
                  {getEntryPoint(second)}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!second.includedInSixPosition && <Badge variant="secondary" className="text-xs">不参与六到位点亮</Badge>}
              {/* 新增按钮 - 仅拜访信息显示 */}
              {second.id === 'visitRecord' && (
                <Button variant="outline" size="sm" className="gap-1 h-7 text-xs" onClick={(e) => { e.stopPropagation(); setVisitModalOpen(true); }}>
                  <Plus className="w-3 h-3" /> 新增
                </Button>
              )}
              {/* 录入前向投标按钮 */}
              {(second.id === 'biddingRecord' || second.id === 'biddingResult' || second.id === 'businessNegotiation') && (
                <Button variant="outline" size="sm" className="gap-1 h-7 text-xs" onClick={(e) => { e.stopPropagation(); onNavigateForwardBid?.(opportunityCode || mockData.opportunity.opportunityCode); }}>
                  <Plus className="w-3 h-3" /> 录入前向投标
                </Button>
              )}
              {/* 绑定商情按钮 */}
              {second.id === 'biddingRecord' && (
                <Button variant="outline" size="sm" className="gap-1 h-7 text-xs" onClick={(e) => { e.stopPropagation(); setBusinessInfoModalOpen(true); }}>
                  <Plus className="w-3 h-3" /> 绑定商情
                </Button>
              )}
              {/* 方案解构与中台把关按钮 */}
              {second.id === 'solutionDeconstruct' && (
                <>
                  <Button variant="outline" size="sm" className="gap-1 h-7 text-xs" onClick={(e) => { e.stopPropagation(); }}>
                    <Plus className="w-3 h-3" /> 填写方案解构
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1 h-7 text-xs" onClick={(e) => { e.stopPropagation(); }}>
                    <Plus className="w-3 h-3" /> 填写中台把关
                  </Button>
                </>
              )}
              {/* 具备业务解构按钮 */}
              {second.id === 'businessDeconstruct' && (
                <Button variant="outline" size="sm" className="gap-1 h-7 text-xs" onClick={(e) => { e.stopPropagation(); }}>
                  <Plus className="w-3 h-3" /> 录入业务解构
                </Button>
              )}
              {/* 标前决策会按钮 */}
              {second.id === 'preBidDecision' && (
                <>
                  <Button variant="outline" size="sm" className="gap-1 h-7 text-xs" onClick={(e) => { e.stopPropagation(); }}>
                    <Plus className="w-3 h-3" /> 生成决策签报
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1 h-7 text-xs" onClick={(e) => { e.stopPropagation(); }}>
                    <Plus className="w-3 h-3" /> 录入合作伙伴
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1 h-7 text-xs" onClick={(e) => { e.stopPropagation(); }}>
                    <Plus className="w-3 h-3" /> 生成会议纪要
                  </Button>
                </>
              )}
              {second.thirdLevel.length > 0 && (
                expandedSeconds.has(second.id) ?
                  <ChevronDown className="w-4 h-4 text-gray-400" /> :
                  <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>
          {second.thirdLevel.length > 0 && expandedSeconds.has(second.id) && (
            <div className="p-4">
              {second.id === 'customerArchive' ? (
                // 客户档案表单样式展示
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">客户名称 <span className="text-red-500">*</span></label>
                    <div className="text-sm text-gray-900 border-b border-gray-100 pb-0.5">{mockData.customerArchive.customerName}</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">注册地址 <span className="text-red-500">*</span></label>
                    <div className="text-sm text-gray-900 border-b border-gray-100 pb-0.5">{mockData.customerArchive.address}</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">客户联系人 <span className="text-red-500">*</span></label>
                    <div className="text-sm text-gray-900 border-b border-gray-100 pb-0.5">{mockData.customerArchive.contact}</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">客户联系人手机号 <span className="text-red-500">*</span></label>
                    <div className="text-sm text-gray-900 border-b border-gray-100 pb-0.5">{mockData.customerArchive.contactPhone}</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">客户经理 <span className="text-red-500">*</span></label>
                    <div className="text-sm text-gray-900 border-b border-gray-100 pb-0.5">{mockData.customerArchive.manager}</div>
                  </div>
                </div>
              ) : second.id === 'visitRecord' ? (
                // 拜访信息表格展示
                <div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-3 py-2 text-left font-medium text-gray-600">序号</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">拜访客户单位</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">拜访对象</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">拜访事由</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">拜访时间</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">拜访地点</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">我方拜访者</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">现场照片</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {mockData.visitRecords.map(record => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-gray-900">{record.id}</td>
                          <td className="px-3 py-2 text-gray-900">{record.customerUnit}</td>
                          <td className="px-3 py-2 text-gray-900">{record.contact}</td>
                          <td className="px-3 py-2 text-gray-900">{record.purpose}</td>
                          <td className="px-3 py-2 text-gray-900">{record.date}</td>
                          <td className="px-3 py-2 text-gray-900">{record.location}</td>
                          <td className="px-3 py-2 text-gray-900">{record.visitor}</td>
                          <td className="px-3 py-2 text-center">
                            {record.photo === "已上传" ? (
                              <svg className="w-5 h-5 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <VisitRecordModal
                    open={visitModalOpen}
                    onOpenChange={setVisitModalOpen}
                    onSave={(newRecord) => {
                      const newId = mockData.visitRecords.length + 1;
                      setMockData(prev => ({
                        ...prev,
                        visitRecords: [...prev.visitRecords, { ...newRecord, id: newId }]
                      }));
                    }}
                  />
                </div>
              ) : second.id === 'opportunity' ? (
                // 商机录入表单样式展示
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">商机名称 <span className="text-red-500">*</span></label>
                    <div className="text-sm text-gray-900 border-b border-gray-100 pb-0.5">{mockData.opportunity.opportunityName}</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">商机集团编码 <span className="text-red-500">*</span></label>
                    <div className="text-sm text-gray-900 border-b border-gray-100 pb-0.5">{mockData.opportunity.opportunityCode}</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">录入时间 <span className="text-red-500">*</span></label>
                    <div className="text-sm text-gray-900 border-b border-gray-100 pb-0.5">{mockData.opportunity.entryTime}</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">是否提前录入商机 <span className="text-red-500">*</span></label>
                    <div className="text-sm text-gray-900 border-b border-gray-100 pb-0.5">{mockData.opportunity.isEarlyEntry}</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">投标时间 <span className="text-red-500">*</span></label>
                    <div className="text-sm text-gray-900 border-b border-gray-100 pb-0.5">{mockData.opportunity.biddingTime}</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">签约时间 <span className="text-red-500">*</span></label>
                    <div className="text-sm text-gray-900 border-b border-gray-100 pb-0.5">{mockData.opportunity.signTime}</div>
                  </div>
                </div>
              ) : second.id === 'threeYearProject' ? (
                // 近三年信息化项目表格展示
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-3 py-2 text-left font-medium text-gray-600">序号</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">合同名称</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">合同编号</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">签约时间</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">合同金额</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">实施厂家</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockData.threeYearProjects.map(project => (
                      <tr key={project.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-900">{project.id}</td>
                        <td className="px-3 py-2 text-gray-900">{project.contractName}</td>
                        <td className="px-3 py-2 text-gray-900">{project.contractCode}</td>
                        <td className="px-3 py-2 text-gray-900">{project.signTime}</td>
                        <td className="px-3 py-2 text-gray-900">{project.amount}</td>
                        <td className="px-3 py-2 text-gray-900">{project.vendor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : second.id === 'otherAttachments' ? (
                // 客情掌握其它附件上传展示
                <div>
                  <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                    <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span className="text-gray-600">上传</span>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          const newFiles = Array.from(files).map(file => ({
                            name: file.name,
                            size: file.size < 1024 * 1024 ? (file.size / 1024).toFixed(1) + ' KB' : (file.size / 1024 / 1024).toFixed(1) + ' MB',
                            uploadTime: new Date().toLocaleString()
                          }));
                          setMockData(prev => ({
                            ...prev,
                            otherAttachments: [...prev.otherAttachments, ...newFiles]
                          }));
                        }
                      }}
                    />
                  </label>
                  {mockData.otherAttachments.length > 0 && (
                    <div className="space-y-1 mt-2">
                      {mockData.otherAttachments.map((file, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                          <button
                            onClick={() => setMockData(prev => ({
                              ...prev,
                              otherAttachments: prev.otherAttachments.filter((_, i) => i !== index)
                            }))}
                            className="text-gray-400 hover:text-red-500 p-0.5 flex-shrink-0"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : second.id === 'planControlOther' || second.id === 'biddingAutonomyOther' || second.id === 'procurementAutonomyOther' || second.id === 'projectManagementOther' || second.id === 'maintenanceAutonomyOther' ? (
                // 其他节点 - 与客情掌握其它附件样式一致
                <div>
                  <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                    <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span className="text-gray-600">上传</span>
                    <input type="file" multiple className="hidden" />
                  </label>
                </div>
              ) : second.id === 'riskReview' ? (
                // 业务风险及合规审核表单
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">审核结果 <span className="text-red-500">*</span></label>
                    <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('riskAuditResult'); setAfterSalesUploadOpen(true); }}>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      上传
                    </Button>
                    {(uploadedFiles['riskAuditResult'] || []).length > 0 && (
                      <div className="space-y-1 mt-2">
                        {(uploadedFiles['riskAuditResult'] || []).map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${file.synced ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {file.synced ? '已同步' : '未同步'}
                            </span>
                            <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                            {!file.synced && (
                              <Button variant="link" size="sm" className="text-xs p-0 h-auto whitespace-nowrap" onClick={() => setUploadedFiles(prev => {
                                const newDocs = [...(prev['riskAuditResult'] || [])];
                                newDocs[index] = { ...newDocs[index], synced: true };
                                return { ...prev, riskAuditResult: newDocs };
                              })}>
                                同步
                              </Button>
                            )}
                            <button onClick={() => setUploadedFiles(prev => {
                              const newDocs = (prev['riskAuditResult'] || []).filter((_, i) => i !== index);
                              return { ...prev, riskAuditResult: newDocs };
                            })} className="text-gray-400 hover:text-red-500 p-0.5 flex-shrink-0">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">对比结果 <span className="text-red-500">*</span></label>
                    <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('riskCompareResult'); setAfterSalesUploadOpen(true); }}>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      上传
                    </Button>
                    {(uploadedFiles['riskCompareResult'] || []).length > 0 && (
                      <div className="space-y-1 mt-2">
                        {(uploadedFiles['riskCompareResult'] || []).map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${file.synced ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {file.synced ? '已同步' : '未同步'}
                            </span>
                            <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                            {!file.synced && (
                              <Button variant="link" size="sm" className="text-xs p-0 h-auto whitespace-nowrap" onClick={() => setUploadedFiles(prev => {
                                const newDocs = [...(prev['riskCompareResult'] || [])];
                                newDocs[index] = { ...newDocs[index], synced: true };
                                return { ...prev, riskCompareResult: newDocs };
                              })}>
                                同步
                              </Button>
                            )}
                            <button onClick={() => setUploadedFiles(prev => {
                              const newDocs = (prev['riskCompareResult'] || []).filter((_, i) => i !== index);
                              return { ...prev, riskCompareResult: newDocs };
                            })} className="text-gray-400 hover:text-red-500 p-0.5 flex-shrink-0">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">省内风险附件</label>
                    <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="text-gray-600">上传</span>
                      <input type="file" multiple className="hidden" />
                    </label>
                  </div>
                </div>
              ) : second.id === 'solutionDeconstruct' ? (
                // 方案解构与中台把关表单 - 两列三行布局
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">方案解构 <span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 truncate flex-1">XX项目方案解构文档.pdf</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">中台把关 <span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 truncate flex-1">XX项目方案把关意见.pdf</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-gray-500 block mb-1">把关结果 <span className="text-red-500">*</span></label>
                    <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-600 rounded text-xs">待把关</span>
                  </div>
                </div>
              ) : second.id === 'teamBuilding' ? (
                // 组建团队表格展示
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-3 py-2 text-left font-medium text-gray-600">角色类型</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">用户名</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">角色</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">部门</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">进入时间</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">联系电话</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">邀请人</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockData.teamMembers.map(member => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-900">{member.roleType}</td>
                        <td className="px-3 py-2 text-gray-900">{member.userName}</td>
                        <td className="px-3 py-2 text-gray-900">{member.role}</td>
                        <td className="px-3 py-2 text-gray-900">{member.department}</td>
                        <td className="px-3 py-2 text-gray-900">{member.entryTime}</td>
                        <td className="px-3 py-2 text-gray-900">{member.phone}</td>
                        <td className="px-3 py-2 text-gray-900">{member.inviter}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : second.id === 'biddingRecord' ? (
                // 参与投标记录表单
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">是否应标 <span className="text-red-500">*</span></label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded text-xs">
                        <option value="">请选择</option>
                        <option value="1">是</option>
                        <option value="0">否</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">投标时间 <span className="text-red-500">*</span></label>
                      <input type="date" className="w-full px-3 py-2 border border-gray-200 rounded text-xs" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">投标主体 <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="请输入投标主体" className="w-full px-3 py-2 border border-gray-200 rounded text-xs" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">招标文件 </label>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('招标文件'); setBiddingUploadOpen(true); }}>
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          上传
                        </Button>
                        {biddingFiles['招标文件'].length > 0 && (
                          <span className="text-xs text-gray-500">{biddingFiles['招标文件'][0].name}</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">投标依据/标书 </label>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('投标依据标书'); setBiddingUploadOpen(true); }}>
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          上传
                        </Button>
                        {biddingFiles['投标依据标书'].length > 0 && (
                          <span className="text-xs text-gray-500">{biddingFiles['投标依据标书'][0].name}</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">发标证明文件 </label>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('发标证明文件'); setBiddingUploadOpen(true); }}>
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          上传
                        </Button>
                        {biddingFiles['发标证明文件'].length > 0 && (
                          <span className="text-xs text-gray-500">{biddingFiles['发标证明文件'][0].name}</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">投标证明文件 </label>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('投标证明文件'); setBiddingUploadOpen(true); }}>
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          上传
                        </Button>
                        {biddingFiles['投标证明文件'].length > 0 && (
                          <span className="text-xs text-gray-500">{biddingFiles['投标证明文件'][0].name}</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">投标报价清单</label>
                      <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="text-gray-600">上传</span>
                        <input type="file" multiple className="hidden" />
                      </label>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">弃标证明文件 </label>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('弃标证明文件'); setBiddingUploadOpen(true); }}>
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          上传
                        </Button>
                        {biddingFiles['弃标证明文件'].length > 0 && (
                          <span className="text-xs text-gray-500">{biddingFiles['弃标证明文件'][0].name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-700 font-medium">商情信息</span>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-3 py-2 text-left font-medium text-gray-600">序号</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">商情编号</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">项目名称</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">项目编码</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">客户名称</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">类型</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">项目金额</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">发布时间</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">招标截止时间</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">原文链接</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-gray-900">1</td>
                          <td className="px-3 py-2 text-gray-900">SQ20260326001</td>
                          <td className="px-3 py-2 text-gray-900">XX单位信息化建设采购项目</td>
                          <td className="px-3 py-2 text-gray-900">CG-2026-001</td>
                          <td className="px-3 py-2 text-gray-900">杭州某某科技有限公司</td>
                          <td className="px-3 py-2 text-gray-900">公开招标</td>
                          <td className="px-3 py-2 text-gray-900">¥5,800,000</td>
                          <td className="px-3 py-2 text-gray-900">2026-03-15</td>
                          <td className="px-3 py-2 text-gray-900">2026-04-10</td>
                          <td className="px-3 py-2 text-blue-600 cursor-pointer hover:underline">查看</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : second.id === 'biddingResult' ? (
                // 应标结果记录表单
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">应标结果 <span className="text-red-500">*</span></label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded text-xs">
                      <option value="">请选择</option>
                      <option value="中标">中标</option>
                      <option value="丢标">丢标</option>
                      <option value="未开标">未开标</option>
                      <option value="已签约">已签约</option>
                      <option value="未签约">未签约</option>
                      <option value="弃标">弃标</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">中标时间 <span className="text-red-500">*</span></label>
                    <input type="date" className="w-full px-3 py-2 border border-gray-200 rounded text-xs" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">中标金额 <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="请输入" className="w-full px-3 py-2 border border-gray-200 rounded text-xs" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">签约对象 <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="请输入" className="w-full px-3 py-2 border border-gray-200 rounded text-xs" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">中标结果通知书</label>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('bidWinNotice'); setBiddingUploadOpen(true); }}>
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        上传
                      </Button>
                    </div>
                    {(uploadedFiles['bidWinNotice'] || []).length > 0 && (
                      <div className="space-y-1 mt-2">
                        {(uploadedFiles['bidWinNotice'] || []).map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${file.synced ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {file.synced ? '已同步' : '未同步'}
                            </span>
                            <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                            {!file.synced && (
                              <Button variant="link" size="sm" className="text-xs p-0 h-auto whitespace-nowrap" onClick={() => setUploadedFiles(prev => {
                                const newDocs = [...(prev['bidWinNotice'] || [])];
                                newDocs[index] = { ...newDocs[index], synced: true };
                                return { ...prev, bidWinNotice: newDocs };
                              })}>
                                同步
                              </Button>
                            )}
                            <button onClick={() => setUploadedFiles(prev => {
                              const newDocs = (prev['bidWinNotice'] || []).filter((_, i) => i !== index);
                              return { ...prev, bidWinNotice: newDocs };
                            })} className="text-gray-400 hover:text-red-500 p-0.5 flex-shrink-0">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">丢标复盘文件</label>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('bidLossReview'); setBiddingUploadOpen(true); }}>
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        上传
                      </Button>
                    </div>
                    {(uploadedFiles['bidLossReview'] || []).length > 0 && (
                      <div className="space-y-1 mt-2">
                        {(uploadedFiles['bidLossReview'] || []).map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${file.synced ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {file.synced ? '已同步' : '未同步'}
                            </span>
                            <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                            {!file.synced && (
                              <Button variant="link" size="sm" className="text-xs p-0 h-auto whitespace-nowrap" onClick={() => setUploadedFiles(prev => {
                                const newDocs = [...(prev['bidLossReview'] || [])];
                                newDocs[index] = { ...newDocs[index], synced: true };
                                return { ...prev, bidLossReview: newDocs };
                              })}>
                                同步
                              </Button>
                            )}
                            <button onClick={() => setUploadedFiles(prev => {
                              const newDocs = (prev['bidLossReview'] || []).filter((_, i) => i !== index);
                              return { ...prev, bidLossReview: newDocs };
                            })} className="text-gray-400 hover:text-red-500 p-0.5 flex-shrink-0">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : second.id === 'businessNegotiation' ? (
                // 商务谈判表单
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">谈判记录 <span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('negotiationRecord'); setBiddingUploadOpen(true); }}>
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        上传
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs h-7">下载模版</Button>
                    </div>
                    {(uploadedFiles['negotiationRecord'] || []).length > 0 && (
                      <div className="space-y-1 mt-2">
                        {(uploadedFiles['negotiationRecord'] || []).map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${file.synced ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {file.synced ? '已同步' : '未同步'}
                            </span>
                            <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                            {!file.synced && (
                              <Button variant="link" size="sm" className="text-xs p-0 h-auto whitespace-nowrap" onClick={() => setUploadedFiles(prev => {
                                const newDocs = [...(prev['negotiationRecord'] || [])];
                                newDocs[index] = { ...newDocs[index], synced: true };
                                return { ...prev, negotiationRecord: newDocs };
                              })}>
                                同步
                              </Button>
                            )}
                            <button onClick={() => setUploadedFiles(prev => {
                              const newDocs = (prev['negotiationRecord'] || []).filter((_, i) => i !== index);
                              return { ...prev, negotiationRecord: newDocs };
                            })} className="text-gray-400 hover:text-red-500 p-0.5 flex-shrink-0">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">谈判时间 <span className="text-red-500">*</span></label>
                    <input type="date" className="w-full px-3 py-2 border border-gray-200 rounded text-xs" />
                  </div>
                </div>
              ) : second.id === 'forwardContract' ? (
                // 前向合同信息表单
                <div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">合同附件</label>
                      <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="text-gray-600">上传</span>
                        <input type="file" multiple className="hidden" />
                      </label>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">报价清单</label>
                      <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="text-gray-600">上传</span>
                        <input type="file" multiple className="hidden" />
                      </label>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">图纸</label>
                      <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="text-gray-600">上传</span>
                        <input type="file" multiple className="hidden" />
                      </label>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-xs text-gray-700 font-medium mb-2">合同信息列表</div>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-3 py-2 text-left font-medium text-gray-600">合同名称</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">合同编码</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">合同金额</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">签约时间</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">签约主体</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">客户名称</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">客户编码</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">合同状态</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-gray-900">XX项目设备采购合同</td>
                          <td className="px-3 py-2 text-gray-900">HT-2026-001</td>
                          <td className="px-3 py-2 text-gray-900">¥800,000</td>
                          <td className="px-3 py-2 text-gray-900">2026-03-15</td>
                          <td className="px-3 py-2 text-gray-900">浙江有数科技有限公司</td>
                          <td className="px-3 py-2 text-gray-900">杭州XX科技有限公司</td>
                          <td className="px-3 py-2 text-gray-900">KH-2026-001</td>
                          <td className="px-3 py-2 text-gray-900">执行中</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : second.id === 'preBidDecision' ? (
                // 标前决策会表单
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">标前决策会议结果 <span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('preBidDecisionDoc'); setAfterSalesUploadOpen(true); }}>
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        上传
                      </Button>
                    </div>
                    {(uploadedFiles['preBidDecisionDoc'] || []).length > 0 && (
                      <div className="space-y-1 mt-2">
                        {(uploadedFiles['preBidDecisionDoc'] || []).map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${file.synced ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {file.synced ? '已同步' : '未同步'}
                            </span>
                            <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                            {!file.synced && (
                              <Button variant="link" size="sm" className="text-xs p-0 h-auto whitespace-nowrap" onClick={() => setUploadedFiles(prev => {
                                const newDocs = [...(prev['preBidDecisionDoc'] || [])];
                                newDocs[index] = { ...newDocs[index], synced: true };
                                return { ...prev, preBidDecisionDoc: newDocs };
                              })}>
                                同步
                              </Button>
                            )}
                            <button onClick={() => setUploadedFiles(prev => {
                              const newDocs = (prev['preBidDecisionDoc'] || []).filter((_, i) => i !== index);
                              return { ...prev, preBidDecisionDoc: newDocs };
                            })} className="text-gray-400 hover:text-red-500 p-0.5 flex-shrink-0">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">预计合作伙伴 <span className="text-red-500">*</span></label>
                    <div className="text-xs text-gray-400">-</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">模式会会议纪要</label>
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="text-gray-600">上传</span>
                        <input type="file" multiple className="hidden" />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">总经理办公会纪要</label>
                    <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="text-gray-600">上传</span>
                      <input type="file" multiple className="hidden" />
                    </label>
                  </div>
                </div>
              ) : second.id === 'backwardDocs' ? (
                // 后向资料表单
                <div className="space-y-4">
                  <div className="text-xs text-gray-700 font-medium mb-2">后向列表</div>
                  <table className="w-full text-xs mb-4">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-3 py-2 text-left font-medium text-gray-600">合作伙伴名称</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">后向类型</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">后向名称</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">后向编码</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">金额</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">签约时间</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">签约主体</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-900">杭州XX科技有限公司</td>
                        <td className="px-3 py-2 text-gray-900">成本</td>
                        <td className="px-3 py-2 text-gray-900">XX设备采购</td>
                        <td className="px-3 py-2 text-gray-900">HX-2026-001</td>
                        <td className="px-3 py-2 text-gray-900">¥600,000</td>
                        <td className="px-3 py-2 text-gray-900">2026-03-10</td>
                        <td className="px-3 py-2 text-gray-900">浙江有数科技有限公司</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">后向招标文件</label>
                      <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="text-gray-600">上传</span>
                        <input type="file" multiple className="hidden" />
                      </label>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">中标报价清单</label>
                      <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="text-gray-600">上传</span>
                        <input type="file" multiple className="hidden" />
                      </label>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">后向合同(报价清单)</label>
                      <div className="flex items-center gap-2">
                        <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                          <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          <span className="text-gray-600">上传</span>
                          <input type="file" multiple className="hidden" />
                        </label>
                        <Button variant="outline" size="sm" className="text-xs h-7">下载模版</Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">合同附件/集采订单</label>
                      <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('contractAttach'); setAfterSalesUploadOpen(true); }}>
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        上传
                      </Button>
                      {(uploadedFiles['contractAttach'] || []).length > 0 && (
                        <div className="space-y-1 mt-2">
                          {(uploadedFiles['contractAttach'] || []).map((file, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${file.synced ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                {file.synced ? '已同步' : '未同步'}
                              </span>
                              <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                              {!file.synced && (
                                <Button variant="link" size="sm" className="text-xs p-0 h-auto whitespace-nowrap" onClick={() => setUploadedFiles(prev => {
                                  const newDocs = [...(prev['contractAttach'] || [])];
                                  newDocs[index] = { ...newDocs[index], synced: true };
                                  return { ...prev, contractAttach: newDocs };
                                })}>
                                  同步
                                </Button>
                              )}
                              <button onClick={() => setUploadedFiles(prev => {
                                const newDocs = (prev['contractAttach'] || []).filter((_, i) => i !== index);
                                return { ...prev, contractAttach: newDocs };
                              })} className="text-gray-400 hover:text-red-500 p-0.5 flex-shrink-0">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">后向合同(图纸)</label>
                      <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="text-gray-600">上传</span>
                        <input type="file" multiple className="hidden" />
                      </label>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-700 font-medium mb-2">后向厂家相关合同</div>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-3 py-2 text-left font-medium text-gray-600">序号</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">合作伙伴</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">合同名称</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">合同编号</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">签约时间</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">合同金额</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">签约主体</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-gray-900">1</td>
                          <td className="px-3 py-2 text-gray-900">杭州XX科技有限公司</td>
                          <td className="px-3 py-2 text-gray-900">XX项目设备采购合同</td>
                          <td className="px-3 py-2 text-gray-900">HT-2026-001</td>
                          <td className="px-3 py-2 text-gray-900">2026-03-15</td>
                          <td className="px-3 py-2 text-gray-900">¥800,000</td>
                          <td className="px-3 py-2 text-gray-900">杭州XX科技有限公司</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : second.id === 'businessDeconstruct' ? (
                // 完成业务解构表单
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">业务解构完成 <span className="text-red-500">*</span></label>
                      <span className="text-xs text-green-600">是</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-gray-700 font-medium">采购需求 <span className="text-red-500">*</span></div>
                      <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('procurementDemandDoc'); setAfterSalesUploadOpen(true); }}>
                        上传
                      </Button>
                    </div>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-3 py-2 text-left font-medium text-gray-600">需求名称</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">需求编码</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">金额</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">状态</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">日期</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">供应商</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-gray-900">服务器采购需求</td>
                          <td className="px-3 py-2 text-gray-900">XQ-2026-001</td>
                          <td className="px-3 py-2 text-gray-900">¥50,000</td>
                          <td className="px-3 py-2"><span className="text-green-600 bg-green-50 px-2 py-0.5 rounded">已完成</span></td>
                          <td className="px-3 py-2 text-gray-900">2026-03-15</td>
                          <td className="px-3 py-2 text-gray-900">杭州XX科技</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-gray-900">软件授权采购</td>
                          <td className="px-3 py-2 text-gray-900">XQ-2026-002</td>
                          <td className="px-3 py-2 text-gray-900">¥30,000</td>
                          <td className="px-3 py-2"><span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">进行中</span></td>
                          <td className="px-3 py-2 text-gray-900">2026-03-20</td>
                          <td className="px-3 py-2 text-gray-900">-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-gray-700 font-medium">采购方案</div>
                      <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('procurementPlanDoc'); setAfterSalesUploadOpen(true); }}>
                        上传
                      </Button>
                    </div>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-3 py-2 text-left font-medium text-gray-600">方案名称</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">方案编码</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">金额</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">状态</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">日期</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">供应商</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-gray-900">服务器采购方案</td>
                          <td className="px-3 py-2 text-gray-900">FA-2026-001</td>
                          <td className="px-3 py-2 text-gray-900">¥48,000</td>
                          <td className="px-3 py-2"><span className="text-green-600 bg-green-50 px-2 py-0.5 rounded">已通过</span></td>
                          <td className="px-3 py-2 text-gray-900">2026-03-16</td>
                          <td className="px-3 py-2 text-gray-900">杭州XX科技</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-gray-700 font-medium">采购结果</div>
                      <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('procurementResultDoc'); setAfterSalesUploadOpen(true); }}>
                        上传
                      </Button>
                    </div>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-3 py-2 text-left font-medium text-gray-600">结果名称</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">结果编码</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">金额</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">状态</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">日期</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">供应商</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-gray-900">服务器采购合同</td>
                          <td className="px-3 py-2 text-gray-900">JG-2026-001</td>
                          <td className="px-3 py-2 text-gray-900">¥48,000</td>
                          <td className="px-3 py-2"><span className="text-green-600 bg-green-50 px-2 py-0.5 rounded">已签约</span></td>
                          <td className="px-3 py-2 text-gray-900">2026-03-18</td>
                          <td className="px-3 py-2 text-gray-900">杭州XX科技</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : second.id === 'solutionDesign' ? (
                // 方案设计与审核表单展示 - 两列两行布局
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {/* 第一行：总体解决方案文档 + 方案审核记录 */}
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">总体解决方案文档 <span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-2 mb-2">
                      <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('solutionDoc'); setAfterSalesUploadOpen(true); }}>
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        上传
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs h-7">下载模版</Button>
                    </div>
                    {(uploadedFiles['solutionDoc'] || []).length > 0 && (
                      <div className="space-y-1">
                        {(uploadedFiles['solutionDoc'] || []).map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${file.synced ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {file.synced ? '已同步' : '未同步'}
                            </span>
                            <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                            {!file.synced && (
                              <Button variant="link" size="sm" className="text-xs p-0 h-auto whitespace-nowrap" onClick={() => setUploadedFiles(prev => {
                                const newDocs = [...(prev['solutionDoc'] || [])];
                                newDocs[index] = { ...newDocs[index], synced: true };
                                return { ...prev, solutionDoc: newDocs };
                              })}>
                                同步
                              </Button>
                            )}
                            <button onClick={() => setUploadedFiles(prev => {
                              const newDocs = (prev['solutionDoc'] || []).filter((_, i) => i !== index);
                              return { ...prev, solutionDoc: newDocs };
                            })} className="text-gray-400 hover:text-red-500 p-0.5 flex-shrink-0">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">方案审核记录 <span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-2 mb-2">
                      <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('reviewRecord'); setAfterSalesUploadOpen(true); }}>
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        上传
                      </Button>
                    </div>
                    {(uploadedFiles['reviewRecord'] || []).length > 0 && (
                      <div className="space-y-1">
                        {(uploadedFiles['reviewRecord'] || []).map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${file.synced ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {file.synced ? '已同步' : '未同步'}
                            </span>
                            <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                            {!file.synced && (
                              <Button variant="link" size="sm" className="text-xs p-0 h-auto whitespace-nowrap" onClick={() => setUploadedFiles(prev => {
                                const newDocs = [...(prev['reviewRecord'] || [])];
                                newDocs[index] = { ...newDocs[index], synced: true };
                                return { ...prev, reviewRecord: newDocs };
                              })}>
                                同步
                              </Button>
                            )}
                            <button onClick={() => setUploadedFiles(prev => {
                              const newDocs = (prev['reviewRecord'] || []).filter((_, i) => i !== index);
                              return { ...prev, reviewRecord: newDocs };
                            })} className="text-gray-400 hover:text-red-500 p-0.5 flex-shrink-0">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 第二行：专题研讨会记录 + 可研报告 */}
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">专题研讨会记录 <span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-2 mb-2">
                      <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('seminarRecord'); setAfterSalesUploadOpen(true); }}>
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        上传
                      </Button>
                    </div>
                    {(uploadedFiles['seminarRecord'] || []).length > 0 && (
                      <div className="space-y-1">
                        {(uploadedFiles['seminarRecord'] || []).map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${file.synced ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {file.synced ? '已同步' : '未同步'}
                            </span>
                            <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                            {!file.synced && (
                              <Button variant="link" size="sm" className="text-xs p-0 h-auto whitespace-nowrap" onClick={() => setUploadedFiles(prev => {
                                const newDocs = [...(prev['seminarRecord'] || [])];
                                newDocs[index] = { ...newDocs[index], synced: true };
                                return { ...prev, seminarRecord: newDocs };
                              })}>
                                同步
                              </Button>
                            )}
                            <button onClick={() => setUploadedFiles(prev => {
                              const newDocs = (prev['seminarRecord'] || []).filter((_, i) => i !== index);
                              return { ...prev, seminarRecord: newDocs };
                            })} className="text-gray-400 hover:text-red-500 p-0.5 flex-shrink-0">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">可研报告</label>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="text-gray-600">上传</span>
                        <input type="file" multiple className="hidden" onChange={(e) => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            const newFiles = Array.from(files).map(file => ({
                              name: file.name,
                              size: file.size < 1024 * 1024 ? (file.size / 1024).toFixed(1) + ' KB' : (file.size / 1024 / 1024).toFixed(1) + ' MB',
                              uploadTime: new Date().toLocaleString(),
                              synced: false
                            }));
                            setUploadedFiles(prev => ({
                              ...prev,
                              feasibilityReport: [...(prev['feasibilityReport'] || []), ...newFiles]
                            }));
                          }
                        }} />
                      </label>
                      <Button variant="outline" size="sm" className="text-xs h-7">下载模版</Button>
                    </div>
                    {(uploadedFiles['feasibilityReport'] || []).length > 0 && (
                      <div className="space-y-1">
                        {(uploadedFiles['feasibilityReport'] || []).map((file, index) => (
                          <div key={index} className="flex items-center justify-between py-1 border-b border-gray-100">
                            <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button onClick={() => setUploadedFiles(prev => {
                                const newDocs = (prev['feasibilityReport'] || []).filter((_, i) => i !== index);
                                return { ...prev, feasibilityReport: newDocs };
                              })} className="text-gray-400 hover:text-red-500 p-0.5">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* 第三行：客户方案沟通记录（仅省内） */}
                  <div className="col-span-2">
                    <label className="text-xs text-gray-500 block mb-1">客户方案沟通记录</label>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="text-gray-600">上传</span>
                        <input type="file" multiple className="hidden" onChange={(e) => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            const newFiles = Array.from(files).map(file => ({
                              name: file.name,
                              size: file.size < 1024 * 1024 ? (file.size / 1024).toFixed(1) + ' KB' : (file.size / 1024 / 1024).toFixed(1) + ' MB',
                              uploadTime: new Date().toLocaleString(),
                              synced: false
                            }));
                            setUploadedFiles(prev => ({
                              ...prev,
                              customerCommunicationRecord: [...(prev['customerCommunicationRecord'] || []), ...newFiles]
                            }));
                          }
                        }} />
                      </label>
                    </div>
                    {(uploadedFiles['customerCommunicationRecord'] || []).length > 0 && (
                      <div className="space-y-1">
                        {(uploadedFiles['customerCommunicationRecord'] || []).map((file, index) => (
                          <div key={index} className="flex items-center justify-between py-1 border-b border-gray-100">
                            <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button onClick={() => setUploadedFiles(prev => {
                                const newDocs = (prev['customerCommunicationRecord'] || []).filter((_, i) => i !== index);
                                return { ...prev, customerCommunicationRecord: newDocs };
                              })} className="text-gray-400 hover:text-red-500 p-0.5">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : second.id === 'solutionDeconstruct' ? (
                // 方案解构与中台把关表单
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">方案解构 <span className="text-red-500">*</span></label>
                    <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="text-gray-600">上传</span>
                      <input type="file" multiple className="hidden" />
                    </label>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">中台把关 <span className="text-red-500">*</span></label>
                    <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="text-gray-600">上传</span>
                      <input type="file" multiple className="hidden" />
                    </label>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">把关结果 <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50">通过</button>
                      <button className="px-3 py-1 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50">不通过</button>
                    </div>
                  </div>
                </div>
              ) : second.id === 'overallPlan' ? (
                // 具备项目实施总体设计表单
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">总体实施方案文档 <span className="text-red-500">*</span></label>
                    <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('overallPlanDoc'); setAfterSalesUploadOpen(true); }}>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      上传
                    </Button>
                    {(uploadedFiles['overallPlanDoc'] || []).length > 0 && (
                      <div className="space-y-1 mt-2">
                        {(uploadedFiles['overallPlanDoc'] || []).map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${file.synced ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {file.synced ? '已同步' : '未同步'}
                            </span>
                            <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                            {!file.synced && (
                              <Button variant="link" size="sm" className="text-xs p-0 h-auto whitespace-nowrap" onClick={() => setUploadedFiles(prev => {
                                const newDocs = [...(prev['overallPlanDoc'] || [])];
                                newDocs[index] = { ...newDocs[index], synced: true };
                                return { ...prev, overallPlanDoc: newDocs };
                              })}>
                                同步
                              </Button>
                            )}
                            <button onClick={() => setUploadedFiles(prev => {
                              const newDocs = (prev['overallPlanDoc'] || []).filter((_, i) => i !== index);
                              return { ...prev, overallPlanDoc: newDocs };
                            })} className="text-gray-400 hover:text-red-500 p-0.5 flex-shrink-0">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">前向监理报告、监理日志</label>
                    <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="text-gray-600">上传</span>
                      <input type="file" multiple className="hidden" onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          const newFiles = Array.from(files).map(file => ({
                            name: file.name,
                            size: file.size < 1024 * 1024 ? (file.size / 1024).toFixed(1) + ' KB' : (file.size / 1024 / 1024).toFixed(1) + ' MB',
                            uploadTime: new Date().toLocaleString(),
                            synced: false
                          }));
                          setUploadedFiles(prev => ({
                            ...prev,
                            supervisorReport: [...(prev['supervisorReport'] || []), ...newFiles]
                          }));
                        }
                      }} />
                    </label>
                    {(uploadedFiles['supervisorReport'] || []).length > 0 && (
                      <div className="space-y-1 mt-2">
                        {(uploadedFiles['supervisorReport'] || []).map((file, index) => (
                          <div key={index} className="flex items-center justify-between py-1 border-b border-gray-100">
                            <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button onClick={() => setUploadedFiles(prev => {
                                const newDocs = (prev['supervisorReport'] || []).filter((_, i) => i !== index);
                                return { ...prev, supervisorReport: newDocs };
                              })} className="text-gray-400 hover:text-red-500 p-0.5">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : second.id === 'changeRecord' ? (
                // 具备变更记录表单
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">变更内容</label>
                    <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('changeContent'); setAfterSalesUploadOpen(true); }}>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      上传
                    </Button>
                    {(uploadedFiles['changeContent'] || []).length > 0 && (
                      <div className="space-y-1 mt-2">
                        {(uploadedFiles['changeContent'] || []).map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${file.synced ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {file.synced ? '已同步' : '未同步'}
                            </span>
                            <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                            {!file.synced && (
                              <Button variant="link" size="sm" className="text-xs p-0 h-auto whitespace-nowrap" onClick={() => setUploadedFiles(prev => {
                                const newDocs = [...(prev['changeContent'] || [])];
                                newDocs[index] = { ...newDocs[index], synced: true };
                                return { ...prev, changeContent: newDocs };
                              })}>
                                同步
                              </Button>
                            )}
                            <button onClick={() => setUploadedFiles(prev => {
                              const newDocs = (prev['changeContent'] || []).filter((_, i) => i !== index);
                              return { ...prev, changeContent: newDocs };
                            })} className="text-gray-400 hover:text-red-500 p-0.5 flex-shrink-0">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">变更审核</label>
                    <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('changeReview'); setAfterSalesUploadOpen(true); }}>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      上传
                    </Button>
                    {(uploadedFiles['changeReview'] || []).length > 0 && (
                      <div className="space-y-1 mt-2">
                        {(uploadedFiles['changeReview'] || []).map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${file.synced ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {file.synced ? '已同步' : '未同步'}
                            </span>
                            <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                            {!file.synced && (
                              <Button variant="link" size="sm" className="text-xs p-0 h-auto whitespace-nowrap" onClick={() => setUploadedFiles(prev => {
                                const newDocs = [...(prev['changeReview'] || [])];
                                newDocs[index] = { ...newDocs[index], synced: true };
                                return { ...prev, changeReview: newDocs };
                              })}>
                                同步
                              </Button>
                            )}
                            <button onClick={() => setUploadedFiles(prev => {
                              const newDocs = (prev['changeReview'] || []).filter((_, i) => i !== index);
                              return { ...prev, changeReview: newDocs };
                            })} className="text-gray-400 hover:text-red-500 p-0.5 flex-shrink-0">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : second.id === 'implementationDocs' ? (
                // 项目实施文件表单
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">会议纪要</label>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('meetingMinutes'); setAfterSalesUploadOpen(true); }}>
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        上传
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs h-7">下载模版</Button>
                    </div>
                    {(uploadedFiles['meetingMinutes'] || []).length > 0 && (
                      <div className="space-y-1 mt-2">
                        {(uploadedFiles['meetingMinutes'] || []).map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${file.synced ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {file.synced ? '已同步' : '未同步'}
                            </span>
                            <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                            {!file.synced && (
                              <Button variant="link" size="sm" className="text-xs p-0 h-auto whitespace-nowrap" onClick={() => setUploadedFiles(prev => {
                                const newDocs = [...(prev['meetingMinutes'] || [])];
                                newDocs[index] = { ...newDocs[index], synced: true };
                                return { ...prev, meetingMinutes: newDocs };
                              })}>
                                同步
                              </Button>
                            )}
                            <button onClick={() => setUploadedFiles(prev => {
                              const newDocs = (prev['meetingMinutes'] || []).filter((_, i) => i !== index);
                              return { ...prev, meetingMinutes: newDocs };
                            })} className="text-gray-400 hover:text-red-500 p-0.5 flex-shrink-0">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">项目周报/月报</label>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('weeklyReport'); setAfterSalesUploadOpen(true); }}>
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        上传
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs h-7">下载模版</Button>
                    </div>
                    {(uploadedFiles['weeklyReport'] || []).length > 0 && (
                      <div className="space-y-1 mt-2">
                        {(uploadedFiles['weeklyReport'] || []).map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${file.synced ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {file.synced ? '已同步' : '未同步'}
                            </span>
                            <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                            {!file.synced && (
                              <Button variant="link" size="sm" className="text-xs p-0 h-auto whitespace-nowrap" onClick={() => setUploadedFiles(prev => {
                                const newDocs = [...(prev['weeklyReport'] || [])];
                                newDocs[index] = { ...newDocs[index], synced: true };
                                return { ...prev, weeklyReport: newDocs };
                              })}>
                                同步
                              </Button>
                            )}
                            <button onClick={() => setUploadedFiles(prev => {
                              const newDocs = (prev['weeklyReport'] || []).filter((_, i) => i !== index);
                              return { ...prev, weeklyReport: newDocs };
                            })} className="text-gray-400 hover:text-red-500 p-0.5 flex-shrink-0">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">延期说明</label>
                    <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('delayExplanation'); setAfterSalesUploadOpen(true); }}>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      上传
                    </Button>
                    {(uploadedFiles['delayExplanation'] || []).length > 0 && (
                      <div className="space-y-1 mt-2">
                        {(uploadedFiles['delayExplanation'] || []).map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${file.synced ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {file.synced ? '已同步' : '未同步'}
                            </span>
                            <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                            {!file.synced && (
                              <Button variant="link" size="sm" className="text-xs p-0 h-auto whitespace-nowrap" onClick={() => setUploadedFiles(prev => {
                                const newDocs = [...(prev['delayExplanation'] || [])];
                                newDocs[index] = { ...newDocs[index], synced: true };
                                return { ...prev, delayExplanation: newDocs };
                              })}>
                                同步
                              </Button>
                            )}
                            <button onClick={() => setUploadedFiles(prev => {
                              const newDocs = (prev['delayExplanation'] || []).filter((_, i) => i !== index);
                              return { ...prev, delayExplanation: newDocs };
                            })} className="text-gray-400 hover:text-red-500 p-0.5 flex-shrink-0">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">竣工报告</label>
                    <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('completionReport'); setAfterSalesUploadOpen(true); }}>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      上传
                    </Button>
                    {(uploadedFiles['completionReport'] || []).length > 0 && (
                      <div className="space-y-1 mt-2">
                        {(uploadedFiles['completionReport'] || []).map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${file.synced ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {file.synced ? '已同步' : '未同步'}
                            </span>
                            <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                            {!file.synced && (
                              <Button variant="link" size="sm" className="text-xs p-0 h-auto whitespace-nowrap" onClick={() => setUploadedFiles(prev => {
                                const newDocs = [...(prev['completionReport'] || [])];
                                newDocs[index] = { ...newDocs[index], synced: true };
                                return { ...prev, completionReport: newDocs };
                              })}>
                                同步
                              </Button>
                            )}
                            <button onClick={() => setUploadedFiles(prev => {
                              const newDocs = (prev['completionReport'] || []).filter((_, i) => i !== index);
                              return { ...prev, completionReport: newDocs };
                            })} className="text-gray-400 hover:text-red-500 p-0.5 flex-shrink-0">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">问题纪要</label>
                    <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('issueMinutes'); setAfterSalesUploadOpen(true); }}>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      上传
                    </Button>
                    {(uploadedFiles['issueMinutes'] || []).length > 0 && (
                      <div className="space-y-1 mt-2">
                        {(uploadedFiles['issueMinutes'] || []).map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${file.synced ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {file.synced ? '已同步' : '未同步'}
                            </span>
                            <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                            {!file.synced && (
                              <Button variant="link" size="sm" className="text-xs p-0 h-auto whitespace-nowrap" onClick={() => setUploadedFiles(prev => {
                                const newDocs = [...(prev['issueMinutes'] || [])];
                                newDocs[index] = { ...newDocs[index], synced: true };
                                return { ...prev, issueMinutes: newDocs };
                              })}>
                                同步
                              </Button>
                            )}
                            <button onClick={() => setUploadedFiles(prev => {
                              const newDocs = (prev['issueMinutes'] || []).filter((_, i) => i !== index);
                              return { ...prev, issueMinutes: newDocs };
                            })} className="text-gray-400 hover:text-red-500 p-0.5 flex-shrink-0">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">起租相关附件</label>
                    <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('rentAttach'); setAfterSalesUploadOpen(true); }}>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      上传
                    </Button>
                    {(uploadedFiles['rentAttach'] || []).length > 0 && (
                      <div className="space-y-1 mt-2">
                        {(uploadedFiles['rentAttach'] || []).map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${file.synced ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {file.synced ? '已同步' : '未同步'}
                            </span>
                            <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                            {!file.synced && (
                              <Button variant="link" size="sm" className="text-xs p-0 h-auto whitespace-nowrap" onClick={() => setUploadedFiles(prev => {
                                const newDocs = [...(prev['rentAttach'] || [])];
                                newDocs[index] = { ...newDocs[index], synced: true };
                                return { ...prev, rentAttach: newDocs };
                              })}>
                                同步
                              </Button>
                            )}
                            <button onClick={() => setUploadedFiles(prev => {
                              const newDocs = (prev['rentAttach'] || []).filter((_, i) => i !== index);
                              return { ...prev, rentAttach: newDocs };
                            })} className="text-gray-400 hover:text-red-500 p-0.5 flex-shrink-0">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">软硬件设备或服务清单</label>
                    <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('hardwareList'); setAfterSalesUploadOpen(true); }}>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      上传
                    </Button>
                    {(uploadedFiles['hardwareList'] || []).length > 0 && (
                      <div className="space-y-1 mt-2">
                        {(uploadedFiles['hardwareList'] || []).map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${file.synced ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {file.synced ? '已同步' : '未同步'}
                            </span>
                            <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                            {!file.synced && (
                              <Button variant="link" size="sm" className="text-xs p-0 h-auto whitespace-nowrap" onClick={() => setUploadedFiles(prev => {
                                const newDocs = [...(prev['hardwareList'] || [])];
                                newDocs[index] = { ...newDocs[index], synced: true };
                                return { ...prev, hardwareList: newDocs };
                              })}>
                                同步
                              </Button>
                            )}
                            <button onClick={() => setUploadedFiles(prev => {
                              const newDocs = (prev['hardwareList'] || []).filter((_, i) => i !== index);
                              return { ...prev, hardwareList: newDocs };
                            })} className="text-gray-400 hover:text-red-500 p-0.5 flex-shrink-0">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">项目交付报告</label>
                    <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('deliveryReport'); setAfterSalesUploadOpen(true); }}>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      上传
                    </Button>
                    {(uploadedFiles['deliveryReport'] || []).length > 0 && (
                      <div className="space-y-1 mt-2">
                        {(uploadedFiles['deliveryReport'] || []).map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${file.synced ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {file.synced ? '已同步' : '未同步'}
                            </span>
                            <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                            {!file.synced && (
                              <Button variant="link" size="sm" className="text-xs p-0 h-auto whitespace-nowrap" onClick={() => setUploadedFiles(prev => {
                                const newDocs = [...(prev['deliveryReport'] || [])];
                                newDocs[index] = { ...newDocs[index], synced: true };
                                return { ...prev, deliveryReport: newDocs };
                              })}>
                                同步
                              </Button>
                            )}
                            <button onClick={() => setUploadedFiles(prev => {
                              const newDocs = (prev['deliveryReport'] || []).filter((_, i) => i !== index);
                              return { ...prev, deliveryReport: newDocs };
                            })} className="text-gray-400 hover:text-red-500 p-0.5 flex-shrink-0">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">项目交维报告</label>
                    <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('transferReport'); setAfterSalesUploadOpen(true); }}>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      上传
                    </Button>
                    {(uploadedFiles['transferReport'] || []).length > 0 && (
                      <div className="space-y-1 mt-2">
                        {(uploadedFiles['transferReport'] || []).map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${file.synced ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {file.synced ? '已同步' : '未同步'}
                            </span>
                            <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                            {!file.synced && (
                              <Button variant="link" size="sm" className="text-xs p-0 h-auto whitespace-nowrap" onClick={() => setUploadedFiles(prev => {
                                const newDocs = [...(prev['transferReport'] || [])];
                                newDocs[index] = { ...newDocs[index], synced: true };
                                return { ...prev, transferReport: newDocs };
                              })}>
                                同步
                              </Button>
                            )}
                            <button onClick={() => setUploadedFiles(prev => {
                              const newDocs = (prev['transferReport'] || []).filter((_, i) => i !== index);
                              return { ...prev, transferReport: newDocs };
                            })} className="text-gray-400 hover:text-red-500 p-0.5 flex-shrink-0">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">项目试运行报告</label>
                    <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('trialReport'); setAfterSalesUploadOpen(true); }}>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      上传
                    </Button>
                    {(uploadedFiles['trialReport'] || []).length > 0 && (
                      <div className="space-y-1 mt-2">
                        {(uploadedFiles['trialReport'] || []).map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${file.synced ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {file.synced ? '已同步' : '未同步'}
                            </span>
                            <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                            {!file.synced && (
                              <Button variant="link" size="sm" className="text-xs p-0 h-auto whitespace-nowrap" onClick={() => setUploadedFiles(prev => {
                                const newDocs = [...(prev['trialReport'] || [])];
                                newDocs[index] = { ...newDocs[index], synced: true };
                                return { ...prev, trialReport: newDocs };
                              })}>
                                同步
                              </Button>
                            )}
                            <button onClick={() => setUploadedFiles(prev => {
                              const newDocs = (prev['trialReport'] || []).filter((_, i) => i !== index);
                              return { ...prev, trialReport: newDocs };
                            })} className="text-gray-400 hover:text-red-500 p-0.5 flex-shrink-0">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">后向厂家任务计划</label>
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="text-gray-600">上传</span>
                        <input type="file" multiple className="hidden" />
                      </label>
                      <Button variant="outline" size="sm" className="text-xs h-7">下载模版</Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">后向厂家团队清单</label>
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="text-gray-600">上传</span>
                        <input type="file" multiple className="hidden" />
                      </label>
                      <Button variant="outline" size="sm" className="text-xs h-7">下载模版</Button>
                    </div>
                  </div>
                </div>
              ) : second.id === 'auditList' ? (
                // 审计清单表单
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">项目送审承诺函-建设方</label>
                    <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="text-gray-600">上传</span>
                      <input type="file" multiple className="hidden" />
                    </label>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">送审项目基本信息表</label>
                    <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="text-gray-600">上传</span>
                      <input type="file" multiple className="hidden" />
                    </label>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">前向审计报告/前向结算审定书</label>
                    <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="text-gray-600">上传</span>
                      <input type="file" multiple className="hidden" />
                    </label>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">项目送审承诺函-施工方</label>
                    <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="text-gray-600">上传</span>
                      <input type="file" multiple className="hidden" />
                    </label>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">后向结算送审清单</label>
                    <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="text-gray-600">上传</span>
                      <input type="file" multiple className="hidden" />
                    </label>
                  </div>
                </div>
              ) : second.id === 'acceptanceReport' ? (
                // 具备验收报告表单
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">初验报告</label>
                    <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('initialAcceptance'); setAfterSalesUploadOpen(true); }}>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      上传
                    </Button>
                    {(uploadedFiles['initialAcceptance'] || []).length > 0 && (
                      <div className="space-y-1 mt-2">
                        {(uploadedFiles['initialAcceptance'] || []).map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${file.synced ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {file.synced ? '已同步' : '未同步'}
                            </span>
                            <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                            {!file.synced && (
                              <Button variant="link" size="sm" className="text-xs p-0 h-auto whitespace-nowrap" onClick={() => setUploadedFiles(prev => {
                                const newDocs = [...(prev['initialAcceptance'] || [])];
                                newDocs[index] = { ...newDocs[index], synced: true };
                                return { ...prev, initialAcceptance: newDocs };
                              })}>
                                同步
                              </Button>
                            )}
                            <button onClick={() => setUploadedFiles(prev => {
                              const newDocs = (prev['initialAcceptance'] || []).filter((_, i) => i !== index);
                              return { ...prev, initialAcceptance: newDocs };
                            })} className="text-gray-400 hover:text-red-500 p-0.5 flex-shrink-0">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">终验报告 <span className="text-red-500">*</span></label>
                    <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('finalAcceptance'); setAfterSalesUploadOpen(true); }}>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      上传
                    </Button>
                    {(uploadedFiles['finalAcceptance'] || []).length > 0 && (
                      <div className="space-y-1 mt-2">
                        {(uploadedFiles['finalAcceptance'] || []).map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${file.synced ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {file.synced ? '已同步' : '未同步'}
                            </span>
                            <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                            {!file.synced && (
                              <Button variant="link" size="sm" className="text-xs p-0 h-auto whitespace-nowrap" onClick={() => setUploadedFiles(prev => {
                                const newDocs = [...(prev['finalAcceptance'] || [])];
                                newDocs[index] = { ...newDocs[index], synced: true };
                                return { ...prev, finalAcceptance: newDocs };
                              })}>
                                同步
                              </Button>
                            )}
                            <button onClick={() => setUploadedFiles(prev => {
                              const newDocs = (prev['finalAcceptance'] || []).filter((_, i) => i !== index);
                              return { ...prev, finalAcceptance: newDocs };
                            })} className="text-gray-400 hover:text-red-500 p-0.5 flex-shrink-0">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">形象进度表</label>
                    <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('progressForm'); setAfterSalesUploadOpen(true); }}>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      上传
                    </Button>
                    {(uploadedFiles['progressForm'] || []).length > 0 && (
                      <div className="space-y-1 mt-2">
                        {(uploadedFiles['progressForm'] || []).map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${file.synced ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {file.synced ? '已同步' : '未同步'}
                            </span>
                            <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                            {!file.synced && (
                              <Button variant="link" size="sm" className="text-xs p-0 h-auto whitespace-nowrap" onClick={() => setUploadedFiles(prev => {
                                const newDocs = [...(prev['progressForm'] || [])];
                                newDocs[index] = { ...newDocs[index], synced: true };
                                return { ...prev, progressForm: newDocs };
                              })}>
                                同步
                              </Button>
                            )}
                            <button onClick={() => setUploadedFiles(prev => {
                              const newDocs = (prev['progressForm'] || []).filter((_, i) => i !== index);
                              return { ...prev, progressForm: newDocs };
                            })} className="text-gray-400 hover:text-red-500 p-0.5 flex-shrink-0">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">项目试运行报告</label>
                    <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('trialReportAcceptance'); setAfterSalesUploadOpen(true); }}>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      上传
                    </Button>
                    {(uploadedFiles['trialReportAcceptance'] || []).length > 0 && (
                      <div className="space-y-1 mt-2">
                        {(uploadedFiles['trialReportAcceptance'] || []).map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${file.synced ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {file.synced ? '已同步' : '未同步'}
                            </span>
                            <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                            {!file.synced && (
                              <Button variant="link" size="sm" className="text-xs p-0 h-auto whitespace-nowrap" onClick={() => setUploadedFiles(prev => {
                                const newDocs = [...(prev['trialReportAcceptance'] || [])];
                                newDocs[index] = { ...newDocs[index], synced: true };
                                return { ...prev, trialReportAcceptance: newDocs };
                              })}>
                                同步
                              </Button>
                            )}
                            <button onClick={() => setUploadedFiles(prev => {
                              const newDocs = (prev['trialReportAcceptance'] || []).filter((_, i) => i !== index);
                              return { ...prev, trialReportAcceptance: newDocs };
                            })} className="text-gray-400 hover:text-red-500 p-0.5 flex-shrink-0">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : second.id === 'digitalAsset' ? (
                // 数字资产平台表单
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">商机是否建档 <span className="text-red-500">*</span></label>
                    <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('assetArchive'); setAfterSalesUploadOpen(true); }}>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      上传
                    </Button>
                    {(uploadedFiles['assetArchive'] || []).length > 0 && (
                      <div className="space-y-1 mt-2">
                        {(uploadedFiles['assetArchive'] || []).map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${file.synced ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {file.synced ? '已同步' : '未同步'}
                            </span>
                            <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                            {!file.synced && (
                              <Button variant="link" size="sm" className="text-xs p-0 h-auto whitespace-nowrap" onClick={() => setUploadedFiles(prev => {
                                const newDocs = [...(prev['assetArchive'] || [])];
                                newDocs[index] = { ...newDocs[index], synced: true };
                                return { ...prev, assetArchive: newDocs };
                              })}>
                                同步
                              </Button>
                            )}
                            <button onClick={() => setUploadedFiles(prev => {
                              const newDocs = (prev['assetArchive'] || []).filter((_, i) => i !== index);
                              return { ...prev, assetArchive: newDocs };
                            })} className="text-gray-400 hover:text-red-500 p-0.5 flex-shrink-0">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : second.id === 'firstServiceInterface' ? (
                // 具备第一服务界面表单
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">电话或在线台席项目记录 <span className="text-red-500">*</span></label>
                    <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => { setUploadField('serviceDesk'); setAfterSalesUploadOpen(true); }}>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      上传
                    </Button>
                    {(uploadedFiles['serviceDesk'] || []).length > 0 && (
                      <div className="space-y-1 mt-2">
                        {(uploadedFiles['serviceDesk'] || []).map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${file.synced ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {file.synced ? '已同步' : '未同步'}
                            </span>
                            <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                            {!file.synced && (
                              <Button variant="link" size="sm" className="text-xs p-0 h-auto whitespace-nowrap" onClick={() => setUploadedFiles(prev => {
                                const newDocs = [...(prev['serviceDesk'] || [])];
                                newDocs[index] = { ...newDocs[index], synced: true };
                                return { ...prev, serviceDesk: newDocs };
                              })}>
                                同步
                              </Button>
                            )}
                            <button onClick={() => setUploadedFiles(prev => {
                              const newDocs = (prev['serviceDesk'] || []).filter((_, i) => i !== index);
                              return { ...prev, serviceDesk: newDocs };
                            })} className="text-gray-400 hover:text-red-500 p-0.5 flex-shrink-0">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : second.id === 'afterSalesDocs' ? (
                // 售后其他资料表单
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">服务器资源</label>
                    <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="text-gray-600">上传</span>
                      <input type="file" multiple className="hidden" />
                    </label>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">运维群</label>
                    <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="text-gray-600">上传</span>
                      <input type="file" multiple className="hidden" />
                    </label>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">培训记录</label>
                    <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="text-gray-600">上传</span>
                      <input type="file" multiple className="hidden" />
                    </label>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">培训照片</label>
                    <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="text-gray-600">上传</span>
                      <input type="file" multiple className="hidden" />
                    </label>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">需求规格说明书</label>
                    <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="text-gray-600">上传</span>
                      <input type="file" multiple className="hidden" />
                    </label>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">概要设计说明书</label>
                    <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="text-gray-600">上传</span>
                      <input type="file" multiple className="hidden" />
                    </label>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">详细设计说明书</label>
                    <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="text-gray-600">上传</span>
                      <input type="file" multiple className="hidden" />
                    </label>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">数据库设计说明书</label>
                    <label className="inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-xs">
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="text-gray-600">上传</span>
                      <input type="file" multiple className="hidden" />
                    </label>
                  </div>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-3 py-2 text-left font-medium text-gray-600 w-8">状态</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">三级节点</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">规则说明</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">录入入口</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-600">同步类型</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {second.thirdLevel.map(third => (
                      <tr key={third.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2"><div className={`w-3 h-3 rounded-full mx-auto ${third.includedInSixPosition ? 'bg-green-500' : 'bg-red-500'}`} /></td>
                        <td className="px-3 py-2 text-gray-900">{third.name}</td>
                        <td className="px-3 py-2 text-gray-600 text-xs whitespace-pre-line">{third.rule}</td>
                        <td className="px-3 py-2 text-gray-600 text-xs">{third.entryPoint}</td>
                        <td className="px-3 py-2"><Badge variant={third.syncType.includes('具备') ? 'default' : 'secondary'} className="text-xs">{third.syncType}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      ))}
      {solutionUploadOpen && (
        <SolutionUploadModal
          open={solutionUploadOpen}
          uploadField={uploadField}
          onOpenChange={setSolutionUploadOpen}
          onUpload={(field, files) => {
            if (field && field.trim()) {
              setUploadedFiles(prev => ({
                ...prev,
                [field]: [...(prev[field] || []), ...files]
              }));
            }
          }}
        />
      )}
      {biddingUploadOpen && (
        <BiddingUploadModal
          open={biddingUploadOpen}
          uploadField={uploadField}
          onOpenChange={setBiddingUploadOpen}
          onUpload={(field, files) => {
            if (field && field.trim()) {
              setBiddingFiles(prev => ({
                ...prev,
                [field]: [...(prev[field] || []), ...files]
              }));
              setUploadedFiles(prev => ({
                ...prev,
                [field]: [...(prev[field] || []), ...files]
              }));
            }
          }}
        />
      )}
      {afterSalesUploadOpen && (
        <AfterSalesUploadModal
          open={afterSalesUploadOpen}
          uploadField={uploadField}
          onOpenChange={setAfterSalesUploadOpen}
          onUpload={(field, files) => {
            if (field && field.trim()) {
              setUploadedFiles(prev => ({
                ...prev,
                [field]: [...(prev[field] || []), ...files]
              }));
            }
          }}
        />
      )}
      {businessInfoModalOpen && (
        <BusinessInfoModal
          open={businessInfoModalOpen}
          onOpenChange={setBusinessInfoModalOpen}
          businessInfoList={businessInfoList}
          selectedIds={selectedBusinessInfo}
          onSelectionChange={setSelectedBusinessInfo}
          onBind={() => {
            console.log('绑定的商情:', Array.from(selectedBusinessInfo));
          }}
        />
      )}
    </div>
  );
}

// 拜访记录弹窗
interface VisitRecordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (record: any) => void;
}

function VisitRecordModal({ open, onOpenChange, onSave }: VisitRecordModalProps) {
  const [formData, setFormData] = useState({
    customerUnit: "",
    contact: "",
    purpose: "",
    date: "",
    location: "",
    visitor: "",
    keyPoints: "",
  });
  const [theirParticipants, setTheirParticipants] = useState([{ name: "", isLeader: false }]);
  const [ourParticipants, setOurParticipants] = useState([{ name: "", isLeader: false }]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const visitTypeOptions = [
    { value: "日常拜访", label: "日常拜访" },
    { value: "商机推进拜访", label: "商机推进拜访" },
    { value: "交流拜访", label: "交流拜访" },
    { value: "陌生拜访", label: "陌生拜访" },
    { value: "签约", label: "签约" },
    { value: "其他", label: "其他" },
    { value: "战略合作", label: "战略合作" },
    { value: "公开活动", label: "公开活动" },
  ];

  const handleAddParticipant = (type: "their" | "our") => {
    if (type === "their") {
      setTheirParticipants([...theirParticipants, { name: "", isLeader: false }]);
    } else {
      setOurParticipants([...ourParticipants, { name: "", isLeader: false }]);
    }
  };

  const handleRemoveParticipant = (type: "their" | "our", index: number) => {
    if (type === "their") {
      setTheirParticipants(theirParticipants.filter((_, i) => i !== index));
    } else {
      setOurParticipants(ourParticipants.filter((_, i) => i !== index));
    }
  };

  const handleParticipantChange = (
    type: "their" | "our",
    index: number,
    field: "name" | "isLeader",
    value: string | boolean
  ) => {
    if (type === "their") {
      const updated = [...theirParticipants];
      if (field === "name") updated[index].name = value as string;
      else updated[index].isLeader = value as boolean;
      setTheirParticipants(updated);
    } else {
      const updated = [...ourParticipants];
      if (field === "name") updated[index].name = value as string;
      else updated[index].isLeader = value as boolean;
      setOurParticipants(updated);
    }
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.date) newErrors.date = "拜访日期不能为空";
    if (!formData.location) newErrors.location = "拜访地点不能为空";
    if (!formData.purpose) newErrors.purpose = "拜访事由不能为空";
    if (!formData.keyPoints) newErrors.keyPoints = "会谈要点事项不能为空";
    if (theirParticipants.some((p) => !p.name)) newErrors.their = "对方参加人员姓名不能为空";
    if (ourParticipants.some((p) => !p.name)) newErrors.our = "我方参加人员姓名不能为空";
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave({
        customerUnit: formData.customerUnit || "杭州某某科技有限公司",
        contact: theirParticipants.map((p) => p.name).join("、"),
        purpose: formData.purpose,
        date: formData.date,
        location: formData.location,
        visitor: ourParticipants.map((p) => p.name).join("、"),
        photo: photos.length > 0 ? "已上传" : "待上传",
      });
      // 重置表单
      setFormData({ customerUnit: "", contact: "", purpose: "", date: "", location: "", visitor: "", keyPoints: "" });
      setTheirParticipants([{ name: "", isLeader: false }]);
      setOurParticipants([{ name: "", isLeader: false }]);
      setPhotos([]);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>新增走访信息</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* 拜访类型 */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">拜访类型 <span className="text-red-500">*</span></label>
            <select
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">请选择拜访类型</option>
              {visitTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {errors.purpose && <div className="text-red-500 text-xs mt-1">{errors.purpose}</div>}
          </div>

          {/* 拜访对象 */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">拜访对象 <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="请输入拜访对象"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 对方参加人员 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-600">
                对方参加人员 <span className="text-red-500">*</span>
              </label>
              <button
                onClick={() => handleAddParticipant("their")}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + 添加
              </button>
            </div>
            <div className="space-y-2">
              {theirParticipants.map((participant, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="姓名"
                    value={participant.name}
                    onChange={(e) => handleParticipantChange("their", index, "name", e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <label className="flex items-center gap-1 text-sm text-gray-600 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={participant.isLeader}
                      onChange={(e) => handleParticipantChange("their", index, "isLeader", e.target.checked)}
                      className="w-4 h-4"
                    />
                    高层
                  </label>
                  {theirParticipants.length > 1 && (
                    <button
                      onClick={() => handleRemoveParticipant("their", index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {errors.their && <div className="text-red-500 text-xs">{errors.their}</div>}
            </div>
          </div>

          {/* 我方参加人员 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-600">
                我方参加人员 <span className="text-red-500">*</span>
              </label>
              <button
                onClick={() => handleAddParticipant("our")}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + 添加
              </button>
            </div>
            <div className="space-y-2">
              {ourParticipants.map((participant, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="姓名"
                    value={participant.name}
                    onChange={(e) => handleParticipantChange("our", index, "name", e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <label className="flex items-center gap-1 text-sm text-gray-600 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={participant.isLeader}
                      onChange={(e) => handleParticipantChange("our", index, "isLeader", e.target.checked)}
                      className="w-4 h-4"
                    />
                    领导
                  </label>
                  {ourParticipants.length > 1 && (
                    <button
                      onClick={() => handleRemoveParticipant("our", index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {errors.our && <div className="text-red-500 text-xs">{errors.our}</div>}
            </div>
          </div>

          {/* 拜访日期 */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">拜访日期 <span className="text-red-500">*</span></label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.date && <div className="text-red-500 text-xs mt-1">{errors.date}</div>}
          </div>

          {/* 拜访地点 */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">拜访地点 <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="请输入拜访地点"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.location && <div className="text-red-500 text-xs mt-1">{errors.location}</div>}
          </div>

          {/* 双方会谈要点事项 */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">双方会谈要点事项 <span className="text-red-500">*</span></label>
            <textarea
              placeholder="请输入会谈要点事项"
              value={formData.keyPoints}
              onChange={(e) => setFormData({ ...formData, keyPoints: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            {errors.keyPoints && <div className="text-red-500 text-xs mt-1">{errors.keyPoints}</div>}
          </div>

          {/* 照片上传 */}
          <div>
            <label className="text-sm text-gray-600 block mb-3">照片上传</label>
            <div className="grid grid-cols-3 gap-3">
              {photos.map((photo, index) => (
                <div key={index} className="relative aspect-square bg-gray-100 rounded-lg">
                  <img src={photo} alt="" className="w-full h-full object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {photos.length < 9 && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs text-gray-500">上传</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) {
                        const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
                        setPhotos([...photos, ...newPhotos]);
                      }
                    }}
                  />
                </label>
              )}
            </div>
            <div className="mt-2 text-xs text-gray-500">最多上传9张照片，支持 JPG、PNG 格式</div>
          </div>

          {/* 按钮 */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
            <Button onClick={handleSubmit}>保存</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// 方案设计与审核上传弹窗
interface SolutionUploadModalProps {
  open: boolean;
  uploadField: string;
  onOpenChange: (open: boolean) => void;
  onUpload: (field: string, files: { name: string; size: string; uploadTime: string; synced: boolean }[]) => void;
}

function SolutionUploadModal({ open, uploadField, onOpenChange, onUpload }: SolutionUploadModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>选择上传方式</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-4">
          <label className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
            <span className="text-sm text-gray-600">仅上传省内</span>
            <input type="file" multiple className="hidden" onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                const newFiles = Array.from(files).map(file => ({
                  name: file.name,
                  size: file.size < 1024 * 1024 ? (file.size / 1024).toFixed(1) + ' KB' : (file.size / 1024 / 1024).toFixed(1) + ' MB',
                  uploadTime: new Date().toLocaleString(),
                  synced: false
                }));
                onUpload(uploadField, newFiles);
                onOpenChange(false);
              }
            }} />
          </label>
          <label className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600">
            <span className="text-sm">上传并同步集团</span>
            <input type="file" multiple className="hidden" onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                const newFiles = Array.from(files).map(file => ({
                  name: file.name,
                  size: file.size < 1024 * 1024 ? (file.size / 1024).toFixed(1) + ' KB' : (file.size / 1024 / 1024).toFixed(1) + ' MB',
                  uploadTime: new Date().toLocaleString(),
                  synced: true
                }));
                onUpload(uploadField, newFiles);
                onOpenChange(false);
              }
            }} />
          </label>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// 投标记录上传弹窗
interface BiddingUploadModalProps {
  open: boolean;
  uploadField: string;
  onOpenChange: (open: boolean) => void;
  onUpload: (field: string, files: { name: string; size: string; uploadTime: string; synced: boolean }[]) => void;
}

function BiddingUploadModal({ open, uploadField, onOpenChange, onUpload }: BiddingUploadModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>选择上传方式</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-4">
          <label className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
            <span className="text-sm text-gray-600">仅上传省内</span>
            <input type="file" multiple className="hidden" onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                const newFiles = Array.from(files).map(file => ({
                  name: file.name,
                  size: file.size < 1024 * 1024 ? (file.size / 1024).toFixed(1) + ' KB' : (file.size / 1024 / 1024).toFixed(1) + ' MB',
                  uploadTime: new Date().toLocaleString(),
                  synced: false
                }));
                onUpload(uploadField, newFiles);
                onOpenChange(false);
              }
            }} />
          </label>
          <label className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600">
            <span className="text-sm">上传并同步集团</span>
            <input type="file" multiple className="hidden" onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                const newFiles = Array.from(files).map(file => ({
                  name: file.name,
                  size: file.size < 1024 * 1024 ? (file.size / 1024).toFixed(1) + ' KB' : (file.size / 1024 / 1024).toFixed(1) + ' MB',
                  uploadTime: new Date().toLocaleString(),
                  synced: true
                }));
                onUpload(uploadField, newFiles);
                onOpenChange(false);
              }
            }} />
          </label>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// 售后资料上传弹窗（仅省内）
interface AfterSalesUploadModalProps {
  open: boolean;
  uploadField: string;
  onOpenChange: (open: boolean) => void;
  onUpload: (field: string, files: { name: string; size: string; uploadTime: string; synced: boolean }[]) => void;
}

function AfterSalesUploadModal({ open, uploadField, onOpenChange, onUpload }: AfterSalesUploadModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>上传</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-4">
          <label className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
            <span className="text-sm text-gray-600">上传</span>
            <input type="file" multiple className="hidden" onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                const newFiles = Array.from(files).map(file => ({
                  name: file.name,
                  size: file.size < 1024 * 1024 ? (file.size / 1024).toFixed(1) + ' KB' : (file.size / 1024 / 1024).toFixed(1) + ' MB',
                  uploadTime: new Date().toLocaleString(),
                  synced: false
                }));
                onUpload(uploadField, newFiles);
                onOpenChange(false);
              }
            }} />
          </label>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// 商情信息绑定弹窗
interface BusinessInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessInfoList: { id: number; code: string; name: string; projectCode: string; customerName: string; type: string; amount: string; publishTime: string; deadline: string }[];
  selectedIds: Set<number>;
  onSelectionChange: (ids: Set<number>) => void;
  onBind: () => void;
}

function BusinessInfoModal({ open, onOpenChange, businessInfoList, selectedIds, onSelectionChange, onBind }: BusinessInfoModalProps) {
  const [searchName, setSearchName] = useState('');
  const [searchCode, setSearchCode] = useState('');

  const handleToggle = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    onSelectionChange(newSelected);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-6xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>绑定商情</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 whitespace-nowrap">商情名称：</label>
              <input type="text" placeholder="请输入" value={searchName} onChange={(e) => setSearchName(e.target.value)} className="px-2 py-1 border border-gray-200 rounded text-xs w-48" />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 whitespace-nowrap">项目编号：</label>
              <input type="text" placeholder="请输入" value={searchCode} onChange={(e) => setSearchCode(e.target.value)} className="px-2 py-1 border border-gray-200 rounded text-xs w-48" />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 whitespace-nowrap">商情编号：</label>
              <input type="text" placeholder="请输入" className="px-2 py-1 border border-gray-200 rounded text-xs w-48" />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 whitespace-nowrap">客户名称：</label>
              <input type="text" placeholder="请输入" value="杭州某某科技有限公司" className="px-2 py-1 border border-gray-200 rounded text-xs w-48" />
            </div>
            <Button variant="outline" size="sm" className="text-xs h-7">查询</Button>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-2 text-left font-medium text-gray-600 w-10">选择</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">序号</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">商情编号</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">项目名称</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">项目编码</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">客户名称</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">类型</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">项目金额</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">发布时间</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">招标截止时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {businessInfoList.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2"><input type="checkbox" checked={selectedIds.has(item.id)} onChange={() => handleToggle(item.id)} className="w-4 h-4" /></td>
                  <td className="px-3 py-2 text-gray-900">{item.id}</td>
                  <td className="px-3 py-2 text-gray-900">{item.code}</td>
                  <td className="px-3 py-2 text-gray-900">{item.name}</td>
                  <td className="px-3 py-2 text-gray-900">{item.projectCode}</td>
                  <td className="px-3 py-2 text-gray-900">{item.customerName}</td>
                  <td className="px-3 py-2 text-gray-900">{item.type}</td>
                  <td className="px-3 py-2 text-gray-900">{item.amount}</td>
                  <td className="px-3 py-2 text-gray-900">{item.publishTime}</td>
                  <td className="px-3 py-2 text-gray-900">{item.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={() => { onBind(); onOpenChange(false); }}>绑定</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}