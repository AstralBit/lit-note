import { css } from "lit";

export const appStyles = css`
  :host {
    display: block;
    color: var(--ink);
    font-size: 14px;
  }
  * {
    box-sizing: border-box;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  button,
  input {
    font: inherit;
  }
  button,
  a {
    -webkit-tap-highlight-color: transparent;
  }
  button {
    cursor: pointer;
    color: inherit;
  }
  button:disabled {
    cursor: default;
  }
  button,
  input {
    outline: none;
  }
  :focus-visible {
    outline: 2px solid var(--green);
    outline-offset: 5px;
    border-radius: 3px;
  }
  button {
    border: 0;
    background: none;
  }
  .wrap {
    width: min(1080px, calc(100% - 112px));
    margin-inline: auto;
  }
  .skip-link {
    position: fixed;
    z-index: 50;
    top: -100px;
    left: 20px;
    padding: 12px 18px;
    background: var(--green);
    color: var(--paper);
  }
  .skip-link:focus {
    top: 10px;
  }
  .header {
    height: 104px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--line);
  }
  .brand {
    display: flex;
    gap: 12px;
    align-items: center;
    color: var(--green);
  }
  .brand-name {
    font-family: var(--serif);
    font-size: 29px;
    font-weight: 700;
    letter-spacing: 2px;
  }
  .brand-note {
    color: var(--muted);
    border-left: 1px solid var(--line);
    padding-left: 15px;
    margin-left: 7px;
    font-size: 11px;
    letter-spacing: 1px;
  }
  .navigation {
    display: flex;
    align-items: center;
    gap: 31px;
    font-size: 12px;
  }
  .nav-link {
    color: var(--muted);
    height: 104px;
    display: flex;
    align-items: center;
    position: relative;
  }
  .nav-link.active {
    color: var(--green);
    font-weight: 600;
  }
  .nav-link.active::after {
    content: "";
    position: absolute;
    height: 3px;
    width: 14px;
    background: var(--green);
    border-radius: 3px;
    left: calc(50% - 7px);
    bottom: 24px;
  }
  .nav-tools {
    display: flex;
    gap: 12px;
    padding-left: 21px;
    border-left: 1px solid var(--line);
  }
  .icon-button {
    display: inline-grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    color: var(--muted);
    padding: 0;
  }
  .icon-button:hover {
    background: var(--soft);
    color: var(--green);
  }
  .hero {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 45px;
    padding: 79px 0 69px;
    align-items: center;
  }
  .eyebrow {
    font-size: 10px;
    letter-spacing: 2px;
    font-weight: 500;
    display: flex;
    gap: 9px;
    align-items: center;
    color: var(--muted);
  }
  .status-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    background: #81916c;
    border-radius: 50%;
    box-shadow: 0 0 0 4px #81916c12;
  }
  h1 {
    font-family: var(--serif);
    font-weight: 500;
    font-size: clamp(38px, 4.2vw, 56px);
    line-height: 1.6;
    letter-spacing: -2px;
    margin: 20px 0 19px;
  }
  h1 em {
    font-style: normal;
    color: var(--green);
    position: relative;
    z-index: 0;
  }
  h1 em::after {
    content: "";
    height: 8px;
    border-radius: 50%;
    background: #b6c79570;
    width: 96%;
    bottom: 5px;
    left: 0;
    position: absolute;
    z-index: -1;
    transform: rotate(-2deg);
  }
  .hero-description {
    line-height: 2.1;
    color: var(--muted);
    font-size: 13px;
    margin: 0;
  }
  .hero-actions {
    display: flex;
    align-items: center;
    gap: 25px;
    margin-top: 29px;
  }
  .primary-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 22px;
    color: var(--paper);
    background: var(--green);
    padding: 13px 20px;
    border-radius: 5px;
    font-size: 12px;
    transition:
      opacity 0.2s,
      transform 0.2s;
  }
  .primary-button:hover {
    opacity: 0.88;
    transform: translateY(-2px);
  }
  .text-link {
    color: var(--muted);
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
  }
  .text-link:hover {
    color: var(--green);
  }
  .hero-art {
    position: relative;
    height: 360px;
    margin-left: 10px;
  }
  .photo-main {
    width: 88%;
    height: 308px;
    background: var(--surface);
    border: 9px solid var(--surface);
    border-bottom-width: 35px;
    position: absolute;
    top: 4px;
    right: 10px;
    transform: rotate(5deg);
    box-shadow: 0 7px 25px #2835240c;
  }
  .photo-main img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 55%;
    filter: saturate(0.65);
  }
  .photo-caption {
    color: #7a8076;
    position: absolute;
    bottom: -25px;
    right: 4px;
    font-family: Georgia, serif;
    font-size: 10px;
    font-style: italic;
    letter-spacing: 1px;
  }
  .tape {
    height: 27px;
    width: 95px;
    background: #d9dcc6a6;
    position: absolute;
    top: -18px;
    left: 37%;
    transform: rotate(-9deg);
    z-index: 2;
    clip-path: polygon(2% 0, 100% 2%, 97% 100%, 0 97%);
  }
  .photo-small {
    position: absolute;
    width: 143px;
    height: 167px;
    bottom: 8px;
    left: -9px;
    border: 7px solid var(--surface);
    border-bottom-width: 26px;
    background: var(--surface);
    transform: rotate(-9deg);
    box-shadow: 0 7px 22px #1c28171c;
  }
  .photo-small img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .photo-small .photo-caption {
    bottom: -20px;
    left: 10px;
    font-size: 9px;
  }
  .doodle {
    position: absolute;
    bottom: 7px;
    right: 32px;
    color: var(--muted);
    font-family: var(--serif);
    font-size: 12px;
    letter-spacing: 2px;
    transform: rotate(-4deg);
  }
  .doodle svg {
    position: absolute;
    top: -18px;
    left: -47px;
    width: 46px;
    height: 43px;
  }
  .hero-star {
    position: absolute;
    right: -17px;
    top: -18px;
    color: #849365;
    transform: rotate(15deg);
  }
  .garden-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 0;
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    font-size: 11px;
    color: var(--muted);
  }
  .garden-line span {
    display: flex;
    align-items: center;
    gap: 9px;
  }
  .garden-line .right {
    font-size: 10px;
    letter-spacing: 0.7px;
  }
  .posts-section {
    padding-top: 52px;
    scroll-margin-top: 28px;
  }
  .section-heading {
    display: flex;
    justify-content: space-between;
    align-items: end;
    gap: 20px;
    margin-bottom: 27px;
  }
  .section-title {
    font-family: var(--serif);
    font-size: 28px;
    font-weight: 500;
    letter-spacing: -0.5px;
    margin: 0;
  }
  .section-title small {
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 10px;
    color: var(--muted);
    font-weight: 400;
    margin-left: 12px;
    letter-spacing: 1.5px;
  }
  .filter-list {
    display: flex;
    gap: 5px;
  }
  .filter {
    color: var(--muted);
    padding: 7px 13px;
    font-size: 11px;
    border-radius: 4px;
  }
  .filter:hover {
    color: var(--green);
  }
  .filter.active {
    color: var(--green);
    background: var(--soft);
    font-weight: 500;
  }
  .post-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 41px 27px;
  }
  .posts-bottom {
    display: flex;
    justify-content: center;
    padding: 35px 0 46px;
  }
  .outline-link {
    display: inline-flex;
    align-items: center;
    gap: 24px;
    border: 1px solid var(--line);
    border-radius: 5px;
    padding: 11px 19px;
    color: var(--muted);
    font-size: 11px;
  }
  .outline-link:hover {
    background: var(--soft);
    border-color: var(--soft);
    color: var(--green);
  }
  .about-strip {
    margin: 12px 0 48px;
    padding: 27px 33px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    background: var(--soft);
    border-radius: 7px;
  }
  .about-intro {
    display: flex;
    align-items: center;
    gap: 21px;
  }
  .mini-illustration {
    height: 57px;
    width: 57px;
    border: 1px solid var(--green);
    opacity: 0.65;
    border-radius: 50%;
    display: grid;
    place-items: center;
    flex: 0 0 auto;
  }
  .about-strip h2 {
    margin: 0 0 8px;
    font-family: var(--serif);
    font-size: 17px;
    font-weight: 500;
  }
  .about-strip p {
    margin: 0;
    color: var(--muted);
    font-size: 11px;
    line-height: 1.8;
  }
  .about-strip .text-link {
    color: var(--green);
    white-space: nowrap;
  }
  .footer {
    padding: 26px 0 29px;
    border-top: 1px solid var(--line);
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--muted);
    font-size: 10px;
  }
  .footer-left {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  .footer-links {
    display: flex;
    gap: 20px;
    align-items: center;
  }
  .footer-links a {
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }
  .footer a:hover {
    color: var(--green);
  }
  .lit-signature {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .lit-signature b {
    font-weight: 500;
    color: var(--green);
  }
  .inner-page {
    padding: 64px 0 75px;
    min-height: 70vh;
  }
  .page-intro {
    margin-bottom: 46px;
  }
  .page-intro h1 {
    font-size: 42px;
    margin-bottom: 14px;
  }
  .page-intro p {
    color: var(--muted);
    line-height: 1.9;
  }
  .archive-year {
    font-family: Georgia, serif;
    font-size: 29px;
    margin: 45px 0 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    font-weight: 400;
  }
  .archive-year span {
    font-family: sans-serif;
    font-size: 11px;
    color: var(--muted);
  }
  .archive-row {
    display: grid;
    grid-template-columns: 70px 1fr 65px 24px;
    align-items: center;
    padding: 22px 4px;
    gap: 22px;
    border-bottom: 1px solid var(--line);
  }
  .archive-row:hover {
    color: var(--green);
    background: var(--soft);
  }
  .archive-date {
    font-size: 12px;
    color: var(--muted);
    font-variant-numeric: tabular-nums;
  }
  .archive-row h3 {
    margin: 0;
    font-family: var(--serif);
    font-size: 18px;
    font-weight: 500;
  }
  .archive-category {
    font-size: 11px;
    color: var(--muted);
  }
  .about-page {
    max-width: 780px;
    margin: 0 auto;
  }
  .about-hero {
    display: grid;
    grid-template-columns: 1fr 220px;
    gap: 36px;
    align-items: center;
    margin-bottom: 45px;
  }
  .about-hero img {
    width: 220px;
    height: 240px;
    object-fit: cover;
    border: 9px solid var(--surface);
    border-bottom-width: 29px;
    transform: rotate(4deg);
    box-shadow: var(--shadow);
  }
  .about-prose {
    line-height: 2;
    font-size: 15px;
  }
  .about-prose h2 {
    font-family: var(--serif);
    font-size: 24px;
    font-weight: 500;
    margin: 38px 0 13px;
  }
  .about-prose p {
    color: var(--muted);
  }
  .interest-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 24px 0;
  }
  .interest-tags span {
    border: 1px solid var(--line);
    border-radius: 30px;
    padding: 5px 14px;
    font-size: 12px;
    color: var(--green);
  }
  .article-top {
    margin: 41px 0 25px;
  }
  .article-header {
    max-width: 790px;
    margin: 41px auto 34px;
    text-align: center;
  }
  .article-meta {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    color: var(--muted);
    font-size: 12px;
  }
  .category-pill {
    background: var(--soft);
    color: var(--green);
    padding: 5px 10px;
    border-radius: 4px;
  }
  .article-header h1 {
    font-size: 36px;
    margin: 20px 0 18px;
    letter-spacing: -0.7px;
  }
  .article-header p {
    color: var(--muted);
    font-size: 14px;
    line-height: 1.9;
    max-width: 640px;
    margin: 0 auto 20px;
  }
  .article-cover {
    width: 100%;
    aspect-ratio: 2.65;
    object-fit: cover;
    border-radius: 8px;
    display: block;
  }
  .article-layout {
    display: grid;
    grid-template-columns: minmax(0, 720px) 185px;
    gap: 60px;
    justify-content: center;
    margin: 45px auto;
  }
  .prose {
    font-size: 15px;
    line-height: 2.05;
    min-width: 0;
    overflow-wrap: anywhere;
  }
  .prose > :first-child {
    margin-top: 0;
  }
  .prose h1,
  .prose h2,
  .prose h3 {
    font-family: var(--serif);
    scroll-margin-top: 28px;
  }
  .prose h2 {
    font-size: 26px;
    font-weight: 500;
    margin: 42px 0 17px;
  }
  .prose h3 {
    font-size: 21px;
  }
  .prose p,
  .prose ul,
  .prose ol {
    margin: 0 0 23px;
  }
  .prose a {
    text-decoration: underline;
    text-decoration-color: #a8b994;
    text-underline-offset: 4px;
    color: var(--green);
  }
  .prose blockquote {
    margin: 27px 0;
    padding: 18px 24px;
    border-left: 3px solid #8b9c73;
    background: var(--soft);
    color: var(--green);
    font-family: var(--serif);
  }
  .prose blockquote p {
    margin: 0;
  }
  .prose code {
    font-size: 0.85em;
    font-family: "SFMono-Regular", Consolas, monospace;
    background: var(--soft);
    border-radius: 4px;
    padding: 3px 5px;
  }
  .prose pre {
    padding: 23px;
    background: var(--soft);
    border: 1px solid var(--line);
    border-radius: 6px;
    overflow-x: auto;
    line-height: 1.75;
  }
  .prose pre code {
    padding: 0;
    background: none;
  }
  .prose img {
    max-width: 100%;
    height: auto;
    border-radius: 6px;
  }
  .prose table {
    display: block;
    overflow-x: auto;
    border-collapse: collapse;
  }
  .prose th,
  .prose td {
    border: 1px solid var(--line);
    padding: 8px 12px;
  }
  .toc {
    position: sticky;
    top: 35px;
    align-self: start;
    border-left: 1px solid var(--line);
    padding-left: 23px;
  }
  .toc p {
    font-size: 12px;
    margin: 0 0 15px;
  }
  .toc a {
    display: block;
    font-size: 11px;
    color: var(--muted);
    line-height: 1.8;
    margin-bottom: 13px;
  }
  .toc a:hover {
    color: var(--green);
  }
  .article-end {
    margin-top: 38px;
    padding-top: 24px;
    border-top: 1px solid var(--line);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
  }
  .article-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    color: var(--muted);
    font-size: 11px;
  }
  .article-end button {
    font-size: 11px;
    color: var(--muted);
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
  }
  .related {
    padding: 25px 0 60px;
  }
  .related .section-title {
    margin-bottom: 26px;
  }
  .not-found {
    text-align: center;
    padding: 110px 0;
  }
  .not-found .number {
    font-family: Georgia, serif;
    font-size: 90px;
    color: var(--green);
    opacity: 0.35;
  }
  .not-found h1 {
    font-size: 34px;
    margin: 10px 0;
  }
  .not-found p {
    color: var(--muted);
    margin-bottom: 30px;
  }
  dialog {
    background: var(--paper);
    color: var(--ink);
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 0;
    width: min(620px, calc(100vw - 32px));
    max-height: min(640px, 80dvh);
    margin: 13vh auto auto;
    box-shadow: 0 30px 90px #0003;
  }
  dialog::backdrop {
    background: #15241960;
    backdrop-filter: blur(5px);
  }
  .search-heading {
    display: flex;
    align-items: center;
    padding: 18px 23px;
    border-bottom: 1px solid var(--line);
    gap: 12px;
  }
  .search-heading input {
    width: 100%;
    min-width: 0;
    border: 0;
    background: none;
    color: var(--ink);
    font-size: 15px;
    padding: 5px 0;
  }
  .search-heading input:focus-visible {
    outline: none;
  }
  .search-heading:focus-within {
    box-shadow: inset 0 -2px 0 var(--green);
  }
  .search-body {
    padding: 17px 23px;
    overflow-y: auto;
    max-height: 420px;
  }
  .search-count {
    font-size: 11px;
    color: var(--muted);
    margin: 2px 0 14px;
  }
  .search-result {
    display: block;
    padding: 14px 11px;
    border-radius: 5px;
  }
  .search-result:hover,
  .search-result:focus-visible {
    background: var(--soft);
  }
  .search-result h3 {
    margin: 0 0 6px;
    font-family: var(--serif);
    font-size: 16px;
    font-weight: 500;
  }
  .search-result p {
    margin: 0;
    color: var(--muted);
    font-size: 11px;
    line-height: 1.8;
  }
  .search-empty {
    text-align: center;
    padding: 35px 15px;
  }
  .search-empty p {
    color: var(--muted);
    font-size: 12px;
  }
  .search-footer {
    border-top: 1px solid var(--line);
    padding: 13px 23px;
    display: flex;
    justify-content: space-between;
    color: var(--muted);
    font-size: 10px;
  }
  kbd {
    font-family: inherit;
    border: 1px solid var(--line);
    padding: 2px 5px;
    border-radius: 3px;
    font-size: 10px;
  }
  .toast {
    position: fixed;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%);
    padding: 13px 21px;
    border-radius: 6px;
    background: var(--green);
    color: var(--paper);
    box-shadow: var(--shadow);
    z-index: 30;
    font-size: 12px;
  }
  @media (min-width: 1500px) {
    .wrap {
      width: 1120px;
    }
    .hero {
      padding-top: 88px;
      padding-bottom: 78px;
    }
  }
  @media (max-width: 1000px) {
    .wrap {
      width: calc(100% - 72px);
    }
    .brand-note {
      display: none;
    }
    .hero {
      gap: 20px;
      padding: 65px 0;
    }
    .hero-art {
      height: 320px;
    }
    .photo-main {
      height: 270px;
    }
    .photo-small {
      width: 124px;
      height: 146px;
    }
    .doodle {
      right: 7px;
      font-size: 10px;
    }
    .post-grid {
      gap: 35px 22px;
    }
    .article-layout {
      grid-template-columns: minmax(0, 1fr) 150px;
      gap: 35px;
    }
  }
  @media (max-width: 760px) {
    .wrap {
      width: calc(100% - 44px);
    }
    .header {
      height: 84px;
    }
    .brand {
      gap: 8px;
    }
    .brand-name {
      font-size: 25px;
    }
    .brand svg {
      width: 28px;
    }
    .navigation {
      gap: 23px;
    }
    .nav-link {
      height: 84px;
    }
    .nav-link.active::after {
      bottom: 16px;
    }
    .nav-tools {
      padding-left: 12px;
      gap: 5px;
    }
    .hero {
      padding: 48px 0;
      gap: 20px;
    }
    .hero h1 {
      font-size: 39px;
    }
    .hero-description {
      font-size: 12px;
    }
    .hero-art {
      height: 275px;
      margin-left: 0;
    }
    .photo-main {
      height: 225px;
      right: 4px;
      width: 91%;
    }
    .photo-small {
      height: 121px;
      width: 102px;
      left: -9px;
    }
    .doodle {
      font-size: 9px;
      right: 0;
      bottom: -3px;
      letter-spacing: 0;
    }
    .hero-star {
      right: -8px;
    }
    .hero-actions {
      gap: 15px;
    }
    .primary-button {
      gap: 14px;
      padding: 12px 15px;
    }
    .section-title {
      font-size: 26px;
    }
    .section-title small {
      display: none;
    }
    .filter {
      padding: 7px 10px;
    }
    .post-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .about-strip {
      padding: 24px;
    }
    .mini-illustration {
      display: none;
    }
    .article-layout {
      display: block;
      max-width: 660px;
    }
    .toc {
      display: none;
    }
    .article-header h1 {
      font-size: 31px;
    }
    .article-cover {
      aspect-ratio: 2;
    }
    .footer-left {
      gap: 9px;
    }
    .footer-links {
      gap: 14px;
    }
    .lit-signature {
      display: none;
    }
  }
  @media (max-width: 540px) {
    .wrap {
      width: calc(100% - 40px);
    }
    .header {
      height: 76px;
    }
    .brand {
      gap: 6px;
    }
    .brand-name {
      font-size: 23px;
    }
    .brand svg {
      width: 24px;
    }
    .navigation {
      gap: 18px;
      font-size: 11px;
    }
    .nav-link {
      height: 76px;
    }
    .nav-link.active::after {
      bottom: 14px;
    }
    .nav-tools {
      gap: 2px;
      padding-left: 0;
      border: 0;
    }
    .icon-button {
      width: 27px;
      height: 32px;
    }
    .icon-button svg {
      width: 17px;
    }
    .hero {
      grid-template-columns: 1fr;
      gap: 36px;
      padding: 42px 0 35px;
    }
    .hero h1 {
      font-size: 46px;
      line-height: 1.5;
      margin-top: 19px;
    }
    .hero-description {
      font-size: 13px;
    }
    .hero-actions {
      margin-top: 25px;
      gap: 25px;
    }
    .hero-art {
      width: min(360px, 100% - 20px);
      height: 305px;
      margin: 0 auto;
    }
    .photo-main {
      height: 257px;
      right: 8px;
      width: 88%;
    }
    .photo-small {
      width: 122px;
      height: 147px;
      bottom: 0;
      left: -4px;
    }
    .doodle {
      bottom: -1px;
      right: 7px;
      font-size: 10px;
    }
    .hero-star {
      top: -12px;
      right: -8px;
    }
    .garden-line {
      padding: 16px 0;
      font-size: 10px;
    }
    .garden-line .right {
      display: none;
    }
    .posts-section {
      padding-top: 35px;
    }
    .section-heading {
      flex-direction: column;
      align-items: start;
      gap: 19px;
      margin-bottom: 23px;
    }
    .filter-list {
      gap: 8px;
    }
    .filter {
      padding: 7px 13px;
      font-size: 12px;
    }
    .post-grid {
      grid-template-columns: 1fr;
      gap: 35px;
    }
    .about-strip {
      padding: 23px;
      align-items: start;
      flex-direction: column;
      gap: 18px;
      margin-bottom: 32px;
    }
    .about-strip h2 {
      font-size: 18px;
    }
    .about-strip p {
      font-size: 12px;
    }
    .footer {
      align-items: start;
      gap: 20px;
      font-size: 10px;
    }
    .footer-left {
      flex-direction: column;
      align-items: start;
      gap: 8px;
    }
    .footer-links {
      padding-top: 2px;
    }
    .inner-page {
      padding-top: 42px;
    }
    .page-intro h1 {
      font-size: 35px;
    }
    .page-intro {
      margin-bottom: 32px;
    }
    .archive-row {
      grid-template-columns: 44px 1fr 20px;
      gap: 13px;
      padding-block: 20px;
    }
    .archive-row h3 {
      font-size: 16px;
      line-height: 1.7;
    }
    .archive-category {
      display: none;
    }
    .archive-date {
      font-size: 10px;
    }
    .about-hero {
      grid-template-columns: 1fr;
      gap: 5px;
    }
    .about-hero img {
      width: 100%;
      height: 245px;
      margin: 0 0 15px;
      transform: rotate(2deg);
    }
    .about-prose {
      font-size: 14px;
    }
    .article-top {
      margin-top: 26px;
    }
    .article-header {
      margin-top: 28px;
    }
    .article-header h1 {
      font-size: 28px;
      text-align: left;
    }
    .article-header p {
      font-size: 13px;
      text-align: left;
    }
    .article-meta {
      font-size: 10px;
      gap: 9px;
      justify-content: flex-start;
    }
    .article-cover {
      aspect-ratio: 1.6;
    }
    .article-layout {
      margin-top: 28px;
    }
    .prose {
      font-size: 14px;
    }
    .prose h2 {
      font-size: 23px;
    }
    .prose pre {
      padding: 17px;
    }
    .prose blockquote {
      padding: 16px 19px;
    }
    .article-end {
      align-items: start;
    }
    .related {
      padding-bottom: 40px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      transition: none !important;
      scroll-behavior: auto !important;
    }
  }
`;
