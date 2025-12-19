import express from 'express';
import bcrypt from 'bcrypt';
import { getCollection } from '../db.js';
import { generateToken, TOKEN_EXPIRES_IN } from '../utils/generateToken.js';

const router = express.Router();

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    if (!isValidEmail(email)) return res.status(400).json({ error: 'Email 格式不正確' });
    if (typeof password !== 'string' || password.length < 6)
      return res.status(400).json({ error: '密碼至少 6 碼' });

    const users = getCollection('users');
    const exists = await users.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email 已被註冊' });

    const passwordHash = await bcrypt.hash(password, 10);
    const doc = { email, passwordHash, role: 'student', createdAt: new Date() };
    const r = await users.insertOne(doc);

    return res.status(201).json({ id: r.insertedId, email: doc.email, role: doc.role });
  } catch (e) {
    return res.status(500).json({ error: '註冊失敗' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    if (!isValidEmail(email)) return res.status(400).json({ error: 'Email 格式不正確' });
    if (typeof password !== 'string') return res.status(400).json({ error: 'Password 不可為空' });

    const users = getCollection('users');
    const user = await users.findOne({ email });
    if (!user) return res.status(401).json({ error: '帳號或密碼錯誤' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: '帳號或密碼錯誤' });

    const token = generateToken(user);
    return res.json({
      token,
      expiresIn: TOKEN_EXPIRES_IN,
      user: { id: user._id?.toString?.(), email: user.email, role: user.role }
    });
  } catch (e) {
    return res.status(500).json({ error: '登入失敗' });
  }
});

export default router;
