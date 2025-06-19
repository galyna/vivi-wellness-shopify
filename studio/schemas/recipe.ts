export default {
  name: 'recipe',
  title: 'Recipe',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', title: 'Title' },
    { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title' } },
    { name: 'ingredients', type: 'array', of: [{ type: 'string' }], title: 'Ingredients' },
    { name: 'steps', type: 'array', of: [{ type: 'block' }], title: 'Steps' },
  ]
}
