import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import http from 'http'
import os from 'os'
import { spawn } from 'child_process'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

// PRD 插件（使用独立 prd-daemon.js）
function prdPlugin() {
  const PRD_PORT = 3001
  const SKILLS_DIR = path.join(os.homedir(), '.claude', 'skills', 'prd')

  let daemonProcess = null

  return {
    name: 'vite-plugin-prd',
    async configureServer(vite) {
      const projectRoot = vite.config.root || process.cwd()

      // 复制 prd.html
      const srcHtml = path.join(SKILLS_DIR, 'prd.html')
      const destHtml = path.join(projectRoot, 'public', 'prd.html')
      if (fs.existsSync(srcHtml) && !fs.existsSync(destHtml)) {
        fs.copyFileSync(srcHtml, destHtml)
        console.log('[PRD] ✅ prd.html → public/prd.html')
      }

      // 创建目录
      const pd = path.join(projectRoot, 'public', 'prd', '_routes')
      if (!fs.existsSync(pd)) fs.mkdirSync(pd, { recursive: true })

      // 启动独立 prd-daemon.js
      const daemonFile = path.join(SKILLS_DIR, 'prd-daemon.js')
      if (fs.existsSync(daemonFile)) {
        daemonProcess = spawn('node', [daemonFile], {
          cwd: projectRoot,
          detached: true,
          stdio: 'ignore',
          env: { ...process.env, PRD_PORT: String(PRD_PORT), PROJECT_ROOT: projectRoot },
        })
        daemonProcess.unref()
        console.log(`[PRD] 🚀 PRD 服务启动中 (端口 ${PRD_PORT})...`)
      }

      // 等待 daemon 启动
      await new Promise(r => setTimeout(r, 1500))

      // 代理 PRD API
      vite.middlewares.use((req, res, next) => {
        const p = (req.url || '').split('?')[0]
        if (p.startsWith('/api/prd')) {
          const opts = {
            hostname: 'localhost',
            port: PRD_PORT,
            path: req.url,
            method: req.method,
            headers: { ...req.headers },
          }
          const pr = http.request(opts, prRes => {
            res.writeHead(prRes.statusCode, prRes.headers)
            prRes.pipe(res, { end: true })
          })
          req.pipe(pr, { end: true })
          return
        }
        next()
      })

      console.log(`[PRD] 📋 打开: http://localhost:${vite.config.server?.port || 5173}/lto/，左下角有 [PRD] 按钮`)
    },
    transformIndexHtml(html, ctx) {
      // dev模式从 ctx.server.config 读取，build模式从 vite.config 读取
      let base = '/';
      if (ctx?.server?.config?.base) {
        base = ctx.server.config.base;
      } else if (typeof vite !== 'undefined' && vite?.config?.base) {
        base = vite.config.base;
      } else {
        // build模式 fallback：从 vite.config.ts 内容正则匹配（最可靠）
        try {
          const cfgPath = path.join(__dirname, 'vite.config.ts');
          const cfgContent = fs.readFileSync(cfgPath, 'utf-8');
          const m = cfgContent.match(/base:\s*['"`]([^'"`]+)['"`]/);
          if (m) base = m[1];
        } catch {}
      }
      base = base.replace(/\/$/, '');
      if (!html.includes('__PRD_PORT__')) {
        return html.replace('</body>', `<script>window.__PRD_PORT__=${PRD_PORT};window.__PRD_BASE__='/';</script>\n<script src="/prd-inject.js"></script>\n</body>`);
      }
      return html;
    },
    closeBundle() {
      if (daemonProcess) {
        daemonProcess.kill()
        daemonProcess = null
        console.log('[PRD] 🛑 PRD 服务已关闭')
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
    prdPlugin(),  // ← PRD 全自动
  ],
  server: {
    proxy: {
      '/api/ai': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    minify: 'terser',
    chunkSizeWarningLimit: 2000,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2,
      },
      mangle: { safari10: true },
      format: { comments: false },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor'
            if (id.includes('recharts')) return 'recharts-vendor'
            if (id.includes('@radix-ui') || id.includes('vaul') || id.includes('cmdk')) return 'ui-vendor'
            if (id.includes('lucide')) return 'icons-vendor'
            if (id.includes('react-router')) return 'router-vendor'
            if (id.includes('@mui')) return 'mui-vendor'
            return 'vendor'
          }
        },
      },
    },
  },
})
