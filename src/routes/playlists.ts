import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, authenticateOptional, AuthRequest } from '../middleware/auth';

const router = Router();

const userSelect = { id: true, displayName: true, photoUrl: true };

// ────────────────────────────────────────────────
// 플레이리스트 CRUD
// ────────────────────────────────────────────────

// GET /api/playlists - 공개 플레이리스트 목록
// 로그인 유저: isLiked / isBookmarked 추가 반환 (authenticateOptional)
router.get('/', authenticateOptional, async (req: AuthRequest, res: Response) => {
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
        include: { user: { select: userSelect }, _count: { select: { comments: true } } },
      }),
      prisma.playlist.count({ where }),
    ]);

    // comments 관계 COUNT → commentCount 필드로 정규화
    const withCounts = playlists.map((p) => ({ ...p, commentCount: p._count.comments }));

    // 로그인 유저: 좋아요/북마크 여부 배치 조회
    if (req.user && withCounts.length > 0) {
      const ids = withCounts.map((p) => p.id);
      const [likes, bookmarks] = await Promise.all([
        prisma.like.findMany({ where: { userId: req.user.id, playlistId: { in: ids } }, select: { playlistId: true } }),
        prisma.bookmark.findMany({ where: { userId: req.user.id, playlistId: { in: ids } }, select: { playlistId: true } }),
      ]);
      const likedSet = new Set(likes.map((l) => l.playlistId));
      const bookmarkedSet = new Set(bookmarks.map((b) => b.playlistId));

      const enriched = withCounts.map((p) => ({
        ...p,
        isLiked: likedSet.has(p.id),
        isBookmarked: bookmarkedSet.has(p.id),
      }));
      res.json({ playlists: enriched, total, page, limit });
      return;
    }

    res.json({ playlists: withCounts, total, page, limit });
  } catch (err) {
    console.error('[playlists] GET / 에러:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/playlists/my - 내 플레이리스트
router.get('/my', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const raw = await prisma.playlist.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { comments: true } } },
    });
    const playlists = raw.map((p) => ({ ...p, commentCount: p._count.comments }));
    res.json({ playlists });
  } catch (err) {
    console.error('[playlists] GET /my 에러:', err);
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
  } catch (err) {
    console.error('[playlists] GET /:id 에러:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/playlists
router.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, category, tags, tracks, videos, isPublic } = req.body;

    // 입력값 검증
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      res.status(400).json({ error: '플레이리스트 이름은 필수입니다.' });
      return;
    }
    if (tracks !== undefined && !Array.isArray(tracks)) {
      res.status(400).json({ error: 'tracks는 배열이어야 합니다.' });
      return;
    }
    if (videos !== undefined && !Array.isArray(videos)) {
      res.status(400).json({ error: 'videos는 배열이어야 합니다.' });
      return;
    }

    const playlist = await prisma.playlist.create({
      data: {
        userId: req.user!.id,
        name: name.trim(),
        description,
        category,
        tags: tags ?? [],
        tracks: tracks ?? [],
        videos: videos ?? [],
        isPublic: isPublic ?? true,
      },
    });
    res.status(201).json({ playlist });
  } catch (err) {
    console.error('[playlists] POST / 에러:', err);
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
  } catch (err) {
    console.error('[playlists] PUT /:id 에러:', err);
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
  } catch (err) {
    console.error('[playlists] DELETE /:id 에러:', err);
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
    console.error('[playlists] POST /:id/like 에러:', err);
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
  } catch (err) {
    console.error('[playlists] DELETE /:id/like 에러:', err);
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
    console.error('[playlists] POST /:id/bookmark 에러:', err);
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
  } catch (err) {
    console.error('[playlists] DELETE /:id/bookmark 에러:', err);
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
  } catch (err) {
    console.error('[playlists] GET /:id/comments 에러:', err);
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
  } catch (err) {
    console.error('[playlists] POST /:id/comments 에러:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/playlists/:id/comments/:commentId
// 본인 댓글만 삭제 가능 (userId 검증)
router.delete('/:id/comments/:commentId', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const commentId = parseInt(req.params.commentId as string);
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) { res.status(404).json({ error: 'Not found' }); return; }
    if (comment.userId !== req.user!.id) { res.status(403).json({ error: 'Forbidden' }); return; }

    await prisma.comment.delete({ where: { id: commentId } });
    res.status(204).send();
  } catch (err) {
    console.error('[playlists] DELETE /:id/comments/:commentId 에러:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
