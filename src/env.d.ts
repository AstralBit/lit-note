/// <reference types="vite/client" />
declare module 'virtual:blog-content' {
  import type { Post } from './types';
  export const posts: Post[];
}
