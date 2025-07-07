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

  // Check if any filters are applied
  const hasFilters = search || 
    categories.length > 0 || 
    lengths.length > 0 || 
    tones.length > 0 || 
    authors.length > 0 || 
    dateFrom || 
    dateTo;

  // Always call useQuery, but with different logic based on filters
  return useQuery({
    queryKey: hasFilters ? ["articles", params] : ["all-articles"],
    queryFn: async (): Promise<Article[]> => {
      if (!hasFilters) {
        // No filters - get all articles
        const response = await fetch("/api/articles");
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        return response.json();
      }

      // Has filters - make filtered request
      const queryParams = new URLSearchParams();
      
      if (search) queryParams.set("search", search);
      if (categories.length > 0) queryParams.set("categories", categories.join(","));
      if (lengths.length > 0) queryParams.set("lengths", lengths.join(","));
      if (tones.length > 0) queryParams.set("tones", tones.join(","));
      if (authors.length > 0) queryParams.set("authors", authors.join(","));
      if (dateFrom) queryParams.set("dateFrom", dateFrom);
      if (dateTo) queryParams.set("dateTo", dateTo);
      if (sort) queryParams.set("sort", sort);

      const response = await fetch(`/api/articles?${queryParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }
      return response.json();
    },
    staleTime: hasFilters ? 5 * 60 * 1000 : 10 * 60 * 1000, // 5 minutes for filtered, 10 for all
    gcTime: hasFilters ? 10 * 60 * 1000 : 20 * 60 * 1000, // 10 minutes for filtered, 20 for all
    placeholderData: hasFilters ? (previousData) => previousData : undefined, // Keep showing previous data while fetching new data only for filtered
  });
}

 