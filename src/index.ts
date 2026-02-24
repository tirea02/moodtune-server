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

app.use(cors());
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
