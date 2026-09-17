import { readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import matter from "gray-matter";
import { Marked } from "marked";
import sanitizeHtml from "sanitize-html";

export const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );

export function parsePost(source, slug) {
  const { data, content } = matter(source);
  for (const key of [
    "title",
    "description",
    "date",
    "category",
    "cover",
    "coverAlt",
  ]) {
    if (typeof data[key] !== "string" || !data[key].trim())
      throw new Error(`${slug}: 缺少字段 ${key}（日期请加引号）`);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    throw new Error(`无效的文章文件名: ${slug}`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(data.date) ||
    Number.isNaN(Date.parse(data.date)) ||
    new Date(data.date).toISOString().slice(0, 10) !== data.date
  )
    throw new Error(`${slug}: 无效的日期`);
  if (!["技术", "设计", "生活", "随想"].includes(data.category))
    throw new Error(`${slug}: 分类应为技术、设计、生活或随想`);
  if (!data.cover.startsWith("/images/") || data.cover.includes(".."))
    throw new Error(`${slug}: 封面应放在 public/images/ 中`);
  if (
    data.tags &&
    (!Array.isArray(data.tags) ||
      data.tags.some((tag) => typeof tag !== "string"))
  )
    throw new Error(`${slug}: tags 应为字符串数组`);
  const headings = [];
  let headingIndex = 0;
  const markdown = new Marked();
  markdown.use({
    renderer: {
      heading({ tokens, depth }) {
        const inline = this.parser.parseInline(tokens);
        const text = sanitizeHtml(inline, {
          allowedTags: [],
          allowedAttributes: {},
        });
        const id = `section-${++headingIndex}`;
        if (depth === 2 || depth === 3) headings.push({ id, text });
        return `<h${depth} id="${id}">${inline}</h${depth}>`;
      },
    },
  });
  const html = sanitizeHtml(markdown.parse(content), {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img"],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      h1: ["id"],
      h2: ["id"],
      h3: ["id"],
      h4: ["id"],
      code: ["class"],
      img: ["src", "alt", "title", "width", "height", "loading"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      img: sanitizeHtml.simpleTransform("img", { loading: "lazy" }),
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
  });
  const text = sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} });
  const chinese = (text.match(/[\u3400-\u9fff]/g) || []).length;
  const words = (text.replace(/[\u3400-\u9fff]/g, "").match(/\b\w+\b/g) || [])
    .length;
  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    category: data.category,
    cover: data.cover,
    coverAlt: data.coverAlt,
    tags: data.tags || [],
    minutes: Math.max(1, Math.ceil(chinese / 300 + words / 200)),
    headings,
    html,
    text,
  };
}

export function loadPosts(directory) {
  return readdirSync(directory)
    .filter((file) => file.endsWith(".md"))
    .map((file) =>
      parsePost(
        readFileSync(join(directory, file), "utf8"),
        basename(file, ".md"),
      ),
    )
    .sort(
      (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
    );
}
