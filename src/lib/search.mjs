export const categories = ['全部', '技术', '设计', '生活', '随想'];

/** Search all terms across titles, excerpts, tags and article bodies. */
export function searchPosts(posts, query) {
  const terms = query.normalize('NFKC').trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return posts;
  return posts.filter((post) => {
    const haystack = `${post.title} ${post.description} ${post.category} ${post.tags.join(' ')} ${post.text}`.normalize('NFKC').toLocaleLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}

export function categoryFromUrl(search) {
  const category = new URLSearchParams(search).get('category') || '全部';
  return categories.includes(category) ? category : '全部';
}
