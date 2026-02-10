import { db } from "./db";
import { recipes, type Recipe, type InsertRecipe } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getRecipes(): Promise<Recipe[]>;
  getRecipe(id: number): Promise<Recipe | undefined>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  deleteRecipe(id: number): Promise<void>;
  toggleFavorite(id: number, isFavorite: boolean): Promise<Recipe | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getRecipes(): Promise<Recipe[]> {
    return await db.select().from(recipes).orderBy(desc(recipes.createdAt));
  }

  async getRecipe(id: number): Promise<Recipe | undefined> {
    const [recipe] = await db.select().from(recipes).where(eq(recipes.id, id));
    return recipe;
  }

  async createRecipe(insertRecipe: InsertRecipe): Promise<Recipe> {
    const [recipe] = await db.insert(recipes).values(insertRecipe).returning();
    return recipe;
  }

  async deleteRecipe(id: number): Promise<void> {
    await db.delete(recipes).where(eq(recipes.id, id));
  }

  async toggleFavorite(id: number, isFavorite: boolean): Promise<Recipe | undefined> {
    const [updated] = await db
      .update(recipes)
      .set({ isFavorite })
      .where(eq(recipes.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
