// server/db.js
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
let db;

export async function connectDB() {
  // 如果已經有資料庫連線則不再重複連線
  if (db) return db;
  
  // 開始連線到 MongoDB
  await client.connect();
  
  // 儲存資料庫連線
  db = client.db();  // 這會返回對 MongoDB 的訪問
  console.log('[DB] Connected to MongoDB');
  return db;
}

export function getDB() {
  // 如果尚未連線則拋出錯誤
  if (!db) throw new Error('Database not initialized');
  return db;
}

// 註冊關閉 MongoDB 連線的事件
process.on('SIGINT', async () => {
  // 關閉 MongoDB 連線
  await client.close();
  console.log('\n[DB] Connection closed');
  process.exit(0);  // 結束程序
});
