import { useQuery } from "@tanstack/react-query";

interface FilterData {
  categories: string[];
  lengths?: string[];
  tones?: string[];
  authors?: string[];
  colors?: string[];
  sizes?: string[];
  materials?: string[];
  times?: string[];
  difficulties?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
}

export function useFilters(type: "articles" | "products" | "recipes") {
  return useQuery({
    queryKey: ["filters", type],
    queryFn: async (): Promise<FilterData> => {
      const response = await fetch(`/api/filters?type=${type}`);
      if (!response.ok) {
        throw new Error("Failed to fetch filters");
      }
      return response.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
} 