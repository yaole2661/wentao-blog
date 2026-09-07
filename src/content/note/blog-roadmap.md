---
title: 博客搭好之后：上线与长期运行的清单
date: 2026-08-29
category: note
tags: [方法论, 建站, Astro, 信息源]
summary: 这个站点自己的运维手册。按 P0 上线前 / P1 第一周 / P2 内容节奏 / P3 季度回看四层列出待办，并明确写下哪些事决定不做。
cover: /covers/roadmap.svg
---

> 本文既是站内第一篇「工程自述」，也是我自己照着执行的 TODO。会随站点状态更新，因此它带 `updated` 字段的频率大概会比别的文章高。

## 〇、当前状态快照

先把事实钉住，免得清单悬在空中：

| 项 | 现状 |
| --- | --- |
| 框架 | Astro 5（`output: 'static'`），插件只有 `@astrojs/sitemap` 与 `@astrojs/rss` |
| 运行时 JS | 4 处：主题切换、站内搜索过滤、目录滚动高亮、giscus iframe。**没有任何前端框架，零 Island** |
| 内容量 | 7 篇文章 → 43 个静态页，构建约 2 秒，零 warning |
| 域名 | `fanwentao.cn` 主站（十年）+ `fanwentao.com` 预备役（两年），均已注册。NS 已从 DNSPod 切到 Vercel（`ns1/ns2.vercel-dns.com`），等全球 DNS 刷新后 Vercel 自动签发 SSL 证书 |
| 分页 | `PER_PAGE = 5`，首页 / 分类页 / 标签页三处都已分页，页码窗口化 |
| 评论 | giscus 已启用，`COMMENTS.enabled = true`，仓库 `yaole2661/wentao-blog`，分区 `General` |
| 部署 | Vercel 项目 `wentao-blog` 已创建，首次部署 Ready（`wentao-blog.vercel.app`）。自定义域名 `fanwentao.cn` 已挂到项目，等 DNS 刷新后证书签发。GitHub 自动部署联动待配 |

## 一、P0：上线前必须做的三件事

### 1. 域名已定：主站 `fanwentao.cn`，两处 URL 待同改 ✅

主站域名已确定为 **`fanwentao.cn`**（十年），`fanwentao.com`（两年）作为预备役先空置、上线后 301 到主站。`astro.config.mjs` 的 `site` 和 `src/site.ts` 的 `SITE.url` **必须同时改成 `https://fanwentao.cn`**。它们不是冗余：

- `astro.config.mjs` → sitemap 与 RSS 里的绝对地址；
- `SITE.url` → canonical、`og:url`、文章页底部那行永久链接、JSON-LD 的 `mainEntityOfPage`。

只改一处会得到「页面能打开，但分享卡片和搜索引擎收录指向旧域名」这种最难排查的后果。改完重新构建，用 `grep -r wentao-blog.vercel.app dist` 确认没有残留。

同批还有两件小事：① `SITE.author` / `description` / 关于页的「姚乐」统一改成 `Wentao`（只留名，让站点品牌与 URL 一致）；② 两个域名的安全开关保持一致：都开「禁止转移锁 + 自动续费」，都不开「禁止更新锁」（后者会锁掉 NS 修改，纯添乱）。

### 2. 仓库 + 部署 + 评论，是同一条链 ✅（GitHub 自动部署联动待配）

顺序上有依赖关系，一次做完：

1. `git init` → 推到 GitHub（`.gitignore` 已排除 `node_modules/`、`dist/`、`.astro/`）。
2. Vercel New Project → Import，Framework 选 Astro，构建命令 `astro build`，输出 `dist`。
3. 在同一个仓库 **Settings → Discussions** 建一个分类（如 `Announce`），到 <https://github.com/apps/giscus> 授权该仓库。
4. 打开 <https://giscus.app/zh-CN> 填入仓库名，复制 4 个值进 `src/site.ts` 的 `COMMENTS`，把 `enabled` 改 `true`。

第 4 步有个兜底：`src/components/Comments.astro` 在构建期会检查「开关开了但 ID 没填齐」并**直接让构建失败**，不会留下一个 iframe 里静默报错的评论区。这条已实测。

### 3. 收录：robots.txt ✅

`sitemap-0.xml` 会自动生成，但 `public/` 下目前只有 `og.svg` 和 `favicon.svg`，**没有 `robots.txt`**。上线当天补一个最小版本（`Allow: /` + `Sitemap: https://fanwentao.cn/sitemap-index.xml`），并去 Google Search Console / Bing Webmaster 提交 sitemap。

顺带：文章页 `og:image` 引用的封面 SVG 是 640×300（比例 2.13:1），而 OG 规范建议 1200×630（1.91:1），社交平台裁切时会切掉左右各约一成。**要么把封面 viewBox 改成 1200×630，要么单独出一张 OG 图**——这条我暂时只做记录，不动手，等有真实分享需求再改。

## 二、P1：上线后第一周

1. **访问统计。** GoatCounter / Umami 都只需一段 script，但要清楚：它是这个站点的**第 5 个第三方运行时**，与「零 Island」的取舍是明确的。建议只统计页面路径，不接任何识别型标识。
2. **真机过一遍。** 重点三处：iOS Safari 深色模式下评论区与封面是否跟着变（giscus 主题靠 `postMessage` 同步，已实现，但只在真机上才能确认）；微信内置浏览器打开时的分享卡片；小屏下汉堡菜单与分页条的换行。
3. **404 与死链自测。** 抽查 `/posts/<不存在的slug>/`、`/category/<未注册>/`、`/page/99/` 三种情况，确认真的是 404 而不是空页。
4. **RSS 订阅自测。** 把 `rss.xml` 丢进 <https://validator.w3.org/feed/>，别等到别人反馈订阅不到才看。

## 三、P2：日常发布一篇文章的固定流程

这部分是长期真正会重复的东西，值得写成 SOP：

1. 新建 `src/content/<category>/<slug>.md`，**文件名即 URL slug**，目录名必须等于 `category`。
2. 在 `public/covers/` 补一张同风格 SVG（`research` 紫、`ai` 绿、`note` 棕），`<title>` 写进 aria-label。
3. `npx astro build`，要求**零 error 零 warning**——把 warning 当 error 看待，是静态站最便宜的质量门禁。
4. `npx astro preview`，四页自查：列表页卡片摘要不撑破、文章页目录锚点、标签页能落到正确聚合、RSS 出现新条目。
5. `git push`，等 Vercel 构建完成后在线上域名再点一次文章页。

写作口径上，有三条自订规矩：

- **借用他站选题时做「导读 + 原文回链」**，正文只放自己的结构与判断，每篇结尾给「参考与延伸」。整篇转载他站内容不做。
- **AI 参与的摘要必须显式标注**（frontmatter `aiSummary: true`），文章页会渲染「AI 生成摘要 · 仅供参考」。这条是看了茶思屋等站点的做法后加的。
- **凡引用二手转述，标明可信度**。是官方口径、还是自媒体推断，读者应该一眼能分辨。

另外两个坑已经踩过，记下来防回归：

- 跨分类**重名文件**会触发 `Duplicate id`；若只是本地 `.astro/` 缓存残留，`Remove-Item -Recurse -Force .astro` 后再构建。
- 标签一旦放飞就会碎片化（`AI4S` / `AI for Science` / `科学智能` 是同一个东西）。全站标签数控制在 20 个以内，新标签先查 `/tags/` 有没有近义。

## 四、P3：每季度回看一次

| 事项 | 触发条件 | 处理 |
| --- | --- | --- |
| 外链腐坏 | 参考与延伸里的链接开始 404 | 换成存档链接或删条目，不留死链 |
| 搜索升级 | 文章数接近三位数 | 换 Pagefind（当前 `search.json` + 前端子串过滤，不搜正文，规模一大自然失效） |
| 图片改造 | 开始用位图截图 | 接 Astro `<Image>` 出 AVIF/WebP 与显式宽高；封面仍是手工 SVG 时可缓 |
| 依赖升级 | Astro 出小版本 / `npm audit` 有 high | 单独一次提交只升依赖，验证构建通过再合内容 |
| 旧文审计 | 有文章结论已被推翻 | 补 `updated` 字段或在开头加一段更正，**不要静默改掉** |

## 五、决定不做的事

清单里最难的部分是「不做」。以下几项已经想过，明确排除：

- **自建评论 / 用户系统 / 登录**：giscus 用 GitHub 账号承担身份，零运维，没有理由自己做。
- **Headless CMS（Sanity / Notion / Supabase）**：内容以 md 进 git，diff 可审、可回滚、可离线写，对研究写作比可视化后台更有价值。
- **多语言 i18n**：目标读者只有一种语言。
- **前端框架 Island（React / Svelte 组件）**：目前所有交互都是几十行原生脚本，引入框架会让构建产物、心智负担同时上涨。
- **暗色模式的第三种「跟随系统但可覆盖」变体**：现在的「首帧不闪 + localStorage 记住」已经够。

## 六、一页速查

```
上线前   ✅ 两处 URL 同改为 https://fanwentao.cn + 署名统一 Wentao + robots.txt
         ✅ git push → Vercel 项目创建 → Discussions + giscus → COMMENTS.enabled = true
         ✅ NS 从 DNSPod 切到 Vercel（ns1/ns2.vercel-dns.com）
         ⏳ 等 DNS 刷新 → Vercel 签发证书 → https://fanwentao.cn 可访问
         ⏳ Vercel 连接 GitHub（Login Connections → Connect to GitHub）→ push 自动部署
         ⏳ Google Search Console / Bing Webmaster 提交 sitemap
         fanwentao.com 上线后 301 → .cn（预备役，先空置）
第一周   统计脚本 · iOS/微信真机 · 404 自测 · RSS 校验器
每篇文   <category>/<slug>.md + /covers/<slug>.svg → build 零 warning → preview 四页自查 → push
每季度   死链 · Pagefind 触发线 · 图片 · 依赖 · 旧文更正
永不     自建评论 · CMS · i18n · 框架 Island
```

这份清单的盲区正在缩小：Vercel 构建已验证通过（13 秒、零 error），DNS 切换也已执行。剩下的两个待验证项是「DNS 全球刷新需要多久」和「国内访问速度如何」——前者等 NS 生效后自动解决，后者要等域名能打开后实测。
