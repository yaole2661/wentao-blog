/**
 * 百度「主动推送（实时）」——把线上 URL 直接 POST 给百度爬虫，加速新域收录。
 *
 * 中文个人站命门：百度对新域收录极慢，光提交 sitemap 可能几个月查无此站。
 * 主动推送是最高优先级触发抓取的手段。
 *
 * 用法：
 *   1. 百度搜索资源平台 → 普通收录 → 资源提交 → 推送接口，拿到 token
 *   2. 设环境变量（PowerShell）：
 *        $env:BAIDU_PUSH_TOKEN="你的token"
 *      可选：$env:BAIDU_PUSH_SITE="fanwentao.cn"（默认即此值）
 *   3. 先 npm run build（生成 dist/sitemap-*.xml），再：
 *        node scripts/baidu-push.mjs
 *      或 npm run push:baidu
 *
 * 数据源用构建产物 sitemap，保证推的 URL 与线上完全一致；草稿天然不在 sitemap 里。
 */
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const SITE = process.env.BAIDU_PUSH_SITE || 'fanwentao.cn';
const TOKEN = process.env.BAIDU_PUSH_TOKEN;

async function collectUrls() {
  const dist = join(process.cwd(), 'dist');
  const files = (await readdir(dist)).filter((f) => /^sitemap-\d+\.xml$/.test(f));
  if (files.length === 0) {
    throw new Error('dist/ 下没有找到 sitemap-N.xml，请先运行 npm run build');
  }
  const urls = new Set();
  for (const f of files) {
    const xml = await readFile(join(dist, f), 'utf-8');
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const u = m[1].trim();
      // 排除 404 页；只推真正的站点页面
      if (u && !/\/404\/?$/.test(u)) urls.add(u);
    }
  }
  return [...urls];
}

async function main() {
  if (!TOKEN) {
    console.error('❌ 缺少 BAIDU_PUSH_TOKEN。请先到百度搜索资源平台拿推送 token 并设为环境变量。');
    process.exit(1);
  }
  const urls = await collectUrls();
  console.log(`站点 ${SITE}：从 sitemap 收集到 ${urls.length} 条 URL`);

  const endpoint = `http://data.zz.baidu.com/urls?site=${SITE}&token=${TOKEN}`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: urls.join('\n'),
  });
  const text = await res.text();
  console.log(`HTTP ${res.status} ${text}`);

  let json;
  try {
    json = JSON.parse(text);
  } catch {
    console.error('❌ 返回非 JSON，多为 token/站点未验证或当日配额用尽。');
    process.exit(1);
  }
  if (json.error) {
    console.error(`❌ 百度返回错误 ${json.error}：${json.message || ''}`);
    process.exit(1);
  }
  console.log(`✅ 本次成功推送 ${json.success ?? 0} 条（剩余当日配额 ${json.remaining ?? '?'}）`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
