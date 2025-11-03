# Week07_Lab
會員註冊表單（DOM 與表單驗證整合）

## 1103
- 練習 DOM 事件委派與 Constraint Validation API
- 建立 signup_form.html、signup_form.js、styles.css
- 加入欄位驗證（姓名、Email、手機、密碼、確認密碼）
- 使用 setCustomValidity() 顯示自訂錯誤訊息
- 加入 aria-describedby 與 aria-live 可及性提示
- 送出前檢查並聚焦第一個錯誤欄位
- 防重送機制：送出中按鈕 disabled 並顯示「送出中...」

## 加分項
- 密碼強度條（弱 / 中 / 強）即時顯示
- localStorage 暫存資料，重新整理後恢復
- 重設按鈕清空欄位、錯誤訊息與暫存資料

## 自訂錯誤條件
- 姓名：必填
- Email：格式需正確（ex. name@example.com）
- 手機：需為 09 開頭的 10 碼數字
- 密碼：至少 8 碼，包含英文字母與數字
- 確認密碼：需與密碼一致
- 興趣標籤：至少勾選 1 項
- 服務條款：必須勾選

## 結果
- 成功完成所有驗證與送出攔截
- 所有錯誤訊息皆可即時更新並具可讀性
- 完成 UX、可及性與防重送設計
