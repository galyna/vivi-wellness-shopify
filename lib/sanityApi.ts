import client from './sanity';
export { client };

export async function getArticles() {
  return client.fetch(`*[_type == "article"] | order(_createdAt desc){
    _id,
    title,
    "slug": slug.current,
    intro,
    mainImage {
      asset->{url},
      alt
    },
    cardImage {
      asset->{url},
      alt
    },
    body,
    category,
    productsIds[]->{_id},
    recipesIds[]->{_id}
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
    cardImage {
      asset->{url},
      alt
    },
    body,
    category,
    productsIds[]->{_id},
    recipesIds[]->{_id}
  }`, { slug });
}

export async function getRecipes() {
  return client.fetch(`*[_type == "recipe"] | order(_createdAt desc){
    _id,
    title,
    "slug": slug.current,
    intro,
    duration,
    difficulty,
    servings,
    ingredients,
    steps,
    category,
    productsIds[]->{_id},
    articlesIds[]->{_id},
    mainImage {
      asset->{url},
      alt
    },
    cardImage {
      asset->{url},
      alt
    }
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
    steps,
    category,
    productsIds[]->{_id},
    articlesIds[]->{_id},
    mainImage {
      asset->{url},
      alt
    },
    cardImage {
      asset->{url},
      alt
    }
  }`, { slug });
}

export async function getProducts() {
  return client.fetch(`*[_type == "product"] | order(_createdAt desc){
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
    cardImage {
      asset->{url},
      alt
    },
    description,
    category,
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

