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
│   ├── photos.css      ← 照片墙 + 灯箱
│   └── guestbook.css   ← 留言板
├── js/
│   ├── app.js          ← 入口 + 底部箭头
│   ├── router.js       ← SPA 路由 + 页面调度
│   ├── store.js        ← localStorage 封装
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

## 如何发布文章

打开浏览器，访问你的网站，按 **F12** 打开控制台，在 Console 中执行：

```js
const KEY = 'fc_articles';
const articles = JSON.parse(localStorage.getItem(KEY) || '[]');
articles.push({
  id: Date.now().toString(),        // 唯一 ID，自动生成
  title: '文章标题',
  date: '2026-07-27',
  summary: '简短摘要（可选）',
  content: '# 正文\n\n支持 **Markdown** 格式。\n\n- 列表\n- 列表\n\n> 引用'
});
localStorage.setItem(KEY, JSON.stringify(articles));
location.reload();
```

Markdown 支持：标题、加粗、斜体、图片 `![alt](url)`、代码块、引用、列表、表格、链接等。

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

- 纯静态，零构建，零依赖（Markdown 渲染使用 marked.js CDN）
- SPA 单页应用，所有页面切换无刷新
- 文章、点赞、评论、留言数据均存储在浏览器的 localStorage 中
- 适配手机、平板、桌面
- 底部箭头：鼠标悬停 + 滚轮切换页面；移动端双击切换
