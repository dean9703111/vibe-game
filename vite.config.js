import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 載入環境變數
  const env = loadEnv(mode, process.cwd(), '')
  
  // 從完整 URL 中提取路徑部分
  const scriptUrl = env.VITE_GOOGLE_SHEET_RESPONSE_URL || ''
  const scriptPath = scriptUrl.replace('https://script.google.com', '')
  
  return {
    // GitHub Pages 部署時需要設定 base path
    // 本地開發時會是 '/'，部署時會是 '/repo-name/'
    base: mode === 'production' ? '/vibe-game/' : '/',
    
    plugins: [react()],
    server: {
      proxy: {
        '/api/submit': {
          target: 'https://script.google.com',
          changeOrigin: true,
          rewrite: (path) => scriptPath
        }
      }
    }
  }
})
