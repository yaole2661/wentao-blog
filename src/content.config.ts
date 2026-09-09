import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATEGORIES } from './site';

/**
 * 内容集合（Content Layer API，Astro 5 正式写法）
 *
 * 目录结构遵循设计方案 §3.1：文章按主题分子目录存放，例如
 *   src/content/research/lvmh.md
 *   src/content/ai/a2ui-protocol.md
 * 因此以 src/content 为 base 递归收集，并用 generateId 把 id 收敛为纯文件名，
 * 使文章 URL 保持 /posts/<slug>/ 而不带分类目录。
 *
 * 注意：glob() 没有 normalize 选项，改 id 只能靠 generateId；
 * 顺带在这里做"文件放错目录 / frontmatter 漏字段"的构建期校验，
 * 避免文章静默地从列表里消失。
 */
const posts = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content',
    generateId({ entry, data }) {
      const noExt = entry.replace(/\.md$/i, '');
      const slash = noExt.lastIndexOf('/');
      const dir = slash === -1 ? '' : noExt.slice(0, slash);
      let name = slash === -1 ? noExt : noExt.slice(slash + 1);

      const category = typeof data.category === 'string' ? data.category : '';
      if (!category) {
        throw new Error(`文章 ${entry} 缺少 frontmatter 的 category 字段`);
      }
      if (!(category in CATEGORIES)) {
        throw new Error(
          `文章 ${entry} 的 category "${category}" 未注册，可选值：${Object.keys(CATEGORIES).join(' / ')}`
        );
      }
      if (dir && dir !== category) {
        throw new Error(`文章 ${entry} 位于 ${dir}/ 目录，但 frontmatter 声明 category: ${category}`);
      }

      // 兼容 §3.4 的 YYYY-MM-DD-slug.md 命名约定：去掉日期前缀
      if (/^\d{4}-\d{2}-\d{2}-/.test(name)) name = name.slice('0000-00-00-'.length);
      return name;
    },
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.enum(['research', 'ai', 'note']), // 与 CATEGORIES 保持一致
    tags: z.array(z.string()).default([]),
    summary: z.string().default(''),
    /** summary 是否由 AI 生成：文章页会渲染醒目标注（对标「此摘要由 AI 生成，仅供参考」） */
    aiSummary: z.boolean().default(false),
    cover: z.string().optional(), // 站内相对路径，如 /covers/lvmh.svg
    /** 首页右侧「精选」榜单：手动挑文章标 true，未标记时该榜单回退为最新文章 */
    featured: z.boolean().default(false),
    /**
     * 草稿开关：true 时文章不进入任何线上页面（列表/分类/标签/归档/搜索/RSS/sitemap/详情页）。
     * 约定：新生成的文档默认 draft: true，只有用户明确提出发布时才改为 false。
     */
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
