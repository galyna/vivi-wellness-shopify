export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {name: 'title', type: 'string', title: 'Title'},
    {name: 'slug', type: 'slug', title: 'Slug', options: {source: 'title'}},
    {
      name: 'mainImage',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Product',
        },
      ],
    },
    {
      name: 'cardImage',
      type: 'image',
      title: 'Card Image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }]
    },
    {name: 'description', type: 'text', title: 'Description'},
    {name: 'category', type: 'string', title: 'Category'},
    {name: 'price', type: 'number', title: 'Price'},
    {
      name: 'articlesIds',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'article'}]}],
      title: 'Articles',
    },
    {
      name: 'recipesIds',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'recipe'}]}],
      title: 'Recipes',
    },
    { name: 'mainImagePrompt', type: 'string', title: 'Main Image Prompt' },
  ],
}
