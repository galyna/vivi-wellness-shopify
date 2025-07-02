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
      title: 'Hero Image',
    },
    {
      name: 'galleryImagePrompts',
      type: 'array',
      of: [{type: 'string'}],
      title: 'Gallery Image Prompts',
    },    {
      name: 'galleryImages',
      type: 'array',
      of: [{
        name: 'mainImage',
        type: 'image',
        title: 'Hero Image',
      },],
      title: 'Gallery Images',
    },
    {name: 'color', type: 'string', title: 'Color'},
    {name: 'size', type: 'string', title: 'Size'},
    {name: 'material', type: 'string', title: 'Material'},
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
  
  ],
}
