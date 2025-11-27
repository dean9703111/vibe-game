# 🔐 伺服器端答案驗證 - 設置指南

## 📋 Google Sheets 設置

### 1. 建立題目表（Questions）

在你的 Google Sheets 中建立一個名為 **"Questions"** 的工作表（私有，不公開）：

| 題號 | 題目 | A | B | C | D | 解答 |
|------|------|---|---|---|---|------|
| 1 | React 的核心概念是什麼？ | MVC | Component | Database | API | B |
| 2 | 哪一個 Hook 用於處理副作用？ | useState | useEffect | useContext | useReducer | B |
| 3 | Vite 是什麼？ | 資料庫 | 後端框架 | 前端建置工具 | 瀏覽器 | C |

**重要**：
- 第1欄必須是**題號**（建議使用數字 1, 2, 3...）
- 第7欄必須是**解答**（A/B/C/D）
- 此工作表**不要公開**，只給 Apps Script 讀取

---

### 2. 建立公開題目表（QuestionsPublic）

建立另一個名為 **"QuestionsPublic"** 的工作表（公開為 CSV）：

| 題號 | 題目 | A | B | C | D |
|------|------|---|---|---|---|
| 1 | React 的核心概念是什麼？ | MVC | Component | Database | API |
| 2 | 哪一個 Hook 用於處理副作用？ | useState | useEffect | useContext | useReducer |
| 3 | Vite 是什麼？ | 資料庫 | 後端框架 | 前端建置工具 | 瀏覽器 |

**重要**：
- **不包含解答欄位**
- 發布為網頁（檔案 → 共用 → 發布到網路 → 選擇 QuestionsPublic → CSV）
- 將 CSV URL 更新到 `.env` 的 `VITE_GOOGLE_SHEET_QUESTION_URL`

---

## 🛠️ Google Apps Script 設置

### 1. 複製程式碼

將 `google-apps-script.js` 的內容複製到你的 Google Apps Script 編輯器中。

### 2. 重新部署

1. 點擊「部署」→「管理部署項目」
2. 點擊現有部署的**編輯圖示**
3. 選擇「新版本」
4. 點擊「部署」
5. 複製新的部署 URL（如果有變化）

### 3. 更新 .env

確保 `.env` 中的 `VITE_GOOGLE_SHEET_RESPONSE_URL` 是最新的部署 URL。

---

## 🔄 資料流程

```
1. 前端讀取 QuestionsPublic CSV（無解答）
   ↓
2. 使用者作答
   ↓
3. 提交答案陣列到 Google Apps Script
   ↓
4. Apps Script 讀取 Questions 表（含解答）
   ↓
5. 批改答案並計算分數
   ↓
6. 儲存成績到 Response 表
   ↓
7. 回傳批改結果（含正確答案）
   ↓
8. 前端顯示結果和檢討
```

---

## ✅ 測試檢查清單

- [ ] Questions 表已建立且包含解答欄位
- [ ] QuestionsPublic 表已建立且**不含**解答欄位
- [ ] QuestionsPublic 已發布為 CSV
- [ ] Google Apps Script 已部署新版本
- [ ] .env 中的 URL 已更新
- [ ] 開發伺服器已重啟
- [ ] 按 F12 檢查 Network 和 Console，確認前端無法取得答案
- [ ] 完成遊戲後可正常顯示批改結果

---

## 🔍 除錯

### 問題：前端顯示「批改結果不存在」

**解決方法**：
1. 打開瀏覽器 Console 查看錯誤訊息
2. 確認 Google Apps Script 有回傳 `status: "success"`
3. 檢查 Apps Script 的執行記錄（Logger.log）

### 問題：Questions 表找不到

**解決方法**：
1. 確認工作表名稱是 **"Questions"**（區分大小寫）
2. 檢查 Apps Script 是否有權限存取該工作表

### 問題：題號對應錯誤

**解決方法**：
1. 確認 Questions 和 QuestionsPublic 的題號一致
2. 題號建議使用簡單的數字（1, 2, 3...）
