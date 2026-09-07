import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 站点基础 URL：决定 sitemap / RSS 里的绝对地址与 canonical 的基准域。
// 注意：src/site.ts 里的 SITE.url 必须与此处保持一致，它用于 canonical / OG / RSS 绝对链接。
export default defineConfig({
  site: 'https://fanwentao.cn',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
});
