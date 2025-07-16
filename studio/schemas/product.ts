export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {name: 'title', type: 'string', title: 'Title'},
    {
      name: 'galleryImages',
      type: 'array',
      of: [{
        name: 'mainImage',
        type: 'image',
        title: 'Hero Image',
      },],
      title: 'Gallery Images',
    },
    {name: 'category', type: 'string', title: 'Category'},
    {name: 'description', type: 'text', title: 'Description'},
    {name: 'price', type: 'number', title: 'Price'},
    {
      name: 'mainImage',
      type: 'image',
      title: 'Hero Image',
    },
    {name: 'color', type: 'string', title: 'Color'},
    {name: 'size', type: 'string', title: 'Size'},
    {name: 'material', type: 'string', title: 'Material'},
    {name: 'slug', type: 'slug', title: 'Slug', options: {source: 'title'}},
    { name: 'mainImagePrompt', type: 'string', title: 'Main Image Prompt' },
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
