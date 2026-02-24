import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// DELETE /api/comments/:id - 댓글 삭제 (본인만)
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const comment = await prisma.comment.findUnique({ where: { id: parseInt(req.params.id as string) } });
    if (!comment) { res.status(404).json({ error: 'Not found' }); return; }
    if (comment.userId !== req.user!.id) { res.status(403).json({ error: 'Forbidden' }); return; }

    await prisma.comment.delete({ where: { id: comment.id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
