# 🔐 GitHub Secrets 設定教學

## 📍 前往 Secrets 設定頁面

1. **打開你的 GitHub Repository**
   - 例如：`https://github.com/你的用戶名/vibe-game`

2. **點擊上方選單的 `Settings`（設定）**

3. **在左側邊欄找到 `Secrets and variables`**
   - 展開後點擊 **`Actions`**

---

## ➕ 新增 Repository Secrets

### 步驟 1：新增第一個 Secret

1. **點擊綠色按鈕 `New repository secret`**

2. **填寫資訊**：
   - **Name（名稱）**：`VITE_GOOGLE_SHEET_QUESTION_URL`
   - **Secret（值）**：貼上你的 Google Sheets CSV URL
     ```
     https://docs.google.com/spreadsheets/d/e/xxxxxx/pub?gid=0&single=true&output=csv
     ```

3. **點擊 `Add secret`（新增密鑰）**

### 步驟 2：新增第二個 Secret

1. **再次點擊 `New repository secret`**

2. **填寫資訊**：
   - **Name（名稱）**：`VITE_GOOGLE_SHEET_RESPONSE_URL`
   - **Secret（值）**：貼上你的 Google Apps Script URL
     ```
     https://script.google.com/macros/s/xxxxxx/exec
     ```

3. **點擊 `Add secret`**

---

## 🎯 新增 Repository Variables（選用）

如果你想要設定可公開的配置（不敏感的資料）：

1. **切換到 `Variables` 分頁**（在 `Secrets` 旁邊）

2. **點擊 `New repository variable`**

3. **新增以下變數**：

   | Name | Value |
   |------|-------|
   | `VITE_QUESTION_COUNT` | `5` |
   | `VITE_PASS_THRESHOLD` | `3` |

---

## ✅ 驗證設定

完成後，你應該會在 Secrets 頁面看到：

```
Repository secrets
├── VITE_GOOGLE_SHEET_QUESTION_URL    Updated now by 你的用戶名
└── VITE_GOOGLE_SHEET_RESPONSE_URL    Updated now by 你的用戶名
```

**注意**：Secret 的值在新增後**無法查看**，只能更新或刪除。

---

## 📝 快速參考表

### 需要取得的 URL

| Secret 名稱 | 從哪裡取得 | 範例 |
|------------|-----------|------|
| `VITE_GOOGLE_SHEET_QUESTION_URL` | Google Sheets → 發布到網路 → CSV | `https://docs.google.com/.../pub?output=csv` |
| `VITE_GOOGLE_SHEET_RESPONSE_URL` | Google Apps Script → 部署 → 網頁應用程式 URL | `https://script.google.com/macros/s/.../exec` |

### 如何取得 CSV URL？

1. 打開 Google Sheets
2. **檔案** → **共用** → **發布到網路**
3. 選擇 **QuestionsPublic** 工作表
4. 格式選擇 **逗號分隔值 (.csv)**
5. 點擊 **發布**
6. 複製產生的 URL

### 如何取得 Apps Script URL？

1. 打開 Google Apps Script 編輯器
2. 點擊右上角 **部署** → **管理部署項目**
3. 複製「網頁應用程式」下的 URL
4. 格式應該是：`https://script.google.com/macros/s/AKfycb.../exec`

---

## 🚀 設定完成後

1. **推送程式碼到 GitHub**：
   ```bash
   git add .
   git commit -m "Setup deployment"
   git push origin main
   ```

2. **前往 Actions 分頁**查看部署進度

3. **部署成功後**，訪問：
   ```
   https://你的用戶名.github.io/vibe-game/
   ```

---

## ❓ 常見問題

### Q: Secret 設定後可以修改嗎？
A: 可以！點擊 Secret 名稱旁的 **Update** 按鈕即可修改。

### Q: 如果我不小心洩漏了 Secret 怎麼辦？
A: 立即更新 Secret 的值，並重新部署 Google Apps Script（產生新的 URL）。

### Q: Variables 和 Secrets 有什麼區別？
A: 
- **Secrets** - 加密儲存，無法查看，適合 API Keys 等敏感資訊
- **Variables** - 明文儲存，可以查看，適合公開的配置參數

### Q: 設定後沒有生效？
A: 檢查：
1. Secret 名稱是否完全正確（包含 `VITE_` 前綴）
2. 是否已經推送程式碼觸發 GitHub Actions
3. 查看 Actions 日誌確認是否有錯誤
