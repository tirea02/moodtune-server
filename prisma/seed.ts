import 'dotenv/config';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

/**
 * MoodTune 시드 데이터 생성 스크립트
 * 다양한 무드/카테고리의 플레이리스트 30개와 시드 유저 2명을 생성합니다.
 * 실행: npm run seed  (또는 ts-node prisma/seed.ts)
 *
 * 데이터 구조:
 *   - User × 2 (seed-curator-001, seed-explorer-002)
 *   - Playlist × 30 (카테고리: chill, focus, workout, sad, happy, sleep,
 *                    energetic, romantic, k-pop, k-indie, jazz, electronic,
 *                    ambient, indie, classical, R&B)
 */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface SeedTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
}

interface SeedVideo {
  id: string;
  title: string;
  channel: string;
  videoId: string;
  thumbnailUrl: string;
}

interface SeedPlaylist {
  name: string;
  description: string;
  category: string;
  tags: string[];
  tracks: SeedTrack[];
  videos: SeedVideo[];
  likeCount: number;
  playCount: number;
}

const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;

const PLAYLISTS: SeedPlaylist[] = [
  {
    name: '새벽 감성 로파이',
    description: '잠들기 직전, 모든 게 잔잔해지는 시간. 로파이 비트와 함께 하루를 마무리하세요.',
    category: 'chill',
    tags: ['chill', 'lo-fi', '새벽', '감성'],
    tracks: [
      { id: '1', title: 'Snowfall', artist: 'Øneheart', genre: 'Lo-fi' },
      { id: '2', title: 'My Favourite Clothes', artist: 'Sleepy Fish', genre: 'Lo-fi' },
      { id: '3', title: 'Affection', artist: 'Masayoshi Takanaka', genre: 'Jazz' },
      { id: '4', title: 'Alone', artist: 'Ikson', genre: 'Lo-fi' },
      { id: '5', title: 'Quiet', artist: 'Nuages', genre: 'Lo-fi' },
      { id: '6', title: 'With You', artist: 'YUKIFUNE', genre: 'Lo-fi' },
    ],
    videos: [
      { id: '0', title: 'lofi hip hop radio - beats to relax/study to', channel: 'Lofi Girl', videoId: 'jfKfPfyJRdk', thumbnailUrl: thumb('jfKfPfyJRdk') },
      { id: '1', title: 'lofi hip hop radio 📚 - beats to study to', channel: 'Lofi Girl', videoId: '5qap5aO4i9A', thumbnailUrl: thumb('5qap5aO4i9A') },
      { id: '2', title: '새벽 감성 로파이 플레이리스트 [1시간]', channel: 'Korean Lofi', videoId: 'kgx4WGK0oNU', thumbnailUrl: thumb('kgx4WGK0oNU') },
      { id: '3', title: 'Peaceful Night Lo-fi Mix', channel: 'Lo-fi Beats', videoId: 'n61ULEU7CO0', thumbnailUrl: thumb('n61ULEU7CO0') },
    ],
    likeCount: 142,
    playCount: 1823,
  },
  {
    name: '집중력 200% 공부 음악',
    description: '집중이 잘 안 될 때 틀어두면 좋은 인스트루멘털 플레이리스트. 잡생각 없이 공부에 집중.',
    category: 'focus',
    tags: ['focus', 'study', '공부', '집중', 'instrumental'],
    tracks: [
      { id: '1', title: 'Experience', artist: 'Ludovico Einaudi', genre: 'Classical' },
      { id: '2', title: 'Nuvole Bianche', artist: 'Ludovico Einaudi', genre: 'Classical' },
      { id: '3', title: 'River Flows in You', artist: 'Yiruma', genre: 'New Age' },
      { id: '4', title: "Comptine d'un autre été", artist: 'Yann Tiersen', genre: 'Classical' },
      { id: '5', title: 'The Truth That You Leave', artist: 'Pianoboys', genre: 'Classical' },
      { id: '6', title: 'Weightless', artist: 'Marconi Union', genre: 'Ambient' },
    ],
    videos: [
      { id: '0', title: '공부할 때 듣는 음악 Study Music', channel: 'Study Playlist KR', videoId: 'aLqc8TDmq2k', thumbnailUrl: thumb('aLqc8TDmq2k') },
      { id: '1', title: 'Relaxing Piano Music for Studying', channel: 'Piano Classics', videoId: '1ZYbU82GVz4', thumbnailUrl: thumb('1ZYbU82GVz4') },
      { id: '2', title: 'Deep Focus - Study Music Mix', channel: 'Study Music', videoId: 'WPni755-Krg', thumbnailUrl: thumb('WPni755-Krg') },
      { id: '3', title: 'Classical Music for Brain Power', channel: 'OCB Relax', videoId: 'mDDP1tSyKh8', thumbnailUrl: thumb('mDDP1tSyKh8') },
    ],
    likeCount: 287,
    playCount: 4521,
  },
  {
    name: '운동 전 에너지 충전',
    description: '헬스장 가기 전 기운 팍팍 불어넣어 줄 업비트 믹스. 지금 당장 달리고 싶어지는 음악.',
    category: 'workout',
    tags: ['workout', 'energetic', '운동', '헬스', 'gym'],
    tracks: [
      { id: '1', title: 'Till I Collapse', artist: 'Eminem', genre: 'Hip-hop' },
      { id: '2', title: 'Stronger', artist: 'Kanye West', genre: 'Hip-hop' },
      { id: '3', title: 'Eye of the Tiger', artist: 'Survivor', genre: 'Rock' },
      { id: '4', title: 'Power', artist: 'Kanye West', genre: 'Hip-hop' },
      { id: '5', title: 'Jump Around', artist: 'House of Pain', genre: 'Hip-hop' },
      { id: '6', title: 'Lose Yourself', artist: 'Eminem', genre: 'Hip-hop' },
    ],
    videos: [
      { id: '0', title: 'Best Workout Music Mix 2024 💪', channel: 'Gym Music', videoId: 'YgkspnCms80', thumbnailUrl: thumb('YgkspnCms80') },
      { id: '1', title: 'Ultimate Gym Motivation Playlist', channel: 'Workout Hits', videoId: 'dPbA64SC1Gs', thumbnailUrl: thumb('dPbA64SC1Gs') },
      { id: '2', title: '운동할 때 듣는 음악 힙합 Workout Hip-hop', channel: 'Korean Gym Music', videoId: 'MgEPJ7BmUhM', thumbnailUrl: thumb('MgEPJ7BmUhM') },
      { id: '3', title: 'Running Music Mix | Best Workout Songs', channel: 'Run Music', videoId: 'qk5vMzLCaLY', thumbnailUrl: thumb('qk5vMzLCaLY') },
    ],
    likeCount: 198,
    playCount: 3204,
  },
  {
    name: '비 오는 날 감성',
    description: '창밖에 빗소리와 함께 들으면 더 좋은 플레이리스트. 잠시 멈추고 감상에 빠져보세요.',
    category: 'chill',
    tags: ['rainy', 'chill', '비', '감성', 'melancholy'],
    tracks: [
      { id: '1', title: 'The Rain Song', artist: 'Led Zeppelin', genre: 'Rock' },
      { id: '2', title: 'November Rain', artist: "Guns N' Roses", genre: 'Rock' },
      { id: '3', title: 'Riders on the Storm', artist: 'The Doors', genre: 'Rock' },
      { id: '4', title: 'Rain', artist: 'The Beatles', genre: 'Rock' },
      { id: '5', title: 'Umbrella', artist: 'Rihanna', genre: 'Pop' },
      { id: '6', title: "Singin' in the Rain", artist: 'Gene Kelly', genre: 'Jazz' },
    ],
    videos: [
      { id: '0', title: '비 오는 날 감성 플레이리스트 ☔', channel: 'Mood Music KR', videoId: 'xbTmFNSgHVs', thumbnailUrl: thumb('xbTmFNSgHVs') },
      { id: '1', title: 'Rainy Day Music - Soft Piano', channel: 'Rainy Mood', videoId: 'q76bMs-NwRk', thumbnailUrl: thumb('q76bMs-NwRk') },
      { id: '2', title: 'Rain and Lo-fi Music Mix', channel: 'Lo-fi Rain', videoId: 'qH3H3vCbZ8A', thumbnailUrl: thumb('qH3H3vCbZ8A') },
      { id: '3', title: 'Lofi Rain Sounds - Study & Chill', channel: 'Chillhop Music', videoId: 'F4WKxYWlQjY', thumbnailUrl: thumb('F4WKxYWlQjY') },
    ],
    likeCount: 312,
    playCount: 2891,
  },
  {
    name: '기분 UP! 팝 플레이리스트',
    description: '오늘 하루 조금 더 긍정적으로! 에너지 넘치는 팝 히트곡 모음.',
    category: 'happy',
    tags: ['happy', 'pop', '신나는', 'upbeat', '기분전환'],
    tracks: [
      { id: '1', title: 'Happy', artist: 'Pharrell Williams', genre: 'Pop' },
      { id: '2', title: "Can't Stop the Feeling!", artist: 'Justin Timberlake', genre: 'Pop' },
      { id: '3', title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', genre: 'Funk' },
      { id: '4', title: 'Good as Hell', artist: 'Lizzo', genre: 'Pop' },
      { id: '5', title: 'Shake It Off', artist: 'Taylor Swift', genre: 'Pop' },
      { id: '6', title: 'Blinding Lights', artist: 'The Weeknd', genre: 'Synth-pop' },
    ],
    videos: [
      { id: '0', title: 'Happy Pop Hits Playlist 2024 😊', channel: 'Pop Music', videoId: 'ZbZSe6N_BXs', thumbnailUrl: thumb('ZbZSe6N_BXs') },
      { id: '1', title: 'Feel Good Music Mix - Best Pop Songs', channel: 'Good Vibes', videoId: 'Y66j_BUCBMY', thumbnailUrl: thumb('Y66j_BUCBMY') },
      { id: '2', title: '기분 좋아지는 팝송 모음', channel: 'Korea Pop Mix', videoId: 'H_D2fANAkY8', thumbnailUrl: thumb('H_D2fANAkY8') },
      { id: '3', title: 'Summer Pop Hits 2024', channel: 'Summer Playlist', videoId: 'xdivHDRoFSM', thumbnailUrl: thumb('xdivHDRoFSM') },
    ],
    likeCount: 421,
    playCount: 6782,
  },
  {
    name: '숙면을 위한 힐링 앰비언트',
    description: '불면증에 시달리는 밤, 자연의 소리와 함께 편안하게 잠들어 보세요.',
    category: 'sleep',
    tags: ['sleep', 'ambient', '수면', 'healing', '릴렉스'],
    tracks: [
      { id: '1', title: 'Weightless', artist: 'Marconi Union', genre: 'Ambient' },
      { id: '2', title: 'Sleep', artist: 'Max Richter', genre: 'Contemporary Classical' },
      { id: '3', title: 'Gymnopédie No.1', artist: 'Erik Satie', genre: 'Classical' },
      { id: '4', title: 'Discreet Music', artist: 'Brian Eno', genre: 'Ambient' },
      { id: '5', title: 'Deep Relaxation', artist: 'Liquid Mind', genre: 'New Age' },
      { id: '6', title: 'Solace', artist: 'Hammock', genre: 'Ambient' },
    ],
    videos: [
      { id: '0', title: '수면 유도 음악 - 10시간 힐링 사운드', channel: 'Sleep Music KR', videoId: 'FjHGZj2IjBk', thumbnailUrl: thumb('FjHGZj2IjBk') },
      { id: '1', title: 'Deep Sleep Music ★ Calm Music', channel: 'Meditative Mind', videoId: 'rkZl7pt9gnE', thumbnailUrl: thumb('rkZl7pt9gnE') },
      { id: '2', title: 'Fall Asleep Fast - Relaxing Music', channel: 'Yellow Brick Cinema', videoId: '77ZozI0rw7w', thumbnailUrl: thumb('77ZozI0rw7w') },
      { id: '3', title: 'Sleep Music for Deep Sleeping', channel: 'Soothing Relaxation', videoId: 'lCOF9LN_Zxs', thumbnailUrl: thumb('lCOF9LN_Zxs') },
    ],
    likeCount: 567,
    playCount: 8934,
  },
  {
    name: '파티 분위기 EDM 믹스',
    description: '주말 파티를 위한 최고의 EDM 컬렉션. 볼륨을 올리고 신나게 즐겨보세요!',
    category: 'energetic',
    tags: ['party', 'EDM', '댄스', 'club', 'energetic'],
    tracks: [
      { id: '1', title: 'Levels', artist: 'Avicii', genre: 'EDM' },
      { id: '2', title: 'Animals', artist: 'Martin Garrix', genre: 'EDM' },
      { id: '3', title: 'Titanium', artist: 'David Guetta ft. Sia', genre: 'EDM' },
      { id: '4', title: 'Wake Me Up', artist: 'Avicii', genre: 'EDM' },
      { id: '5', title: 'Lean On', artist: 'Major Lazer & DJ Snake', genre: 'EDM' },
      { id: '6', title: 'Clarity', artist: 'Zedd ft. Foxes', genre: 'EDM' },
    ],
    videos: [
      { id: '0', title: 'Best EDM Party Mix 2024 🔥', channel: 'EDM Nation', videoId: 'XWEAzXF7OeM', thumbnailUrl: thumb('XWEAzXF7OeM') },
      { id: '1', title: 'EDM Festival Mix - Electronic Dance', channel: 'Festival Mix', videoId: 'P02mJMIBpbI', thumbnailUrl: thumb('P02mJMIBpbI') },
      { id: '2', title: 'Club Bangers - EDM Mix 2024', channel: 'Club Music', videoId: 'S_ChkTFokDM', thumbnailUrl: thumb('S_ChkTFokDM') },
      { id: '3', title: 'ULTRA Music Festival Highlights', channel: 'ULTRA Music', videoId: 'cNMSXzLwkJY', thumbnailUrl: thumb('cNMSXzLwkJY') },
    ],
    likeCount: 334,
    playCount: 5123,
  },
  {
    name: '로맨틱 저녁을 위한 R&B',
    description: '특별한 저녁, 사랑하는 사람과 함께 듣기 좋은 무드 있는 R&B 컬렉션.',
    category: 'romantic',
    tags: ['romantic', 'R&B', '로맨틱', 'date', 'soul'],
    tracks: [
      { id: '1', title: 'All of Me', artist: 'John Legend', genre: 'R&B' },
      { id: '2', title: 'Thinking Out Loud', artist: 'Ed Sheeran', genre: 'R&B' },
      { id: '3', title: 'At Last', artist: 'Etta James', genre: 'Soul' },
      { id: '4', title: 'Make You Feel My Love', artist: 'Adele', genre: 'Pop/Soul' },
      { id: '5', title: "Can't Help Falling in Love", artist: 'Elvis Presley', genre: 'Pop' },
      { id: '6', title: 'I Will Always Love You', artist: 'Whitney Houston', genre: 'R&B' },
    ],
    videos: [
      { id: '0', title: 'Romantic R&B Mix 2024 💕', channel: 'R&B Playlist', videoId: 'kXYiU_JCYtU', thumbnailUrl: thumb('kXYiU_JCYtU') },
      { id: '1', title: 'Best Love Songs Playlist - R&B Mix', channel: 'Love Songs', videoId: 'mhZgQsHnKys', thumbnailUrl: thumb('mhZgQsHnKys') },
      { id: '2', title: 'Slow Jams Playlist - Neo Soul Mix', channel: 'Soul Radio', videoId: 'n96hSxjKJqU', thumbnailUrl: thumb('n96hSxjKJqU') },
      { id: '3', title: '분위기 있는 R&B 플레이리스트', channel: 'K-R&B', videoId: 'GJhJUZ3UrKo', thumbnailUrl: thumb('GJhJUZ3UrKo') },
    ],
    likeCount: 256,
    playCount: 3421,
  },
  {
    name: 'K-pop 히트곡 2024',
    description: '2024년 가장 핫한 K-pop 노래들만 모았습니다. 최신 트렌드를 놓치지 마세요!',
    category: 'k-pop',
    tags: ['k-pop', 'korean', '케이팝', 'kpop', 'idol'],
    tracks: [
      { id: '1', title: 'Dynamite', artist: 'BTS', genre: 'K-pop' },
      { id: '2', title: 'Ditto', artist: 'NewJeans', genre: 'K-pop' },
      { id: '3', title: 'Queencard', artist: '(G)I-DLE', genre: 'K-pop' },
      { id: '4', title: 'Kitsch', artist: 'IVE', genre: 'K-pop' },
      { id: '5', title: 'OMG', artist: 'NewJeans', genre: 'K-pop' },
      { id: '6', title: 'Spicy', artist: 'aespa', genre: 'K-pop' },
    ],
    videos: [
      { id: '0', title: 'K-POP 2024 최신곡 모음 플레이리스트 🎵', channel: 'KPOP Chart', videoId: 'gdZLi9oWNZg', thumbnailUrl: thumb('gdZLi9oWNZg') },
      { id: '1', title: 'Best K-pop Songs 2024 Mix', channel: 'K-pop World', videoId: 'CevxZvSJLk8', thumbnailUrl: thumb('CevxZvSJLk8') },
      { id: '2', title: 'NewJeans - Best Songs Playlist', channel: 'ADOR', videoId: 'PFnDOmLmUYU', thumbnailUrl: thumb('PFnDOmLmUYU') },
      { id: '3', title: 'BTS - Greatest Hits 2024', channel: 'HYBE', videoId: 'dU2GjWTMySE', thumbnailUrl: thumb('dU2GjWTMySE') },
    ],
    likeCount: 891,
    playCount: 15234,
  },
  {
    name: '한국 인디 감성 모음',
    description: '잘 알려지지 않은 숨은 명곡들. 한국 인디 씬의 보석들을 발견해 보세요.',
    category: 'k-indie',
    tags: ['k-indie', '한국인디', 'indie', 'korean', '감성'],
    tracks: [
      { id: '1', title: '나의 사랑 나의 신부', artist: '혁오', genre: 'K-indie' },
      { id: '2', title: '소녀', artist: '이상은', genre: 'K-indie' },
      { id: '3', title: '봄날', artist: '하림', genre: 'K-indie' },
      { id: '4', title: '오늘 밤은 어둠이 무서워요', artist: '잔나비', genre: 'K-indie' },
      { id: '5', title: '사랑하기 때문에', artist: '유재하', genre: 'K-indie' },
      { id: '6', title: '내 입술 따뜻한 커피처럼', artist: '버즈', genre: 'K-indie' },
    ],
    videos: [
      { id: '0', title: '한국 인디음악 명곡 모음 [감성 플레이리스트]', channel: 'K-Indie Music', videoId: 'TRKGy9o_5EU', thumbnailUrl: thumb('TRKGy9o_5EU') },
      { id: '1', title: '잔나비 베스트 플레이리스트', channel: 'Stone Music', videoId: 'B4SKl_RLnZI', thumbnailUrl: thumb('B4SKl_RLnZI') },
      { id: '2', title: '혁오 최고의 노래 모음', channel: 'Hyukoh Music', videoId: 'XeBUdW6giB4', thumbnailUrl: thumb('XeBUdW6giB4') },
      { id: '3', title: '감성 인디 음악 카페 BGM', channel: 'Indie Cafe KR', videoId: 'EfTJBKf3aeQ', thumbnailUrl: thumb('EfTJBKf3aeQ') },
    ],
    likeCount: 178,
    playCount: 2341,
  },
  {
    name: '재즈 카페 in Seoul',
    description: '서울의 어느 작은 재즈 바. 커피 한 잔과 함께 즐기는 스탠다드 재즈 컬렉션.',
    category: 'jazz',
    tags: ['jazz', 'cafe', '재즈', 'chill', '카페'],
    tracks: [
      { id: '1', title: 'What a Wonderful World', artist: 'Louis Armstrong', genre: 'Jazz' },
      { id: '2', title: 'Fly Me to the Moon', artist: 'Frank Sinatra', genre: 'Jazz' },
      { id: '3', title: 'Take Five', artist: 'Dave Brubeck Quartet', genre: 'Jazz' },
      { id: '4', title: 'So What', artist: 'Miles Davis', genre: 'Jazz' },
      { id: '5', title: 'Blue Bossa', artist: 'Joe Henderson', genre: 'Jazz' },
      { id: '6', title: 'Autumn Leaves', artist: 'Bill Evans', genre: 'Jazz' },
    ],
    videos: [
      { id: '0', title: 'Jazz Music Cafe - Morning Bossa Nova', channel: 'Jazz Cafe Music', videoId: 'Dx5qFachd3A', thumbnailUrl: thumb('Dx5qFachd3A') },
      { id: '1', title: '재즈 카페 음악 - 커피 한 잔과 함께', channel: 'Seoul Jazz Radio', videoId: 'vmDDOFXSgAs', thumbnailUrl: thumb('vmDDOFXSgAs') },
      { id: '2', title: 'Smooth Jazz Radio - 24/7 Live', channel: 'Jazz Radio', videoId: 'Tq3zDrkf5MU', thumbnailUrl: thumb('Tq3zDrkf5MU') },
      { id: '3', title: 'Best Jazz Songs of All Time', channel: 'Jazz Classics', videoId: 'rUC3RJhpMpQ', thumbnailUrl: thumb('rUC3RJhpMpQ') },
    ],
    likeCount: 223,
    playCount: 3102,
  },
  {
    name: '미드나잇 드라이브',
    description: '밤 12시 텅 빈 도로를 달리는 기분. 신스웨이브와 전자음악으로 가득한 드라이브 믹스.',
    category: 'electronic',
    tags: ['midnight', 'drive', 'synthwave', 'electronic', '드라이브'],
    tracks: [
      { id: '1', title: 'Midnight City', artist: 'M83', genre: 'Synthpop' },
      { id: '2', title: 'A Real Hero', artist: 'College & Electric Youth', genre: 'Synthwave' },
      { id: '3', title: 'Night Call', artist: 'Kavinsky', genre: 'Synthwave' },
      { id: '4', title: 'Nightcall', artist: 'Kavinsky', genre: 'Synthwave' },
      { id: '5', title: 'Running in the Night', artist: 'FM-84', genre: 'Synthwave' },
      { id: '6', title: 'Turbo Killer', artist: 'Carpenter Brut', genre: 'Synthwave' },
    ],
    videos: [
      { id: '0', title: 'Synthwave - The Midnight Drive | 1 Hour', channel: 'Synthwave City', videoId: '4xDzrJKXOOY', thumbnailUrl: thumb('4xDzrJKXOOY') },
      { id: '1', title: 'Night Drive Synthwave Mix 🌃', channel: 'Retro Wave', videoId: 'DfGpTYHTLtg', thumbnailUrl: thumb('DfGpTYHTLtg') },
      { id: '2', title: 'Best Synthwave 2024 - Midnight Retro', channel: 'Midnight Synth', videoId: 'MEJFkCcBbOU', thumbnailUrl: thumb('MEJFkCcBbOU') },
      { id: '3', title: '한밤의 드라이브 신스웨이브 플레이리스트', channel: 'Synthwave KR', videoId: 'AbBzpUvpgCM', thumbnailUrl: thumb('AbBzpUvpgCM') },
    ],
    likeCount: 445,
    playCount: 6789,
  },
  {
    name: '실연 후 듣는 노래들',
    description: '아파도 괜찮아요. 마음껏 울어도 되는 밤. 실연의 슬픔을 음악으로 위로받으세요.',
    category: 'sad',
    tags: ['sad', 'breakup', '실연', '이별', '감성'],
    tracks: [
      { id: '1', title: 'Someone Like You', artist: 'Adele', genre: 'Pop/Soul' },
      { id: '2', title: 'The Night We Met', artist: 'Lord Huron', genre: 'Indie' },
      { id: '3', title: 'Skinny Love', artist: 'Bon Iver', genre: 'Folk' },
      { id: '4', title: 'Fix You', artist: 'Coldplay', genre: 'Rock' },
      { id: '5', title: 'When the Party Is Over', artist: 'Billie Eilish', genre: 'Pop' },
      { id: '6', title: 'Liability', artist: 'Lorde', genre: 'Indie Pop' },
    ],
    videos: [
      { id: '0', title: '이별 노래 모음 - 실연 후 듣는 음악 😢', channel: '감성 플레이리스트', videoId: 'hLQl3WyRoYk', thumbnailUrl: thumb('hLQl3WyRoYk') },
      { id: '1', title: 'Sad Songs Playlist - Heartbreak Mix', channel: 'Sad Music', videoId: 'NJuSStkIZBg', thumbnailUrl: thumb('NJuSStkIZBg') },
      { id: '2', title: 'Best Sad Songs 2024 - Breakup Playlist', channel: 'Emotional Hits', videoId: 'YVkUvmDQ3HY', thumbnailUrl: thumb('YVkUvmDQ3HY') },
      { id: '3', title: 'Adele - Complete Album Mix', channel: 'Adele Official', videoId: 'rYEDA3JcQqw', thumbnailUrl: thumb('rYEDA3JcQqw') },
    ],
    likeCount: 673,
    playCount: 9876,
  },
  {
    name: '보사노바 카페 BGM',
    description: '따뜻한 커피와 함께하는 브라질리안 보사노바. 카페에 있는 것 같은 기분을 즐겨보세요.',
    category: 'jazz',
    tags: ['bossa nova', 'cafe', 'jazz', 'chill', 'brazil'],
    tracks: [
      { id: '1', title: 'The Girl from Ipanema', artist: 'João Gilberto & Stan Getz', genre: 'Bossa Nova' },
      { id: '2', title: 'Corcovado', artist: 'João Gilberto', genre: 'Bossa Nova' },
      { id: '3', title: 'Mas Que Nada', artist: 'Sergio Mendes', genre: 'Bossa Nova' },
      { id: '4', title: 'Wave', artist: 'Tom Jobim', genre: 'Bossa Nova' },
      { id: '5', title: 'Garota de Ipanema', artist: 'Tom Jobim', genre: 'Bossa Nova' },
      { id: '6', title: 'Desafinado', artist: 'João Gilberto', genre: 'Bossa Nova' },
    ],
    videos: [
      { id: '0', title: 'Bossa Nova Cafe Music - Brazilian Jazz', channel: 'Bossa Nova Radio', videoId: 'Dx5qFachd3A', thumbnailUrl: thumb('Dx5qFachd3A') },
      { id: '1', title: '보사노바 카페 음악 모음 [2시간]', channel: 'Cafe BGM KR', videoId: 'vmDDOFXSgAs', thumbnailUrl: thumb('vmDDOFXSgAs') },
      { id: '2', title: 'Smooth Bossa Nova - Background Music', channel: 'Relaxing Records', videoId: 'Tq3zDrkf5MU', thumbnailUrl: thumb('Tq3zDrkf5MU') },
      { id: '3', title: 'The Best of Bossa Nova Collection', channel: 'Jazz Classics', videoId: 'rUC3RJhpMpQ', thumbnailUrl: thumb('rUC3RJhpMpQ') },
    ],
    likeCount: 189,
    playCount: 2567,
  },
  {
    name: '서머 팝 비치 파티',
    description: '해변에서 즐기는 여름 팝 컬렉션! 햇살과 바람, 그리고 신나는 음악으로 완성되는 여름.',
    category: 'happy',
    tags: ['summer', 'beach', 'pop', 'party', '여름'],
    tracks: [
      { id: '1', title: 'I Gotta Feeling', artist: 'The Black Eyed Peas', genre: 'Pop' },
      { id: '2', title: 'Summertime Sadness', artist: 'Lana Del Rey', genre: 'Pop' },
      { id: '3', title: 'Call Me Maybe', artist: 'Carly Rae Jepsen', genre: 'Pop' },
      { id: '4', title: 'Teenage Dream', artist: 'Katy Perry', genre: 'Pop' },
      { id: '5', title: 'Good Time', artist: 'Owl City & Carly Rae Jepsen', genre: 'Pop' },
      { id: '6', title: 'I Like It', artist: 'Cardi B', genre: 'Pop' },
    ],
    videos: [
      { id: '0', title: 'Summer Hits 2024 🌊 Best Pop Songs', channel: 'Summer Vibes', videoId: 'ZbZSe6N_BXs', thumbnailUrl: thumb('ZbZSe6N_BXs') },
      { id: '1', title: 'Beach Party Music Mix 2024 ☀️', channel: 'Beach Music', videoId: 'xdivHDRoFSM', thumbnailUrl: thumb('xdivHDRoFSM') },
      { id: '2', title: '여름 팝송 모음 Summer Pop Playlist', channel: 'Summer KR', videoId: 'H_D2fANAkY8', thumbnailUrl: thumb('H_D2fANAkY8') },
      { id: '3', title: 'Summer Pop Playlist 2024 - Happy Hits', channel: 'Pop Radio', videoId: 'Y66j_BUCBMY', thumbnailUrl: thumb('Y66j_BUCBMY') },
    ],
    likeCount: 345,
    playCount: 5432,
  },
  {
    name: '힙합 칠아웃',
    description: '긴장 풀고 여유롭게. 부드러운 비트의 힙합 칠아웃 컬렉션.',
    category: 'chill',
    tags: ['hip-hop', 'chill', 'R&B', 'rap', '힙합'],
    tracks: [
      { id: '1', title: 'Redbone', artist: 'Childish Gambino', genre: 'R&B/Hip-hop' },
      { id: '2', title: 'Location', artist: 'Khalid', genre: 'R&B' },
      { id: '3', title: 'HUMBLE.', artist: 'Kendrick Lamar', genre: 'Hip-hop' },
      { id: '4', title: 'Nights', artist: 'Frank Ocean', genre: 'R&B' },
      { id: '5', title: 'Ivy', artist: 'Frank Ocean', genre: 'R&B' },
      { id: '6', title: 'Slide', artist: 'H.E.R.', genre: 'R&B' },
    ],
    videos: [
      { id: '0', title: 'Chill Hip-hop Mix - Relaxing Rap Beats', channel: 'Hip-hop Chill', videoId: 'dPbA64SC1Gs', thumbnailUrl: thumb('dPbA64SC1Gs') },
      { id: '1', title: '힙합 칠아웃 믹스 - 릴렉싱 힙합', channel: 'Korean Hip-hop', videoId: 'MgEPJ7BmUhM', thumbnailUrl: thumb('MgEPJ7BmUhM') },
      { id: '2', title: 'Neo Soul Hip-hop Mix 2024', channel: 'Neo Soul Radio', videoId: 'n96hSxjKJqU', thumbnailUrl: thumb('n96hSxjKJqU') },
      { id: '3', title: 'Frank Ocean - Best Songs Playlist', channel: 'R&B Collection', videoId: 'GJhJUZ3UrKo', thumbnailUrl: thumb('GJhJUZ3UrKo') },
    ],
    likeCount: 267,
    playCount: 4123,
  },
  {
    name: '어쿠스틱 감성 인디',
    description: '기타 선율이 마음을 두드리는 어쿠스틱 인디 컬렉션. 잠시 스마트폰 내려놓고 감상해보세요.',
    category: 'chill',
    tags: ['acoustic', 'indie', '어쿠스틱', 'folk', '감성'],
    tracks: [
      { id: '1', title: 'The A Team', artist: 'Ed Sheeran', genre: 'Acoustic' },
      { id: '2', title: 'Skinny Love', artist: 'Bon Iver', genre: 'Folk' },
      { id: '3', title: 'Holocene', artist: 'Bon Iver', genre: 'Folk' },
      { id: '4', title: 'Little Lion Man', artist: 'Mumford & Sons', genre: 'Folk Rock' },
      { id: '5', title: 'Ho Hey', artist: 'The Lumineers', genre: 'Folk Rock' },
      { id: '6', title: 'Flightless Bird', artist: 'Iron & Wine', genre: 'Folk' },
    ],
    videos: [
      { id: '0', title: 'Acoustic Indie Folk Playlist 🎸', channel: 'Acoustic Music', videoId: 'EfTJBKf3aeQ', thumbnailUrl: thumb('EfTJBKf3aeQ') },
      { id: '1', title: '어쿠스틱 인디 감성 플레이리스트', channel: 'Acoustic KR', videoId: 'B4SKl_RLnZI', thumbnailUrl: thumb('B4SKl_RLnZI') },
      { id: '2', title: 'Ed Sheeran - Acoustic Playlist', channel: 'Ed Sheeran', videoId: 'TRKGy9o_5EU', thumbnailUrl: thumb('TRKGy9o_5EU') },
      { id: '3', title: 'Best Indie Folk Songs 2024', channel: 'Folk Radio', videoId: 'XeBUdW6giB4', thumbnailUrl: thumb('XeBUdW6giB4') },
    ],
    likeCount: 201,
    playCount: 2987,
  },
  {
    name: 'K-pop 댄스 챌린지',
    description: '최신 K-pop 댄스 챌린지 곡들만 모았습니다. 같이 춰보실래요?',
    category: 'energetic',
    tags: ['k-pop', 'dance', '댄스', 'energetic', 'challenge'],
    tracks: [
      { id: '1', title: 'Butter', artist: 'BTS', genre: 'K-pop' },
      { id: '2', title: 'How You Like That', artist: 'BLACKPINK', genre: 'K-pop' },
      { id: '3', title: 'Fancy', artist: 'TWICE', genre: 'K-pop' },
      { id: '4', title: 'Love Shot', artist: 'EXO', genre: 'K-pop' },
      { id: '5', title: 'Cherry Bomb', artist: 'NCT 127', genre: 'K-pop' },
      { id: '6', title: 'Red Flavor', artist: 'Red Velvet', genre: 'K-pop' },
    ],
    videos: [
      { id: '0', title: 'K-POP 댄스 챌린지 모음 2024 🕺', channel: 'KPOP Dance', videoId: 'CevxZvSJLk8', thumbnailUrl: thumb('CevxZvSJLk8') },
      { id: '1', title: 'Best K-pop Dance Hits 2024', channel: 'KPOP World', videoId: 'gdZLi9oWNZg', thumbnailUrl: thumb('gdZLi9oWNZg') },
      { id: '2', title: 'BLACKPINK - Dance Playlist', channel: 'YG Entertainment', videoId: 'PFnDOmLmUYU', thumbnailUrl: thumb('PFnDOmLmUYU') },
      { id: '3', title: 'TWICE - Best Songs Mix', channel: 'JYP Entertainment', videoId: 'dU2GjWTMySE', thumbnailUrl: thumb('dU2GjWTMySE') },
    ],
    likeCount: 523,
    playCount: 8901,
  },
  {
    name: '앰비언트 우주 여행',
    description: '광활한 우주를 여행하는 기분. 사운드스케이프와 앰비언트 음악으로 떠나는 상상 속 우주 탐험.',
    category: 'ambient',
    tags: ['ambient', 'space', '앰비언트', 'relaxing', 'cosmic'],
    tracks: [
      { id: '1', title: 'Music for Airports 1/1', artist: 'Brian Eno', genre: 'Ambient' },
      { id: '2', title: 'An Ending (Ascent)', artist: 'Brian Eno', genre: 'Ambient' },
      { id: '3', title: 'The Tired Sounds', artist: 'Stars of the Lid', genre: 'Ambient' },
      { id: '4', title: 'Fade to White', artist: 'Ulrich Schnauss', genre: 'Ambient' },
      { id: '5', title: 'Untitled 1 (Vaka)', artist: 'Sigur Rós', genre: 'Post-rock/Ambient' },
      { id: '6', title: 'Ára bátur', artist: 'Sigur Rós', genre: 'Post-rock/Ambient' },
    ],
    videos: [
      { id: '0', title: 'Space Ambient Music - 4K Space Journey', channel: 'Ambient Space', videoId: 'FjHGZj2IjBk', thumbnailUrl: thumb('FjHGZj2IjBk') },
      { id: '1', title: 'Ambient Music for Deep Relaxation', channel: 'Ambient World', videoId: 'rkZl7pt9gnE', thumbnailUrl: thumb('rkZl7pt9gnE') },
      { id: '2', title: 'Space Soundscape - 10 Hours Ambient', channel: 'Space Music', videoId: '77ZozI0rw7w', thumbnailUrl: thumb('77ZozI0rw7w') },
      { id: '3', title: '우주 앰비언트 힐링음악', channel: 'Ambient KR', videoId: 'AbBzpUvpgCM', thumbnailUrl: thumb('AbBzpUvpgCM') },
    ],
    likeCount: 134,
    playCount: 1876,
  },
  {
    name: '가을 감성 빠져들기',
    description: '낙엽이 지는 가을, 창가에 앉아 따뜻한 차 한 잔과 함께 듣기 좋은 음악들.',
    category: 'chill',
    tags: ['autumn', 'fall', '가을', 'melancholy', 'chill'],
    tracks: [
      { id: '1', title: 'September', artist: 'Earth, Wind & Fire', genre: 'Funk' },
      { id: '2', title: 'Autumn in New York', artist: 'Ella Fitzgerald', genre: 'Jazz' },
      { id: '3', title: 'Cinnamon Girl', artist: 'Lana Del Rey', genre: 'Indie Pop' },
      { id: '4', title: '1950', artist: 'King Princess', genre: 'Indie Pop' },
      { id: '5', title: 'Golden Hour', artist: 'JVKE', genre: 'Pop' },
      { id: '6', title: 'Exile', artist: 'Taylor Swift ft. Bon Iver', genre: 'Folk Pop' },
    ],
    videos: [
      { id: '0', title: '가을 감성 플레이리스트 🍂 Autumn Chill', channel: '가을 음악', videoId: 'xbTmFNSgHVs', thumbnailUrl: thumb('xbTmFNSgHVs') },
      { id: '1', title: 'Autumn Lo-fi Mix - Chill Vibes 🍁', channel: 'Autumn Beats', videoId: 'q76bMs-NwRk', thumbnailUrl: thumb('q76bMs-NwRk') },
      { id: '2', title: 'Fall Aesthetic Music Playlist', channel: 'Cozy Autumn', videoId: 'qH3H3vCbZ8A', thumbnailUrl: thumb('qH3H3vCbZ8A') },
      { id: '3', title: 'Lo-fi Autumn Study Mix', channel: 'Lo-fi Seasons', videoId: 'F4WKxYWlQjY', thumbnailUrl: thumb('F4WKxYWlQjY') },
    ],
    likeCount: 289,
    playCount: 3456,
  },
  {
    name: '겨울 감성 힐링',
    description: '눈이 내리는 겨울밤, 따뜻한 실내에서 즐기는 포근한 음악 모음.',
    category: 'chill',
    tags: ['winter', 'chill', '겨울', 'cozy', 'healing'],
    tracks: [
      { id: '1', title: 'Let It Snow!', artist: 'Frank Sinatra', genre: 'Jazz/Pop' },
      { id: '2', title: 'White Christmas', artist: 'Bing Crosby', genre: 'Pop' },
      { id: '3', title: 'River', artist: 'Joni Mitchell', genre: 'Folk' },
      { id: '4', title: 'Blue', artist: 'A Great Big World', genre: 'Indie Pop' },
      { id: '5', title: 'The Christmas Song', artist: 'Nat King Cole', genre: 'Jazz' },
      { id: '6', title: 'Have Yourself a Merry Little Christmas', artist: 'Judy Garland', genre: 'Jazz' },
    ],
    videos: [
      { id: '0', title: '겨울 감성 플레이리스트 ❄️ Winter Mood', channel: '겨울 음악', videoId: 'n61ULEU7CO0', thumbnailUrl: thumb('n61ULEU7CO0') },
      { id: '1', title: 'Cozy Winter Music - Fireplace Ambience', channel: 'Winter Vibes', videoId: 'kgx4WGK0oNU', thumbnailUrl: thumb('kgx4WGK0oNU') },
      { id: '2', title: 'Christmas Jazz - Winter Playlist', channel: 'Winter Jazz', videoId: 'DWcJFNfaw9c', thumbnailUrl: thumb('DWcJFNfaw9c') },
      { id: '3', title: 'Peaceful Winter Piano Music', channel: 'Winter Piano', videoId: '5qap5aO4i9A', thumbnailUrl: thumb('5qap5aO4i9A') },
    ],
    likeCount: 412,
    playCount: 5678,
  },
  {
    name: '소울 R&B 디바',
    description: '강렬한 보컬과 감성 넘치는 소울 R&B. 영혼을 울리는 명곡들.',
    category: 'R&B',
    tags: ['soul', 'R&B', 'diva', 'gospel', 'classic'],
    tracks: [
      { id: '1', title: 'Respect', artist: 'Aretha Franklin', genre: 'Soul' },
      { id: '2', title: 'Superstition', artist: 'Stevie Wonder', genre: 'Soul/R&B' },
      { id: '3', title: 'A Change Is Gonna Come', artist: 'Sam Cooke', genre: 'Soul' },
      { id: '4', title: 'Natural Woman', artist: 'Aretha Franklin', genre: 'Soul' },
      { id: '5', title: 'My Girl', artist: 'The Temptations', genre: 'Soul' },
      { id: '6', title: "What's Going On", artist: 'Marvin Gaye', genre: 'Soul' },
    ],
    videos: [
      { id: '0', title: 'Classic Soul & R&B Hits Playlist 🎤', channel: 'Soul Music Classics', videoId: 'kXYiU_JCYtU', thumbnailUrl: thumb('kXYiU_JCYtU') },
      { id: '1', title: 'Best Soul Songs Ever - R&B Legends', channel: 'R&B Legends', videoId: 'mhZgQsHnKys', thumbnailUrl: thumb('mhZgQsHnKys') },
      { id: '2', title: 'Aretha Franklin - Greatest Hits', channel: 'Atlantic Records', videoId: 'n96hSxjKJqU', thumbnailUrl: thumb('n96hSxjKJqU') },
      { id: '3', title: 'Classic Soul Radio - 24/7 Live', channel: 'Soul Radio Live', videoId: 'GJhJUZ3UrKo', thumbnailUrl: thumb('GJhJUZ3UrKo') },
    ],
    likeCount: 156,
    playCount: 2234,
  },
  {
    name: '인디 포크 힐링',
    description: '마음이 복잡할 때 듣는 따뜻한 인디 포크. 자연 속으로 떠나고 싶어지는 음악들.',
    category: 'indie',
    tags: ['indie', 'folk', 'healing', '힐링', 'acoustic'],
    tracks: [
      { id: '1', title: 'Fast Car', artist: 'Tracy Chapman', genre: 'Folk Rock' },
      { id: '2', title: 'Lua', artist: 'Bright Eyes', genre: 'Folk' },
      { id: '3', title: 'Poison & Wine', artist: 'The Civil Wars', genre: 'Folk' },
      { id: '4', title: 'Stubborn Love', artist: 'The Lumineers', genre: 'Folk Rock' },
      { id: '5', title: 'Helplessness Blues', artist: 'Fleet Foxes', genre: 'Folk' },
      { id: '6', title: 'White Winter Hymnal', artist: 'Fleet Foxes', genre: 'Folk' },
    ],
    videos: [
      { id: '0', title: 'Indie Folk Playlist - Nature Vibes 🌿', channel: 'Folk Indie Music', videoId: 'EfTJBKf3aeQ', thumbnailUrl: thumb('EfTJBKf3aeQ') },
      { id: '1', title: 'Best Indie Folk Songs - Relaxing Mix', channel: 'Indie Folk Radio', videoId: 'XeBUdW6giB4', thumbnailUrl: thumb('XeBUdW6giB4') },
      { id: '2', title: 'Fleet Foxes - Complete Collection', channel: 'Indie Music', videoId: 'B4SKl_RLnZI', thumbnailUrl: thumb('B4SKl_RLnZI') },
      { id: '3', title: '힐링 인디 포크 플레이리스트', channel: 'Healing Folk KR', videoId: 'TRKGy9o_5EU', thumbnailUrl: thumb('TRKGy9o_5EU') },
    ],
    likeCount: 198,
    playCount: 2876,
  },
  {
    name: '일렉트로닉 드림팝',
    description: '몽환적인 신디사이저와 드리미한 보컬. 일렉트로닉 드림팝으로 떠나는 상상 속 여행.',
    category: 'electronic',
    tags: ['electronic', 'dream-pop', 'shoegaze', 'ambient', 'indie'],
    tracks: [
      { id: '1', title: 'When the Sun Hits', artist: 'Slowdive', genre: 'Shoegaze' },
      { id: '2', title: 'Sometimes', artist: 'My Bloody Valentine', genre: 'Shoegaze' },
      { id: '3', title: 'Fade Into You', artist: 'Mazzy Star', genre: 'Dream Pop' },
      { id: '4', title: 'Space Song', artist: 'Beach House', genre: 'Dream Pop' },
      { id: '5', title: 'Myth', artist: 'Beach House', genre: 'Dream Pop' },
      { id: '6', title: 'Silver Soul', artist: 'Beach House', genre: 'Dream Pop' },
    ],
    videos: [
      { id: '0', title: 'Dream Pop & Shoegaze Mix 🌙', channel: 'Dream Pop Radio', videoId: 'MEJFkCcBbOU', thumbnailUrl: thumb('MEJFkCcBbOU') },
      { id: '1', title: 'Electronic Dream Beats - Chill Mix', channel: 'Electronic Chill', videoId: 'AbBzpUvpgCM', thumbnailUrl: thumb('AbBzpUvpgCM') },
      { id: '2', title: 'Shoegaze Masterpieces Playlist', channel: 'Shoegaze World', videoId: 'DfGpTYHTLtg', thumbnailUrl: thumb('DfGpTYHTLtg') },
      { id: '3', title: 'Beach House - Best Songs Mix', channel: 'Sub Pop Records', videoId: '4xDzrJKXOOY', thumbnailUrl: thumb('4xDzrJKXOOY') },
    ],
    likeCount: 167,
    playCount: 2345,
  },
  {
    name: '봄날 산책 플레이리스트',
    description: '벚꽃이 피는 봄날, 가볍게 걷고 싶은 기분. 상쾌하고 밝은 음악들로 채운 산책 플레이리스트.',
    category: 'happy',
    tags: ['spring', 'walk', '봄', '산책', 'fresh'],
    tracks: [
      { id: '1', title: 'Here Comes the Sun', artist: 'The Beatles', genre: 'Rock/Pop' },
      { id: '2', title: 'Walking on Sunshine', artist: 'Katrina and the Waves', genre: 'Pop' },
      { id: '3', title: 'Mr. Blue Sky', artist: 'Electric Light Orchestra', genre: 'Pop Rock' },
      { id: '4', title: 'Good Day Sunshine', artist: 'The Beatles', genre: 'Rock/Pop' },
      { id: '5', title: 'Lovely Day', artist: 'Bill Withers', genre: 'Soul' },
      { id: '6', title: 'You Make My Dreams', artist: 'Hall & Oates', genre: 'Pop' },
    ],
    videos: [
      { id: '0', title: '봄날 산책 음악 🌸 Spring Walk Playlist', channel: 'Spring Music KR', videoId: 'Y66j_BUCBMY', thumbnailUrl: thumb('Y66j_BUCBMY') },
      { id: '1', title: 'Happy Spring Pop Mix 2024', channel: 'Good Vibes Music', videoId: 'ZbZSe6N_BXs', thumbnailUrl: thumb('ZbZSe6N_BXs') },
      { id: '2', title: 'Walking Music Playlist - Feel Good Mix', channel: 'Walking Music', videoId: 'H_D2fANAkY8', thumbnailUrl: thumb('H_D2fANAkY8') },
      { id: '3', title: 'Best Spring Songs - Uplifting Playlist', channel: 'Spring Hits', videoId: 'xdivHDRoFSM', thumbnailUrl: thumb('xdivHDRoFSM') },
    ],
    likeCount: 234,
    playCount: 3201,
  },
  {
    name: '클래식 피아노 릴렉스',
    description: '바흐, 쇼팽, 드뷔시... 시대를 초월한 클래식 피아노 명곡들로 마음을 정화하세요.',
    category: 'classical',
    tags: ['classical', 'piano', '클래식', 'relaxing', '피아노'],
    tracks: [
      { id: '1', title: 'Clair de Lune', artist: 'Debussy', genre: 'Classical' },
      { id: '2', title: 'Moonlight Sonata', artist: 'Beethoven', genre: 'Classical' },
      { id: '3', title: 'Prelude in C Major', artist: 'Bach', genre: 'Baroque' },
      { id: '4', title: 'Nocturne Op.9 No.2', artist: 'Chopin', genre: 'Classical' },
      { id: '5', title: 'Gymnopédie No.1', artist: 'Erik Satie', genre: 'Classical' },
      { id: '6', title: 'Für Elise', artist: 'Beethoven', genre: 'Classical' },
    ],
    videos: [
      { id: '0', title: 'Relaxing Classical Piano Music - Chopin', channel: 'Classical Piano', videoId: 'mDDP1tSyKh8', thumbnailUrl: thumb('mDDP1tSyKh8') },
      { id: '1', title: 'Best Classical Piano Pieces - 1 Hour', channel: 'Classical Music Radio', videoId: 'WPni755-Krg', thumbnailUrl: thumb('WPni755-Krg') },
      { id: '2', title: '클래식 피아노 릴렉스 - 1시간', channel: 'Classic Piano KR', videoId: '1ZYbU82GVz4', thumbnailUrl: thumb('1ZYbU82GVz4') },
      { id: '3', title: 'Debussy - Clair de Lune (Full)', channel: 'Piano Classics', videoId: 'aLqc8TDmq2k', thumbnailUrl: thumb('aLqc8TDmq2k') },
    ],
    likeCount: 345,
    playCount: 5123,
  },
  {
    name: '여름 해변 칠아웃',
    description: '눈 감으면 파도 소리가 들리는 것 같은 여름 바이브. 휴가를 떠난 기분으로 즐겨보세요.',
    category: 'chill',
    tags: ['summer', 'beach', 'chill', '여름', '바다'],
    tracks: [
      { id: '1', title: 'Ocean Eyes', artist: 'Billie Eilish', genre: 'Pop' },
      { id: '2', title: 'Waves', artist: 'Mr. Probz', genre: 'Pop' },
      { id: '3', title: 'Three Little Birds', artist: 'Bob Marley', genre: 'Reggae' },
      { id: '4', title: 'California Gurls', artist: 'Katy Perry', genre: 'Pop' },
      { id: '5', title: 'Under the Bridge', artist: 'Red Hot Chili Peppers', genre: 'Rock' },
      { id: '6', title: 'Island in the Sun', artist: 'Weezer', genre: 'Indie Rock' },
    ],
    videos: [
      { id: '0', title: '여름 바다 음악 🌊 Beach Chill Mix', channel: 'Beach Vibes KR', videoId: 'F4WKxYWlQjY', thumbnailUrl: thumb('F4WKxYWlQjY') },
      { id: '1', title: 'Summer Beach Chill - Tropical Mix', channel: 'Tropical Beats', videoId: 'qH3H3vCbZ8A', thumbnailUrl: thumb('qH3H3vCbZ8A') },
      { id: '2', title: 'Chillout Summer Lounge Music', channel: 'Summer Chill', videoId: 'q76bMs-NwRk', thumbnailUrl: thumb('q76bMs-NwRk') },
      { id: '3', title: 'Ocean Waves + Relaxing Music Mix', channel: 'Ocean Sounds', videoId: 'xbTmFNSgHVs', thumbnailUrl: thumb('xbTmFNSgHVs') },
    ],
    likeCount: 378,
    playCount: 5891,
  },
  {
    name: '힐링 모닝 루틴',
    description: '좋은 아침! 상쾌한 아침을 시작하기 위한 부드럽고 밝은 음악들. 오늘도 좋은 하루 보내세요.',
    category: 'happy',
    tags: ['morning', 'healing', '아침', 'fresh', 'chill'],
    tracks: [
      { id: '1', title: 'Beautiful Day', artist: 'U2', genre: 'Rock' },
      { id: '2', title: 'Rise Up', artist: 'Andra Day', genre: 'Gospel/Soul' },
      { id: '3', title: 'Three Little Birds', artist: 'Bob Marley', genre: 'Reggae' },
      { id: '4', title: 'Good Vibrations', artist: 'The Beach Boys', genre: 'Pop Rock' },
      { id: '5', title: 'Here Comes the Sun', artist: 'The Beatles', genre: 'Rock/Pop' },
      { id: '6', title: 'On Top of the World', artist: 'Imagine Dragons', genre: 'Indie Rock' },
    ],
    videos: [
      { id: '0', title: '아침 루틴 모닝 음악 ☀️ Morning Playlist', channel: 'Morning Music KR', videoId: 'DWcJFNfaw9c', thumbnailUrl: thumb('DWcJFNfaw9c') },
      { id: '1', title: 'Morning Motivation Music - Fresh Start', channel: 'Morning Vibes', videoId: 'jfKfPfyJRdk', thumbnailUrl: thumb('jfKfPfyJRdk') },
      { id: '2', title: 'Uplifting Morning Songs Playlist', channel: 'Good Morning Music', videoId: '5qap5aO4i9A', thumbnailUrl: thumb('5qap5aO4i9A') },
      { id: '3', title: 'Positive Morning Music for Energy', channel: 'Energy Music', videoId: 'kgx4WGK0oNU', thumbnailUrl: thumb('kgx4WGK0oNU') },
    ],
    likeCount: 289,
    playCount: 4123,
  },
  {
    name: '클럽 바이브 EDM 2024',
    description: '클럽에 있는 것 같은 강렬한 EDM 믹스. 귀를 꽉 채우는 베이스와 드롭.',
    category: 'energetic',
    tags: ['club', 'EDM', 'dance', 'bass', '클럽'],
    tracks: [
      { id: '1', title: 'Tremor', artist: 'Martin Garrix & Dimitri Vegas', genre: 'EDM' },
      { id: '2', title: 'In My Head', artist: 'Armin van Buuren', genre: 'Trance' },
      { id: '3', title: 'Spectrum', artist: 'Zedd', genre: 'EDM' },
      { id: '4', title: 'Silence', artist: 'Marshmello & Khalid', genre: 'EDM' },
      { id: '5', title: 'Stay', artist: 'Zedd & Alessia Cara', genre: 'EDM' },
      { id: '6', title: 'The Middle', artist: 'Zedd, Maren Morris & Grey', genre: 'EDM' },
    ],
    videos: [
      { id: '0', title: 'Club EDM Mix 2024 🔥 Drop Zone', channel: 'EDM Club Mix', videoId: 'XWEAzXF7OeM', thumbnailUrl: thumb('XWEAzXF7OeM') },
      { id: '1', title: 'Best Club Songs 2024 - EDM Bangers', channel: 'Club Music', videoId: 'P02mJMIBpbI', thumbnailUrl: thumb('P02mJMIBpbI') },
      { id: '2', title: 'EDM Mix 2024 | Bass Boosted Hits', channel: 'Bass Nation', videoId: 'S_ChkTFokDM', thumbnailUrl: thumb('S_ChkTFokDM') },
      { id: '3', title: 'Martin Garrix - Ultimate Playlist 2024', channel: 'STMPD RCRDS', videoId: 'dPbA64SC1Gs', thumbnailUrl: thumb('dPbA64SC1Gs') },
    ],
    likeCount: 456,
    playCount: 7234,
  },
  {
    name: '로파이 스터디 마라톤',
    description: '밤새 공부해야 할 때 필요한 집중력을 유지해주는 로파이 비트. 논스톱 공부 최적화 믹스.',
    category: 'focus',
    tags: ['lo-fi', 'study', 'focus', '공부', 'marathon'],
    tracks: [
      { id: '1', title: 'midnight study vibes', artist: 'eevee', genre: 'Lo-fi' },
      { id: '2', title: 'cozy afternoon', artist: 'Kupla', genre: 'Lo-fi' },
      { id: '3', title: 'warm coffee', artist: 'Jinsang', genre: 'Lo-fi' },
      { id: '4', title: 'late night feelings', artist: 'Philanthrope', genre: 'Lo-fi' },
      { id: '5', title: 'space', artist: 'Tenno', genre: 'Lo-fi' },
      { id: '6', title: 'reminiscence', artist: 'Eevee', genre: 'Lo-fi' },
    ],
    videos: [
      { id: '0', title: 'lofi hip hop radio 📚 - beats to study to', channel: 'Lofi Girl', videoId: '5qap5aO4i9A', thumbnailUrl: thumb('5qap5aO4i9A') },
      { id: '1', title: 'Lo-fi Study Marathon - 4 Hours Mix', channel: 'Study Lo-fi', videoId: 'jfKfPfyJRdk', thumbnailUrl: thumb('jfKfPfyJRdk') },
      { id: '2', title: '공부 마라톤 로파이 4시간', channel: 'Study Marathon KR', videoId: 'n61ULEU7CO0', thumbnailUrl: thumb('n61ULEU7CO0') },
      { id: '3', title: 'Lo-fi Chill Beats - Deep Study Session', channel: 'Chill Beats', videoId: 'kgx4WGK0oNU', thumbnailUrl: thumb('kgx4WGK0oNU') },
    ],
    likeCount: 534,
    playCount: 9012,
  },
];

async function main() {
  // 시드 유저 생성 (upsert로 중복 방지)
  const user1 = await prisma.user.upsert({
    where: { firebaseUid: 'seed-curator-001' },
    update: {},
    create: {
      firebaseUid: 'seed-curator-001',
      email: 'curator@moodtune.dev',
      displayName: '무드튠 큐레이터',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { firebaseUid: 'seed-explorer-002' },
    update: {},
    create: {
      firebaseUid: 'seed-explorer-002',
      email: 'explorer@moodtune.dev',
      displayName: '음악 탐험가',
    },
  });

  console.log(`✅ 유저 생성: ${user1.displayName}, ${user2.displayName}`);

  // 기존 시드 플레이리스트 삭제 (멱등성 보장 — 재실행 시 중복 방지)
  await prisma.playlist.deleteMany({
    where: { userId: { in: [user1.id, user2.id] } },
  });

  // 플레이리스트 생성 (홀/짝 인덱스로 두 유저에 분배)
  for (let i = 0; i < PLAYLISTS.length; i++) {
    const p = PLAYLISTS[i];
    const userId = i % 2 === 0 ? user1.id : user2.id;

    await prisma.playlist.create({
      data: {
        userId,
        name: p.name,
        description: p.description,
        category: p.category,
        tags: p.tags,
        tracks: p.tracks as unknown as Prisma.InputJsonValue,
        videos: p.videos as unknown as Prisma.InputJsonValue,
        isPublic: true,
        likeCount: p.likeCount,
        playCount: p.playCount,
      },
    });
  }

  console.log(`✅ 플레이리스트 ${PLAYLISTS.length}개 생성 완료`);
  console.log('🎵 MoodTune 시드 데이터 생성 완료!');
}

main()
  .catch((e) => {
    console.error('❌ 시드 오류:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
