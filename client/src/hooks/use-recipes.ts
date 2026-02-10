import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";
import type { InsertRecipe, GenerateRecipeRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useRecipes() {
  return useQuery({
    queryKey: [api.recipes.list.path],
    queryFn: async () => {
      const res = await fetch(api.recipes.list.path);
      if (!res.ok) throw new Error("Failed to fetch recipes");
      return api.recipes.list.responses[200].parse(await res.json());
    },
  });
}

export function useGenerateRecipe() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: GenerateRecipeRequest) => {
      const res = await fetch(api.recipes.generate.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        throw new Error("Failed to generate recipe");
      }
      
      return api.recipes.generate.responses[200].parse(await res.json());
    },
    onError: (error) => {
      toast({
        title: "Kitchen Error",
        description: "The chef couldn't come up with a recipe right now. Please try again.",
        variant: "destructive",
      });
    },
  });
}

export function useSaveRecipe() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertRecipe) => {
      const res = await fetch(api.recipes.save.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save recipe");
      return api.recipes.save.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.recipes.list.path] });
      toast({
        title: "Recipe Added to Menu",
        description: "Your culinary masterpiece has been saved.",
      });
    },
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.recipes.delete.path, { id });
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete recipe");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.recipes.list.path] });
      toast({
        title: "Removed from Menu",
        description: "The item has been 86'd.",
      });
    },
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isFavorite }: { id: number; isFavorite: boolean }) => {
      const url = buildUrl(api.recipes.toggleFavorite.path, { id });
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite }),
      });
      if (!res.ok) throw new Error("Failed to update favorite status");
      return api.recipes.toggleFavorite.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.recipes.list.path] });
    },
  });
}
