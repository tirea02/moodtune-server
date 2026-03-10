import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/bookmarks - 내 북마크 목록
// playlist.commentCount 포함: _count.comments → commentCount 정규화
router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const rawBookmarks = await prisma.bookmark.findMany({
      where: { userId: req.user!.id },
      include: {
        playlist: {
          include: {
            user: { select: { id: true, displayName: true, photoUrl: true } },
            _count: { select: { comments: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    const bookmarks = rawBookmarks.map((b) => {
      const { _count, ...playlist } = b.playlist;
      return { ...b, playlist: { ...playlist, commentCount: _count.comments } };
    });
    res.json({ bookmarks });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
