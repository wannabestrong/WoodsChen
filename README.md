# ForestChen 个人网站

基于原生 HTML + CSS + JavaScript 的纯静态个人网站，托管于 GitHub Pages。

## 文件结构

```
site/
├── index.html          ← 入口页面
├── css/                ← 样式文件（按页面拆分）
│   ├── global.css      ← 全局变量、重置、导航、箭头
│   ├── home.css        ← 首页
│   ├── article.css     ← 文章详情
│   └── photos.css      ← 照片墙 + 灯箱
├── js/
│   ├── app.js          ← 入口 + 底部箭头 + 云端同步初始化
│   ├── router.js       ← SPA 路由 + 页面调度
│   ├── store.js        ← localStorage 封装（本地缓存）
│   ├── supabase.js     ← 文章云端同步（Supabase）
│   ├── pages/          ← 页面渲染 + 事件
│   ├── components/     ← 可复用组件
│   └── utils/          ← 工具函数
├── img/
│   └── avatar.png      ← 你的头像
└── README.md
```

## 如何替换头像

将你的头像图片重命名为 `avatar.png`，放入 `site/img/` 目录覆盖原文件即可。

推荐图片尺寸：**200×200 像素或更大**的方形图片。支持 PNG / JPG 格式。

## 配置文章云端同步（Supabase）

文章存储在云端，任意浏览器/设备都能看到同一份内容。

### 1. 创建 Supabase 项目

1. 打开 [supabase.com](https://supabase.com)，注册并创建项目（免费档足够）
2. 进入项目 → **Settings → API**，复制 **Project URL** 和 **anon public key**

### 2. 创建登录账号（仅你可登录发布）

进入项目 → **Authentication → Users → Add user**，创建一个你自己的账号（邮箱 + 密码），后续发布文章用这个账号登录。

### 3. 建表

进入项目 → **SQL Editor**，执行：

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

-- 任何人可阅读文章
create policy "公开可读文章" on public.articles
  for select using (true);

-- 仅登录用户可发布文章
create policy "仅登录者可发布文章" on public.articles
  for insert to authenticated with check (true);

-- 仅登录用户可删除文章
create policy "仅登录者可删除文章" on public.articles
  for delete to authenticated using (true);
```

> 如果你之前执行过旧的「公开可发布文章」策略，请先删掉它：
> ```sql
> drop policy if exists "公开可发布文章" on public.articles;
> ```

### 4. 填写密钥

编辑 `site/js/supabase.js`，替换两处占位符：

```js
const SUPABASE_URL = 'https://xxxx.supabase.co';  // 你的 Project URL
const SUPABASE_ANON_KEY = 'eyJhbGci...';          // 你的 anon public key
```

> 说明：URL 和 anon key 是公开的（Supabase 客户端专用），可直接写在前端。
> 真正的权限由 RLS 策略控制：任何人可读，但只有登录后的你才能发布/删除。

## 如何发布文章

打开浏览器，访问你的网站，按 **F12** 打开控制台，先登录（只需一次，之后浏览器会自动保持登录）：

```js
await ForestChenAPI.signIn('你的邮箱', '你的密码');
```

然后发布：

```js
await ForestChenAPI.publishArticle({
  title: '文章标题',
  date: '2026-07-27',
  summary: '简短摘要（可选）',
  content: '# 正文\n\n支持 **Markdown** 格式。\n\n- 列表\n- 列表\n\n> 引用'
});
```

文章会自动同步到云端，并在首页显示。其它浏览器/设备刷新后即可看到。

删除文章：

```js
await ForestChenAPI.deleteArticle('文章id');  // id 可从下方本地缓存查看
```

退出登录：

```js
await ForestChenAPI.signOut();
```

- Markdown 支持：标题、加粗、斜体、图片 `![alt](url)`、代码块、引用、列表、表格、链接等。
- 本地缓存：`fc_articles`（localStorage）是离线的文章缓存，云端优先。

## 如何添加照片

编辑 `site/js/pages/photos.js`，找到 `PHOTO_URLS` 数组：

```js
const PHOTO_URLS = [
  'img/photos/photo01.jpg',
  'img/photos/photo02.jpg',
  'https://example.com/remote-photo.jpg',  // 也支持远程 URL
];
```

将你的照片放入 `site/img/photos/` 目录，然后在这里添加路径。保存后刷新页面即可看到。

## 如何部署

### 部署到 GitHub Pages

1. 将 `site/` 目录内的**全部文件**推送到你的 GitHub 仓库
2. 打开仓库 → **Settings** → **Pages**
3. **Source** 选择 `Deploy from a branch`
4. **Branch** 选择 `main`，文件夹选 `/ (root)`（如果 repo 根目录就是 site 内容）或 `/site`
5. 点击 Save，等待几分钟即可访问

### 绑定自定义域名

1. 在 Settings → Pages → **Custom domain** 中输入 `forestchen.com`
2. 在你的域名 DNS 中添加一条 **CNAME 记录**，指向 `<你的用户名>.github.io`
3. 勾选 **Enforce HTTPS**（可能需要等证书自动签发）

## 技术说明

- 纯静态，零构建，零依赖（Markdown 渲染使用 marked.js CDN，云端同步使用 Supabase CDN）
- SPA 单页应用，所有页面切换无刷新
- 文章存储在 Supabase 云端（任意浏览器/设备同步），localStorage 仅作离线缓存
- 点赞、评论数据仍存储在浏览器本地
- 适配手机、平板、桌面
- 底部箭头：鼠标悬停 + 滚轮切换页面；移动端双击切换
