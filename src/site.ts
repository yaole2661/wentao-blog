/**
 * 站点常量：单一来源，供布局 / 首页 / 分类页 / 归档页 / RSS 共用。
 * 改站点名、描述、分类文案只需要动这一个文件。
 */

export const SITE = {
  name: "Wentao's blog",
  title: "Wentao's blog",
  description: 'Wentao 的个人研究与沉淀阵地：企业研究、前沿 AI 探索与方法论笔记。',
  author: 'Wentao',
  lang: 'zh-CN',
  url: 'https://fanwentao.cn',
  timezone: 'Asia/Shanghai',
} as const;

/** 分类 key → 展示文案，须与 content.config.ts 的 category 枚举一致 */
export const CATEGORIES = {
  research: '企业研究',
  ai: '前沿 AI',
  note: '随笔笔记',
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

export function categoryLabel(key: string): string {
  return CATEGORIES[key as CategoryKey] ?? key;
}

/** 全站统一的日期格式（RSS / 列表 / 详情页共用） */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: SITE.timezone,
  });
}

/**
 * 评论系统（设计方案选型：giscus，基于 GitHub Discussions，零后端）。
 * 未填真实仓库参数时整块不渲染，避免向第三方域发起必然失败的请求。
 */
export const COMMENTS = {
  enabled: true,
  repo: 'yaole2661/wentao-blog', // GISCUS_REPO
  repoId: 'R_kgDOUQ6_RA', // GISCUS_REPO_ID：仓库的 GraphQL node_id
  category: 'General', // GISCUS_CATEGORY：仓库 Discussions 的分区名
  categoryId: 'DIC_kwDOUQ6_RM4DFDdP', // GISCUS_CATEGORY_ID：该分区的 node_id
} as const;
