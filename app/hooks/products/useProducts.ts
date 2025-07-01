import { useQuery } from "@tanstack/react-query";
import client from "@/lib/sanity";
import { Product } from "@/types";

export function useProducts(limit: number = 100) {
  return useQuery<Product[]>({
    queryKey: ["products", limit],
    queryFn: async () => {
      const query = `*[_type == "product"][0...${limit}]{_id, title, description, price, category, image, cardImage, mainImage, slug}`;
      return client.fetch<Product[]>(query);
    },
  });
}
