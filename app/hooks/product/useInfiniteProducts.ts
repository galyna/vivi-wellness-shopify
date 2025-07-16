import { useInfiniteQuery } from "@tanstack/react-query";
import { Product } from "@/types";

interface UseInfiniteProductsParams {
  search?: string;
  category?: string;
  sort?: string;
  limit?: number;
}

interface ProductsResponse {
  products: Product[];
  hasMore: boolean;
  nextCursor?: string;
  total: number;
}

export function useInfiniteProducts(params: UseInfiniteProductsParams = {}) {
  const {
    search = "",
    category = "",
    sort = "asc",
    limit = 8
  } = params;

  return useInfiniteQuery({
    queryKey: ["infinite-products", params],
    queryFn: async ({ pageParam }: { pageParam: string | undefined }): Promise<ProductsResponse> => {
      const queryParams = new URLSearchParams();
      
      if (search) queryParams.set("search", search);
      if (category) queryParams.set("category", category);
      if (sort) queryParams.set("sort", sort);
      if (pageParam) queryParams.set("after", pageParam);
      queryParams.set("limit", limit.toString());

      const response = await fetch(`/api/products?${queryParams}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      
      return {
        products: data.products,
        hasMore: data.hasMore,
        nextCursor: data.nextCursor,
        total: data.total
      };
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor;
    },
    initialPageParam: undefined as string | undefined,
    enabled: true,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
} 