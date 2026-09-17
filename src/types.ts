export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  cover: string;
  coverAlt: string;
  minutes: number;
  html: string;
  text: string;
  headings: { id: string; text: string }[];
}
