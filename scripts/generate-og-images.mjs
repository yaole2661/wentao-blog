/**
 * 生成 OG 分享图 PNG（P0-2）
 *
 * 背景：微信/微博/QQ/知乎/小红书等社交平台不渲染 SVG 分享卡片，
 * 只认 PNG/JPG。本脚本把站点默认 OG 图 + 各文章封面统一光栅化为
 * 1200×630 的 PNG，供 og:image / twitter:image 指向。
 *
 * 用法：npm run og
 *   - public/og.svg                 → public/og.png
 *   - public/covers/<name>.svg      → public/covers/og/<name>.png
 *
 * 依赖 sharp（Astro 5 已随依赖安装）。输出为静态 PNG，随源码入库，
 * 不参与每次构建；新增/修改封面后重跑本脚本即可。
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const COVERS_DIR = path.resolve('public/covers');
const OG_SRC = path.resolve('public/og.svg');
const OG_OUT = path.resolve('public/og.png');
const OG_COVERS_DIR = path.resolve('public/covers/og');

async function toPng(svgPath, pngPath) {
  const buf = await fs.readFile(svgPath);
  // density 大值先把矢量栅格化到高分辨率，再压下到 1200×630，保证文字/线条锐利
  await sharp(buf, { density: 320 })
    .resize(OG_WIDTH, OG_HEIGHT)
    .png({ compressionLevel: 9 })
    .toFile(pngPath);
  console.log(`✅ ${path.relative('.', svgPath)} → ${path.relative('.', pngPath)}`);
}

async function main() {
  await fs.mkdir(OG_COVERS_DIR, { recursive: true });

  // 1) 站点默认 OG 图
  await toPng(OG_SRC, OG_OUT);

  // 2) 各文章封面
  const files = (await fs.readdir(COVERS_DIR)).filter((f) => f.endsWith('.svg'));
  for (const f of files) {
    await toPng(path.join(COVERS_DIR, f), path.join(OG_COVERS_DIR, f.replace(/\.svg$/, '.png')));
  }

  console.log(`\n全部完成：1 张默认 OG + ${files.length} 张封面 PNG。`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});