# 片刻 · Lit 个人博客

一个安静、轻盈的中文博客。基于 **Lit 3 + TypeScript + Vite**，组件使用原生 Web Components 与 Shadow DOM，可作为静态网站部署到 Vercel。

包含首页、分类筛选、全文搜索（`⌘ / Ctrl + K`）、文章归档、关于页、阅读目录、链接复制、深浅色主题、移动端布局、RSS、站点地图和自定义 404。每个页面在构建时生成可直接阅读的 HTML、独立标题与分享信息；关闭 JavaScript 仍可访问正文和导航。

## 本地运行

需要 Node.js 22.12+（推荐 Node.js 24）。

```bash
npm install
npm run dev
```

打开终端显示的本地地址，默认是 `http://localhost:5173`。

```bash
npm run check   # TypeScript 检查
npm test        # 内容解析、安全过滤和搜索测试
npm run build  # 生成 dist，包括全部文章 HTML
npm run preview # 预览生产构建
```

## 写文章

在 `content/posts/` 新建 Markdown 文件。文件名使用英文小写与短横线，它也是文章的网址：`hello-world.md` → `/posts/hello-world`。

```markdown
---
title: '我的第一篇文章'
description: '用一句话介绍这篇文章。'
date: '2026-09-17'
category: '生活'
tags: ['日常', '记录']
cover: '/images/my-photo.jpg'
coverAlt: '窗台上的一盆绿植'
---

从这里开始写正文。

## 一个小标题

支持链接、列表、引用、图片、表格和代码块。
```

- 日期必须加引号，格式为 `YYYY-MM-DD`。文章按日期倒序排列。
- 分类可选：`技术`、`设计`、`生活`、`随想`。
- 封面放在 `public/images/`，文章中写 `/images/文件名`。
- 二级与三级标题自动生成目录，阅读时间按正文长度计算。
- Markdown 中的 HTML 会经过安全过滤，不支持嵌入脚本与 iframe。
- 保存 Markdown 后开发服务器自动刷新。发布新文章需要重新构建，Git 推送可触发 Vercel 自动部署。
- 项目附带的六篇文章、作者「小林」和站名「片刻」均为示例内容，可直接替换。

## 个性化

| 修改内容 | 位置 |
| --- | --- |
| 作者、简介等站点资料 | `src/site.ts` |
| 页面文案、导航与关于页 | `src/blog-app.ts` |
| 页面布局、响应式样式 | `src/app-styles.ts` |
| 字体、主题颜色 | `src/styles.css` |
| 卡片组件 | `src/components/post-card.ts` |
| 标签页图标 | `public/favicon.svg` |
| 静态页面元数据和 RSS 标题 | `vite.config.ts` |

当前站点名称在部分页面模板中也使用了「片刻」，改名时请全局搜索替换。无数据库、管理后台、评论服务或登录系统，写作方式是编辑 Markdown 并提交到 Git。

## 部署到 Vercel

1. 将本项目推送到你的 GitHub / GitLab / Bitbucket 仓库。
2. 在 Vercel 中选择 **Add New → Project**，导入仓库。
3. Framework Preset 选择 **Vite**。仓库已有 `vercel.json`，构建命令为 `npm run build`，输出目录为 `dist`。
4. 推荐设置环境变量 `SITE_URL` 为正式域名，例如 `https://your-blog.vercel.app` 或 `https://blog.example.com`，然后点击 **Deploy**。

`SITE_URL` 用于 canonical、文章分享信息、RSS 和 sitemap。没有设置时，优先使用 Vercel 的生产域名变量；本地构建回退到 `http://localhost:5173`。绑定新域名后更新 `SITE_URL` 并重新部署。

**无需配置 SPA 全站重写。** 构建会生成 `dist/posts/文章名.html`、`archive.html` 和 `about.html`，Vercel 的 `cleanUrls` 让这些页面以不带 `.html` 的地址访问。直接打开或刷新文章地址都能正常显示，不存在的地址返回真正的 404。请不要添加把所有 URL 重写到首页的规则，否则会掩盖 404。

上线后可检查：

- `/posts/a-quieter-web`：直接打开文章及刷新。
- `/rss.xml`：RSS 阅读器订阅地址。
- `/sitemap.xml`：可提交给搜索引擎的站点地图。
- `/not-a-page`：返回 404 页面。

## 图片与字体

示例图片来自 [Unsplash](https://unsplash.com/license)，已下载到仓库，运行时无需请求远程图片。图片来源记录见 `public/images/CREDITS.md`，上线前可以换成你自己的照片。

标题优先使用 Google Fonts 的 Noto Serif SC；加载失败时自动使用本机宋体，功能和布局不依赖字体请求。若希望所有资源都本地托管，可删除 `src/styles.css` 中的 `@import`，或自行托管获得许可的字体文件。

## 内容构建

`scripts/content.mjs` 解析 frontmatter、校验内容并清理 Markdown HTML；`vite.config.ts` 将文章注入 Lit 应用，同时输出静态页面、JSON-LD、RSS 和 sitemap。搜索在本地运行，不发送读者查询到服务器。

小型博客的全部正文随前端一起加载，以支持即时全文搜索。如果未来文章数量非常多，可再改为按文章加载与独立搜索索引。
