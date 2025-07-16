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
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
    totalPages: number;
  };
  nextPage?: number;
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
    queryFn: async ({ pageParam = 1 }): Promise<ProductsResponse> => {
      const queryParams = new URLSearchParams();
      
      if (search) queryParams.set("search", search);
      if (category) queryParams.set("category", category);
      if (sort) queryParams.set("sort", sort);
      queryParams.set("page", pageParam.toString());
      queryParams.set("limit", limit.toString());

      const response = await fetch(`/api/products?${queryParams}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      
      return {
        products: data.products,
        pagination: {
          page: pageParam,
          limit,
          total: data.total,
          hasMore: data.hasMore,
          totalPages: Math.ceil(data.total / limit)
        },
        nextPage: data.hasMore ? pageParam + 1 : undefined
      };
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage;
    },
    initialPageParam: 1,
    enabled: true,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false, // Убираем лишние запросы при фокусе
  });
} 