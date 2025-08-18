import { useInfiniteQuery } from "@tanstack/react-query";
import { Recipe } from "@/types";

interface UseInfiniteRecipesParams {
  search?: string;
  categories?: string[];
  times?: string[];
  difficulties?: string[];
  sort?: "title_asc" | "title_desc";
  limit?: number;
}

interface RecipesResponse {
  recipes: Recipe[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
    totalPages: number;
  };
  nextPage?: number;
}

export function useInfiniteRecipes(params: UseInfiniteRecipesParams = {}) {
  const {
    search = "",
    categories = [],
    times = [],
    difficulties = [],
    sort = "title_asc",
    limit = 8
  } = params;

  // Check if any filters are applied
  const hasFilters = Boolean(search) || 
    categories.length > 0 || 
    times.length > 0 || 
    difficulties.length > 0;

  return useInfiniteQuery({
    queryKey: hasFilters ? ["infinite-recipes", params] : ["infinite-all-recipes", sort],
    queryFn: async ({ pageParam = 1 }): Promise<RecipesResponse> => {
      const queryParams = new URLSearchParams();
      
      if (search) queryParams.set("search", search);
      if (categories.length > 0) queryParams.set("categories", categories.join(","));
      if (times.length > 0) queryParams.set("times", times.join(","));
      if (difficulties.length > 0) queryParams.set("difficulties", difficulties.join(","));
      if (sort) queryParams.set("sort", sort);
      queryParams.set("page", pageParam.toString());
      queryParams.set("limit", limit.toString());

      const response = await fetch(`/api/recipes?${queryParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }
      const data = await response.json();
      return {
        recipes: data.recipes,
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