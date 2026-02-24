import { Router, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/search?q=&category=&tag=&page=
router.get('/', async (req, res: Response) => {
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

    res.json({ playlists, total, page, limit });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
