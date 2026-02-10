import { storage } from "./storage";

async function seed() {
  console.log("Seeding database...");

  const existing = await storage.getRecipes();
  if (existing.length > 0) {
    console.log("Database already seeded.");
    return;
  }

  await storage.createRecipe({
    title: "Classic Beef Wellington",
    ingredients: [
      "1.5kg beef fillet",
      "500g puff pastry",
      "250g mushrooms, finely chopped",
      "12 slices prosciutto",
      "2 egg yolks",
      "Dijon mustard"
    ],
    instructions: [
      "Sear the beef fillet in a hot pan.",
      "Brush with mustard.",
      "Cook mushrooms until dry (duxelles).",
      "Wrap beef in prosciutto and mushroom mixture.",
      "Wrap in puff pastry.",
      "Brush with egg wash.",
      "Bake at 200°C for 30 minutes."
    ],
    preparationTime: 60,
    servings: 6,
    isFavorite: true
  });

  await storage.createRecipe({
    title: "Waldorf Salad",
    ingredients: [
      "2 apples, chopped",
      "1 cup celery, chopped",
      "1/2 cup walnuts",
      "1/2 cup grapes",
      "1/2 cup mayonnaise",
      "Lettuce leaves"
    ],
    instructions: [
      "Combine apples, celery, walnuts, and grapes.",
      "Fold in mayonnaise.",
      "Serve on a bed of lettuce."
    ],
    preparationTime: 15,
    servings: 4,
    isFavorite: false
  });

  await storage.createRecipe({
    title: "Baked Alaska",
    ingredients: [
      "Sponge cake base",
      "1L vanilla ice cream",
      "4 egg whites",
      "200g sugar"
    ],
    instructions: [
      "Place ice cream on sponge cake.",
      "Freeze until solid.",
      "Whip egg whites and sugar to stiff peaks (meringue).",
      "Cover ice cream completely with meringue.",
      "Bake at 220°C for 5 minutes until browned."
    ],
    preparationTime: 45,
    servings: 8,
    isFavorite: true
  });

  console.log("Seeding complete!");
}

seed().catch(console.error);
