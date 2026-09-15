/* =========================================
   store.js — localStorage 统一读写封装
   ========================================= */

const KEYS = {
  articles: 'fc_articles',
  photoStories: 'fc_photo_stories',
  likes:    'fc_likes',
  likedBy:  'fc_liked_by',
  comments: 'fc_comments',
};

const LEGACY_IDS = new Set([
  'rain-city', 'loneliness', 'mountain-lake', 'future-self',
  'dusk-tram', 'unfinished-thoughts', 'seaside-evening', 'window-light',
]);

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    const value = raw ? JSON.parse(raw) : fallback;
    if (key === KEYS.articles || key === KEYS.photoStories) {
      if (!Array.isArray(value)) return fallback;
      const cleaned = value.filter(item => !LEGACY_IDS.has(String(item?.id)));
      if (raw && cleaned.length !== value.length) localStorage.setItem(key, JSON.stringify(cleaned));
      /* 草稿保留在缓存中（后台需要读），但不对站点渲染 */
      return cleaned.filter(item => item?.status !== 'draft');
    }
    return value;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota exceeded — silently fail */
  }
}

export const store = {
  getArticles()    { return read(KEYS.articles, []); },
  setArticles(v)   { write(KEYS.articles, v); },
  getPhotoStories(){ return read(KEYS.photoStories, []); },
  setPhotoStories(v){ write(KEYS.photoStories, v); },

  getLikes()       { return read(KEYS.likes, {}); },
  setLikes(v)      { write(KEYS.likes, v); },

  getLikedBy()     { return read(KEYS.likedBy, {}); },
  setLikedBy(v)    { write(KEYS.likedBy, v); },

  getComments()    { return read(KEYS.comments, {}); },
  setComments(v)   { write(KEYS.comments, v); },
};
