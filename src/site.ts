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

/**
 * 内容平台关注入口：首页侧栏「关注」区唯一数据源。
 * url 留空的条目渲染为不可点击的虚线占位，补上各平台主页链接即生效。
 * icon 对应 SocialIcon.astro 里的品牌标识：矢量取自公开图标集，位图取自各家官方应用图标。
 * color 取各家官方主色，只用于 hover 时给胶囊镀一点品牌色。
 */
export interface Social {
  name: string;
  icon: string;
  url: string;
  color?: string;
}

export const SOCIALS: Social[] = [
  { name: '哔哩哔哩', icon: 'bilibili', url: 'https://space.bilibili.com/595555597', color: '#00a1d6' },
  { name: '今日头条', icon: 'toutiao', url: 'https://www.toutiao.com/c/user/token/CixO7qELHsFbkZ9LBmiKEsoyUUDTD9PD110EzTgwT1bPDWGOiB8NAcCoXAAWVhpJCjwAAAAAAAAAAAAAUOGI6xF2uiDcu6fNb8fKIhuVJTTU2XitgtnAG9BulhlsZJ1RBc03MLi15rQo6DpB_WwQh-WbDhjDxYPqBCIBAzWOZKI=/?source=feed', color: '#ff373c' },
  { name: '小红书', icon: 'xiaohongshu', url: 'https://www.xiaohongshu.com/user/profile/67a20ae9000000000d008859', color: '#ff2442' },
  { name: '知乎', icon: 'zhihu', url: 'https://www.zhihu.com/people/ruo-teng-65', color: '#0084ff' },
  { name: '微博', icon: 'weibo', url: 'https://weibo.com/u/7421230864', color: '#e6162d' },
  { name: '豆瓣', icon: 'douban', url: 'https://www.douban.com/people/257047452/', color: '#2d963d' },
  { name: '即刻', icon: 'jike', url: 'https://web.okjike.com/u/2ed6122a-985c-4e9b-965e-1287752906df', color: '#ffe411' },
  { name: '小宇宙', icon: 'xiaoyuzhou', url: 'https://www.xiaoyuzhoufm.com/', color: '#35b5d8' },
  { name: '知识星球', icon: 'zhishixingqiu', url: 'https://wx.zsxq.com/login', color: '#00a281' },
  { name: '公众号', icon: 'wechat', url: 'https://mp.weixin.qq.com/s/pMgtFyrDERdnW_vqEVk-4g', color: '#07c160' },
];

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
