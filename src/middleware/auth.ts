import { Request, Response, NextFunction } from 'express';
import admin from '../lib/firebase';
import prisma from '../lib/prisma';

export interface AuthRequest extends Request {
  user?: { id: number; firebaseUid: string; email: string };
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
      select: { id: true, firebaseUid: true, email: true },
    });
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * 선택적 인증 미들웨어
 * 토큰 없거나 검증 실패 시 에러 없이 통과 (req.user = undefined)
 * 공개 API에서 로그인 유저에게 추가 정보(isLiked 등)를 제공할 때 사용
 */
export async function authenticateOptional(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) { next(); return; }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
      select: { id: true, firebaseUid: true, email: true },
    });
    if (user) req.user = user;
  } catch {
    // 토큰 오류 시 비로그인으로 처리 (에러 미반환)
  }
  next();
}
