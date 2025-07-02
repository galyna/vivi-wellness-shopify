export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {name: 'title', type: 'string', title: 'Title'},
    {name: 'slug', type: 'slug', title: 'Slug', options: {source: 'title'}},
    { name: 'mainImagePrompt', type: 'string', title: 'Main Image Prompt' },
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
    {name: 'color', type: 'string', title: 'Color'},
    {name: 'size', type: 'string', title: 'Size'},
    {name: 'material', type: 'string', title: 'Material'},
    {name: 'description', type: 'text', title: 'Description'},
    {name: 'category', type: 'string', title: 'Category'},
    {name: 'price', type: 'number', title: 'Price'},
    {
      name: 'galleryImagePrompts',
      type: 'array',
      of: [{type: 'string'}],
      title: 'Gallery Image Prompts',
    },
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
  
  ],
}
