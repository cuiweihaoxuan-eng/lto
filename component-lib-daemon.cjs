#!/usr/bin/env node
/**
 * Component Library Daemon - 组件库后端服务
 * 端口: 5001
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// 项目路径
const PROJECT_ROOT = process.cwd();
const UI_COMPONENTS_DIR = path.join(PROJECT_ROOT, 'src/app/components/ui');
const STYLES_DIR = path.join(PROJECT_ROOT, 'src/styles');
const DATA_DIR = path.join(PROJECT_ROOT, 'public/component-lib/_data');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 转换颜色值为 #rrggbb 格式
function convertToHex(color) {
  if (!color) return color;
  if (color.startsWith('#')) return color.toLowerCase();
  if (color === 'white') return '#ffffff';
  if (color === 'black') return '#000000';
  // rgb 转 #rrggbb
  const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (match) {
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    return '#' + r + g + b;
  }
  return color;
}

// 解析CSS变量
function parseCSSVariables(content) {
  const variables = {};
  const regex = /--([a-zA-Z0-9-]+)\s*:\s*([^;]+);/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    variables[match[1]] = match[2].trim();
  }
  return variables;
}

// 解析CVA变体
function parseCVAVariants(content) {
  const variants = {};

  // 找到 cva( 开始位置
  const cvaIndex = content.indexOf('cva(');
  if (cvaIndex === -1) return variants;

  // 找到 cva() 的结束位置（匹配括号）
  let parenCount = 0;
  let cvaStart = cvaIndex + 3; // 跳过 'cva'
  let cvaEnd = 0;

  for (let i = cvaStart; i < content.length; i++) {
    if (content[i] === '(') parenCount++;
    else if (content[i] === ')') {
      parenCount--;
      if (parenCount === 0) {
        cvaEnd = i + 1;
        break;
      }
    }
  }

  const cvaContent = content.substring(cvaIndex, cvaEnd);

  // 找到 variants: { 开始位置
  const variantsStart = cvaContent.indexOf('variants:');
  if (variantsStart === -1) return variants;

  // 从 variants: { 往后找匹配的 }
  let braceCount = 0;
  let variantsEnd = variantsStart;

  for (let i = variantsStart + 8; i < cvaContent.length; i++) {
    const char = cvaContent[i];
    if (char === '{') braceCount++;
    else if (char === '}') {
      braceCount--;
      if (braceCount === 0) {
        variantsEnd = i + 1;
        break;
      }
    }
  }

  const variantsContent = cvaContent.substring(variantsStart, variantsEnd);

  // 解析每个类型 (variant/size)
  // 匹配 "typeName: {" 到对应的 "}"
  const typeRegex = /(\w+):\s*\{/g;
  let lastIndex = 0;
  let typeMatch;

  while ((typeMatch = typeRegex.exec(variantsContent)) !== null) {
    const typeName = typeMatch[1];
    const typeStart = typeMatch.index + typeMatch[0].length;
    let braceCount = 1;
    let typeEnd = typeStart;

    for (let i = typeStart; i < variantsContent.length; i++) {
      if (variantsContent[i] === '{') braceCount++;
      else if (variantsContent[i] === '}') {
        braceCount--;
        if (braceCount === 0) {
          typeEnd = i;
          break;
        }
      }
    }

    const typeContent = variantsContent.substring(typeStart, typeEnd);
    variants[typeName] = [];

    // 匹配每个值: "name": "class" 或 'name': 'xxx'
    const valueRegex = /(\w+):\s*(?:"([^"]*)"|'([^']*)')/g;
    let valueMatch;
    while ((valueMatch = valueRegex.exec(typeContent)) !== null) {
      variants[typeName].push({
        name: valueMatch[1],
        className: valueMatch[2] || valueMatch[3]
      });
    }
  }

  return variants;
}

// 扫描组件
function scanComponents() {
  const components = [];

  if (!fs.existsSync(UI_COMPONENTS_DIR)) {
    return components;
  }

  const files = fs.readdirSync(UI_COMPONENTS_DIR).filter(f => f.endsWith('.tsx'));

  // 组件类型映射
  const typeMap = {
    'button': 'button',
    'Button': 'button',
    'badge': 'badge',
    'Badge': 'badge',
    'alert': 'alert',
    'Alert': 'alert',
    'alert-dialog': 'dialog',
    'AlertDialog': 'dialog',
    'input': 'input',
    'Input': 'input',
    'textarea': 'textarea',
    'Textarea': 'textarea',
    'select': 'select',
    'Select': 'select',
    'dialog': 'dialog',
    'Dialog': 'dialog',
    'drawer': 'drawer',
    'Drawer': 'drawer',
    'card': 'card',
    'Card': 'card',
    'checkbox': 'checkbox',
    'Checkbox': 'checkbox',
    'switch': 'switch',
    'Switch': 'switch',
    'radio-group': 'radio',
    'RadioGroup': 'radio',
    'table': 'table',
    'Table': 'table',
    'data-table': 'table',
    'DataTable': 'table',
    'form': 'form',
    'Form': 'form',
    'dropdown-menu': 'dropdown',
    'DropdownMenu': 'dropdown',
    'calendar': 'datepicker',
    'Calendar': 'datepicker',
    'date-picker': 'datepicker',
    'DatePicker': 'datepicker',
    'pagination': 'pagination',
    'Pagination': 'pagination',
    'tabs': 'tabs',
    'Tabs': 'tabs',
    'tab-nav': 'tabs',
    'TabNav': 'tabs',
    'breadcrumb': 'breadcrumb',
    'Breadcrumb': 'breadcrumb',
    'avatar': 'avatar',
    'Avatar': 'avatar',
    'progress': 'progress',
    'Progress': 'progress',
    'slider': 'slider',
    'Slider': 'slider',
    'tooltip': 'tooltip',
    'Tooltip': 'tooltip',
    'accordion': 'accordion',
    'Accordion': 'accordion',
    'collapsible': 'accordion',
    'menubar': 'menu',
    'Menubar': 'menu',
    'navigation-menu': 'menu',
    'NavigationMenu': 'menu',
    'context-menu': 'menu',
    'ContextMenu': 'menu',
    'search-panel': 'search',
    'SearchPanel': 'search',
    'label': 'label',
    'Label': 'label',
    'separator': 'separator',
    'Separator': 'separator',
    'skeleton': 'skeleton',
    'Skeleton': 'skeleton',
    'chart': 'chart',
    'Chart': 'chart',
    'carousel': 'carousel',
    'Carousel': 'carousel',
    'hover-card': 'card',
    'HoverCard': 'card',
    'popover': 'popover',
    'Popover': 'popover',
    'command': 'command',
    'Command': 'command',
    'resizable': 'resizable',
    'Resizable': 'resizable',
    'scroll-area': 'scrollarea',
    'ScrollArea': 'scrollarea',
    'aspect-ratio': 'aspect',
    'AspectRatio': 'aspect',
    'input-otp': 'otp',
    'InputOTP': 'otp',
    'sonner': 'toast',
    'Sonner': 'toast',
    'status-badge': 'statusbadge',
    'StatusBadge': 'statusbadge',
    'column-visibility-modal': 'table',
    'ColumnVisibilityModal': 'table'
  };

  // 中文名称映射
  const nameMap = {
    'button': '按钮',
    'Button': '按钮',
    'badge': '徽章',
    'Badge': '徽章',
    'alert': '警告提示',
    'Alert': '警告提示',
    'alert-dialog': '警告弹窗',
    'AlertDialog': '警告弹窗',
    'input': '输入框',
    'Input': '输入框',
    'textarea': '文本域',
    'Textarea': '文本域',
    'select': '选择器',
    'Select': '选择器',
    'dialog': '对话框',
    'Dialog': '对话框',
    'drawer': '抽屉',
    'Drawer': '抽屉',
    'card': '卡片',
    'Card': '卡片',
    'checkbox': '复选框',
    'Checkbox': '复选框',
    'switch': '开关',
    'Switch': '开关',
    'radio-group': '单选组',
    'RadioGroup': '单选组',
    'table': '表格',
    'Table': '表格',
    'data-table': '数据表格',
    'DataTable': '数据表格',
    'form': '表单',
    'Form': '表单',
    'dropdown-menu': '下拉菜单',
    'DropdownMenu': '下拉菜单',
    'calendar': '日历',
    'Calendar': '日历',
    'date-picker': '日期选择器',
    'DatePicker': '日期选择器',
    'pagination': '分页',
    'Pagination': '分页',
    'tabs': '标签页',
    'Tabs': '标签页',
    'tab-nav': '标签导航',
    'TabNav': '标签导航',
    'breadcrumb': '面包屑',
    'Breadcrumb': '面包屑',
    'avatar': '头像',
    'Avatar': '头像',
    'progress': '进度条',
    'Progress': '进度条',
    'slider': '滑块',
    'Slider': '滑块',
    'tooltip': '文字提示',
    'Tooltip': '文字提示',
    'accordion': '折叠面板',
    'Accordion': '折叠面板',
    'collapsible': '可折叠',
    'menubar': '菜单栏',
    'Menubar': '菜单栏',
    'navigation-menu': '导航菜单',
    'NavigationMenu': '导航菜单',
    'context-menu': '上下文菜单',
    'ContextMenu': '上下文菜单',
    'search-panel': '搜索面板',
    'SearchPanel': '搜索面板',
    'label': '标签',
    'Label': '标签',
    'separator': '分隔线',
    'Separator': '分隔线',
    'skeleton': '骨架屏',
    'Skeleton': '骨架屏',
    'chart': '图表',
    'Chart': '图表',
    'carousel': '轮播',
    'Carousel': '轮播',
    'hover-card': '悬停卡片',
    'HoverCard': '悬停卡片',
    'popover': '弹出框',
    'Popover': '弹出框',
    'command': '命令菜单',
    'Command': '命令菜单',
    'resizable': '可调整大小',
    'Resizable': '可调整大小',
    'scroll-area': '滚动区域',
    'ScrollArea': '滚动区域',
    'aspect-ratio': '宽高比',
    'AspectRatio': '宽高比',
    'input-otp': '一次性密码',
    'InputOTP': '一次性密码',
    'sonner': '轻提示',
    'Sonner': '轻提示',
    'status-badge': '状态徽章',
    'StatusBadge': '状态徽章',
    'column-visibility-modal': '列可见性',
    'ColumnVisibilityModal': '列可见性'
  };

  for (const file of files) {
    const filePath = path.join(UI_COMPONENTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    const componentName = path.basename(file, '.tsx');

    // 检查是否有 cva 变体
    const hasCVA = content.includes('cva(') || content.includes('cva,');
    const variants = hasCVA ? parseCVAVariants(content) : {};

    // 提取导出的组件名
    const exportMatch = content.match(/export\s+(?:function|const)\s+(\w+)/);
    const exportName = exportMatch ? exportMatch[1] : componentName;

    // 确定组件类型和中文名
    const type = typeMap[componentName] || 'unknown';
    const labelCN = nameMap[componentName] || componentName;

    // 默认变体（如果没有 CVA）
    if (Object.keys(variants).length === 0) {
      variants.variant = [
        { name: 'default', className: '' }
      ];
    }

    components.push({
      name: componentName,
      exportName,
      label: labelCN,
      file,
      filePath,
      type,
      variants,
      rawContent: content
    });
  }

  return components;
}

// 扫描CSS文件
function scanCSSFiles() {
  const cssData = {};

  if (fs.existsSync(path.join(STYLES_DIR, 'default_theme.css'))) {
    const content = fs.readFileSync(path.join(STYLES_DIR, 'default_theme.css'), 'utf-8');
    cssData.default_theme = {
      variables: parseCSSVariables(content)
    };
  }

  if (fs.existsSync(path.join(STYLES_DIR, 'tokens.css'))) {
    const content = fs.readFileSync(path.join(STYLES_DIR, 'tokens.css'), 'utf-8');
    cssData.tokens = {
      variables: parseCSSVariables(content)
    };
  }

  return cssData;
}

// 查找组件引用
function findReferences(componentName, variant = null) {
  const references = [];
  const srcDir = path.join(PROJECT_ROOT, 'src');

  function scanDir(dir) {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // 跳过 node_modules 和 .next 等
        if (!['node_modules', '.next', 'dist'].includes(entry.name)) {
          scanDir(fullPath);
        }
      } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
        const content = fs.readFileSync(fullPath, 'utf-8');

        // 匹配 import from '...ui/xxx'
        const importRegex = new RegExp(`from ['"].*ui/${componentName}['"]`, 'g');
        const lines = content.split('\n');

        lines.forEach((line, index) => {
          if (importRegex.test(line)) {
            // 找到引用该组件的文件，收集所有包含 variant 的使用
            const usageMatches = [];
            // 匹配所有 variant 使用和组件本身使用
            const usageRegex = /variant=["']([^"']+)["']|<[A-Z]\w+/g;

            for (let i = 0; i < lines.length; i++) {
              const usageLine = lines[i];
              let match;
              while ((match = usageRegex.exec(usageLine)) !== null) {
                // 收集 variant 值
                if (match[1]) {
                  usageMatches.push({
                    line: i + 1,
                    content: usageLine.trim()
                  });
                }
              }
              // 也收集没有 variant 的组件标签使用
              if (usageLine.includes('<') && usageLine.includes(componentName)) {
                usageMatches.push({
                  line: i + 1,
                  content: usageLine.trim()
                });
              }
            }

            references.push({
              file: path.relative(PROJECT_ROOT, fullPath),
              filePath: fullPath,
              importedLine: index + 1,
              usages: usageMatches
            });
          }
        });
      }
    }
  }

  scanDir(srcDir);
  return references;
}

// 更新组件文件
function updateComponentFile(componentName, variant, newStyles) {
  const filePath = path.join(UI_COMPONENTS_DIR, `${componentName}.tsx`);
  if (!fs.existsSync(filePath)) {
    return { success: false, error: 'Component not found' };
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  // 替换指定 variant 的样式
  const variantRegex = new RegExp(`(${variant}):\\s*"[^"]*"`, 'g');
  content = content.replace(variantRegex, `$1: "${newStyles}"`);

  fs.writeFileSync(filePath, content, 'utf-8');

  return { success: true };
}

// 替换组件引用
function replaceReferences(componentName, fromVariant, toVariant) {
  const results = [];
  const srcDir = path.join(PROJECT_ROOT, 'src');

  function scanDir(dir) {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (!['node_modules', '.next', 'dist'].includes(entry.name)) {
          scanDir(fullPath);
        }
      } else if (entry.name.endsWith('.tsx')) {
        let content = fs.readFileSync(fullPath, 'utf-8');
        const originalContent = content;

        // 替换 variant
        const regex = new RegExp(`variant=["']${fromVariant}["']`, 'g');
        content = content.replace(regex, `variant="${toVariant}"`);

        if (content !== originalContent) {
          fs.writeFileSync(fullPath, content, 'utf-8');
          results.push({
            file: path.relative(PROJECT_ROOT, fullPath),
            replacedCount: (originalContent.match(new RegExp(`variant=["']${fromVariant}["']`, 'g')) || []).length
          });
        }
      }
    }
  }

  scanDir(srcDir);
  return results;
}

// 刷新数据
function refreshData() {
  const components = scanComponents();
  const cssData = scanCSSFiles();

  const data = {
    components,
    cssData,
    generatedAt: new Date().toISOString()
  };

  fs.writeFileSync(
    path.join(DATA_DIR, 'components.json'),
    JSON.stringify(data, null, 2),
    'utf-8'
  );

  return data;
}

// HTTP 服务器
const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:5001`);
  const pathname = url.pathname;

  // 设置 JSON 响应头
  res.setHeader('Content-Type', 'application/json');

  try {
    // GET /api/refresh - 刷新数据
    if (pathname === '/api/refresh' && req.method === 'GET') {
      const data = refreshData();
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, data }));
      return;
    }

    // GET /api/components - 获取所有组件
    if (pathname === '/api/components' && req.method === 'GET') {
      const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'components.json'), 'utf-8'));
      res.writeHead(200);
      res.end(JSON.stringify(data));
      return;
    }

    // GET /api/components/:name - 获取单个组件
    const componentMatch = pathname.match(/^\/api\/components\/([^\/]+)$/);
    if (componentMatch && req.method === 'GET') {
      const name = componentMatch[1];
      const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'components.json'), 'utf-8'));
      const component = data.components.find(c => c.name === name);

      if (!component) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Component not found' }));
        return;
      }

      // 获取引用
      const references = findReferences(name);
      res.writeHead(200);
      res.end(JSON.stringify({ ...component, references }));
      return;
    }

    // GET /api/components/:name/references - 获取引用
    const refsMatch = pathname.match(/^\/api\/components\/([^\/]+)\/references$/);
    if (refsMatch && req.method === 'GET') {
      const name = refsMatch[1];
      const references = findReferences(name);
      res.writeHead(200);
      res.end(JSON.stringify(references));
      return;
    }

    // POST /api/components/:name/variant - 更新变体
    const variantMatch = pathname.match(/^\/api\/components\/([^\/]+)\/variant$/);
    if (variantMatch && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        const { variant, styles } = JSON.parse(body);
        const name = variantMatch[1];
        const result = updateComponentFile(name, variant, styles);

        if (result.success) {
          refreshData();
        }

        res.writeHead(result.success ? 200 : 400);
        res.end(JSON.stringify(result));
      });
      return;
    }

    // POST /api/components/:name/replace - 替换引用
    const replaceMatch = pathname.match(/^\/api\/components\/([^\/]+)\/replace$/);
    if (replaceMatch && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        const { from, to } = JSON.parse(body);
        const name = replaceMatch[1];
        const results = replaceReferences(name, from, to);

        res.writeHead(200);
        res.end(JSON.stringify({ success: true, results }));
      });
      return;
    }

    // POST /api/styles/save - 保存样式
    if (pathname === '/api/styles/save' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const styleData = JSON.parse(body);
          const { component, variant, styles } = styleData;

          // 直接修改 default_theme.css 文件
          const themeFile = path.join(STYLES_DIR, 'default_theme.css');
          if (!fs.existsSync(themeFile)) {
            res.writeHead(400);
            res.end(JSON.stringify({ success: false, error: '主题文件不存在' }));
            return;
          }

          let content = fs.readFileSync(themeFile, 'utf-8');

          // 根据样式更新 CSS 变量
          if (styles.backgroundColor) {
            // 转换颜色格式（如 rgb(255,255,255) -> #ffffff）
            const bgColor = convertToHex(styles.backgroundColor);
            // 替换 --primary 的值
            content = content.replace(/--primary:\s*[^;]+;/, '--primary: ' + bgColor + ';');
          }
          if (styles.color) {
            const fgColor = convertToHex(styles.color);
            content = content.replace(/--primary-foreground:\s*[^;]+;/, '--primary-foreground: ' + fgColor + ';');
          }
          if (styles.borderColor) {
            const borderColor = convertToHex(styles.borderColor);
            content = content.replace(/--border:\s*[^;]+;/, '--border: ' + borderColor + ';');
          }
          if (styles.fontSize) {
            const fontSize = styles.fontSize.replace(/px$/, '') + 'px';
            content = content.replace(/--font-size:\s*[^;]+;/, '--font-size: ' + fontSize + ';');
          }

          // 写回文件
          fs.writeFileSync(themeFile, content, 'utf-8');

          // 同时保存到 styles 目录作为备份
          const stylesDir = path.join(DATA_DIR, 'styles');
          if (!fs.existsSync(stylesDir)) {
            fs.mkdirSync(stylesDir, { recursive: true });
          }
          const styleFile = path.join(stylesDir, `${component}.${variant}.json`);
          fs.writeFileSync(styleFile, JSON.stringify(styleData, null, 2), 'utf-8');

          res.writeHead(200);
          res.end(JSON.stringify({ success: true, message: '样式已保存到 ' + themeFile }));
        } catch (err) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: err.message }));
        }
      });
      return;
    }

    // 默认: 404
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));

  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: error.message }));
  }
});

// 启动
const PORT = 5001;

server.listen(PORT, () => {
  console.log(`[Component-Lib] Daemon started on port ${PORT}`);

  // 初始扫描
  const data = refreshData();
  console.log(`[Component-Lib] Scanned ${data.components.length} components`);
});