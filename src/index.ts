import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRouter from './routes/auth';
import playlistsRouter from './routes/playlists';
import bookmarksRouter from './routes/bookmarks';
import commentsRouter from './routes/comments';
import searchRouter from './routes/search';

const app = express();
const PORT = process.env.PORT || 3000;

// 환경별 CORS origin 제한
// - 개발(NODE_ENV !== 'production'): localhost 모든 포트 허용
// - 프로덕션: Vercel 배포 도메인만 허용
const allowedOrigin: string | RegExp =
  process.env.NODE_ENV !== 'production'
    ? /^http:\/\/localhost:\d+$/
    : 'https://moodtune.vercel.app';

app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRouter);
app.use('/api/playlists', playlistsRouter);
app.use('/api/bookmarks', bookmarksRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/search', searchRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
