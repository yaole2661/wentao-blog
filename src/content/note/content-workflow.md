---
title: 博客内容工作流说明
date: 2026-09-08
category: note
draft: true
tags: [建站, 工作流]
summary: 本博客发布文章、导入 Word/PPT、嵌入视频的完整操作说明（内部文档，默认不发布）。
---

> 本文是给站主自己看的工作流说明，属于内部文档，长期保持 `draft: true`。

## 一、发布文章的完整流程

1. 写 Markdown 文件，放到 `src/content/<分类>/` 下（分类可选：`research` / `ai` / `note`，需与 frontmatter 的 `category` 一致，否则构建报错）
2. 文件命名：`xxx.md`，文件名即文章 URL：`/posts/<文件名>/`（若以 `YYYY-MM-DD-` 开头会自动去掉日期前缀）
3. 新文章 frontmatter 必须带 `draft: true` —— **草稿只存在本地，线上任何页面（列表/分类/标签/归档/搜索/RSS/sitemap/详情页）都不会出现**
4. 本地预览：`npm run dev`，浏览器看效果
5. 决定发布时：把 `draft: true` 改成 `draft: false`（或直接删掉这行）→ 提交推送 → Vercel 自动构建上线

### frontmatter 模板

```yaml
---
title: 文章标题
date: 2026-09-08
category: ai          # research / ai / note 三选一
tags: [标签1, 标签2]
summary: 一句话摘要，用于列表页和 SEO 描述。
aiSummary: false      # summary 是否 AI 生成，true 时文章页会标注
cover: /covers/xxx.svg  # 可选封面图，放 public/covers/ 下
featured: false       # true 时进入首页右侧「精选」榜单
draft: true           # 发布前保持 true
---
```

## 二、支持的格式与转换

**站点内容入口只认 Markdown（`.md`）。** 其他格式需先转换，本机已装 pandoc 3.11（`C:\Users\van25\.local\bin\pandoc\`，已加入 PATH）。

### Word (.docx) → Markdown

已实测通过，标题、加粗、链接、列表、表格都能完整保留：

```powershell
pandoc 稿件.docx -o draft.md --extract-media=media --wrap=none
```

- 正文输出到 `draft.md`，Word 里的图片会解压到 `media/` 目录并在文中生成引用
- 转换后需要人工做的三件事：
  1. 把 `media/` 里的图片移到 `public/uploads/<文章名>/`，并修正文中路径为 `/uploads/<文章名>/xxx.png`
  2. 在文件开头补上 frontmatter（模板见上）
  3. 检查表格（Word 复杂表格如合并单元格会退化成普通表格，需要手动整理）
- 不想自己操作的话，把 .docx 放进项目目录后让 AI 助手完成整条链路即可

### PPT (.pptx) → 文章

不建议直接转（演示文稿结构和文章结构不匹配）。推荐做法：

1. PPT 里每页的核心文字作为文章骨架（`pandoc deck.pptx` 也能抽取，但会带大量碎片）
2. 每页截图（或只截关键图表）作为文章配图
3. 演讲稿/备注写成正文段落

### 纯文本 / 微信文章 / 网页

直接把内容粘贴给 AI 助手整理成带 frontmatter 的 MD 即可，无需 pandoc。

## 三、嵌入视频

对标 Gates Notes 的做法：**视频托管在外部平台，文章里只放 iframe 嵌入**（Vercel 免费带宽 100GB/月，绝不要自己托管视频文件）。

- 国内读者优先：视频传 B 站 → 分享 → 复制「嵌入代码」→ 粘进 Markdown 正文
- YouTube：用 `https://www.youtube.com/embed/<视频ID>` 包一层 iframe
- 文章正文已有的样式会自动把 iframe 处理成 16:9 自适应宽度（含手机端），直接贴原始 embed 代码即可，不需要写宽高属性

建议每篇带视频的文章都配一段文字摘要，这样 RSS 和搜索引擎都能正常抓取。

## 四、图片规范

- 站内图片统一放 `public/` 下（如 `public/uploads/<文章名>/`），引用用绝对路径 `/uploads/...`
- 优先 PNG/WebP；截图类文章配图控制在 200KB/张 以内，超大图先压缩
- 封面图（`cover` 字段）建议 1200×630，用于 og:image 分享卡片

## 五、发布检查清单

发布前逐项确认：

- [ ] frontmatter 的 `category` 和所在目录一致
- [ ] `summary` 非空（列表页和 SEO 描述用）
- [ ] 图片路径以 `/` 开头且文件存在
- [ ] `npm run build` 通过（构建报错通常是缺 category 或目录不匹配）
- [ ] 确认无误后把 `draft` 改为 `false`，提交推送
