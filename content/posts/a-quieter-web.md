---
title: '用 Lit，搭建一个轻盈的数字角落'
description: '不需要庞大的框架，也可以认真做一个网站。从 Web Components 出发，重新找回写网页的简单快乐。'
date: '2026-09-15'
category: '技术'
tags: ['Lit', 'Web Components', '独立博客']
cover: '/images/workspace.jpg'
coverAlt: '温暖日光下，放着笔记本电脑与绿植的工作桌'
---

最近想给自己的文字找一个安静的地方。没有信息流，没有排行榜，也没有必须持续更新的压力。只是一个打开就能阅读的小网站。

选择 Lit，是因为它让我想起最早写网页时的那种直接：HTML 负责内容，CSS 负责样子，JavaScript 让页面动起来。

## 从一个小组件开始

Lit 的核心是 Web Components。你写下一个类，定义它的样式和模板，然后就可以像使用普通 HTML 标签一样使用它。

```typescript
import { LitElement, html, css } from 'lit';

class HelloNote extends LitElement {
  static styles = css`
    p { color: #3d583c; line-height: 1.8; }
  `;

  render() {
    return html`<p>你好，欢迎来到我的数字角落。</p>`;
  }
}

customElements.define('hello-note', HelloNote);
```

组件内部的样式由 Shadow DOM 隔离。这意味着我可以专心处理眼前的组件，而不必担心它的样式会悄悄影响到另一处。

## 把内容留给 Markdown

我不想让写作变成维护代码。文章放在 `content/posts` 里，每篇一个 Markdown 文件，标题、日期和分类写在文件开头。

这样的结构非常朴素，但也足够耐用。文件可以随时迁移，Git 记录每一次修改，写作工具则完全由自己选择。

> 一个好的个人网站，应该让人更愿意写作，而不是更忙于维护网站。

## 轻盈，也可以完整

轻量并不意味着只能做一个演示。分类、搜索、深色模式、RSS，以及每篇文章独立的链接，都可以按需要一点点加入。

部署同样简单：Vite 将项目构建成静态文件，Vercel 负责把它们送到读者面前。不需要数据库，也没有必须持续运行的服务器。

## 让网站慢慢生长

我给这个地方取名叫「片刻」。希望它不只是一个项目，而是一个会随着生活慢慢变化的地方。

先写一篇文章，再做一点微小的调整。把时间留给内容，也把余地留给未来。

如果你也想试试，可以从 [Lit 官方文档](https://lit.dev/docs/) 的第一个组件开始。
