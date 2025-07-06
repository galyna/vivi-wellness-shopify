export default {
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    {name: 'title', type: 'string', title: 'Title'},
    {name: 'category', type: 'string', title: 'Category'},
    {name: 'slug', type: 'slug', title: 'Slug', options: {source: 'title'}},
    {name: 'intro', type: 'text', title: 'Short Introduction'},
    {name: 'mainImagePrompt', type: 'string', title: 'Main Image Prompt'},
    {
      name: 'mainImage',
      type: 'image',
      title: 'Article Image',
      options: {hotspot: true},
      fields: [{name: 'alt', type: 'string', title: 'Alt text', options: {source: 'title'}}],
    },
    {name: 'length', type: 'string', title: 'Length'},
    {name: 'tone', type: 'string', title: 'Tone'},
    {name: 'author', type: 'string', title: 'Author'},
    {name: 'date', type: 'date', title: 'Date'},
    {
      name: 'galleryImagePrompts',
      type: 'array',
      of: [{type: 'string'}],
      title: 'Gallery Image Prompts',
    },
    {
      name: 'paragraphs',
      title: 'Paragraphs With Content',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'paragraph',
          title: 'Paragraph',
          fields: [
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'body', type: 'array', of: [{ type: 'block' }], title: 'Body' },
            {
              name: 'image',
              type: 'image',
              title: 'Paragraph Image',
              fields: [
                { name: 'alt', type: 'string', title: 'Alt text', options: { source: 'title' } }
              ]
            }
          ]
        }
      ]
    },
    {name: 'body', type: 'array', of: [{type: 'string'}], title: 'Content'},
    
    {
      name: 'productsIds',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'product'}]}],
      title: 'Products',
    },
    {
      name: 'recipesIds',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'recipe'}]}],
      title: 'Recipes',
    },
   
  ],
}
