import { LitElement, html, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { repeat } from "lit/directives/repeat.js";
import { posts } from "virtual:blog-content";
import { site } from "./site";
import { icon, mark } from "./icons";
import { appStyles } from "./app-styles";
import { categories, categoryFromUrl, searchPosts } from "./lib/search.mjs";
import type { Post } from "./types";
import "./components/post-card";

class BlogApp extends LitElement {
  static styles = appStyles;
  static properties = {
    path: { state: true },
    category: { state: true },
    query: { state: true },
    dark: { state: true },
    toast: { state: true },
  };
  private path = window.location.pathname.replace(/\/+$/, "") || "/";
  private category = categoryFromUrl(window.location.search);
  private query = "";
  private dark = document.documentElement.dataset.theme === "dark";
  private toast = "";
  private toastTimer?: ReturnType<typeof setTimeout>;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("popstate", this.onPopState);
    document.addEventListener("keydown", this.onKeyDown);
    this.addEventListener("click", this.onLinkClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("popstate", this.onPopState);
    document.removeEventListener("keydown", this.onKeyDown);
    this.removeEventListener("click", this.onLinkClick);
    clearTimeout(this.toastTimer);
  }

  firstUpdated() {
    this.updateMetadata();
    if (location.hash) this.scrollToHeading(location.hash);
  }

  private get currentPost() {
    return posts.find((post) => this.path === `/posts/${post.slug}`);
  }
  private get dialog() {
    return this.renderRoot.querySelector<HTMLDialogElement>("dialog");
  }

  private onPopState = async () => {
    this.path = window.location.pathname.replace(/\/+$/, "") || "/";
    this.category = categoryFromUrl(window.location.search);
    this.dialog?.close();
    await this.updateComplete;
    this.updateMetadata();
    if (location.hash) this.scrollToHeading(location.hash);
  };

  private onKeyDown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (this.dialog?.open) this.dialog.close();
      else void this.openSearch();
    }
  };

  private onLinkClick = (event: MouseEvent) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const anchor = event
      .composedPath()
      .find((item) => item instanceof HTMLAnchorElement) as
      | HTMLAnchorElement
      | undefined;
    if (
      !anchor ||
      anchor.hasAttribute("download") ||
      (anchor.target && anchor.target !== "_self")
    )
      return;
    const url = new URL(anchor.href, location.href);
    if (url.origin !== location.origin || /\.[a-z0-9]+$/i.test(url.pathname))
      return;
    event.preventDefault();
    if (
      url.pathname === location.pathname &&
      url.search === location.search &&
      url.hash
    ) {
      history.replaceState(null, "", url);
      this.scrollToHeading(url.hash);
      return;
    }
    void this.navigate(url);
  };

  private async navigate(url: URL) {
    history.pushState(null, "", url);
    this.path = url.pathname.replace(/\/+$/, "") || "/";
    this.category = categoryFromUrl(url.search);
    this.dialog?.close();
    await this.updateComplete;
    this.updateMetadata();
    this.renderRoot
      .querySelector<HTMLElement>("#main-content")
      ?.focus({ preventScroll: true });
    if (url.hash) this.scrollToHeading(url.hash);
    else window.scrollTo({ top: 0, behavior: "instant" });
  }

  private scrollToHeading(hash: string) {
    let id: string;
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch {
      return;
    }
    const target = this.renderRoot.querySelector<HTMLElement>(
      `#${CSS.escape(id)}`,
    );
    target?.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
    if (id === "main-content") target?.focus({ preventScroll: true });
  }

  private updateMetadata() {
    const post = this.currentPost;
    const knownPage =
      this.path === "/" ||
      this.path === "/archive" ||
      this.path === "/about" ||
      !!post;
    const title = post
      ? `${post.title} · 片刻`
      : this.path === "/archive"
        ? "文章归档 · 片刻"
        : this.path === "/about"
          ? "关于 · 片刻"
          : this.path === "/"
            ? "片刻 · 写下此刻，留给以后"
            : "页面未找到 · 片刻";
    const description =
      post?.description ||
      (this.path === "/about"
        ? site.intro.replace("\n", "")
        : this.path === "/archive"
          ? "沿着时间，回看写下的每一个片刻。"
          : site.description);
    document.title = title;
    const setMeta = (name: string, value: string, property = false) => {
      const attr = property ? "property" : "name";
      let element = document.head.querySelector<HTMLMetaElement>(
        `meta[${attr}="${name}"]`,
      );
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attr, name);
        document.head.append(element);
      }
      element.content = value;
    };
    setMeta("description", description);
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:type", post ? "article" : "website", true);
    setMeta("robots", knownPage ? "index,follow" : "noindex");
    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    const origin = canonical ? new URL(canonical.href).origin : location.origin;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.append(canonical);
    }
    canonical.href = `${origin}${this.path}`;
    setMeta("og:url", canonical.href, true);
    setMeta(
      "og:image",
      `${origin}${post?.cover || "/images/mountains.jpg"}`,
      true,
    );
    document.head
      .querySelectorAll('script[type="application/ld+json"]')
      .forEach((node) => node.remove());
    if (post) {
      const structured = document.createElement("script");
      structured.type = "application/ld+json";
      structured.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        author: { "@type": "Person", name: site.author },
        image: `${origin}${post.cover}`,
        mainEntityOfPage: canonical.href,
      });
      document.head.append(structured);
    }
  }

  private setCategory(category: string) {
    this.category = category;
    const url = new URL(location.href);
    if (category === "全部") url.searchParams.delete("category");
    else url.searchParams.set("category", category);
    history.replaceState(null, "", url);
  }

  private toggleTheme() {
    this.dark = !this.dark;
    const theme = this.dark ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    document
      .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
      ?.setAttribute("content", this.dark ? "#1c231e" : "#f8f9f4");
    try {
      localStorage.setItem("moment-theme", theme);
    } catch {
      /* Theme remains usable without storage. */
    }
  }

  private async openSearch() {
    this.query = "";
    await this.updateComplete;
    this.dialog?.showModal();
    this.renderRoot.querySelector<HTMLInputElement>("#search-input")?.focus();
  }

  private async copyLink() {
    try {
      await navigator.clipboard.writeText(`${location.origin}${this.path}`);
      this.toast = "文章链接已复制";
    } catch {
      this.toast = "请从浏览器地址栏复制文章链接";
    }
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toast = "";
    }, 2600);
  }

  private renderHeader() {
    return html`<a class="skip-link" href="#main-content">跳到正文</a>
      <header class="header">
        <a class="brand" href="/" aria-label="片刻，回到首页"
          >${mark(33)}<span class="brand-name">片刻</span
          ><span class="brand-note">一个安静的数字角落</span></a
        >
        <nav class="navigation" aria-label="主导航">
          ${[
            ["/", "文章"],
            ["/archive", "归档"],
            ["/about", "关于"],
          ].map(
            ([href, label]) =>
              html`<a
                class="nav-link ${this.path === href ||
                (href === "/" && this.currentPost)
                  ? "active"
                  : ""}"
                href=${href}
                aria-current=${this.path === href ? "page" : nothing}
                >${label}</a
              >`,
          )}
          <div class="nav-tools">
            <button
              class="icon-button"
              aria-label="搜索文章"
              title="搜索文章（⌘ / Ctrl K）"
              @click=${this.openSearch}
            >
              ${icon("search", 19)}</button
            ><button
              class="icon-button"
              aria-label=${this.dark ? "切换浅色模式" : "切换深色模式"}
              title=${this.dark ? "切换浅色模式" : "切换深色模式"}
              @click=${this.toggleTheme}
            >
              ${icon(this.dark ? "sun" : "moon", 19)}
            </button>
          </div>
        </nav>
      </header>`;
  }

  private renderHome() {
    const visible =
      this.category === "全部"
        ? posts
        : posts.filter((post) => post.category === this.category);
    return html` <section class="hero" aria-labelledby="hero-title">
        <div>
          <div class="eyebrow">
            <span class="status-dot"></span>A PERSONAL JOURNAL
          </div>
          <h1 id="hero-title">写下此刻，<br />留给<em>以后。</em></h1>
          <p class="hero-description">
            关于技术、设计和日常生活的零散记录。<br />慢慢思考，好好生活，偶尔敲点代码。
          </p>
          <div class="hero-actions">
            <a class="primary-button" href="#articles"
              >翻翻文章 ${icon("arrow", 17)}</a
            ><a class="text-link" href="/about"
              >认识一下我 ${icon("diagonal", 14)}</a
            >
          </div>
        </div>
        <div class="hero-art">
          <div class="photo-main">
            <span class="tape"></span
            ><img
              src="/images/mountains.jpg"
              alt="高耸的山岩下，常青树林环绕着宁静的山谷"
              width="620"
              height="430"
              fetchpriority="high"
            /><span class="photo-caption">somewhere, away from the noise.</span>
          </div>
          <div class="photo-small">
            <img
              src="/images/coffee.jpg"
              alt="日常里的一杯咖啡"
              width="220"
              height="260"
            /><span class="photo-caption">a little everyday joy.</span>
          </div>
          <div class="hero-star">${mark(31)}</div>
          <div class="doodle">
            <svg viewBox="0 0 60 45" fill="none" aria-hidden="true">
              <path
                d="M56 30C26 44 8 25 13 8m-7 8 7-8 8 6"
                stroke="currentColor"
                stroke-width="1.1"
                stroke-linecap="round"
              /></svg
            >把平凡的日子，过成喜欢的样子
          </div>
        </div>
      </section>
      <div class="garden-line">
        <span>${icon("leaf", 15)}一块自由生长的数字花园</span
        ><span class="right">不定期更新 · 始终保持好奇</span>
      </div>
      <section
        class="posts-section"
        id="articles"
        aria-labelledby="posts-title"
      >
        <div class="section-heading">
          <h2 class="section-title" id="posts-title">
            最近写下的<small>LATEST NOTES</small>
          </h2>
          ${this.renderFilters()}
        </div>
        <div class="post-grid" aria-live="polite">
          ${repeat(
            visible,
            (post) => post.slug,
            (post) => html`<post-card .post=${post}></post-card>`,
          )}
        </div>
        ${visible.length
          ? nothing
          : html`<div class="search-empty">
              <p>这个分类还没有文章，先去别处逛逛吧。</p>
              <button
                class="outline-link"
                @click=${() => this.setCategory("全部")}
              >
                查看全部文章
              </button>
            </div>`}
        <div class="posts-bottom">
          <a class="outline-link" href="/archive"
            >所有文字，都在这里 ${icon("arrow", 15)}</a
          >
        </div>
      </section>
      <section class="about-strip">
        <div class="about-intro">
          <div class="mini-illustration">${icon("coffee", 29)}</div>
          <div>
            <h2>嗨，我是${site.author}。</h2>
            <p>
              一个用代码搭建世界，也用文字记录生活的人。<br />很高兴，在互联网的这个小角落遇见你。
            </p>
          </div>
        </div>
        <a class="text-link" href="/about"
          >更多关于我 ${icon("diagonal", 15)}</a
        >
      </section>`;
  }

  private renderFilters() {
    return html`<div
      class="filter-list"
      role="group"
      aria-label="按文章分类筛选"
    >
      ${categories.map(
        (category) =>
          html`<button
            class="filter ${this.category === category ? "active" : ""}"
            aria-pressed=${this.category === category}
            @click=${() => this.setCategory(category)}
          >
            ${category}
          </button>`,
      )}
    </div>`;
  }

  private renderArchive() {
    const visible =
      this.category === "全部"
        ? posts
        : posts.filter((post) => post.category === this.category);
    const years = [...new Set(visible.map((post) => post.date.slice(0, 4)))];
    return html`<section class="inner-page">
      <div class="page-intro">
        <div class="eyebrow">THE ARCHIVE</div>
        <h1>文字的时间线</h1>
        <p>
          沿着时间，回看写下的每一个片刻。<br />这里一共收藏了 ${posts.length}
          篇文字。
        </p>
      </div>
      ${this.renderFilters()}${years.map(
        (year) =>
          html`<section aria-label=${`${year} 年文章`}>
            <h2 class="archive-year">
              ${year}<span
                >${visible.filter((post) => post.date.startsWith(year)).length}
                篇记录</span
              >
            </h2>
            ${visible
              .filter((post) => post.date.startsWith(year))
              .map(
                (post) =>
                  html`<a class="archive-row" href=${`/posts/${post.slug}`}
                    ><time class="archive-date" datetime=${post.date}
                      >${post.date.slice(5).replace("-", " / ")}</time
                    >
                    <h3>${post.title}</h3>
                    <span class="archive-category">${post.category}</span
                    >${icon("diagonal", 17)}</a
                  >`,
              )}
          </section>`,
      )}${!visible.length
        ? html`<div class="search-empty">
            <p>这个分类的故事，还在慢慢发生。</p>
          </div>`
        : nothing}
    </section>`;
  }

  private renderAbout() {
    return html`<section class="inner-page about-page">
      <div class="about-hero">
        <div class="page-intro">
          <div class="eyebrow">A LITTLE ABOUT ME</div>
          <h1>你好，我是${site.author}。</h1>
          <p>
            一个喜欢写代码、散步和观察日常的人。<br />在这里，记录一些想法，也收藏一些生活。
          </p>
        </div>
        <img
          src="/images/garden.jpg"
          alt="园艺铲、泥土和等待栽种的绿植"
          width="440"
          height="480"
        />
      </div>
      <div class="about-prose">
        <h2>关于这个小小的角落</h2>
        <p>
          互联网很大，但我想要的地方很小。一个可以自由写字、不必追赶热点、也不用担心打扰谁的地方。于是，有了「片刻」。
        </p>
        <p>
          我相信那些看起来微不足道的时刻，也值得被认真记录。一次终于想明白的技术问题，一本让人停下来思考的书，或者只是某个晴天，窗台上很好看的光。
        </p>
        <h2>我在关注什么</h2>
        <div class="interest-tags">
          <span>Web 开发</span><span>简单的设计</span><span>独立博客</span
          ><span>咖啡与散步</span><span>日常里的小事</span>
        </div>
        <p>
          技术让我拥有创造的工具，设计让我关心人的感受，而生活，给这一切提供了灵感。我希望把三者都放进这里。
        </p>
        <h2>慢慢写，也慢慢认识</h2>
        <p>
          这里没有固定的更新计划。想清楚一件事情的时候，或是遇见一个值得收藏的片刻，就会回来写一写。如果你喜欢这种节奏，可以通过
          RSS 订阅，在自己的阅读器里等一篇新文章。
        </p>
        <a class="outline-link" href="/rss.xml"
          >${icon("rss", 15)}订阅片刻的 RSS ${icon("diagonal", 14)}</a
        >
        <p
          style="margin-top: 36px; font-family: var(--serif); color: var(--green)"
        >
          谢谢你，在这里停留。愿你的今天，也有一个喜欢的片刻。
        </p>
      </div>
    </section>`;
  }

  private renderPost(post: Post) {
    const related = [
      ...posts.filter(
        (item) => item.slug !== post.slug && item.category === post.category,
      ),
      ...posts.filter(
        (item) => item.slug !== post.slug && item.category !== post.category,
      ),
    ].slice(0, 3);
    return html`<article>
        <div class="article-top">
          <a class="text-link" href="/">${icon("back", 16)}回到所有文章</a>
        </div>
        <header class="article-header">
          <div class="article-meta">
            <a
              class="category-pill"
              href=${`/?category=${encodeURIComponent(post.category)}#articles`}
              >${post.category}</a
            ><time datetime=${post.date}>${post.date.replaceAll("-", ".")}</time
            ><span>·</span><span>${post.minutes} 分钟阅读</span>
          </div>
          <h1>${post.title}</h1>
          <p>${post.description}</p>
          <div class="article-meta">
            <span>文 / ${site.author}</span><span>·</span
            ><span>记录一个值得留下的片刻</span>
          </div>
        </header>
        <img
          class="article-cover"
          src=${post.cover}
          alt=${post.coverAlt}
          width="1080"
          height="410"
        />
        <div class="article-layout">
          <div>
            <div class="prose">${unsafeHTML(post.html)}</div>
            <div class="article-end">
              <div class="article-tags">
                ${post.tags.map((tag) => html`<span># ${tag}</span>`)}
              </div>
              <button @click=${this.copyLink}>
                ${icon("link", 15)}复制链接
              </button>
            </div>
          </div>
          ${post.headings.length
            ? html`<aside class="toc" aria-label="文章目录">
                <p>这篇文章里</p>
                ${post.headings.map(
                  (heading) =>
                    html`<a href=${`#${heading.id}`}>${heading.text}</a>`,
                )}
              </aside>`
            : nothing}
        </div>
      </article>
      <section class="related" aria-labelledby="related-title">
        <h2 class="section-title" id="related-title">
          还可以读读<small>KEEP WANDERING</small>
        </h2>
        <div class="post-grid">
          ${related.map((item) => html`<post-card .post=${item}></post-card>`)}
        </div>
      </section>`;
  }

  private renderNotFound() {
    return html`<section class="not-found">
      <div class="number">404</div>
      <h1>这一页，暂时走丢了。</h1>
      <p>也许链接有误，也许故事还没写下。<br />不如回到首页，看看其他片刻。</p>
      <a href="/" class="primary-button">${icon("back", 16)}回到首页</a>
    </section>`;
  }

  private renderFooter() {
    return html`<footer class="footer">
      <div class="footer-left">
        <span>© ${new Date().getFullYear()} 片刻</span
        ><span>用文字收藏生活，用热爱保持鲜活。</span>
      </div>
      <div class="footer-links">
        <span class="lit-signature"
          >Made with
          <a href="https://lit.dev/" target="_blank" rel="noopener noreferrer"
            ><b>Lit</b> ${mark(10)}</a
          ></span
        ><a href="/rss.xml" title="RSS 订阅">${icon("rss", 12)}RSS</a
        ><a href="/about">关于</a>
      </div>
    </footer>`;
  }

  private renderSearch() {
    const results: Post[] = searchPosts(posts, this.query);
    return html`<dialog
      aria-label="搜索文章"
      @click=${(event: MouseEvent) => {
        if (event.target !== this.dialog || !this.dialog) return;
        const rect = this.dialog.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          this.dialog.close();
      }}
    >
      <div class="search-heading">
        ${icon("search", 21)}<input
          id="search-input"
          aria-label="搜索标题、标签或正文"
          placeholder="找找感兴趣的文字…"
          autocomplete="off"
          .value=${this.query}
          @input=${(event: Event) => {
            this.query = (event.target as HTMLInputElement).value;
          }}
        /><button
          class="icon-button"
          aria-label="关闭搜索"
          @click=${() => this.dialog?.close()}
        >
          ${icon("close", 19)}
        </button>
      </div>
      <div class="search-body">
        <p class="search-count" role="status">
          ${this.query.trim()
            ? `找到 ${results.length} 篇相关文字`
            : "从最近的文字开始逛逛"}
        </p>
        ${results.length
          ? results.map(
              (post) =>
                html`<a class="search-result" href=${`/posts/${post.slug}`}
                  ><h3>${post.title}</h3>
                  <p>
                    ${post.category} · ${post.date.replaceAll("-", ".")} ·
                    ${post.minutes} 分钟阅读
                  </p></a
                >`,
            )
          : html`<div class="search-empty">
              ${icon("leaf", 30)}
              <h3>还没有找到这个片刻</h3>
              <p>试试「Lit」「生活」或一个更简短的关键词。</p>
            </div>`}
      </div>
      <div class="search-footer">
        <span>标题、标签和正文，都可以搜索</span
        ><span><kbd>Esc</kbd> 关闭</span>
      </div>
    </dialog>`;
  }

  render() {
    return html`<div class="wrap">
        ${this.renderHeader()}
        <main id="main-content" tabindex="-1">
          ${this.path === "/"
            ? this.renderHome()
            : this.path === "/archive"
              ? this.renderArchive()
              : this.path === "/about"
                ? this.renderAbout()
                : this.currentPost
                  ? this.renderPost(this.currentPost)
                  : this.renderNotFound()}
        </main>
        ${this.renderFooter()}
      </div>
      ${this.renderSearch()}${this.toast
        ? html`<div class="toast" role="status">
            ${icon("check", 13)} ${this.toast}
          </div>`
        : nothing}`;
  }
}

customElements.define("blog-app", BlogApp);
