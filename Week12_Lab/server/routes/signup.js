// server/routes/signup.js
import express from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import {
  createParticipant,
  listParticipants,
  updateParticipant,
  deleteParticipant
} from '../repositories/participants.js';

const router = express.Router();

const collection = () => getDB().collection('participants');

router.use(authMiddleware);

// POST /api/signup - 創建報名（一定要記 ownerId）
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ error: '缺少必要欄位' });
    }

    // 你原本用 email 唯一，先保留（不強制，但不動你原本邏輯）
    const existing = await collection().findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email 已存在' });
    }

    const ownerId = req.user.id;

    // 把 ownerId 帶進去（Week12 核心）
    const id = await createParticipant({ name, email, phone, ownerId });

    res.status(201).json({ id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// GET /api/signup - student 只能看自己；admin 看全部
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const isAdmin = req.user.role === 'admin';
    const ownerId = req.user.id;

    // 你原本的 listParticipants(page, limit) 無法做 owner 過濾
    // 這裡直接用 collection 查，避免你還要大改 repository
    const p = Number(page) || 1;
    const l = Number(limit) || 10;
    const skip = (p - 1) * l;

    const filter = isAdmin ? {} : { ownerId };

    const items = await collection()
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l)
      .toArray();

    const total = await collection().countDocuments(filter);

    res.json({ items, total, page: p, limit: l });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// PATCH /api/signup/:id - 只有本人或 admin 能改
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID 格式不正確，必須是 ObjectId' });
    }

    const doc = await collection().findOne({ _id: new ObjectId(id) });
    if (!doc) {
      return res.status(404).json({ error: '找不到資料' });
    }

    const isAdmin = req.user.role === 'admin';
    const isOwner = doc.ownerId === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: '權限不足' });
    }

    // 允許更新欄位（你原本只更新 phone，我保留這個規則）
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: '缺少必要欄位：phone' });
    }

    const result = await updateParticipant(id, { phone });

    if (!result?.matchedCount) {
      return res.status(404).json({ error: '找不到資料' });
    }

    res.json({ updated: result.modifiedCount });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// DELETE /api/signup/:id - 只有本人或 admin 能刪
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID 格式不正確，必須是 ObjectId' });
    }

    const doc = await collection().findOne({ _id: new ObjectId(id) });
    if (!doc) {
      return res.status(404).json({ error: '找不到資料' });
    }

    const isAdmin = req.user.role === 'admin';
    const isOwner = doc.ownerId === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: '權限不足' });
    }

    const result = await deleteParticipant(id);
    if (!result?.deletedCount) {
      return res.status(404).json({ error: '找不到資料' });
    }

    res.status(204).end();
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default router;
