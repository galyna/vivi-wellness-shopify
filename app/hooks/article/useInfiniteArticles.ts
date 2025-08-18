import { useInfiniteQuery } from "@tanstack/react-query";
import { Article } from "@/types";

interface UseInfiniteArticlesParams {
  search?: string;
  categories?: string[];
  lengths?: string[];
  tones?: string[];
  authors?: string[];
  dateFrom?: string;
  dateTo?: string;
  sort?: "title_asc" | "title_desc";
  limit?: number;
}

interface ArticlesResponse {
  articles: Article[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
    totalPages: number;
  };
  nextPage?: number;
}

export function useInfiniteArticles(params: UseInfiniteArticlesParams = {}) {
  const {
    search = "",
    categories = [],
    lengths = [],
    tones = [],
    authors = [],
    dateFrom = "",
    dateTo = "",
    sort = "title_asc",
    limit = 8
  } = params;

  // Check if any filters are applied
  const hasFilters = Boolean(search) || 
    categories.length > 0 || 
    lengths.length > 0 || 
    tones.length > 0 || 
    authors.length > 0 || 
    Boolean(dateFrom) || 
    Boolean(dateTo);

  return useInfiniteQuery({
    queryKey: hasFilters ? ["infinite-articles", params] : ["infinite-all-articles", sort],
    queryFn: async ({ pageParam = 1 }): Promise<ArticlesResponse> => {
      const queryParams = new URLSearchParams();
      
      if (search) queryParams.set("search", search);
      if (categories.length > 0) queryParams.set("categories", categories.join(","));
      if (lengths.length > 0) queryParams.set("lengths", lengths.join(","));
      if (tones.length > 0) queryParams.set("tones", tones.join(","));
      if (authors.length > 0) queryParams.set("authors", authors.join(","));
      if (dateFrom) queryParams.set("dateFrom", dateFrom);
      if (dateTo) queryParams.set("dateTo", dateTo);
      if (sort) queryParams.set("sort", sort);
      queryParams.set("page", pageParam.toString());
      queryParams.set("limit", limit.toString());

      const response = await fetch(`/api/articles?${queryParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }
      const data = await response.json();
      return {
        articles: data.articles,
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