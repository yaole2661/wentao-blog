# 博客运维路线图（本地）

> 不发布到站点，仅本地跟踪。原 `src/content/note/blog-roadmap.md` 已下线。

## P0 上线前 ✅ 全部完成

- ✅ URL 同改 `https://fanwentao.cn` + 署名统一 Wentao + robots.txt
- ✅ git push → Vercel 项目创建 → Discussions + giscus → COMMENTS.enabled = true
- ✅ NS 从 DNSPod 切到 Vercel → DNS 刷新完成 → SSL 证书签发 → 正式上线
- ✅ Vercel 已连接 GitHub，push 自动部署已验证

## P1 上线后第一周

- ✅ 404 与死链自测（11 个页面全部通过）
- ✅ RSS 订阅校验（RSS 2.0 规范合规）
- ✅ 手机适配修复（横向溢出 + 前后导航 + 汉堡菜单交互）
- ✅ Gates Notes 学习文档（gatesnotes-study.md 已发布）
- ⏳ 真机测试（修复后复测）
- ⏳ 提交 sitemap 到 Google Search Console / Bing Webmaster

## P2 体验提升（来自 Gates Notes 学习）

> 来源：[Gates Notes 学习笔记](src/content/note/gatesnotes-study.md) 第七节

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
