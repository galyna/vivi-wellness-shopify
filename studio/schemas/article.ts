export default {
    name: 'article',
    title: 'Article',
    type: 'document',
    fields: [
      { name: 'title', type: 'string', title: 'Title' },
      { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title' } },
      { name: 'publishedAt', type: 'datetime', title: 'Published at' },
      { name: 'body', type: 'array', of: [{ type: 'block' }], title: 'Content' },
      {
        name: 'mainImage',
        title: 'Главное изображение',
        type: 'image',
        options: {
          hotspot: true // разрешает выбирать фокусную точку на изображении
        },
        fields: [
          {
            name: 'alt',
            type: 'string',
            title: 'Alt текст',
          },
        ],
      },
    ]
  }