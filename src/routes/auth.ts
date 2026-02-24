import { Router, Request, Response } from 'express';
import admin from '../lib/firebase';
import prisma from '../lib/prisma';

const router = Router();

// POST /api/auth/login
// Firebase ID 토큰 검증 후 DB에 유저 upsert
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const user = await prisma.user.upsert({
      where: { firebaseUid: decoded.uid },
      update: {
        email: decoded.email ?? '',
        displayName: decoded.name ?? null,
        photoUrl: decoded.picture ?? null,
      },
      create: {
        firebaseUid: decoded.uid,
        email: decoded.email ?? '',
        displayName: decoded.name ?? null,
        photoUrl: decoded.picture ?? null,
      },
    });
    res.json({ user });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
