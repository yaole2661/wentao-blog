/**
 * UTM 引流链接生成器：把站内路径 + 社交平台 → 带 utm 参数的绝对链接。
 *
 * 目的：社交联动的每条外链统一埋点，配合 Umami 才能回答「流量从哪个平台来、
 * 哪篇被读」。约定 utm_source 用平台英文键，utm_medium=social。
 *
 * 用法：
 *   node scripts/utm.mjs <站内路径> <平台> [活动名]
 * 例：
 *   node scripts/utm.mjs /posts/a2ui-protocol/ wechat
 *   node scripts/utm.mjs / zhihu launch-2026
 *
 * 平台键（不区分大小写）：
 *   wechat  微信公众号   | zhihu  知乎    | xhs     小红书
 *   xiaoyuzhou 小宇宙    | bilibili B站   | jike    即刻
 *   weibo   微博         | toutiao  今日头条
 */
const SITE = process.env.PUBLIC_SITE_URL || 'https://fanwentao.cn';

const PLATFORMS = {
  wechat: { label: '微信公众号', utm: 'wechat' },
  zhihu: { label: '知乎', utm: 'zhihu' },
  xhs: { label: '小红书', utm: 'xhs' },
  xiaoyuzhou: { label: '小宇宙', utm: 'xiaoyuzhou' },
  bilibili: { label: '哔哩哔哩', utm: 'bilibili' },
  jike: { label: '即刻', utm: 'jike' },
  weibo: { label: '微博', utm: 'weibo' },
  toutiao: { label: '今日头条', utm: 'toutiao' },
};

function usage() {
  console.log('用法: node scripts/utm.mjs <站内路径> <平台> [活动名]');
  console.log('平台: ' + Object.keys(PLATFORMS).join(' | '));
}

function main() {
  const [path, plat, campaign] = process.argv.slice(2);
  if (!path || !plat) {
    usage();
    process.exit(1);
  }
  const key = plat.toLowerCase();
  const p = PLATFORMS[key];
  if (!p) {
    console.error(`未知平台: ${plat}`);
    usage();
    process.exit(1);
  }
  const url = new URL(path.startsWith('/') ? path : `/${path}`, SITE);
  url.searchParams.set('utm_source', p.utm);
  url.searchParams.set('utm_medium', 'social');
  url.searchParams.set('utm_campaign', campaign || 'link');
  console.log(`${p.label} → ${url.toString()}`);
}

main();
