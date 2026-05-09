#!/usr/bin/env node
/**
 * PRD 一键启动脚本
 * 适用所有前端框架、所有 Agent、所有项目、所有操作系统
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const http = require('http');

const isWin = os.platform() === 'win32';

function findSkillsDir() {
  if (process.env.PRD_SKILLS_DIR && fs.existsSync(process.env.PRD_SKILLS_DIR)) {
    return path.resolve(process.env.PRD_SKILLS_DIR);
  }
  let dir = __dirname;
  for (let i = 0; i < 8; i++) {
    if (fs.existsSync(path.join(dir, 'prd.html'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  const home = path.join(os.homedir(), '.claude', 'skills', 'prd');
  return fs.existsSync(home) ? home : __dirname;
}

function findProjectRoot() {
  let dir = process.cwd();
  for (let i = 0; i < 10; i++) {
    if (
      fs.existsSync(path.join(dir, 'package.json')) ||
      fs.existsSync(path.join(dir, 'vite.config.ts')) ||
      fs.existsSync(path.join(dir, 'vite.config.js')) ||
      fs.existsSync(path.join(dir, 'webpack.config.js')) ||
      fs.existsSync(path.join(dir, 'index.html')) ||
      fs.existsSync(path.join(dir, 'src', 'index.jsx')) ||
      fs.existsSync(path.join(dir, 'src', 'App', 'index.html'))
    ) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return process.cwd();
}

function findHtmlEntry(projectRoot) {
  const candidates = [
    'index.html',
    'public/index.html',
    'src/index.html',
    'app/index.html',
    'src/App/index.html',
    'pages/index.html',
    'dist/index.html',
    'build/index.html',
  ];
  for (const f of candidates) {
    const fp = path.join(projectRoot, f);
    if (fs.existsSync(fp)) {
      try {
        const content = fs.readFileSync(fp, 'utf-8');
        if (content.includes('<body')) return fp;
      } catch {}
    }
  }
  try {
    const files = fs.readdirSync(projectRoot).filter(f => f.endsWith('.html'));
    for (const f of files) {
      const fp = path.join(projectRoot, f);
      try {
        const content = fs.readFileSync(fp, 'utf-8');
        if (content.includes('<body')) return fp;
      } catch {}
    }
  } catch {}
  return null;
}

function guessDevPort(projectRoot) {
  const cfgFiles = ['vite.config.ts', 'vite.config.js', 'vue.config.js', 'webpack.config.js'];
  for (const cfg of cfgFiles) {
    const fp = path.join(projectRoot, cfg);
    if (fs.existsSync(fp)) {
      try {
        const content = fs.readFileSync(fp, 'utf-8');
        const m = content.match(/port:\s*(\d+)/);
        if (m) return parseInt(m[1], 10);
      } catch {}
    }
  }
  if (fs.existsSync(path.join(projectRoot, 'vite.config.ts'))) return 5173;
  if (fs.existsSync(path.join(projectRoot, 'package.json'))) {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf-8'));
      const dev = pkg.scripts?.dev || '';
      const m = dev.match(/--port[=:\s](\d+)/);
      if (m) return parseInt(m[1], 10);
    } catch {}
  }
  return 5173;
}

// ── 读取 vite.config 中的 base 路径（支持 GitHub Pages 子路径）────────────────
function guessBasePath(projectRoot) {
  // 优先从 vite.config.ts 读取 base
  const viteCfg = path.join(projectRoot, 'vite.config.ts');
  if (fs.existsSync(viteCfg)) {
    try {
      const content = fs.readFileSync(viteCfg, 'utf-8');
      // 匹配 base: '/xxx/' 或 base: '/xxx'
      const m = content.match(/base:\s*['"`]([^'"`]+)['"`]/);
      if (m) {
        let base = m[1];
        // 确保以 / 开头和结尾
        if (!base.startsWith('/')) base = '/' + base;
        if (!base.endsWith('/')) base += '/';
        console.log(`[PRD] 🌐 检测到 base 路径: ${base}（来自 vite.config.ts）`);
        return base;
      }
    } catch {}
  }
  // 其次从 vite.config.js 读取
  const viteCfgJs = path.join(projectRoot, 'vite.config.js');
  if (fs.existsSync(viteCfgJs)) {
    try {
      const content = fs.readFileSync(viteCfgJs, 'utf-8');
      const m = content.match(/base:\s*['"`]([^'"`]+)['"`]/);
      if (m) {
        let base = m[1];
        if (!base.startsWith('/')) base = '/' + base;
        if (!base.endsWith('/')) base += '/';
        console.log(`[PRD] 🌐 检测到 base 路径: ${base}（来自 vite.config.js）`);
        return base;
      }
    } catch {}
  }
  // 再次从 package.json homepage 字段读取
  const pkgPath = path.join(projectRoot, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      if (pkg.homepage) {
        // 从 https://github.com/user/repo/blob/main 提取 /repo/
        const m = pkg.homepage.match(/github\.io\/([^/]+)/);
        if (m) {
          const base = '/' + m[1] + '/';
          console.log(`[PRD] 🌐 检测到 base 路径: ${base}（来自 package.json homepage）`);
          return base;
        }
      }
    } catch {}
  }
  console.log('[PRD] 🌐 未检测到 base 路径，使用默认 /（适用于根路径部署）');
  return '/';
}

async function findFreePort(start) {
  return new Promise(resolve => {
    const s = http.createServer();
    s.listen(start, () => { s.close(() => resolve(start)); });
    s.on('error', () => resolve(findFreePort(start + 1)));
  });
}

function injectToHtml(htmlFile, prdInjectUrl, scriptTag) {
  if (!htmlFile || !fs.existsSync(htmlFile)) return false;

  // 方案1：直接写入原文件（优先）
  try {
    let content = fs.readFileSync(htmlFile, 'utf-8');
    content = content.replace(/<script[^>]*>window\.__PRD_PORT__[^<]*<\/script>\n?/g, '');
    content = content.replace(/<script[^>]*src="[^"]*prd-inject\.js"[^>]*><\/script>\n?/g, '');
    content = content.replace(/<!--\s*PRD\s*-->\n?/g, '');
    content = content.replace('</body>', `${scriptTag}\n</body>`);
    fs.writeFileSync(htmlFile, content);
    return { ok: true, method: 'direct', file: htmlFile };
  } catch (e) {
    console.log(`[PRD] ⚠️  直接写入失败: ${e.message}`);
  }

  // 方案2：复制一份带注入的副本到 public/
  const projectRoot = path.dirname(htmlFile);
  const publicDir = path.join(projectRoot, 'public');
  const altHtml = path.join(publicDir, '__prd_entry__.html');
  try {
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
    let content = fs.readFileSync(htmlFile, 'utf-8');
    content = content.replace(/<script[^>]*>window\.__PRD_PORT__[^<]*<\/script>\n?/g, '');
    content = content.replace(/<script[^>]*src="[^"]*prd-inject\.js"[^>]*><\/script>\n?/g, '');
    content = content.replace(/<!--\s*PRD\s*-->\n?/g, '');
    content = content.replace('</body>', `${scriptTag}\n</body>`);
    fs.writeFileSync(altHtml, content);
    console.log(`[PRD] 💡 已创建副本: public/__prd_entry__.html（可通过 http://localhost:PORT/__prd_entry__ 访问）`);
    return { ok: true, method: 'copy', file: altHtml, original: htmlFile };
  } catch (e2) {
    console.log(`[PRD] ⚠️  副本方案也失败: ${e2.message}`);
  }

  // 方案3：复制 prd-inject.js 到 public/，手动注入提示
  const srcInject = path.join(findSkillsDir(), 'prd-inject.js');
  const destInject = path.join(publicDir, 'prd-inject.js');
  try {
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
    fs.copyFileSync(srcInject, destInject);
    console.log(`[PRD] ✅ prd-inject.js → public/prd-inject.js`);
  } catch {}

  return { ok: false, reason: '无法注入，请手动添加', hint: `在 ${path.basename(htmlFile)} 末尾 </body> 前添加：<script src="${prdInjectUrl}"></script>` };
}

async function main() {
  const skillsDir = findSkillsDir();
  const PROJECT_ROOT = findProjectRoot();

  // 默认端口从 3004 开始（避免 3001 冲突）
  const DEFAULT_PRD_PORT = parseInt(process.env.PRD_PORT) || 3004;
  const PRD_PORT = await findFreePort(DEFAULT_PRD_PORT);
  const DEV_PORT = guessDevPort(PROJECT_ROOT);

  // 解析 dev 命令（跳过 -- 开头的选项参数）
  const rawArgv = process.argv.slice(2).filter(a => !a.startsWith('--') && !a.startsWith('-'));
  const devCmd = rawArgv.length > 0 ? rawArgv.join(' ') : 'npm run dev';

  console.log('[PRD] 🚀 PRD 一键启动');
  console.log(`[PRD] 📁 Skills: ${skillsDir}`);
  console.log(`[PRD] 📁 项目: ${PROJECT_ROOT}`);
  console.log(`[PRD] 🔧 启动: ${devCmd}`);
  console.log(`[PRD] 🔌 PRD 服务端口: ${PRD_PORT}`);

  // 自动检测 base 路径（支持 GitHub Pages 子路径部署）
  const BASE_PATH = guessBasePath(PROJECT_ROOT);

  // 1. 清理旧版 prd-inject.js 并复制新版
  const srcInject = path.join(skillsDir, 'prd-inject.js');
  const destInjectDir = path.join(PROJECT_ROOT, 'public');
  const destInject = path.join(destInjectDir, 'prd-inject.js');
  if (fs.existsSync(srcInject)) {
    if (!fs.existsSync(destInjectDir)) fs.mkdirSync(destInjectDir, { recursive: true });
    // 删除旧版（防止缓存问题）
    if (fs.existsSync(destInject)) fs.unlinkSync(destInject);
    fs.copyFileSync(srcInject, destInject);
    console.log('[PRD] ✅ prd-inject.js → public/prd-inject.js（已更新）');
  } else {
    console.log('[PRD] ⚠️  未找到 prd-inject.js，跳过');
  }

  // 2. 创建 public/prd/_routes/ 目录
  const prdRoutes = path.join(PROJECT_ROOT, 'public', 'prd', '_routes');
  if (!fs.existsSync(prdRoutes)) fs.mkdirSync(prdRoutes, { recursive: true });

  // 3. 注入到 HTML 入口（支持多级回退）
  const htmlEntry = findHtmlEntry(PROJECT_ROOT);
  if (htmlEntry) {
    // 注入脚本：同时设置 PRD_PORT（开发用）和 PRD_BASE（静态部署用）
    const scriptTag =
      `<script>window.__PRD_PORT__=${PRD_PORT};window.__PRD_BASE__='${BASE_PATH}';</script>\n` +
      `<script src="${BASE_PATH}prd-data.js"></script>\n` +
      `<script src="${BASE_PATH}prd-inject.js"></script>`;
    const result = injectToHtml(htmlEntry, `${BASE_PATH}prd-inject.js`, scriptTag);
    if (result?.ok) {
      console.log(`[PRD] ✅ 已注入 (${result.method}): ${path.relative(PROJECT_ROOT, result.file)}`);
      if (result.original) console.log(`[PRD] 💡 原始文件: ${path.relative(PROJECT_ROOT, result.original)}`);
    } else {
      console.log(`[PRD] ⚠️  ${result?.reason || '注入失败'}`);
      console.log(`[PRD] 💡 手动在 HTML 末尾 </body> 前加入:`);
      console.log(`    ${scriptTag}`);
    }
  } else {
    console.log('[PRD] ⚠️  未找到 HTML 入口，PRD 按钮将不自动注入');
    console.log('[PRD] 💡 手动在 HTML 末尾 </body> 前加入:');
    console.log(`    <script>window.__PRD_PORT__=${PRD_PORT};window.__PRD_BASE__='${BASE_PATH}';</script>`);
    console.log(`    <script src="${BASE_PATH}prd-data.js"></script>`);
    console.log(`    <script src="${BASE_PATH}prd-inject.js"></script>`);
  }

  // 4. 构建 PRD 数据文件（支持 GitHub Pages）
  const buildPrdScript = path.join(skillsDir, 'build-prd.js');
  if (fs.existsSync(buildPrdScript)) {
    try {
      // 动态执行 build-prd.js
      const buildFn = require(buildPrdScript);
      // 重新调用主要构建逻辑
      const projectRoot = PROJECT_ROOT;
      const inputDir = '.prd/_routes';
      const outputFile = path.join(projectRoot, 'public', 'prd-data.js');

      const prdRoutesDir = path.join(projectRoot, inputDir);
      if (fs.existsSync(prdRoutesDir)) {
        const files = fs.readdirSync(prdRoutesDir).filter(f => f.endsWith('.md'));
        if (files.length > 0) {
          const data = {};
          for (const file of files) {
            let name = path.basename(file, '.md');
            if (name.startsWith('_')) name = name.slice(1);
            data[name] = fs.readFileSync(path.join(prdRoutesDir, file), 'utf-8');
          }
          data._version = '1.0';
          data._built = new Date().toISOString();
          data._count = files.length;
          const output = `// PRD Data - Built at ${new Date().toISOString()}\nwindow.__PRD_DATA__ = ${JSON.stringify(data, null, 2)};\n`;
          const outputDir = path.dirname(outputFile);
          if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
          fs.writeFileSync(outputFile, output, 'utf-8');
          console.log(`[PRD] ✅ 已构建 ${files.length} 个路由到 public/prd-data.js（GitHub Pages 兼容）`);
        }
      }
    } catch (e) {
      console.log(`[PRD] ⚠️  构建 PRD 数据失败: ${e.message}`);
    }
  }
  // 5. 启动 PRD daemon
  const daemonFile = path.join(skillsDir, 'prd-daemon.js');
  const daemonEnv = { ...process.env, PRD_PORT: String(PRD_PORT), PROJECT_ROOT };
  const daemon = spawn('node', [daemonFile], {
    cwd: PROJECT_ROOT,
    detached: !isWin,
    stdio: 'ignore',
    shell: isWin,
    env: daemonEnv,
  });
  daemon.unref();
  console.log(`[PRD] ⏳ PRD 服务启动中 (端口 ${PRD_PORT})...`);

  // 等待 daemon 启动
  await new Promise(r => setTimeout(r, 1500));

  // 6. 启动 dev server
  if (devCmd) {
    const shell = isWin ? true : false;
    const dev = spawn(devCmd, [], {
      cwd: PROJECT_ROOT,
      detached: !isWin,
      stdio: 'ignore',
      shell,
      env: { ...process.env, PRD_PORT: String(PRD_PORT) },
    });
    dev.unref();
    console.log('[PRD] ⏳ dev server 启动中...');
  }

  await new Promise(r => setTimeout(r, 2000));

  console.log('[PRD] ✅ 全部完成！');
  console.log(`[PRD] 📋 打开: http://localhost:${DEV_PORT}${BASE_PATH}`);
  console.log('[PRD] 📋 页面左下角有 [PRD] 按钮，点击自动加载当前页面文档');
  if (BASE_PATH !== '/') {
    console.log(`[PRD] 💡 已检测到 base 路径 ${BASE_PATH}，GitHub Pages 部署后同样生效`);
  }
  console.log('[PRD] 💡 关闭: killall node (Mac/Linux) 或 taskkill /F /IM node.exe (Windows)');
}

main().catch(e => {
  console.error('[PRD] ❌ 启动失败:', e.message);
  process.exit(1);
});
