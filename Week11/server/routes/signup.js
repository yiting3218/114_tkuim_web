// server/routes/signup.js
import express from 'express';
import { ObjectId } from 'mongodb';  // 引入 ObjectId 檢查
import { getDB } from '../db.js';  // 引入 getDB()
import { createParticipant, listParticipants, updateParticipant, deleteParticipant } from '../repositories/participants.js';

const router = express.Router();

// 定義 collection
const collection = () => getDB().collection('participants');

// POST /api/signup - 創建報名
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ error: '缺少必要欄位' });
    }

    // 確保 email 唯一
    const existingUser = await collection().findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email 已存在' });
    }

    const id = await createParticipant({ name, email, phone });
    res.status(201).json({ id });
  } catch (error) {
    console.error(error);  // 記錄錯誤
    next(error);  // 傳遞錯誤給後續中介層
  }
});

// GET /api/signup - 獲取報名清單
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;  // 支援分頁
    const participants = await listParticipants(page, limit);
    res.json({ items: participants, total: participants.length });
  } catch (error) {
    console.error(error);  // 記錄錯誤
    next(error);  // 傳遞錯誤給後續中介層
  }
});

// PATCH /api/signup/:id - 更新報名資料
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params; // 確保 id 取得正確
    const { phone } = req.body; // 確保從 body 取得更新內容

    // 檢查 ID 格式是否正確
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID 格式不正確，必須是 ObjectId' });
    }

    if (!phone) {
      return res.status(400).json({ error: '缺少必要欄位：phone' });
    }

    const result = await updateParticipant(id, req.body);

    if (!result.matchedCount) {
      return res.status(404).json({ error: '找不到資料' });
    }

    res.json({ updated: result.modifiedCount });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// DELETE /api/signup/:id - 刪除報名資料
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // 檢查 ID 格式是否正確
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID 格式不正確，必須是 ObjectId' });
    }

    const result = await deleteParticipant(id);
    if (!result.deletedCount) {
      return res.status(404).json({ error: '找不到資料' });
    }
    res.status(204).end();
  } catch (error) {
    console.error(error);  // 記錄錯誤
    next(error);  // 傳遞錯誤給後續中介層
  }
});

export default router;
