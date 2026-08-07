# OPEN

OPEN 是一个暗色编辑风格的个人文学与摄影档案网站，使用原生 HTML、CSS 和 JavaScript 构建，无需打包。文章由 Supabase 提供公开只读数据，摄影作品与界面素材随静态站点部署。

## 功能

- Archive、Notes、Photos、About 四个视图
- Supabase 云端文章与 Markdown 正文
- 静态内容兜底，云端暂时不可用时网站仍可浏览
- Archive 搜索与文章筛选
- 摄影故事、图片灯箱和 Escape 关闭
- 受控滚轮翻页，不拦截普通页面滚动
- 桌面、超宽屏和移动端响应式布局
- Music 保留为等待合法音源的禁用占位状态

## 本地预览

项目依赖 ES module 和远程 CDN，不建议直接双击 `index.html`。在项目根目录启动静态服务器：

```powershell
python -m http.server 4173
```

然后访问：

```text
http://127.0.0.1:4173/#/archive
```

## 目录结构

```text
.
|-- index.html                 # 网站入口
|-- assets/                    # 头像、Archive、摄影和音乐封面素材
|-- css/                       # 全局及各页面样式
|-- js/
|   |-- app.js                 # 初始化、滚轮翻页
|   |-- router.js              # Hash 路由
|   |-- store.js               # 文章本地缓存
|   |-- supabase.js            # Supabase 读取和发布接口
|   |-- components/            # 导航等共享组件
|   `-- pages/                 # Archive、文章、摄影、About 页面
|-- docs/                      # 设计、素材和验收记录
|-- references/                # 锁定参考图
|-- qa/                        # 多视口验收截图
`-- 工作手册.md                 # 网站内容维护指南
```

## Supabase

当前站点从 `public.articles` 读取以下字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `text` | 唯一 ID，推荐使用英文短横线，例如 `night-walk` |
| `title` | `text` | 文章标题 |
| `date` | `text` | `YYYY-MM-DD` |
| `summary` | `text` | 摘要，可为空 |
| `content` | `text` | Markdown 正文 |

推荐的表与 RLS：

```sql
create table if not exists public.articles (
  id text primary key,
  title text not null,
  date text default '',
  summary text default '',
  content text default '',
  created_at timestamptz default now()
);

alter table public.articles enable row level security;

create policy "public can read articles"
on public.articles for select
using (true);

create policy "authenticated users can insert articles"
on public.articles for insert
to authenticated
with check (true);

create policy "authenticated users can delete articles"
on public.articles for delete
to authenticated
using (true);
```

前端只能使用 Supabase Project URL 和 publishable/anon key。不要把 service role key、登录密码或其他私密密钥提交到仓库。

完整的文章发布、照片更新、个人信息修改和部署步骤见 [工作手册.md](工作手册.md)。代码架构、数据流、扩展边界和维护风险见 [项目解释与维护文档](docs/project-explanation.md)。

## 部署

这是根目录即可发布的静态站点，可部署到 GitHub Pages 或 Vercel。

GitHub Pages：

1. 将仓库推送到 GitHub。
2. 打开仓库的 `Settings > Pages`。
3. Source 选择 `Deploy from a branch`。
4. 选择 `main` 和 `/ (root)`。
5. 保存并等待部署完成。

Hash 路由使用 `#/archive`、`#/notes`、`#/photos`、`#/about` 和 `#/essay/<id>`，刷新详情页时不需要服务器重写规则。

## 内容边界

- 云端文章：首页封面暂时从三张 essay 占位图中轮换，Supabase 当前没有独立 `cover_url` 字段。
- 摄影内容：目前写在 `js/pages/home.js` 和 `js/pages/photos.js`，修改后需要重新部署。
- 头像、About 文案和部分图片仍是已批准的 `replace-later` 内容。
- Music 没有音源文件，获得合法 MP3 或可跨域播放的 HTTPS 直链后再启用。

## 验证

```powershell
node --check js/app.js
node --check js/router.js
python D:\identity-skill-main\identity-skill-main\scripts\verify_identity_run.py D:\WoodsChen
```

最终视觉和响应式验收记录位于 `docs/fidelity-ledger.md`、`docs/fresh-review.md` 与 `docs/identity-evidence.json`。
