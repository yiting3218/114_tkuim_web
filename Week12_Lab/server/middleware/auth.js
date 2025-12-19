// server/middleware/auth.js
import jwt from 'jsonwebtoken';

// 用於驗證 JWT token，並將有效的用戶資訊存入 req.user
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '缺少授權資訊' });
  }

  const token = authHeader.split(' ')[1];  // 更簡單的方式解析 token

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    };

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token 無效或已過期' });
  }
}

// 用於檢查用戶角色是否符合
export function requireRole(...roles) {
  return function (req, res, next) {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: '權限不足' });
    }
    return next();
  };
}
