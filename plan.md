# OPEN - 参考图驱动开发计划

> 依据：`OPEN_Project_Guide.md`、用户提供的 2026-08-07 首页参考图、`identity-skill`。  
> 当前状态：进入第五步“高保真复刻与 QA”。`v2` 参考图组、reference-to-build map 与十二张图片 stand-in 已完成并审核；用户已批准 Music 使用不可播放的 `replace-later` 占位状态并确认继续实现。

## 1. 目标与边界

将仓库根目录中的现有原生 HTML/CSS/JavaScript SPA 重构为 **OPEN**：一个暗色编辑式的个人文学与摄影档案站。首页以参考图为桌面视觉基线，采用顶部导航、左侧 Identity、中间 Archive、右侧 Others 的三栏结构；移动端按内容优先级单栏重排。

首发范围：

- Archive 首页：文章与摄影统一混排
- 文章详情：适合长文阅读的编辑式版面
- 摄影详情：封面、图组和创作说明
- About 页面或视图
- Archive / Notes / Photos 筛选
- Recent、Statistics、Calendar 与 Music
- GitHub Pages 兼容的静态发布

保留现有 Supabase 作为公开文章云端数据源，并保留滚轮翻页交互；不新增在线 CMS 或新的后端依赖。点赞和评论仍属于旧产品形态，除非后续明确确认，否则不迁入新版界面。

## 2. 已确认基线

### 内容与站点形态

- 站点名称：OPEN
- 定位：个人文学档案、摄影作品收藏与长期生活记录
- 核心文案：`记录文字，保存瞬间。`
- 内容类型：首发以 `essay` 与 `photo` 为主，共用统一 Archive Item 模型
- 视觉方向：Dark Editorial Archive
- 桌面结构：顶部导航 + Identity / Archive / Others 三栏
- 移动结构：Identity 摘要 -> Archive -> Others；不压缩保留三栏
- 内容发布：Supabase 作为文章主数据源，公开访客读取同一批内容；静态演示数据作为首次加载和云端失败兜底
- 翻页交互：保留桌面端滚轮翻页，但改造成可发现、可访问且不拦截正常页面滚动的增强交互
- Music：首发保留，使用浏览器原生音频播放能力，音源与封面均通过数据字段配置
- 占位策略：真实头像和作品未提供时允许使用明确标记的 `replace-later` 素材

### 参考图视觉锚点

- 近黑页面背景、低对比暗色面板、细边框和少量冷蓝 active state
- 顶部约 56px 的轻量导航，OPEN wordmark 位于左侧
- 左栏为稳定的书籍扉页式身份区，中栏承担主要视觉重量，右栏为纵向生活组件
- Archive 使用不同跨列/跨行尺寸的摄影与文章卡片，图片主导、元数据克制
- 主焦点是中栏 Archive 首组内容；Identity 和 Others 是辅助锚点
- 圆角克制，面板和卡片不使用夸张漂浮感

## 3. 现状审计

### 实际仓库

项目文件直接位于仓库根目录，并不存在旧计划描述的 `site/`：

```text
index.html
css/
js/
README.md
vercel.json
```

技术栈是无构建步骤的原生 HTML/CSS/JavaScript SPA，通过 JS 字符串模板渲染页面。当前存在 `home`、`article`、`photos` 三种页面状态，并接入 Supabase 文章同步与 localStorage 点赞/评论。

### 与目标的主要差距

| 范围 | 当前实现 | 目标 | 结论 |
| --- | --- | --- | --- |
| 全局视觉 | 暖白背景、单列 720px | 暗色编辑式、全宽三栏 | 需重建 |
| 首页架构 | 公告、搜索、文章列表、个人卡 | Identity / Archive / Others | 需重建 |
| 内容模型 | 仅文章为主，照片是独立 URL 数组 | essay/photo 统一 Archive Item | 需重构 |
| 导航 | 首页/文章/照片墙，emoji 图标 | Archive/Notes/Photos/About + 工具图标 | 需重构 |
| 详情页 | 通用文章卡 + 点赞评论 | 编辑式文章页与摄影叙事页 | 需重建 |
| 路由 | 内存状态，无 URL 持久化 | GitHub Pages 可刷新路径或可靠 hash 路由 | 需决策 |
| 响应式 | 单列缩窄 | 桌面三栏、移动单栏重排 | 需重建 |
| 素材 | 头像与照片均未落地 | 真实头像、封面、摄影图组或已批准替身 | 阻塞素材阶段 |
| 证据 | 无锁定参考、manifest、截图证据 | identity-skill 全套证据 | 尚未验证 |

## 4. 分阶段执行与硬门槛

### 第一步 / 内容与风格锁定

现有 `OPEN_Project_Guide.md` 已覆盖站点目标、受众倾向、视觉方向、主要页面和占位内容。进入下一步前仍需明确：

- 首页一句话与 About 文案哪些是最终内容，哪些仍是占位
- 头像、社交链接、首批真实文章和摄影是否已有来源
- 点赞和评论是否需要迁移到新版界面

验收：内容状态分别标为 `ready`、`needs detail`、`placeholder` 或 `cut`，不把建议标题当作真实作品。

### 第二步 / 参考图锁定

把用户提供的首页图作为候选 anchor reference，先完成可实施性和视觉意义审查，再由用户确认锁定版本。

必须产出：

- `docs/reference-production-plan.md`：style fingerprint 与各页面/section 参考图计划
- 每个 section 的 render contract 和 meaning contract
- 首页及详情页所需的 section 级横向参考图；不能用一张首页图替代所有页面基线
- `references/locked/v1/`：确认后保存的不可覆盖参考图
- `docs/identity-evidence.json`：锁定文件 SHA-256 与 active version

首页候选 render contract：

- 类型：`C2 independent-media`
- Code layer：导航、Identity 文案与链接、Archive 卡片文字/标签、Recent、Statistics、Calendar、Music 控件
- Independent media：头像、Archive 封面、可选音乐封面
- Music source：优先使用项目内合法 MP3 文件或用户拥有使用权的 HTTPS 音频直链；播放器 UI 与播放状态由代码实现，不把音频嵌入参考图
- 禁止融合：不得把导航、卡片标题、日期、统计或日历烘进图片；不同 Archive 项目不能共享跨卡片阴影或遮挡
- 响应式：桌面三栏；移动端独立媒体随卡片重排，不能依赖单张整屏截图内部搬移

验收：逐图通过三秒传达、单一主焦点、个人证据、完整构图、响应式和可复刻性审查。

### 第三步 / 素材拆分清单

为每张已锁定参考图建立 `reference-to-build map` 和 asset manifest，明确：

- `code-native`：布局、文字、导航、图标、边框、日历、统计和交互
- `ready/find-copy`：用户头像、真实作品封面、摄影图组、音乐封面
- `generate`：只允许不承载真实作品主张的氛围或替身素材
- `replace-later`：用户明确接受的头像或作品占位
- `blocked/redesign-required`：无法诚实替代或无法可靠拆层的区域

验收：用户确认素材边界与来源策略。在此之前不修改 HTML、CSS、JS、route 或 component。

### 第四步 / 素材生成审核

只整理或生成第三步获批的素材，保存到稳定路径，逐项记录来源、宽高比、裁切、用途和状态。输出简短复刻执行 brief，锁定全局 design token、字体角色、导航、移动行为、素材路径和允许偏差。

验收：所有必需素材均为 `ready`、`code-native` 或已批准 `replace-later`，且用户接受素材审核和复刻执行 brief。通过后才允许编辑前端代码。

### 第五步 / 高保真复刻与 QA

采用 `identity-skill/references/frontend-app-builder.md` 作为 build owner fallback，按 section slice 实现并验收：

1. 全局 token、顶部导航和响应式 shell
2. Identity
3. Archive header 与统一 Archive Item 数据层
4. Archive grid/card 各尺寸变体
5. Recent / Statistics / Calendar / Music
6. 文章详情
7. 摄影详情
8. About 与筛选/路由

每完成一个 section，先在参考 viewport 截图并与锁定参考并排检查，再继续下一项。最终必须覆盖：

- desktop `1440 x 900`
- ultrawide（最终在 evidence manifest 中锁定尺寸）
- mobile `390 x 844`
- 连续滚动转场、键盘焦点、触控区域、`prefers-reduced-motion`
- 图片安全裁切、文本溢出、语义重叠、GitHub Pages 路径与刷新行为

最终证据：

- `qa/desktop/`、`qa/ultrawide/`、`qa/mobile/` 的逐 section PNG
- `docs/fidelity-ledger.md`
- `docs/fresh-review.md`
- 完整的 `docs/identity-evidence.json`
- `verify_identity_run.py` 退出码为 0，并完成人工逐图审查

## 5. 实施决策

- 保留无构建静态架构，除非 URL 路由或 Markdown 生成确实需要轻量构建脚本。
- 优先使用 hash 路由或生成静态详情页，避免当前内存路由在刷新时丢失状态。
- 统一 Archive Item 数据源，首页卡片、筛选和两种详情页只消费同一模型。
- Supabase 保留为文章云端主数据源；所有访客通过公开只读 RLS 获取相同文章。静态数据兜底只负责可用性，不覆盖成功拉取的云端内容。
- Supabase 的写入与删除继续要求认证；前端只暴露 publishable/anon key，权限由 RLS 管理，不放置 service-role key。
- 摄影元数据首轮可使用静态数据；若以后也需要免部署发布，再扩展 Supabase schema，不在本轮临时混入第二套接口。
- Music 使用 `<audio>`/`HTMLAudioElement` 播放。推荐把自有或获授权 MP3 放在 `assets/audio/`，也支持允许跨站播放且稳定的 HTTPS 直链；不引用网页播放器页面地址，不抓取受版权保护的流媒体音源。
- 滚轮翻页作为渐进增强保留：仅在明确控件获得 hover/focus 时响应，正常页面滚动、键盘导航和移动触控不受影响。
- 图标使用一致的图标集或克制的 code-native 图标，不使用 emoji 充当正式 UI 图标。
- 所有色彩通过 design token 管理，不在 section 内重复目测取色。
- 真实头像与作品素材优先；占位内容必须有 `replace-later` 标记，不能伪装成用户真实作品。

## 6. 当前下一步

- 已锁定 `references/locked/v2/` 的 Archive、Essay、Photo Story 与 About 四张参考图，并记录不可覆盖哈希。
- 已确认第三步素材拆分；十二张图片 stand-in 均已保存到稳定路径并完成第四步像素审核。
- 点赞与评论按已确认范围 `cut`；Supabase、受控滚轮翻页与原生 `<audio>` Music 保留。
- 当前唯一素材缺口是 Music 的合法可播放来源：用户自有/获授权 MP3，或许可与跨域播放均明确的 HTTPS 直链。
- 音源落实后，输出最终复刻执行 brief 并请求第四次确认。确认后读取 builder/evidence 契约，进入第五步逐 section 高保真复刻与 QA。

## 7. 交互回归修复（2026-08-07）

- 搜索：增加遮罩区域点击、关闭按钮和 Escape 关闭，保留标题/地点/日期筛选。
- 显示设置：用可见面板替代无样式 class 切换，并持久化高对比度、大号正文和减少动效偏好。
- Photos：`#/photos` 显示摄影集目录，`#/photos/<id>` 显示独立摄影故事。
- Notes：上一篇/下一篇从真实文章集合计算，不再使用固定 ID 或跳入摄影集。
- 验收：覆盖桌面与移动端点击、键盘、路由刷新、无重叠和 identity 证据验证。

## 8. 详情返回与健壮性修复（2026-08-09）

- 来源返回：Notes 文章返回 Notes，Photos 详情返回摄影集目录；Archive 直达详情仍返回 Archive。
- 刷新语义：直接刷新文章详情默认归属 Notes，直接刷新摄影详情默认归属 Photos。
- 路由兜底：未知 hash 统一替换为 `#/archive`，避免 URL 与页面状态不一致。
- UI 状态：文章详情顶部导航和返回文案跟随真实来源。
- 安全与错误反馈：净化 Markdown HTML 和媒体属性；后台插图、粘贴图片与批量照片上传显示成功或失败状态。
