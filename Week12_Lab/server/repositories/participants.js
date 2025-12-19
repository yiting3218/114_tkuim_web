// server/repositories/participants.js
import { ObjectId } from 'mongodb';
import { getDB } from '../db.js';

// 取得 participants 集合
const collection = () => getDB().collection('participants');

// 創建報名
export async function createParticipant(data) {
  const result = await collection().insertOne({
    ...data,
    ownerId: data.ownerId,  // 儲存 ownerId
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return result.insertedId;
}

// 獲取報名清單（支持分頁）
export function listParticipants(page = 1, limit = 10) {
  return collection()
    .find()
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .toArray();
}

// 更新報名資料
export async function updateParticipant(id, patch) {
  return collection().updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...patch, updatedAt: new Date() } }
  );
}

// 刪除報名資料
export function deleteParticipant(id) {
  return collection().deleteOne({ _id: new ObjectId(id) });
}
