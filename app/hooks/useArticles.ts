import { useQuery } from "@tanstack/react-query";
import { Article } from "@/types";

interface UseArticlesParams {
  search?: string;
  categories?: string[];
  lengths?: string[];
  tones?: string[];
  authors?: string[];
  dateFrom?: string;
  dateTo?: string;
  sort?: "asc" | "desc";
}

export function useArticles(params: UseArticlesParams = {}) {
  const {
    search = "",
    categories = [],
    lengths = [],
    tones = [],
    authors = [],
    dateFrom = "",
    dateTo = "",
    sort = "asc"
  } = params;

  const queryParams = new URLSearchParams();
  
  if (search) queryParams.set("search", search);
  if (categories.length > 0) queryParams.set("categories", categories.join(","));
  if (lengths.length > 0) queryParams.set("lengths", lengths.join(","));
  if (tones.length > 0) queryParams.set("tones", tones.join(","));
  if (authors.length > 0) queryParams.set("authors", authors.join(","));
  if (dateFrom) queryParams.set("dateFrom", dateFrom);
  if (dateTo) queryParams.set("dateTo", dateTo);
  if (sort) queryParams.set("sort", sort);

  return useQuery({
    queryKey: ["articles", params],
    queryFn: async (): Promise<Article[]> => {
      const response = await fetch(`/api/articles/search?${queryParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    placeholderData: (previousData) => previousData, // Keep showing previous data while fetching new data
  });
}

// Hook to get all articles for filter options
export function useAllArticles() {
  return useQuery({
    queryKey: ["all-articles"],
    queryFn: async (): Promise<Article[]> => {
      const response = await fetch("/api/articles/search");
      if (!response.ok) {
        throw new Error("Failed to fetch all articles");
      }
      return response.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
} 