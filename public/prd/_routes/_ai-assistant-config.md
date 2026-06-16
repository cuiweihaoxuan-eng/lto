# AI 助手配置

> 本 PRD 涵盖 AI 助手配置页面 + AI 对话侧边栏（原 _ai-sidebar.md 内容已合并到对应章节）。AI 侧边栏在前端是 AI 助手配置页的右侧抽屉组件，无独立路由，故合并到本页统一维护。

## 需求背景

### 痛点
- **问题现象 1（AI 助手配置）**：用户需要在 LTO 平台对接多个外部 AI 智能体（如 Dify、星辰平台），当前缺少统一的配置管理入口；同时用户在与 AI 助手对话时，希望用自然语言直接完成"打开页面 / 打开弹窗 / 填表"等操作，但当前 AI 助手只能回答菜单查询，无法与系统交互
- **问题现象 2（AI 对话界面）**：AI 对话界面仅显示纯文本消息，无法区分 thinking 过程、工具调用和最终回答，用户难以理解 AI 的推理链路
- **发生频率**：高——管理员日常维护 AI 助手配置；用户每次与 AI 助手对话都可能用到自然语言交互
- **当前 workaround**：管理员手动在 localStorage 维护配置；用户需自己点击菜单、打开弹窗、手动填表；AI 回复的所有信息混在一起，代码以等宽字体显示，表格显示为原始 markdown 文本

### 业务目标
- **量化指标 1**：自然语言填表功能上线后，"打开 AI 助手配置 + 填 4 个字段"的完整操作从原本的 7-8 次点击缩短为 1 句话
- **量化指标 2**：提升用户对 AI 回答的理解度，工具调用信息可折叠减少视觉干扰，数据支持图表展示
- **目标期限**：第一期（覆盖 AI 助手配置一个表单跑通流程）已完成；侧边栏重构 2026-05-25 完成；后续覆盖其他表单

### 涉及系统/模块
- **模块名称**：AI 助手配置 + AI 对话侧边栏（抽屉组件）
- **变更类型**：新增 + 重构
- **对接接口**：Dify 智能体 `chat-messages` 流式接口（baseUrl + apiKey 配置在 AI 助手配置里）

## 用户故事

### 故事1
- **角色**：平台管理员
- **功能**：在 AI 助手配置页新增/编辑/启用/禁用/测试一个 AI 助手配置
- **收益**：统一管理多个 AI 智能体，避免散落在 localStorage 维护
- **验收条件**：能新增一个 Dify 平台配置并保存，列表中显示该条配置

### 故事2
- **角色**：业务用户
- **功能**：在 AI 侧边栏用自然语言说"打开 AI 助手配置页面，新增 AI 助手配置，名称 test，平台 dify，api 是 http://localhost/v1 key 是 123"
- **收益**：一次对话完成"打开弹窗 + 填 4 个字段"，无需手动点击
- **验收条件**：链接点击后打开 AI 助手配置弹窗，4 个字段已自动填入

### 故事3
- **角色**：业务用户
- **功能**：点击 AI 回复中"打开 XX 页面"链接
- **收益**：跳转到对应页面，无需在菜单中查找
- **验收条件**：链接正确跳转到目标页面，URL 携带必要参数

### 故事4
- **角色**：业务用户
- **功能**：查看 AI 思考过程
- **收益**：了解 AI 为何给出当前回答，建立信任
- **验收条件**：AI 思考过程以淡紫色折叠块显示，思考中实时展开，完成后自动折叠

### 故事5
- **角色**：开发者/运维人员
- **功能**：查看 API 请求和响应的 JSON 详情
- **收益**：便于调试 AI Agent 的行为
- **验收条件**：请求/响应以格式化 JSON 展示，可复制

### 故事6
- **角色**：业务用户
- **功能**：在 AI 回答中查看表格数据
- **收益**：表格数据清晰易读，支持图表可视化
- **验收条件**：Markdown 表格渲染为 HTML 表格，支持柱状图/饼图/折线图切换

### 故事7
- **角色**：业务用户
- **功能**：下载表格数据、复制消息内容、重新生成回答、语音朗读
- **收益**：提高工作效率，方便分享和存档
- **验收条件**：点击对应按钮执行相应操作

## 需求清单

### AI 助手配置页
| 序号 | 需求描述 | 优先级 | 状态 | 负责人 | 截止日期 |
|------|----------|--------|------|--------|----------|
| 1 | AI 助手配置列表展示 | P0 | DONE | | |
| 2 | 新增/编辑 AI 助手配置弹窗 | P0 | DONE | | |
| 3 | 启用/禁用/可见/测试配置 | P0 | DONE | | |
| 4 | 配置存储到 localStorage | P0 | DONE | | |
| 5 | AI 侧边栏切换不同 AI 助手 | P0 | DONE | | |

### 自然语言交互
| 序号 | 需求描述 | 优先级 | 状态 | 负责人 | 截止日期 |
|------|----------|--------|------|--------|----------|
| 6 | 自然语言"打开页面"功能（URL 预置 ?page=xxx） | P0 | DONE | | |
| 7 | 自然语言"打开弹窗"功能（URL 预置 ?openModal=yyy） | P0 | DONE | | |
| 8 | 自然语言"填表"功能（formSlots 注册 + URL 预置 + AI 返回 json actions） | P0 | DONE | | |
| 9 | Dify 智能体 4 类请求支持（菜单查询/打开页面/打开弹窗/填表） | P0 | DONE | | |
| 10 | 覆盖其他表单（除 AI 助手配置外） | P1 | TODO | | |
| 11 | 权限判断（user_permissions 校验） | P2 | TODO | | |
| 12 | 表单槽位配置页面（替代 formSlots.ts 集中声明） | P3 | TODO | | |

### AI 渲染能力
| 序号 | 需求描述 | 优先级 | 状态 | 负责人 | 截止日期 |
|------|----------|--------|------|--------|----------|
| 13 | AI 思考/正文/工具调用按出现顺序混排渲染 | P0 | DONE | | 2026-06-12 |
| 14 | 思考块淡紫色样式 + 完成自动折叠 | P0 | DONE | | 2026-06-12 |
| 15 | 工具调用段按 m.content 长度锚点穿插（不堆底） | P0 | DONE | | 2026-06-12 |
| 16 | 未闭合 `` 立即显示思考块（不等 ``） | P0 | DONE | | 2026-06-12 |
| 17 | 历史对话加载时正确显示思考模块 | P0 | DONE | | 2026-06-12 |
| 18 | 修复 onMessage 覆盖而非追加（防指数级重复） | P0 | DONE | | 2026-06-12 |

### AI 对话界面（侧边栏）
| 序号 | 需求描述 | 优先级 | 状态 | 负责人 | 截止日期 |
|------|----------|--------|------|--------|----------|
| 19 | 实现 Thinking 块：可折叠+Brain 图标 | P0 | DONE | | 2026-05-25 |
| 20 | 实现工具调用块：卡片式容器+请求/响应分离+等宽字体 | P0 | DONE | | 2026-05-25 |
| 21 | Markdown 表格解析为 HTML 表格 | P1 | DONE | | 2026-05-25 |
| 22 | 扩展 Dify API 数据结构以支持 thinking 和 toolCall | P0 | DONE | | 2026-05-25 |
| 23 | 表格数据支持图表展示（柱状图/饼图/折线图） | P1 | DONE | | 2026-05-25 |
| 24 | 表格增加下载 CSV 按钮 | P2 | DONE | | 2026-05-25 |
| 25 | 消息增加复制、刷新重新生成、朗读按钮 | P2 | DONE | | 2026-05-25 |
| 26 | Markdown 加粗（**xxx**）渲染为标签样式 | P2 | DONE | | 2026-05-25 |
| 27 | 对话历史功能：加载历史列表、查看历史消息 | P1 | DONE | | 2026-05-25 |
| 28 | 星辰平台对接（独立于 Dify 的 API 协议） | P1 | DONE | | 2026-05-26 |
| 29 | 朗读停止功能（切换播放/停止状态） | P2 | DONE | | 2026-05-27 |

- **优先级**：P0（核心流程阻塞）/ P1（重要功能）/ P2（体验优化）/ P3（未来规划）
- **状态**：TODO / IN PROGRESS / DONE / BLOCKED

## 业务流程图

### 自然语言填表流程

```mermaid
graph TD
    A[用户在 AI 侧边栏输入自然语言] --> B{AI 识别意图}
    B -->|菜单查询| C[返回菜单列表文本]
    B -->|打开页面| D[返回 Markdown 链接 ?page=xxx]
    B -->|打开弹窗| E[返回 Markdown 链接 ?page=xxx&openModal=yyy]
    B -->|填表| F[同时返回链接 + json 代码块]
    D --> G[用户点击链接]
    E --> G
    F --> G
    G --> H[前端路由解析 URL]
    H --> I{是否打开弹窗?}
    I -->|否| J[直接跳转到目标页面]
    I -->|是| K[跳转到目标页面 + 打开弹窗]
    K --> L{是否有待应用 actions?}
    L -->|是| M[formSlotRegistry.apply actions]
    L -->|否| N[弹窗空白打开]
    M --> O[用户检查后保存]
    N --> O
```

### AI 对话事件分发流程

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

## 页面结构

### 路由信息
- **路由路径** - 类型：文本；必填：是；示例：`?page=ai-assistant-config`
- **页面标题** - 类型：文本；必填：是；示例：`AI 助手配置`
- **访问权限** - 类型：枚举（公开/登录/角色）；描述：登录用户

### 布局结构
- **布局类型** - 类型：枚举（单栏/双栏/三栏）；描述：单栏
- **区域-顶部栏** - 字段列表；描述：页面标题"AI 助手配置" + 右上角"新增配置"按钮 + 打开 AI 侧边栏的按钮
- **区域-主内容** - 字段列表；描述：AI 助手配置列表（表格）+ 每行的操作按钮（编辑/启用/可见/测试/删除）
- **AI 侧边栏（抽屉组件）** - 侧边栏式布局，可拖拽调整宽度 300-600px，默认 400px
  - **区域-头部** - Logo + 标题 + 清空/关闭按钮
  - **区域-对话历史** - 可折叠的历史对话列表
  - **区域-消息区** - 滚动区域，包含消息卡片
  - **区域-输入区** - Agent 切换 + 文件上传 + 文本输入

### Tab 结构
- 无

## 功能描述

### Chatbot 整体能力清单

> 覆盖 AI 助手配置页 + AI 对话侧边栏的所有能力。下方 8 个功能点会逐项展开字段级实现。

#### 基础对话能力

| 功能 | 说明 |
|------|------|
| 基础问答 | 任何闲聊 / 业务咨询 / 平台使用问题 |
| 智能体切换 | 右上角下拉切换 3 个智能体（本体查询 / LTO 客服 / 星辰客服），对应不同 Dify 应用 |
| 多轮对话 | 同一 conversationId 保持上下文 |
| 历史会话列表 | 左侧抽屉显示历史会话，点击切换 |
| 流式输出 | 打字机式逐字显示（SSE） |
| 文件上传 | 支持图片和文件附件，随消息一起发到 Dify |
| 重新生成 | 每条助手消息右下角"刷新"按钮可重新生成 |
| 复制消息 | 复制按钮复制 m.content 原文（含 think 标签和 markdown） |
| 语音朗读 | 朗读按钮（图标入口） |

#### 自然语言导航 4 类意图

| 功能 | 用户说法示例 | AI 输出 |
|------|------|------|
| 菜单查询 | "平台有哪些功能" | 纯文本菜单列表 |
| 打开页面 | "打开 AI 助手配置" | Markdown 链接 `?page=ai-assistant-config` |
| 打开弹窗 | "新增 AI 助手配置" | Markdown 链接 `?page=ai-assistant-config&openModal=ai-assistant&action=new` |
| 填表 | "打开 AI 助手配置，新增 AI 助手配置，名称 test，平台 dify，api 是 http://localhost/v1 key 是 123" | 同时输出链接 + json 代码块，前端自动跳转+打开弹窗+填表 |

#### 渲染能力

| 能力 | 说明 |
|------|------|
| 表格渲染 | markdown 表格转 HTML 表格，支持内置图表（柱状/饼图/折线） |
| 图表渲染 | 简单图表用 recharts 渲染 |
| 链接渲染 | Markdown 链接 `[text](url)` 转可点击链接 |
| 思考折叠 | AI 思考过程以淡紫色 details 块显示，思考中展开，完成后自动折叠 |
| 工具调用折叠 | 工具调用段以独立折叠块显示 |
| 代码块 | json 等代码块保留原始格式 |

### 功能点1：AI 助手配置列表

#### 页面级
- **字段：功能入口** - 类型：文本；描述：URL `?page=ai-assistant-config`
- **字段：前置条件** - 类型：文本；描述：已登录
- **字段：后置影响** - 字段列表；描述：localStorage 中 `ai-assistant-configs` key 增/改/删

#### 弹窗级
- **弹窗：新增/编辑 AI 助手配置**
  - **触发入口**：点击"新增配置"按钮 / 列表行"编辑"按钮
  - **关闭方式**：遮罩层点击 / 关闭图标 / 取消按钮
  - **字段列表**：

    | 字段名 | 类型 | 必填 | 默认值 | 来源 | 校验规则 | 展示形式 | 交互约束 |
    |--------|------|------|--------|------|----------|----------|----------|
    | name | 文本 | 是 | 空 | 用户输入 | 长度 1-50 | 输入框 | 可编辑 |
    | platform | 枚举 | 是 | "星辰平台" | 用户输入 | 枚举值：Dify / 星辰平台 / 其他 | 下拉选择 | 可编辑 |
    | url | 文本 | 是 | 空 | 用户输入 | 必须以 http:// 或 https:// 开头 | 输入框 | 可编辑 |
    | apiKey | 文本 | 是 | 空 | 用户输入 | 长度 ≥ 1 | 输入框（可切换密码可见） | 可编辑 |
    | user | 文本 | 否 | "lto-user" | 用户输入 | 长度 1-50 | 输入框 | 可编辑 |
    | testUrl | 文本 | 否 | 同 url + "/app-info" | 用户输入 | 必须以 http:// 或 https:// 开头 | 输入框 | 可编辑 |
    | isEnabled | 布尔 | 否 | true | 用户输入 | - | 开关 | 可编辑 |
    | isVisible | 布尔 | 否 | true | 用户输入 | - | 开关 | 可编辑 |

  - **确定按钮**：点击后写入 localStorage，关闭弹窗，刷新列表
  - **取消按钮**：点击后关闭弹窗，不修改数据

#### 页面级
- **字段：功能入口** - 类型：文本；描述：URL `?page=ai-assistant-config`
- **字段：前置条件** - 类型：文本；描述：已登录
- **字段：后置影响** - 字段列表；描述：localStorage 中 `ai-assistant-configs` key 增/改/删

#### 弹窗级
- **弹窗：新增/编辑 AI 助手配置**
  - **触发入口**：点击"新增配置"按钮 / 列表行"编辑"按钮
  - **关闭方式**：遮罩层点击 / 关闭图标 / 取消按钮
  - **字段列表**：

    | 字段名 | 类型 | 必填 | 默认值 | 来源 | 校验规则 | 展示形式 | 交互约束 |
    |--------|------|------|--------|------|----------|----------|----------|
    | name | 文本 | 是 | 空 | 用户输入 | 长度 1-50 | 输入框 | 可编辑 |
    | platform | 枚举 | 是 | "星辰平台" | 用户输入 | 枚举值：Dify / 星辰平台 / 其他 | 下拉选择 | 可编辑 |
    | url | 文本 | 是 | 空 | 用户输入 | 必须以 http:// 或 https:// 开头 | 输入框 | 可编辑 |
    | apiKey | 文本 | 是 | 空 | 用户输入 | 长度 ≥ 1 | 输入框（可切换密码可见） | 可编辑 |
    | user | 文本 | 否 | "lto-user" | 用户输入 | 长度 1-50 | 输入框 | 可编辑 |
    | testUrl | 文本 | 否 | 同 url + "/app-info" | 用户输入 | 必须以 http:// 或 https:// 开头 | 输入框 | 可编辑 |
    | isEnabled | 布尔 | 否 | true | 用户输入 | - | 开关 | 可编辑 |
    | isVisible | 布尔 | 否 | true | 用户输入 | - | 开关 | 可编辑 |

  - **确定按钮**：点击后写入 localStorage，关闭弹窗，刷新列表
  - **取消按钮**：点击后关闭弹窗，不修改数据

### 功能点2：AI 侧边栏自然语言交互

#### 页面级
- **字段：功能入口** - 类型：文本；描述：右侧 AI 侧边栏输入框
- **字段：前置条件** - 类型：文本；描述：已选 AI 助手（Dify 智能体已配置）
- **字段：后置影响** - 字段列表；描述：渲染 AI 回复（含思考折叠块 + 正文 + 工具调用穿插段 + json 代码块 + 链接）

#### 弹窗级
- **弹窗：自然语言触发目标弹窗**
  - **触发入口**：URL `?page=ai-assistant-config&openModal=ai-assistant&action=new` 自动打开
  - **关闭方式**：与原生弹窗一致（遮罩层点击 / 关闭图标 / 取消按钮）
  - **字段列表**：

    | 字段名 | 类型 | 必填 | 默认值 | 来源 | 校验规则 | 展示形式 | 交互约束 |
    |--------|------|------|--------|------|----------|----------|----------|
    | name | 文本 | 是 | 来自 formSlots pendingFormActions | AI 返回 | 长度 1-50 | 输入框 | 可编辑 |
    | platform | 枚举 | 是 | 来自 formSlots pendingFormActions | AI 返回 | 枚举值 | 下拉选择 | 可编辑 |
    | url | 文本 | 是 | 来自 formSlots pendingFormActions | AI 返回 | URL 格式 | 输入框 | 可编辑 |
    | apiKey | 文本 | 是 | 来自 formSlots pendingFormActions | AI 返回 | 长度 ≥ 1 | 输入框 | 可编辑 |

  - **确定按钮**：点击后调用 `POST /api/ai-assistant-config`，关闭弹窗刷新列表
  - **取消按钮**：点击后关闭弹窗

### 功能点3：AI 思考/正文/工具调用渲染

#### 页面级
- **字段：功能入口** - 类型：文本；描述：AI 侧边栏每条 assistant 消息
- **字段：前置条件** - 类型：文本；描述：Dify 流式事件返回 `agent_message.answer` 含 `` 标签或工具调用
- **字段：后置影响** - 字段列表；描述：渲染顺序 = 思考块（淡紫色） + 正文（按字符串位置） + 工具调用（按 contentLength 锚点穿插）

#### 渲染规则
- **思考块** - 类型：details + summary 折叠块
  - 页眉背景：bg-purple-50，边框 border-purple-200
  - 内容区：bg-purple-50/50
  - 默认展开，思考闭合（收到 ``）后自动折叠
  - 收到 ``（未闭合）立即显示
- **正文** - 类型：div，whitespace-pre-wrap，支持 markdown 表格、链接、加粗
- **工具调用** - 类型：ToolCallBlock 卡片，请求/响应分离，等宽字体
  - 位置由 difyApi 记录的工具调用发生时 m.content 长度决定（不堆底）

### 功能点4：AI 侧边栏消息卡片

#### 消息卡片结构
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
├── Thinking 块（可折叠，淡紫色）
└── 工具调用块（可折叠，按返回顺序穿插）
```

#### 操作按钮
- **复制** - `navigator.clipboard.writeText(message.content)`
- **刷新** - 重新调用 `sendDifyMessage`，仅助手消息可见
- **朗读** - `new SpeechSynthesisUtterance(text)`，lang='zh-CN'
- **停止朗读** - `window.speechSynthesis.cancel()`，使用 `speakingMessageId` 状态管理

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

#### 工具调用块字段（详细）

| 字段名 | 类型 | 必填 | 默认值 | 来源 | 校验规则 | 展示形式 | 交互约束 |
|--------|------|------|--------|------|----------|----------|----------|
| 工具调用块 | React 组件 | - | - | agent_thought 事件 | - | 卡片式容器 | 可折叠 |
| 请求参数 | JSON 对象 | - | - | tool_input 字段 | - | pre 标签，等宽字体 | 只读 |
| 响应结果 | JSON 对象 | - | - | observation 字段 | - | pre 标签，等宽字体 | 只读 |

#### 工具调用块样式规格
| 属性 | 说明 |
|------|------|
| 卡片容器 | rounded-lg border border-gray-200 overflow-hidden |
| 页眉背景 | bg-blue-500（真正的工具调用）/ bg-gray-100（思考过程） |
| 请求/响应区 | bg-gray-50, p-3, space-y-3 |
| 蓝色竖线 | w-1 h-4 bg-blue-500 rounded |
| 标签文字 | text-xs font-medium text-gray-600 |

#### 工具调用块业务逻辑
- `isRealToolCall=true` 条件：`observation` 以 `{` 开头且有 `toolName`
- 从 `tool_input` 字段提取请求信息（JSON 格式）
- 从 `observation` 字段提取响应信息（格式：`{"tool_name": "result"}`）
- 自动合并同 `toolName` 的工具调用（先收到请求，后续收到响应）
- **v3 重构**：工具调用段位置由 difyApi 记录的 `contentLength` 锚点决定，**按 m.content 出现位置穿插渲染**（不堆底）

#### 操作按钮业务逻辑
| 操作 | 实现方式 |
|------|----------|
| 复制 | `navigator.clipboard.writeText(message.content)` |
| 刷新 | 保存 `userQuery`，重新调用 `sendDifyMessage` |
| 朗读 | `new SpeechSynthesisUtterance(text)`，lang='zh-CN' |
| 停止朗读 | `window.speechSynthesis.cancel()`，设置 `speakingMessageId` 状态 |

### 功能点5：Markdown 表格渲染与图表

#### 表格渲染

| 字段名 | 类型 | 必填 | 默认值 | 来源 | 校验规则 | 展示形式 | 交互约束 |
|--------|------|------|--------|------|----------|----------|----------|
| 表格解析函数 | function | - | - | 本地解析 | - | - | - |
| HTML 表格 | ReactNode | - | - | 正则匹配 Markdown 表格 | - | 标准 table | - |

#### 表格样式规格
| 属性 | 说明 |
|------|------|
| 表头 | bg-gray-100, font-semibold, px-3 py-2 |
| 单元格 | border border-gray-300, px-3 py-2 |
| 交替行 | 偶数行 bg-gray-50 |
| 下载按钮 | 右上角，px-3 py-1.5，bg-blue-100 |

#### 表格解析逻辑
- 正则匹配 Markdown 表格语法：`\|.+\|[\r\n]+\|[-:\s|]+\|[\r\n]+((?:\|.+\|[\r\n]*)+)`
- 解析表头和数据行，过滤空单元格
- `processInlineFormatting` 函数处理行内格式化

#### 图表展示

| 字段名 | 类型 | 必填 | 默认值 | 来源 | 校验规则 | 展示形式 | 交互约束 |
|--------|------|------|--------|------|----------|----------|----------|
| 视图切换按钮组 | React 组件 | - | 'table' | useState | - | 按钮组 | 可切换 |
| 柱状图 | Recharts BarChart | - | - | recharts 库 | 数据 ≤ 30 条 | ResponsiveContainer | - |
| 饼图 | Recharts PieChart | - | - | recharts 库 | 数据 ≤ 8 条 | ResponsiveContainer | - |
| 折线图 | Recharts LineChart | - | - | recharts 库 | 数据 ≥ 2 条 | ResponsiveContainer | - |

#### 图表样式规格
| 属性 | 说明 |
|------|------|
| 按钮样式 | px-3 py-1 text-xs rounded-lg |
| 激活态 | bg-blue-500 text-white |
| 非激活态 | bg-gray-100 text-gray-600 hover:bg-gray-200 |
| 图表容器 | bg-gray-50 p-4 rounded-lg |
| 图表高度 | height=300 |
| 颜色配置 | #3b82f6, #10b981, #f59e0b, #ef4444, #8b5cf6, #ec4899 |

#### 图表切换逻辑
```
1. 识别数字列：检查前3行，超过50%是数字则识别为数字列
2. 转换图表数据：提取数字列数据，最多30条
3. 切换视图：table/bar/pie/line 四种视图
4. 柱状图：适合对比
5. 饼图：取第一列数值，展示占比（最多8条）
6. 折线图：适合趋势（至少2条数据）
```

### 功能点6：加粗文本标签

| 字段名 | 类型 | 必填 | 默认值 | 来源 | 校验规则 | 展示形式 | 交互约束 |
|--------|------|------|--------|------|----------|----------|----------|
| 加粗正则 | RegExp | - | - | /\*\*[^*]+\*\*/g | - | - | - |
| 标签样式 | ReactNode | - | - | processInlineFormatting | - | span 标签 | - |

#### 标签样式规格
```
px-1 py-0.5 mx-0.5 rounded bg-blue-100/70 text-blue-800 font-medium
```

### 功能点7：下载 CSV

| 字段名 | 类型 | 必填 | 默认值 | 来源 | 校验规则 | 展示形式 | 交互约束 |
|--------|------|------|--------|------|----------|----------|----------|
| 下载按钮 | button | - | - | UI | - | Download 图标 + 文字 | 可点击 |
| CSV 生成 | function | - | - | 本地处理 | - | Blob 下载 | - |

#### 业务逻辑
```
1. 构建 CSV 内容：表头 + 数据行，逗号分隔
2. 处理特殊字符：引号、逗号、转义处理
3. 添加 BOM：﻿ 前缀，支持中文
4. 创建 Blob 对象，触发下载
```

### 功能点8：对话历史

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

## 接口端点与 Dify 接入信息

### Dify 端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `{baseUrl}/chat-messages` | POST | 流式对话（SSE） |
| `{baseUrl}/conversations` | GET | 历史会话列表 |
| `{baseUrl}/messages?conversation_id=xxx` | GET | 单个会话的消息历史 |
| `{baseUrl}/app-info` | GET | 智能体连通性测试 |

### 智能体接入信息

| 智能体 | baseUrl | apiKey | 用途 |
|------|------|------|------|
| 本体查询 Agent | `http://localhost/v1` | `app-3V47CAfeck1BBKaTFKF8zp66` | 本体业务查询 |
| LTO 客服助手 | `http://localhost/v1` | `app-Qm3Nun7BNZfKqcKn0PRQVkY7` | **本期目标**：菜单 / 导航 / 填表 |
| 星辰客服助手 | `https://agent.teleai.com.cn/v1` | `app-FoKqiQQnCtWl0Tq3mmQG9vve` | 跨域调用 |

配置位置：[dify.ts](file:///Users/wjl/Desktop/项目/浙江lto/lto/LTO研发版本/src/app/config/dify.ts)

### Dify 端"变量"配置（17 个入参变量）

| 变量名 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `user_permissions` | 字符串 | 是 | 用户权限列表（字符串），本期固定 `*` |
| `active_form` | 字符串 | 是 | 当前激活的表单 formId，用于让 Dify 知道用户正打开哪个表单 |
| `all_form_ids` | 字符串 | 是 | 系统所有可填表单的 formId JSON 字符串数组 |
| `current_page` | 字符串 | 是 | 用户当前所在路由（用于"打开页面"类请求校验） |
| `slotKey` / `label` / `value` / `type` / `options` / `required` / `currentValue` / `formId` / `formTitle` / `slots` / `description` / `group` | 字符串 | 是 | Dify 端"输入表单"残留必填字段，前端固定传 `''`（根本解决：去 Dify 端清理） |

**为什么有这么多空变量？** 之前 Dify 端"输入表单"残留了一批必填变量，前端要**全部传空字符串绕过**，根本解决是去 Dify 应用配置清理输入表单。

## 表单配置文件

> 槽位元数据集中声明在 [formSlots.ts](file:///Users/wjl/Desktop/项目/浙江lto/lto/LTO研发版本/src/app/config/formSlots.ts)，新增表单只需在该文件加一条。

### 已注册表单

#### `AIAssistantConfig/new` — 新增 AI 助手配置

| slotKey | label | type | required | options | description |
|------|------|------|------|------|------|
| `name` | 名称 | string | 是 | - | AI 助手的展示名称，例如"本体查询助手" |
| `platform` | 平台 | enum | 是 | Dify / 星辰平台 / 星智平台 | - |
| `url` | API 地址 | string | 是 | - | 完整的 API 基础地址，以 /v1 结尾 |
| `apiKey` | API Key | string | 是 | - | 形如 app-xxx 的密钥 |

#### `AIAssistantConfig/edit` — 编辑 AI 助手配置

| slotKey | label | type | required | options |
|------|------|------|------|------|
| `name` | 名称 | string | 是 | - |
| `platform` | 平台 | enum | 否 | Dify / 星辰平台 / 星智平台 |

> 编辑模式必填项放宽：url / apiKey 保持原值。

### 命名规范

| 规则 | 示例 |
|------|------|
| `key` 格式 | `{ComponentName}/{action}`，如 `AIAssistantConfig/new` |
| `slotKey` 唯一性 | 在同一 formId 内唯一 |
| 联动 group | 同名字段在不同分组用 `group` 区分 |

### 添加新表单的步骤

1. 在 [formSlots.ts](file:///Users/wjl/Desktop/项目/浙江lto/lto/LTO研发版本/src/app/config/formSlots.ts) 加一条 `FORM_SLOTS[xxx] = [...]`
2. 在对应组件弹窗里调 `useFormSlots({ formId, formTitle, enabled, slots })`
3. 提示 Dify 端 prompt 同步更新（自动通过 `listAllFormIds()` 注入 `all_form_ids`）

## 完整数据流（用户对话 → agent → 系统处理 → 打开链接 + 填表）

### 时序图

```
[用户]          [LTO 前端]                [Dify 智能体]            [formSlotRegistry]
  |                |                          |                          |
  |--1.输入"打开AI助手配置，新增...名称test"-->|                          |
  |                |---2.POST /chat-messages-->|                          |
  |                |   query + inputs          |                          |
  |                |   (active_form, all_ids)  |                          |
  |                |                          |---3. LLM 推理             |
  |                |                          |    输出 Markdown 链接    |
  |                |                          |    + ```json``` 块      |
  |                |<--4. SSE 流式 (agent_message.answer 分片) ---        |
  |<--5. 打字机显示 AI 回复 (think 折叠 + 正文 + 链接) --|                |
  |                |---6. 解析 m.content                                        |
  |                |   6a. extractAndApplyFormActions 提取 json             |
  |                |       调 formSlotRegistry.apply(actions) --------------->|
  |                |       (此时若无激活表单 → 暂存 sessionStorage)         |
  |                |   6b. 扫描 [text](url) 自动派发点击                    |
  |                |       window.location.href = url                        |
  |                |                          |                          |
  |                |---7. 路由跳转 (前端单页) -->|                          |
  |                |   ?page=ai-assistant-config                            |
  |                |   &openModal=ai-assistant                              |
  |                |   &action=new                                            |
  |                |                                                          |
  |                |---8. ROUTE_TO_COMPONENT 找到 AIAssistantConfig 组件 -->|
  |                |   挂载时检查 URL openModal 参数                         |
  |                |   派发 'open-modal' CustomEvent                          |
  |                |                                                          |
  |                |---9. AIAssistantConfig 打开弹窗 ----------->           |
  |                |                                                          |
  |                |---10. useFormSlots 注册当前表单 (formId, slots) ------->|
  |                |   检测 sessionStorage 是否有 pendingFormActions         |
  |                |   有 → 自动 apply(actions) ----------------------------->|
  |                |                                                          |
  |<--11. 弹窗打开 + 4 字段已填入 -------------------------------------------|
  |                |                                                          |
  |--12. 用户检查后点"确定" -->|                                              |
  |                |   调 POST /api/ai-assistant-config                      |
  |                |   写入 localStorage                                       |
```

### 关键代码逻辑

#### 前端传参 ([AISidebar.tsx:996-1017](file:///Users/wjl/Desktop/项目/浙江lto/lto/LTO研发版本/src/app/components/AISidebar.tsx#L996))

```ts
sendDifyMessage({
  query: userMessage.content,
  conversationId: agentConfig.conversationId || undefined,
  apiKey: agentConfig.config.apiKey,
  baseUrl: agentConfig.config.baseUrl,
  platform: agentConfig.platform || '星辰平台',
  inputs: {
    user_permissions: '*',
    active_form: formSlotRegistry.getActive() || '',
    all_form_ids: JSON.stringify(listAllFormIds()),
    current_page: (window as any).__PRD_ROUTE__ || '',
    // 兜底：Dify 端残留必填字段全部传空字符串
    slotKey: '', label: '', value: '', type: '', options: '',
    required: '', currentValue: '', formId: '', formTitle: '',
    slots: '', description: '', group: '',
  },
  files: userMessage.files,
  onMessage: (chunk) => { /* m.content 覆盖 */ },
  onToolCall: (toolCall) => { /* toolcall 段入 segments */ },
  onComplete: () => { /* 提取链接派发 + json apply */ },
  onError: ...,
});
```

#### 提取 json actions ([AISidebar.tsx:71-118](file:///Users/wjl/Desktop/项目/浙江lto/lto/LTO研发版本/src/app/components/AISidebar.tsx#L71))

```ts
function extractAndApplyFormActions(aiReply: string) {
  const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/g;
  let lastResult, allActions = [];
  while ((match = jsonBlockRegex.exec(aiReply)) !== null) {
    const parsed = JSON.parse(match[1]);
    const actions = parsed?.actions || [];
    if (actions.length > 0) {
      allActions.push(...actions);
      lastResult = formSlotRegistry.apply(actions);
    }
  }
  // 兜底暂存：若 active_form 还未注册（弹窗未开），sessionStorage 兜底
  if (allActions.length > 0) {
    sessionStorage.setItem('__pendingFormActions', JSON.stringify({
      actions: allActions, timestamp: Date.now()
    }));
  }
}
```

#### 链接自动派发 ([AISidebar.tsx:1175-1218](file:///Users/wjl/Desktop/项目/浙江lto/lto/LTO研发版本/src/app/components/AISidebar.tsx#L1175))

```ts
// 扫描 [text](url)，命中 ?page=xxx 自动跳转
const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
while ((linkMatch = linkRegex.exec(content)) !== null) {
  const url = linkMatch[2];
  if (seenLinks.has(url)) continue;
  seenLinks.add(url);
  // 解析 ?page=xxx &openModal=yyy &action=zzz
  // window.location.href = url;
}
```

#### 路由解析 + 打开弹窗 ([App.tsx:70-118](file:///Users/wjl/Desktop/项目/浙江lto/lto/LTO研发版本/src/app/App.tsx#L70))

```ts
const ROUTE_TO_COMPONENT = {
  'ai-assistant-config': AIAssistantConfig,
  // ...
};

useEffect(() => {
  const page = searchParams.get('page');
  const openModal = searchParams.get('openModal');
  const action = searchParams.get('action');
  const Component = ROUTE_TO_COMPONENT[page];
  if (Component) setCurrentPage(Component);
  if (openModal) {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('open-modal', {
        detail: { modalId: openModal, action }
      }));
    }, 100);
  }
}, [searchParams]);
```

#### 弹窗打开时 apply pending actions ([useFormSlots.ts:97-108](file:///Users/wjl/Desktop/项目/浙江lto/lto/LTO研发版本/src/app/hooks/useFormSlots.ts#L97))

```ts
// 弹窗挂载时，检查 sessionStorage 兜底
const pending = sessionStorage.getItem('__pendingFormActions');
if (pending) {
  const parsed = JSON.parse(pending);
  if (Date.now() - (parsed.timestamp || 0) < 5 * 60 * 1000) {
    handler(parsed.actions);
  }
  sessionStorage.removeItem('__pendingFormActions');
}
```

### 关键边界场景

| 场景 | 处理 |
|------|------|
| AI 一次性返回"链接 + json"（用户没分两次说） | json 先 apply，sessionStorage 暂存；跳转后新弹窗挂载时再次 apply |
| 用户已激活表单 A，但 AI 返回 formId=B | formSlotRegistry.apply 拒绝（B 的 handler 未注册），failed 数组返回原因 |
| `?page=xxx` 但 ROUTE_TO_COMPONENT 没注册 | 链接被静默丢弃（防踩坑见 [[duplicate-route-map]]） |
| Dify 智能体 5xx | AI 侧边栏显示错误提示，已渲染内容保留 |
| Dify 工作室 UI 报错 | **不影响 chat-messages API**（curl 已验证 API 正常，工作室是另一个 Web 端点） |

## 相关文件清单

### 前端核心文件

| 文件 | 行数 | 作用 |
|------|------|------|
| [AISidebar.tsx](file:///Users/wjl/Desktop/项目/浙江lto/lto/LTO研发版本/src/app/components/AISidebar.tsx) | 1972 | AI 侧边栏：流式对话、思考/正文渲染、链接派发、json 提取 |
| [AIAssistantConfig.tsx](file:///Users/wjl/Desktop/项目/浙江lto/lto/LTO研发版本/src/app/components/AIAssistantConfig.tsx) | - | AI 助手配置页（被自然语言导航的目标页） |
| [App.tsx](file:///Users/wjl/Desktop/项目/浙江lto/lto/LTO研发版本/src/app/App.tsx) | 24073 | 路由表 ROUTE_TO_COMPONENT、URL 解析、open-modal 事件派发 |
| [formSlots.ts](file:///Users/wjl/Desktop/项目/浙江lto/lto/LTO研发版本/src/app/config/formSlots.ts) | - | 槽位元数据集中声明 |
| [formSlotRegistry.ts](file:///Users/wjl/Desktop/项目/浙江lto/lto/LTO研发版本/src/app/utils/formSlotRegistry.ts) | - | 全局单例，apply/active 管理 |
| [useFormSlots.ts](file:///Users/wjl/Desktop/项目/浙江lto/lto/LTO研发版本/src/app/hooks/useFormSlots.ts) | - | React Hook，注入 getter/setter |
| [difyApi.ts](file:///Users/wjl/Desktop/项目/浙江lto/lto/LTO研发版本/src/app/services/difyApi.ts) | 24183 | Dify SSE 客户端，事件分发 |
| [dify.ts](file:///Users/wjl/Desktop/项目/浙江lto/lto/LTO研发版本/src/app/config/dify.ts) | - | 三个 Dify 智能体 baseUrl/apiKey/user |
| [aiAssistant.ts](file:///Users/wjl/Desktop/项目/浙江lto/lto/LTO研发版本/src/app/config/aiAssistant.ts) | - | AI 助手配置 localStorage 读写 |

### 文档/配置

| 文件 | 作用 |
|------|------|
| [ai-form-filler-prompt.md](file:///Users/wjl/Desktop/项目/浙江lto/lto/LTO研发版本/docs/dify/ai-form-filler-prompt.md) | 完整 Dify System Prompt（可直接复制到 Dify） |
| [Dify提示词-直接复制.md](file:///Users/wjl/Desktop/项目/浙江lto/lto/Dify提示词-直接复制.md) | 另一个版本的 prompt |
| [Dify提示词-权限版.md](file:///Users/wjl/Desktop/项目/浙江lto/lto/Dify提示词-权限版.md) | 带权限校验的 prompt 草案（**未启用**） |
| [_ai-assistant-config.md](file:///Users/wjl/Desktop/项目/浙江lto/lto/.prd/_routes/_ai-assistant-config.md) | 本 PRD 文件 |

### 项目记忆

| 记忆 | 用途 |
|------|------|
| [[lto-customer-assistant-dify]] | LTO 客服助手 Dify 智能体的 baseUrl + apiKey |
| [[lto-ai-form-filler-phase1]] | 自然语言填表第一期范围（复用现有智能体、不做权限等） |
| [[duplicate-route-map]] | App.tsx 与 AISidebar.tsx 维护两套相同路由表，扩展时记得双改 |
| [[dify-stream-event-pitfall]] | Dify 流式事件踩坑：先抓真实 SSE 数据再下结论 |

### 测试/验证

- **Dify chat-messages 真实数据**：
  ```bash
  curl -s -N -X POST 'http://localhost/v1/chat-messages' \
    -H 'Authorization: Bearer app-Qm3Nun7BNZfKqcKn0PRQVkY7' \
    -H 'Content-Type: application/json' \
    -d '{"inputs":{...},"query":"打开ai助手配置页面...","response_mode":"streaming","user":"test-user"}'
  ```
- **浏览器验证路径**：`http://localhost:5174/?page=ai-assistant-config`（左下角 [PRD] 按钮加载本文档）
- **关键回归点**：
  - 思考块淡紫色 + 完成自动折叠
  - 工具调用按 contentLength 锚点穿插
  - 历史对话加载时正确显示思考模块
  - 内容不重复（onMessage 覆盖非追加）

## 数据流图

### 接口1：Dify chat-messages 流式接口
- **请求路径** - 类型：文本；示例：`POST {baseUrl}/chat-messages`
- **请求方法** - 类型：枚举（POST）；必填：是
- **请求头** - 字段列表；描述：`Authorization: Bearer {apiKey}` + `Content-Type: application/json`
- **请求参数** - 字段列表：
  - `query` - 类型：字符串；必填：是；来源：用户输入
  - `inputs.user_permissions` - 类型：字符串；必填：是；来源：常量 `*`（本期不做权限）
  - `inputs.active_form` - 类型：字符串；必填：是；来源：`formSlotRegistry.getActive()?.formId \|\| ''`
  - `inputs.all_form_ids` - 类型：字符串（JSON）；必填：是；来源：`JSON.stringify(listAllFormIds())`
  - `inputs.current_page` - 类型：字符串；必填：是；来源：`window.__PRD_ROUTE__`
  - `inputs.slotKey` / `label` / `value` / `type` / `options` / `required` / `currentValue` / `formId` / `formTitle` / `slots` / `description` / `group` - 全部传 `''`；**Dify 端"输入表单"残留必填字段，绕过用。根本解决：去 Dify 端清理**
  - `response_mode` - 类型：字符串；必填：是；来源：常量 `streaming`
  - `user` - 类型：字符串；必填：是；来源：AI 助手配置中的 user 字段
  - `conversation_id` - 类型：字符串；必填：否；来源：上一轮 conversationId
  - `files` - 类型：array；必填：否；来源：用户上传文件
- **响应字段** - 字段列表：
  - SSE 事件流，包含 `agent_thought` / `agent_message` / `tool_call` / `message_end` 等事件
  - `agent_message.answer` 含 `<think>...</think>` 标签分片（think 内容 + 正文）
  - `agent_thought.tool_input` 非空时为真实工具调用
- **存储位置** - 类型：文本；示例：Dify 服务端
- **错误码** - 字段列表：网络异常 / 401 未授权 / 500 服务器异常

#### 完整响应字段（按事件类型）
| 字段名 | 类型 | 说明 |
|---------|------|------|
| event | string | agent_thought / message / agent_message / message_end |
| thought | string | AI 思考内容（**本期 `agent_thought` 事件的 thought 字段实际是空字符串**，思考内容在 agent_message.answer 里分片） |
| tool | string | 工具名称 |
| tool_input | string | 工具输入参数（JSON 字符串） |
| observation | string | 工具输出结果 |
| answer | string | 最终回答（含 `<think>...</think>` 标签） |
| conversation_id | string | 对话ID |
| task_id | string | 任务ID（星辰平台） |

#### 会话存储位置
- **存储位置** - `React useState messages`（前端）
- **补充存储** - 填表 actions 通过 `sessionStorage.__pendingFormActions` 暂存，5 分钟内有效；弹窗打开时自动 apply（解决"一次性说打开+填值"场景）

### 接口2：通用 AI 对话平台参数差异

**兼容平台**：Dify、星辰平台、星智平台

#### 通用参数
| 参数名 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| query | string | 是 | 用户输入 | 查询内容 |
| conversation_id | string | 否 | 已有对话ID | 继续对话 |
| user | string | 是 | 配置/系统 | 用户标识 |
| files | array | 否 | 用户上传 | 上传的文件列表 |
| platform | string | 否 | 配置 | 平台类型：dify / 星辰平台 / 星智平台 |

#### Dify 平台特有
| 参数名 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| response_mode | string | 是 | 固定值 | streaming |
| inputs | object | 否 | 配置 | 变量输入 |
| file_ids | array | 否 | 文件上传 | 上传后的文件ID列表 |

#### 星辰/星智平台特有
| 参数名 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| mode | string | 是 | 固定值 | streaming |
| input_data | object | 否 | 配置 | 变量输入 |
| files | array | 否 | 用户上传 | 文件对象数组 |

#### 星辰平台 files 格式
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

### 接口3：文件上传
- **请求路径** - `POST /files/upload`
- **请求方法** - POST
- **请求头** - `Authorization: Bearer {apiKey}`
- **请求参数** - `file` (FormData), `user` (string)
- **响应字段** - id, name, size, extension, mime_type, created_by, created_at
- **存储位置** - Dify / 星辰平台文件存储服务

### 接口4：getConversations
- **请求路径** - `GET /conversations`
- **请求方法** - GET
- **请求头** - `Authorization: Bearer {apiKey}`
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 |
  |--------|------|------|------|
  | page | number | 是 | 固定 1 |
  | limit | number | 是 | 固定 20 |
  | user | string | 是 | 当前用户标识 |
- **响应字段**：
  | 字段名 | 类型 | 说明 |
  |---------|------|------|
  | data | array | 对话列表 |
  | data[].id | string | 对话ID |
  | data[].name | string | 对话名称 |
  | data[].created_at | number | 创建时间戳 |
- **存储位置** - React useState conversationList

### 接口5：getConversationMessages
- **请求路径** - `GET /messages`
- **请求方法** - GET
- **请求头** - `Authorization: Bearer {apiKey}`
- **请求参数**：
  | 参数名 | 类型 | 必填 | 来源 |
  |--------|------|------|------|
  | conversation_id | string | 是 | 选中的对话ID |
  | limit | number | 是 | 固定 20 |
  | user | string | 是 | 当前用户标识 |
- **响应字段**：
  | 字段名 | 类型 | 说明 |
  |---------|------|------|
  | data | array | 消息列表 |
  | data[].id | string | 消息ID |
  | data[].query | string | 用户问题 |
  | data[].answer | string | AI 回答 |
  | data[].created_at | number | 创建时间戳 |
- **存储位置** - React useState messages

### SSE 事件类型
| 事件 | 字段 | 说明 |
|------|------|------|
| `agent_thought` | `thought` / `observation` / `tool` / `tool_input` | **本期 `thought` 字段是空字符串**（占位事件），不参与前端处理 |
| `agent_message` | `answer` | **think 内容和正文都在这里分片发送**，answer 含 `<think>...</think>` 标签 |
| `message_replace` | `answer` | 消息替换（用于重新生成） |
| `message_end` | `conversation_id` / `usage` | 对话结束 |
| `error` | `message` | 错误 |
| `tool_call` | - | 工具调用元数据 |
| `tool_call_begin` | - | 工具调用开始 |

### 数据刷新点
- **刷新时机** - 类型：枚举（流式推送 / 操作成功后）；描述：SSE 实时推送每帧 `m.content` 覆盖
- **影响字段** - 字段列表：思考块（淡紫色） + 正文 + 工具调用段（按 contentLength 锚点穿插）

### 相关文件
| 文件 | 作用 |
|------|------|
| [AISidebar.tsx](file:///Users/wjl/Desktop/项目/浙江lto/lto/LTO研发版本/src/app/components/AISidebar.tsx) | AI 侧边栏：流式对话、思考/正文渲染、链接派发、json 提取 |
| [AIAssistantConfig.tsx](file:///Users/wjl/Desktop/项目/浙江lto/lto/LTO研发版本/src/app/components/AIAssistantConfig.tsx) | AI 助手配置页（含 useFormSlots 注册 + 自然语言填表弹窗） |
| [App.tsx](file:///Users/wjl/Desktop/项目/浙江lto/lto/LTO研发版本/src/app/App.tsx) | 路由表 ROUTE_TO_COMPONENT、URL 解析、open-modal 事件派发、__PRD_ROUTE__ 同步 |
| [formSlots.ts](file:///Users/wjl/Desktop/项目/浙江lto/lto/LTO研发版本/src/app/config/formSlots.ts) | 槽位元数据集中声明 |
| [formSlotRegistry.ts](file:///Users/wjl/Desktop/项目/浙江lto/lto/LTO研发版本/src/app/utils/formSlotRegistry.ts) | 全局单例，apply / active 管理 |
| [useFormSlots.ts](file:///Users/wjl/Desktop/项目/浙江lto/lto/LTO研发版本/src/app/hooks/useFormSlots.ts) | React Hook，注入 getter / setter + sessionStorage 兜底 |
| [difyApi.ts](file:///Users/wjl/Desktop/项目/浙江lto/lto/LTO研发版本/src/app/services/difyApi.ts) | Dify SSE 客户端，事件分发、think 标签保留 |
| [dify.ts](file:///Users/wjl/Desktop/项目/浙江lto/lto/LTO研发版本/src/app/config/dify.ts) | 三个 Dify 智能体 baseUrl / apiKey / user |
| [aiAssistant.ts](file:///Users/wjl/Desktop/项目/浙江lto/lto/LTO研发版本/src/app/config/aiAssistant.ts) | AI 助手配置 localStorage 读写 |
| [ai-form-filler-prompt.md](file:///Users/wjl/Desktop/项目/浙江lto/lto/LTO研发版本/docs/dify/ai-form-filler-prompt.md) | 完整 Dify System Prompt（可直接复制到 Dify） |

## 验收标准

### 正常流程（AI 助手配置）
- [ ] 在 AI 助手配置页点击"新增配置" → 弹窗打开，4 个必填字段为空
- [ ] 填写 name=test、platform=Dify、url=http://localhost/v1、apiKey=123 后点击确定 → localStorage 写入新配置，列表新增一条
- [ ] 在 AI 侧边栏输入"打开 ai 助手配置页面" → AI 返回 Markdown 链接，点击后跳转到 AI 助手配置页
- [ ] 在 AI 侧边栏输入"打开 AI 助手配置页面，新增 AI 助手配置，名称 test，平台 dify，api 是 http://localhost/v1 key 是 123" → AI 返回链接 + json 代码块，点击链接后弹窗打开，4 字段已自动填入
- [ ] 发 prompt 触发 AI 思考 → 思考过程以淡紫色折叠块显示，思考中实时展开，完成后自动折叠
- [ ] 发 prompt 触发"思考→工具→思考→正文"交叉输出 → 各段按出现顺序穿插渲染（不堆底）

### 正常流程（AI 对话界面）
- [x] AI 发送消息包含 thinking → Thinking 块显示，默认收起
- [x] 点击 Thinking 块展开 → 显示完整思考内容，箭头变为收起状态
- [x] AI 调用工具 → 工具调用块显示，包含请求/响应
- [x] 展开工具调用块 → 显示格式化的 JSON 内容
- [x] AI 回复包含 Markdown 表格 → 渲染为 HTML 表格样式
- [x] 点击柱状图/饼图/折线图按钮 → 切换到对应图表视图
- [x] 点击下载 CSV 按钮 → 浏览器下载 CSV 文件
- [x] 点击复制按钮 → 消息内容复制到剪贴板
- [x] 点击刷新按钮 → 使用相同问题重新生成回答
- [x] 点击朗读按钮 → 浏览器语音朗读消息内容
- [x] 点击对话历史 → 收起历史列表，加载并显示历史消息
- [x] AI 回复包含**加粗** → 渲染为带背景的标签样式

### 异常流程
- [ ] 未填写必填字段直接保存 → 必填字段标红，提交按钮置灰
- [ ] Dify 接口 401 → AI 侧边栏显示"未授权"提示
- [ ] Dify 接口 500 → AI 侧边栏显示"服务异常"提示，已渲染内容保留
- [ ] 网络断开 → AI 侧边栏显示"网络异常"提示，loading 状态结束
- [ ] URL 预置的 openModal 在 ROUTE_TO_COMPONENT 中找不到 → 链接被静默丢弃
- [ ] AI 回复无 thinking/toolCall → 仅显示文本内容
- [ ] 工具调用请求过长 → 横向滚动条出现
- [ ] 折线图数据少于 2 条 → 显示提示"折线图需要至少 2 条数据"
- [ ] 表格无数字列 → 不显示图表切换按钮

## 更新记录

### v8 - 2026-06-13
- 将原 `_ai-sidebar.md` PRD 内容合并到对应章节（去除附录结构）
- AI 侧边栏在前端是抽屉组件无独立路由，统一在 `ai-assistant-config` 维护
- 章节对齐 v3 重构后的实现（按位置混排、淡紫色、思考完成折叠）

### v7 - 2026-05-27（原 _ai-sidebar）
- **修复思考模块重复显示**：agent_thought 和 agent_message 事件都发送 think 标签内容导致重复，通过 `thoughtProcessedThinkTag` 标记避免重复处理
- **修复思考块顺序**：统一将思考块插入到 text segment 之前，确保显示在正文之前
- **新增朗读停止功能**：点击朗读按钮可切换播放/停止状态，播放中显示停止图标

### v6 - 2026-05-26（原 _ai-sidebar）
- **新增星辰平台对接**：支持星辰平台和星智平台的 API 调用
- **新增平台类型参数**：根据配置的平台类型自动选择合适的请求格式
- **星辰平台文件上传**：使用 `files` 数组格式 `[{type: "image", transfer_method: "local_file", upload_file_id: "xxx"}]`
- **星辰平台请求参数**：`mode: "streaming"` 替换 `response_mode`，`input_data` 替换 `inputs`
- **新增 uploadFileToXingchen 函数**：专门处理星辰平台的文件上传

### v5 - 2026-05-25（原 _ai-sidebar）
- 对话历史功能完善：支持展开加载历史列表、点击加载历史消息、收起历史列表
- 修复 created_at 时间戳格式兼容问题
- 修复历史消息缺少 thoughts/files 字段导致报错

### v4 - 2026-05-25（原 _ai-sidebar）
- **新增图表展示功能**：表格支持柱状图、饼图、折线图切换
- **新增下载 CSV**：表格右上角下载按钮，支持导出数据
- **新增消息操作**：复制、刷新重新生成、朗读按钮
- **新增加粗标签**：`**xxx**` 渲染为带蓝色半透明背景的标签样式
- **新增下载链接样式**：识别下载链接，渲染为蓝色按钮 + 下载图标

### v3 - 2026-05-25（原 _ai-sidebar）
- 修复流式输出重复内容问题（改为直接替换而非累积）
- 修复 Thinking 块不显示问题（只要有 thought 或 observation 就显示）
- 修复重复内容过滤逻辑
- Thinking 块使用 Brain 图标替换 Square
- Thinking/工具调用块放在回复内容之前
- Markdown 表格正常渲染为 HTML 表格
- 新增 Markdown 标题（#、##、###、####）样式渲染

### v2 - 2026-05-25（原 _ai-sidebar）
- 修复 agent_thought 事件解析：tool_input 提取请求，observation 提取响应
- 修复 isRealToolCall 判断逻辑
- 自动合并同 toolName 的工具调用

### v1 - 2026-05-25（原 _ai-sidebar）
- 初始版本
- 实现 Thinking 块展示（蓝色页眉 + 可折叠 + Brain 图标 + 默认收起）
- 实现工具调用块展示（卡片式 + 请求响应分离 + 等宽字体 + 默认收起）
- 实现 Markdown 表格解析渲染

### v3 - 2026-06-12（本 PRD）
- 新增自然语言"填表"功能（formSlots 注册 + AI 返回 json 自动 apply）
- AI 思考/正文/工具调用按出现顺序混排渲染（buildInlineBlocks）
- 思考块淡紫色样式 + 完成自动折叠
- 工具调用段按 m.content 长度锚点穿插
- 未闭合 `` 立即显示思考块
- 历史对话加载时正确显示思考模块
- 修 bug：内容指数级重复（onMessage 覆盖而非追加）
- 修 bug：正文丢失（renderMessageContent 走 m.content 路径）
- 写项目记忆 [[dify-stream-event-pitfall]]：先抓真实 SSE 数据再下结论
- 写项目记忆 [[prd-sync-paths]]：PRD 同步 4 位置 + Playwright 验

### v2 - 2026-05-15
- 完善 AI 助手配置列表/弹窗/启用禁用
- 接入 Dify 智能体（菜单查询 + 打开页面 + 打开弹窗）

### v1 - 2026-04-20
- 初始版本：AI 助手配置 localStorage 存储 + AI 侧边栏基础流式对话
