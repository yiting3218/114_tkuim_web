# Week11

## 1. 啟動指令
- 使用 Docker 啟動專案 docker compose up -d
- 啟動伺服器 npm run dev

## 2. 環境需求
- Docker：用來啟動MongoDB
- Node.js：用來啟動伺服器。
- Postman：用來測試 API

## 3. 測試方式
- 建立報名 POST http://localhost:3001/api/signup
- 取得報名清單 GET http://localhost:3001/api/signup
- 更新報名資料 PATCH http://localhost:3001/api/signup/{{last_id}}
- 刪除報名資料 DELETE http://localhost:3001/api/signup/{{last_id}}

## 4. 常見問題
- 500 錯誤 

