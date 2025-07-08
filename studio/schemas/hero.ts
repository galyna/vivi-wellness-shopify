export default {
    name: 'hero',
    title: 'Hero Section',
    type: 'document',
    fields: [
      { name: 'title', type: 'string', title: 'Hero Title' },
      { name: 'subtitle', type: 'text', title: 'Hero Subtitle' },
      { name: 'ctaText', type: 'string', title: 'Button Text' },
      { name: 'ctaUrl', type: 'string', title: 'Button URL' },
      { name: 'mainImagePrompt', type: 'string', title: 'Image Prompt' },
      {              // ↓ новое поле
        name: 'video',
        type: 'file',
        title: 'Background Video',
        options: { accept: 'video/*' }
      },
      {
        name: 'mainImage',
        type: 'image',
        title: 'Hero Image',
        options: { hotspot: true },
        fields: [{ name: 'alt', type: 'string', title: 'Alt text' }]
      },
      { name: 'background', type: 'image', title: 'Background Image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt text' }] },
    ]
  }
  