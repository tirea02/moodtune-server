import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/bookmarks - 내 북마크 목록
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: req.user!.id },
      include: {
        playlist: {
          include: { user: { select: { id: true, displayName: true, photoUrl: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ bookmarks });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
