import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types";

interface UseProductsParams {
  search?: string;
  categories?: string[];
  colors?: string[];
  sizes?: string[];
  materials?: string[];
  minPrice?: string;
  maxPrice?: string;
  sort?: "asc" | "desc";
}

export function useProducts(params: UseProductsParams = {}) {
  const {
    search = "",
    categories = [],
    colors = [],
    sizes = [],
    materials = [],
    minPrice = "",
    maxPrice = "",
    sort = "asc"
  } = params;

  const queryParams = new URLSearchParams();
  
  if (search) queryParams.set("search", search);
  if (categories.length > 0) queryParams.set("categories", categories.join(","));
  if (colors.length > 0) queryParams.set("colors", colors.join(","));
  if (sizes.length > 0) queryParams.set("sizes", sizes.join(","));
  if (materials.length > 0) queryParams.set("materials", materials.join(","));
  if (minPrice) queryParams.set("minPrice", minPrice);
  if (maxPrice) queryParams.set("maxPrice", maxPrice);
  if (sort) queryParams.set("sort", sort);

  return useQuery({
    queryKey: ["products", params],
    queryFn: async (): Promise<Product[]> => {
      const response = await fetch(`/api/products/search?${queryParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    placeholderData: (previousData) => previousData, // Keep showing previous data while fetching new data
  });
}

// Hook to get all products for filter options
export function useAllProducts() {
  return useQuery({
    queryKey: ["all-products"],
    queryFn: async (): Promise<Product[]> => {
      const response = await fetch("/api/products/search");
      if (!response.ok) {
        throw new Error("Failed to fetch all products");
      }
      return response.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
} 