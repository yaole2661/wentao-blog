# Wentao's blog · Astro 静态博客

企业研究（创业探索）+ 前沿 AI（现代 AI 沉淀）+ 随笔笔记，三主题个人博客。
技术栈：Astro 5 静态生成 + Content Layer 内容集合 + Vercel 部署，零后端、零运维。

## 一、本地运行

前置：Node.js 18+。

```bash
npm install        # 安装依赖
npm run dev        # 本地预览，默认 http://localhost:4321
npm run build      # 生成静态站点到 dist/
npm run preview    # 本地预览构建产物
```

## 二、目录结构

```
src/
├── content/           # 唯一内容源：按主题分子目录存放 Markdown
│   ├── research/      # 企业研究
│   ├── ai/            # 前沿 AI
│   └── note/          # 随笔笔记
├── content.config.ts  # 集合与字段 schema + 构建期校验
├── site.ts            # 站点名/简介/作者/分类表/评论开关（单一来源）
├── lib/posts.ts       # 取数、排序、分组、分页等纯函数
├── components/        # PostCard / Pager / Comments
├── layouts/           # BaseLayout（head/SEO/主题）、ListPage（列表骨架）
├── pages/             # 路由，全部构建期渲染
└── styles/global.css  # 深紫品牌主题 + 暗色变量
public/                # favicon.svg / og.svg / covers/*.svg
```

路由清单：

| 路径 | 说明 |
| --- | --- |
| `/` | 首页：主题分区 + 最新文章分页 + 热门标签聚合 |
| `/page/2/` … | 列表分页（每页 5 篇，真实链接可爬虫） |
| `/posts/<slug>/` | 文章详情（TOC、摘要、标签、相关文章、JSON-LD） |
| `/category/<key>/`、`/category/<key>/page/2/` … | 分类列表（分页） |
| `/tag/<tag>/`、`/tag/<tag>/page/2/` …、`/tags/` | 标签页（分页） / 标签云 |
| `/archive/` | 按年份归档 |
| `/search/` | 站内搜索（读 `/search.json`，前端过滤） |
| `/about/`、`/404.html` | 关于页 / 404 |
| `/rss.xml`、`/sitemap-index.xml` | RSS 2.0 / sitemap |

## 三、写文章

在 `src/content/<分类>/` 新建 `slug.md`（也接受 `YYYY-MM-DD-slug.md`，日期前缀会自动剥掉）：

```markdown
---
title: 标题
date: 2026-08-20
category: ai          # research / ai / note，必须与所在目录一致
tags: [A2UI, Agent]
summary: 一句话摘要（首页卡片与 RSS 使用）
aiSummary: true           # 可选，默认 false；为 true 时文章页摘要卡带「AI 生成」标注
cover: /covers/a2ui.svg   # 可选，站内相对路径
---
正文（Markdown，代码块由 Shiki 高亮）。
```

构建期会校验并直接报错，不会静默丢文章：
- `category` 缺失、未在 `src/site.ts` 的 `CATEGORIES` 中注册、或与所在目录不符；
- 其它字段由 `src/content.config.ts` 的 zod schema 把关（`title`/`date` 必填，`tags`/`summary` 有默认值）。

新增分类只需改 `src/site.ts` 的 `CATEGORIES` 与 `content.config.ts` 的 `category` 枚举，导航、首页分区、分类页会自动跟上。

## 四、图片

放在 `public/covers/`，frontmatter 写站内路径（`/covers/xxx.svg`）。
上线后可选切到 jsDelivr / 腾讯云 COS，届时把 `cover` 换成绝对 URL 即可，模板不需要改。

## 五、部署到 Vercel

1. `git init && git add . && git commit -m "init" && git push`（`.gitignore` 已排除 `node_modules/`、`dist/`、`.astro/`）
2. https://vercel.com → New Project → Import 该仓库，Framework 选 Astro，其余默认。
3. 拿到 `wentao-blog-xxxx.vercel.app` 后，把域名同时填进 `astro.config.mjs` 的 `site` 和 `src/site.ts` 的 `SITE.url`（canonical / OG / RSS 依赖它），之后每次 push 自动重新部署。

## 六、选购自定义域名（后续）

- 注册商：Namesilo / Namecheap / Cloudflare Registrar（续费透明），国内可用阿里云/腾讯云。
- 后缀建议：`.com` 首选；备选 `.blog` / `.dev` / `.me`。
- 国内访问：面向国内用户需 ICP 备案；用 Vercel 可后续接 Cloudflare 加速。
- 接入 Vercel：Settings → Domains → Add Domain，按提示把 DNS 改成 CNAME `cname.vercel-dns.com`。

## 七、评论（默认关闭）

选型为 giscus（后端是 GitHub Discussions，不需要自建服务）。未配置时评论区块整体不渲染，
避免发出必然失败的第三方请求。启用步骤见 `src/components/Comments.astro` 顶部注释：
开启仓库 Discussions → 装 giscus 应用 → 把 `src/site.ts` 的 `COMMENTS` 改为 `enabled: true` 并填入仓库与分类 ID。

两处已做的保障：

- `enabled: true` 但 `repo` / `repoId` / `categoryId` 没填齐时，**构建期直接抛错**，不会留下一个在 iframe 里静默失败的评论区。
- 主题切换时会向 giscus iframe `postMessage` 换 `theme`（`light` / `transparent_dark`），否则深色模式下评论区仍是白底。

站内另有一篇按优先级整理的待办：`src/content/note/blog-roadmap.md`（上线前 / 第一周 / 发布流程 / 季度回看 / 明确不做）。

## 八、已知边界

- 站内搜索是构建期 `search.json` + 前端过滤，文章数上千后应换成 Pagefind。
- 首页 / 分类页 / 标签页均已分页（每页 5 篇，页码窗口化显示，超出以省略号收敛）。
- 图片未接 Astro `<Image>` 做自动尺寸与格式转换，封面为手工维护的 SVG。
