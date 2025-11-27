# 🚀 GitHub Pages 自動部署設定指南

## 📋 前置準備

### 1️⃣ 確認 Vite 配置

檢查 `vite.config.js` 是否有設定正確的 base path（如果你的 repo 名稱是 `vibe-game`）：

```javascript
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const scriptUrl = env.VITE_GOOGLE_SHEET_RESPONSE_URL || ''
  const scriptPath = scriptUrl.replace('https://script.google.com', '')
  
  return {
    base: '/vibe-game/', // ⚠️ 改成你的 repo 名稱
    plugins: [react()],
    // ... 其他配置
  }
})
```

---

## 🔐 GitHub Secrets 設定

### 2️⃣ 設定環境變數

1. **前往你的 GitHub Repository**
2. **Settings → Secrets and variables → Actions**
3. **點擊「New repository secret」**

#### 新增以下 Secrets：

| Secret 名稱 | 值 |
|------------|---|
| `VITE_GOOGLE_SHEET_QUESTION_URL` | 你的題目 CSV URL |
| `VITE_GOOGLE_SHEET_RESPONSE_URL` | 你的 Apps Script URL |

#### 新增以下 Variables（選用）：

在「Variables」分頁：

| Variable 名稱 | 值 |
|--------------|---|
| `VITE_QUESTION_COUNT` | `5` |
| `VITE_PASS_THRESHOLD` | `3` |

---

## ⚙️ GitHub Pages 設定

### 3️⃣ 啟用 GitHub Pages

1. **前往 Settings → Pages**
2. **Source**: 選擇 `GitHub Actions`
3. **點擊 Save**

---

## 🎯 部署流程

### 自動部署

當你推送到 `main` 分支時，GitHub Actions 會自動：

1. ✅ 安裝依賴
2. ✅ 讀取 Secrets 中的環境變數
3. ✅ 執行 `npm run build`
4. ✅ 部署到 GitHub Pages

### 手動部署

1. 前往 **Actions** 分頁
2. 選擇 **Deploy to GitHub Pages** workflow
3. 點擊 **Run workflow**
4. 選擇分支並執行

---

## 📝 第一次部署步驟

```bash
# 1. 確認所有檔案都已加入 git
git add .

# 2. 提交變更
git commit -m "Add GitHub Actions deployment"

# 3. 推送到 GitHub
git push origin main
```

推送後：
- 前往 **Actions** 分頁查看部署進度
- 部署完成後，訪問 `https://你的用戶名.github.io/vibe-game/`

---

## 🔍 檢查部署狀態

### Actions 分頁

1. 綠色 ✅ = 部署成功
2. 紅色 ❌ = 部署失敗（點擊查看錯誤日誌）
3. 黃色 🟡 = 部署中

### 常見問題

**問題 1**: 404 Not Found  
**解決**: 檢查 `vite.config.js` 的 `base` 設定是否正確

**問題 2**: 白屏  
**解決**: 按 F12 查看 Console 錯誤，可能是環境變數未設定

**問題 3**: Build 失敗  
**解決**: 檢查 GitHub Secrets 是否正確設定

---

## 🎉 完成！

部署成功後，你的遊戲將可在以下網址訪問：

```
https://你的GitHub用戶名.github.io/vibe-game/
```

每次推送到 `main` 分支都會自動重新部署！
