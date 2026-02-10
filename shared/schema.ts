import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  ingredients: jsonb("ingredients").notNull().$type<string[]>(),
  instructions: jsonb("instructions").notNull().$type<string[]>(),
  preparationTime: integer("preparation_time").notNull(),
  servings: integer("servings").notNull(),
  isFavorite: boolean("is_favorite").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRecipeSchema = createInsertSchema(recipes).omit({ 
  id: true, 
  createdAt: true,
  isFavorite: true 
});

export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;

export const generateRecipeSchema = z.object({
  ingredients: z.array(z.string()).min(1, "At least one ingredient is required"),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack", "dessert"]).optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
});

export type GenerateRecipeRequest = z.infer<typeof generateRecipeSchema>;
