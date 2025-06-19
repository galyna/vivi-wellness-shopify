export default {
    name: 'article',
    title: 'Article',
    type: 'document',
    fields: [
      { name: 'title', type: 'string', title: 'Title' },
      { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title' } },
      { name: 'publishedAt', type: 'datetime', title: 'Published at' },
      { name: 'body', type: 'array', of: [{ type: 'block' }], title: 'Content' },
    ]
  }