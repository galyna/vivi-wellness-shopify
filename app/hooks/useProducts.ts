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

  // Check if any filters are applied
  const hasFilters = search || 
    categories.length > 0 || 
    colors.length > 0 || 
    sizes.length > 0 || 
    materials.length > 0 || 
    minPrice || 
    maxPrice;

  // Always call useQuery, but with different logic based on filters
  return useQuery({
    queryKey: hasFilters ? ["products", params] : ["all-products"],
    queryFn: async (): Promise<Product[]> => {
      if (!hasFilters) {
        // No filters - get all products
        const response = await fetch("/api/products/search");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      }

      // Has filters - make filtered request
      const queryParams = new URLSearchParams();
      
      if (search) queryParams.set("search", search);
      if (categories.length > 0) queryParams.set("categories", categories.join(","));
      if (colors.length > 0) queryParams.set("colors", colors.join(","));
      if (sizes.length > 0) queryParams.set("sizes", sizes.join(","));
      if (materials.length > 0) queryParams.set("materials", materials.join(","));
      if (minPrice) queryParams.set("minPrice", minPrice);
      if (maxPrice) queryParams.set("maxPrice", maxPrice);
      if (sort) queryParams.set("sort", sort);

      const response = await fetch(`/api/products/search?${queryParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    },
    staleTime: hasFilters ? 5 * 60 * 1000 : 10 * 60 * 1000, // 5 minutes for filtered, 10 for all
    gcTime: hasFilters ? 10 * 60 * 1000 : 20 * 60 * 1000, // 10 minutes for filtered, 20 for all
    placeholderData: hasFilters ? (previousData) => previousData : undefined, // Keep showing previous data while fetching new data only for filtered
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