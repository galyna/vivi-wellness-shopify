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

  const queryParams = new URLSearchParams();
  
  if (search) queryParams.set("search", search);
  if (categories.length > 0) queryParams.set("categories", categories.join(","));
  if (times.length > 0) queryParams.set("times", times.join(","));
  if (difficulties.length > 0) queryParams.set("difficulties", difficulties.join(","));
  if (sort) queryParams.set("sort", sort);

  return useQuery({
    queryKey: ["recipes", params],
    queryFn: async (): Promise<Recipe[]> => {
      const response = await fetch(`/api/recipes/search?${queryParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    placeholderData: (previousData) => previousData, // Keep showing previous data while fetching new data
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