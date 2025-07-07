import { useInfiniteQuery } from "@tanstack/react-query";
import { Product } from "@/types";

interface UseInfiniteProductsParams {
  search?: string;
  categories?: string[];
  colors?: string[];
  sizes?: string[];
  materials?: string[];
  minPrice?: string;
  maxPrice?: string;
  sort?: "asc" | "desc";
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
    categories = [],
    colors = [],
    sizes = [],
    materials = [],
    minPrice = "",
    maxPrice = "",
    sort = "asc",
    limit = 8
  } = params;

  // Check if any filters are applied
  const hasFilters = Boolean(search) || 
    categories.length > 0 || 
    colors.length > 0 || 
    sizes.length > 0 || 
    materials.length > 0 || 
    Boolean(minPrice) || 
    Boolean(maxPrice);

  return useInfiniteQuery({
    queryKey: hasFilters ? ["infinite-products", params] : ["infinite-all-products", sort],
    queryFn: async ({ pageParam = 1 }): Promise<ProductsResponse> => {
      const queryParams = new URLSearchParams();
      
      if (search) queryParams.set("search", search);
      if (categories.length > 0) queryParams.set("categories", categories.join(","));
      if (colors.length > 0) queryParams.set("colors", colors.join(","));
      if (sizes.length > 0) queryParams.set("sizes", sizes.join(","));
      if (materials.length > 0) queryParams.set("materials", materials.join(","));
      if (minPrice) queryParams.set("minPrice", minPrice);
      if (maxPrice) queryParams.set("maxPrice", maxPrice);
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
        pagination: data.pagination,
        nextPage: data.pagination.hasMore ? pageParam + 1 : undefined
      };
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage;
    },
    initialPageParam: 1,
    enabled: true, // Всегда включаем запрос
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
} 