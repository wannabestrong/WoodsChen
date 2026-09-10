# OPEN

## Content backend setup

For the Supabase content backend, run the complete
`supabase/content-admin.sql` file once in the Supabase SQL Editor. It creates
the content tables when absent and configures the `open-media` Storage bucket
with public read plus authenticated write RLS policies. The migration is safe
to re-run. Do not run the older standalone `articles` SQL below separately.

OPEN 是一个暗色编辑风格的个人文学与摄影档案网站，使用原生 HTML、CSS 和 JavaScript 构建，无需打包。文章由 Supabase 提供公开只读数据，摄影作品与界面素材随静态站点部署。

## 功能

- Archive、Notes、Photos、About 四个视图
- Supabase 云端文章与 Markdown 正文
- `#/admin` 内容后台：文章/摄影集、封面、插图和批量照片上传
- 静态内容兜底，云端暂时不可用时网站仍可浏览
- Archive 搜索与文章筛选
- 摄影故事、图片灯箱和 Escape 关闭
- 受控滚轮翻页，不拦截普通页面滚动
- 桌面、超宽屏和移动端响应式布局

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

## Supabase 基础配置

首次创建项目时，站点从 `public.articles` 读取以下字段：

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

以上是基础表结构。启用当前内容后台时，请继续执行 `supabase/content-admin.sql`；该脚本会补齐新字段、摄影集、图片存储和完整权限策略。

前端只能使用 Supabase Project URL 和 publishable/anon key。不要把 service role key、登录密码或其他私密密钥提交到仓库。

完整的文章发布、照片更新、个人信息修改和部署步骤见 [工作手册.md](工作手册.md)。代码架构、数据流、扩展边界和维护风险见 [项目解释与维护文档](docs/project-explanation.md)。

## 启用内容后台

1. 在 Supabase SQL Editor 执行 `supabase/content-admin.sql`。
2. 确认 Authentication 中已有你的邮箱用户。
3. 访问 `https://你的域名/#/admin`。
4. 登录后选择“文章”或“摄影集”发布内容。

后台支持 Markdown 实时预览、资源管理器选择图片、剪贴板图片粘贴、封面上传、摄影集批量照片排序，以及草稿/发布状态。图片存储在公开读取、仅认证用户可写的 `open-media` bucket。

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

- 云端文章和摄影集可通过 `#/admin` 发布；未执行后台迁移时继续使用静态兜底内容。
- 后台当前适合新建内容，或使用相同 ID 覆盖更新；已有内容列表、载入编辑和删除界面尚未实现。
- 头像、About 文案和部分图片仍是已批准的 `replace-later` 内容。

## 验证

```powershell
node --check js/app.js
node --check js/router.js
python D:\identity-skill-main\identity-skill-main\scripts\verify_identity_run.py D:\WoodsChen
```

最终视觉和响应式验收记录位于 `docs/fidelity-ledger.md`、`docs/fresh-review.md` 与 `docs/identity-evidence.json`。
