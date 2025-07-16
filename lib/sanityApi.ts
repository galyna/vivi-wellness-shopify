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


// Универсальный GROQ-запрос для hero блока каталога
export async function getCatalogHeroData(id: string) {
  const query = `*[_type == "hero" && _id == $id][0]{
    title,
    subtitle,
    "image": mainImage.asset->url,
    "video": video.asset->url,
    ctaText,
    ctaUrl
  }`;
  return client.fetch(query, { id });
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

export async function getArticlesBySlugs(slugs: string[]) {
  if (!slugs || slugs.length === 0) return [];
  return client.fetch(`*[_type == "article" && slug.current in $slugs] {
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
  }`, { slugs });
}

export async function getRecipesBySlugs(slugs: string[]) {
  if (!slugs || slugs.length === 0) return [];
  return client.fetch(`*[_type == "recipe" && slug.current in $slugs] {
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
  }`, { slugs });
}


