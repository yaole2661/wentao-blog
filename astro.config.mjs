import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

// 站点基础 URL：决定 sitemap / RSS 里的绝对地址与 canonical 的基准域。
// 注意：src/site.ts 里的 SITE.url 必须与此处保持一致，它用于 canonical / OG / RSS 绝对链接。
const SITE_URL = 'https://fanwentao.cn';

/** 递归收集目录下的所有 .md 文件路径 */
async function walkMarkdown(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walkMarkdown(full)));
    else if (e.name.endsWith('.md')) out.push(full);
  }
  return out;
}

/**
 * 构建「文章 URL 路径 → lastmod」映射。
 *
 * @astrojs/sitemap 默认不写 lastmod，且构建期无法调用 getCollection（内容集合尚未加载），
 * 因此这里直接读 md 文件的 frontmatter，取 updated ?? date 作为该页的最后修改日。
 *
 * 关键原则（来自 Google Search Central）：lastmod 必须是内容「真实变更日」，
 * 绝不能用构建时间——否则每次部署全站日期跳到今天，搜索引擎会把日期信号当噪声并停止信任。
 */
async function buildLastmodMap() {
  const map = new Map();
  const files = await walkMarkdown(join(process.cwd(), 'src', 'content'));
  for (const file of files) {
    const raw = await readFile(file, 'utf-8');
    const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!fm) continue;
    const block = fm[1];
    // 草稿不进任何线上页面，也不该出现在 sitemap
    if (/^draft:\s*true\s*$/m.test(block)) continue;
    const pick = (key) => block.match(new RegExp(`^${key}:\\s*(\\S.*?)\\s*$`, 'm'))?.[1];
    const dateStr = pick('updated') ?? pick('date');
    if (!dateStr) continue;
    const d = new Date(dateStr.replace(/^['"]|['"]$/g, ''));
    if (Number.isNaN(d.getTime())) continue;
    // 与 content.config.ts 的 generateId 保持一致：文件名去 .md、去 YYYY-MM-DD- 前缀
    let name = file.slice(file.lastIndexOf('\\') + 1).replace(/\.md$/i, '');
    if (/^\d{4}-\d{2}-\d{2}-/.test(name)) name = name.slice('0000-00-00-'.length);
    map.set(`/posts/${name}/`, d.toISOString().slice(0, 10));
  }
  return map;
}

const lastmodMap = await buildLastmodMap();

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      // 文章页写入真实 lastmod；其余页面（首页/分类/标签/归档）保持无 lastmod，
      // 因为它们是派生列表页、无独立「内容变更日」语义，留空比造假更稳妥。
      serialize(item) {
        const path = new URL(item.url).pathname;
        const lastmod = lastmodMap.get(path);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
});
