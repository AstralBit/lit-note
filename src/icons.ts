import { html, svg } from "lit";

export function icon(name: string, size = 20) {
  const paths: Record<string, ReturnType<typeof svg>> = {
    arrow: svg`<path d="M4 12h15m-6-6 6 6-6 6"/>`,
    diagonal: svg`<path d="M6 18 18 6M6 6h12v12"/>`,
    search: svg`<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>`,
    sun: svg`<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>`,
    moon: svg`<path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z"/>`,
    rss: svg`<path d="M5 10a9 9 0 0 1 9 9M5 4a15 15 0 0 1 15 15"/><circle cx="5" cy="19" r="1"/>`,
    clock: svg`<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>`,
    close: svg`<path d="m6 6 12 12M6 18 18 6"/>`,
    back: svg`<path d="M20 12H5m6-6-6 6 6 6"/>`,
    link: svg`<path d="m10 13 4-4m-5 7-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m0 1 2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0" transform="translate(1 0)"/>`,
    check: svg`<path d="m5 12 4 4L19 6"/>`,
    leaf: svg`<path d="M20 4c0 12-5 16-11 13C2 13 7 4 20 4ZM4 21 15 10"/>`,
    coffee: svg`<path d="M4 8h12v6a6 6 0 0 1-12 0V8Zm12 1h2a3 3 0 1 1 0 6h-2M7 2v2m5-2v2M2 22h17"/>`,
  };
  return html`<svg
    width=${size}
    height=${size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    ${paths[name] || paths.arrow}
  </svg>`;
}
export const mark = (size = 32) =>
  html`<svg
    width=${size}
    height=${size}
    viewBox="0 0 40 40"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M20 1c2.4 12.7 6.3 16.6 19 19-12.7 2.4-16.6 6.3-19 19C17.6 26.3 13.7 22.4 1 20 13.7 17.6 17.6 13.7 20 1Z"
      fill="currentColor"
    />
    <circle cx="20" cy="20" r="3.3" fill="var(--paper)" />
  </svg>`;
