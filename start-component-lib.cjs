#!/usr/bin/env node
/**
 * Component Library Start Script
 * 一键启动组件库工具
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = process.cwd();

// 查找项目根目录
function findProjectRoot(startPath) {
  let current = startPath;

  // 向上查找 package.json
  while (current !== path.dirname(current)) {
    if (fs.existsSync(path.join(current, 'package.json'))) {
      return current;
    }
    current = path.dirname(current);
  }

  return startPath;
}

// 查找 HTML 入口
function findHTMLEntry(root) {
  const candidates = [
    'index.html',
    'dist/index.html',
    'build/index.html',
    'public/index.html'
  ];

  for (const candidate of candidates) {
    const fullPath = path.join(root, candidate);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      if (content.includes('<body')) {
        return fullPath;
      }
    }
  }

  return null;
}

// 注入脚本到 HTML
function injectScript(htmlPath) {
  const content = fs.readFileSync(htmlPath, 'utf-8');
  const injectTag = '<script src="/component-lib/inject.js"></script>';

  if (content.includes(injectTag)) {
    console.log('[Component-Lib] Script already injected');
    return;
  }

  // 插入到 </body> 前
  const modified = content.replace('</body>', `${injectTag}\n</body>`);
  fs.writeFileSync(htmlPath, modified, 'utf-8');
  console.log('[Component-Lib] Script injected to:', htmlPath);
}

// 检查端口是否可用
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const net = require('net');
    const server = net.createServer();

    server.once('error', () => {
      resolve(false);
    });

    server.once('listening', () => {
      server.close();
      resolve(true);
    });

    server.listen(port, '127.0.0.1');
  });
}

// 主函数
async function main() {
  console.log('[Component-Lib] Starting...');

  const projectRoot = findProjectRoot(PROJECT_ROOT);
  console.log('[Component-Lib] Project root:', projectRoot);

  // 找到 HTML 入口
  const htmlPath = findHTMLEntry(projectRoot);
  if (!htmlPath) {
    console.error('[Component-Lib] Cannot find HTML entry');
    process.exit(1);
  }
  console.log('[Component-Lib] HTML entry:', htmlPath);

  // 检查端口
  const port = 5001;
  if (!await isPortAvailable(port)) {
    console.log('[Component-Lib] Port', port, 'is in use, daemon may already be running');
  } else {
    // 启动 daemon
    console.log('[Component-Lib] Starting daemon on port', port, '...');
    const daemonPath = path.join(projectRoot, 'component-lib-daemon.js');

    if (!fs.existsSync(daemonPath)) {
      console.error('[Component-Lib] Daemon not found:', daemonPath);
      process.exit(1);
    }

    const daemon = spawn('node', [daemonPath], {
      cwd: projectRoot,
      stdio: 'inherit'
    });

    daemon.on('error', (err) => {
      console.error('[Component-Lib] Daemon error:', err);
    });
  }

  // 注入脚本
  injectScript(htmlPath);

  // 创建 inject.js
  const createInject = path.join(projectRoot, 'create-inject.js');
  if (fs.existsSync(createInject)) {
    spawn('node', [createInject], {
      cwd: projectRoot,
      stdio: 'inherit'
    });
  }

  // 启动 dev server
  const args = process.argv.slice(2);
  if (args.length > 0) {
    console.log('[Component-Lib] Starting dev server:', args.join(' '));
    const dev = spawn(args[0], args.slice(1), {
      cwd: projectRoot,
      stdio: 'inherit'
    });

    dev.on('error', (err) => {
      console.error('[Component-Lib] Dev server error:', err);
    });
  }

  console.log('\n[Component-Lib] Done! Open http://localhost:5174 (or your dev port)');
  console.log('[Component-Lib] Click the [组件库] button at bottom-left to open panel');
}

// 运行
main().catch(console.error);