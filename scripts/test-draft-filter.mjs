/* 校验 store.js 的草稿过滤：草稿不对外渲染，但仍保留在缓存里供后台读取。
   运行：node scripts/test-draft-filter.mjs */
import assert from 'node:assert';

const mem = new Map();
globalThis.localStorage = {
  getItem: k => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
};

const { store } = await import('../js/store.js');

store.setArticles([
  { id: 'published-one', title: '已发布', status: 'published' },
  { id: 'draft-one', title: '草稿', status: 'draft' },
  { id: 'rain-city', title: '遗留演示内容', status: 'published' },
]);

const visible = store.getArticles();
assert.deepStrictEqual(
  visible.map(a => a.id),
  ['published-one'],
  '站点只应渲染「已发布且非遗留」的文章'
);

const cached = JSON.parse(mem.get('fc_articles'));
assert.ok(
  cached.some(a => a.id === 'draft-one'),
  '草稿必须保留在缓存中，否则后台读不到'
);
assert.ok(
  !cached.some(a => a.id === 'rain-city'),
  '遗留演示内容应被清除'
);

store.setPhotoStories([
  { id: 'photo-live', status: 'published' },
  { id: 'photo-draft', status: 'draft' },
]);
assert.deepStrictEqual(
  store.getPhotoStories().map(p => p.id),
  ['photo-live'],
  '摄影集同样应过滤草稿'
);

console.log('✅ 草稿过滤测试通过');
