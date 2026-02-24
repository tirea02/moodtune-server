import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

const userSelect = { id: true, displayName: true, photoUrl: true };

// ────────────────────────────────────────────────
// 플레이리스트 CRUD
// ────────────────────────────────────────────────

// GET /api/playlists - 공개 플레이리스트 목록
router.get('/', async (req, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 20);
    const category = req.query.category as string | undefined;
    const tag = req.query.tag as string | undefined;

    const where: Record<string, unknown> = { isPublic: true };
    if (category) where.category = category;
    if (tag) where.tags = { has: tag };

    const [playlists, total] = await Promise.all([
      prisma.playlist.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: userSelect } },
      }),
      prisma.playlist.count({ where }),
    ]);

    res.json({ playlists, total, page, limit });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/playlists/my - 내 플레이리스트
router.get('/my', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const playlists = await prisma.playlist.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ playlists });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/playlists/:id
router.get('/:id', async (req, res: Response): Promise<void> => {
  try {
    const playlist = await prisma.playlist.findUnique({
      where: { id: parseInt(req.params.id as string) },
      include: { user: { select: userSelect } },
    });
    if (!playlist) { res.status(404).json({ error: 'Not found' }); return; }
    if (!playlist.isPublic) { res.status(403).json({ error: 'Forbidden' }); return; }

    await prisma.playlist.update({
      where: { id: playlist.id },
      data: { playCount: { increment: 1 } },
    });
    res.json({ playlist });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/playlists
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, category, tags, tracks, videos, isPublic } = req.body;
    const playlist = await prisma.playlist.create({
      data: {
        userId: req.user!.id,
        name,
        description,
        category,
        tags: tags ?? [],
        tracks: tracks ?? [],
        videos: videos ?? [],
        isPublic: isPublic ?? true,
      },
    });
    res.status(201).json({ playlist });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/playlists/:id
router.put('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const playlist = await prisma.playlist.findUnique({ where: { id: parseInt(req.params.id as string) } });
    if (!playlist) { res.status(404).json({ error: 'Not found' }); return; }
    if (playlist.userId !== req.user!.id) { res.status(403).json({ error: 'Forbidden' }); return; }

    const updated = await prisma.playlist.update({
      where: { id: playlist.id },
      data: req.body,
    });
    res.json({ playlist: updated });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/playlists/:id
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const playlist = await prisma.playlist.findUnique({ where: { id: parseInt(req.params.id as string) } });
    if (!playlist) { res.status(404).json({ error: 'Not found' }); return; }
    if (playlist.userId !== req.user!.id) { res.status(403).json({ error: 'Forbidden' }); return; }

    await prisma.playlist.delete({ where: { id: playlist.id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ────────────────────────────────────────────────
// 좋아요
// ────────────────────────────────────────────────

// POST /api/playlists/:id/like
router.post('/:id/like', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const playlistId = parseInt(req.params.id as string);
  try {
    await prisma.$transaction([
      prisma.like.create({ data: { userId: req.user!.id, playlistId } }),
      prisma.playlist.update({ where: { id: playlistId }, data: { likeCount: { increment: 1 } } }),
    ]);
    res.status(201).json({ liked: true });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2002') {
      res.status(409).json({ error: 'Already liked' });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/playlists/:id/like
router.delete('/:id/like', authenticate, async (req: AuthRequest, res: Response) => {
  const playlistId = parseInt(req.params.id as string);
  try {
    await prisma.$transaction([
      prisma.like.delete({ where: { userId_playlistId: { userId: req.user!.id, playlistId } } }),
      prisma.playlist.update({ where: { id: playlistId }, data: { likeCount: { decrement: 1 } } }),
    ]);
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ────────────────────────────────────────────────
// 북마크
// ────────────────────────────────────────────────

// POST /api/playlists/:id/bookmark
router.post('/:id/bookmark', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const playlistId = parseInt(req.params.id as string);
  try {
    await prisma.bookmark.create({ data: { userId: req.user!.id, playlistId } });
    res.status(201).json({ bookmarked: true });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2002') {
      res.status(409).json({ error: 'Already bookmarked' });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/playlists/:id/bookmark
router.delete('/:id/bookmark', authenticate, async (req: AuthRequest, res: Response) => {
  const playlistId = parseInt(req.params.id as string);
  try {
    await prisma.bookmark.delete({
      where: { userId_playlistId: { userId: req.user!.id, playlistId } },
    });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ────────────────────────────────────────────────
// 댓글
// ────────────────────────────────────────────────

// GET /api/playlists/:id/comments
router.get('/:id/comments', async (req, res: Response) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { playlistId: parseInt(req.params.id as string) },
      include: { user: { select: userSelect } },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ comments });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/playlists/:id/comments
router.post('/:id/comments', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const comment = await prisma.comment.create({
      data: {
        userId: req.user!.id,
        playlistId: parseInt(req.params.id as string),
        content: req.body.content,
      },
      include: { user: { select: userSelect } },
    });
    res.status(201).json({ comment });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
