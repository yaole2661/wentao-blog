import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** 列表页每页条数（与原型保持一致） */
export const PER_PAGE = 5;

/** 全站文章，按发布日期倒序 */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts');
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function postUrl(slug: string): string {
  return `/posts/${slug}/`;
}

export function categoryUrl(key: string): string {
  return `/category/${key}/`;
}

export function tagUrl(tag: string): string {
  return `/tag/${encodeURIComponent(tag)}/`;
}

export function postsByCategory(posts: Post[], key: string): Post[] {
  return posts.filter((p) => p.data.category === key);
}

export function postsByTag(posts: Post[], tag: string): Post[] {
  return posts.filter((p) => p.data.tags.includes(tag));
}

/** 出现过的标签，按使用次数倒序、同数按字母序 */
export function getTagIndex(posts: Post[]): { tag: string; count: number }[] {
  const map = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.data.tags) map.set(t, (map.get(t) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh-CN'));
}

/** 按年份归档 */
export function groupByYear(posts: Post[]): { year: number; items: Post[] }[] {
  const map = new Map<number, Post[]>();
  for (const p of posts) {
    const year = p.data.date.getFullYear();
    if (!map.has(year)) map.set(year, []);
    map.get(year)!.push(p);
  }
  return [...map.entries()]
    .map(([year, items]) => ({ year, items }))
    .sort((a, b) => b.year - a.year);
}

export interface PageResult<T> {
  items: T[];
  page: number;
  totalPages: number;
  total: number;
}

/** 纯函数分页：越界页码收敛到合法区间 */
export function paginate<T>(all: T[], page: number, perPage = PER_PAGE): PageResult<T> {
  const totalPages = Math.max(1, Math.ceil(all.length / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * perPage;
  return {
    items: all.slice(start, start + perPage),
    page: current,
    totalPages,
    total: all.length,
  };
}

/**
 * 分页链接：第 1 页始终回到基准路径本身（/ 或 /category/ai/），
 * 之后是 <base>page/2/，避免出现重复内容的规范链接。
 */
export function pageUrl(base: string, page: number): string {
  return page <= 1 ? base : `${base}page/${page}/`;
}
