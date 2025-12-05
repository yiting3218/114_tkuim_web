// week11/server/app.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import signupRouter from './routes/signup.js';

const app = express();

// 設定 CORS，允許來自前端的請求
app.use(cors({ origin: process.env.ALLOWED_ORIGIN }));

// 設定解析 JSON 請求
app.use(express.json());

// 設定路由
app.use('/api/signup', signupRouter);

// 404 錯誤處理
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// 全局錯誤處理
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server Error' });
});

// 從 .env 讀取端口
const port = process.env.PORT || 3001;

// 連接 MongoDB 並啟動伺服器
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect MongoDB', error);
    process.exit(1);
  });
