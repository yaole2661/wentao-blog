# 博客运维路线图（本地）

> 不发布到站点，仅本地跟踪。原 `src/content/note/blog-roadmap.md` 已下线。

## 发布规则（重要）

- **新生成的 `src/content/` 下的 MD 默认 `draft: true`**，不会出现在任何线上页面。
- 只有用户明确提出"发布"时，才把 `draft` 改为 `false`（或删除该字段）。
- Gates Notes 学习笔记当前为草稿状态，等待发布指令。

## P0 上线前 ✅ 全部完成

- ✅ URL 同改 `https://fanwentao.cn` + 署名统一 Wentao + robots.txt
- ✅ git push → Vercel 项目创建 → Discussions + giscus → COMMENTS.enabled = true
- ✅ NS 从 DNSPod 切到 Vercel → DNS 刷新完成 → SSL 证书签发 → 正式上线
- ✅ Vercel 已连接 GitHub，push 自动部署已验证

## P1 网站建设 ✅ 已收官（2026-09-08）

- ✅ 404 与死链自测（11 个页面全部通过）
- ✅ RSS 订阅校验（RSS 2.0 规范合规）
- ✅ 手机适配修复（横向溢出 + 长 URL 换行 + 左侧悬浮目录/前后导航 dock + 汉堡菜单交互）
- ✅ Gates Notes 学习文档（保持草稿，等发布指令）
- ✅ pandoc 装好，Word→MD/视频嵌入链路可用（说明见草稿 content-workflow.md）
- ⏳ 提交 sitemap 到 Google Search Console / Bing Webmaster（低优先级，随时可做）

## P2 当前阶段：自己写文章 + 渐进打磨样式

> 网站建设告一段落。今后节奏：**以真实内容创作驱动，样式优化按需小步迭代**，不再集中改版。

- 主线：站主自己写正式文章（AI 只协助格式转换、润色、配图，新文章一律默认草稿）
- 线上现有文章均为建站期 AI 生成的占位内容，处置方式由站主决定（保留占位 / 转草稿 / 删除）

### 样式备选池（写文章过程中遇到再做）

| 序号 | 改进 | 难度 | 状态 |
| --- | --- | --- | --- |
| 1 | 章节编号（CSS counter，H2 前加数字） | 低 | ⏳ |
| 2 | 阅读时间估算（字数 / 300 字每分钟） | 低 | ⏳ |
| 3 | 首屏加 slogan / 价值主张 | 低 | ⏳ |
| 4 | 社交分享按钮（复制链接 + 微信二维码） | 中 | ⏳ |
| 5 | 汉堡菜单升级为全屏抽屉 | 中 | ⏳ |

## P3 季度回看（暂不启动）

- 搜索从子串过滤升级到 Pagefind（文章数接近三位数时）
- 访问统计（GoatCounter / Umami）
- `fanwentao.com` 301 到 `.cn`

## 决定不做

- ICP 备案（服务器在境外，不需要）
- Vercel Pro 升级（免费版带宽 100GB 足够）
- 国内 CDN（后续访问量大时再考虑，需备案）
