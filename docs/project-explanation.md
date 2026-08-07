# OPEN 项目解释与维护文档

本文面向后续接手开发的维护者，解释 OPEN 的运行方式、代码职责、数据流、扩展边界和修改注意事项。日常内容操作请同时参考根目录的 `工作手册.md`。

## 1. 项目定位

OPEN 是一个无构建步骤的静态单页网站：

- 原生 HTML、CSS、JavaScript ES module。
- 浏览器端 Hash 路由。
- Supabase 负责文章云端存储和认证发布。
- 摄影故事、头像、封面与页面文案目前随 Git 仓库部署。
- `marked` 负责 Markdown 渲染，Lucide 负责界面图标，二者从 CDN 加载。
- 可直接部署到 GitHub Pages 或 Vercel。

项目没有 Node 运行时依赖、`package.json` 或编译产物。浏览器加载的就是仓库中的源文件。

## 2. 运行入口

`index.html` 创建三个顶层节点：

```text
#top-nav       顶部导航，由 JavaScript 渲染
#content       当前页面内容，由 Router 替换
#scroll-arrow  受控滚轮/点击翻页按钮
```

页面加载顺序：

```text
index.html
  -> js/app.js
     -> renderFromLocation()
        -> router.render()
           -> renderNav()
           -> renderXxx()
           -> bindXxxEvents()
     -> setupScrollArrow()
     -> initSupabase()
        -> loadArticlesFromServer()
        -> store.setArticles()
        -> dispatch "fc:articles-updated"
        -> router.render()
```

`app.js` 是唯一主入口，负责初始化、云端文章更新监听和底部翻页按钮。页面选择和具体渲染不应继续塞进 `app.js`。

## 3. 路由与页面状态

路由位于 `js/router.js`，使用 URL Hash，适合 GitHub Pages：

| URL | 内部状态 | 页面 |
| --- | --- | --- |
| `#/archive` | `page=home, filter=all` | 完整 Archive |
| `#/notes` | `page=home, filter=essay` | 文章筛选 |
| `#/photos/<id>` | `page=photos, articleId=<id>` | 对应 Photo Story |
| `#/about` | `page=about` | About |
| `#/essay/<id>` | `page=article, articleId=<id>` | 文章详情 |

核心状态：

```js
state = {
  page: 'home',
  articleId: null,
  filter: 'all'
};
```

调用 `navigate(page, data)` 会：

1. 更新内存状态。
2. 通过 `history.pushState` 更新 Hash。
3. 调用 `render()` 替换导航和主内容。
4. 调用对应的事件绑定函数。

新增页面时，需要同时修改：

1. `js/router.js` 的 import。
2. `renderFromLocation()` 的 Hash 解析。
3. `navigate()` 的 Hash 生成规则（如有特殊参数）。
4. `render()` 的 switch。
5. `js/components/nav.js` 的导航项（如果需要顶栏入口）。
6. 新页面自己的 CSS 和 `index.html` 样式引用。

## 4. 渲染模型

页面模块遵循两段式接口：

```js
renderXxx();      // 返回 HTML 字符串
bindXxxEvents();  // HTML 插入 DOM 后绑定交互
```

Router 使用 `container.innerHTML = renderXxx()`，因此每次导航都会销毁旧页面 DOM 和旧节点监听器。维护时必须遵守：

- 不要在 `renderXxx()` 内直接查询 DOM，渲染时节点尚未插入。
- DOM 事件放进对应的 `bindXxxEvents()`。
- 如果事件绑定在 `window` 或 `document` 上，重新渲染前必须移除旧监听器，避免闭包引用旧 DOM。
- 顶部导航由 `renderNav()` 自己绑定；页面绑定器不要再次对整个文档的顶部导航重复绑定。

`home.js` 的搜索使用模块级 `activeSearchHandler`，每次渲染先移除旧监听器。这是为了防止搜索事件操作已经被销毁的 overlay。

## 5. 模块版本参数

模块和 CSS URL 带有缓存版本，例如：

```js
import { navigate } from '../router.js?v=9';
```

```html
<script type="module" src="js/app.js?v=9"></script>
```

重要规则：同一次发布必须让整个 ES module 依赖图使用同一个版本号。不要只修改一两个 import。

原因：浏览器会把 `router.js?v=9` 和 `router.js?v=10` 视为两个不同模块，分别创建两份 `state`。导航可能更新其中一份状态，而页面由另一份状态渲染，表现为点击后又回到旧页面。

发布 JavaScript 或 CSS 修改时：

1. 将当前版本统一提升，例如 `v=9` 改为 `v=10`。
2. 使用 `rg "\\?v=9" index.html js` 找出全部引用。
3. 确认旧版本号没有残留。

## 6. 页面职责

### `js/pages/home.js`

负责：

- Identity 左栏。
- Archive/Notes 筛选。
- Archive 卡片数据和布局类型。
- Recent、Statistics、Calendar、Music。
- 搜索 overlay。
- Archive 卡片到文章或摄影页的导航。

`DEMO_ITEMS` 是静态内容和云端失败兜底。`cloudItems()` 将 Supabase 文章转换为 Archive Item。`items()` 把云端文章与静态项目合并，并限制为 8 项。

当前云端文章没有 `cover_url`，因此会轮换使用静态 essay 封面。

### `js/pages/article.js`

负责文章详情：

- 根据 `articleId` 从本地 store 查找云端文章。
- 未命中时使用 `DEMO_ESSAYS` 和占位正文。
- Markdown 渲染。
- 详情页返回与上一篇/下一篇按钮。

目前文章底部主图固定为 `rain-city-cover.png`，上一篇/下一篇也是静态关系，不会根据 Supabase 列表自动计算。

### `js/pages/photos.js`

负责统一 Photo Story：

- 摄影集标题、日期和地点。
- 主封面和序列图片。
- 点击图片打开灯箱。
- Escape 或点击 overlay 关闭灯箱。

每个 `type: 'photo'` 的 Archive 卡片会进入 `#/photos/<id>`。`PHOTO_STORIES` 负责把 ID 映射到标题、地点、日期、封面、序列图片和说明；首页卡片 ID 与该映射必须一致。

### `js/pages/about.js`

负责 About 的头像、个人说明、联系链接和 Archive Index。当前头像和个人介绍仍属于 `replace-later` 内容。

### `js/components/nav.js`

负责顶栏、当前页面 active state、全局搜索触发和高对比显示设置。页面模块通过 `icon()` 复用 Lucide 占位标签。

## 7. 文章数据流

相关文件：

- `js/supabase.js`：云端读取、认证、发布、删除。
- `js/store.js`：`localStorage` 缓存。
- `js/pages/home.js`：将文章转为首页卡片。
- `js/pages/article.js`：按 ID 读取正文。

读取流程：

```text
Supabase public.articles
  -> loadArticlesFromServer()
  -> store.setArticles(data)
  -> localStorage.fc_articles
  -> fc:articles-updated
  -> render()
  -> Archive / Article 使用最新数据
```

失败策略：Supabase 请求失败时保留已有 localStorage 或静态 DEMO 内容，不清空页面。

当前字段：

```text
id, title, date, summary, content
```

前端配置中的 Project URL 和 publishable/anon key 可公开，但安全依赖 RLS。绝对不能在前端加入 service role key。

## 8. 增加文章封面字段

未来需要每篇云端文章拥有独立封面时，推荐扩展，而不是继续轮换占位图：

1. Supabase 增加 `cover_url text default ''`。
2. `loadArticlesFromServer()` 的 select 增加 `cover_url`。
3. `publishArticle()` 的 row 接收 `cover_url`。
4. `cloudItems()` 使用 `article.cover_url || fallbackImage`。
5. 工作手册增加 Storage 上传和发布示例。
6. 检查空 URL、加载失败、横竖图裁切和移动端表现。

如果还需要地点和卡片尺寸，也可增加 `place`、`card_size`，但 `card_size` 必须做白名单校验。

## 9. 摄影集数据模型的推荐升级

摄影数量增加后，建议建立独立数据文件 `js/data/photo-stories.js`：

```js
export const PHOTO_STORIES = [
  {
    id: 'mountain-lake',
    title: '山与湖的对话',
    place: 'Dali',
    date: '2026.07.28',
    cover: 'assets/archive/mountain-lake-cover.png',
    gallery: [
      { src: '...', alt: '...', orientation: 'landscape' }
    ],
    note: '...'
  }
];
```

摄影集已经同时支持 `#/photos/<id>` 独立路由和 Supabase `photo_stories` 数据。静态 `PHOTO_STORIES` 继续作为云端不可用时的兜底内容。

## 10. 样式系统

### 文件职责

| 文件 | 职责 |
| --- | --- |
| `css/global.css` | 颜色 token、基础排版、顶栏、按钮、翻页控件、响应式基础 |
| `css/home.css` | 三栏 Archive、卡片尺寸、Others、搜索、移动端重排 |
| `css/article.css` | 文章阅读面板、Markdown、详情分页 |
| `css/photos.css` | 摄影故事、序列和灯箱 |
| `css/about.css` | About 双栏和移动端布局 |

设计 token 应集中在 `:root`，页面 CSS 优先引用 token，不要在每个页面重新目测颜色。

维护视觉时至少检查：

- `1440x900` 桌面。
- `2200x1200` 超宽屏。
- `390x844` 手机。
- 中文长标题换行。
- 图片 `object-fit` 和主体安全裁切。
- 普通滚动不被翻页功能拦截。
- `prefers-reduced-motion`。

## 11. 素材边界

| 目录 | 内容 |
| --- | --- |
| `assets/archive/` | Archive 封面和摄影序列 |
| `assets/avatar/` | 头像 |
| `assets/music/` | Music 封面 |
| `assets/audio/` | 未来合法音源，当前不存在 |

当前部分视觉素材是经过审核的生成占位图。替换真实素材时，应尽量保持现有宽高比、主体位置、色调和视觉重量，否则参考图和 QA 基线会失效。

不要将参考图本身裁切后作为生产素材。`references/` 是对照基线，不是网站资源目录。

## 12. Music 的实现边界

当前 Music 仅展示封面和禁用控制。启用时需要：

- 合法的本地 MP3 或允许跨域播放的 HTTPS 音频直链。
- `<audio>` 或 `HTMLAudioElement`。
- 播放/暂停状态、进度、时长、上一首/下一首。
- 加载失败和不可播放状态。
- 移动端自动播放限制测试。
- 不抓取受版权保护的流媒体地址。

音源未准备好前，保持按钮禁用比伪造静音文件更诚实。

## 13. 外部依赖与离线行为

`index.html` 从 CDN 加载：

- `marked`。
- `lucide`。

`supabase.js` 从 jsDelivr 加载 Supabase ESM。

因此项目虽然没有安装依赖，但首次加载仍依赖网络。CDN 不可用时：

- Markdown 由 `renderMarkdown()` 的 fallback 行为决定。
- Lucide 图标可能保留未转换的 `<i>` 占位。
- Supabase 云端同步不可用，静态/本地缓存内容仍可显示。

需要完全离线时，应把这些库固定版本下载到项目内，并更新 CSP/引用路径。

## 14. 部署

### GitHub Pages

- 发布分支：`main`。
- 发布目录：仓库根目录。
- 路由使用 Hash，不需要 404 回退。

### Vercel

`vercel.json` 指定：

```json
{
  "framework": null,
  "buildCommand": "",
  "outputDirectory": ".",
  "cleanUrls": true
}
```

即直接托管根目录静态文件，无构建命令。

## 15. 修改后的验证流程

最低技术检查：

```powershell
node --check js/app.js
node --check js/router.js
node --check js/pages/home.js
node --check js/pages/article.js
node --check js/pages/photos.js
node --check js/pages/about.js
git diff --check
```

本地功能检查：

1. `#/archive` 正常加载。
2. Notes 进入 `#/notes` 且只显示 essay。
3. 搜索能过滤卡片并能关闭。
4. 文章点击后进入正确 `#/essay/<id>`。
5. 刷新详情 URL 后仍显示同一文章。
6. Photo Story 灯箱能打开，Escape 能关闭。
7. 翻页按钮 click、键盘和 hover/focus 后滚轮行为正常。
8. Music 在无音源时保持禁用。
9. Console 没有项目代码错误。

涉及视觉结构或素材替换时，还要更新 `qa/` 截图、`docs/fidelity-ledger.md` 和 `docs/identity-evidence.json`，并运行 identity verifier。

## 16. 已知限制

- Archive 最多合并显示 8 项，没有分页。
- 云端文章已有独立封面和发布状态，但没有地点或卡片尺寸字段。
- 后台尚未提供已有内容列表、载入编辑和删除按钮。
- 文章详情固定使用一张占位主图。
- 上一篇/下一篇关系为静态内容。
- 摄影集优先读取 Supabase，`PHOTO_STORIES` 静态映射作为兜底。
- About 与社交链接仍含占位内容。
- Music 尚未接入音源。
- 依赖三个外部 CDN 模块。
- `store.js` 仍保留旧 likes/comments 键，但当前产品界面不使用它们；除非单独清理旧数据模型，不要仅为整洁随意删除。

## 17. 推荐的后续维护优先级

1. 替换真实头像、About 文案和社交链接。
2. 为后台增加已有内容列表、载入编辑和删除能力。
3. 为上传后被替换或删除的图片增加 Storage 清理机制。
4. 获得合法音源后完成 Music。
5. 内容规模超过 8 项后增加完整 Archive 分页或加载策略。
7. 如果长期维护，考虑加入最小化自动测试和本地化依赖。

每次扩展都应优先保持现有内容边界和视觉基线，不要把一次内容更新顺带变成无关的大规模重构。

## 18. 内容后台

后台路由为 `#/admin`，页面文件是 `js/pages/admin.js`，样式是 `css/admin.css`。它不出现在公开导航中，只能通过地址进入；真正的权限由 Supabase Auth、表 RLS 和 Storage policy 控制，隐藏入口本身不是安全措施。

数据库迁移位于 `supabase/content-admin.sql`，负责：

- 扩展 `articles.cover_url/status/updated_at`。
- 创建 `photo_stories`。
- 创建 `open-media` Storage bucket。
- 公开读取已发布内容，认证用户可读草稿并写入内容。
- 公开读取媒体，认证用户可上传、更新和删除媒体。

后台当前支持新建和使用相同 ID 覆盖更新；尚未提供内容列表、加载已有内容到表单和删除按钮。需要管理既有内容时暂时使用 Supabase Table Editor，后续可在后台增加管理列表。
