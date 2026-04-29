# LTO 研发版本

## 本地开发

- 启动命令：`npm run dev`
- 固定端口：**5174**（5173 端口已被其他项目占用）

如果 5174 也被占用，可以修改 `package.json` 中的 dev 脚本或使用：
```bash
npm run dev -- --port <可用端口>
```

## 项目说明

- 基于 Vite + React + TypeScript
- UI 组件库：Radix UI + Tailwind CSS
- 图表库：recharts
- 状态管理：React hooks
