import React, { useState, useCallback } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { X, ChevronDown, ChevronRight, Save, Trash2, FileText, DollarSign, ClipboardList, Package, Settings } from "lucide-react";
import { NodeEditor } from "./NodeEditor";

// 自定义节点组件
const CustomNode = ({ data, id }: any) => {
  const [expanded, setExpanded] = useState(false);
  
  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    data.onDelete?.(id);
  };
  
  return (
    <div className="bg-white border-2 border-blue-400 rounded-lg shadow-lg min-w-[200px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      {/* 节点头部 */}
      <div className="p-3 flex items-start justify-between gap-2 border-b border-gray-200">
        <div className="flex items-start gap-2 flex-1">
          {/* 节点图标 */}
          <div className="mt-0.5 text-[#1890ff]">
            {data.icon || <Package className="w-4 h-4" />}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900 mb-1">{data.label}</div>
            <div className="text-xs text-gray-500">{data.stage || '未设置'} · {data.type || '未设置'}</div>
          </div>
        </div>
        <div className="flex gap-1">
          {data.hasChildren && (
            <button
              onClick={handleExpandClick}
              className="p-1 hover:bg-gray-100 rounded"
              title={expanded ? "收起" : "展开"}
            >
              {expanded ? (
                <ChevronDown className="w-3 h-3 text-gray-600" />
              ) : (
                <ChevronRight className="w-3 h-3 text-gray-600" />
              )}
            </button>
          )}
          <button
            onClick={handleDeleteClick}
            className="p-1 hover:bg-red-50 rounded"
            title="删除节点"
          >
            <Trash2 className="w-3 h-3 text-red-500" />
          </button>
        </div>
      </div>
      
      {/* 二级节点展示 */}
      {expanded && data.children && data.children.length > 0 && (
        <div className="p-2 bg-gray-50 space-y-1">
          {data.children.map((child: any, index: number) => (
            <div
              key={index}
              className="text-xs px-2 py-1 bg-white rounded border border-gray-200 text-gray-700 flex items-center gap-1.5"
            >
              <div className="w-1 h-1 rounded-full bg-blue-400" />
              {child.name}
            </div>
          ))}
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

interface ProcessNode {
  id: string;
  name: string;
  code: string;
  stage?: string;
  type?: string;
  icon?: React.ReactNode;
  children?: ProcessNode[];
}

// 模拟节点库数据
const mockNodeLibrary: ProcessNode[] = [
  {
    id: "n1",
    name: "商机录入",
    code: "OPP_INPUT",
    stage: "售前",
    type: "业务流",
    icon: <FileText className="w-4 h-4" />,
    children: [
      { id: "n1-1", name: "商机基本信息", code: "OPP_BASIC" },
      { id: "n1-2", name: "客户信息", code: "OPP_CUSTOMER" }
    ]
  },
  {
    id: "n2",
    name: "合同解构",
    code: "CONTRACT_DEMOLITION",
    stage: "售中",
    type: "业务流",
    icon: <ClipboardList className="w-4 h-4" />,
    children: [
      { id: "n2-1", name: "合同明细", code: "CONTRACT_DETAIL" },
      { id: "n2-2", name: "科目分配", code: "SUBJECT_ALLOCATION" }
    ]
  },
  {
    id: "n3",
    name: "开票申请",
    code: "INVOICE_APP",
    stage: "售后",
    type: "财务流",
    icon: <FileText className="w-4 h-4" />
  },
  {
    id: "n4",
    name: "回款确认",
    code: "PAYMENT_CONFIRM",
    stage: "售后",
    type: "财务流",
    icon: <DollarSign className="w-4 h-4" />
  }
];

interface ProcessEditorProps {
  process: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function ProcessEditor({ process, onSave, onCancel }: ProcessEditorProps) {
  const [formData, setFormData] = useState({
    name: process?.name || "",
    regions: process?.regions || [],
    businessTypes: process?.businessTypes || [],
    products: process?.products || []
  });

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showNodeEditor, setShowNodeEditor] = useState(false);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'smoothstep',
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
          },
          eds
        )
      ),
    [setEdges]
  );

  const toggleExpand = (id: string) => {
    setExpandedNodes(prev =>
      prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]
    );
  };

  const handleDragStart = (event: React.DragEvent, node: ProcessNode) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(node));
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    
    const reactFlowBounds = event.currentTarget.getBoundingClientRect();
    const nodeData = JSON.parse(
      event.dataTransfer.getData('application/reactflow')
    );

    const position = {
      x: event.clientX - reactFlowBounds.left - 80,
      y: event.clientY - reactFlowBounds.top - 40,
    };

    // 根据节点类型选择图标
    let icon;
    if (nodeData.type === '财务流') {
      icon = <DollarSign className="w-4 h-4" />;
    } else if (nodeData.name.includes('合同')) {
      icon = <ClipboardList className="w-4 h-4" />;
    } else {
      icon = <FileText className="w-4 h-4" />;
    }

    const newNode: Node = {
      id: `${nodeData.id}-${Date.now()}`,
      type: 'custom',
      position,
      data: { 
        label: nodeData.name,
        stage: nodeData.stage,
        type: nodeData.type,
        originalId: nodeData.id,
        icon: icon,
        hasChildren: nodeData.children && nodeData.children.length > 0,
        children: nodeData.children,
        onDelete: (id: string) => {
          setNodes((nds) => nds.filter(n => n.id !== id));
        }
      },
    };

    setNodes((nds) => nds.concat(newNode));
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setShowNodeEditor(true);
  };

  const handleSaveNodeConfig = (config: any) => {
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === selectedNode.id
            ? { ...n, data: { ...n.data, ...config } }
            : n
        )
      );
    }
    setShowNodeEditor(false);
  };

  const handleSave = () => {
    onSave({
      ...formData,
      nodes,
      edges
    });
  };

  if (showNodeEditor && selectedNode) {
    return (
      <NodeEditor
        node={selectedNode}
        onSave={handleSaveNodeConfig}
        onCancel={() => setShowNodeEditor(false)}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">
          {process ? "编辑流程" : "新增流程"}
        </h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Basic Info */}
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700 mb-3">基本信息</h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-gray-600 mb-1 block">流程名称 *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="请输入流程名称"
              className="h-8"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-1 block">适用区域（多选）</label>
            <Input
              placeholder="请选择适用区域"
              className="h-8"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-1 block">业务类型（多选）</label>
            <Input
              placeholder="请选择业务类型"
              className="h-8"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-1 block">适用产品（多选）</label>
            <Input
              placeholder="请选择适用产品"
              className="h-8"
            />
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Node Library */}
        <div className="w-64 border-r border-gray-200 bg-gray-50 overflow-y-auto">
          <div className="p-3 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700">流程节点库</h3>
          </div>
          <div className="p-2">
            {mockNodeLibrary.map((node) => (
              <div key={node.id} className="mb-2">
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, node)}
                  className="bg-white border border-gray-200 rounded p-2 cursor-move hover:border-blue-400 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex items-start gap-2">
                      <div className="mt-0.5 text-[#1890ff]">
                        {node.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{node.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {node.stage} · {node.type}
                        </div>
                      </div>
                    </div>
                    {node.children && (
                      <button
                        onClick={() => toggleExpand(node.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {expandedNodes.includes(node.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                {/* Children */}
                {node.children && expandedNodes.includes(node.id) && (
                  <div className="ml-4 mt-1 space-y-1">
                    {node.children.map((child) => (
                      <div
                        key={child.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, child)}
                        className="bg-white border border-gray-200 rounded p-2 cursor-move hover:border-blue-300 text-xs flex items-center gap-1.5"
                      >
                        <div className="w-1 h-1 rounded-full bg-gray-400" />
                        {child.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative">
          <div
            className="absolute inset-0"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={handleNodeClick}
              nodeTypes={nodeTypes}
              fitView
            >
              <Controls />
              <Background />
            </ReactFlow>
          </div>
          <div className="absolute top-4 left-4 bg-white rounded shadow-sm p-2 text-xs text-gray-600">
            <div>拖拽节点到画布</div>
            <div>点击节点可编辑配置</div>
            <div>拖拽节点连接点创建连线</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button onClick={handleSave} className="bg-[#1890ff] hover:bg-[#40a9ff]">
          <Save className="w-4 h-4 mr-1" />
          保存
        </Button>
      </div>
    </div>
  );
}