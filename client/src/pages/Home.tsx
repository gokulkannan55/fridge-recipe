import { motion } from "framer-motion";
import { useRecipes, useDeleteRecipe, useToggleFavorite } from "@/hooks/use-recipes";
import { RecipeGenerator } from "@/components/RecipeGenerator";
import { MenuCard } from "@/components/MenuCard";
import { UtensilsCrossed, Star, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const { data: recipes, isLoading } = useRecipes();
  const deleteRecipe = useDeleteRecipe();
  const toggleFavorite = useToggleFavorite();

  const favorites = recipes?.filter(r => r.isFavorite) || [];
  const otherRecipes = recipes?.filter(r => !r.isFavorite) || [];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <header className="relative bg-primary text-primary-foreground pt-20 pb-24 px-4 overflow-hidden border-b-8 border-secondary shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent"></div>
        
        {/* Decorative flourish */}
        <div className="absolute top-0 left-0 w-full h-4 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,#D4AF37_20px,#D4AF37_40px)] opacity-30"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-3 mb-4 text-secondary uppercase tracking-[0.2em] text-sm font-bold border-y border-secondary/30 py-2 px-6">
              <Star className="w-4 h-4" />
              <span>Est. 2025</span>
              <Star className="w-4 h-4" />
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-4 drop-shadow-md text-secondary">
              The AI Kitchen
            </h1>
            <p className="font-script text-3xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
              Curating exquisite recipes from your pantry's humblest ingredients
            </p>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        {/* Generator Section */}
        <div className="mb-20">
          <RecipeGenerator />
        </div>

        {/* Favorites Section - "Chef's Specials" */}
        {favorites.length > 0 && (
          <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-primary/20 flex-1"></div>
              <h2 className="text-3xl font-display text-primary flex items-center gap-3">
                <ChefHat className="w-8 h-8 text-secondary" />
                Chef's Favorites
              </h2>
              <div className="h-px bg-primary/20 flex-1"></div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((recipe) => (
                <MenuCard
                  key={recipe.id}
                  recipe={recipe}
                  onToggleFavorite={(id, isFav) => toggleFavorite.mutate({ id, isFavorite: isFav })}
                  onDelete={(id) => deleteRecipe.mutate(id)}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Recipe Menu */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-primary/10">
            <h2 className="text-3xl font-display text-primary flex items-center gap-3">
              <UtensilsCrossed className="w-6 h-6 text-primary/60" />
              Recipe Menu
            </h2>
            <div className="text-sm font-sans text-muted-foreground uppercase tracking-widest">
              {isLoading ? "Loading..." : `${recipes?.length || 0} Items`}
            </div>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-primary/5 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : recipes?.length === 0 ? (
            <div className="text-center py-20 bg-white/50 border-2 border-dashed border-primary/10 rounded-lg">
              <p className="text-xl font-display text-primary/60 mb-2">The Menu is Empty</p>
              <p className="text-muted-foreground">Start creating recipes above to fill your menu.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherRecipes.map((recipe) => (
                <MenuCard
                  key={recipe.id}
                  recipe={recipe}
                  onToggleFavorite={(id, isFav) => toggleFavorite.mutate({ id, isFavorite: isFav })}
                  onDelete={(id) => deleteRecipe.mutate(id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="bg-[#F8F5F2] border-t border-primary/10 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="font-display text-2xl text-primary font-bold mb-4">The AI Kitchen</div>
          <div className="flex justify-center gap-8 text-sm font-sans text-muted-foreground uppercase tracking-wider mb-8">
            <span>Breakfast</span>
            <span>Lunch</span>
            <span>Dinner</span>
            <span>Dessert</span>
          </div>
          <p className="font-script text-xl text-primary/60">
            Bon Appétit • Made with AI • {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
