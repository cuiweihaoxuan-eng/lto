import React, { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";

interface FixedAsset {
  id: string;
  cityCode: string;
  cityName: string;
  assetName: string;
  assetCardNo: string;
  assetNature: string;
  equipmentAmount: string;
  freezeStatus: string;
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

interface AssetPickerModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (assets: FixedAsset[]) => void;
  existingAssetIds: string[];
}

// Mock完整资产数据（与资产清单页面一致）
const allMockAssets: FixedAsset[] = [
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
  },
  {
    id: "6",
    cityCode: "0205",
    cityName: "绍兴",
    assetName: "防火墙",
    assetCardNo: "000000000006",
    assetNature: "生产用",
    equipmentAmount: "60,000.00",
    freezeStatus: "否",
    projectCode: "XM202406001",
    department: "安全部",
    ictProjectCode: "ICT202406001",
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
    contactPhone: "0575-88888888",
    employeeId: "EMP2024011",
    responsiblePerson: "李一一",
    responsiblePersonPhone: "13700137006",
    responsiblePersonEmpId: "EMP2024012",
    assetUsageAddress: "绍兴市越城区某企业",
    sapAssetClass: "固定资产-通信设备",
    specModel: "Huawei USG6680",
    capitalizationDate: "20220201",
    overdueDate: "20270201",
    purchaseAmount: "60,000.00",
    depreciationAmount: "36,000.00",
    assetCustodian: "周一二",
    investmentProjectCode: "TZ202406001",
    sapOrderNo: "SO202406001",
    purchaseOrderNo: "PO202406001",
    supplierName: "华三通信",
    supplierCode: "SUP2024006",
    useDepartment: "股份.绍兴.安全部",
    departmentNo: "A330000006",
    companyCode: "A011",
    companyName: "中国电信股份有限公司浙江分公司",
    profitCenterGroup: "A3305",
    profitCenterGroupName: "中国电信股份有限公司浙江分绍兴",
    profitCenterId: "A330005",
    profitCenter: "绍兴",
    costCenterNo: "A330000009",
    costCenter: "安全部",
    "实物Class": "NY",
    "实物Table": "NY",
    createTime: "2022-02-01 09:00:00",
    updateTime: "2026-05-11 11:00:00"
  }
];

export function AssetPickerModal({ open, onClose, onConfirm, existingAssetIds }: AssetPickerModalProps) {
  const [searchCity, setSearchCity] = useState("");
  const [searchAssetName, setSearchAssetName] = useState("");
  const [searchAssetCardNo, setSearchAssetCardNo] = useState("");
  const [searchAssetNature, setSearchAssetNature] = useState<string>("全部");
  const [searchProjectCode, setSearchProjectCode] = useState("");
  const [searchIctProjectCode, setSearchIctProjectCode] = useState("");
  const [searchIctProjectName, setSearchIctProjectName] = useState("");
  const [searchContractName, setSearchContractName] = useState("");
  const [searchContractCode, setSearchContractCode] = useState("");
  const [searchResponsiblePerson, setSearchResponsiblePerson] = useState("");

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (open) {
      setSelectedIds(new Set());
      setCurrentPage(1);
    }
  }, [open]);

  // 筛选数据
  const filteredData = allMockAssets.filter(asset => {
    if (searchCity && !asset.cityName.includes(searchCity)) return false;
    if (searchAssetName && !asset.assetName.includes(searchAssetName)) return false;
    if (searchAssetCardNo && !asset.assetCardNo.includes(searchAssetCardNo)) return false;
    if (searchAssetNature !== "全部" && asset.assetNature !== searchAssetNature) return false;
    if (searchProjectCode && !asset.projectCode.includes(searchProjectCode)) return false;
    if (searchIctProjectCode && !asset.ictProjectCode.includes(searchIctProjectCode)) return false;
    if (searchIctProjectName && !asset.ictProjectName.includes(searchIctProjectName)) return false;
    if (searchContractName && !asset.contractName.includes(searchContractName)) return false;
    if (searchContractCode && !asset.contractCode.includes(searchContractCode)) return false;
    if (searchResponsiblePerson && !asset.responsiblePerson.includes(searchResponsiblePerson)) return false;
    return true;
  });

  // 分页
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredData.length);
  const currentPageAssets = filteredData.slice(startIndex, endIndex);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === currentPageAssets.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(currentPageAssets.map(a => a.id)));
    }
  };

  const handleConfirm = () => {
    const selectedAssets = allMockAssets.filter(a => selectedIds.has(a.id));
    onConfirm(selectedAssets);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl mx-4 max-h-[90vh] flex flex-col">
        {/* 标题栏 */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h3 className="text-lg font-medium text-gray-900">添加资产</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 查询条件 */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="grid grid-cols-4 gap-x-4 gap-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">地市</label>
              <Input size="sm" placeholder="请输入" value={searchCity} onChange={e => setSearchCity(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">资产名称</label>
              <Input size="sm" placeholder="请输入" value={searchAssetName} onChange={e => setSearchAssetName(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">卡片号</label>
              <Input size="sm" placeholder="请输入" value={searchAssetCardNo} onChange={e => setSearchAssetCardNo(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">资产性质</label>
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
            <div>
              <label className="block text-xs text-gray-500 mb-1">工程编码</label>
              <Input size="sm" placeholder="请输入" value={searchProjectCode} onChange={e => setSearchProjectCode(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">ICT项目编码</label>
              <Input size="sm" placeholder="请输入" value={searchIctProjectCode} onChange={e => setSearchIctProjectCode(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">合同编码</label>
              <Input size="sm" placeholder="请输入" value={searchContractCode} onChange={e => setSearchContractCode(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">责任人</label>
              <Input size="sm" placeholder="请输入" value={searchResponsiblePerson} onChange={e => setSearchResponsiblePerson(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-200">
            <Button variant="outline" size="sm" onClick={() => {
              setSearchCity(""); setSearchAssetName(""); setSearchAssetCardNo("");
              setSearchAssetNature("全部"); setSearchProjectCode(""); setSearchIctProjectCode("");
              setSearchContractCode(""); setSearchResponsiblePerson("");
            }}>
              重置
            </Button>
            <Button size="sm" onClick={() => setCurrentPage(1)}>
              <Search className="w-3 h-3 mr-1" />
              查询
            </Button>
          </div>
        </div>

        {/* 表格 */}
        <div className="flex-1 overflow-auto px-6 py-3">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-10">
                  <input type="checkbox" checked={selectedIds.size === currentPageAssets.length && currentPageAssets.length > 0} onChange={toggleSelectAll} />
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">资产名称</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-28">卡片号</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-20">资产性质</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-24">地市</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-600 w-24">设备金额</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-28">ICT项目编码</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">ICT项目名称</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">合同名称</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-20">责任人</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-600 w-20">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentPageAssets.map(asset => {
                const isExisting = existingAssetIds.includes(asset.id);
                return (
                  <tr key={asset.id} className={`hover:bg-gray-50 ${isExisting ? 'bg-gray-50' : ''}`}>
                    <td className="px-3 py-2">
                      <input type="checkbox" checked={selectedIds.has(asset.id)} onChange={() => toggleSelect(asset.id)} disabled={isExisting} />
                    </td>
                    <td className="px-3 py-2 max-w-32 truncate" title={asset.assetName}>{asset.assetName}</td>
                    <td className="px-3 py-2">{asset.assetCardNo}</td>
                    <td className="px-3 py-2">
                      <Badge className={
                        asset.assetNature === "生产用" ? "bg-blue-100 text-blue-700" :
                        asset.assetNature === "利旧回收" ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }>{asset.assetNature}</Badge>
                    </td>
                    <td className="px-3 py-2">{asset.cityName}</td>
                    <td className="px-3 py-2 text-right">{asset.equipmentAmount}</td>
                    <td className="px-3 py-2">{asset.ictProjectCode}</td>
                    <td className="px-3 py-2 max-w-32 truncate" title={asset.ictProjectName}>{asset.ictProjectName}</td>
                    <td className="px-3 py-2 max-w-32 truncate" title={asset.contractName}>{asset.contractName}</td>
                    <td className="px-3 py-2">{asset.responsiblePerson}</td>
                    <td className="px-3 py-2 text-center">
                      {isExisting ? <Badge className="bg-gray-100 text-gray-500">已添加</Badge> : <Badge className="bg-green-100 text-green-700">未添加</Badge>}
                    </td>
                  </tr>
                );
              })}
              {currentPageAssets.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-3 py-8 text-center text-gray-500">
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        <div className="px-6 py-3 border-t border-gray-200 flex justify-between items-center flex-shrink-0">
          <div className="text-sm text-gray-600">
            已选 <span className="text-blue-600 font-medium">{selectedIds.size}</span> 项，共 {filteredData.length} 条
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              第 {currentPage} / {totalPages || 1} 页
            </span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>首页</Button>
              <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>上一页</Button>
              <Button variant="outline" size="sm" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)}>下一页</Button>
              <Button variant="outline" size="sm" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(totalPages)}>末页</Button>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleConfirm} disabled={selectedIds.size === 0}>
            确定添加 ({selectedIds.size})
          </Button>
        </div>
      </div>
    </div>
  );
}