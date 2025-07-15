import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types";

interface UseProductsParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export function useProducts(params: UseProductsParams = {}) {
  const {
    search = "",
    category = "",
    page = 1,
    limit = 20
  } = params;



  return useQuery({
    queryKey: ["products", params],
    queryFn: async (): Promise<{ products: Product[]; hasMore: boolean; total: number }> => {
      const queryParams = new URLSearchParams();
      
      if (search) queryParams.set("search", search);
      if (category) queryParams.set("category", category);
      if (page) queryParams.set("page", page.toString());
      if (limit) queryParams.set("limit", limit.toString());

      const response = await fetch(`/api/products?${queryParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

 