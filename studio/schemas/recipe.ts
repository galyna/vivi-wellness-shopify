export default {
  name: 'recipe',
  title: 'Recipe',
  type: 'document',
  fields: [
    {name: 'title', type: 'string', title: 'Title'},
    {name: 'slug', type: 'slug', title: 'Slug', options: {source: 'title'}},
    {name: 'intro', type: 'text', title: 'Introduction'},
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
          title: 'Recipe',
        },
      ],
    },
    {
      name: 'stepsAdditional',
      title: 'ContentStepsAdditional',
      type: 'array',
      of: [
        { type: 'block' }, // стандартный rich text блок Sanity
        {
          type: 'image',
          fields: [
            { name: 'alt', type: 'string', title: 'Alt text' },
            { name: 'prompt', type: 'string', title: 'Prompt' }
          ]
        }
      ]
    },
    {
      name: 'stepImagePrompts',
      type: 'array',
      of: [{type: 'string'}],
      title: 'Steps Image Prompts',
    },
    {name: 'steps', type: 'array', of: [{type: 'string'}], title: 'Steps'},
    {name: 'time', type: 'string', title: 'Time'},
    {name: 'difficulty', type: 'string', title: 'Difficulty'},
    {name: 'servings', type: 'number', title: 'Servings'},
    {name: 'ingredients', type: 'array', of: [{type: 'string'}], title: 'Ingredients'},
    {name: 'category', type: 'string', title: 'Category'},
    {name: 'productsIds', type: 'array', of: [{type: 'reference', to: [{type: 'product'}]}], title: 'Products'},
    {name: 'articlesIds', type: 'array', of: [{type: 'reference', to: [{type: 'article'}]}], title: 'Articles'},
  
  ],
}
