import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

// Initialize OpenAI client using the environment variables from the integration
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Generate Recipe Endpoint
  app.post(api.recipes.generate.path, async (req, res) => {
    try {
      const { ingredients, mealType, dietaryRestrictions } = api.recipes.generate.input.parse(req.body);

      const prompt = `
        Create a recipe using the following ingredients: ${ingredients.join(", ")}.
        ${mealType ? `Meal type: ${mealType}.` : ""}
        ${dietaryRestrictions?.length ? `Dietary restrictions: ${dietaryRestrictions.join(", ")}.` : ""}
        
        Return the recipe in the following JSON format:
        {
          "title": "Recipe Title",
          "ingredients": ["1 cup flour", "2 eggs", ...],
          "instructions": ["Step 1...", "Step 2..."],
          "preparationTime": 30,
          "servings": 4,
          "summary": "A brief description of the dish."
        }
        Do not include markdown formatting or code blocks in the response, just the raw JSON object.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [
          { role: "system", content: "You are a helpful culinary assistant. You generate creative and delicious recipes based on available ingredients. You must output valid JSON only." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("Failed to generate recipe content");
      }

      const recipeData = JSON.parse(content);
      res.json(recipeData);

    } catch (error) {
      console.error("Recipe generation error:", error);
      res.status(500).json({ message: "Failed to generate recipe" });
    }
  });

  // CRUD Routes
  app.get(api.recipes.list.path, async (req, res) => {
    const recipes = await storage.getRecipes();
    res.json(recipes);
  });

  app.post(api.recipes.save.path, async (req, res) => {
    try {
      const input = api.recipes.save.input.parse(req.body);
      const recipe = await storage.createRecipe(input);
      res.status(201).json(recipe);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Failed to save recipe" });
      }
    }
  });

  app.delete(api.recipes.delete.path, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteRecipe(id);
    res.status(204).send();
  });

  app.patch(api.recipes.toggleFavorite.path, async (req, res) => {
    const id = parseInt(req.params.id);
    const { isFavorite } = req.body;
    const updated = await storage.toggleFavorite(id, isFavorite);
    if (!updated) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(updated);
  });

  return httpServer;
}
