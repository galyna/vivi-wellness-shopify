export default {
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', title: 'Title' },
    { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title' } },
    { name: 'intro', type: 'text', title: 'Short Introduction' },
    {
      name: 'mainImage',
      type: 'image',
      title: 'Hero Image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }]
    },
    {
      name: 'cardImage',
      type: 'image',
      title: 'Card Image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }]
    },
    { name: 'body', type: 'array', of: [{ type: 'block' }, { type: 'image' }], title: 'Content' },
    { name: 'category', type: 'string', title: 'Category' },
    {
      name: 'productsIds',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      title: 'Products'
    },
    {
      name: 'recipesIds',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'recipe' }] }],
      title: 'Recipes'
    },
    { name: 'mainImagePrompt', type: 'string', title: 'Main Image Prompt' }
  ]
}
