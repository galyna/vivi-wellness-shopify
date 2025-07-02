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
      title: 'Hero Image',
      options: {hotspot: true},
    },
    {
      name: 'stepsWithContent',
      title: 'stepsWithContent',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'step',
          title: 'Step',
          fields: [
            { name: 'text', type: 'string', title: 'Step Text' },
            {
              name: 'image',
              type: 'image',
              title: 'Step Image',
            }
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
