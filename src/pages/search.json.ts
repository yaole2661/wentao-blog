import type { APIRoute } from 'astro';
import { getPosts } from '../lib/posts';
import { categoryLabel } from '../site';

/**
 * 构建期生成的轻量搜索索引。
 * 静态托管（Vercel）没有服务端，搜索只能在前端做；这里把可检索字段
 * 导出成 JSON，供 /search/ 页面 fetch 后本地匹配。
 * 数据量上去之后应替换为 Pagefind（设计方案 §2.2 P1）。
 */
export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const body = posts.map((p) => ({
    slug: p.id,
    title: p.data.title,
    summary: p.data.summary,
    category: p.data.category,
    categoryLabel: categoryLabel(p.data.category),
    tags: p.data.tags,
    date: p.data.date.toISOString().slice(0, 10),
  }));

  return new Response(JSON.stringify(body), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};
