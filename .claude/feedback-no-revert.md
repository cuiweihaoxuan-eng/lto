---
name: feedback-no-revert
description: 不要回退代码，改错了就继续改
metadata:
  type: feedback
---

## 规则：不要回退代码

**Why:** 之前多次使用 `git checkout HEAD` 回退代码，导致之前已完成的修改丢失，用户很不满意。

**How to apply:**
- 改错了就继续改，不要回退代码
- 使用 `Edit` 工具精准修改错误的字符串
- 如果不确定，先读取文件确认当前内容再修改
- 每次修改后立即构建验证，不要批量改很多