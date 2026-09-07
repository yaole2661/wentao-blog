import type { APIRoute } from 'astro';
import rss from '@astrojs/rss';
import { getPosts } from '../lib/posts';
import { categoryLabel, SITE } from '../site';

export const GET: APIRoute = async (context) => {
  const posts = await getPosts();

  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site!,
    trailingSlash: true,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary || categoryLabel(post.data.category),
      pubDate: post.data.date,
      author: SITE.author,
      categories: post.data.tags,
      link: `/posts/${post.id}/`,
    })),
    customData: `<language>zh-CN</language>`,
  });
};
