/**
 * 阅读时长估算（内容架构 P0 · 工程半边）。
 *
 * 思路：中文字按「字/分钟」、英文按「词/分钟」分别计。
 * 取值参考：中文默读约 300 字/分、英文约 200 词/分，取下限偏保守。
 * 先粗剥 Markdown 语法（代码块 / 行内码 / 链接 / 图片 / 标题符号等），
 * 只统计正文可见文字，避免代码和 URL 把时长灌水。
 */

const CJK_CHARS_PER_MIN = 300;
const LATIN_WORDS_PER_MIN = 200;

/** 去掉 Markdown 结构，尽量只留下人真正会读的文字 */
function stripMarkdown(body: string): string {
  return body
    .replace(/```[\s\S]*?```/g, ' ') // 围栏代码块
    .replace(/`[^`]*`/g, ' ') // 行内代码
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // 图片
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 链接保留锚文本
    .replace(/^\s*#{1,6}\s+/gm, '') // 标题井号
    .replace(/^\s*>\s?/gm, '') // 引用
    .replace(/^\s*[-*+]\s+/gm, '') // 无序列表符号
    .replace(/^\s*\d+\.\s+/gm, '') // 有序列表序号
    .replace(/[*_~]/g, '') // 强调/删除线符号
    .replace(/<[^>]+>/g, ' ') // 内嵌 HTML
    .replace(/https?:\/\/\S+/g, ' '); // 裸 URL
}

/** 给定原始 Markdown 正文，返回预估阅读分钟数（至少 1 分钟） */
export function estimateReadingTime(body: string | undefined | null): number {
  if (!body) return 1;
  const text = stripMarkdown(body);
  const cjk = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
  // 英文词：CJK 之外的连续字母数字串
  const latinWords = (
    text.replace(/[\u4e00-\u9fff\u3400-\u4dbf]/g, ' ').match(/[A-Za-z0-9]+/g) || []
  ).length;
  const minutes = cjk / CJK_CHARS_PER_MIN + latinWords / LATIN_WORDS_PER_MIN;
  return Math.max(1, Math.round(minutes));
}

/** 展示文案，如「8 分钟」 */
export function readingTimeLabel(body: string | undefined | null): string {
  return `${estimateReadingTime(body)} 分钟`;
}
