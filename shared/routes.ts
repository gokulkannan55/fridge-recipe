import { z } from 'zod';
import { insertRecipeSchema, recipes, generateRecipeSchema } from './schema';

export const api = {
  recipes: {
    generate: {
      method: 'POST' as const,
      path: '/api/recipes/generate' as const,
      input: generateRecipeSchema,
      responses: {
        200: z.object({
          title: z.string(),
          ingredients: z.array(z.string()),
          instructions: z.array(z.string()),
          preparationTime: z.number(),
          servings: z.number(),
          summary: z.string(),
        }),
        500: z.object({ message: z.string() }),
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/recipes' as const,
      responses: {
        200: z.array(z.custom<typeof recipes.$inferSelect>()),
      },
    },
    save: {
      method: 'POST' as const,
      path: '/api/recipes' as const,
      input: insertRecipeSchema,
      responses: {
        201: z.custom<typeof recipes.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/recipes/:id' as const,
      responses: {
        204: z.void(),
        404: z.object({ message: z.string() }),
      },
    },
    toggleFavorite: {
      method: 'PATCH' as const,
      path: '/api/recipes/:id/favorite' as const,
      input: z.object({ isFavorite: z.boolean() }),
      responses: {
        200: z.custom<typeof recipes.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
