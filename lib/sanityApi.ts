import client from './sanity';
export { client };

export async function getArticles(limit?: number) {
  return client.fetch(`*[_type == "article"] | order(_createdAt desc)${limit ? ` [0...${limit}]` : ''}{
    _id,
    title,
    "slug": slug.current,
    intro,
    mainImage {
      asset->{url},
      alt
    },
    category,
    length,
    tone,
    author,
    date,
    productsIds[]->{_id},
    recipesIds[]->{_id},
    paragraphs[] {
      title,
      body,
      image {
        asset->{url},
        alt
      }
    }
  }`);
}

export async function getArticleBySlug(slug: string) {
  return client.fetch(`*[_type == "article" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    intro,
    mainImage {
      asset->{url},
      alt
    },
    category,
    productsIds[]->{_id},
    recipesIds[]->{_id},
    date,
    author,
    paragraphs[] {
      title,
      body,
      image {
        asset->{url},
        alt
      }
    }
  }`, { slug });
}

export async function getRecipes(limit?: number) {
  return client.fetch(`*[_type == "recipe"] | order(_createdAt desc)${limit ? ` [0...${limit}]` : ''}{
    _id,
    title,
    "slug": slug.current,
    intro,
    duration,
    difficulty,
    servings,
    ingredients,
    category,
    time,
    productsIds[]->{_id},
    articlesIds[]->{_id},
    mainImage {
      asset->{url},
      alt
    },
  }`);
}

export async function getRecipeBySlug(slug: string) {
  return client.fetch(`*[_type == "recipe" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    intro,
    duration,
    difficulty,
    servings,
    ingredients,
    category,
    productsIds[]->{_id},
    articlesIds[]->{_id},
    mainImage {
      asset->{url},
      alt
    },
    stepsWithContent[] {
      text,
      image {
        asset->{url},
        alt
      }
    }
  }`, { slug });
}

export async function getProducts(limit?: number) {
  return client.fetch(`*[_type == "product"] | order(_createdAt desc)${limit ? ` [0...${limit}]` : ''}{
    _id,
    title,
    "slug": slug.current,
    mainImage {
      asset->{url},
      alt
    },
    cardImage {
      asset->{url},
      alt
    },
    description,
    category,
    price,
    color,
    size,
    material,
    articlesIds[]->{_id},
    recipesIds[]->{_id}
  }`);
}

export async function getProductBySlug(slug: string) {
  return client.fetch(`*[_type == "product" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    mainImage {
      asset->{url},
      alt
    },
    galleryImages[] {
      asset->{url},
      alt
    },
    description,
    category,
    color,
    size,
    material,
    price,
    articlesIds[]->{_id},
    recipesIds[]->{_id}
  }`, { slug });
}

export async function getTips() {
  return client.fetch(`*[_type == "tip"]{
    _id,
    text,
    icon
  }`);
}

// Универсальный GROQ-запрос для hero блока каталога
export async function getCatalogHeroData(id: string) {
  const query = `*[_type == "hero" && _id == $id][0]{
    title,
    subtitle,
    "image": mainImage.asset->url,
    ctaText,
    ctaUrl
  }`;
  return client.fetch(query, { id });
}

export async function getProductsByIds(ids: string[], limit: number = 2) {
  if (!ids || ids.length === 0) return [];
  return client.fetch(`*[_type == "product" && _id in $ids][0...${limit}] {
    _id,
    title,
    "slug": slug.current,
    mainImage {
      asset->{url},
      alt
    },
    cardImage {
      asset->{url},
      alt
    },
    description,
    category,
    price,
    color,
    size,
    material
  }`, { ids });
}

export async function getArticlesByIds(ids: string[], limit: number = 2) {
  if (!ids || ids.length === 0) return [];
  return client.fetch(`*[_type == "article" && _id in $ids][0...${limit}] {
    _id,
    title,
    "slug": slug.current,
    intro,
    mainImage {
      asset->{url},
      alt
    },
    category,
    author,
    date
  }`, { ids });
}

export async function getRecipesByIds(ids: string[], limit: number = 2) {
  if (!ids || ids.length === 0) return [];
  return client.fetch(`*[_type == "recipe" && _id in $ids][0...${limit}] {
    _id,
    title,
    "slug": slug.current,
    intro,
    mainImage {
      asset->{url},
      alt
    },
    category,
    time,
    difficulty
  }`, { ids });
}


