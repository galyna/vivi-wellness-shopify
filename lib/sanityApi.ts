import client from './sanity';

export async function getArticles() {
  return client.fetch(`*[_type == "article"] | order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    body
  }`);
}

export async function getArticleBySlug(slug: string) {
  return client.fetch(`*[_type == "article" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    body
  }`, { slug });
}

export async function getRecipes() {
  return client.fetch(`*[_type == "recipe"]{
    _id,
    title,
    "slug": slug.current,
    ingredients,
    steps
  }`);
}

export async function getRecipeBySlug(slug: string) {
  return client.fetch(`*[_type == "recipe" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    ingredients,
    steps
  }`, { slug });
}

export async function getTips() {
  return client.fetch(`*[_type == "tip"]{
    _id,
    text,
    icon
  }`);
} 