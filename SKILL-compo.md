---
name: component-lib
description: Component library management skill - scans UI components, generates preview page, allows editing styles/variants. Use when user wants to view/modify system UI components.
---

# Component Library Skill

组件库管理工具 - 扫描系统UI组件，生成预览页面，支持编辑样式和变体。

## /component-lib 一键启动

当用户输入 `/component-lib` 时，执行以下命令：

```bash
node ~/.claude/skills/component-lib/start-component-lib.js npm run dev
```

自动完成：
1. 扫描 `src/app/components/ui/` 目录
2. 解析 CSS 变量和组件变体配置
3. 启动组件库后端服务（端口 5001）
4. 注入悬浮按钮到页面左下角
5. 启动项目 dev server

完成后告知用户：打开项目页面，左下角有 [组件库] 按钮。

---

## 功能说明

### 1. 组件扫描
- 扫描 `src/app/components/ui/*.tsx` 文件
- 解析 CVA（class-variance-authority）变体配置
- 读取 CSS 变量（tokens.css / default_theme.css）

### 2. 组件展示
- 每个组件展示所有 variant 和 size
- 例如 Button 组件展示：default/warning/success/cyan/secondary 等
- 按组件类型分组展示

### 3. 参数编辑
点击组件弹出侧边栏，显示：
- variant 列表及对应的样式类
- size 列表及对应的样式类
- CSS 变量（颜色、圆角等）

### 4. 引用追踪
- 显示每个组件/变体被哪些页面使用
- 显示具体的使用位置（文件和行号）

### 5. 组件替换
- 选择目标 variant，批量替换所有引用
- 原系统页面直接变更

---

## 数据流

```
src/app/components/ui/*.tsx  ──┐
                              ├──> component-lib-daemon.js ──> public/component-lib/_data/
src/styles/*.css            ──┘

HTML 注入 ──> component-lib-inject.js ──> localhost:5001 API
```

---

## API 接口

### GET /api/components
返回所有组件的完整配置

### GET /api/components/:name
返回指定组件的详细配置（包含变体、尺寸、样式）

### GET /api/components/:name/references
返回组件被引用的页面列表

### POST /api/components/:name/variant
更新组件变体样式
```json
{ "variant": "default", "styles": "bg-primary text-primary-foreground" }
```

### POST /api/components/:name/replace
替换所有页面中的组件引用
```json
{ "from": "default", "to": "warning" }
```