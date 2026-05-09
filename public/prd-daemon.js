#!/usr/bin/env node
/**
 * PRD 守护进程 - 独立启动 PRD 后端服务
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PRD_PORT) || 3004;
const PROJECT_ROOT = process.env.PROJECT_ROOT || process.cwd();
const SKILLS_DIR = path.join(__dirname); // 与 skills/prd 目录同级的 prd-daemon.js

// 读取 prd-inject.js 的版本号
function getScriptVersion() {
  try {
    const content = fs.readFileSync(path.join(SKILLS_DIR, 'prd-inject.js'), 'utf-8');
    const m = content.match(/SCRIPT_VERSION\s*=\s*['"]([^'"]+)['"]/);
    return m ? m[1] : '1.0.0';
  } catch {
    return '1.0.0';
  }
}

const ROUTES_DIR = path.join(PROJECT_ROOT, '.prd', '_routes');
const VERSIONS_DIR = path.join(PROJECT_ROOT, '.prd', '_versions');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public', 'prd', '_routes');

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

function parseBody(req) {
  return new Promise((res, rej) => {
    let b = '';
    req.on('data', c => b += c);
    req.on('end', () => {
      try { res(JSON.parse(b)); }
      catch { rej(new Error()); }
    });
    req.on('error', rej);
  });
}

function json(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  let pathname = '/';
  try {
    const u = new URL(req.url, `http://localhost:${PORT}`);
    pathname = u.pathname;
  } catch {}

  try {
    // 版本检查接口
    if (pathname === '/api/prd/version' && req.method === 'GET') {
      return json(res, 200, { version: getScriptVersion() });
    }

    // 获取最新脚本接口
    if (pathname === '/api/prd/script' && req.method === 'GET') {
      const scriptPath = path.join(SKILLS_DIR, 'prd-inject.js');
      if (fs.existsSync(scriptPath)) {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(fs.readFileSync(scriptPath, 'utf-8'));
      } else {
        res.writeHead(404);
        res.end('Not found');
      }
      return;
    }

    if (pathname === '/api/prd/read' && req.method === 'GET') {
      const route = new URL(req.url, `http://localhost:${PORT}`).searchParams.get('route') || '';
      // 优先从 public 目录读取（静态模式下文件会在这里）
      let fp = path.join(PUBLIC_DIR, `_${route}.md`);
      // 如果找不到，fallback 到 _routes 目录
      if (!fs.existsSync(fp)) {
        fp = path.join(ROUTES_DIR, `_${route}.md`);
      }
      // 如果还是找不到，fallback 到 public 的 index
      if (!fs.existsSync(fp)) {
        fp = path.join(PUBLIC_DIR, '_index.md');
      }
      // 最后 fallback 到 _routes 的 index
      if (!fs.existsSync(fp)) {
        fp = path.join(ROUTES_DIR, '_index.md');
      }
      if (!fs.existsSync(fp)) return json(res, 404, { error: 'Not found' });
      return json(res, 200, { content: fs.readFileSync(fp, 'utf-8') });
    }

    if (pathname === '/api/prd/save' && req.method === 'POST') {
      const body = await parseBody(req);
      const { route, content } = body || {};
      if (!route || !content) return json(res, 400, { error: 'Missing route or content' });
      ensureDir(ROUTES_DIR);
      const fp = path.join(ROUTES_DIR, `_${route}.md`);
      const today = new Date().toISOString().split('T')[0];
      const vd = path.join(VERSIONS_DIR, `_${route}`);
      ensureDir(vd);

      if (fs.existsSync(fp)) {
        const cur = fs.readFileSync(fp, 'utf-8');
        // 今日首次保存才备份（用文件 mtime 判断是否同一天）
        const mtime = new Date(fs.statSync(fp).mtime);
        const mtimeDay = mtime.toISOString().split('T')[0];
        if (mtimeDay !== today) {
          fs.writeFileSync(path.join(vd, `_${route}_${mtimeDay}.md`), cur);
        }
      } else {
        // 首次保存，创建版本备份
        fs.writeFileSync(path.join(vd, `_${route}_${today}.md`), content);
      }
      // 直接写入新内容，不处理版本号（版本号由前端内容决定）
      fs.writeFileSync(fp, content);
      // 同步到 public 备份
      ensureDir(PUBLIC_DIR);
      fs.copyFileSync(fp, path.join(PUBLIC_DIR, `_${route}.md`));
      return json(res, 200, { success: true, route });
    }

    if (pathname === '/api/prd/list' && req.method === 'GET') {
      ensureDir(ROUTES_DIR);
      const files = fs.readdirSync(ROUTES_DIR).filter(f => f.endsWith('.md'));
      return json(res, 200, { routes: files.map(f => f.replace(/^_/, '').replace('.md', '')) });
    }

    // GET /api/prd/versions?route=xxx → 返回版本历史列表
    if (pathname === '/api/prd/versions' && req.method === 'GET') {
      const route = new URL(req.url, `http://localhost:${PORT}`).searchParams.get('route') || '';
      const vd = path.join(VERSIONS_DIR, `_${route}`);
      if (!fs.existsSync(vd)) return json(res, 200, { versions: [] });
      const files = fs.readdirSync(vd).filter(f => f.endsWith('.md')).sort().reverse();
      return json(res, 200, {
        versions: files.map(f => ({
          filename: f,
          version: f.replace(`_${route}_`, '').replace('.md', ''),
          date: fs.statSync(path.join(vd, f)).mtime.toISOString().split('T')[0],
        })),
      });
    }

    // GET /api/prd/version?route=xxx&version=N → 读取指定版本内容（用于复活）
    if (pathname === '/api/prd/version' && req.method === 'GET') {
      const u = new URL(req.url, `http://localhost:${PORT}`);
      const route = u.searchParams.get('route') || '';
      const version = u.searchParams.get('version') || '1';
      const vd = path.join(VERSIONS_DIR, `_${route}`);
      const fp = path.join(vd, `_${route}_v${version}.md`);
      if (!fs.existsSync(fp)) return json(res, 404, { error: 'Version not found' });
      return json(res, 200, { content: fs.readFileSync(fp, 'utf-8'), route, version });
    }

    // GET /api/prd/recover?route=xxx → 从备份复活（优先级：public > _versions > git）
    if (pathname === '/api/prd/recover' && req.method === 'GET') {
      const route = new URL(req.url, `http://localhost:${PORT}`).searchParams.get('route') || '';
      const fp = path.join(ROUTES_DIR, `_${route}.md`);
      const pubFp = path.join(PUBLIC_DIR, `_${route}.md`);
      const vd = path.join(VERSIONS_DIR, `_${route}`);
      let recovered = null;
      let source = '';

      // 优先级1: public 备份
      if (fs.existsSync(pubFp)) {
        recovered = fs.readFileSync(pubFp, 'utf-8');
        source = 'public backup';
      } else if (fs.existsSync(vd)) {
        // 优先级2: _versions 最新版
        const files = fs.readdirSync(vd).filter(f => f.endsWith('.md')).sort();
        if (files.length > 0) {
          recovered = fs.readFileSync(path.join(vd, files[files.length - 1]), 'utf-8');
          source = 'versions history';
        }
      }
      // 优先级3: git（由前端自行调用 git 命令）
      // 优先级4: 前端提示用户确认重新生成

      if (recovered !== null) {
        ensureDir(ROUTES_DIR);
        fs.writeFileSync(fp, recovered);
        return json(res, 200, { success: true, source, content: recovered });
      }
      return json(res, 404, { error: 'No backup found', route });
    }

    json(res, 404, { error: 'Not found' });
  } catch (e) {
    json(res, 500, { error: 'Server error' });
  }
});

server.listen(PORT, () => {
  console.log(`[PRD] 🚀 PRD 服务已启动: http://localhost:${PORT}`);
  console.log(`[PRD] 📁 项目: ${PROJECT_ROOT}`);
});

process.on('SIGTERM', () => { server.close(); process.exit(0); });
process.on('SIGINT', () => { server.close(); process.exit(0); });
