/**
 * Proxy 라우트 — Gemini / YouTube API 키를 서버에서만 사용
 *
 * POST /api/proxy/analyze  → Gemini 2.5 Flash 감정 분석 + 트랙 추천 + 검색 쿼리 생성
 * POST /api/proxy/youtube  → YouTube Data API v3 영상 검색 (쿼리 배열 → Video 배열)
 *
 * 데이터 흐름:
 *   프론트 → POST /api/proxy/analyze → Gemini API → { analysis, tracks, videoQueries }
 *   프론트 → POST /api/proxy/youtube → YouTube API → Video[]
 *
 * API 키는 서버 환경변수(GEMINI_API_KEY, YOUTUBE_API_KEY)에서만 읽음
 * 프론트 번들에 절대 노출되지 않음
 */
import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

interface TrackData {
  title: string;
  artist: string;
  genre: string;
}

interface GeminiResponse {
  analysis: string;
  tracks: TrackData[];
  videoQueries: string[];
}

interface YoutubeItem {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      medium?: { url: string };
      default?: { url: string };
    };
  };
}

interface VideoData {
  id: string;
  title: string;
  channel: string;
  videoId: string;
  thumbnailUrl: string;
}

// POST /api/proxy/analyze
// body: { mood: string }
// Gemini로 감정 분석 후 트랙 6개 + YouTube 검색 쿼리 4개 반환
router.post('/analyze', async (req: Request, res: Response): Promise<void> => {
  try {
    const { mood } = req.body as { mood: unknown };
    if (!mood || typeof mood !== 'string' || !mood.trim()) {
      res.status(400).json({ error: 'mood is required' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a music recommendation AI. Analyze the user's mood and recommend music.

User's mood/situation: "${mood}"

Respond ONLY with valid JSON (no markdown, no code blocks, no explanation):
{
  "analysis": "한국어로 작성한 감성 분석 (1-2문장, 따뜻하고 공감하는 톤으로)",
  "tracks": [
    { "title": "Song Title", "artist": "Artist Name", "genre": "Genre" },
    { "title": "Song Title", "artist": "Artist Name", "genre": "Genre" },
    { "title": "Song Title", "artist": "Artist Name", "genre": "Genre" },
    { "title": "Song Title", "artist": "Artist Name", "genre": "Genre" },
    { "title": "Song Title", "artist": "Artist Name", "genre": "Genre" },
    { "title": "Song Title", "artist": "Artist Name", "genre": "Genre" }
  ],
  "videoQueries": [
    "YouTube search query 1",
    "YouTube search query 2",
    "YouTube search query 3",
    "YouTube search query 4"
  ]
}

Recommend 6 diverse tracks that match the mood. VideoQueries should be specific YouTube search terms for playlists or mixes matching the mood (mix Korean and English queries naturally).`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned) as GeminiResponse;

    res.json(parsed);
  } catch {
    res.status(500).json({ error: 'Failed to analyze mood' });
  }
});

// POST /api/proxy/youtube
// body: { queries: string[] }
// 각 검색 쿼리에 대해 YouTube 영상 1개씩 조회 후 Video 배열 반환
router.post('/youtube', async (req: Request, res: Response): Promise<void> => {
  try {
    const { queries } = req.body as { queries: unknown };
    if (!Array.isArray(queries) || queries.length === 0) {
      res.status(400).json({ error: 'queries array is required' });
      return;
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

    const results = await Promise.all(
      (queries as string[]).map(async (query, idx) => {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=1&key=${apiKey}`;
        const fetchRes = await fetch(url);
        if (!fetchRes.ok) return null;

        const data = await fetchRes.json() as { items?: YoutubeItem[] };
        if (!data.items?.length) return null;

        const item = data.items[0];
        const video: VideoData = {
          id: String(idx),
          title: item.snippet.title,
          channel: item.snippet.channelTitle,
          videoId: item.id.videoId,
          thumbnailUrl:
            item.snippet.thumbnails.medium?.url ??
            item.snippet.thumbnails.default?.url ??
            '',
        };
        return video;
      }),
    );

    res.json(results.filter(Boolean));
  } catch {
    res.status(500).json({ error: 'Failed to fetch YouTube videos' });
  }
});

export default router;
