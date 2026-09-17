import { LitElement, css, html } from "lit";
import type { Post } from "../types";
import { icon } from "../icons";

export class PostCard extends LitElement {
  static properties = { post: { type: Object } };
  declare post: Post;
  static styles = css`
    :host {
      display: block;
      min-width: 0;
    }
    * {
      box-sizing: border-box;
    }
    a {
      display: block;
      color: inherit;
      text-decoration: none;
    }
    a:focus-visible {
      outline: 2px solid var(--green);
      outline-offset: 7px;
      border-radius: 6px;
    }
    .cover {
      aspect-ratio: 1.62;
      overflow: hidden;
      border-radius: 7px;
      background: var(--soft);
      position: relative;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
      display: block;
    }
    a:hover img {
      transform: scale(1.045);
    }
    .image-arrow {
      position: absolute;
      bottom: 14px;
      right: 14px;
      display: grid;
      place-items: center;
      width: 34px;
      height: 34px;
      background: #f8f9f4ec;
      color: #29342b;
      border-radius: 50%;
      opacity: 0;
      transform: translateY(6px);
      transition: 0.2s;
    }
    a:hover .image-arrow,
    a:focus-visible .image-arrow {
      opacity: 1;
      transform: none;
    }
    .meta {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 20px;
      color: var(--muted);
      font-size: 11px;
      letter-spacing: 0.3px;
    }
    .tag {
      background: var(--soft);
      color: var(--green);
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 10px;
    }
    .dot {
      font-size: 8px;
      color: var(--muted);
      opacity: 0.7;
    }
    h3 {
      margin: 13px 0 10px;
      font-family: var(--serif);
      font-size: 20px;
      font-weight: 600;
      letter-spacing: -0.5px;
      line-height: 1.65;
      transition: color 0.2s;
    }
    a:hover h3 {
      color: var(--green);
    }
    p {
      margin: 0;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.95;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .read {
      color: var(--muted);
      display: flex;
      gap: 5px;
      align-items: center;
      margin-top: 18px;
      font-size: 10px;
    }
    @media (prefers-reduced-motion: reduce) {
      * {
        transition: none !important;
      }
    }
    @media (max-width: 600px) {
      h3 {
        font-size: 22px;
      }
      p {
        font-size: 13px;
      }
      .meta {
        font-size: 12px;
      }
      .read {
        font-size: 11px;
      }
    }
  `;
  render() {
    if (!this.post) return;
    const p = this.post;
    return html`<a href=${`/posts/${p.slug}`} aria-label=${`阅读：${p.title}`}
      ><div class="cover">
        <img
          src=${p.cover}
          alt=${p.coverAlt}
          loading="lazy"
          width="720"
          height="445"
        /><span class="image-arrow">${icon("diagonal", 17)}</span>
      </div>
      <div class="meta">
        <span class="tag">${p.category}</span><span class="dot">·</span
        ><time datetime=${p.date}>${p.date.replaceAll("-", ".")}</time>
      </div>
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="read">
        ${icon("clock", 13)}<span>${p.minutes} 分钟阅读</span>
      </div></a
    >`;
  }
}
customElements.define("post-card", PostCard);
