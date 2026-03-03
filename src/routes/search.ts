import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticateOptional, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/search?q=&category=&tag=&page=
// authenticateOptional: 로그인 유저에게 isLiked/isBookmarked 반환, 비로그인도 정상 동작
router.get('/', authenticateOptional, async (req: AuthRequest, res: Response) => {
  try {
    const q = (req.query.q as string) ?? '';
    const category = req.query.category as string | undefined;
    const tag = req.query.tag as string | undefined;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = 20;

    const where: Record<string, unknown> = { isPublic: true };
    if (q) where.name = { contains: q, mode: 'insensitive' };
    if (category) where.category = category;
    if (tag) where.tags = { has: tag };

    const [playlists, total] = await Promise.all([
      prisma.playlist.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ likeCount: 'desc' }, { createdAt: 'desc' }],
        include: { user: { select: { id: true, displayName: true, photoUrl: true } } },
      }),
      prisma.playlist.count({ where }),
    ]);

    // 로그인 유저: isLiked / isBookmarked enrichment (playlists.ts GET '/' 와 동일 패턴)
    if (req.user && playlists.length > 0) {
      const ids = playlists.map((p) => p.id);
      const [likes, bookmarks] = await Promise.all([
        prisma.like.findMany({
          where: { userId: req.user.id, playlistId: { in: ids } },
          select: { playlistId: true },
        }),
        prisma.bookmark.findMany({
          where: { userId: req.user.id, playlistId: { in: ids } },
          select: { playlistId: true },
        }),
      ]);
      const likedSet = new Set(likes.map((l) => l.playlistId));
      const bookmarkedSet = new Set(bookmarks.map((b) => b.playlistId));
      const enriched = playlists.map((p) => ({
        ...p,
        isLiked: likedSet.has(p.id),
        isBookmarked: bookmarkedSet.has(p.id),
      }));
      res.json({ playlists: enriched, total, page, limit });
      return;
    }

    res.json({ playlists, total, page, limit });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
