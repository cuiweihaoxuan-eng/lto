import React, { useState } from "react";
import { Search, RefreshCw, Plus, Eye, Trash2, Edit, Link2, CheckCircle, X, Upload, Download, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { TabNav } from "./ui/tab-nav";
import { AssetDetailModal } from "./AssetDetailModal";
import { AssetRecoveryPlanModal } from "./AssetRecoveryPlanModal";
import { ScrapApplicationModal } from "./ScrapApplicationModal";
import { ContractSelectModal } from "./ContractSelectModal";
import { AssetRecoveryPlanListModal } from "./AssetRecoveryPlanListModal";
import { ScrapAssetListModal } from "./ScrapAssetListModal";
import { ScrapApprovalDetailModal } from "./ScrapApprovalDetailModal";
import { ApprovalSelectModal } from "./ApprovalSelectModal";
import { AssetSelectModal } from "./AssetSelectModal";

// ============ 类型定义 ============
type FreezeStatus = "否" | "是";
type AssetNature = "生产用" | "利旧回收" | "报废";
type PlanStatus = "待回收" | "回收中" | "已完成";
type ScrapStatus = "待审批" | "审批中" | "已通过" | "已驳回";

interface FixedAsset {
  id: string;
  cityCode: string;
  cityName: string;
  assetName: string;
  assetCardNo: string;
  assetNature: AssetNature;
  equipmentAmount: string;
  freezeStatus: FreezeStatus;
  projectCode: string;
  department: string;
  ictProjectCode: string;
  ictProjectName: string;
  contractName: string;
  contractCode: string;
  contractStartDate: string;
  contractEndDate: string;
  customerName: string;
  customerCode: string;
  customerManager: string;
  customerManagerPhone: string;
  projectManager: string;
  projectManagerPhone: string;
  contactPhone: string;
  employeeId: string;
  responsiblePerson: string;
  responsiblePersonPhone: string;
  responsiblePersonEmpId: string;
  assetUsageAddress: string;
  sapAssetClass: string;
  specModel: string;
  capitalizationDate: string;
  overdueDate: string;
  purchaseAmount: string;
  depreciationAmount: string;
  assetCustodian: string;
  investmentProjectCode: string;
  sapOrderNo: string;
  purchaseOrderNo: string;
  supplierName: string;
  supplierCode: string;
  useDepartment: string;
  departmentNo: string;
  companyCode: string;
  companyName: string;
  profitCenterGroup: string;
  profitCenterGroupName: string;
  profitCenterId: string;
  profitCenter: string;
  costCenterNo: string;
  costCenter: string;
  "实物Class": string;
  "实物Table": string;
  createTime: string;
  updateTime: string;
}

interface AssetRecoveryPlan {
  id: string;
  planCode: string;
  status: PlanStatus;
  assetCount: number;
  initiator: string;
  initiateTime: string;
  expectedRecoveryDate: string;
  scenePhoto: string;
  storageLocation: string;
  warehouseKeeper: string;
  totalAmount: string;
  totalDepreciation: string;
  eipRecord: string;
  assets: FixedAsset[];
}

interface ScrapApproval {
  id: string;
  approvalCode: string;
  status: ScrapStatus;
  assetCount: number;
  initiator: string;
  initiateTime: string;
  scrapDate: string;
  scrapReason: string;
  attachment: string;
  totalAmount: string;
  totalDepreciation: string;
  approvalProcess: string;
  approver: string;
  assets: FixedAsset[];
}

// ============ 模拟数据 ============
const mockAssets: FixedAsset[] = [
  {
    id: "1",
    cityCode: "0200",
    cityName: "省本部",
    assetName: "监控设备",
    assetCardNo: "000000000001",
    assetNature: "生产用",
    equipmentAmount: "15,000.00",
    freezeStatus: "否",
    projectCode: "XM202401001",
    department: "办公室(安全保卫部)",
    ictProjectCode: "ICT202401001",
    ictProjectName: "某医院信息化建设项目",
    contractName: "医院ICT服务合同",
    contractCode: "HT202401001",
    contractStartDate: "2024-01-01",
    contractEndDate: "2026-12-31",
    customerName: "杭州某医院",
    customerCode: "KH202401001",
    customerManager: "张明-13800138001(GZ2024001)",
    customerManagerPhone: "13800138001",
    projectManager: "李华-13900139001(GZ2024002)",
    projectManagerPhone: "13900139001",
    contactPhone: "0571-88888888",
    employeeId: "EMP2024001",
    responsiblePerson: "赵六",
    responsiblePersonPhone: "13700137001",
    responsiblePersonEmpId: "EMP2024002",
    assetUsageAddress: "杭州市西湖区某医院机房",
    sapAssetClass: "固定资产-有线传输设",
    specModel: "nvr7",
    capitalizationDate: "20141231",
    overdueDate: "20241231",
    purchaseAmount: "15,000.00",
    depreciationAmount: "12,000.00",
    assetCustodian: "王五",
    investmentProjectCode: "TZ202401001",
    sapOrderNo: "SO202401001",
    purchaseOrderNo: "PO202401001",
    supplierName: "杭州科技有限公司",
    supplierCode: "SUP2024001",
    useDepartment: "股份.省本部.办公室(安全保卫部)",
    departmentNo: "A330000001",
    companyCode: "A011",
    companyName: "中国电信股份有限公司",
    profitCenterGroup: "A3300",
    profitCenterGroupName: "中国电信股份有限公司浙江分",
    profitCenterId: "A330000",
    profitCenter: "股份省本部",
    costCenterNo: "A330000004",
    costCenter: "办公室(安全保卫部)",
    "实物Class": "NY",
    "实物Table": "NY",
    createTime: "2016-05-05 11:42:54",
    updateTime: "2026-05-16 22:40:1"
  },
  {
    id: "2",
    cityCode: "0201",
    cityName: "杭州",
    assetName: "服务器",
    assetCardNo: "000000000002",
    assetNature: "利旧回收",
    equipmentAmount: "50,000.00",
    freezeStatus: "是",
    projectCode: "XM202402001",
    department: "技术部",
    ictProjectCode: "ICT202402001",
    ictProjectName: "企业云服务项目",
    contractName: "云服务采购合同",
    contractCode: "HT202402001",
    contractStartDate: "2024-02-01",
    contractEndDate: "2025-01-31",
    customerName: "宁波某企业",
    customerCode: "KH202402001",
    customerManager: "钱七-13800138002(GZ2024003)",
    customerManagerPhone: "13800138002",
    projectManager: "孙八-13900139002(GZ2024004)",
    projectManagerPhone: "13900139002",
    contactPhone: "0574-88888888",
    employeeId: "EMP2024003",
    responsiblePerson: "周十",
    responsiblePersonPhone: "13700137002",
    responsiblePersonEmpId: "EMP2024004",
    assetUsageAddress: "宁波市鄞州区某企业机房",
    sapAssetClass: "固定资产-计算机设备",
    specModel: "Dell PowerEdge R740",
    capitalizationDate: "20200115",
    overdueDate: "20251231",
    purchaseAmount: "50,000.00",
    depreciationAmount: "30,000.00",
    assetCustodian: "李九",
    investmentProjectCode: "TZ202402001",
    sapOrderNo: "SO202402001",
    purchaseOrderNo: "PO202402001",
    supplierName: "深圳科技有限公司",
    supplierCode: "SUP2024002",
    useDepartment: "股份.杭州.技术部",
    departmentNo: "A330000002",
    companyCode: "A011",
    companyName: "中国电信股份有限公司浙江分公司",
    profitCenterGroup: "A3301",
    profitCenterGroupName: "中国电信股份有限公司浙江分杭州",
    profitCenterId: "A330001",
    profitCenter: "杭州",
    costCenterNo: "A330000005",
    costCenter: "技术部",
    "实物Class": "NY",
    "实物Table": "NY",
    createTime: "2020-01-15 10:00:00",
    updateTime: "2026-05-15 18:00:00"
  },
  {
    id: "3",
    cityCode: "0202",
    cityName: "宁波",
    assetName: "网络设备",
    assetCardNo: "000000000003",
    assetNature: "生产用",
    equipmentAmount: "30,000.00",
    freezeStatus: "否",
    projectCode: "XM202403001",
    department: "网络部",
    ictProjectCode: "ICT202403001",
    ictProjectName: "智慧城市建设项目",
    contractName: "智慧城市建设合同",
    contractCode: "HT202403001",
    contractStartDate: "2024-03-01",
    contractEndDate: "2027-02-28",
    customerName: "宁波市政府",
    customerCode: "KH202403001",
    customerManager: "吴一-13800138003(GZ2024005)",
    customerManagerPhone: "13800138003",
    projectManager: "郑二-13900139003(GZ2024006)",
    projectManagerPhone: "13900139003",
    contactPhone: "0574-88888889",
    employeeId: "EMP2024005",
    responsiblePerson: "陈十二",
    responsiblePersonPhone: "13700137003",
    responsiblePersonEmpId: "EMP2024006",
    assetUsageAddress: "宁波市政府大楼",
    sapAssetClass: "固定资产-通信设备",
    specModel: "Huawei S5720",
    capitalizationDate: "20210301",
    overdueDate: "20260301",
    purchaseAmount: "30,000.00",
    depreciationAmount: "18,000.00",
    assetCustodian: "冯十一",
    investmentProjectCode: "TZ202403001",
    sapOrderNo: "SO202403001",
    purchaseOrderNo: "PO202403001",
    supplierName: "华为技术有限公司",
    supplierCode: "SUP2024003",
    useDepartment: "股份.宁波.网络部",
    departmentNo: "A330000003",
    companyCode: "A011",
    companyName: "中国电信股份有限公司浙江分公司",
    profitCenterGroup: "A3302",
    profitCenterGroupName: "中国电信股份有限公司浙江分宁波",
    profitCenterId: "A330002",
    profitCenter: "宁波",
    costCenterNo: "A330000006",
    costCenter: "网络部",
    "实物Class": "NY",
    "实物Table": "NY",
    createTime: "2021-03-01 09:00:00",
    updateTime: "2026-05-14 16:00:00"
  },
  {
    id: "4",
    cityCode: "0203",
    cityName: "温州",
    assetName: "存储设备",
    assetCardNo: "000000000004",
    assetNature: "报废",
    equipmentAmount: "80,000.00",
    freezeStatus: "否",
    projectCode: "XM202404001",
    department: "数据中心",
    ictProjectCode: "ICT202404001",
    ictProjectName: "学校信息化项目",
    contractName: "智慧校园建设合同",
    contractCode: "HT202404001",
    contractStartDate: "2024-04-01",
    contractEndDate: "2026-03-31",
    customerName: "温州某学校",
    customerCode: "KH202404001",
    customerManager: "刘十三-13800138004(GZ2024007)",
    customerManagerPhone: "13800138004",
    projectManager: "宋十四-13900139004(GZ2024008)",
    projectManagerPhone: "13900139004",
    contactPhone: "0577-88888888",
    employeeId: "EMP2024007",
    responsiblePerson: "许十六",
    responsiblePersonPhone: "13700137004",
    responsiblePersonEmpId: "EMP2024008",
    assetUsageAddress: "温州市鹿城区某学校",
    sapAssetClass: "固定资产-存储设备",
    specModel: "Lenovo DS4000",
    capitalizationDate: "20190401",
    overdueDate: "20240401",
    purchaseAmount: "80,000.00",
    depreciationAmount: "72,000.00",
    assetCustodian: "韩十五",
    investmentProjectCode: "TZ202404001",
    sapOrderNo: "SO202404001",
    purchaseOrderNo: "PO202404001",
    supplierName: "联想科技有限公司",
    supplierCode: "SUP2024004",
    useDepartment: "股份.温州.数据中心",
    departmentNo: "A330000004",
    companyCode: "A011",
    companyName: "中国电信股份有限公司浙江分公司",
    profitCenterGroup: "A3303",
    profitCenterGroupName: "中国电信股份有限公司浙江分温州",
    profitCenterId: "A330003",
    profitCenter: "温州",
    costCenterNo: "A330000007",
    costCenter: "数据中心",
    "实物Class": "NY",
    "实物Table": "NY",
    createTime: "2019-04-01 08:00:00",
    updateTime: "2026-05-13 14:00:00"
  },
  {
    id: "5",
    cityCode: "0204",
    cityName: "嘉兴",
    assetName: "交换机",
    assetCardNo: "000000000005",
    assetNature: "生产用",
    equipmentAmount: "25,000.00",
    freezeStatus: "是",
    projectCode: "XM202405001",
    department: "网络部",
    ictProjectCode: "ICT202405001",
    ictProjectName: "工厂数字化转型项目",
    contractName: "数字化转型服务合同",
    contractCode: "HT202405001",
    contractStartDate: "2024-05-01",
    contractEndDate: "2026-04-30",
    customerName: "嘉兴某工厂",
    customerCode: "KH202405001",
    customerManager: "何十七-13800138005(GZ2024009)",
    customerManagerPhone: "13800138005",
    projectManager: "孙十八-13900139005(GZ2024010)",
    projectManagerPhone: "13900139005",
    contactPhone: "0573-88888888",
    employeeId: "EMP2024009",
    responsiblePerson: "王二十",
    responsiblePersonPhone: "13700137005",
    responsiblePersonEmpId: "EMP2024010",
    assetUsageAddress: "嘉兴市南湖区某工厂",
    sapAssetClass: "固定资产-通信设备",
    specModel: "Cisco Catalyst 2960",
    capitalizationDate: "20210501",
    overdueDate: "20260501",
    purchaseAmount: "25,000.00",
    depreciationAmount: "15,000.00",
    assetCustodian: "郑十九",
    investmentProjectCode: "TZ202405001",
    sapOrderNo: "SO202405001",
    purchaseOrderNo: "PO202405001",
    supplierName: "思科科技有限公司",
    supplierCode: "SUP2024005",
    useDepartment: "股份.嘉兴.网络部",
    departmentNo: "A330000005",
    companyCode: "A011",
    companyName: "中国电信股份有限公司浙江分公司",
    profitCenterGroup: "A3304",
    profitCenterGroupName: "中国电信股份有限公司浙江分嘉兴",
    profitCenterId: "A330004",
    profitCenter: "嘉兴",
    costCenterNo: "A330000008",
    costCenter: "网络部",
    "实物Class": "NY",
    "实物Table": "NY",
    createTime: "2021-05-01 10:00:00",
    updateTime: "2026-05-12 12:00:00"
  }
];

const mockRecoveryPlans: AssetRecoveryPlan[] = [
  {
    id: "1",
    planCode: "HSD202405001",
    status: "待回收",
    assetCount: 3,
    initiator: "张明",
    initiateTime: "2026-05-15 10:00:00",
    expectedRecoveryDate: "2026-05-25",
    scenePhoto: "photo1.jpg",
    storageLocation: "省本部仓库A区",
    warehouseKeeper: "王五",
    totalAmount: "45,000.00",
    totalDepreciation: "30,000.00",
    eipRecord: "EIP202405001",
    assets: [mockAssets[0], mockAssets[1], mockAssets[2]]
  },
  {
    id: "2",
    planCode: "HSD202405002",
    status: "回收中",
    assetCount: 2,
    initiator: "李华",
    initiateTime: "2026-05-10 09:00:00",
    expectedRecoveryDate: "2026-05-20",
    scenePhoto: "photo2.jpg",
    storageLocation: "杭州仓库B区",
    warehouseKeeper: "李九",
    totalAmount: "35,000.00",
    totalDepreciation: "25,000.00",
    eipRecord: "EIP202405002",
    assets: [mockAssets[1], mockAssets[2]]
  },
  {
    id: "3",
    planCode: "HSD202405003",
    status: "已完成",
    assetCount: 1,
    initiator: "钱七",
    initiateTime: "2026-05-05 08:00:00",
    expectedRecoveryDate: "2026-05-15",
    scenePhoto: "photo3.jpg",
    storageLocation: "宁波仓库C区",
    warehouseKeeper: "孙八",
    totalAmount: "20,000.00",
    totalDepreciation: "15,000.00",
    eipRecord: "EIP202405003",
    assets: [mockAssets[2]]
  }
];

const mockScrapApprovals: ScrapApproval[] = [
  {
    id: "1",
    approvalCode: "BF202405001",
    status: "待审批",
    assetCount: 2,
    initiator: "张明",
    initiateTime: "2026-05-16 10:00:00",
    scrapDate: "2026-05-16",
    scrapReason: "设备老旧，无法正常使用",
    attachment: "reason.pdf",
    totalAmount: "80,000.00",
    totalDepreciation: "72,000.00",
    approvalProcess: "查看",
    approver: "",
    assets: [mockAssets[3], mockAssets[4]]
  },
  {
    id: "2",
    approvalCode: "BF202405002",
    status: "审批中",
    assetCount: 1,
    initiator: "李华",
    initiateTime: "2026-05-14 09:00:00",
    scrapDate: "2026-05-14",
    scrapReason: "技术升级换代，旧设备淘汰",
    attachment: "reason2.pdf",
    totalAmount: "30,000.00",
    totalDepreciation: "25,000.00",
    approvalProcess: "查看",
    approver: "王五",
    assets: [mockAssets[2]]
  },
  {
    id: "3",
    approvalCode: "BF202405003",
    status: "已通过",
    assetCount: 3,
    initiator: "钱七",
    initiateTime: "2026-05-10 08:00:00",
    scrapDate: "2026-05-10",
    scrapReason: "故障损坏，维修成本过高",
    attachment: "reason3.pdf",
    totalAmount: "50,000.00",
    totalDepreciation: "45,000.00",
    approvalProcess: "查看",
    approver: "赵六",
    assets: [mockAssets[0], mockAssets[1], mockAssets[2]]
  },
  {
    id: "4",
    approvalCode: "BF202405004",
    status: "已驳回",
    assetCount: 1,
    initiator: "孙八",
    initiateTime: "2026-05-08 11:00:00",
    scrapDate: "2026-05-08",
    scrapReason: "设备闲置，无使用需求",
    attachment: "reason4.pdf",
    totalAmount: "15,000.00",
    totalDepreciation: "10,000.00",
    approvalProcess: "查看",
    approver: "李九",
    assets: [mockAssets[4]]
  }
];

// ============ 主组件 ============
export function FixedAssets() {
  // Tab状态
  const [activeTab, setActiveTab] = useState<"asset-list" | "recovery-plan" | "scrap-approval">("asset-list");

  // ========== 资产清单状态 ==========
  const [searchCity, setSearchCity] = useState("");
  const [searchAssetName, setSearchAssetName] = useState("");
  const [searchAssetCardNo, setSearchAssetCardNo] = useState("");
  const [searchAssetNature, setSearchAssetNature] = useState<string>("全部");
  const [searchEquipmentAmountStart, setSearchEquipmentAmountStart] = useState("");
  const [searchEquipmentAmountEnd, setSearchEquipmentAmountEnd] = useState("");
  const [searchFreezeStatus, setSearchFreezeStatus] = useState<string>("全部");
  const [searchProjectCode, setSearchProjectCode] = useState("");
  const [searchIctProjectCode, setSearchIctProjectCode] = useState("");
  const [searchIctProjectName, setSearchIctProjectName] = useState("");
  const [searchContractName, setSearchContractName] = useState("");
  const [searchContractCode, setSearchContractCode] = useState("");
  const [searchContractDateStart, setSearchContractDateStart] = useState("");
  const [searchContractDateEnd, setSearchContractDateEnd] = useState("");
  const [searchResponsiblePerson, setSearchResponsiblePerson] = useState("");

  // 查询条件展开状态
  const [showMoreConditions, setShowMoreConditions] = useState(false);

  // 资产清单选中行
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());

  // 弹窗状态
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<FixedAsset | null>(null);
  const [recoveryPlanModalOpen, setRecoveryPlanModalOpen] = useState(false);
  const [scrapModalOpen, setScrapModalOpen] = useState(false);
  const [contractSelectModalOpen, setContractSelectModalOpen] = useState(false);
  const [currentAssetForLink, setCurrentAssetForLink] = useState<FixedAsset | null>(null);
  const [recoveryPlanListModalOpen, setRecoveryPlanListModalOpen] = useState(false);
  const [scrapAssetListModalOpen, setScrapAssetListModalOpen] = useState(false);
  const [scrapApprovalDetailModalOpen, setScrapApprovalDetailModalOpen] = useState(false);
  const [approvalSelectModalOpen, setApprovalSelectModalOpen] = useState(false);
  // 新增回收计划/报废的选择弹窗
  const [assetSelectModalOpen, setAssetSelectModalOpen] = useState(false);
  const [assetSelectModalType, setAssetSelectModalType] = useState<"recovery" | "scrap">("recovery");

  // 新增回收计划/报废的选项
  const [addType, setAddType] = useState<"selected" | "same-ict">("selected");
  const [addModalType, setAddModalType] = useState<"recovery" | "scrap">("recovery");

  // ========== 资产回收计划状态 ==========
  const [searchPlanCity, setSearchPlanCity] = useState("");
  const [searchPlanStatus, setSearchPlanStatus] = useState<string>("全部");
  const [searchPlanInitiator, setSearchPlanInitiator] = useState("");
  const [searchPlanTimeStart, setSearchPlanTimeStart] = useState("");
  const [searchPlanTimeEnd, setSearchPlanTimeEnd] = useState("");

  // ========== 报废审批单状态 ==========
  const [searchScrapCity, setSearchScrapCity] = useState("");
  const [searchScrapStatus, setSearchScrapStatus] = useState<string>("全部");
  const [searchScrapInitiator, setSearchScrapInitiator] = useState("");
  const [searchScrapTimeStart, setSearchScrapTimeStart] = useState("");
  const [searchScrapTimeEnd, setSearchScrapTimeEnd] = useState("");

  // ========== 分页状态 ==========
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 选中/取消选中
  const toggleAssetSelection = (id: string) => {
    setSelectedAssets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const toggleSelectAll = (assets: FixedAsset[]) => {
    if (selectedAssets.size === assets.length) {
      setSelectedAssets(new Set());
    } else {
      setSelectedAssets(new Set(assets.map(a => a.id)));
    }
  };

  // 获取状态徽章样式
  const getFreezeBadge = (status: FreezeStatus) => {
    return status === "是" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700";
  };

  const getNatureBadge = (nature: AssetNature) => {
    const styles: Record<AssetNature, string> = {
      "生产用": "bg-blue-100 text-blue-700",
      "利旧回收": "bg-yellow-100 text-yellow-700",
      "报废": "bg-red-100 text-red-700"
    };
    return styles[nature];
  };

  const getPlanStatusBadge = (status: PlanStatus) => {
    const styles: Record<PlanStatus, string> = {
      "待回收": "bg-yellow-100 text-yellow-700",
      "回收中": "bg-blue-100 text-blue-700",
      "已完成": "bg-green-100 text-green-700"
    };
    return styles[status];
  };

  const getScrapStatusBadge = (status: ScrapStatus) => {
    const styles: Record<ScrapStatus, string> = {
      "待审批": "bg-yellow-100 text-yellow-700",
      "审批中": "bg-blue-100 text-blue-700",
      "已通过": "bg-green-100 text-green-700",
      "已驳回": "bg-red-100 text-red-700"
    };
    return styles[status];
  };

  // 筛选资产数据
  const filteredAssets = mockAssets.filter(asset => {
    if (searchCity && !asset.cityName.includes(searchCity)) return false;
    if (searchAssetName && !asset.assetName.includes(searchAssetName)) return false;
    if (searchAssetCardNo && !asset.assetCardNo.includes(searchAssetCardNo)) return false;
    if (searchAssetNature !== "全部" && asset.assetNature !== searchAssetNature) return false;
    if (searchFreezeStatus !== "全部" && asset.freezeStatus !== searchFreezeStatus) return false;
    if (searchProjectCode && !asset.projectCode.includes(searchProjectCode)) return false;
    if (searchIctProjectCode && !asset.ictProjectCode.includes(searchIctProjectCode)) return false;
    if (searchIctProjectName && !asset.ictProjectName.includes(searchIctProjectName)) return false;
    if (searchContractName && !asset.contractName.includes(searchContractName)) return false;
    if (searchContractCode && !asset.contractCode.includes(searchContractCode)) return false;
    if (searchResponsiblePerson && !asset.responsiblePerson.includes(searchResponsiblePerson)) return false;
    if (searchEquipmentAmountStart && parseFloat(asset.equipmentAmount.replace(/,/g, '')) < parseFloat(searchEquipmentAmountStart)) return false;
    if (searchEquipmentAmountEnd && parseFloat(asset.equipmentAmount.replace(/,/g, '')) > parseFloat(searchEquipmentAmountEnd)) return false;
    if (searchContractDateStart && asset.contractEndDate < searchContractDateStart) return false;
    if (searchContractDateEnd && asset.contractEndDate > searchContractDateEnd) return false;
    return true;
  });

  // 筛选回收计划数据
  const filteredPlans = mockRecoveryPlans.filter(plan => {
    if (searchPlanCity && !plan.storageLocation.includes(searchPlanCity)) return false;
    if (searchPlanStatus !== "全部" && plan.status !== searchPlanStatus) return false;
    if (searchPlanInitiator && !plan.initiator.includes(searchPlanInitiator)) return false;
    if (searchPlanTimeStart && plan.initiateTime < searchPlanTimeStart) return false;
    if (searchPlanTimeEnd && plan.initiateTime > searchPlanTimeEnd) return false;
    return true;
  });

  // 筛选报废审批数据
  const filteredScrapApprovals = mockScrapApprovals.filter(scrap => {
    if (searchScrapCity && !scrap.initiateTime.includes(searchScrapCity)) return false;
    if (searchScrapStatus !== "全部" && scrap.status !== searchScrapStatus) return false;
    if (searchScrapInitiator && !scrap.initiator.includes(searchScrapInitiator)) return false;
    if (searchScrapTimeStart && scrap.initiateTime < searchScrapTimeStart) return false;
    if (searchScrapTimeEnd && scrap.initiateTime > searchScrapTimeEnd) return false;
    return true;
  });

  // 获取同ICT项目的所有资产
  const getAssetsByIctProject = (asset: FixedAsset): FixedAsset[] => {
    return mockAssets.filter(a => a.ictProjectCode === asset.ictProjectCode);
  };

  // 打开资产详情
  const openAssetDetail = (asset: FixedAsset) => {
    setSelectedAsset(asset);
    setDetailModalOpen(true);
  };

  // 打开新增资产回收计划弹窗（先选择）
  const openRecoveryPlanModal = () => {
    if (selectedAssets.size === 0) {
      alert("请先选择资产");
      return;
    }
    setAssetSelectModalType("recovery");
    setAssetSelectModalOpen(true);
  };

  // 打开新增报废申请弹窗（先选择）
  const openScrapModal = () => {
    if (selectedAssets.size === 0) {
      alert("请先选择资产");
      return;
    }
    setAssetSelectModalType("scrap");
    setAssetSelectModalOpen(true);
  };

  // 打开利旧关联新项目弹窗
  const openLinkProjectModal = () => {
    if (selectedAssets.size === 0) {
      alert("请先选择资产");
      return;
    }
    // 取第一个选中的资产
    const firstSelectedId = Array.from(selectedAssets)[0];
    const asset = mockAssets.find(a => a.id === firstSelectedId);
    if (asset) {
      setCurrentAssetForLink(asset);
      setContractSelectModalOpen(true);
    }
  };

  // 处理资产选择弹窗确认
  const handleAssetSelectConfirm = (type: "selected" | "same-ict") => {
    setAssetSelectModalOpen(false);
    if (type === "same-ict") {
      // 获取同ICT项目的所有资产
      const firstSelectedId = Array.from(selectedAssets)[0];
      const firstAsset = mockAssets.find(a => a.id === firstSelectedId);
      if (firstAsset) {
        const sameIctAssets = mockAssets.filter(a => a.ictProjectCode === firstAsset.ictProjectCode);
        setSelectedAssets(new Set(sameIctAssets.map(a => a.id)));
      }
    }
    // 打开对应的弹窗
    if (assetSelectModalType === "recovery") {
      setAddType(type);
      setAddModalType("recovery");
      setRecoveryPlanModalOpen(true);
    } else {
      setAddType(type);
      setAddModalType("scrap");
      setScrapModalOpen(true);
    }
  };

  // 处理合同选择回调
  const handleContractSelect = (contract: { contractCode: string; contractName: string; ictProjectCode: string; ictProjectName: string }) => {
    if (currentAssetForLink) {
      const updatedAsset = {
        ...currentAssetForLink,
        ictProjectCode: contract.ictProjectCode,
        ictProjectName: contract.ictProjectName,
        contractCode: contract.contractCode,
        contractName: contract.contractName
      };
      setSelectedAsset(updatedAsset);
      setDetailModalOpen(true);
    }
    setContractSelectModalOpen(false);
  };

  // 获取要添加的资产列表
  const getSelectedAssetsList = (): FixedAsset[] => {
    if (addType === "same-ict" && selectedAsset) {
      return getAssetsByIctProject(selectedAsset);
    }
    return mockAssets.filter(a => selectedAssets.has(a.id));
  };

  // 分页计算
  const totalAssets = filteredAssets.length;
  const totalPages = Math.ceil(totalAssets / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalAssets);
  const currentAssets = filteredAssets.slice(startIndex, endIndex);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 页面标题 */}
      <div className="px-6 pt-6 pb-0 flex-shrink-0">
        <h2 className="text-lg font-medium text-gray-900">固定资产管理</h2>
        <p className="text-sm text-gray-500 mt-1">固定资产清单、回收计划与报废审批管理</p>
      </div>

      {/* Tab页签 */}
      <div className="px-6 mt-4 flex-shrink-0">
        <TabNav
          style="pill"
          tabs={[
            { id: "asset-list", label: "资产清单", count: filteredAssets.length },
            { id: "recovery-plan", label: "资产回收计划", count: filteredPlans.length },
            { id: "scrap-approval", label: "报废审批单", count: filteredScrapApprovals.length }
          ]}
          activeTab={activeTab}
          onTabChange={(id) => setActiveTab(id as "asset-list" | "recovery-plan" | "scrap-approval")}
        />
      </div>

      {/* ========== 资产清单 Tab ========== */}
      {activeTab === "asset-list" && (
        <>
          {/* 查询条件 */}
          <div className="px-6 mt-4 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              {/* 第一行查询条件 */}
              <div className="grid grid-cols-4 gap-x-6 gap-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">地市</label>
                  <Input placeholder="请输入" value={searchCity} onChange={e => setSearchCity(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">资产名称</label>
                  <Input placeholder="请输入" value={searchAssetName} onChange={e => setSearchAssetName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">卡片号</label>
                  <Input placeholder="请输入" value={searchAssetCardNo} onChange={e => setSearchAssetCardNo(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">资产性质</label>
                  <Select value={searchAssetNature} onValueChange={setSearchAssetNature}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="全部">全部</SelectItem>
                      <SelectItem value="生产用">生产用</SelectItem>
                      <SelectItem value="利旧回收">利旧回收</SelectItem>
                      <SelectItem value="报废">报废</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 第二行查询条件（默认展开） */}
              <div className="grid grid-cols-4 gap-x-6 gap-y-3 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">设备金额</label>
                  <div className="flex items-center gap-2">
                    <Input type="number" placeholder="起" value={searchEquipmentAmountStart} onChange={e => setSearchEquipmentAmountStart(e.target.value)} />
                    <span className="text-gray-400">-</span>
                    <Input type="number" placeholder="止" value={searchEquipmentAmountEnd} onChange={e => setSearchEquipmentAmountEnd(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">冻结状态</label>
                  <Select value={searchFreezeStatus} onValueChange={setSearchFreezeStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="全部">全部</SelectItem>
                      <SelectItem value="是">是</SelectItem>
                      <SelectItem value="否">否</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">工程编码</label>
                  <Input placeholder="请输入" value={searchProjectCode} onChange={e => setSearchProjectCode(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ICT项目编码</label>
                  <Input placeholder="请输入" value={searchIctProjectCode} onChange={e => setSearchIctProjectCode(e.target.value)} />
                </div>
              </div>

              {/* 更多查询条件（点击展开） */}
              {showMoreConditions && (
                <div className="grid grid-cols-4 gap-x-6 gap-y-3 mt-4 pt-4 border-t border-gray-100">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ICT项目名称</label>
                    <Input placeholder="请输入" value={searchIctProjectName} onChange={e => setSearchIctProjectName(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">合同名称</label>
                    <Input placeholder="请输入" value={searchContractName} onChange={e => setSearchContractName(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">合同编码</label>
                    <Input placeholder="请输入" value={searchContractCode} onChange={e => setSearchContractCode(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">合同到期时间</label>
                    <div className="flex items-center gap-2">
                      <Input type="date" placeholder="起" value={searchContractDateStart} onChange={e => setSearchContractDateStart(e.target.value)} />
                      <span className="text-gray-400">-</span>
                      <Input type="date" placeholder="止" value={searchContractDateEnd} onChange={e => setSearchContractDateEnd(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">责任人</label>
                    <Input placeholder="请输入" value={searchResponsiblePerson} onChange={e => setSearchResponsiblePerson(e.target.value)} />
                  </div>
                </div>
              )}

              {/* 查询按钮 */}
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                <Button variant="outline" className="gap-1" onClick={() => setShowMoreConditions(!showMoreConditions)}>
                  {showMoreConditions ? "收起更多条件" : "展开更多条件"}
                </Button>
                <Button variant="outline" className="gap-1">
                  <RefreshCw className="w-4 h-4" />
                  重置
                </Button>
                <Button className="gap-1">
                  <Search className="w-4 h-4" />
                  查询
                </Button>
              </div>
            </div>
          </div>

          {/* 操作栏 */}
          <div className="px-6 py-3 flex-shrink-0 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              已选择 <span className="font-medium text-blue-600">{selectedAssets.size}</span> 项，共 <span className="font-medium text-gray-900">{filteredAssets.length}</span> 条记录
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-1">
                <Download className="w-4 h-4" />
                导出
              </Button>
              <Button className="gap-1" onClick={() => openRecoveryPlanModal()} disabled={selectedAssets.size === 0}>
                <Plus className="w-4 h-4" />
                新增资产回收计划
              </Button>
              <Button className="gap-1" onClick={() => openScrapModal()} disabled={selectedAssets.size === 0}>
                <Trash2 className="w-4 h-4" />
                报废
              </Button>
              <Button className="gap-1" onClick={() => openLinkProjectModal()} disabled={selectedAssets.size === 0}>
                <Link2 className="w-4 h-4" />
                利旧关联新项目
              </Button>
            </div>
          </div>

          {/* 表格 */}
          <div className="flex-1 overflow-hidden px-6 pb-6">
            <div className="h-full bg-white rounded-lg border border-gray-200 overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-10 bg-gray-50 sticky left-0 z-30">
                      <input type="checkbox" checked={selectedAssets.size === currentAssets.length && currentAssets.length > 0} onChange={() => toggleSelectAll(currentAssets)} />
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-24">地市</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600">资产名称</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-28">卡片号</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">资产性质</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-600 w-24">设备金额</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-600 w-16">冻结状态</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-28">工程编码</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-28">ICT项目编码</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600">ICT项目名称</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600">合同名称</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-28">合同编码</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-600 w-24">合同到期时间</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-24">客户名称</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">责任人</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-600 w-16 bg-gray-50 sticky right-0 z-20">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentAssets.map(asset => (
                    <tr key={asset.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 bg-white sticky left-0 z-10">
                        <input type="checkbox" checked={selectedAssets.has(asset.id)} onChange={() => toggleAssetSelection(asset.id)} />
                      </td>
                      <td className="px-3 py-3">{asset.cityName}</td>
                      <td className="px-3 py-3 max-w-32 truncate" title={asset.assetName}>{asset.assetName}</td>
                      <td className="px-3 py-3">{asset.assetCardNo}</td>
                      <td className="px-3 py-3">
                        <Badge className={getNatureBadge(asset.assetNature)}>{asset.assetNature}</Badge>
                      </td>
                      <td className="px-3 py-3 text-right">{asset.equipmentAmount}</td>
                      <td className="px-3 py-3 text-center">
                        <Badge className={getFreezeBadge(asset.freezeStatus)}>{asset.freezeStatus}</Badge>
                      </td>
                      <td className="px-3 py-3">{asset.projectCode}</td>
                      <td className="px-3 py-3">{asset.ictProjectCode}</td>
                      <td className="px-3 py-3 max-w-36 truncate" title={asset.ictProjectName}>{asset.ictProjectName}</td>
                      <td className="px-3 py-3 max-w-32 truncate" title={asset.contractName}>{asset.contractName}</td>
                      <td className="px-3 py-3">{asset.contractCode}</td>
                      <td className="px-3 py-3 text-center">{asset.contractEndDate}</td>
                      <td className="px-3 py-3 max-w-24 truncate" title={asset.customerName}>{asset.customerName}</td>
                      <td className="px-3 py-3">{asset.responsiblePerson}</td>
                      <td className="px-3 py-3 bg-gray-50 sticky right-0 z-10">
                        <div className="flex gap-2 justify-center">
                          <Button variant="link" size="sm" className="text-blue-600 h-auto p-0" onClick={() => openAssetDetail(asset)}>
                            <Eye className="w-3 h-3 mr-1" />
                            详情
                          </Button>
                          <Button variant="link" size="sm" className="text-blue-600 h-auto p-0" onClick={() => { setSelectedAssets(new Set([asset.id])); setAddType("selected"); setAddModalType("recovery"); setRecoveryPlanModalOpen(true); }}>
                            <Plus className="w-3 h-3 mr-1" />
                            回收
                          </Button>
                          <Button variant="link" size="sm" className="text-red-600 h-auto p-0" onClick={() => { setSelectedAssets(new Set([asset.id])); setAddType("selected"); setAddModalType("scrap"); setScrapModalOpen(true); }}>
                            <Trash2 className="w-3 h-3 mr-1" />
                            报废
                          </Button>
                          <Button variant="link" size="sm" className="text-green-600 h-auto p-0" onClick={() => openLinkProjectModal(asset)}>
                            <Link2 className="w-3 h-3 mr-1" />
                            关联
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentAssets.length === 0 && (
                    <tr>
                      <td colSpan={16} className="px-3 py-8 text-center text-gray-500">
                        暂无数据
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 分页 */}
          <div className="px-6 pb-6 flex-shrink-0 flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>每页显示</span>
              <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1); }}>
                <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span>条</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                第 {currentPage} / {totalPages} 页，共 {totalAssets} 条
              </span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>首页</Button>
                <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>上一页</Button>
                <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>下一页</Button>
                <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>末页</Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========== 资产回收计划 Tab ========== */}
      {activeTab === "recovery-plan" && (
        <>
          {/* 查询条件 */}
          <div className="px-6 mt-4 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="grid grid-cols-4 gap-x-6 gap-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">地市</label>
                  <Input placeholder="请输入" value={searchPlanCity} onChange={e => setSearchPlanCity(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                  <Select value={searchPlanStatus} onValueChange={setSearchPlanStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="全部">全部</SelectItem>
                      <SelectItem value="待回收">待回收</SelectItem>
                      <SelectItem value="回收中">回收中</SelectItem>
                      <SelectItem value="已完成">已完成</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">发起人</label>
                  <Input placeholder="请输入" value={searchPlanInitiator} onChange={e => setSearchPlanInitiator(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">发起时间起</label>
                  <Input type="date" value={searchPlanTimeStart} onChange={e => setSearchPlanTimeStart(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">发起时间止</label>
                  <Input type="date" value={searchPlanTimeEnd} onChange={e => setSearchPlanTimeEnd(e.target.value)} />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                <Button variant="outline" className="gap-1">
                  <RefreshCw className="w-4 h-4" />
                  重置
                </Button>
                <Button className="gap-1">
                  <Search className="w-4 h-4" />
                  查询
                </Button>
              </div>
            </div>
          </div>

          {/* 操作栏 */}
          <div className="px-6 py-3 flex-shrink-0 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              共 <span className="font-medium text-gray-900">{filteredPlans.length}</span> 条记录
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-1">
                <Download className="w-4 h-4" />
                导出
              </Button>
              <Button className="gap-1" onClick={() => { setRecoveryPlanModalOpen(true); }}>
                <Plus className="w-4 h-4" />
                新增资产回收计划
              </Button>
            </div>
          </div>

          {/* 表格 */}
          <div className="flex-1 overflow-hidden px-6 pb-6">
            <div className="h-full bg-white rounded-lg border border-gray-200 overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-12">序号</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600">回收计划编码</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-600 w-20">状态</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-600 w-16">资产清单</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">发起人</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-600 w-32">发起时间</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-600 w-24">预计回收日期</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-28">现场照片</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-28">存放地点</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">仓库保管员</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-24">EIP入库联系单</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-600 w-40 bg-gray-50 sticky right-0 z-20">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPlans.map((plan, idx) => (
                    <tr key={plan.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3">{idx + 1}</td>
                      <td className="px-3 py-3">{plan.planCode}</td>
                      <td className="px-3 py-3 text-center">
                        <Badge className={getPlanStatusBadge(plan.status)}>{plan.status}</Badge>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <Button variant="link" size="sm" className="text-blue-600 h-auto p-0" onClick={() => setRecoveryPlanListModalOpen(true)}>
                          {plan.assetCount}
                        </Button>
                      </td>
                      <td className="px-3 py-3">{plan.initiator}</td>
                      <td className="px-3 py-3 text-center">{plan.initiateTime}</td>
                      <td className="px-3 py-3 text-center">{plan.expectedRecoveryDate}</td>
                      <td className="px-3 py-3 max-w-28 truncate" title={plan.scenePhoto}>{plan.scenePhoto}</td>
                      <td className="px-3 py-3">{plan.storageLocation}</td>
                      <td className="px-3 py-3">{plan.warehouseKeeper}</td>
                      <td className="px-3 py-3 max-w-28 truncate" title={plan.eipRecord}>{plan.eipRecord}</td>
                      <td className="px-3 py-3 bg-gray-50 sticky right-0 z-10">
                        <div className="flex gap-2 justify-center">
                          <Button variant="link" size="sm" className="text-blue-600 h-auto p-0" onClick={() => { setSelectedAssets(new Set(plan.assets.map(a => a.id))); setRecoveryPlanModalOpen(true); }}>
                            <Edit className="w-3 h-3 mr-1" />
                            修改
                          </Button>
                          <Button variant="link" size="sm" className="text-red-600 h-auto p-0" onClick={() => { if(confirm('确定删除该回收计划？')) { alert('删除成功'); } }}>
                            <Trash2 className="w-3 h-3 mr-1" />
                            删除
                          </Button>
                          <Button variant="link" size="sm" className="text-green-600 h-auto p-0" onClick={() => alert('同步EIP')}>
                            同步EIP
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredPlans.length === 0 && (
                    <tr>
                      <td colSpan={12} className="px-3 py-8 text-center text-gray-500">
                        暂无数据
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ========== 报废审批单 Tab ========== */}
      {activeTab === "scrap-approval" && (
        <>
          {/* 查询条件 */}
          <div className="px-6 mt-4 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="grid grid-cols-4 gap-x-6 gap-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">地市</label>
                  <Input placeholder="请输入" value={searchScrapCity} onChange={e => setSearchScrapCity(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                  <Select value={searchScrapStatus} onValueChange={setSearchScrapStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="全部">全部</SelectItem>
                      <SelectItem value="待审批">待审批</SelectItem>
                      <SelectItem value="审批中">审批中</SelectItem>
                      <SelectItem value="已通过">已通过</SelectItem>
                      <SelectItem value="已驳回">已驳回</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">发起人</label>
                  <Input placeholder="请输入" value={searchScrapInitiator} onChange={e => setSearchScrapInitiator(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">发起时间起</label>
                  <Input type="date" value={searchScrapTimeStart} onChange={e => setSearchScrapTimeStart(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">发起时间止</label>
                  <Input type="date" value={searchScrapTimeEnd} onChange={e => setSearchScrapTimeEnd(e.target.value)} />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                <Button variant="outline" className="gap-1">
                  <RefreshCw className="w-4 h-4" />
                  重置
                </Button>
                <Button className="gap-1">
                  <Search className="w-4 h-4" />
                  查询
                </Button>
              </div>
            </div>
          </div>

          {/* 操作栏 */}
          <div className="px-6 py-3 flex-shrink-0 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              共 <span className="font-medium text-gray-900">{filteredScrapApprovals.length}</span> 条记录
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-1">
                <Download className="w-4 h-4" />
                导出
              </Button>
              <Button className="gap-1" onClick={() => setScrapModalOpen(true)}>
                <Plus className="w-4 h-4" />
                新增报废设备
              </Button>
            </div>
          </div>

          {/* 表格 */}
          <div className="flex-1 overflow-hidden px-6 pb-6">
            <div className="h-full bg-white rounded-lg border border-gray-200 overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-12">序号</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600">报废审批单编码</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-600 w-20">状态</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-600 w-16">资产清单</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 w-20">发起人</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-600 w-32">发起时间</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-600 w-24">报废日期</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-600 w-20">审批流程</th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-600 w-40 bg-gray-50 sticky right-0 z-20">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredScrapApprovals.map((scrap, idx) => (
                    <tr key={scrap.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3">{idx + 1}</td>
                      <td className="px-3 py-3">{scrap.approvalCode}</td>
                      <td className="px-3 py-3 text-center">
                        <Badge className={getScrapStatusBadge(scrap.status)}>{scrap.status}</Badge>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <Button variant="link" size="sm" className="text-blue-600 h-auto p-0" onClick={() => setScrapAssetListModalOpen(true)}>
                          {scrap.assetCount}
                        </Button>
                      </td>
                      <td className="px-3 py-3">{scrap.initiator}</td>
                      <td className="px-3 py-3 text-center">{scrap.initiateTime}</td>
                      <td className="px-3 py-3 text-center">{scrap.scrapDate}</td>
                      <td className="px-3 py-3 text-center">
                        <Button variant="link" size="sm" className="text-blue-600 h-auto p-0" onClick={() => setScrapApprovalDetailModalOpen(true)}>
                          {scrap.approvalProcess}
                        </Button>
                      </td>
                      <td className="px-3 py-3 bg-gray-50 sticky right-0 z-10">
                        <div className="flex gap-2 justify-center">
                          <Button variant="link" size="sm" className="text-blue-600 h-auto p-0" onClick={() => { setSelectedAssets(new Set(scrap.assets.map(a => a.id))); setScrapModalOpen(true); }}>
                            <Edit className="w-3 h-3 mr-1" />
                            修改
                          </Button>
                          <Button variant="link" size="sm" className="text-red-600 h-auto p-0" onClick={() => { if(confirm('确定删除该报废审批单？')) { alert('删除成功'); } }}>
                            <Trash2 className="w-3 h-3 mr-1" />
                            删除
                          </Button>
                          {scrap.status === "待审批" && (
                            <Button variant="link" size="sm" className="text-green-600 h-auto p-0" onClick={() => setScrapApprovalDetailModalOpen(true)}>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              审批
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredScrapApprovals.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-3 py-8 text-center text-gray-500">
                        暂无数据
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* 资产详情弹窗 */}
      <AssetDetailModal
        open={detailModalOpen}
        onClose={() => { setDetailModalOpen(false); setSelectedAsset(null); }}
        asset={selectedAsset}
        onLinkProject={() => { setDetailModalOpen(false); if (selectedAsset) { setCurrentAssetForLink(selectedAsset); setContractSelectModalOpen(true); } }}
      />

      {/* 新增资产回收计划弹窗 */}
      <AssetRecoveryPlanModal
        open={recoveryPlanModalOpen}
        onClose={() => { setRecoveryPlanModalOpen(false); setSelectedAssets(new Set()); }}
        selectedAssets={getSelectedAssetsList()}
      />

      {/* 新增报废申请弹窗 */}
      <ScrapApplicationModal
        open={scrapModalOpen}
        onClose={() => { setScrapModalOpen(false); setSelectedAssets(new Set()); }}
        selectedAssets={getSelectedAssetsList()}
      />

      {/* 合同选择弹窗 */}
      <ContractSelectModal
        open={contractSelectModalOpen}
        onClose={() => setContractSelectModalOpen(false)}
        onSelect={handleContractSelect}
      />

      {/* 资产回收计划资产清单弹窗 */}
      <AssetRecoveryPlanListModal
        open={recoveryPlanListModalOpen}
        onClose={() => setRecoveryPlanListModalOpen(false)}
        assets={mockAssets}
      />

      {/* 报废资产清单弹窗 */}
      <ScrapAssetListModal
        open={scrapAssetListModalOpen}
        onClose={() => setScrapAssetListModalOpen(false)}
        assets={mockAssets}
      />

      {/* 报废审批流程弹窗 */}
      <ScrapApprovalDetailModal
        open={scrapApprovalDetailModalOpen}
        onClose={() => setScrapApprovalDetailModalOpen(false)}
      />

      {/* 资产选择弹窗 */}
      <AssetSelectModal
        open={assetSelectModalOpen}
        onClose={() => setAssetSelectModalOpen(false)}
        onSelectSelected={() => handleAssetSelectConfirm("selected")}
        onSelectSameIct={() => handleAssetSelectConfirm("same-ict")}
        selectedCount={selectedAssets.size}
        ictProjectName={mockAssets.find(a => selectedAssets.has(a.id))?.ictProjectName || ""}
      />
    </div>
  );
}