import { useQuery } from "@tanstack/react-query";
import { Recipe } from "@/types";

interface UseRecipesParams {
  search?: string;
  categories?: string[];
  times?: string[];
  difficulties?: string[];
  sort?: "asc" | "desc";
}

export function useRecipes(params: UseRecipesParams = {}) {
  const {
    search = "",
    categories = [],
    times = [],
    difficulties = [],
    sort = "asc"
  } = params;

  // Check if any filters are applied
  const hasFilters = search || 
    categories.length > 0 || 
    times.length > 0 || 
    difficulties.length > 0;

  // Always call useQuery, but with different logic based on filters
  return useQuery({
    queryKey: hasFilters ? ["recipes", params] : ["all-recipes"],
    queryFn: async (): Promise<Recipe[]> => {
      if (!hasFilters) {
        // No filters - get all recipes
        const response = await fetch("/api/recipes/search");
        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }
        return response.json();
      }

      // Has filters - make filtered request
      const queryParams = new URLSearchParams();
      
      if (search) queryParams.set("search", search);
      if (categories.length > 0) queryParams.set("categories", categories.join(","));
      if (times.length > 0) queryParams.set("times", times.join(","));
      if (difficulties.length > 0) queryParams.set("difficulties", difficulties.join(","));
      if (sort) queryParams.set("sort", sort);

      const response = await fetch(`/api/recipes/search?${queryParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }
      return response.json();
    },
    staleTime: hasFilters ? 5 * 60 * 1000 : 10 * 60 * 1000, // 5 minutes for filtered, 10 for all
    gcTime: hasFilters ? 10 * 60 * 1000 : 20 * 60 * 1000, // 10 minutes for filtered, 20 for all
    placeholderData: hasFilters ? (previousData) => previousData : undefined, // Keep showing previous data while fetching new data only for filtered
  });
}

// Hook to get all recipes for filter options
export function useAllRecipes() {
  return useQuery({
    queryKey: ["all-recipes"],
    queryFn: async (): Promise<Recipe[]> => {
      const response = await fetch("/api/recipes/search");
      if (!response.ok) {
        throw new Error("Failed to fetch all recipes");
      }
      return response.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
} 