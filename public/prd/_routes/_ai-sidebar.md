# AI对话界面 PRD

## 1. 需求背景

### 痛点
- **问题现象**：当前AI对话界面仅显示纯文本消息，无法区分thinking过程、工具调用和最终回答，用户难以理解AI的推理链路
- **发生频率**：每次AI调用工具时都会产生此类信息
- **当前 workaround**：所有信息混在一起，代码以等宽字体显示，表格显示为原始markdown文本

### 业务目标
- **量化指标**：提升用户对AI回答的理解度，工具调用信息可折叠减少视觉干扰，数据支持图表展示
- **目标期限**：2026-05-25

### 涉及系统/模块
- **模块名称**：AISidebar（AI对话侧边栏组件）
- **变更类型**：修改
- **对接接口**：Dify API (agent_thought 事件)

## 2. 用户故事

### 故事1
- **角色**：业务用户
- **功能**：查看AI对话中的思考过程和工具调用详情
- **收益**：理解AI如何推理和执行操作，增强信任感
- **验收条件**：用户可折叠/展开thinking块和工具调用块

### 故事2
- **角色**：开发者/运维人员
- **功能**：查看API请求和响应的JSON详情
- **收益**：便于调试AI Agent的行为
- **验收条件**：请求/响应以格式化JSON展示，可复制

### 故事3
- **角色**：业务用户
- **功能**：在AI回答中查看表格数据
- **收益**：表格数据清晰易读，支持图表可视化
- **验收条件**：Markdown表格渲染为HTML表格，支持柱状图/饼图/折线图切换

### 故事4
- **角色**：业务用户
- **功能**：下载表格数据、复制消息内容、重新生成回答、语音朗读
- **收益**：提高工作效率，方便分享和存档
- **验收条件**：点击对应按钮执行相应操作

## 3. 需求清单

| 序号 | 需求描述 | 优先级 | 状态 | 负责人 | 截止日期 |
|------|----------|--------|------|--------|----------|
| 1 | 实现Thinking块：蓝色页眉+可折叠+Brain图标，默认收起 | P0 | DONE | | 2026-05-25 |
| 2 | 实现工具调用块：卡片式容器+请求/响应分离+等宽字体，默认收起 | P0 | DONE | | 2026-05-25 |
| 3 | Markdown表格解析为HTML表格 | P1 | DONE | | 2026-05-25 |
| 4 | 扩展Dify API数据结构以支持thinking和toolCall | P0 | DONE | | 2026-05-25 |
| 5 | 表格数据支持图表展示（柱状图/饼图/折线图） | P1 | DONE | | 2026-05-25 |
| 6 | 表格增加下载CSV按钮 | P2 | DONE | | 2026-05-25 |
| 7 | 消息增加复制、刷新重新生成、朗读按钮 | P2 | DONE | | 2026-05-25 |
| 8 | Markdown加粗（**xxx**）渲染为标签样式 | P2 | DONE | | 2026-05-25 |
| 9 | 对话历史功能：加载历史列表、查看历史消息 | P1 | DONE | | 2026-05-25 |

## 4. 业务流程图

```mermaid
graph TD
    A[用户发送消息] --> B[AI开始思考]
    B --> C[触发 agent_thought 事件]
    C --> D{判断事件类型}
    D -->|思考过程| E[显示Thinking块]
    D -->|工具调用| F[显示工具调用块]
    D -->|最终回答| G[显示消息内容]
    E --> H{用户操作}
    F --> H
    G --> H
    H -->|展开/折叠| I[查看详细内容]
    H -->|下载CSV| J[导出数据]
    H -->|切换图表| K[显示图表视图]
    H -->|复制| L[复制到剪贴板]
    H -->|朗读| M[语音合成播放]
    H -->|刷新| N[重新生成回答]
```

## 5. 页面结构

### 路由信息
- **路由路径** - AI侧边栏为独立组件，非页面路由
- **页面标题** - AI助手
- **访问权限** - 登录用户

### 布局结构
- **布局类型** - 侧边栏式（可拖拽调整宽度300-600px，默认400px）
- **区域-头部** - Logo + 标题 + 清空/关闭按钮
- **区域-对话历史** - 可折叠的历史对话列表，点击加载历史消息
- **区域-消息区** - 滚动区域，包含消息卡片
- **区域-输入区** - Agent切换 + 文件上传 + 文本输入

### 消息卡片结构
```
消息卡片
├── 头像
├── 内容区
│   ├── 文件附件（如有）
│   ├── 文本内容（处理表格、标题、加粗渲染）
│   ├── 表格区域
│   │   ├── 视图切换按钮（表格/柱状图/饼图/折线图）
│   │   └── 下载CSV按钮
│   ├── 时间戳
│   └── 操作按钮（复制/刷新/朗读）
├── Thinking块（可折叠，按返回顺序展示）
└── 工具调用块（可折叠，按返回顺序展示）
```

## 6. 功能描述

### 功能点1：Thinking块展示

#### 页面级
- **字段：Thinking块组件** - 类型：React组件；描述：显示AI思考过程
- **字段：展开/收起图标** - 类型：ChevronDown/ChevronUp；描述：点击切换状态
- **字段：默认状态** - 类型：布尔；描述：默认收起
- **字段：图标** - 类型：Brain图标（lucide-react）；描述：左侧图标装饰

#### 样式规格
| 属性 | 说明 |
|------|------|
| 页眉背景 | bg-blue-500（蓝色） |
| 页眉高度 | h-auto, px-3 py-2 |
| 左侧图标 | Brain图标，白色，w-3.5 h-3.5 |
| 标签样式 | px-2 py-0.5，bg-purple-100 text-purple-700 |
| 折叠箭头 | 右上角，ChevronDown/ChevronUp，白色 |
| 展开态 | 显示完整思考内容，pre标签包裹 |
| 收起态 | 仅显示"思考中"标签 |

#### 业务逻辑
- 从 `agent_thought` 事件中解析 `thought` 字段
- 过滤掉 `<think>...</think>` 标签
- `observation` 为空时识别为思考过程，`isRealToolCall=false`
- 同 `toolName` 的工具调用自动合并请求和响应

### 功能点2：工具调用块展示

#### 页面级
| 字段名 | 类型 | 必填 | 默认值 | 来源 | 校验规则 | 展示形式 | 交互约束 |
|--------|------|------|--------|------|----------|----------|----------|
| 工具调用块 | React组件 | - | - | agent_thought事件 | - | 卡片式容器 | 可折叠 |
| 请求参数 | JSON对象 | - | - | tool_input字段 | - | pre标签，等宽字体 | 只读 |
| 响应结果 | JSON对象 | - | - | observation字段 | - | pre标签，等宽字体 | 只读 |

#### 样式规格
| 属性 | 说明 |
|------|------|
| 卡片容器 | rounded-lg border border-gray-200 overflow-hidden |
| 页眉背景 | bg-blue-500（真正的工具调用）/ bg-gray-100（思考过程） |
| 请求/响应区 | bg-gray-50, p-3, space-y-3 |
| 蓝色竖线 | w-1 h-4 bg-blue-500 rounded |
| 标签文字 | text-xs font-medium text-gray-600 |

#### 业务逻辑
- `isRealToolCall=true` 条件：`observation` 以 `{` 开头且有 `toolName`
- 从 `tool_input` 字段提取请求信息（JSON格式）
- 从 `observation` 字段提取响应信息（格式：`{"tool_name": "result"}`）
- 自动合并同 `toolName` 的工具调用（先收到请求，后续收到响应）

### 功能点3：Markdown表格渲染

#### 页面级
| 字段名 | 类型 | 必填 | 默认值 | 来源 | 校验规则 | 展示形式 | 交互约束 |
|--------|------|------|--------|------|----------|----------|----------|
| 表格解析函数 | function | - | - | 本地解析 | - | - | - |
| HTML表格 | ReactNode | - | - | 正则匹配Markdown表格 | - | 标准table | - |

#### 样式规格
| 属性 | 说明 |
|------|------|
| 表头 | bg-gray-100, font-semibold, px-3 py-2 |
| 单元格 | border border-gray-300, px-3 py-2 |
| 交替行 | 偶数行 bg-gray-50 |
| 下载按钮 | 右上角，px-3 py-1.5，bg-blue-100 |

#### 业务逻辑
- 正则匹配Markdown表格语法：`\|.+\|[\r\n]+\|[-:\s|]+\|[\r\n]+((?:\|.+\|[\r\n]*)+)`
- 解析表头和数据行，过滤空单元格
- `processInlineFormatting` 函数处理行内格式化

### 功能点4：图表展示

#### 页面级
| 字段名 | 类型 | 必填 | 默认值 | 来源 | 校验规则 | 展示形式 | 交互约束 |
|--------|------|------|--------|------|----------|----------|----------|
| 视图切换按钮组 | React组件 | - | 'table' | useState | - | 按钮组 | 可切换 |
| 柱状图 | Recharts BarChart | - | - | recharts库 | 数据≤30条 | ResponsiveContainer | - |
| 饼图 | Recharts PieChart | - | - | recharts库 | 数据≤8条 | ResponsiveContainer | - |
| 折线图 | Recharts LineChart | - | - | recharts库 | 数据≥2条 | ResponsiveContainer | - |

#### 图表切换逻辑
```
1. 识别数字列：检查前3行，超过50%是数字则识别为数字列
2. 转换图表数据：提取数字列数据，最多30条
3. 切换视图：table/bar/pie/line四种视图
4. 柱状图：适合对比
5. 饼图：取第一列数值，展示占比（最多8条）
6. 折线图：适合趋势（至少2条数据）
```

#### 样式规格
| 属性 | 说明 |
|------|------|
| 按钮样式 | px-3 py-1 text-xs rounded-lg |
| 激活态 | bg-blue-500 text-white |
| 非激活态 | bg-gray-100 text-gray-600 hover:bg-gray-200 |
| 图表容器 | bg-gray-50 p-4 rounded-lg |
| 图表高度 | height=300 |
| 颜色配置 | #3b82f6, #10b981, #f59e0b, #ef4444, #8b5cf6, #ec4899 |

### 功能点5：加粗文本标签

#### 页面级
| 字段名 | 类型 | 必填 | 默认值 | 来源 | 校验规则 | 展示形式 | 交互约束 |
|--------|------|------|--------|------|----------|----------|----------|
| 加粗正则 | RegExp | - | - | /\*\*[^*]+\*\*/g | - | - | - |
| 标签样式 | ReactNode | - | - | processInlineFormatting | - | span标签 | - |

#### 样式规格
```
px-1 py-0.5 mx-0.5 rounded bg-blue-100/70 text-blue-800 font-medium
```

### 功能点6：下载CSV

#### 页面级
| 字段名 | 类型 | 必填 | 默认值 | 来源 | 校验规则 | 展示形式 | 交互约束 |
|--------|------|------|--------|------|----------|----------|----------|
| 下载按钮 | button | - | - | UI | - | Download图标+文字 | 可点击 |
| CSV生成 | function | - | - | 本地处理 | - | Blob下载 | - |

#### 业务逻辑
```
1. 构建CSV内容：表头+数据行，逗号分隔
2. 处理特殊字符：引号、逗号、转义处理
3. 添加BOM：﻿前缀，支持中文
4. 创建Blob对象，触发下载
```

### 功能点7：消息操作按钮

#### 页面级
| 字段名 | 类型 | 必填 | 默认值 | 来源 | 校验规则 | 展示形式 | 交互约束 |
|--------|------|------|--------|------|----------|----------|----------|
| 复制按钮 | button | - | - | navigator.clipboard | - | Copy图标 | 可点击 |
| 刷新按钮 | button | - | - | 重新调用AI | - | RefreshCw图标 | 仅助手消息 |
| 朗读按钮 | button | - | - | SpeechSynthesis | - | Volume2图标(播放中Square) | 可点击切换 |

#### 业务逻辑
| 操作 | 实现方式 |
|------|----------|
| 复制 | `navigator.clipboard.writeText(message.content)` |
| 刷新 | 保存 `userQuery`，重新调用 `sendDifyMessage` |
| 朗读 | `new SpeechSynthesisUtterance(text)`，lang='zh-CN' |
| 停止朗读 | `window.speechSynthesis.cancel()`，设置 `speakingMessageId` 状态 |

#### 朗读状态管理
```
1. 使用 useState 管理 playingMessageId 状态
2. 点击朗读按钮时：
   - 如果正在播放该消息：停止播放，清空状态
   - 如果不在播放：开始播放，设置状态为当前消息ID
3. 图标切换：播放中显示 Square(停止)图标，否则显示 Volume2(播放)图标
4. 样式切换：播放中按钮变绿色背景
5. 播放结束/onend 或 onerror 时自动清空状态
6. 点击其他消息会停止当前播放并开始新播放
```

### 功能点8：对话历史

#### 页面级
| 字段名 | 类型 | 必填 | 默认值 | 来源 | 校验规则 | 展示形式 | 交互约束 |
|--------|------|------|--------|------|----------|----------|----------|
| 历史列表 | button[] | - | [] | getConversations API | - | 折叠列表 | 可点击 |
| 历史消息 | Message[] | - | [] | getConversationMessages API | - | 标准消息卡片 | - |

#### 业务逻辑
```
1. 展开历史时调用 getConversations
2. 点击历史项调用 getConversationMessages
3. 转换为 Message 格式，添加 thoughts=[] 和 files=[]
4. 点击后收起历史列表
5. created_at 支持时间戳和字符串两种格式
```

## 7. 数据流图

### 接口1：sendDifyMessage（通用 AI 对话接口）

**兼容平台**：Dify、星辰平台、星智平台

#### 请求参数（通用）
| 参数名 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| query | string | 是 | 用户输入 | 查询内容 |
| conversation_id | string | 否 | 已有对话ID | 继续对话 |
| user | string | 是 | 配置/系统 | 用户标识 |
| files | array | 否 | 用户上传 | 上传的文件列表 |
| platform | string | 否 | 配置 | 平台类型：dify/星辰平台/星智平台 |

#### Dify 平台请求参数
| 参数名 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| response_mode | string | 是 | 固定值 | streaming |
| inputs | object | 否 | 配置 | 变量输入 |
| file_ids | array | 否 | 文件上传 | 上传后的文件ID列表 |

#### 星辰/星智平台请求参数
| 参数名 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| mode | string | 是 | 固定值 | streaming |
| input_data | object | 否 | 配置 | 变量输入 |
| files | array | 否 | 文件上传 | 文件对象数组 |

#### 星辰平台文件格式
```json
{
  "files": [
    {
      "type": "image",
      "transfer_method": "local_file",
      "upload_file_id": "文件ID"
    }
  ]
}
```

#### 响应字段
| 字段名 | 类型 | 说明 |
|---------|------|------|
| event | string | agent_thought/message/agent_message/message_end |
| thought | string | AI思考内容（可能包含<think>标签） |
| tool | string | 工具名称 |
| tool_input | string | 工具输入参数（JSON字符串） |
| observation | string | 工具输出结果 |
| answer | string | 最终回答 |
| conversation_id | string | 对话ID |
| task_id | string | 任务ID（星辰平台） |
- **存储位置** - React useState messages
- **错误码** - error事件返回错误消息

### 接口2：文件上传

#### Dify 平台
- **请求路径** - POST /files/upload
- **请求方法** - POST
- **请求头** - Authorization: Bearer {apiKey}
- **请求参数**：file (FormData), user (string)
- **响应字段**：id, name, size, extension, mime_type, created_by, created_at

#### 星辰/星智平台
- **请求路径** - POST /files/upload
- **请求方法** - POST
- **请求头** - Authorization: Bearer {apiKey}
- **请求参数**：file (FormData), user (string)
- **响应字段**：id, name, size, extension, mime_type, created_by, created_at

### 接口3：getConversations
- **请求路径** - GET /conversations
- **请求方法** - GET
- **请求头** - Authorization: Bearer {apiKey}
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 |
  |--------|------|------|------|
  | page | number | 是 | 固定1 |
  | limit | number | 是 | 固定20 |
  | user | string | 是 | 当前用户标识 |
- **响应字段**：
  | 字段名 | 类型 | 说明 |
  |---------|------|------|
  | data | array | 对话列表 |
  | data[].id | string | 对话ID |
  | data[].name | string | 对话名称 |
  | data[].created_at | number | 创建时间戳 |
- **存储位置** - React useState conversationList

### 接口3：getConversationMessages
- **请求路径** - GET /messages
- **请求方法** - GET
- **请求头** - Authorization: Bearer {apiKey}
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 |
  |--------|------|------|------|
  | conversation_id | string | 是 | 选中的对话ID |
  | limit | number | 是 | 固定20 |
  | user | string | 是 | 当前用户标识 |
- **响应字段**：
  | 字段名 | 类型 | 说明 |
  |---------|------|------|
  | data | array | 消息列表 |
  | data[].id | string | 消息ID |
  | data[].query | string | 用户问题 |
  | data[].answer | string | AI回答 |
  | data[].created_at | number | 创建时间戳 |
- **存储位置** - React useState messages

## 8. 验收标准

### 正常流程
- [x] **操作**：AI发送消息包含thinking → **预期**：Thinking块显示在消息下方，默认收起
- [x] **操作**：点击Thinking块展开 → **预期**：显示完整思考内容，箭头变为收起状态
- [x] **操作**：AI调用工具 → **预期**：工具调用块显示，包含请求/响应，默认收起
- [x] **操作**：展开工具调用块 → **预期**：显示格式化的JSON内容，等宽字体
- [x] **操作**：AI回复包含Markdown表格 → **预期**：渲染为HTML表格样式
- [x] **操作**：点击柱状图/饼图/折线图按钮 → **预期**：切换到对应图表视图
- [x] **操作**：点击下载CSV按钮 → **预期**：浏览器下载CSV文件
- [x] **操作**：点击复制按钮 → **预期**：消息内容复制到剪贴板
- [x] **操作**：点击刷新按钮 → **预期**：使用相同问题重新生成回答
- [x] **操作**：点击朗读按钮 → **预期**：浏览器语音朗读消息内容
- [x] **操作**：点击对话历史 → **预期**：收起历史列表，加载并显示历史消息
- [x] **操作**：AI回复包含**加粗** → **预期**：渲染为带背景的标签样式

### 异常流程
- [x] **操作**：AI回复无thinking/toolCall → **预期**：仅显示文本内容
- [x] **操作**：工具调用请求过长 → **预期**：横向滚动条出现，可滚动查看
- [x] **操作**：网络断开 → **预期**：显示错误消息，typing状态停止
- [x] **操作**：折线图数据少于2条 → **预期**：显示提示"折线图需要至少2条数据"
- [x] **操作**：表格无数字列 → **预期**：不显示图表切换按钮

## 9. 更新记录

### v7 - 2026-05-27
- **修复思考模块重复显示**：agent_thought 和 agent_message 事件都发送 think 标签内容导致重复，通过 `thoughtProcessedThinkTag` 标记避免重复处理
- **修复思考块顺序**：统一将思考块插入到 text segment 之前，确保显示在正文之前
- **新增朗读停止功能**：点击朗读按钮可切换播放/停止状态，播放中显示停止图标

### v6 - 2026-05-26
- **新增星辰平台对接**：支持星辰平台和星智平台的 API 调用
- **新增平台类型参数**：根据配置的平台类型自动选择合适的请求格式
- **星辰平台文件上传**：使用 `files` 数组格式 `[{type: "image", transfer_method: "local_file", upload_file_id: "xxx"}]`
- **星辰平台请求参数**：`mode: "streaming"` 替换 `response_mode`，`input_data` 替换 `inputs`
- **新增 uploadFileToXingchen 函数**：专门处理星辰平台的文件上传

### v5 - 2026-05-25
- 对话历史功能完善：支持展开加载历史列表、点击加载历史消息、收起历史列表
- 修复 created_at 时间戳格式兼容问题
- 修复历史消息缺少 thoughts/files 字段导致报错

### v4 - 2026-05-25
- **新增图表展示功能**：表格支持柱状图、饼图、折线图切换
- **新增下载CSV**：表格右上角下载按钮，支持导出数据
- **新增消息操作**：复制、刷新重新生成、朗读按钮
- **新增加粗标签**：`**xxx**` 渲染为带蓝色半透明背景的标签样式
- **新增下载链接样式**：识别下载链接，渲染为蓝色按钮+下载图标

### v3 - 2026-05-25
- 修复流式输出重复内容问题（改为直接替换而非累积）
- 修复Thinking块不显示问题（只要有thought或observation就显示）
- 修复重复内容过滤逻辑
- Thinking块使用Brain图标替换Square
- Thinking/工具调用块放在回复内容之前
- Markdown表格正常渲染为HTML表格
- 新增Markdown标题（#、##、###、####）样式渲染

### v2 - 2026-05-25
- 修复 agent_thought 事件解析：tool_input 提取请求，observation 提取响应
- 修复 isRealToolCall 判断逻辑
- 自动合并同 toolName 的工具调用

### v1 - 2026-05-25
- 初始版本
- 实现Thinking块展示（蓝色页眉+可折叠+Brain图标+默认收起）
- 实现工具调用块展示（卡片式+请求响应分离+等宽字体+默认收起）
- 实现Markdown表格解析渲染
